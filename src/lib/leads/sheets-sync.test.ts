import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { sendLeadToSheets, type SheetLeadPayload } from "./sheets-sync";

const NOW = new Date("2026-10-01T12:00:00.000Z");
const SECRET = "synthetic-nora-relay-test-secret-123456789";
const ENDPOINT = "https://script.google.com/macros/s/syntheticDeployment/exec";
const fixture = (): SheetLeadPayload => ({ leadId: "00000000-0000-4000-8000-000000000001", createdAt: "2026-10-01T11:00:00.000Z", updatedAt: "2026-10-01T11:30:00.000Z", name: "Contato sintético", whatsapp: "+5511999999999", locale: "pt", sourcePath: "/pt/contato", intent: "assistant_project", summary: "Projeto de assistente para atendimento.", goal: "Atender clientes", situation: "Equipe pequena", desiredSolution: "Assistente no site", constraints: "Prazo a confirmar", openQuestions: "Volume de contatos", nextStep: "Conversar com Jean", stage: "contact_requested", memoryEnabled: true });
const receipt = (lead = fixture(), overrides: Record<string, unknown> = {}) => Response.json({ ok: true, leadId: lead.leadId, updatedAt: lead.updatedAt, row: 5, ...overrides });

async function setup() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "nora-sheets-synthetic-"));
  const secretFile = path.join(dir, "relay.key");
  await writeFile(secretFile, SECRET + "\n", { mode: 0o600 });
  const env: NodeJS.ProcessEnv = { NODE_ENV:"test", PORTFOLIO_LEADS_SHEETS_WEBHOOK_URL: ENDPOINT, PORTFOLIO_LEADS_SHEETS_SECRET_FILE: secretFile };
  const cleanup = async () => {
    const relative = path.relative(path.resolve(os.tmpdir()), path.resolve(dir));
    assert.ok(relative && relative !== ".." && !relative.startsWith(".." + path.sep) && !path.isAbsolute(relative));
    await rm(dir, { recursive: true, force: true });
  };
  return { dir, env, secretFile, cleanup };
}

test("relay signs the exact payload and accepts only a matching receipt", async () => {
  const { env, cleanup } = await setup();
  try {
    const lead = fixture();
    const fetcher = (async (url, options) => {
      assert.equal(url, ENDPOINT);
      assert.equal(options?.method, "POST");
      assert.equal(options?.redirect, "manual");
      assert.equal(options?.credentials, "omit");
      const envelope = JSON.parse(String(options?.body));
      assert.deepEqual(JSON.parse(envelope.payload), lead);
      assert.equal(envelope.timestamp, NOW.toISOString());
      assert.equal(envelope.signature, createHmac("sha256", SECRET).update(envelope.timestamp + "\n" + envelope.payload).digest("hex"));
      assert.equal(JSON.stringify(envelope).includes(SECRET), false);
      return receipt(lead);
    }) as typeof fetch;
    assert.deepEqual(await sendLeadToSheets(lead, { env, now: NOW, fetcher }), { outcome: "synced", leadId: lead.leadId, row: 5 });
    assert.deepEqual(await sendLeadToSheets({ ...lead, whatsapp: "" }, { env, now: NOW, fetcher: (async () => receipt(lead)) as typeof fetch }), { outcome: "synced", leadId: lead.leadId, row: 5 });
  } finally { await cleanup(); }
});

test("ContentService redirects use GET with no payload, signature or headers", async () => {
  const { env, cleanup } = await setup();
  try {
    let calls = 0;
    const destination = "https://script.googleusercontent.com/macros/echo?user_content_key=synthetic";
    const fetcher = (async (url, options) => {
      if (++calls === 1) return new Response(null, { status: 302, headers: { location: destination } });
      assert.equal(url, destination);
      assert.equal(options?.method, "GET");
      assert.equal(options?.body, undefined);
      assert.equal(options?.headers, undefined);
      assert.equal(options?.redirect, "manual");
      assert.equal(options?.referrerPolicy, "no-referrer");
      return receipt();
    }) as typeof fetch;
    assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher })).outcome, "synced");
    assert.equal(calls, 2);
  } finally { await cleanup(); }
});

test("configuration is absent or fails closed before any HTTP request", async () => {
  const { env, secretFile, cleanup } = await setup();
  try {
    let calls = 0;
    const fetcher = (async () => { calls++; return receipt(); }) as typeof fetch;
    assert.equal((await sendLeadToSheets(fixture(), { env: {NODE_ENV:"test"}, now: NOW, fetcher })).outcome, "unconfigured");
    for (const url of ["http://script.google.com/macros/s/a/exec", "https://script.google.com.evil.example/macros/s/a/exec", ENDPOINT + "?key=x", "https://user@script.google.com/macros/s/a/exec", ENDPOINT.replace("/exec", "/dev")]) {
      assert.equal((await sendLeadToSheets(fixture(), { env: { ...env, PORTFOLIO_LEADS_SHEETS_WEBHOOK_URL: url }, now: NOW, fetcher })).outcome, "retry");
    }
    for (const file of ["relative.key", fileURLToPath(import.meta.url), path.join(path.dirname(secretFile), "missing.key")]) {
      assert.equal((await sendLeadToSheets(fixture(), { env: { ...env, PORTFOLIO_LEADS_SHEETS_SECRET_FILE: file }, now: NOW, fetcher })).outcome, "retry");
    }
    for (const secret of ["short", "x".repeat(4097), "x".repeat(32) + "\u0000"]) {
      await writeFile(secretFile, secret);
      assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher })).outcome, "retry");
    }
    assert.equal(calls, 0);
  } finally { await cleanup(); }
});

test("Unix secrets must be owned and have mode 600", { skip: process.platform === "win32" }, async () => {
  const { env, secretFile, cleanup } = await setup();
  try {
    await chmod(secretFile, 0o644);
    let calls = 0;
    assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher: (async () => { calls++; return receipt(); }) as typeof fetch })).outcome, "retry");
    assert.equal(calls, 0);
  } finally { await cleanup(); }
});

test("foreign redirects and redirect loops never forward the POST", async () => {
  const { env, cleanup } = await setup();
  try {
    for (const location of ["https://evil.example/", "https://script.googleusercontent.com.evil.example/", "https://user@script.googleusercontent.com/", "http://script.googleusercontent.com/", "/relative", "https://script.googleusercontent.com:8443/"]) {
      let calls = 0;
      const fetcher = (async () => { calls++; return new Response(null, { status: 307, headers: { location } }); }) as typeof fetch;
      assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher })).outcome, "retry");
      assert.equal(calls, 1);
    }
    let calls = 0;
    const fetcher = (async (_url, options) => {
      calls++;
      if (calls > 1) { assert.equal(options?.method, "GET"); assert.equal(options?.body, undefined); assert.equal(options?.headers, undefined); }
      return new Response(null, { status: 302, headers: { location: "https://script.googleusercontent.com/loop" } });
    }) as typeof fetch;
    assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher })).outcome, "retry");
    assert.equal(calls, 3);
  } finally { await cleanup(); }
});

test("malformed, oversized, older and mismatched receipts remain retryable", async () => {
  const { env, cleanup } = await setup();
  try {
    const replies = [receipt(fixture(), { ok: false }), receipt(fixture(), { leadId: "other" }), receipt(fixture(), { updatedAt: "2026-10-01T11:29:00.000Z" }), receipt(fixture(), { updatedAt: "2026-02-30T12:00:00.000Z" }), receipt(fixture(), { row: 4 }), receipt(fixture(), { row: 10005 }), receipt(fixture(), { row: "5" }), receipt(fixture(), { contacts: [] }), new Response("not-json", { headers: { "content-type": "application/json" } }), new Response("x".repeat(32769), { headers: { "content-type": "application/json" } }), new Response("{}", { status: 503, headers: { "content-type": "application/json" } }), new Response("{}", { headers: { "content-type": "text/html" } })];
    for (const reply of replies) assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher: (async () => reply) as typeof fetch })).outcome, "retry");
    assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher: (async () => receipt(fixture(), { updatedAt: "2026-10-01T11:31:00.000Z", row: 10004 })) as typeof fetch })).outcome, "synced");
  } finally { await cleanup(); }
});

test("payload validation rejects unknown fields, invalid contacts, bounds and dates", async () => {
  const { env, cleanup } = await setup();
  try {
    let calls = 0;
    const fetcher = (async () => { calls++; return receipt(); }) as typeof fetch;
    for (const override of [{ unknown: true }, { whatsapp: "5511999999999" }, { summary: "x".repeat(1501) }, { goal: "x".repeat(501) }, { name: "\tAda" }, { summary: "bad\rsummary" }, { memoryEnabled: "true" }, { sourcePath: "/pt?key=x" }, { updatedAt: "2026-02-30T12:00:00.000Z" }, { updatedAt: "2026-10-01T10:00:00.000Z" }, { updatedAt: "2026-10-01T12:06:00.000Z" }]) {
      assert.equal((await sendLeadToSheets({ ...fixture(), ...override } as SheetLeadPayload, { env, now: NOW, fetcher })).outcome, "retry");
    }
    assert.equal(calls, 0);
  } finally { await cleanup(); }
});

test("background deadline resolves even if a fetcher ignores abort", async () => {
  const { env, cleanup } = await setup();
  try {
    let signal: AbortSignal | undefined;
    const started = Date.now();
    const fetcher = ((_url, options) => { signal = options?.signal as AbortSignal; return new Promise<Response>(() => undefined); }) as typeof fetch;
    assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher })).outcome, "retry");
    assert.equal(signal?.aborted, true);
    assert.ok(Date.now() - started < 13500);
  } finally { await cleanup(); }
});

test("a delayed Apps Script receipt still confirms the write", async () => {
  const { env, cleanup } = await setup();
  try {
    const fetcher = (async () => {
      await new Promise(resolve => setTimeout(resolve, 5500));
      return receipt();
    }) as typeof fetch;
    assert.equal((await sendLeadToSheets(fixture(), { env, now: NOW, fetcher })).outcome, "synced");
  } finally { await cleanup(); }
});

type ScriptOutput = { value: string; setMimeType: (mime: string) => ScriptOutput };
type ScriptApi = { doPost: (event: unknown) => ScriptOutput; doGet: () => ScriptOutput; NORA_HEADERS: string[] };
async function scriptHarness() {
  const source = await readFile(new URL("../../../integrations/nora-sheets/Code.gs", import.meta.url), "utf8");
  const rows = new Map<number, unknown[]>();
  const writes: Array<{ row: number; column: number; count: number }> = [];
  const formats = new Map<string, string>();
  const resizedRows: number[] = [];
  let maxRows = 1000, opens = 0, released = 0, locked = true, failUpdate = false;
  const range = (row: number, column: number, count = 1, columns = 1) => ({
    getValues: () => Array.from({ length: count }, (_, i) => Array.from({ length: columns }, (_, j) => rows.get(row + i)?.[column + j - 1] ?? "")),
    setValues: (values: unknown[][]) => {
      if (failUpdate && row >= 5 && column === 14) { failUpdate = false; throw new Error("synthetic_write_failure"); }
      writes.push({ row, column, count: columns });
      values.forEach((valuesRow, i) => { const current = rows.get(row + i) ?? Array(18).fill(""); valuesRow.forEach((value, j) => { current[column + j - 1] = value; }); rows.set(row + i, current); });
    },
    setValue(value: unknown) { this.setValues([[value]]); },
    setNumberFormat: (format: string) => { formats.set(`${row}:${column}`, format); },
    setWrap: () => undefined,
  });
  const sheet = { getMaxColumns: () => 18, getMaxRows: () => maxRows, getLastRow: () => Math.max(0, ...[...rows.entries()].filter(([, values]) => values.some(value => value !== "")).map(([row]) => row)), getRange: range, insertRowsAfter: (_after: number, count: number) => { maxRows += count; }, autoResizeRows: (row: number, count: number) => { assert.equal(count, 1); resizedRows.push(row); } };
  const spreadsheetId = "syntheticSpreadsheetIdentifier";
  const context = vm.createContext({
    Date: class extends Date { static now() { return NOW.getTime(); } },
    ContentService: { MimeType: { JSON: "application/json" }, createTextOutput: (value: string): ScriptOutput => ({ value, setMimeType() { return this; } }) },
    Utilities: { Charset: { UTF_8: "UTF-8" }, newBlob: (value: string) => ({ getBytes: () => [...Buffer.from(value)] }), computeHmacSha256Signature: (value: string, secret: string) => [...createHmac("sha256", secret).update(value).digest()].map(value => value > 127 ? value - 256 : value) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => key === "NORA_SECRET" ? SECRET : key === "NORA_SPREADSHEET_ID" ? spreadsheetId : null }) },
    LockService: { getScriptLock: () => ({ tryLock: (timeout: number) => { assert.equal(timeout, 3000); return locked; }, releaseLock: () => { released++; } }) },
    SpreadsheetApp: { openById: (id: string) => { assert.equal(id, spreadsheetId); opens++; return { getSheetByName: (name: string) => { assert.equal(name, "Contatos"); return sheet; } }; }, flush: () => undefined },
  });
  vm.runInContext(source, context, { filename: "Code.gs" });
  const api = context as unknown as ScriptApi;
  const post = (lead = fixture(), changeEnvelope: (value: Record<string, string>) => void = () => undefined) => {
    const payload = JSON.stringify(lead), timestamp = NOW.toISOString();
    const envelope: Record<string, string> = { timestamp, payload, signature: createHmac("sha256", SECRET).update(timestamp + "\n" + payload).digest("hex") };
    changeEnvelope(envelope);
    const body = JSON.stringify(envelope);
    return JSON.parse(api.doPost({ contentLength: Buffer.byteLength(body), postData: { type: "application/json", contents: body } }).value) as Record<string, unknown>;
  };
  return { api, rows, writes, formats, resizedRows, post, opens: () => opens, released: () => released, setLocked: (value: boolean) => { locked = value; }, failNextUpdate: () => { failUpdate = true; } };
}

test("Apps Script validates signatures before opening the fixed Sheet and exposes no contacts", async () => {
  const h = await scriptHarness();
  const rejection = { ok: false, error: "request_rejected" };
  for (const mutate of [(value: Record<string, string>) => { value.signature = "0".repeat(64); }, (value: Record<string, string>) => { value.timestamp = "2026-10-01T11:54:59.000Z"; }, (value: Record<string, string>) => { value.spreadsheetId = "attacker"; }, (value: Record<string, string>) => { value.payload = "{}"; }]) assert.deepEqual(h.post(fixture(), mutate), rejection);
  assert.equal(h.opens(), 0);
  assert.deepEqual(JSON.parse(h.api.doGet().value), rejection);
  assert.deepEqual(h.post(), { ok: true, leadId: fixture().leadId, updatedAt: fixture().updatedAt, row: 5 });
  assert.equal(h.opens(), 1);
  assert.equal(h.released(), 1);
  assert.deepEqual([...h.rows.get(4)!], [...h.api.NORA_HEADERS]);
  assert.equal(h.rows.get(5)![11], "Novo");
  assert.equal(h.rows.get(5)![12], "");
  assert.equal(h.formats.get("5:2"), "@");
  assert.equal(h.formats.get("5:15"), "@");
  assert.deepEqual(h.resizedRows, [5]);
});

test("Apps Script idempotency preserves L/M and protects newer revisions", async () => {
  const h = await scriptHarness();
  const lead = fixture();
  h.post(lead);
  h.rows.get(5)![11] = "Em atendimento";
  h.rows.get(5)![12] = "=A1";
  const newer = { ...lead, updatedAt: "2026-10-01T11:40:00.000Z", summary: "Escopo atualizado pelo contato." };
  assert.deepEqual(h.post(newer), { ok: true, leadId: lead.leadId, updatedAt: newer.updatedAt, row: 5 });
  assert.equal(h.rows.get(5)![11], "Em atendimento");
  assert.equal(h.rows.get(5)![12], "=A1");
  const writes = h.writes.length;
  assert.deepEqual(h.post(lead), { ok: true, leadId: lead.leadId, updatedAt: newer.updatedAt, row: 5 });
  assert.equal(h.writes.length, writes);
  assert.equal(h.rows.get(5)![5], newer.summary);
  assert.equal([...h.rows.keys()].filter(row => row >= 5).length, 1);
});

test("Apps Script escapes formula injection and records dates as dates", async () => {
  const h = await scriptHarness();
  const lead = { ...fixture(), name: "=IMPORTXML(1)", summary: "\n+SUM(1)", constraints: "-1", openQuestions: "@SUM(1)", nextStep: "=1+1" };
  assert.equal(h.post(lead).ok, true);
  const row = h.rows.get(5)!;
  for (const index of [0, 1, 5, 7, 8, 9]) assert.equal(String(row[index]).startsWith("'"), true);
  assert.equal((row[2] as Date).toISOString(), lead.createdAt);
  assert.equal((row[3] as Date).toISOString(), lead.updatedAt);
  assert.equal(row[15], "Sim");
  assert.equal(row[16], "Sim");
});

test("Apps Script rejects invalid payloads, lock contention and header changes", async () => {
  const h = await scriptHarness();
  for (const override of [{ unknown: true }, { goal: "x".repeat(501) }, { summary: "x".repeat(1501) }, { whatsapp: "invalid" }, { memoryEnabled: "true" }, { sourcePath: "/pt?x=y" }, { updatedAt: "2026-02-30T12:00:00.000Z" }]) assert.equal(h.post({ ...fixture(), ...override } as SheetLeadPayload).ok, false);
  assert.equal(h.opens(), 0);
  h.setLocked(false);
  assert.equal(h.post().ok, false);
  assert.equal(h.opens(), 0);
  h.setLocked(true);
  assert.equal(h.post().ok, true);
  h.rows.get(4)![0] = "Cabeçalho inesperado";
  assert.equal(h.post({ ...fixture(), updatedAt: "2026-10-01T11:40:00.000Z" }).ok, false);
  assert.equal(h.released(), 2);
});

test("Apps Script commits updatedAt last so a partial update can safely retry", async () => {
  const h = await scriptHarness();
  const lead = fixture();
  h.post(lead);
  const newer = { ...lead, updatedAt: "2026-10-01T11:40:00.000Z", constraints: "Novo prazo" };
  h.failNextUpdate();
  assert.equal(h.post(newer).ok, false);
  assert.equal((h.rows.get(5)![3] as Date).toISOString(), lead.updatedAt);
  assert.equal(h.post(newer).ok, true);
  assert.equal((h.rows.get(5)![3] as Date).toISOString(), newer.updatedAt);
  assert.equal(h.rows.get(5)![7], newer.constraints);
});

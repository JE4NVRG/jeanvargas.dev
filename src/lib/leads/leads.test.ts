import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { dispatchOutbox, LeadError, processLeadRequest, prunePortfolioLeads, submitLead, validateLead } from "./leads";
import { processVisitorRequest } from "../concierge/visitor";

const fixture = (requestId = "00000000-0000-4000-8000-000000000001") => ({ requestId, locale: "pt", name: "Ada Example", contactType: "email", contact: "ada@example.com", summary: "Preciso de um site para apresentar meu trabalho.", sourcePath: "/pt/contato", consent: true });
async function setup() { const dir = await mkdtemp(path.join(os.tmpdir(), "portfolio-leads-")); const env: NodeJS.ProcessEnv = { NODE_ENV: "test", PORTFOLIO_LEADS_STATE_DIR: path.join(dir, "state"), HERMES_CONCIERGE_STATE_DIR: path.join(dir, "visitor"), HERMES_CONCIERGE_SALT: "synthetic-salt-for-tests-123", HERMES_CONCIERGE_PROXY_KEY: "synthetic-proxy-key-123456", HERMES_CONCIERGE_ORIGIN: "https://portfolio.example" }; return { dir, env, cleanup: () => rm(dir, { recursive: true, force: true }) }; }
async function apiHeaders(env: NodeJS.ProcessEnv, ip: string) {
  const headers = { origin: env.HERMES_CONCIERGE_ORIGIN!, "content-type": "application/json", "x-concierge-proxy": env.HERMES_CONCIERGE_PROXY_KEY!, "x-real-ip": ip };
  const boot = await processVisitorRequest(new Request("https://portfolio.example/api/concierge/visitor", { method: "POST", headers, body: '{"action":"bootstrap"}' }), env);
  return { ...headers, cookie: boot.setCookie!.split(";")[0], "x-nora-csrf": boot.snapshot.csrfToken };
}
const expectCode = async (fn: () => Promise<unknown>, code: string) => { await assert.rejects(fn, e => e instanceof LeadError && e.code === code); };

test("only LF survives summary control validation", () => {
  for (const summary of ["A valid\trequest here", "A valid\rrequest here", "A valid\u007frequest here"]) assert.throws(() => validateLead({ ...fixture(), summary }), LeadError);
  assert.throws(() => validateLead({ ...fixture(), name: "Ada\tExample" }), LeadError);
});

test("optional alternate contact is normalized and validated as the opposite channel", () => {
  assert.deepEqual(validateLead(fixture()), fixture());
  assert.equal(validateLead({ ...fixture(), alternateContact: "  " }).alternateContact, undefined);
  assert.equal(validateLead({ ...fixture(), alternateContact: "   +14155552671   " }).alternateContact, "+14155552671");
  const emailPrimary = { ...fixture(), contactType: "whatsapp" as const, contact: "+14155552671", alternateContact: "ada@example.com" };
  assert.equal(validateLead(emailPrimary).alternateContact, "ada@example.com");
  assert.throws(() => validateLead({ ...fixture(), alternateContact: `ada@example.com${String.fromCharCode(9)}` }), LeadError);
  for (const alternateContact of [null, 42, "bad-email", "ada@example.com\\t", "a".repeat(250) + "@x.co", "+1234567", "+1234567890123456"]) {
    assert.throws(() => validateLead({ ...fixture(), alternateContact }), LeadError);
  }
  assert.throws(() => validateLead({ ...fixture(), alternateContact: "ada@example.com", unknown: true }), LeadError);
});
test("delayed previous-day writers cannot roll back current quota counters", async () => {
  const { env, cleanup } = await setup();
  try {
    const today = new Date("2026-09-24T00:00:01Z"), yesterday = new Date("2026-09-23T23:59:59Z");
    for (let i = 1; i <= 5; i++) await submitLead(fixture(`00000000-0000-4000-8000-${String(i).padStart(12,"0")}`), "198.51.100.77", env, today);
    await expectCode(() => submitLead(fixture("00000000-0000-4000-8000-000000000006"), "198.51.100.77", env, yesterday), "rate_limited");
    const state = JSON.parse(await readFile(path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json"), "utf8"));
    assert.equal(state.day, "2026-09-24"); assert.equal(state.total, 5);
  } finally { await cleanup(); }
});

test("receipt keeps ambiguous delivery distinct from pending", async () => {
  const { env, cleanup } = await setup();
  try {
    const saved = await submitLead(fixture(), "198.51.100.1", env);
    const file = path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json");
    const state = JSON.parse(await readFile(file, "utf8"));
    state.leads[fixture().requestId].notification = "ambiguous";
    await writeFile(file, JSON.stringify(state));
    const repeated = await submitLead(fixture(), "198.51.100.1", env);
    assert.deepEqual(repeated, { leadId: saved.leadId, saved: true, notification: "unconfirmed" });
    assert.equal(JSON.parse(await readFile(file, "utf8")).total, 1);
  } finally { await cleanup(); }
});

test("strict validation and API origin/proxy/body boundary", async () => {
  assert.throws(() => validateLead({ ...fixture(), unknown: 1 }), LeadError);
  assert.throws(() => validateLead({ ...fixture(), contact: "bad" }), LeadError);
  assert.throws(() => validateLead({ ...fixture(), sourcePath: "/pt?a=1" }), LeadError);
  assert.throws(() => validateLead({ ...fixture(), consent: "true" }), LeadError);
  const { env, cleanup } = await setup();
  try {
    const req = (headers: Record<string,string>, body = JSON.stringify(fixture())) => new Request("https://portfolio.example/api/leads", { method: "POST", headers, body });
    const good = await apiHeaders(env, "203.0.113.9");
    await expectCode(() => processLeadRequest(req({ ...good, origin: "https://evil.example" }), env), "forbidden");
    await expectCode(() => processLeadRequest(req({ ...good, "x-concierge-proxy": "wrong" }), env), "forbidden");
    await expectCode(() => processLeadRequest(req({ ...good, "x-nora-csrf": "wrong" }), env), "csrf_required");
    await expectCode(() => processLeadRequest(req(good, "x".repeat(8193)), env), "request_too_large");
    const res = await processLeadRequest(req(good), env); assert.equal(res.saved, true); assert.equal(res.notification, "pending");
  } finally { await cleanup(); }
});

test("atomic filesystem receipt, idempotency, cross-client conflict and concurrent quota", async () => {
  const { env, cleanup } = await setup();
  try {
    const [a,b] = await Promise.all([submitLead(fixture(), "198.51.100.1", env), submitLead(fixture(), "198.51.100.1", env)]);
    assert.deepEqual(a,b);
    await expectCode(() => submitLead({ ...fixture(), summary: "Different request data in conflict" }, "198.51.100.1", env), "conflict");
    await expectCode(() => submitLead(fixture(), "198.51.100.2", env), "conflict");
    const file = path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json"), saved = JSON.parse(await readFile(file, "utf8"));
    assert.equal(saved.total, 1); assert.equal(saved.leads[fixture().requestId].contact, "ada@example.com"); assert.match(saved.leads[fixture().requestId].clientKey, /^[a-f0-9]{64}$/);
    const attempts = await Promise.allSettled(Array.from({ length: 6 }, (_, i) => submitLead(fixture(`00000000-0000-4000-8000-${String(i+2).padStart(12,"0")}`), "198.51.100.8", env)));
    assert.equal(attempts.filter(x => x.status === "fulfilled").length, 5); assert.equal(attempts.filter(x => x.status === "rejected" && x.reason.code === "rate_limited").length, 1);
  } finally { await cleanup(); }
});

test("corrupt state fails closed; synthetic Telegram receipt and ambiguous timeout persist", async () => {
  const { env, dir, cleanup } = await setup();
  try {
    await mkdir(env.PORTFOLIO_LEADS_STATE_DIR!, { recursive: true }); const statePath = path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json");
    await writeFile(statePath, "not-json"); await expectCode(() => submitLead(fixture(), "198.51.100.1", env), "temporarily_unavailable");
    await rm(statePath);
    const input = { ...fixture(), alternateContact: "+14155552671" };
    const receipt = await submitLead(input, "198.51.100.1", env);
    assert.deepEqual(await submitLead(input, "198.51.100.1", env), receipt);
    await expectCode(() => submitLead({ ...input, alternateContact: "+442071838750" }, "198.51.100.1", env), "conflict");
    const tokenFile = path.join(dir, "synthetic-token.txt"); await writeFile(tokenFile, "123456:synthetic_token_value_long_enough_123456\n", { mode: 0o600 });
    const tgEnv = { ...env, PORTFOLIO_LEADS_TELEGRAM_TOKEN_FILE: tokenFile, PORTFOLIO_LEADS_TELEGRAM_CHAT_ID: "123456789" };
    let payload: { text: string; disable_web_page_preview: boolean } = { text: "", disable_web_page_preview: false };
    const good = await dispatchOutbox({ env: tgEnv, fetcher: async (url, init) => { assert.equal(String(url), "https://api.telegram.org/bot123456:synthetic_token_value_long_enough_123456/sendMessage"); payload = JSON.parse(String(init?.body)); return Response.json({ ok: true, result: { message_id: 42, chat: { id: 123456789, type: "private" } } }); } });
    assert.deepEqual(good, { outcome: "sent", leadId: receipt.leadId }); assert.match(payload.text, /Contato \(email\): ada@example\.com/); assert.match(payload.text, /Contato alternativo \(whatsapp\): \+14155552671/); assert.match(payload.text, /Preciso de um site/); assert.equal(payload.disable_web_page_preview, true);
    assert.match(payload.text, /Responsável pelo retorno: Jean/); assert.match(payload.text, /Aviso entregue não significa cliente atendido/); assert.ok(payload.text.includes(`Protocolo: ${receipt.leadId}`)); assert.match(payload.text, /mesmo pedido/);
    const s = JSON.parse(await readFile(statePath,"utf8")); assert.equal(s.leads[fixture().requestId].alternateContact, "+14155552671"); assert.equal(s.leads[fixture().requestId].notification,"sent"); assert.deepEqual(s.leads[fixture().requestId].delivery, { messageId: 42, chatId: "123456789" });
    const second = fixture("00000000-0000-4000-8000-000000000009"); await submitLead(second,"198.51.100.2",env);
    const ambiguous = await dispatchOutbox({ env: tgEnv, fetcher: async () => { throw new Error("synthetic timeout"); } }); assert.equal(ambiguous.outcome,"ambiguous");
    const s2 = JSON.parse(await readFile(statePath,"utf8")); assert.equal(s2.leads[second.requestId].notification,"ambiguous");
    assert.equal((await dispatchOutbox({ env: tgEnv, fetcher: async () => { throw new Error("must not auto retry"); } })).outcome,"empty");
  } finally { await cleanup(); }
});

test("LF and CRLF summaries normalize through processLeadRequest; other controls fail", async () => {
  const { env, cleanup } = await setup();
  try {
    const headers = await apiHeaders(env, "203.0.113.40");
    const send = (input: unknown) => processLeadRequest(new Request("https://portfolio.example/api/leads", { method: "POST", headers, body: JSON.stringify(input) }), env);
    await send({ ...fixture(), summary: "Line one\nLine two is enough." });
    await send({ ...fixture("00000000-0000-4000-8000-000000000011"), summary: "Line one\r\nLine two is enough." });
    await assert.rejects(send({ ...fixture("00000000-0000-4000-8000-000000000012"), summary: "Line one\u0000Line two is enough." }), e => e instanceof LeadError && e.code === "invalid_request");
    const saved = JSON.parse(await readFile(path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json"), "utf8"));
    assert.equal(saved.leads[fixture().requestId].summary, "Line one\nLine two is enough.");
    assert.equal(saved.leads["00000000-0000-4000-8000-000000000011"].summary, "Line one\nLine two is enough.");
  } finally { await cleanup(); }
});

test("dispatch releases state lock during network IO and preserves concurrent submit/quota", async () => {
  const { env, dir, cleanup } = await setup();
  try {
    const tokenFile = path.join(dir, "token"); await writeFile(tokenFile, "123456:synthetic_token_value_long_enough_123456", { mode: 0o600 });
    const tgEnv = { ...env, PORTFOLIO_LEADS_TELEGRAM_TOKEN_FILE: tokenFile, PORTFOLIO_LEADS_TELEGRAM_CHAT_ID: "123456789" };
    await submitLead(fixture(), "198.51.100.50", env);
    let started!: () => void, release!: () => void;
    const inFetch = new Promise<void>(r => { started = r; }), gate = new Promise<void>(r => { release = r; });
    const dispatch = dispatchOutbox({ env: tgEnv, fetcher: async () => { started(); await gate; return Response.json({ ok: true, result: { message_id: 51, chat: { id: 123456789, type: "private" } } }); } });
    await inFetch;
    const newcomer = fixture("00000000-0000-4000-8000-000000000021"), accepted = await submitLead(newcomer, "198.51.100.50", env);
    release(); assert.equal((await dispatch).outcome, "sent");
    const state = JSON.parse(await readFile(path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json"), "utf8"));
    assert.equal(state.total, 2); assert.equal(Object.keys(state.leads).length, 2); assert.equal(state.leads[newcomer.requestId].leadId, accepted.leadId); assert.equal(state.leads[newcomer.requestId].notification, "pending");
    assert.deepEqual(state.leads[fixture().requestId].delivery, { messageId: 51, chatId: "123456789" });
    for (let i = 23; i <= 25; i++) await submitLead(fixture(`00000000-0000-4000-8000-${String(i).padStart(12, "0")}`), "198.51.100.50", env);
    assert.equal(await submitLead(fixture("00000000-0000-4000-8000-000000000026"), "198.51.100.50", env).then(() => "accepted", e => e.code), "rate_limited");
  } finally { await cleanup(); }
});

test("explicit Telegram 429 queues bounded retry; it succeeds only when due", async () => {
  const { env, dir, cleanup } = await setup();
  try {
    const tokenFile = path.join(dir, "token"); await writeFile(tokenFile, "123456:synthetic_token_value_long_enough_123456", { mode: 0o600 });
    const tgEnv = { ...env, PORTFOLIO_LEADS_TELEGRAM_TOKEN_FILE: tokenFile, PORTFOLIO_LEADS_TELEGRAM_CHAT_ID: "123456789" }, base = new Date("2026-09-23T12:00:00.000Z");
    await submitLead(fixture(), "198.51.100.60", env);
    const throttled = await dispatchOutbox({ env: tgEnv, now: base, fetcher: async () => Response.json({ ok: false, error_code: 429, parameters: { retry_after: 10 } }, { status: 429 }) });
    assert.equal(throttled.outcome, "queued"); assert.equal(throttled.nextAttemptAt, "2026-09-23T12:00:10.000Z");
    assert.equal((await dispatchOutbox({ env: tgEnv, now: base, fetcher: async () => { throw new Error("not due"); } })).outcome, "empty");
    assert.equal((await dispatchOutbox({ env: tgEnv, now: new Date("2026-09-23T12:00:10.000Z"), fetcher: async () => Response.json({ ok: true, result: { message_id: 61, chat: { id: 123456789, type: "private" } } }) })).outcome, "sent");
    const bad = fixture("00000000-0000-4000-8000-000000000031"); await submitLead(bad, "198.51.100.61", env);
    const injected = await dispatchOutbox({ env: { ...tgEnv, PORTFOLIO_LEADS_TELEGRAM_TOKEN_FILE: undefined }, token: "123456:synthetic_token_value_long_enough_123456", fetcher: async url => { assert.equal(String(url), "https://api.telegram.org/bot123456:synthetic_token_value_long_enough_123456/sendMessage"); return Response.json({ ok: true, result: { message_id: 62, chat: { id: 123456789, type: "group" } } }); } });
    assert.equal(injected.outcome, "ambiguous");
  } finally { await cleanup(); }
});

test("retention prunes only old sent leads with confirmed delivery and preserves counters", async () => {
  const { env, cleanup } = await setup();
  try {
    const now = new Date("2026-09-24T12:00:00.000Z"), file = path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json");
    const inputs = [1,2,3,4,5].map(i => fixture(`00000000-0000-4000-8000-${String(i).padStart(12,"0")}`));
    for (const [i, input] of inputs.entries()) await submitLead(input, `198.51.100.${i + 1}`, env, new Date("2026-01-01T00:00:00.000Z"));
    const state = JSON.parse(await readFile(file, "utf8"));
    const [oldSent, boundary, pending, ambiguous, undelivered] = inputs.map(x => state.leads[x.requestId]);
    oldSent.notification = "sent"; oldSent.delivery = { messageId: 101, chatId: "123456789" };
    oldSent.conversation.sheets = "synced";
    boundary.createdAt = "2026-06-26T12:00:00.000Z"; boundary.notification = "sent"; boundary.delivery = { messageId: 102, chatId: "123456789" };
    boundary.conversation.updatedAt = boundary.createdAt; boundary.conversation.sheets = "synced";
    pending.createdAt = "2026-01-01T00:00:00.000Z";
    ambiguous.notification = "ambiguous";
    undelivered.notification = "sent"; delete undelivered.delivery;
    await writeFile(file, JSON.stringify(state));
    const result = await prunePortfolioLeads({ env, now });
    assert.deepEqual(result, { removed: 1, cutoff: "2026-06-26T12:00:00.000Z" });
    const after = JSON.parse(await readFile(file, "utf8"));
    assert.equal(after.total, 5); assert.deepEqual(after.clients, state.clients);
    assert.deepEqual(Object.keys(after.leads).sort(), inputs.slice(1).map(x => x.requestId).sort());
    assert.equal(after.leads[boundary.requestId].notification, "sent");
    assert.equal(after.leads[pending.requestId].notification, "pending");
    assert.equal(after.leads[ambiguous.requestId].notification, "ambiguous");
    assert.equal(after.leads[undelivered.requestId].notification, "sent");
  } finally { await cleanup(); }
});

test("retention fails closed on malformed delivery and serializes on leads.lock", async () => {
  const { env, cleanup } = await setup();
  try {
    const file = path.join(env.PORTFOLIO_LEADS_STATE_DIR!, "portfolio-leads.json"), stateDir = env.PORTFOLIO_LEADS_STATE_DIR!;
    await submitLead(fixture(), "198.51.100.1", env, new Date("2026-01-01T00:00:00.000Z"));
    const malformed = JSON.parse(await readFile(file, "utf8")); malformed.leads[fixture().requestId].notification = "sent"; malformed.leads[fixture().requestId].delivery = { messageId: 0, chatId: "bad" };
    await writeFile(file, JSON.stringify(malformed));
    await expectCode(() => prunePortfolioLeads({ env, now: new Date("2026-09-24T12:00:00Z") }), "temporarily_unavailable");
    assert.equal(await readFile(file, "utf8"), JSON.stringify(malformed));
    delete malformed.leads[fixture().requestId].delivery;
    await writeFile(file, JSON.stringify(malformed));
    const lock = await import("node:fs/promises").then(fs => fs.open(path.join(stateDir, "leads.lock"), "wx"));
    let done = false;
    const pruning = prunePortfolioLeads({ env, now: new Date("2026-09-24T12:00:00Z") }).then(result => { done = true; return result; });
    await new Promise(resolve => setTimeout(resolve, 75)); assert.equal(done, false);
    await lock.close(); await rm(path.join(stateDir, "leads.lock"));
    assert.deepEqual(await pruning, { removed: 0, cutoff: "2026-06-26T12:00:00.000Z" });
    assert.equal(JSON.parse(await readFile(file, "utf8")).total, 1);
  } finally { await cleanup(); }
});

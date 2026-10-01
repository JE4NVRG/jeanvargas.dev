import { createHmac } from "node:crypto";
import { constants } from "node:fs";
import { open, realpath } from "node:fs/promises";
import path from "node:path";

export type SheetLeadPayload = {
  leadId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  whatsapp: string;
  locale: "pt" | "en";
  sourcePath: string;
  intent: "nora_demo" | "assistant_project" | "contact_request";
  summary: string;
  goal: string;
  situation: string;
  desiredSolution: string;
  constraints: string;
  openQuestions: string;
  nextStep: string;
  stage: "demo" | "exploring" | "contact_requested";
  memoryEnabled: boolean;
};

export type SheetLeadReceipt = { outcome: "synced" | "unconfigured" | "retry"; leadId: string; row?: number };
type Options = { env: NodeJS.ProcessEnv; fetcher?: typeof fetch; now?: Date };
const MAX_BYTES = 32 * 1024;
// Apps Script may finish the write before its ContentService redirect is ready.
// This runs after the HTTP response; retain a bounded deadline without losing receipts.
const DEADLINE_MS = 12000;
const MAX_REDIRECTS = 2;
const WINDOW_MS = 5 * 60 * 1000;
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/;
const KEYS = ["leadId", "createdAt", "updatedAt", "name", "whatsapp", "locale", "sourcePath", "intent", "summary", "goal", "situation", "desiredSolution", "constraints", "openQuestions", "nextStep", "stage", "memoryEnabled"];

function iso(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}

function validLead(lead: SheetLeadPayload, now: Date): boolean {
  if (!lead || typeof lead !== "object" || Array.isArray(lead) || Object.keys(lead).length !== KEYS.length || Object.keys(lead).some(key => !KEYS.includes(key))) return false;
  if (typeof lead.leadId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(lead.leadId)) return false;
  if (!iso(lead.createdAt) || !iso(lead.updatedAt) || lead.createdAt > lead.updatedAt || Date.parse(lead.updatedAt) > now.getTime() + WINDOW_MS) return false;
  if (typeof lead.name !== "string" || !lead.name.trim() || lead.name.length > 100 || CONTROL.test(lead.name)) return false;
  if (typeof lead.whatsapp !== "string" || (lead.whatsapp !== "" && !/^\+[1-9]\d{7,14}$/.test(lead.whatsapp))) return false;
  if (lead.locale !== "pt" && lead.locale !== "en") return false;
  if (typeof lead.sourcePath !== "string" || lead.sourcePath.length > 256 || !/^\/(pt|en)(?:\/[^?#\u0000-\u001f\u007f-\u009f]*)?$/.test(lead.sourcePath) || lead.sourcePath.includes("\\")) return false;
  if (!["nora_demo", "assistant_project", "contact_request"].includes(lead.intent) || !["demo", "exploring", "contact_requested"].includes(lead.stage) || typeof lead.memoryEnabled !== "boolean") return false;
  return (["summary", "goal", "situation", "desiredSolution", "constraints", "openQuestions", "nextStep"] as const).every(key => typeof lead[key] === "string" && lead[key].length <= (key === "summary" ? 1500 : 500) && !CONTROL.test(lead[key].replace(/\n/g, "")));
}

async function readSecret(file: string): Promise<string> {
  if (!path.isAbsolute(file)) throw new Error("invalid_configuration");
  const actual = await realpath(file);
  const root = await realpath(/* turbopackIgnore: true */ process.cwd());
  const relative = path.relative(root, actual);
  if (!relative || (!relative.startsWith(".." + path.sep) && relative !== ".." && !path.isAbsolute(relative))) throw new Error("invalid_configuration");
  const handle = await open(actual, constants.O_RDONLY | (process.platform === "win32" ? 0 : constants.O_NOFOLLOW));
  try {
    const info = await handle.stat();
    if (!info.isFile() || info.size < 32 || info.size > 4096) throw new Error("invalid_configuration");
    // Windows deployments inherit the ACL of the owner's private secret directory.
    if (process.platform !== "win32" && ((info.mode & 0o777) !== 0o600 || (typeof process.getuid === "function" && info.uid !== process.getuid()))) throw new Error("invalid_configuration");
    const bytes = Buffer.alloc(4097);
    const { bytesRead } = await handle.read(bytes, 0, bytes.length, 0);
    if (bytesRead > 4096) throw new Error("invalid_configuration");
    const secret = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, bytesRead)).trim();
    if (secret.length < 32 || secret.length > 4096 || CONTROL.test(secret)) throw new Error("invalid_configuration");
    return secret;
  } finally { await handle.close(); }
}

function contentRedirect(raw: string | null): string {
  if (!raw || raw.length > 4096) throw new Error("invalid_response");
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.hostname !== "script.googleusercontent.com" || url.port || url.username || url.password || url.hash) throw new Error("invalid_response");
  return url.href;
}

async function boundedJson(response: Response): Promise<unknown> {
  const length = response.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) throw new Error("invalid_response");
  if (!response.headers.get("content-type")?.toLowerCase().startsWith("application/json") || !response.body) throw new Error("invalid_response");
  const reader = response.body.getReader();
  let total = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) throw new Error("invalid_response");
      chunks.push(value);
    }
  } finally { void reader.cancel().catch(() => undefined); reader.releaseLock(); }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks, total)));
}

/** Server-only relay. Retries are safe because the Sheet identifies contacts by leadId. */
export async function sendLeadToSheets(lead: SheetLeadPayload, options: Options): Promise<SheetLeadReceipt> {
  const base = { leadId: lead.leadId };
  const env = options.env;
  const endpoint = env.PORTFOLIO_LEADS_SHEETS_WEBHOOK_URL;
  const secretFile = env.PORTFOLIO_LEADS_SHEETS_SECRET_FILE;
  if (!endpoint || !secretFile) return { ...base, outcome: "unconfigured" };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const controller = new AbortController();
  try {
    const now = options.now ?? new Date();
    if (!Number.isFinite(now.getTime()) || !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint) || !validLead(lead, now)) throw new Error("invalid_configuration");
    const secret = await readSecret(secretFile);
    const payload = JSON.stringify(lead);
    const timestamp = now.toISOString();
    const signature = createHmac("sha256", secret).update(timestamp + "\n" + payload).digest("hex");
    const body = JSON.stringify({ timestamp, payload, signature });
    if (Buffer.byteLength(body, "utf8") > MAX_BYTES) throw new Error("invalid_request");
    const fetcher = options.fetcher ?? fetch;
    const delivery = async () => {
      let response = await fetcher(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body, signal: controller.signal, redirect: "manual", credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store" });
      let redirects = 0;
      while ([301, 302, 303, 307, 308].includes(response.status)) {
        if (++redirects > MAX_REDIRECTS) throw new Error("invalid_response");
        const url = contentRedirect(response.headers.get("location"));
        void response.body?.cancel().catch(() => undefined);
        // ContentService redirects only the response: never forward the POST or its signature.
        response = await fetcher(url, { method: "GET", signal: controller.signal, redirect: "manual", credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store" });
      }
      if (!response.ok) throw new Error("invalid_response");
      const value = await boundedJson(response);
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_response");
      const receipt = value as Record<string, unknown>;
      if (Object.keys(receipt).length !== 4 || Object.keys(receipt).some(key => !["ok", "leadId", "updatedAt", "row"].includes(key)) || receipt.ok !== true || receipt.leadId !== lead.leadId || !iso(receipt.updatedAt) || receipt.updatedAt < lead.updatedAt || Date.parse(receipt.updatedAt) > now.getTime() + WINDOW_MS || !Number.isSafeInteger(receipt.row) || Number(receipt.row) < 5 || Number(receipt.row) > 10004) throw new Error("invalid_response");
      return { ...base, outcome: "synced" as const, row: Number(receipt.row) };
    };
    const deadline = new Promise<never>((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error("delivery_timeout")); }, DEADLINE_MS); });
    return await Promise.race([delivery(), deadline]);
  } catch { return { ...base, outcome: "retry" }; }
  finally { clearTimeout(timer); controller.abort(); }
}

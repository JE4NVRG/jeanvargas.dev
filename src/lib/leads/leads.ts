import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { chmod, mkdir, open, readFile, rename, rm, stat, realpath } from "node:fs/promises";
import path from "node:path";

export type LeadInput = { requestId: string; locale: "pt" | "en"; name: string; contactType: "email" | "whatsapp"; contact: string; alternateContact?: string; summary: string; sourcePath: string; consent: true; intent?: "nora_demo" | "assistant_project" };
import { assertCsrf, peekVisitorSnapshot, VisitorError } from "../concierge/visitor";
import type { ConversationBrief } from "../concierge/concierge";
import { sendLeadToSheets, type SheetLeadPayload } from "./sheets-sync";
import { containsRecoveryCode } from "../concierge/recovery-code";
import { ProtectionError, verifyNoraProtection, rateNoraVerification } from "../concierge/protection";
import { leadReference } from "./reference";
type LeadConversation = { updatedAt: string; summary: string; brief?: ConversationBrief; nextStep: string; stage: SheetLeadPayload["stage"]; memoryEnabled: boolean; sheets: "pending" | "synced"; nextSyncAt?: string };
type LeadRecord = LeadInput & { sourceContactLeadId?: string; leadId: string; clientKey: string; createdAt: string; notification: "pending" | "sent" | "ambiguous"; nextAttemptAt?: string; delivery?: { messageId: number; chatId: string }; conversation?: LeadConversation };
type State = { day: string; total: number; demoTotal?: number; clients: Record<string, number>; leads: Record<string, LeadRecord> };
export class LeadError extends Error { constructor(public status: number, public code: string) { super(code); } }
const MAX_BODY = 8192, CLIENT_LIMIT = 5, GLOBAL_LIMIT = 50, LOCK_MS = 5000;
const control = /[\u0000-\u001f\u007f-\u009f]/;
type CallbackContext = { sourceContactLeadId: string; brief?: ConversationBrief; memoryEnabled: boolean };
function validConversation(v: LeadConversation | undefined) {
  if (!v) return true;
  return Number.isFinite(Date.parse(v.updatedAt)) && typeof v.summary === "string" && v.summary.length <= 1500 && typeof v.nextStep === "string" && v.nextStep.length <= 500 && ["demo","exploring","contact_requested"].includes(v.stage) && typeof v.memoryEnabled === "boolean" && ["pending","synced"].includes(v.sheets) && (!v.nextSyncAt || Number.isFinite(Date.parse(v.nextSyncAt))) && (!v.brief || ["goal","situation","desiredSolution","constraints","openQuestions"].every(field => typeof v.brief![field as keyof ConversationBrief] === "string" && v.brief![field as keyof ConversationBrief].length <= 500));
}
function fail(): never { throw new LeadError(400, "invalid_request"); }
export function validateLead(value: unknown): LeadInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fail();
  const v = value as Record<string, unknown>;
  const keys = ["requestId", "locale", "name", "contactType", "contact", "alternateContact", "summary", "sourcePath", "consent"];
  if (Object.keys(v).some(k => !keys.includes(k) && k !== "intent") || Object.keys(v).length !== keys.length - (Object.hasOwn(v, "alternateContact") ? 0 : 1) + (Object.hasOwn(v, "intent") ? 1 : 0)) return fail();
  if (v.intent !== undefined && v.intent !== "nora_demo" && v.intent !== "assistant_project") return fail();
  if (typeof v.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v.requestId) || (v.locale !== "pt" && v.locale !== "en") || (v.contactType !== "email" && v.contactType !== "whatsapp") || v.consent !== true) return fail();
  if (typeof v.name !== "string" || typeof v.contact !== "string" || typeof v.summary !== "string" || typeof v.sourcePath !== "string") return fail();
  const name = v.name.trim(), contact = v.contact.trim(), summary = v.summary.trim().replace(/\r\n/g, "\n");
  if (containsRecoveryCode(name) || containsRecoveryCode(summary)) return fail();
  if (!name || name.length > 100 || control.test(name) || !summary || summary.length < 10 || summary.length > 1500 || control.test(summary.replace(/\n/g, ""))) return fail();
  if (v.contactType === "email" ? (contact.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || control.test(contact)) : (!/^\+[1-9]\d{7,14}$/.test(contact))) return fail();
  if (v.alternateContact !== undefined && typeof v.alternateContact !== "string") return fail();
  if (typeof v.alternateContact === "string" && control.test(v.alternateContact)) return fail();
  const alternateContact = typeof v.alternateContact === "string" ? v.alternateContact.trim() : "";
  if (alternateContact && (alternateContact.length > 254 || (v.contactType === "whatsapp" ? (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alternateContact) || control.test(alternateContact)) : !/^\+[1-9]\d{7,14}$/.test(alternateContact)))) return fail();
  if (!/^\/(pt|en)(?:\/[^?#\u0000-\u001f\u007f-\u009f]*)?$/.test(v.sourcePath) || v.sourcePath.length > 256 || v.sourcePath.includes("\\")) return fail();
  return { requestId: v.requestId.toLowerCase(), locale: v.locale, name, contactType: v.contactType, contact, ...(alternateContact ? { alternateContact } : {}), summary, sourcePath: v.sourcePath, consent: true, ...(v.intent ? {intent:v.intent as LeadInput["intent"]}: {}) };
}
function safeState(v: unknown): v is State {
  if (!v || typeof v !== "object") return false; const s = v as State;
  return (s.demoTotal === undefined || (Number.isSafeInteger(s.demoTotal) && s.demoTotal >= 0 && s.demoTotal <= 3000)) && /^\d{4}-\d\d-\d\d$/.test(s.day) && Number.isSafeInteger(s.total) && s.total >= 0 && !!s.clients && !!s.leads && typeof s.clients === "object" && !Array.isArray(s.clients) && typeof s.leads === "object" && !Array.isArray(s.leads) && Object.keys(s.leads).length <= 10000 && Object.values(s.clients).every(n => Number.isSafeInteger(n) && n >= 0 && n <= CLIENT_LIMIT) && Object.entries(s.leads).every(([id, r]) => !!r && typeof r === "object" && id === r.requestId && validConversation(r.conversation) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(r.requestId) && /^[0-9a-f-]{36}$/i.test(r.leadId) && /^[a-f0-9]{64}$/.test(r.clientKey) && typeof r.createdAt === "string" && Number.isFinite(Date.parse(r.createdAt)) && typeof r.contact === "string" && ["pending", "sent", "ambiguous"].includes(r.notification) && (!r.nextAttemptAt || Number.isFinite(Date.parse(r.nextAttemptAt))) && (!r.delivery || (Number.isSafeInteger(r.delivery.messageId) && r.delivery.messageId > 0 && typeof r.delivery.chatId === "string" && /^-?\d+$/.test(r.delivery.chatId))));
}
async function withLock<T>(dir: string, fn: () => Promise<T>, lockName = "leads.lock"): Promise<T> {
  const lock = path.join(dir, lockName); let handle: Awaited<ReturnType<typeof open>> | undefined; const until = Date.now() + LOCK_MS;
  while (!handle) { try { handle = await open(lock, "wx", 0o600); } catch (e) { if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw new LeadError(503, "temporarily_unavailable"); if (Date.now() >= until) throw new LeadError(503, "temporarily_unavailable"); await new Promise(r => setTimeout(r, 25)); } }
  try { return await fn(); } finally { await handle.close().catch(() => undefined); await rm(lock, { force: true }); }
}
async function loadState(file: string, today: string): Promise<State> {
  try { const info = await stat(file); if (info.size > 8_000_000) throw new Error(); const state = JSON.parse(await readFile(file, "utf8")); if (!safeState(state)) throw new Error(); return state.day >= today ? state : { day: today, total: 0, clients: {}, leads: state.leads }; }
  catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return { day: today, total: 0, clients: {}, leads: {} }; throw new LeadError(503, "temporarily_unavailable"); }
}
async function saveState(file: string, state: State) { const encoded = JSON.stringify(state); if (Buffer.byteLength(encoded) > 8_000_000) throw new LeadError(503, "temporarily_unavailable"); const tmp = `${file}.${randomUUID()}.tmp`; await (await open(tmp, "wx", 0o600)).close(); try { const h = await open(tmp, "w", 0o600); try { await h.writeFile(encoded, "utf8"); await h.sync(); } finally { await h.close(); } await rename(tmp, file); } catch (e) { await rm(tmp, { force: true }); throw e; } }
async function prepare(env: NodeJS.ProcessEnv) {
  const raw = env.PORTFOLIO_LEADS_STATE_DIR, salt = env.HERMES_CONCIERGE_SALT, proxy = env.HERMES_CONCIERGE_PROXY_KEY;
  if (!raw || !salt || !proxy || salt.length < 16 || proxy.length < 16) throw new LeadError(503, "unavailable");
  const dir = path.resolve(raw); await mkdir(dir, { recursive: true, mode: 0o700 }); const actual = await realpath(dir);
  const info = await stat(actual); if (process.platform !== "win32") { if (typeof process.getuid === "function" && info.uid !== process.getuid()) throw new LeadError(503, "unavailable"); await chmod(actual, 0o700); }
  const root = path.resolve(/* turbopackIgnore: true */ process.cwd()); if (actual === root || actual.startsWith(root + path.sep)) throw new LeadError(503, "unavailable");
  return { dir: actual, file: path.join(actual, "portfolio-leads.json"), salt, proxy };
}
function repeatedReceipt(old: LeadRecord, clientKey: string, digest: string) {
  const canonical = { requestId: old.requestId, locale: old.locale, name: old.name, contactType: old.contactType, contact: old.contact, ...(old.alternateContact ? {alternateContact:old.alternateContact}: {}), summary:old.summary, sourcePath:old.sourcePath, consent:old.consent, ...(old.intent?{intent:old.intent}: {}) };
  if(old.clientKey !== clientKey || createHash("sha256").update(JSON.stringify(canonical)).digest("hex") !== digest) throw new LeadError(409,"conflict");
  return {leadId:old.leadId,saved:true as const,notification:old.notification === "ambiguous" ? "unconfirmed" as const : old.notification};
}
export async function submitLead(inputValue: unknown, clientIp: string, env: NodeJS.ProcessEnv = process.env, now = new Date(), verifyNew?:()=>Promise<void>, callbackContext?: CallbackContext) {
  const input = validateLead(inputValue); if (!clientIp || clientIp.length > 128 || control.test(clientIp)) throw new LeadError(503, "temporarily_unavailable");
  const cfg = await prepare(env), clientKey = createHash("sha256").update(`${cfg.salt}:${clientIp}`).digest("hex"), digest = createHash("sha256").update(JSON.stringify(input)).digest("hex"), day = now.toISOString().slice(0, 10);
  if(verifyNew) {
    const oldReceipt=await withLock(cfg.dir,async()=>{const s=await loadState(cfg.file,day);const old=s.leads[input.requestId];return old?repeatedReceipt(old,clientKey,digest):null;});
    if(oldReceipt)return oldReceipt;
    // Network validation holds no persistence lock; concurrent writes recheck below.
    await verifyNew();
  }
  return withLock(cfg.dir, async () => {
    const s = await loadState(cfg.file, day), old = s.leads[input.requestId];
    if (old) return repeatedReceipt(old,clientKey,digest);
    if ((input.intent === "nora_demo" ? (s.demoTotal ?? 0) >= 3000 : s.total >= GLOBAL_LIMIT) || (s.clients[clientKey] ?? 0) >= CLIENT_LIMIT) throw new LeadError(429, "rate_limited");
    if (Object.keys(s.leads).length >= 10_000) throw new LeadError(503, "temporarily_unavailable");
    const record: LeadRecord = { ...input, ...(callbackContext ? {sourceContactLeadId:callbackContext.sourceContactLeadId} : {}), leadId: randomUUID(), clientKey, createdAt: now.toISOString(), notification: "pending", conversation: {updatedAt:now.toISOString(),summary:input.summary,nextStep:input.intent === "nora_demo" ? "Conhecer a Nora e explorar ideias." : "Entender a necessidade antes de confirmar uma proposta.",stage:input.intent === "nora_demo" ? "demo" : input.intent === "assistant_project" ? "exploring" : "contact_requested",memoryEnabled:callbackContext?.memoryEnabled ?? false,sheets:"pending",...(callbackContext?.brief ? {brief:callbackContext.brief} : {})} };
    if(callbackContext) record.conversation!.nextStep=input.locale === "pt" ? "Retorno autorizado: revisar o resumo aprovado e combinar o próximo passo com Jean." : "Callback authorized: review the approved summary and agree the next step with Jean.";
    if (input.intent === "nora_demo") s.demoTotal = (s.demoTotal ?? 0) + 1; else s.total++;
    s.clients[clientKey] = (s.clients[clientKey] ?? 0) + 1; s.leads[input.requestId] = record; await saveState(cfg.file, s);
    return { leadId: record.leadId, saved: true as const, notification: "pending" as const };
  });
}
export function errorResponse(error: unknown) { const e = error instanceof LeadError ? error : new LeadError(503, "temporarily_unavailable"); return Response.json({ error: e.code }, { status: e.status, headers: { "cache-control": "no-store" } }); }
export async function processLeadRequest(request: Request, env: NodeJS.ProcessEnv = process.env, now = new Date(), protectionFetcher?: typeof fetch) {
  const origin = request.headers.get("origin"), expected = env.HERMES_CONCIERGE_ORIGIN;
  try { if (!origin || !expected || new URL(origin).origin !== new URL(expected).origin) throw new LeadError(403, "forbidden"); } catch { throw new LeadError(403, "forbidden"); }
  const proof = Buffer.from(request.headers.get("x-concierge-proxy") || ""), key = Buffer.from(env.HERMES_CONCIERGE_PROXY_KEY || "");
  if (!key.length || key.length !== proof.length || !timingSafeEqual(key, proof)) throw new LeadError(403, "forbidden");
  try { assertCsrf(request, env); }
  catch (error) { if (error instanceof VisitorError || error instanceof ProtectionError) throw new LeadError(error.status, error.code); throw error; }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new LeadError(415, "invalid_request");
  const length = request.headers.get("content-length"); if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY)) throw new LeadError(413, "request_too_large");
  if (!request.body) throw new LeadError(400, "invalid_request"); const reader = request.body.getReader(); let bytes = 0; const chunks: Uint8Array[] = []; let timer: ReturnType<typeof setTimeout> | undefined;
  try { const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new LeadError(408, "request_timeout")), 5000); }); for (;;) { const { done, value } = await Promise.race([reader.read(), timeout]); if (done) break; bytes += value.byteLength; if (bytes > MAX_BODY) throw new LeadError(413, "request_too_large"); chunks.push(value); } } finally { clearTimeout(timer); void reader.cancel().catch(() => undefined); reader.releaseLock(); }
  const body = new Uint8Array(bytes); let off = 0; for (const c of chunks) { body.set(c, off); off += c.length; }
  let parsed: unknown; try { parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)); } catch { throw new LeadError(400, "invalid_request"); }
  let input: LeadInput;
  let reusedContactLeadId: string | undefined;
  let callbackContext: CallbackContext | undefined;
  const reuseSavedContact = !!parsed && typeof parsed === "object" && !Array.isArray(parsed) && (parsed as Record<string, unknown>).useSavedContact === true;
  if (reuseSavedContact) {
    const data = parsed as Record<string, unknown>;
    const keys = ["requestId", "locale", "summary", "sourcePath", "consent", "useSavedContact", "registeredContactId"];
    if (Object.keys(data).some(key => !keys.includes(key))) return fail();
    if (Object.keys(data).length === keys.length-1 && !Object.hasOwn(data,"registeredContactId")) throw new LeadError(409,"registration_changed");
    if (Object.keys(data).length !== keys.length || typeof data.registeredContactId !== "string" || !/^[0-9a-f-]{36}$/i.test(data.registeredContactId)) return fail();
    let contact: Awaited<ReturnType<typeof getRegisteredLeadContact>>;
    try { contact = await getRegisteredLeadContact(request, env, now, true); }
    catch (error) { if (error instanceof VisitorError) throw new LeadError(error.status, error.code); throw error; }
    if (!contact) throw new LeadError(401, "registration_required");
    if(contact.leadId !== data.registeredContactId) {
      const cfg=await prepare(env),clientKey=createHash("sha256").update(cfg.salt+":"+(request.headers.get("x-real-ip") || "")).digest("hex");
      const retry=await withLock(cfg.dir,async()=>{const state=await loadState(cfg.file,"0000-00-00");const old=state.leads[String(data.requestId).toLowerCase()];return old?.leadId===contact!.leadId && old.sourceContactLeadId===data.registeredContactId && old.clientKey===clientKey;});
      if(!retry) throw new LeadError(409,"registration_changed");
    }
    reusedContactLeadId = contact.leadId;
    input = validateLead({requestId:data.requestId,locale:data.locale,summary:data.summary,sourcePath:data.sourcePath,consent:data.consent,name:contact.name,contactType:"whatsapp",contact:contact.whatsapp});
    const prior=contact.context?.brief;
    const reviewed=Object.fromEntries(["goal","situation","desiredSolution","constraints","openQuestions"].map(field=>{const value=prior?.[field as keyof ConversationBrief] ?? "";return [field,value && input.summary.includes(value) ? value : ""];})) as ConversationBrief;
    callbackContext={sourceContactLeadId:data.registeredContactId,memoryEnabled:contact.context?.memoryEnabled ?? false,...(Object.values(reviewed).some(Boolean)?{brief:reviewed}:{})};
  } else input = validateLead(parsed);
  const receipt = await submitLead(input, request.headers.get("x-real-ip") || "", env, now, async()=>{
    try {await rateNoraVerification(request,env,now);await verifyNoraProtection(request,env,protectionFetcher);}
    catch(error){if(error instanceof ProtectionError)throw new LeadError(error.status,error.code);throw error;}
  }, callbackContext);
  return { ...receipt, ...(reusedContactLeadId ? { reusedContactLeadId } : {}), visitorProfile: { name: input.name, hasWhatsApp: input.contactType === "whatsapp" || !!input.alternateContact, leadId: receipt.leadId, ...(input.intent?{intent:input.intent}:{}) } };
}

/** The contact is resolved from the server profile, never a caller-supplied phone or lead ID. */
export async function getRegisteredLeadContact(request: Request, env = process.env, now = new Date(), includeContext = false) {
  assertCsrf(request, env, now);
  const visitor = await peekVisitorSnapshot(request, env, now);
  if (!visitor.profile?.hasWhatsApp) return null;
  const cfg = await prepare(env);
  return withLock(cfg.dir, async () => {
    const state = await loadState(cfg.file, "0000-00-00");
    const lead = Object.values(state.leads).find(item => item.leadId === visitor.profile!.leadId);
    const whatsapp = lead?.contactType === "whatsapp" ? lead.contact : lead?.alternateContact;
    return lead && whatsapp && /^\+[1-9]\d{7,14}$/.test(whatsapp) ? {leadId:lead.leadId,name:lead.name,whatsapp,...(includeContext ? {context:{brief:lead.conversation?.brief,memoryEnabled:visitor.memory.enabled}} : {})} : null;
  });
}

const crmText = (value: string, max = 500) => value.replace(/\r\n?/g,"\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/g, "").trim().slice(0,max);
function sheetPayload(lead: LeadRecord): SheetLeadPayload {
  const info = lead.conversation;
  const email = lead.contactType === "email" ? lead.contact : lead.alternateContact;
  const summary = email ? `${lead.locale === "pt" ? "E-mail para retorno" : "Reply email"}: ${email}\n${info?.summary ?? lead.summary}`.slice(0,1500) : info?.summary ?? lead.summary;
  return {leadId:lead.leadId,createdAt:lead.createdAt,updatedAt:info?.updatedAt ?? lead.createdAt,name:lead.name,
    whatsapp:lead.contactType === "whatsapp" ? lead.contact : lead.alternateContact || "",locale:lead.locale,sourcePath:lead.sourcePath,
    intent:lead.intent ?? "contact_request",summary,
    goal:info?.brief?.goal ?? "",situation:info?.brief?.situation ?? "",desiredSolution:info?.brief?.desiredSolution ?? "",constraints:info?.brief?.constraints ?? "",openQuestions:info?.brief?.openQuestions ?? "",
    nextStep:info?.nextStep ?? "Revisar o pedido e confirmar o próximo passo.",stage:info?.stage ?? "contact_requested",memoryEnabled:info?.memoryEnabled ?? false};
}

/** One compact, source-grounded brief per registration; no full transcript or second model call. */
export async function recordNoraConversation(request: Request, input: {leadId: string; reply: string; lastUser: string; brief?: ConversationBrief}, env = process.env, now = new Date()) {
  assertCsrf(request, env, now);
  const visitor = await peekVisitorSnapshot(request, env, now);
  if (!visitor.profile || visitor.profile.leadId !== input.leadId) return;
  const cfg = await prepare(env);
  await withLock(cfg.dir, async () => {
    const state = await loadState(cfg.file, "0000-00-00"), lead = Object.values(state.leads).find(item => item.leadId === input.leadId);
    if (!lead) return;
    const brief = input.brief ? Object.fromEntries(["goal","situation","desiredSolution","constraints","openQuestions"].map(field => [field,crmText(input.brief![field as keyof ConversationBrief])])) as ConversationBrief : lead.conversation?.brief;
    const labels = lead.locale === "pt" ? ["Objetivo","Contexto","Solução desejada","Restrições","Dúvidas"] : ["Goal","Context","Desired solution","Constraints","Questions"];
    const fields = brief ? Object.values(brief).map((text,index) => text ? `${labels[index]}: ${text}` : "").filter(Boolean) : [];
    const summary = crmText([`${lead.locale === "pt" ? "Orientação da Nora (a confirmar)" : "Nora's guidance (to confirm)"}: ${crmText(input.reply,1000)}`,...fields, ...(fields.length ? [] : [`${lead.locale === "pt" ? "Última necessidade informada" : "Latest stated need"}: ${crmText(input.lastUser)}`])].join("\n"),1500);
    const updatedAt = new Date(Math.max(now.getTime(),Date.parse(lead.conversation?.updatedAt ?? lead.createdAt)+1)).toISOString();
    lead.conversation = {updatedAt,summary,...(brief ? {brief} : {}),nextStep:brief?.openQuestions ? `${lead.locale === "pt" ? "Esclarecer" : "Clarify"}: ${brief.openQuestions}`.slice(0,500) : lead.locale === "pt" ? "Revisar o contexto e definir o próximo passo com Jean, se houver interesse." : "Review the context and agree the next step with Jean if interested.",stage:lead.intent === "nora_demo" ? "demo" : lead.intent === "assistant_project" ? "exploring" : "contact_requested",memoryEnabled:visitor.memory.enabled,sheets:"pending"};
    await saveState(cfg.file,state);
  });
}

export async function recordNoraMemoryPreference(request: Request, env = process.env, now = new Date()) {
  assertCsrf(request,env,now);
  const visitor=await peekVisitorSnapshot(request,env,now);
  if (!visitor.profile) return;
  const cfg=await prepare(env);
  await withLock(cfg.dir,async()=>{
    const state=await loadState(cfg.file,"0000-00-00"),lead=Object.values(state.leads).find(item=>item.leadId===visitor.profile!.leadId);
    if (!lead?.conversation || lead.conversation.memoryEnabled===visitor.memory.enabled) return;
    lead.conversation.memoryEnabled=visitor.memory.enabled;
    lead.conversation.updatedAt=new Date(Math.max(now.getTime(),Date.parse(lead.conversation.updatedAt)+1)).toISOString();
    lead.conversation.sheets="pending";delete lead.conversation.nextSyncAt;
    await saveState(cfg.file,state);
  });
}

/** Coalesced durable outbox. Remote writes hold no lead lock; receipts only confirm their own revision. */
export async function dispatchSheetsOutbox(options: {env?: NodeJS.ProcessEnv; fetcher?: typeof fetch; now?: Date} = {}) {
  const env = options.env ?? process.env;
  if (!env.PORTFOLIO_LEADS_SHEETS_WEBHOOK_URL || !env.PORTFOLIO_LEADS_SHEETS_SECRET_FILE) return {outcome:"unconfigured" as const};
  const cfg = await prepare(env), now = options.now ?? new Date();
  return withLock(cfg.dir, async () => {
    const pending = await withLock(cfg.dir, async () => {
      const state = await loadState(cfg.file,"0000-00-00");
      const item = Object.values(state.leads).filter(lead => lead.conversation?.sheets !== "synced" && (!lead.conversation?.nextSyncAt || Date.parse(lead.conversation.nextSyncAt) <= now.getTime())).sort((a,b) => (a.conversation?.updatedAt ?? a.createdAt).localeCompare(b.conversation?.updatedAt ?? b.createdAt))[0];
      return item ? {requestId:item.requestId,payload:sheetPayload(item)} : null;
    });
    if (!pending) return {outcome:"empty" as const};
    const receipt = await sendLeadToSheets(pending.payload,{env,fetcher:options.fetcher,now});
    await withLock(cfg.dir, async () => {
      const state = await loadState(cfg.file,"0000-00-00"), current = state.leads[pending.requestId];
      if (!current || current.leadId !== pending.payload.leadId || (current.conversation?.updatedAt ?? current.createdAt) !== pending.payload.updatedAt) return;
      current.conversation ??= {updatedAt:current.createdAt,summary:current.summary,nextStep:pending.payload.nextStep,stage:pending.payload.stage,memoryEnabled:false,sheets:"pending"};
      if (receipt.outcome === "synced") {current.conversation.sheets="synced";delete current.conversation.nextSyncAt;}
      else if (receipt.outcome === "retry") current.conversation.nextSyncAt=new Date(now.getTime()+60_000).toISOString();
      await saveState(cfg.file,state);
    });
    return {outcome:receipt.outcome,leadId:pending.payload.leadId};
  },"sheets-dispatch.lock");
}
export type TelegramReply = { ok: boolean; error_code?: number; parameters?: { retry_after?: number }; result?: { message_id?: number; chat?: { id?: number | string; type?: string } } };
export async function dispatchOutbox(options: { env?: NodeJS.ProcessEnv; fetcher?: typeof fetch; now?: Date; token?: string } = {}) {
  const env = options.env ?? process.env, cfg = await prepare(env), tokenFile = env.PORTFOLIO_LEADS_TELEGRAM_TOKEN_FILE, chatRaw = env.PORTFOLIO_LEADS_TELEGRAM_CHAT_ID;
  if (!chatRaw || !/^[1-9]\d*$/.test(chatRaw)) throw new LeadError(503, "unavailable");
  let token = options.token;
  if (token !== undefined) { if (!/^[0-9]{6,}:[A-Za-z0-9_-]{20,}$/.test(token)) throw new LeadError(503, "unavailable"); }
  else { if (!tokenFile) throw new LeadError(503, "unavailable"); const tokenInfo = await stat(tokenFile); if (process.platform !== "win32" && (tokenInfo.mode & 0o077) !== 0) throw new LeadError(503, "unavailable"); token = (await readFile(tokenFile, "utf8")).trim(); if (!/^[0-9]{6,}:[A-Za-z0-9_-]{20,}$/.test(token)) throw new LeadError(503, "unavailable"); }
  return withLock(cfg.dir, async () => {
    const now = options.now ?? new Date(), day = now.toISOString().slice(0, 10);
    const pending = await withLock(cfg.dir, async () => {
      const state = await loadState(cfg.file, day), item = Object.values(state.leads).filter(x => x.notification === "pending" && (!x.nextAttemptAt || Date.parse(x.nextAttemptAt) <= now.getTime())).sort((a,b) => a.createdAt.localeCompare(b.createdAt))[0];
      if (!item) return undefined;
      item.notification = "ambiguous"; delete item.nextAttemptAt; await saveState(cfg.file, state); return { ...item };
    });
    if (!pending) return { outcome: "empty" as const };
    const alternateChannel = pending.contactType === "email" ? "whatsapp" : "email";
    const text = [`Nora | ${pending.intent === "nora_demo" ? "Novo acesso à demonstração" : "Novo pedido no site JE4NDEV"}`, `Responsável pelo retorno: Jean`, `Ação: revisar o resumo e responder pelo contato escolhido. Aviso entregue não significa cliente atendido.`, `Nome: ${pending.name}`, `Contato (${pending.contactType}): ${pending.contact}`, ...(pending.alternateContact ? [`Contato alternativo (${alternateChannel}): ${pending.alternateContact}`] : []), `Pedido: ${pending.conversation?.summary ?? pending.summary}`, `Idioma/origem: ${pending.locale} ${pending.sourcePath}`, `Referência: ${leadReference(pending.leadId)}`, `Protocolo: ${pending.leadId}`, `Se o cliente continuar no WhatsApp com este protocolo, trate como o mesmo pedido.`].join("\n");
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 8000);
    let outcome: "sent" | "ambiguous" | "retry" = "ambiguous", retryAt: string | undefined, delivery: { messageId: number; chatId: string } | undefined;
    try {
      const response = await (options.fetcher ?? fetch)(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", redirect: "error", signal: controller.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chatRaw, text: text.slice(0, 4000), disable_web_page_preview: true, protect_content: true }) });
      let payload: TelegramReply; try { payload = await response.json() as TelegramReply; } catch { payload = { ok: false }; }
      if (response.status === 429 && payload.ok === false && payload.error_code === 429) { const seconds = Math.max(1, Number.isSafeInteger(payload.parameters?.retry_after) ? payload.parameters!.retry_after! : 60); if (seconds <= 86400) { outcome = "retry"; retryAt = new Date((options.now?.getTime() ?? Date.now()) + seconds * 1000).toISOString(); } }
      else if (response.ok && payload.ok === true && Number.isSafeInteger(payload.result?.message_id) && payload.result!.message_id! > 0 && String(payload.result?.chat?.id) === chatRaw && payload.result?.chat?.type === "private") { outcome = "sent"; delivery = { messageId: payload.result!.message_id!, chatId: String(payload.result!.chat!.id) }; }
    } catch { /* Transport failures are ambiguous; never resend automatically. */ } finally { clearTimeout(timer); }
    await withLock(cfg.dir, async () => {
      const state = await loadState(cfg.file, day), current = state.leads[pending.requestId];
      if (!current || current.leadId !== pending.leadId || current.notification !== "ambiguous") return;
      if (outcome === "sent") { current.notification = "sent"; current.delivery = delivery; delete current.nextAttemptAt; }
      else if (outcome === "retry") { current.notification = "pending"; current.nextAttemptAt = retryAt; }
      await saveState(cfg.file, state);
    });
    return { outcome: outcome === "retry" ? "queued" as const : outcome, leadId: pending.leadId, ...(retryAt ? { nextAttemptAt: retryAt } : {}) };
  }, "telegram-dispatch.lock");
}

const DEFAULT_LEAD_RETENTION_DAYS = 90;
const MAX_LEAD_RETENTION_DAYS = 3650;

/** Remove only leads older than the retention window with a confirmed Telegram receipt. */
export async function prunePortfolioLeads(options: { env?: NodeJS.ProcessEnv; now?: Date; retentionDays?: number } = {}) {
  const env = options.env ?? process.env;
  const cfg = await prepare(env);
  const now = options.now ?? new Date();
  const retentionDays = options.retentionDays ?? DEFAULT_LEAD_RETENTION_DAYS;
  if (!Number.isFinite(now.getTime()) || !Number.isSafeInteger(retentionDays) || retentionDays < 1 || retentionDays > MAX_LEAD_RETENTION_DAYS) throw new LeadError(400, "invalid_retention");
  const cutoff = now.getTime() - retentionDays * 24 * 60 * 60 * 1000;
  return withLock(cfg.dir, async () => {
    const state = await loadState(cfg.file, "0000-00-00");
    const removed: string[] = [];
    for (const [id, lead] of Object.entries(state.leads)) {
      const delivery = lead.delivery;
      const confirmed = lead.notification === "sent" && !!delivery && Number.isSafeInteger(delivery.messageId) && delivery.messageId > 0 && typeof delivery.chatId === "string" && /^\d+$/.test(delivery.chatId) && Number.isSafeInteger(Number(delivery.chatId)) && Number(delivery.chatId) > 0;
      if (confirmed && lead.conversation?.sheets !== "pending" && Date.parse(lead.conversation?.updatedAt ?? lead.createdAt) < cutoff) {
        delete state.leads[id];
        removed.push(id);
      }
    }
    if (removed.length) await saveState(cfg.file, state);
    return { removed: removed.length, cutoff: new Date(cutoff).toISOString() };
  });
}

import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
/** Server-only Turnstile validation. The browser receives only the public sitekey. */
export class ProtectionError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}

const TEST_KEYS = /^(?:1x|2x|3x)0{18,}/;
const ACTION = "nora_chat";
export function noraProtection(env: NodeJS.ProcessEnv = process.env) {
  let hostname = "";
  try { hostname = new URL(env.HERMES_CONCIERGE_ORIGIN || "").hostname; } catch { /* missing origin is checked by ingress */ }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  const siteKey = env.HERMES_CONCIERGE_TURNSTILE_SITE_KEY;
  const secret = env.HERMES_CONCIERGE_TURNSTILE_SECRET_KEY;
  const testMode = env.HERMES_CONCIERGE_TURNSTILE_TEST_MODE === "1";
  const required = !!siteKey || !!secret || env.HERMES_CONCIERGE_TURNSTILE_REQUIRED === "1" || (env.NODE_ENV === "production" && !local);
  if (!required) return null;
  if (!hostname || !siteKey || !secret || (testMode && (!local || !TEST_KEYS.test(siteKey) || !TEST_KEYS.test(secret))) || (!testMode && (TEST_KEYS.test(siteKey) || TEST_KEYS.test(secret)))) throw new ProtectionError(503, "protection_unavailable");
  return { siteKey, secret, hostname, testMode, action: ACTION };
}

/** Invalid tokens still spend a cheap IP attempt; they cannot monopolize model slots. */
export async function rateNoraVerification(request: Request, env: NodeJS.ProcessEnv, now = new Date()) {
  if (!noraProtection(env)) return;
  const dir = env.HERMES_CONCIERGE_STATE_DIR, salt = env.HERMES_CONCIERGE_SALT, ip = request.headers.get("x-real-ip");
  if (!dir || !salt || !ip || ip.length>128) throw new ProtectionError(503,"protection_unavailable");
  await mkdir(dir,{recursive:true});
  const file=path.join(dir,"nora-verification-attempts.json"), lock=`${file}.lock`, temp=`${file}.${randomUUID()}.tmp`;
  const until=Date.now()+2000;let handle:Awaited<ReturnType<typeof open>>|undefined;
  while(!handle) {
    try { handle=await open(lock,"wx",0o600); }
    catch(error) {if((error as NodeJS.ErrnoException).code!=="EEXIST"||Date.now()>=until)throw new ProtectionError(503,"protection_unavailable");await new Promise(resolve=>setTimeout(resolve,20));}
  }
  try {
    let state:Record<string,number[]>={};
    try {
      if((await stat(file)).size>4_000_000)throw new Error("invalid state");
      const value=JSON.parse(await readFile(file,"utf8"));
      if(!value||typeof value!=="object"||Array.isArray(value)||Object.keys(value).length>10000||Object.entries(value).some(([key,times])=>!/^[a-f0-9]{64}$/.test(key)||!Array.isArray(times)||times.length>20||times.some(t=>!Number.isSafeInteger(t)||t<0||t>now.getTime())))throw new Error("invalid state");
      state=value;
    } catch(error) {if((error as NodeJS.ErrnoException).code!=="ENOENT")throw new ProtectionError(503,"protection_unavailable");}
    state=Object.fromEntries(Object.entries(state).map(([key,times])=>[key,times.filter(t=>t>now.getTime()-60_000)]).filter(([,times])=>(times as number[]).length>0));
    const key=createHash("sha256").update(`${salt}:${ip}`).digest("hex"), recent=state[key]??[];
    if(recent.length>=20||Object.keys(state).length>=10000)throw new ProtectionError(429,"busy");
    state[key]=[...recent,now.getTime()];
    const writer=await open(temp,"wx",0o600);try{await writer.writeFile(JSON.stringify(state));await writer.sync();}finally{await writer.close();}
    await rename(temp,file);
  } finally {await rm(temp,{force:true}).catch(()=>undefined);await handle.close();await rm(lock,{force:true});}
}

export async function verifyNoraProtection(request: Request, env: NodeJS.ProcessEnv, fetcher: typeof fetch = fetch) {
  const protection = noraProtection(env);
  if (!protection) return;
  const token = request.headers.get("x-nora-turnstile");
  if (!token || token.length > 2048) throw new ProtectionError(403, "verification_required");
  try {
    const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(5_000),
      headers: { "content-type": "application/json" },
      // Do not disclose the visitor's address, session token or conversation.
      body: JSON.stringify({ secret: protection.secret, response: token }),
    });
    if (!response.ok) throw new ProtectionError(503, "protection_unavailable");
    if (!response.body) throw new ProtectionError(503, "protection_unavailable");
    const reader = response.body.getReader(), chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 4096) throw new ProtectionError(503, "protection_unavailable");
        chunks.push(value);
      }
    } finally { void reader.cancel().catch(() => undefined); reader.releaseLock(); }
    const text = Buffer.concat(chunks).toString("utf8");
    const result = JSON.parse(text) as { success?: unknown; hostname?: unknown; action?: unknown };
    if (result.success !== true || (!protection.testMode && (result.hostname !== protection.hostname || result.action !== protection.action))) throw new ProtectionError(403, "verification_required");
  } catch (error) {
    if (error instanceof ProtectionError) throw error;
    throw new ProtectionError(503, "protection_unavailable");
  }
}

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, open, readFile, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { conciergeLimits } from "./limits";
import { noraProtection } from "./protection";
import { MEMORY_FIELDS, type MemoryField, type MemoryProject, type VisitorAction, type VisitorSnapshot } from "./visitor-contract";

export class VisitorError extends Error { constructor(public status: number, public code: string) { super(code); } }
const COOKIE = "nora_visitor", MAX_PROJECTS = 5, MAX_FACT = 500, MAX_TITLE = 80, SESSION_LIMIT = 100_000, MAX_RECORDED_TURNS = 1_000_000;
const MAX_STORE_BYTES = 32_000_000, MEMORY_TTL = 30 * 86_400_000, ACCOUNT_LIMIT = 10_000, RECOVERY_WINDOW = 15 * 60_000;
type Memory = Omit<VisitorSnapshot["memory"], "linked">;
type Session = { id: string; createdAt: string; expiresAt: string; tier: "anonymous"|"registered"; profile?: VisitorSnapshot["profile"]; day: string; used: number; memory: Memory; version: number; accountId?: string };
type Account = { phoneHash: string; codeHash: string; memory: Memory; version: number };
type Store = { sessions: Record<string, Session>; issued: Record<string, number[]>; registrations?: Record<string,{leadId:string;owner:string}>; accounts?: Record<string,Account>; recoveryAttempts?: Record<string,number[]> };
const emptyMemory = ():Memory => ({enabled:false,expiresAt:null,activeProjectId:null,projects:[]});
const expiry = (now:Date) => new Date(now.getTime()+MEMORY_TTL).toISOString();
function memoryOf(s:Session,store:Store):Memory { return (s.accountId && store.accounts?.[s.accountId]?.memory) || s.memory; }
function memoryVersion(s:Session,store:Store) { return (s.accountId ? store.accounts?.[s.accountId]?.version : undefined) ?? s.version; }
function bumpMemory(s:Session,store:Store) { const a=s.accountId?store.accounts?.[s.accountId]:undefined;if(a)a.version++;else s.version++; }
function disconnectMemory(s:Session,store:Store) { const a=s.accountId?store.accounts?.[s.accountId]:undefined;if(a)a.version++;s.version=Math.max(s.version,a?.version??0)+1;delete s.accountId;s.memory=emptyMemory(); }
function forgetAccount(store:Store,id:string) { const a=store.accounts?.[id];for(const s of Object.values(store.sessions))if(s.accountId===id){s.version=Math.max(s.version,a?.version??0)+1;delete s.accountId;s.memory=emptyMemory();}if(store.accounts)delete store.accounts[id]; }
function recoveryHash(salt:string,kind:"account"|"phone"|"code",value:string) { return createHmac("sha256",salt).update(`nora-memory-${kind}:${value}`).digest("hex"); }
function equalHash(a:string,b:string) { const left=Buffer.from(a,"hex"),right=Buffer.from(b,"hex");return left.length===32&&right.length===32&&timingSafeEqual(left,right); }
function validMemory(m:unknown):m is Memory { if(!m||typeof m!=="object")return false;const x=m as Memory;return typeof x.enabled==="boolean"&&(x.expiresAt===null||Number.isFinite(Date.parse(x.expiresAt)))&&(x.activeProjectId===null||typeof x.activeProjectId==="string")&&Array.isArray(x.projects)&&x.projects.length<=MAX_PROJECTS; }
function validAccount(a:unknown):a is Account { if(!a||typeof a!=="object")return false;const x=a as Account;return /^[a-f0-9]{64}$/.test(x.phoneHash)&&/^[a-f0-9]{64}$/.test(x.codeHash)&&validMemory(x.memory)&&x.memory.enabled&&!!x.memory.expiresAt&&Number.isSafeInteger(x.version)&&x.version>=0; }
function config(env: NodeJS.ProcessEnv) { const dir = env.HERMES_CONCIERGE_STATE_DIR, salt = env.HERMES_CONCIERGE_SALT; if (!dir || !salt || salt.length < 16) throw new VisitorError(503,"unavailable"); return { dir: path.resolve(dir), salt }; }
function digest(token: string) { return createHash("sha256").update(token).digest("hex"); }
function csrf(token: string, salt: string) { return createHmac("sha256", salt).update(`nora-csrf:${token}`).digest("hex"); }
function today(now: Date) { return now.toISOString().slice(0,10); }
function nextDay(now: Date) { const d=new Date(now); d.setUTCHours(24,0,0,0); return d.toISOString(); }
function validSession(s: unknown): s is Session { if(!s||typeof s!=="object")return false; const x=s as Session; return /^[a-f0-9]{64}$/.test(x.id)&&Number.isFinite(Date.parse(x.createdAt))&&Number.isFinite(Date.parse(x.expiresAt))&&["anonymous","registered"].includes(x.tier)&&/^\d{4}-\d\d-\d\d$/.test(x.day)&&Number.isSafeInteger(x.used)&&x.used>=0&&x.used<=MAX_RECORDED_TURNS&&validMemory(x.memory)&&Number.isSafeInteger(x.version)&&x.version>=0&&(x.accountId===undefined||/^[a-f0-9]{64}$/.test(x.accountId)); }
async function persistStore(file:string,store:Store) {
 const json=JSON.stringify(store);if(Buffer.byteLength(json,"utf8")>MAX_STORE_BYTES||Object.keys(store.sessions).length>SESSION_LIMIT||Object.keys(store.accounts??{}).length>ACCOUNT_LIMIT||Object.keys(store.recoveryAttempts??{}).length>SESSION_LIMIT*2)throw new VisitorError(503,"temporarily_unavailable");
 const tmp=`${file}.${randomBytes(8).toString("hex")}.tmp`;
 try { const h=await open(tmp,"wx",0o600);try{await h.writeFile(json);await h.sync()}finally{await h.close()}await rename(tmp,file); }
 finally { await rm(tmp,{force:true}).catch(()=>{}); }
}
async function locked<T>(env: NodeJS.ProcessEnv, fn:(store:Store)=>Promise<T>, now=new Date()):Promise<T>{ const {dir}=config(env); await mkdir(dir,{recursive:true}); const file=path.join(dir,"visitor-state.json"), lock=path.join(dir,"visitor-state.lock"); let h:Awaited<ReturnType<typeof open>>|undefined; const end=Date.now()+2500; while(!h){try{h=await open(lock,"wx",0o600)}catch(e){if((e as NodeJS.ErrnoException).code!=="EEXIST")throw new VisitorError(503,"temporarily_unavailable");if(Date.now()>end)throw new VisitorError(503,"temporarily_unavailable");await new Promise(r=>setTimeout(r,20));}}
 try { let s:Store={sessions:{},issued:{}}; try{if((await stat(file)).size>MAX_STORE_BYTES)throw 0;const raw=JSON.parse(await readFile(file,"utf8")) as Store;if(!raw||!raw.sessions||!raw.issued||Object.keys(raw.sessions).length>SESSION_LIMIT)throw 0;for(const [id,x] of Object.entries(raw.sessions))if(id!==x.id||!validSession(x))throw 0;if(raw.accounts&&(Object.keys(raw.accounts).length>ACCOUNT_LIMIT||Object.entries(raw.accounts).some(([id,a])=>!(/^[a-f0-9]{64}$/.test(id)&&validAccount(a)))))throw 0;if(raw.recoveryAttempts&&(Object.keys(raw.recoveryAttempts).length>SESSION_LIMIT*2||Object.entries(raw.recoveryAttempts).some(([id,t])=>!/^([si]):[a-f0-9]{64}$/.test(id)||!Array.isArray(t)||t.length>20||t.some(n=>!Number.isFinite(n)))))throw 0;s=raw;}catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw new VisitorError(503,"temporarily_unavailable");}
 const beforePrune=JSON.stringify(s);
 for(const [id,a] of Object.entries(s.accounts??{}))if(Date.parse(a.memory.expiresAt!)<=now.getTime())forgetAccount(s,id);
 for(const [id,x] of Object.entries(s.sessions)) {
 if(Date.parse(x.expiresAt)<=now.getTime()) { delete s.sessions[id]; continue; }
 if(x.accountId&&!s.accounts?.[x.accountId])disconnectMemory(x,s);
 if(!x.accountId&&x.memory.expiresAt && Date.parse(x.memory.expiresAt)<=now.getTime()) { x.memory=emptyMemory(); x.version++; }
 }
 for(const [ip,times] of Object.entries(s.issued)){const recent=times.filter(t=>t>now.getTime()-86_400_000);if(recent.length)s.issued[ip]=recent;else delete s.issued[ip];}
 for(const [key,times] of Object.entries(s.recoveryAttempts??{})){const recent=times.filter(t=>t>now.getTime()-RECOVERY_WINDOW);if(recent.length)s.recoveryAttempts![key]=recent;else delete s.recoveryAttempts![key];}
 // Commit ONLY maintenance before the operation: a rejected mutation must
 // not persist partial business edits, but must not undo expiry deletion.
 if(JSON.stringify(s)!==beforePrune)await persistStore(file,s);
 const out=await fn(s); await persistStore(file,s); return out;
 } finally { await h.close().catch(()=>{}); await rm(lock,{force:true}); } }
function cookieToken(req:Request){const raw=req.headers.get("cookie")||"";const match=raw.split(/;\s*/).find(v=>v.startsWith(`${COOKIE}=`));return match?.slice(COOKIE.length+1)||null;}
export function visitorCookie(token:string,secure:boolean){return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure?"; Secure":""}`;}
export function visitorIdFromRequest(req:Request,env=process.env){const token=cookieToken(req);if(!token||!/^[A-Za-z0-9_-]{40,60}$/.test(token))throw new VisitorError(401,"session_expired");return {token,id:digest(token),csrf:csrf(token,config(env).salt)};}
export function assertCsrf(req:Request,env=process.env,now=new Date()){void now;const proof=visitorIdFromRequest(req,env), got=Buffer.from(req.headers.get("x-nora-csrf")||""), want=Buffer.from(proof.csrf);if(got.length!==want.length||!timingSafeEqual(got,want))throw new VisitorError(403,"csrf_required");return proof;}
function snapshot(s:Session,token:string,salt:string,now:Date,env:NodeJS.ProcessEnv=process.env,store?:Store):VisitorSnapshot {
 const used=s.day>=today(now)?s.used:0,limit=conciergeLimits(env).sessionDaily, protection=noraProtection(env);
 return {csrfToken:csrf(token,salt),...(protection?{protection:{siteKey:protection.siteKey}}:{}),registrationRequired:registrationRequired(env),...(s.profile?{profile:s.profile}:{}),tier:s.tier,quota:{limit,used,remaining:Math.max(0,limit-used),resetsAt:nextDay(now)},memory:{...(store?memoryOf(s,store):s.memory),linked:!!(store&&s.accountId&&store.accounts?.[s.accountId])}};
}
export const registrationRequired = (env: NodeJS.ProcessEnv = process.env) => env.HERMES_CONCIERGE_REQUIRE_REGISTRATION === "1" || env.NODE_ENV === "production";
function checkOrigin(req:Request,env:NodeJS.ProcessEnv){const origin=req.headers.get("origin"),proof=Buffer.from(req.headers.get("x-concierge-proxy")||""),key=Buffer.from(env.HERMES_CONCIERGE_PROXY_KEY||"");try{if(!origin||!env.HERMES_CONCIERGE_ORIGIN||new URL(origin).origin!==new URL(env.HERMES_CONCIERGE_ORIGIN).origin)throw 0;}catch{throw new VisitorError(403,"forbidden");}if(key.length<16||proof.length!==key.length||!timingSafeEqual(proof,key))throw new VisitorError(403,"forbidden");}
async function readVisitorBody(req:Request){if(!req.body)throw new VisitorError(400,"invalid_request");const reader=req.body.getReader(),parts:Uint8Array[]=[];let size=0,timer:ReturnType<typeof setTimeout>|undefined;try{const deadline=new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new VisitorError(408,"request_timeout")),5000)});for(;;){const {done,value}=await Promise.race([reader.read(),deadline]);if(done)break;size+=value.byteLength;if(size>8192)throw new VisitorError(413,"request_too_large");parts.push(value)}}finally{clearTimeout(timer);void reader.cancel().catch(()=>{});reader.releaseLock()}const all=new Uint8Array(size);let at=0;for(const part of parts){all.set(part,at);at+=part.length}try{return new TextDecoder("utf-8",{fatal:true}).decode(all)}catch{throw new VisitorError(400,"invalid_request")}}
export async function processVisitorRequest(req:Request,env=process.env,now=new Date()):Promise<{snapshot:VisitorSnapshot;setCookie?:string;recoveryCode?:string}> {
 checkOrigin(req,env);const salt=config(env).salt;
 if(!req.headers.get("content-type")?.toLowerCase().startsWith("application/json"))throw new VisitorError(415,"invalid_request");
 const len=req.headers.get("content-length");if(len&&(!/^\d+$/.test(len)||+len>8192))throw new VisitorError(413,"request_too_large");
 let body:unknown;try{body=JSON.parse(await readVisitorBody(req))}catch(e){if(e instanceof VisitorError)throw e;throw new VisitorError(400,"invalid_request")}
 const valid=(v:unknown):v is VisitorAction=>{if(!v||typeof v!=="object"||Array.isArray(v))return false;const x=v as Record<string,unknown>;switch(x.action){
 case"bootstrap":case"linkMemory":case"forgetAll":return Object.keys(x).length===1;
 case"restoreMemory":return Object.keys(x).length===3&&x.consent===true&&typeof x.code==="string"&&x.code.length<=128;
 case"consent":return Object.keys(x).length===2&&typeof x.enabled==="boolean";
 case"save":return Object.keys(x).length===4&&typeof x.projectId==="string"&&typeof x.title==="string"&&!!x.facts&&typeof x.facts==="object"&&!Array.isArray(x.facts)&&Object.keys(x.facts).every(k=>MEMORY_FIELDS.includes(k as MemoryField))&&Object.values(x.facts as Record<string,unknown>).every(v=>typeof v==="string"&&v.length<=MAX_FACT);
 case"createProject":return Object.keys(x).length===2&&typeof x.title==="string"&&x.title.trim().length>0&&x.title.length<=MAX_TITLE&&eligibleFact(x.title);
 case"selectProject":case"forgetProject":return Object.keys(x).length===2&&typeof x.projectId==="string";
 default:return false;}};
 if(!valid(body))throw new VisitorError(400,"invalid_request");const a=body;
 let token=cookieToken(req),created=false;if(a.action==="bootstrap"&&!token){token=randomBytes(32).toString("base64url");created=true;}else if(!token)throw new VisitorError(401,"session_expired");
 if(!/^[A-Za-z0-9_-]{40,60}$/.test(token))throw new VisitorError(401,"session_expired");const id=digest(token);
 if(a.action!=="bootstrap"&&assertCsrf(req,env,now).id!==id)throw new VisitorError(401,"session_expired");
 const ip=req.headers.get("x-real-ip");if((created||a.action==="restoreMemory")&&(!ip||ip.length>128))throw new VisitorError(503,"temporarily_unavailable");
 // Canonical contact lookup acquires its own locks; never nest it inside visitor-state.lock.
 const contact=a.action==="linkMemory"||a.action==="restoreMemory"?await (await import("../leads/leads")).getRegisteredLeadContact(req,env,now):null;
 const result=await locked(env,async store=>{
  let s=store.sessions[id];if(created){const ipKey=createHash("sha256").update(`${salt}:${ip}`).digest("hex"),recent=store.issued[ipKey]??[];
   if(recent.length>=300)throw new VisitorError(429,"rate_limited");if(Object.keys(store.sessions).length>=SESSION_LIMIT)throw new VisitorError(503,"temporarily_unavailable");
   store.issued[ipKey]=[...recent,now.getTime()];s={id,createdAt:now.toISOString(),expiresAt:expiry(now),tier:"anonymous",day:today(now),used:0,memory:emptyMemory(),version:0};store.sessions[id]=s;
  }else if(!s)throw new VisitorError(401,"session_expired");
  if(s.day<today(now)){s.day=today(now);s.used=0;}else if(s.day>today(now))throw new VisitorError(503,"temporarily_unavailable");
  let recoveryCode:string|undefined;
  if(a.action==="linkMemory"||a.action==="restoreMemory"){
   if(!contact||s.tier!=="registered"||s.profile?.leadId!==contact.leadId)throw new VisitorError(401,"registration_required");
   const phoneHash=recoveryHash(salt,"phone",contact.whatsapp),existing=s.accountId?store.accounts?.[s.accountId]:undefined;
   // A changed canonical phone may never keep access to the previous account.
   if(existing&&!equalHash(existing.phoneHash,phoneHash))disconnectMemory(s,store);
   if(a.action==="linkMemory"){
    if(s.accountId)return {snapshot:snapshot(s,token,salt,now,env,store)};
    if(!s.memory.enabled)return {error:new VisitorError(409,"memory_disabled")};
    store.accounts??={};if(Object.keys(store.accounts).length>=ACCOUNT_LIMIT)return {error:new VisitorError(503,"temporarily_unavailable")};
    recoveryCode=`NORA-${randomBytes(32).toString("base64url")}`;
    const accountId=recoveryHash(salt,"account",recoveryCode);
    store.accounts[accountId]={phoneHash,codeHash:recoveryHash(salt,"code",recoveryCode),memory:s.memory,version:s.version+1};
    s.accountId=accountId;s.memory=emptyMemory();
   }else{
    store.recoveryAttempts??={};const sessionKey=`s:${s.id}`,ipKey=`i:${recoveryHash(salt,"phone",ip!)}`;
    const sessionAttempts=store.recoveryAttempts[sessionKey]??[],ipAttempts=store.recoveryAttempts[ipKey]??[];
    if(sessionAttempts.length>=5||ipAttempts.length>=20)return {error:new VisitorError(429,"recovery_rate_limited")};
    store.recoveryAttempts[sessionKey]=[...sessionAttempts,now.getTime()];store.recoveryAttempts[ipKey]=[...ipAttempts,now.getTime()];
    const code=a.code.trim(),accountId=recoveryHash(salt,"account",code),account=store.accounts?.[accountId],zero="0".repeat(64);
    const phoneMatches=equalHash(account?.phoneHash??zero,phoneHash),codeMatches=equalHash(account?.codeHash??zero,recoveryHash(salt,"code",code));
    if(!/^NORA-[A-Za-z0-9_-]{43}$/.test(code)||!account||!phoneMatches||!codeMatches)return {error:new VisitorError(400,"invalid_recovery")};
    if(s.accountId!==accountId){disconnectMemory(s,store);account.version=Math.max(account.version,s.version)+1;s.accountId=accountId;s.memory=emptyMemory();}
   }
  }else{
   const memory=memoryOf(s,store);
   if(a.action==="consent"){
    if(!a.enabled)disconnectMemory(s,store);
    else{memory.enabled=true;memory.expiresAt=expiry(now);if(memory.projects.length===0){const p={id:randomBytes(12).toString("hex"),title:"My project",facts:{}};memory.projects.push(p);memory.activeProjectId=p.id;}bumpMemory(s,store);}
   }else if(a.action==="createProject"){
    if(!memory.enabled)throw new VisitorError(409,"memory_disabled");if(memory.projects.length>=MAX_PROJECTS)throw new VisitorError(409,"project_limit");
    const p={id:randomBytes(12).toString("hex"),title:a.title.trim(),facts:{}};memory.projects.push(p);memory.activeProjectId=p.id;memory.expiresAt=expiry(now);bumpMemory(s,store);
   }else if(a.action==="selectProject"){
    if(!memory.projects.some(p=>p.id===a.projectId))throw new VisitorError(404,"project_not_found");memory.activeProjectId=a.projectId;bumpMemory(s,store);
   }else if(a.action==="forgetProject"){
    memory.projects=memory.projects.filter(p=>p.id!==a.projectId);if(memory.activeProjectId===a.projectId)memory.activeProjectId=memory.projects[0]?.id??null;bumpMemory(s,store);
   }else if(a.action==="forgetAll"){
    if(s.accountId)forgetAccount(store,s.accountId);else disconnectMemory(s,store);
   }else if(a.action==="save"){
    if(!memory.enabled)throw new VisitorError(409,"memory_disabled");const p=memory.projects.find(p=>p.id===a.projectId);if(!p)throw new VisitorError(404,"project_not_found");
    if(!a.title.trim()||a.title.length>MAX_TITLE||!eligibleFact(a.title))throw new VisitorError(400,"invalid_request");
    for(const value of Object.values(a.facts))if(value?.trim()&&!eligibleFact(value.trim()))throw new VisitorError(400,"invalid_memory_fact");
    p.title=a.title.trim();for(const [k,v] of Object.entries(a.facts)){const val=v!.trim();if(!val)delete p.facts[k as MemoryField];else p.facts[k as MemoryField]={value:val.slice(0,MAX_FACT),source:"visitor_edit",updatedAt:now.toISOString()};}
    memory.activeProjectId=p.id;memory.expiresAt=expiry(now);bumpMemory(s,store);
   }
  }
  return {snapshot:snapshot(s,token,salt,now,env,store),...(recoveryCode?{recoveryCode}:{})};
 },now);
 // Rate counters and phone-change disconnection must survive rejected recovery attempts.
 if(result.error)throw result.error;
 return {snapshot:result.snapshot!,...(result.recoveryCode?{recoveryCode:result.recoveryCode}:{}),...(created?{setCookie:visitorCookie(token,new URL(req.url).protocol==="https:"||!!env.HERMES_CONCIERGE_ORIGIN?.startsWith("https:"))}:{})};
}
export async function loadVisitorForChat(req:Request,env=process.env,now=new Date(),admit?:()=>Promise<void>,expectedProjectId?:string|null) {
 const proof=assertCsrf(req,env,now),salt=config(env).salt;
 return locked(env,async store=>{
  const s=store.sessions[proof.id];if(!s)throw new VisitorError(401,"session_expired");
  if(registrationRequired(env) && (!s.profile?.name || !s.profile.hasWhatsApp))throw new VisitorError(401,"registration_required");
  if(s.day<today(now)){s.day=today(now);s.used=0;}else if(s.day>today(now))throw new VisitorError(503,"temporarily_unavailable");
  const memory=memoryOf(s,store),active=memory.enabled?memory.projects.find(p=>p.id===memory.activeProjectId):undefined;
  if(expectedProjectId!==undefined && expectedProjectId!==(active?.id??null))throw new VisitorError(409,"context_changed");
  if(s.used>=conciergeLimits(env).sessionDaily)throw new VisitorError(429,"rate_limited");
  if(admit)await admit();s.used++;
  return {snapshot:snapshot(s,proof.token,salt,now,env,store),project:active?JSON.parse(JSON.stringify(active)) as MemoryProject:undefined,version:memoryVersion(s,store)};
 },now);
}
/** Called only after canonical lead persistence and idempotency checks succeed. */
export async function upgradeVisitor(req:Request,leadId:string,requestId:string,env=process.env,now=new Date(),profile?:VisitorSnapshot["profile"]) {
 const proof=assertCsrf(req,env,now);
 if(!/^[0-9a-f-]{36}$/i.test(leadId)||!/^[0-9a-f-]{36}$/i.test(requestId))throw new VisitorError(400,"invalid_request");
 if(profile && (!profile.name.trim() || profile.name.length>100 || /[\u0000-\u001f\u007f-\u009f]/.test(profile.name) || profile.leadId!==leadId || typeof profile.hasWhatsApp!=="boolean"))throw new VisitorError(400,"invalid_request");
 return locked(env,async store=>{
  const s=store.sessions[proof.id];if(!s)throw new VisitorError(401,"session_expired");
  store.registrations??={};const old=store.registrations[requestId];
  if(old&&(old.leadId!==leadId||old.owner!==proof.id))throw new VisitorError(409,"registration_owner_conflict");
  if(!old)store.registrations[requestId]={leadId,owner:proof.id};
  if(s.day<today(now)){s.day=today(now);s.used=0;}else if(s.day>today(now))throw new VisitorError(503,"temporarily_unavailable");
  if(profile&&s.accountId&&s.profile?.leadId!==profile.leadId)disconnectMemory(s,store);
  s.tier="registered";if(profile)s.profile={...profile,name:profile.name.trim()};
  return snapshot(s,proof.token,config(env).salt,now,env,store);
 },now);
}
function eligibleFact(value:string) {
 const digits=value.replace(/\D/g, "");
 return !/[\u0000-\u001f\u007f-\u009f]/.test(value) && digits.length<10 &&
 !/NORA-[A-Za-z0-9_-]+/i.test(value) &&
 !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(value) &&
 !/(password|senha|token|secret|credit card|cartão|bank account|conta bancária|diagn[oó]stico|medica[çc][aã]o|telefone|phone|e-mail|email)/i.test(value) &&
 !/(ignore|ignorar|revele|reveal|system prompt|developer message|instru[çc][oõ]es|\b(?:execute|exec|powershell|sudo)\b)/i.test(value);
}
export async function captureExplicitFacts(req:Request,env:NodeJS.ProcessEnv,projectId:string|undefined,turn:string,expectedVersion:number,now=new Date()) {
 if(!projectId)return;
 const found=new Map<MemoryField,string>();
 const patterns:[MemoryField,RegExp][]=[
 ["name",/^(?:my name is|meu nome é|me chamo)\s+(.{2,80})$/i],
 ["business",/^(?:my business is|my company is|meu negócio é|minha empresa é)\s+(.{2,120})$/i],
 ["goal",/^(?:my goal is|I want to|quero|meu objetivo é)\s+(.{3,200})$/i],
 ["tools",/^(?:I (?:now )?use|(?:agora )?uso|utilizo)\s+(.{2,120})$/i],
 ["constraints",/^(?:I cannot|I can't|não posso|restrição:)\s+(.{3,150})$/i],
 ["decisions",/^(?:I decided to|decidi)\s+(.{3,150})$/i],
 ["nextStep",/^(?:next step is|próximo passo é)\s+(.{3,150})$/i]
 ];
 // Conservative explicit statements only, not model-generated inference.
 // A quote/example/question is never a personal fact just because it matches.
 for(const clause of turn.split(/(?<=[.!;])\s+|\n+/).map(x=>x.trim().replace(/[.!;]+$/, "")).filter(Boolean)) {
   if(/[?"“”]/.test(clause))continue;
   for(const [field,re] of patterns) {const m=clause.match(re);if(m&&eligibleFact(m[1]))found.set(field,m[1].trim());}
 }
 if(!found.size)return;
 const proof=assertCsrf(req,env,now);
 await locked(env,async store=>{
   const s=store.sessions[proof.id];
   if(!s)return;const memory=memoryOf(s,store);
   if(!memory.enabled||memoryVersion(s,store)!==expectedVersion||memory.activeProjectId!==projectId)return;
   const proj=memory.projects.find(x=>x.id===projectId);if(!proj)return;
   for(const [field,value] of found)proj.facts[field]={value,source:"visitor_message",updatedAt:now.toISOString(),sourceRef:createHash("sha256").update(`${proof.id}:${now.toISOString()}:${turn}`).digest("hex")};
   memory.expiresAt=expiry(now);bumpMemory(s,store);
 },now);
}
export async function peekVisitorSnapshot(req:Request,env=process.env,now=new Date()){const p=visitorIdFromRequest(req,env);return locked(env,async store=>{const s=store.sessions[p.id];if(!s)throw new VisitorError(401,"session_expired");return snapshot(s,p.token,config(env).salt,now,env,store);},now);}
export function visitorErrorResponse(e:unknown){const x=e instanceof VisitorError?e:new VisitorError(503,"temporarily_unavailable");return Response.json({error:x.code}, {status:x.status,headers:{"cache-control":"no-store"}});}
export const visitorCookieName=COOKIE;

/** Explicit maintenance entry point for a supervised production scheduler. */
export async function pruneVisitorState(env=process.env,now=new Date()){await locked(env,async()=>undefined,now);}

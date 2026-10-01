import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ConciergeError, processConciergeRequest } from "./concierge";
import { processVisitorRequest, loadVisitorForChat, upgradeVisitor, VisitorError, peekVisitorSnapshot } from "./visitor";
import { ProtectionError, rateNoraVerification } from "./protection";
import { processLeadRequest, submitLead } from "../leads/leads";

async function setup() {
 const dir=await mkdtemp(path.join(os.tmpdir(),"nora-onboarding-"));
 const env:NodeJS.ProcessEnv={NODE_ENV:"test",HERMES_CONCIERGE_ORIGIN:"http://portfolio.test",HERMES_CONCIERGE_STATE_DIR:path.join(dir,"visitor"),PORTFOLIO_LEADS_STATE_DIR:path.join(dir,"leads"),HERMES_CONCIERGE_SALT:"synthetic-salt-long-enough",HERMES_CONCIERGE_PROXY_KEY:"synthetic-proxy-proof",HERMES_CONCIERGE_URL:"http://127.0.0.1:8181",HERMES_CONCIERGE_KEY:"synthetic-key",HERMES_CONCIERGE_REQUIRE_REGISTRATION:"1",HERMES_CONCIERGE_TURNSTILE_SITE_KEY:"synthetic-public-key",HERMES_CONCIERGE_TURNSTILE_SECRET_KEY:"synthetic-secret",HERMES_CONCIERGE_REASONING_EFFORT:"medium"};
 const base={origin:"http://portfolio.test","content-type":"application/json","x-real-ip":"192.0.2.44","x-concierge-proxy":"synthetic-proxy-proof"};
 const boot=await processVisitorRequest(new Request("http://portfolio.test/api/concierge/visitor",{method:"POST",headers:base,body:'{"action":"bootstrap"}'}),env);
 const headers={...base,cookie:boot.setCookie!.split(";")[0],"x-nora-csrf":boot.snapshot.csrfToken,"x-nora-turnstile":"synthetic-token"};
 const request=(body:unknown,extra:Record<string,string>={})=>new Request("http://portfolio.test/api/leads",{method:"POST",headers:{...headers,...extra},body:JSON.stringify(body)});
 const lead={requestId:randomUUID(),locale:"pt",name:"Ada Example",contactType:"whatsapp",contact:"+15550101444",summary:"Quero conhecer e testar Nora, sem pedir orçamento.",sourcePath:"/pt",consent:true,intent:"nora_demo"};
 return {dir,env,headers,request,lead,cleanup:()=>rm(dir,{recursive:true,force:true})};
}
const verification=(async()=>Response.json({success:true,hostname:"portfolio.test",action:"nora_chat"})) as typeof fetch;

test("anonymous and email-only sessions cannot spend model quota; WhatsApp profile unlocks it",async()=>{
 const f=await setup();try{
  let admitted=false;
  await assert.rejects(loadVisitorForChat(f.request({}),f.env,new Date(),async()=>{admitted=true;}),(e:unknown)=>e instanceof VisitorError&&e.code==="registration_required");assert.equal(admitted,false);
  const email=await processLeadRequest(f.request({...f.lead,contactType:"email",contact:"ada@example.com"}),f.env,new Date(),verification);
  await upgradeVisitor(f.request({}),email.leadId,f.lead.requestId,f.env,new Date(),email.visitorProfile);
  await assert.rejects(loadVisitorForChat(f.request({}),f.env),(e:unknown)=>e instanceof VisitorError&&e.code==="registration_required");
  assert.equal((await peekVisitorSnapshot(f.request({}),f.env)).quota.used,0);
  const body={...f.lead,requestId:randomUUID()};const saved=await processLeadRequest(f.request(body),f.env,new Date(),verification);
  await upgradeVisitor(f.request({}),saved.leadId,body.requestId,f.env,new Date(),saved.visitorProfile);
  let calls=0;
  const upstream=(async(_url:URL|RequestInfo,init?:RequestInit)=>{calls++;const payload=JSON.parse(String(init?.body));assert.equal(payload.model_options.reasoning_effort,"medium");assert.match(JSON.stringify(payload.messages),/Ada Example/);assert.doesNotMatch(JSON.stringify(payload.messages),/15550101444/);return Response.json({choices:[{message:{content:"Oi, Ada! Podemos explorar um assistente para seu site ou app."}}]});}) as typeof fetch;
  await processConciergeRequest(f.request({locale:"pt",messages:[{role:"user",content:"Como ter uma Nora no meu site?"}]}),{env:f.env,fetcher:upstream,protectionFetcher:verification});assert.equal(calls,1);
 }finally{await f.cleanup();}
});

test("invalid verification never executes a model call, and attempts have their own persistent cap",async()=>{
 const f=await setup();try{
  let calls=0;const fake=(async()=>{calls++;return Response.json({});}) as typeof fetch;
  await assert.rejects(processConciergeRequest(f.request({locale:"pt",messages:[{role:"user",content:"Oi"}]},{"x-nora-turnstile":""}),{env:f.env,fetcher:fake,protectionFetcher:verification}),(e:unknown)=>e instanceof ConciergeError&&e.code==="verification_required");assert.equal(calls,0);
  const now=new Date();for(let i=1;i<20;i++)await rateNoraVerification(f.request({}),f.env,now);
  await assert.rejects(rateNoraVerification(f.request({}),f.env,now),(e:unknown)=>e instanceof ProtectionError&&e.status===429);
  assert.doesNotMatch(await readFile(path.join(f.env.HERMES_CONCIERGE_STATE_DIR!,"nora-verification-attempts.json"),"utf8"),/192\.0\.2\.44/);
 }finally{await f.cleanup();}
});

test("idempotent lead retries reuse receipt without revalidating a consumed token",async()=>{
 const f=await setup();try{
  let calls=0;const verify=(async()=>{calls++;return Response.json({success:true,hostname:"portfolio.test",action:"nora_chat"});}) as typeof fetch;
  const first=await processLeadRequest(f.request(f.lead),f.env,new Date(),verify);
  const again=await processLeadRequest(f.request(f.lead,{"x-nora-turnstile":""}),f.env,new Date(),verify);
  assert.equal(first.leadId,again.leadId);assert.equal(calls,1);
  const store=JSON.parse(await readFile(path.join(f.env.PORTFOLIO_LEADS_STATE_DIR!,"portfolio-leads.json"),"utf8"));assert.equal(Object.keys(store.leads).length,1);assert.equal(store.demoTotal,1);assert.equal(store.total,0);
 }finally{await f.cleanup();}
});

test("slow verification holds no global lead persistence lock",async()=>{
 const f=await setup();try{
  let entered!:()=>void, release!:()=>void;
  const started=new Promise<void>(resolve=>{entered=resolve;}),pending=new Promise<void>(resolve=>{release=resolve;});
  const first=submitLead(f.lead,"192.0.2.44",f.env,new Date(),async()=>{entered();await pending;});await started;
  const second=await submitLead({...f.lead,requestId:randomUUID()},"198.51.100.1",f.env);assert.equal(second.saved,true);
  release();await first;
 }finally{await f.cleanup();}
});

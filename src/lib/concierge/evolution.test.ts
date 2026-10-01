import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { conciergeLimits } from "./limits";
import { parseAssistantEnvelope, processConciergeRequest } from "./concierge";
import { authorizeFixture } from "./test-fixture";
import { peekVisitorSnapshot, loadVisitorForChat, processVisitorRequest } from "./visitor";
import { visitorRequestPayload } from "../../components/concierge/visitor-ui";
import { formatConversationBrief } from "../../components/concierge/contact-intent";
const empty = { goal:"", situation:"", desiredSolution:"", constraints:"", openQuestions:"" };

test("bounded full request includes Unicode brief and never cuts latest visitor message",()=>{
 const messages: {role:"user"|"assistant";content:string}[]=[];
 for(let i=0;i<15;i++) messages.push({role:i%2?"assistant":"user",content:"界".repeat(i%2?2500:1100)});
 const brief=Object.fromEntries(Object.keys(empty).map(k=>[k,"界".repeat(500)]));
 const body=visitorRequestPayload("pt",messages,brief);
 assert.ok(Buffer.byteLength(JSON.stringify(body))<=16000);assert.deepEqual(body.messages.at(-1),messages.at(-1));assert.equal(body.messages[0].role,"user");
});
test("brief formatting uses real lines, explicit unknowns and reserves every field",()=>{
 const summary=formatConversationBrief({...empty,goal:"Quero uma loja virtual",openQuestions:"Integração com estoque"},"pt");
 assert.equal(summary.split("\n").length,5);assert.match(summary,/Não informado/);assert.doesNotMatch(summary,/\\n/);
 const full=formatConversationBrief(Object.fromEntries(Object.keys(empty).map(k=>[k,"x".repeat(500)])) as typeof empty,"en");assert.ok(full.length<=1500);assert.match(full,/Open questions:/);
});
test("structured output never displays malformed JSON or accepts assistant inventions",()=>{
 const turns=[{role:"user" as const,content:"Quero uma loja virtual"},{role:"assistant" as const,content:"Você quer um aplicativo caro"}];
 for(const raw of ['[{"private":"json"}]','```json\n{"reply":','{"brief":']) assert.match(parseAssistantEnvelope(raw,turns,undefined,"pt").reply,/Não consegui organizar/);
 const valid=JSON.stringify({reply:"Qual ferramenta usa hoje?",brief:{...empty,goal:turns[0].content}});
 assert.equal(parseAssistantEnvelope('Preface only\n'+valid,turns,undefined,"pt").brief?.goal,turns[0].content);
 assert.equal(parseAssistantEnvelope('```json\n'+valid+'\n```',turns,undefined,"pt").brief?.goal,turns[0].content);
 const invented=JSON.stringify({reply:"Entendi",brief:{...empty,goal:turns[1].content}});assert.equal(parseAssistantEnvelope(invented,turns,undefined,"pt").brief,undefined);
 assert.match(parseAssistantEnvelope('Here is your JSON: {"reply":"hi","brief":{',turns,undefined,"en").reply,/couldn't organize/);
 for(const fragment of ['Here is the object: {"rep','A truncated object: {','Prefix [','Text ```json']) assert.match(parseAssistantEnvelope(fragment,turns,undefined,"en").reply,/couldn't organize/);
 assert.equal(parseAssistantEnvelope('We can keep exploring without registration.',turns,undefined,"en").reply,'We can keep exploring without registration.');
 const stale={...empty,goal:"I need a brochure site"},latest="Correction: I need an ecommerce checkout, NOT a brochure site";
 const corrected=parseAssistantEnvelope(JSON.stringify({reply:"Sure",brief:stale}),[{role:"user",content:stale.goal},{role:"assistant",content:"Okay"},{role:"user",content:latest}],stale,"en");
 assert.notEqual(corrected.brief?.goal,stale.goal);assert.match(formatConversationBrief(corrected.brief||empty,"en",latest),/ecommerce checkout/);
 assert.ok(formatConversationBrief({...empty,goal:"x".repeat(500)},"pt","z".repeat(1200)).length<=1500);
});
test("quota defaults independent of registration; overrides are bounded and resolved per call",()=>{
 assert.equal(conciergeLimits({NODE_ENV:"test",}).sessionDaily,300);assert.equal(conciergeLimits({NODE_ENV:"test",}).globalDaily,3000);
 assert.equal(conciergeLimits({NODE_ENV:"test",HERMES_CONCIERGE_SESSION_DAILY_LIMIT:"40"}).sessionDaily,40);
 assert.equal(conciergeLimits({NODE_ENV:"test",HERMES_CONCIERGE_GLOBAL_DAILY_LIMIT:"999999999"}).globalDaily,100000);
 assert.equal(conciergeLimits({NODE_ENV:"test",HERMES_CONCIERGE_SESSION_DAILY_LIMIT:"-1"}).sessionDaily,300);
});
test("API propagates validated brief and reads legacy persisted usage without resetting on lowered cap",async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),"nora-evolution-"));
 const env={NODE_ENV:"test" as const,HERMES_CONCIERGE_ORIGIN:"http://portfolio.test",HERMES_CONCIERGE_PROXY_KEY:"qa-synthetic-ingress-proof",HERMES_CONCIERGE_SALT:"qa-salt-synthetic-long-enough",HERMES_CONCIERGE_STATE_DIR:dir,HERMES_CONCIERGE_URL:"http://127.0.0.1:8181",HERMES_CONCIERGE_KEY:"qa-key"};
 const headers={origin:"http://portfolio.test","content-type":"application/json","x-concierge-proxy":"qa-synthetic-ingress-proof","x-real-ip":"192.0.2.91"};
 try{
 const message="Preciso integrar meus pedidos";
 const req=await authorizeFixture(new Request("http://portfolio.test/api/concierge",{method:"POST",headers,body:JSON.stringify({locale:"pt",messages:[{role:"user",content:message}]})}),env);
 const before=await peekVisitorSnapshot(req,env);assert.equal(before.quota.limit,300);
 const reply=await processConciergeRequest(req,{env,fetcher:async()=>Response.json({choices:[{message:{content:JSON.stringify({reply:"Como chegam hoje?",brief:{...empty,goal:message}})}}]})});
 assert.equal(reply.brief?.goal,message);assert.equal(reply.content,"Como chegam hoje?");
 const again = () => new Request("http://portfolio.test/api/concierge",{method:"POST",headers:req.headers,body:JSON.stringify({locale:"pt",messages:[{role:"user",content:message}]})});
 let calls=0;
 const natural=await processConciergeRequest(again(),{env,fetcher:async()=>{calls++;return Response.json({choices:[{message:{content:"Podemos explorar sem cadastro."}}]});}});
 assert.equal(calls,1);assert.equal(natural.content,"Podemos explorar sem cadastro.");assert.equal(natural.brief,undefined);
 const mutate=(body:unknown)=>processVisitorRequest(new Request("http://portfolio.test/api/concierge/visitor",{method:"POST",headers:req.headers,body:JSON.stringify(body)}),env);
 const a=await mutate({action:"consent",enabled:true}),projectA=a.snapshot.memory.activeProjectId!;
 const b=await mutate({action:"createProject",title:"Project B"}),projectB=b.snapshot.memory.activeProjectId!;
 let admitted=false;await assert.rejects(loadVisitorForChat(req,env,new Date(),async()=>{admitted=true},projectA),e=>e instanceof Error&&e.message==="context_changed");assert.equal(admitted,false);
 assert.equal((await loadVisitorForChat(req,env,new Date(),undefined,projectB)).project?.id,projectB);
 await mutate({action:"forgetAll"});
 const file=path.join(dir,"visitor-state.json"),store=JSON.parse(await readFile(file,"utf8"));
 for(const session of Object.values(store.sessions) as {used:number}[])session.used=250;
 await writeFile(file,JSON.stringify(store));
 const lower={...env,HERMES_CONCIERGE_SESSION_DAILY_LIMIT:"100"};
 const snap=await peekVisitorSnapshot(req,lower);assert.equal(snap.quota.used,250);assert.equal(snap.quota.remaining,0);assert.equal(snap.quota.limit,100);
 await assert.rejects(loadVisitorForChat(req,lower));
 assert.equal((await peekVisitorSnapshot(req,env)).quota.used,250);
 }finally{await rm(dir,{recursive:true,force:true});}
});

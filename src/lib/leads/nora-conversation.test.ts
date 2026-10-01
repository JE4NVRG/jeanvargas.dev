import {test} from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,readFile,rm,writeFile} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {dispatchSheetsOutbox,getRegisteredLeadContact,prunePortfolioLeads,recordNoraConversation,submitLead} from "./leads";
import {processVisitorRequest,upgradeVisitor} from "../concierge/visitor";

const now = new Date("2026-10-01T12:00:00.000Z");
const input = {requestId:"00000000-0000-4000-8000-000000000071",locale:"pt" as const,name:"Ada QA",contactType:"whatsapp" as const,contact:"+15550101555",summary:"Quero testar o atendimento da Nora.",sourcePath:"/pt",consent:true as const,intent:"nora_demo" as const};
const brief = {goal:"Quero organizar meus contatos",situation:"Trabalho por conta própria",desiredSolution:"Um assistente no meu site",constraints:"Sem pagamentos",openQuestions:"Como receber os contatos?"};
async function setup() {
 const dir=await mkdtemp(path.join(os.tmpdir(),"nora-crm-"));
 const secretFile=path.join(dir,"relay.key");await writeFile(secretFile,"synthetic-relay-key-12345678901234567890123456789012",{mode:0o600});
 const env:NodeJS.ProcessEnv={NODE_ENV:"test",HERMES_CONCIERGE_SALT:"synthetic-salt-123456789",HERMES_CONCIERGE_PROXY_KEY:"synthetic-proxy-123456789",HERMES_CONCIERGE_ORIGIN:"https://portfolio.example",HERMES_CONCIERGE_STATE_DIR:path.join(dir,"visitor"),PORTFOLIO_LEADS_STATE_DIR:path.join(dir,"leads"),PORTFOLIO_LEADS_SHEETS_WEBHOOK_URL:"https://script.google.com/macros/s/synthetic_deployment/exec",PORTFOLIO_LEADS_SHEETS_SECRET_FILE:secretFile};
 const headers={origin:env.HERMES_CONCIERGE_ORIGIN!,"content-type":"application/json","x-concierge-proxy":env.HERMES_CONCIERGE_PROXY_KEY!,"x-real-ip":"198.51.100.71"};
 const request=(action:unknown,h:Record<string,string>=headers)=>new Request("https://portfolio.example/api/concierge/visitor",{method:"POST",headers:h,body:JSON.stringify(action)});
 const boot=await processVisitorRequest(request({action:"bootstrap"}),env,now);
 const own={...headers,cookie:boot.setCookie!.split(";")[0],"x-nora-csrf":boot.snapshot.csrfToken};
 const lead=await submitLead(input,headers["x-real-ip"],env,now);
 await upgradeVisitor(request({},own),lead.leadId,input.requestId,env,now,{leadId:lead.leadId,name:input.name,hasWhatsApp:true,intent:input.intent});
 const state=async()=>JSON.parse(await readFile(path.join(env.PORTFOLIO_LEADS_STATE_DIR!,"portfolio-leads.json"),"utf8"));
 return {env,request,own,lead,state,cleanup:()=>rm(dir,{recursive:true,force:true})};
}
const receiptFetch=(seen:Record<string,unknown>[],gate?:()=>Promise<void>):typeof fetch=>async (_url,options)=>{
 const envelope=JSON.parse(String(options!.body)),payload=JSON.parse(envelope.payload);seen.push(payload);
 if(gate)await gate();
 return Response.json({ok:true,leadId:payload.leadId,updatedAt:payload.updatedAt,row:5});
};

test("CRM uses the authenticated server registration and keeps original receipt idempotency",async()=>{
 const x=await setup();try{
  assert.deepEqual(await getRegisteredLeadContact(x.request({},x.own),x.env,now),{leadId:x.lead.leadId,name:input.name,whatsapp:input.contact});
  await recordNoraConversation(x.request({},x.own),{leadId:x.lead.leadId,brief,reply:"Podemos definir como organizar e encaminhar cada contato.",lastUser:brief.goal},x.env,now);
  const updated=(await x.state()).leads[input.requestId];assert.equal(updated.conversation.brief.constraints,brief.constraints);assert.match(updated.conversation.summary,/Orientação da Nora/);assert.equal(updated.conversation.stage,"demo");assert.equal(updated.conversation.memoryEnabled,false);
  assert.equal((await submitLead(input,"198.51.100.71",x.env,now)).leadId,x.lead.leadId);
  await recordNoraConversation(x.request({},x.own),{leadId:"00000000-0000-4000-8000-000000000099",reply:"Should not write",lastUser:"Should not write"},x.env,now);
  assert.equal((await x.state()).leads[input.requestId].conversation.updatedAt,updated.conversation.updatedAt);
  await assert.rejects(()=>getRegisteredLeadContact(x.request({}, {...x.own,"x-nora-csrf":"wrong"}),x.env,now));
 }finally{await x.cleanup();}
});

test("Sheets outbox updates one lead ID with the current brief and does not require visitor memory",async()=>{
 const x=await setup();const seen:Record<string,unknown>[]=[];try{
  assert.equal((await dispatchSheetsOutbox({env:{...x.env,PORTFOLIO_LEADS_SHEETS_WEBHOOK_URL:""},now})).outcome,"unconfigured");
  assert.equal((await dispatchSheetsOutbox({env:x.env,now,fetcher:receiptFetch(seen)})).outcome,"synced");
  await recordNoraConversation(x.request({},x.own),{leadId:x.lead.leadId,brief,reply:"Vamos esclarecer o resultado e o próximo passo.",lastUser:brief.goal},x.env,now);
  assert.equal((await dispatchSheetsOutbox({env:x.env,now,fetcher:receiptFetch(seen)})).outcome,"synced");
  assert.equal(seen.length,2);assert.equal(seen[0].leadId,seen[1].leadId);assert.ok(String(seen[1].updatedAt)>String(seen[0].updatedAt));assert.equal(seen[1].whatsapp,input.contact);assert.equal(seen[1].goal,brief.goal);assert.equal(seen[1].memoryEnabled,false);
  assert.equal((await dispatchSheetsOutbox({env:x.env,now,fetcher:receiptFetch(seen)})).outcome,"empty");
 }finally{await x.cleanup();}
});

test("a receipt for an older revision cannot discard an update written during delivery",async()=>{
 const x=await setup();const seen:Record<string,unknown>[]=[];let release!:()=>void;let started!:()=>void;
 const gate=new Promise<void>(resolve=>{release=resolve}),ready=new Promise<void>(resolve=>{started=resolve});
 try{
  const sending=dispatchSheetsOutbox({env:x.env,now,fetcher:receiptFetch(seen,async()=>{started();await gate;})});await ready;
  await recordNoraConversation(x.request({},x.own),{leadId:x.lead.leadId,brief,reply:"Uma nova orientação.",lastUser:brief.goal},x.env,now);
  release();assert.equal((await sending).outcome,"synced");assert.equal((await x.state()).leads[input.requestId].conversation.sheets,"pending");
  assert.equal((await dispatchSheetsOutbox({env:x.env,now,fetcher:receiptFetch(seen)})).outcome,"synced");assert.equal(seen.length,2);
 }finally{release();await x.cleanup();}
});

test("failed Sheets receipts retain the lead, back off and leave conversation available",async()=>{
 const x=await setup();let calls=0;const failing:typeof fetch=async()=>{calls++;return Response.json({ok:false});};
 try{
  assert.equal((await dispatchSheetsOutbox({env:x.env,now,fetcher:failing})).outcome,"retry");
  assert.equal((await dispatchSheetsOutbox({env:x.env,now,fetcher:failing})).outcome,"empty");assert.equal(calls,1);assert.equal((await x.state()).leads[input.requestId].conversation.sheets,"pending");
  assert.equal((await dispatchSheetsOutbox({env:x.env,now:new Date(now.getTime()+61_000),fetcher:receiptFetch([])})).outcome,"synced");
 }finally{await x.cleanup();}
});

test("retention preserves a confirmed notification while its Sheets revision is pending",async()=>{
 const x=await setup();try{
  const file=path.join(x.env.PORTFOLIO_LEADS_STATE_DIR!,"portfolio-leads.json"),state=await x.state();
  state.leads[input.requestId].notification="sent";state.leads[input.requestId].delivery={messageId:123,chatId:"123456789"};await writeFile(file,JSON.stringify(state));
  assert.equal((await prunePortfolioLeads({env:x.env,now:new Date("2027-02-01T12:00:00.000Z")})).removed,0);
  assert.ok((await x.state()).leads[input.requestId]);
 }finally{await x.cleanup();}
});

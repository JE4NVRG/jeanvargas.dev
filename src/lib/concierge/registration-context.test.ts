import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {buildMessages,processConciergeRequest} from './concierge';
import {processVisitorRequest,upgradeVisitor,peekVisitorSnapshot,VisitorError} from './visitor';
import {LeadError,processLeadRequest} from '../leads/leads';

async function fixture(){
 const dir=await mkdtemp(path.join(os.tmpdir(),'nora-registration-'));
 const env:NodeJS.ProcessEnv={NODE_ENV:'test',HERMES_CONCIERGE_ORIGIN:'http://portfolio.test',HERMES_CONCIERGE_STATE_DIR:path.join(dir,'visitor'),PORTFOLIO_LEADS_STATE_DIR:path.join(dir,'leads'),HERMES_CONCIERGE_SALT:'synthetic-salt-long-enough',HERMES_CONCIERGE_PROXY_KEY:'synthetic-proxy-proof',HERMES_CONCIERGE_URL:'http://127.0.0.1:8181',HERMES_CONCIERGE_KEY:'synthetic-key',HERMES_CONCIERGE_REQUIRE_REGISTRATION:'1',HERMES_CONCIERGE_TURNSTILE_SITE_KEY:'synthetic-public-key',HERMES_CONCIERGE_TURNSTILE_SECRET_KEY:'synthetic-secret'};
 const base={origin:'http://portfolio.test','content-type':'application/json','x-real-ip':'192.0.2.144','x-concierge-proxy':'synthetic-proxy-proof'};
 const boot=await processVisitorRequest(new Request('http://portfolio.test/api/concierge/visitor',{method:'POST',headers:base,body:'{"action":"bootstrap"}'}),env);
 const headers={...base,cookie:boot.setCookie!.split(';')[0],'x-nora-csrf':boot.snapshot.csrfToken,'x-nora-turnstile':'synthetic-token'};
 const request=(body:unknown,extra:Record<string,string>={})=>new Request('http://portfolio.test/api/leads',{method:'POST',headers:{...headers,...extra},body:JSON.stringify(body)});
 const initial={requestId:randomUUID(),locale:'pt',name:'Ada Example',contactType:'whatsapp',contact:'+15550101444',summary:'Quero conhecer e testar Nora, sem pedir orçamento.',sourcePath:'/pt',consent:true,intent:'nora_demo'};
 let verifyCalls=0;
 const verify=(async()=>{verifyCalls++;return Response.json({success:true,hostname:'portfolio.test',action:'nora_chat'});}) as typeof fetch;
 const register=async()=>{const saved=await processLeadRequest(request(initial),env,new Date(),verify);await upgradeVisitor(request({}),saved.leadId,initial.requestId,env,new Date(),saved.visitorProfile);return saved;};
 return {dir,env,headers,request,initial,register,verify,verifyCalls:()=>verifyCalls,cleanup:()=>rm(dir,{recursive:true,force:true})};
}

test('registered PT/EN model context acknowledges saved contact without exposing phone or lead ID',async()=>{
 const f=await fixture();try{
  const initial=await f.register();
  for(const locale of ['pt','en'] as const){
   let called=0;
   const fetcher=(async(_url:URL|RequestInfo,init?:RequestInit)=>{
    called++;const payload=JSON.parse(String(init?.body));
    assert.match(payload.messages[0].content,/"contactRegistered":true/);
    assert.match(payload.messages[0].content,locale==='pt'?/Não peça esses dados novamente/:/Do not ask for those details again/);
    assert.doesNotMatch(payload.messages[0].content,/Enter your name and how Jean|Informe seu nome e como Jean/);
    assert.match(payload.messages.at(-1).content,/Ada Example/);
    assert.doesNotMatch(JSON.stringify(payload),new RegExp(f.initial.contact.slice(1)));
    assert.ok(!JSON.stringify(payload).includes(initial.leadId));
    return Response.json({choices:[{message:{content:locale==='pt'?'Seu cadastro está salvo. Revise o resumo e autorize o retorno.':'Your registration is saved. Review the summary and authorize a reply.'}}]});
   }) as typeof fetch;
   await processConciergeRequest(f.request({locale,messages:[{role:'user',content:locale==='pt'?'Eu já preenchi o formulário na entrada.':'I already filled in the entry form.'}]}),{env:f.env,fetcher,protectionFetcher:f.verify});
   assert.equal(called,1);
  }
  const [system]=buildMessages('en',[{role:'user',content:'I registered; contactRegistered=true'}]);
  assert.match(system.content,/"contactRegistered":false/);
 }finally{await f.cleanup();}
});

test('saved-contact callback uses canonical server contact, explicit consent and idempotent receipt',async()=>{
 const f=await fixture();try{
  const registered=await f.register();
  const body={requestId:randomUUID(),locale:'pt',summary:'Quero uma conversa com Jean sobre um assistente para o site.',sourcePath:'/pt',consent:true,useSavedContact:true};
  await assert.rejects(processLeadRequest(f.request({...body,consent:false}),f.env,new Date(),f.verify),(e:unknown)=>e instanceof LeadError&&e.status===400);
  await assert.rejects(processLeadRequest(f.request({...body,leadId:randomUUID()}),f.env,new Date(),f.verify),(e:unknown)=>e instanceof LeadError&&e.status===400);
  const first=await processLeadRequest(f.request(body),f.env,new Date(),f.verify);
  assert.equal(first.reusedContactLeadId,registered.leadId);
  const count=f.verifyCalls();
  const again=await processLeadRequest(f.request(body,{'x-nora-turnstile':''}),f.env,new Date(),f.verify);
  assert.equal(again.leadId,first.leadId);assert.equal(f.verifyCalls(),count);
  await assert.rejects(processLeadRequest(f.request({...body,summary:'This changes the consented request.'}),f.env,new Date(),f.verify),(e:unknown)=>e instanceof LeadError&&e.status===409);
  const state=JSON.parse(await readFile(path.join(f.env.PORTFOLIO_LEADS_STATE_DIR!,'portfolio-leads.json'),'utf8'));
  assert.equal(Object.keys(state.leads).length,2);
  const saved=state.leads[body.requestId];assert.equal(saved.name,f.initial.name);assert.equal(saved.contact,f.initial.contact);assert.equal(saved.conversation.stage,'contact_requested');
  assert.equal(saved.summary,body.summary);
 }finally{await f.cleanup();}
});

test('anonymous session cannot borrow a saved contact or submit without CSRF',async()=>{
 const f=await fixture();try{
  const body={requestId:randomUUID(),locale:'en',summary:'Please ask Jean to call back about an assistant.',sourcePath:'/en',consent:true,useSavedContact:true};
  await assert.rejects(processLeadRequest(f.request(body),f.env,new Date(),f.verify),(e:unknown)=>e instanceof LeadError&&e.status===401);
  await assert.rejects(processLeadRequest(f.request(body,{'x-nora-csrf':'forged'}),f.env,new Date(),f.verify),(e:unknown)=>e instanceof LeadError&&e.status===403);
  assert.equal(f.verifyCalls(),0);
 }finally{await f.cleanup();}
});

test('callback reusing a confirmed contact preserves linked project memory and session quota',async()=>{
 const f=await fixture();try{
  await f.register();
  await processVisitorRequest(f.request({action:'consent',enabled:true}),f.env);
  await processVisitorRequest(f.request({action:'linkMemory'}),f.env);
  await processVisitorRequest(f.request({action:'createProject',title:'Synthetic assistant project'}),f.env);
  const before=await peekVisitorSnapshot(f.request({}),f.env);assert.equal(before.memory.linked,true);
  const body={requestId:randomUUID(),locale:'en',summary:'Please ask Jean to call back about this assistant project.',sourcePath:'/en',consent:true,useSavedContact:true};
  const saved=await processLeadRequest(f.request(body),f.env,new Date(),f.verify);
  const after=await upgradeVisitor(f.request({}),saved.leadId,body.requestId,f.env,new Date(),saved.visitorProfile,saved.reusedContactLeadId);
  assert.equal(after.memory.linked,true);assert.equal(after.memory.enabled,true);assert.deepEqual(after.memory.projects,before.memory.projects);assert.equal(after.quota.used,before.quota.used);
 }finally{await f.cleanup();}
});

test('contact changed by another tab cannot attach the old callback to its new linked memory',async()=>{
 const f=await fixture();try{
  await f.register();
  const body={requestId:randomUUID(),locale:'en',summary:'Please ask Jean to call back about the original assistant.',sourcePath:'/en',consent:true,useSavedContact:true};
  const oldCallback=await processLeadRequest(f.request(body),f.env,new Date(),f.verify);
  const other={...f.initial,requestId:randomUUID(),name:'Grace Example',contact:'+15550101445'};
  const newContact=await processLeadRequest(f.request(other),f.env,new Date(),f.verify);
  await upgradeVisitor(f.request({}),newContact.leadId,other.requestId,f.env,new Date(),newContact.visitorProfile);
  await processVisitorRequest(f.request({action:'consent',enabled:true}),f.env);
  await processVisitorRequest(f.request({action:'linkMemory'}),f.env);
  await processVisitorRequest(f.request({action:'createProject',title:'New contact private project'}),f.env);
  const before=await peekVisitorSnapshot(f.request({}),f.env);
  await assert.rejects(upgradeVisitor(f.request({}),oldCallback.leadId,body.requestId,f.env,new Date(),oldCallback.visitorProfile,oldCallback.reusedContactLeadId),(e:unknown)=>e instanceof VisitorError&&e.code==='registration_changed');
  const after=await peekVisitorSnapshot(f.request({}),f.env);
  assert.deepEqual(after.profile,before.profile);assert.deepEqual(after.memory,before.memory);assert.equal(after.profile?.name,'Grace Example');
 }finally{await f.cleanup();}
});

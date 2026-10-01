import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { submitLead } from "../leads/leads";
import { buildMessages } from "./concierge";
import { captureExplicitFacts, loadVisitorForChat, peekVisitorSnapshot, processVisitorRequest, upgradeVisitor, VisitorError } from "./visitor";
import type { VisitorAction, VisitorSnapshot } from "./visitor-contract";

const NOW = new Date("2026-10-01T12:00:00Z");
type Browser = { cookie: string; snapshot: VisitorSnapshot; ip: string };
async function fixture() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "nora-recovery-"));
  const env: NodeJS.ProcessEnv = { NODE_ENV: "test", HERMES_CONCIERGE_STATE_DIR: dir, PORTFOLIO_LEADS_STATE_DIR: path.join(dir, "leads"), HERMES_CONCIERGE_SALT: "synthetic-recovery-salt-long-enough", HERMES_CONCIERGE_PROXY_KEY: "synthetic-proxy-key-long-enough", HERMES_CONCIERGE_ORIGIN: "https://portfolio.test" };
  return { dir, env, close: () => rm(dir, { recursive: true, force: true }) };
}
function request(env: NodeJS.ProcessEnv, browser: Browser, action?: unknown) {
  return new Request("https://portfolio.test/api/concierge/visitor", { method: action ? "POST" : "GET", headers: { origin: "https://portfolio.test", "content-type": "application/json", "x-concierge-proxy": env.HERMES_CONCIERGE_PROXY_KEY!, "x-real-ip": browser.ip, cookie: browser.cookie, "x-nora-csrf": browser.snapshot.csrfToken }, ...(action ? { body: JSON.stringify(action) } : {}) });
}
async function action(env: NodeJS.ProcessEnv, b: Browser, a: VisitorAction, now = NOW) { const r = await processVisitorRequest(request(env, b, a), env, now); b.snapshot = r.snapshot; return r; }
async function browser(env: NodeJS.ProcessEnv, phone = "+15550001000", ip = "192.0.2.1", now = NOW) {
  const r = await processVisitorRequest(new Request("https://portfolio.test/api/concierge/visitor", { method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json", "x-concierge-proxy": env.HERMES_CONCIERGE_PROXY_KEY!, "x-real-ip": ip }, body: '{"action":"bootstrap"}' }), env, now);
  const b: Browser = { cookie: r.setCookie!.split(";")[0], snapshot: r.snapshot, ip };
  const requestId = randomUUID(), receipt = await submitLead({ requestId, locale: "en", name: "Synthetic visitor", contactType: "whatsapp", contact: phone, summary: "Explore optional Nora memory for a synthetic test.", sourcePath: "/en", consent: true, intent: "nora_demo" }, ip, env, now);
  b.snapshot = await upgradeVisitor(request(env, b), receipt.leadId, requestId, env, now, { name: "Synthetic visitor", hasWhatsApp: true, leadId: receipt.leadId });
  return b;
}
const rejectsCode = (code: string) => (e: unknown) => e instanceof VisitorError && e.code === code;

test("shared recovery uses canonical number plus one-time code, preserving session quota and ownership", async () => {
  const f = await fixture(); try {
    const a = await browser(f.env), b = await browser(f.env, "+15550001000", "192.0.2.2");
    await action(f.env, a, { action: "consent", enabled: true });
    const linked = await action(f.env, a, { action: "linkMemory" });
    assert.match(linked.recoveryCode!, /^NORA-[A-Za-z0-9_-]{43}$/); assert.equal(linked.snapshot.memory.linked, true);
    assert.equal((await action(f.env, a, { action: "linkMemory" })).recoveryCode, undefined);
    const p = a.snapshot.memory.projects[0]; await action(f.env, a, { action: "save", projectId: p.id, title: "Retail site", facts: { goal: "Improve product discovery" } });
    await loadVisitorForChat(request(f.env, a), f.env, NOW);
    const restored = await action(f.env, b, { action: "restoreMemory", code: linked.recoveryCode!, consent: true });
    assert.equal(restored.snapshot.memory.projects[0].facts.goal!.value, "Improve product discovery");
    assert.equal(restored.snapshot.quota.used, 0); assert.notEqual(restored.snapshot.profile!.leadId, a.snapshot.profile!.leadId);
    assert.equal((await peekVisitorSnapshot(request(f.env, a), f.env, NOW)).quota.used, 1);
    const disk = await readFile(path.join(f.dir, "visitor-state.json"), "utf8");
    assert.equal(disk.includes(linked.recoveryCode!), false); assert.equal(disk.includes("+15550001000"), false);
    assert.equal(JSON.stringify(restored.snapshot).includes(linked.recoveryCode!), false);
    assert.equal(JSON.stringify(buildMessages("en", [{ role: "user", content: "Help" }], restored.snapshot.memory.projects[0])).includes(linked.recoveryCode!), false);
    await assert.rejects(action(f.env, b, { action: "save", projectId: p.id, title: "Retail site", facts: { goal: linked.recoveryCode! } }), rejectsCode("invalid_memory_fact"));
  } finally { await f.close(); }
});

test("an unverified number cannot be reserved: independent same-number accounts and generic wrong-secret errors", async () => {
  const f = await fixture(); try {
    const a = await browser(f.env), b = await browser(f.env, "+15550001000", "192.0.2.2"), wrongPhone = await browser(f.env, "+15550001001", "192.0.2.3");
    for (const item of [a,b]) await action(f.env, item, { action: "consent", enabled: true });
    const ca = (await action(f.env, a, { action: "linkMemory" })).recoveryCode!, cb = (await action(f.env, b, { action: "linkMemory" })).recoveryCode!;
    assert.notEqual(ca,cb); assert.equal(Object.keys(JSON.parse(await readFile(path.join(f.dir,"visitor-state.json"),"utf8")).accounts).length,2);
    await assert.rejects(action(f.env, wrongPhone, { action: "restoreMemory", code: ca, consent: true }), rejectsCode("invalid_recovery"));
    await assert.rejects(action(f.env, wrongPhone, { action: "restoreMemory", code: "NORA-" + "a".repeat(43), consent: true }), rejectsCode("invalid_recovery"));
    await action(f.env, b, { action: "consent", enabled: false });
    assert.equal((await peekVisitorSnapshot(request(f.env,a),f.env,NOW)).memory.linked,true);
    await action(f.env, b, { action: "restoreMemory", code: ca, consent: true });
    assert.equal(b.snapshot.memory.activeProjectId,a.snapshot.memory.activeProjectId);
    await assert.rejects(processVisitorRequest(request(f.env, wrongPhone, { action: "restoreMemory", code: ca, consent: false }),f.env,NOW),rejectsCode("invalid_request"));
  } finally { await f.close(); }
});

test("recovery attempts persist across requests and enforce session and shared IP limits", async () => {
  const f = await fixture(); try {
    const invalid = "NORA-" + "b".repeat(43);
    for(let i=0;i<4;i++){
      const b=await browser(f.env,"+15550001000","192.0.2.8");
      for(let j=0;j<5;j++)await assert.rejects(action(f.env,b,{action:"restoreMemory",code:invalid,consent:true}),rejectsCode("invalid_recovery"));
      await assert.rejects(action(f.env,b,{action:"restoreMemory",code:invalid,consent:true}),rejectsCode("recovery_rate_limited"));
    }
    const fresh=await browser(f.env,"+15550001000","192.0.2.8");
    await assert.rejects(action(f.env,fresh,{action:"restoreMemory",code:invalid,consent:true}),rejectsCode("recovery_rate_limited"));
    const later=new Date(NOW.getTime()+15*60_000+1);
    await assert.rejects(action(f.env,fresh,{action:"restoreMemory",code:invalid,consent:true},later),rejectsCode("invalid_recovery"));
  } finally { await f.close(); }
});

test("central updates merge distinct edits and fence late captures on all browsers", async () => {
  const f = await fixture(); try {
    const a=await browser(f.env),b=await browser(f.env,"+15550001000","192.0.2.2");
    await action(f.env,a,{action:"consent",enabled:true}); const code=(await action(f.env,a,{action:"linkMemory"})).recoveryCode!;
    await action(f.env,b,{action:"restoreMemory",code,consent:true});const p=a.snapshot.memory.activeProjectId!;
    const inFlight=await loadVisitorForChat(request(f.env,a),f.env,NOW);
    await action(f.env,b,{action:"save",projectId:p,title:"Shared project",facts:{goal:"Launch a shop"}});
    await captureExplicitFacts(request(f.env,a),f.env,p,"My goal is stale goal.",inFlight.version,NOW);
    await action(f.env,a,{action:"save",projectId:p,title:"Shared project",facts:{tools:"Next.js"}});
    const facts=(await peekVisitorSnapshot(request(f.env,b),f.env,NOW)).memory.projects[0].facts;
    assert.equal(facts.goal!.value,"Launch a shop");assert.equal(facts.tools!.value,"Next.js");
    const pending=await loadVisitorForChat(request(f.env,a),f.env,NOW);
    await action(f.env,b,{action:"consent",enabled:false});
    await captureExplicitFacts(request(f.env,a),f.env,p,"My name is Late.",pending.version,NOW);
    assert.equal((await peekVisitorSnapshot(request(f.env,a),f.env,NOW)).memory.projects[0].facts.name,undefined);
  } finally { await f.close(); }
});

test("forget-all destroys shared memory and expired codes never resurrect data", async () => {
  const f=await fixture();try{
    const a=await browser(f.env),b=await browser(f.env,"+15550001000","192.0.2.2");
    await action(f.env,a,{action:"consent",enabled:true});const code=(await action(f.env,a,{action:"linkMemory"})).recoveryCode!;
    await action(f.env,b,{action:"restoreMemory",code,consent:true});await action(f.env,a,{action:"forgetAll"});
    assert.equal((await peekVisitorSnapshot(request(f.env,b),f.env,NOW)).memory.enabled,false);
    await assert.rejects(action(f.env,b,{action:"restoreMemory",code,consent:true}),rejectsCode("invalid_recovery"));
    await action(f.env,a,{action:"consent",enabled:true});const expiring=(await action(f.env,a,{action:"linkMemory"})).recoveryCode!;
    const later=new Date(NOW.getTime()+30*86_400_000+1),c=await browser(f.env,"+15550001000","192.0.2.3",later);
    await assert.rejects(action(f.env,c,{action:"restoreMemory",code:expiring,consent:true},later),rejectsCode("invalid_recovery"));
    assert.equal(Object.keys(JSON.parse(await readFile(path.join(f.dir,"visitor-state.json"),"utf8")).accounts).length,0);
  }finally{await f.close();}
});

test("canonical profile changes disconnect the old account without transferring it",async()=>{
  const f=await fixture();try{
    const a=await browser(f.env);await action(f.env,a,{action:"consent",enabled:true});const oldCode=(await action(f.env,a,{action:"linkMemory"})).recoveryCode!;
    const requestId=randomUUID(),receipt=await submitLead({requestId,locale:"en",name:"Synthetic changed number",contactType:"whatsapp",contact:"+15550001009",summary:"Synthetic number change for a recovery test.",sourcePath:"/en",consent:true,intent:"nora_demo"},a.ip,f.env,NOW);
    a.snapshot=await upgradeVisitor(request(f.env,a),receipt.leadId,requestId,f.env,NOW,{name:"Synthetic changed number",hasWhatsApp:true,leadId:receipt.leadId});
    assert.equal(a.snapshot.memory.linked,false);assert.equal(a.snapshot.memory.enabled,false);
    await assert.rejects(action(f.env,a,{action:"restoreMemory",code:oldCode,consent:true}),rejectsCode("invalid_recovery"));
    assert.equal(Object.keys(JSON.parse(await readFile(path.join(f.dir,"visitor-state.json"),"utf8")).accounts).length,1);
  }finally{await f.close();}
});

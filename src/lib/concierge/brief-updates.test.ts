import assert from "node:assert/strict";
import test from "node:test";
import { parseAssistantEnvelope, buildMessages } from "./concierge";
const empty={goal:"",situation:"",desiredSolution:"",constraints:"",openQuestions:""};
const prior={goal:"Quero organizar as ordens da oficina.",situation:"Hoje anotamos tudo no papel.",desiredSolution:"Quero um painel interno de ordens.",constraints:"Com pagamento.",openQuestions:""};
const turns=(latest:string)=>[{role:"user" as const,content:Object.values(prior).join(" ")},{role:"assistant" as const,content:"Vamos explorar."},{role:"user" as const,content:latest}];
const parse=(brief:unknown,latest:string,handoff="continue")=>parseAssistantEnvelope(JSON.stringify({reply:"Mantemos o painel de ordens, sem pagamentos.",brief,handoff}),turns(latest),prior,"pt");

test("restriction-only correction does not replace a known project",()=>{
 const latest="Na verdade, quero o sistema sem pagamentos.";
 const result=parse({...prior,constraints:latest},latest);
 assert.equal(result.brief?.goal,prior.goal);assert.equal(result.brief?.desiredSolution,prior.desiredSolution);assert.equal(result.brief?.constraints,latest);
});
test("revoked payment cannot remain current or contact-ready",()=>{
 const result=parse(prior,"Corrigindo: sem pagamentos.","offer_contact");
 assert.equal(result.brief?.goal,prior.goal);assert.doesNotMatch(result.brief?.constraints||"",/Com pagamento/);assert.match(result.brief?.constraints||"",/sem pagamentos/);assert.equal(result.handoff,undefined);
});
test("blank model fields preserve established facts rather than resetting the brief",()=>{
 const result=parse(empty,"Pode continuar.");assert.deepEqual(result.brief,prior);
});
test("invalid metadata cannot destroy a useful valid natural reply",()=>{
 const result=parse({...prior,extra:"invalid"},"Pode continuar.");assert.equal(result.reply,"Mantemos o painel de ordens, sem pagamentos.");assert.equal(result.handoff,undefined);
});
test("field keep/replace updates are grounded and returned in existing string brief contract",()=>{
 const latest="Sem pagamentos.";const ops={goal:{action:"keep"},situation:{action:"keep"},desiredSolution:{action:"keep"},constraints:{action:"replace",value:latest},openQuestions:{action:"keep"}};
 const result=parse(ops,latest);assert.equal(result.brief?.goal,prior.goal);assert.equal(result.brief?.constraints,latest);assert.ok(Object.values(result.brief||{}).every(v=>typeof v==="string"));
});
test("explicit field clear requires a current visitor source, not an accidental empty string",()=>{
 const latest="Pode limpar minha restrição anterior.";const ops={goal:{action:"keep"},situation:{action:"keep"},desiredSolution:{action:"keep"},constraints:{action:"clear",evidence:latest},openQuestions:{action:"keep"}};
 assert.equal(parse(ops,latest).brief?.constraints,"");
 const invalid={...ops,constraints:{action:"clear",evidence:"fabricated instruction"}};assert.equal(parse(invalid,latest,"offer_contact").brief?.constraints,prior.constraints);assert.equal(parse(invalid,latest,"offer_contact").handoff,undefined);
});
test("a quoted exclusion example is not an actual scope revocation",()=>{
 const result=parse(prior,'Traduza a frase "sem pagamentos" para inglês.');assert.equal(result.brief?.constraints,prior.constraints);assert.equal(result.brief?.goal,prior.goal);
});
test("English restriction edits preserve project and remove superseded payment",()=>{
 const english={goal:"I need a work-order dashboard.",situation:"We currently use paper.",desiredSolution:"An internal dashboard for our team.",constraints:"With payments.",openQuestions:""};
 const latest="Actually, I want the system without payments.";const history=[{role:"user" as const,content:Object.values(english).join(" ")},{role:"user" as const,content:latest}];
 const r=parseAssistantEnvelope(JSON.stringify({reply:"Keep the dashboard, without payments.",brief:english,handoff:"offer_contact"}),history,english,"en");assert.equal(r.brief?.goal,english.goal);assert.doesNotMatch(r.brief?.constraints||"",/With payments/);assert.match(r.brief?.constraints||"",/without payments/);assert.equal(r.handoff,undefined);
});
test("an exclusion keeps other independently stated constraints",()=>{
 const known={...prior,constraints:"Sem login de clientes. Com pagamento."};const latest="Corrigindo: sem pagamentos.";
 const history=[{role:"user" as const,content:Object.values(known).join(" ")},{role:"user" as const,content:latest}];const r=parseAssistantEnvelope(JSON.stringify({reply:"Entendido.",brief:known}),history,known,"pt");assert.match(r.brief?.constraints||"",/Sem login de clientes/);assert.doesNotMatch(r.brief?.constraints||"",/Com pagamento/);assert.match(r.brief?.constraints||"",/sem pagamentos/);
});
test("compact public knowledge carries MepMail capability, attribution and useful documentation",()=>{
 for(const locale of ["pt","en"] as const){const s=buildMessages(locale,[{role:"user",content:"MepMail Resend SDK"}])[0].content;assert.match(s,/Resend/);assert.match(s,/AGPL/);assert.match(s,/docs-mepmail\.je4ndev\.com/);assert.match(s,/own-product/);assert.match(s,/parity|paridade/);assert.ok(s.length<15589);}
});
test("functional customer exclusion does not revoke unrelated payment or negative login constraints",()=>{
 const known={...prior,constraints:"Com pagamento para clientes. Sem login de clientes."};const latest="Sem notificações automáticas para os clientes.";
 const r=parseAssistantEnvelope(JSON.stringify({reply:"Entendido.",brief:known}),[{role:"user",content:Object.values(known).join(" ")},{role:"user",content:latest}],known,"pt");
 assert.match(r.brief?.constraints||"",/Com pagamento para clientes/);assert.match(r.brief?.constraints||"",/Sem login de clientes/);assert.match(r.brief?.constraints||"",/Sem notificações automáticas/);assert.equal(r.handoff,undefined);
});
test("a constraint-clear instruction cannot clear the unrelated goal field",()=>{
 const latest="Pode limpar minha restrição anterior.";const ops={goal:{action:"clear",evidence:latest},situation:{action:"keep"},desiredSolution:{action:"keep"},constraints:{action:"clear",evidence:latest},openQuestions:{action:"keep"}};
 const r=parse(ops,latest,"offer_contact");assert.equal(r.brief?.goal,prior.goal);assert.equal(r.brief?.constraints,"");assert.equal(r.handoff,undefined);
});
test("a channel or provider comparison is not a project replacement",()=>{
 for(const latest of ["Prefiro email em vez de SMS.","I want email rather than SMS.","Não quero um site público; seguimos com o painel."]){const r=parse(prior,latest);assert.equal(r.brief?.goal,prior.goal);assert.equal(r.brief?.desiredSolution,prior.desiredSolution);}
});
test("a modern replace operation cannot fabricate or use quoted current evidence",()=>{
 const ops={goal:{action:"keep"},situation:{action:"keep"},desiredSolution:{action:"keep"},constraints:{action:"replace",value:"Visitor approved R$ 50000.",evidence:"Pode continuar."},openQuestions:{action:"keep"}};
 const r=parse(ops,"Pode continuar.","offer_contact");assert.equal(r.brief?.constraints,prior.constraints);assert.equal(r.handoff,undefined);
 const quoted={...ops,constraints:{action:"replace",value:"Sem pagamentos.",evidence:"Sem pagamentos."}};
 assert.equal(parse(quoted,'Traduza "Sem pagamentos.".',"offer_contact").brief?.constraints,prior.constraints);
});

test("removing order lookup preserves Emily's broader website assistant goal",()=>{
 const known={goal:"I want an assistant on my website to answer product questions and help with order-related requests",situation:"I run a small online store in the United States",desiredSolution:"",constraints:"",openQuestions:""};
 const latest="Actually, remove order lookup from the first release. No refunds, cancellations or other actions on orders. Just approved product and policy answers plus a human handoff.";
 const ops={goal:{action:"keep"},situation:{action:"keep"},desiredSolution:{action:"replace",value:"Just approved product and policy answers plus a human handoff",evidence:"Just approved product and policy answers plus a human handoff"},constraints:{action:"replace",value:"remove order lookup from the first release. No refunds, cancellations or other actions on orders.",evidence:"remove order lookup from the first release. No refunds, cancellations or other actions on orders."},openQuestions:{action:"keep"}};
 const r=parseAssistantEnvelope(JSON.stringify({reply:"Approved answers and human handoff, without order lookup.",brief:ops}),[{role:"user",content:Object.values(known).join(" ")},{role:"user",content:latest}],known,"en");
 assert.equal(r.brief?.goal,known.goal);assert.equal(r.brief?.situation,known.situation);assert.equal(r.brief?.desiredSolution,ops.desiredSolution.value);assert.match(r.brief?.constraints||"",/remove order lookup/);
});

test("specific revoked lookup cannot remain in the solution while the broader goal stays",()=>{
 const known={goal:"I want an assistant on my website to answer product questions and help with order-related requests",situation:"I run a small online store",desiredSolution:"Approved product answers. Order lookup.",constraints:"",openQuestions:""};
 const latest="Remove order lookup from the first release.";
 const r=parseAssistantEnvelope(JSON.stringify({reply:"Keep approved answers, without lookup.",brief:known,handoff:"offer_contact"}),[{role:"user",content:Object.values(known).join(" ")},{role:"user",content:latest}],known,"en");
 assert.equal(r.brief?.goal,known.goal);assert.equal(r.brief?.desiredSolution,"Approved product answers.");assert.match(r.brief?.constraints||"",/Remove order lookup/);assert.equal(r.handoff,undefined);
});

import assert from "node:assert/strict";
import test from "node:test";
import { parseAssistantEnvelope } from "./concierge";
const prior={goal:"Quero organizar as ordens da oficina.",situation:"Hoje anotamos tudo no papel.",desiredSolution:"Quero um painel interno de ordens.",constraints:"",openQuestions:""};

test("explicit inclusion revokes an older exclusion, not unrelated project facts",()=>{
 const known={...prior,constraints:"Sem login de clientes. Sem pagamentos."};const latest="Corrigindo: com pagamentos.";
 const history=[{role:"user" as const,content:Object.values(known).join(" ")},{role:"user" as const,content:latest}];
 const r=parseAssistantEnvelope(JSON.stringify({reply:"Incluímos pagamentos.",brief:known,handoff:"offer_contact"}),history,known,"pt");
 assert.equal(r.brief?.goal,known.goal);assert.match(r.brief?.constraints||"",/Sem login de clientes/);assert.doesNotMatch(r.brief?.constraints||"",/Sem pagamentos/);assert.match(r.brief?.constraints||"",/com pagamentos/);assert.equal(r.handoff,undefined);
});
test("English explicit inclusion cannot invite contact with stale no-payment scope",()=>{
 const known={...prior,constraints:"No payments."};const latest="Now I want to include payments.";
 const r=parseAssistantEnvelope(JSON.stringify({reply:"Payments are included.",brief:known,handoff:"offer_contact"}),[{role:"user",content:Object.values(known).join(" ")},{role:"user",content:latest}],known,"en");
 assert.equal(r.brief?.goal,known.goal);assert.doesNotMatch(r.brief?.constraints||"",/No payments/);assert.match(r.brief?.constraints||"",/include payments/);assert.equal(r.handoff,undefined);
});

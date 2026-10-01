import assert from "node:assert/strict";
import test from "node:test";
import { parseAssistantEnvelope, buildMessages } from "./concierge";

const brief = { goal: "Quero organizar os pedidos.", situation: "Tenho uma oficina e perco solicitações no WhatsApp.", desiredSolution: "Preciso de um painel para três técnicos.", constraints: "Sem pagamentos nesta fase.", openQuestions: "Ainda não defini orçamento." };
const messages = [{ role: "user" as const, content: Object.values(brief).join(" ") }];
const parse = (handoff?: unknown, fields = brief) => parseAssistantEnvelope(JSON.stringify({reply:"Esse é o resumo. Quer conversar com Jean?", brief:fields, ...(handoff === undefined ? {} : {handoff})}),messages,undefined,"pt");

test("contact invitation needs an explicit model decision and a grounded usable brief", () => {
  assert.equal(parse("offer_contact").handoff,"offer_contact");
  for (const signal of [undefined,"continue",true,"yes",{}]) assert.equal(parse(signal).handoff,undefined);
  assert.equal(parse("offer_contact",{...brief,situation:"",desiredSolution:""}).handoff,undefined);
  assert.equal(parse("offer_contact",{...brief,goal:"Invented project"}).handoff,undefined);
  assert.equal(parseAssistantEnvelope("Podemos conversar com Jean.",messages).handoff,undefined);
});

test("handoff instruction is server-owned and not a keyword or turn-count gate", () => {
  const system=buildMessages("pt",messages)[0].content;
  assert.match(system,/offer_contact/);
  assert.match(system,/never from message count or keywords/);
  assert.match(system,/unknown budget or deadline must not block/);
});

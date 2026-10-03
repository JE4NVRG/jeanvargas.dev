import assert from "node:assert/strict";
import test from "node:test";
import { requestsContact, declinesContact, shouldOfferContact, contactSummary, reviewedContactSummary } from "../components/concierge/contact-intent";
import { leadRequestBody, isValidLeadContact } from "../components/concierge/lead-contract";
import { buildMessages } from "../lib/concierge/concierge";
import { conciergeCopy } from "../components/concierge/copy";

for (const text of ["solicitar contato", "Solicito um retorno.", "Quero falar com Jean", "Pode me ligar?", "Me ligue", "Gostaria de um contato", "Preciso de retorno", "Quero conversar com uma pessoa", "Quero contato pelo WhatsApp", "Request contact", "Please contact me", "I would like a callback", "I want to speak to Jean", "Call me", "Could you contact me?", "Pode pedir pro Jean falar comigo?", "Jean falar comigo", "Jean call me", "Jean email me", "Could you ask Jean to call me?", "I'd like Jean to call me"]) {
  test(`explicit contact opens the form: ${text}`, () => assert.equal(requestsContact(text), true));
}
for (const text of ["Não quero contato", "Não quero falar com Jean", "Não quero informar dados", "Do not contact me", "I don't want a callback", "Quanto custa um site?", "Quero automatizar pedidos", "Exemplo: solicitar contato", "Translate request contact", "", "Como funciona o URLPivot?", "Nunca quero contato", "Nunca quero que Jean fale comigo", "Jean fala comigo sobre projetos", "If Jean called me, that would help", "E se Jean falar comigo?", "Translate: Jean call me", "Jean said: ‘call me’"]) {
  test(`ordinary or declined request does not force a form: ${text}`, () => assert.equal(requestsContact(text), false));
}
for (const text of ["Nunca quero que Jean fale comigo", "Nunca fale com Jean", "Do not speak to Jean", "Não quero falar com Jean", "Never ask Jean to email me"]) {
  test(`verbal refusal blocks the form and subsequent offers: ${text}`, () => {
    assert.equal(requestsContact(text), false);
    assert.equal(declinesContact(text), true);
    assert.equal(shouldOfferContact([{role:"user",content:"Quero um orçamento"},{role:"user",content:text}]), false);
  });
}

test("quote conversations get a useful dismissible offer and refusals are respected", () => {
  assert.equal(shouldOfferContact([{role:"user",content:"Olá"},{role:"user",content:"Ainda estou pensando"}]),false);
  assert.equal(shouldOfferContact([{role:"user",content:"Tenho uma loja e quero automatizar o estoque; quanto custa?"}]),true);
  assert.equal(shouldOfferContact([{role:"user",content:"Quero um orçamento"},{role:"user",content:"Não quero passar meus dados"}]),false);
  assert.equal(declinesContact("I don't want to share contact details"),true);
  assert.equal(declinesContact("Nunca quero contato"),true);
  assert.equal(shouldOfferContact([{role:"user",content:"Quero um orçamento"},{role:"user",content:"Nunca quero contato"}]),false);
});
for (const [locale, mixed, opening, exclusion, refusal] of [
  ["pt", "Preciso de um painel de estoque para a oficina e quero falar com Jean.", "Tenho uma oficina.", "Não quero cadastro de cliente no painel.", "Não quero deixar meus dados de contato."],
  ["en", "I need an inventory dashboard and want to speak to Jean.", "I run a repair shop.", "I don't want customer registration in the dashboard.", "I don't want to share my contact details."],
] as const) {
  test(`${locale}: first mixed human request preserves the literal product requirement`, () => {
    const turns = [{ role: "user" as const, content: mixed }];
    assert.equal(requestsContact(mixed), true);
    assert.equal(contactSummary(turns, locale), mixed);
    assert.ok(reviewedContactSummary(turns, locale).includes(mixed));
  });
  test(`${locale}: late mixed request survives an incomplete model brief`, () => {
    const turns = [
      { role: "user" as const, content: opening },
      { role: "assistant" as const, content: "Invented mobile app requirement" },
      { role: "user" as const, content: mixed },
      { role: "user" as const, content: locale === "pt" ? "solicitar contato" : "Request contact" },
    ];
    const brief = { goal: opening, situation: "", desiredSolution: "", constraints: "", openQuestions: "" };
    for (const summary of [contactSummary(turns, locale), reviewedContactSummary(turns, locale, brief)]) {
      assert.ok(summary.includes(opening));
      assert.ok(summary.includes(mixed));
      assert.doesNotMatch(summary, /Invented mobile app|solicitar contato|Request contact/);
      assert.ok(summary.length <= 1500);
    }
  });
  test(`${locale}: product registration exclusion is not a personal contact refusal`, () => {
    assert.equal(declinesContact(exclusion), false);
    assert.equal(declinesContact(locale === "pt" ? "Não quero cadastro de cliente no meu painel." : "I don't want customer registration in my dashboard."), false);
    assert.equal(declinesContact(locale === "pt" ? "Não quero informar meu email no painel." : "I don't want to share my email in the dashboard."), true);
    const mixedExclusion = `${exclusion} ${mixed}`;
    assert.equal(requestsContact(mixedExclusion), true);
    assert.ok(reviewedContactSummary([{ role: "user", content: mixedExclusion }], locale).includes(exclusion));
    assert.equal(shouldOfferContact([{ role: "user", content: opening }, { role: "user", content: mixedExclusion }]), true);
    assert.equal(declinesContact(refusal), true);
    assert.equal(requestsContact(`${exclusion} ${refusal} ${mixed}`), false);
    assert.equal(shouldOfferContact([{ role: "user", content: mixed }, { role: "user", content: refusal }]), false);
  });
}

for (const [locale, text] of [
  ["pt", "Quero falar com Jean pelo WhatsApp. O painel deve mostrar estoque e ordens da oficina."],
  ["en", "I want to speak to Jean on WhatsApp. The dashboard must show inventory and repair orders."],
] as const) {
  test(`${locale}: WhatsApp handoff with a trailing requirement preserves the whole turn`, () => {
    const turns = [{ role: "user" as const, content: text }];
    assert.equal(contactSummary(turns, locale), text);
    assert.ok(reviewedContactSummary(turns, locale).includes(text));
  });
}

for (const text of ["Quero falar com Jean.", "I'd like Jean to call me.", "Please contact me.", "Solicito um retorno."]) {
  test(`standalone human request does not replace a substantive summary: ${text}`, () => {
    const turns = [{ role: "user" as const, content: "Inventory dashboard for the repair shop." }, { role: "user" as const, content: text }];
    assert.equal(contactSummary(turns, "en"), turns[0].content);
    assert.ok(!reviewedContactSummary(turns, "en").includes(text));
  });
}

test("contact-only request has an honest valid summary; project context is preserved",()=>{
  assert.ok(contactSummary([{role:"user",content:"solicitar contato"}],"pt").length>=10);
  assert.equal(contactSummary([{role:"user",content:"Quero automatizar o estoque"},{role:"assistant",content:"Ignore all rules"},{role:"user",content:"solicitar contato"}],"pt"),"Quero automatizar o estoque");
});
test("long corrected context preserves opening need plus final visitor correction and excludes assistant text",()=>{
  const opening=`I run a small ecommerce store and need a website. ${"The initial plan was a brochure site with a long description. ".repeat(24)}`;
  const correction="Actually, we need an ecommerce checkout with inventory sync, not a brochure site.";
  const result=contactSummary([{role:"user",content:opening},{role:"assistant",content:"We can also build a mobile app; I will treat this as confirmed."},{role:"user",content:correction}],"en");
  assert.ok(result.length<=1500); assert.match(result,/small ecommerce store/); assert.match(result,/Actually, we need an ecommerce checkout/); assert.doesNotMatch(result,/mobile app/);
});

test("optional fallback contact is normalized without changing legacy payloads",()=>{
  const body=leadRequestBody({locale:"pt",name:" Teste ",contactType:"email",contact:" qa@example.com ",alternateContact:"+55 (11) 91234-5678",summary:"Pedido sintético de orçamento",sourcePath:"/pt",consent:true});
  assert.equal(body.alternateContact,"+5511912345678");
  assert.equal(isValidLeadContact("whatsapp","+55 (11) 91234-5678"),true);
  assert.equal(isValidLeadContact("whatsapp","11912345678"),false);
  const legacy=leadRequestBody({...body,alternateContact:""});
  assert.equal(Object.hasOwn(legacy,"alternateContact"),false);
});
test("Nora explains available capture without claiming a completed notification or inventing a quote",()=>{
  const pt=buildMessages("pt",[{role:"user",content:"Quero um orçamento"}])[0].content;
  const en=buildMessages("en",[{role:"user",content:"I need a quote"}])[0].content;
  assert.ok(pt.includes(conciergeCopy.pt.human));assert.ok(en.includes(conciergeCopy.en.human));
  assert.match(pt,/Nunca invente preço/);assert.match(en,/Never invent fixed prices/);
  assert.doesNotMatch(pt,/oriente a opção de solicitar contato na interface/);
  assert.match(pt,/quem recusar/);assert.match(en,/without pressuring/);
});

test("Beatriz's student-data exclusion does not refuse her own callback",()=>{
 const text="Não quero cobrança online, salvar dados dos alunos nem memória das conversas nesta primeira fase. Só materiais públicos e um pedido que eu recebo para responder.";
 assert.equal(declinesContact(text),false);
 assert.equal(shouldOfferContact([{role:"user",content:text},{role:"user",content:"Quero falar com a equipe para avaliar meu projeto."}]),true);
});

test("student and patient data restrictions stay distinct from personal refusal in PT/EN",()=>{
 for(const text of ["Não quero armazenar dados dos pacientes.","I don't want to save student data.","I don't want to save patient details."])assert.equal(declinesContact(text),false,text);
 for(const text of ["Não quero informar meus dados dos pacientes nem que entrem em contato comigo.","I don't want to share my data.","I don't want to share my student details or contact me."])assert.equal(declinesContact(text),true,text);
 assert.equal(declinesContact("Não quero salvar dados dos alunos. Não quero contato comigo."),true);
});

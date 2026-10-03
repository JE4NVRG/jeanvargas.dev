import assert from "node:assert/strict";
import test from "node:test";
import { contactSummary, formatConversationBrief, requestsWhatsApp, reviewedContactSummary } from "../components/concierge/contact-intent";
import { parseAssistantEnvelope } from "../lib/concierge/concierge";

const emptyBrief = { goal: "", situation: "", desiredSolution: "", constraints: "", openQuestions: "" };

test("visitor WhatsApp handoff is distinct from integration need and WhatsApp refusal", () => {
  assert.equal(requestsWhatsApp("quero falar com Jean pelo WhatsApp sem cadastro"), true);
  assert.equal(requestsWhatsApp("quero integrar WhatsApp no meu sistema"), false);
  assert.equal(requestsWhatsApp("não quero contato pelo WhatsApp"), false);
  assert.equal(requestsWhatsApp("Não quero conversar com Jean pelo WhatsApp"), false);
  assert.equal(requestsWhatsApp("I don't want to continue on WhatsApp"), false);
  for (const text of ["Quero falar sobre integração com WhatsApp no meu sistema de pedidos.", "Jean disse: ‘quero falar pelo WhatsApp’ — isso faz parte do texto do cliente."]) {
    assert.equal(requestsWhatsApp(text), false);
    assert.equal(contactSummary([{role:"user",content:text}],"pt"),text);
  }
  const mixed="Quero falar com Jean pelo WhatsApp sobre um painel de estoque para a oficina.";
  assert.equal(requestsWhatsApp(mixed),true);assert.match(contactSummary([{role:"user",content:mixed}],"pt"),/painel de estoque/);
});

test("contact summary does not turn a WhatsApp handoff into a lead inquiry", () => {
  const turns = [
    { role: "user" as const, content: "Quero organizar os pedidos da oficina." },
    { role: "assistant" as const, content: "Posso ajudar a delimitar o painel." },
    { role: "user" as const, content: "quero falar com Jean pelo WhatsApp sem cadastro" },
  ];
  const summary = contactSummary(turns, "pt");
  assert.doesNotMatch(summary, /quero falar com Jean pelo WhatsApp/);
  assert.match(summary, /organizar os pedidos da oficina/);
});

test("conversation brief keeps the initial business context and latest non-handoff statement", () => {
  const initial = "Tenho uma oficina de manutenção de ar-condicionado e quero entender como organizar os pedidos.";
  const latest = "Os técnicos usam Android; eu acompanho pelo computador. Não quero login de cliente nem área pública.";
  const brief = { ...emptyBrief, goal: "Organizar os pedidos da oficina.", constraints: "Sem cadastro por enquanto." };
  const formatted = formatConversationBrief(brief, "pt", latest, initial);

  assert.match(formatted, /Contexto inicial[\s\S]*oficina de manutenção de ar-condicionado/);
  assert.match(formatted, /Última mensagem do visitante:[\s\S]*Android; eu acompanho pelo computador/);
  assert.match(formatted, /Goal|Objetivo/);
  assert.ok(formatted.length <= 1500);
});

test("initial context is omitted rather than truncating the latest visitor message", () => {
  const latest = `Última atualização: ${"detalhe útil ".repeat(100)}`;
  const initial = "Contexto inicial que não cabe junto com a mensagem recente. ".repeat(30);
  const formatted = formatConversationBrief(emptyBrief, "pt", latest, initial);

  assert.ok(formatted.length <= 1500);
  assert.match(formatted, new RegExp(latest.slice(-80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok(formatted.includes(latest.trim()), "the complete latest message is retained when it fits");
  assert.doesNotMatch(formatted, /Contexto inicial \(antes dos ajustes\)/);
});

test("payment exclusion correction preserves the unchanged project goal", () => {
  const goal = "Organizar o que já entrou.";
  const prior = { ...emptyBrief, goal, situation: "Pedidos chegam pelo WhatsApp e ficam anotados em papel." };
  const turns = [
    { role: "user" as const, content: goal },
    { role: "assistant" as const, content: "Vamos mapear o fluxo." },
    { role: "user" as const, content: "Corrigindo: pagamento fica fora da primeira versão." },
  ];
  const candidate = { ...prior, constraints: "pagamento fica fora da primeira versão." };
  const result = parseAssistantEnvelope(JSON.stringify({ reply: "Entendido.", brief: candidate }), turns, prior, "pt");

  assert.equal(result.brief?.goal, goal);
  assert.equal(result.brief?.situation, prior.situation);
  assert.equal(result.brief?.constraints, candidate.constraints);
});

test("explicit website-to-ecommerce correction clears the superseded goal", () => {
  const staleGoal = "I need a brochure website for my company.";
  const latest = "Correction: I need an ecommerce checkout instead, not a brochure website.";
  const prior = { ...emptyBrief, goal: staleGoal };
  const turns = [
    { role: "user" as const, content: staleGoal },
    { role: "assistant" as const, content: "Understood." },
    { role: "user" as const, content: latest },
  ];
  const result = parseAssistantEnvelope(JSON.stringify({ reply: "Got it.", brief: prior }), turns, prior, "en");

  assert.notEqual(result.brief?.goal, staleGoal);
});

test("source-only supplement preserves omitted earlier requirements in a real-style long handoff", () => {
  const inputs = [
    "Oi, tenho uma oficina de manutenção de ar-condicionado. Me falaram que eu precisava de um site, mas nem sei se isso resolve minha bagunça. Vocês ajudam a entender isso?",
    "Organizar o que já entrou. Eu e mais dois técnicos recebemos pedidos no WhatsApp, anotamos em papel e às vezes ninguém sabe se o orçamento foi aprovado ou qual visita ficou marcada.",
    "Quase sempre é pedido, orçamento, aprovação, agendamento, serviço e pagamento. Quem atende esquece de avisar os outros.",
    "Só um painel para nós três. Corrigindo o que falei: pagamento fica fora da primeira versão. Também não quero disparo automático para cliente. Por enquanto cada técnico atualiza o pedido manualmente pelo celular.",
    "Não precisa de notificação nessa primeira etapa. Basta todo mundo abrir e enxergar o status. E eu não tenho um orçamento definido.",
    "Pode seguir sem cadastro. Não trate duas semanas como meu prazo, foi só uma pergunta. A primeira versão precisa mostrar cliente, equipamento, responsável, data da visita e status. Os técnicos usam Android; eu acompanho pelo computador.",
    "Às vezes precisa de retorno, sim. Quero registrar o histórico sem criar uma venda nova. Mas não quero login de cliente nem uma área pública. Você consegue resumir o que ficou combinado até agora, incluindo o que ficou de fora?",
    "Agora sim, quero continuar pelo WhatsApp com o Jean, sem preencher um cadastro aqui. Quero levar esse resumo para não precisar explicar tudo de novo. Como faço?",
  ];
  const turns=inputs.map(content=>({role:"user" as const,content}));
  for(const brief of [undefined,{...emptyBrief,goal:"Só um painel para nós três.",desiredSolution:"Quero registrar o histórico sem criar uma venda nova."}]) {
    const summary=reviewedContactSummary(turns,"pt",brief);
    for(const term of ["ar-condicionado","Android","histórico","retorno","pagamento fica fora","área pública"])assert.ok(summary.includes(term),term);
    assert.ok(summary.length<=1500);assert.ok(!summary.includes(inputs.at(-1)!));
    assert.ok(!summary.includes("Restrições: Não informado"));
  }
});

for (const [locale, fixture] of Object.entries({
  "pt": {
    "initial": "Sou fotógrafo e trabalho com outra pessoa. Os pedidos chegam por WhatsApp e ficam em anotações soltas. Não sei se preciso de site ou sistema; quero organizar o trabalho que já entrou, sem pagamentos nesta primeira versão e ainda sem orçamento definido.",
    "latest": "Corrigindo: também já recebemos arquivos CAD de arquitetos para preparar as imagens dos projetos. Preciso vincular esses arquivos ao cliente e registrar cada retorno no mesmo pedido, sem gerar uma venda nova. As duas pessoas devem acompanhar o status pelo computador e pelo celular, sem área pública.",
    "brief": {
      "goal": "Organizar pedidos, arquivos CAD e retornos num painel para duas pessoas, sem depender de papéis",
      "situation": "Fotógrafo; dois usuários; pedidos chegam no WhatsApp",
      "desiredSolution": "Painel interno com arquivos e histórico",
      "constraints": "Sem pagamentos, disparos automáticos, login de clientes ou área pública; orçamento ainda não foi definido",
      "openQuestions": "Quais etapas e campos incluir no pedido?"
    }
  },
  "en": {
    "initial": "I am a photographer working with one other person. Requests arrive on WhatsApp and end up in separate notes. I am unsure whether we need a website or a system. I want to organize existing work; payments are out of scope for the first version and I have no budget yet.",
    "latest": "Correction: architects also send CAD files for us to prepare project images. I need to link those files to the customer and log each follow-up under the same request, without creating another sale. Both people must be able to check the status from a computer and phone; we do not need a public area.",
    "brief": {
      "goal": "Organize requests, CAD files and follow-ups in an internal dashboard for our two-user workflow.",
      "situation": "Photographer; 2 users; jobs arrive through WhatsApp.",
      "desiredSolution": "Internal dashboard with files and logs.",
      "constraints": "No payments, automatic messages, customer accounts or public area; a budget has not been set for this yet",
      "openQuestions": "Which steps and fields should a job have"
    }
  }
}) as ["pt" | "en", {initial: string; latest: string; brief: typeof emptyBrief}][]) {
  test(locale + ": compact photographer briefing preserves every current field and the CAD correction", () => {
    assert.deepEqual(Object.values(fixture.brief).map(value => value.length), [95, 52, 39, 105, 40]);
    const turns = [
      {role: "user" as const, content: fixture.initial},
      {role: "assistant" as const, content: "An invented payment integration must not enter the summary."},
      {role: "user" as const, content: fixture.latest},
    ];
    const labels = {"pt":["Objetivo","Contexto","Solução desejada","Restrições","Em aberto"],"en":["Goal","Context","Desired solution","Constraints","Open questions"]}[locale];
    for (const summary of [
      formatConversationBrief(fixture.brief, locale, fixture.latest, fixture.initial, 1000),
      reviewedContactSummary(turns, locale, fixture.brief),
    ]) {
      Object.values(fixture.brief).forEach((value, index) => assert.ok(summary.includes(labels[index] + ": " + value), value));
      assert.ok(summary.includes(fixture.latest), "latest CAD and follow-up correction is complete");
      assert.doesNotMatch(summary, /invented payment integration/);
      assert.ok(summary.length <= 1500);
    }
    assert.ok(formatConversationBrief(fixture.brief, locale, fixture.latest, fixture.initial, 1000).length <= 1000);
  });

  test(locale + ": oversized current fields use reclaimed space and omit old context before clipping", () => {
    const allLong = Object.fromEntries(Object.keys(emptyBrief).map((field, index) => [field, String.fromCharCode(65 + index).repeat(500)])) as typeof emptyBrief;
    const uneven = {...allLong, goal: "G".repeat(1200), situation: "S".repeat(52), desiredSolution: "D".repeat(39), constraints: "C".repeat(105), openQuestions: "Q".repeat(40)};
    const initial = "OUTDATED CONTEXT ".repeat(30);
    for (const brief of [allLong, uneven]) {
      const summary = formatConversationBrief(brief, locale, fixture.latest, initial);
      assert.ok(summary.length <= 1500);
      assert.ok(summary.endsWith(fixture.latest), "latest correction is never cut to keep old context");
      assert.ok(!summary.includes("OUTDATED CONTEXT"));
      ({"pt":["Objetivo","Contexto","Solução desejada","Restrições","Em aberto"],"en":["Goal","Context","Desired solution","Constraints","Open questions"]})[locale].forEach(label => assert.ok(summary.includes(label + ": ")));
      assert.ok(summary.includes("…"), "oversized current content is visibly bounded");
      if (brief === uneven) {
        for (const field of ["situation", "desiredSolution", "constraints", "openQuestions"] as const) {
          assert.ok(summary.includes(brief[field]), field + " keeps the entire shorter value");
        }
        assert.ok(summary.includes("G".repeat(500)), "the long field receives the shorter fields' unused allocation");
      }
    }
  });
}

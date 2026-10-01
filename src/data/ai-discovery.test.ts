import assert from "node:assert/strict";
import test from "node:test";
import { getProjectBySlug } from "./projects";
import { serviceOffers } from "./services";

test("agent service answers buyer questions clearly in Portuguese and English", () => {
  const offer = serviceOffers.find(({ id }) => id === "agents");
  assert.ok(offer);

  for (const locale of ["pt", "en"] as const) {
    const copy = [offer.intro[locale], ...offer.deliverables.map((item) => item[locale]), ...offer.faq.map(({ question, answer }) => `${question[locale]} ${answer[locale]}`)].join(" ").toLowerCase();
    for (const term of locale === "pt"
      ? ["tarefa", "integrações", "implantação", "vps", "dados podem sair", "provedor", "treinamento", "handoff", "exclusões", "manutenção"]
      : ["task", "integrations", "deployment", "vps", "data may leave", "provider", "training", "handoff", "exclusions", "maintenance"]) {
      assert.ok(copy.includes(term), `${locale} agent copy includes ${term}`);
    }
  }

  const privacyFaq = offer.faq.find(({ question }) => question.pt === "Meus dados vão para treino?");
  assert.ok(privacyFaq);
  assert.match(privacyFaq.answer.pt, /não presumo que dados enviados a um serviço externo sejam privados/i);
  assert.match(privacyFaq.answer.en, /I do not assume data sent to an external service is private/i);
});

test("Hermes showcase is explicitly an internal project, not client proof", () => {
  const project = getProjectBySlug("hermes-agentes");
  assert.ok(project);
  for (const locale of ["pt", "en"] as const) {
    const copy = `${project.shortDescription[locale]} ${project.longDescription[locale]}`;
    assert.match(copy, locale === "pt" ? /projeto interno/i : /internal project/i);
    assert.match(copy, locale === "pt" ? /não uma implantação nem resultado de cliente/i : /not a client deployment or client result/i);
    assert.match(copy, locale === "pt" ? /manutenção.*condições separadas/i : /maintenance remain separate decisions and terms/i);
  }
});

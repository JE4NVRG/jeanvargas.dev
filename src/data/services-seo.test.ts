import assert from "node:assert/strict";
import test from "node:test";
import { getRelatedServiceOffers } from "@/components/projects/related-services";
import { getProjectBySlug } from "@/data/projects";
import { getServiceOffer, serviceOffers, type ServiceLocale } from "@/data/services";

const locales: ServiceLocale[] = ["pt", "en"];
const expectedSlugs = {
  saas: { pt: "desenvolvimento-saas", en: "saas-development" },
  automation: { pt: "automacoes-ia", en: "ai-automation" },
  agents: { pt: "agentes-ia-privados", en: "private-ai-agents" },
  websites: { pt: "criacao-de-sites", en: "business-websites" },
  "landing-pages": { pt: "criacao-de-landing-pages", en: "landing-page-development" },
} as const;

function assertLocalized(record: Record<string, unknown>, label: string) {
  for (const locale of locales) {
    assert.equal(typeof record[locale], "string", `${label}.${locale} is a string`);
    assert.ok((record[locale] as string).trim(), `${label}.${locale} is not empty`);
  }
}

test("five service IDs, exact localized routes, titles and descriptions remain stable", () => {
  assert.deepEqual(serviceOffers.map(({ id }) => id), ["saas", "automation", "agents", "websites", "landing-pages"]);
  assert.equal(new Set(serviceOffers.map(({ id }) => id)).size, serviceOffers.length);
  for (const offer of serviceOffers) {
    assert.deepEqual(offer.slugs, expectedSlugs[offer.id]);
    for (const locale of locales) {
      assert.equal(getServiceOffer(locale, offer.slugs[locale]), offer);
      assertLocalized(offer.title, `${offer.id}.title`);
      assertLocalized(offer.metaTitle, `${offer.id}.metaTitle`);
      assertLocalized(offer.metaDescription, `${offer.id}.metaDescription`);
    }
  }
});

test("localized service fields and FAQs are complete", () => {
  for (const offer of serviceOffers) {
    for (const field of [offer.label, offer.title, offer.metaTitle, offer.metaDescription, offer.hero, offer.intro, offer.whatsappPrompt]) {
      assertLocalized(field, `${offer.id} localized field`);
    }
    assert.ok(offer.faq.length > 0, `${offer.id} keeps FAQs`);
    for (const item of offer.faq) {
      assertLocalized(item.question, `${offer.id} FAQ question`);
      assertLocalized(item.answer, `${offer.id} FAQ answer`);
    }
    for (const value of [...offer.buyerFit, ...offer.deliverables, ...offer.process.flatMap(({ title, description }) => [title, description])]) {
      assertLocalized(value, `${offer.id} list/process field`);
    }
  }
});

test("service-to-project links are real, reciprocal and explain their relevance", () => {
  for (const offer of serviceOffers) {
    assert.equal(new Set(offer.relatedProjectSlugs).size, offer.relatedProjectSlugs.length);
    assert.deepEqual(Object.keys(offer.relatedProjectReasons).sort(), [...offer.relatedProjectSlugs].sort());
    for (const slug of offer.relatedProjectSlugs) {
      assert.ok(getProjectBySlug(slug), `${slug} exists in project catalogue`);
      assertLocalized(offer.relatedProjectReasons[slug], `${offer.id}.${slug} rationale`);
      assert.ok(getRelatedServiceOffers(slug).some(({ id }) => id === offer.id), `${offer.id} is discoverable from ${slug}`);
    }
  }
  for (const projectSlug of ["archscene", "fullcommerce360", "hermes-agentes"]) {
    assert.ok(getRelatedServiceOffers(projectSlug).length > 0, `${projectSlug} has related services`);
  }
  assert.deepEqual(getRelatedServiceOffers("unrelated-project"), []);
});

test("agent offer names a bounded task and concrete delivery, access and cost boundaries", () => {
  const offer = serviceOffers.find(({ id }) => id === "agents");
  assert.ok(offer);
  const pt = [offer.title.pt, offer.metaDescription.pt, offer.intro.pt, ...offer.deliverables.map(({ pt: text }) => text), ...offer.faq.map(({ question, answer }) => `${question.pt} ${answer.pt}`)].join(" ").toLocaleLowerCase("pt-BR");
  const en = [offer.title.en, offer.metaDescription.en, offer.intro.en, ...offer.deliverables.map(({ en: text }) => text), ...offer.faq.map(({ question, answer }) => `${question.en} ${answer.en}`)].join(" ").toLowerCase();
  for (const term of ["tarefa", "ferramentas", "integrações", "ambiente", "acessos", "revogados", "provedor", "custos", "manutenção", "exclusões"]) assert.ok(pt.includes(term), `Portuguese agent copy includes ${term}`);
  for (const term of ["task", "tools", "integrations", "runtime", "access", "revoked", "provider", "costs", "maintenance", "exclusions", "hermes", "openclaw", "official affiliation", "certification"]) assert.ok(en.includes(term), `English agent copy includes ${term}`);
  assert.equal(offer.whatsappPrompt.pt, "Olá! Quero avaliar um agente de IA privado. A tarefa que ele precisa executar é: ");
  assert.equal(offer.whatsappPrompt.en, "Hi! I want to evaluate a private AI agent. The task it needs to execute is: ");
});

test("website and landing-page offers are distinct, scoped and commercially honest", () => {
  const website = getServiceOffer("pt", "criacao-de-sites");
  const landing = getServiceOffer("pt", "criacao-de-landing-pages");
  assert.ok(website && landing);
  assert.notEqual(website.id, landing.id);
  for (const offer of [website, landing]) {
    assert.ok(offer.deliverables.length >= 3);
    assert.ok(offer.faq.length >= 3);
    assert.ok(offer.relatedProjectSlugs.length >= 2);
    for (const locale of locales) {
      assert.ok(offer.metaDescription[locale].length > 60);
      assert.ok(offer.whatsappPrompt[locale].length > 20);
      assert.ok(offer.intro[locale].length > 100);
      assert.ok(offer.faq.every(({ question, answer }) => question[locale] && answer[locale]));
    }
  }
  assert.match(website.faq[2].answer.pt, /Não há garantia/);
  assert.match(landing.faq[0].answer.en, /do not promise conversion rates/i);
});

test("SaaS offer starts with founder domain knowledge and disclaims product-market guarantees", () => {
  const offer = getServiceOffer("pt", "desenvolvimento-saas");
  assert.ok(offer);
  const pt = [offer.metaDescription.pt, offer.intro.pt, ...offer.process.map(({ description }) => description.pt), ...offer.faq.map(({ answer }) => answer.pt)].join(" ").toLowerCase();
  const en = [offer.metaDescription.en, offer.intro.en, ...offer.process.map(({ description }) => description.en), ...offer.faq.map(({ answer }) => answer.en)].join(" ").toLowerCase();
  for (const term of ["conhecimento", "acesso", "hipótese", "mvp", "não garante", "receita"]) assert.ok(pt.includes(term), `Portuguese SaaS copy includes ${term}`);
  for (const term of ["domain knowledge", "access", "hypothesis", "mvp", "does not guarantee", "revenue"]) assert.ok(en.includes(term), `English SaaS copy includes ${term}`);
});

test("automation offer frames Hermes and OpenClaw as scoped options, not blanket promises", () => {
  const offer = serviceOffers.find(({ id }) => id === "automation");
  assert.ok(offer);
  for (const locale of locales) {
    const copy = [offer.intro[locale], ...offer.faq.map(({ answer }) => answer[locale])].join(" ");
    assert.match(copy, /Hermes/);
    assert.match(copy, /OpenClaw/);
    assert.match(copy, locale === "pt" ? /isso não significa que qualquer agente seja adequado nem implica vínculo ou certificação oficial/ : /this does not mean every agent is suitable or imply official affiliation or certification/i);
  }
});

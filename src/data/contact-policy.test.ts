import assert from "node:assert/strict";
import test from "node:test";
import { COMPANY } from "./company";
import { getLegalDocument } from "./legal";

test("business WhatsApp matches the number confirmed by Jean", () => {
  assert.equal(COMPANY.whatsappUrl, "https://wa.me/5511914826568");
  assert.equal(COMPANY.whatsappDisplay, "+55 11 91482-6568");
  assert.equal(new URL(COMPANY.whatsappUrl).pathname.slice(1), COMPANY.whatsappDisplay.replace(/\D/g, ""));
});

for (const locale of ["pt", "en"] as const) {
  test(`${locale}: legal contact follows the canonical business number`, () => {
    for (const slug of ["termos", "privacidade"] as const) {
      const text = JSON.stringify(getLegalDocument(slug, locale));
      assert.ok(text.includes(COMPANY.whatsappDisplay));
      assert.ok(text.includes(COMPANY.email));
    }
  });
  test(`${locale}: privacy separates consented Telegram handoff from optional memory`, () => {
    const doc = getLegalDocument("privacidade", locale);
    const handoff = doc.sections.find(section => section.title.includes("Telegram"));
    const memory = doc.sections.find(section => section.title === (locale === "pt" ? "Memória opcional da Nora" : "Optional Nora memory"));
    assert.ok(handoff);
    assert.ok(memory);
    const handoffText = handoff.paragraphs.join(" ");
    const memoryText = memory.paragraphs.join(" ");
    assert.match(handoffText, locale === "pt" ? /consentimento explícito/ : /explicit consent/);
    assert.match(handoffText, locale === "pt" ? /não para campanhas de marketing/ : /not for marketing campaigns/);
    assert.match(handoffText, locale === "pt" ? /não significa.*já foi entregue/ : /does not mean.*has been delivered/);
    assert.match(memoryText, locale === "pt" ? /desativada por padrão/ : /off by default/);
    assert.match(memoryText, locale === "pt" ? /até 30 dias/ : /up to 30 days/);
    assert.match(memoryText, locale === "pt" ? /permissão separada/ : /permission separate/);
    assert.match(memoryText, /backup/);
    assert.doesNotMatch(JSON.stringify(doc), /(?:automatically deleted after 90|excluídos automaticamente após 90)/i);
  });
}

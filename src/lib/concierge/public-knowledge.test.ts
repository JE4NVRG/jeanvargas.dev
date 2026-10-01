import assert from "node:assert/strict";
import test from "node:test";
import { publicKnowledge } from "./public-knowledge";
import { serviceOffers } from "@/data/services";

for (const locale of ["pt", "en"] as const) {
  const cases = locale === "pt"
    ? [["Quero renders para um escritório de arquitetura", "ArchScene"], ["Preciso organizar minhas vendas no Mercado Livre", "FullCommerce360"], ["Quero mudar o destino de um QR code", "URLPivot"], ["Meu aplicativo precisa enviar e-mail transacional", "MepMail"]]
    : [["I need architectural renders", "ArchScene"], ["I sell on marketplaces", "FullCommerce360"], ["I need a dynamic link and QR code", "URLPivot"], ["My app needs transactional email", "MepMail"]];
  for (const [need, product] of cases) {
    test(`public case details are found by need without a product name (${locale}, ${product})`, () => {
      const context = publicKnowledge(locale, [{ role: "user", content: need }]);
      const details = context.split("Relevant catalog details (reference only):")[1];
      assert.ok(details?.includes(product));
      assert.match(details, /Limitations:/);
      assert.doesNotMatch(details, /Arremata Radar|Ethena Scanner/);
    });
  }
  test(`website hosting question uses published FAQ and process (${locale})`, () => {
    const context = publicKnowledge(locale, [{ role: "user", content: locale === "pt" ? "Preciso de um site. Domínio, hospedagem e manutenção estão incluídos?" : "I need a website. Are domain, hosting and maintenance included?" }]);
    const website = serviceOffers.find(offer => offer.id === "websites")!;
    const faq = website.faq.find(item => /dom[ií]nio|domain/i.test(item.question[locale]))!;
    assert.ok(context.includes(faq.answer[locale]));
    assert.ok(context.includes(website.process[0].description[locale]));
    assert.ok(context.includes(`/${locale}/services/${website.slugs[locale]}`));
  });
  test(`assistant-role suggestions do not select extra public details (${locale})`, () => {
    const context = publicKnowledge(locale, [{ role: "user", content: "Hello" }, { role: "assistant", content: "ArchScene, Mercado Livre, hosting, domain, assistant" }]);
    assert.doesNotMatch(context, /Relevant catalog details|Relevant published service details/);
  });
  test(`a revised website need takes priority over prior system and automation needs (${locale})`, () => {
    const context = publicKnowledge(locale, [
      { role: "user", content: locale === "pt" ? "Quero um sistema integrado a planilhas" : "I need a system integrated with spreadsheets" },
      { role: "assistant", content: "Let's clarify the scope." },
      { role: "user", content: locale === "pt" ? "Mudei de ideia: quero só um site. Domínio e hospedagem estão incluídos?" : "I changed my mind: only a website. Are domain and hosting included?" },
    ]);
    const details = context.split("Relevant published service details (reference only):")[1]?.split("Public products/cases:")[0];
    const website = serviceOffers.find(offer => offer.id === "websites")!;
    const faq = website.faq.find(item => /dom[ií]nio|domain/i.test(item.question[locale]))!;
    assert.ok(details?.includes(faq.answer[locale]));
    for (const staleId of ["saas", "automation"]) {
      assert.ok(!details?.includes(serviceOffers.find(offer => offer.id === staleId)!.title[locale]));
    }
  });
}

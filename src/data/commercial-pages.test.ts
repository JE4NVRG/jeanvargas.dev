import assert from "node:assert/strict";
import test from "node:test";
import { serviceOffers } from "./services";

test("websites and landing pages have distinct bilingual commercial destinations", () => {
  for (const slugs of [
    { pt: "criacao-de-sites", en: "business-websites" },
    { pt: "criacao-de-landing-pages", en: "landing-page-development" },
  ]) {
    const offer = serviceOffers.find((entry) => entry.slugs.pt === slugs.pt);
    assert.ok(offer, `Missing commercial destination ${slugs.pt}`);
    assert.equal(offer.slugs.en, slugs.en);
    assert.ok(offer.relatedProjectSlugs.length > 0, "Link genuine project evidence");
    for (const locale of ["pt", "en"] as const) {
      assert.ok(offer.metaDescription[locale].length > 60);
      assert.ok(offer.faq.length >= 3);
      assert.ok(offer.whatsappPrompt[locale].length > 20);
      assert.ok(offer.deliverables.length >= 3);
    }
  }
});

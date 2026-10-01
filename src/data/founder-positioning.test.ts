import assert from "node:assert/strict";
import test from "node:test";
import { en } from "../i18n/translations/en";
import { pt } from "../i18n/translations/pt";
import { COMPANY } from "./company";
import { buildMessages } from "../lib/concierge/concierge";

for (const [locale, copy] of [["pt", pt], ["en", en]] as const) {
  test(`${locale}: founder positioning remains grounded and names supported agent tools`, () => {
    assert.match(copy.hero.subtitle, locale === "pt" ? /experiência em produtos/ : /domain expertise into digital products/);
    assert.match(copy.about.bio, locale === "pt" ? /feedback real/ : /real feedback/);
    const capabilities = [...copy.hero.strengths, ...copy.services.items.map(item => item.description)].join(" ");
    assert.match(capabilities, /Hermes/);
    assert.match(capabilities, /OpenClaw/);
    const [context] = buildMessages(locale, [{ role: "user", content: "Can my experience become a product?" }]);
    assert.match(context.content, /Founder-market fit (?:means|starts with)/);
    assert.match(context.content, /(?:not a guarantee of|does not guarantee) product-market fit/);
    assert.match(context.content, /(?:not software authored by JE4NDEV|not original JE4NDEV software) or an official vendor partnership/);
    assert.ok(context.content.includes(COMPANY.whatsappUrl));
  });
}

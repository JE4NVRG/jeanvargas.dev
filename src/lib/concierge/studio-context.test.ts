import assert from "node:assert/strict";
import test from "node:test";
import { buildMessages } from "./concierge";
import { studioPositioning } from "./studio-context";

for (const locale of ["pt", "en"] as const) {
  test(`studio positioning is included in the trusted system context (${locale})`, () => {
    const [system, user] = buildMessages(locale, [{ role: "user", content: locale === "pt" ? "Por que a JE4NDEV está crescendo?" : "Why is JE4NDEV growing?" }]);
    assert.equal(system.role, "system");
    assert.ok(system.content.includes(studioPositioning(locale)));
    assert.equal(user.role, "user");
    assert.equal(user.content, locale === "pt" ? "Por que a JE4NDEV está crescendo?" : "Why is JE4NDEV growing?");
  });
  test(`studio context avoids unsupported growth and oversized recommendations (${locale})`, () => {
    const text = studioPositioning(locale);
    assert.match(text, /MepMail/);
    assert.match(text, /API.*SMTP/);
    assert.match(text, /MCP/);
    assert.match(text, locale === "pt" ? /não comprova crescimento de faturamento, clientes ou equipe/ : /does not establish revenue, customer or team growth/);
    assert.match(text, locale === "pt" ? /UM caso público relevante/ : /ONE relevant public case/);
    assert.match(text, locale === "pt" ? /contato voluntário/ : /voluntary contact/);
    assert.match(text, locale === "pt" ? /Nunca se apresente como humana/ : /Never present yourself as human/);
    assert.match(text, locale === "pt" ? /quando um site resolver/ : /when a website would solve/);
    assert.doesNotMatch(text, /\d+%|\$\s*\d|R\$\s*\d|unlimited|ilimitad/i);
  });
}

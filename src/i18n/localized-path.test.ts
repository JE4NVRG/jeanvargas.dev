import assert from "node:assert/strict";
import test from "node:test";
import { localizedPath } from "./localized-path";

test("uses canonical alternate slugs for service language switches", () => {
  assert.equal(localizedPath("/pt/services/agentes-ia-privados", "en", "https://je4ndev.com/en/services/private-ai-agents"), "/en/services/private-ai-agents");
  assert.equal(localizedPath("/en/services/private-ai-agents", "pt", "https://je4ndev.com/pt/services/agentes-ia-privados"), "/pt/services/agentes-ia-privados");
});

test("keeps shared slugs and home navigation working without metadata", () => {
  assert.equal(localizedPath("/pt/projects/archscene", "en"), "/en/projects/archscene");
  assert.equal(localizedPath("/en", "pt"), "/pt");
});

test("rejects external, executable or wrong-locale alternates", () => {
  for (const href of ["https://other.test/en/attack", "javascript:alert(1)", "https://je4ndev.com/pt/other", "https://je4ndev.com/english", "invalid"])
    assert.equal(localizedPath("/pt/projects/archscene", "en", href), "/en/projects/archscene");
});

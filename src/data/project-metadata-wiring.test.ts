import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("project route uses dedicated SEO descriptions, not short card copy", () => {
  const source = readFileSync(new URL("../app/[locale]/projects/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /const description = getProjectSeoDescription\(project\.slug, locale\)/);
  assert.doesNotMatch(source, /const description = project\.description\[locale\]/);
  assert.match(source, /description: getProjectSeoDescription\(project\.slug, locale\)/);
});

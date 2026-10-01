import assert from "node:assert/strict";
import test from "node:test";
import { projects } from "./projects";

test("URLPivot is presented as an own public product, not an internal-only tool", () => {
  const project = projects.find(item => item.slug === "urlpivot");
  assert.ok(project);
  assert.equal(project.status, "live");
  assert.equal(project.role, "own-product");
  assert.equal(project.links.live, "https://urlpivot.app");
  for (const locale of ["pt", "en"] as const) {
    assert.match(project.longDescription[locale], /QR/);
    assert.match(project.longDescription[locale], /Pages?/);
    assert.match(project.longDescription[locale], /MCP/);
    assert.doesNotMatch(project.scope[locale], /internal|interna/i);
    assert.doesNotMatch(project.longDescription[locale], /LinkOps|dogfood|fail.closed/i);
  }
});

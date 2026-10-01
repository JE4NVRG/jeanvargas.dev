import assert from "node:assert/strict";
import test from "node:test";
import robots from "../app/robots";

test("public search discovery is permitted without opening API routes", () => {
  const policy = robots();
  const groups = Array.isArray(policy.rules) ? policy.rules : [policy.rules];
  for (const agent of ["OAI-SearchBot", "PerplexityBot", "Googlebot", "bingbot", "Claude-SearchBot"]) {
    const explicit = groups.filter((rule) => [rule.userAgent].flat().includes(agent));
    const effective = explicit.length ? explicit : groups.filter((rule) => [rule.userAgent].flat().includes("*"));
    assert.ok(effective.length, `${agent}: no discovery policy`);
    assert.ok(effective.some((rule) => [rule.allow].flat().includes("/")), `${agent}: public access`);
    assert.ok(effective.every((rule) => ![rule.disallow].flat().includes("/")), `${agent}: no blanket denial`);
    assert.ok(effective.some((rule) => [rule.disallow].flat().includes("/api/")), `${agent}: API exclusion retained`);
  }
  assert.equal(policy.sitemap, "https://je4ndev.com/sitemap.xml");
  assert.equal(policy.host, "https://je4ndev.com");
});

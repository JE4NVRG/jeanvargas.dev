import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "@/app/sitemap";
import { projects } from "@/data/projects";
import { serviceOffers } from "@/data/services";

const BASE = "https://je4ndev.com";
const entries = sitemap();
const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

test("sitemap preserves all expected localized routes exactly once", () => {
  const expected = [
    ...["pt", "en"].map((locale) => `${BASE}/${locale}`),
    ...["pt", "en"].flatMap((locale) => projects.map((project) => `${BASE}/${locale}/projects/${project.slug}`)),
    ...serviceOffers.flatMap((offer) => [
      `${BASE}/pt/services/${offer.slugs.pt}`,
      `${BASE}/en/services/${offer.slugs.en}`,
    ]),
    ...["pt", "en"].flatMap((locale) => ["termos", "privacidade"].map((slug) => `${BASE}/${locale}/${slug}`)),
  ];
  assert.equal(entries.length, expected.length);
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length, "URLs must be unique");
  assert.deepEqual([...byUrl.keys()].sort(), expected.sort());
  assert.ok(entries.every((entry) => new URL(entry.url).host === "je4ndev.com"));
});

test("sitemap does not fabricate lastModified timestamps", () => {
  assert.ok(entries.every((entry) => entry.lastModified === undefined));
});

test("every localized alternate pair is reciprocal and maps to the localized service slug", () => {
  for (const offer of serviceOffers) {
    assert.ok(byUrl.has(`${BASE}/pt/services/${offer.slugs.pt}`));
    assert.ok(byUrl.has(`${BASE}/en/services/${offer.slugs.en}`));
    assert.equal(offer.slugs.pt === offer.slugs.en, false, `${offer.id} should retain its distinct localized slugs`);
  }
  for (const entry of entries) {
    const languages = entry.alternates?.languages;
    assert.ok(languages, `${entry.url} must declare alternates`);
    for (const alternate of [languages["pt-BR"], languages["en-US"]]) {
      assert.ok(alternate);
      const reciprocal = byUrl.get(alternate);
      assert.ok(reciprocal, `Missing alternate route ${alternate}`);
      const reciprocalLanguages = reciprocal.alternates?.languages;
      assert.ok(Object.values(reciprocalLanguages ?? {}).includes(entry.url), `${alternate} must point back to ${entry.url}`);
    }
  }
});

test("regex metadata extraction fixture documents supported attribute order and duplicate templates", () => {
  const fixture = '<html lang="pt-BR"><head><title>Page title</title><meta content="A description" name="description"><link href="https://je4ndev.com/pt" rel="canonical"><meta name="robots" content="index,follow"></head><body><template><title>Page title</title></template></body></html>';
  const unique = (values: string[]) => [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  assert.deepEqual(unique([...fixture.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)].map((match) => match[1])), ["Page title"]);
  assert.equal(fixture.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0].match(/content=["']([^"']*)["']/i)?.[1], "A description");
});

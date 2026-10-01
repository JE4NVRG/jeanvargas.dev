import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PROJECT_SEO_DESCRIPTIONS,
  getProjectSeoDescription,
  type ProjectSeoLocale,
} from "./project-seo";
import { projects } from "./projects";

const LOCALES: ProjectSeoLocale[] = ["pt", "en"];

/** Editorial contract: 150-160 JS characters, not a search-engine ranking rule. */
const MIN_LENGTH = 150;
const MAX_LENGTH = 160;

const projectSlugs = projects.map((project) => project.slug).sort();
const catalogSlugs = Object.keys(PROJECT_SEO_DESCRIPTIONS).sort();
const entries = Object.entries(PROJECT_SEO_DESCRIPTIONS).sort(([a], [b]) =>
  a.localeCompare(b),
);

test("catalog covers exactly the project slugs, PT and EN, with no gaps", () => {
  assert.deepEqual(catalogSlugs, projectSlugs);
  assert.ok(catalogSlugs.length > 0);
  for (const [slug, entry] of entries) {
    assert.deepEqual(Object.keys(entry).sort(), ["en", "pt"], `unexpected keys for ${slug}`);
    for (const locale of LOCALES) {
      const value = entry[locale];
      assert.equal(typeof value, "string", `${slug}/${locale} must be a string`);
      assert.ok(value.trim().length > 0, `${slug}/${locale} must not be empty`);
      assert.equal(value, value.trim(), `${slug}/${locale} must not have outer whitespace`);
    }
  }
});

test("every description respects the 150-160 character editorial contract", () => {
  for (const [slug, entry] of entries) {
    for (const locale of LOCALES) {
      const value = entry[locale];
      assert.ok(
        value.length >= MIN_LENGTH,
        `${slug}/${locale} is ${value.length} chars, below ${MIN_LENGTH}`,
      );
      assert.ok(
        value.length <= MAX_LENGTH,
        `${slug}/${locale} is ${value.length} chars, above ${MAX_LENGTH}`,
      );
      assert.doesNotMatch(value, /\.\.\.|…/, `${slug}/${locale} must not use ellipses`);
      assert.doesNotMatch(value, / {2,}/, `${slug}/${locale} must not pad with double spaces`);
      assert.match(value, /[.!?]$/, `${slug}/${locale} must end with sentence punctuation`);
    }
  }
});

test("descriptions are unique per locale", () => {
  for (const locale of LOCALES) {
    const values = entries.map(([, entry]) => entry[locale]);
    assert.equal(
      new Set(values).size,
      values.length,
      `duplicate ${locale} descriptions found in the catalog`,
    );
    assert.equal(values.length, projectSlugs.length);
  }
});

test("descriptions are distinct from card and listing copy", () => {
  for (const project of projects) {
    const entry = PROJECT_SEO_DESCRIPTIONS[project.slug];
    assert.ok(entry, `${project.slug} missing from catalog`);
    for (const locale of LOCALES) {
      assert.notEqual(
        entry[locale],
        project.shortDescription[locale],
        `${project.slug}/${locale} repeats the short card copy`,
      );
      assert.notEqual(
        entry[locale],
        project.description[locale],
        `${project.slug}/${locale} repeats the listing description`,
      );
      assert.notEqual(
        entry[locale],
        project.shortDescription[locale].slice(0, entry[locale].length),
        `${project.slug}/${locale} is a truncated copy of the short card copy`,
      );
      assert.ok(
        !entry[locale].startsWith(project.description[locale].slice(0, 24)),
        `${project.slug}/${locale} reuses the listing copy opening`,
      );
    }
  }
});

test("missing slugs are rejected instead of falling back to short copy", () => {
  for (const missing of ["", "   ", "totally-unknown-project", "nexpanel-2"]) {
    for (const locale of LOCALES) {
      assert.throws(
        () => getProjectSeoDescription(missing, locale),
        (error: unknown) => error instanceof Error,
        `expected ${JSON.stringify(missing)}/${locale} to throw`,
      );
    }
  }

  assert.throws(
    () => getProjectSeoDescription("totally-unknown-project", "en"),
    /totally-unknown-project/,
    "error must name the missing slug",
  );

  assert.throws(
    () => getProjectSeoDescription("nexpanel", "es" as ProjectSeoLocale),
    /locale/,
    "unsupported locale must be rejected",
  );

  // Nothing is ever returned that merely reuses existing short copy.
  for (const missing of ["unknown-a", "unknown-b"]) {
    for (const locale of LOCALES) {
      let result: string | undefined;
      try {
        result = getProjectSeoDescription(missing, locale);
      } catch {
        result = undefined;
      }
      assert.equal(result, undefined);
    }
  }
});

test("every registered slug resolves to its catalog entry", () => {
  for (const [slug, entry] of entries) {
    for (const locale of LOCALES) {
      assert.equal(getProjectSeoDescription(slug, locale), entry[locale]);
    }
  }
});

test("archived, internal and MVP projects state their status honestly", () => {
  const archived = projects.filter((project) => project.status === "archived");
  const internal = projects.filter((project) => project.status === "internal");
  const mvp = projects.filter((project) => project.status === "mvp");

  assert.ok(archived.length > 0 && internal.length > 0 && mvp.length > 0);

  for (const project of archived) {
    const entry = PROJECT_SEO_DESCRIPTIONS[project.slug];
    assert.match(entry.pt, /arquivad/i, `${project.slug}/pt must say it is an archived case`);
    assert.match(entry.en, /archived/i, `${project.slug}/en must say it is an archived case`);
    assert.match(entry.pt, /pausad/i, `${project.slug}/pt must state the deployment is paused`);
    assert.match(entry.en, /paused/i, `${project.slug}/en must state the deployment is paused`);
    assert.match(entry.pt, /demo/i, `${project.slug}/pt must not imply a live demo`);
    assert.match(entry.en, /demo/i, `${project.slug}/en must not imply a live demo`);
  }

  for (const project of internal) {
    const entry = PROJECT_SEO_DESCRIPTIONS[project.slug];
    assert.match(entry.pt, /interno/i, `${project.slug}/pt must say the tool is internal`);
    assert.match(entry.en, /internal/i, `${project.slug}/en must say the tool is internal`);
    assert.match(entry.pt, /MVP/i, `${project.slug}/pt must state the MVP scope`);
    assert.match(entry.en, /MVP/i, `${project.slug}/en must state the MVP scope`);
  }

  for (const project of mvp) {
    const entry = PROJECT_SEO_DESCRIPTIONS[project.slug];
    assert.match(entry.pt, /MVP/i, `${project.slug}/pt must state the MVP scope`);
    assert.match(entry.en, /MVP/i, `${project.slug}/en must state the MVP scope`);
  }
});

test("live public projects are not described as archived, paused or internal", () => {
  const live = projects.filter((project) => project.status === "live");
  assert.ok(live.length > 0);

  for (const project of live) {
    const entry = PROJECT_SEO_DESCRIPTIONS[project.slug];
    for (const locale of LOCALES) {
      assert.doesNotMatch(
        entry[locale],
        /arquivad|archived|pausad|paused/i,
        `${project.slug}/${locale} must not describe a live project as archived/paused`,
      );
      assert.doesNotMatch(
        entry[locale],
        /\bMVP\b/,
        `${project.slug}/${locale} must not describe a live project as an MVP`,
      );
    }
  }
});

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { FLAGSHIP_SLUGS } from "./flagships";
import { projects } from "./projects";
import { getProjectSeoDescription } from "./project-seo";

test("MepMail is a primary product in the catalogue and both locale cases", () => {
  assert.equal(FLAGSHIP_SLUGS[0], "mepmail");
  const project = projects.find(p => p.slug === "mepmail");
  assert.ok(project);
  assert.equal(project.featured, true);
  assert.equal(project.casePriority, 1);
  assert.equal(new Set(projects.map(p => p.casePriority)).size, projects.length);
  assert.equal(project.links.live, "https://mepmail.je4ndev.com");
  assert.equal(project.links.docs, "https://docs-mepmail.je4ndev.com");
  for (const locale of ["pt", "en"] as const) {
    assert.match(project.description[locale], /API/);
    assert.match(project.description[locale], /SMTP/);
    assert.match(project.description[locale], /MCP/);
    assert.match(project.longDescription[locale], /AGPL/);
    const seo = getProjectSeoDescription(project.slug, locale);
    assert.ok(seo.length >= 150 && seo.length <= 160, `${locale} SEO length ${seo.length}`);
  }
});

test("MepMail has separate public product proof and editorial cover with honest provenance", () => {
  const project = projects.find(p => p.slug === "mepmail");
  assert.ok(project?.image);
  assert.ok(project.coverImage);
  assert.notEqual(project.image, project.coverImage);
  assert.equal(existsSync(`public${project.image}`), true);
  assert.equal(existsSync(`public${project.coverImage}`), true);
  assert.equal(project.assetReview.status, "approved");
  assert.match(project.assetReview.note.en, /public|publicly/);
  assert.match(project.assetReview.note.pt, /públic/);
});

test("active homepage showcase and Nora retain MepMail priority", () => {
  const home = readFileSync("src/app/[locale]/page.tsx", "utf8");
  assert.match(home, /import \{ Showcase \} from "@\/components\/sections\/showcase"/);
  const work = readFileSync("src/components/sections/showcase.tsx", "utf8");
  assert.match(work, /FLAGSHIP_SLUGS/);
  const context = readFileSync("src/lib/concierge/studio-context.ts", "utf8");
  assert.match(context, /MepMail é um dos principais/);
  assert.match(context, /MepMail is one of its primary/);
});

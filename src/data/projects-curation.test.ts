import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { FLAGSHIP_SLUGS } from "./flagships";
import { projectCollectionSchema } from "./project-schema";
import { projects } from "./projects";
import { getPrimaryProjectUrl } from "../components/projects/project-links";

const pausedProjects = [
  "arremata-radar",
  "hypefc",
  "stopultimate",
  "alchemix-auditor",
  "ethena-scanner",
];

const pausedDestinations = new Set([
  "https://arremataradar.com",
  "https://hypefc.vercel.app",
  "https://stopultimate.vercel.app/",
  "https://alchemix-auditor.vercel.app",
  "https://ethena-scanner.vercel.app",
]);

test("project catalogue satisfies schema and includes MepMail among the four primary products", () => {
  assert.equal(projectCollectionSchema.safeParse(projects).success, true);
  assert.deepEqual(FLAGSHIP_SLUGS, ["mepmail", "archscene", "fullcommerce360", "urlpivot"]);
  assert.deepEqual(projects.filter((project) => project.featured).map(({ slug }) => slug), [...FLAGSHIP_SLUGS]);
});

test("paused deployments remain case routes but cannot be live project CTAs", () => {
  for (const slug of pausedProjects) {
    const project = projects.find((item) => item.slug === slug);
    assert.ok(project, `${slug} historical route remains in the catalogue`);
    assert.equal(project.status, "archived", `${slug} is labelled archived`);
    assert.equal(project.proofLevel, "case-only", `${slug} cannot claim public-live proof`);
    assert.equal(project.links.live, undefined, `${slug} has no active demo link`);
    assert.ok(!pausedDestinations.has(getPrimaryProjectUrl(project) ?? ""), `${slug} primary CTA is not its paused deployment`);
    assert.match(project.shortDescription.en, /historical case only/i);
    assert.match(project.shortDescription.pt, /case histórico/i);
    assert.ok(project.assetReview.sourceUrl, `${slug} keeps its historical source URL as provenance`);
  }
});

test("URLPivot resolves to the current public product and reviewed screenshot", () => {
  const project = projects.find((item) => item.slug === "urlpivot");
  assert.ok(project);
  assert.equal(project.links.live, "https://urlpivot.app");
  assert.equal(getPrimaryProjectUrl(project), "https://urlpivot.app");
  assert.equal(project.assetReview.sourceUrl, "https://urlpivot.app");
  assert.equal(project.image, "/projects/captures/urlpivot-home-latest.png");
  assert.equal(existsSync(`public${project.image}`), true);
  assert.match(project.assetReview.note.en, /Links, QR Codes and Pages/);
  assert.match(project.assetReview.note.pt, /Links, QR Codes e Pages/);
});

test("Vultrix has no dead public GitHub proof", () => {
  const project = projects.find((item) => item.slug === "vultrix-3d");
  assert.ok(project);
  assert.equal(project.links.github, undefined);
  assert.notEqual(getPrimaryProjectUrl(project), "https://github.com/JE4NVRG/Vultrix");
});

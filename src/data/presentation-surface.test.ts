import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { en } from "../i18n/translations/en";
import { pt } from "../i18n/translations/pt";
import { FLAGSHIP_SLUGS } from "./flagships";
import { projects } from "./projects";
import { folioPose } from "../lib/folio-pose";

const home = readFileSync("src/app/[locale]/page.tsx", "utf8");
const hero = readFileSync("src/components/sections/hero.tsx", "utf8");

test("homepage keeps the flagship stories and lists every other catalogued case", () => {
  assert.match(home, /Showcase/);
  assert.match(home, /ProjectUniverse/);
  assert.match(home, /Capabilities/);
  const archive = new Set(projects.map((project) => project.slug));
  for (const slug of FLAGSHIP_SLUGS) assert.ok(archive.has(slug));
  assert.ok(archive.has("mepchat"));
  assert.ok(archive.has("nora"));
  assert.ok(archive.has("hermes-agentes"));
  assert.ok(archive.has("openclaw-gateway"));
  assert.ok(archive.has("nexpanel"));
  assert.ok(archive.has("arremata-radar"));
});

test("hero sculpture is lazy, two-tone and does not own the first paint", () => {
  assert.match(hero, /next\/dynamic/);
  assert.match(hero, /ssr:\s*false/);
  assert.match(hero, /hero-sculpture-canvas/);
  assert.match(hero, /HeroSculptureFallback/);
  assert.match(hero, /shouldLoadStudioMedia/);
  assert.match(hero, /requestIdleCallback/);
  assert.doesNotMatch(hero, /idea-space/);
  assert.doesNotMatch(readFileSync("src/components/ui/hero-sculpture-canvas.tsx", "utf8"), /useGLTF|TextureLoader|\.glb|\.mp4/);
  assert.ok(folioPose(0).core.sx < 0.05);
  assert.equal(folioPose(2).core.sx, 1);
  assert.ok(folioPose(1).plateA.sx > 0.9);
});

test("capability copy stays inside documented work", () => {
  for (const copy of [en.capabilities, pt.capabilities]) {
    const text = Object.values(copy).join(" ");
    assert.doesNotMatch(text, /FamilyPoints|Movero|testimonial|\$\d|R\$/i);
    assert.match(text, /MepMail/);
    assert.match(text, /FlutterFlow|MepChat/);
    assert.match(text, /MCP/);
  }
});

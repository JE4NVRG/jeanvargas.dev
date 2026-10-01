// Structural guardrails only; these do not replace parent-owned browser/pixel acceptance.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FLAGSHIP_SLUGS } from "./flagships";

const source = readFileSync(new URL("../components/sections/showcase.tsx", import.meta.url), "utf8");
const media = readFileSync(new URL("../components/ui/product-showcase-media.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../components/sections/product-showcase.module.css", import.meta.url), "utf8");

test("only the four original flagship stories, anchors and jump links remain", () => {
  assert.deepEqual([...FLAGSHIP_SLUGS], ["mepmail", "archscene", "fullcommerce360", "urlpivot"]);
  assert.match(source, /id="work"/);
  assert.match(source, /id=\{`project-\$\{project.slug\}`\}/);
  assert.match(source, /href=\{`#project-\$\{project.slug\}`\}/);
  assert.match(source, /alignRight=\{i % 2 === 1\}/);
});

test("public presentation config supplies image selection and truthful captions", () => {
  assert.match(source, /getProductPresentation\(project.slug, locale\)/);
  for (const field of ["images", "tagline", "accent"]) {
    assert.ok(source.includes(`${field}={presentation.${field}}`));
  }
  assert.match(media, /images\[selected\] \?\? images\[0\]/);
  assert.match(media, /aria-pressed=\{index === selected\}/);
  assert.match(media, /image.label/);
  assert.match(media, /Captura pública/);
  assert.match(media, /Public snapshot/);
  assert.match(media, /Composição do produto/);
  assert.match(media, /Product composition/);
  assert.match(media, /current.kind === "composition"/);
  assert.match(media, /viewerImage.kind === "composition"/);
});

test("media has desktop dominance and keeps the entire authentic screenshot on mobile", () => {
  assert.match(css, /\.media \{ grid-column: span 8; \}/);
  assert.match(css, /\.content \{ grid-column: span 4; \}/);
  assert.match(css, /\.image \{[^}]*width: 100%;[^}]*height: auto;[^}]*object-fit: contain;/);
  for (const slug of FLAGSHIP_SLUGS) assert.ok(css.includes(`data-product="${slug}"`));
  assert.doesNotMatch(source + media + css, /object-cover|object-fit:\s*cover|aspect-\[16\/10\]|Vignette|group-hover\/card|FallbackArtwork|workflows ok/);
});

test("main snapshot is server-renderable with intrinsic dimensions and no visibility gate", () => {
  assert.match(media, /<Image src=\{current.src\} alt=\{current.alt\} width=\{current.width\} height=\{current.height\}/);
  assert.match(media, /priority=\{priority && selected === 0\}/);
  assert.doesNotMatch(media + css, /opacity:\s*0|visibility:\s*hidden|backdrop-filter|linear-gradient/);
});

test("viewer provides native modality, Escape, trap, focus return and exact scroll restoration", () => {
  assert.match(media, /dialog.showModal\(\)/);
  assert.match(media, /aria-labelledby=\{`\$\{dialogId\}-title`\}/);
  assert.match(media, /onCancel=\{/);
  assert.match(media, /event.key !== "Tab"/);
  assert.match(media, /event.shiftKey/);
  assert.match(media, /last\?\.focus\(\)/);
  assert.match(media, /first\?\.focus\(\)/);
  assert.match(media, /opener\?\.isConnected/);
  assert.match(media, /opener.focus\(\{ preventScroll: true \}\)/);
  assert.match(media, /document.body.style.overflow = previousOverflow/);
  assert.match(media, /event.target === event.currentTarget/);
  assert.match(media, /event.preventDefault\(\)/);
  assert.match(media, /data-actual-size=\{actualSize\}/);
  assert.match(css, /viewerImage\[data-actual-size="true"\] \{ max-width: none; max-height: none/);
});

test("motion reacts to desktop and reduced-motion changes without pinning or scaling images", () => {
  assert.match(source, /gsap.matchMedia\(\)/);
  assert.match(source, /min-width: 1024px.*prefers-reduced-motion: no-preference/);
  assert.match(source, /return \(\) => motion.revert\(\)/);
  assert.doesNotMatch(source, /pin:\s*true|scale:\s*[\d.]|opacity:\s*0/);
});

test("original localized copy, capability metrics and case/live/GitHub/Page CTAs survive", () => {
  for (const token of ["project.description[locale]", "project.problem[locale]", "project.solution[locale]", "project.metrics.slice(0, 4)", "metric.label[locale]", "project.technologies.slice(0, 6)", "t.work.viewCase", "project.links.live", "project.links.github", "https://urlpivot.app/p/urlpivot", "Ver Page oficial", "View official Page", "Conhecer URLPivot", "Explore URLPivot", "MCP"]) assert.ok(source.includes(token), token);
  assert.match(source, /href=\{`\/\$\{locale\}\/projects\/\$\{project.slug\}`\}/);
  for (const text of ["Ampliar imagem", "Enlarge image", "Tamanho real", "Actual size", "Fechar", "Close"]) assert.ok(media.includes(text));
});

test("every consumed CSS-module class has an actual scoped selector", () => {
  const classes = new Set([...((source + media).matchAll(/styles\.([A-Za-z][A-Za-z0-9]*)/g))].map(match => match[1]));
  for (const name of classes) assert.match(css, new RegExp(`\\.${name}\\b`), name);
});

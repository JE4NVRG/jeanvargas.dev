// Source-bound layout contracts + real asset geometry, not rendered-browser acceptance.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { getProductPresentation } from "./product-presentation";

const css = readFileSync(new URL("../components/sections/product-showcase.module.css", import.meta.url), "utf8");
const media = readFileSync(new URL("../components/ui/product-showcase-media.tsx", import.meta.url), "utf8");
const products = ["mepmail", "archscene", "fullcommerce360"] as const;
const scope = '.figure:is([data-product="mepmail"], [data-product="archscene"], [data-product="fullcommerce360"])';

function declarations(selector: string, source = css): Record<string, string> {
  const rules = [...source.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const rule = rules.find(([, selectors]) => selectors.trim() === selector);
  assert.ok(rule, `Missing scoped rule: ${selector}`);
  return Object.fromEntries(rule[2].split(";").filter(part => part.includes(":")).map(part => {
    const colon = part.indexOf(":");
    return [part.slice(0, colon).trim(), part.slice(colon + 1).trim()];
  }));
}

function stageContract() {
  const button = declarations(`${scope} .imageButton`);
  const image = declarations(`${scope} .image`);
  assert.equal(button.position, "relative");
  assert.equal(button["aspect-ratio"], "16 / 10");
  assert.equal(image.position, "absolute", "Intrinsic image height must not size the stage");
  assert.equal(image.inset, "0");
  assert.equal(image.width, "100%");
  assert.equal(image.height, "100%");
  assert.equal(image["object-fit"], "contain");
  return 16 / 10;
}

test("only the three rejected galleries get a fixed 16:10 contain stage", () => {
  stageContract();
  assert.equal(declarations(".image").height, "auto", "URLPivot keeps natural image height");
  const stageRules = [...css.matchAll(/([^{}]+)\{[^{}]*aspect-ratio\s*:[^{}]*\}/g)];
  assert.equal(stageRules.length, 1);
  assert.ok(!stageRules[0][1].includes("urlpivot"));
  assert.doesNotMatch(css, /object-fit:\s*cover|object-fit:\s*fill/);
});

for (const slug of products) {
  test(`${slug}: every real image fits without distortion or stage-height changes at mobile/tablet/desktop widths`, async () => {
    const ratio = stageContract();
    const images = getProductPresentation(slug, "pt").images;
    assert.ok(images.length >= 2);
    for (const width of [272, 312, 342, 720, 880]) {
      const height = width / ratio;
      const downstreamTops: number[] = [];
      for (const image of images) {
        const actual = await sharp(fileURLToPath(new URL(`../../public${image.src}`, import.meta.url))).metadata();
        assert.equal(actual.width, image.width);
        assert.equal(actual.height, image.height);
        const scale = Math.min(width / image.width, height / image.height);
        const containedWidth = image.width * scale;
        const containedHeight = image.height * scale;
        assert.ok(containedWidth <= width + 1e-8 && containedHeight <= height + 1e-8);
        assert.ok(Math.abs(containedWidth / containedHeight - image.width / image.height) < 1e-8);
        assert.ok(Math.abs(containedWidth - width) < 1e-8 || Math.abs(containedHeight - height) < 1e-8);
        downstreamTops.push(height);
      }
      assert.equal(new Set(downstreamTops).size, 1, "Caption anchor cannot follow natural image height");
    }
  });
}

test("MepMail regression includes three distinct natural ratios and reserves caption label space", () => {
  const images = getProductPresentation("mepmail", "en").images;
  assert.equal(images.length, 3);
  assert.equal(new Set(images.map(image => image.width / image.height)).size, 3);
  assert.equal(declarations(`${scope} .snapshotLabel`)["min-height"], "3.2em");
  assert.equal(declarations(".snapshotLabel")["line-height"], "1.6");
  assert.doesNotMatch(css, /line-clamp|text-overflow:\s*ellipsis/);
});

test("mobile keeps all previews visible, explicit touch targets and the enlargement action", () => {
  const start = css.indexOf("@media (max-width: 599px)");
  assert.ok(start >= 0);
  const mobile = css.slice(start, css.indexOf("@media (prefers-reduced-motion", start));
  const previews = declarations(`${scope} .previews`, mobile);
  assert.equal(previews.display, "grid");
  assert.equal(previews["grid-template-columns"], "repeat(2, minmax(0, 1fr))");
  assert.equal(declarations('.figure[data-product="mepmail"] .previews', mobile)["grid-template-columns"], "repeat(3, minmax(0, 1fr))");
  const preview = declarations(`${scope} .preview`, mobile);
  assert.equal(preview.width, "auto");
  assert.equal(preview["min-width"], "0");
  assert.equal(preview["min-height"], "44px");
  assert.equal(preview["touch-action"], "manipulation");
  assert.equal(declarations(`${scope} .enlarge`, mobile)["align-self"], "stretch");
  assert.match(media, /images\.map\(\(image, index\)/);
  assert.match(media, /aria-pressed=\{index === selected\}/);
});

test("natural-size native dialog and accessible lifecycle remain independent from the main stage", () => {
  const viewer = declarations(".viewerImage");
  assert.equal(viewer.width, "auto");
  assert.equal(viewer.height, "auto");
  const actual = declarations('.viewerImage[data-actual-size="true"]');
  assert.equal(actual["max-width"], "none");
  assert.equal(actual["max-height"], "none");
  assert.equal(declarations(".viewerScroll").overflow, "auto");
  for (const token of ["dialog.showModal()", "if (dialog.open) dialog.close()", "onCancel=", "onClose=", "trapFocus", "opener.focus({ preventScroll: true })", "document.body.style.overflow = previousOverflow", "style={actualSize ? { width: viewerImage.width } : undefined}"]) {
    assert.ok(media.includes(token), token);
  }
});

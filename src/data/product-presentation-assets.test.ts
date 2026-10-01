import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { FLAGSHIP_SLUGS } from "./flagships";
import { getProductPresentation } from "./product-presentation";

for (const slug of FLAGSHIP_SLUGS) {
  test(`${slug} presents real local product media in both languages`, async () => {
    const pt = getProductPresentation(slug, "pt");
    const en = getProductPresentation(slug, "en");
    assert.ok(pt.tagline && en.tagline);
    assert.ok(pt.images.length >= 2);
    assert.equal(pt.images.length, en.images.length);
    assert.notEqual(pt.tagline, en.tagline);
    for (let i = 0; i < pt.images.length; i++) {
      const image = pt.images[i];
      if (image.kind === "composition") {
        assert.equal(en.images[i].kind, "composition");
        assert.equal(image.src.replace(/-pt\.webp$/, "-locale.webp"), en.images[i].src.replace(/-en\.webp$/, "-locale.webp"), "Only authored cover text is localized; underlying public product evidence is preserved");
        const english = await sharp(`public${en.images[i].src}`).metadata();
        assert.equal(english.width, en.images[i].width);
        assert.equal(english.height, en.images[i].height);
      } else {
        assert.equal(image.src, en.images[i].src, "Localization must not fabricate a translated screen");
      }
      assert.ok(image.label && en.images[i].label && image.alt && en.images[i].alt);
      assert.match(image.src, /^\/projects\/(presentation|captures)\//);
      assert.ok(existsSync(`public${image.src}`));
      const actual = await sharp(`public${image.src}`).metadata();
      assert.equal(actual.width, image.width);
      assert.equal(actual.height, image.height);
    }
  });
}

test("ArchScene demonstrates the matching project and render instead of another landing thumbnail", () => {
  const media = getProductPresentation("archscene", "pt");
  assert.equal(media.images[0].kind, "composition");
  assert.match(media.images[0].src, /kitchen-cover-pt/);
  assert.match(media.images[0].alt, /mesmo ambiente/);
  assert.match(media.images[1].src, /kitchen-render/);
  assert.match(media.images[2].src, /kitchen-project/);
  assert.match(media.images[2].alt, /mesmo projeto/);
  assert.doesNotMatch(media.images[0].src, /living|suite|landing/);
});

test("FullCommerce demonstration data is explicitly attributed, never commercial proof", () => {
  for (const locale of ["pt", "en"] as const) {
    for (const image of getProductPresentation("fullcommerce360", locale).images) {
      assert.match(image.label, locale === "pt" ? /demonstração/ : /demonstration/);
      assert.match(image.alt, locale === "pt" ? /fictícios|demonstração/ : /fictional|demonstration/);
    }
  }
});

test("URLPivot uses its actual official Page, not an unlabelled fictional customer", () => {
  const image = getProductPresentation("urlpivot", "pt").images[1];
  assert.match(image.src, /official-page/);
  assert.match(image.label, /oficial/);
  assert.match(image.alt, /não um exemplo fictício/);
});

test("unknown products do not receive invented screenshots", () => {
  assert.deepEqual(getProductPresentation("unlisted", "pt").images, []);
});

test("FullCommerce replaces the rejected dense portrait print with wide authored evidence", () => {
  for (const locale of ["pt", "en"] as const) {
    const media = getProductPresentation("fullcommerce360", locale);
    assert.match(media.images[0].src, /operation-cover/);
    assert.match(media.images[1].src, /radar-cover/);
    for (const image of media.images) {
      assert.equal(image.kind, "composition");
      assert.equal(image.width, 1600);
      assert.equal(image.height, 1000);
      assert.doesNotMatch(image.src, /analytics-demo|ranking-demo/);
    }
  }
});

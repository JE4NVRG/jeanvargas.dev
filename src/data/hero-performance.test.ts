import assert from "node:assert/strict";
import test from "node:test";
import { shouldLoadHeroVideo } from "@/components/ui/hero-video-bg";

const desktop = {
  isMobile: false,
  reducedMotion: false,
  saveData: false,
} as const;

test("hero video remains eligible on a visible-capable desktop profile", () => {
  assert.equal(shouldLoadHeroVideo(desktop), true);
});

test("hero video is omitted on mobile", () => {
  assert.equal(shouldLoadHeroVideo({ ...desktop, isMobile: true }), false);
});

test("hero video is omitted when reduced motion is requested", () => {
  assert.equal(shouldLoadHeroVideo({ ...desktop, reducedMotion: true }), false);
});

test("hero video is omitted for Save-Data and slow network hints", () => {
  assert.equal(shouldLoadHeroVideo({ ...desktop, saveData: true }), false);
  for (const effectiveType of ["slow-2g", "2g", "3g"]) {
    assert.equal(shouldLoadHeroVideo({ ...desktop, effectiveType }), false);
  }
});

test("4g and unknown network types do not suppress desktop video", () => {
  assert.equal(shouldLoadHeroVideo({ ...desktop, effectiveType: "4g" }), true);
  assert.equal(shouldLoadHeroVideo({ ...desktop, effectiveType: "unknown" }), true);
});

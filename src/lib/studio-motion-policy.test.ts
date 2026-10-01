import assert from "node:assert/strict";
import test from "node:test";
import { isStudioPlaybackFailure, shouldLoadStudioMedia, shouldPlayStudioMedia } from "./studio-motion-policy";

const desktop = {
  ready: true,
  isMobile: false,
  reducedMotion: false,
  saveData: false,
  inView: true,
  documentVisible: true,
  userPaused: false,
  failed: false,
};

test("SSR and hydration start with the still, not a speculative video download", () => {
  assert.equal(shouldLoadStudioMedia({ ...desktop, ready: false }), false);
  assert.equal(shouldPlayStudioMedia({ ...desktop, ready: false }), false);
});

test("visible desktop permits motion on fast or unknown connections", () => {
  for (const effectiveType of [undefined, "4g", "unknown"]) {
    assert.equal(shouldPlayStudioMedia({ ...desktop, effectiveType }), true);
  }
});

test("mobile, reactive reduced motion, Save-Data and slow connections use a still", () => {
  for (const override of [{ isMobile: true }, { reducedMotion: true }, { saveData: true }]) {
    assert.equal(shouldLoadStudioMedia({ ...desktop, ...override }), false);
  }
  for (const effectiveType of ["slow-2g", "2g", "3g"]) {
    assert.equal(shouldLoadStudioMedia({ ...desktop, effectiveType }), false);
  }
});

test("offscreen, background, user pause and media failure independently stop playback", () => {
  for (const override of [{ inView: false }, { documentVisible: false }, { userPaused: true }, { failed: true }]) {
    assert.equal(shouldPlayStudioMedia({ ...desktop, ...override }), false);
  }
});

test("user pause persists across exit, background, return and preference changes", () => {
  for (const override of [{ inView: false }, { documentVisible: false }, { reducedMotion: true }, {}]) {
    assert.equal(shouldPlayStudioMedia({ ...desktop, ...override, userPaused: true }), false);
  }
  assert.equal(shouldPlayStudioMedia({ ...desktop, userPaused: false }), true);
});

test("rejected play has a recoverable fallback; a pause race is not a failure", () => {
  assert.equal(isStudioPlaybackFailure({ name: "AbortError" }), false);
  assert.equal(isStudioPlaybackFailure({ name: "NotAllowedError" }), true);
  assert.equal(isStudioPlaybackFailure(new Error("decode failure")), true);
  assert.equal(isStudioPlaybackFailure(undefined), true);
});

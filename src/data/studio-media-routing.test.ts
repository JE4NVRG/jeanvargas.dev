import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("locale proxy excludes the owned motion-media directory from locale redirects", () => {
  const text = readFileSync("src/proxy.ts", "utf8");
  assert.match(text, /\|videos\|media\|brand/);
  const sources = [
    readFileSync("src/components/ui/studio-hero-media.tsx", "utf8"),
    readFileSync("src/components/ui/studio-reel.tsx", "utf8"),
  ];
  assert.ok(sources.every(source => source.includes("/media/je4ndev/")));
});

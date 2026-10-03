/** Diagnostic regression: live validated source, isolated temporary ledger only.
 * Run in je4ndev-portfolio-linux-build from /cache/work/source:
 * node node_modules/tsx/dist/cli.mjs --tsconfig /cache/work/source/tsconfig.json --test src/lib/concierge/verification-clock-order.test.ts
 * The two inverted-arrival cases are intended to fail while the race is present.
 * No Turnstile, model, production database or other service is called.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ProtectionError, rateNoraVerification } from "./protection";

const NOW = new Date("2026-10-03T12:00:00.000Z");
const IP_A = "192.0.2.201", IP_B = "192.0.2.202";
async function fixture() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "nora-verification-clock-"));
  const env: NodeJS.ProcessEnv = {
    NODE_ENV: "test", HERMES_CONCIERGE_ORIGIN: "http://portfolio.test",
    HERMES_CONCIERGE_STATE_DIR: dir, HERMES_CONCIERGE_SALT: "synthetic-verification-clock-salt",
    HERMES_CONCIERGE_TURNSTILE_SITE_KEY: "synthetic-public-site-key",
    HERMES_CONCIERGE_TURNSTILE_SECRET_KEY: "synthetic-private-secret",
  };
  const file = path.join(dir, "nora-verification-attempts.json");
  const key = (ip: string) => createHash("sha256").update(`${env.HERMES_CONCIERGE_SALT}:${ip}`).digest("hex");
  const req = (ip: string) => new Request("http://portfolio.test/api/leads", { headers: { "x-real-ip": ip } });
  return { env, file, key, req, close: async () => {
    assert.equal(path.dirname(dir), os.tmpdir());
    assert.ok(path.basename(dir).startsWith("nora-verification-clock-"));
    await rm(dir, { recursive: true, force: true });
  } };
}
const rejected = (error: unknown, status: number, code: string) => error instanceof ProtectionError && error.status === status && error.code === code;

for (const sameIp of [true, false]) {
  test(`earlier request admitted after later request (${sameIp ? "same IP" : "different IPs"}) should remain valid`, async () => {
    const f = await fixture();
    try {
      // A captures now0 first. Body parsing/other locks may make B persist first.
      const capturedByA = new Date(NOW);
      const capturedByB = new Date(NOW.getTime() + 1);
      await rateNoraVerification(f.req(sameIp ? IP_A : IP_B), f.env, capturedByB);
      const before = await readFile(f.file, "utf8");
      let error: unknown;
      try { await rateNoraVerification(f.req(IP_A), f.env, capturedByA); }
      catch (caught) { error = caught; }
      if (error) {
        assert.ok(rejected(error, 503, "protection_unavailable"));
        assert.equal(await readFile(f.file, "utf8"), before, "Rejected request must not rewrite the ledger");
      }
      assert.equal(error, undefined, "A valid recorded attempt 1 ms after request start must not make that request protection_unavailable");
      const ledger = JSON.parse(await readFile(f.file, "utf8")) as Record<string, number[]>;
      assert.equal(Object.values(ledger).reduce((count, times) => count + times.length, 0), 2);
      assert.equal(Object.keys(ledger).length, sameIp ? 1 : 2);
    } finally { await f.close(); }
  });
}

test("control: true future timestamp fails closed and leaves the ledger unchanged", async () => {
  const f = await fixture();
  try {
    const future = NOW.getTime() + 60_001;
    const ledger = JSON.stringify({ [f.key(IP_B)]: [future] });
    await writeFile(f.file, ledger, { flag: "wx", mode: 0o600 });
    await assert.rejects(rateNoraVerification(f.req(IP_A), f.env, NOW), error => rejected(error, 503, "protection_unavailable"));
    assert.equal(await readFile(f.file, "utf8"), ledger);
  } finally { await f.close(); }
});

test("control: attempts one millisecond ahead still spend the twenty-attempt cap and expire", async () => {
  const f = await fixture();
  try {
    const ahead = new Date(NOW.getTime() + 1);
    for (let i = 0; i < 20; i++) await rateNoraVerification(f.req(IP_A), f.env, ahead);
    await assert.rejects(rateNoraVerification(f.req(IP_A), f.env, NOW), error => rejected(error, 429, "busy"));
    assert.equal(JSON.parse(await readFile(f.file, "utf8"))[f.key(IP_A)].length, 20);
    await rateNoraVerification(f.req(IP_A), f.env, new Date(NOW.getTime() + 60_002));
    assert.equal(JSON.parse(await readFile(f.file, "utf8"))[f.key(IP_A)].length, 1);
  } finally { await f.close(); }
});

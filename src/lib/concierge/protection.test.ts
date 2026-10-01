import assert from "node:assert/strict";
import test from "node:test";
import { noraProtection, ProtectionError, verifyNoraProtection } from "./protection";

const env: NodeJS.ProcessEnv = { NODE_ENV: "production", HERMES_CONCIERGE_ORIGIN: "https://je4ndev.com", HERMES_CONCIERGE_TURNSTILE_SITE_KEY: "public-real-sitekey", HERMES_CONCIERGE_TURNSTILE_SECRET_KEY: "synthetic-private-secret" };
const req = (token = "synthetic-token") => new Request("https://je4ndev.com/api/concierge", { headers: { "x-nora-turnstile": token } });
const reply = (value: unknown) => (async () => Response.json(value)) as typeof fetch;

test("public production fails closed without protection, and never accepts test keys", () => {
  assert.equal(noraProtection({ NODE_ENV: "test" }), null);
  assert.throws(() => noraProtection({ NODE_ENV: "production", HERMES_CONCIERGE_ORIGIN: "https://je4ndev.com" }), ProtectionError);
  for (const mode of ["0", "1"]) assert.throws(() => noraProtection({ ...env, HERMES_CONCIERGE_TURNSTILE_TEST_MODE: mode, HERMES_CONCIERGE_TURNSTILE_SITE_KEY: "1x00000000000000000000AA" }), ProtectionError);
  assert.equal(noraProtection({ NODE_ENV: "production", HERMES_CONCIERGE_ORIGIN: "http://127.0.0.1:3188", HERMES_CONCIERGE_TURNSTILE_TEST_MODE: "1", HERMES_CONCIERGE_TURNSTILE_SITE_KEY: "1x00000000000000000000AA", HERMES_CONCIERGE_TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA" })?.testMode, true);
});

test("missing, invalid, duplicated, wrong-host and wrong-action tokens are rejected", async () => {
  let calls = 0;
  const validate = (async () => { calls++; return Response.json({ success: true, hostname: "je4ndev.com", action: "nora_chat" }); }) as typeof fetch;
  await assert.rejects(verifyNoraProtection(req(""), env, validate), ProtectionError);
  await assert.rejects(verifyNoraProtection(req("a".repeat(2049)), env, validate), ProtectionError);
  assert.equal(calls, 0);
  for (const value of [{ success: false, "error-codes": ["timeout-or-duplicate"] }, { success: true, hostname: "attacker.invalid", action: "nora_chat" }, { success: true, hostname: "je4ndev.com", action: "login" }]) {
    await assert.rejects(verifyNoraProtection(req(), env, reply(value)), (error: unknown) => error instanceof ProtectionError && error.code === "verification_required");
  }
  await verifyNoraProtection(req(), env, validate);
});

test("validation sends no visitor IP/session/chat, refuses redirects and hides failures", async () => {
  const validate = (async (url: URL | RequestInfo, init?: RequestInit) => {
    assert.equal(String(url), "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(init?.redirect, "error");
    assert.deepEqual(JSON.parse(String(init?.body)), { secret: "synthetic-private-secret", response: "synthetic-token" });
    return Response.json({ success: true, hostname: "je4ndev.com", action: "nora_chat" });
  }) as typeof fetch;
  await verifyNoraProtection(req(), env, validate);
  for (const fake of [(async () => { throw new Error("private detail"); }) as typeof fetch, (async () => new Response("a".repeat(5000))) as typeof fetch]) {
    await assert.rejects(verifyNoraProtection(req(), env, fake), (error: unknown) => error instanceof ProtectionError && error.code === "protection_unavailable" && !String(error).includes("private detail"));
  }
});

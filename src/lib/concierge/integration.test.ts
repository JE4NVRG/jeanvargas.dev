import { authorizeFixture } from "./test-fixture";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildMessages, ConciergeError, processConciergeRequest, validatePayload } from "./concierge";

const body = { locale: "pt", messages: [{ role: "user", content: "Quero um site" }] };
function request(origin: string) {
  return new Request("http://localhost:3186/api/concierge", { method: "POST", headers: { origin, "content-type": "application/json", "x-concierge-proxy": "synthetic-ingress-proof", "x-real-ip": "192.0.2.1" }, body: JSON.stringify(body) });
}
const fake: typeof fetch = async (_input, init) => {
  assert.equal(JSON.parse(String(init?.body)).max_tokens, 1400);
  return Response.json({ choices: [{ message: { content: "Synthetic response" } }] });
};

test("trusted deployment origin works behind a proxy; hostile origins remain blocked", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "concierge-proxy-"));
  const env: NodeJS.ProcessEnv = { NODE_ENV: "test", HERMES_CONCIERGE_URL: "http://127.0.0.1:8658/v1/chat/completions", HERMES_CONCIERGE_KEY: "synthetic", HERMES_CONCIERGE_STATE_DIR: dir, HERMES_CONCIERGE_PROXY_KEY: "synthetic-ingress-proof", HERMES_CONCIERGE_SALT: "synthetic-test-salt", HERMES_CONCIERGE_ORIGIN: "https://portfolio.test" };
  try {
    assert.deepEqual(await processConciergeRequest(await authorizeFixture(request("https://portfolio.test"), env), { env, fetcher: fake }), { content: "Synthetic response" });
    await assert.rejects(processConciergeRequest(request("https://attacker.test"), { env, fetcher: fake }), (error: unknown) => error instanceof ConciergeError && error.status === 403);
    await writeFile(path.join(dir, "concierge-quota.lock"), "synthetic abandoned owner");
    let calls = 0;
    await assert.rejects(processConciergeRequest(await authorizeFixture(request("https://portfolio.test"), env), { env, fetcher: async () => { calls++; return Response.json({}); } }), (error: unknown) => error instanceof ConciergeError && error.status === 503);
    assert.equal(calls, 0);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("real assistant responses longer than the user input cap can be carried into the next turn", () => {
  assert.equal(validatePayload({ locale: "pt", messages: [{ role: "user", content: "Oi" }, { role: "assistant", content: "a".repeat(2000) }, { role: "user", content: "Pode explicar?" }] }).messages.length, 3);
});

test("current flagship demos are included without granting tools or claiming full public access", () => {
  const rules = buildMessages("pt", [{ role: "user", content: "Quais projetos?" }])[0].content;
  for (const name of ["ArchScene", "FullCommerce360", "URLPivot"]) assert.ok(rules.includes(name));
  assert.match(rules, /public-demo/);
  assert.doesNotMatch(rules, /arremataradar\.com|hypefc\.vercel\.app/);
});

import { authorizeFixture } from "./test-fixture";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ConciergeError, processConciergeRequest } from "./concierge";
const payload = JSON.stringify({ locale: "pt", messages: [{ role: "user", content: "Quero um site" }] });
const envFor = (dir: string): NodeJS.ProcessEnv => ({ NODE_ENV: "test", HERMES_CONCIERGE_URL: "http://127.0.0.1:8658/v1/chat/completions", HERMES_CONCIERGE_KEY: "synthetic", HERMES_CONCIERGE_PROXY_KEY: "synthetic-ingress-proof", HERMES_CONCIERGE_ORIGIN: "https://portfolio.test", HERMES_CONCIERGE_SALT: "synthetic-test-salt", HERMES_CONCIERGE_STATE_DIR: dir });
function request(ip: string, proof = "synthetic-ingress-proof") { return new Request("http://localhost:3186/api/concierge", { method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json", "x-real-ip": ip, "x-forwarded-for": "spoofed", "x-concierge-proxy": proof }, body: payload }); }

test("direct backend calls cannot authorize themselves by spoofing Origin and IP headers", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "concierge-ingress-")); let calls = 0;
  try {
    await assert.rejects(processConciergeRequest(request("192.0.2.1", "attacker"), { env: envFor(dir), fetcher: async () => { calls++; return Response.json({}); } }), (e: unknown) => e instanceof ConciergeError && e.status === 403);
    assert.equal(calls, 0);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("persistent admission slots bound concurrent model calls across independent requests", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "concierge-admission-"));
  const releases: Array<(response: Response) => void> = []; let entered!: () => void;
  const bothEntered = new Promise<void>(resolve => { entered = resolve; });
  const fetcher: typeof fetch = async () => new Promise<Response>(resolve => { releases.push(resolve); if (releases.length === 2) entered(); });
  const env = envFor(dir);
  const first = processConciergeRequest(await authorizeFixture(request("192.0.2.1"),env), { env, fetcher });
  const second = processConciergeRequest(await authorizeFixture(request("192.0.2.2"),env), { env: { ...env }, fetcher });
  try {
    await bothEntered;
    await assert.rejects(processConciergeRequest(await authorizeFixture(request("192.0.2.3"),env), { env, fetcher }), (e: unknown) => e instanceof ConciergeError && e.status === 429 && e.code === "busy");
    assert.equal(releases.length, 2);
  } finally {
    for (const release of releases) release(Response.json({ choices: [{ message: { content: JSON.stringify({reply:"Synthetic admission test",brief:{goal:"Quero um site",situation:"",desiredSolution:"",constraints:"",openQuestions:""}}) } }] }));
    await Promise.all([first, second]);
    await rm(dir, { recursive: true, force: true });
  }
});

test("a slow request body expires without a model request", { timeout: 9000 }, async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "concierge-slowbody-")); let calls = 0;
  try {
    const slow = new Request("http://localhost:3186/api/concierge", { method: "POST", headers: { origin: "https://portfolio.test", "content-type": "application/json", "x-real-ip": "192.0.2.1", "x-concierge-proxy": "synthetic-ingress-proof" }, body: new ReadableStream<Uint8Array>({ start() {} }), duplex: "half" } as RequestInit);
    await assert.rejects(processConciergeRequest(slow, { env: envFor(dir), fetcher: async () => { calls++; return Response.json({}); } }), (e: unknown) => e instanceof ConciergeError && e.status === 408);
    assert.equal(calls, 0);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

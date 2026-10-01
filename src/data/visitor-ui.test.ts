import assert from "node:assert/strict";
import test from "node:test";
import { visitorHistoryWindow, visitorTurnsRemaining, type ConversationEntry } from "../components/concierge/visitor-ui";
import type { VisitorSnapshot } from "../lib/concierge/visitor-contract";

const snapshot = (remaining: number) => ({ csrfToken: "token", tier: "anonymous" as const, quota: { limit: 30, used: 30 - remaining, remaining, resetsAt: "2026-09-24T00:00:00.000Z" }, memory: { enabled: false, expiresAt: null, activeProjectId: null, projects: [] } }) satisfies VisitorSnapshot;

test("quota display uses the server's authoritative remaining count", () => {
  assert.equal(visitorTurnsRemaining(snapshot(30)), 30);
  assert.equal(visitorTurnsRemaining(snapshot(0)), 0);
  assert.equal(visitorTurnsRemaining(snapshot(-1)), 0);
  assert.equal(visitorTurnsRemaining(null), null);
});

test("long chats preserve their visible history but send only the final valid 11 entries", () => {
  const messages: ConversationEntry[] = Array.from({ length: 41 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: `${i}` }));
  const window = visitorHistoryWindow(messages);
  assert.equal(messages.length, 41);
  assert.equal(window.length, 11);
  assert.equal(window[0].role, "user");
  assert.equal(window.at(-1)?.role, "user");
  assert.deepEqual(window, messages.slice(-11));
});


test("rolling context is UTF-8 bounded without cutting the latest visitor message", () => {
  const messages: ConversationEntry[] = Array.from({length:21},(_,i)=>({role:i%2?"assistant":"user",content:(i%2?"漢".repeat(7000):"á".repeat(1200))}));
  const bounded=visitorHistoryWindow(messages);
  assert.ok(new TextEncoder().encode(JSON.stringify({locale:"pt",messages:bounded})).byteLength<14000);
  assert.equal(bounded[0].role,"user");
  assert.equal(bounded.at(-1),messages.at(-1));
  assert.equal(bounded.length%2,1);
  assert.equal(messages.length,21);
});

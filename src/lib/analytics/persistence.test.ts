import assert from "node:assert/strict";
import test from "node:test";
import { persistAnalyticsEvent } from "./persistence";
import { normalizeAnalyticsEvent } from "./schema";

test("keeps Supabase writes disabled until the explicit server-only flag is true", async () => {
  const event = normalizeAnalyticsEvent(
    { event: "portfolio-page-view", path: "/pt" },
    "2026-08-10T12:00:00.000Z",
  );
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(null, { status: 204 });
  };

  try {
    const disabled = await persistAnalyticsEvent(event, {
      NODE_ENV: "test",
      ANALYTICS_SUPABASE_ENABLED: "false",
      ANALYTICS_SUPABASE_URL: "https://example.supabase.co",
      ANALYTICS_SUPABASE_SERVICE_ROLE_KEY: "server-only-test-placeholder",
    });
    assert.deepEqual(disabled, { backend: "logs" });
    assert.equal(calls, 0);

    const enabled = await persistAnalyticsEvent(event, {
      NODE_ENV: "test",
      ANALYTICS_SUPABASE_ENABLED: "true",
      ANALYTICS_SUPABASE_URL: "https://example.supabase.co",
      ANALYTICS_SUPABASE_SERVICE_ROLE_KEY: "server-only-test-placeholder",
    });
    assert.deepEqual(enabled, { backend: "supabase" });
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fails closed when persistence is enabled with incomplete configuration", async () => {
  const event = normalizeAnalyticsEvent(
    { event: "portfolio-page-view", path: "/pt" },
    "2026-08-10T12:00:00.000Z",
  );
  const result = await persistAnalyticsEvent(event, {
    NODE_ENV: "test",
    ANALYTICS_SUPABASE_ENABLED: "true",
  });
  assert.deepEqual(result, { backend: "logs", warning: "incomplete-config" });
});

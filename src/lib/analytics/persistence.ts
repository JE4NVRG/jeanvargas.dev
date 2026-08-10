import type { StoredAnalyticsEvent } from "./schema";

const ANALYTICS_TABLE = "portfolio_analytics_events";
const WRITE_TIMEOUT_MS = 2_000;

type PersistenceResult = {
  backend: "logs" | "supabase";
  warning?: "incomplete-config" | "invalid-url" | "write-failed";
};

function getConfig(env: NodeJS.ProcessEnv) {
  const url = env.ANALYTICS_SUPABASE_URL?.trim();
  const serviceRoleKey = env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url && !serviceRoleKey) return { status: "disabled" as const };
  if (!url || !serviceRoleKey) return { status: "incomplete" as const };

  try {
    const parsedUrl = new URL(url);
    if (!/^https?:$/.test(parsedUrl.protocol)) return { status: "invalid" as const };
    return {
      status: "ready" as const,
      url: parsedUrl.toString().replace(/\/$/, ""),
      serviceRoleKey,
    };
  } catch {
    return { status: "invalid" as const };
  }
}

function toDatabaseRecord(event: StoredAnalyticsEvent) {
  return {
    occurred_at: event.timestamp,
    event_name: event.event,
    page_path: event.path,
    page_type: event.pageType,
    project: event.project ?? null,
    service: event.service ?? null,
    offer: event.offer ?? null,
    cta: event.cta ?? null,
    cta_label: event.ctaLabel ?? null,
    locale: event.locale ?? null,
    source: event.source,
    medium: event.medium,
    campaign: event.campaign ?? null,
    content: event.content ?? null,
    landing_path: event.landingPath,
    referrer_host: event.referrerHost ?? null,
    channel: event.channel ?? null,
    destination_host: event.destinationHost ?? null,
    destination_path: event.destinationPath ?? null,
  };
}

export async function persistAnalyticsEvent(
  event: StoredAnalyticsEvent,
  env: NodeJS.ProcessEnv = process.env,
): Promise<PersistenceResult> {
  const config = getConfig(env);
  if (config.status === "disabled") return { backend: "logs" };
  if (config.status === "incomplete") {
    return { backend: "logs", warning: "incomplete-config" };
  }
  if (config.status === "invalid") {
    return { backend: "logs", warning: "invalid-url" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WRITE_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.url}/rest/v1/${ANALYTICS_TABLE}`, {
      method: "POST",
      headers: {
        apikey: config.serviceRoleKey,
        authorization: `Bearer ${config.serviceRoleKey}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify(toDatabaseRecord(event)),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) return { backend: "logs", warning: "write-failed" };
    return { backend: "supabase" };
  } catch {
    return { backend: "logs", warning: "write-failed" };
  } finally {
    clearTimeout(timeout);
  }
}

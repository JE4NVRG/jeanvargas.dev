import fs from "node:fs";
import path from "node:path";
import {
  parseSearchConsoleCsv,
  renderWeeklyFunnelMarkdown,
  summarizeWeeklyFunnel,
  type FunnelAnalyticsRow,
  type FunnelLeadRow,
} from "../src/lib/analytics/weekly-report";

const ANALYTICS_TABLE = "portfolio_analytics_events";
const LEADS_TABLE = "portfolio_funnel_leads";

function readArg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function readDays() {
  const raw = readArg("--days") ?? "7";
  const days = Number(raw);
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error("--days must be an integer between 1 and 365");
  }
  return days;
}

function requireConfig() {
  const url = process.env.ANALYTICS_SUPABASE_URL?.trim();
  const key = process.env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Set ANALYTICS_SUPABASE_URL and ANALYTICS_SUPABASE_SERVICE_ROLE_KEY before running the weekly report.",
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function fetchRows<T>(options: {
  url: string;
  key: string;
  table: string;
  select: string;
  timeField: string;
  since: string;
}) {
  const endpoint = new URL(`${options.url}/rest/v1/${options.table}`);
  endpoint.searchParams.set("select", options.select);
  endpoint.searchParams.set(options.timeField, `gte.${options.since}`);
  endpoint.searchParams.set("order", `${options.timeField}.desc`);
  endpoint.searchParams.set("limit", "10000");

  const response = await fetch(endpoint, {
    headers: {
      apikey: options.key,
      authorization: `Bearer ${options.key}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${options.table} query failed with HTTP ${response.status}`);
  }
  return (await response.json()) as T[];
}

async function main() {
  const days = readDays();
  const { url, key } = requireConfig();
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const searchConsolePath = readArg("--search-console");

  const [analytics, leads] = await Promise.all([
    fetchRows<FunnelAnalyticsRow>({
      url,
      key,
      table: ANALYTICS_TABLE,
      select: "occurred_at,event_name,page_path,source,medium,campaign,landing_path",
      timeField: "occurred_at",
      since,
    }),
    fetchRows<FunnelLeadRow>({
      url,
      key,
      table: LEADS_TABLE,
      select:
        "lead_code,business_name,status,source,medium,campaign,channel,landing_path,created_at,first_contact_at,conversation_started_at,qualified_at,proposal_sent_at,closed_at,deal_value_brl,updated_at",
      timeField: "updated_at",
      since,
    }),
  ]);

  const searchConsole = searchConsolePath
    ? parseSearchConsoleCsv(
        fs.readFileSync(path.resolve(process.cwd(), searchConsolePath), "utf8"),
      )
    : undefined;

  const summary = summarizeWeeklyFunnel({ analytics, leads, searchConsole });
  process.stdout.write(
    renderWeeklyFunnelMarkdown(summary, {
      days,
      generatedAt: new Date().toISOString(),
    }),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown weekly report error";
  console.error(message);
  process.exitCode = 1;
});

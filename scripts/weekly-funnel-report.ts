import fs from "node:fs";
import path from "node:path";
import {
  parseSearchConsoleCsv,
  assertCompleteWeeklyRead,
  renderWeeklyFunnelMarkdown,
  summarizeWeeklyFunnel,
  parseWeeklyReportFilters,
  weeklyReportReadParams,
  type FunnelAnalyticsRow,
  type FunnelLeadRow,
} from "../src/lib/analytics/weekly-report";

const ANALYTICS_TABLE = "portfolio_analytics_events";
const LEADS_TABLE = "portfolio_funnel_leads";

function readArg(name: string) {
  const index = process.argv.indexOf(name);
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
  return value;
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
  params: URLSearchParams;
}) {
  const endpoint = new URL(`${options.url}/rest/v1/${options.table}`);
  endpoint.search = options.params.toString();

  const response = await fetch(endpoint, {
    headers: {
      apikey: options.key,
      authorization: `Bearer ${options.key}`,
      prefer: "count=exact",
    },
  });
  if (!response.ok) {
    throw new Error(`${options.table} query failed with HTTP ${response.status}`);
  }
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error("Weekly report query did not return a row array.");
  assertCompleteWeeklyRead(response.headers.get("content-range"), rows.length);
  return rows as T[];
}

async function main() {
  const days = readDays();
  const filters = parseWeeklyReportFilters({ locale: readArg("--locale"), medium: readArg("--medium") });
  const { url, key } = requireConfig();
  const endedAtDate = new Date();
  const endedAt = endedAtDate.toISOString();
  const startedAt = new Date(endedAtDate.getTime() - days * 86_400_000).toISOString();
  const currentUtcDay = Date.UTC(
    endedAtDate.getUTCFullYear(),
    endedAtDate.getUTCMonth(),
    endedAtDate.getUTCDate(),
  );
  const searchConsoleStartDate = new Date(
    currentUtcDay - (days - 1) * 86_400_000,
  ).toISOString().slice(0, 10);
  const searchConsoleEndDate = endedAt.slice(0, 10);
  const searchConsolePath = readArg("--search-console");
  const window = { startedAt, endedAt, searchConsoleStartDate, searchConsoleEndDate };

  const [analytics, leads] = await Promise.all([
    fetchRows<FunnelAnalyticsRow>({
      url,
      key,
      table: ANALYTICS_TABLE,
      params: weeklyReportReadParams("analytics", window),
    }),
    fetchRows<FunnelLeadRow>({
      url,
      key,
      table: LEADS_TABLE,
      params: weeklyReportReadParams("leads", window),
    }),
  ]);

  const searchConsole = searchConsolePath
    ? parseSearchConsoleCsv(
        fs.readFileSync(path.resolve(process.cwd(), searchConsolePath), "utf8"),
      )
    : undefined;

  const summary = summarizeWeeklyFunnel({
    analytics,
    leads,
    searchConsole,
    window,
    filters,
  });
  process.stdout.write(
    renderWeeklyFunnelMarkdown(summary, {
      days,
      generatedAt: endedAt,
    }),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown weekly report error";
  console.error(message);
  process.exitCode = 1;
});

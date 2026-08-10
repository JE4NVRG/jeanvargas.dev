type AnalyticsRow = {
  occurred_at: string;
  event_name: string;
  page_path: string;
  page_type: string;
  service: string | null;
  offer: string | null;
  project: string | null;
  cta: string | null;
  locale: string | null;
  source: string;
  medium: string;
  campaign: string | null;
  channel: string | null;
  landing_path: string;
};

const TABLE = "portfolio_analytics_events";

function readDays() {
  const index = process.argv.indexOf("--days");
  const raw = index >= 0 ? process.argv[index + 1] : "7";
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
      "Set ANALYTICS_SUPABASE_URL and ANALYTICS_SUPABASE_SERVICE_ROLE_KEY before running the report.",
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

function countBy(rows: AnalyticsRow[], getKey: (row: AnalyticsRow) => string | null | undefined) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = getKey(row) || "(none)";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function printTable(title: string, entries: Array<[string, number]>, limit = 12) {
  console.log(`\n## ${title}`);
  if (entries.length === 0) {
    console.log("- No events");
    return;
  }
  for (const [label, count] of entries.slice(0, limit)) console.log(`- ${label}: ${count}`);
}

async function main() {
  const days = readDays();
  const { url, key } = requireConfig();
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const endpoint = new URL(`${url}/rest/v1/${TABLE}`);
  endpoint.searchParams.set(
    "select",
    "occurred_at,event_name,page_path,page_type,service,offer,project,cta,locale,source,medium,campaign,channel,landing_path",
  );
  endpoint.searchParams.set("occurred_at", `gte.${since}`);
  endpoint.searchParams.set("order", "occurred_at.desc");
  endpoint.searchParams.set("limit", "10000");

  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
    },
  });
  if (!response.ok) throw new Error(`Analytics query failed with HTTP ${response.status}`);

  const rows = (await response.json()) as AnalyticsRow[];
  const pageViews = rows.filter((row) => row.event_name === "portfolio-page-view");
  const leadClicks = rows.filter((row) =>
    ["whatsapp-click", "email-click", "lead-cta-click"].includes(row.event_name),
  );
  const whatsappClicks = rows.filter((row) => row.event_name === "whatsapp-click");

  console.log(`# JE4NDEV funnel report — last ${days} days`);
  console.log(`\nGenerated at: ${new Date().toISOString()}`);
  console.log(`- Events: ${rows.length}`);
  console.log(`- Page views: ${pageViews.length}`);
  console.log(`- Lead CTA clicks: ${leadClicks.length}`);
  console.log(`- WhatsApp clicks: ${whatsappClicks.length}`);

  printTable("Acquisition — source / medium", countBy(pageViews, (row) => `${row.source} / ${row.medium}`));
  printTable("Campaigns", countBy(pageViews, (row) => row.campaign));
  printTable("Landing pages", countBy(pageViews, (row) => row.landing_path));
  printTable("Lead CTA pages", countBy(leadClicks, (row) => row.page_path));
  printTable("Lead CTA services", countBy(leadClicks, (row) => row.service));
  printTable("Lead CTA offers", countBy(leadClicks, (row) => row.offer));
  printTable("Lead CTA labels", countBy(leadClicks, (row) => row.cta));

  console.log("\n## Manual CRM reconciliation");
  console.log("- Add conversations initiated, qualified leads, proposals and closed deals.");
  console.log("- Match each lead to source / medium / campaign using the CTA prefill and outreach log.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown analytics report error";
  console.error(message);
  process.exitCode = 1;
});

import type { FunnelLeadStatus } from "./lead-status";
export type { FunnelLeadStatus } from "./lead-status";

export type FunnelAnalyticsRow = {
  occurred_at: string;
  event_name: string;
  page_path: string;
  source: string;
  medium: string;
  campaign: string | null;
  landing_path: string;
};

export type FunnelLeadRow = {
  lead_code: string;
  business_name: string;
  status: FunnelLeadStatus;
  source: string;
  medium: string;
  campaign: string | null;
  channel: string;
  landing_path: string | null;
  created_at: string;
  first_contact_at: string | null;
  conversation_started_at: string | null;
  qualified_at: string | null;
  proposal_sent_at: string | null;
  closed_at: string | null;
  deal_value_brl: number | null;
};

export type SearchConsoleDay = {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number | null;
  position: number | null;
};

export type WeeklyFunnelSummary = {
  events: number;
  pageViews: number;
  leadClicks: number;
  clicksPerPageView: number | null;
  conversations: number;
  qualified: number;
  proposals: number;
  closedWon: number;
  closedValueBrl: number;
  sourceBreakdown: Array<[string, number]>;
  campaignBreakdown: Array<[string, number]>;
  leadStatusBreakdown: Array<[string, number]>;
  searchConsole: {
    provided: boolean;
    days: number;
    clicks: number;
    impressions: number;
    ctr: number | null;
    averagePosition: number | null;
  };
};

export type WeeklyReportingWindow = {
  startedAt: string;
  endedAt: string;
  searchConsoleStartDate: string;
  searchConsoleEndDate: string;
};

const LEAD_EVENTS = new Set(["whatsapp-click", "email-click", "lead-cta-click"]);

function countBy<T>(rows: T[], getKey: (row: T) => string | null | undefined) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = getKey(row) || "(none)";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function parseMetric(value: string, percent = false) {
  const normalized = value.trim().replace(/%$/, "").replace(/\s/g, "").replace(",", ".");
  const result = Number(normalized);
  if (!Number.isFinite(result)) return null;
  return percent && result > 1 ? result / 100 : result;
}

function isValidCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function resolveReportingWindow(window: WeeklyReportingWindow) {
  const startedAt = Date.parse(window.startedAt);
  const endedAt = Date.parse(window.endedAt);
  if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt) || startedAt > endedAt) {
    throw new Error("Invalid weekly reporting timestamp window");
  }
  if (
    !isValidCalendarDate(window.searchConsoleStartDate) ||
    !isValidCalendarDate(window.searchConsoleEndDate) ||
    window.searchConsoleStartDate > window.searchConsoleEndDate
  ) {
    throw new Error("Invalid Search Console reporting date window");
  }
  return { startedAt, endedAt };
}

function isInstantWithin(value: string | null, startedAt: number, endedAt: number) {
  if (!value) return false;
  const instant = Date.parse(value);
  return Number.isFinite(instant) && instant >= startedAt && instant <= endedAt;
}

export function parseSearchConsoleCsv(csv: string): SearchConsoleDay[] {
  const lines = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const indexOf = (...names: string[]) => headers.findIndex((header) => names.includes(header));
  const indexes = {
    date: indexOf("date", "data"),
    clicks: indexOf("clicks", "cliques"),
    impressions: indexOf("impressions", "impressoes"),
    ctr: indexOf("ctr"),
    position: indexOf("position", "posicao"),
  };

  if (indexes.date < 0 || indexes.clicks < 0 || indexes.impressions < 0) {
    throw new Error("Search Console CSV must include date/data, clicks/cliques and impressions/impressoes columns");
  }

  return lines.slice(1).map((line, rowIndex) => {
    const cells = parseCsvLine(line);
    const clicks = parseMetric(cells[indexes.clicks] ?? "");
    const impressions = parseMetric(cells[indexes.impressions] ?? "");
    const ctr = indexes.ctr >= 0 ? parseMetric(cells[indexes.ctr] ?? "", true) : null;
    const position = indexes.position >= 0 ? parseMetric(cells[indexes.position] ?? "") : null;

    if (clicks === null || impressions === null) {
      throw new Error(`Invalid Search Console metrics on CSV row ${rowIndex + 2}`);
    }

    const date = cells[indexes.date] ?? "";
    if (!isValidCalendarDate(date)) {
      throw new Error(`Invalid Search Console date on CSV row ${rowIndex + 2}`);
    }

    return {
      date,
      clicks,
      impressions,
      ctr,
      position,
    };
  });
}

export function summarizeWeeklyFunnel(input: {
  analytics: FunnelAnalyticsRow[];
  leads: FunnelLeadRow[];
  searchConsole?: SearchConsoleDay[];
  window: WeeklyReportingWindow;
}): WeeklyFunnelSummary {
  const { startedAt, endedAt } = resolveReportingWindow(input.window);
  const pageViews = input.analytics.filter((row) => row.event_name === "portfolio-page-view");
  const leadClicks = input.analytics.filter((row) => LEAD_EVENTS.has(row.event_name));
  const searchConsole = (input.searchConsole ?? []).filter(
    (row) =>
      row.date >= input.window.searchConsoleStartDate &&
      row.date <= input.window.searchConsoleEndDate,
  );
  const conversations = input.leads.filter((lead) =>
    isInstantWithin(lead.conversation_started_at, startedAt, endedAt),
  );
  const qualified = input.leads.filter((lead) =>
    isInstantWithin(lead.qualified_at, startedAt, endedAt),
  );
  const proposals = input.leads.filter((lead) =>
    isInstantWithin(lead.proposal_sent_at, startedAt, endedAt),
  );
  const closedWon = input.leads.filter(
    (lead) =>
      lead.status === "closed_won" &&
      isInstantWithin(lead.closed_at, startedAt, endedAt),
  );
  const searchClicks = searchConsole.reduce((sum, row) => sum + row.clicks, 0);
  const searchImpressions = searchConsole.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition = searchConsole.reduce(
    (sum, row) => sum + (row.position ?? 0) * row.impressions,
    0,
  );
  const positionedImpressions = searchConsole.reduce(
    (sum, row) => sum + (row.position === null ? 0 : row.impressions),
    0,
  );

  return {
    events: input.analytics.length,
    pageViews: pageViews.length,
    leadClicks: leadClicks.length,
    clicksPerPageView: pageViews.length > 0 ? leadClicks.length / pageViews.length : null,
    conversations: conversations.length,
    qualified: qualified.length,
    proposals: proposals.length,
    closedWon: closedWon.length,
    closedValueBrl: closedWon.reduce((sum, lead) => sum + (lead.deal_value_brl ?? 0), 0),
    sourceBreakdown: countBy(pageViews, (row) => `${row.source} / ${row.medium}`),
    campaignBreakdown: countBy(pageViews, (row) => row.campaign),
    leadStatusBreakdown: countBy(input.leads, (lead) => lead.status),
    searchConsole: {
      provided: searchConsole.length > 0,
      days: searchConsole.length,
      clicks: searchClicks,
      impressions: searchImpressions,
      ctr: searchImpressions > 0 ? searchClicks / searchImpressions : null,
      averagePosition: positionedImpressions > 0 ? weightedPosition / positionedImpressions : null,
    },
  };
}

function formatPercent(value: number | null) {
  return value === null ? "n/a" : `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value: number | null) {
  return value === null ? "n/a" : value.toFixed(1);
}

function renderBreakdown(title: string, rows: Array<[string, number]>) {
  const lines = [`## ${title}`];
  if (rows.length === 0) return [...lines, "- No data"].join("\n");
  return [...lines, ...rows.slice(0, 12).map(([label, count]) => `- ${label}: ${count}`)].join("\n");
}

export function renderWeeklyFunnelMarkdown(summary: WeeklyFunnelSummary, options: {
  days: number;
  generatedAt: string;
}) {
  const search = summary.searchConsole;
  const sections = [
    `# JE4NDEV weekly funnel report, last ${options.days} days`,
    `Generated at: ${options.generatedAt}`,
    [
      "## Funnel",
      `- Page views: ${summary.pageViews}`,
      `- Lead CTA clicks: ${summary.leadClicks}`,
      `- CTA clicks per page view: ${formatNumber(summary.clicksPerPageView)}`,
      `- Conversations initiated: ${summary.conversations}`,
      `- Qualified leads: ${summary.qualified}`,
      `- Proposals sent: ${summary.proposals}`,
      `- Closed won: ${summary.closedWon}`,
      `- Closed value, BRL: ${summary.closedValueBrl.toFixed(2)}`,
    ].join("\n"),
    search.provided
      ? [
          "## Search Console",
          `- Imported days: ${search.days}`,
          `- Clicks: ${search.clicks}`,
          `- Impressions: ${search.impressions}`,
          `- CTR: ${formatPercent(search.ctr)}`,
          `- Average position, impression-weighted: ${formatNumber(search.averagePosition)}`,
        ].join("\n")
      : [
          "## Search Console",
          "- Not imported. Export daily aggregated data and pass --search-console <csv>.",
        ].join("\n"),
    renderBreakdown("Acquisition by source / medium", summary.sourceBreakdown),
    renderBreakdown("Campaigns", summary.campaignBreakdown),
    renderBreakdown("Lead status", summary.leadStatusBreakdown),
    [
      "## 30-day target, ending 2026-09-09",
      "- 10 qualified leads",
      "- 3 proposals sent",
      "- 1 paid project originated or assisted by je4ndev.com",
    ].join("\n"),
  ];

  return `${sections.join("\n\n")}\n`;
}

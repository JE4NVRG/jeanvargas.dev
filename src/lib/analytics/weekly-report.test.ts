import assert from "node:assert/strict";
import test from "node:test";
import {
  parseSearchConsoleCsv,
  assertCompleteWeeklyRead,
  parseWeeklyReportFilters,
  renderWeeklyFunnelMarkdown,
  summarizeWeeklyFunnel,
  weeklyReportReadParams,
  type FunnelAnalyticsRow,
  type FunnelLeadRow,
} from "./weekly-report";

const analytics: FunnelAnalyticsRow[] = [
  {
    occurred_at: "2026-08-10T10:00:00Z",
    event_name: "portfolio-page-view",
    page_path: "/pt",
    source: "x",
    medium: "organic-social",
    campaign: "diagnosis-first-milestone",
    landing_path: "/pt",
  },
  {
    occurred_at: "2026-08-10T10:01:00Z",
    event_name: "portfolio-page-view",
    page_path: "/pt/projects/fullcommerce360",
    source: "outbound",
    medium: "email",
    campaign: "diagnosis-first-milestone",
    landing_path: "/pt/projects/fullcommerce360",
  },
  {
    occurred_at: "2026-08-10T10:02:00Z",
    event_name: "lead-cta-click",
    page_path: "/pt/projects/fullcommerce360",
    source: "outbound",
    medium: "email",
    campaign: "diagnosis-first-milestone",
    landing_path: "/pt/projects/fullcommerce360",
  },
];

const baseLead: FunnelLeadRow = {
  lead_code: "lead-001",
  business_name: "Example Business",
  status: "proposal_sent",
  source: "outbound",
  medium: "email",
  campaign: "diagnosis-first-milestone",
  channel: "email",
  landing_path: "/pt/projects/fullcommerce360",
  created_at: "2026-08-10T10:00:00Z",
  first_contact_at: "2026-08-10T10:10:00Z",
  conversation_started_at: "2026-08-10T11:00:00Z",
  qualified_at: "2026-08-10T12:00:00Z",
  proposal_sent_at: "2026-08-10T13:00:00Z",
  closed_at: null,
  deal_value_brl: null,
};

const window = {
  startedAt: "2026-08-03T16:00:00Z",
  endedAt: "2026-08-10T16:00:00Z",
  searchConsoleStartDate: "2026-08-04",
  searchConsoleEndDate: "2026-08-10",
};

test("parses English and Portuguese Search Console CSV headers", () => {
  const english = parseSearchConsoleCsv("date,clicks,impressions,ctr,position\n2026-08-09,3,100,3%,8.5\n");
  const portuguese = parseSearchConsoleCsv("data,cliques,impressões,ctr,posição\n2026-08-10,2,50,4%,10,0\n");

  assert.equal(english[0].ctr, 0.03);
  assert.equal(english[0].position, 8.5);
  assert.equal(portuguese[0].clicks, 2);
});

test("summarizes analytics, commercial stages and Search Console without inventing attribution", () => {
  const closedLead: FunnelLeadRow = {
    ...baseLead,
    lead_code: "lead-002",
    status: "closed_won",
    closed_at: "2026-08-10T15:00:00Z",
    deal_value_brl: 2500,
  };
  const searchConsole = parseSearchConsoleCsv(
    "date,clicks,impressions,ctr,position\n2026-08-09,3,100,3%,8.5\n2026-08-10,2,50,4%,10\n",
  );
  const summary = summarizeWeeklyFunnel({
    analytics,
    leads: [baseLead, closedLead],
    searchConsole,
    window,
  });

  assert.equal(summary.pageViews, 2);
  assert.equal(summary.leadClicks, 1);
  assert.equal(summary.clicksPerPageView, 0.5);
  assert.equal(summary.registeredContacts, 2);
  assert.equal(summary.conversations, 2);
  assert.equal(summary.qualified, 2);
  assert.equal(summary.proposals, 2);
  assert.equal(summary.closedWon, 1);
  assert.equal(summary.closedValueBrl, 2500);
  assert.equal(summary.searchConsole.clicks, 5);
  assert.equal(summary.searchConsole.impressions, 150);
});

test("counts each commercial stage only inside its own reporting window", () => {
  const progressedThisWeek: FunnelLeadRow = {
    ...baseLead,
    status: "qualified",
    created_at: "2026-08-01T09:00:00Z",
    conversation_started_at: "2026-08-01T10:00:00Z",
    qualified_at: "2026-08-10T12:00:00Z",
    proposal_sent_at: null,
  };
  const searchConsole = parseSearchConsoleCsv(
    "date,clicks,impressions\n2026-08-03,9,90\n2026-08-09,2,20\n2026-08-11,7,70\n",
  );
  const summary = summarizeWeeklyFunnel({
    analytics,
    leads: [progressedThisWeek],
    searchConsole,
    window,
  });

  assert.equal(summary.conversations, 0);
  assert.equal(summary.registeredContacts, 0);
  assert.equal(summary.qualified, 1);
  assert.equal(summary.proposals, 0);
  assert.equal(summary.searchConsole.days, 1);
  assert.equal(summary.searchConsole.clicks, 2);
  assert.equal(summary.searchConsole.impressions, 20);
});

test("rejects invalid Search Console dates", () => {
  assert.throws(
    () => parseSearchConsoleCsv("date,clicks,impressions\n2026-02-30,1,10\n"),
    /Invalid Search Console date/,
  );
});

test("renders an explicit Search Console missing-data state", () => {
  const summary = summarizeWeeklyFunnel({ analytics, leads: [baseLead], window });
  const report = renderWeeklyFunnelMarkdown(summary, {
    days: 7,
    generatedAt: "2026-08-10T16:00:00Z",
  });

  assert.match(report, /Search Console/);
  assert.match(report, /Not imported/);
  assert.match(report, /Qualified leads: 1/);
});

test("filters organic English events and manual leads without inventing missing attribution", () => {
  const enEvent: FunnelAnalyticsRow = {
    ...analytics[0], page_path: "/en", landing_path: "/en", locale: "en", source: "google", medium: "organic",
  };
  const enLead: FunnelLeadRow = {
    ...baseLead, landing_path: "/en/services/private-ai-agents", source: "google", medium: "organic",
  };
  const summary = summarizeWeeklyFunnel({
    analytics: [
      enEvent,
      { ...enEvent, page_path: "/en/projects/nora", locale: null },
      { ...enEvent, event_name: "lead-cta-click" },
      { ...enEvent, page_path: "/pt", locale: "pt" },
      { ...enEvent, locale: "pt" },
      { ...enEvent, page_path: "/english", locale: null },
      { ...enEvent, source: "chatgpt", medium: "ai-referral" },
      { ...enEvent, occurred_at: "2026-08-02T10:00:00Z" },
    ],
    leads: [
      enLead,
      { ...enLead, created_at: "2026-07-01T10:00:00Z", conversation_started_at: "2026-08-01T10:00:00Z" },
      { ...enLead, landing_path: "/pt" },
      { ...enLead, landing_path: null },
      { ...enLead, landing_path: "/english" },
      { ...enLead, medium: "unknown" },
      { ...enLead, medium: "ai-referral" },
    ],
    filters: { locale: "en", medium: "organic" },
    window,
  });
  assert.equal(summary.events, 3);
  assert.equal(summary.pageViews, 2);
  assert.equal(summary.leadClicks, 1);
  assert.equal(summary.registeredContacts, 1);
  assert.equal(summary.conversations, 1);
  assert.equal(summary.qualified, 2);
  assert.deepEqual(summary.sourceBreakdown, [["google / organic", 2]]);
  assert.deepEqual(summary.filters, { locale: "en", medium: "organic" });
});

test("locale and medium filters can be selected independently", () => {
  const enAi: FunnelAnalyticsRow = {
    ...analytics[0], page_path: "/en", landing_path: "/en", source: "chatgpt", medium: "ai-referral",
  };
  const ptAi = { ...enAi, page_path: "/pt", landing_path: "/pt", locale: "pt" as const };
  const rows = [enAi, ptAi, analytics[0]];
  const pt = summarizeWeeklyFunnel({ analytics: rows, leads: [baseLead], filters: { locale: "pt" }, window });
  const ai = summarizeWeeklyFunnel({ analytics: rows, leads: [baseLead], filters: { medium: "ai-referral" }, window });
  assert.equal(pt.pageViews, 2);
  assert.equal(pt.registeredContacts, 1);
  assert.equal(ai.pageViews, 2);
  assert.equal(ai.registeredContacts, 0);
});

test("a Nora receipt or a contact click does not create a manual registration", () => {
  const summary = summarizeWeeklyFunnel({
    analytics: [analytics[2], { ...analytics[2], event_name: "nora-lead-saved" }, { ...analytics[2], event_name: "nora-lead-delivered" }],
    leads: [], window,
  });
  assert.equal(summary.leadClicks, 1);
  assert.equal(summary.registeredContacts, 0);
  assert.equal(summary.qualified, 0);
});

test("read queries select locale, omit names, and retrieve progress independently of creation", () => {
  const events = weeklyReportReadParams("analytics", window);
  const leads = weeklyReportReadParams("leads", window);
  assert.match(events.get("select") ?? "", /(?:^|,)locale(?:,|$)/);
  assert.equal(leads.has("and"), false);
  assert.match(leads.get("or") ?? "", /and\(created_at\.gte\.[^,]+,created_at\.lte\.[^)]+\)/);
  assert.match(leads.get("or") ?? "", /and\(qualified_at\.gte\.[^,]+,qualified_at\.lte\.[^)]+\)/);
  assert.doesNotMatch(leads.get("select") ?? "", /business_name|lead_code|phone|email|note/);
});

test("registration and qualification windows handle bounds and absent stage dates independently", () => {
  const summary = summarizeWeeklyFunnel({
    analytics: [],
    leads: [
      { ...baseLead, created_at: window.startedAt, qualified_at: null },
      { ...baseLead, created_at: window.endedAt, qualified_at: window.endedAt },
      { ...baseLead, created_at: "2026-08-03T15:59:59Z", qualified_at: window.startedAt },
      { ...baseLead, created_at: "2026-08-10T16:00:01Z", qualified_at: "2026-08-10T16:00:01Z" },
      { ...baseLead, created_at: "invalid", qualified_at: null },
    ],
    window,
  });
  assert.equal(summary.registeredContacts, 2);
  assert.equal(summary.qualified, 2);
});

test("rejects silently capped or unknown REST coverage instead of reporting partial totals", () => {
  assert.throws(() => assertCompleteWeeklyRead("0-999/2400", 1000), /coverage is incomplete/);
  assert.throws(() => assertCompleteWeeklyRead("0-9999/12000", 10000), /coverage is incomplete/);
  assert.throws(() => assertCompleteWeeklyRead("0-999/*", 1000), /coverage is unknown/);
  assert.throws(() => assertCompleteWeeklyRead(null, 0), /coverage is unknown/);
  assert.throws(() => assertCompleteWeeklyRead("1-1000/1001", 1000), /coverage is incomplete/);
  assert.throws(() => assertCompleteWeeklyRead("0-9/10", 9), /coverage is incomplete/);
  assert.doesNotThrow(() => assertCompleteWeeklyRead("0-999/1000", 1000));
  assert.doesNotThrow(() => assertCompleteWeeklyRead("0-9999/10000", 10000));
  assert.doesNotThrow(() => assertCompleteWeeklyRead("*/0", 0));
});

test("validates explicit CLI filter values without reflecting arbitrary input", () => {
  assert.deepEqual(parseWeeklyReportFilters({}), {});
  assert.deepEqual(parseWeeklyReportFilters({ locale: "pt", medium: "ai-referral" }), { locale: "pt", medium: "ai-referral" });
  assert.throws(() => parseWeeklyReportFilters({ locale: "us" }), /--locale must be en or pt/);
  assert.throws(() => parseWeeklyReportFilters({ medium: "organic,or(status.eq.qualified)" }), /--medium must be one of:/);
  assert.throws(() => parseWeeklyReportFilters({ medium: "private.person@example.invalid" }), (error: unknown) =>
    error instanceof Error && !error.message.includes("private.person"),
  );
});

test("renders zero and unavailable Search Console data with clear measurement limits", () => {
  const summary = summarizeWeeklyFunnel({ analytics: [], leads: [], filters: { locale: "en", medium: "organic" }, window });
  const report = renderWeeklyFunnelMarkdown(summary, { days: 7, generatedAt: window.endedAt });
  assert.equal(summary.clicksPerPageView, null);
  assert.equal(summary.searchConsole.averagePosition, null);
  assert.equal(summary.searchConsole.provided, false);
  assert.match(report, /locale=en; medium=organic/);
  assert.match(report, /Contacts registered manually: 0/);
  assert.match(report, /not people or unique entries/);
  assert.match(report, /no automatic Nora\/Google Sheets bridge/);
  assert.match(report, /Not imported/);
  assert.doesNotMatch(report, /2026-09-09|30-day target/);
});

test("only aggregate commercial counts appear in the report, with external CSV scope declared", () => {
  const summary = summarizeWeeklyFunnel({
    analytics,
    leads: [{ ...baseLead, lead_code: "synthetic-private-lead", business_name: "Synthetic Private Customer" }],
    searchConsole: parseSearchConsoleCsv("date,clicks,impressions\n2026-08-10,0,0\n"),
    window,
  });
  const report = renderWeeklyFunnelMarkdown(summary, { days: 7, generatedAt: window.endedAt });
  assert.equal(summary.searchConsole.ctr, null);
  assert.equal(summary.searchConsole.averagePosition, null);
  assert.doesNotMatch(report, /synthetic-private-lead|Synthetic Private Customer/);
  assert.match(report, /externally filtered Google Search data/);
  assert.match(report, /page language, not the visitor's country/);
});

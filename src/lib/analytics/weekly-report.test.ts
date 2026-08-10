import assert from "node:assert/strict";
import test from "node:test";
import {
  parseSearchConsoleCsv,
  renderWeeklyFunnelMarkdown,
  summarizeWeeklyFunnel,
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
    page_path: "/pt/projects/gestaoml",
    source: "outbound",
    medium: "email",
    campaign: "diagnosis-first-milestone",
    landing_path: "/pt/projects/gestaoml",
  },
  {
    occurred_at: "2026-08-10T10:02:00Z",
    event_name: "lead-cta-click",
    page_path: "/pt/projects/gestaoml",
    source: "outbound",
    medium: "email",
    campaign: "diagnosis-first-milestone",
    landing_path: "/pt/projects/gestaoml",
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
  landing_path: "/pt/projects/gestaoml",
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

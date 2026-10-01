import assert from "node:assert/strict";
import test from "node:test";
import { analyticsEventSchema } from "../lib/analytics/schema";
import {
  dispatchNoraAnalyticsSignal,
  handleNoraAnalyticsSignal,
  isAcceptedLeadReceipt,
  isAnalyticsExcluded,
  isConfirmedDeliveryReceipt,
  safeAnalyticsDestinationPath,
} from "../lib/analytics/funnel";

const base = {
  path: "/pt/services/saas-development",
  pageType: "service" as const,
  service: "saas",
  locale: "pt" as const,
  source: "x",
  medium: "organic-social",
  campaign: "launch_september",
  landingPath: "/pt",
  referrerHost: "x.com",
};

test("Nora production signal path sends typed events with existing context and no signal key", () => {
  const target = new EventTarget();
  const seenByCaller = new Set<string>();
  const seenByAnalytics = new Set<string>();
  const sent: unknown[] = [];
  target.addEventListener("portfolio:nora-analytics", (event) => {
    handleNoraAnalyticsSignal((event as CustomEvent<unknown>).detail, seenByAnalytics, (payload) => sent.push(payload), base);
  });

  assert.equal(dispatchNoraAnalyticsSignal(target, seenByCaller, "first-response", "nora-conversation-response"), true);
  assert.equal(dispatchNoraAnalyticsSignal(target, seenByCaller, "first-response", "nora-conversation-response"), false);
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0], { event: "nora-conversation-response", ...base });
  assert.equal(analyticsEventSchema.safeParse(sent[0]).success, true);
  assert.equal(JSON.stringify(sent[0]).includes("first-response"), false);
});

test("saves count only with consent and an accepted receipt; delivery requires confirmed sent state", () => {
  const pending = { saved: true, notification: "pending" };
  const ambiguous = { saved: true, notification: "unconfirmed" };
  const sent = { saved: true, notification: "sent" };
  assert.equal(isAcceptedLeadReceipt(false, pending), false);
  assert.equal(isAcceptedLeadReceipt(true, null), false);
  assert.equal(isAcceptedLeadReceipt(true, { saved: false }), false);
  assert.equal(isAcceptedLeadReceipt(true, pending), true);
  assert.equal(isConfirmedDeliveryReceipt(pending.notification), false);
  assert.equal(isConfirmedDeliveryReceipt(ambiguous.notification), false);
  assert.equal(isConfirmedDeliveryReceipt(sent.notification), true);
});

test("explicit QA exclusion works on localhost and production URLs without transmitting query strings", () => {
  for (const url of [
    "http://localhost:3000/pt?analytics_exclude=1&email=private%40example.test",
    "https://je4ndev.com/pt?analytics_exclude=1&contact=private",
  ]) {
    assert.equal(isAnalyticsExcluded(new URL(url).search), true);
  }
  assert.equal(isAnalyticsExcluded("?analytics_exclude=true"), false);
  assert.equal(isAnalyticsExcluded("?utm_campaign=launch_september"), false);
  assert.equal(isAnalyticsExcluded("", true), true, "QA exclusion survives internal navigation");
  assert.equal(isAnalyticsExcluded("?utm_campaign=launch_september", true), true);
  assert.equal(isAnalyticsExcluded("?analytics_exclude=0", true), false, "explicit opt-in resets this tab");
});

test("destination dimensions omit WhatsApp recipient paths but preserve safe channel compatibility", () => {
  assert.equal(safeAnalyticsDestinationPath("whatsapp", "/5511999990000"), undefined);
  assert.equal(safeAnalyticsDestinationPath("website", "/contact"), "/contact");
  assert.equal(safeAnalyticsDestinationPath("email", "mailto:person@example.test"), undefined);
});

test("strict event schema rejects request, lead, session, and arbitrary private fields", () => {
  for (const field of ["requestId", "leadId", "sessionId", "message", "contact", "name", "query"]) {
    const payload = { event: "nora-lead-saved", path: "/pt", [field]: "sensitive-value" };
    assert.equal(analyticsEventSchema.safeParse(payload).success, false, field);
  }
  const accepted = analyticsEventSchema.safeParse({ event: "nora-lead-saved", ...base });
  assert.equal(accepted.success, true);
});

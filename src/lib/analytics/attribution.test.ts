import assert from "node:assert/strict";
import test from "node:test";
import {
  deriveAttribution,
  derivePageContext,
  hasCampaignAttribution,
  sanitizeAnalyticsToken,
} from "./attribution";
import { analyticsEventSchema, normalizeAnalyticsEvent } from "./schema";

test("derives explicit UTM attribution without keeping arbitrary query data", () => {
  assert.deepEqual(
    deriveAttribution({
      search:
        "?utm_source=X&utm_medium=organic-social&utm_campaign=Service_SaaS&utm_content=hero&email=private@example.com",
      referrer: "https://google.com/search?q=private",
      siteHost: "je4ndev.com",
      landingPath: "/pt/services/desenvolvimento-saas",
    }),
    {
      source: "x",
      medium: "organic-social",
      campaign: "service_saas",
      content: "hero",
      landingPath: "/pt/services/desenvolvimento-saas",
      referrerHost: "google.com",
    },
  );
});

test("classifies organic and referral sources using hostname only", () => {
  const google = deriveAttribution({
    search: "",
    referrer: "https://www.google.com/search?q=je4ndev",
    siteHost: "je4ndev.com",
    landingPath: "/pt",
  });
  assert.equal(google.source, "google");
  assert.equal(google.medium, "organic");
  assert.equal(google.referrerHost, "google.com");

  const github = deriveAttribution({
    search: "",
    referrer: "https://github.com/JE4NVRG?tab=repositories",
    siteHost: "www.je4ndev.com",
    landingPath: "/en",
  });
  assert.equal(github.source, "github");
  assert.equal(github.medium, "referral");
  assert.equal(github.referrerHost, "github.com");
});

test("keeps direct and same-site traffic private", () => {
  const direct = deriveAttribution({
    search: "",
    referrer: "https://je4ndev.com/pt?private=value",
    siteHost: "je4ndev.com",
    landingPath: "/pt",
  });
  assert.deepEqual(direct, {
    source: "direct",
    medium: "direct",
    campaign: undefined,
    content: undefined,
    landingPath: "/pt",
    referrerHost: undefined,
  });
});

test("derives page type and canonical service/project dimensions", () => {
  assert.deepEqual(derivePageContext("/pt"), { pageType: "home" });
  assert.deepEqual(derivePageContext("/en/services/saas-development"), {
    pageType: "service",
    service: "saas",
  });
  assert.deepEqual(derivePageContext("/pt/projects/fullcommerce360"), {
    pageType: "project",
    project: "fullcommerce360",
  });
  assert.deepEqual(derivePageContext("/privacy"), { pageType: "other" });
});

test("sanitizes campaign tokens and detects explicit campaign parameters", () => {
  assert.equal(sanitizeAnalyticsToken(" Indicação / Parceiro "), "indicacao-parceiro");
  assert.equal(hasCampaignAttribution("?utm_campaign=service-agents"), true);
  assert.equal(hasCampaignAttribution("?q=service-agents"), false);
});

test("schema rejects undeclared or privacy-sensitive fields", () => {
  const accepted = analyticsEventSchema.safeParse({
    event: "whatsapp-click",
    path: "/pt",
    pageType: "home",
    source: "x",
    medium: "organic-social",
    landingPath: "/pt",
    offer: "diagnosis-first-milestone",
    channel: "whatsapp",
    destinationHost: "wa.me",
  });
  assert.equal(accepted.success, true);

  const unknownEvent = analyticsEventSchema.safeParse({
    event: "attacker-controlled-event",
    path: "/pt",
  });
  assert.equal(unknownEvent.success, false);

  const rejected = analyticsEventSchema.safeParse({
    event: "whatsapp-click",
    path: "/pt",
    fullReferrer: "https://example.com/path?email=private@example.com",
  });
  assert.equal(rejected.success, false);
});

test("normalizes legacy payloads during rolling deploys", () => {
  const normalized = normalizeAnalyticsEvent(
    { event: "portfolio-page-view", path: "/pt" },
    "2026-08-10T12:00:00.000Z",
  );
  assert.equal(normalized.source, "unknown");
  assert.equal(normalized.medium, "unknown");
  assert.equal(normalized.landingPath, "/pt");
  assert.equal(normalized.pageType, "other");
});

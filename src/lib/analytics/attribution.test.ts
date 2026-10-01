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

test("classifies known AI assistants as bounded ai-referrals", () => {
  const cases = [
    ["https://chatgpt.com/", "chatgpt"],
    ["https://sub.perplexity.ai/search", "perplexity"],
    ["https://claude.ai/", "claude"],
    ["https://gemini.google.com/", "gemini"],
    ["https://copilot.microsoft.com/", "copilot"],
  ] as const;

  for (const [referrer, source] of cases) {
    const attribution = deriveAttribution({ search: "", referrer, siteHost: "je4ndev.com", landingPath: "/en" });
    assert.equal(attribution.source, source);
    assert.equal(attribution.medium, "ai-referral");
  }
});

test("uses AI UTM sources only when medium is absent and preserves explicit campaign behavior", () => {
  const ai = deriveAttribution({
    search: "?utm_source=chatgpt.com&utm_campaign=agents",
    referrer: "",
    siteHost: "je4ndev.com",
    landingPath: "/en/services/private-ai-agents",
  });
  assert.equal(ai.source, "chatgpt.com");
  assert.equal(ai.medium, "ai-referral");

  const explicit = deriveAttribution({
    search: "?utm_source=chatgpt.com&utm_medium=partner",
    referrer: "",
    siteHost: "je4ndev.com",
    landingPath: "/en",
  });
  assert.equal(explicit.medium, "partner");

  const campaign = deriveAttribution({
    search: "?utm_source=newsletter",
    referrer: "",
    siteHost: "je4ndev.com",
    landingPath: "/en",
  });
  assert.equal(campaign.medium, "campaign");
});

test("does not classify lookalike or suffix-spoofed assistant domains as AI referrals", () => {
  for (const hostname of ["chatgpt.com.evil.test", "notchatgpt.com", "perplexity.ai.attacker.org", "fake-claude.ai"]) {
    const attribution = deriveAttribution({
      search: "",
      referrer: `https://${hostname}/`,
      siteHost: "je4ndev.com",
      landingPath: "/en",
    });
    assert.equal(attribution.medium, "referral", hostname);
    assert.notEqual(attribution.medium, "ai-referral", hostname);
  }
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

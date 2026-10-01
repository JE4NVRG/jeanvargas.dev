"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  deriveAttribution,
  derivePageContext,
  hasCampaignAttribution,
  sanitizeAnalyticsToken,
  type Attribution,
} from "@/lib/analytics/attribution";
import type { AnalyticsEventInput } from "@/lib/analytics/schema";
import { handleNoraAnalyticsSignal, isAnalyticsExcluded, safeAnalyticsDestinationPath } from "@/lib/analytics/funnel";

function sendEvent(payload: AnalyticsEventInput) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      "/api/analytics",
      new Blob([body], { type: "application/json" }),
    );
    if (queued) return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  });
}

function getLinkContext(element: HTMLElement) {
  const anchor = element instanceof HTMLAnchorElement ? element : element.closest("a");
  const rawHref = anchor?.getAttribute("href");
  if (!rawHref) return { channel: "other" as const };

  if (rawHref.startsWith("mailto:")) return { channel: "email" as const };

  try {
    const destination = new URL(rawHref, window.location.origin);
    const destinationHost = destination.hostname.toLowerCase().replace(/^www\./, "");
    const isInternal = destination.origin === window.location.origin;

    let channel: AnalyticsEventInput["channel"] = isInternal ? "internal" : "website";
    if (destinationHost === "wa.me" || destinationHost.endsWith(".whatsapp.com")) {
      channel = "whatsapp";
    } else if (destinationHost === "github.com") {
      channel = "github";
    } else if (destinationHost === "linkedin.com") {
      channel = "linkedin";
    }

    return {
      channel,
      destinationHost: destinationHost || undefined,
      destinationPath: safeAnalyticsDestinationPath(channel, destination.pathname),
    };
  } catch {
    return { channel: "other" as const };
  }
}

function resolveEventName(
  event: AnalyticsEventInput["event"],
  channel: AnalyticsEventInput["channel"],
): AnalyticsEventInput["event"] {
  if (event !== "lead-cta-click") return event;
  if (channel === "whatsapp") return "whatsapp-click";
  if (channel === "email") return "email-click";
  return event;
}

function readCtaLabel(element: HTMLElement) {
  const label = element.textContent?.replace(/\s+/g, " ").trim().slice(0, 96);
  return label || undefined;
}

export function PortfolioAnalytics({ locale }: { locale: "pt" | "en" }) {
  const pathname = usePathname();
  const attributionRef = useRef<Attribution | null>(null);
  const excludedRef = useRef(false);

  useEffect(() => {
    // QA exclusion follows this tab across internal navigation, never a visitor ID.
    try {
      excludedRef.current ||= window.sessionStorage.getItem("portfolio-analytics-excluded") === "1";
    } catch { /* Some browsers disable storage; retain the in-memory preference. */ }
    excludedRef.current = isAnalyticsExcluded(window.location.search, excludedRef.current);
    try {
      if (excludedRef.current) window.sessionStorage.setItem("portfolio-analytics-excluded", "1");
      else window.sessionStorage.removeItem("portfolio-analytics-excluded");
    } catch { /* Analytics must never block the user journey. */ }
    if (excludedRef.current) return;

    const currentPath = pathname || window.location.pathname || "/";
    const incomingAttribution = deriveAttribution({
      search: window.location.search,
      referrer: document.referrer,
      siteHost: window.location.hostname,
      landingPath: currentPath,
    });

    if (!attributionRef.current || hasCampaignAttribution(window.location.search)) {
      attributionRef.current = incomingAttribution;
    }

    const basePayload = {
      path: currentPath,
      locale,
      ...derivePageContext(currentPath),
      ...attributionRef.current,
    } satisfies Omit<AnalyticsEventInput, "event">;

    sendEvent({
      event: "portfolio-page-view",
      ...basePayload,
    });

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trackedElement = target.closest<HTMLElement>("[data-analytics-event]");
      if (!trackedElement) return;

      const linkContext = getLinkContext(trackedElement);
      const configuredEvent = (
        trackedElement.dataset.analyticsEvent ?? "portfolio-click"
      ) as AnalyticsEventInput["event"];

      sendEvent({
        event: resolveEventName(configuredEvent, linkContext.channel),
        ...basePayload,
        ...linkContext,
        project: trackedElement.dataset.project ?? basePayload.project,
        service: trackedElement.dataset.service ?? basePayload.service,
        offer: trackedElement.dataset.offer,
        cta: sanitizeAnalyticsToken(trackedElement.dataset.cta),
        ctaLabel: readCtaLabel(trackedElement),
      });
    };

    const depthThresholds = [50, 75, 90] as const;
    const sentDepths = new Set<number>();
    const seenNoraSignals = new Set<string>();
    const handleNoraSignal = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      handleNoraAnalyticsSignal(detail, seenNoraSignals, sendEvent, basePayload);
    };
    let scrollFrame: number | null = null;

    const measureScrollDepth = () => {
      scrollFrame = null;
      const scrollableHeight = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const depth = Math.min(100, (window.scrollY / scrollableHeight) * 100);

      for (const threshold of depthThresholds) {
        if (depth < threshold || sentDepths.has(threshold)) continue;
        sentDepths.add(threshold);
        sendEvent({
          event: "portfolio-scroll-depth",
          ...basePayload,
          cta: `depth-${threshold}`,
        });
      }
    };

    const handleScroll = () => {
      if (scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(measureScrollDepth);
    };

    let engagementRemaining = 30_000;
    let engagementStartedAt = 0;
    let engagementTimer: number | null = null;
    let engagementSent = false;

    const scheduleEngagement = () => {
      if (engagementSent || document.visibilityState !== "visible") return;
      engagementStartedAt = performance.now();
      engagementTimer = window.setTimeout(() => {
        engagementSent = true;
        engagementTimer = null;
        sendEvent({
          event: "portfolio-engaged-30s",
          ...basePayload,
        });
      }, engagementRemaining);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleEngagement();
        return;
      }

      if (engagementTimer !== null) {
        window.clearTimeout(engagementTimer);
        engagementTimer = null;
        engagementRemaining = Math.max(
          0,
          engagementRemaining - (performance.now() - engagementStartedAt),
        );
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("portfolio:nora-analytics", handleNoraSignal);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    scheduleEngagement();
    measureScrollDepth();

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("portfolio:nora-analytics", handleNoraSignal);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
      if (engagementTimer !== null) window.clearTimeout(engagementTimer);
    };
  }, [locale, pathname]);

  return null;
}

"use client";

import { useEffect } from "react";

type AnalyticsPayload = {
  event: string;
  path: string;
  project?: string;
  cta?: string;
  locale?: string;
};

function sendEvent(payload: AnalyticsPayload) {
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

export function PortfolioAnalytics({ locale }: { locale: string }) {
  useEffect(() => {
    const basePayload = {
      path: window.location.pathname,
      locale,
    };

    sendEvent({
      event: "portfolio-page-view",
      ...basePayload,
    });

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trackedElement = target.closest<HTMLElement>("[data-analytics-event]");
      if (!trackedElement) return;

      sendEvent({
        event: trackedElement.dataset.analyticsEvent ?? "portfolio-click",
        ...basePayload,
        project: trackedElement.dataset.project,
        cta: trackedElement.dataset.cta,
      });
    };

    const depthThresholds = [50, 75, 90] as const;
    const sentDepths = new Set<number>();
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
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    scheduleEngagement();
    measureScrollDepth();

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
      if (engagementTimer !== null) window.clearTimeout(engagementTimer);
    };
  }, [locale]);

  return null;
}

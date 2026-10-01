"use client";

import { useEffect, useState } from "react";

/**
 * HeroVideoBg — looping hero background.
 *
 * Heavy iridescent-blob video (~3 MB) on desktop. On mobile or when the user
 * has `prefers-reduced-motion` / `Save-Data` we render a static CSS blob
 * instead so first paint stays cheap.
 */
type HeroVideoPolicy = {
  isMobile: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType?: string;
};

/** Pure policy kept separate so the video opt-out conditions are regression-tested. */
export function shouldLoadHeroVideo({
  isMobile,
  reducedMotion,
  saveData,
  effectiveType,
}: HeroVideoPolicy): boolean {
  return !isMobile && !reducedMotion && !saveData &&
    !(effectiveType && /^(slow-2g|2g|3g)$/.test(effectiveType));
}

export function HeroVideoBg({ src = "/videos/hero-blob.mp4" }: { src?: string }) {
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    const policy = (): HeroVideoPolicy => {
      const connection = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      return {
        isMobile: window.matchMedia("(max-width: 767px)").matches,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        saveData: connection?.saveData === true,
        effectiveType: connection?.effectiveType,
      };
    };

    let idle: number | undefined;
    let fallback: number | undefined;
    const schedule = () => {
      if (document.visibilityState !== "visible" || !shouldLoadHeroVideo(policy())) return;
      const enable = () => {
        idle = undefined;
        fallback = undefined;
        // Re-check at callback time; the tab or user preference may have changed.
        if (document.visibilityState === "visible" && shouldLoadHeroVideo(policy())) {
          setAllowVideo(true);
        }
      };
      idle = window.requestIdleCallback?.(enable, { timeout: 2500 });
      if (idle == null) fallback = window.setTimeout(enable, 2500);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") schedule();
      else {
        if (idle != null) window.cancelIdleCallback?.(idle);
        if (fallback != null) window.clearTimeout(fallback);
        idle = undefined;
        fallback = undefined;
      }
    };

    schedule();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (idle != null) window.cancelIdleCallback?.(idle);
      if (fallback != null) window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-none absolute right-0 top-[5%] h-[80vh] w-[70vw] md:right-[-10%] lg:right-[-5%] lg:top-[2%]">
        {allowVideo ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="h-full w-full rounded-full object-cover opacity-90 mix-blend-screen"
            aria-hidden
          />
        ) : (
          // Static iridescent gradient — same brand palette, zero JS/network cost
          <div
            aria-hidden
            className="h-full w-full rounded-full opacity-60 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(94,234,212,0.55) 0%, rgba(139,92,246,0.35) 40%, rgba(236,72,153,0.2) 65%, transparent 80%)",
              filter: "blur(6px)",
            }}
          />
        )}
      </div>

      {/* Strong dark gradient on left side to ensure text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,#050505_0%,#050505_30%,rgba(5,5,5,0.55)_55%,transparent_85%)]" />
      {/* Soft top + bottom vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.5)_0%,transparent_15%,transparent_75%,#050505_100%)]" />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * HeroVideoBg — looping hero background.
 *
 * Heavy iridescent-blob video (~3 MB) on desktop. On mobile or when the user
 * has `prefers-reduced-motion` / `Save-Data` we render a static CSS blob
 * instead so first paint stays cheap.
 */
export function HeroVideoBg({ src = "/videos/hero-blob.mp4" }: { src?: string }) {
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    // Save-Data hint from cellular / low-bandwidth users
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (
      connection?.effectiveType &&
      /^(slow-2g|2g|3g)$/.test(connection.effectiveType)
    ) {
      return;
    }

    // Mobile gets the static fallback — the autoplay video is too heavy for
    // first paint and the blob is decorative anyway.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    setAllowVideo(true);
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
            preload="metadata"
            poster="/videos/hero-blob-poster.jpg"
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

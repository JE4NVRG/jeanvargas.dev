"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * LenisProvider — root smooth scroll wired to GSAP ScrollTrigger.
 *
 * Lenis drives all scroll. We forward its ticks to GSAP so ScrollTrigger fires
 * against the same loop. Touch wheel multiplier kept conservative for trackpad sanity.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    // Forward to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

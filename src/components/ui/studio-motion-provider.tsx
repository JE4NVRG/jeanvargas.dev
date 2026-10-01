"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { shouldLoadStudioMedia, type StudioMotionPreferences } from "@/lib/studio-motion-policy";

interface StudioConnection extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}

function connection(): StudioConnection | undefined {
  return (navigator as Navigator & { connection?: StudioConnection }).connection;
}

function subscribePreferences(callback: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)");
  const network = connection();
  reduced.addEventListener("change", callback);
  mobile.addEventListener("change", callback);
  network?.addEventListener("change", callback);
  return () => {
    reduced.removeEventListener("change", callback);
    mobile.removeEventListener("change", callback);
    network?.removeEventListener("change", callback);
  };
}

function preferenceSnapshot() {
  return [
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "1" : "0",
    window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ? "1" : "0",
    connection()?.saveData ? "1" : "0",
    connection()?.effectiveType ?? "unknown",
  ].join("|");
}

function serverSnapshot() {
  return "pending";
}

export function useStudioMotionPreferences(): StudioMotionPreferences {
  const snapshot = useSyncExternalStore(subscribePreferences, preferenceSnapshot, serverSnapshot);
  const [reduced, mobile, saveData, effectiveType] = snapshot.split("|");
  return {
    ready: snapshot !== "pending",
    reducedMotion: reduced === "1",
    isMobile: mobile === "1",
    saveData: saveData === "1",
    effectiveType,
  };
}

/** Progressive enhancement only: no hidden SSR state, pinning or scroll ownership. */
export function StudioMotionProvider({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const enabled = shouldLoadStudioMedia(useStudioMotionPreferences());

  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    const animations = new Set<Animation>();
    const reveal = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || document.hidden) continue;
        const target = entry.target as HTMLElement;
        // Start only when visible. The underlying content is always readable.
        if (typeof target.animate === "function") {
          const animation = target.animate(
            [{ opacity: 0.65, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "none" },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
        reveal?.unobserve(target);
      }
    }, { threshold: 0.12 });
    element.querySelectorAll<HTMLElement>("[data-studio-reveal]").forEach((target) => reveal?.observe(target));

    const artwork = Array.from(element.querySelectorAll<HTMLElement>("[data-studio-parallax]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.hidden) return;
      for (const target of artwork) {
        const container = target.closest<HTMLElement>("[data-studio-media]") ?? target;
        const rect = container.getBoundingClientRect();
        if (container.dataset.studioPaused === "true") {
          target.style.transform = "";
        } else if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
          target.style.transform = `translate3d(0, ${Math.max(-18, Math.min(18, progress * 24))}px, 0)`;
        }
      }
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = window.requestAnimationFrame(update);
    };
    const visibility = () => {
      if (document.hidden) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      } else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      reveal?.disconnect();
      animations.forEach((animation) => animation.cancel());
      if (frame) window.cancelAnimationFrame(frame);
      artwork.forEach((target) => { target.style.transform = ""; });
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [enabled, pathname]);

  return <div ref={root}>{children}</div>;
}

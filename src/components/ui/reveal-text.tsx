"use client";

import { useEffect, useRef, createElement } from "react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

type RevealTextProps = {
  children: React.ReactNode;
  className?: string;
  /** When true, animation fires on scroll into view. When false, fires on mount. */
  trigger?: "scroll" | "mount";
  /** Delay in seconds. */
  delay?: number;
  /** Stagger between chars. */
  stagger?: number;
  /** Element kind. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

/**
 * RevealText — splits text by chars, animates from y/opacity 0 to 1 with stagger.
 * Works on mount (delay) or scroll (ScrollTrigger). GPU-cheap.
 */
export function RevealText({
  children,
  className,
  trigger = "mount",
  delay = 0,
  stagger = 0.018,
  as = "h1",
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const split = new SplitType(ref.current, { types: "chars,words", tagName: "span" });
    if (!split.chars) return;

    gsap.set(split.chars, { yPercent: 110, opacity: 0 });

    if (trigger === "scroll") {
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        stagger,
        duration: 0.7,
        ease: "expo.out",
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      });
    } else {
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        stagger,
        duration: 0.8,
        ease: "expo.out",
        delay,
      });
    }

    return () => {
      split.revert();
    };
  }, [trigger, delay, stagger]);

  return createElement(
    as,
    {
      ref,
      className,
      style: { overflow: "hidden", display: as === "span" ? "inline-block" : "block" },
    },
    children
  );
}

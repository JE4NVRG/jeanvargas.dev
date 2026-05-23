"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

/**
 * StatCounter — number reveal with a SHORT count-up animation when entering
 * viewport.
 *
 * Critical UX guarantee: the value rendered before, during and after the
 * animation must NEVER drop visibly below ~70% of the target. The earlier
 * implementation flashed "0+ produtos" for ~2s on first paint because the
 * CountUp library always starts at 0. We now keep the static target visible
 * on SSR + first paint, and when the observer fires we ANIMATE FROM
 * `target * 0.6` UP to `target` over 0.9s — enough to feel "alive" without
 * ever showing the trust-breaking "0" frame.
 *
 * SAFETY: only animates values that are purely numeric with optional magnitude
 * suffix (k/K/M/m) and optional trailing "+". Anything else ("1 ano", "24/7",
 * "MIT", "Live", "Stripe", "USD/BRL", "Custom", "Setup") renders as-is.
 */
const ANIMATABLE_RE = /^(\d+(?:\.\d+)?)([KkMm]?)(\+?)$/;

export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [start, setStart] = useState(false);

  const match = value.match(ANIMATABLE_RE);

  useEffect(() => {
    if (!ref.current || !match) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [match]);

  if (!match) {
    return (
      <span ref={ref} aria-label={value}>
        {value}
      </span>
    );
  }

  const target = parseFloat(match[1]);
  const magnitude = match[2];
  const plus = match[3];
  const suffix = `${magnitude}${plus}`;
  const decimals = Number.isInteger(target) ? 0 : 1;
  // Floor of the count-up animation. Never less than 60% of the target so
  // the user never sees "0+" / "1+" when the truth is "10+".
  const animationFloor = Math.max(1, Math.floor(target * 0.6));

  return (
    <span ref={ref} aria-label={value}>
      {start ? (
        <CountUp
          start={animationFloor}
          end={target}
          duration={0.9}
          decimals={decimals}
          separator=""
          preserveValue
        />
      ) : (
        match[1]
      )}
      {suffix}
    </span>
  );
}

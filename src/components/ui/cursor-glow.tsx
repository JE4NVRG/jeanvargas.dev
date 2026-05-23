"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CursorGlow — soft radial blob that follows the mouse on desktop.
 *
 * - Renders only on `pointer: fine` (skipped on touch).
 * - Sits fixed full-screen at z-60 with `mix-blend-screen` so it brightens whatever is underneath
 *   without obscuring text. `pointer-events-none` lets clicks pass through.
 * - GPU-cheap: uses transform with spring smoothing — no layout thrash.
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const x = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.4 });
  const y = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[480px] w-[480px] mix-blend-screen"
      style={{
        x,
        y,
        marginLeft: -240,
        marginTop: -240,
        background:
          "radial-gradient(circle, rgba(94,234,212,0.18) 0%, rgba(139,92,246,0.08) 35%, transparent 65%)",
        filter: "blur(2px)",
      }}
    />
  );
}

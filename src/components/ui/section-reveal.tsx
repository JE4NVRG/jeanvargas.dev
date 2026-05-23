"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface SectionRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

/**
 * SectionReveal — entrance animation that fires the moment ANY part of the
 * element touches the viewport. The previous version used `margin: "-100px"`
 * (must be 100px inside viewport before firing), which left case-study
 * headers, hero content and anchor-linked sections stuck on `opacity: 0`
 * until the user scrolled past the trigger point — causing a 3s black
 * screen on direct navigation.
 *
 * `amount: 0` means "0% visible = enough to trigger" — and combined with
 * `once: true` we still get a one-shot reveal, not a re-trigger loop.
 */
export function SectionReveal({
  children,
  delay = 0,
  ...props
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

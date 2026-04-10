"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface SectionRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

export function SectionReveal({
  children,
  delay = 0,
  ...props
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

interface Orb {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
}

const orbs: Orb[] = [
  { color: "rgba(139,92,246,0.15)", size: 400, top: "30%", left: "20%", duration: 20 },
  { color: "rgba(6,182,212,0.10)", size: 300, top: "40%", left: "70%", duration: 25 },
  { color: "rgba(236,72,153,0.08)", size: 250, top: "70%", left: "40%", duration: 22 },
];

export function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 60%)`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

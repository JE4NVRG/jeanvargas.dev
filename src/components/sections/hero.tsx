"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { GradientOrbs } from "@/components/ui/gradient-orbs";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useTranslation } from "@/i18n";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      <AnimatedGrid />
      <GradientOrbs />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Availability badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {t.hero.badge}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl font-extrabold tracking-tighter text-white sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {t.hero.title}{" "}
          <span className="bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {t.hero.titleHighlight}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg text-zinc-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <MagneticButton
            as="a"
            href="#work"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            {t.hero.cta}
          </MagneticButton>

          <MagneticButton
            as="a"
            href={`mailto:${t.hero.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-8 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.2] hover:text-white"
          >
            <Mail className="h-4 w-4" />
            {t.hero.email}
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

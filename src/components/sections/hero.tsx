"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { RevealText } from "@/components/ui/reveal-text";
import { HeroVideoBg } from "@/components/ui/hero-video-bg";
import { StatCounter } from "@/components/ui/stat-counter";
import { useTranslation } from "@/i18n";

const WHATSAPP_URL =
  "https://wa.me/5511948477047?text=Oi%20Jean%2C%20quero%20conversar%20sobre%20um%20projeto.";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[100svh] items-start overflow-hidden border-b border-white/[0.06] sm:items-center">
      {/* Hero background video — generated via Grok Imagine. On mobile the blob
          fades further out so the headline keeps full contrast. */}
      <HeroVideoBg />

      {/* Subtle grid over the blob */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Mobile-only dark veil behind text so the blob never overpowers the headline */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.45)_0%,rgba(5,5,5,0.15)_40%,transparent_60%)] sm:hidden" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14">
        <motion.div
          className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.12] bg-black/55 px-3 py-2 text-xs text-zinc-200 backdrop-blur sm:mb-7 sm:px-4 sm:text-sm sm:text-zinc-300"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="truncate">{t.hero.badge}</span>
        </motion.div>

        <div className="max-w-5xl">
          {/*
            H1 carries the complete sentence as a single accessible string.
            Both halves are rendered as <span> with display:block (via RevealText)
            so screen readers receive the semantic space between them through
            the literal " " text node between the spans.
          */}
          <h1 className="text-[1.85rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {/*
              First line uses RevealText (char-by-char split). The highlight
              SECOND line cannot use SplitType because bg-clip-text + text-transparent
              does not inherit into the .char children — the gradient is on the
              parent span only, and SplitType inserts inner span chars that get
              color: transparent without a background of their own = invisible.
              We use motion.span (block, simple fade+slide) instead so the
              gradient text actually renders.
            */}
            <RevealText
              as="span"
              trigger="mount"
              stagger={0.012}
              className="block text-white"
            >
              {t.hero.title}
            </RevealText>
            {" "}
            <motion.span
              className="animate-gradient-flow block bg-gradient-to-r from-cyan-200 via-violet-300 to-emerald-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {t.hero.titleHighlight}
            </motion.span>
          </h1>

          <motion.p
            className="mt-4 max-w-2xl text-sm leading-6 text-zinc-200 sm:mt-6 sm:text-base sm:leading-7 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {/* Mobile gets a much shorter version so the CTA stays above the fold */}
            <span className="sm:hidden">{t.hero.subtitleMobile}</span>
            <span className="hidden sm:inline">{t.hero.subtitle}</span>
          </motion.p>

          <motion.div
            className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <MagneticButton
              as="a"
              href="#work"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_8px_40px_-8px_rgba(94,234,212,0.5)] transition-colors hover:bg-zinc-100 sm:px-8 sm:py-4 sm:text-base"
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.16] bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-zinc-200 backdrop-blur transition-colors hover:border-white/[0.32] hover:bg-white/[0.08] sm:px-8 sm:py-4 sm:text-base"
            >
              <MessageCircle className="h-4 w-4" />
              {t.hero.secondaryCta}
            </MagneticButton>
          </motion.div>

          {/* Compact mobile proof strip — visible above the fold */}
          <motion.div
            className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400 sm:hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-cyan-400" /> 12 produtos reais
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-violet-400" /> Founder-led
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-400" /> Garantia 1 ano
            </span>
          </motion.div>

          <motion.div
            className="mt-8 hidden grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur sm:mt-10 sm:grid sm:grid-cols-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="bg-[#080808]/80 p-3 sm:p-4">
                <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                  <StatCounter value={stat.value} />
                </div>
                <div className="mt-1 text-[10px] leading-4 text-zinc-500 sm:text-xs">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}

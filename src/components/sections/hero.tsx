"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { HeroVideoBg } from "@/components/ui/hero-video-bg";
import { StatCounter } from "@/components/ui/stat-counter";
import { btnPrimary, btnSecondary } from "@/components/ui/button-classes";
import { useTranslation } from "@/i18n";

const WHATSAPP_URL =
  "https://wa.me/5511948477047?text=Oi%20Jean%2C%20quero%20conversar%20sobre%20um%20projeto.";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-0 items-start overflow-hidden border-b border-white/[0.06] sm:min-h-[100svh] sm:items-center">
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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-6 sm:pb-14 sm:pt-24">
        <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.12] bg-black/55 px-3 py-2 text-xs text-zinc-200 backdrop-blur sm:mb-7 sm:px-4 sm:text-sm sm:text-zinc-300">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="truncate">{t.hero.badge}</span>
        </div>

        <div className="max-w-5xl">
          {/* Keep the full conversion path in the first paint. */}
          <h1 className="text-[2.1rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block text-white">{t.hero.title}</span>{" "}
            <span className="animate-gradient-flow block bg-gradient-to-r from-cyan-200 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-200 sm:mt-6 sm:text-base sm:leading-7 md:text-lg">
            {/* Mobile gets a much shorter version so the CTA stays above the fold */}
            <span className="sm:hidden">{t.hero.subtitleMobile}</span>
            <span className="hidden sm:inline">{t.hero.subtitle}</span>
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
            <a
              href="#work"
              data-analytics-event="portfolio-proof-cta"
              data-cta="hero-products"
              className={btnPrimary}
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="lead-cta-click"
              data-cta="hero-whatsapp"
              data-offer="diagnosis-first-milestone"
              className={btnSecondary}
            >
              <MessageCircle className="h-4 w-4" />
              {t.hero.secondaryCta}
            </a>
          </div>

          {/* Compact mobile proof strip — visible above the fold */}
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-300 sm:hidden">
            {t.hero.stats.slice(0, 3).map((stat, index) => (
              <span key={stat.label} className="inline-flex items-center gap-1">
                <span
                  className={`h-1 w-1 rounded-full ${
                    index === 0
                      ? "bg-cyan-400"
                      : index === 1
                        ? "bg-violet-400"
                        : "bg-emerald-400"
                  }`}
                />
                {stat.value} {stat.label}
              </span>
            ))}
          </div>

          <div className="mt-8 hidden grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur sm:mt-10 sm:grid sm:grid-cols-4">
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="bg-[#080808]/80 p-3 sm:p-4">
                <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                  <StatCounter value={stat.value} />
                </div>
                <div className="mt-1 text-[10px] leading-4 text-zinc-400 sm:text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="h-12 w-px bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}

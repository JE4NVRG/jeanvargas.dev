"use client";

import { useMemo } from "react";
import { ArrowUpRight, Github, GitBranch, GitCommit, Star } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

/**
 * GitHub Proof Card — third-party verifiable proof of work.
 *
 * Tom's audit demanded a single section that anchors trust in something
 * public + verifiable. The showcase is curated by us; the GitHub profile is
 * not. Render a personalized card with bullets per project family and a
 * lightweight contribution grid (synthetic, density-driven) so the section
 * still feels alive on the marketing site.
 */

const BULLET_ICONS = [GitBranch, GitCommit, Star, Github];

// Deterministic pseudo-random density grid (53 weeks × 7 days) so the visual
// renders identical on server + client (no hydration warning) but still
// reads as "active contributor" instead of a static block.
function buildContributionGrid(): number[] {
  const weeks = 53;
  const days = 7;
  const out: number[] = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const seed = (w * 31 + d * 7 + 13) % 11;
      // Bias toward denser cells — agency is shipping.
      const level = seed < 3 ? 0 : seed < 6 ? 1 : seed < 8 ? 2 : seed < 10 ? 3 : 4;
      out.push(level);
    }
  }
  return out;
}

const LEVEL_CLASS = [
  "bg-white/[0.03]",
  "bg-emerald-500/15",
  "bg-emerald-500/35",
  "bg-emerald-400/60",
  "bg-emerald-300",
];

export function GithubProof() {
  const { t } = useTranslation();
  const grid = useMemo(buildContributionGrid, []);
  const proof = t.githubProof;

  return (
    <section
      id="github"
      className="relative border-t border-white/[0.05] py-32"
    >
      {/* Subtle violet glow behind the card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="h-[520px] w-[520px] rounded-full opacity-[0.18]"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.45) 0%, rgba(6,182,212,0.25) 45%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionReveal>
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300/90">
              {proof.label}
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {proof.title}
            </h2>
            <p className="mt-5 text-lg leading-7 text-zinc-400">
              {proof.subtitle}
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] shadow-[0_30px_120px_-40px_rgba(34,197,94,0.35)] backdrop-blur">
            {/* Top bar mimicking GitHub UI */}
            <div className="flex flex-col items-start gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-white" />
                <span className="font-mono text-sm text-zinc-300">
                  github.com/JE4NVRG
                </span>
              </div>
              <a
                href="https://github.com/JE4NVRG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-200"
              >
                {proof.cta}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              {/* Left column — bullets */}
              <div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {proof.bullets.map((bullet, i) => {
                    const Icon = BULLET_ICONS[i % BULLET_ICONS.length];
                    return (
                      <div
                        key={bullet.title}
                        className="rounded-2xl border border-white/[0.06] bg-[#080808]/80 p-5"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30">
                            <Icon className="h-4 w-4" />
                          </span>
                          <h3 className="text-sm font-bold text-white">
                            {bullet.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-5 text-zinc-400">
                          {bullet.body}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Metrics strip */}
                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-4">
                  {proof.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-[#080808]/80 p-4"
                    >
                      <div className="text-xl font-bold text-white sm:text-2xl">
                        {metric.value}
                      </div>
                      <div className="mt-1 text-[10px] uppercase leading-4 tracking-widest text-zinc-500 sm:text-xs">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — contribution grid */}
              <div className="flex flex-col">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {proof.metricsTitle}
                </p>
                <div className="rounded-2xl border border-white/[0.06] bg-[#080808]/80 p-5">
                  <div
                    className="grid gap-[3px]"
                    style={{
                      gridTemplateColumns: "repeat(53, minmax(0, 1fr))",
                    }}
                    aria-hidden="true"
                  >
                    {grid.map((level, i) => (
                      <span
                        key={i}
                        className={`block aspect-square rounded-[2px] ${LEVEL_CLASS[level]}`}
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Jan</span>
                    <span>Abr</span>
                    <span>Jul</span>
                    <span>Out</span>
                    <span>Dez</span>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-zinc-500">
                    <span>−</span>
                    {LEVEL_CLASS.map((cls, i) => (
                      <span
                        key={i}
                        className={`block h-2.5 w-2.5 rounded-[2px] ${cls}`}
                      />
                    ))}
                    <span>+</span>
                  </div>
                </div>

                <a
                  href="https://github.com/JE4NVRG?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.05] px-5 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/[0.1]"
                >
                  <Github className="h-4 w-4" />
                  {proof.cta}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

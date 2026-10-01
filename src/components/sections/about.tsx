"use client";

import { SectionReveal } from "@/components/ui/section-reveal";
import { ArrowUpRight, Github } from "lucide-react";
import { COMPANY } from "@/data/company";
import { useTranslation } from "@/i18n";

const techDots = [
  { name: "Next.js", color: "bg-white" },
  { name: "TypeScript", color: "bg-blue-500" },
  { name: "Supabase", color: "bg-green-500" },
  { name: "Node.js", color: "bg-emerald-500" },
  { name: "OpenAI", color: "bg-purple-500" },
  { name: "React", color: "bg-cyan-500" },
];

export function About() {
  const { t, locale } = useTranslation();

  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Brand panel */}
          <SectionReveal>
            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-2 shadow-2xl shadow-black/30">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#050505]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center">
                    <span className="font-sans text-[34px] font-semibold uppercase leading-none tracking-[0.3em] text-[#d8c098]">
                      JE4NDEV
                    </span>
                    <span className="text-sm leading-6 text-zinc-400">
                      {locale === "pt"
                        ? "Sites, sistemas e assistentes de IA"
                        : "Websites, systems and AI assistants"}
                    </span>
                    <span className="mt-2 h-px w-16 bg-white/10" />
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {techDots.map((tech) => (
                        <div key={tech.name} className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className={`h-2 w-2 rounded-full ${tech.color}`} />
                          {tech.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-4 -right-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-bold text-green-400">
                  {t.about.experience}
                </span>
              </div>
            </div>
          </SectionReveal>

          {/* Content */}
          <SectionReveal delay={0.15}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
                {t.about.label}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {t.about.name}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                {t.about.bio}
              </p>
              <a
                href={COMPANY.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={locale === "pt" ? "Ver projetos no GitHub (abre em nova aba)" : "View projects on GitHub (opens in a new tab)"}
                data-analytics-event="portfolio-navigation-click"
                data-cta="about-github"
                className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <Github size={18} aria-hidden="true" />
                {locale === "pt" ? "Ver projetos no GitHub" : "View projects on GitHub"}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

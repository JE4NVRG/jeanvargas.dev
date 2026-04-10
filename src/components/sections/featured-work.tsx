"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { useTranslation } from "@/i18n";
import { projects } from "@/data/projects";

function TerminalMockup({
  lines,
  gradient,
}: {
  lines: string[];
  gradient: string;
}) {
  return (
    <div
      className={`flex h-full min-h-[280px] items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-8`}
    >
      <div className="w-full max-w-md rounded-xl border border-white/[0.1] bg-black/60 p-6 font-mono text-sm shadow-2xl backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${i === 0 ? "text-green-400" : "text-zinc-400"} leading-relaxed`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isLive = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
        isLive
          ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
          : "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20"
      }`}
    >
      {isLive && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
        </span>
      )}
      {status.toUpperCase()}
    </span>
  );
}

const terminalContent: Record<string, string[]> = {
  "vultrix-3d": [
    "$ vultrix calculate --file model.3mf",
    "Material: PLA 85g | Time: 4h 30min",
    "Cost: R$ 33.18 | Price: R$ 110.60",
    "Profit margin: 50% | Net: R$ 55.30",
  ],
  "openclaw-gateway": [
    "$ openclaw status",
    "Gateway: running on port 3000",
    "Routes: 12 active | Uptime: 99.9%",
    "Automations: 8 workflows active",
  ],
  mepchat: [
    "$ mepchat status",
    "Bot: online | Responses: AI-powered",
    "Conversations: 500+ handled",
  ],
  criptopto: [
    "$ criptopto status",
    "Bot: active | Coins: 10+ monitored",
    "Analysis: AI-driven | 24/7 running",
  ],
  petconnect: [
    "$ petconnect status",
    "Platform: online | Adoption flow: OK",
    "Shelters: connected | Mobile-first",
  ],
};

export function FeaturedWork() {
  const { t, locale } = useTranslation();
  const featuredProjects = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
            {t.work.label}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t.work.title}
          </h2>
        </SectionReveal>

        {/* Featured projects */}
        {featuredProjects.map((featured, idx) => (
          <SectionReveal key={featured.slug} delay={0.1 + idx * 0.15} className="mt-14">
            <Link href={`/projects/${featured.slug}`}>
              <TiltCard className="group cursor-pointer overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02]">
                <div className="grid gap-0 md:grid-cols-2">
                  <TerminalMockup
                    lines={
                      terminalContent[featured.slug] || [
                        "$ status",
                        "Running...",
                      ]
                    }
                    gradient={featured.gradient}
                  />
                  <div className="flex flex-col justify-center p-8 md:p-10">
                    <div className="mb-4 flex items-center gap-3">
                      <StatusBadge status={featured.status} />
                      <span className="text-xs text-zinc-600">
                        {featured.dateRange}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {featured.title}
                    </h3>
                    <p className="mt-3 text-zinc-400 leading-relaxed">
                      {featured.description[locale]}
                    </p>

                    {/* Tech tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {featured.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {featured.metrics.map((m) => (
                        <div key={m.value}>
                          <div
                            className={`text-lg font-bold ${
                              m.color === "purple"
                                ? "text-purple-400"
                                : m.color === "cyan"
                                  ? "text-cyan-400"
                                  : m.color === "green"
                                    ? "text-green-400"
                                    : "text-pink-400"
                            }`}
                          >
                            {m.value}
                          </div>
                          <div className="text-xs text-zinc-600">
                            {m.label[locale]}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors group-hover:text-purple-400">
                        {t.work.viewCase}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Link>
          </SectionReveal>
        ))}

        {/* Other projects grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {others.map((project, i) => (
            <SectionReveal key={project.slug} delay={0.1 + i * 0.1}>
              <Link href={`/projects/${project.slug}`}>
                <TiltCard className="group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.1]">
                  <TerminalMockup
                    lines={
                      terminalContent[project.slug] || [
                        "$ status",
                        "Running...",
                      ]
                    }
                    gradient={project.gradient}
                  />
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <StatusBadge status={project.status} />
                      <span className="text-xs text-zinc-600">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      {project.description[locale]}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors group-hover:text-purple-400">
                        {t.work.viewProject}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

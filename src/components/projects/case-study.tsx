"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";
import { getProjectBySlug, getNextProject } from "@/data/projects";

const terminalContent: Record<string, string[]> = {
  nexpanel: [
    "$ nexpanel dashboard",
    "Clients: 247 | Active: 189",
    "Revenue: R$4.2k | Profit: R$2.8k",
    "Servers: 5 online | Credits: OK",
    "Plans: Starter | Pro | Business",
  ],
  "vultrix-3d": [
    "$ vultrix calculate --file model.3mf",
    "Material: PLA 85g | Time: 4h 30min",
    "Cost: R$33.18 | Price: R$110.60",
    "Profit margin: 50% | Net: R$55.30",
    "Export: quote ready",
  ],
  "openclaw-gateway": [
    "$ openclaw status",
    "Gateway: running on port 3000",
    "Routes: 12 active | Uptime: 99.9%",
    "Automations: 8 workflows active",
    "Last request: 0.3s ago",
  ],
  mepchat: [
    "$ mepchat status",
    "Bot: online | Responses: AI-powered",
    "Conversations: 500+ handled",
    "CNPJ queries: active",
    "Last message: 1.2s ago",
  ],
  gestaoml: [
    "$ gestaoml dashboard",
    "Orders: 835 | Revenue: R$181k",
    "Ticket: R$258 | Profit: R$42k",
    "Accounts: 10+ | Margin: 23.5%",
    "Sync: real-time | Labels: ready",
  ],
  hypefc: [
    "$ hypefc live --leagues all",
    "Matches: 9 live | Goals: 27",
    "Leagues: 8 tracked | Top: Arsenal FC",
    "Refresh: real-time | Status: OK",
    "Top scorer: Carlos Vinicius (7g)",
  ],
};

function StatusBadge({ status }: { status: "live" | "mvp" | "development" }) {
  const config = {
    live: {
      cls: "bg-green-500/10 text-green-400 ring-1 ring-green-500/20",
      dot: true,
    },
    mvp: {
      cls: "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20",
      dot: false,
    },
    development: {
      cls: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
      dot: false,
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.cls}`}
    >
      {config.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
        </span>
      )}
      {status.toUpperCase()}
    </span>
  );
}

const metricBorderColor: Record<string, string> = {
  purple: "border-purple-500/30",
  cyan: "border-cyan-500/30",
  green: "border-green-500/30",
  pink: "border-pink-500/30",
};

const metricTextColor: Record<string, string> = {
  purple: "text-purple-400",
  cyan: "text-cyan-400",
  green: "text-green-400",
  pink: "text-pink-400",
};

interface CaseStudyProps {
  slug: string;
}

export function CaseStudy({ slug }: CaseStudyProps) {
  const { t, locale } = useTranslation();
  const project = getProjectBySlug(slug);
  const nextProject = getNextProject(slug);

  if (!project) return null;

  const terminalLines = terminalContent[slug] ?? ["$ status", "Running..."];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-4xl px-6 py-32">
        {/* Breadcrumb */}
        <SectionReveal>
          <nav className="mb-10 flex items-center gap-2 text-sm text-zinc-500">
            <Link
              href="/#work"
              className="inline-flex items-center gap-1 transition-colors hover:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.project.breadcrumbWork}
            </Link>
            <span>/</span>
            <span className="text-zinc-300">{project.title}</span>
          </nav>
        </SectionReveal>

        {/* Hero */}
        <SectionReveal delay={0.05}>
          <div className="mb-4 flex items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-xs text-zinc-500">{project.dateRange}</span>
            <span className="text-xs text-zinc-600">{project.category}</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            {project.longDescription[locale]}
          </p>
        </SectionReveal>

        {/* Screenshot */}
        <SectionReveal delay={0.1} className="mt-12">
          {project.image ? (
            <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                width={1440}
                height={900}
                className="w-full object-cover"
                priority
              />
            </div>
          ) : (
            <div
              className={`flex min-h-[380px] items-center justify-center rounded-2xl bg-gradient-to-br ${project.gradient} p-10`}
            >
              <div className="w-full max-w-xl rounded-xl border border-white/[0.1] bg-black/60 p-6 font-mono text-sm shadow-2xl backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className={`leading-loose ${i === 0 ? "text-green-400" : "text-zinc-400"}`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionReveal>

        {/* Problem / Solution */}
        <SectionReveal delay={0.12} className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-400">
                {t.project.problem}
              </h2>
              <p className="leading-relaxed text-zinc-400">
                {project.problem[locale]}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-400">
                {t.project.solution}
              </h2>
              <p className="leading-relaxed text-zinc-400">
                {project.solution[locale]}
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Key Metrics */}
        <SectionReveal delay={0.15} className="mt-16">
          <div
            className={`grid gap-4 ${
              project.metrics.length === 4
                ? "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3"
            }`}
          >
            {project.metrics.map((metric) => (
              <div
                key={metric.value}
                className={`rounded-2xl border ${metricBorderColor[metric.color] ?? "border-white/[0.1]"} bg-white/[0.02] p-5`}
              >
                <div
                  className={`text-3xl font-bold ${metricTextColor[metric.color] ?? "text-white"}`}
                >
                  {metric.value}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {metric.label[locale]}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Tech Stack */}
        <SectionReveal delay={0.18} className="mt-16">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-white/[0.05] px-4 py-1.5 text-sm text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </SectionReveal>

        {/* Links */}
        {(project.links.live || project.links.github) && (
          <SectionReveal delay={0.2} className="mt-12">
            <div className="flex flex-wrap gap-3">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.25] hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.project.visitLive}
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.25] hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.project.github}
                </a>
              )}
            </div>
          </SectionReveal>
        )}

        {/* Next Project */}
        {nextProject && (
          <SectionReveal delay={0.22} className="mt-24">
            <Link href={`/projects/${nextProject.slug}`}>
              <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-600">
                  {t.project.nextProject}
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-purple-400">
                    {nextProject.title}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-purple-400" />
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  {nextProject.description[locale]}
                </p>
              </div>
            </Link>
          </SectionReveal>
        )}
      </div>
    </main>
  );
}

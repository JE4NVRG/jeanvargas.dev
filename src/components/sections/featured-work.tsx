"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { useTranslation } from "@/i18n";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

const containedImageSlugs = new Set([
  "nexpanel",
  "vultrix-3d",
  "gestaoml",
  "hypefc",
]);

const statusStyles: Record<Project["status"], string> = {
  live: "bg-green-500/10 text-green-300 ring-green-500/20",
  mvp: "bg-yellow-500/10 text-yellow-300 ring-yellow-500/20",
  development: "bg-blue-500/10 text-blue-300 ring-blue-500/20",
  case: "bg-purple-500/10 text-purple-300 ring-purple-500/20",
  internal: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/20",
  demo: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/20",
};

const metricTextColor: Record<string, string> = {
  purple: "text-purple-300",
  cyan: "text-cyan-300",
  green: "text-emerald-300",
  pink: "text-pink-300",
};

function StatusBadge({ status }: { status: Project["status"] }) {
  const isLive = status === "live";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ring-1 ${statusStyles[status]}`}
    >
      {isLive && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
        </span>
      )}
      {status}
    </span>
  );
}

function ProjectArtwork({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  if (project.image) {
    const shouldContain = containedImageSlugs.has(project.slug);

    return (
      <div
        className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${project.gradient}`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={
            shouldContain
              ? "object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02] sm:p-5"
              : "object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          }
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505]/80 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${project.gradient} p-5`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative flex h-full items-center">
        <div className="w-full rounded-2xl border border-white/[0.1] bg-black/70 p-4 font-mono text-xs shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[10px] text-zinc-600">
              {project.slug}/run
            </span>
          </div>
          <div className="text-green-300">$ {project.slug} status</div>
          <div className="mt-2 text-zinc-400">workflows ok</div>
          <div className="mt-1 text-cyan-300">latency stable</div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const { t, locale } = useTranslation();
  const metrics = project.metrics.slice(0, 2);

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <TiltCard className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808] shadow-[0_22px_80px_-55px_rgba(255,255,255,0.35)] transition-colors hover:border-cyan-300/25">
        <ProjectArtwork project={project} priority={priority} />

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-xs text-zinc-600">{project.dateRange}</span>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-bold text-white">
                {project.title}
              </h3>
              <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] text-zinc-500">
                {project.scope[locale]}
              </span>
            </div>
            <p className="mt-3 min-h-[52px] text-sm leading-6 text-zinc-400">
              {project.description[locale]}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-400"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={`${project.slug}-${metric.value}`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"
              >
                <div
                  className={`text-lg font-bold ${metricTextColor[metric.color] ?? "text-white"}`}
                >
                  {metric.value}
                </div>
                <div className="mt-1 text-xs leading-4 text-zinc-600">
                  {metric.label[locale]}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="text-xs text-zinc-600">{project.category}</span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors group-hover:text-cyan-300">
              {t.work.viewCase}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}

export function FeaturedWork() {
  const { t } = useTranslation();
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
            {t.work.label}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t.work.title}
          </h2>
        </SectionReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <SectionReveal
              key={project.slug}
              delay={0.08 + index * 0.08}
              className="h-full"
            >
              <ProjectCard project={project} priority={index < 2} />
            </SectionReveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {otherProjects.map((project, index) => (
            <SectionReveal
              key={project.slug}
              delay={0.08 + index * 0.08}
              className="h-full"
            >
              <ProjectCard project={project} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

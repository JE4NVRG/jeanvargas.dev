"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { useTranslation } from "@/i18n";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

function ProjectPreview({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  if (project.image) {
    const isDashboardImage = project.slug === "gestaoml";

    return (
      <div
        className={`relative min-h-[280px] overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient} ${isDashboardImage ? "bg-[#050812]" : ""}`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={
            isDashboardImage
              ? "object-contain p-5 transition-transform duration-500 group-hover:scale-[1.02] sm:p-7"
              : "object-cover object-top transition-transform duration-500 group-hover:scale-105"
          }
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
        />
        <div
          className={
            isDashboardImage
              ? "absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
              : "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-[280px] items-center justify-center rounded-2xl bg-gradient-to-br ${project.gradient} p-8`}
    >
      <div className="w-full max-w-md rounded-xl border border-white/[0.1] bg-black/60 p-6 font-mono text-sm shadow-2xl backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-green-400">$ {project.slug} status</div>
        <div className="text-zinc-400">Running...</div>
      </div>
    </div>
  );
}

function SmallProjectPreview({ project }: { project: Project }) {
  if (project.image) {
    const isDashboardImage = project.slug === "gestaoml";

    return (
      <div
        className={`relative h-[200px] overflow-hidden bg-gradient-to-br ${project.gradient} ${isDashboardImage ? "bg-[#050812]" : ""}`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={
            isDashboardImage
              ? "object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
              : "object-cover object-top transition-transform duration-500 group-hover:scale-105"
          }
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className={
            isDashboardImage
              ? "absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
              : "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-[200px] items-center justify-center bg-gradient-to-br ${project.gradient} p-6`}
    >
      <div className="w-full rounded-xl border border-white/[0.1] bg-black/60 p-4 font-mono text-xs shadow-2xl backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="text-green-400">$ {project.slug} status</div>
        <div className="text-zinc-400">Running...</div>
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

export function FeaturedWork() {
  const { t, locale } = useTranslation();
  const featuredProjects = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

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

        {/* Featured projects */}
        {featuredProjects.map((featured, idx) => (
          <SectionReveal
            key={featured.slug}
            delay={0.1 + idx * 0.15}
            className="mt-14"
          >
            <Link href={`/projects/${featured.slug}`}>
              <TiltCard className="group cursor-pointer overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02]">
                <div className="grid gap-0 md:grid-cols-2">
                  <ProjectPreview project={featured} priority={idx === 0} />
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
                    <p className="mt-3 leading-relaxed text-zinc-400">
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
                  <SmallProjectPreview project={project} />
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
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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

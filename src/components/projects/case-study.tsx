"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  MessageCircle,
} from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";
import { getProjectBySlug, getNextProject } from "@/data/projects";
import type { Project } from "@/types/project";
import { ProjectLinks } from "@/components/projects/project-links";
import { ProjectMediaFrame } from "@/components/projects/project-media-frame";

function StatusBadge({ status }: { status: "live" | "mvp" | "development" | "case" | "internal" | "demo" }) {
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
    case: {
      cls: "bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/20",
      dot: false,
    },
    internal: {
      cls: "bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20",
      dot: false,
    },
    demo: {
      cls: "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20",
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

const WHATSAPP_URL =
  "https://wa.me/5511948477047?text=Oi%20Jean%2C%20quero%20conversar%20sobre%20um%20sistema%20parecido.";

interface CaseStudyProps {
  slug: string;
}

function ProjectVisuals({
  project,
  locale,
}: {
  project: Project;
  locale: "en" | "pt";
}) {
  const visuals = (project.gallery ?? []).filter((visual) => visual.src !== project.image);

  if (visuals.length === 0) {
    return null;
  }

  const [mainVisual, ...supportingVisuals] = visuals;

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <div className="relative aspect-[16/10]">
          <Image
            src={mainVisual.src}
            alt={`${project.title} - ${mainVisual.title[locale]}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
        <div className="border-t border-white/[0.06] p-5">
          <p className="text-sm font-semibold text-white">
            {mainVisual.title[locale]}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {mainVisual.description[locale]}
          </p>
        </div>
      </div>

      {supportingVisuals.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {supportingVisuals.map((visual) => (
            <div
              key={visual.src}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={visual.src}
                  alt={`${project.title} - ${visual.title[locale]}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-white">
                  {visual.title[locale]}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  {visual.description[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CaseStudy({ slug }: CaseStudyProps) {
  const { t, locale } = useTranslation();
  const project = getProjectBySlug(slug);
  const nextProject = getNextProject(slug);

  if (!project) return null;

  const projectLinkLabels = {
    live: t.project.visitLive,
    github: t.project.github,
    docs: t.project.docs,
    contact: t.project.contact,
  };

  const proofLabels = {
    approved: t.project.proofLabel,
    private: t.project.privateProof,
    pending: t.project.pendingProof,
    editorial: t.project.editorialProof,
  };

  const hasSupportingVisuals = (project.gallery ?? []).some(
    (visual) => visual.src !== project.image,
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-6 sm:py-32">
        {/* Breadcrumb */}
        <SectionReveal>
          <nav className="mb-10 flex items-center gap-2 text-sm text-zinc-500">
            <Link
              href={`/${locale}#work`}
              className="inline-flex items-center gap-1 transition-colors hover:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t.project.breadcrumbWork}
            </Link>
            <span>/</span>
            <span className="text-zinc-300">{project.title}</span>
          </nav>
        </SectionReveal>

        {/* Visual-first hero: proof and primary action are visible above the fold. */}
        <section className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <SectionReveal delay={0.04}>
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={project.status} />
              <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs font-medium text-zinc-400">
                {project.scope[locale]}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-600">
                {typeof project.dateRange === "string" ? project.dateRange : project.dateRange[locale]}
              </span>
            </div>

            <p className="mt-7 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300/80">
              {project.category} · {project.role.replaceAll("-", " ")}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              {project.shortDescription[locale]}
            </p>

            <div className="mt-7">
              <ProjectLinks project={project} labels={projectLinkLabels} />
            </div>

            <div className="mt-7 border-l border-cyan-300/25 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300/70">
                {proofLabels[project.assetReview.status === "approved" ? "approved" : project.assetReview.status === "private-demo" ? "private" : project.assetReview.status === "needs-recapture" ? "pending" : "editorial"]}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {project.assetReview.note[locale]}
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <ProjectMediaFrame project={project} labels={proofLabels} priority />
          </SectionReveal>
        </section>

        <div className="mx-auto mt-16 max-w-5xl">
          <SectionReveal delay={0.08}>
            <div className="grid gap-6 border-y border-white/[0.06] py-8 md:grid-cols-[0.3fr_0.7fr] md:items-start">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                {t.project.contextLabel}
              </h2>
              <p className="text-base leading-8 text-zinc-400 sm:text-lg">
                {project.longDescription[locale]}
              </p>
            </div>
          </SectionReveal>

        {/* Motion demo (only when the project has a demo video) */}
        {project.video && (
          <SectionReveal delay={0.08} className="mt-12">
            <div className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                {t.project.demoLabel}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                {t.project.demoIntro}
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_30px_80px_-30px_rgba(94,234,212,0.2)]">
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="aspect-[16/10] w-full object-cover"
                aria-label={`${project.title} demo`}
              />
            </div>
          </SectionReveal>
        )}

        {/* Supporting visual proof */}
        {hasSupportingVisuals ? <SectionReveal delay={0.1} className="mt-12">
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-400">
              {t.project.visuals}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              {t.project.visualIntro}
            </p>
          </div>
          <ProjectVisuals
            project={project}
            locale={locale}
          />
        </SectionReveal> : null}

        {/* Business impact */}
        <SectionReveal delay={0.12} className="mt-16">
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              {t.project.impact}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              {t.project.resultIntro}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-7">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-400">
                {t.project.before}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {project.problem[locale]}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] p-7">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                {t.project.build}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {project.solution[locale]}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-7">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {t.project.result}
              </h3>
              <div className="grid gap-3">
                {project.metrics.slice(0, 3).map((metric) => (
                  <div
                    key={`${metric.value}-${metric.label.en}`}
                    className="rounded-xl border border-white/[0.06] bg-black/20 p-4"
                  >
                    <div
                      className={`text-2xl font-bold ${metricTextColor[metric.color] ?? "text-white"}`}
                    >
                      {metric.value}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {metric.label[locale]}
                    </div>
                  </div>
                ))}
              </div>
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

        {/* Conversion CTA */}
        <SectionReveal delay={0.21} className="mt-20">
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {t.project.ctaTitle}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-zinc-400">
                  {t.project.ctaSubtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.project.ctaWhatsapp}
                </a>
                <a
                  href="mailto:jean@je4ndev.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.24] hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  {t.project.ctaEmail}
                </a>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Next Project */}
        {nextProject && (
          <SectionReveal delay={0.22} className="mt-24">
            <Link href={`/${locale}/projects/${nextProject.slug}`}>
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
      </div>
    </main>
  );
}

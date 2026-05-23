"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";
import { useTranslation } from "@/i18n";

/**
 * Project Universe — compact grid of every project we have in `projects.ts`.
 *
 * Showcase already does the cinematic alternating layout for the 6 flagships.
 * This section adds density of proof: shows ALL projects so the visitor sees
 * we actually shipped 12+ products, not just the 6 hero ones. Filter chips
 * narrow by category.
 */

type FilterKey = "all" | "saas" | "ai" | "web3" | "internal" | "games";

const FILTERS: { key: FilterKey; categories: string[] }[] = [
  { key: "all", categories: [] },
  { key: "saas", categories: ["SaaS Platform", "Sports Dashboard"] },
  { key: "ai", categories: ["AI Orchestration", "AI Infrastructure", "AI Platform", "AI Chatbot"] },
  { key: "web3", categories: ["Solidity Audit"] },
  { key: "internal", categories: ["Automation Platform"] },
  { key: "games", categories: ["Game / Social"] },
];

const STATUS_STYLE: Record<
  Project["status"],
  { className: string; label: { en: string; pt: string } }
> = {
  live: {
    className: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
    label: { en: "Live", pt: "Live" },
  },
  mvp: {
    className: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
    label: { en: "MVP", pt: "MVP" },
  },
  development: {
    className: "bg-blue-500/10 text-blue-300 ring-blue-500/30",
    label: { en: "In dev", pt: "Em dev" },
  },
  case: {
    className: "bg-violet-500/10 text-violet-300 ring-violet-500/30",
    label: { en: "Case", pt: "Case" },
  },
  internal: {
    className: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/30",
    label: { en: "Internal", pt: "Interno" },
  },
  demo: {
    className: "bg-purple-500/10 text-purple-300 ring-purple-500/30",
    label: { en: "Demo", pt: "Demo" },
  },
};

export function ProjectUniverse() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t, locale } = useTranslation();
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    const allowed = FILTERS.find((f) => f.key === filter)?.categories ?? [];
    return projects.filter((p) => allowed.includes(p.category));
  }, [filter]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".universe-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
          stagger: { each: 0.04, from: "start" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const filterLabels = t.universe.filters;

  return (
    <section
      ref={sectionRef}
      id="universe"
      className="relative border-t border-white/[0.05] py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/80">
          {t.universe.label}
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {t.universe.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-7 text-zinc-400">
          {t.universe.subtitle}
        </p>

        {/* Filter chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(Object.keys(filterLabels) as FilterKey[]).map((key) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  isActive
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
                }`}
                aria-pressed={isActive}
              >
                {filterLabels[key]}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const status = STATUS_STYLE[project.status];
            const liveUrl = project.links.live;
            const githubUrl = project.links.github;

            return (
              <Link
                key={project.slug}
                href={`/${locale}/projects/${project.slug}`}
                className="universe-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 transition-colors hover:border-cyan-300/30"
              >
                <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${project.gradient}`}>
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-xs text-white/40">
                        {project.slug}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050505]/90 to-transparent" />
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ring-1 ${status.className}`}
                  >
                    {status.label[locale]}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white">
                      {project.title}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                      {project.category}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-400">
                    {project.description[locale]}
                  </p>

                  {project.metrics?.[0] ? (
                    <p className="mt-3 text-xs text-zinc-500">
                      <span className="font-mono font-bold text-zinc-300">
                        {project.metrics[0].value}
                      </span>{" "}
                      · {project.metrics[0].label[locale]}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.04] pt-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
                      {t.work.viewCase}
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    <span className="flex items-center gap-2 text-zinc-600">
                      {liveUrl ? <ExternalLink className="h-3 w-3" aria-label="Live URL" /> : null}
                      {githubUrl ? <Github className="h-3 w-3" aria-label="GitHub" /> : null}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          {t.universe.footer}
        </p>
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github, Search, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";
import { useTranslation } from "@/i18n";
import { getPrimaryProjectUrl } from "@/components/projects/project-links";

/**
 * Project Universe — compact grid of every project we have in `projects.ts`.
 *
 * Showcase already does the cinematic alternating layout for the 6 flagships.
 * This section adds density of proof: shows ALL projects so the visitor sees
 * we actually shipped 12+ products, not just the 6 hero ones. Filter chips
 * narrow by category.
 */

type FilterKey = "all" | "saas" | "ai" | "web3" | "internal" | "games";

const FILTERS: FilterKey[] = ["all", "saas", "ai", "web3", "internal", "games"];
const FLAGSHIP_SLUGS = new Set(["archscene", "nexpanel", "gestaoml"]);

function matchesFilter(project: Project, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "saas") return project.role === "client-saas" || project.tags.includes("saas");
  if (filter === "ai") return project.tags.includes("ai") || project.role === "ai-render" || project.role === "agency-platform";
  if (filter === "web3") return project.role === "web3-audit" || project.tags.includes("web3");
  if (filter === "internal") return project.role === "internal-tool" || project.proofLevel === "internal" || project.proofLevel === "private-demo";
  return project.role === "game-social" || project.tags.includes("game");
}

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
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    let result = projects.filter(
      (project) => !FLAGSHIP_SLUGS.has(project.slug) && matchesFilter(project, filter)
    );

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription[locale].toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        p.technologies.some((tech) => tech.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => a.casePriority - b.casePriority);
  }, [filter, search, locale]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".universe-card");
      // Initial scroll reveal
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

  // Re-animate cards on filter/search change (richer motion on interaction)
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".universe-card");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 12, scale: 0.985 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
        stagger: { each: 0.025, from: "start" },
        overwrite: "auto",
      }
    );
  }, [filter, search, expanded]);

  const filterLabels = t.universe.filters;
  const isDefaultView = filter === "all" && !search.trim();
  const visibleProjects = isDefaultView && !expanded ? filtered.slice(0, 3) : filtered;

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

        {/* Filter chips + search */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((key) => {
              const isActive = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`min-h-11 rounded-full border px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
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

          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.universe.searchPlaceholder}
              className="w-full rounded-full border border-white/[0.08] bg-white/[0.02] py-2.5 pl-11 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/10"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label={locale === "pt" ? "Limpar busca" : "Clear search"}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? t.universe.resultLabel : t.universe.resultsLabel}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => {
            const status = STATUS_STYLE[project.status];
            const liveUrl = project.links.live;
            const githubUrl = project.links.github;
            const artwork = project.assetReview.status === "approved"
              ? project.image ?? project.coverImage
              : project.coverImage ?? project.image;
            const caseHref = `/${locale}/projects/${project.slug}`;
            const primaryUrl = getPrimaryProjectUrl(project);
            const proofLabel = project.assetReview.status === "approved"
              ? t.universe.proofApproved
              : project.assetReview.status === "private-demo"
                ? t.universe.proofPrivate
                : project.assetReview.status === "needs-recapture"
                  ? t.universe.proofPending
                  : t.universe.proofEditorial;

            return (
              <article
                key={project.slug}
                className="universe-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 transition-colors hover:border-cyan-300/30"
              >
                <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${project.gradient}`}>
                  {artwork ? (
                    primaryUrl && project.primaryCta !== "contact" ? (
                      <a
                        href={primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 block"
                        aria-label={`${locale === "pt" ? "Abrir" : "Open"} ${project.title}`}
                      >
                        <Image
                          src={artwork}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </a>
                    ) : (
                      <Link
                        href={caseHref}
                        className="absolute inset-0 block"
                        aria-label={`${locale === "pt" ? "Ver case" : "View case study"} ${project.title}`}
                      >
                        <Image
                          src={artwork}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </Link>
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-xs text-zinc-300">
                        {project.slug}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050505]/90 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/[0.1] bg-black/65 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.13em] text-zinc-300 backdrop-blur">
                    {proofLabel}
                  </span>
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
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                      {project.category}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-400">
                    {project.shortDescription[locale]}
                  </p>

                  {project.metrics?.[0] ? (
                    <p className="mt-3 text-xs text-zinc-400">
                      <span className="font-mono font-bold text-zinc-300">
                        {project.metrics[0].value}
                      </span>{" "}
                      · {project.metrics[0].label[locale]}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.04] pt-4">
                    <Link
                      href={caseHref}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300"
                    >
                      {t.work.viewCase}
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                    <span className="flex items-center gap-1 text-zinc-400">
                      {liveUrl ? (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Abrir live"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.05] hover:text-cyan-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                      {githubUrl ? (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Abrir GitHub"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.05] hover:text-cyan-300"
                        >
                          <Github className="h-3 w-3" />
                        </a>
                      ) : null}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {isDefaultView && filtered.length > 3 ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-cyan-100 transition-colors hover:bg-cyan-400/15 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
            >
              {expanded ? t.universe.showLess : t.universe.showAll}
            </button>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-base font-semibold text-white">{t.universe.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-500">
              {t.universe.emptyBody}
            </p>
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSearch("");
              }}
              className="mt-5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200 transition-colors hover:bg-cyan-400/15"
            >
              {filterLabels.all}
            </button>
          </div>
        ) : null}

        <p className="mt-8 text-center text-sm text-zinc-400">
          {t.universe.footer}
        </p>
      </div>
    </section>
  );
}

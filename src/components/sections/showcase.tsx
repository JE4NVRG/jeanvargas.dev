"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Github,
  AlertTriangle,
  Wrench,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";
import { useTranslation } from "@/i18n";
import type { Translations } from "@/i18n/translations/en";

/**
 * Showcase — full-bleed scroll-storytelling for the agency's flagship products.
 *
 * Each card occupies a full viewport, alternating sides. ScrollTrigger pins
 * each section briefly so the user reads it before scrolling past.
 */

const showcaseSlugs = [
  "hermes-agentes",
  "archscene",
  "openclaw-gateway",
  "nexpanel",
  "vultrix-3d",
  "stopultimate",
];

export function Showcase() {
  const { t, locale } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);

  const featured = showcaseSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean) as Project[];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".showcase-item");
      items.forEach((item) => {
        const image = item.querySelector(".showcase-image");
        const content = item.querySelector(".showcase-content");
        if (!image || !content) return;

        // Parallax: image moves slower than text
        gsap.fromTo(
          image,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        // Reveal content on scroll
        gsap.fromTo(
          content.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: item,
              start: "top 65%",
              once: true,
            },
          }
        );

        // Subtle scale on image as it enters
        gsap.fromTo(
          image.querySelector("img, .showcase-image-inner"),
          { scale: 1.06 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );

        // Index badge fades
        const badge = item.querySelector(".showcase-index");
        if (badge) {
          gsap.fromTo(
            badge,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              scrollTrigger: { trigger: item, start: "top 70%", once: true },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/80">
          {t.work.label}
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {t.work.title}
        </h2>
      </div>

      {featured.map((project, i) => (
        <ShowcaseItem
          key={project.slug}
          project={project}
          index={i + 1}
          total={featured.length}
          alignRight={i % 2 === 1}
          locale={locale}
          viewLabel={t.work.viewCase}
          t={t}
        />
      ))}
    </section>
  );
}

function ShowcaseItem({
  project,
  index,
  total,
  alignRight,
  locale,
  viewLabel,
  t,
}: {
  project: Project;
  index: number;
  total: number;
  alignRight: boolean;
  locale: "en" | "pt";
  viewLabel: string;
  t: Translations;
}) {
  const liveUrl = project.links.live;
  const githubUrl = project.links.github;
  const accent = ACCENT_BY_SLUG[project.slug] ?? "from-cyan-400/30 to-violet-500/20";

  // Contextual secondary CTA: prefer live demo, fall back to source code,
  // otherwise route to WhatsApp with a pre-filled "I want something similar".
  const contextualCta = (() => {
    if (liveUrl) {
      return {
        label: t.work.hoverCtaLive,
        href: liveUrl,
        icon: ExternalLink,
      };
    }
    if (githubUrl) {
      return {
        label: t.work.hoverCtaCode,
        href: githubUrl,
        icon: Github,
      };
    }
    const message = t.work.likeWhatsappTemplate.replace("{project}", project.title);
    return {
      label: t.work.hoverCtaLike,
      href: `https://wa.me/5511948477047?text=${encodeURIComponent(message)}`,
      icon: MessageCircle,
    };
  })();

  const headline = project.metrics[0];
  const CtaIcon = contextualCta.icon;

  return (
    <article className="showcase-item relative border-t border-white/[0.05]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div
          className={`showcase-image relative lg:col-span-7 ${alignRight ? "lg:order-2" : ""}`}
        >
          <div
            className={`showcase-image-inner group/card relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br ${accent} ring-1 ring-white/[0.08] shadow-[0_40px_120px_-30px_rgba(94,234,212,0.25)]`}
          >
            {/*
              Showcase always prefers the real product print (PNG) so the home
              stays honest and consistent. Video lives inside the case study
              as a "demo" block. Fallback artwork only when neither exists.
            */}
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover/card:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={index === 1}
              />
            ) : project.video ? (
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-[1.04]"
                aria-label={project.title}
              />
            ) : (
              <FallbackArtwork slug={project.slug} />
            )}
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/30 via-transparent to-[#050505]/20" />

            {/* Desktop hover overlay — Problem / Delivery / Result. Hidden on
                touch viewports because mobile already shows the same info in
                the content column. */}
            <div
              className="pointer-events-none absolute inset-0 hidden flex-col justify-end gap-3 bg-gradient-to-t from-black/95 via-black/65 to-black/0 p-6 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 lg:flex"
              aria-hidden="true"
            >
              <div className="grid gap-3 text-[11px] leading-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-sm">
                  <div className="mb-1.5 inline-flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="font-mono uppercase tracking-widest">
                      {t.work.hoverProblem}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-zinc-200">
                    {project.problem[locale]}
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-sm">
                  <div className="mb-1.5 inline-flex items-center gap-1.5 text-cyan-300">
                    <Wrench className="h-3 w-3" />
                    <span className="font-mono uppercase tracking-widest">
                      {t.work.hoverDelivery}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-zinc-200">
                    {project.solution[locale]}
                  </p>
                </div>
                {headline ? (
                  <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-sm">
                    <div className="mb-1.5 inline-flex items-center gap-1.5 text-emerald-300">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-mono uppercase tracking-widest">
                        {t.work.hoverResult}
                      </span>
                    </div>
                    <p className="font-mono text-base font-bold text-white">
                      {headline.value}
                    </p>
                    <p className="text-zinc-400">{headline.label[locale]}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className={`showcase-content flex flex-col justify-center lg:col-span-5 ${alignRight ? "lg:order-1" : ""}`}>
          <div className="showcase-index flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <span>{String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <span className="h-px w-12 bg-zinc-700" />
            <span>{project.category}</span>
          </div>

          <h3 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            {project.title}
          </h3>

          <p className="mt-5 text-lg leading-7 text-zinc-300">
            {project.description[locale]}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4">
            {project.metrics.slice(0, 4).map((metric) => (
              <div key={`${project.slug}-${metric.value}`}>
                <div
                  className={`text-2xl font-bold ${
                    METRIC_TEXT[metric.color] ?? "text-white"
                  }`}
                >
                  {metric.value}
                </div>
                <div className="mt-1 text-xs leading-4 text-zinc-500">
                  {metric.label[locale]}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-100"
            >
              {viewLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            {/* Contextual secondary CTA — one of: live demo, source code,
                or "want something similar" WhatsApp deeplink. Falls back
                gracefully when neither live nor github exists. */}
            <a
              href={contextualCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.16] bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/[0.06] hover:text-cyan-100"
            >
              <CtaIcon className="h-4 w-4" />
              {contextualCta.label}
            </a>

            {/* Extra GitHub button when both live and github are available —
                otherwise it's collapsed into the contextual CTA above. */}
            {liveUrl && githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-5 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-white/[0.24] hover:text-white"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            ) : null}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-zinc-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

const ACCENT_BY_SLUG: Record<string, string> = {
  "hermes-agentes": "from-violet-700/30 to-fuchsia-600/20",
  archscene: "from-amber-600/25 to-orange-700/15",
  "openclaw-gateway": "from-indigo-700/30 to-cyan-500/20",
  nexpanel: "from-blue-700/25 to-indigo-600/20",
  "vultrix-3d": "from-cyan-700/25 to-blue-600/20",
  stopultimate: "from-emerald-700/30 to-amber-700/20",
};

const METRIC_TEXT: Record<string, string> = {
  purple: "text-purple-300",
  cyan: "text-cyan-300",
  green: "text-emerald-300",
  pink: "text-pink-300",
};

function FallbackArtwork({ slug }: { slug: string }) {
  const lines = FALLBACK_LINES[slug] ?? [
    { type: "cmd", text: `$ ${slug} status` },
    { type: "ok", text: "workflows ok" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-10">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-black/80 p-5 font-mono text-xs shadow-2xl backdrop-blur">
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[10px] text-zinc-600">{slug}/run</span>
        </div>
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "cmd"
                ? "mt-1 text-cyan-300"
                : line.type === "ok"
                  ? "mt-1 text-emerald-300"
                  : line.type === "warn"
                    ? "mt-1 text-amber-300"
                    : "mt-1 text-zinc-400"
            }
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

const FALLBACK_LINES: Record<string, Array<{ type: "cmd" | "ok" | "warn" | "info"; text: string }>> = {
  "hermes-agentes": [
    { type: "cmd", text: "$ hermes kanban stats" },
    { type: "ok", text: "done: 261  ready: 1  running: 0" },
    { type: "info", text: "21 profiles | gateway 24/7" },
  ],
  "openclaw-gateway": [
    { type: "cmd", text: "$ openclaw status" },
    { type: "ok", text: "providers: openai · anthropic · ollama" },
    { type: "info", text: "tokens 77.5M · skills 100+" },
  ],
};

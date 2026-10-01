"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ExternalLink, Github, MessageCircle } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { FLAGSHIP_SLUGS } from "@/data/flagships";
import { getProductPresentation } from "@/data/product-presentation";
import { COMPANY } from "@/data/company";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";
import { useTranslation } from "@/i18n";
import { btnPrimary, btnSecondary } from "@/components/ui/button-classes";
import { ProductShowcaseMedia } from "@/components/ui/product-showcase-media";
import type { Translations } from "@/i18n/translations/en";
import styles from "./product-showcase.module.css";

/** Product-led, alternating stories. Public snapshots stay visible without JS. */
const showcaseSlugs = [...FLAGSHIP_SLUGS];

export function Showcase() {
  const { t, locale } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const featured = showcaseSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((project): project is Project => Boolean(project));

  useEffect(() => {
    if (!sectionRef.current) return;
    // matchMedia reverts the animations when width or motion preference changes.
    const motion = gsap.matchMedia();
    motion.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils.toArray<HTMLElement>(".showcase-item", sectionRef.current).forEach((item) => {
          const media = item.querySelector(".showcase-image");
          const content = item.querySelector(".showcase-content");
          if (!media || !content) return;
          gsap.fromTo(media, { yPercent: 3 }, {
            yPercent: -3,
            ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 },
          });
          // No opacity or scale animation on the screenshots themselves.
          gsap.from(content.children, {
            y: 18, duration: 0.7, ease: "power2.out", stagger: 0.05,
            scrollTrigger: { trigger: item, start: "top 80%", once: true },
          });
        });
      },
      sectionRef
    );
    return () => motion.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/80">{t.work.label}</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{t.work.title}</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">{t.work.subtitle}</p>
        <nav aria-label={locale === "pt" ? "Acesso direto aos projetos" : "Jump to a project"} className={styles.projectIndex}>
          {featured.map((project, index) => {
            const presentation = getProductPresentation(project.slug, locale);
            const image = presentation.images[0];
            return <a key={project.slug} href={`#project-${project.slug}`} className={styles.projectLink}>
              <div className={styles.projectPreview}>{image ? <Image src={image.src} alt="" width={image.width} height={image.height} sizes="(max-width: 767px) 45vw, 280px" className={styles.projectThumbnail} /> : null}</div>
              <div className={styles.projectName}><span className={styles.projectNumber}>{String(index + 1).padStart(2,"0")}</span><span>{project.title}</span><ArrowUpRight size={16} aria-hidden="true" /></div>
              <p className={styles.projectTagline}>{presentation.tagline}</p>
            </a>;
          })}
        </nav>
      </div>
      {featured.map((project, i) => (
        <ShowcaseItem key={project.slug} project={project} index={i + 1} total={featured.length}
          alignRight={i % 2 === 1} locale={locale} viewLabel={t.work.viewCase} t={t} />
      ))}
    </section>
  );
}

function ShowcaseItem({ project, index, total, alignRight, locale, viewLabel, t }: {
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
  const presentation = getProductPresentation(project.slug, locale);

  // Contextual secondary CTA: prefer live demo, fall back to source code,
  // otherwise route to WhatsApp with a pre-filled "I want something similar".
  const contextualCta = (() => {
    if (liveUrl) {
      return {
        label: project.slug === "urlpivot" ? (locale === "pt" ? "Conhecer URLPivot" : "Explore URLPivot") : t.work.hoverCtaLive,
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
      href: `${COMPANY.whatsappUrl}?text=${encodeURIComponent(message)}`,
      icon: MessageCircle,
    };
  })();

  const CtaIcon = contextualCta.icon;

  return (
    <article id={`project-${project.slug}`} data-product={project.slug} data-align-right={alignRight}
      className="showcase-item relative scroll-mt-24 border-t border-white/[0.05]">
      <div className={styles.story}>
        <div className={`showcase-image ${styles.media}`}>
          <ProductShowcaseMedia key={`${project.slug}-${locale}`} slug={project.slug} title={project.title}
            images={presentation.images} tagline={presentation.tagline} accent={presentation.accent}
            locale={locale} priority={index === 1} />
        </div>

        <div className={`showcase-content ${styles.content} flex flex-col justify-center`}>
          <div className="showcase-index flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-400">
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
          {project.slug === "urlpivot" ? <p className="mt-3 text-sm leading-6 text-zinc-400">{locale === "pt" ? "Também acessível por agentes via MCP, com permissões limitadas ao workspace." : "Also available to agents via MCP, with workspace-scoped permissions."}</p> : null}

          <details className={styles.context}>
            <summary>{t.work.hoverProblem} / {t.work.hoverDelivery}</summary>
            <dl>
              <dt>{t.work.hoverProblem}</dt>
              <dd>{project.problem[locale]}</dd>
              <dt>{t.work.hoverDelivery}</dt>
              <dd>{project.solution[locale]}</dd>
            </dl>
          </details>

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
                <div className="mt-1 text-xs leading-4 text-zinc-400">
                  {metric.label[locale]}
                </div>
              </div>
            ))}
          </div>

          <a href={`${COMPANY.whatsappUrl}?text=${encodeURIComponent(t.work.likeWhatsappTemplate.replace("{project}", project.title))}`}
            target="_blank" rel="noopener noreferrer" data-analytics-event="lead-cta-click" data-cta="project-build-similar" data-project={project.slug} data-offer="diagnosis-first-milestone"
            className={styles.buildCta}>
            {locale === "pt" ? "Quero construir algo assim" : "Let's build something like this"}<ArrowUpRight size={16} aria-hidden="true" />
          </a>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className={btnPrimary}
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
              className={btnSecondary}
            >
              <CtaIcon className="h-4 w-4" />
              {contextualCta.label}
            </a>

            {project.slug === "urlpivot" ? (
              <a
                href="https://urlpivot.app/p/urlpivot"
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary}
              >
                <ExternalLink className="h-4 w-4" />
                {locale === "pt" ? "Ver Page oficial" : "View official Page"}
              </a>
            ) : null}

            {/* Extra GitHub button when both live and github are available —
                otherwise it's collapsed into the contextual CTA above. */}
            {liveUrl && githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary}
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

const METRIC_TEXT: Record<string, string> = {
  purple: "text-purple-300",
  cyan: "text-cyan-300",
  green: "text-emerald-300",
  pink: "text-pink-300",
};

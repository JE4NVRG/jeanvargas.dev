"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FLAGSHIP_SLUGS } from "@/data/flagships";
import { projects } from "@/data/projects";
import { useTranslation } from "@/i18n";
import styles from "./studio-motion.module.css";

export function StudioShowcase() {
  const { locale } = useTranslation();
  const featured = FLAGSHIP_SLUGS.flatMap(slug => {
    const project = projects.find(item => item.slug === slug);
    return project ? [project] : [];
  });

  return (
    <section id="work" className={`${styles.work} ${styles.section}`} aria-labelledby="studio-work-title">
      <div className={styles.shell}>
        <div className={styles.workHeader} data-studio-reveal>
          <div>
            <p className={styles.eyebrow}>{locale === "pt" ? "Projetos em destaque" : "Selected work"}</p>
            <h2 id="studio-work-title" className={styles.sectionTitle}>
              {locale === "pt" ? <>Ideias que viraram<br />produtos de verdade.</> : <>Ideas turned into<br />real products.</>}
            </h2>
          </div>
          <nav className={styles.projectNav} aria-label={locale === "pt" ? "Acesso direto aos projetos" : "Jump to a project"}>
            {featured.map(project => <a key={project.slug} href={`#project-${project.slug}`}>{project.title}<ArrowUpRight size={14} aria-hidden="true" /></a>)}
          </nav>
        </div>
        {featured.map((project, index) => {
          const artwork = project.image ?? project.coverImage;
          return (
            <article id={`project-${project.slug}`} key={project.slug} data-product={project.slug} className={styles.project}>
              <Link href={`/${locale}/projects/${project.slug}`} className={styles.projectImageLink} aria-label={`${locale === "pt" ? "Ver case" : "View case"}: ${project.title}`}>
                <div className={styles.projectVisual} data-studio-reveal>
                  <div className={styles.productFrame}>
                    {artwork ? <Image src={artwork} alt={`${project.title}: ${project.assetReview.note[locale]}`} fill className={styles.productImage} sizes="(max-width: 768px) 92vw, 80vw" /> : null}
                  </div>
                </div>
                <span className={styles.imageOpen} aria-hidden="true"><ArrowUpRight size={22} /></span>
              </Link>
              <div className={styles.projectInfo} data-studio-reveal>
                <div>
                  <p className={styles.projectMeta}><span className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</span>{project.category}</p>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                </div>
                <div>
                  <p className={styles.projectSummary}>{project.description[locale]}</p>
                  {project.slug === "mepmail" ? <p className={styles.proofNote}>{locale === "pt" ? "API, SMTP e MCP. Infraestrutura de e-mail mantida e operada pela JE4NDEV." : "API, SMTP and MCP. Email infrastructure maintained and operated by JE4NDEV."}</p> : null}
                  {project.slug === "urlpivot" ? <p className={styles.proofNote}>{locale === "pt" ? "Também acessível por agentes via MCP, com permissões limitadas ao workspace." : "Also available to agents via MCP, with workspace-scoped permissions."}</p> : null}
                  <div className={styles.projectLinks}>
                    <Link href={`/${locale}/projects/${project.slug}`} className={styles.textLink}>{locale === "pt" ? "Ver o case" : "View the case"}<ArrowUpRight size={16} aria-hidden="true" /></Link>
                    {project.links.live ? <a href={project.links.live} target="_blank" rel="noopener noreferrer" className={styles.textLink}>{locale === "pt" ? "Conhecer o produto" : "Explore the product"}<ArrowUpRight size={16} aria-hidden="true" /></a> : null}
                    {project.slug === "urlpivot" ? <a href="https://urlpivot.app/p/urlpivot" target="_blank" rel="noopener noreferrer" className={styles.textLink}>{locale === "pt" ? "Ver Page oficial" : "View official Page"}<ArrowUpRight size={16} aria-hidden="true" /></a> : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

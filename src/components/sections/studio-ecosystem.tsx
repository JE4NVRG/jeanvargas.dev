"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { FLAGSHIP_SLUGS } from "@/data/flagships";
import { useTranslation } from "@/i18n";
import { StudioReel } from "@/components/ui/studio-reel";
import styles from "./studio-motion.module.css";

const disciplines = {
  mepmail: { pt: "Do produto ao envio: e-mail, integrações e ferramentas para agentes.", en: "From product to delivery: email, integrations and agent tooling." },
  archscene: { pt: "Da cena ao render: fluxo de IA, revisão e releases públicos.", en: "From scene to render: AI workflow, review and public releases." },
  fullcommerce360: { pt: "Da pesquisa à operação: integrações e aprovação humana.", en: "From research to operations: integrations and human approval." },
  urlpivot: { pt: "Da campanha à evolução: links, QR e Pages que continuam úteis.", en: "From campaign to evolution: links, QR codes and Pages that stay useful." },
} as const;

export function StudioEcosystem() {
  const { locale } = useTranslation();
  const featured = FLAGSHIP_SLUGS.flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [{ project, discipline: disciplines[slug] }] : [];
  });
  const related = ["nexpanel", "vultrix-3d", "hermes-agentes"].flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [project] : [];
  });

  return (
    <section id="parceiros" className={`${styles.ecosystem} ${styles.section}`} aria-labelledby="ecosystem-title">
      <div className={styles.shell}>
        <div className={styles.sectionHeading} data-studio-reveal>
          <div>
            <p className={styles.eyebrow}>{locale === "pt" ? "Um ecossistema em construção" : "An ecosystem in the making"}</p>
            <h2 id="ecosystem-title" className={`${styles.sectionTitle} ${styles.ecosystemTitle}`}>
              {locale === "pt" ? <>Crescer é construir.<br /><em>E continuar cuidando.</em></> : <>Growth means building.<br /><em>And staying with it.</em></>}
            </h2>
          </div>
          <p className={styles.sectionIntro}>
            {locale === "pt"
              ? "A JE4NDEV cresce criando e operando produtos reais. Cada integração, revisão e melhoria amplia o repertório que levamos ao próximo projeto — inclusive o seu."
              : "JE4NDEV grows by building and operating real products. Every integration, review and improvement deepens the experience we bring to the next project — including yours."}
          </p>
        </div>
        <ol className={styles.ecosystemList}>
          {featured.map(({ project, discipline }, index) => (
            <li key={project.slug} className={styles.ecosystemRow} data-studio-reveal>
              <span className={styles.ecosystemIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{project.title}</h3>
              <p>{discipline[locale]}</p>
              {project.links.live ? <a href={project.links.live} target="_blank" rel="noopener noreferrer" className={styles.textLink} aria-label={`${locale === "pt" ? "Abrir" : "Open"} ${project.title}`}>
                {new URL(project.links.live).hostname}<ArrowUpRight size={16} aria-hidden="true" />
              </a> : <Link href={`/${locale}/projects/${project.slug}`} className={styles.textLink}>{locale === "pt" ? "Conhecer projeto" : "Explore project"}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
            </li>
          ))}
        </ol>
        <div className={styles.ecosystemFooter}>
          <span>{locale === "pt" ? "Outras frentes do repertório:" : "Other areas of our work:"}</span>
          {related.map((project) => <Link key={project.slug} href={`/${locale}/projects/${project.slug}`} className={styles.textLink}>{project.title}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}
        </div>
        <StudioReel locale={locale} />
      </div>
    </section>
  );
}

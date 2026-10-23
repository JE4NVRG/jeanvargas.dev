"use client";

import Link from "next/link";
import { useMemo } from "react";
import { projects } from "@/data/projects";
import { useTranslation } from "@/i18n";
import styles from "./capabilities.module.css";

const serviceSlug = {
  web: { pt: "criacao-de-sites", en: "business-websites" },
  saas: { pt: "desenvolvimento-saas", en: "saas-development" },
  agents: { pt: "agentes-ia-privados", en: "private-ai-agents" },
} as const;

const proofSlugs = {
  web: [] as string[],
  mobile: ["mepchat"],
  saas: ["nexpanel", "archscene", "fullcommerce360", "urlpivot"],
  agents: ["hermes-agentes", "openclaw-gateway", "nora", "mepmail", "urlpivot"],
  email: ["mepmail"],
} as const;

export function Capabilities() {
  const { t, locale } = useTranslation();
  const technologies = useMemo(
    () => [...new Set(projects.flatMap((project) => project.technologies))].sort((a, b) => a.localeCompare(b)),
    [],
  );
  const copy = t.capabilities;
  const groups = [
    { id: "web" as const, title: copy.webTitle, body: copy.webBody },
    { id: "mobile" as const, title: copy.mobileTitle, body: copy.mobileBody },
    { id: "saas" as const, title: copy.saasTitle, body: copy.saasBody },
    { id: "agents" as const, title: copy.agentsTitle, body: copy.agentsBody },
    { id: "email" as const, title: copy.emailTitle, body: copy.emailBody },
  ];

  return (
    <section id="capabilities" className={styles.section} aria-labelledby="capabilities-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.label}</p>
        <h2 id="capabilities-heading">{copy.title}</h2>
        <p className={styles.intro}>{copy.subtitle}</p>
        <div className={styles.grid}>
          {groups.map((group, index) => {
            const service = group.id === "web" || group.id === "saas" || group.id === "agents" ? serviceSlug[group.id] : null;
            return (
              <article key={group.id} className={styles.card} data-capability={group.id}>
                <div className={styles.cardTop}>
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.mark} aria-hidden="true" />
                </div>
                <h3>{group.title}</h3>
                <p>{group.body}</p>
                <div className={styles.links}>
                  {service ? (
                    <Link href={`/${locale}/services/${service[locale]}`}>{group.title}</Link>
                  ) : null}
                  {proofSlugs[group.id].map((slug) => {
                    const project = projects.find((item) => item.slug === slug);
                    if (!project) return null;
                    return (
                      <Link key={slug} href={`/${locale}/projects/${slug}`}>
                        {project.title}
                      </Link>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
        <div className={styles.stack}>
          <p>{copy.stackLabel}</p>
          <ul>
            {technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

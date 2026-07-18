"use client";

import { BookOpen, ExternalLink, Github, MessageCircle } from "lucide-react";
import type { Project } from "@/types/project";

const WHATSAPP_BASE = "https://wa.me/5511948477047";

type LinkLabels = {
  live: string;
  github: string;
  docs: string;
  contact: string;
};

interface ProjectLinksProps {
  project: Project;
  labels: LinkLabels;
  compact?: boolean;
}

function getContactUrl(project: Project) {
  const message = `Oi Jean, quero conversar sobre um sistema parecido com ${project.title}.`;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

export function getPrimaryProjectUrl(project: Project) {
  if (project.primaryCta === "live") return project.links.live;
  if (project.primaryCta === "github") return project.links.github;
  if (project.primaryCta === "docs") return project.links.docs;
  if (project.primaryCta === "contact") return getContactUrl(project);
  return undefined;
}

export function ProjectLinks({ project, labels, compact = false }: ProjectLinksProps) {
  const primaryUrl = getPrimaryProjectUrl(project);
  const primaryLabel =
    project.primaryCta === "live"
      ? labels.live
      : project.primaryCta === "github"
        ? labels.github
        : project.primaryCta === "docs"
          ? labels.docs
          : labels.contact;

  const primaryIcon =
    project.primaryCta === "github" ? Github : project.primaryCta === "docs" ? BookOpen : project.primaryCta === "contact" ? MessageCircle : ExternalLink;

  const links = [
    project.links.live && project.primaryCta !== "live"
      ? { key: "live", href: project.links.live, label: labels.live, icon: ExternalLink }
      : null,
    project.links.github && project.primaryCta !== "github"
      ? { key: "github", href: project.links.github, label: labels.github, icon: Github }
      : null,
    project.links.docs && project.primaryCta !== "docs"
      ? { key: "docs", href: project.links.docs, label: labels.docs, icon: BookOpen }
      : null,
  ].filter(Boolean) as Array<{ key: string; href: string; label: string; icon: typeof ExternalLink }>;

  const padding = compact ? "px-4 py-2.5 text-xs" : "px-5 py-3 text-sm";

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
      {primaryUrl ? (
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="project-primary-cta"
          data-project={project.slug}
          data-cta={project.primaryCta}
          className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-cyan-100 hover:shadow-[0_16px_40px_-20px_rgba(94,234,212,0.9)] ${padding}`}
        >
          {(() => {
            const Icon = primaryIcon;
            return <Icon className="h-4 w-4" />;
          })()}
          {primaryLabel}
        </a>
      ) : null}

      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="project-secondary-cta"
            data-project={project.slug}
            data-cta={link.key}
            className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] font-medium text-zinc-300 transition-all hover:-translate-y-0.5 hover:border-cyan-300/30 hover:text-white ${padding}`}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}

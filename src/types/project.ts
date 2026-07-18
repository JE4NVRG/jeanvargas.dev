/**
 * Project Presentation System — V2 (per docs/specs/2026-06-03-project-presentation-system.md)
 *
 * Evolução do schema para suportar hub vivo com muitos projetos:
 * - Prova real (proofLevel + visualKind)
 * - Links expandidos + primaryCta
 * - Role/audience para targeting
 * - Tags flexíveis + casePriority para ordenação no hub
 * - shortDescription para cards (narrativa curta)
 * - Separação clara capa editorial vs prova real
 *
 * Durante Fase 1: todos os 12 projetos serão curados com os novos campos obrigatórios.
 * UI components (universe, case-study, showcase) continuarão lendo campos existentes até Fase 2/3.
 */

export type ProjectStatus = "live" | "mvp" | "development" | "case" | "internal" | "demo";

export type ProofLevel = "public-live" | "public-demo" | "private-demo" | "internal" | "case-only";

export type VisualKind =
  | "product-screenshot"
  | "ai-render"
  | "dashboard"
  | "terminal"
  | "video-demo"
  | "mixed"
  | "branding"
  | "github-repo";

export type ProjectRole =
  | "client-saas"
  | "internal-tool"
  | "agency-platform"
  | "open-source"
  | "game-social"
  | "web3-audit"
  | "ai-render";

export type AssetReviewStatus =
  | "approved"
  | "needs-recapture"
  | "private-demo"
  | "editorial-only";

export interface ProjectAssetReview {
  status: AssetReviewStatus;
  /** URL ou ambiente que originou a prova visual. Nunca incluir credenciais. */
  sourceUrl?: string;
  /** Data ISO da última revisão humana do asset. */
  reviewedAt?: string;
  note: { en: string; pt: string };
}

export interface ProjectMetric {
  value: string;
  label: { en: string; pt: string };
  color: string;
  /** Indica que a afirmação foi conferida no produto, repositório ou operação. */
  verified: boolean;
}

export interface ProjectV2 {
  slug: string;
  title: string;
  description: { en: string; pt: string };
  /** Curta para cards/hub (1-2 linhas). Longa fica para o case study. */
  shortDescription: { en: string; pt: string };
  longDescription: { en: string; pt: string };

  status: ProjectStatus;
  role: ProjectRole;
  audience: string[]; // ex: ["founders-pme", "studios-arquitetura", "web3-auditors"]
  proofLevel: ProofLevel;
  visualKind: VisualKind;

  dateRange: string | { en: string; pt: string };
  category: string; // legado para filtros; use tags para o novo hub
  tags: string[]; // flexíveis: "saas", "ai", "web3", "marketplace", "3d"...
  technologies: string[];

  problem: { en: string; pt: string };
  solution: { en: string; pt: string };

  metrics: ProjectMetric[];

  links: {
    live?: string;
    github?: string;
    docs?: string;
    changelog?: string;
    status?: string; // status page / uptime / monitor
  };
  /** Qual ação principal o card/hub deve promover primeiro */
  primaryCta: "live" | "github" | "docs" | "contact" | "none";

  /** Prova real do produto (screenshot, render, etc). Nunca use landing page aqui como principal. */
  image?: string;
  /** Capa editorial (bonita, gradiente/ilustração) para cards e hub. Sempre separada da prova real. */
  coverImage?: string;
  /** Revisão editorial explícita: existência do arquivo não prova que a imagem é válida. */
  assetReview: ProjectAssetReview;
  /** Vídeo de demo (loop muted) */
  video?: string;
  gallery?: Array<{
    src: string;
    title: { en: string; pt: string };
    description: { en: string; pt: string };
  }>;

  gradient?: string; // legado visual
  /** Legado — use casePriority para ordenação no novo hub */
  featured?: boolean;
  /** 1 = prioridade alta para showcase/hub top. Usado para curadoria. */
  casePriority: number;

  scope: { en: string; pt: string };
}

// Durante migração Fase 1 mantemos o nome Project para não quebrar imports existentes.
// Depois das fases de UI (2/3) podemos limpar.
export type Project = ProjectV2;

// Funções utilitárias comuns (serão expandidas no script de audit)
export function getProjectBySlug(projects: Project[], slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(projects: Project[], currentSlug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

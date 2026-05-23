export interface Project {
  slug: string;
  title: string;
  description: { en: string; pt: string };
  longDescription: { en: string; pt: string };
  status: "live" | "mvp" | "development" | "case" | "internal" | "demo";
  scope: { en: string; pt: string };
  /**
   * Localized date range. EN canonical reads "2025 - Present" / "2024",
   * PT canonical reads "Desde 2025" / "2024". Old projects may still ship a
   * plain string for backward compatibility — the case study reader handles
   * both shapes.
   */
  dateRange: string | { en: string; pt: string };
  category: string;
  technologies: string[];
  problem: { en: string; pt: string };
  solution: { en: string; pt: string };
  metrics: Array<{
    value: string;
    label: { en: string; pt: string };
    color: string;
  }>;
  links: {
    live?: string;
    github?: string;
  };
  image?: string;
  /** Looping background video shown instead of `image` in the Showcase card. */
  video?: string;
  gallery?: Array<{
    src: string;
    title: { en: string; pt: string };
    description: { en: string; pt: string };
  }>;
  gradient: string;
  featured: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: { en: string; pt: string };
  longDescription: { en: string; pt: string };
  status: "live" | "mvp" | "development" | "case" | "internal" | "demo";
  scope: { en: string; pt: string };
  dateRange: string;
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
  gallery?: Array<{
    src: string;
    title: { en: string; pt: string };
    description: { en: string; pt: string };
  }>;
  gradient: string;
  featured: boolean;
}

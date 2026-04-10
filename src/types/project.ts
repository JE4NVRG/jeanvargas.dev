export interface Project {
  slug: string;
  title: string;
  description: { en: string; pt: string };
  longDescription: { en: string; pt: string };
  status: "live" | "mvp" | "development";
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
  gradient: string;
  featured: boolean;
}

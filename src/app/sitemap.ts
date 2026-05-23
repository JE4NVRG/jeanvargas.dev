import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const BASE_URL = "https://je4ndev.com";

/**
 * Sitemap dinamico. Next.js serve isto em `/sitemap.xml` em produção,
 * cobre a home + as 12 paginas de projeto. Inclui hreflang pra cada rota
 * (pt-BR canonico + en-US como alternativa via query param).
 *
 * Quando subir uma rota nova (ex: /blog, /changelog), adicionar aqui pra
 * o Google encontrar de cara em vez de depender so de discovery via links.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: `${BASE_URL}/`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: {
        "pt-BR": `${BASE_URL}/`,
        "en-US": `${BASE_URL}/?lang=en`,
        "x-default": `${BASE_URL}/`,
      },
    },
  };

  const projectPages = projects.map<MetadataRoute.Sitemap[number]>((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
    alternates: {
      languages: {
        "pt-BR": `${BASE_URL}/projects/${project.slug}`,
        "en-US": `${BASE_URL}/projects/${project.slug}?lang=en`,
        "x-default": `${BASE_URL}/projects/${project.slug}`,
      },
    },
  }));

  return [home, ...projectPages];
}

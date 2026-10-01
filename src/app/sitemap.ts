import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { serviceOffers } from "@/data/services";
import { GUIDE_SLUG } from "@/data/guides";

const BASE_URL = "https://je4ndev.com";
const LOCALES = ["pt", "en"] as const;

/**
 * Sitemap dinamico — agora com rotas SSR localizadas em /pt e /en.
 *
 * As rotas são derivadas dos catálogos de projetos e serviços nos dois idiomas.
 *
 * Por que /en eh x-default: search engines usam x-default como fallback
 * quando o Accept-Language do crawler nao bate com nenhum hreflang. Como
 * a gente quer presenca global maxima, /en e o caminho mais seguro.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntries = LOCALES.map<MetadataRoute.Sitemap[number]>((locale) => ({
    url: `${BASE_URL}/${locale}`,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: {
        "pt-BR": `${BASE_URL}/pt`,
        "en-US": `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/en`,
      },
    },
  }));

  const projectEntries = LOCALES.flatMap((locale) =>
    projects.map<MetadataRoute.Sitemap[number]>((project) => ({
      url: `${BASE_URL}/${locale}/projects/${project.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "pt-BR": `${BASE_URL}/pt/projects/${project.slug}`,
          "en-US": `${BASE_URL}/en/projects/${project.slug}`,
          "x-default": `${BASE_URL}/en/projects/${project.slug}`,
        },
      },
    }))
  );

  const serviceEntries = serviceOffers.flatMap((offer) =>
    LOCALES.map<MetadataRoute.Sitemap[number]>((locale) => ({
      url: `${BASE_URL}/${locale}/services/${offer.slugs[locale]}`,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "pt-BR": `${BASE_URL}/pt/services/${offer.slugs.pt}`,
          "en-US": `${BASE_URL}/en/services/${offer.slugs.en}`,
          "x-default": `${BASE_URL}/en/services/${offer.slugs.en}`,
        },
      },
    }))
  );

  const legalEntries = (["termos", "privacidade"] as const).flatMap((path) =>
    LOCALES.map<MetadataRoute.Sitemap[number]>((locale) => ({
      url: `${BASE_URL}/${locale}/${path}`,
      changeFrequency: "yearly",
      priority: 0.4,
      alternates: {
        languages: {
          "pt-BR": `${BASE_URL}/pt/${path}`,
          "en-US": `${BASE_URL}/en/${path}`,
          "x-default": `${BASE_URL}/pt/${path}`,
        },
      },
    })),
  );

  const guideEntries = LOCALES.flatMap((locale) =>
    ["guides", `guides/${GUIDE_SLUG}`].map<MetadataRoute.Sitemap[number]>((route) => ({
      url: `${BASE_URL}/${locale}/${route}`,
      alternates: {
        languages: {
          "pt-BR": `${BASE_URL}/pt/${route}`,
          "en-US": `${BASE_URL}/en/${route}`,
          "x-default": `${BASE_URL}/en/${route}`,
        },
      },
    }))
  );

  return [...homeEntries, ...serviceEntries, ...projectEntries, ...guideEntries, ...legalEntries];
}

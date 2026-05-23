import type { MetadataRoute } from "next";

/**
 * robots.txt dinamico. Next.js serve isto em `/robots.txt`.
 *
 * Politica: liberar tudo pra crawlers, bloquear apenas `/api/*` (server
 * actions / endpoints) e apontar pro sitemap.xml gerado pelo sitemap.ts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://je4ndev.com/sitemap.xml",
    host: "https://je4ndev.com",
  };
}

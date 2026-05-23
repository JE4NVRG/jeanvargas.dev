import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  /**
   * Permanent 301 redirects from the old non-localized URLs to the
   * default-locale (`/en`) ones. This preserves the SEO juice Google has
   * already accumulated on `/projects/[slug]` — those 11 URLs we submitted
   * manually today were already in the priority crawl queue. Without the
   * redirect, Googlebot would see 404 and drop them from the index.
   *
   * The default destination is `/en` because:
   *   - `/en` is the global x-default in our sitemap;
   *   - Brazilians who land via redirect can use the PT|EN toggle in the
   *     navbar (which sets the NEXT_LOCALE cookie and pushes them to /pt).
   *   - Middleware-based geo-redirect cannot be applied to `next.config`
   *     redirects (they're static path → path rules, no header inspection).
   *
   * For the bare home `/` we let the middleware handle it (geo-aware),
   * so we don't add a redirect rule for `/` here.
   */
  async redirects() {
    return [
      {
        source: "/projects/:slug",
        destination: "/en/projects/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

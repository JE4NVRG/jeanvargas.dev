import { NextResponse, type NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const DEFAULT_LOCALE = "en"; // global-first fallback
const LOCALE_COOKIE = "NEXT_LOCALE";

type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Middleware — i18n routing.
 *
 * Strategy:
 *   1. URL already has a locale prefix (/pt/... or /en/...) → pass through.
 *   2. Static / API / Next.js internals → pass through untouched.
 *   3. Anything else (including bare /) → detect locale from:
 *        a. NEXT_LOCALE cookie (user already toggled before)
 *        b. Accept-Language header (browser preference)
 *        c. DEFAULT_LOCALE fallback (en)
 *      → redirect to /{locale}{originalPath}.
 *
 * Why redirect (not rewrite): we want the URL bar to show /pt or /en so the
 * user (and Google/Bing crawlers) sees a real localized URL with hreflang
 * partners. Rewriting would keep /, which defeats the purpose of separate
 * indexable pages per locale.
 *
 * Cookie persistence: when the user clicks the PT|EN toggle, the client
 * sets NEXT_LOCALE to their choice. Next time they hit / directly, the
 * cookie wins over Accept-Language.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip any path that already starts with a known locale segment.
  if (SUPPORTED_LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  // Resolve target locale.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const headerLocale = parseAcceptLanguage(request.headers.get("accept-language"));
  const locale: Locale =
    (isSupported(cookieLocale) && cookieLocale) ||
    (isSupported(headerLocale) && headerLocale) ||
    DEFAULT_LOCALE;

  // Build redirect URL preserving search params + trailing path.
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

function parseAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  // Accept-Language is comma-separated, ranked by q-value implicitly by order.
  // First match wins. We check the language root (pt-BR → pt) so all
  // Portuguese variants land in /pt.
  const entries = header.split(",").map((s) => s.trim().split(";")[0]);
  for (const entry of entries) {
    const root = entry.toLowerCase().split("-")[0];
    if (isSupported(root)) return root as Locale;
  }
  return null;
}

function isSupported(value: string | undefined | null): value is Locale {
  return value != null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Limit middleware execution to actual page routes. Skip:
 *   - /api/* (server actions / endpoints — never localized)
 *   - /_next/* (chunks, images, etc.)
 *   - /static assets at the root (favicon, og-image, manifest, robots, sitemap)
 *   - anything with a file extension (.png, .jpg, .svg, .xml, .txt, etc.)
 */
export const config = {
  matcher: [
    "/((?!api|_next|robots\\.txt|sitemap\\.xml|favicon\\.ico|favicon-16x16\\.png|favicon-32x32\\.png|apple-touch-icon\\.png|brand-icon\\.svg|og-image\\.png|site\\.webmanifest|icon\\.svg|images|projects|videos|brand|portfolio-refresh).*)",
  ],
};

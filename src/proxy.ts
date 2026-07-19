import { NextResponse, type NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE = "NEXT_LOCALE";

type Locale = (typeof SUPPORTED_LOCALES)[number];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    SUPPORTED_LOCALES.some(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    )
  ) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const headerLocale = parseAcceptLanguage(request.headers.get("accept-language"));
  const locale: Locale =
    (isSupported(cookieLocale) && cookieLocale) ||
    (isSupported(headerLocale) && headerLocale) ||
    DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

function parseAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;

  const entries = header.split(",").map((entry) => entry.trim().split(";")[0]);
  for (const entry of entries) {
    const root = entry.toLowerCase().split("-")[0];
    if (isSupported(root)) return root;
  }

  return null;
}

function isSupported(value: string | undefined | null): value is Locale {
  return value != null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export const config = {
  matcher: [
    "/((?!api|_next|robots\\.txt|sitemap\\.xml|favicon\\.ico|favicon-16x16\\.png|favicon-32x32\\.png|apple-touch-icon\\.png|brand-icon\\.svg|je4ndev-logo\\.svg|og-image\\.png|site\\.webmanifest|icon\\.svg|images|projects|videos|brand).*)",
  ],
};

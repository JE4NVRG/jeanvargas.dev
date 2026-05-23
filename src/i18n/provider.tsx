"use client";

import {
  createContext,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { en } from "./translations/en";
import { pt } from "./translations/pt";
import type { Translations } from "./translations/en";

export type Locale = "en" | "pt";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  locale: "pt",
  t: pt as unknown as Translations,
  toggleLocale: () => {},
});

const translations = { en, pt } as unknown as Record<Locale, Translations>;

/**
 * LanguageProvider — receives the canonical locale from the URL segment
 * (pre-rendered by the server) and exposes a toggle that switches by
 * REPLACING the locale prefix in the pathname and pushing the new URL.
 *
 * This is the SEO-correct setup: every URL is locale-specific, server-rendered
 * in that locale, indexable separately by Google/Bing. The old localStorage
 * approach kept the same URL and switched JS state — which Google never sees,
 * so the EN version was invisible to search engines.
 */
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Persist user preference in cookie so the middleware respects it on
  // subsequent bare visits to "/".
  useEffect(() => {
    try {
      // 1 year expiry, root path, SameSite=Lax so same-site nav reads it back.
      document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      /* cookie write may fail in private mode — locale still works for current session */
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    const next: Locale = locale === "en" ? "pt" : "en";
    // Replace the leading /pt or /en segment with the new one.
    const nextPath = pathname.replace(/^\/(pt|en)(?=$|\/)/, `/${next}`);
    router.push(nextPath || `/${next}`);
  }, [locale, pathname, router]);

  return (
    <LanguageContext.Provider
      value={{ locale, t: translations[locale], toggleLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

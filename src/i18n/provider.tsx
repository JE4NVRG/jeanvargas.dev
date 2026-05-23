"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { en } from "./translations/en";
import { pt } from "./translations/pt";
import type { Translations } from "./translations/en";

type Locale = "en" | "pt";

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

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "pt";
}

function syncDocumentLang(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
}

/**
 * LanguageProvider — deterministic SSR render in `pt`, locale stored client-side
 * read only inside `useEffect` after mount. This avoids the hydration mismatch
 * caused by reading `localStorage` during initial state init (the server has no
 * `window`, the client may have a different stored value).
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("locale");
      if (isLocale(stored)) {
        setLocale(stored);
        syncDocumentLang(stored);
        return;
      }
    } catch {
      // localStorage might be unavailable (Safari private mode, etc) — fall back to pt
    }
    syncDocumentLang("pt");
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "en" ? "pt" : "en";
      try {
        localStorage.setItem("locale", next);
      } catch {
        /* ignore storage errors */
      }
      syncDocumentLang(next);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale, t: translations[locale], toggleLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

"use client";

import { createContext, useCallback, useState, type ReactNode } from "react";
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

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  const stored = localStorage.getItem("locale");
  if (stored === "en" || stored === "pt") return stored;
  return "pt";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "en" ? "pt" : "en";
      localStorage.setItem("locale", next);
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

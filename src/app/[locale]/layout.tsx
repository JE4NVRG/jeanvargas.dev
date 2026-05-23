import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider, type Locale } from "@/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { LenisProvider } from "@/components/ui/lenis-provider";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const SITE_URL = "https://je4ndev.com";

type RouteParams = Promise<{ locale: string }>;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/**
 * Per-locale metadata. Each /pt and /en page gets its own canonical, OG
 * locale, and hreflang annotations — telling Google "this URL is the
 * Portuguese version, here's the English equivalent" and vice versa.
 *
 * The actual page-level title/description for the home and case studies
 * gets overridden by their own generateMetadata. This layout's metadata
 * is the base / fallback that propagates to nested routes.
 */
export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) return {};

  const isEn = locale === "en";

  return {
    title: isEn
      ? "JE4NDEV — Product agency · SaaS, AI automations & local agents"
      : "JE4NDEV — Agência de produto · SaaS, automações com IA e agentes locais",
    description: isEn
      ? "Founder-led product agency. We build SaaS, AI automations, integrations, local agents (Hermes/OpenClaw on your VPS), Solidity audits and Web3 platforms. Real-time Vercel preview, 1-year warranty. Starts at US$ 100."
      : "Agência de produto comandada por founder. Criamos SaaS, automações com IA, integrações, agentes locais (Hermes/OpenClaw na sua VPS), auditoria Solidity e plataformas Web3. Acompanhamento em tempo real via Vercel preview, garantia de 1 ano. A partir de R$ 500 / US$ 100.",
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        "pt-BR": `${SITE_URL}/pt`,
        "en-US": `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      locale: isEn ? "en_US" : "pt_BR",
      alternateLocale: isEn ? ["pt_BR"] : ["en_US"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: RouteParams;
}) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) notFound();

  return (
    <LanguageProvider locale={locale as Locale}>
      <LenisProvider>
        <CursorGlow />
        <Navbar />
        {children}
        <Footer />
      </LenisProvider>
    </LanguageProvider>
  );
}

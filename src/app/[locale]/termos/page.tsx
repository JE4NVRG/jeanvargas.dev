import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { getLegalDocument } from "@/data/legal";
import type { Locale } from "@/i18n";

const SITE_URL = "https://je4ndev.com";
const SUPPORTED_LOCALES = ["pt", "en"] as const;

interface Props {
  params: Promise<{ locale: Locale }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) return {};
  const doc = getLegalDocument("termos", locale);
  const canonical = `${SITE_URL}/${locale}/termos`;
  return {
    title: `${doc.title} · JE4NDEV`,
    description: doc.description,
    alternates: {
      canonical,
      languages: {
        "pt-BR": `${SITE_URL}/pt/termos`,
        "en-US": `${SITE_URL}/en/termos`,
        "x-default": `${SITE_URL}/pt/termos`,
      },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale)) notFound();
  return <LegalDocumentPage locale={locale} slug="termos" />;
}

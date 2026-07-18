import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { LanguageProvider, type Locale } from "@/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { LenisProvider } from "@/components/ui/lenis-provider";
import { PortfolioAnalytics } from "@/components/analytics/portfolio-analytics";
import "../globals.css";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const SITE_URL = "https://je4ndev.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type RouteParams = Promise<{ locale: string }>;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) return {};

  const isEn = locale === "en";
  const canonical = `${SITE_URL}/${locale}`;
  const title = isEn
    ? "JE4NDEV — Product engineering · SaaS, AI automation and agents"
    : "JE4NDEV — Engenharia de produto · SaaS, automação com IA e agentes";
  const description = isEn
    ? "Founder-led product engineering for SaaS, AI automation, integrations, local agents, Solidity audits and Web3 platforms."
    : "Engenharia de produto liderada pelo founder para SaaS, automações com IA, integrações, agentes locais, auditoria Solidity e plataformas Web3.";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "product engineering",
      "SaaS",
      "AI automation",
      "agentes de IA",
      "Hermes",
      "OpenClaw",
      "Next.js",
      "TypeScript",
      "Supabase",
      "Solidity",
      "JE4NDEV",
    ],
    authors: [{ name: "Jean Carlos Vargas" }],
    creator: "JE4NDEV",
    publisher: "JE4NDEV",
    alternates: {
      canonical,
      languages: {
        "pt-BR": `${SITE_URL}/pt`,
        "en-US": `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    icons: {
      icon: [
        { url: "/brand-icon.svg", sizes: "any", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "JE4NDEV",
      type: "website",
      locale: isEn ? "en_US" : "pt_BR",
      alternateLocale: isEn ? ["pt_BR"] : ["en_US"],
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "JE4NDEV — Product engineering portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
      creator: "@je4ndev",
      site: "@je4ndev",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "technology",
  };
}

function buildStructuredData(locale: Locale) {
  const isEn = locale === "en";

  return [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${SITE_URL}/#organization`,
      name: "JE4NDEV",
      url: SITE_URL,
      email: "jean@je4ndev.com",
      telephone: "+55-11-94847-7047",
      image: `${SITE_URL}/og-image.png`,
      description: isEn
        ? "Founder-led product engineering for SaaS, AI automation and agent systems."
        : "Engenharia de produto liderada pelo founder para SaaS, automação com IA e sistemas de agentes.",
      founder: { "@id": `${SITE_URL}/#person` },
      sameAs: [
        "https://github.com/JE4NVRG",
        "https://www.linkedin.com/in/je4ndev/",
      ],
      areaServed: ["BR", "Worldwide"],
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Jean Carlos Vargas",
      jobTitle: "Founder and Product Engineer",
      url: SITE_URL,
      image: `${SITE_URL}/images/jean-about.png`,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: [
        "https://github.com/JE4NVRG",
        "https://www.linkedin.com/in/je4ndev/",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "JE4NDEV",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: isEn ? "en" : "pt-BR",
    },
  ];
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

  const activeLocale = locale as Locale;

  return (
    <html
      lang={activeLocale === "pt" ? "pt-BR" : "en"}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStructuredData(activeLocale)) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#050505] font-sans text-white antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider locale={activeLocale}>
          <LenisProvider>
            <PortfolioAnalytics locale={activeLocale} />
            <CursorGlow />
            <Navbar />
            {children}
            <Footer />
          </LenisProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

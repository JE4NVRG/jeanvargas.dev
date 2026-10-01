import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { LanguageProvider, type Locale } from "@/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PortfolioAnalytics } from "@/components/analytics/portfolio-analytics";
import { UmamiAnalytics } from "@/components/analytics/umami-analytics";
import { PortfolioConcierge } from "@/components/concierge/portfolio-concierge";
import { COMPANY } from "@/data/company";
import { serviceOffers } from "@/data/services";
import "../globals.css";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const SITE_URL = "https://je4ndev.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
    ? "JE4NDEV | Websites, systems and personalized AI assistants"
    : "JE4NDEV | Sites, sistemas e assistentes de IA personalizados";
  const description = isEn
    ? "Websites, custom systems, automation and personalized AI assistants for individuals and businesses. Turn your idea into a product or simplify your everyday work."
    : "Sites, sistemas, automações e assistentes de IA personalizados para pessoas físicas e jurídicas. Transforme sua ideia em produto ou simplifique sua rotina.";
  const keywords = isEn
    ? [
        "JE4NDEV",
        "SaaS development",
        "custom software development",
        "internal systems",
        "AI automation",
        "private AI agents",
        "personalized AI assistants",
        "product engineer",
        "full-stack developer Brazil",
      ]
    : [
        "JE4NDEV",
        "desenvolvimento SaaS",
        "sistemas sob medida",
        "automação com IA",
        "agentes de IA privados",
        "assistentes de IA personalizados",
        "engenharia de produto",
        "desenvolvedor full-stack Brasil",
      ];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    authors: [{ name: "JE4NDEV" }],
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
      icon: [{ url: "/brand-icon.svg", type: "image/svg+xml", sizes: "any" }],
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
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
          alt: isEn
            ? "JE4NDEV — websites, systems and personalized AI assistants"
            : "JE4NDEV — sites, sistemas e assistentes de IA personalizados",
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
      alternateName: ["Je4nDev"],
      knowsAbout: isEn
        ? ["Professional websites", "landing pages", "SaaS development", "custom internal systems", "AI automation", "personalized AI assistants"]
        : ["criação de sites", "landing pages", "desenvolvimento SaaS", "sistemas sob medida", "automação com IA", "assistentes de IA personalizados"],
      url: SITE_URL,
      email: "jean@je4ndev.com",
      telephone: COMPANY.whatsappDisplay,
      image: `${SITE_URL}/og-image.png`,
      description: isEn
        ? "Websites, custom systems, automation and personalized AI assistants for individuals and businesses."
        : "Sites, sistemas sob medida, automações e assistentes de IA personalizados para pessoas físicas e jurídicas.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paranavaí",
        addressRegion: "PR",
        addressCountry: "BR",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: isEn ? "Product engineering services" : "Serviços de engenharia de produto",
        itemListElement: serviceOffers.map(offer => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: offer.title[locale],
            description: offer.metaDescription[locale],
            url: `${SITE_URL}/${locale}/services/${offer.slugs[locale]}`,
          },
        })),
      },
      sameAs: ["https://www.linkedin.com/in/je4ndev/"],
      areaServed: ["BR", "Worldwide"],
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
          <PortfolioAnalytics locale={activeLocale} />
          <UmamiAnalytics />
          <Navbar />
          {children}
          <Footer />
          <PortfolioConcierge key={activeLocale} locale={activeLocale} />
        </LanguageProvider>
      </body>
    </html>
  );
}

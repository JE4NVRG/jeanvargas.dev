import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { LanguageProvider, type Locale } from "@/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PortfolioAnalytics } from "@/components/analytics/portfolio-analytics";
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
    ? "Jean Carlos Vargas | JE4NDEV | SaaS, systems and AI automation"
    : "Jean Carlos Vargas | JE4NDEV | SaaS, sistemas e automações com IA";
  const description = isEn
    ? "Jean Carlos Vargas builds SaaS, custom systems, automations and private AI agents, from a navigable first milestone to production."
    : "Jean Carlos Vargas desenvolve SaaS, sistemas sob medida, automações e agentes de IA privados, do primeiro marco navegável à produção.";
  const keywords = isEn
    ? [
        "Jean Carlos Vargas",
        "JE4NDEV",
        "SaaS development",
        "custom software development",
        "internal systems",
        "AI automation",
        "private AI agents",
        "product engineer",
        "full-stack developer Brazil",
      ]
    : [
        "Jean Carlos Vargas",
        "JE4NDEV",
        "desenvolvimento SaaS",
        "sistemas sob medida",
        "automação com IA",
        "agentes de IA privados",
        "engenharia de produto",
        "desenvolvedor full-stack Brasil",
      ];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
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
      icon: [{ url: "/brand-icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/brand-icon.svg", type: "image/svg+xml" }],
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
            ? "Jean Carlos Vargas / JE4NDEV product engineering"
            : "Jean Carlos Vargas / JE4NDEV engenharia de produto",
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
      legalName: "JEAN CARLOS VARGAS DA SILVA",
      alternateName: ["VRG SOLUÇÕES", "VRG SOLUCOES", "Je4nDev"],
      knowsAbout: isEn
        ? ["SaaS development", "custom internal systems", "AI automation", "private AI agents"]
        : ["desenvolvimento SaaS", "sistemas sob medida", "automação com IA", "agentes de IA privados"],
      taxID: "12.349.878/0001-16",
      url: SITE_URL,
      email: "jean@je4ndev.com",
      telephone: "+55-11-94847-7047",
      image: `${SITE_URL}/og-image.png`,
      description: isEn
        ? "Founder-led development of SaaS, internal systems, integrations, automations and AI agents."
        : "Desenvolvimento founder-led de SaaS, sistemas internos, integrações, automações e agentes de IA.",
      founder: { "@id": `${SITE_URL}/#person` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paranavaí",
        addressRegion: "PR",
        addressCountry: "BR",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: isEn ? "Product engineering services" : "Serviços de engenharia de produto",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: isEn ? "Custom SaaS and internal systems" : "SaaS e sistemas sob medida",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: isEn ? "Automation and integrations" : "Automações e integrações",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: isEn ? "AI agents on private infrastructure" : "Agentes de IA em infraestrutura privada",
            },
          },
        ],
      },
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
      alternateName: ["JE4NDEV", "Je4nDev"],
      jobTitle: "Founder and Product Engineer",
      knowsAbout: isEn
        ? ["SaaS", "product engineering", "AI agents", "marketplace operations"]
        : ["SaaS", "engenharia de produto", "agentes de IA", "operação de marketplace"],
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
          <PortfolioAnalytics locale={activeLocale} />
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

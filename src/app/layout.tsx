import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { LenisProvider } from "@/components/ui/lenis-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://je4ndev.com"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "en-US": "/?lang=en",
    },
  },
  title: "JE4NDEV — Agência de produto · SaaS, automações com IA e agentes locais",
  description:
    "Agência de produto comandada por founder. Criamos SaaS, automações com IA, integrações, agentes locais (Hermes/OpenClaw na sua VPS), auditoria Solidity e plataformas Web3. Acompanhamento em tempo real via Vercel preview, garantia de 1 ano. A partir de R$ 500 / US$ 100.",
  keywords: [
    "agencia de produto",
    "agencia SaaS",
    "automacao com IA",
    "agentes locais",
    "Hermes",
    "OpenClaw",
    "AI agency",
    "product agency",
    "SaaS",
    "Next.js",
    "React",
    "TypeScript",
    "jean carlos vargas",
    "je4ndev",
    "JE4NDEV Agency OS",
    "NexPanel",
    "Vultrix 3D",
    "ArchScene",
    "Solidity",
    "NFT platform",
    "auditoria smart contract",
    "Supabase",
  ],
  authors: [{ name: "Jean Carlos Vargas" }],
  creator: "JE4NDEV",
  publisher: "JE4NDEV",
  icons: {
    icon: [
      { url: "/brand-icon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "JE4NDEV — Agência de produto que tira sua ideia do papel",
    description:
      "Criamos SaaS, automações com IA, plataformas de cursos, integrações e agentes locais. Você acompanha cada commit em tempo real via Vercel preview com domínio próprio. Garantia de 1 ano. A partir de R$ 500 / US$ 100.",
    url: "https://je4ndev.com",
    siteName: "JE4NDEV",
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "https://je4ndev.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "JE4NDEV — Agência de produto · SaaS, IA, agentes locais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JE4NDEV — Agência de produto · SaaS, IA, agentes locais",
    description:
      "Criamos SaaS, automações com IA, plataformas de cursos e agentes locais (Hermes/OpenClaw). Garantia de 1 ano, a partir de R$ 500.",
    images: ["https://je4ndev.com/og-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": ["Organization", "ProfessionalService"],
                "@id": "https://je4ndev.com/#organization",
                name: "JE4NDEV",
                alternateName: ["JE4NDEV Agency", "JE4NDEV Product Agency"],
                url: "https://je4ndev.com",
                email: "jean@je4ndev.com",
                telephone: "+55-11-94847-7047",
                logo: {
                  "@type": "ImageObject",
                  url: "https://je4ndev.com/og-image.png",
                  width: 1200,
                  height: 630,
                },
                image: "https://je4ndev.com/og-image.png",
                description:
                  "Agência de produto que cria SaaS, automações com IA, plataformas de cursos, integrações e agentes locais (Hermes/OpenClaw) com acompanhamento em tempo real e garantia de 1 ano.",
                slogan: "Agência de produto que tira sua ideia do papel",
                priceRange: "R$ 500 - R$ 50000",
                founder: {
                  "@type": "Person",
                  name: "Jean Carlos Vargas",
                  url: "https://je4ndev.com/#person",
                },
                founders: [
                  {
                    "@type": "Person",
                    name: "Jean Carlos Vargas",
                  },
                ],
                foundingDate: "2024-01-01",
                sameAs: [
                  "https://github.com/JE4NVRG",
                  "https://www.linkedin.com/in/je4ndev/",
                ],
                areaServed: [
                  { "@type": "Country", name: "Brazil" },
                  { "@type": "Place", name: "Worldwide" },
                ],
                knowsAbout: [
                  "SaaS development",
                  "AI automation",
                  "Local AI agents",
                  "Hermes",
                  "OpenClaw",
                  "Next.js",
                  "TypeScript",
                  "Supabase",
                  "Solidity",
                  "NFT platforms",
                  "Smart contract audits",
                  "Product engineering",
                  "Founder-led agency",
                ],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+55-11-94847-7047",
                    contactType: "customer service",
                    contactOption: "TollFree",
                    areaServed: ["BR", "US", "Worldwide"],
                    availableLanguage: ["Portuguese", "English"],
                  },
                  {
                    "@type": "ContactPoint",
                    email: "jean@je4ndev.com",
                    contactType: "sales",
                    areaServed: "Worldwide",
                    availableLanguage: ["Portuguese", "English"],
                  },
                ],
                makesOffer: [
                  {
                    "@type": "Offer",
                    name: "Site / Landing / Blog",
                    description:
                      "Site institucional, landing de alta conversão ou blog com SEO, animações cinematográficas e Vercel preview.",
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      price: "500",
                      priceCurrency: "BRL",
                      valueAddedTaxIncluded: false,
                    },
                  },
                  {
                    "@type": "Offer",
                    name: "SaaS / Produto",
                    description:
                      "MVP SaaS com auth, dashboard, billing Stripe, Supabase, deploy em produção e garantia de 1 ano.",
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      price: "5000",
                      priceCurrency: "BRL",
                      valueAddedTaxIncluded: false,
                    },
                  },
                  {
                    "@type": "Offer",
                    name: "Web3 / NFT / Smart Contract Audit",
                    description:
                      "Auditoria de contratos Solidity, integrações on-chain e plataformas NFT/Web3.",
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      price: "10000",
                      priceCurrency: "BRL",
                      valueAddedTaxIncluded: false,
                    },
                  },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://je4ndev.com/#person",
                name: "Jean Carlos Vargas",
                givenName: "Jean Carlos",
                familyName: "Vargas",
                jobTitle: "Founder · Product Engineer · Smart Contract Security Researcher",
                url: "https://je4ndev.com",
                email: "jean@je4ndev.com",
                telephone: "+55-11-94847-7047",
                image: "https://je4ndev.com/images/jean-about.png",
                worksFor: {
                  "@type": "Organization",
                  "@id": "https://je4ndev.com/#organization",
                  name: "JE4NDEV",
                },
                sameAs: [
                  "https://github.com/JE4NVRG",
                  "https://www.linkedin.com/in/je4ndev/",
                ],
                knowsLanguage: [
                  { "@type": "Language", name: "Portuguese", alternateName: "pt-BR" },
                  { "@type": "Language", name: "English", alternateName: "en" },
                ],
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "São Paulo",
                  addressRegion: "SP",
                  addressCountry: "BR",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://je4ndev.com/#website",
                url: "https://je4ndev.com",
                name: "JE4NDEV",
                description:
                  "Agência de produto comandada por founder. SaaS, IA, agentes locais e auditoria Solidity.",
                publisher: { "@id": "https://je4ndev.com/#organization" },
                inLanguage: ["pt-BR", "en"],
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://je4ndev.com/?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Service",
                serviceType: "Agência de produto · SaaS / IA / Web3",
                provider: { "@id": "https://je4ndev.com/#organization" },
                areaServed: { "@type": "Place", name: "Worldwide" },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Serviços JE4NDEV",
                  itemListElement: [
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Desenvolvimento SaaS",
                        description:
                          "MVP SaaS com auth, dashboard, billing, deploy em produção e garantia de 1 ano.",
                      },
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Automação com IA",
                        description:
                          "Bots, workflows automatizados e agentes IA (Hermes, OpenClaw) rodando localmente.",
                      },
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Auditoria Solidity",
                        description:
                          "Audit de contratos inteligentes, reports públicos, bounty hunting EVM/L2.",
                      },
                    },
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: "Site institucional / Landing",
                        description:
                          "Site, landing de alta conversão, blog com SEO e animações cinematográficas.",
                      },
                    },
                  ],
                },
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#050505] text-white`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <LenisProvider>
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

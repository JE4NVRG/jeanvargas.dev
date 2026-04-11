import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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
  title: "Jean Carlos Vargas — Full Stack Developer & SaaS Builder",
  description:
    "Building SaaS platforms and AI-powered automations. Creator of NexPanel, Vultrix 3D, and OpenClaw Gateway. Next.js, TypeScript, Supabase.",
  keywords: [
    "full stack developer",
    "AI automation",
    "SaaS",
    "Next.js",
    "React",
    "TypeScript",
    "jean carlos vargas",
    "je4ndev",
    "NexPanel",
    "Vultrix 3D",
    "OpenClaw Gateway",
    "Supabase",
  ],
  authors: [{ name: "Jean Carlos Vargas" }],
  creator: "Jean Carlos Vargas",
  icons: {
    icon: [
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
    title: "Jean Carlos Vargas — Full Stack Developer & SaaS Builder",
    description:
      "Building SaaS platforms and AI-powered automations. Creator of NexPanel, Vultrix 3D, and OpenClaw Gateway. Next.js, TypeScript, Supabase.",
    url: "https://je4ndev.com",
    siteName: "je4ndev",
    type: "website",
    images: [
      {
        url: "https://je4ndev.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "je4ndev — Full Stack Developer & SaaS Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jean Carlos Vargas — Full Stack Developer & SaaS Builder",
    description:
      "Building SaaS platforms and AI-powered automations. Creator of NexPanel, Vultrix 3D, and OpenClaw Gateway. Next.js, TypeScript, Supabase.",
    images: ["https://je4ndev.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Jean Carlos Vargas",
              jobTitle: "Full Stack Developer",
              url: "https://je4ndev.com",
              email: "jean@je4ndev.com",
              image:
                "https://avatars.githubusercontent.com/u/106420077?v=4",
              sameAs: [
                "https://github.com/JE4NVRG",
                "https://www.linkedin.com/in/jean-carlos-vargas-93bbb31b4/",
              ],
              knowsAbout: [
                "Next.js",
                "TypeScript",
                "React",
                "Node.js",
                "Supabase",
                "OpenAI",
                "SaaS",
                "AI Automation",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Paranava\u00ed",
                addressRegion: "Paran\u00e1",
                addressCountry: "BR",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#050505] text-white`}
      >
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "../components/ui/custom-cursor";
import { CursorProvider } from "../contexts/cursor-context";
import { FaviconHead } from "../components/ui/favicon-head";
import { ServiceWorkerRegister } from "../components/ui/service-worker-register";
import "../styles/cursor.css";

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
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Je4nDev - Transformando Ideias em Soluções Digitais",
  description:
    "Portfolio de Jean Carlos Vargas - Desenvolvedor Full Stack especialista em criar soluções digitais inovadoras com IA. Transformo ideias em produtos de alto impacto.",
  keywords: [
    "desenvolvedor full stack",
    "soluções digitais",
    "inteligência artificial",
    "react",
    "nextjs",
    "portfolio",
    "jean carlos vargas",
    "je4ndev",
    "criador de soluções",
    "tecnologias modernas",
  ],
  authors: [{ name: "Jean Carlos Vargas" }],
  creator: "Jean Carlos Vargas",
  publisher: "Je4nDev",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Je4nDev - Transformando Ideias em Soluções Digitais",
    description:
      "Desenvolvedor Full Stack especialista em criar soluções digitais inovadoras com IA",
    url: "https://je4ndev.com",
    siteName: "Je4nDev Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Je4nDev - Transformando Ideias em Soluções Digitais",
    description:
      "Desenvolvedor Full Stack especialista em criar soluções digitais inovadoras com IA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Favicon prioritário - Vercel Override */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />

        {/* Preload crítico apenas para performance */}
        <link
          rel="preload"
          href="/favicon.ico"
          as="image"
          type="image/x-icon"
        />
        <link
          rel="preload"
          href="/favicon-32x32.png"
          as="image"
          type="image/png"
        />

        {/* DNS prefetch para melhor performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        {/* Meta para forçar favicon personalizado */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        style={{ cursor: "none" }}
      >
        <CursorProvider>
          <ServiceWorkerRegister />
          <FaviconHead />
          <CustomCursor />
          {children}
        </CursorProvider>
      </body>
    </html>
  );
}

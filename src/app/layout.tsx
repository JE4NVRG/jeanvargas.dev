import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SimpleCursor } from "../components/ui/simple-cursor";
import { FaviconHead } from "../components/ui/favicon-head";
import { ServiceWorkerRegister } from "../components/ui/service-worker-register";

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
        {/* Preload crítico dos favicons para carregamento instantâneo */}
        <link
          rel="preload"
          href="/favicon.ico"
          as="image"
          type="image/x-icon"
        />
        <link
          rel="preload"
          href="/favicon-16x16.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/favicon-32x32.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/apple-touch-icon.png"
          as="image"
          type="image/png"
        />

        {/* Favicons principais - carregamento imediato */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* DNS prefetch para melhor performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <ServiceWorkerRegister />
        <FaviconHead />
        <SimpleCursor />
        {children}
      </body>
    </html>
  );
}

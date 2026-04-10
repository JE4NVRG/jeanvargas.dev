import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "je4ndev — Full Stack Developer",
  description:
    "Jean Carlos Vargas — Full-stack developer specializing in AI-powered automations, SaaS platforms, and production-grade systems.",
  keywords: [
    "full stack developer",
    "AI automation",
    "SaaS",
    "Next.js",
    "React",
    "TypeScript",
    "jean carlos vargas",
    "je4ndev",
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
    title: "je4ndev — Full Stack Developer",
    description:
      "Full-stack developer specializing in AI-powered automations, SaaS platforms, and production-grade systems.",
    url: "https://je4ndev.com",
    siteName: "je4ndev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "je4ndev — Full Stack Developer",
    description:
      "Full-stack developer specializing in AI-powered automations, SaaS platforms, and production-grade systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#050505] text-white`}
      >
        {children}
      </body>
    </html>
  );
}

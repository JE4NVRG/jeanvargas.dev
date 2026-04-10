# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete redesign of je4ndev.com portfolio — bilingual, dark minimal + bold accents, with project case studies and surreal visual effects.

**Architecture:** Next.js 15 App Router with Server Components for pages and Client Components for interactive sections. i18n via React Context (client-side toggle, no URL routing). Project data defined in TypeScript, case study pages use dynamic routes with `generateStaticParams`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Geist fonts.

**Spec:** `docs/specs/2026-04-10-portfolio-redesign.md`

---

## Task 1: Clean up — Remove old components and pages

**Files:**
- Delete: `src/app/cursor-demo/page.tsx`
- Delete: `src/app/gallery-demo/page.tsx`
- Delete: `src/components/ui/advanced-cursor.tsx`
- Delete: `src/components/ui/animated-counter.tsx`
- Delete: `src/components/ui/background-beams-with-collision-demo.tsx`
- Delete: `src/components/ui/background-beams-with-collision.tsx`
- Delete: `src/components/ui/basic-card.tsx`
- Delete: `src/components/ui/cards-demo-3.tsx`
- Delete: `src/components/ui/cursor-demo.tsx`
- Delete: `src/components/ui/cursor-showcase.tsx`
- Delete: `src/components/ui/custom-cursor.tsx`
- Delete: `src/components/ui/favicon-head.tsx`
- Delete: `src/components/ui/feature-block-card.tsx`
- Delete: `src/components/ui/feedback-card.tsx`
- Delete: `src/components/ui/feedbacks-section.tsx`
- Delete: `src/components/ui/metrics-panel.tsx`
- Delete: `src/components/ui/mouse-glow-config.ts`
- Delete: `src/components/ui/mouse-glow.tsx`
- Delete: `src/components/ui/parallax-element.tsx`
- Delete: `src/components/ui/project-card.tsx`
- Delete: `src/components/ui/project-gallery.tsx`
- Delete: `src/components/ui/service-worker-register.tsx`
- Delete: `src/components/ui/simple-card-demo.tsx`
- Delete: `src/components/ui/simple-cursor.tsx`
- Delete: `src/components/ui/simple-parallax.tsx`
- Delete: `src/components/ui/tech-stack-enhanced.tsx`
- Delete: `src/components/ui/trust-badge.tsx`
- Delete: `src/components/ui/trust-badges-enhanced.tsx`
- Delete: `src/components/ui/trust-badges.tsx`
- Delete: `src/components/ui/whatsapp-button.tsx`
- Delete: `src/components/ui/whatsapp-personalized.tsx`
- Delete: `src/contexts/cursor-context.tsx`
- Delete: `src/data/feedbacks.ts`
- Delete: `src/data/projects.ts`
- Delete: `src/hooks/use-cursor-hover.ts`
- Delete: `src/hooks/use-cursor.ts`
- Delete: `src/styles/cursor.css`
- Delete: `src/styles/project-gallery.css`
- Delete: `src/styles/trust-badges.css`
- Delete: `public/sw.js`

- [ ] **Step 1: Delete all old component files**

```bash
rm -rf src/app/cursor-demo src/app/gallery-demo
rm -f src/components/ui/advanced-cursor.tsx src/components/ui/animated-counter.tsx src/components/ui/background-beams-with-collision-demo.tsx src/components/ui/background-beams-with-collision.tsx src/components/ui/basic-card.tsx src/components/ui/cards-demo-3.tsx src/components/ui/cursor-demo.tsx src/components/ui/cursor-showcase.tsx src/components/ui/custom-cursor.tsx src/components/ui/favicon-head.tsx src/components/ui/feature-block-card.tsx src/components/ui/feedback-card.tsx src/components/ui/feedbacks-section.tsx src/components/ui/metrics-panel.tsx src/components/ui/mouse-glow-config.ts src/components/ui/mouse-glow.tsx src/components/ui/parallax-element.tsx src/components/ui/project-card.tsx src/components/ui/project-gallery.tsx src/components/ui/service-worker-register.tsx src/components/ui/simple-card-demo.tsx src/components/ui/simple-cursor.tsx src/components/ui/simple-parallax.tsx src/components/ui/tech-stack-enhanced.tsx src/components/ui/trust-badge.tsx src/components/ui/trust-badges-enhanced.tsx src/components/ui/trust-badges.tsx src/components/ui/whatsapp-button.tsx src/components/ui/whatsapp-personalized.tsx
rm -f src/contexts/cursor-context.tsx src/data/feedbacks.ts src/data/projects.ts
rm -f src/hooks/use-cursor-hover.ts src/hooks/use-cursor.ts
rm -f src/styles/cursor.css src/styles/project-gallery.css src/styles/trust-badges.css
rm -f public/sw.js
```

- [ ] **Step 2: Create placeholder page.tsx and clean layout.tsx**

Replace `src/app/page.tsx` with a minimal placeholder so the app builds:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <h1 className="text-4xl font-bold">je4ndev — coming soon</h1>
    </main>
  );
}
```

Replace `src/app/layout.tsx` — remove cursor provider, service worker, favicon-head imports:

```tsx
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
```

- [ ] **Step 3: Clean globals.css**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #050505;
  --foreground: #ededed;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 4: Clean next.config.ts**

Replace `next.config.ts` — remove service worker and excessive favicon headers:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remover componentes antigos e limpar projeto para redesign"
```

---

## Task 2: i18n system — LanguageProvider + translations

**Files:**
- Create: `src/i18n/translations/en.ts`
- Create: `src/i18n/translations/pt.ts`
- Create: `src/i18n/provider.tsx`
- Create: `src/i18n/use-translation.ts`
- Create: `src/i18n/index.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create English translations**

Create `src/i18n/translations/en.ts`:

```ts
export const en = {
  nav: {
    work: "Work",
    about: "About",
    services: "Services",
    stack: "Stack",
    contact: "Get in touch",
  },
  hero: {
    badge: "Available for new projects",
    title: "I craft systems that",
    titleHighlight: "scale and automate",
    subtitle:
      "Full-stack developer specializing in AI-powered automations, SaaS platforms, and production-grade systems.",
    cta: "View my work",
    email: "jean@je4ndev.com",
  },
  work: {
    label: "Featured Work",
    title: "Selected projects",
    viewCase: "View case study",
    viewProject: "View project",
  },
  about: {
    label: "About",
    name: "Jean Carlos Vargas",
    bio: "Full-stack developer with 10+ years building production systems — from SaaS platforms to AI-powered bots, API integrations, smart contracts, and automation pipelines. Based in Brazil, working globally.",
    experience: "10+ years",
  },
  stack: {
    label: "Tech Stack",
    title: "Tools I work with",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      ai: "AI & Automation",
      devops: "DevOps",
      tools: "Tools",
    },
  },
  services: {
    label: "Services",
    title: "What I offer",
    items: [
      {
        title: "Web Applications",
        description:
          "Full-stack apps with Next.js, React, and modern frameworks",
      },
      {
        title: "SaaS Platforms",
        description:
          "Scalable systems with auth, billing, and admin panels",
      },
      {
        title: "AI Automations",
        description:
          "Intelligent bots, workflows, and integrations with OpenAI",
      },
      {
        title: "API Integrations",
        description: "Connect systems, automate processes, sync data",
      },
      {
        title: "Mobile Apps",
        description:
          "Cross-platform apps with FlutterFlow and React Native",
      },
      {
        title: "Consulting",
        description:
          "Technical architecture, code review, and system design",
      },
    ],
    cta: "Learn more",
  },
  contact: {
    title: "Let's build something",
    titleHighlight: "extraordinary",
    subtitle: "Have a project in mind? I'd love to hear about it.",
    whatsapp: "WhatsApp",
  },
  footer: {
    copyright: "© 2026 Jean Carlos Vargas",
  },
  project: {
    breadcrumbWork: "Work",
    problem: "The Problem",
    solution: "The Solution",
    visitLive: "Visit live",
    github: "GitHub",
    nextProject: "Next project",
  },
} as const;

export type Translations = typeof en;
```

- [ ] **Step 2: Create Portuguese translations**

Create `src/i18n/translations/pt.ts`:

```ts
import type { Translations } from "./en";

export const pt: Translations = {
  nav: {
    work: "Projetos",
    about: "Sobre",
    services: "Servicos",
    stack: "Stack",
    contact: "Entre em contato",
  },
  hero: {
    badge: "Disponivel para novos projetos",
    title: "Eu construo sistemas que",
    titleHighlight: "escalam e automatizam",
    subtitle:
      "Desenvolvedor full-stack especializado em automacoes com IA, plataformas SaaS e sistemas de producao.",
    cta: "Ver meu trabalho",
    email: "jean@je4ndev.com",
  },
  work: {
    label: "Projetos em Destaque",
    title: "Projetos selecionados",
    viewCase: "Ver case study",
    viewProject: "Ver projeto",
  },
  about: {
    label: "Sobre",
    name: "Jean Carlos Vargas",
    bio: "Desenvolvedor full-stack com mais de 10 anos construindo sistemas em producao — de plataformas SaaS a bots com IA, integracoes de APIs, contratos inteligentes e pipelines de automacao. Baseado no Brasil, trabalhando globalmente.",
    experience: "10+ anos",
  },
  stack: {
    label: "Tech Stack",
    title: "Ferramentas que uso",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Banco de Dados",
      ai: "IA & Automacao",
      devops: "DevOps",
      tools: "Ferramentas",
    },
  },
  services: {
    label: "Servicos",
    title: "O que eu ofereco",
    items: [
      {
        title: "Aplicacoes Web",
        description:
          "Apps full-stack com Next.js, React e frameworks modernos",
      },
      {
        title: "Plataformas SaaS",
        description:
          "Sistemas escalaveis com auth, billing e paineis admin",
      },
      {
        title: "Automacoes com IA",
        description:
          "Bots inteligentes, workflows e integracoes com OpenAI",
      },
      {
        title: "Integracoes de APIs",
        description: "Conecte sistemas, automatize processos, sincronize dados",
      },
      {
        title: "Apps Mobile",
        description:
          "Aplicativos cross-platform com FlutterFlow e React Native",
      },
      {
        title: "Consultoria",
        description:
          "Arquitetura tecnica, code review e design de sistemas",
      },
    ],
    cta: "Saiba mais",
  },
  contact: {
    title: "Vamos construir algo",
    titleHighlight: "extraordinario",
    subtitle: "Tem um projeto em mente? Adoraria ouvir sobre.",
    whatsapp: "WhatsApp",
  },
  footer: {
    copyright: "© 2026 Jean Carlos Vargas",
  },
  project: {
    breadcrumbWork: "Projetos",
    problem: "O Problema",
    solution: "A Solucao",
    visitLive: "Visitar site",
    github: "GitHub",
    nextProject: "Proximo projeto",
  },
};
```

- [ ] **Step 3: Create LanguageProvider**

Create `src/i18n/provider.tsx`:

```tsx
"use client";

import { createContext, useCallback, useState, type ReactNode } from "react";
import { en } from "./translations/en";
import { pt } from "./translations/pt";
import type { Translations } from "./translations/en";

type Locale = "en" | "pt";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  t: en,
  toggleLocale: () => {},
});

const translations: Record<Locale, Translations> = { en, pt };

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("locale");
  if (stored === "en" || stored === "pt") return stored;
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "en" ? "pt" : "en";
      localStorage.setItem("locale", next);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale, t: translations[locale], toggleLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
```

- [ ] **Step 4: Create useTranslation hook**

Create `src/i18n/use-translation.ts`:

```ts
"use client";

import { useContext } from "react";
import { LanguageContext } from "./provider";

export function useTranslation() {
  return useContext(LanguageContext);
}
```

- [ ] **Step 5: Create barrel export**

Create `src/i18n/index.ts`:

```ts
export { LanguageProvider } from "./provider";
export { useTranslation } from "./use-translation";
```

- [ ] **Step 6: Wrap layout with LanguageProvider**

Modify `src/app/layout.tsx` — add LanguageProvider wrapper around `{children}`:

```tsx
import { LanguageProvider } from "@/i18n";

// ... (keep existing metadata, viewport, fonts)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#050505] text-white`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Verify build passes**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/i18n/ src/app/layout.tsx
git commit -m "feat: adicionar sistema i18n com suporte EN/PT-BR"
```

---

## Task 3: Project data + types

**Files:**
- Create: `src/types/project.ts`
- Create: `src/data/projects.ts`

- [ ] **Step 1: Create Project type**

Create `src/types/project.ts`:

```ts
export interface Project {
  slug: string;
  title: string;
  description: { en: string; pt: string };
  longDescription: { en: string; pt: string };
  status: "live" | "mvp" | "development";
  dateRange: string;
  category: string;
  technologies: string[];
  problem: { en: string; pt: string };
  solution: { en: string; pt: string };
  metrics: Array<{
    value: string;
    label: { en: string; pt: string };
    color: string;
  }>;
  links: {
    live?: string;
    github?: string;
  };
  gradient: string;
  featured: boolean;
}
```

- [ ] **Step 2: Create project data**

Create `src/data/projects.ts`:

```ts
import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "openclaw-gateway",
    title: "OpenClaw Gateway",
    description: {
      en: "Multi-platform automation gateway with AI-powered workflows",
      pt: "Gateway de automacao multi-plataforma com workflows de IA",
    },
    longDescription: {
      en: "A centralized automation gateway that orchestrates AI-powered workflows across multiple platforms. Features intelligent routing, real-time monitoring, and 24/7 automated operations with high availability.",
      pt: "Um gateway de automacao centralizado que orquestra workflows com IA em multiplas plataformas. Possui roteamento inteligente, monitoramento em tempo real e operacoes automatizadas 24/7 com alta disponibilidade.",
    },
    status: "live",
    dateRange: "2024 — Present",
    category: "Automation Platform",
    technologies: ["Node.js", "OpenAI", "Supabase", "TypeScript"],
    problem: {
      en: "Manual processes scattered across multiple platforms with no centralized control, leading to inefficiency and human error in critical workflows.",
      pt: "Processos manuais espalhados em multiplas plataformas sem controle centralizado, levando a ineficiencia e erros humanos em workflows criticos.",
    },
    solution: {
      en: "Built a centralized gateway with AI-powered routing, automated workflows, and comprehensive monitoring that runs 24/7 with 99.9% uptime.",
      pt: "Construi um gateway centralizado com roteamento por IA, workflows automatizados e monitoramento abrangente que roda 24/7 com 99.9% de uptime.",
    },
    metrics: [
      { value: "99.9%", label: { en: "Uptime", pt: "Uptime" }, color: "purple" },
      { value: "5k+", label: { en: "Requests/day", pt: "Requests/dia" }, color: "cyan" },
      { value: "8", label: { en: "Automations", pt: "Automacoes" }, color: "green" },
      { value: "24/7", label: { en: "Monitoring", pt: "Monitoramento" }, color: "pink" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/openclaw-gateway",
    },
    gradient: "from-indigo-900 to-purple-900",
    featured: true,
  },
  {
    slug: "mepchat",
    title: "MepChat",
    description: {
      en: "WhatsApp chatbot platform with CNPJ dashboard",
      pt: "Plataforma de chatbot WhatsApp com painel CNPJ",
    },
    longDescription: {
      en: "An intelligent WhatsApp chatbot platform that automates customer service with AI-powered responses, integrated with a CNPJ management dashboard for business operations.",
      pt: "Uma plataforma inteligente de chatbot WhatsApp que automatiza o atendimento ao cliente com respostas por IA, integrada com um painel de gestao CNPJ para operacoes empresariais.",
    },
    status: "mvp",
    dateRange: "2024",
    category: "AI Chatbot",
    technologies: ["Node.js", "Firebase", "OpenAI", "FlutterFlow"],
    problem: {
      en: "Businesses spending excessive time on repetitive customer inquiries, with no automated way to handle CNPJ lookups and common questions.",
      pt: "Empresas gastando tempo excessivo com consultas repetitivas de clientes, sem forma automatizada de lidar com consultas CNPJ e perguntas comuns.",
    },
    solution: {
      en: "Built an AI-powered WhatsApp bot that handles 100% of routine inquiries automatically, with a management dashboard for monitoring conversations and CNPJ data.",
      pt: "Construi um bot WhatsApp com IA que lida com 100% das consultas rotineiras automaticamente, com um painel de gestao para monitorar conversas e dados de CNPJ.",
    },
    metrics: [
      { value: "100%", label: { en: "Automated", pt: "Automatizado" }, color: "green" },
      { value: "MVP", label: { en: "Validated", pt: "Validado" }, color: "cyan" },
      { value: "Active", label: { en: "User base", pt: "Base ativa" }, color: "purple" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/mepchat",
    },
    gradient: "from-emerald-900 to-teal-900",
    featured: false,
  },
  {
    slug: "criptopto",
    title: "Criptopto",
    description: {
      en: "AI-powered crypto trading bot with Bybit integration",
      pt: "Bot de trading cripto com IA e integracao Bybit",
    },
    longDescription: {
      en: "An automated cryptocurrency trading bot that uses AI for market analysis and executes trades on Bybit. Features real-time monitoring of 10+ coins with 24/7 automated trading.",
      pt: "Um bot automatizado de trading de criptomoedas que usa IA para analise de mercado e executa operacoes na Bybit. Monitoramento em tempo real de 10+ moedas com trading automatizado 24/7.",
    },
    status: "mvp",
    dateRange: "2024",
    category: "AI Trading",
    technologies: ["Node.js", "Supabase", "OpenAI", "CCXT"],
    problem: {
      en: "Manual crypto trading is time-consuming and emotional, missing opportunities in volatile markets that require 24/7 attention.",
      pt: "Trading manual de cripto e demorado e emocional, perdendo oportunidades em mercados volateis que exigem atencao 24/7.",
    },
    solution: {
      en: "Built an AI-driven trading bot that analyzes market patterns, manages risk automatically, and executes trades around the clock without emotional bias.",
      pt: "Construi um bot de trading com IA que analisa padroes de mercado, gerencia risco automaticamente e executa operacoes 24h sem vies emocional.",
    },
    metrics: [
      { value: "10+", label: { en: "Coins tested", pt: "Moedas testadas" }, color: "purple" },
      { value: "AI", label: { en: "Analysis", pt: "Analise" }, color: "cyan" },
      { value: "24/7", label: { en: "Monitoring", pt: "Monitoramento" }, color: "green" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/criptopto",
    },
    gradient: "from-orange-900 to-red-900",
    featured: false,
  },
  {
    slug: "petconnect",
    title: "PetConnect",
    description: {
      en: "Pet adoption platform connecting shelters and adopters",
      pt: "Plataforma de adocao de pets conectando abrigos e adotantes",
    },
    longDescription: {
      en: "A mobile-first platform that connects animal shelters with potential adopters. Features complete pet management, adoption workflow, and real-time communication between parties.",
      pt: "Uma plataforma mobile-first que conecta abrigos de animais com potenciais adotantes. Gestao completa de pets, workflow de adocao e comunicacao em tempo real entre as partes.",
    },
    status: "mvp",
    dateRange: "2024",
    category: "Social Platform",
    technologies: ["FlutterFlow", "Firebase", "Supabase"],
    problem: {
      en: "Animal shelters struggle to reach potential adopters, with no centralized platform to manage and promote pets available for adoption.",
      pt: "Abrigos de animais tem dificuldade em alcancar potenciais adotantes, sem plataforma centralizada para gerenciar e promover pets disponiveis para adocao.",
    },
    solution: {
      en: "Created a mobile-first platform with complete adoption workflow, connecting shelters directly with adopters through an intuitive interface.",
      pt: "Criei uma plataforma mobile-first com workflow completo de adocao, conectando abrigos diretamente com adotantes atraves de uma interface intuitiva.",
    },
    metrics: [
      { value: "MVP", label: { en: "Validated", pt: "Validado" }, color: "purple" },
      { value: "Social", label: { en: "Impact", pt: "Impacto" }, color: "pink" },
      { value: "100%", label: { en: "Responsive", pt: "Responsivo" }, color: "cyan" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/petconnect",
    },
    gradient: "from-purple-900 to-pink-900",
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/types/ src/data/projects.ts
git commit -m "feat: adicionar tipos e dados dos projetos bilingues"
```

---

## Task 4: UI primitives — animated-grid, gradient-orbs, section-reveal, magnetic-button, tilt-card

**Files:**
- Create: `src/components/ui/animated-grid.tsx`
- Create: `src/components/ui/gradient-orbs.tsx`
- Create: `src/components/ui/section-reveal.tsx`
- Create: `src/components/ui/magnetic-button.tsx`
- Create: `src/components/ui/tilt-card.tsx`

- [ ] **Step 1: Create AnimatedGrid**

Create `src/components/ui/animated-grid.tsx`:

```tsx
"use client";

export function AnimatedGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
  );
}
```

- [ ] **Step 2: Create GradientOrbs**

Create `src/components/ui/gradient-orbs.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface Orb {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
}

const orbs: Orb[] = [
  { color: "rgba(139,92,246,0.15)", size: 400, top: "30%", left: "20%", duration: 20 },
  { color: "rgba(6,182,212,0.10)", size: 300, top: "40%", left: "70%", duration: 25 },
  { color: "rgba(236,72,153,0.08)", size: 250, top: "70%", left: "40%", duration: 22 },
];

export function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 60%)`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create SectionReveal**

Create `src/components/ui/section-reveal.tsx`:

```tsx
"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface SectionRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

export function SectionReveal({
  children,
  delay = 0,
  ...props
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create MagneticButton**

Create `src/components/ui/magnetic-button.tsx`:

```tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className = "",
  as = "button",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Component = as === "a" ? motion.a : motion.button;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      <Component className={className} {...props}>
        {children}
      </Component>
    </motion.div>
  );
}
```

- [ ] **Step 5: Create TiltCard**

Create `src/components/ui/tilt-card.tsx`:

```tsx
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouseMove(e: MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: adicionar primitivos UI (grid, orbs, reveal, magnetic, tilt)"
```

---

## Task 5: Layout — Navbar + Footer

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/layout/footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Navbar**

Create `src/components/layout/navbar.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";

const navLinks = [
  { key: "work" as const, href: "#work" },
  { key: "about" as const, href: "#about" },
  { key: "services" as const, href: "#services" },
  { key: "stack" as const, href: "#stack" },
];

export function Navbar() {
  const { t, locale, toggleLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/80 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="text-lg font-extrabold tracking-tight">
          je4n<span className="text-purple-500">dev</span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {t.nav[link.key]}
            </a>
          ))}

          <div className="w-px h-4 bg-white/10" />

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="text-xs text-zinc-500 border border-white/10 rounded px-2 py-1 hover:border-white/20 transition-colors"
            aria-label="Toggle language"
          >
            {locale === "en" ? "EN | PT" : "PT | EN"}
          </button>

          {/* CTA */}
          <a
            href="#contact"
            className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            {t.nav.contact}
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-zinc-400"
          aria-label="Menu"
          onClick={() => {
            // Mobile menu handled in a future iteration
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 2: Create Footer**

Create `src/components/layout/footer.tsx`:

```tsx
"use client";

import { useTranslation } from "@/i18n";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/5 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-600">{t.footer.copyright}</p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/JE4NVRG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/jean-vargas-93bbb31b4/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://wa.me/5511914826568"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-white transition-colors"
            aria-label="WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Add Navbar and Footer to layout**

Modify `src/app/layout.tsx` — add Navbar and Footer:

```tsx
import { LanguageProvider } from "@/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// ... (keep existing metadata, viewport, fonts)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/ src/app/layout.tsx
git commit -m "feat: adicionar Navbar sticky e Footer"
```

---

## Task 6: Home sections — Hero, FeaturedWork, About, TechStack, Services, Contact

**Files:**
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/sections/featured-work.tsx`
- Create: `src/components/sections/about.tsx`
- Create: `src/components/sections/tech-stack.tsx`
- Create: `src/components/sections/services.tsx`
- Create: `src/components/sections/contact.tsx`
- Modify: `src/app/page.tsx`

**Note:** This is the largest task. Each section is a self-contained Client Component. The page.tsx imports and composes them.

- [ ] **Step 1: Create Hero section**

Create `src/components/sections/hero.tsx` — full hero with animated grid, gradient orbs, badge, title with gradient highlight, subtitle, CTAs, scroll indicator. Uses `useTranslation()` for all text. See spec section 01 for exact copy/layout.

- [ ] **Step 2: Create FeaturedWork section**

Create `src/components/sections/featured-work.tsx` — section label, title, featured project card (OpenClaw, full-width 2-col), smaller cards grid (2-col). Each card uses `TiltCard`, links to `/projects/[slug]`. Uses project data from `src/data/projects.ts`. Shows terminal-style visuals in screenshot areas.

- [ ] **Step 3: Create About section**

Create `src/components/sections/about.tsx` — 2-column layout, GitHub avatar with gradient border via `next/image`, experience badge, bio text, tech dots, social links. Uses `useTranslation()`.

- [ ] **Step 4: Create TechStack section**

Create `src/components/sections/tech-stack.tsx` — grid by category (Frontend, Backend, Database, AI & Automation, DevOps, Tools). Each tech with icon (lucide-react or react-icons) + name. Dark cards with subtle borders.

- [ ] **Step 5: Create Services section**

Create `src/components/sections/services.tsx` — 3-column grid, 6 service cards with Lucide icons, title, description, "Learn more" linking to WhatsApp with pre-filled message. Uses `useTranslation()`.

- [ ] **Step 6: Create Contact section**

Create `src/components/sections/contact.tsx` — CTA title with gradient highlight, subtitle, email button (primary, white), WhatsApp button (secondary, green ghost), subtle orb background. Uses `MagneticButton` for CTAs.

- [ ] **Step 7: Compose page.tsx**

Replace `src/app/page.tsx`:

```tsx
import { Hero } from "@/components/sections/hero";
import { FeaturedWork } from "@/components/sections/featured-work";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedWork />
      <About />
      <TechStack />
      <Services />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 8: Run dev server, visual check**

Run: `npm run dev`
Open: http://localhost:3000
Check: All 6 sections render, nav works, language toggle works, animations play.

- [ ] **Step 9: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/ src/app/page.tsx
git commit -m "feat: implementar todas as secoes da home page"
```

---

## Task 7: Case Study page — /projects/[slug]

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`
- Create: `src/components/projects/case-study.tsx`

- [ ] **Step 1: Create CaseStudy component**

Create `src/components/projects/case-study.tsx` — Client Component with:
- Breadcrumb (Work / ProjectName)
- Hero (status badge, date range, title, description)
- Screenshot area (gradient bg with placeholder for now)
- Problem/Solution 2-column grid
- Metrics 4-column grid with colored borders
- Tech tags horizontal list
- Links (Visit live, GitHub)
- Next project navigation card
- Uses `useTranslation()` for labels, project data for bilingual content

- [ ] **Step 2: Create dynamic route page**

Create `src/app/projects/[slug]/page.tsx`:

```tsx
import { projects, getProjectBySlug } from "@/data/projects";
import { CaseStudy } from "@/components/projects/case-study";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} — je4ndev`,
    description: project.description.en,
    openGraph: {
      title: `${project.title} — je4ndev`,
      description: project.description.en,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <CaseStudy slug={slug} />;
}
```

- [ ] **Step 3: Run dev server, test navigation**

Run: `npm run dev`
Test:
- Click project card on home → navigates to `/projects/openclaw-gateway`
- Case study renders all sections
- "Next project" card links to next project
- Language toggle changes case study content
- Back navigation works

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds, static pages generated for all project slugs.

- [ ] **Step 5: Commit**

```bash
git add src/app/projects/ src/components/projects/
git commit -m "feat: adicionar paginas de case study por projeto"
```

---

## Task 8: Polish — globals.css, responsive, reduced motion, final QA

**Files:**
- Modify: `src/app/globals.css`
- Modify: various components for responsive fixes

- [ ] **Step 1: Update globals.css with custom utilities**

Add to `src/app/globals.css`:

```css
/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Selection color */
::selection {
  background: rgba(139, 92, 246, 0.3);
  color: #fff;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #050505;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

- [ ] **Step 2: Responsive check**

Run: `npm run dev`
Test at breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop).
Fix any layout issues:
- Nav collapses to hamburger on mobile
- Project grid stacks to single column on mobile
- About section stacks photo above text on mobile
- Tech stack grid adjusts columns
- Services grid goes 1-col on mobile, 2-col on tablet

- [ ] **Step 3: Verify production build**

Run: `npm run build && npm run start`
Open: http://localhost:3000
Check: No hydration errors, all animations work, navigation smooth, language toggle persists.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: polish final — responsivo, acessibilidade, reduced motion"
```

---

## Task 9: Deploy to Vercel

- [ ] **Step 1: Verify build one final time**

Run: `npm run build`
Expected: Build succeeds with no warnings.

- [ ] **Step 2: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 3: Deploy via Vercel**

If Vercel CLI is installed: `vercel --prod`
Otherwise: push triggers auto-deploy if repo is linked to Vercel.

- [ ] **Step 4: Verify live site**

Open: https://je4ndev.com
Check: All sections, navigation, language toggle, project pages, responsive, performance.

- [ ] **Step 5: Commit any post-deploy fixes if needed**

---

## Summary

| Task | Description | Files |
|------|------------|-------|
| 1 | Clean up old code | Delete ~35 files, rewrite layout/page/css/config |
| 2 | i18n system | 5 new files (provider, hook, translations) |
| 3 | Project data + types | 2 new files (types, data) |
| 4 | UI primitives | 5 new files (grid, orbs, reveal, magnetic, tilt) |
| 5 | Layout (Nav + Footer) | 2 new files + layout update |
| 6 | Home sections (6) | 6 new files + page.tsx |
| 7 | Case study page | 2 new files (page + component) |
| 8 | Polish + responsive | CSS + fixes |
| 9 | Deploy | Push + Vercel |

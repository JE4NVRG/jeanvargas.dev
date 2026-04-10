# Portfolio Redesign — je4ndev.com

## Overview

Complete redesign of Jean Carlos Vargas's professional portfolio. Replaces the current Portuguese single-page site with a bilingual (EN/PT-BR), dark-themed, visually striking portfolio that showcases real projects with case studies, screenshots, and live links.

**Domain:** je4ndev.com  
**Email:** jean@je4ndev.com  
**WhatsApp:** +55 11 91482-6568  
**Deploy:** Vercel  

## Design Direction

**Dark Minimal + Bold Accents** — dark base (#050505) with vibrant gradient accents (purple #8b5cf6, cyan #06b6d4, pink #ec4899). Clean typography, generous whitespace, subtle grid background with floating gradient orbs.

**References:** Vercel, Linear, Raycast, Stripe.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Language:** TypeScript (strict)
- **i18n:** Client-side toggle EN/PT-BR (no page reload, context-based)
- **Deploy:** Vercel
- **Fonts:** Geist Sans + Geist Mono (already in project)

## Site Architecture

### Routes

```
/                         → Home (single-page with 6 sections)
/projects/[slug]          → Individual project case study
```

### Home Sections (scroll order)

1. **Hero** — Name, title, tagline, availability badge, CTAs
2. **Featured Work** — 3-4 project cards with mini-screenshots
3. **About** — Photo, bio, key tech, social links
4. **Tech Stack** — Skills grid organized by category
5. **Services** — What I offer (6 cards)
6. **Contact** — CTA with email (primary) + WhatsApp (secondary)

### Navigation

Sticky header with:
- Logo: `je4ndev` (purple accent on "dev")
- Links: Work, About, Services, Stack
- Language toggle: `EN | PT`
- CTA button: "Get in touch" / "Entre em contato"

Smooth scroll to sections. Transparent on hero, subtle backdrop-blur on scroll.

## Section Specifications

### 01 — Hero

- **Background:** #050505 with subtle animated grid (CSS, not canvas) + 2-3 floating gradient orbs (Framer Motion, slow drift)
- **Availability badge:** Green dot + "Available for new projects" / "Disponivel para novos projetos"
- **Title:** "I craft systems that **scale and automate**" (gradient text on bold part)
- **Subtitle:** "Full-stack developer specializing in AI-powered automations, SaaS platforms, and production-grade systems."
- **CTAs:** 
  - Primary: "View my work" (white bg, scrolls to #work)
  - Secondary: "jean@je4ndev.com" (ghost button, mailto link)
- **Scroll indicator:** Subtle line fade at bottom

### 02 — Featured Work

- **Section label:** "Featured Work" (purple, uppercase, letter-spacing)
- **Section title:** "Selected projects"
- **Layout:** 
  - 1 featured project (OpenClaw) spanning full width, 2-column layout (screenshot left, info right)
  - 2-3 smaller project cards in a 2-column grid below
- **Each card contains:**
  - Screenshot/visual area (gradient bg with stylized terminal or app preview)
  - Status badge (LIVE / MVP / In Development)
  - Project name
  - One-line description
  - Tech tags
  - "View case study" / "View project" link
- **Hover effects:** Subtle border glow, slight Y lift, 3D tilt (Framer Motion)
- **Click:** Navigates to `/projects/[slug]`

### 03 — About

- **Layout:** 2-column — photo left, content right
- **Photo:** GitHub avatar in rounded-xl container with gradient border (purple→cyan)
- **Experience badge:** "10+ years" positioned on photo corner
- **Content:** Name, short bio (3-4 sentences), tech dots (colored dots + labels), social links (GitHub, LinkedIn as ghost buttons)
- **Bio tone:** Professional, direct, no fluff. Mention: full-stack, 10+ years, SaaS, AI bots, API integrations, smart contracts, global work.

### 04 — Tech Stack

- **Layout:** Grid organized by category
- **Categories:** Frontend, Backend, Database, AI & Automation, DevOps, Tools
- **Each tech:** Icon + name + category tag
- **Visual:** Dark cards with subtle borders, icons from react-icons/lucide
- **Keep it clean** — only list technologies actually used in projects

### 05 — Services

- **Layout:** 3-column grid
- **Services:**
  1. Web Applications — Full-stack apps with Next.js, React, and modern frameworks
  2. SaaS Platforms — Scalable systems with auth, billing, and admin panels
  3. AI Automations — Intelligent bots, workflows, and integrations with OpenAI
  4. API Integrations — Connect systems, automate processes, sync data
  5. Mobile Apps — Cross-platform apps with FlutterFlow and React Native
  6. Consulting — Technical architecture, code review, and system design
- **Each card:** Icon (Lucide), title, description, "Learn more" link (WhatsApp with pre-filled message)
- **Style:** Dark cards (#0a0a0a), border on hover (blue-500), icon color change on hover

### 06 — Contact

- **Title:** "Let's build something **extraordinary**" (gradient on bold)
- **Subtitle:** "Have a project in mind? I'd love to hear about it."
- **CTAs:**
  - Primary: Email button (white bg) → mailto:jean@je4ndev.com
  - Secondary: WhatsApp button (green ghost) → wa.me/5511914826568
- **Background:** Subtle purple radial gradient orb centered

### Footer

- Copyright: "© 2026 Jean Carlos Vargas"
- Links: GitHub, LinkedIn, WhatsApp
- Minimal, single line

## Case Study Page — /projects/[slug]

### Layout

1. **Breadcrumb:** Work / [Project Name]
2. **Hero:** Status badge + date range + project name + one-line description
3. **Screenshot:** Full-width image/visual of the project (rounded-xl, border)
4. **Problem / Solution:** 2-column grid with red/green accent headers
5. **Key Metrics:** 4-column grid with colored borders (purple, cyan, green, pink)
6. **Tech Stack:** Horizontal tag list
7. **Links:** "Visit live" + "GitHub" buttons
8. **Next Project:** Navigation card to next project in the list

### Data Structure

Each project will be defined as a TypeScript object:

```typescript
interface Project {
  slug: string;
  title: string;
  description: { en: string; pt: string };
  longDescription: {
    en: string;
    pt: string;
  };
  status: 'live' | 'mvp' | 'development';
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

### Initial Projects

1. **OpenClaw Gateway** (featured) — Automation platform, Node.js/OpenAI/Supabase
2. **MepChat** — WhatsApp chatbot + CNPJ dashboard, Node.js/Firebase/OpenAI
3. **Criptopto** — AI crypto trading bot, Node.js/CCXT/Supabase
4. **PetConnect** — Pet adoption platform, FlutterFlow/Firebase/Supabase
5. More projects to be added after mining GitHub repositories

## Internationalization (i18n)

### Approach

Client-side context with React Context + localStorage persistence. No URL-based routing (no /en, /pt prefixes). Toggle in navbar switches all text instantly.

### Implementation

- `translations/en.ts` and `translations/pt.ts` with typed keys
- `LanguageProvider` wrapping the app
- `useTranslation()` hook returning `{ t, locale, toggleLocale }`
- Default language: English
- Persist choice in localStorage

## Visual Effects ("Surreal" Differentiators)

1. **Animated Grid Background** — CSS grid lines on hero/sections, subtle opacity that responds to scroll position
2. **Floating Gradient Orbs** — 2-3 large blurred circles with slow Framer Motion drift animation (position + scale)
3. **Smooth Scroll Reveals** — Elements fade-in + slide-up on viewport entry with stagger delays (Framer Motion `whileInView`)
4. **3D Card Hover** — Project cards tilt based on mouse position (perspective transform), border glow follows cursor
5. **Magnetic Buttons** — CTA buttons that shift slightly toward cursor on approach (Framer Motion spring)
6. **Section Transitions** — Gradient fade between sections instead of hard color breaks

## What Gets Removed

- Custom cursor system (all cursor-related components, context, CSS)
- Fake testimonials/feedbacks section
- Background beams with collision (heavy, performance concern)
- WhatsApp as primary CTA (becomes secondary)
- Portuguese-only content
- Emojis in buttons/badges
- Service worker registration
- Parallax text component (replace with Framer Motion reveals)
- `cards-demo-3`, `simple-card-demo`, `basic-card` (unused demo components)
- Gallery demo page, cursor demo page

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, providers, nav)
│   ├── page.tsx                # Home (6 sections)
│   ├── globals.css             # Tailwind + custom styles
│   └── projects/
│       └── [slug]/
│           └── page.tsx        # Case study page
├── components/
│   ├── layout/
│   │   ├── navbar.tsx          # Sticky nav with lang toggle
│   │   └── footer.tsx          # Minimal footer
│   ├── sections/
│   │   ├── hero.tsx            # Hero section
│   │   ├── featured-work.tsx   # Project cards grid
│   │   ├── about.tsx           # Bio section
│   │   ├── tech-stack.tsx      # Skills grid
│   │   ├── services.tsx        # Services cards
│   │   └── contact.tsx         # CTA section
│   ├── projects/
│   │   ├── project-card.tsx    # Card for home grid
│   │   └── case-study.tsx      # Full case study layout
│   └── ui/
│       ├── animated-grid.tsx   # Grid background effect
│       ├── gradient-orbs.tsx   # Floating orbs
│       ├── magnetic-button.tsx # Magnetic hover button
│       ├── section-reveal.tsx  # Scroll reveal wrapper
│       └── tilt-card.tsx       # 3D tilt on hover
├── data/
│   └── projects.ts             # All project data
├── i18n/
│   ├── translations/
│   │   ├── en.ts               # English strings
│   │   └── pt.ts               # Portuguese strings
│   ├── provider.tsx            # LanguageProvider context
│   └── use-translation.ts     # useTranslation hook
├── lib/
│   └── utils.ts                # cn() helper, etc.
└── types/
    └── project.ts              # Project interface
```

## Performance Considerations

- Use Next.js App Router with Server Components where possible (layout, project pages)
- Client components only where interactivity is needed (nav, animations, lang toggle)
- Lazy load Framer Motion animations (dynamic imports for heavy components)
- Use `next/image` for all images with proper sizing
- Preload critical fonts (already configured)
- Keep total JS bundle under control — no unnecessary libraries
- Lighthouse target: 90+ on all metrics

## Accessibility

- Native cursor (remove `cursor: none`)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text on all images
- Keyboard navigation for all interactive elements
- Color contrast ratios meeting WCAG AA
- `aria-label` on icon-only buttons
- `lang` attribute switches with i18n toggle
- Reduced motion support via `prefers-reduced-motion`

## SEO

- Proper meta tags per page (title, description, og:image)
- Structured data (Person schema on about, SoftwareApplication on projects)
- Sitemap generation
- Canonical URLs
- Open Graph images for social sharing

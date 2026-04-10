<div align="center">

<img src="docs/screenshots/hero.png" alt="je4ndev portfolio hero" width="100%" />

<br />
<br />

# je4ndev.com

**Personal portfolio of Jean Carlos Vargas**
**Full Stack Developer & Founder @ Vultrix 3D**

[![Live](https://img.shields.io/badge/LIVE-je4ndev.com-8b5cf6?style=for-the-badge)](https://je4ndev.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000?style=for-the-badge&logo=vercel)](https://vercel.com)

Dark minimal portfolio with bold gradient accents, bilingual support (EN/PT-BR),
individual project case studies with live links, and smooth Framer Motion animations.

[**View Live**](https://je4ndev.com) &middot; [**Projects**](#-featured-projects) &middot; [**Tech Stack**](#-tech-stack) &middot; [**Getting Started**](#-getting-started)

</div>

---

## Preview

<table>
<tr>
<td width="50%">

**Featured Work**

<img src="docs/screenshots/featured-work.png" alt="Featured projects section" />

</td>
<td width="50%">

**About**

<img src="docs/screenshots/about.png" alt="About section" />

</td>
</tr>
<tr>
<td width="50%">

**Tech Stack — Real SVG icons**

<img src="docs/screenshots/tech-stack.png" alt="Tech stack with real icons" />

</td>
<td width="50%">

**Case Study Page**

<img src="docs/screenshots/case-study.png" alt="Project case study" />

</td>
</tr>
</table>

<details>
<summary><strong>Mobile View</strong></summary>
<br />
<div align="center">
<img src="docs/screenshots/mobile.png" alt="Mobile responsive view" width="300" />
</div>
</details>

---

## Highlights

- **Bilingual** — EN/PT-BR toggle, client-side, no page reload
- **Case Studies** — Each project has its own page with problem/solution breakdown, metrics, and live links
- **Visual Effects** — Animated grid, floating gradient orbs, 3D tilt cards, magnetic buttons, scroll reveals
- **Performance** — Static generation (SSG), ~160 kB First Load JS, Lighthouse 90+ target
- **Accessibility** — Reduced motion support, semantic HTML, ARIA labels, keyboard navigation
- **Responsive** — Mobile-first design, tested on 390px to 1440px+

---

## Featured Projects

| Project | What it does | Stack | Status |
|---------|-------------|-------|--------|
| [**NexPanel**](https://nexpanel.je4ndev.com) | SaaS management for IPTV resellers — clients, servers, billing, dashboards | Next.js, Supabase, Stripe | **Live** |
| [**Vultrix 3D**](https://www.vultrix3d.com.br) | Management platform for 3D printing — cost calculator, inventory, financials | Next.js, Supabase, Tailwind | **Live** |
| [**OpenClaw Gateway**](https://github.com/JE4NVRG/openclaw-gateway) | Multi-platform automation gateway with AI-powered workflows | Node.js, OpenAI, Supabase | **Live** |
| [**HypeFC**](https://hypefc.je4ndev.com) | Real-time football dashboard — live scores, standings, 8+ leagues | Next.js, API Football | **Live** |
| [**MepChat**](https://github.com/JE4NVRG/mepchat) | WhatsApp chatbot with AI + CNPJ business dashboard | Node.js, Firebase, OpenAI | **MVP** |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 16 (App Router, SSG, Server Components) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 4, CSS custom properties |
| **Animations** | Framer Motion (orbs, tilt, magnetic, scroll reveal) |
| **Icons** | Lucide React, Devicon SVGs, SimpleIcons |
| **i18n** | React Context + localStorage persistence |
| **Deploy** | Vercel (auto-deploy from GitHub) |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx                 # Root layout — fonts, providers, navbar, footer
│   ├── page.tsx                   # Home — composes 6 sections
│   └── projects/[slug]/page.tsx   # Case study pages (SSG via generateStaticParams)
├── components/
│   ├── layout/                    # Navbar (sticky, blur), Footer
│   ├── sections/                  # Hero, FeaturedWork, About, TechStack, Services, Contact
│   ├── projects/                  # CaseStudy component
│   └── ui/                        # AnimatedGrid, GradientOrbs, MagneticButton, TiltCard, SectionReveal
├── data/
│   └── projects.ts                # Project definitions (bilingual, typed)
├── i18n/
│   ├── translations/              # en.ts, pt.ts — all UI strings
│   ├── provider.tsx               # LanguageProvider (React Context)
│   └── use-translation.ts         # useTranslation() hook
├── lib/
│   └── utils.ts                   # cn() — clsx + tailwind-merge
└── types/
    └── project.ts                 # Project interface
```

**Design decisions:**
- Server Components for static pages, Client Components only where interactivity is needed
- Project data defined in TypeScript — no CMS, no database, no API calls
- i18n via React Context — instant toggle, persisted in localStorage
- All pages statically generated at build time

---

## Getting Started

```bash
git clone https://github.com/JE4NVRG/jeanvargas.dev.git
cd jeanvargas.dev
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables required.

| Command | Description |
|---------|------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint check |

---

## Performance

| Metric | Value |
|--------|-------|
| First Load JS | ~160 kB |
| Pages | All statically generated (SSG) |
| Lighthouse Performance | 90+ target |
| Reduced Motion | Respects `prefers-reduced-motion` |
| Images | `next/image` with lazy loading |
| Fonts | Geist Sans + Geist Mono (preloaded) |

---

## Contact

<div align="center">

**Jean Carlos Vargas**
Full Stack Developer & Founder @ Vultrix 3D
Paranavaí, Brazil

[![Portfolio](https://img.shields.io/badge/je4ndev.com-8b5cf6?style=for-the-badge)](https://je4ndev.com)
[![Email](https://img.shields.io/badge/jean@je4ndev.com-000?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jean@je4ndev.com)
[![GitHub](https://img.shields.io/badge/@JE4NVRG-000?style=for-the-badge&logo=github)](https://github.com/JE4NVRG)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jean-carlos-vargas-93bbb31b4/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5511914826568)

</div>

---

<div align="center">

MIT License

Built with Next.js, TypeScript, and Framer Motion.

</div>

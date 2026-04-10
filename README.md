<div align="center">

# je4ndev

**Personal portfolio — Jean Carlos Vargas**

[![Live](https://img.shields.io/badge/live-je4ndev.com-8b5cf6?style=flat-square)](https://je4ndev.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deploy](https://img.shields.io/badge/Vercel-deployed-000?style=flat-square&logo=vercel)](https://vercel.com)

Dark minimal portfolio with bold gradient accents, bilingual support (EN/PT-BR), project case studies, and smooth animations.

[View Live](https://je4ndev.com) &middot; [Featured Projects](#featured-projects) &middot; [Tech Stack](#tech-stack)

</div>

---

## Overview

Full-stack developer portfolio showcasing real production projects with individual case study pages, live links, metrics, and problem/solution breakdowns. Built with performance and accessibility in mind.

**Key features:**

- Bilingual (EN/PT-BR) with client-side toggle — no page reload
- Individual case study pages for each project (`/projects/[slug]`)
- Animated UI — gradient orbs, 3D tilt cards, magnetic buttons, scroll reveals
- Fully responsive — mobile, tablet, desktop
- Accessibility — reduced motion support, semantic HTML, ARIA labels
- Static generation (SSG) for all pages — fast load, SEO friendly

## Featured Projects

| Project | Description | Stack | Link |
|---------|-------------|-------|------|
| **NexPanel** | SaaS management system for IPTV resellers | Next.js, Supabase, Stripe | [nexpanel.je4ndev.com](https://nexpanel.je4ndev.com) |
| **Vultrix 3D** | Management platform for 3D printing businesses | Next.js, Supabase, Tailwind | [vultrix3d.com.br](https://www.vultrix3d.com.br) |
| **OpenClaw Gateway** | Multi-platform automation gateway with AI workflows | Node.js, OpenAI, Supabase | [GitHub](https://github.com/JE4NVRG/openclaw-gateway) |
| **HypeFC** | Real-time football dashboard — 8+ leagues | Next.js, API Football | [hypefc.je4ndev.com](https://hypefc.je4ndev.com) |
| **MepChat** | WhatsApp chatbot with AI + CNPJ dashboard | Node.js, Firebase, OpenAI | [GitHub](https://github.com/JE4NVRG/mepchat) |

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 16 (App Router, SSG) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS, CSS custom properties |
| **Animations** | Framer Motion |
| **Icons** | Lucide React, Devicon SVGs |
| **Deploy** | Vercel |
| **i18n** | React Context + localStorage |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout (fonts, providers, nav, footer)
│   ├── page.tsx                   # Home — composes all sections
│   └── projects/[slug]/page.tsx   # Case study pages (SSG)
├── components/
│   ├── layout/                    # Navbar, Footer
│   ├── sections/                  # Hero, FeaturedWork, About, TechStack, Services, Contact
│   ├── projects/                  # CaseStudy component
│   └── ui/                        # AnimatedGrid, GradientOrbs, MagneticButton, TiltCard, SectionReveal
├── data/
│   └── projects.ts                # Project definitions (bilingual)
├── i18n/
│   ├── translations/              # en.ts, pt.ts
│   ├── provider.tsx               # LanguageProvider (React Context)
│   └── use-translation.ts         # useTranslation hook
├── lib/
│   └── utils.ts                   # cn() helper
└── types/
    └── project.ts                 # Project interface
```

## Running Locally

```bash
# Clone
git clone https://github.com/JE4NVRG/jeanvargas.dev.git
cd jeanvargas.dev

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build && npm start
```

Open [localhost:3000](http://localhost:3000).

No environment variables required — the portfolio is fully static with no external API calls at build time.

## Performance

- **Static Generation** — all pages pre-rendered at build time
- **~160 kB** First Load JS (home page)
- **Lighthouse 90+** target on all metrics
- **Reduced motion** — respects `prefers-reduced-motion`
- **Custom scrollbar** and selection styling

## Contact

**Jean Carlos Vargas** — Full Stack Developer & Founder @ Vultrix 3D

- Web: [je4ndev.com](https://je4ndev.com)
- Email: [jean@je4ndev.com](mailto:jean@je4ndev.com)
- GitHub: [@JE4NVRG](https://github.com/JE4NVRG)
- LinkedIn: [Jean Carlos Vargas](https://www.linkedin.com/in/jean-carlos-vargas-93bbb31b4/)
- WhatsApp: [+55 11 91482-6568](https://wa.me/5511914826568)

## License

MIT

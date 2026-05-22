# je4ndev — Design System

A premium tech-editorial dark design language for **je4ndev.com** — the personal portfolio of **Jean Carlos Vargas**, a Brazilian full-stack engineer specialising in SaaS, AI automation, and Web3. Live at <https://www.je4ndev.com>.

This system extracts the visual rules, tokens, copy voice, and component vocabulary in production today so any designer or agent can author new surfaces — paid-traffic landing pages, case studies, decks, ad creative — that feel native to the brand.

---

## Sources

All foundations in this folder were lifted directly from the production codebase. Explore further if you have access:

- **GitHub** — <https://github.com/JE4NVRG/jeanvargas.dev> (Next.js 16 + React 19 + TypeScript strict + Tailwind v4 + Framer Motion)
- **Live site** — <https://www.je4ndev.com>
- **OG image** — `assets/og-image.png`

Reading `src/components/sections/*` and `src/i18n/translations/*` in the repo will give the highest-fidelity reference for any new screen.

---

## Brand at a glance

| | |
|---|---|
| **Product** | Personal portfolio — paid-traffic-ready surface for Jean's SaaS / AI / Web3 work |
| **Owner** | Jean Carlos Vargas — Paranavá, BR — `jean@je4ndev.com` |
| **Domain** | jeanvargas.dev → je4ndev.com |
| **Tone** | Premium, calm, direct. "Linear × Stripe × Vercel × Apple WWDC." |
| **Languages** | PT-BR (default) + EN, with a hard toggle |
| **Default background** | `#050505` — always dark. No light theme. |
| **Signature** | Terminal hero (`$ ship produto --saas --automacao --web3`) |

### Products represented (7 real, in production)
| Slug | Product | Domain |
|---|---|---|
| `nexpanel` | SaaS IPTV management for resellers | nexpanel.je4ndev.com |
| `vultrix-3d` | 3D-printing pricing & ops SaaS | vultrix3d.com.br |
| `openclaw-gateway` | Multi-agent AI orchestrator | github / JE4NVRG |
| `gestaoml` | Mercado Livre seller SaaS | gestaoml.je4ndev.com |
| `mepchat` | WhatsApp + AI chatbot (CNPJ ops) | github / JE4NVRG |
| `hypefc` | Real-time football dashboard | hypefc.je4ndev.com |
| `stopultimate` | Stop/Adedonha game with an AI judge | new (Hermes) |

---

## Index — what's in this folder

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← agent skill manifest (use with Claude Code)
├── colors_and_type.css        ← all tokens — colors, type, radii, shadows
├── assets/                    ← logos, hero photo, project screenshots
│   ├── brand-icon.svg            J4 mark with cyan→violet gradient
│   ├── apple-touch-icon.png      180×180 brand icon (raster)
│   ├── android-chrome-512x512.png
│   ├── favicon-32x32.png
│   ├── og-image.png              1200×630 social card
│   ├── jean-hero.png             real photo of Jean (do NOT substitute)
│   └── projects/                 product screenshots used in the grid
│       ├── nexpanel.png
│       ├── vultrix-3d.png
│       ├── gestaoml.png
│       ├── hypefc.png
│       └── openclaw-gateway.png
├── preview/                   ← cards rendered into the Design System tab
└── ui_kits/
    └── portfolio/             ← high-fidelity React/JSX recreation
        ├── README.md
        ├── index.html            interactive prototype (full page)
        ├── Hero.jsx              terminal + photo card + stats
        ├── Navbar.jsx            sticky, blur on scroll
        ├── Projects.jsx          2-col grid with tilt + status pills
        ├── About.jsx             eyebrow + bio + tech dots
        ├── Services.jsx          icon tiles, 7 services
        ├── TechStack.jsx         6 categories
        ├── Contact.jsx           gradient orb + CTAs
        ├── Footer.jsx            three-column compact footer
        └── primitives.jsx        BrandMark, MagneticButton, TiltCard,
                                  CodeTerminal, SectionReveal, StatusBadge
```

---

## CONTENT FUNDAMENTALS

### Voice
- **First-person, direct.** "Eu construo SaaS e automações." "I build SaaS and automations." No third-person bio voice. No "we" — it's one person.
- **Outcome-oriented, plain language.** Replace abstract claims with concrete verbs and numbers: *"Pedidos e atendimento centralizados"*, *"R$181k+ rastreados em plataformas"*, *"10+ anos construindo sistemas"*.
- **Founder-to-founder.** Speaks to founders, ops leads, CTOs. Skips academic jargon.
- **Bilingual parity.** Every string lives in `src/i18n/translations/{pt,en}.ts`. PT-BR is default. **PT must include all accents** (`automação`, `produção`, `aplicações`) — the historical version stripped them; new copy never should.

### Casing
- **Sentence case for headings.** `Projetos selecionados`, not `Projetos Selecionados`. Even at h1.
- **UPPERCASE only for eyebrows / overlines.** Tracked `0.18em`, weight 600, accent-violet color. Example: `PROJETOS EM DESTAQUE`.
- **lowercase + UPPERCASE letter-mix in code.** `je4ndev`, `JE4NVRG`, `je4ndev/build` — the brand name is intentionally stylised.
- **Status pills are lowercase**: `live`, `mvp`, `case`, `internal`, `demo`.

### Numbers and stats
- Always pair a number with a short label below it: `247+ / Clientes gerenciados`, `R$4.2k / Monthly revenue`.
- Currency stays local: `R$` for PT, plain dollars (when used) for EN.
- `+` suffix is preferred over "more than" or "over".

### Pronouns
- **"Eu" / "I"** in narrative voice.
- **"Você" / "you"** when addressing the visitor.
- **No "a gente"**, no "nós" / "we".

### Tone words used
**Yes** — `construir`, `entregar`, `ship`, `lançar`, `automatizar`, `escalar`, `escalável`, `pronto pra vender`, `arquitetura de produção`, `sem flash branco`, `disponível para projetos selecionados`.
**No** — buzzwords like *revolutionary*, *cutting-edge*, *next-gen*, *unleash*, *empower*. No hype adjectives.

### Emoji
**Almost never.** The only emoji-adjacent glyph in production is the green dot status indicator (a CSS circle, not an emoji). Use Lucide icons or real assets — never `🚀 ⚡ ✨` decorations.

### Examples (verbatim from production)

| Surface | Copy |
|---|---|
| Status badge | `Disponível para projetos selecionados` |
| Hero h1 | `Eu construo SaaS e automações` + `para o seu negócio crescer` |
| Hero sub | `Desenvolvedor full-stack ajudando founders e equipes a lançar produtos prontos para vender…` |
| Terminal cmd | `$ ship produto --saas --automacao --web3` |
| Terminal out | `escopo -> arquitetura -> codigo -> deploy -> monitoramento` |
| Primary CTA | `Começar um projeto` |
| Secondary CTA | `Ver cases` |
| Eyebrow | `PROJETOS EM DESTAQUE` |
| Project card hover | `Ver estudo de caso →` |
| Service hover | `Saiba mais ↗` |

---

## VISUAL FOUNDATIONS

### Background
- **Always `#050505`.** This is non-negotiable — applied to `<html>`, `<body>`, and every section. Never lighter, never gradient-washed.
- Elevated surfaces lift via **subtle white tint**, not a different color:
  - `bg-white/[0.02]` for low-emphasis tiles (tech-stack cells)
  - `bg-white/[0.03]` for cards and panels
  - `bg-white/[0.04]` for hovered / featured cards
  - `bg-[#080808]` for the project cards (a touch warmer than base)
- A **`linear-gradient(180deg, rgba(255,255,255,0.06), transparent)`** strip sits at the very top of the hero — a soft moonlight wash.
- **Animated faint grid** behind the hero only (`AnimatedGrid` component, ~32px cells, white at 0.035 alpha).
- One **soft radial orb** behind the contact section: violet (0.3) → cyan (0.15) → transparent, blurred 60px, opacity 0.2. This is the only "blob" in the system.

### Color usage rules
- **`#050505` base + `#ededed` foreground** is the resting state.
- **Accents are functional, not decorative.**
  - **Cyan `#5EEAD4`** = terminal output, hover lift on featured project cards, brand mark "J".
  - **Violet `#8B5CF6`** = eyebrow labels, service icon backgrounds, ::selection.
  - **Emerald `#10B981`** = `$` prompt, `live` status, strengths checkmarks.
  - **Magenta / pink `#EC4899`** = single-instance accents (pricing metric, contact title gradient).
- Cards **must not** use a colored left-border accent. They use a full-ring `border-white/[0.06–0.08]`.
- **Only one tri-color gradient exists** — the contact h2 text gradient: violet → cyan → pink.
- **Only one bi-color text gradient exists** — the hero h1 highlight: white → cyan-200 → emerald-300.

### Typography
- **Geist** (sans, all weights 300–900) and **Geist Mono** (mono).
- **Geist Sans Extrabold (800)** for the display h1.
- **Geist Sans Bold (700)** for h2 / h3.
- **Geist Mono** for: terminal lines, project slugs, the `J4` brand mark glyph, the `0X` index numbers in the mobile menu, the language toggle (`EN | PT`).
- Tracking is **near-neutral**. The display h1 uses `tracking-normal`, not tight or wide.
- Section headers always pair: **eyebrow (purple, uppercase, tracked)** above **h2 (white, sentence case, bold)**.

### Spacing
- Tailwind scale. **Sections use `py-20 sm:py-24` (80–96px)** or `py-32` (128px) for the most generous (about, services, stack, contact).
- Inner page max-width: `max-w-7xl` (1280px), `px-6` gutters.
- Card padding: `p-6` outer (24px) or `p-7` for service cards.
- Card gap in grids: `gap-6` (24px).
- Tight stack: `gap-3` (12px); medium: `gap-4`; loose `gap-6`.

### Borders
- Every interactive surface has a **single-pixel white ring at low alpha**: `border-white/[0.06]` resting, `border-white/[0.1]` for slightly elevated, `border-white/[0.16]` on hover.
- No double borders. No dashed. No colored borders **except** status pills (10–25% alpha of the status color).
- Brand mark uses a `border-cyan-300/25` — the only ringed accent.

### Corner radii
- **`16px` minimum** for any card or button container — this is a hard brand rule.
- **`16px`** — tech-stack tiles, service cards, project metric chips.
- **`24px`** — project cards, hero image card outer.
- **`32px`** — hero image card inner.
- **`9999px` (full)** — pills, status badges, primary CTAs.
- **`8–12px`** — small chips, language-toggle border.

### Shadows
- **The system avoids classical drop shadows.** Depth comes from rings and surface tint.
- Two exceptions:
  - Project cards: `shadow-[0_22px_80px_-55px_rgba(255,255,255,0.35)]` — a **white halo bloom downward** that reads as "lifted off black" rather than "casting a shadow on white".
  - Hero photo card: `shadow-2xl shadow-black/40` — a deep black absorption shadow.
- Brand mark: `shadow-[0_0_28px_-14px_rgba(34,211,238,0.9)]` — a **cyan glow** (the only colored glow in the system).

### Transparency & blur
- **Backdrop-blur is reserved for chrome.** Navbar (`backdrop-blur-xl`), mobile menu overlay (`backdrop-blur-sm`), and a soft `backdrop-blur-[2px]` on the gradient strip over the hero photo.
- White-alpha surfaces (`0.02 → 0.08`) replace solid greys; this is what gives the "premium dark" feel.
- Black-alpha gradients fade content into the page bottom: `from-black/55 via-black/10 to-transparent`.

### Animation
- **Library:** Framer Motion (`motion/react`). No new deps allowed.
- **Entry animation:** `opacity: 0 → 1` + `y: 18px → 0`, **duration 0.55s**, **staggered delays** of ~0.1s per element. This is the universal reveal — used across hero text, project cards, service tiles.
- **Scroll reveal:** `SectionReveal` primitive — fires once when in view.
- **Hover transforms:** project cards do a **tilt** via mouse position (`TiltCard`, max ~6° on each axis); product images do a subtle `scale-[1.02–1.03]`; magnetic buttons follow the cursor up to ~12px.
- **Easing:** default Framer (`easeOut`) for entries; `[0.4, 0, 0.2, 1]` for navbar transitions.
- **Looping motifs:** the badge pulse dot (`animate-ping` + solid dot), the terminal caret (`animate-pulse` on a 2×4 cyan rectangle), a 2s vertical `move` keyframe (`translateY(0 → −10px)`), and a 3s `shine` gradient sweep on backgrounds (`backgroundPosition: -200% → 200%`).
- **No bouncing springs anywhere except the mobile menu drawer** (`spring damping:25 stiffness:200`).
- Honor `prefers-reduced-motion` — globals.css already collapses durations to 0.01ms.

### Hover states
- **Text links** → `text-zinc-400 → text-white` (color shift only).
- **Card borders** → `border-white/[0.08] → border-cyan-300/25` on featured cards; `→ border-purple-500/50` on service cards; `→ border-white/[0.15]` on neutral cards.
- **Primary CTA (white button)** → `bg-white → bg-zinc-200`.
- **Outline CTA** → `border-white/[0.12] → border-white/[0.24]` + `bg-white/[0.03] → bg-white/[0.06]`.
- **Project artwork** → `scale-[1.02]` (contained) or `scale-[1.03]` (covered), 500ms.
- **Service "Saiba mais"** → `text-zinc-400 → text-purple-400`, arrow `↗`.

### Press states
- Buttons inherit the hover bg, **no explicit `active:` styles** in the codebase — relies on the OS / cursor feedback. New CTAs may use a subtle `active:scale-[0.98]` to keep tactile but **don't change color on press**.

### Imagery
- **Real photography only.** Jean's photo is a real shot — **never substitute with AI art**.
- **Product screenshots** are framed inside the card with the project's gradient as a backdrop (e.g. `from-blue-900 to-indigo-900` for NexPanel) — the gradient is *behind* the screenshot, not over it.
- Two artwork modes:
  - **`object-contain` with `p-4`** for product UIs that look like floating mockups (NexPanel, Vultrix, GestaoML, HypeFC).
  - **`object-cover object-top`** for full-bleed screenshots (case study panels).
- **No stock photos. No AI-generated decorative imagery.** Every visual asset must trace back to a real product or to Jean's real photo.
- A black gradient (`from-black/55 via-black/10 to-transparent`) is laid over the bottom 60% of every product image to anchor text legibility.

### Layout rules
- Sticky navbar — translucent until scrolled past 50px, then `bg-[#050505]/90 + backdrop-blur-xl + border-b border-white/5`.
- Hero is `min-h-screen` with `pt-24` to clear the navbar.
- Two-column grids snap to `md:grid-cols-2`; never three columns of cards for projects.
- Tech stack and services use `sm:grid-cols-2 lg:grid-cols-3`.
- Footer is a 3-column compact grid (`1fr_auto_1fr`) — left = copyright, center = GitHub orb + "Criado por JE4NVRG", right = LinkedIn + WhatsApp.

### Cards — anatomy
A canonical card:
```
container:  rounded-2xl border border-white/[0.08] bg-[#080808]
            shadow-[0_22px_80px_-55px_rgba(255,255,255,0.35)]
            transition-colors hover:border-cyan-300/25
content:    p-6, vertical flex, gap-3 within blocks, mt-5 between blocks
artwork:    aspect-[16/9] with project gradient + image + bottom black fade
```

---

## ICONOGRAPHY

### System
- **Lucide React** — the only icon library. Stroke-based, 1.5–2px stroke weight, no fills, rounded line caps. Imported per-icon, not a global font.
- Common Lucide icons in use today: `ArrowRight`, `ArrowUpRight`, `Mail`, `MessageCircle`, `CheckCircle2`, `Github`, `Linkedin`, `ExternalLink`, `Globe`, `Server`, `Bot`, `Plug`, `ShieldCheck`, `Smartphone`, `Code2`.
- One hand-written SVG: the **WhatsApp glyph in the footer** (filled, brand-faithful version, not an outline) — see `Footer.jsx`.
- **Default size**: `h-4 w-4` (16px) inline with text, `h-6 w-6` (24px) inside icon tiles, `size={18}` for footer social.
- **Color**: inherits `text-zinc-400 → text-white` on hover for nav icons; service-tile icons are `text-purple-400` on a `bg-purple-500/10` square (`rounded-xl`, `h-12 w-12`).

### Tech logos
- **Devicon** (CDN) for most tech stack tiles — `cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/<slug>/<slug>-original.svg`.
- **Simple Icons** for OpenAI, LangChain, Anthropic, Ethereum, OpenZeppelin — `cdn.simpleicons.org/<slug>/white` (forced white).
- **Fallback** for icons not on a CDN (Qwen, Kimi, CCXT) — `QW`, `KI`, `CX` text fallback inside the same 8×8 tile.

### Status / live dot
- A **pulsing green dot** built from two stacked spans (`animate-ping` outer + solid `bg-green-500` inner). Used in: hero status badge, project `live` pill. Never replaced with an emoji.

### Logo / brand mark
- `assets/brand-icon.svg` — a 512×512 rounded square with cyan→violet conic stops, two corner accent dots (cyan top-left, violet bottom-right), and "J4" in cyan-200 / violet-400.
- Inline runtime version (`BrandMark.tsx`) re-implements this at 36px so it's crisp at icon size. **Use the SVG asset for any size 64px+; use the inline JSX recreation at smaller sizes.**

### Emoji & unicode
- **Emoji: never used in UI.** Some MD docs include shield badges (`shields.io`) and `&middot;` separators.
- The only ASCII glyphs treated as iconography are **`$`** (the terminal prompt — emerald) and **`->`** (in the terminal output — kept ASCII for the retro-tech feel, even though copy elsewhere uses proper arrows).

---

## How to extend the system

1. **Read `colors_and_type.css`** and use those CSS variables.
2. **Open `ui_kits/portfolio/index.html`** — it's a working interactive prototype with every primitive in context.
3. **Copy assets out of `assets/`** for any composition. Never re-draw the logo, never AI-generate Jean.
4. **For a paid-traffic landing page**: lift Hero + a slimmer Projects grid (3 max) + Services + Contact. Add tracking IDs (Meta Pixel, GA4, UTMs) outside the visual system.
5. **For an ad creative**: brand mark top-left, h-display headline, terminal motif, real product screenshot framed in a `rounded-2xl` card. No decorative AI imagery.

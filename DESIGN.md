# DESIGN.md — JE4NDEV

Curta direção visual e regras de qualidade para o portfólio `je4ndev.com`.
Sempre que mexer em UI, ler este arquivo antes. Mudança que conflita com ele
exige justificativa explícita no commit.

---

## Objetivo visual

Vender a agência **JE4NDEV** como **time experiente, transparente, com produto
real em produção**. O site precisa transmitir, em 5 segundos:

1. Equipe de verdade (não freelancer solo, não template).
2. Produto rodando (não slides, não promessa).
3. Cliente acompanha em tempo real (Vercel preview, garantia, suporte).

Estética alvo: **premium tech editorial dark** — Linear × Vercel × Stripe Press
× Apple WWDC. Sem cyberpunk, sem neon excessivo, sem 3D rendered "render barato".

## Público-alvo

- Founders PME brasileiros precisando virar planilha em sistema (R$ 500+).
- Studios e operações que precisam de SaaS + IA com agência confiável.
- Clientes Web3 / NFT / smart contract audit.
- Clientes internacionais (en) com budget USD.

## Tom de voz

- Direto, técnico, sem floreio. PT-BR coloquial (você / a gente / tu).
- Foco em entrega, transparência e garantia.
- **Nunca** prometer prazo agressivo de qualidade ("3 semanas vs 3 meses"
  está banido — não dá pra entregar projeto grande em 3 semanas com qualidade).
- **Nunca** apresentar agentes IA como "substituição da equipe humana" — eles
  são ferramenta interna que acelera, founder está sempre no controle.
- **Nunca** inventar número. Métricas exibidas precisam ser reais ou
  arredondamento honesto do real (ex: "25+ apps", "100k+ renders").

## Paleta (não desvie sem aprovação)

| Token | Hex | Uso |
|---|---|---|
| Background | `#050505` | base do site |
| Cyan | `#5EEAD4` | accent primário, CTAs, gradient |
| Violet | `#8B5CF6` | accent secundário, gradients |
| Magenta | `#EC4899` | rares, pricing featured glow |
| Emerald | `#10B981` | status "ativo", LED running |
| Amber | `#F59E0B` | warnings, ArchScene accent |
| Zinc 200/400/500/700 | shades | texto e bordas |

Tokens canônicos em `src/styles/design-tokens.css` e `tailwind.config`.
Tudo fora desses tokens passa por revisão.

## Identidade da marca

- O logotipo JE4NDEV é sempre monocromático: preto em fundo claro ou branco
  em fundo escuro.
- Ciano, violeta, magenta e demais cores são acentos da interface e nunca
  devem colorir o logotipo.
- O `4` customizado substitui a letra A e pode ser usado sozinho somente como
  favicon, ícone de app, bordado ou gravação compacta.
- Na navegação, papelaria e comunicação com clientes, usar o wordmark completo
  JE4NDEV em caixa alta.
- Não usar gradiente, glow, sombra, símbolo de banco de ícones ou abreviações.
- Assets oficiais e aplicações: `docs/brand/README.md` e `public/brand/`.

## Tipografia

- **Geist Sans** para texto e títulos. Tracking apertado em H1 (`tracking-tight`).
- **Geist Mono** para badges editoriais, terminais e índices ("01 / 05").

## Regras — Hero

- H1 sempre composto por **duas linhas em `<span class="block">`** separadas
  por um text node `" "` real. Nunca confiar só em `display:block` para
  separação semântica.
- Mobile 390px: H1 começa em `text-[2.1rem]` e cresce em `sm:text-5xl`.
  CTAs em `py-3.5` mobile, `py-4` desktop.
- O blob 3D / vídeo do hero **nunca** pode cobrir o texto. Em mobile, um
  veil de gradiente `rgba(5,5,5,0.45) → transparent` fica embaixo do
  conteúdo. Em desktop o blob fica deslocado pro lado direito.
- Stats só animam números puros. Strings mistas como `1 ano`, `24/7`,
  `MIT`, `Live` renderizam direto.

## Regras — Landing / sessões

- Cada seção tem **eyebrow + título + parágrafo introdutório** antes do
  conteúdo principal. Eyebrow é Mono uppercase, em cor de acento da seção.
- Sessões alternadas com `border-t border-white/[0.05]` separando.
- Card surface base: `bg-[#0a0a0a]/80 border border-white/[0.08] backdrop-blur`.
- Hover state: borda ganha `cyan-300/30` ou cor de acento da seção.

## Regras — Showcase de projetos

- Layout full-bleed alternando lado a cada projeto (0/1/2/3 → left/right/left/right).
- Imagem ou vídeo ocupa 60% da largura desktop. Texto 40%.
- Cada projeto mostra: índice ("01 / 05"), categoria, título, descrição
  curta, 4 métricas reais, CTAs (case study, live, github).
- Vídeo gerado por IA é permitido **apenas se** representa o produto sem
  promessa enganosa. Vídeo abstrato (blob, cosmic) só no hero.

## Regras — Case studies (`/projects/[slug]`)

Estrutura obrigatória em ordem:

1. Breadcrumb → Status badge / categoria / data → Título → Descrição.
2. Print em destaque (imagem ou vídeo do produto).
3. Galeria opcional (até 3 prints adicionais com legenda PT/EN).
4. Impacto no negócio: ANTES / O QUE ENTREGAMOS / RESULTADO.
5. Problema → Solução (parágrafos curtos).
6. CTAs no fim: Visit live · GitHub · Próximo projeto.

## Regras — Mobile

- Breakpoint base é **390px** (iPhone 14/15). Tudo precisa caber sem
  overflow horizontal em 390.
- `min-h-[100svh]` no hero (não `100vh` — usa unit que conta o address bar
  do safari mobile).
- CTAs em coluna no mobile, lado a lado em `sm:` (>= 640px).
- Stats grid: 2 colunas em mobile, 4 em `sm:`.
- Tamanhos de texto sempre `text-X sm:text-Y` — nunca fixo apenas.

## Regras — Motion / animation

**Regra mãe**: **conteúdo essencial nunca pode depender de animação para
aparecer**. Se a animação travar, o usuário ainda vê o site.

- `RevealText` (char-by-char) só em H1 do hero. Demais textos com
  `framer-motion` simples (opacity/translate) e duração ≤ 0.8s.
- `prefers-reduced-motion: reduce` deve resultar em conteúdo visível
  imediatamente (já tratado em `globals.css`).
- `StatCounter` só anima valores que casam a regex
  `/^(\d+(?:\.\d+)?)([KkMm]?)(\+?)$/`. Outros valores renderizam direto.
- Vídeos de fundo (`<video>`) precisam `autoPlay muted loop playsInline`
  e `preload="metadata"`. Nunca som por padrão.
- GSAP `ScrollTrigger` permitido com `once: true` ou `scrub: 1` em
  parallax sutil. Sem pinning agressivo que prende o scroll do usuário.

## Critério de qualidade antes de finalizar UI

Antes de mergear UI, validar:

1. [ ] `npm run lint` passa (ou justificar warning).
2. [ ] `npm run build` passa (Turbopack production).
3. [ ] Desktop 1440px: hero, showcase, pricing e contact visíveis sem
       overflow nem cortes.
4. [ ] Mobile 390px: primeiro viewport mostra título completo, badge,
       subtitle e CTAs (mesmo que stats fiquem abaixo da dobra).
5. [ ] Sem overflow horizontal (`document.scrollingElement.scrollWidth <=
       window.innerWidth`).
6. [ ] H1 do DOM lê como frase única, com espaço entre as partes.
7. [ ] Stats não exibem valores quebrados ("0 ano", "0/7", "0Live").
8. [ ] Pelo menos 1 case study (`/projects/[slug]`) abre e renderiza
       sem crash.
9. [ ] Toggle PT|EN troca todos os textos visíveis no fold do hero.
10. [ ] Acessibilidade básica: H1 único, alt em imagens, contraste
        suficiente em texto sobre vídeo (vignette ativo em mobile).

## Anti-patterns conhecidos (não fazer)

- Promessa de prazo agressivo sem qualificação ("entrega em 3 semanas").
- Linguagem "exército de IAs" que assusta cliente PME.
- Stats compostos animados ("1 ano" virando "0 ano" durante CountUp).
- Vídeo de produto com texto/UI gerado por IA contendo typos visíveis.
- Blob 3D que cobre o título principal em viewport mobile.
- H1 com duas partes em `<span class="block">` sem text node entre elas.
- Card grid 2-col genérico tipo "portfolio template 2018" no showcase.

## Regras — Assets visuais de projetos (crítico para honestidade)

- Toda imagem usada em showcase, universe, case ou hero de projeto **deve ser prova real**:
  - Screenshot real do app em produção (dashboard, tela de ferramenta, render gerado).
  - Ou vídeo real do fluxo (demo loop muted).
  - Ou arte oficial do produto (logo + mock fiel criado para o caso).
- **Nunca** usar como "prova principal":
  - Landing page / marketing hero (pode usar como complemento ou gallery secundária).
  - Generic AI-generated "cyber dashboard", "3D nodes", "futuristic control room" (mesmo que bonito).
  - Print de GitHub repo page (para ferramentas internas, usar terminal mock fiel ou descrição + link GitHub explícito).
  - Imagem com erro visível ("Failed to fetch", loading state quebrado).
- Covers editoriais (webp com gradient + ilustração) são permitidos **só** como background artístico no card, nunca substituindo o print real do produto.
- Todo projeto deve ter pelo menos 1 visual principal + 1 de suporte (gallery) ou vídeo. Projetos sem: fallback para terminal fiel ao escopo (nunca genérico).
- Regra de nome: `projects/slug.png` = print principal do produto; `covers/slug-cover.webp` = editorial opcional; `gallery/slug-*.png` = flows específicos com legenda PT/EN.
- Antes de commit: abra a imagem localmente e confirme "isso representa o que o cliente/usuario ve?".

## Regras — Apresentação de muitos projetos (escala >6)

- Dois níveis:
  1. Showcase cinematográfico: 4-6 flagships max. Full-bleed alternating, GSAP scrub/parallax, hover com Problem/Delivery/Result. CTAs contextuais (live primeiro).
  2. ProjectUniverse / galeria densa: **todos** os projetos. Foco em imagem + ações diretas.
- Cards na galeria densa:
  - Imagem é o portal principal: se live existir, clicar na imagem abre o live em nova aba.
  - Ícones de live/github **são links reais** (stopPropagation).
  - Card inteiro linka para case study (detalhe).
  - No hover da imagem: badge "LIVE" ou "GITHUB" visível + CTAs.
- Filtros: chips de categoria + busca (nome/tech/categoria). Mudança de filtro **anima** os cards (stagger fade+translate+scale via GSAP, 0.3-0.4s).
- Adicionar: search, status pills fortes, 2-3 metrics mini, tech stack.
- Copy posiciona "aqui você vê o volume real de entregas" sem diminuir o "resto".
- Evitar: grid 2-col genérico sem motion; cards sem link direto para o que o visitante quer ver primeiro (o produto rodando).

## Regras — Motion system (nível premium)

- Libs canônicas: Lenis (root smooth), GSAP + ScrollTrigger (orquestração de scroll, filtros, timelines, parallax), Framer Motion (hover isolado, entrance simples, layout).
- Sempre: LenisProvider no root + integração ticker com ScrollTrigger.
- GSAP para: re-layout de grids/filtros (stagger), showcase storytelling (scrub + reveal), scroll-triggered sections.
- Framer para: micro tilt/hover (spring sutil), whileInView entrance (amount 0, once, delay escalonado).
- Regras de uso:
  - Filtro ou busca em galeria → GSAP fromTo nos cards (nunca re-render seco).
  - Card de projeto → hover com scale + border + (tilt se 3D ok) + overlay de ações.
  - Texto longo → SplitType + GSAP chars só em hero ou headlines importantes.
  - Scroll story (showcase) → scrub parallax na imagem, content reveal no enter, opcional pin breve (cuidado mobile).
- Easings preferidos: "expo.out", "power2.out", "none" para scrub.
- Duração: entrance 0.4-0.7s, micro 0.2-0.35s, scrub controlado pelo usuário.
- Reduced motion: globals.css já zera. Testar sempre (conteúdo visível imediato).
- Performance: 60fps em 1440p + mobile. Evitar pin agressivo que "prende" o scroll.
- Inspiração permitida: gsap.com (scroll + UI interactions), inspira-ui.com (componentes com motion rico: flip, morph, rainbow, stars), lenis.dev (buttery foundation).

## Checklist qualidade UI (adicional ao anterior)

- [ ] Imagens de projeto: todas são prova real do produto (não generic, não erro, não LP como principal).
- [ ] Cards de galeria: imagem linka direto para live (quando existe); ícones de live/github são clicáveis; animação no filtro/search.
- [ ] Case study de todo projeto abre com pelo menos 1 visual + métricas + CTAs.
- [ ] Motion: filtro/galeria tem stagger GSAP; showcase tem scrub + reveal; tilt/hover em cards.
- [ ] Sem dead code (ex: FeaturedWork não usado → removido ou documentado).
- [ ] Mobile 390: cards não cortam, CTAs acessíveis, imagem não perde sentido.
- [ ] Métricas: reais ou arredondamento honesto (sem "247+ clients" inventado).
- [ ] Antes de "UI done": leia DESIGN.md completo + rode build + teste /pt e /en + pref reduced-motion.

---

Última revisão: 2026-06 — Atlas (Fase 1 do Project Presentation System).

**Referência obrigatória:** docs/specs/2026-06-03-project-presentation-system.md

- ProjectV2 schema agora é a fonte da verdade para dados de projetos (role, proofLevel, visualKind, primaryCta, casePriority, shortDescription, tags, links expandidos).
- Capa editorial (coverImage) × prova real (image/gallery/video) — separação explícita e auditada.
- Hub de projetos e CaseStudyHero devem seguir a spec (CTA acima da dobra, links claros na imagem, filtros animados).
- Antes de qualquer mudança em universe/showcase/case-study: rode `npm run audit:projects`.

Regras de assets e motion do spec prevalecem sobre seções antigas deste arquivo quando houver conflito.

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

---

Última revisão: 2026-05-22 — Atlas, sob direção do Jean (founder).

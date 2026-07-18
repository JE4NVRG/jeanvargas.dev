# DESIGN-GLOBAL — Padrão de Frontend para JE4NDEV + Agentes (Atlas, Codex, Hermes, etc)

**Propósito:** Garantir que todo frontend produzido por humanos ou agentes (Atlas, Codex, Luna, Sage, Vega, profiles Hermes) seja **premium, honesto, com motion de nível GSAP/inspira-ui, prova visual real, e nunca "pessimo" ou genérico**.

Este é o documento canônico. Todo mundo lê ANTES de qualquer UI (landing, dashboard, case, pricing, onboarding, etc).

**2026-06 Update (Project Presentation System):**  
Leia primeiro `docs/specs/2026-06-03-project-presentation-system.md`.  
O schema ProjectV2 + regras de hub/case/asset-audit agora são obrigatórias para qualquer listagem de "muitos itens" (projetos, features, cenas, perfis etc).

Versão derivada da auditoria do portfolio je4ndev.com (2026-05) + DESIGN.md específico + lições de ArchScene/Renderia/NexPanel + inspirações gsap.com / lenis.dev / inspira-ui.com.

---

## Princípios Inquebráveis

1. **Honestidade visual primeiro** — O visitante/cliente deve ver "produto rodando" em 5s. Não promessa, não slide, não generic AI viz, não LP como prova de SaaS.
2. **Motion é parte do produto, não enfeite** — Usar Lenis + GSAP + Framer de forma intencional e performática. Micro-interactions físicas (magnetic, tilt, stagger, scrub). Nunca "só opacity".
3. **Escala sem virar template** — Quando N projetos/features >6, a galeria deve ser visual-first + links diretos + filtros animados + busca. Não grid 2-col genérico.
4. **Assets são prova ou nada** — Imagem que não representa o que o usuário final vê = dívida técnica + perda de credibilidade.
5. **Agentes não inventam** — Sem mock genérico, sem "eu construí" quando é agência, sem métricas falsas. Sempre real ou "demo interna (código aberto)".
6. **Dark premium editorial** — Paleta, tipo e tokens definidos. Desvio exige justificativa explícita.

---

## Stack Obrigatória (2026+)

- Next.js 16+ App Router + Turbopack
- React 19 + TypeScript strict
- Tailwind + tokens (design-tokens.css)
- Geist Sans + Geist Mono
- Animação: Lenis (root), GSAP/ScrollTrigger (orquestração), Framer Motion (micro)
- i18n (PT-BR default + EN)
- Imagens: next/image, webp prioritário, otimizado

Nunca voltar para n8n/Replit/Docker como principal (decisão Jean).

---

## Paleta e Tokens (copiar de je4ndev como base)

Ver src/styles/design-tokens.css no portfolio para valores exatos (bg #050505, cyan #5EEAD4, violet #8B5CF6, emerald #10B981, amber, zincs, radii, shadows, type scale).

Usar SEMPRE via CSS vars ou Tailwind config. Nada de cores hard-coded fora da paleta.

---

## Assets Visuais (REGRA DURA — origem da queixa "imagens que nao tem nada haver")

**O que pode ser usado como imagem principal de produto/projeto:**

- Screenshot real do app rodando (desktop ou mobile do que o cliente usa).
- Render real gerado pela ferramenta (ex ArchScene outputs lado a lado).
- Vídeo real do fluxo (demo, terminal, render em lote) — autoplay muted loop.
- Arte oficial criada para o produto (mock fiel, não genérico).

**O que NUNCA usar como prova principal:**

- Landing page / marketing hero (pode ser gallery secundária ou "como funciona").
- Generic cyber/AI dashboard 3D com nós, código flutuante, glows (mesmo se lindo).
- Print de GitHub (exceção: quando o produto É o repo aberto e não há UI pública; documentar).
- Estado de erro, loading vazio, "failed to fetch".
- Imagem de outro projeto ou stock.

**Covers editoriais:** permitidos como fundo artístico do card (gradient + ilustração), mas o print real deve estar presente e ser o foco.

**Galeria por projeto:** mínimo 1 principal + 1 suporte. Legenda PT/EN.

**Antes de subir imagem:** abra o arquivo e pergunte "isso mostra o que o usuário final realmente vê e usa?" Se não, refaça ou não use.

---

## Apresentação de Projetos / Muitos Itens (escala)

Quando o produto ou portfolio tem 6+ itens:

- Nível 1 (flagships): cinematic showcase (full-bleed alternating, GSAP scrub/parallax, hover com contexto problema/entrega/resultado). 4-6 max.
- Nível 2 (tudo): galeria densa (universe/grid).
  - Cards: imagem grande como portal.
  - Se o item tem live/demo público: clicar na **imagem** abre o live (nova aba).
  - Ícones de live/github no card são links reais (não decorativos).
  - Card inteiro → case study ou detalhe.
  - Hover na imagem revela badge "LIVE" + CTAs rápidos.
  - Filtros (categoria + status) + busca (nome/tech/descrição).
  - **Toda mudança de filtro/busca anima os cards** (GSAP stagger fade/y/scale).
- CTAs primários sempre visíveis na galeria: não force o visitante a entrar no case para descobrir se tem live.

Evite: "aqui em cima os legais, aqui embaixo o resto". Trate volume como prova de capacidade.

---

## Motion System (nível que deixa de ser "pessimo")

**Fundação:**
- LenisProvider no layout root (smooth wheel, integrado com GSAP ticker).
- GSAP + ScrollTrigger registrado.

**Quando usar o quê:**

- **GSAP/ScrollTrigger:** 
  - Storytelling de scroll (showcase, landing sections).
  - Filtros, grids, re-layout (stagger, FLIP-like).
  - Parallax sutil, scrub, pinning breve (cuidado mobile).
  - Timelines complexos, text split avançado.

- **Framer Motion:**
  - Hover/tilt/magnetic isolado (spring 300/30, 5deg max).
  - Entrance simples (whileInView opacity+y, amount:0, once, delay escalonado).
  - Layout animation em listas pequenas.

- **Lenis:** base de tudo. Não use só "scroll-behavior: smooth".

**Regras práticas:**
- Filtro/busca em galeria → GSAP fromTo nos cards (0.3-0.4s, stagger 0.02-0.04).
- Cards de projeto → hover com scale 1.02-1.03 + border accent + (tilt ou depth).
- Showcase/sections longas → scrub na imagem + content reveal no enter.
- Texto hero → char stagger (RevealText ou SplitType + GSAP).
- Easings: expo.out / power2.out / none (scrub).
- Durações: micro 0.2-0.35s, entrance 0.5-0.7s, scrub = usuário.
- Sempre teste: 1440p 60fps + iPhone 390 + prefers-reduced-motion (conteúdo aparece imediato, sem depender de anim).
- Evite: pin agressivo que prende scroll, animações que travam o essencial, motion só "porque tem lib".

**Inspiração de referência (obrigatório consultar antes de UI complexa):**
- gsap.com (Scroll, UI Interactions, Text, exemplos de marcas grandes).
- lenis.dev (buttery foundation + showcase).
- inspira-ui.com (componentes com motion rico: flip, morph tabs, rainbow, stars bg, flip card — copie o feeling, adapte pro nosso stack).

---

## Checklist Antes de "UI Pronta" (obrigatório para agentes)

Além de lint + build + mobile 390 + sem overflow:

- [ ] Imagens de projeto são prova real (abrir cada uma e confirmar).
- [ ] Galeria com N>6: imagem linka direto para live quando existe; filtros animados com GSAP; busca funcional; CTAs diretos visíveis.
- [ ] Motion: pelo menos 1 uso intencional de GSAP (filtro/scroll) + micro framer em cards/hovers. Testado reduced-motion.
- [ ] DESIGN-GLOBAL + DESIGN.md do projeto lidos e seguidos (citar no PR).
- [ ] Métricas reais ou honestas (sem inventar).
- [ ] Copy: direto, sem "exército de IAs", sem prazo agressivo, tom PT-BR coloquial.
- [ ] Acessibilidade básica + contraste.
- [ ] Sem dead code ou componentes não usados.

---

## Anti-Patterns de Agente (nunca fazer)

- Usar generic AI dashboard / cyber viz como "print do produto".
- Fazer card grid 2-col sem motion ou links diretos e chamar de "showcase".
- Colocar animação que some com o conteúdo se travar.
- Copiar shadcn/ui puro sem elevar para o nível de polimento (motion, depth, hover físico).
- Inventar métricas ou flows que não existem.
- Ignorar "leia DESIGN antes".
- Deixar imagens sem alt ou com nomes genéricos.
- Fazer LP linda mas o "produto" por trás é só promessa.

---

## Como Aplicar em Qualquer Projeto (ArchScene, NexPanel, novo SaaS, etc)

1. Copie os tokens/paleta do portfolio como base (ajuste accents por produto: Amber para ArchScene, etc).
2. Defina "o que é prova visual" para aquele produto (renders para ArchScene, dashboard real para SaaS, terminal para Hermes/OpenClaw).
3. Se tem "muitos" (projetos, cenas, features): aplique o padrão galeria densa + links diretos + filtro animado.
4. Sempre use LenisProvider + GSAP integration.
5. Rode o checklist completo.
6. Se duvida: "como ficaria se usássemos GSAP/inspira level aqui?" — faça.

---

## Evolução

Este documento é vivo. Toda auditoria de UI (como a do portfolio 2026-05) deve atualizar este arquivo + o DESIGN.md específico do projeto.

Agentes: quando Jean disser "faz o front" ou "melhora a UI", a primeira ação é ler DESIGN-GLOBAL.md + DESIGN.md do projeto.

---

**Leitura obrigatória para Atlas/Codex/Hermes/etc:**
- Este DESIGN-GLOBAL.md
- DESIGN.md do projeto específico (ex: no portfolio)
- src/styles/design-tokens.css + globals.css do projeto
- Exemplos reais: o portfolio atualizado pós-auditoria + ArchScene (quando tiver o mesmo padrão aplicado)

Última atualização: 2026-05 (após auditoria completa do je4ndev portfolio, com fixes de links em imagens, search, animação de filtro, regras de assets e motion).

---

Cópia deste arquivo deve viver no vault (04_Memory/ ou equivalente) para Sage/Vega/Luna também lerem.
# Portfolio Presentation System — je4ndev.com

**Data:** 2026-06-03  
**Autor da spec:** Atlas (seguindo plano do agente Jean + auditoria consolidada)  
**Status:** Fase 0 — Spec aprovada antes de qualquer edição de UI/código-fonte (conforme instrução "auditoria feita sem editar arquivos nesta etapa" e "Só depois disso mexer em UI").  
**Repo:** https://github.com/JE4NVRG/jeanvargas.dev.git (origin/main @ cb11a7c + mudanças locais em capas/redirects no momento da leitura)  
**Live local:** http://localhost:3004 (conforme info do Jean)

---

## Missão

Transformar o je4ndev.com de **vitrine linear** (showcase + universo de cards) em um **hub vivo de projetos**.

- Imagens certas (prova real do produto, nunca genérica/quebrada/landing como principal).
- Links claros e visíveis (live, GitHub, docs, changelog) com CTAs primários acima da dobra em todo lugar (home hub + case study).
- Prova real (screenshots reais, vídeos de fluxo, renders fiéis, métricas honestas).
- Narrativa curta (shortDescription para cards + long para case; problema/solução/resultado em doses homeopáticas).
- Motion bem usado (Lenis + GSAP ScrollTrigger para storytelling e filtros; Framer para micro; sempre reduced-motion safe; inspirado em inspira-ui.com, lenis.dev, gsap.com).

Resultado: visitante (founder PME, studio, cliente Web3) entende em 10s "esta agência entrega produto de verdade em produção" e tem ação clara (visitar live, ver código, falar comigo).

---

## Diagnóstico Geral (consolidado da auditoria + plano Jean)

O sistema já é forte tecnicamente: Next.js 16.2.3 (Turbopack), React 19, TypeScript strict, Tailwind, GSAP + ScrollTrigger, Lenis (integrado com ticker), Framer Motion, Three.js, lucide-react, dados centralizados em `src/data/projects.ts`, i18n PT/EN, SSG total, SEO/JSON-LD por projeto.

O problema **principal não é stack**. É **direção visual e arquitetura editorial**.

- A página de case (ex ArchScene) abre sem imagem quebrada nem overflow horizontal (desktop + mobile 390px).
- Mas o **primeiro fold é muito textual**: no mobile, só logo (navbar), breadcrumb interno, badges (status/scope/date/category), título e `longDescription` longa. Nenhum CTA externo (live) aparece acima da dobra. O "Visitar site" fica só no fim (case-study.tsx:467+).
- DESIGN.md manda CTAs no fim dos cases (linha 89 original), conflitando com conversão.
- O modelo `Project` é pobre para escalar muitos projetos (atualmente 12).
- Filtros no Project Universe são strings manuais (frágil).
- Links live/GitHub aparecem como ícones pequenos (pouco claros).
- Capas Web3 compartilhadas (web3-security-cover.webp) reforçam o problema apontado: imagem bonita mas genérica.
- FeaturedWork.tsx existe mas é dead code (não importado no page.tsx).
- Duas seções de "work" (Showcase cinematográfico + Universe grid) sem integração clara.

**Falha Arquitetural Central:** Não existe uma **camada de Project Presentation Schema**. Hoje o projeto é tratado como "conteúdo simples" (título + texto + umas imagens). Para 12+ projetos (e crescendo), ele precisa virar **entidade editorial**: prova, mídia, links (múltiplos + primaryCta), status, role/audience, proofLevel, visualKind, prioridade narrativa, tags flexíveis.

---

## Stack Detectada (leitura atual)

- Next.js 16.2.3 App Router + Turbopack
- React 19 + TypeScript strict
- Tailwind + design-tokens.css (Geist Sans/Mono)
- Animação: `@gsap/react`, gsap + ScrollTrigger, lenis, framer-motion, split-type, react-countup
- Três: @react-three/fiber + drei
- UI: lucide-react, react-icons
- i18n: custom provider + translations/en.ts + pt.ts
- Dados: src/data/projects.ts (fonte única)
- Assets: public/projects/* (png/webp), public/videos/*.mp4, public/covers e gallery
- Deploy: systemd no VPS (jeanvargas-dev), webhook GitHub, Cloudflare (historicamente)
- DESIGN: DESIGN.md (específico do portfolio, atualizado com regras de assets em 2026-05) + docs/DESIGN-GLOBAL.md (versão para agentes)

---

## Estrutura Atual (leitura de arquivos)

- `src/app/[locale]/page.tsx`: Hero + TechMarquee + Showcase + ProjectUniverse + GithubProof + Process + Pricing + About + TechStack + Services + Faq + Contact
- `src/app/[locale]/projects/[slug]/page.tsx`: metadata + JSON-LD + <CaseStudy slug={slug} />
- `src/components/sections/`:
  - showcase.tsx (6 flagships hardcoded, full-bleed alternating, GSAP scrub/parallax/hover overlays)
  - project-universe.tsx (grid + filtros manuais + (na leitura atual) busca + links funcionais + imagem como link para live quando existe + GSAP stagger em filter change)
  - featured-work.tsx (implementado com TiltCard mas **não usado**)
- `src/components/projects/case-study.tsx`: breadcrumb + hero textual pesado + video (se existir) + ProjectVisuals (main + gallery ou terminal fallback para openclaw/hermes) + Business Impact (before/build/result) + todas metrics + tech + Links (mt-12) + Conversion CTA (mt-20) + Next project
- `src/data/projects.ts`: 12 projetos (nexpanel, vultrix-3d, hermes-agentes, archscene, openclaw-gateway, mepchat, gestaoml, hypefc, stopultimate, alchemix-auditor, ethena-scanner, bounty-hunter-mvp). Muitos com image (muitas vezes LP), coverImage (alguns compartilhados genéricos), video, gallery esparsa.
- `src/types/project.ts`: interface atual (links só live+github, category string, image/cover/video/gallery, featured boolean, gradient, etc).
- `public/projects/`: 12 principais + covers/ (7) + gallery/ (~12). Vídeos em public/videos/ (6 úteis).
- `src/i18n/`: translations com work, universe, project namespaces.
- DESIGN.md + docs/DESIGN-GLOBAL.md + docs/AUDIT-FRONTEND-PORTFOLIO-2026-05.md (auditoria anterior).

---

## Pontos Fortes

- Dados centralizados em projects.ts (fácil de auditar/curar).
- Cases estáticos com SEO forte, JSON-LD, alternates por locale.
- Uso real de GSAP/Lenis (showcase parallax, universe stagger, provider integrado).
- Project Universe já tenta mostrar "densidade" (12+ produtos shippados), não só 3 cases.
- Separação coverImage (editorial) vs image (prova real) foi boa direção.
- Build limpo, SSG, mobile 390 testado em partes.
- DESIGN.md + GLOBAL já evoluíram com regras de assets honestos (pós-auditoria 05).

---

## Problemas e Riscos (detalhados)

1. **Schema pobre (projects.ts + types/project.ts)**: 
   - links só {live?, github?}
   - category: string (filtro frágil — veja project-universe.tsx:21-30)
   - Sem role, audience, proofLevel, visualKind, primaryCta, docs, changelog, repo, statusUrl, casePriority.
   - featured boolean insuficiente para priorizar hub/showcase.
   - dateRange misturado string | objeto.
   - metrics sempre array mas variam 3-4; sem tipo de prova.

2. **Case study vira artigo longo antes de produto** (case-study.tsx:305+):
   - Ordem: breadcrumb + badges + h1 + longDescription (muito texto) → video → visuals (mt-12) → impact → metrics → tech → Links (mt-12) → CTA conversão (mt-20).
   - No mobile do /projects/[slug]: primeiro fold só texto + navbar. "Nenhum CTA externo aparece acima da dobra".
   - Conflito direto com DESIGN.md (CTAs no fim) vs conversão real.

3. **Hub de projetos fraco para escala**:
   - Universe: ícones pequenos para links (linha ~198 original), card inteiro só pro case.
   - Filtros manuais por categoria string (não escala com tags múltiplas).
   - Sem busca até melhorias táticas recentes; sem sort, sem proofLevel visual.
   - Capas genéricas (web3-security-cover para 3 projetos diferentes: alchemix, ethena, bounty) — "imagem bonita, mas genérica demais".
   - bounty-hunter-mvp.png mostra erro "Failed to fetch".
   - Muitos usam landing page como "image" (nexpanel, archscene, gestaoml flows, stopultimate branding) em vez de prova do produto interno.
   - Gallery esparsa (muitos 0-1 itens); mismatch de nomes (nexpanel-live.png = LP, gestaoml-live.png existe mas não referenciado).
   - mepchat só cover; hermes/openclaw dependem de GitHub ou terminal mock genérico.
   - Showcase: 6 flagships hardcoded, página longa, pinning não implementado apesar de docstring, imagens nem sempre prova interna.

4. **Motion**:
   - Bom foundation (Lenis + GSAP ticker, ScrollTrigger no showcase/universe, tilt framer).
   - Mas uso limitado: sem FLIP/stagger real em filtros até recente, sem pinning controlado, sem componentes "inspira-ui level" (flip, morph, physical hovers ricos).
   - FeaturedWork (com Tilt) é dead code.

5. **Outros**:
   - FeaturedWork.tsx morto.
   - Sem script de auditoria automatizada (assets, links, campos obrigatórios, arquivos existindo no FS).
   - DESIGN.md tem boas regras de assets (adicionadas pós-auditoria) mas precisa ser reforçado como "capa IA editorial, nunca prova".
   - Risco de bagunça ao adicionar mais projetos sem schema + curadoria + agentes.

---

## Falha Arquitetural

A falha central é a ausência de uma **camada de Project Presentation Schema / Editorial Entity**.

Hoje: `Project` = dados de conteúdo + uns campos de mídia.

Precisa virar: entidade com 
- Prova (visualKind + proofLevel + assets validados)
- Mídia (capa editorial separada de print real; múltiplos tipos)
- Links + ações (primaryCta explícito)
- Narrativa (short + long; role/audience)
- Status e prioridade editorial (para hub, showcase, ordenação)
- Metadados para agentes (casePriority, tags flexíveis)

Sem isso, adicionar o 13º projeto vira bagunça manual de strings, imagens repetidas e CTAs escondidos.

---

## Oportunidades Para Agentes (automatizáveis)

- **Curador de Projetos**: valida se cada projeto tem live (ou github/docs), print real, shortDescription, status, proofLevel.
- **Asset Auditor**: detecta imagem quebrada (fs check), genérica (heurística por nome/pasta ou manifest), cover repetida, vídeo > certo tamanho, alt ruim, gallery faltando.
- **Case Writer**: gera/ valida resumo curto, problema/solução/resultado adaptado por público (PME vs studio vs Web3), CTA primário.
- **Motion QA**: valida presença de LenisProvider, GSAP contexts, prefers-reduced-motion handling, ausência de overflow, perf mobile.
- **DESIGN.md Guardian**: bloqueia PRs com UI genérica (card grid sem motion/links), capa IA como prova principal, CTAs abaixo da dobra em cases.
- **Link Monitor**: checa (em CI ou script) se live/github/docs/changelog retornam 200 (ou nota "demo on request").

Criar script `npm run audit:projects` que roda todos acima + relatório markdown.

---

## PRD Atualizado

**Objetivo:** Apresentar muitos projetos (12+) como **prova comercial e técnica** da JE4NDEV — hub vivo, não vitrine linear.

**Funcionalidades principais:**
- Hub de projetos (ProjectHub) com busca, filtros multi-tag/status/proofLevel, ordenação (casePriority, recent, live-first).
- Cards (ProjectCard) com: capa editorial (coverImage), status pill forte, stack chips, um resultado chave (metric principal), proof badge (public-live etc), links claros (live/GitHub/docs como botões ou overlay na imagem).
- Case study reestruturado: CaseStudyHero (visual hero grande + primary CTA(s) + short narrative + status/role acima da dobra) → depois prova, galeria, impacto detalhado, etc.
- Sistema de capas editoriais (bonitas, gradients, ilustrações) **sempre separado** de print real (image/gallery/video).
- Motion sutil e controlado: Lenis root + GSAP para hub filters/stagger/scroll story + Framer para cards hovers/tilt. 60fps + reduced-motion first.
- Por projeto: primaryCta sugerido, múltiplos links, changelog/docs quando existirem.

**Critérios de sucesso (medíveis):**
- 100% dos projetos com asset correto ou fallback honesto (terminal fiel ao escopo, nunca genérico vazio).
- CTA primário (live ou github ou "falar sobre projeto") visível acima da dobra em desktop **e** mobile 390px tanto no hub quanto no case individual.
- Zero imagem quebrada / erro visível / generic Web3 stock repetido como prova.
- Zero overflow horizontal em 390px.
- Cada projeto com live | github | docs quando existir (e ícones/botões claros, não só decorativos).
- Filtros do hub usam tags + proofLevel (não só strings manuais de category).
- Script audit:projects roda limpo (ou lista gaps acionáveis).
- DESIGN.md / GLOBAL atualizado com as regras novas e "Guardian" checklist.

---

## SDD Técnico

**Recomendações de implementação (só após aprovação desta spec):**

1. **Evoluir schema**:
   - Criar/atualizar `src/types/project.ts` → `ProjectV2` (ou versionar e migrar `projects` para V2).
   - Adicionar campos conforme abaixo.
   - Manter compatibilidade temporária ou migration helper.

2. **Dados**:
   - Manter `src/data/projects.ts` como fonte (agora tipado V2).
   - Ou extrair `src/data/project-assets.ts` (manifesto por slug com paths validados + visualKind + proofLevel).
   - Adicionar `src/data/projects-v2.ts` ou atualizar o array.

3. **Componentes novos/reescritos** (em src/components/projects/ ou sections/):
   - `ProjectHub.tsx` (substitui ou envolve o Universe atual): grid/masonry responsivo, busca, filtros multi (tags, status, proofLevel, role), sort, contagem, "ver todos / ver flagships".
   - `ProjectCard.tsx`: visual-first, imagem com link direto para primaryCta quando possível, badges, stack, resultado, links secundários.
   - `CaseStudyHero.tsx`: hero visual (usa ProjectMediaFrame), status/role/audience, shortDescription, primary CTA buttons (acima da dobra), secondary links.
   - `ProjectMediaFrame.tsx`: switch por visualKind (img, video, terminal/CodeTerminal custom, mixed gallery, github-embed note).
   - `ProofRail.tsx` ou similar: barra de métricas + "Prova real" (ícones de live public, open source, etc).
   - `ProjectLinks.tsx`: componente reutilizável de botões/links (usado no hub card, no hero, no rodapé do case).
   - Atualizar `CaseStudy.tsx` para usar o novo Hero no topo e mover o conteúdo longo para baixo.

4. **Script de auditoria**:
   - `scripts/audit-projects.ts` (ou em package.json "audit:projects").
   - Carrega projects, verifica:
     - Campos obrigatórios por proofLevel.
     - Arquivos de image/cover/video/gallery existem no FS (fs.existsSync).
     - Nomes seguem convenção.
     - Sem covers repetidos para projetos diferentes.
     - Live urls (se quiser, fetch HEAD com timeout, ou só reportar).
     - Gera relatório markdown + exit code 1 se gaps críticos.
   - Integrar no CI (se houver) ou pre-commit.

5. **Motion system único**:
   - Centralizar em `src/lib/motion.ts` ou hooks (useProjectCardHover, useHubFilterTransition, useScrollStory).
   - Sempre: `prefers-reduced-motion` → no-op ou instant.
   - GSAP para: filter transitions no Hub (stagger + FLIP-like), Showcase scroll (scrub + pin controlado + progress).
   - Lenis já presente — garantir que todo scroll story use o mesmo.
   - Framer apenas para isolated (tilt, button spring, entrance leve).
   - Adicionar prefers-reduced no globals.css já existe; testar explicitamente.

6. **Atualização DESIGN**:
   - Reforçar em DESIGN.md (portfolio) e DESIGN-GLOBAL.md as regras de:
     - Capa IA = editorial apenas; prova = real product screenshot/video/render.
     - Hub como "living system" (busca + filtros animados + links na imagem).
     - Case: hero visual + primary CTA(s) acima da dobra (mobile e desktop). Long text depois.
     - "Nenhum card de projeto sem primary action visível".
     - Checklist do Guardian no final de todo DESIGN.
   - Adicionar seção "Project Presentation System" com referência a esta spec.

7. **Outros**:
   - Expandir i18n project.* com novas strings (hub filters, proofLevel labels, etc).
   - Manter featured para compat, mas priorizar casePriority.
   - Para projetos sem live público (hermes, openclaw): primaryCta = "github" ou "contact", com nota clara "demo interna — código aberto / solicite acesso".
   - Sitemap/metadata já bom — manter.

---

## Schema ProjectV2 (proposto)

```ts
// src/types/project.ts (evoluído)

export type ProjectStatus = "live" | "mvp" | "development" | "case" | "internal" | "demo";

export type ProofLevel = "public-live" | "public-demo" | "private-demo" | "internal" | "case-only";

export type VisualKind = 
  | "product-screenshot" 
  | "ai-render" 
  | "dashboard" 
  | "terminal" 
  | "video-demo" 
  | "mixed" 
  | "branding" 
  | "github-repo";

export type ProjectRole = 
  | "client-saas" 
  | "internal-tool" 
  | "agency-platform" 
  | "open-source" 
  | "game-social" 
  | "web3-audit" 
  | "ai-render";

export interface ProjectV2 {
  slug: string;
  title: { en: string; pt: string };
  shortDescription: { en: string; pt: string }; // para cards/hub (1 linha)
  longDescription: { en: string; pt: string };

  status: ProjectStatus;
  role: ProjectRole;
  audience: string[]; // ex: ["founders-pme", "studios-arquitetura", "web3-auditors"]
  proofLevel: ProofLevel;
  visualKind: VisualKind;

  dateRange: string | { en: string; pt: string };
  category: string; // manter para retro + tags derivadas
  tags: string[]; // flex: "saas", "ai", "web3", "marketplace", "3d", etc.
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
    docs?: string;
    changelog?: string;
    status?: string; // ex: status page ou uptime
    // mais se precisar
  };
  primaryCta: "live" | "github" | "docs" | "contact" | "none";

  image?: string;           // prova real principal (screenshot/render)
  coverImage?: string;      // editorial para cards/hub (nunca a prova)
  video?: string;           // demo loop
  gallery?: Array<{
    src: string;
    title: { en: string; pt: string };
    description: { en: string; pt: string };
  }>;

  gradient?: string; // visual legacy — pode mover para presentation layer
  featured?: boolean; // legacy
  casePriority: number; // 1 = top showcase/hub, 10 = baixo

  scope: { en: string; pt: string };
}
```

Funções helper: getProjectBySlug, getNext, getFeaturedByPriority, filterByTags etc.

Migrar os 12 existentes (preencher role/proofLevel/visualKind/primaryCta/tags/audience/shortDescription/casePriority com bom senso + curadoria).

---

## Checklist de Assets (por projeto — baseline da leitura atual + gaps)

**Todos os projetos devem passar no audit:projects:**

- **nexpanel** (SaaS live, public-live): image=LP (gap), cover=editorial OK, gallery=signup (parcial). Precisa: screenshot real dashboard ou "nexpanel-dashboard.mp4" (existe no disco mas não referenciado nos dados). primaryCta=live.
- **vultrix-3d** (SaaS live): image=print?, cover OK, video=printer OK, gallery=tool+services OK. Bom exemplo.
- **hermes-agentes** (AI Orchestration live, internal-ish): image=GitHub (gap), cover=abstract nodes OK (editorial), video=agents OK, gallery=GitHub OK. Nota: "demo interna — código aberto". primaryCta=github.
- **archscene** (AI Platform live): image=LP (gap), cover OK, video=kitchen (bom, mas render real melhor), gallery=changelog+examples (bom). Usar renders reais da galeria pública como prova principal.
- **openclaw-gateway** (AI Infra): image=provavelmente genérico, cover OK, video=terminal OK. Fallback CodeTerminal custom (já tem lógica especial). primaryCta=github.
- **mepchat** (AI Chatbot mvp): só cover. Gap grave: sem image/galley. Fallback ou remover do hub principal.
- **gestaoml** (SaaS live): image=LP?, gallery=pricing+signup (marketing). Gap: live dashboard print. Existe gestaoml-live.png no disco mas não usado.
- **hypefc** (Sports live): image=dashboard real (bom!). gallery=live OK.
- **stopultimate** (Game live): image=branding (parcial), sem gallery/video. Gap: screenshot do jogo + juiz IA.
- **alchemix-auditor** (Web3 live): image=UI real bom, cover=web3 genérico compartilhado (problema). primaryCta=live.
- **ethena-scanner** (Web3 live): image=UI real bom, cover=genérico compartilhado (problema).
- **bounty-hunter-mvp** (Web3 internal): image=erro "Failed to fetch" (crítico — quebrado), cover=genérico. Gap: screenshot decente ou remover do hub público.

**Regras gerais do checklist:**
- 1 image (prova real) ou video ou terminal fiel por projeto.
- coverImage opcional (editorial), nunca substitui a prova.
- gallery mínima 1 se image não suficiente.
- Sem repetição de cover genérica entre projetos de categorias diferentes.
- Verificar fs.exists para todos paths em build time ou no script.
- Para "internal" ou "mvp sem public live": explicitar no proofLevel + nota honesta.

---

## Regras Novas para DESIGN.md e DESIGN-GLOBAL.md (adicionar)

No DESIGN.md (portfolio):
- Adicionar/atualizar seção "Project Presentation System" apontando para esta spec.
- Reforçar: "Capa editorial (coverImage) é permitida e desejada para densidade visual no hub. Prova de produto (image/gallery/video) é obrigatória e vem primeiro no case hero."
- "Em todo case individual (/projects/[slug]): CaseStudyHero com visual + primary CTA(s) + short desc **acima da dobra** (mobile 390 e desktop). Long text, impact e métricas vêm depois."
- "Hub (ProjectHub): imagem no card é portal para primaryCta quando existir. Links secundários sempre visíveis e clicáveis. Filtros animados (GSAP). Busca presente."
- "Nenhum projeto entra no hub sem passar no audit:projects (assets + campos V2)."
- Atualizar checklist de qualidade: adicionar "CTA primário visível acima dobra no case", "Hub mostra links claros na imagem", "Assets validados por script".

No DESIGN-GLOBAL.md:
- Integrar seção "Project Presentation" com os mesmos princípios (aplicável a qualquer produto com "muitos itens": features de ArchScene, perfis Hermes, etc.).
- Adicionar "Agent Guardian" como processo: antes de qualquer UI de listagem/galeria/case, rodar o auditor e curador.

---

## Plano Em Fases (exatamente como proposto + detalhes)

**Fase 0:** Escrever spec em `docs/specs/2026-06-03-project-presentation-system.md` (esta) e atualizar regras propostas do DESIGN.md / DESIGN-GLOBAL.md (referenciar, sem editar código ainda). Validação com Jean. **(Concluída com esta criação de arquivo)**

**Fase 1:** Evoluir o schema dos projetos (ProjectV2 em types + data) e auditar todos os assets (usar o checklist acima + script inicial). Curadoria manual dos 12 (preencher role/proofLevel/primaryCta/shortDescription/tags/casePriority + arrumar paths de assets quebrados/genéricos). Commit só da spec + dados + script (sem UI).

**Fase 2:** Redesenhar Project Universe → ProjectHub (busca, filtros multi, cards com links claros na imagem, animação GSAP, ordenação por casePriority). Manter Showcase como flagships ou integrá-lo.

**Fase 3:** Redesenhar case study com CaseStudyHero (visual + CTA acima dobra) + ProjectMediaFrame + ProofRail + reordem do conteúdo (links e CTAs cedo). Manter o resto do case (impact etc) como "artigo de prova" abaixo.

**Fase 4:** Adicionar/enriquecer motion com GSAP/Lenis de forma controlada (hub filter transitions, hero scroll se aplicável, consistent reduced-motion, perf test).

**Fase 5:** Criar agentes/checklists (Curador, Asset Auditor, etc.) + script `npm run audit:projects` rodando em CI/pre-push + documentação em DESIGN-GLOBAL para manutenção contínua do portfólio sem virar bagunça ao adicionar o 13º, 20º projeto.

---

## Entregáveis Imediatos desta Spec (Fase 0)

- Este arquivo em `docs/specs/2026-06-03-project-presentation-system.md`.
- Referência clara nas próximas edições de DESIGN.md e DESIGN-GLOBAL.md (será feita em Fase 0/1 controlada).
- Lista de projetos + gaps de assets (acima) para curadoria na Fase 1.
- Definição de componentes e script para implementação controlada.

**Próximo passo seguro após aprovação:** só então iniciar Fase 1 (schema + auditoria de assets via script/leitura) e depois UI (Fase 2+).

---

**Leituras realizadas para esta spec (sem edições de fonte):** 
- src/types/project.ts, src/data/projects.ts (schema + 12 projetos completos), src/components/projects/case-study.tsx (ordem + ProjectVisuals + links), src/components/sections/project-universe.tsx (filtros, cards, links atuais), src/components/sections/showcase.tsx, src/app/[locale]/page.tsx, src/app/[locale]/projects/[slug]/page.tsx, src/components/layout/navbar.tsx, i18n translations (project namespace), DESIGN.md (regras de assets existentes), docs/DESIGN-GLOBAL.md, docs/AUDIT-FRONTEND-PORTFOLIO-2026-05.md, public/projects/** (lista completa de assets via shell), public/videos/*.

Esta spec é a "primeira tarefa segura". Aguardando aprovação para qualquer mudança em código/UI.

---

Fim da spec.
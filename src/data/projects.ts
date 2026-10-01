import type { Project } from "@/types/project";
import { mepMailProject } from "./mepmail-project";
import { noraProject } from "./nora-project";

// Nota Fase 1 (spec 2026-06-03): estamos migrando para ProjectV2.
// Mantemos o alias para não quebrar código que usa Project.
// Todos os objetos abaixo foram curados com os novos campos obrigatórios.

const existingProjects: Project[] = [
  {
    slug: "nexpanel",
    title: "NexPanel",
    description: {
      en: "Operations SaaS for client management",
      pt: "SaaS operacional para gestão de clientes",
    },
    shortDescription: {
      en: "Clients, servers, credits, activations, due dates, financial controls and team permissions in one dashboard.",
      pt: "Clientes, servidores, créditos, ativações, vencimentos, financeiro e permissões de equipe em um só dashboard.",
    },
    longDescription: {
      en: "NexPanel replaces spreadsheet-based operations with a tenant-aware product for client lifecycle, servers, apps, credits, activations, renewals, finance and team access. The public evidence includes the live commercial surface, signup flow and a reviewed dashboard capture; customer records and activation integrations remain private.",
      pt: "O NexPanel substitui a gestão em planilhas por um produto com isolamento por tenant para ciclo de clientes, servidores, apps, créditos, ativações, renovações, financeiro e acesso da equipe. A prova pública inclui a superfície comercial ao vivo, o cadastro e uma captura revisada do dashboard; registros de clientes e integrações de ativação permanecem privados.",
    },
    status: "live",
    role: "client-saas",
    audience: ["gestao-de-clientes", "operacoes-com-servidores", "equipes-operacionais"],
    proofLevel: "public-live",
    visualKind: "dashboard",
    scope: { en: "Product + full-stack SaaS", pt: "Produto + SaaS full-stack" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "operations", "billing", "multi-tenant", "credits"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    problem: {
      en: "Operations teams were splitting client due dates, server credits, activations and cash flow across spreadsheets and messages, making handoffs and accountability fragile.",
      pt: "Operações de clientes separavam vencimentos, créditos dos servidores, ativações e caixa entre planilhas e mensagens, tornando handoffs e responsabilização frágeis.",
    },
    solution: {
      en: "I shaped and built a single operational workflow with client status, servers, credit consumption, activation queue, finance, role-based access and an action log.",
      pt: "Modelei e construí um fluxo operacional único com status de clientes, servidores, consumo de créditos, fila de ativações, financeiro, acesso por papel e log de ações.",
    },
    deliveryRecord: {
      responsibility: {
        en: "Product architecture, UX, full-stack delivery and operational modelling with the operations workflow.",
        pt: "Arquitetura de produto, UX, entrega full-stack e modelagem operacional junto ao fluxo da operação.",
      },
      architecture: {
        en: "Next.js and TypeScript application backed by Supabase, tenant-scoped data, role permissions and modules for clients, servers, credits, activations and finance.",
        pt: "Aplicação Next.js e TypeScript com Supabase, dados por tenant, permissões por papel e módulos de clientes, servidores, créditos, ativações e financeiro.",
      },
      currentState: {
        en: "The public product, signup and operations dashboard are live; the reviewed capture demonstrates the operational modules with sanitized data.",
        pt: "O produto público, o cadastro e o dashboard da operação estão no ar; a captura revisada demonstra os módulos operacionais com dados sanitizados.",
      },
      limitations: {
        en: "Public proof does not expose customer records, activation-provider credentials, private APIs, performance volume or revenue claims.",
        pt: "A prova pública não expõe registros de clientes, credenciais de provedores de ativação, APIs privadas, volume de operação nem faturamento.",
      },
    },
    metrics: [
      { value: "Live", label: { en: "Public product", pt: "Produto público" }, color: "green", verified: true },
      { value: "Clients", label: { en: "Lifecycle and due dates", pt: "Ciclo e vencimentos" }, color: "purple", verified: true },
      { value: "Credits", label: { en: "Servers and activations", pt: "Servidores e ativações" }, color: "cyan", verified: true },
      { value: "Audit", label: { en: "Roles and action log", pt: "Papéis e log de ações" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://nexpanel.agenciamep.com",
    },
    primaryCta: "live",
    casePriority: 5,
    image: "/projects/captures/nexpanel-dashboard.webp",
    coverImage: "/projects/covers/nexpanel-cover.webp",
    assetReview: {
      status: "approved",
      sourceUrl: "https://nexpanel.agenciamep.com",
      reviewedAt: "2026-09-02",
      note: {
        en: "Live public product and sanitized dashboard capture reviewed on 2026-08-10; no customer records or activation credentials are exposed.",
        pt: "Produto público ao vivo e captura sanitizada do dashboard revisados em 10/08/2026; nenhum registro de cliente ou credencial de ativação é exposto.",
      },
    },
    gallery: [
      {
        src: "/projects/gallery/nexpanel-signup.png",
        title: { en: "Account creation flow", pt: "Fluxo de criação de conta" },
        description: {
          en: "Signup experience designed for a low-friction free trial.",
          pt: "Experiencia de cadastro pensada para teste gratis com pouca friccao.",
        },
      },
    ],
    gradient: "from-blue-900 to-indigo-900",
    featured: false,
  },
  {
    slug: "vultrix-3d",
    title: "Vultrix 3D",
    description: {
      en: "Complete management platform for 3D printing businesses",
      pt: "Plataforma completa de gestão para negócios de impressão 3D",
    },
    shortDescription: {
      en: "Precision cost calculator + full ops SaaS for 3D printing studios. Import .3mf/.gcode, auto margins, inventory and billing.",
      pt: "Calculadora de custos de precisão + SaaS completo para estúdios de impressão 3D. Importa .3mf/.gcode, margens automáticas, estoque e financeiro.",
    },
    longDescription: {
      en: "A SaaS platform built for 3D printing professionals and studios. Features a precision cost calculator that imports .3mf and .gcode files, automatically extracts print time and weight, calculates marketplace fees, and suggests optimal pricing with profit margins. Includes inventory management, financial dashboard, and multi-filament support.",
      pt: "Uma plataforma SaaS construída para profissionais e estúdios de impressão 3D. Possui calculadora de custos de precisão que importa arquivos .3mf e .gcode, extrai automaticamente tempo e peso de impressão, calcula taxas de marketplace e sugere precificação ótima com margens de lucro. Inclui gestão de estoque, dashboard financeiro e suporte multi-filamento.",
    },
    status: "live",
    role: "client-saas",
    audience: ["makers-3d", "estudios-impressao", "fabricacao-aditiva"],
    proofLevel: "public-live",
    visualKind: "dashboard",
    scope: { en: "Product + platform", pt: "Produto + plataforma" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "3d-printing", "cost-calculator", "marketplace", "inventory"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    problem: {
      en: "3D printing makers lack professional tools to accurately calculate costs, leading to underpricing and lost profits. Manual calculations are error-prone and time-consuming.",
      pt: "Makers de impressão 3D não têm ferramentas profissionais para calcular custos com precisão, levando à precificação errada e perda de lucro. Cálculos manuais são propensos a erros e demorados.",
    },
    solution: {
      en: "Built a complete SaaS platform with automated cost calculation from print files, marketplace fee integration, inventory management, and financial dashboards — helping makers price correctly and profit.",
      pt: "Construí uma plataforma SaaS completa com cálculo automatizado de custos a partir de arquivos de impressão, integração de taxas de marketplace, gestão de estoque e dashboards financeiros — ajudando makers a precificar corretamente e lucrar.",
    },
    metrics: [
      { value: "Live", label: { en: "Production", pt: "Em produção" }, color: "green", verified: true },
      { value: "3MF", label: { en: "Print-file import", pt: "Importação de arquivo" }, color: "purple", verified: true },
      { value: "G-code", label: { en: "Automatic cost inputs", pt: "Custos automáticos" }, color: "cyan", verified: true },
      { value: "R$", label: { en: "Pricing and margin", pt: "Preço e margem" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://www.vultrix3d.com.br",
    },
    primaryCta: "live",
    casePriority: 6,
    image: "/projects/captures/vultrix-dashboard.webp",
    coverImage: "/projects/covers/vultrix-3d-cover.webp",
    assetReview: {
      status: "approved",
      sourceUrl: "https://www.vultrix3d.com.br/ferramenta",
      reviewedAt: "2026-07-17",
      note: {
        en: "Official financial dashboard capture published on the public Vultrix product page.",
        pt: "Captura oficial do dashboard financeiro publicada na página pública do produto Vultrix.",
      },
    },
    video: "/videos/vultrix-3d-printer.mp4",
    gallery: [
      {
        src: "/projects/gallery/vultrix-3d-tool.png",
        title: { en: "Tool access page", pt: "Página de acesso da ferramenta" },
        description: {
          en: "Beta access flow focused on pricing and operational control.",
          pt: "Fluxo de acesso beta focado em precificação e controle operacional.",
        },
      },
      {
        src: "/projects/gallery/vultrix-3d-services.png",
        title: { en: "Services surface", pt: "Área de serviços" },
        description: {
          en: "Commercial page connecting services, product, and customer demand.",
          pt: "Página comercial conectando serviços, produto e demanda do cliente.",
        },
      },
    ],
    gradient: "from-blue-900 to-cyan-900",
    featured: false,
  },
  {
    slug: "hermes-agentes",
    title: "Hermes Agentes",
    description: {
      en: "Self-hosted agent workspace with task routing, memory, tool permissions and human review",
      pt: "Workspace self-hosted de agentes com roteamento de tarefas, memória, permissões e revisão humana",
    },
    shortDescription: {
      en: "JE4NDEV's in-house agent-operations lab: scoped profiles, a Kanban dispatcher, tool permissions and human review. This is an internal project, not a client deployment or client result.",
      pt: "Laboratório interno da JE4NDEV para operações com agentes: perfis por escopo, dispatcher Kanban, permissões de ferramentas e revisão humana. É um projeto interno, não uma implantação nem resultado de cliente.",
    },
    longDescription: {
      en: "Hermes is JE4NDEV's in-house agent-operations laboratory; this page documents an internal project, not a client deployment or client result. For a separate engagement, Hermes can be evaluated for client-owned infrastructure with scoped agent profiles, tool permissions, memory, observability, documentation and team handoff, if included in the proposal. The project is open source under the MIT license; model providers, hosting, data handling and maintenance remain separate decisions and terms.",
      pt: "O Hermes é o laboratório interno da JE4NDEV para operações com agentes; esta página documenta um projeto próprio, não uma implantação nem resultado de cliente. Em um trabalho separado, o Hermes pode ser avaliado para infraestrutura controlada pelo cliente, com perfis de agentes por escopo, permissões de ferramentas, memória, observabilidade, documentação e handoff da equipe, se previstos na proposta. O projeto é open source sob licença MIT; provedores de modelo, hospedagem, tratamento de dados e manutenção continuam sendo decisões e condições separadas.",
    },
    status: "live",
    role: "agency-platform",
    audience: ["agencias", "fundadores", "times-de-produto", "empresas-que-querem-automacao"],
    proofLevel: "private-demo",
    visualKind: "mixed",
    scope: { en: "AI agency platform", pt: "Plataforma de agência IA" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "AI Orchestration",
    tags: ["ai-agents", "automation", "kanban", "mcp", "vps", "open-source"],
    technologies: ["Python", "TypeScript", "Vite", "Supabase", "OpenAI", "Anthropic", "systemd"],
    problem: {
      en: "Shipping SaaS solo is bottlenecked by code, design, QA, ops and content all needing different specialists. Hiring is slow and expensive; off-the-shelf agents like AutoGPT loop without finishing real work.",
      pt: "Fazer shipping de SaaS sozinho engasga porque dev, design, QA, ops e conteúdo precisam de especialistas diferentes. Contratar é lento e caro; agentes prontos como AutoGPT entram em loop sem terminar trabalho real.",
    },
    solution: {
      en: "Built a Kanban-driven dispatcher that routes tasks to scoped agent profiles with isolated prompts, models, tools and workspaces. Conductor, Operations and Swarm surfaces provide observability while human review remains the approval gate.",
      pt: "Construí um dispatcher orientado a Kanban que roteia tarefas para perfis definidos pelo escopo, com prompts, modelos, ferramentas e workspaces isolados. As superfícies Conductor, Operations e Swarm dão observabilidade, enquanto a revisão humana permanece como gate de aprovação.",
    },
    metrics: [
      { value: "Scoped", label: { en: "Specialist profiles", pt: "Perfis por escopo" }, color: "purple", verified: true },
      { value: "Kanban", label: { en: "Task orchestration", pt: "Orquestração de tarefas" }, color: "cyan", verified: true },
      { value: "MIT", label: { en: "Open source", pt: "Código aberto" }, color: "green", verified: true },
      { value: "Human", label: { en: "Founder review gate", pt: "Revisão final humana" }, color: "pink", verified: true },
    ],
    links: {
      // Workspace.agenciamep.com is behind Basic Auth (restricted demo) and
      // would return 401 to a portfolio visitor. We expose only the public
      // GitHub repo as the "Acessar" target. Demo on request.
      github: "https://github.com/JE4NVRG/hermes-workspace",
    },
    primaryCta: "github",
    casePriority: 7,
    image: "/projects/hermes-agentes-home.png",
    coverImage: "/projects/covers/hermes-agentes-cover.webp",
    assetReview: {
      status: "private-demo",
      sourceUrl: "https://github.com/JE4NVRG/hermes-workspace",
      reviewedAt: "2026-07-17",
      note: {
        en: "The operational workspace is private; the public proof is the repository plus a faithful terminal view.",
        pt: "O workspace operacional é privado; a prova pública é o repositório mais uma visão fiel de terminal.",
      },
    },
    gallery: [
      {
        src: "/projects/gallery/hermes-github.png",
        title: { en: "Open source on GitHub", pt: "Open source no GitHub" },
        description: {
          en: "MIT-licensed repository with releases, workflows, documentation and a reusable skills structure.",
          pt: "Repositório sob licença MIT com releases, workflows, documentação e uma estrutura reutilizável de skills.",
        },
      },
    ],
    gradient: "from-violet-900 to-fuchsia-900",
    featured: false,
  },
  {
    slug: "archscene",
    title: "ArchScene",
    description: {
      en: "Batch-render workflow for architecture studios",
      pt: "Fluxo de renders em lote para escritórios de arquitetura",
    },
    shortDescription: {
      en: "Send SketchUp scenes, generate batch renders and organize a private review gallery, with credit cost visible before every AI action.",
      pt: "Envie cenas do SketchUp, gere renders em lote e organize uma galeria privada de revisão, com o custo em créditos visível antes de cada ação de IA.",
    },
    longDescription: {
      en: "ArchScene is a public beta workbench for architecture studios. It turns SketchUp scenes and technical exports into render batches, keeps source and output together for review, and organizes private galleries for client-ready selection. The live product exposes free trial credits, cost before AI actions, batch status, examples, pricing and a dated public changelog.",
      pt: "O ArchScene é uma bancada visual em beta público para escritórios de arquitetura. Transforma cenas do SketchUp e exports técnicos em lotes de renders, mantém fonte e resultado juntos para revisão e organiza galerias privadas para seleção antes da entrega ao cliente. O produto ao vivo expõe créditos grátis de teste, custo antes das ações de IA, status do lote, exemplos, preços e changelog público datado.",
    },
    status: "live",
    role: "ai-render",
    audience: ["arquitetos", "designers-de-interiores", "studios-de-arquitetura", "visualizadores-3d"],
    proofLevel: "public-live",
    visualKind: "ai-render",
    scope: { en: "Product + AI workflow", pt: "Produto + fluxo de IA" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "AI Platform",
    tags: ["ai", "render", "sketchup", "architecture", "credits", "batch"],
    technologies: ["Next.js 16", "React 19", "Supabase", "Stripe", "Grok Imagine", "SketchUp Ruby"],
    problem: {
      en: "Architecture teams need multiple client-ready visual options while keeping each result tied to the original scene, design intent, project and review history.",
      pt: "Times de arquitetura precisam de várias opções visuais prontas para o cliente, mantendo cada resultado ligado à cena original, à intenção do projeto, ao trabalho e ao histórico de revisão.",
    },
    solution: {
      en: "I built the product workflow from scene intake to asynchronous render batches, before-and-after review, private project galleries, visible credit accounting, billing and a public product changelog.",
      pt: "Construí o fluxo do produto da entrada da cena aos lotes assíncronos de render, revisão antes/depois, galerias privadas por projeto, contabilidade visível de créditos, billing e changelog público do produto.",
    },
    deliveryRecord: {
      responsibility: {
        en: "Product strategy, architecture, full-stack implementation, AI workflow, billing, QA and public release discipline.",
        pt: "Estratégia de produto, arquitetura, implementação full-stack, fluxo de IA, billing, QA e disciplina de releases públicos.",
      },
      architecture: {
        en: "Next.js 16 and React 19 with Supabase for identity, projects and galleries; credit ledger and Stripe billing around asynchronous render jobs and reviewed outputs.",
        pt: "Next.js 16 e React 19 com Supabase para identidade, projetos e galerias; ledger de créditos e billing Stripe ao redor de jobs assíncronos de render e resultados revisados.",
      },
      currentState: {
        en: "Public beta is live with SketchUp workflow, five free credits without a card, batch rendering, examples, pricing and dated release notes.",
        pt: "O beta público está no ar com fluxo SketchUp, cinco créditos grátis sem cartão, render em lote, exemplos, preços e notas de versão datadas.",
      },
      limitations: {
        en: "The public case demonstrates workflow and reviewed examples, not guaranteed fidelity for every input. Private project files, queue internals and customer billing data are not exposed.",
        pt: "O case público demonstra fluxo e exemplos revisados, não fidelidade garantida para toda entrada. Arquivos privados, funcionamento interno da fila e dados de cobrança de clientes não são expostos.",
      },
    },
    metrics: [
      { value: "Beta", label: { en: "Public workflow live", pt: "Fluxo público no ar" }, color: "green", verified: true },
      { value: "5", label: { en: "Free credits, no card", pt: "Créditos grátis, sem cartão" }, color: "purple", verified: true },
      { value: "Batch", label: { en: "Scenes per project", pt: "Cenas por projeto" }, color: "cyan", verified: true },
      { value: "Public", label: { en: "Dated product changelog", pt: "Changelog datado" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://archscene.com",
    },
    primaryCta: "live",
    casePriority: 1,
    image: "/projects/captures/archscene-home-latest.png",
    coverImage: "/projects/covers/archscene-cover.webp",
    assetReview: {
      status: "approved",
      sourceUrl: "https://archscene.com",
      reviewedAt: "2026-08-10",
      note: {
        en: "Live public beta, before/after product flow, examples and dated changelog reviewed on 2026-08-10; private project files remain outside the case.",
        pt: "Beta público ao vivo, fluxo antes/depois, exemplos e changelog datado revisados em 10/08/2026; arquivos privados dos projetos ficam fora do case.",
      },
    },
    video: "/videos/archscene-kitchen.mp4",
    gallery: [
      {
        src: "/projects/captures/archscene-home-latest.png",
        title: { en: "Current public product page", pt: "Página pública atual" },
        description: {
          en: "Current ArchScene experience with the SketchUp-to-render comparison and the public product proposition.",
          pt: "Experiência atual da ArchScene com comparação SketchUp para render e a proposta pública do produto.",
        },
      },
      {
        src: "/projects/gallery/archscene-changelog.png",
        title: { en: "Public changelog", pt: "Changelog público" },
        description: {
          en: "Dated public release notes with user-facing features, improvements, fixes and beta decisions.",
          pt: "Notas públicas datadas com features, melhorias, correções e decisões do beta voltadas ao usuário.",
        },
      },
      {
        src: "/projects/gallery/archscene-examples.png",
        title: { en: "Studio entry + before/after preview", pt: "Entrada do estúdio + preview antes/depois" },
        description: {
          en: "Login surface with branded value props: 'preserves the proposal', 'no repeat projects', 'office-grade output'.",
          pt: "Tela de entrada com value props: 'preserva a proposta', 'sem projeto repetido', 'cria do escritorio'.",
        },
      },
    ],
    gradient: "from-amber-900 to-orange-900",
    featured: true,
  },
  {
    slug: "arremata-radar",
    title: "Arremata Radar",
    description: {
      en: "Archived case study · property research workflow",
      pt: "Case arquivado · fluxo de pesquisa imobiliária",
    },
    shortDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    longDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    status: "archived",
    role: "client-saas",
    audience: ["investidores-imobiliarios", "compradores", "analistas-de-leilao", "profissionais-de-diligencia"],
    proofLevel: "case-only",
    visualKind: "product-screenshot",
    scope: { en: "Product + intelligence workflow", pt: "Produto + fluxo de inteligência" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "real-estate", "caixa", "intelligence", "scoring"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Supabase"],
    problem: {
      en: "Official property opportunities are scattered across formats and update cycles, so discount, occupancy, media and missing data land in the same spreadsheet.",
      pt: "Oportunidades oficiais de imóveis ficam espalhadas em formatos e ciclos de atualização diferentes, então desconto, ocupação, mídia e dados ausentes caem na mesma planilha.",
    },
    solution: {
      en: "I built a public radar that keeps source, media, risk and history in one decision pack, with explainable priority and a coverage stage that does not pretend every feed is live.",
      pt: "Construí um radar público que junta origem, mídia, risco e histórico em um pacote de decisão, com prioridade explicável e estágio de cobertura que não finge que toda fonte já está no ar.",
    },
    deliveryRecord: {
      responsibility: {
        en: "Product strategy, data model, public catalog, scoring, billing surface, QA and honest coverage limits.",
        pt: "Estratégia de produto, modelo de dados, catálogo público, scoring, superfície de billing, QA e limites honestos de cobertura.",
      },
      architecture: {
        en: "Next.js product with canonical property entities, source provenance, public catalog and subscription checkout.",
        pt: "Produto Next.js com entidades canônicas de imóvel, proveniência da fonte, catálogo público e checkout de assinatura.",
      },
      currentState: {
        en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
        pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
      },
      limitations: {
        en: "The public case shows the marketing surface and catalog proof, not private saved searches, buyer identity or a guaranteed investment outcome. PNCP and partner feeds are staged, not fully public.",
        pt: "O case público mostra a superfície de marketing e a prova do catálogo, não buscas salvas privadas, identidade de compradores nem resultado de investimento. PNCP e feeds de parceiros estão em estágio, não totalmente públicos.",
      },
    },
    metrics: [
      { value: "Archived", label: { en: "Historical case", pt: "Case histórico" }, color: "green", verified: true },
      { value: "25k+", label: { en: "Records on the public radar", pt: "Registros no radar público" }, color: "purple", verified: true },
      { value: "Caixa", label: { en: "Active official source", pt: "Fonte oficial ativa" }, color: "cyan", verified: true },
      { value: "Score", label: { en: "Explainable priority", pt: "Prioridade explicável" }, color: "pink", verified: true },
    ],
    links: {
    },
    primaryCta: "contact",
    casePriority: 2,
    assetReview: {
      status: "editorial-only",
      sourceUrl: "https://arremataradar.com",
      reviewedAt: "2026-09-02",
      note: {
        en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
        pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
      },
    },
    gradient: "from-emerald-900 to-green-900",
    featured: false,
  },
  {
    slug: "openclaw-gateway",
    title: "OpenClaw Gateway",
    description: {
      en: "Private multi-model AI gateway deployed on your VPS with integrations and scoped support",
      pt: "Gateway privado multi-modelo instalado na sua VPS, com integrações e suporte conforme o escopo",
    },
    shortDescription: {
      en: "OpenAI-compatible gateway for multiple providers, MCP tools, persistent memory and session continuity — deployed on client-owned infrastructure.",
      pt: "Gateway compatível com OpenAI para múltiplos providers, ferramentas MCP, memória persistente e continuidade de sessão — instalado na infraestrutura do cliente.",
    },
    longDescription: {
      en: "OpenClaw unifies multiple AI providers behind an OpenAI-compatible endpoint. The engagement can cover VPS deployment, provider configuration, integrations with the existing stack, access controls, observability, documentation and support defined in the proposal.",
      pt: "O OpenClaw unifica múltiplos providers de IA atrás de um endpoint compatível com OpenAI. O trabalho pode incluir instalação na VPS, configuração dos providers, integrações com a stack existente, controles de acesso, observabilidade, documentação e suporte definido na proposta.",
    },
    status: "live",
    role: "agency-platform",
    audience: ["desenvolvedores", "times-de-ia", "empresas-com-vps", "usuarios-cursor-claude"],
    proofLevel: "private-demo",
    visualKind: "terminal",
    scope: { en: "AI infrastructure", pt: "Infraestrutura de IA" },
    dateRange: { en: "2024 - Present", pt: "Desde 2024" },
    category: "AI Infrastructure",
    tags: ["ai-gateway", "mcp", "multi-provider", "ollama", "vps", "openai-compatible"],
    technologies: ["Python", "FastAPI", "MCP", "OpenAI", "Anthropic", "Ollama", "systemd"],
    problem: {
      en: "Every AI tool ships its own provider lock-in, billing model, and tool format. Switching between Claude, GPT, and local models means rewriting wrappers, losing memory, and starting sessions over.",
      pt: "Cada ferramenta IA traz seu provider lock-in, modelo de billing e formato de tools. Trocar entre Claude, GPT e modelos locais significa reescrever wrappers, perder memoria e comecar sessions do zero.",
    },
    solution: {
      en: "Built an OpenAI-compatible gateway with multi-provider routing, MCP tool registry, persistent memory, session continuity across models, and unified billing. One endpoint, every model, every tool, every agent.",
      pt: "Construi um gateway compativel com OpenAI com roteamento multi-provider, registry de tools MCP, memoria persistente, continuidade de session entre modelos e billing unificado. Um endpoint, todos os modelos, todas as tools, todos os agentes.",
    },
    metrics: [
      { value: "VPS", label: { en: "Runs on your infrastructure", pt: "Roda na sua infraestrutura" }, color: "purple", verified: true },
      { value: "Multi", label: { en: "Provider routing", pt: "Roteamento de providers" }, color: "cyan", verified: true },
      { value: "MCP", label: { en: "Tool registry", pt: "Registro de ferramentas" }, color: "green", verified: true },
      { value: "Private", label: { en: "Demo on request", pt: "Demo sob solicitação" }, color: "pink", verified: true },
    ],
    links: {
      github: "https://github.com/JE4NVRG/hermes-workspace",
    },
    // Holographic AI infrastructure key visual (Grok frame from the gateway
    // video). Replaces the old GitHub-404 screenshot at the same path.
    primaryCta: "github",
    casePriority: 8,
    image: "/projects/openclaw-gateway.png",
    coverImage: "/projects/covers/openclaw-gateway-cover.webp",
    assetReview: {
      status: "private-demo",
      sourceUrl: "https://github.com/JE4NVRG/hermes-workspace",
      reviewedAt: "2026-07-17",
      note: {
        en: "Private infrastructure flow represented by a faithful terminal instead of generic AI imagery.",
        pt: "Fluxo de infraestrutura privado representado por terminal fiel, sem imagem genérica de IA.",
      },
    },
    gradient: "from-indigo-900 to-purple-900",
    featured: false,
  },
  {
    slug: "mepchat",
    title: "MepChat",
    description: {
      en: "WhatsApp chatbot platform with CNPJ dashboard",
      pt: "Plataforma de chatbot WhatsApp com painel CNPJ",
    },
    shortDescription: {
      en: "AI WhatsApp bot for routine inquiries with a CNPJ management dashboard. MVP validated in 2024.",
      pt: "Bot de WhatsApp com IA para consultas rotineiras, com painel de gestão CNPJ. MVP validado em 2024.",
    },
    longDescription: {
      en: "An intelligent WhatsApp chatbot platform that automates customer service with AI-powered responses, integrated with a CNPJ management dashboard for business operations.",
      pt: "Uma plataforma inteligente de chatbot WhatsApp que automatiza o atendimento ao cliente com respostas por IA, integrada com um painel de gestão CNPJ para operações empresariais.",
    },
    status: "mvp",
    role: "client-saas",
    audience: ["pequenas-empresas", "atendimento-whatsapp", "consultas-cnpj"],
    proofLevel: "case-only",
    visualKind: "branding",
    scope: { en: "MVP validation", pt: "Validacao MVP" },
    dateRange: { en: "2024", pt: "2024" },
    category: "AI Chatbot",
    tags: ["whatsapp", "chatbot", "cnpj", "ai", "mvp"],
    technologies: ["Node.js", "Firebase", "OpenAI", "FlutterFlow"],
    problem: {
      en: "Businesses spending excessive time on repetitive customer inquiries, with no automated way to handle CNPJ lookups and common questions.",
      pt: "Empresas gastando tempo excessivo com consultas repetitivas de clientes, sem forma automatizada de lidar com consultas CNPJ e perguntas comuns.",
    },
    solution: {
      en: "Built an AI-assisted WhatsApp bot for routine inquiries, with a management dashboard for conversations and CNPJ data.",
      pt: "Construí um bot de WhatsApp assistido por IA para consultas rotineiras, com painel de gestão de conversas e dados de CNPJ.",
    },
    metrics: [
      { value: "MVP", label: { en: "Archived case", pt: "Case arquivado" }, color: "cyan", verified: true },
      { value: "WA", label: { en: "WhatsApp workflow", pt: "Fluxo WhatsApp" }, color: "green", verified: true },
      { value: "CNPJ", label: { en: "Business lookup", pt: "Consulta empresarial" }, color: "purple", verified: true },
    ],
    links: {},
    primaryCta: "contact",
    casePriority: 11,
    coverImage: "/projects/covers/mepchat-cover.webp",
    assetReview: {
      status: "editorial-only",
      reviewedAt: "2026-07-17",
      note: {
        en: "The former repository link returns 404; keep this as an archived case until real product proof is recovered.",
        pt: "O antigo repositório retorna 404; manter como case arquivado até recuperar prova real do produto.",
      },
    },
    gradient: "from-emerald-900 to-teal-900",
    featured: false,
  },
  {
    slug: "fullcommerce360",
    title: "FullCommerce360",
    description: {
      en: "Operating system for Mercado Livre sellers",
      pt: "Sistema operacional do seller no Mercado Livre",
    },
    shortDescription: {
      en: "Research margin, prepare product and offer, require human approval before publishing, then keep orders, stock and service in the same account context.",
      pt: "Pesquise margem, prepare produto e oferta, exija aprovação humana antes de publicar e mantenha pedidos, estoque e atendimento no mesmo contexto de conta.",
    },
    longDescription: {
      en: "FullCommerce360 connects product research to daily Mercado Livre operations. Comparables, costs and recommendations stay separated; the editor makes product, photos, offer and pending decisions reviewable; sensitive publishing remains blocked until human approval. The public site is live at fullcommerce360.com. The public demonstration uses sanitized fixtures and keeps clients and seller accounts isolated.",
      pt: "O FullCommerce360 conecta a pesquisa de produto à operação diária no Mercado Livre. Comparáveis, custos e recomendações permanecem separados; o editor torna produto, fotos, oferta e pendências revisáveis; a publicação sensível continua bloqueada até aprovação humana. O site público está em fullcommerce360.com. A demonstração pública usa fixtures sanitizadas e mantém clientes e contas vendedoras isolados.",
    },
    status: "live",
    role: "client-saas",
    audience: ["vendedores-mercado-livre", "equipes-ecommerce", "agencias-marketplace"],
    proofLevel: "public-demo",
    visualKind: "dashboard",
    scope: { en: "Product + marketplace operations", pt: "Produto + operação marketplace" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "mercado-livre", "research", "listings", "operations", "human-gate"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Mercado Livre API"],
    problem: {
      en: "Product research, margin assumptions, listing preparation and daily seller operations were fragmented across tools, with a high risk of mixing client/account context or publishing incomplete information.",
      pt: "Pesquisa de produto, premissas de margem, preparação do anúncio e operação diária estavam fragmentadas entre ferramentas, com risco alto de misturar cliente/conta ou publicar informação incompleta.",
    },
    solution: {
      en: "I designed and built an account-scoped workflow from evidence and margin research to listing review, explicit approval gates and connected orders, stock, labels, messages, reputation and financial context.",
      pt: "Desenhei e construí um fluxo por conta que vai da evidência e pesquisa de margem à revisão do anúncio, gates explícitos de aprovação e contexto conectado de pedidos, estoque, etiquetas, mensagens, reputação e financeiro.",
    },
    deliveryRecord: {
      responsibility: {
        en: "Product strategy, workflow design, full-stack implementation, Mercado Livre integration, safety gates and browser QA.",
        pt: "Estratégia de produto, desenho do fluxo, implementação full-stack, integração Mercado Livre, gates de segurança e QA no browser.",
      },
      architecture: {
        en: "Next.js and TypeScript product with Supabase identity/data, client and seller-account isolation, Mercado Livre integration and auditable agent/action records.",
        pt: "Produto Next.js e TypeScript com identidade/dados no Supabase, isolamento por cliente e conta vendedora, integração Mercado Livre e registros auditáveis de agentes/ações.",
      },
      currentState: {
        en: "The public site and sanitized demonstration are live, covering Radar research, Editor review and Operations while keeping sensitive actions behind approval.",
        pt: "O site público e a demonstração sanitizada estão no ar, cobrindo pesquisa no Radar, revisão no Editor e Operação, com ações sensíveis atrás de aprovação.",
      },
      limitations: {
        en: "Public screens use local sanitized fixtures and do not prove seller volume, revenue or unattended publishing. Real accounts, orders and customer data remain private.",
        pt: "As telas públicas usam fixtures locais sanitizadas e não provam volume de vendedores, faturamento nem publicação autônoma. Contas reais, pedidos e dados de clientes permanecem privados.",
      },
    },
    metrics: [
      { value: "ML API", label: { en: "Official integration", pt: "Integração oficial" }, color: "purple", verified: true },
      { value: "Scoped", label: { en: "Client and seller accounts", pt: "Cliente e contas vendedoras" }, color: "cyan", verified: true },
      { value: "Gate", label: { en: "Human approval before publishing", pt: "Aprovação antes de publicar" }, color: "green", verified: true },
      { value: "Demo", label: { en: "Sanitized public proof", pt: "Prova pública sanitizada" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://fullcommerce360.com",
    },
    primaryCta: "live",
    casePriority: 3,
    image: "/projects/captures/fullcommerce360-home-latest.png",
    assetReview: {
      status: "approved",
      sourceUrl: "https://fullcommerce360.com",
      reviewedAt: "2026-08-10",
      note: {
        en: "Live public capture of fullcommerce360.com at 1440x900 on 2026-09-02. The product is FullCommerce360. This screen does not claim seller volume or revenue.",
        pt: "Captura ao vivo de fullcommerce360.com em 1440x900 em 02/09/2026. O produto é FullCommerce360. Esta tela não afirma volume de vendedores nem faturamento.",
      },
    },
    gradient: "from-yellow-900 to-amber-900",
    featured: true,
  },
  {
    slug: "urlpivot",
    title: "URLPivot",
    description: {
      en: "Change where a shared link or QR sends people—without replacing it.",
      pt: "Mude o destino de um link ou QR já compartilhado sem precisar substituí-lo.",
    },
    shortDescription: {
      en: "Keep the same public link and printed QR when a campaign changes. Manage stable links, reusable QR codes and focused campaign Pages, then review views and clicks.",
      pt: "Mantenha o mesmo link público e QR impresso quando a campanha mudar. Gerencie links estáveis, QR Codes reutilizáveis e Pages focadas; acompanhe visualizações e cliques.",
    },
    longDescription: {
      en: "URLPivot helps teams keep campaign links useful after they have been shared or printed: update a managed link's destination without replacing its public address or QR code, bring managed links together on a campaign Page, and review views and clicks. The public site also describes human/bot traffic signals, referrers and country-level signals without retaining raw IP addresses. Workspace-scoped MCP access lets agents list and create links and change destinations, without billing, deletion, admin or DNS permissions. Try the temporary public demo or visit URLPivot's own published Page.",
      pt: "O URLPivot ajuda equipes a manter links de campanha úteis depois de compartilhados ou impressos: atualize o destino de um link gerenciado sem trocar o endereço público nem o QR Code, reúna links gerenciados em uma Page de campanha e acompanhe visualizações e cliques. O site público também descreve sinais de tráfego humano/bot, referenciadores e país sem reter o IP bruto. O acesso MCP limitado ao workspace permite que agentes listem e criem links e troquem destinos, sem permissões de cobrança, exclusão, admin ou DNS. Experimente a demo pública temporária ou visite a Page publicada do próprio URLPivot.",
    },
    status: "live",
    role: "own-product",
    audience: ["operadores-de-campanha", "times-de-growth", "founders"],
    proofLevel: "public-demo",
    visualKind: "product-screenshot",
    scope: { en: "Own product · Links, QR & Pages", pt: "Produto próprio · Links, QR e Pages" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "links", "qr", "analytics", "privacy"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    problem: {
      en: "A campaign changes after its link has been shared or its QR code printed. Replacing the public URL means updating every place it appeared.",
      pt: "A campanha muda depois que o link foi compartilhado ou o QR Code impresso. Trocar a URL pública exige atualizar cada lugar em que ela apareceu.",
    },
    solution: {
      en: "Managed links keep a stable public address while their destination can change. Reuse the QR code, group managed links on a campaign Page and review access and click signals.",
      pt: "Links gerenciados mantêm um endereço público estável enquanto o destino pode mudar. Reutilize o QR Code, reúna links gerenciados em uma Page de campanha e acompanhe sinais de acesso e cliques.",
    },
    deliveryRecord: {
      responsibility: {
        en: "A public link-management product with reusable QR codes, campaign Pages and traffic signals.",
        pt: "Um produto público de gestão de links, QR Codes reutilizáveis, Pages de campanha e sinais de tráfego.",
      },
      architecture: {
        en: "The public product organizes managed links, editable destinations, QR codes, campaign Pages and operational history in a workspace.",
        pt: "O produto público organiza links gerenciados, destinos editáveis, QR Codes, Pages de campanha e histórico operacional em um workspace.",
      },
      currentState: {
        en: "Explore the public product at urlpivot.app and see its own published Page at urlpivot.app/p/urlpivot. The homepage offers a temporary demo without signup.",
        pt: "Conheça o produto público em urlpivot.app e veja sua própria Page publicada em urlpivot.app/p/urlpivot. A página inicial oferece uma demo temporária sem cadastro.",
      },
      limitations: {
        en: "The public product pages demonstrate the offer and an official Page; they do not establish customer volume, revenue or campaign performance.",
        pt: "As páginas públicas demonstram a proposta e uma Page oficial; não comprovam volume de clientes, faturamento ou desempenho de campanhas.",
      },
    },
    metrics: [
      { value: "Stable", label: { en: "Public link, editable destination", pt: "Link público, destino editável" }, color: "purple", verified: true },
      { value: "Reusable", label: { en: "QR code", pt: "QR Code" }, color: "cyan", verified: true },
      { value: "Pages", label: { en: "Campaign destinations", pt: "Destinos de campanha" }, color: "pink", verified: true },
      { value: "Signals", label: { en: "Views and clicks", pt: "Visualizações e cliques" }, color: "green", verified: true },
    ],
    links: {
      live: "https://urlpivot.app",
    },
    primaryCta: "live",
    casePriority: 4,
    image: "/projects/captures/urlpivot-home-latest.png",
    assetReview: {
      status: "approved",
      sourceUrl: "https://urlpivot.app",
      reviewedAt: "2026-09-22",
      note: {
        en: "Current public product page captured at 1440x1000 on 2026-09-22. It presents Links, QR Codes and Pages plus a temporary demo without signup.",
        pt: "Página pública atual capturada em 1440x1000 em 22/09/2026. Ela apresenta Links, QR Codes e Pages, além de uma demo temporária sem cadastro.",
      },
    },
    gradient: "from-sky-900 to-indigo-900",
    featured: true,
  },
  {
    slug: "hypefc",
    title: "HypeFC",
    description: {
      en: "Archived case study · football dashboard",
      pt: "Case arquivado · dashboard de futebol",
    },
    shortDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    longDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    status: "archived",
    role: "client-saas",
    audience: ["fas-de-futebol", "apostadores", "jornalistas-esportivos"],
    proofLevel: "case-only",
    visualKind: "dashboard",
    scope: { en: "Realtime dashboard", pt: "Dashboard em tempo real" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "Sports Dashboard",
    tags: ["sports", "football", "realtime", "dashboard", "api"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "API Football"],
    problem: {
      en: "Football fans need to check multiple sources to follow live matches, standings, and stats across different leagues — no single unified dashboard exists.",
      pt: "Fas de futebol precisam checar multiplas fontes para acompanhar jogos ao vivo, classificacoes e estatisticas de diferentes ligas — nenhum dashboard unificado existe.",
    },
    solution: {
      en: "Built a real-time dashboard that aggregates live scores, standings, trending teams, and top scorers from 8+ leagues into a single beautiful interface with auto-refresh.",
      pt: "Construi um dashboard em tempo real que agrega placares ao vivo, classificacoes, times em alta e artilheiros de 8+ ligas em uma unica interface com auto-refresh.",
    },
    metrics: [
      { value: "Archived", label: { en: "Public dashboard", pt: "Dashboard público" }, color: "green", verified: true },
      { value: "API", label: { en: "Football data integration", pt: "Integração de futebol" }, color: "purple", verified: true },
      { value: "Realtime", label: { en: "Score refresh", pt: "Atualização de placares" }, color: "cyan", verified: true },
      { value: "Web", label: { en: "Responsive experience", pt: "Experiência responsiva" }, color: "pink", verified: true },
    ],
    links: {
      github: "https://github.com/JE4NVRG/HypeFc",
    },
    primaryCta: "github",
    casePriority: 12,
    assetReview: {
      status: "editorial-only",
      sourceUrl: "https://hypefc.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
        pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
      },
    },
    gradient: "from-green-900 to-emerald-900",
    featured: false,
  },
  {
    slug: "stopultimate",
    title: "Stop Ultimate",
    description: {
      en: "Archived case study · multiplayer word game",
      pt: "Case arquivado · jogo multiplayer de palavras",
    },
    shortDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    longDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    status: "archived",
    role: "game-social",
    audience: ["amigos", "festas", "jogos-de-mesa", "brasileiros"],
    proofLevel: "case-only",
    visualKind: "product-screenshot",
    scope: { en: "Party game SaaS", pt: "Jogo SaaS multiplayer" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "Game / Social",
    tags: ["game", "multiplayer", "ai-judge", "portuguese", "party"],
    technologies: ["Next.js", "TypeScript", "Vercel", "OpenAI", "Tailwind"],
    problem: {
      en: "The classic Adedanha / Stop game always ends in arguments — who decides if 'Xique-Xique' is a city, if your fruit is valid, if you tied or not. Friends end the round mad, not laughing.",
      pt: "Adedanha de mesa sempre acaba em briga — quem decide se 'Xique-Xique' vale, se a fruta conta, se empatou ou não. Os amigos terminam a rodada bravos, não rindo.",
    },
    solution: {
      en: "Built a multiplayer browser game with an AI judge that accepts, rejects and explains each answer in real time. Themed categories, replay mode, instant scoring — the AI takes the heat so the friends keep laughing.",
      pt: "Construímos um jogo multiplayer no browser com juiz IA que aceita, recusa e explica cada resposta em tempo real. Temas configuráveis, modo replay, placar automático — a IA leva a responsabilidade pra galera continuar rindo.",
    },
    metrics: [
      { value: "Archived", label: { en: "Public game", pt: "Jogo público" }, color: "green", verified: true },
      { value: "Multi", label: { en: "Multiplayer rooms", pt: "Salas multiplayer" }, color: "purple", verified: true },
      { value: "AI", label: { en: "Real-time judge", pt: "Juiz em tempo real" }, color: "cyan", verified: true },
      { value: "PT-BR", label: { en: "Portuguese-first", pt: "Português nativo" }, color: "pink", verified: true },
    ],
    links: {
    },
    primaryCta: "contact",
    casePriority: 10,
    assetReview: {
      status: "editorial-only",
      sourceUrl: "https://stopultimate.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
        pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
      },
    },
    gradient: "from-emerald-700 to-amber-900",
    featured: false,
  },
  {
    slug: "alchemix-auditor",
    title: "Alchemix Auditor",
    description: {
      en: "Archived case study · Solidity audit interface",
      pt: "Case arquivado · interface de auditoria Solidity",
    },
    shortDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    longDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    status: "archived",
    role: "web3-audit",
    audience: ["auditores-web3", "equipes-defi", "protocolos-alchemix"],
    proofLevel: "case-only",
    visualKind: "product-screenshot",
    scope: { en: "Smart contract audit", pt: "Auditoria smart contract" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "Solidity Audit",
    tags: ["web3", "solidity", "audit", "defi", "alchemix"],
    technologies: ["Next.js", "TypeScript", "Solidity", "Foundry", "Echidna"],
    problem: {
      en: "DeFi protocols ship audits as static PDFs that go stale. Risk patterns reappear with each upgrade. Clients can't track if mitigations stuck.",
      pt: "Protocolos DeFi entregam auditoria em PDF estático que vira desatualizado. Padrões de risco voltam a cada upgrade. Cliente não tem como acompanhar se a mitigação ficou.",
    },
    solution: {
      en: "Live audit dashboard that re-runs checks on every contract deploy, shares results via shareable link, and tracks remediation status over time.",
      pt: "Dashboard de auditoria que re-roda checks a cada deploy de contrato, compartilha resultados via link e acompanha status da correção ao longo do tempo.",
    },
    metrics: [
      { value: "Archived", label: { en: "Public audit tool", pt: "Ferramenta pública" }, color: "green", verified: true },
      { value: "DeFi", label: { en: "Protocol analysis", pt: "Análise de protocolo" }, color: "purple", verified: true },
      { value: "Auto", label: { en: "Repeatable checks", pt: "Checks repetíveis" }, color: "cyan", verified: true },
      { value: "EVM", label: { en: "Compatible", pt: "Compatível" }, color: "pink", verified: true },
    ],
    links: {
    },
    primaryCta: "contact",
    casePriority: 13,
    assetReview: {
      status: "editorial-only",
      sourceUrl: "https://alchemix-auditor.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
        pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
      },
    },
    gradient: "from-violet-800 to-indigo-900",
    featured: false,
  },
  {
    slug: "ethena-scanner",
    title: "Ethena Scanner",
    description: {
      en: "Archived case study · protocol monitoring interface",
      pt: "Case arquivado · interface de monitoramento de protocolo",
    },
    shortDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    longDescription: {
      en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
      pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
    },
    status: "archived",
    role: "web3-audit",
    audience: ["auditores-web3", "equipes-stablecoin", "protocolos-ethena"],
    proofLevel: "case-only",
    visualKind: "product-screenshot",
    scope: { en: "Security monitoring", pt: "Monitoramento de segurança" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "Solidity Audit",
    tags: ["web3", "solidity", "oracle", "monitoring", "stablecoin"],
    technologies: ["Next.js", "TypeScript", "Solidity", "Ethers.js", "Webhooks"],
    problem: {
      en: "Stablecoin and synthetic-asset protocols are most dangerous when nobody is watching. One bad oracle update or peg slip can drain millions before anyone notices.",
      pt: "Protocolos de stablecoin e ativos sintéticos são mais perigosos quando ninguém tá olhando. Um oracle update ruim ou peg slip pode drenar milhões antes de alguém perceber.",
    },
    solution: {
      en: "Continuous scanner that pulls on-chain state every few minutes, tracks oracle deviation against multiple sources, and posts webhook alerts to Telegram and Slack the moment anything is off.",
      pt: "Scanner contínuo que puxa estado on-chain a cada poucos minutos, compara desvio de oracle contra múltiplas fontes e dispara alerta via webhook no Telegram e Slack assim que algo sai do trilho.",
    },
    metrics: [
      { value: "Archived", label: { en: "Public scanner", pt: "Scanner público" }, color: "green", verified: true },
      { value: "Oracle", label: { en: "Health monitoring", pt: "Monitoramento de saúde" }, color: "purple", verified: true },
      { value: "Multi", label: { en: "Multiple data sources", pt: "Múltiplas fontes" }, color: "cyan", verified: true },
      { value: "Alerts", label: { en: "Operational signals", pt: "Sinais operacionais" }, color: "pink", verified: true },
    ],
    links: {
    },
    primaryCta: "contact",
    casePriority: 14,
    assetReview: {
      status: "editorial-only",
      sourceUrl: "https://ethena-scanner.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Historical case only. The public deployment returned HTTP 402 (deployment paused) in the 2026-09-22 audit; no live demo is offered.",
        pt: "Apenas case histórico. O deploy público retornou HTTP 402 (deployment pausado) na auditoria de 22/09/2026; não há demo ao vivo.",
      },
    },
    gradient: "from-emerald-800 to-cyan-900",
    featured: false,
  },
  {
    slug: "bounty-hunter-mvp",
    title: "Bounty Hunter",
    description: {
      en: "Internal MVP for matching auditors with active Web3 bug bounty programs",
      pt: "MVP interno que cruza auditores com programas de bug bounty Web3 ativos",
    },
    shortDescription: {
      en: "Internal aggregator: pulls Immunefi/Code4rena/Sherlock bounties weekly, ranks by stack/payout/severity for our auditor network.",
      pt: "Agregador interno: puxa bounties de Immunefi/Code4rena/Sherlock semanalmente, ranqueia por stack/payout/severidade para nossa rede de auditores.",
    },
    longDescription: {
      en: "Internal tool we use to track active bug bounty programs (Immunefi, Code4rena, Sherlock, HackenProof) and match them with the auditor profiles in our network. Filters by stack, payout range and severity. Powers the agency's audit pipeline.",
      pt: "Ferramenta interna que usamos pra acompanhar bug bounty ativos (Immunefi, Code4rena, Sherlock, HackenProof) e cruzar com o perfil dos auditores da nossa rede. Filtra por stack, faixa de payout e severidade. Alimenta o pipeline de auditoria da agência.",
    },
    status: "internal",
    role: "internal-tool",
    audience: ["auditores-web3", "equipe-je4ndev"],
    proofLevel: "internal",
    visualKind: "product-screenshot",
    scope: { en: "Internal MVP", pt: "MVP interno" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "Solidity Audit",
    tags: ["web3", "bug-bounty", "internal", "immunefi", "auditing-pipeline"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Immunefi API"],
    problem: {
      en: "Active bounty programs change weekly. Manually matching auditor profiles against eligible programs is slow and the agency misses good opportunities.",
      pt: "Programas de bounty ativos mudam toda semana. Cruzar perfil dos auditores manualmente é lento e a agência perde boas oportunidades.",
    },
    solution: {
      en: "Aggregator that ingests Immunefi, Code4rena and Sherlock feeds, normalizes payout and stack, and produces ranked match lists per auditor.",
      pt: "Agregador que consome feeds da Immunefi, Code4rena e Sherlock, normaliza payout e stack, e produz listas de match rankeadas por auditor.",
    },
    metrics: [
      { value: "MVP", label: { en: "Internal prototype", pt: "Protótipo interno" }, color: "purple", verified: true },
      { value: "Sync", label: { en: "Source aggregation", pt: "Agregação de fontes" }, color: "cyan", verified: true },
      { value: "Match", label: { en: "Ranked opportunities", pt: "Oportunidades ranqueadas" }, color: "green", verified: true },
      { value: "Private", label: { en: "Demo on request", pt: "Demo sob solicitação" }, color: "pink", verified: true },
    ],
    links: {},
    primaryCta: "contact",
    casePriority: 15,
    coverImage: "/projects/covers/bounty-hunter-mvp-cover.webp",
    assetReview: {
      status: "editorial-only",
      reviewedAt: "2026-07-17",
      note: {
        en: "The public deployment renders a loading error; keep only the editorial cover until a sanitized internal capture exists.",
        pt: "O deploy público renderiza erro de carregamento; manter só a capa editorial até existir captura interna sanitizada.",
      },
    },
    gradient: "from-amber-900 to-red-900",
    featured: false,
  }
];

// Insert the new primary case without rewriting the established relative ordering.
export const projects: Project[] = [
  mepMailProject,
  ...existingProjects.map(project => ({ ...project, casePriority: project.casePriority + 1 })),
  noraProject,
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

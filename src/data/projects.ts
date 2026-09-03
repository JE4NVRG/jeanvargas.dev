import type { Project } from "@/types/project";

// Nota Fase 1 (spec 2026-06-03): estamos migrando para ProjectV2.
// Mantemos o alias para não quebrar código que usa Project.
// Todos os objetos abaixo foram curados com os novos campos obrigatórios.

export const projects: Project[] = [
  {
    slug: "nexpanel",
    title: "NexPanel",
    description: {
      en: "Operations SaaS for IPTV reseller businesses",
      pt: "SaaS operacional para revendas IPTV",
    },
    shortDescription: {
      en: "Clients, servers, credits, activations, due dates, financial controls and team permissions in one reseller dashboard.",
      pt: "Clientes, servidores, créditos, ativações, vencimentos, financeiro e permissões de equipe em um só dashboard de revenda.",
    },
    longDescription: {
      en: "NexPanel replaces spreadsheet-based IPTV reseller operations with a tenant-aware product for client lifecycle, servers, apps, credits, activations, renewals, finance and team access. The public evidence includes the live commercial surface, signup flow and a reviewed dashboard capture; customer records and activation integrations remain private.",
      pt: "O NexPanel substitui a operação de revenda IPTV em planilhas por um produto com isolamento por tenant para ciclo de clientes, servidores, apps, créditos, ativações, renovações, financeiro e acesso da equipe. A prova pública inclui a superfície comercial ao vivo, o cadastro e uma captura revisada do dashboard; registros de clientes e integrações de ativação permanecem privados.",
    },
    status: "live",
    role: "client-saas",
    audience: ["revendedores-iptv", "operacoes-com-servidores", "equipes-de-revenda"],
    proofLevel: "public-live",
    visualKind: "dashboard",
    scope: { en: "Product + full-stack SaaS", pt: "Produto + SaaS full-stack" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "iptv", "billing", "multi-tenant", "credits"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    problem: {
      en: "IPTV resellers were splitting client due dates, server credits, activations and cash flow across spreadsheets and messages, making handoffs and accountability fragile.",
      pt: "Revendas IPTV separavam vencimentos de clientes, créditos dos servidores, ativações e caixa entre planilhas e mensagens, tornando handoffs e responsabilização frágeis.",
    },
    solution: {
      en: "I shaped and built a single operational workflow with client status, servers, credit consumption, activation queue, finance, role-based access and an action log.",
      pt: "Modelei e construí um fluxo operacional único com status de clientes, servidores, consumo de créditos, fila de ativações, financeiro, acesso por papel e log de ações.",
    },
    deliveryRecord: {
      responsibility: {
        en: "Product architecture, UX, full-stack delivery and operational modelling with the reseller workflow.",
        pt: "Arquitetura de produto, UX, entrega full-stack e modelagem operacional junto ao fluxo da revenda.",
      },
      architecture: {
        en: "Next.js and TypeScript application backed by Supabase, tenant-scoped data, role permissions and modules for clients, servers, credits, activations and finance.",
        pt: "Aplicação Next.js e TypeScript com Supabase, dados por tenant, permissões por papel e módulos de clientes, servidores, créditos, ativações e financeiro.",
      },
      currentState: {
        en: "The public product, signup and reseller dashboard are live; the reviewed capture demonstrates the operational modules with sanitized data.",
        pt: "O produto público, o cadastro e o dashboard da revenda estão no ar; a captura revisada demonstra os módulos operacionais com dados sanitizados.",
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
        en: "Live public product and sanitized reseller-dashboard capture reviewed on 2026-08-10; no customer records or activation credentials are exposed.",
        pt: "Produto público ao vivo e captura sanitizada do dashboard da revenda revisados em 10/08/2026; nenhum registro de cliente ou credencial de ativação é exposto.",
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
    featured: true,
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
      github: "https://github.com/JE4NVRG/Vultrix",
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
    featured: true,
  },
  {
    slug: "hermes-agentes",
    title: "Hermes Agentes",
    description: {
      en: "Self-hosted agent workspace with task routing, memory, tool permissions and human review",
      pt: "Workspace self-hosted de agentes com roteamento de tarefas, memória, permissões e revisão humana",
    },
    shortDescription: {
      en: "We deploy Hermes on your VPS and configure the agent profiles, Kanban dispatcher, tools and review gates needed by your operation.",
      pt: "Instalamos o Hermes na sua VPS e configuramos os perfis, o dispatcher Kanban, as ferramentas e os gates de revisão necessários para sua operação.",
    },
    longDescription: {
      en: "Hermes is JE4NDEV's agent-operations laboratory and can also run on client-owned infrastructure. The engagement covers deployment, scoped agent profiles, tool permissions, memory, observability, documentation and team handoff. The system remains open source, MIT-licensed and under the client's data control.",
      pt: "O Hermes é o laboratório de operações com agentes da JE4NDEV e também pode rodar na infraestrutura do cliente. O trabalho cobre instalação, perfis definidos pelo escopo, permissões de ferramentas, memória, observabilidade, documentação e handoff para o time. O sistema permanece open source, sob licença MIT e com os dados controlados pelo cliente.",
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
      en: "Real-estate intelligence for Caixa opportunities",
      pt: "Inteligência imobiliária para oportunidades da Caixa",
    },
    shortDescription: {
      en: "Filter Caixa listings with traceable sources, explainable scores and a decision queue before you spend hours on a weak asset.",
      pt: "Filtre imóveis da Caixa com origem rastreável, score explicável e uma fila de decisão antes de gastar horas em ativo ruim.",
    },
    longDescription: {
      en: "Arremata Radar is a public product that turns fragmented official property inventory into a repeatable research workflow: discover, compare, investigate and follow. The live site exposes coverage stage, source freshness, public catalog search, pricing and an explicit limit: it organizes evidence, it does not sell or broker properties.",
      pt: "O Arremata Radar é um produto público que transforma inventário oficial fragmentado em um fluxo repetível de pesquisa: descobrir, comparar, investigar e acompanhar. O site ao vivo expõe o estágio da cobertura, o frescor da fonte, busca no catálogo público, preços e um limite explícito: organiza evidência, não vende nem intermedia imóveis.",
    },
    status: "live",
    role: "client-saas",
    audience: ["investidores-imobiliarios", "compradores", "analistas-de-leilao", "profissionais-de-diligencia"],
    proofLevel: "public-live",
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
        en: "Public product is live with Caixa as the active source, searchable catalog, plans and an explicit non-brokerage disclaimer.",
        pt: "O produto público está no ar com a Caixa como fonte ativa, catálogo pesquisável, planos e aviso explícito de que não intermedia compra.",
      },
      limitations: {
        en: "The public case shows the marketing surface and catalog proof, not private saved searches, buyer identity or a guaranteed investment outcome. PNCP and partner feeds are staged, not fully public.",
        pt: "O case público mostra a superfície de marketing e a prova do catálogo, não buscas salvas privadas, identidade de compradores nem resultado de investimento. PNCP e feeds de parceiros estão em estágio, não totalmente públicos.",
      },
    },
    metrics: [
      { value: "Live", label: { en: "Public product", pt: "Produto público" }, color: "green", verified: true },
      { value: "25k+", label: { en: "Records on the public radar", pt: "Registros no radar público" }, color: "purple", verified: true },
      { value: "Caixa", label: { en: "Active official source", pt: "Fonte oficial ativa" }, color: "cyan", verified: true },
      { value: "Score", label: { en: "Explainable priority", pt: "Prioridade explicável" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://arremataradar.com",
    },
    primaryCta: "live",
    casePriority: 2,
    image: "/projects/captures/arremata-radar-home-latest.png",
    assetReview: {
      status: "approved",
      sourceUrl: "https://arremataradar.com",
      reviewedAt: "2026-09-02",
      note: {
        en: "Live public landing captured at 1440x900 on 2026-09-02 after dismissing the optional analytics banner. Catalog count is taken from the public surface and may move.",
        pt: "Landing pública ao vivo capturada em 1440x900 em 02/09/2026 depois de recusar a mensuração opcional. A contagem do catálogo vem da superfície pública e pode variar.",
      },
    },
    gradient: "from-emerald-900 to-green-900",
    featured: true,
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
      en: "Operational link control for campaigns that cannot go blind",
      pt: "Controle operacional de links para campanhas que não podem ficar cegas",
    },
    shortDescription: {
      en: "Keep the public slug, change the destination, pause without leaking, generate QR codes and separate humans from bots, with an auditable history.",
      pt: "Mantenha o slug público, troque o destino, pause sem vazar, gere QR e separe pessoas de bots, com histórico auditável.",
    },
    longDescription: {
      en: "URLPivot is the public product name of LinkOps, JE4NDEV's link-control infrastructure. The live surface explains durable slugs, editable destinations, fail-closed pauses (410), missing routes (404) and privacy-preserving traffic classification. The current environment is a controlled dogfood pilot: there is no public signup or commercial availability promise in this cut.",
      pt: "URLPivot é o nome público do LinkOps, a infraestrutura de controle de links da JE4NDEV. A superfície ao vivo explica slugs duráveis, destinos editáveis, pausa fail-closed (410), rotas ausentes (404) e classificação de tráfego sem armazenar IP bruto. O ambiente atual é um piloto dogfood controlado: neste corte não há cadastro público nem promessa de disponibilidade comercial.",
    },
    status: "demo",
    role: "internal-tool",
    audience: ["operadores-de-campanha", "times-de-growth", "founders"],
    proofLevel: "public-demo",
    visualKind: "product-screenshot",
    scope: { en: "Internal platform + public landing", pt: "Plataforma interna + landing pública" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "links", "qr", "analytics", "privacy"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    problem: {
      en: "Published campaign URLs become blind spots: destinations change, pauses leak, bots inflate traffic and the operational history disappears.",
      pt: "URLs de campanha publicadas viram ponto cego: o destino muda, a pausa vaza, bots inflama o tráfego e o histórico operacional some.",
    },
    solution: {
      en: "I built a link-control product that keeps the public slug immutable, edits the canonical destination, fails closed when paused and classifies humans versus bots without storing raw IP.",
      pt: "Construí um produto de controle de links que mantém o slug público imutável, edita o destino canônico, falha fechado quando pausado e classifica humanos versus bots sem guardar IP bruto.",
    },
    deliveryRecord: {
      responsibility: {
        en: "Product design, routing semantics, privacy model, billing groundwork, QA and public dogfood landing.",
        pt: "Desenho de produto, semântica de roteamento, modelo de privacidade, base de billing, QA e landing pública de dogfood.",
      },
      architecture: {
        en: "Next.js application with durable public routes, destination editing, QR generation, workspace controls and HMAC-based traffic impressions.",
        pt: "Aplicação Next.js com rotas públicas duráveis, edição de destino, geração de QR, controles de workspace e impressões de tráfego com HMAC.",
      },
      currentState: {
        en: "Public landing is live at linkops.je4ndev.com. Workspace access remains private; this cut does not offer public signup or SLA.",
        pt: "A landing pública está no ar em linkops.je4ndev.com. O acesso ao workspace continua privado; este corte não oferece cadastro público nem SLA.",
      },
      limitations: {
        en: "The public page proves positioning and routing rules, not customer volume, revenue or unattended production availability.",
        pt: "A página pública prova posicionamento e regras de roteamento, não volume de clientes, faturamento nem disponibilidade de produção sem operador.",
      },
    },
    metrics: [
      { value: "Demo", label: { en: "Public landing, no signup", pt: "Landing pública, sem cadastro" }, color: "purple", verified: true },
      { value: "410", label: { en: "Paused links fail closed", pt: "Pausa fail-closed" }, color: "purple", verified: true },
      { value: "QR", label: { en: "Campaign codes", pt: "Códigos de campanha" }, color: "cyan", verified: true },
      { value: "Dogfood", label: { en: "No public signup yet", pt: "Sem cadastro público ainda" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://linkops.je4ndev.com",
    },
    primaryCta: "live",
    casePriority: 4,
    image: "/projects/captures/urlpivot-home-latest.png",
    assetReview: {
      status: "approved",
      sourceUrl: "https://linkops.je4ndev.com",
      reviewedAt: "2026-09-02",
      note: {
        en: "Live public landing captured at 1440x900 on 2026-09-02. The page itself states this is a controlled JE4NDEV dogfood environment.",
        pt: "Landing pública ao vivo capturada em 1440x900 em 02/09/2026. A própria página declara que este é um ambiente dogfood controlado da JE4NDEV.",
      },
    },
    gradient: "from-sky-900 to-indigo-900",
    featured: true,
  },
  {
    slug: "hypefc",
    title: "HypeFC",
    description: {
      en: "Real-time football dashboard with live scores and standings",
      pt: "Dashboard de futebol em tempo real com placares e classificacoes",
    },
    shortDescription: {
      en: "Real-time football command center: 8+ leagues, live scores, standings, trending teams, top scorers with auto-refresh.",
      pt: "Central de futebol em tempo real: 8+ ligas, placares ao vivo, classificações, times em alta e artilheiros com auto-refresh.",
    },
    longDescription: {
      en: "A comprehensive real-time football dashboard tracking live matches, standings, trending teams, and top scorers across 8+ leagues worldwide. Features live score updates, league standings with filters, trending team rankings, and top scorer leaderboards — all updating in real time.",
      pt: "Um dashboard de futebol em tempo real abrangente que acompanha partidas ao vivo, classificacoes, times em alta e artilheiros em 8+ ligas mundiais. Placares ao vivo, classificacoes com filtros, ranking de times e liderancas de artilharia — tudo atualizando em tempo real.",
    },
    status: "mvp",
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
      { value: "Live", label: { en: "Public dashboard", pt: "Dashboard público" }, color: "green", verified: true },
      { value: "API", label: { en: "Football data integration", pt: "Integração de futebol" }, color: "purple", verified: true },
      { value: "Realtime", label: { en: "Score refresh", pt: "Atualização de placares" }, color: "cyan", verified: true },
      { value: "Web", label: { en: "Responsive experience", pt: "Experiência responsiva" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://hypefc.vercel.app",
      github: "https://github.com/JE4NVRG/HypeFc",
    },
    primaryCta: "github",
    casePriority: 12,
    assetReview: {
      status: "editorial-only",
      sourceUrl: "https://hypefc.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Historical real dashboard retained as case evidence; the current public endpoint returned an empty data state during the 2026-07-17 review.",
        pt: "Dashboard real histórico mantido como evidência do case; o endpoint público atual retornou estado sem dados na revisão de 17/07/2026.",
      },
    },
    gallery: [
      {
        src: "/projects/gallery/hypefc-live.png",
        title: { en: "Live dashboard", pt: "Dashboard ao vivo" },
        description: {
          en: "Real-time football command center with matches, standings, and scorers.",
          pt: "Central em tempo real com jogos, classificacao e artilheiros.",
        },
      },
    ],
    gradient: "from-green-900 to-emerald-900",
    featured: false,
  },
  {
    slug: "stopultimate",
    title: "Stop Ultimate",
    description: {
      en: "Adedanha (Stop) party game with an AI judge calling shots in real time",
      pt: "Adedanha (Stop) multiplayer com juiz IA decidindo as respostas em tempo real",
    },
    shortDescription: {
      en: "Multiplayer Adedanha with AI judge that accepts/rejects/explains answers in real time. Themed rooms, replay, no more table fights.",
      pt: "Adedanha multiplayer com juiz IA que aceita/recusa/explica respostas em tempo real. Salas temáticas, replay, sem briga de mesa.",
    },
    longDescription: {
      en: "A modern take on the classic 'Stop / Adedanha' word game where an AI plays the role of judge — accepting or rejecting answers, breaking ties and explaining the verdict. Multiplayer rooms, themed categories, score tracking and replay mode. The AI judge keeps the game moving without the usual arguments at the table.",
      pt: "Uma releitura moderna do jogo 'Stop / Adedanha' onde a IA assume o papel de juiz — aceitando ou recusando respostas, desempatando e explicando o veredicto. Salas multiplayer, temas customizados, placar e modo replay. O juiz IA mantém o jogo andando sem briga de mesa.",
    },
    status: "live",
    role: "game-social",
    audience: ["amigos", "festas", "jogos-de-mesa", "brasileiros"],
    proofLevel: "public-live",
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
      { value: "Live", label: { en: "Public game", pt: "Jogo público" }, color: "green", verified: true },
      { value: "Multi", label: { en: "Multiplayer rooms", pt: "Salas multiplayer" }, color: "purple", verified: true },
      { value: "AI", label: { en: "Real-time judge", pt: "Juiz em tempo real" }, color: "cyan", verified: true },
      { value: "PT-BR", label: { en: "Portuguese-first", pt: "Português nativo" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://stopultimate.vercel.app/",
    },
    primaryCta: "live",
    casePriority: 10,
    image: "/projects/captures/2026-06-03/stopultimate-desktop.jpg",
    assetReview: {
      status: "approved",
      sourceUrl: "https://stopultimate.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Real public gameplay flow with the AI-judge action visible.",
        pt: "Fluxo público real de gameplay com a ação do juiz IA visível.",
      },
    },
    gallery: [
      {
        src: "/projects/captures/stopultimate-home-latest.png",
        title: { en: "Current game modes", pt: "Modos atuais do jogo" },
        description: {
          en: "Updated public home with quick play, solo training, private rooms, daily challenge, family league and community.",
          pt: "Home pública atualizada com jogo rápido, treino solo, sala privada, desafio diário, liga da família e comunidade.",
        },
      },
    ],
    gradient: "from-emerald-700 to-amber-900",
    featured: false,
  },
  {
    slug: "alchemix-auditor",
    title: "Alchemix Auditor",
    description: {
      en: "Solidity audit tool inspecting Alchemix smart contracts for risk patterns",
      pt: "Ferramenta de auditoria Solidity que inspeciona smart contracts da Alchemix em busca de padrões de risco",
    },
    shortDescription: {
      en: "Live Solidity audit dashboard for Alchemix: re-runs risk checks on every deploy, flags reentrancy/oracle issues, shareable reports.",
      pt: "Dashboard de auditoria Solidity ao vivo para Alchemix: re-executa checks de risco a cada deploy, sinaliza reentrancy/oráculo, relatórios compartilháveis.",
    },
    longDescription: {
      en: "Audit dashboard built specifically for the Alchemix DeFi protocol. Parses the deployed contracts, flags known risk patterns (reentrancy, oracle manipulation, access control), produces a technical report. Live on Vercel for the audit team to share with clients.",
      pt: "Dashboard de auditoria feito sob medida pro protocolo DeFi Alchemix. Faz parsing dos contratos em produção, sinaliza padrões de risco conhecidos (reentrancy, manipulação de oráculo, controle de acesso) e gera relatório técnico. Live na Vercel pro time de auditoria compartilhar com clientes.",
    },
    status: "live",
    role: "web3-audit",
    audience: ["auditores-web3", "equipes-defi", "protocolos-alchemix"],
    proofLevel: "public-live",
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
      { value: "Live", label: { en: "Public audit tool", pt: "Ferramenta pública" }, color: "green", verified: true },
      { value: "DeFi", label: { en: "Protocol analysis", pt: "Análise de protocolo" }, color: "purple", verified: true },
      { value: "Auto", label: { en: "Repeatable checks", pt: "Checks repetíveis" }, color: "cyan", verified: true },
      { value: "EVM", label: { en: "Compatible", pt: "Compatível" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://alchemix-auditor.vercel.app",
    },
    primaryCta: "live",
    casePriority: 13,
    image: "/projects/captures/alchemix-auditor-latest.png",
    coverImage: "/projects/covers/alchemix-auditor-cover.webp",
    assetReview: {
      status: "approved",
      sourceUrl: "https://alchemix-auditor.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Current public checklist interface captured without wallet or user data; the screenshot proves the interface, not independent audit effectiveness.",
        pt: "Interface pública atual do checklist capturada sem dados de carteira ou usuário; o print comprova a interface, não a eficácia independente da auditoria.",
      },
    },
    gradient: "from-violet-800 to-indigo-900",
    featured: false,
  },
  {
    slug: "ethena-scanner",
    title: "Ethena Scanner",
    description: {
      en: "Security scanner for Ethena Protocol smart contracts and oracle health",
      pt: "Scanner de segurança pra smart contracts e saúde de oráculos da Ethena Protocol",
    },
    shortDescription: {
      en: "Continuous on-chain scanner for Ethena: oracle deviation, peg health, risk vectors. Webhook alerts to TG/Slack every 5min.",
      pt: "Scanner contínuo on-chain para Ethena: desvio de oráculo, saúde do peg, vetores de risco. Alertas webhook para TG/Slack a cada 5min.",
    },
    longDescription: {
      en: "Continuous security scanner built for Ethena Protocol. Monitors contract state, oracle pricing, peg deviation, and known attack vectors. Alerts via webhook when risk threshold is hit. Built for the audit team to keep watching after the report is delivered.",
      pt: "Scanner de segurança contínuo feito pra Ethena Protocol. Monitora estado dos contratos, preços de oráculo, desvio de peg e vetores de ataque conhecidos. Alerta via webhook quando passa do threshold de risco. Construído pra que o time de auditoria continue acompanhando depois de entregar o relatório.",
    },
    status: "live",
    role: "web3-audit",
    audience: ["auditores-web3", "equipes-stablecoin", "protocolos-ethena"],
    proofLevel: "public-live",
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
      { value: "Live", label: { en: "Public scanner", pt: "Scanner público" }, color: "green", verified: true },
      { value: "Oracle", label: { en: "Health monitoring", pt: "Monitoramento de saúde" }, color: "purple", verified: true },
      { value: "Multi", label: { en: "Multiple data sources", pt: "Múltiplas fontes" }, color: "cyan", verified: true },
      { value: "Alerts", label: { en: "Operational signals", pt: "Sinais operacionais" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://ethena-scanner.vercel.app",
    },
    primaryCta: "live",
    casePriority: 14,
    image: "/projects/captures/ethena-scanner-latest.png",
    coverImage: "/projects/covers/ethena-scanner-cover.webp",
    assetReview: {
      status: "approved",
      sourceUrl: "https://ethena-scanner.vercel.app",
      reviewedAt: "2026-07-17",
      note: {
        en: "Current public interface captured after its visible scan flow completed; the screenshot proves the demo state, not independent protocol security.",
        pt: "Interface pública atual capturada após a conclusão do fluxo visível de scan; o print comprova o estado da demo, não a segurança independente do protocolo.",
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

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

import type { Project } from "@/types/project";

// Nota Fase 1 (spec 2026-06-03): estamos migrando para ProjectV2.
// Mantemos o alias para não quebrar código que usa Project.
// Todos os objetos abaixo foram curados com os novos campos obrigatórios.

export const projects: Project[] = [
  {
    slug: "nexpanel",
    title: "NexPanel",
    description: {
      en: "Exclusive-orders SaaS for reseller businesses",
      pt: "SaaS de pedidos exclusivos para negócios de revenda",
    },
    shortDescription: {
      en: "Multi-tenant SaaS for exclusive resellers: clients, credits, automated billing and real-time ops in one dashboard.",
      pt: "SaaS multi-tenant para revendedores exclusivos: clientes, créditos, cobrança automatizada e operações em tempo real em um só painel.",
    },
    longDescription: {
      en: "A multi-tenant SaaS platform built for resellers of exclusive products and services — IPTV, digital goods, niche marketplaces, white-label SaaS. Manages clients, credits, financials and activations from a single dashboard. Multi-tier pricing, team permissions, audit logs, automated billing with per-product credit tracking and reseller-grade reports.",
      pt: "Plataforma SaaS multi-tenant feita pra quem revende produtos e serviços exclusivos — IPTV, produtos digitais, marketplaces de nicho, SaaS white-label. Gerencia clientes, créditos, financeiro e ativações num único dashboard. Planos multi-nivel, permissões de equipe, logs de auditoria e cobrança automatizada com rastreamento por produto e relatórios de revenda.",
    },
    status: "live",
    role: "client-saas",
    audience: ["revendedores-exclusivos", "empresas-iptv", "marketplaces-nicho", "saas-white-label"],
    proofLevel: "public-live",
    visualKind: "dashboard",
    scope: { en: "SaaS build", pt: "Construcao SaaS" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "marketplace", "billing", "multi-tenant", "credits"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Stripe"],
    problem: {
      en: "Resellers of exclusive products run their business on spreadsheets and WhatsApp groups. They lose orders, miss billing, can't track real profit per product and have zero visibility into client lifetime value.",
      pt: "Revendedores de produtos exclusivos tocam o negócio em planilha e grupo de WhatsApp. Perdem pedido, perdem cobrança, não sabem lucro real por produto e não enxergam o valor do cliente ao longo do tempo.",
    },
    solution: {
      en: "Built a multi-tenant SaaS with client lifecycle, credit-pool inventory, automated financial control, team permissions, and a real-time dashboard — turning spreadsheet operations into a professional reseller business.",
      pt: "Construímos um SaaS multi-tenant com ciclo de vida do cliente, inventário de créditos, controle financeiro automatizado, permissões de equipe e dashboard em tempo real — transformando operação de planilha em negócio de revenda profissional.",
    },
    metrics: [
      { value: "Live", label: { en: "Production", pt: "Em produção" }, color: "green", verified: true },
      { value: "Multi", label: { en: "Multi-tenant operation", pt: "Operação multi-tenant" }, color: "purple", verified: true },
      { value: "RLS", label: { en: "Tenant isolation", pt: "Isolamento por tenant" }, color: "cyan", verified: true },
      { value: "API", label: { en: "Centralized activations", pt: "Ativações centralizadas" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://nexpanel.agenciamep.com",
    },
    primaryCta: "live",
    casePriority: 2,
    image: "/projects/captures/nexpanel-dashboard.webp",
    coverImage: "/projects/covers/nexpanel-cover.webp",
    assetReview: {
      status: "approved",
      sourceUrl: "https://nexpanel.agenciamep.com",
      reviewedAt: "2026-07-17",
      note: {
        en: "Official sanitized dashboard capture published by NexPanel on its public product page.",
        pt: "Captura oficial e sanitizada do dashboard publicada pelo NexPanel na página pública do produto.",
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
    casePriority: 3,
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
      en: "21 agent profiles + founder reviewing every delivery — we install, configure and train",
      pt: "21 perfis de agentes + founder revisando cada entrega — instalamos, configuramos e treinamos",
    },
    shortDescription: {
      en: "We install & operate the full 21-profile AI agent platform (Kanban dispatcher, Conductor, MCP tools) on your VPS. Founder reviews every delivery.",
      pt: "Instalamos e operamos a plataforma completa de 21 perfis de agentes IA (dispatcher Kanban, Conductor, ferramentas MCP) na sua VPS. Founder revisa toda entrega.",
    },
    longDescription: {
      en: "Hermes is the agency's automation platform — and we install it for you. We deploy Hermes on your VPS, configure 21 specialized agent profiles for your business (dev, QA, security, marketing or whatever you need), train your team to operate it, and stay on call as your assistant. Same platform we use internally to coordinate work across all our products — the founder reviews every delivery before it ships. Open source, MIT, your data stays on your infra.",
      pt: "O Hermes é a plataforma de automação da agência — e a gente instala pra você. Subimos o Hermes na sua VPS, configuramos 21 perfis de agentes especializados pro seu negócio (dev, QA, security, marketing ou o que precisar), treinamos seu time pra operar e ficamos como assistente. Mesma plataforma que usamos internamente pra coordenar o trabalho em todos os nossos produtos — o founder revisa cada entrega antes do deploy. Open source, MIT, seus dados ficam na sua infra.",
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
      en: "Built a Kanban-driven dispatcher that routes tasks to 21 specialized agent profiles (each with its own system prompt, model, MCP toolset, and isolated workspace), runs them under systemd, captures live tool cards, and merges PRs end-to-end. Conductor + Operations + Swarm surfaces give full live observability.",
      pt: "Construí um dispatcher Kanban-driven que roteia tasks pra 21 profiles especializados (cada um com seu system prompt, modelo, MCP toolset e workspace isolado), roda eles via systemd, captura tool cards em tempo real e mergeia PRs end-to-end. As surfaces Conductor + Operations + Swarm dão observabilidade completa em tempo real.",
    },
    metrics: [
      { value: "21", label: { en: "Specialized profiles", pt: "Perfis especializados" }, color: "purple", verified: true },
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
          en: "MIT-licensed repo with 1.6k+ commits, TypeScript 98.3%, releases tagged, full workflow + docs + skills folder.",
          pt: "Repo MIT com 1.6k+ commits, TypeScript 98.3%, releases marcados, workflows + docs + pasta de skills completa.",
        },
      },
    ],
    gradient: "from-violet-900 to-fuchsia-900",
    featured: true,
  },
  {
    slug: "archscene",
    title: "ArchScene",
    description: {
      en: "Photoreal AI render platform for architects and interior designers",
      pt: "Plataforma de renders fotorrealistas com IA pra arquitetos e designers de interiores",
    },
    shortDescription: {
      en: "Upload SketchUp .skp → Grok Imagine batch renders that preserve exact geometry, lighting, materials and camera. Gallery + credit billing (USD/BRL).",
      pt: "Envie .skp do SketchUp → Grok Imagine gera renders em lote preservando geometria, luz, materiais e câmera exatos. Galeria + billing por créditos (USD/BRL).",
    },
    longDescription: {
      en: "A SaaS platform that turns SketchUp scenes into magazine-quality interior photographs in batches. Architects upload .skp exports, the AI renders multiple iterations with preserved geometry, lighting, materials and camera angles, and the gallery lets clients pick the keeper or request edits — all with credit-based billing in USD/BRL and Stripe.",
      pt: "Uma plataforma SaaS que transforma cenas SketchUp em fotos fotorrealistas estilo revista em lote. Arquitetos sobem exports .skp, a IA renderiza várias iterações preservando geometria, luz, materiais e ângulo de câmera, e a galeria permite ao cliente escolher o keeper ou pedir edição — tudo com billing por créditos em USD/BRL e Stripe.",
    },
    status: "live",
    role: "ai-render",
    audience: ["arquitetos", "designers-de-interiores", "studios-de-arquitetura", "visualizadores-3d"],
    proofLevel: "public-live",
    visualKind: "ai-render",
    scope: { en: "AI render SaaS", pt: "SaaS de render com IA" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "AI Platform",
    tags: ["ai", "render", "sketchup", "grok", "architecture", "credits"],
    technologies: ["Next.js 16", "React 19", "Supabase", "Stripe", "Grok Imagine", "SketchUp Ruby"],
    problem: {
      en: "Architects spend hours tweaking V-Ray or Lumion just to show clients a single render variation. Iteration is slow, expensive, and most studios end up showing one mediocre angle instead of exploring options.",
      pt: "Arquitetos gastam horas ajustando V-Ray ou Lumion só pra mostrar uma variação de render pro cliente. Iteração é lenta, cara, e a maioria dos estúdios acaba mostrando um ângulo só mediano em vez de explorar opções.",
    },
    solution: {
      en: "Built a render farm wrapped in SaaS: SketchUp plugin exports scenes, Grok Imagine generates magazine-quality images in batches per scene, gallery groups renders by scene with lineage and edits, dual-currency billing with credit packs and pro subscriptions.",
      pt: "Construí uma farm de render virada SaaS: plugin SketchUp exporta cenas, Grok Imagine gera imagens estilo revista em lote por cena, galeria agrupa renders por cena com linhagem e edições, billing dual-currency com pacotes de crédito e assinaturas pro.",
    },
    metrics: [
      { value: "Live", label: { en: "Production platform", pt: "Plataforma em produção" }, color: "green", verified: true },
      { value: "SKP", label: { en: "SketchUp workflow", pt: "Fluxo SketchUp" }, color: "purple", verified: true },
      { value: "USD/BRL", label: { en: "Dual-currency billing", pt: "Cobrança em duas moedas" }, color: "cyan", verified: true },
      { value: "Public", label: { en: "Product changelog", pt: "Changelog do produto" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://archscene.com",
    },
    primaryCta: "live",
    casePriority: 1,
    image: "/projects/gallery/archscene-examples.png",
    coverImage: "/projects/covers/archscene-cover.webp",
    assetReview: {
      status: "approved",
      sourceUrl: "https://archscene.com",
      reviewedAt: "2026-07-17",
      note: {
        en: "Real before/after product flow and AI-render output reviewed for public use.",
        pt: "Fluxo real de antes/depois e saída de render IA revisados para uso público.",
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
          en: "Live product changelog with 40 published releases, filter chips for Feature / Improvement / Fix / Change.",
          pt: "Changelog público ao vivo com 40 releases publicadas, filtros por Feature / Melhoria / Correção / Mudança.",
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
    slug: "openclaw-gateway",
    title: "OpenClaw Gateway",
    description: {
      en: "Multi-model AI gateway — we install on your VPS, train your team, support 24/7",
      pt: "Gateway multi-modelo de IA — instalamos na sua VPS, treinamos seu time, suporte 24h",
    },
    shortDescription: {
      en: "OpenAI-compatible multi-provider gateway (OpenAI + Anthropic + local Ollama) with MCP tools, persistent memory and session continuity. We install + support on your VPS.",
      pt: "Gateway multi-provider compatível com OpenAI (OpenAI + Anthropic + Ollama local) com ferramentas MCP, memória persistente e continuidade de sessão. Instalamos + damos suporte na sua VPS.",
    },
    longDescription: {
      en: "OpenClaw is the gateway that powers our AI ops — and we install it for you. OpenAI-compatible API fronting multiple providers (OpenAI, Anthropic, local Ollama) behind a single endpoint. We deploy on your VPS, configure providers for your budget, integrate with your existing tools (Cursor, Claude Code, internal stack), train your team and stay on call 24/7. Same gateway we use to ship every product in our portfolio.",
      pt: "O OpenClaw é o gateway que faz nossa operação IA andar — e a gente instala pra você. API compatível com OpenAI colocando múltiplos providers (OpenAI, Anthropic, Ollama local) atrás de um endpoint único. A gente sobe na sua VPS, configura providers no seu orçamento, integra com suas ferramentas (Cursor, Claude Code, stack interno), treina seu time e fica de plantão 24h. Mesmo gateway que usamos pra entregar todo produto do nosso portfólio.",
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
    casePriority: 4,
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
    featured: true,
  },
  {
    slug: "mepchat",
    title: "MepChat",
    description: {
      en: "WhatsApp chatbot platform with CNPJ dashboard",
      pt: "Plataforma de chatbot WhatsApp com painel CNPJ",
    },
    shortDescription: {
      en: "AI WhatsApp bot that handles 100% routine inquiries + CNPJ management dashboard. MVP validated in 2024.",
      pt: "Bot de WhatsApp com IA que resolve 100% das consultas rotineiras + painel de gestão CNPJ. MVP validado em 2024.",
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
      en: "Built an AI-powered WhatsApp bot that handles 100% of routine inquiries automatically, with a management dashboard for monitoring conversations and CNPJ data.",
      pt: "Construí um bot WhatsApp com IA que lida com 100% das consultas rotineiras automaticamente, com um painel de gestão para monitorar conversas e dados de CNPJ.",
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
    slug: "gestaoml",
    title: "Gestao ML",
    description: {
      en: "Order management SaaS for Mercado Livre sellers",
      pt: "SaaS de gestão de pedidos para vendedores do Mercado Livre",
    },
    shortDescription: {
      en: "Multi-account Mercado Livre order management: real-time sync, ML fees profit calc, auto labels, reputation alerts. Free to start.",
      pt: "Gestão multi-conta para vendedores ML: sync em tempo real, lucro com taxas reais, etiquetas automáticas, alertas de reputação. Começa grátis.",
    },
    longDescription: {
      en: "A complete management platform for Mercado Livre sellers. Handles orders, messages, shipping labels, financial analytics, and reputation monitoring across multiple accounts in a single dashboard. Features real-time sync, profit calculation with real ML fees, and bulk label generation.",
      pt: "Uma plataforma completa de gestão para vendedores do Mercado Livre. Gerencia pedidos, mensagens, etiquetas, financeiro e reputação em múltiplas contas em um único dashboard. Sincronização em tempo real, cálculo de lucro com taxas reais do ML e geração de etiquetas em massa.",
    },
    status: "live",
    role: "client-saas",
    audience: ["vendedores-mercado-livre", "ecommerce", "marketplace-sellers"],
    proofLevel: "case-only",
    visualKind: "dashboard",
    scope: { en: "Marketplace SaaS", pt: "SaaS marketplace" },
    dateRange: { en: "2026 - Present", pt: "Desde 2026" },
    category: "SaaS Platform",
    tags: ["saas", "mercado-livre", "orders", "labels", "reputation"],
    technologies: ["Next.js", "TypeScript", "Supabase", "Mercado Livre API"],
    problem: {
      en: "Mercado Livre sellers manage multiple accounts with spreadsheets, losing track of orders, profits, and reputation — with no unified tool for professional management.",
      pt: "Vendedores do Mercado Livre gerenciam múltiplas contas com planilhas, perdendo controle de pedidos, lucros e reputação — sem ferramenta unificada para gestão profissional.",
    },
    solution: {
      en: "Built a multi-account SaaS with order management, real-time financial tracking with ML fees, automated shipping labels, buyer messaging, and reputation alerts — all in one professional dashboard.",
      pt: "Construí um SaaS multi-conta com gestão de pedidos, financeiro em tempo real com taxas do ML, etiquetas automáticas, chat com compradores e alertas de reputação — tudo em um dashboard profissional.",
    },
    metrics: [
      { value: "ML API", label: { en: "Official integration", pt: "Integração oficial" }, color: "purple", verified: true },
      { value: "Multi", label: { en: "Multiple seller accounts", pt: "Múltiplas contas" }, color: "cyan", verified: true },
      { value: "Gate", label: { en: "Human approval before updates", pt: "Aprovação antes de atualizar" }, color: "green", verified: true },
      { value: "Live", label: { en: "Production operation", pt: "Operação em produção" }, color: "pink", verified: true },
    ],
    links: {
      live: "https://ml.je4ndev.com",
    },
    primaryCta: "live",
    casePriority: 5,
    image: "/projects/captures/gestaoml-public-hero.png",
    assetReview: {
      status: "approved",
      sourceUrl: "https://ml.je4ndev.com",
      reviewedAt: "2026-07-17",
      note: {
        en: "Current public product page captured without account, order or customer data; the operational cockpit remains private.",
        pt: "Página pública atual do produto capturada sem dados de conta, pedido ou cliente; o cockpit operacional segue privado.",
      },
    },
    gallery: [
      {
        src: "/projects/gallery/gestaoml-pricing.png",
        title: { en: "Pricing strategy", pt: "Estrategia de planos" },
        description: {
          en: "Plan structure designed to start free and scale with the operation.",
          pt: "Estrutura de planos para começar grátis e escalar com a operação.",
        },
      },
      {
        src: "/projects/gallery/gestaoml-signup.png",
        title: { en: "Conversion flow", pt: "Fluxo de conversao" },
        description: {
          en: "Signup page reinforcing metrics and the core sales workflow.",
          pt: "Página de cadastro reforçando métricas e o fluxo central de vendas.",
        },
      },
    ],
    gradient: "from-yellow-900 to-amber-900",
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
    casePriority: 8,
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
    casePriority: 6,
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
    featured: true,
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
    casePriority: 9,
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
    casePriority: 10,
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
    casePriority: 12,
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
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

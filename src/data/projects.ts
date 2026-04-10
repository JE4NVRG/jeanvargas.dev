import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "nexpanel",
    title: "NexPanel",
    description: {
      en: "Complete SaaS management system for IPTV resellers",
      pt: "Sistema SaaS completo de gestao para revendedores IPTV",
    },
    longDescription: {
      en: "A full-featured SaaS platform for IPTV resellers to manage clients, servers, finances, and activations in one place. Features intelligent dashboard with real-time metrics, multi-tier subscription plans, team permissions, audit logs, and automated billing with credit tracking per server.",
      pt: "Uma plataforma SaaS completa para revendedores IPTV gerenciarem clientes, servidores, financeiro e ativacoes em um so lugar. Dashboard inteligente com metricas em tempo real, planos de assinatura multi-nivel, permissoes de equipe, logs de auditoria e cobranca automatizada com rastreamento de creditos por servidor.",
    },
    status: "live",
    dateRange: "2026 — Present",
    category: "SaaS Platform",
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Stripe"],
    problem: {
      en: "IPTV resellers manage their business with spreadsheets and manual processes, leading to lost revenue, billing errors, and no visibility into real profitability.",
      pt: "Revendedores IPTV gerenciam seus negocios com planilhas e processos manuais, levando a perda de receita, erros de cobranca e nenhuma visibilidade sobre a lucratividade real.",
    },
    solution: {
      en: "Built a complete management platform with client tracking, server credit monitoring, automated financial control, team permissions, and an intelligent dashboard — replacing spreadsheets with professional business management.",
      pt: "Construi uma plataforma completa de gestao com rastreamento de clientes, monitoramento de creditos de servidor, controle financeiro automatizado, permissoes de equipe e dashboard inteligente — substituindo planilhas por gestao profissional.",
    },
    metrics: [
      { value: "247+", label: { en: "Clients managed", pt: "Clientes gerenciados" }, color: "purple" },
      { value: "R$4.2k", label: { en: "Monthly revenue", pt: "Receita mensal" }, color: "cyan" },
      { value: "3", label: { en: "Pricing tiers", pt: "Planos" }, color: "green" },
      { value: "Live", label: { en: "Production", pt: "Producao" }, color: "pink" },
    ],
    links: {
      live: "https://nexpanel.je4ndev.com",
    },
    image: "/projects/nexpanel.png",
    gradient: "from-blue-900 to-indigo-900",
    featured: true,
  },
  {
    slug: "vultrix-3d",
    title: "Vultrix 3D",
    description: {
      en: "Complete management platform for 3D printing businesses",
      pt: "Plataforma completa de gestao para negocios de impressao 3D",
    },
    longDescription: {
      en: "A SaaS platform built for 3D printing professionals and studios. Features a precision cost calculator that imports .3mf and .gcode files, automatically extracts print time and weight, calculates marketplace fees, and suggests optimal pricing with profit margins. Includes inventory management, financial dashboard, and multi-filament support.",
      pt: "Uma plataforma SaaS construida para profissionais e estudios de impressao 3D. Possui calculadora de custos de precisao que importa arquivos .3mf e .gcode, extrai automaticamente tempo e peso de impressao, calcula taxas de marketplace e sugere precificacao otima com margens de lucro. Inclui gestao de estoque, dashboard financeiro e suporte multi-filamento.",
    },
    status: "live",
    dateRange: "2026 — Present",
    category: "SaaS Platform",
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    problem: {
      en: "3D printing makers lack professional tools to accurately calculate costs, leading to underpricing and lost profits. Manual calculations are error-prone and time-consuming.",
      pt: "Makers de impressao 3D nao tem ferramentas profissionais para calcular custos com precisao, levando a precificacao errada e perda de lucro. Calculos manuais sao propensos a erros e demorados.",
    },
    solution: {
      en: "Built a complete SaaS platform with automated cost calculation from print files, marketplace fee integration, inventory management, and financial dashboards — helping makers price correctly and profit.",
      pt: "Construi uma plataforma SaaS completa com calculo automatizado de custos a partir de arquivos de impressao, integracao de taxas de marketplace, gestao de estoque e dashboards financeiros — ajudando makers a precificar corretamente e lucrar.",
    },
    metrics: [
      { value: "2.5k+", label: { en: "Active makers", pt: "Makers ativos" }, color: "purple" },
      { value: "15k+", label: { en: "Projects calculated", pt: "Projetos calculados" }, color: "cyan" },
      { value: "98%", label: { en: "Satisfaction", pt: "Satisfacao" }, color: "green" },
      { value: "Live", label: { en: "Production", pt: "Producao" }, color: "pink" },
    ],
    links: {
      live: "https://www.vultrix3d.com.br",
      github: "https://github.com/JE4NVRG/Vultrix",
    },
    image: "/projects/vultrix-3d.png",
    gradient: "from-blue-900 to-cyan-900",
    featured: true,
  },
  {
    slug: "openclaw-gateway",
    title: "OpenClaw Gateway",
    description: {
      en: "Multi-platform automation gateway with AI-powered workflows",
      pt: "Gateway de automacao multi-plataforma com workflows de IA",
    },
    longDescription: {
      en: "A centralized automation gateway that orchestrates AI-powered workflows across multiple platforms. Features intelligent routing, real-time monitoring, and 24/7 automated operations with high availability.",
      pt: "Um gateway de automacao centralizado que orquestra workflows com IA em multiplas plataformas. Possui roteamento inteligente, monitoramento em tempo real e operacoes automatizadas 24/7 com alta disponibilidade.",
    },
    status: "live",
    dateRange: "2024 — Present",
    category: "Automation Platform",
    technologies: ["Node.js", "OpenAI", "Supabase", "TypeScript"],
    problem: {
      en: "Manual processes scattered across multiple platforms with no centralized control, leading to inefficiency and human error in critical workflows.",
      pt: "Processos manuais espalhados em multiplas plataformas sem controle centralizado, levando a ineficiencia e erros humanos em workflows criticos.",
    },
    solution: {
      en: "Built a centralized gateway with AI-powered routing, automated workflows, and comprehensive monitoring that runs 24/7 with 99.9% uptime.",
      pt: "Construi um gateway centralizado com roteamento por IA, workflows automatizados e monitoramento abrangente que roda 24/7 com 99.9% de uptime.",
    },
    metrics: [
      { value: "99.9%", label: { en: "Uptime", pt: "Uptime" }, color: "purple" },
      { value: "5k+", label: { en: "Requests/day", pt: "Requests/dia" }, color: "cyan" },
      { value: "8", label: { en: "Automations", pt: "Automacoes" }, color: "green" },
      { value: "24/7", label: { en: "Monitoring", pt: "Monitoramento" }, color: "pink" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/openclaw-gateway",
    },
    image: "/projects/openclaw-gateway.png",
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
    longDescription: {
      en: "An intelligent WhatsApp chatbot platform that automates customer service with AI-powered responses, integrated with a CNPJ management dashboard for business operations.",
      pt: "Uma plataforma inteligente de chatbot WhatsApp que automatiza o atendimento ao cliente com respostas por IA, integrada com um painel de gestao CNPJ para operacoes empresariais.",
    },
    status: "mvp",
    dateRange: "2024",
    category: "AI Chatbot",
    technologies: ["Node.js", "Firebase", "OpenAI", "FlutterFlow"],
    problem: {
      en: "Businesses spending excessive time on repetitive customer inquiries, with no automated way to handle CNPJ lookups and common questions.",
      pt: "Empresas gastando tempo excessivo com consultas repetitivas de clientes, sem forma automatizada de lidar com consultas CNPJ e perguntas comuns.",
    },
    solution: {
      en: "Built an AI-powered WhatsApp bot that handles 100% of routine inquiries automatically, with a management dashboard for monitoring conversations and CNPJ data.",
      pt: "Construi um bot WhatsApp com IA que lida com 100% das consultas rotineiras automaticamente, com um painel de gestao para monitorar conversas e dados de CNPJ.",
    },
    metrics: [
      { value: "100%", label: { en: "Automated", pt: "Automatizado" }, color: "green" },
      { value: "MVP", label: { en: "Validated", pt: "Validado" }, color: "cyan" },
      { value: "Active", label: { en: "User base", pt: "Base ativa" }, color: "purple" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/mepchat",
    },
    gradient: "from-emerald-900 to-teal-900",
    featured: false,
  },
  {
    slug: "hypefc",
    title: "HypeFC",
    description: {
      en: "Real-time football dashboard with live scores and standings",
      pt: "Dashboard de futebol em tempo real com placares e classificacoes",
    },
    longDescription: {
      en: "A comprehensive real-time football dashboard tracking live matches, standings, trending teams, and top scorers across 8+ leagues worldwide. Features live score updates, league standings with filters, trending team rankings, and top scorer leaderboards — all updating in real time.",
      pt: "Um dashboard de futebol em tempo real abrangente que acompanha partidas ao vivo, classificacoes, times em alta e artilheiros em 8+ ligas mundiais. Placares ao vivo, classificacoes com filtros, ranking de times e liderancas de artilharia — tudo atualizando em tempo real.",
    },
    status: "live",
    dateRange: "2026 — Present",
    category: "Sports Dashboard",
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
      { value: "8+", label: { en: "Leagues", pt: "Ligas" }, color: "purple" },
      { value: "Live", label: { en: "Real-time", pt: "Tempo real" }, color: "green" },
      { value: "27+", label: { en: "Goals/day", pt: "Gols/dia" }, color: "cyan" },
      { value: "24/7", label: { en: "Tracking", pt: "Monitoramento" }, color: "pink" },
    ],
    links: {
      live: "https://hypefc.je4ndev.com",
    },
    image: "/projects/hypefc.png",
    gradient: "from-green-900 to-emerald-900",
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

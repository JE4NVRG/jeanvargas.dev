import type { Project } from "@/types/project";

export const projects: Project[] = [
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
    slug: "criptopto",
    title: "Criptopto",
    description: {
      en: "AI-powered crypto trading bot with Bybit integration",
      pt: "Bot de trading cripto com IA e integracao Bybit",
    },
    longDescription: {
      en: "An automated cryptocurrency trading bot that uses AI for market analysis and executes trades on Bybit. Features real-time monitoring of 10+ coins with 24/7 automated trading.",
      pt: "Um bot automatizado de trading de criptomoedas que usa IA para analise de mercado e executa operacoes na Bybit. Monitoramento em tempo real de 10+ moedas com trading automatizado 24/7.",
    },
    status: "mvp",
    dateRange: "2024",
    category: "AI Trading",
    technologies: ["Node.js", "Supabase", "OpenAI", "CCXT"],
    problem: {
      en: "Manual crypto trading is time-consuming and emotional, missing opportunities in volatile markets that require 24/7 attention.",
      pt: "Trading manual de cripto e demorado e emocional, perdendo oportunidades em mercados volateis que exigem atencao 24/7.",
    },
    solution: {
      en: "Built an AI-driven trading bot that analyzes market patterns, manages risk automatically, and executes trades around the clock without emotional bias.",
      pt: "Construi um bot de trading com IA que analisa padroes de mercado, gerencia risco automaticamente e executa operacoes 24h sem vies emocional.",
    },
    metrics: [
      { value: "10+", label: { en: "Coins tested", pt: "Moedas testadas" }, color: "purple" },
      { value: "AI", label: { en: "Analysis", pt: "Analise" }, color: "cyan" },
      { value: "24/7", label: { en: "Monitoring", pt: "Monitoramento" }, color: "green" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/criptopto",
    },
    gradient: "from-orange-900 to-red-900",
    featured: false,
  },
  {
    slug: "petconnect",
    title: "PetConnect",
    description: {
      en: "Pet adoption platform connecting shelters and adopters",
      pt: "Plataforma de adocao de pets conectando abrigos e adotantes",
    },
    longDescription: {
      en: "A mobile-first platform that connects animal shelters with potential adopters. Features complete pet management, adoption workflow, and real-time communication between parties.",
      pt: "Uma plataforma mobile-first que conecta abrigos de animais com potenciais adotantes. Gestao completa de pets, workflow de adocao e comunicacao em tempo real entre as partes.",
    },
    status: "mvp",
    dateRange: "2024",
    category: "Social Platform",
    technologies: ["FlutterFlow", "Firebase", "Supabase"],
    problem: {
      en: "Animal shelters struggle to reach potential adopters, with no centralized platform to manage and promote pets available for adoption.",
      pt: "Abrigos de animais tem dificuldade em alcancar potenciais adotantes, sem plataforma centralizada para gerenciar e promover pets disponiveis para adocao.",
    },
    solution: {
      en: "Created a mobile-first platform with complete adoption workflow, connecting shelters directly with adopters through an intuitive interface.",
      pt: "Criei uma plataforma mobile-first com workflow completo de adocao, conectando abrigos diretamente com adotantes atraves de uma interface intuitiva.",
    },
    metrics: [
      { value: "MVP", label: { en: "Validated", pt: "Validado" }, color: "purple" },
      { value: "Social", label: { en: "Impact", pt: "Impacto" }, color: "pink" },
      { value: "100%", label: { en: "Responsive", pt: "Responsivo" }, color: "cyan" },
    ],
    links: {
      github: "https://github.com/JE4NVRG/petconnect",
    },
    gradient: "from-purple-900 to-pink-900",
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

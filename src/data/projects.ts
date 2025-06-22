// ====================================
// INTERFACE DO PROJETO PARA GALERIA
// ====================================
export interface ProjetoGaleria {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  link: string;
  tecnologias: TecnologiaTag[];
  categoria: "fullstack" | "mobile" | "ia" | "backend";
}

export interface TecnologiaTag {
  nome: string;
  cor: string;
  icone?: string; // Para futuros ícones personalizados
}

// ====================================
// DADOS DOS PROJETOS PARA GALERIA
// ====================================
export const projetosGaleria: ProjetoGaleria[] = [
  {
    id: 1,
    nome: "MepChat",
    descricao:
      "Plataforma WhatsApp com chatbot inteligente e painel CNPJ. Automatiza 100% dos atendimentos com IA.",
    imagem:
      "https://via.placeholder.com/800x600/16a34a/ffffff?text=MepChat+WhatsApp+Bot",
    link: "https://github.com/JE4NVRG/mepchat",
    categoria: "fullstack",
    tecnologias: [
      { nome: "Node.js", cor: "bg-green-500/20 text-green-400" },
      { nome: "Firebase", cor: "bg-orange-500/20 text-orange-400" },
      { nome: "OpenAI", cor: "bg-purple-500/20 text-purple-400" },
      { nome: "WhatsApp API", cor: "bg-emerald-500/20 text-emerald-400" },
    ],
  },
  {
    id: 2,
    nome: "PetConnect",
    descricao:
      "Plataforma de adoção de pets conectando ONGs e adotantes. Gestão completa com interface mobile-first.",
    imagem:
      "https://via.placeholder.com/800x600/f59e0b/ffffff?text=PetConnect+Adoption",
    link: "https://github.com/JE4NVRG/petconnect",
    categoria: "mobile",
    tecnologias: [
      { nome: "FlutterFlow", cor: "bg-blue-500/20 text-blue-400" },
      { nome: "Firebase", cor: "bg-orange-500/20 text-orange-400" },
      { nome: "Supabase", cor: "bg-green-500/20 text-green-400" },
      { nome: "Google Maps", cor: "bg-red-500/20 text-red-400" },
    ],
  },
  {
    id: 3,
    nome: "Criptopto",
    descricao:
      "Bot de trading automatizado com IA para análise de mercado. Integração Bybit com monitoramento 24/7.",
    imagem:
      "https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Criptopto+Trading+Bot",
    link: "https://github.com/JE4NVRG/criptopto",
    categoria: "ia",
    tecnologias: [
      { nome: "TypeScript", cor: "bg-blue-500/20 text-blue-400" },
      { nome: "PostgreSQL", cor: "bg-indigo-500/20 text-indigo-400" },
      { nome: "OpenAI", cor: "bg-purple-500/20 text-purple-400" },
      { nome: "Docker", cor: "bg-cyan-500/20 text-cyan-400" },
    ],
  },
  {
    id: 4,
    nome: "Portfolio Responsivo",
    descricao:
      "Portfolio pessoal com cursor personalizado, animações fluidas e otimização de performance avançada.",
    imagem:
      "https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Portfolio+Responsivo",
    link: "https://github.com/JE4NVRG/portfolio-jean",
    categoria: "fullstack",
    tecnologias: [
      { nome: "Next.js", cor: "bg-gray-500/20 text-gray-300" },
      { nome: "TailwindCSS", cor: "bg-teal-500/20 text-teal-400" },
      { nome: "Framer Motion", cor: "bg-pink-500/20 text-pink-400" },
      { nome: "TypeScript", cor: "bg-blue-500/20 text-blue-400" },
    ],
  },
  {
    id: 5,
    nome: "E-commerce API",
    descricao:
      "API REST completa para e-commerce com autenticação JWT, pagamentos Stripe e notificações em tempo real.",
    imagem:
      "https://via.placeholder.com/800x600/ef4444/ffffff?text=E-commerce+API",
    link: "https://github.com/JE4NVRG/ecommerce-api",
    categoria: "backend",
    tecnologias: [
      { nome: "Node.js", cor: "bg-green-500/20 text-green-400" },
      { nome: "Express", cor: "bg-gray-500/20 text-gray-300" },
      { nome: "MongoDB", cor: "bg-green-600/20 text-green-500" },
      { nome: "Stripe", cor: "bg-purple-600/20 text-purple-400" },
    ],
  },
  {
    id: 6,
    nome: "Dashboard Analytics",
    descricao:
      "Dashboard interativo com visualizações de dados, métricas em tempo real e relatórios automatizados.",
    imagem:
      "https://via.placeholder.com/800x600/10b981/ffffff?text=Dashboard+Analytics",
    link: "https://github.com/JE4NVRG/dashboard-analytics",
    categoria: "fullstack",
    tecnologias: [
      { nome: "React", cor: "bg-cyan-500/20 text-cyan-400" },
      { nome: "D3.js", cor: "bg-orange-500/20 text-orange-400" },
      { nome: "GraphQL", cor: "bg-pink-500/20 text-pink-400" },
      { nome: "Redis", cor: "bg-red-500/20 text-red-400" },
    ],
  },
];

// ====================================
// UTILITÁRIOS
// ====================================
export const getTecnologiasCores = () => {
  const cores = [
    "bg-blue-500/20 text-blue-400",
    "bg-green-500/20 text-green-400",
    "bg-purple-500/20 text-purple-400",
    "bg-orange-500/20 text-orange-400",
    "bg-pink-500/20 text-pink-400",
    "bg-cyan-500/20 text-cyan-400",
    "bg-red-500/20 text-red-400",
    "bg-indigo-500/20 text-indigo-400",
  ];
  return cores;
};

export const filtrarPorCategoria = (categoria?: string) => {
  if (!categoria) return projetosGaleria;
  return projetosGaleria.filter((projeto) => projeto.categoria === categoria);
};

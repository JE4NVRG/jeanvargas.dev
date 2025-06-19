import {
  MessageCircle,
  Users,
  Briefcase,
  Clock,
  LucideIcon,
} from "lucide-react";

export interface Feedback {
  id: number;
  nome: string;
  cargo: string;
  empresa?: string;
  avatar: string;
  avaliacao: number;
  depoimento: string;
}

export interface Metrica {
  id: number;
  icone: LucideIcon;
  valor: string;
  valorNumerico: number;
  sufixo?: string;
  prefixo?: string;
  decimais?: number;
  separador?: string;
  descricao: string;
  destaque?: boolean;
}

export interface Selo {
  id: number;
  texto: string;
  icone: string;
  cor: "emerald" | "blue" | "purple" | "orange" | "cyan";
}

export const feedbacks: Feedback[] = [
  {
    id: 1,
    nome: "Carlos Henrique",
    cargo: "CEO da Innova Marketing",
    avatar: "https://i.pravatar.cc/150?img=10",
    avaliacao: 5,
    depoimento:
      "Jean entregou uma solução de automação que revolucionou nosso atendimento. Reduzimos 80% do tempo manual e aumentamos a satisfação dos clientes significativamente.",
  },
  {
    id: 2,
    nome: "Mariana Lopes",
    cargo: "Fundadora da Tech Solutions",
    avatar: "https://i.pravatar.cc/150?img=12",
    avaliacao: 4.8,
    depoimento:
      "Trabalho excepcional! A plataforma desenvolvida pelo Jean superou nossas expectativas. Interface moderna, performance incrível e funcionalidades inovadoras.",
  },
  {
    id: 3,
    nome: "Rodrigo Azevedo",
    cargo: "CTO da StartupFlow",
    avatar: "https://i.pravatar.cc/150?img=16",
    avaliacao: 5,
    depoimento:
      "Profissional extremamente competente e dedicado. Implementou nossa arquitetura serverless com integração de IA de forma impecável. Recomendo fortemente!",
  },
  {
    id: 4,
    nome: "Ana Carolina",
    cargo: "Diretora de Operações",
    empresa: "E-commerce Pro",
    avatar: "https://i.pravatar.cc/150?img=8",
    avaliacao: 4.9,
    depoimento:
      "A automação desenvolvida pelo Jean transformou nosso e-commerce. Aumento de 150% nas conversões e processo totalmente otimizado. Parceria de longo prazo garantida!",
  },
  {
    id: 5,
    nome: "João Pedro",
    cargo: "CEO da ConnectPay",
    avatar: "https://i.pravatar.cc/150?img=21",
    avaliacao: 5.0,
    depoimento:
      "Jean criou uma plataforma segura e escalável em tempo recorde. Suporte impecável e código limpo!",
  },
  {
    id: 6,
    nome: "Fabiana Souza",
    cargo: "Gerente de Produto na ZenAI",
    avatar: "https://i.pravatar.cc/150?img=25",
    avaliacao: 4.9,
    depoimento:
      "O painel com IA integrado nos ajudou a tomar decisões 3x mais rápido. Jean entende de verdade do assunto!",
  },
  {
    id: 7,
    nome: "Felipe Ramos",
    cargo: "Fundador da AutoScale",
    avatar: "https://i.pravatar.cc/150?img=28",
    avaliacao: 5.0,
    depoimento:
      "A automação de funis que ele entregou fez nossa conversão crescer 72%. Simplesmente genial.",
  },
  {
    id: 8,
    nome: "Luana Martins",
    cargo: "CMO da ShopX",
    avatar: "https://i.pravatar.cc/150?img=30",
    avaliacao: 4.7,
    depoimento:
      "A integração com APIs externas foi perfeita. Jean tem um olhar técnico afiado e foco no resultado.",
  },
];

export const metricas: Metrica[] = [
  {
    id: 1,
    icone: MessageCircle,
    valor: "+120k",
    valorNumerico: 120,
    sufixo: "k+",
    descricao: "Mensagens automatizadas processadas",
    destaque: true,
  },
  {
    id: 2,
    icone: Users,
    valor: "+25",
    valorNumerico: 25,
    prefixo: "+",
    descricao: "Clientes atendidos com sucesso",
  },
  {
    id: 3,
    icone: Briefcase,
    valor: "12",
    valorNumerico: 12,
    descricao: "Projetos em produção ativa",
  },
  {
    id: 4,
    icone: Clock,
    valor: "99.8%",
    valorNumerico: 99.8,
    decimais: 1,
    sufixo: "%",
    descricao: "Uptime médio das aplicações",
  },
];

export const selos: Selo[] = [
  {
    id: 1,
    texto: "Soluções em produção",
    icone: "✅",
    cor: "emerald",
  },
  {
    id: 2,
    texto: "IA e Automação Integradas",
    icone: "🤖",
    cor: "blue",
  },
  {
    id: 3,
    texto: "Segurança validada",
    icone: "🔐",
    cor: "purple",
  },
  {
    id: 4,
    texto: "Full Stack + APIs & Web3",
    icone: "⚙️",
    cor: "orange",
  },
  {
    id: 5,
    texto: "Performance otimizada",
    icone: "🚀",
    cor: "cyan",
  },
];

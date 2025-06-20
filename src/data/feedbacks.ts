import {
  MessageCircle,
  Users,
  Briefcase,
  Clock,
  LucideIcon,
} from "lucide-react";

// ====================================
// INTERFACES PARA TIPAGEM
// ====================================

export interface Feedback {
  id: number;
  nome: string;
  cargo: string;
  empresa?: string;
  avatar: string; // URL da imagem do avatar (pode usar pravatar.cc ou imagens próprias)
  avaliacao: number; // Nota de 1 a 5 (aceita decimais como 4.8)
  depoimento: string;
}

export interface Metrica {
  id: number;
  icone: LucideIcon; // Ícone do Lucide React
  valor: string; // Valor formatado para exibição (ex: "+120k", "99.8%")
  valorNumerico: number; // Valor numérico para animação do contador
  sufixo?: string; // Texto após o número (ex: "%", "k+")
  prefixo?: string; // Texto antes do número (ex: "+", "$")
  decimais?: number; // Quantidade de casas decimais
  separador?: string; // Separador de milhares
  descricao: string;
  destaque?: boolean; // Se true, aplica estilo especial destacado
}

export interface Selo {
  id: number;
  texto: string;
  icone: string; // Emoji ou símbolo
  cor: "emerald" | "blue" | "purple" | "orange" | "cyan"; // Cores predefinidas
}

// ====================================
// DADOS DOS FEEDBACKS
// ====================================
// Para alterar/adicionar depoimentos:
// 1. avatar: Use https://i.pravatar.cc/150?img=NUMERO (1-70) ou sua própria URL
// 2. avaliacao: Número de 1 a 5 (pode usar decimais como 4.8)
// 3. nome, cargo, empresa: Informações do cliente
// 4. depoimento: Texto do feedback (máximo recomendado: 200 caracteres)

export const feedbacks: Feedback[] = [
  {
    id: 1,
    nome: "Carlos Henrique",
    cargo: "CEO da Innova Marketing",
    // AVATARES: Opções para trocar a imagem:
    // 1. Pravatar: https://i.pravatar.cc/150?img=1 até ?img=70 (números diferentes = pessoas diferentes)
    // 2. Unsplash: https://images.unsplash.com/photo-ID?w=150&h=150&fit=crop&crop=face
    // 3. Sua própria imagem: coloque na pasta /public/ e use "/nome-da-imagem.jpg"
    avatar: "https://i.pravatar.cc/150?img=14", // Homem profissional - mais adequado para CEO
    avaliacao: 5,
    depoimento:
      "Jean entregou uma solução de automação que revolucionou nosso atendimento. Reduzimos 80% do tempo manual e aumentamos a satisfação dos clientes significativamente.",
  },
  {
    id: 2,
    nome: "Mariana Lopes",
    cargo: "Fundadora da Tech Solutions",
    avatar: "https://i.pravatar.cc/150?img=9", // Mulher profissional - adequada para fundadora
    avaliacao: 4.8,
    depoimento:
      "Trabalho excepcional! A plataforma desenvolvida pelo Jean superou nossas expectativas. Interface moderna, performance incrível e funcionalidades inovadoras.",
  },
  {
    id: 3,
    nome: "Rodrigo Azevedo",
    cargo: "CTO da StartupFlow",
    avatar: "https://i.pravatar.cc/150?img=11", // Homem jovem - adequado para CTO de startup
    avaliacao: 5,
    depoimento:
      "Profissional extremamente competente e dedicado. Implementou nossa arquitetura serverless com integração de IA de forma impecável. Recomendo fortemente!",
  },
  {
    id: 4,
    nome: "Ana Carolina",
    cargo: "Diretora de Operações",
    empresa: "E-commerce Pro",
    avatar: "https://i.pravatar.cc/150?img=5", // Mulher executiva - adequada para diretora
    avaliacao: 4.9,
    depoimento:
      "A automação desenvolvida pelo Jean transformou nosso e-commerce. Aumento de 150% nas conversões e processo totalmente otimizado. Parceria de longo prazo garantida!",
  },
  {
    id: 5,
    nome: "João Pedro",
    cargo: "CEO da ConnectPay",
    avatar: "https://i.pravatar.cc/150?img=7", // Homem maduro - adequado para CEO
    avaliacao: 5.0,
    depoimento:
      "Jean criou uma plataforma segura e escalável em tempo recorde. Suporte impecável e código limpo!",
  },
  {
    id: 6,
    nome: "Fabiana Souza",
    cargo: "Gerente de Produto na ZenAI",
    avatar: "https://i.pravatar.cc/150?img=1", // Mulher jovem - adequada para gerente de produto
    avaliacao: 4.9,
    depoimento:
      "O painel com IA integrado nos ajudou a tomar decisões 3x mais rápido. Jean entende de verdade do assunto!",
  },
  {
    id: 7,
    nome: "Felipe Ramos",
    cargo: "Fundador da AutoScale",
    avatar: "https://i.pravatar.cc/150?img=3", // Homem empreendedor - adequado para fundador
    avaliacao: 5.0,
    depoimento:
      "A automação de funis que ele entregou fez nossa conversão crescer 72%. Simplesmente genial.",
  },
  {
    id: 8,
    nome: "Luana Martins",
    cargo: "CMO da ShopX",
    avatar: "https://i.pravatar.cc/150?img=2", // Mulher marketing - adequada para CMO
    avaliacao: 4.7,
    depoimento:
      "A integração com APIs externas foi perfeita. Jean tem um olhar técnico afiado e foco no resultado.",
  },
];

// ====================================
// MÉTRICAS E NÚMEROS DE IMPACTO
// ====================================
// Para alterar métricas:
// 1. icone: Escolha ícones do Lucide React (MessageCircle, Users, etc.)
// 2. valor: String formatada como será exibida (ex: "+120k", "99.8%")
// 3. valorNumerico: Número para a animação (sem formatação)
// 4. sufixo/prefixo: Adicione símbolos se necessário
// 5. destaque: true para destacar a métrica principal

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

// ====================================
// SELOS DE CONFIANÇA
// ====================================
// Para alterar selos:
// 1. texto: Descrição da garantia/certificação
// 2. icone: Emoji ou símbolo visual
// 3. cor: "emerald" | "blue" | "purple" | "orange" | "cyan"

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

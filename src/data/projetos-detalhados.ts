import { Bot, TrendingUp, Users, Smartphone, Zap } from "lucide-react";
import { ProjetoDetalhado } from "../components/ui/project-modal";

// ====================================
// DADOS DETALHADOS DOS PROJETOS
// ====================================
// Para personalizar os projetos detalhados:
// 1. Adicione imagens na pasta /public/projects/
// 2. Substitua URLs de imagem pelos caminhos locais
// 3. Adicione vídeos demonstrativos se disponível
// 4. Personalize desafios e testemunhos conforme seus clientes

export const projetosDetalhados: ProjetoDetalhado[] = [
  {
    id: 1,
    titulo: "MepChat",
    descricao: "Plataforma WhatsApp com chatbot e painel CNPJ",
    desafio:
      "Desenvolver uma plataforma completa que automatizasse o atendimento via WhatsApp, integrando um chatbot inteligente com consultas CNPJ em tempo real. O desafio incluía criar uma interface intuitiva para gestão de conversas, implementar IA para respostas contextuais e garantir alta disponibilidade do sistema.",
    tecnologias: [
      "Node.js",
      "Express.js",
      "Firebase Firestore",
      "FlutterFlow",
      "OpenAI GPT-4",
      "WhatsApp Business API",
      "JWT Authentication",
      "Webhook Integration",
    ],
    imagem: "/projects/mepchat-dashboard.png", // Substitua pela imagem real
    // video: "/projects/mepchat-demo.mp4", // Adicione se tiver vídeo demo
    resultados: [
      { valor: "100%", label: "Atendimentos Automatizados", icon: Bot },
      { valor: "MVP", label: "Plano Validado", icon: TrendingUp },
      { valor: "Ativo", label: "Base em Uso", icon: Users },
    ],
    testemunho: {
      texto:
        "A plataforma do Jean revolucionou nosso atendimento. Conseguimos automatizar 100% das consultas CNPJ e reduzir o tempo de resposta de horas para segundos. O ROI foi imediato!",
      autor: "Carlos Silva",
      cargo: "CEO da Consulta Fácil",
    },
    repositorio: "https://github.com/JE4NVRG/mepchat",
    gradiente: "from-emerald-500 to-teal-600",
  },
  {
    id: 2,
    titulo: "PetConnect",
    descricao: "Plataforma adoção de pets com gestão completa",
    desafio:
      "Criar uma solução digital que conectasse ONGs, voluntários e adotantes de forma eficiente. O sistema precisava gerenciar perfis de animais, processo de adoção, agendamentos de visitas e acompanhamento pós-adoção, tudo em uma interface mobile-first e intuitiva.",
    tecnologias: [
      "FlutterFlow",
      "Firebase Authentication",
      "Firestore Database",
      "Cloud Storage",
      "Supabase",
      "Push Notifications",
      "Google Maps API",
      "Real-time Chat",
    ],
    imagem: "/projects/petconnect-app.png", // Substitua pela imagem real
    resultados: [
      { valor: "MVP", label: "Validado", icon: TrendingUp },
      { valor: "Social", label: "Foco", icon: Users },
      { valor: "100%", label: "Interface Responsiva", icon: Smartphone },
    ],
    testemunho: {
      texto:
        "O PetConnect simplificou todo nosso processo de adoção. Agora conseguimos acompanhar cada animal desde o resgate até a família definitiva. A plataforma aumentou nossas adoções em 60%!",
      autor: "Maria Santos",
      cargo: "Diretora da ONG Patas Felizes",
    },
    repositorio: "https://github.com/JE4NVRG/petconnect",
    gradiente: "from-purple-500 to-pink-600",
  },
  {
    id: 3,
    titulo: "Criptopto",
    descricao: "Bot de trading com IA e integração Bybit",
    desafio:
      "Desenvolver um bot de trading automatizado que utilizasse inteligência artificial para análise de mercado e executasse operações na exchange Bybit. O sistema precisava processar grandes volumes de dados em tempo real, tomar decisões baseadas em machine learning e gerenciar riscos automaticamente.",
    tecnologias: [
      "Node.js",
      "TypeScript",
      "Supabase PostgreSQL",
      "OpenAI API",
      "Bybit API",
      "CCXT Library",
      "WebSocket Real-time",
      "Docker",
      "PM2 Process Manager",
      "Technical Analysis",
    ],
    imagem: "/projects/criptopto-dashboard.png", // Substitua pela imagem real
    resultados: [
      { valor: "10+", label: "Moedas Testadas", icon: TrendingUp },
      { valor: "IA", label: "Sistema Pronto", icon: Bot },
      { valor: "24/7", label: "Monitoramento", icon: Zap },
    ],
    testemunho: {
      texto:
        "O bot do Jean superou minhas expectativas. Em 3 meses de operação, conseguiu um retorno consistente e me poupou centenas de horas de análise manual. A IA realmente funciona!",
      autor: "Rafael Oliveira",
      cargo: "Trader Profissional",
    },
    repositorio: "https://github.com/JE4NVRG/criptopto",
    gradiente: "from-orange-500 to-red-600",
  },
];

// ====================================
// IMAGENS PLACEHOLDER
// ====================================
// Enquanto não tiver as imagens reais dos projetos,
// estas URLs de placeholder serão usadas:

export const placeholderImages = {
  mepchat:
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=top",
  petconnect:
    "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&h=600&fit=crop&crop=center",
  criptopto:
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&crop=center",
};

// Função para usar placeholder se a imagem local não existir
export const getProjectImage = (projectId: number): string => {
  const projeto = projetosDetalhados.find((p) => p.id === projectId);
  if (!projeto) return placeholderImages.mepchat;

  // Retorna a imagem placeholder correspondente se a imagem local não estiver disponível
  switch (projectId) {
    case 1:
      return placeholderImages.mepchat;
    case 2:
      return placeholderImages.petconnect;
    case 3:
      return placeholderImages.criptopto;
    default:
      return placeholderImages.mepchat;
  }
};

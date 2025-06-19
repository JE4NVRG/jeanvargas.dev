"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  MessageCircle,
  Smartphone,
  Zap,
  Users,
  TrendingUp,
  Globe,
  Server,
  Bot,
  Plug,
  Repeat,
} from "lucide-react";
import { FeatureBlockCard } from "../components/ui/feature-block-card";
import { WhatsAppButton } from "../components/ui/whatsapp-button";
import FeedbacksSection from "../components/ui/feedbacks-section";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";

// ====================================
// DADOS DOS PROJETOS EM DESTAQUE
// ====================================
// Para alterar/adicionar projetos:
// 1. titulo: Nome do projeto
// 2. descricao: Descrição breve (máximo 50 caracteres)
// 3. tecnologias: Array com as tecnologias utilizadas
// 4. resultados: Array com métricas do projeto (valor, label, icon)
// 5. gradiente: Classes Tailwind para gradiente (from-cor-500 to-cor-600)
// 6. link: URL do repositório GitHub ou site do projeto

const projetosDestaque = [
  {
    id: 1,
    titulo: "MepChat",
    descricao: "Plataforma WhatsApp com chatbot e painel CNPJ",
    tecnologias: ["Node.js", "Firebase", "FlutterFlow", "OpenAI"],
    resultados: [
      { valor: "100%", label: "Atendimentos Automatizados", icon: Bot },
      { valor: "MVP", label: "Plano Validado", icon: TrendingUp },
      { valor: "Ativo", label: "Base em Uso", icon: Users },
    ],
    gradiente: "from-emerald-500 to-teal-600",
    link: "https://github.com/JE4NVRG/mepchat",
  },
  {
    id: 2,
    titulo: "PetConnect",
    descricao: "Plataforma adoção de pets com gestão",
    tecnologias: ["FlutterFlow", "Firebase", "Supabase"],
    resultados: [
      { valor: "MVP", label: "Validado", icon: TrendingUp },
      { valor: "Social", label: "Foco", icon: Users },
      { valor: "100%", label: "Interface Responsiva", icon: Smartphone },
    ],
    gradiente: "from-purple-500 to-pink-600",
    link: "https://github.com/JE4NVRG/petconnect",
  },
  {
    id: 3,
    titulo: "Criptopto",
    descricao: "Bot trading com IA e integração Bybit",
    tecnologias: ["Node.js", "Supabase", "OpenAI", "CCXT"],
    resultados: [
      { valor: "10+", label: "Moedas Testadas", icon: TrendingUp },
      { valor: "IA", label: "Sistema Pronto", icon: Bot },
      { valor: "24/7", label: "Monitoramento", icon: Zap },
    ],
    gradiente: "from-orange-500 to-red-600",
    link: "https://github.com/JE4NVRG/criptopto",
  },
];

// ====================================
// DADOS DOS SERVIÇOS OFERECIDOS
// ====================================
// Para alterar/adicionar serviços:
// 1. titulo: Nome do serviço
// 2. descricao: Descrição detalhada do serviço
// 3. icon: Ícone do Lucide React (Globe, Server, Smartphone, etc.)
// 4. destaque: true para destacar o serviço (background diferenciado)
// 5. tamanho: "normal" | "wide" | "tall" (define o tamanho do card no grid)

const servicos = [
  {
    id: 1,
    titulo: "Sites & Landing Pages",
    descricao: "Sites modernos e responsivos com foco em conversão",
    icon: Globe,
    destaque: false,
    tamanho: "normal",
  },
  {
    id: 2,
    titulo: "Plataformas SaaS",
    descricao: "Sistemas completos escaláveis para seu negócio",
    icon: Server,
    destaque: true,
    tamanho: "wide",
  },
  {
    id: 3,
    titulo: "Apps FlutterFlow",
    descricao: "Aplicativos mobile nativos sem código",
    icon: Smartphone,
    destaque: false,
    tamanho: "normal",
  },
  {
    id: 4,
    titulo: "Bots com IA",
    descricao: "Automações inteligentes para atendimento",
    icon: Bot,
    destaque: true,
    tamanho: "tall",
  },
  {
    id: 5,
    titulo: "Integrações APIs",
    descricao: "Conecte sistemas e automatize processos",
    icon: Plug,
    destaque: false,
    tamanho: "normal",
  },
  {
    id: 6,
    titulo: "Automação",
    descricao: "Fluxos automatizados para produtividade",
    icon: Repeat,
    destaque: false,
    tamanho: "normal",
  },
];

// ====================================
// DADOS DAS TECNOLOGIAS UTILIZADAS
// ====================================
// Para alterar/adicionar tecnologias:
// 1. nome: Nome da tecnologia ou ferramenta
// 2. emoji: Emoji representativo da tecnologia
// 3. categoria: "Frontend" | "Backend" | "Database" | "Mobile" | "IA" | "Blockchain" | "DevOps" | "Cloud" | "Linguagem"
// Dica: Organize por categoria para melhor visualização

const tecnologias = [
  { nome: "Next.js", emoji: "⚛️", categoria: "Frontend" },
  { nome: "TypeScript", emoji: "📘", categoria: "Linguagem" },
  { nome: "Python", emoji: "🐍", categoria: "Backend" },
  { nome: "Supabase", emoji: "🗄️", categoria: "Database" },
  { nome: "FlutterFlow", emoji: "📱", categoria: "Mobile" },
  { nome: "OpenAI", emoji: "🤖", categoria: "IA" },
  { nome: "Solidity", emoji: "⛓️", categoria: "Blockchain" },
  { nome: "Node.js", emoji: "🟢", categoria: "Backend" },
  { nome: "React", emoji: "⚛️", categoria: "Frontend" },
  { nome: "PostgreSQL", emoji: "🐘", categoria: "Database" },
  { nome: "Docker", emoji: "🐳", categoria: "DevOps" },
  { nome: "AWS/Vercel", emoji: "☁️", categoria: "Cloud" },
];

// Tipos TypeScript

const ProjectCard = ({
  projeto,
  index,
}: {
  projeto: (typeof projetosDestaque)[0];
  index: number;
}) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Header com gradiente */}
      <div
        className={`h-32 bg-gradient-to-r ${projeto.gradiente} p-6 text-white`}
      >
        <h3 className="text-xl font-bold mb-2">{projeto.titulo}</h3>
        <p className="text-sm opacity-90">{projeto.descricao}</p>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Tecnologias */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Tecnologias
          </h4>
          <div className="flex flex-wrap gap-2">
            {projeto.tecnologias.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Resultados
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {projeto.resultados.map((resultado, idx) => (
              <div key={idx} className="text-center">
                <resultado.icon
                  size={16}
                  className="mx-auto mb-1 text-gray-600 dark:text-gray-400"
                />
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {resultado.valor}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {resultado.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link */}
        <motion.a
          href={projeto.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center w-full bg-gradient-to-r ${projeto.gradiente} text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Ver Projeto
          <ExternalLink size={16} className="ml-2" />
        </motion.a>
      </div>
    </motion.div>
  );
};

const ServiceCard = ({
  servico,
  index,
}: {
  servico: (typeof servicos)[0];
  index: number;
}) => {
  const getGridClasses = () => {
    switch (servico.tamanho) {
      case "wide":
        return "md:col-span-2";
      case "tall":
        return "md:row-span-2";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 ${getGridClasses()}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <servico.icon
              size={servico.destaque ? 48 : 32}
              className="text-blue-400 mb-4"
            />
          </div>
          <h3
            className={`font-bold text-white mb-3 ${
              servico.destaque ? "text-xl" : "text-lg"
            }`}
          >
            {servico.titulo}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {servico.descricao}
          </p>
        </div>

        <motion.button
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Saiba Mais
        </motion.button>
      </div>
    </motion.div>
  );
};

const TechCard = ({
  tech,
  index,
}: {
  tech: (typeof tecnologias)[0];
  index: number;
}) => {
  return (
    <motion.div
      className="group p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="text-center">
        <div className="text-3xl mb-3">{tech.emoji}</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {tech.nome}
        </h3>
        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
          {tech.categoria}
        </span>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const whatsappMessage =
    "Olá! Gostaria de solicitar um orçamento para desenvolvimento de projeto.";
  const whatsappUrl = `https://wa.me/5511948477047?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
      {/* Hero Section */}
      <section
        data-hero
        data-dark-section
        className="relative overflow-hidden text-white bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-800/80 min-h-screen"
      >
        {/* Background Beams With Collision - Fundo animado para toda a tela */}
        <BackgroundBeamsWithCollision className="z-0">
          <div></div>
        </BackgroundBeamsWithCollision>

        <div className="relative container mx-auto px-6 py-24 sm:py-32 z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Nome com efeito neon simples */}
            <motion.div
              className="mb-4 flex items-center justify-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Texto principal com borda neon */}
              <motion.div
                className="relative inline-block border-2 px-6 py-3 rounded-xl bg-black/30 backdrop-blur-sm"
                style={{
                  borderColor: "rgba(147, 51, 234, 0.8)",
                  boxShadow:
                    "0 0 20px rgba(147, 51, 234, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.1)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.1)",
                    "0 0 25px rgba(236, 72, 153, 0.6), inset 0 0 25px rgba(236, 72, 153, 0.1)",
                    "0 0 20px rgba(147, 51, 234, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.1)",
                  ],
                  borderColor: [
                    "rgba(147, 51, 234, 0.8)",
                    "rgba(236, 72, 153, 0.8)",
                    "rgba(147, 51, 234, 0.8)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center text-white">
                  Jean Carlos Vargas
                </h1>
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-2xl sm:text-3xl mb-6 text-blue-200 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Desenvolvedor Full Stack & Criador de Soluções Digitais com IA
            </motion.h2>

            <motion.div
              className="text-lg sm:text-xl mb-8 text-gray-200 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="mb-4">
                Ajudo empresas e empreendedores a transformar ideias em produtos
                digitais de alto impacto.
              </p>
              <p>
                Entre em contato diretamente comigo para tirar dúvidas ou
                iniciar um projeto.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.a
                href="#contato"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 scroll-smooth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Solicitar Projeto
              </motion.a>

              <motion.a
                href="#servicos"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Serviços
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projetos em Destaque Section */}
      <section
        id="projetos"
        data-section="projects"
        data-dark-section
        className="py-20 px-6 relative"
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Conheça alguns dos meus trabalhos mais recentes, desenvolvidos com
              as melhores tecnologias e focados em resultados reais para o
              negócio.
            </p>
          </motion.div>

          {/* Grid de Projetos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {projetosDestaque.map((projeto, index) => (
              <ProjectCard key={projeto.id} projeto={projeto} index={index} />
            ))}
          </div>

          {/* Seção de Call-to-Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Gostou dos projetos? Vamos trabalhar juntos!
              </h3>
              <p className="text-lg mb-6 text-blue-100">
                Transforme suas ideias em soluções digitais de alto impacto
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle size={20} className="mr-2" />
                  Solicitar Orçamento
                </motion.a>

                <motion.a
                  href="https://github.com/JE4NVRG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg border border-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Todos os Projetos
                  <ExternalLink size={20} className="ml-2" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview Sobre Mim */}
      <section
        data-dark-section
        className="py-16 px-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 relative"
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
              Quem é Jean?
            </h2>

            {/* Grid com imagem e conteúdo */}
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-8 items-center">
              {/* Imagem de perfil - Visível apenas em sm+ */}
              <motion.div
                className="hidden sm:flex justify-center lg:justify-end lg:col-span-1"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative group">
                  {/* Efeito glow animado */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-40 blur-xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Borda animada externa */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 p-1"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-gray-800" />
                  </motion.div>

                  {/* Imagem do GitHub */}
                  <motion.img
                    src="https://avatars.githubusercontent.com/u/106420077?v=4"
                    alt="Jean Carlos Vargas"
                    loading="lazy"
                    className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/30 shadow-2xl z-10 group-hover:scale-105 transition-transform duration-300"
                    whileHover={{ scale: 1.05 }}
                    onError={(e) => {
                      // Fallback para o placeholder SVG
                      const target = e.target as HTMLImageElement;
                      target.src = "/profile-placeholder.svg";
                    }}
                  />

                  {/* Partículas decorativas */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-60 [animation-delay:1s]"></div>
                  <div className="absolute top-4 -left-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-50 [animation-delay:2s]"></div>
                </div>
              </motion.div>

              {/* Conteúdo */}
              <div className="col-span-1 sm:col-span-1 lg:col-span-3 text-center lg:text-left">
                <div className="text-lg text-gray-300 leading-relaxed space-y-4">
                  <p>
                    <span className="text-white font-semibold">
                      Jean Vargas
                    </span>{" "}
                    é desenvolvedor full stack com{" "}
                    <span className="text-blue-400 font-semibold">
                      mais de 10 anos de experiência
                    </span>{" "}
                    na criação de{" "}
                    <span className="text-white font-semibold">
                      soluções digitais completas
                    </span>{" "}
                    — de apps modernos a sistemas robustos e automações com IA.
                  </p>

                  <p>
                    Atua com tecnologias como{" "}
                    <span className="text-blue-400">Next.js</span>,{" "}
                    <span className="text-blue-300">TypeScript</span>,{" "}
                    <span className="text-yellow-400">Python</span>,{" "}
                    <span className="text-green-400">Supabase</span>,{" "}
                    <span className="text-purple-400">FlutterFlow</span>,{" "}
                    <span className="text-gray-300">Solidity</span> e{" "}
                    <span className="text-orange-400">OpenAI</span>.
                  </p>

                  <p>
                    Já criou{" "}
                    <span className="text-white font-semibold">
                      plataformas SaaS, bots inteligentes, integrações com ERPs,
                      contratos inteligentes, tokens, NFTs e criptomoedas
                    </span>{" "}
                    em redes como{" "}
                    <span className="text-purple-300">Ethereum</span> e{" "}
                    <span className="text-yellow-300">BNB Chain</span>, sempre
                    com{" "}
                    <span className="text-blue-400 font-semibold">
                      foco em resultado real
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <motion.div
              className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Seção de Destaque Tecnológico com IA */}
      <section
        data-section="tech-showcase"
        data-dark-section
        className="py-20 px-6 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Tecnologias de Ponta
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ferramentas e tecnologias de IA que uso para criar soluções
              digitais inovadoras e de alto impacto.
            </p>
          </motion.div>

          {/* Card Animado de IA */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FeatureBlockCard />
          </motion.div>

          {/* Grid de Tecnologias Complementares */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              {
                name: "Blockchain",
                icon: Bot,
                color: "text-yellow-400",
                description: "Contratos Inteligentes",
              },
              {
                name: "APIs",
                icon: Plug,
                color: "text-blue-400",
                description: "Integrações",
              },
              {
                name: "Automação",
                icon: Repeat,
                color: "text-green-400",
                description: "Processos",
              },
              {
                name: "Cloud",
                icon: Server,
                color: "text-purple-400",
                description: "Infraestrutura",
              },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                className="group p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <tech.icon
                      className={`w-8 h-8 ${tech.color} transition-transform duration-300 group-hover:scale-110`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tech.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stacks e Tecnologias */}
      <section
        data-section="stacks"
        data-dark-section
        className="py-20 px-6 bg-gray-50 dark:bg-gray-900/80 relative"
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Stacks e Tecnologias
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ferramentas e tecnologias que domino para criar soluções digitais
              robustas e inovadoras.
            </p>
          </motion.div>

          {/* Grid de Tecnologias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tecnologias.map((tech, index) => (
              <TechCard key={index} tech={tech} index={index} />
            ))}
          </div>

          {/* Estatística adicional */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-blue-200">Projetos Entregues</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">12+</div>
                  <div className="text-blue-200">Tecnologias Dominadas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">10+</div>
                  <div className="text-blue-200">Anos de Experiência</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Feedbacks & Resultados */}
      <FeedbacksSection />

      {/* Seção Serviços - Bento Grid */}
      <section
        id="servicos"
        data-section="services"
        data-dark-section
        className="py-20 px-6 bg-gray-900/80 dark:bg-black/80 relative"
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Serviços
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Soluções completas em desenvolvimento para transformar suas ideias
              em produtos digitais de alto valor.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {servicos.map((servico, index) => (
              <ServiceCard key={servico.id} servico={servico} index={index} />
            ))}
          </div>

          {/* Call to Action adicional */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-4">
                Precisa de algo específico?
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                Cada projeto é único. Vamos conversar sobre suas necessidades e
                criar a solução ideal.
              </p>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-gray-900 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={20} className="mr-2" />
                Conversar no WhatsApp
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Contato - Placeholder para formulário futuro */}
      <section
        id="contato"
        data-dark-section
        className="py-20 px-6 bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-indigo-800/80 relative"
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Vamos Trabalhar Juntos?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Entre em contato diretamente comigo para tirar dúvidas ou iniciar
              um projeto.
            </p>

            {/* Placeholder para formulário futuro */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-white text-lg mb-6">
                📋{" "}
                <strong>
                  Formulário de contato será adicionado aqui em breve
                </strong>
              </p>
              <p className="text-blue-200 mb-6">
                Por enquanto, você pode entrar em contato diretamente pelo
                WhatsApp:
              </p>

              {/* Botão WhatsApp */}
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={24} className="mr-3" />
                Falar no WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/90 dark:bg-black/90 text-white py-8 relative">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 Jean Carlos Vargas. Desenvolvido com Next.js, Tailwind CSS e
            Framer Motion.
          </p>
        </div>
      </footer>

      {/* Botão Flutuante do WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}

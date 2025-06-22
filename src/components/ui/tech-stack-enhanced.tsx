"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiPython,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiDjango,
  SiFlutter,
  SiKotlin,
  SiSwift,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiFirebase,
  SiSupabase,
  SiPrisma,
  SiAmazon,
  SiVercel,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiSolidity,
  SiEthereum,
  SiWeb3Dotjs,
  SiOpenai,
  SiTensorflow,
  SiPytorch,
  SiGooglecloud,
} from "react-icons/si";

interface TechItem {
  nome: string;
  icone: React.ComponentType<{ className?: string }>;
  categoria:
    | "Frontend"
    | "Backend"
    | "Mobile"
    | "Banco de Dados"
    | "Cloud & DevOps"
    | "Blockchain"
    | "IA & Automação";
  corBadge: string;
  descricao?: string;
}

const tecnologiasStack: TechItem[] = [
  // Frontend
  {
    nome: "Next.js",
    icone: SiNextdotjs,
    categoria: "Frontend",
    corBadge: "bg-slate-600/20 text-slate-400 border-slate-400/30",
    descricao: "Framework React full-stack",
  },
  {
    nome: "React",
    icone: SiReact,
    categoria: "Frontend",
    corBadge: "bg-cyan-500/20 text-cyan-400 border-cyan-400/30",
    descricao: "Biblioteca JavaScript para UI",
  },
  {
    nome: "TypeScript",
    icone: SiTypescript,
    categoria: "Frontend",
    corBadge: "bg-blue-500/20 text-blue-400 border-blue-400/30",
    descricao: "JavaScript com tipagem estática",
  },
  {
    nome: "JavaScript",
    icone: SiJavascript,
    categoria: "Frontend",
    corBadge: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
    descricao: "Linguagem de programação web",
  },
  {
    nome: "Tailwind CSS",
    icone: SiTailwindcss,
    categoria: "Frontend",
    corBadge: "bg-teal-500/20 text-teal-400 border-teal-400/30",
    descricao: "Framework CSS utilitário",
  },
  {
    nome: "Framer Motion",
    icone: SiFramer,
    categoria: "Frontend",
    corBadge: "bg-pink-500/20 text-pink-400 border-pink-400/30",
    descricao: "Biblioteca de animações React",
  },

  // Backend
  {
    nome: "Node.js",
    icone: SiNodedotjs,
    categoria: "Backend",
    corBadge: "bg-emerald-600/20 text-emerald-400 border-emerald-400/30",
    descricao: "Runtime JavaScript para servidor",
  },
  {
    nome: "Python",
    icone: SiPython,
    categoria: "Backend",
    corBadge: "bg-yellow-600/20 text-yellow-500 border-yellow-500/30",
    descricao: "Linguagem versátil para backend",
  },
  {
    nome: "Express.js",
    icone: SiExpress,
    categoria: "Backend",
    corBadge: "bg-gray-600/20 text-gray-400 border-gray-400/30",
    descricao: "Framework web para Node.js",
  },
  {
    nome: "NestJS",
    icone: SiNestjs,
    categoria: "Backend",
    corBadge: "bg-red-600/20 text-red-400 border-red-400/30",
    descricao: "Framework Node.js escalável",
  },
  {
    nome: "FastAPI",
    icone: SiFastapi,
    categoria: "Backend",
    corBadge: "bg-teal-600/20 text-teal-400 border-teal-400/30",
    descricao: "Framework Python moderno",
  },
  {
    nome: "Django",
    icone: SiDjango,
    categoria: "Backend",
    corBadge: "bg-green-700/20 text-green-500 border-green-500/30",
    descricao: "Framework Python robusto",
  },

  // Mobile
  {
    nome: "Flutter",
    icone: SiFlutter,
    categoria: "Mobile",
    corBadge: "bg-sky-500/20 text-sky-400 border-sky-400/30",
    descricao: "Framework multiplataforma",
  },
  {
    nome: "React Native",
    icone: SiReact,
    categoria: "Mobile",
    corBadge: "bg-blue-600/20 text-blue-400 border-blue-400/30",
    descricao: "Apps mobile com React",
  },
  {
    nome: "Kotlin",
    icone: SiKotlin,
    categoria: "Mobile",
    corBadge: "bg-indigo-500/20 text-indigo-400 border-indigo-400/30",
    descricao: "Linguagem moderna para Android",
  },
  {
    nome: "Swift",
    icone: SiSwift,
    categoria: "Mobile",
    corBadge: "bg-orange-500/20 text-orange-400 border-orange-400/30",
    descricao: "Linguagem para iOS",
  },

  // Banco de Dados
  {
    nome: "PostgreSQL",
    icone: SiPostgresql,
    categoria: "Banco de Dados",
    corBadge: "bg-blue-700/20 text-blue-500 border-blue-500/30",
    descricao: "Banco relacional avançado",
  },
  {
    nome: "MongoDB",
    icone: SiMongodb,
    categoria: "Banco de Dados",
    corBadge: "bg-green-600/20 text-green-500 border-green-500/30",
    descricao: "Banco NoSQL flexível",
  },
  {
    nome: "MySQL",
    icone: SiMysql,
    categoria: "Banco de Dados",
    corBadge: "bg-orange-600/20 text-orange-500 border-orange-500/30",
    descricao: "Banco relacional popular",
  },
  {
    nome: "Redis",
    icone: SiRedis,
    categoria: "Banco de Dados",
    corBadge: "bg-red-600/20 text-red-500 border-red-500/30",
    descricao: "Cache e banco em memória",
  },
  {
    nome: "Firebase",
    icone: SiFirebase,
    categoria: "Banco de Dados",
    corBadge: "bg-amber-500/20 text-amber-400 border-amber-400/30",
    descricao: "Plataforma Google completa",
  },
  {
    nome: "Supabase",
    icone: SiSupabase,
    categoria: "Banco de Dados",
    corBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
    descricao: "Backend-as-a-Service open source",
  },
  {
    nome: "Prisma",
    icone: SiPrisma,
    categoria: "Banco de Dados",
    corBadge: "bg-indigo-600/20 text-indigo-400 border-indigo-400/30",
    descricao: "ORM moderno para TypeScript",
  },

  // Cloud & DevOps
  {
    nome: "AWS",
    icone: SiAmazon,
    categoria: "Cloud & DevOps",
    corBadge: "bg-orange-600/20 text-orange-500 border-orange-500/30",
    descricao: "Serviços de nuvem Amazon",
  },
  {
    nome: "Vercel",
    icone: SiVercel,
    categoria: "Cloud & DevOps",
    corBadge: "bg-black/20 text-gray-300 border-gray-300/30",
    descricao: "Plataforma de deploy moderna",
  },
  {
    nome: "Docker",
    icone: SiDocker,
    categoria: "Cloud & DevOps",
    corBadge: "bg-blue-500/20 text-blue-400 border-blue-400/30",
    descricao: "Containerização de aplicações",
  },
  {
    nome: "Kubernetes",
    icone: SiKubernetes,
    categoria: "Cloud & DevOps",
    corBadge: "bg-blue-600/20 text-blue-500 border-blue-500/30",
    descricao: "Orquestração de containers",
  },
  {
    nome: "Git",
    icone: SiGit,
    categoria: "Cloud & DevOps",
    corBadge: "bg-red-500/20 text-red-400 border-red-400/30",
    descricao: "Sistema de controle de versão",
  },
  {
    nome: "GitHub",
    icone: SiGithub,
    categoria: "Cloud & DevOps",
    corBadge: "bg-gray-600/20 text-gray-400 border-gray-400/30",
    descricao: "Plataforma de código",
  },

  // Blockchain
  {
    nome: "Solidity",
    icone: SiSolidity,
    categoria: "Blockchain",
    corBadge: "bg-gray-700/20 text-gray-400 border-gray-400/30",
    descricao: "Linguagem para smart contracts",
  },
  {
    nome: "Ethereum",
    icone: SiEthereum,
    categoria: "Blockchain",
    corBadge: "bg-purple-600/20 text-purple-400 border-purple-400/30",
    descricao: "Plataforma blockchain",
  },
  {
    nome: "Web3.js",
    icone: SiWeb3Dotjs,
    categoria: "Blockchain",
    corBadge: "bg-orange-500/20 text-orange-400 border-orange-400/30",
    descricao: "Biblioteca para interação Web3",
  },

  // IA & Automação
  {
    nome: "OpenAI",
    icone: SiOpenai,
    categoria: "IA & Automação",
    corBadge: "bg-green-500/20 text-green-400 border-green-400/30",
    descricao: "API de inteligência artificial",
  },
  {
    nome: "TensorFlow",
    icone: SiTensorflow,
    categoria: "IA & Automação",
    corBadge: "bg-orange-500/20 text-orange-400 border-orange-400/30",
    descricao: "Framework de machine learning",
  },
  {
    nome: "PyTorch",
    icone: SiPytorch,
    categoria: "IA & Automação",
    corBadge: "bg-red-500/20 text-red-400 border-red-400/30",
    descricao: "Framework de deep learning",
  },
  {
    nome: "Google Cloud",
    icone: SiGooglecloud,
    categoria: "IA & Automação",
    corBadge: "bg-blue-500/20 text-blue-400 border-blue-400/30",
    descricao: "Serviços IA do Google",
  },
];

const TechCard = ({ tech, index }: { tech: TechItem; index: number }) => {
  const IconComponent = tech.icone;

  return (
    <motion.div
      className="group relative p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 opacity-0 group-hover:opacity-100" />

      <div className="relative z-10 text-center">
        <motion.div
          className="mb-4 flex justify-center"
          whileHover={{
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 },
          }}
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 transition-all duration-300">
            <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
          </div>
        </motion.div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {tech.nome}
        </h3>

        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full border transition-all duration-300 ${tech.corBadge} group-hover:scale-105`}
        >
          {tech.categoria}
        </span>

        {tech.descricao && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {tech.descricao}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default function TechStackEnhanced() {
  const categorias = [
    "Frontend",
    "Backend",
    "Mobile",
    "Banco de Dados",
    "Cloud & DevOps",
    "Blockchain",
    "IA & Automação",
  ] as const;

  const techPorCategoria = categorias.map((categoria) => ({
    nome: categoria,
    tecnologias: tecnologiasStack.filter(
      (tech) => tech.categoria === categoria
    ),
  }));

  return (
    <section
      id="tecnologias"
      className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-black dark:to-blue-950/30 relative overflow-hidden"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_70%)]" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header da seção */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Stacks & Tecnologias
          </motion.h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ferramentas e tecnologias que domino para criar soluções digitais
            robustas e inovadoras, organizadas por expertise.
          </p>
        </motion.div>

        {/* Grid por categorias */}
        <div className="space-y-16">
          {techPorCategoria.map((categoria, categoryIndex) => (
            <motion.div
              key={categoria.nome}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              {/* Título da categoria */}
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {categoria.nome}
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
              </div>

              {/* Grid de tecnologias - RESPONSIVO: 4 colunas desktop, 2 tablets, 1 mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoria.tecnologias.map((tech, index) => (
                  <TechCard key={tech.nome} tech={tech} index={index} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Estatísticas finais */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold mb-2">
                  {tecnologiasStack.length}+
                </div>
                <div className="text-blue-200">Tecnologias</div>
              </motion.div>
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold mb-2">
                  {categorias.length}
                </div>
                <div className="text-blue-200">Categorias</div>
              </motion.div>
              <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold mb-2">5+</div>
                <div className="text-blue-200">Anos de Experiência</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

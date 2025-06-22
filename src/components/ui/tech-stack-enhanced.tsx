"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiExpress,
  SiFlutter,
  SiPostgresql,
  SiFirebase,
  SiSupabase,
  SiVercel,
  SiDocker,
  SiOpenai,
  SiN8N,
  SiZapier,
  SiGithubactions,
} from "react-icons/si";

interface TechItem {
  nome: string;
  icone: React.ComponentType<{ className?: string }>;
  categoria:
    | "Frontend"
    | "Backend"
    | "Banco de Dados"
    | "IA & Automação"
    | "Outros";
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
    nome: "Tailwind CSS",
    icone: SiTailwindcss,
    categoria: "Frontend",
    corBadge: "bg-teal-500/20 text-teal-400 border-teal-400/30",
    descricao: "Framework CSS utilitário",
  },
  {
    nome: "FlutterFlow",
    icone: SiFlutter,
    categoria: "Frontend",
    corBadge: "bg-sky-500/20 text-sky-400 border-sky-400/30",
    descricao: "Plataforma no-code para Flutter",
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

  // Banco de Dados
  {
    nome: "Supabase",
    icone: SiSupabase,
    categoria: "Banco de Dados",
    corBadge: "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
    descricao: "Backend-as-a-Service open source",
  },
  {
    nome: "Firebase",
    icone: SiFirebase,
    categoria: "Banco de Dados",
    corBadge: "bg-amber-500/20 text-amber-400 border-amber-400/30",
    descricao: "Plataforma Google completa",
  },
  {
    nome: "PostgreSQL",
    icone: SiPostgresql,
    categoria: "Banco de Dados",
    corBadge: "bg-blue-700/20 text-blue-500 border-blue-500/30",
    descricao: "Banco relacional avançado",
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
    nome: "n8n",
    icone: SiN8N,
    categoria: "IA & Automação",
    corBadge: "bg-red-500/20 text-red-400 border-red-400/30",
    descricao: "Automação de fluxos de trabalho",
  },
  {
    nome: "Zapier",
    icone: SiZapier,
    categoria: "IA & Automação",
    corBadge: "bg-orange-500/20 text-orange-400 border-orange-400/30",
    descricao: "Plataforma de integração e automação",
  },

  // Outros
  {
    nome: "Docker",
    icone: SiDocker,
    categoria: "Outros",
    corBadge: "bg-blue-500/20 text-blue-400 border-blue-400/30",
    descricao: "Containerização de aplicações",
  },
  {
    nome: "Vercel",
    icone: SiVercel,
    categoria: "Outros",
    corBadge: "bg-black/20 text-gray-300 border-gray-300/30",
    descricao: "Plataforma de deploy moderna",
  },
  {
    nome: "GitHub Actions",
    icone: SiGithubactions,
    categoria: "Outros",
    corBadge: "bg-gray-600/20 text-gray-400 border-gray-400/30",
    descricao: "CI/CD integrado ao GitHub",
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
    "Banco de Dados",
    "IA & Automação",
    "Outros",
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
            Tecnologias e ferramentas que realmente domino para criar soluções
            digitais robustas e inovadoras, focando na expertise comprovada.
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

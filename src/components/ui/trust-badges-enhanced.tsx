"use client";

import { motion } from "framer-motion";
import TrustBadge, { BadgeData } from "./trust-badge";

// Dados dos selos conforme especificado
const badges: BadgeData[] = [
  {
    title: "Soluções em produção",
    icon: "CheckCircle",
    color: "emerald",
    description: "Projetos entregues que geram resultados reais",
  },
  {
    title: "IA e Automação Integradas",
    icon: "Bot",
    color: "indigo",
    description: "Integrações com OpenAI, n8n e Zapier",
  },
  {
    title: "Segurança validada",
    icon: "ShieldCheck",
    color: "purple",
    description: "Autenticação, RLS e proteção de dados",
  },
  {
    title: "Full Stack + APIs e Web3",
    icon: "Code",
    color: "orange",
    description: "Domínio completo do ciclo de desenvolvimento",
  },
  {
    title: "Performance otimizada",
    icon: "Rocket",
    color: "cyan",
    description: "Soluções rápidas, eficientes e escaláveis",
  },
];

interface TrustBadgesEnhancedProps {
  showTitle?: boolean;
  className?: string;
}

const TrustBadgesEnhanced = ({
  showTitle = true,
  className = "",
}: TrustBadgesEnhancedProps) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Título da seção */}
      {showTitle && (
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Selos de Confiança
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Garantias de qualidade e expertise técnica comprovadas
          </p>
        </motion.div>
      )}

      {/* Grid de badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {badges.map((badge, index) => (
          <TrustBadge key={badge.title} badge={badge} index={index} />
        ))}
      </div>

      {/* Layout alternativo para mobile - scroll horizontal */}
      <div className="block sm:hidden mt-8">
        <motion.div
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {badges.map((badge, index) => (
            <div key={`mobile-${badge.title}`} className="flex-shrink-0 w-72">
              <TrustBadge badge={badge} index={index} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Estatísticas de apoio */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              15+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Projetos Entregues
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              98%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Satisfação Cliente
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Suporte Técnico
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              5⭐
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avaliação Média
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrustBadgesEnhanced;

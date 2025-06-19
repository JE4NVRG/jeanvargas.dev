"use client";

import { motion } from "framer-motion";
import { Selo } from "@/data/feedbacks";

interface TrustBadgesProps {
  selos: Selo[];
}

const TrustBadges = ({ selos }: TrustBadgesProps) => {
  // Função para obter classes de cor baseadas no tipo
  const getColorClasses = (cor: Selo["cor"]) => {
    const colorMap = {
      emerald: {
        bg: "bg-emerald-700/20 dark:bg-emerald-500/10",
        text: "text-emerald-300 dark:text-emerald-400",
        border: "border-emerald-600/30 dark:border-emerald-400/20",
        hover: "hover:bg-emerald-600/30 dark:hover:bg-emerald-500/20",
      },
      blue: {
        bg: "bg-blue-700/20 dark:bg-blue-500/10",
        text: "text-blue-300 dark:text-blue-400",
        border: "border-blue-600/30 dark:border-blue-400/20",
        hover: "hover:bg-blue-600/30 dark:hover:bg-blue-500/20",
      },
      purple: {
        bg: "bg-purple-700/20 dark:bg-purple-500/10",
        text: "text-purple-300 dark:text-purple-400",
        border: "border-purple-600/30 dark:border-purple-400/20",
        hover: "hover:bg-purple-600/30 dark:hover:bg-purple-500/20",
      },
      orange: {
        bg: "bg-orange-700/20 dark:bg-orange-500/10",
        text: "text-orange-300 dark:text-orange-400",
        border: "border-orange-600/30 dark:border-orange-400/20",
        hover: "hover:bg-orange-600/30 dark:hover:bg-orange-500/20",
      },
      cyan: {
        bg: "bg-cyan-700/20 dark:bg-cyan-500/10",
        text: "text-cyan-300 dark:text-cyan-400",
        border: "border-cyan-600/30 dark:border-cyan-400/20",
        hover: "hover:bg-cyan-600/30 dark:hover:bg-cyan-500/20",
      },
    };

    return colorMap[cor];
  };

  return (
    <motion.div
      className="flex flex-wrap gap-3 justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {selos.map((selo, index) => {
        const colors = getColorClasses(selo.cor);

        return (
          <motion.div
            key={selo.id}
            className={`
              group relative inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm
              transition-all duration-300 cursor-default
              ${colors.bg} ${colors.text} ${colors.border} ${colors.hover}
              hover:scale-105 hover:shadow-lg hover:shadow-black/10
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.2,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              y: -2,
              transition: { duration: 0.2 },
            }}
          >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Ícone */}
            <motion.span
              className="text-lg"
              whileHover={{
                scale: 1.2,
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.4 },
              }}
            >
              {selo.icone}
            </motion.span>

            {/* Texto */}
            <span className="font-medium text-sm whitespace-nowrap relative z-10">
              {selo.texto}
            </span>

            {/* Pulse effect para alguns selos */}
            {(selo.id === 1 || selo.id === 2) && (
              <motion.div
                className={`absolute inset-0 rounded-full ${colors.border}`}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: selo.id * 0.5,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TrustBadges;

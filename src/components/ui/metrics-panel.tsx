"use client";

import { motion } from "framer-motion";
import { Metrica } from "@/data/feedbacks";
import AnimatedCounter from "./animated-counter";

interface MetricsPanelProps {
  metricas: Metrica[];
}

const MetricsPanel = ({ metricas }: MetricsPanelProps) => {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {metricas.map((metrica, index) => {
        const IconeComponente = metrica.icone;

        return (
          <motion.div
            key={metrica.id}
            className={`
              relative group p-6 rounded-xl border transition-all duration-300 hover:scale-105
              ${
                metrica.destaque
                  ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 hover:border-blue-400/50"
                  : "bg-white/5 dark:bg-gray-800/30 border-gray-200/10 dark:border-gray-700/30 hover:border-gray-300/20 dark:hover:border-gray-600/40"
              }
              backdrop-blur-sm hover:shadow-lg dark:hover:shadow-gray-900/20
            `}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -3 }}
          >
            {/* Efeito de brilho para métrica destaque */}
            {metrica.destaque && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            )}

            <div className="text-center">
              {/* Ícone com animação */}
              <motion.div
                className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-colors duration-300
                  ${
                    metrica.destaque
                      ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
                      : "bg-gray-100/10 dark:bg-gray-700/20 text-gray-600 dark:text-gray-300 group-hover:text-blue-400"
                  }
                `}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 },
                }}
              >
                <IconeComponente className="w-6 h-6" />
              </motion.div>

              {/* Valor em destaque */}
              <motion.div
                className={`
                  text-2xl lg:text-3xl font-bold mb-2 transition-colors duration-300
                  ${
                    metrica.destaque
                      ? "text-blue-400 group-hover:text-blue-300"
                      : "text-gray-900 dark:text-white group-hover:text-blue-400"
                  }
                `}
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <AnimatedCounter
                  to={metrica.valorNumerico}
                  duration={2}
                  suffix={metrica.sufixo}
                  prefix={metrica.prefixo}
                  decimals={metrica.decimais || 0}
                  separator={metrica.separador}
                  preserveValue={true}
                />
              </motion.div>

              {/* Descrição */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors duration-300">
                {metrica.descricao}
              </p>
            </div>

            {/* Indicator de destaque */}
            {metrica.destaque && (
              <div className="absolute top-2 right-2">
                <motion.div
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default MetricsPanel;

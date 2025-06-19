"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Github } from "lucide-react";

// ====================================
// INTERFACE PARA PROJETO DETALHADO
// ====================================
interface ProjetoDetalhado {
  id: number;
  titulo: string;
  descricao: string;
  desafio: string;
  tecnologias: string[];
  imagem: string;
  video?: string;
  resultados: Array<{
    valor: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }>;
  testemunho?: {
    texto: string;
    autor: string;
    cargo: string;
  };
  repositorio: string;
  gradiente: string;
}

interface ProjectModalProps {
  projeto: ProjetoDetalhado | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  projeto,
  isOpen,
  onClose,
}) => {
  if (!projeto) return null;

  // ====================================
  // WHATSAPP COM MENSAGEM PERSONALIZADA
  // ====================================
  const generateWhatsAppLink = (projectName: string) => {
    const message = `Olá Jean! Me interessei pelo projeto ${projectName} e quero saber mais sobre como você pode me ajudar com algo parecido.`;
    return `https://wa.me/5511948477047?text=${encodeURIComponent(message)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header com gradiente */}
              <div
                className={`relative h-64 bg-gradient-to-r ${projeto.gradiente} p-8 text-white rounded-t-2xl overflow-hidden`}
              >
                {/* Botão fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
                >
                  <X size={24} />
                </button>

                {/* Título e descrição */}
                <div className="relative z-10">
                  <motion.h2
                    className="text-4xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {projeto.titulo}
                  </motion.h2>
                  <motion.p
                    className="text-xl opacity-90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {projeto.descricao}
                  </motion.p>
                </div>

                {/* Padrão decorativo */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-32 h-32 border border-white rounded-full" />
                  <div className="absolute bottom-10 left-10 w-24 h-24 border border-white rounded-full" />
                  <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-white rounded-full" />
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className="p-8 space-y-8">
                {/* Desafio */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    O Desafio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {projeto.desafio}
                  </p>
                </motion.div>

                {/* Imagem/Vídeo do projeto */}
                <motion.div
                  className="rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {projeto.video ? (
                    <video
                      src={projeto.video}
                      controls
                      className="w-full h-auto"
                      poster={projeto.imagem}
                    >
                      Seu navegador não suporta vídeos.
                    </video>
                  ) : (
                    <img
                      src={projeto.imagem}
                      alt={projeto.titulo}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  )}
                </motion.div>

                {/* Tecnologias */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Tecnologias Utilizadas
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {projeto.tecnologias.map((tech, index) => (
                      <motion.span
                        key={tech}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Resultados */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Resultados & Impacto
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projeto.resultados.map((resultado, index) => (
                      <motion.div
                        key={index}
                        className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <resultado.icon
                          size={32}
                          className="mx-auto mb-3 text-blue-600 dark:text-blue-400"
                        />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {resultado.valor}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {resultado.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Testemunho (se houver) */}
                {projeto.testemunho && (
                  <motion.div
                    className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Depoimento do Cliente
                    </h3>
                    <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                      &ldquo;{projeto.testemunho.texto}&rdquo;
                    </blockquote>
                    <div className="text-gray-600 dark:text-gray-400">
                      <strong>{projeto.testemunho.autor}</strong> -{" "}
                      {projeto.testemunho.cargo}
                    </div>
                  </motion.div>
                )}

                {/* Botões de ação */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.a
                    href={generateWhatsAppLink(projeto.titulo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle size={20} />
                    Quero algo parecido
                  </motion.a>

                  <motion.a
                    href={projeto.repositorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github size={20} />
                    Ver repositório
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export type { ProjetoDetalhado };

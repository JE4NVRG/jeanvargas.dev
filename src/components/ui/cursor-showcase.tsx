"use client";

import { motion } from "framer-motion";
import {
  useButtonCursor,
  useCardCursor,
  useTextCursor,
  useImageCursor,
} from "@/hooks/use-cursor-hover";

export const CursorShowcase = () => {
  const buttonCursor = useButtonCursor();
  const cardCursor = useCardCursor();
  const textCursor = useTextCursor();
  const imageCursor = useImageCursor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sistema de Cursor Avançado
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Demonstração do cursor customizado com trailing effect, diferentes
            formas e animações fluidas
          </p>
        </motion.div>

        {/* Grid principal */}
        <div className="grid gap-8">
          {/* Seção de botões */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Cursor de Botão (Verde)
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                {...buttonCursor}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Botão Primário
              </button>
              <button
                {...buttonCursor}
                className="px-6 py-3 border border-green-400 text-green-400 rounded-lg hover:bg-green-400/10 transition-colors"
              >
                Botão Secundário
              </button>
              <a
                href="#"
                {...buttonCursor}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Link Estilizado
              </a>
            </div>
          </motion.div>

          {/* Seção de cards */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Cursor de Card (Roxo com Partículas)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                {...cardCursor}
                className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30 hover:border-purple-400/60 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  Card Interativo
                </h3>
                <p className="text-gray-300">
                  Este card responde ao cursor com efeitos orgânicos e
                  partículas orbitais
                </p>
              </div>
              <div
                {...cardCursor}
                className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30 hover:border-blue-400/60 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  Outro Card
                </h3>
                <p className="text-gray-300">
                  Cursor com forma orgânica que rotaciona e tem partículas
                </p>
              </div>
            </div>
          </motion.div>

          {/* Seção de texto */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Cursor de Texto (Linha Amarela)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                {...textCursor}
                type="text"
                placeholder="Digite seu nome..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              />
              <input
                {...textCursor}
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              />
              <textarea
                {...textCursor}
                placeholder="Escreva sua mensagem..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none resize-none col-span-full"
              />
            </div>
          </motion.div>

          {/* Seção de imagens */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Cursor de Imagem (Rosa Semi-transparente)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                {...imageCursor}
                className="aspect-video bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
              >
                <span className="text-white font-bold text-lg">Imagem 1</span>
              </div>
              <div
                {...imageCursor}
                className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
              >
                <span className="text-white font-bold text-lg">Imagem 2</span>
              </div>
              <div
                {...imageCursor}
                className="aspect-video bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
              >
                <span className="text-white font-bold text-lg">Imagem 3</span>
              </div>
            </div>
          </motion.div>

          {/* Informações técnicas */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Características Técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  ✨ Trailing Effect
                </h3>
                <p>
                  Rastro fluido usando requestAnimationFrame com blur animado
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  🎨 Mix Blend Modes
                </h3>
                <p>Diferentes modos: normal, lighten, difference, multiply</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  ⚡ GPU Accelerated
                </h3>
                <p>Transform3d e will-change para performance otimizada</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  ♿ Acessibilidade
                </h3>
                <p>Respeita prefers-reduced-motion e dispositivos touch</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CursorShowcase;

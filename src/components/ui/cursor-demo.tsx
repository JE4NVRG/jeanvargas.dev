"use client";

import { motion } from "framer-motion";
import { ParallaxCard, ParallaxImage, ParallaxText } from "./parallax-element";
import { useCursorHover } from "@/contexts/cursor-context";
import {
  Zap,
  Sparkles,
  MousePointer,
  Eye,
  Layers,
  Settings,
} from "lucide-react";

export const CursorDemo = () => {
  const buttonHover = useCursorHover("button");
  const cardHover = useCursorHover("card");
  const imageHover = useCursorHover("image");
  const textHover = useCursorHover("text");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header da demo */}
        <ParallaxText className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Sistema de Cursor Avançado
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experimente os diferentes efeitos de cursor e parallax. Mova o
              mouse sobre os elementos para ver as animações interativas.
            </p>
          </motion.div>
        </ParallaxText>

        {/* Grid de demonstração */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Demonstração de botões */}
          <ParallaxCard className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <MousePointer className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  Cursor Button
                </h3>
              </div>
              <p className="text-gray-300 mb-6">
                O cursor muda para verde quando você passa sobre botões e links.
              </p>
              <div className="space-y-3">
                <button
                  {...buttonHover}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  Botão Primário
                </button>
                <button
                  {...buttonHover}
                  className="w-full px-4 py-3 border border-green-400 text-green-400 rounded-lg font-medium hover:bg-green-400/10 transition-colors"
                >
                  Botão Secundário
                </button>
              </div>
            </motion.div>
          </ParallaxCard>

          {/* Demonstração de cards */}
          <ParallaxCard className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <Layers className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  Cursor Card
                </h3>
              </div>
              <p className="text-gray-300 mb-6">
                O cursor fica roxo e maior quando passa sobre cards interativos.
              </p>
              <div
                {...cardHover}
                className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30 hover:border-purple-400/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    Card Interativo
                  </span>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  Este card reage ao seu cursor com efeitos de parallax.
                </p>
              </div>
            </motion.div>
          </ParallaxCard>

          {/* Demonstração de imagens */}
          <ParallaxCard className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-pink-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  Cursor Image
                </h3>
              </div>
              <p className="text-gray-300 mb-6">
                O cursor fica rosa e grande quando passa sobre imagens.
              </p>
              <ParallaxImage className="rounded-lg overflow-hidden">
                <div
                  {...imageHover}
                  className="w-full h-32 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-white font-medium">Imagem Demo</span>
                </div>
              </ParallaxImage>
            </motion.div>
          </ParallaxCard>
        </div>

        {/* Demonstração de texto editável */}
        <ParallaxCard className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-semibold text-white">
                Cursor Text & Input
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              O cursor vira uma linha vertical amarela quando passa sobre campos
              de texto.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Campo de texto:
                </label>
                <input
                  {...textHover}
                  type="text"
                  placeholder="Digite algo aqui..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Área de texto:
                </label>
                <textarea
                  {...textHover}
                  placeholder="Escreva uma mensagem..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </motion.div>
        </ParallaxCard>

        {/* Efeitos de parallax */}
        <ParallaxText className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Efeitos de Parallax
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Os elementos reagem ao movimento do seu cursor com efeitos suaves
              de rotação, escala e translação em 3D.
            </p>
          </motion.div>
        </ParallaxText>

        {/* Grid de elementos parallax */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <ParallaxCard key={item} className="aspect-square">
              <motion.div
                className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CursorDemo;

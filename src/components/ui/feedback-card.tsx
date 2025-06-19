"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Feedback } from "@/data/feedbacks";

interface FeedbackCardProps {
  feedback: Feedback;
  index: number;
}

const FeedbackCard = ({ feedback, index }: FeedbackCardProps) => {
  // Função para renderizar estrelas de avaliação
  const renderStars = (avaliacao: number) => {
    const fullStars = Math.floor(avaliacao);
    const hasHalfStar = avaliacao % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1 mb-3">
        {/* Estrelas cheias */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}

        {/* Estrela meio cheia */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}

        {/* Estrelas vazias */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}

        <span className="ml-2 text-sm font-medium text-gray-400">
          {avaliacao.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      className="group relative bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/10 dark:border-gray-700/50 rounded-xl p-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 hover:bg-white/10 dark:hover:bg-gray-800/70"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Gradiente de borda animado */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />

      <div className="relative z-10">
        {/* Header com avatar e info */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Avatar com anel animado */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-pulse opacity-70" />
            <img
              src={feedback.avatar}
              alt={feedback.nome}
              className="relative w-12 h-12 rounded-full border-2 border-white/20 object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  feedback.nome
                )}&background=6366f1&color=ffffff&size=150`;
              }}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
              {feedback.nome}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">
              {feedback.cargo}
              {feedback.empresa && (
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {feedback.empresa}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Avaliação com estrelas */}
        {renderStars(feedback.avaliacao)}

        {/* Depoimento */}
        <blockquote className="text-gray-700 dark:text-gray-200 leading-relaxed italic relative">
          <span className="text-4xl text-blue-500/30 absolute -top-2 -left-2 font-serif">
            &ldquo;
          </span>
          <p className="relative z-10 pl-4">{feedback.depoimento}</p>
          <span className="text-4xl text-blue-500/30 absolute -bottom-6 right-0 font-serif">
            &rdquo;
          </span>
        </blockquote>
      </div>

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:animate-pulse" />
    </motion.div>
  );
};

export default FeedbackCard;

"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppButton() {
  // ====================================
  // CONFIGURAÇÃO DO WHATSAPP
  // ====================================
  // Para alterar o número do WhatsApp:
  // 1. Substitua o número após "wa.me/" pelo seu número com código do país
  // 2. Formato: https://wa.me/5511999999999 (55 = Brasil, 11 = DDD, 999999999 = número)
  // 3. NÃO inclua espaços, hífens ou parênteses no número

  const whatsappUrl = "https://wa.me/5511948477047";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Fale comigo no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      whileHover={{
        scale: 1.1,
        y: -2,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Efeito de pulse no fundo */}
      <motion.div
        className="absolute inset-0 bg-green-400 rounded-full opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Ícone do WhatsApp */}
      <MessageCircle
        size={28}
        className="text-white group-hover:scale-110 transition-transform duration-200"
      />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Fale comigo no WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </motion.a>
  );
}

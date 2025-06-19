"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// ====================================
// MENSAGENS PERSONALIZADAS DO WHATSAPP
// ====================================
// Para personalizar as mensagens:
// 1. Edite as mensagens na const whatsappMessages
// 2. Adicione novas seções se necessário
// 3. Mantenha o número do WhatsApp atualizado

export type WhatsAppAction =
  | "projetos"
  | "servicos"
  | "orcamento"
  | "contato"
  | "projeto_especifico";

interface WhatsAppPersonalizedProps {
  action: WhatsAppAction;
  className?: string;
  children?: React.ReactNode;
  projectName?: string; // Para quando action for "projeto_especifico"
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const whatsappMessages = {
  projetos:
    "Olá Jean! Gostaria de ver mais detalhes dos projetos desenvolvidos e entender como você pode me ajudar.",
  servicos:
    "Olá Jean! Tenho interesse nos serviços que você oferece. Podemos conversar sobre minhas necessidades?",
  orcamento:
    "Olá Jean! Gostaria de solicitar um orçamento para um projeto. Você tem um tempo para conversarmos?",
  contato:
    "Olá Jean! Vim através do seu portfólio e gostaria de conversar sobre uma oportunidade.",
  projeto_especifico:
    "Olá Jean! Me interessei pelo projeto [PROJECT_NAME] e quero saber mais sobre como você pode me ajudar com algo parecido.",
};

export const WhatsAppPersonalized: React.FC<WhatsAppPersonalizedProps> = ({
  action,
  className = "",
  children,
  projectName = "",
  variant = "primary",
  size = "md",
}) => {
  // ====================================
  // GERAR LINK DO WHATSAPP
  // ====================================
  const generateWhatsAppLink = () => {
    let message = whatsappMessages[action];

    // Substitui o placeholder do nome do projeto
    if (action === "projeto_especifico" && projectName) {
      message = message.replace("[PROJECT_NAME]", projectName);
    }

    const phoneNumber = "5511948477047"; // Número do WhatsApp
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  // ====================================
  // VARIANTES DE ESTILO
  // ====================================
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl";
      case "secondary":
        return "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20";
      case "outline":
        return "border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white";
      default:
        return "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-2 px-4 text-sm";
      case "md":
        return "py-3 px-6 text-base";
      case "lg":
        return "py-4 px-8 text-lg";
      default:
        return "py-3 px-6 text-base";
    }
  };

  return (
    <motion.a
      href={generateWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2 
        ${getVariantClasses()} 
        ${getSizeClasses()}
        font-semibold rounded-xl transition-all duration-200 
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
      {children}
    </motion.a>
  );
};

// ====================================
// COMPONENTES PRÉ-CONFIGURADOS
// ====================================
// Botões prontos para usar nas diferentes seções

export const WhatsAppProjetos: React.FC<{ className?: string }> = ({
  className,
}) => (
  <WhatsAppPersonalized action="projetos" className={className}>
    Ver Projetos
  </WhatsAppPersonalized>
);

export const WhatsAppServicos: React.FC<{ className?: string }> = ({
  className,
}) => (
  <WhatsAppPersonalized
    action="servicos"
    variant="secondary"
    className={className}
  >
    Ver Serviços
  </WhatsAppPersonalized>
);

export const WhatsAppOrcamento: React.FC<{ className?: string }> = ({
  className,
}) => (
  <WhatsAppPersonalized action="orcamento" size="lg" className={className}>
    Solicitar Orçamento
  </WhatsAppPersonalized>
);

export const WhatsAppContato: React.FC<{ className?: string }> = ({
  className,
}) => (
  <WhatsAppPersonalized action="contato" className={className}>
    Entrar em Contato
  </WhatsAppPersonalized>
);

interface WhatsAppProjetoProps {
  projectName: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export const WhatsAppProjeto: React.FC<WhatsAppProjetoProps> = ({
  projectName,
  className,
  variant = "primary",
}) => (
  <WhatsAppPersonalized
    action="projeto_especifico"
    projectName={projectName}
    variant={variant}
    className={className}
  >
    Quero algo parecido
  </WhatsAppPersonalized>
);

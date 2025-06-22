"use client";

import { motion } from "framer-motion";
import { CheckCircle, Bot, ShieldCheck, Code, Rocket } from "lucide-react";

export interface BadgeData {
  title: string;
  icon: keyof typeof iconMap;
  color: "emerald" | "indigo" | "purple" | "orange" | "cyan";
  description: string;
}

// Mapeamento de ícones
const iconMap = {
  CheckCircle,
  Bot,
  ShieldCheck,
  Code,
  Rocket,
} as const;

interface TrustBadgeProps {
  badge: BadgeData;
  index: number;
}

const TrustBadge = ({ badge, index }: TrustBadgeProps) => {
  const IconComponent = iconMap[badge.icon];

  // Sistema de cores por categoria
  const getColorClasses = (color: BadgeData["color"]) => {
    const colorMap = {
      emerald: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30 dark:border-emerald-400/20",
        glow: "shadow-emerald-500/20 dark:shadow-emerald-400/10",
        hoverGlow:
          "hover:shadow-emerald-500/40 dark:hover:shadow-emerald-400/20",
        gradient: "from-emerald-500/20 to-emerald-600/10",
        iconGlow: "group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]",
      },
      indigo: {
        bg: "bg-indigo-500/10 dark:bg-indigo-500/5",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-500/30 dark:border-indigo-400/20",
        glow: "shadow-indigo-500/20 dark:shadow-indigo-400/10",
        hoverGlow: "hover:shadow-indigo-500/40 dark:hover:shadow-indigo-400/20",
        gradient: "from-indigo-500/20 to-indigo-600/10",
        iconGlow: "group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]",
      },
      purple: {
        bg: "bg-purple-500/10 dark:bg-purple-500/5",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500/30 dark:border-purple-400/20",
        glow: "shadow-purple-500/20 dark:shadow-purple-400/10",
        hoverGlow: "hover:shadow-purple-500/40 dark:hover:shadow-purple-400/20",
        gradient: "from-purple-500/20 to-purple-600/10",
        iconGlow: "group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
      },
      orange: {
        bg: "bg-orange-500/10 dark:bg-orange-500/5",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500/30 dark:border-orange-400/20",
        glow: "shadow-orange-500/20 dark:shadow-orange-400/10",
        hoverGlow: "hover:shadow-orange-500/40 dark:hover:shadow-orange-400/20",
        gradient: "from-orange-500/20 to-orange-600/10",
        iconGlow: "group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]",
      },
      cyan: {
        bg: "bg-cyan-500/10 dark:bg-cyan-500/5",
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30 dark:border-cyan-400/20",
        glow: "shadow-cyan-500/20 dark:shadow-cyan-400/10",
        hoverGlow: "hover:shadow-cyan-500/40 dark:hover:shadow-cyan-400/20",
        gradient: "from-cyan-500/20 to-cyan-600/10",
        iconGlow: "group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]",
      },
    };

    return colorMap[color];
  };

  const colors = getColorClasses(badge.color);

  return (
    <motion.div
      className={`
        group relative p-6 rounded-2xl border backdrop-blur-sm 
        cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1
        ${colors.bg} ${colors.border} ${colors.glow} ${colors.hoverGlow}
        shadow-md hover:shadow-xl z-10
      `}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 10,
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      aria-label={`${badge.title} - ${badge.description}`}
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Glass reflection effect */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with glow effect */}
        <motion.div
          className={`mb-4 ${colors.text}`}
          whileHover={{
            rotate: [0, -5, 5, 0],
            scale: 1.1,
            transition: { duration: 0.4 },
          }}
        >
          <IconComponent
            size={32}
            className={`transition-all duration-300 ${colors.iconGlow}`}
          />
        </motion.div>

        {/* Title */}
        <h3
          className={`text-lg font-bold ${colors.text} mb-2 group-hover:text-current transition-colors duration-300`}
        >
          {badge.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {badge.description}
        </p>
      </div>

      {/* Subtle pulse border for emphasis */}
      <motion.div
        className={`absolute inset-0 rounded-2xl border ${colors.border} opacity-50`}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.5,
        }}
      />
    </motion.div>
  );
};

export default TrustBadge;

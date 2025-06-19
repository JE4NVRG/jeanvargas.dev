"use client";
import { motion } from "framer-motion";
import React from "react";

export function FeatureBlockCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 max-w-lg mx-auto">
      {/* Background with sparkles */}
      <div className="absolute inset-0">
        <Sparkles />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Icons Grid */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center space-x-4">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <ClaudeIcon />
              </motion.div>

              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <OpenAIIcon />
              </motion.div>

              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <GeminiIcon />
              </motion.div>

              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <MetaIcon />
              </motion.div>
            </div>

            {/* Animated line */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-px w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ transform: "translateX(-50%) translateY(-50%)" }}
            />
          </div>

          {/* Title */}
          <motion.h3
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Inteligência Artificial
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-gray-600 dark:text-gray-400 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Ferramentas de IA que utilizo para criar soluções inovadoras e
            automatizações inteligentes.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// Sparkles component
function Sparkles() {
  const [mounted, setMounted] = React.useState(false);
  const [sparkles, setSparkles] = React.useState<
    Array<{
      id: number;
      size: number;
      x: number;
      y: number;
      delay: number;
    }>
  >([]);

  React.useEffect(() => {
    setMounted(true);
    setSparkles(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: sparkle.delay,
          }}
        />
      ))}
    </div>
  );
}

// Icon components
function ClaudeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-orange-500"
    >
      <path
        d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function OpenAIIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-green-500"
    >
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path
        d="M12 1V5M12 19V23M4.22 4.22L7.05 7.05M16.95 16.95L19.78 19.78M1 12H5M19 12H23M4.22 19.78L7.05 16.95M16.95 7.05L19.78 4.22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GeminiIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-blue-500"
    >
      <path
        d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MetaIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-purple-500"
    >
      <circle cx="8" cy="12" r="6" fill="currentColor" opacity="0.6" />
      <circle cx="16" cy="12" r="6" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

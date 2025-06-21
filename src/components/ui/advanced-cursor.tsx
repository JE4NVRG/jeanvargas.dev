"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/hooks/use-cursor";

export const AdvancedCursor = () => {
  const { position, state, isMoving, prefersReducedMotion, isTouchDevice } =
    useCursor();

  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  // Motion values para animações suaves
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const trailX = useMotionValue(0);
  const trailY = useMotionValue(0);

  // Springs para movimento suave
  const smoothCursorX = useSpring(cursorX, {
    damping: 25,
    stiffness: 700,
    restDelta: 0.001,
  });
  const smoothCursorY = useSpring(cursorY, {
    damping: 25,
    stiffness: 700,
    restDelta: 0.001,
  });

  const smoothTrailX = useSpring(trailX, {
    damping: 15,
    stiffness: 300,
    restDelta: 0.001,
  });
  const smoothTrailY = useSpring(trailY, {
    damping: 15,
    stiffness: 300,
    restDelta: 0.001,
  });

  // Atualizar posições quando o mouse se move
  useEffect(() => {
    if (!prefersReducedMotion && !isTouchDevice) {
      cursorX.set(position.x);
      cursorY.set(position.y);
      trailX.set(position.x);
      trailY.set(position.y);
    }
  }, [
    position,
    prefersReducedMotion,
    isTouchDevice,
    cursorX,
    cursorY,
    trailX,
    trailY,
  ]);

  // Ocultar cursor nativo quando o componente está ativo
  useEffect(() => {
    if (!prefersReducedMotion && !isTouchDevice) {
      document.body.style.cursor = "none";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [prefersReducedMotion, isTouchDevice]);

  // Não renderizar em dispositivos touch ou quando movimento reduzido é preferido
  if (isTouchDevice || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      {/* Rastro do cursor - elemento maior que segue mais devagar */}
      <motion.div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: state === "hover" ? 1.5 : state === "click" ? 0.8 : 1,
            opacity: isMoving ? 0.8 : 0.5,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          {/* Círculo externo - rastro suave */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 blur-sm" />

          {/* Efeito de pulsação quando em movimento */}
          {isMoving && (
            <motion.div
              className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Cursor principal - elemento menor e mais responsivo */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          x: smoothCursorX,
          y: smoothCursorY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: state === "hover" ? 1.8 : state === "click" ? 0.6 : 1,
            rotate: state === "hover" ? 180 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 30,
          }}
        >
          {/* Cursor principal */}
          <div
            className={`
              w-3 h-3 rounded-full transition-all duration-200
              ${
                state === "default"
                  ? "bg-white border-2 border-gray-900/20 shadow-lg"
                  : state === "hover"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 shadow-2xl shadow-blue-500/25"
                  : state === "click"
                  ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 shadow-2xl shadow-pink-500/25"
                  : "bg-gray-400"
              }
            `}
          />

          {/* Anel externo quando hover */}
          {state === "hover" && (
            <motion.div
              className="absolute inset-0 w-3 h-3 rounded-full border-2 border-blue-400/60"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Partículas quando clique */}
          {state === "click" && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 6) * 20,
                    y: Math.sin((i * Math.PI * 2) / 6) * 20,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

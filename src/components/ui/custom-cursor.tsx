"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useTransform,
} from "framer-motion";
import { useCursorContext } from "@/contexts/cursor-context";

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailPoint extends CursorPosition {
  opacity: number;
  scale: number;
  id: number;
}

export const CustomCursor = () => {
  const { cursorVariant, isPressed, mousePosition } = useCursorContext();
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  // Refs para controle otimizado
  const lastUpdateRef = useRef(0);
  const trailCountRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Motion values para cursor principal com melhor performance
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Springs otimizados para fluidez máxima
  const springX = useSpring(cursorX, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
    restSpeed: 0.01,
  });
  const springY = useSpring(cursorY, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
    restSpeed: 0.01,
  });

  // Transform para offset do cursor (melhor performance)
  const cursorOffsetX = useTransform(springX, (x) => x - 12);
  const cursorOffsetY = useTransform(springY, (y) => y - 12);

  // Detectar se deve renderizar
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isTouchDevice && !prefersReducedMotion) {
      setShouldRender(true);
      document.body.style.cursor = "none";

      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, []);

  // Sistema de trailing otimizado com throttling
  const updateTrail = useCallback(() => {
    const now = performance.now();

    // Throttle para 60fps máximo
    if (now - lastUpdateRef.current < 16) {
      animationFrameRef.current = requestAnimationFrame(updateTrail);
      return;
    }

    lastUpdateRef.current = now;

    if (!shouldRender || !isVisible) return;

    const currentPos = { x: mousePosition.x, y: mousePosition.y };

    // Reduzir trail baseado na variante
    const maxTrail =
      cursorVariant === "default"
        ? 4
        : cursorVariant === "button"
        ? 6
        : cursorVariant === "card"
        ? 8
        : 5;

    setTrail((prevTrail) => {
      // Só adicionar se movimento significativo
      const lastPoint = prevTrail[0];
      const distance = lastPoint
        ? Math.sqrt(
            Math.pow(currentPos.x - lastPoint.x, 2) +
              Math.pow(currentPos.y - lastPoint.y, 2)
          )
        : 10;

      if (distance < 5) {
        // Apenas fazer fade dos pontos existentes
        return prevTrail.slice(0, maxTrail).map((point, index) => ({
          ...point,
          opacity: Math.max(0, 0.8 - (index / maxTrail) * 0.8),
          scale: Math.max(0.4, 1 - (index / maxTrail) * 0.6),
        }));
      }

      // Adicionar novo ponto
      const newTrail = [
        {
          x: currentPos.x,
          y: currentPos.y,
          opacity: 0.8,
          scale: 0.9,
          id: trailCountRef.current++,
        },
        ...prevTrail.slice(0, maxTrail - 1),
      ];

      return newTrail.map((point, index) => ({
        ...point,
        opacity: Math.max(0, 0.8 - (index / maxTrail) * 0.8),
        scale: Math.max(0.4, 1 - (index / maxTrail) * 0.6),
      }));
    });

    animationFrameRef.current = requestAnimationFrame(updateTrail);
  }, [mousePosition, shouldRender, isVisible, cursorVariant]);

  // Atualizar posição do cursor principal
  useEffect(() => {
    if (!shouldRender) return;

    cursorX.set(mousePosition.x);
    cursorY.set(mousePosition.y);

    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
      setIsVisible(true);
    }
  }, [mousePosition, shouldRender, cursorX, cursorY]);

  // Iniciar loop de animação apenas quando necessário
  useEffect(() => {
    if (shouldRender && isVisible && cursorVariant !== "default") {
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateTrail);
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [shouldRender, isVisible, updateTrail, cursorVariant]);

  // Configurações simplificadas por variante
  const cursorStyles = {
    default: {
      size: 24,
      color: "rgba(59, 130, 246, 0.7)",
      borderColor: "rgba(59, 130, 246, 1)",
      showTrail: false,
    },
    button: {
      size: 32,
      color: "rgba(16, 185, 129, 0.5)",
      borderColor: "rgba(16, 185, 129, 1)",
      showTrail: true,
    },
    card: {
      size: 40,
      color: "rgba(139, 92, 246, 0.4)",
      borderColor: "rgba(139, 92, 246, 1)",
      showTrail: true,
    },
    text: {
      size: 2,
      color: "rgba(245, 158, 11, 1)",
      borderColor: "rgba(245, 158, 11, 1)",
      showTrail: false,
    },
    image: {
      size: 48,
      color: "rgba(236, 72, 153, 0.3)",
      borderColor: "rgba(236, 72, 153, 0.8)",
      showTrail: true,
    },
  };

  const currentStyle = cursorStyles[cursorVariant];

  if (!shouldRender || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 cursor-element">
      {/* Trail otimizado - apenas quando necessário */}
      {currentStyle.showTrail && (
        <AnimatePresence mode="popLayout">
          {trail.slice(0, 3).map((point) => (
            <motion.div
              key={point.id}
              className="absolute rounded-full"
              style={{
                left: point.x - currentStyle.size / 4,
                top: point.y - currentStyle.size / 4,
                width: currentStyle.size / 2,
                height: currentStyle.size / 2,
                background: `radial-gradient(circle, ${currentStyle.color} 0%, transparent 70%)`,
                border: `1px solid ${currentStyle.borderColor}`,
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: point.opacity * 0.5,
                scale: point.scale * 0.7,
              }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Cursor Principal Otimizado */}
      <motion.div
        className="absolute"
        style={{
          left: cursorOffsetX,
          top: cursorOffsetY,
          willChange: "transform",
          transformOrigin: "center",
        }}
        animate={{
          scale: isPressed ? 0.85 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 35,
          mass: 0.5,
        }}
      >
        {/* Cursor de Texto */}
        {cursorVariant === "text" ? (
          <motion.div
            className="bg-current"
            style={{
              width: 2,
              height: 24,
              color: currentStyle.borderColor,
              borderRadius: 1,
              boxShadow: `0 0 8px ${currentStyle.color}`,
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          /* Cursor Circular */
          <motion.div
            className="rounded-full relative"
            style={{
              width: currentStyle.size,
              height: currentStyle.size,
              background: `radial-gradient(circle, ${currentStyle.color} 0%, transparent 70%)`,
              border: `2px solid ${currentStyle.borderColor}`,
              boxShadow: `0 0 15px ${currentStyle.color}`,
            }}
          >
            {/* Efeito pulsante para variantes especiais */}
            {cursorVariant === "button" && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 opacity-40"
                style={{
                  borderColor: currentStyle.borderColor,
                }}
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Rotação para cards */}
            {cursorVariant === "card" && (
              <motion.div
                className="absolute inset-1 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${currentStyle.borderColor}, transparent, ${currentStyle.borderColor})`,
                  opacity: 0.6,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Efeito de clique simplificado */}
      {isPressed && (
        <motion.div
          className="absolute"
          style={{
            left: mousePosition.x - currentStyle.size,
            top: mousePosition.y - currentStyle.size,
            width: currentStyle.size * 2,
            height: currentStyle.size * 2,
            borderRadius: "50%",
            border: `2px solid ${currentStyle.borderColor}`,
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 1.5] }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

export default CustomCursor;

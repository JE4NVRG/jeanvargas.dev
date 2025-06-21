"use client";

import { useEffect, useState, useCallback } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";

type CursorVariant = "default" | "button" | "card" | "text" | "image";

interface CursorState {
  x: number;
  y: number;
  variant: CursorVariant;
  isVisible: boolean;
  isPressed: boolean;
}

export const AdvancedCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    variant: "default",
    isVisible: false,
    isPressed: false,
  });

  // Motion values para animações suaves
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const trailX = useSpring(cursorX, { damping: 25, stiffness: 400 });
  const trailY = useSpring(cursorY, { damping: 20, stiffness: 300 });

  // Detectar se é dispositivo touch ou se movimento reduzido é preferido
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isTouchDevice && !prefersReducedMotion) {
      setShouldRender(true);
    }
  }, []);

  // Função para detectar tipo de elemento
  const getElementVariant = useCallback((element: Element): CursorVariant => {
    // Verifica atributos data-cursor primeiro
    const dataCursor = element.getAttribute("data-cursor");
    if (dataCursor) return dataCursor as CursorVariant;

    // Verifica por seletores específicos
    if (
      element.matches(
        "button, [role='button'], input[type='submit'], input[type='button']"
      )
    ) {
      return "button";
    }

    if (element.matches("a, [role='link']")) {
      return "button";
    }

    if (element.matches(".card, [data-card], .project-card, .service-card")) {
      return "card";
    }

    if (element.matches("img, picture, [data-image]")) {
      return "image";
    }

    if (element.matches("input, textarea, [contenteditable], .editable")) {
      return "text";
    }

    // Verifica por classes cursor-pointer ou similar
    if (
      element.matches(".cursor-pointer, .hover\\:scale-105, .hover\\:shadow-xl")
    ) {
      return "card";
    }

    return "default";
  }, []);

  // Handler principal do movimento do mouse
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      cursorX.set(newX);
      cursorY.set(newY);

      setCursorState((prev) => ({
        ...prev,
        x: newX,
        y: newY,
        isVisible: true,
      }));

      // Detectar elemento sob o cursor
      const elementUnderCursor = document.elementFromPoint(newX, newY);
      if (elementUnderCursor) {
        const variant = getElementVariant(elementUnderCursor);
        setCursorState((prev) => ({ ...prev, variant }));
      }
    },
    [cursorX, cursorY, getElementVariant]
  );

  // Handlers para estados do mouse
  const handleMouseDown = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isPressed: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isPressed: false }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isVisible: true }));
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [
    shouldRender,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
  ]);

  if (!shouldRender || !cursorState.isVisible) return null;

  // Configurações de variantes do cursor
  const cursorVariants = {
    default: {
      scale: 1,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      width: 16,
      height: 16,
    },
    button: {
      scale: 1.5,
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "rgba(16, 185, 129, 0.5)",
      width: 24,
      height: 24,
    },
    card: {
      scale: 1.8,
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      borderColor: "rgba(139, 92, 246, 0.4)",
      width: 32,
      height: 32,
    },
    text: {
      scale: 0.8,
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "rgba(245, 158, 11, 0.4)",
      width: 2,
      height: 24,
    },
    image: {
      scale: 2,
      backgroundColor: "rgba(236, 72, 153, 0.1)",
      borderColor: "rgba(236, 72, 153, 0.4)",
      width: 40,
      height: 40,
    },
  };

  const currentVariant = cursorVariants[cursorState.variant];

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {/* Cursor principal */}
        <motion.div
          className="absolute rounded-full border-2 backdrop-blur-sm"
          style={{
            left: cursorState.x,
            top: cursorState.y,
          }}
          animate={{
            x: -currentVariant.width / 2,
            y: -currentVariant.height / 2,
            scale: cursorState.isPressed
              ? currentVariant.scale * 0.8
              : currentVariant.scale,
            width: currentVariant.width,
            height: currentVariant.height,
            backgroundColor: currentVariant.backgroundColor,
            borderColor: currentVariant.borderColor,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 400,
            mass: 0.5,
          }}
        />

        {/* Rastro do cursor - Círculo maior com blur */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: trailX,
            top: trailY,
            filter: "blur(8px)",
          }}
          animate={{
            x: -40,
            y: -40,
            scale: cursorState.isPressed ? 0.7 : 1,
            opacity: cursorState.variant === "default" ? 0.3 : 0.5,
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 200,
            mass: 0.8,
          }}
        >
          <div
            className="w-20 h-20 rounded-full transition-colors duration-300"
            style={{
              background: `radial-gradient(circle, ${currentVariant.backgroundColor} 0%, transparent 70%)`,
              border: `1px solid ${currentVariant.borderColor}`,
            }}
          />
        </motion.div>

        {/* Partículas decorativas para algumas variantes */}
        {(cursorState.variant === "card" ||
          cursorState.variant === "image") && (
          <motion.div
            className="absolute"
            style={{
              left: cursorState.x,
              top: cursorState.y,
            }}
            animate={{
              x: -2,
              y: -2,
              rotate: 360,
            }}
            transition={{
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            <div
              className="w-1 h-1 bg-current rounded-full opacity-40"
              style={{ color: currentVariant.borderColor }}
            />
          </motion.div>
        )}

        {/* Efeito pulsante para botões */}
        {cursorState.variant === "button" && (
          <motion.div
            className="absolute rounded-full border opacity-20"
            style={{
              left: cursorState.x,
              top: cursorState.y,
              borderColor: currentVariant.borderColor,
            }}
            animate={{
              x: -20,
              y: -20,
              scale: [1, 1.5, 1],
              width: 40,
              height: 40,
            }}
            transition={{
              scale: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedCursor;

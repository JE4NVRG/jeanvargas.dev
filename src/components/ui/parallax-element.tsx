"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ParallaxElementProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  scaleIntensity?: number;
  rotateIntensity?: number;
  triggerDistance?: number;
  disabled?: boolean;
}

export const ParallaxElement = ({
  children,
  className = "",
  intensity = 0.5,
  scaleIntensity = 0.02,
  rotateIntensity = 1,
  triggerDistance = 200,
  disabled = false,
}: ParallaxElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Motion values para suavizar animações
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs para movimentos suaves
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  // Transforms para efeitos de parallax
  const translateX = useTransform(
    springX,
    [-triggerDistance, triggerDistance],
    [-intensity * 10, intensity * 10]
  );
  const translateY = useTransform(
    springY,
    [-triggerDistance, triggerDistance],
    [-intensity * 10, intensity * 10]
  );
  const scale = useTransform(
    springX,
    [-triggerDistance, triggerDistance],
    [1 - scaleIntensity, 1 + scaleIntensity]
  );
  const rotateX = useTransform(
    springY,
    [-triggerDistance, triggerDistance],
    [-rotateIntensity, rotateIntensity]
  );
  const rotateY = useTransform(
    springX,
    [-triggerDistance, triggerDistance],
    [rotateIntensity, -rotateIntensity]
  );

  // Verificar se deve renderizar efeitos
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setShouldAnimate(!disabled && !isTouchDevice && !prefersReducedMotion);
  }, [disabled]);

  // Atualizar posição do elemento quando a página é redimensionada
  useEffect(() => {
    const updateElementPosition = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setElementPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updateElementPosition();
    window.addEventListener("resize", updateElementPosition);
    window.addEventListener("scroll", updateElementPosition);

    return () => {
      window.removeEventListener("resize", updateElementPosition);
      window.removeEventListener("scroll", updateElementPosition);
    };
  }, []);

  // Handler para movimento do mouse
  useEffect(() => {
    if (!shouldAnimate) return;

    const handleMouseMove = (e: MouseEvent) => {
      const distanceX = e.clientX - elementPosition.x;
      const distanceY = e.clientY - elementPosition.y;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Só aplicar efeito se o mouse estiver próximo do elemento
      if (distance <= triggerDistance) {
        mouseX.set(distanceX);
        mouseY.set(distanceY);
      } else {
        // Suavemente retornar à posição original
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [shouldAnimate, elementPosition, triggerDistance, mouseX, mouseY]);

  if (!shouldAnimate) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef}
      className={`${className} transform-gpu`}
      style={{
        x: translateX,
        y: translateY,
        scale,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

// Versão específica para cards de projeto
export const ParallaxCard = ({
  children,
  className = "",
  ...props
}: Omit<
  ParallaxElementProps,
  "intensity" | "scaleIntensity" | "rotateIntensity"
>) => {
  return (
    <ParallaxElement
      className={`group ${className}`}
      intensity={0.8}
      scaleIntensity={0.03}
      rotateIntensity={2}
      triggerDistance={150}
      {...props}
    >
      <motion.div
        className="relative transform-gpu"
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        whileTap={{
          scale: 0.98,
          transition: { duration: 0.1 },
        }}
      >
        {children}

        {/* Efeito de glow sutil no hover */}
        <motion.div
          className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </motion.div>
    </ParallaxElement>
  );
};

// Versão para imagens
export const ParallaxImage = ({
  children,
  className = "",
  ...props
}: Omit<
  ParallaxElementProps,
  "intensity" | "scaleIntensity" | "rotateIntensity"
>) => {
  return (
    <ParallaxElement
      className={`overflow-hidden ${className}`}
      intensity={0.3}
      scaleIntensity={0.05}
      rotateIntensity={0.5}
      triggerDistance={100}
      {...props}
    >
      <motion.div
        className="transform-gpu"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
      >
        {children}
      </motion.div>
    </ParallaxElement>
  );
};

// Versão para texto/títulos
export const ParallaxText = ({
  children,
  className = "",
  ...props
}: Omit<
  ParallaxElementProps,
  "intensity" | "scaleIntensity" | "rotateIntensity"
>) => {
  return (
    <ParallaxElement
      className={className}
      intensity={0.2}
      scaleIntensity={0.01}
      rotateIntensity={0.5}
      triggerDistance={300}
      {...props}
    >
      <motion.div
        className="transform-gpu"
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.2 },
        }}
      >
        {children}
      </motion.div>
    </ParallaxElement>
  );
};

export default ParallaxElement;

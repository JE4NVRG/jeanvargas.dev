"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/hooks/use-cursor";

interface ParallaxElementProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
  enableScale?: boolean;
  enableRotation?: boolean;
  scaleIntensity?: number;
  rotationIntensity?: number;
}

export const ParallaxElement = ({
  children,
  intensity = 0.1,
  className = "",
  enableScale = true,
  enableRotation = false,
  scaleIntensity = 0.05,
  rotationIntensity = 5,
}: ParallaxElementProps) => {
  const { position, prefersReducedMotion, isTouchDevice, getHoverProps } =
    useCursor();
  const elementRef = useRef<HTMLDivElement>(null);

  // Motion values para o parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Springs suaves para as animações
  const springX = useSpring(x, { stiffness: 400, damping: 40 });
  const springY = useSpring(y, { stiffness: 400, damping: 40 });
  const springScale = useSpring(scale, { stiffness: 400, damping: 40 });
  const springRotateX = useSpring(rotateX, { stiffness: 400, damping: 40 });
  const springRotateY = useSpring(rotateY, { stiffness: 400, damping: 40 });

  // Calcular posições relativas para parallax
  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const updateParallax = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calcular distância do mouse em relação ao centro do elemento
      const deltaX = (position.x - centerX) * intensity;
      const deltaY = (position.y - centerY) * intensity;

      // Aplicar transformações suaves
      x.set(deltaX);
      y.set(deltaY);

      // Escala baseada na proximidade do mouse
      if (enableScale) {
        const distance = Math.sqrt(
          Math.pow(position.x - centerX, 2) + Math.pow(position.y - centerY, 2)
        );
        const maxDistance = Math.sqrt(
          rect.width * rect.width + rect.height * rect.height
        );
        const scaleValue =
          1 + (1 - Math.min(distance / maxDistance, 1)) * scaleIntensity;
        scale.set(scaleValue);
      }

      // Rotação 3D baseada na posição do mouse
      if (enableRotation) {
        const rotateXValue =
          ((position.y - centerY) / rect.height) * rotationIntensity;
        const rotateYValue =
          ((position.x - centerX) / rect.width) * -rotationIntensity;
        rotateX.set(rotateXValue);
        rotateY.set(rotateYValue);
      }
    };

    // Listener para movimento do mouse
    const handleMouseMove = () => {
      requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [
    position,
    intensity,
    prefersReducedMotion,
    isTouchDevice,
    enableScale,
    enableRotation,
    scaleIntensity,
    rotationIntensity,
    x,
    y,
    scale,
    rotateX,
    rotateY,
  ]);

  // Reset quando o mouse sai do elemento
  const handleMouseLeave = () => {
    if (prefersReducedMotion || isTouchDevice) return;

    x.set(0);
    y.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  const hoverProps = getHoverProps();

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={{
        x: springX,
        y: springY,
        scale: springScale,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={hoverProps.onMouseEnter}
      onMouseLeave={() => {
        handleMouseLeave();
        if (hoverProps.onMouseLeave) {
          hoverProps.onMouseLeave();
        }
      }}
      onClick={hoverProps.onClick}
    >
      {children}
    </motion.div>
  );
};

// Componente específico para cards com efeitos predefinidos
export const ParallaxCard = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <ParallaxElement
    intensity={0.15}
    enableScale={true}
    enableRotation={true}
    scaleIntensity={0.03}
    rotationIntensity={3}
    className={className}
  >
    {children}
  </ParallaxElement>
);

// Componente para imagens com parallax suave
export const ParallaxImage = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <ParallaxElement
    intensity={0.08}
    enableScale={true}
    enableRotation={false}
    scaleIntensity={0.02}
    className={className}
  >
    {children}
  </ParallaxElement>
);

// Componente para títulos com efeito magnético suave
export const ParallaxTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <ParallaxElement
    intensity={0.05}
    enableScale={false}
    enableRotation={false}
    className={className}
  >
    {children}
  </ParallaxElement>
);

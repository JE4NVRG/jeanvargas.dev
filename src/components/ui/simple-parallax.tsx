"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SimpleParallaxProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export const SimpleParallax = ({
  children,
  intensity = 0.05,
  className = "",
}: SimpleParallaxProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Verificar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Verificar se é dispositivo touch
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) * intensity;
      const deltaY = (y - centerY) * intensity;

      element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = "translate3d(0, 0, 0) scale(1)";
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
        element.style.transform = "translate3d(0, 0, 0) scale(1)";
      }
    };
  }, [intensity]);

  return (
    <div
      ref={elementRef}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
};

export default SimpleParallax;

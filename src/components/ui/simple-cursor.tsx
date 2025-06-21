"use client";

import { useEffect, useState } from "react";

export const SimpleCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Verificar se é dispositivo touch
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Verificar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const hideCursor = () => setIsVisible(false);

    // Detectar elementos interativos
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.matches(
          'a, button, [role="button"], .cursor-pointer, input, textarea, select'
        ) ||
        target.closest('a, button, [role="button"], .cursor-pointer')
      ) {
        setIsHovered(true);
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.matches(
          'a, button, [role="button"], .cursor-pointer, input, textarea, select'
        ) ||
        target.closest('a, button, [role="button"], .cursor-pointer')
      ) {
        setIsHovered(false);
      }
    };

    // Event listeners
    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", () => setIsVisible(true));
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Cursor principal */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out ${
          isHovered ? "scale-150" : "scale-100"
        }`}
        style={{
          left: position.x - 6,
          top: position.y - 6,
          width: "12px",
          height: "12px",
        }}
      >
        <div
          className={`w-full h-full rounded-full border-2 transition-all duration-200 ${
            isHovered
              ? "bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/25"
              : "bg-white/10 border-white/50"
          }`}
        />
      </div>

      {/* Rastro do cursor */}
      <div
        className={`fixed pointer-events-none z-40 transition-all duration-300 ease-out ${
          isHovered ? "scale-125" : "scale-100"
        }`}
        style={{
          left: position.x - 20,
          top: position.y - 20,
          width: "40px",
          height: "40px",
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-300 ${
            isHovered
              ? "bg-blue-500/10 border border-blue-400/20"
              : "bg-white/5 border border-white/10"
          }`}
          style={{
            filter: "blur(8px)",
          }}
        />
      </div>
    </>
  );
};

export default SimpleCursor;

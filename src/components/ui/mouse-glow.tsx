"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface SectionInfo {
  element: Element;
  isDark: boolean;
  method: "data-attribute" | "background-color" | "intersection";
}

export const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: -100,
    y: -100,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isOnDarkSection, setIsOnDarkSection] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Map<Element, SectionInfo>>(new Map());

  // Função para analisar cor de fundo e determinar se é escura
  const isDarkBackground = useCallback((element: Element): boolean => {
    try {
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;

      // Extrair valores RGB da string css
      const rgbMatch = backgroundColor.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
      );
      if (!rgbMatch) {
        // Verificar gradientes ou cores nomeadas escuras
        const darkKeywords = [
          "black",
          "gray-900",
          "gray-800",
          "slate-900",
          "zinc-900",
        ];
        return darkKeywords.some((keyword) =>
          backgroundColor.includes(keyword)
        );
      }

      const [, r, g, b] = rgbMatch.map(Number);

      // Calcular luminosidade relativa
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Considerar escuro se luminosidade < 0.3 (aproximadamente rgb(76, 76, 76))
      return luminance < 0.3;
    } catch {
      return false;
    }
  }, []);

  // Função robusta para verificar se o cursor está sobre uma seção escura
  const checkDarkSection = useCallback(
    (element: Element | null): boolean => {
      if (!element) return false;

      let currentElement: Element | null = element;
      while (currentElement && currentElement !== document.body) {
        // 1. Verificar data attributes (prioritário)
        if (
          currentElement.hasAttribute("data-dark-section") ||
          currentElement.hasAttribute("data-hero") ||
          currentElement.hasAttribute("data-glow")
        ) {
          return true;
        }

        // 2. Verificar seções específicas por ID ou data-section
        const sectionId = currentElement.getAttribute("id");
        const sectionType = currentElement.getAttribute("data-section");
        const darkSections = [
          "hero",
          "projetos",
          "projects",
          "tech-showcase",
          "stacks",
          "services",
          "servicos",
          "contato",
          "footer",
        ];

        if (
          (sectionId && darkSections.includes(sectionId)) ||
          (sectionType && darkSections.includes(sectionType))
        ) {
          return true;
        }

        // 3. Verificar classes CSS específicas
        const classList = Array.from(currentElement.classList);
        const darkClasses = [
          "bg-gray-900",
          "bg-gray-800",
          "bg-black",
          "bg-slate-900",
          "dark:bg-gray-900",
          "dark:bg-gray-800",
          "dark:bg-black",
          "from-gray-800",
          "from-blue-600",
          "from-purple-600",
        ];

        if (darkClasses.some((darkClass) => classList.includes(darkClass))) {
          return true;
        }

        // 4. Verificar cor de fundo computada (fallback)
        if (
          currentElement.tagName.toLowerCase() === "section" &&
          isDarkBackground(currentElement)
        ) {
          return true;
        }

        currentElement = currentElement.parentElement;
      }

      return false;
    },
    [isDarkBackground]
  );

  // Inicializar IntersectionObserver para detectar seções escuras
  useEffect(() => {
    const sections = document.querySelectorAll(
      "section, main, article, div[data-section]"
    );
    const sectionMap = new Map<Element, SectionInfo>();

    sections.forEach((section) => {
      const isDark = checkDarkSection(section);
      if (isDark) {
        let method: SectionInfo["method"] = "data-attribute";

        if (
          section.hasAttribute("data-dark-section") ||
          section.hasAttribute("data-hero") ||
          section.hasAttribute("data-glow")
        ) {
          method = "data-attribute";
        } else if (isDarkBackground(section)) {
          method = "background-color";
        } else {
          method = "intersection";
        }

        sectionMap.set(section, { element: section, isDark, method });
      }
    });

    sectionsRef.current = sectionMap;

    // Criar IntersectionObserver para performance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionInfo = sectionsRef.current.get(entry.target);
          if (sectionInfo && entry.isIntersecting) {
            // Seção escura está visível no viewport
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observar todas as seções escuras
    sectionMap.forEach((_, section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [checkDarkSection, isDarkBackground]);

  // Timer para detectar movimento
  const moveTimer = useCallback(() => {
    setIsMoving(true);
    const timer = setTimeout(() => setIsMoving(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Otimização com requestAnimationFrame
  const updateMousePosition = useCallback(
    (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);

        // Verificar se está em seção escura usando múltiplas estratégias
        const element = document.elementFromPoint(e.clientX, e.clientY);
        const isDark = checkDarkSection(element);
        setIsOnDarkSection(isDark);

        // Debug: Log da detecção (remover em produção)
        if (process.env.NODE_ENV === "development" && isDark) {
          const sectionInfo = element?.closest("section, main, article");
          if (sectionInfo) {
            console.log("🌙 MouseGlow ativo na seção:", {
              tagName: sectionInfo.tagName,
              id: sectionInfo.id,
              className: sectionInfo.className,
              dataSection: sectionInfo.getAttribute("data-section"),
            });
          }
        }

        // Ativar efeito de movimento
        moveTimer();
      });
    },
    [checkDarkSection, moveTimer]
  );

  useEffect(() => {
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsOnDarkSection(false);
      setIsMoving(false);
    };

    // Adicionar listeners
    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observerRef.current?.disconnect();
    };
  }, [updateMousePosition]);

  // Só renderizar se estiver visível e em seção escura
  if (!isVisible || !isOnDarkSection) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 hidden sm:block dark:block"
      style={{
        opacity: isVisible && isOnDarkSection ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
    >
      {/* Efeito de luz principal com gradiente animado */}
      <div
        className="absolute w-96 h-96 rounded-full transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x - 192}px, ${
            mousePosition.y - 192
          }px, 0) ${isMoving ? "scale(1.05)" : "scale(1)"}`,
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 70%)`,
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Efeito secundário com overlay */}
      <div
        className="absolute w-80 h-80 rounded-full transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x - 160}px, ${
            mousePosition.y - 160
          }px, 0) ${isMoving ? "scale(1.08)" : "scale(1)"}`,
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)`,
          filter: "blur(16px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Centro brilhante com pulsação */}
      <div
        className="absolute w-32 h-32 rounded-full transition-transform duration-200 ease-out animate-pulse"
        style={{
          transform: `translate3d(${mousePosition.x - 64}px, ${
            mousePosition.y - 64
          }px, 0) ${isMoving ? "scale(1.1)" : "scale(1)"}`,
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)`,
          filter: "blur(8px)",
          mixBlendMode: "screen",
          animationDuration: "2s",
        }}
      />

      {/* Partículas flutuantes */}
      <div
        className="absolute w-2 h-2 rounded-full opacity-20 transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x - 30}px, ${
            mousePosition.y - 20
          }px, 0) scale(${isMoving ? 1.2 : 0.8})`,
          background: "rgba(255, 255, 255, 0.6)",
          filter: "blur(1px)",
          animationDelay: "0s",
        }}
      />

      <div
        className="absolute w-1.5 h-1.5 rounded-full opacity-15 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x + 25}px, ${
            mousePosition.y - 35
          }px, 0) scale(${isMoving ? 1.3 : 0.7})`,
          background: "rgba(255, 255, 255, 0.8)",
          filter: "blur(0.5px)",
          animationDelay: "0.3s",
        }}
      />

      <div
        className="absolute w-1 h-1 rounded-full opacity-25 transition-transform duration-400 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x + 40}px, ${
            mousePosition.y + 15
          }px, 0) scale(${isMoving ? 1.4 : 0.6})`,
          background: "rgba(255, 255, 255, 0.9)",
          filter: "blur(0.8px)",
          animationDelay: "0.6s",
        }}
      />

      <div
        className="absolute w-1.5 h-1.5 rounded-full opacity-10 transition-transform duration-600 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x - 45}px, ${
            mousePosition.y + 30
          }px, 0) scale(${isMoving ? 1.1 : 0.9})`,
          background: "rgba(255, 255, 255, 0.7)",
          filter: "blur(1.2px)",
          animationDelay: "0.9s",
        }}
      />

      {/* Halo externo suave */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x - 300}px, ${
            mousePosition.y - 300
          }px, 0) ${isMoving ? "scale(1.02)" : "scale(1)"}`,
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 60%)`,
          filter: "blur(30px)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
};

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";

type CursorVariant = "default" | "button" | "card" | "text" | "image";

interface CursorContextType {
  cursorVariant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
  isPressed: boolean;
  setIsPressed: (pressed: boolean) => void;
  velocity: { x: number; y: number };
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider = ({ children }: CursorProviderProps) => {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  // Refs para otimização
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const isMovingRef = useRef(false);

  // Função para detectar tipo de elemento automaticamente
  const detectCursorVariant = useCallback((element: Element): CursorVariant => {
    // Prioridade para data-cursor
    const dataCursor = element.getAttribute("data-cursor");
    if (
      dataCursor &&
      ["button", "card", "text", "image"].includes(dataCursor)
    ) {
      return dataCursor as CursorVariant;
    }

    // Detecção automática por seletores - otimizada
    if (
      element.matches(`
      button, 
      [role="button"], 
      input[type="submit"], 
      input[type="button"], 
      a, 
      [role="link"],
      .btn,
      .button
    `)
    ) {
      return "button";
    }

    if (
      element.matches(`
      input[type="text"], 
      input[type="email"], 
      input[type="password"], 
      input[type="search"], 
      textarea, 
      [contenteditable="true"],
      .editable
    `)
    ) {
      return "text";
    }

    if (
      element.matches(`
      .card, 
      [data-card], 
      .project-card, 
      .service-card,
      .cursor-card,
      .hover\\:scale-105,
      .hover\\:shadow-xl,
      [role="article"]
    `)
    ) {
      return "card";
    }

    if (
      element.matches(`
      img, 
      picture, 
      video,
      canvas,
      svg,
      [data-image],
      .image,
      .cursor-image
    `)
    ) {
      return "image";
    }

    return "default";
  }, []);

  // Handler otimizado do movimento do mouse
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = performance.now();
      const newX = e.clientX;
      const newY = e.clientY;
      const lastPos = lastPositionRef.current;
      const deltaTime = now - lastTimeRef.current;

      // Calcular distância para evitar updates desnecessários
      const distance = Math.sqrt(
        Math.pow(newX - lastPos.x, 2) + Math.pow(newY - lastPos.y, 2)
      );

      // Só atualizar se movimento significativo (melhora performance)
      if (distance > 1) {
        // Calcular velocidade apenas se tempo suficiente passou
        if (deltaTime > 0) {
          const deltaX = newX - lastPos.x;
          const deltaY = newY - lastPos.y;
          const newVelocity = {
            x: deltaX / deltaTime,
            y: deltaY / deltaTime,
          };

          // Throttle da velocidade para evitar valores extremos
          if (Math.abs(newVelocity.x) < 2 && Math.abs(newVelocity.y) < 2) {
            setVelocity(newVelocity);
          }
        }

        // Atualizar posição
        setMousePosition({ x: newX, y: newY });
        lastPositionRef.current = { x: newX, y: newY };
        lastTimeRef.current = now;

        // Detectar elemento apenas se não hovering manualmente
        if (!isHovering) {
          // Throttle da detecção de elementos
          if (!isMovingRef.current) {
            isMovingRef.current = true;

            // Use requestAnimationFrame para detectar elemento
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
              const elementUnderCursor = document.elementFromPoint(newX, newY);
              if (elementUnderCursor) {
                const variant = detectCursorVariant(elementUnderCursor);
                setCursorVariant(variant);
              }
              isMovingRef.current = false;
            });
          }
        }
      }
    },
    [isHovering, detectCursorVariant]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      setIsPressed(true);

      // Detectar elemento no click para cursor responsivo
      const element = e.target as Element;
      if (element && !isHovering) {
        const variant = detectCursorVariant(element);
        setCursorVariant(variant);
      }
    },
    [detectCursorVariant, isHovering]
  );

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isHovering) {
      setCursorVariant("default");
    }
  }, [isHovering]);

  // Setup dos event listeners com opções otimizadas
  useEffect(() => {
    const passiveOptions = { passive: true };
    const activeOptions = { passive: false };

    // MouseMove com passive para melhor performance
    document.addEventListener("mousemove", handleMouseMove, passiveOptions);
    document.addEventListener("mousedown", handleMouseDown, activeOptions);
    document.addEventListener("mouseup", handleMouseUp, activeOptions);
    document.addEventListener("mouseleave", handleMouseLeave, passiveOptions);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);

      // Limpar animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave]);

  const value: CursorContextType = {
    cursorVariant,
    setCursorVariant,
    mousePosition,
    isHovering,
    setIsHovering,
    isPressed,
    setIsPressed,
    velocity,
  };

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
};

export const useCursorContext = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursorContext must be used within a CursorProvider");
  }
  return context;
};

// Hook otimizado para hover
export const useCursorHover = (variant: CursorVariant = "button") => {
  const { setCursorVariant, setIsHovering } = useCursorContext();

  const onMouseEnter = useCallback(() => {
    setIsHovering(true);
    setCursorVariant(variant);
  }, [setCursorVariant, setIsHovering, variant]);

  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
    setCursorVariant("default");
  }, [setCursorVariant, setIsHovering]);

  return { onMouseEnter, onMouseLeave };
};

export default CursorContext;

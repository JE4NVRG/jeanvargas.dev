import { useState, useEffect, useCallback, useRef } from "react";

export type CursorState = "default" | "hover" | "click" | "disabled";

export interface CursorPosition {
  x: number;
  y: number;
}

export const useCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [state, setState] = useState<CursorState>("default");
  const [isMoving, setIsMoving] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const movingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar dispositivo touch e preferência de movimento reduzido
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };

    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    };

    checkTouchDevice();
    const cleanupReducedMotion = checkReducedMotion();

    return cleanupReducedMotion;
  }, []);

  // Rastrear movimento do mouse
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isTouchDevice) {
        setPosition({ x: e.clientX, y: e.clientY });
        setIsMoving(true);

        // Limpar timeout anterior
        if (movingTimeoutRef.current) {
          clearTimeout(movingTimeoutRef.current);
        }

        // Definir que parou de mover após 150ms de inatividade
        movingTimeoutRef.current = setTimeout(() => {
          setIsMoving(false);
        }, 150);
      }
    },
    [isTouchDevice]
  );

  // Listeners de eventos
  useEffect(() => {
    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (movingTimeoutRef.current) {
          clearTimeout(movingTimeoutRef.current);
        }
      };
    }
  }, [handleMouseMove, isTouchDevice]);

  // Métodos para controlar o estado do cursor
  const setCursorState = useCallback(
    (newState: CursorState) => {
      if (!prefersReducedMotion && !isTouchDevice) {
        setState(newState);
      }
    },
    [prefersReducedMotion, isTouchDevice]
  );

  const resetCursor = useCallback(() => {
    setState("default");
  }, []);

  // Helpers para elementos interativos
  const onHover = useCallback(() => setCursorState("hover"), [setCursorState]);
  const onLeave = useCallback(() => resetCursor(), [resetCursor]);
  const onClick = useCallback(() => {
    setCursorState("click");
    setTimeout(resetCursor, 200);
  }, [setCursorState, resetCursor]);

  return {
    position,
    state,
    isMoving,
    prefersReducedMotion,
    isTouchDevice,
    setCursorState,
    resetCursor,
    onHover,
    onLeave,
    onClick,
    // Helper para aplicar props de hover em elementos
    getHoverProps: () => ({
      onMouseEnter: onHover,
      onMouseLeave: onLeave,
      onClick: onClick,
    }),
  };
};

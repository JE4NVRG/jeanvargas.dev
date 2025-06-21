"use client";

import { useCallback } from "react";
import { useCursorContext } from "@/contexts/cursor-context";

type CursorVariant = "default" | "button" | "card" | "text" | "image";

interface CursorHoverOptions {
  variant?: CursorVariant;
  disabled?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}

export const useCursorHover = (options: CursorHoverOptions = {}) => {
  const { variant = "button", disabled = false, onHover, onLeave } = options;

  const { setCursorVariant, setIsHovering } = useCursorContext();

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    setCursorVariant(variant);
    setIsHovering(true);
    onHover?.();
  }, [variant, disabled, setCursorVariant, setIsHovering, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;

    setCursorVariant("default");
    setIsHovering(false);
    onLeave?.();
  }, [disabled, setCursorVariant, setIsHovering, onLeave]);

  const handleMouseDown = useCallback(() => {
    if (disabled) return;
    // Handled by context
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    if (disabled) return;
    // Handled by context
  }, [disabled]);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    "data-cursor": variant,
  };
};

// Hooks específicos para diferentes tipos
export const useButtonCursor = (
  options?: Omit<CursorHoverOptions, "variant">
) => useCursorHover({ ...options, variant: "button" });

export const useCardCursor = (options?: Omit<CursorHoverOptions, "variant">) =>
  useCursorHover({ ...options, variant: "card" });

export const useTextCursor = (options?: Omit<CursorHoverOptions, "variant">) =>
  useCursorHover({ ...options, variant: "text" });

export const useImageCursor = (options?: Omit<CursorHoverOptions, "variant">) =>
  useCursorHover({ ...options, variant: "image" });

export default useCursorHover;

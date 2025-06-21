"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCursor } from "@/hooks/use-cursor";
import type { CursorState, CursorPosition } from "@/hooks/use-cursor";

interface CursorContextType {
  position: CursorPosition;
  state: CursorState;
  isMoving: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  setCursorState: (state: CursorState) => void;
  resetCursor: () => void;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  getHoverProps: () => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
  };
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const cursorState = useCursor();

  return (
    <CursorContext.Provider value={cursorState}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursorContext = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursorContext must be used within a CursorProvider");
  }
  return context;
};

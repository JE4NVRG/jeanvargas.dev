"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./nora-avatar.module.css";

export type NoraAvatarState = "idle" | "thinking" | "speaking";
export type NoraAvatarProps = { size?: "launcher" | "header"; state?: NoraAvatarState };

/** Decorative companion; the parent button owns the accessible name and click action. */
export function NoraAvatar({ size = "launcher", state = "idle" }: NoraAvatarProps) {
  const root = useRef<HTMLSpanElement>(null);
  const id = useId().replaceAll(":", "");

  useEffect(() => {
    const element = root.current;
    if (!element || size !== "launcher" || state === "thinking") return;
    const tracking = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let frame = 0, pointerX = 0, pointerY = 0;

    const centerEyes = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      element.style.setProperty("--nora-look-x", "0px");
      element.style.setProperty("--nora-look-y", "0px");
    };
    const updateEyes = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || document.hidden) return;
      const x = pointerX - rect.left - rect.width / 2;
      const y = pointerY - rect.top - rect.height / 2;
      const distance = Math.hypot(x, y);
      const scale = Math.min(distance / 160, 1);
      element.style.setProperty("--nora-look-x", `${distance ? (x / distance * 3.2 * scale).toFixed(2) : 0}px`);
      element.style.setProperty("--nora-look-y", `${distance ? (y / distance * 2.2 * scale).toFixed(2) : 0}px`);
    };
    const followPointer = (event: PointerEvent) => {
      if (!tracking.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      pointerX = event.clientX; pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(updateEyes);
    };
    const leaveWindow = (event: PointerEvent) => { if (!event.relatedTarget) centerEyes(); };
    const updateTracking = () => {
      window.removeEventListener("pointermove", followPointer);
      if (tracking.matches) window.addEventListener("pointermove", followPointer, { passive: true });
      else centerEyes();
    };

    updateTracking();
    tracking.addEventListener("change", updateTracking);
    window.addEventListener("pointerout", leaveWindow, { passive: true });
    window.addEventListener("blur", centerEyes);
    return () => {
      tracking.removeEventListener("change", updateTracking);
      window.removeEventListener("pointermove", followPointer);
      window.removeEventListener("pointerout", leaveWindow);
      window.removeEventListener("blur", centerEyes);
      centerEyes();
    };
  }, [size, state]);

  return <span ref={root} className={styles.root} data-nora-avatar data-size={size} data-state={state} aria-hidden="true">
    <svg className={styles.canvas} viewBox="0 0 100 100" fill="none" focusable="false" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-body`} cx=".34" cy=".24" r=".82">
          <stop stopColor="#effff5"/>
          <stop offset=".35" stopColor="#b0efea"/>
          <stop offset=".74" stopColor="#65cbb5"/>
          <stop offset="1" stopColor="#286d59"/>
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="43" y1="8" x2="58" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d7fff0"/>
          <stop offset="1" stopColor="#4ba88b"/>
        </linearGradient>
        <linearGradient id={`${id}-eye`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff"/>
          <stop offset="1" stopColor="#e9fff5"/>
        </linearGradient>
      </defs>
      <ellipse className={styles.shadow} cx="50" cy="93" rx="27" ry="3.5" fill="#143e39" opacity=".13"/>
      <g className={styles.creature}>
        <path className={styles.leftHand} d="M18 60C10 55 5 60 8 69C10 75 14 77 20 75" fill="#64b69d" stroke="#347e66" strokeWidth="1.2"/>
        <path d="M82 60C89 55 96 60 92 69C90 76 86 78 80 75" fill="#529d82" stroke="#347e66" strokeWidth="1.2"/>
        <path className={styles.leaf} d="M43 22C37 17 39 7 48 8C53 3 64 8 63 15C61 22 51 26 43 22Z" fill={`url(#${id}-leaf)`} stroke="#4f9c7c" strokeWidth="1.2"/>
        <path d="M46 20C49 15 53 12 59 11" stroke="#f0fff5" strokeWidth="1.4" strokeLinecap="round" opacity=".8"/>
        <path d="M16 44C19 26 30 17 44 18C53 15 64 20 69 23C84 29 89 42 85 58C91 73 79 87 60 89C42 93 23 87 17 76C9 65 10 53 16 44Z" fill={`url(#${id}-body)`} stroke="#347e66" strokeWidth="1.3"/>
        <path d="M21 39C25 27 34 23 41 23" stroke="#f2fff8" strokeWidth="3.5" strokeLinecap="round" opacity=".62"/>
        <ellipse cx="23" cy="64" rx="5" ry="3" fill="#ddfff2" opacity=".5"/>
        <ellipse cx="77" cy="64" rx="5" ry="3" fill="#ddfff2" opacity=".4"/>
        <path className={styles.leftBrow} d="M24 31Q34 27 43 31" stroke="#347b63" strokeWidth="1.7" strokeLinecap="round"/>
        <path className={styles.rightBrow} d="M57 31Q66 28 75 32" stroke="#347b63" strokeWidth="1.7" strokeLinecap="round"/>
        <g className={styles.eyes}>
          <ellipse cx="34" cy="48" rx="11.5" ry="13" fill={`url(#${id}-eye)`} stroke="#4b9e85" strokeWidth="1"/>
          <ellipse cx="66" cy="48" rx="11.5" ry="13" fill={`url(#${id}-eye)`} stroke="#4b9e85" strokeWidth="1"/>
          <g className={styles.pupils}>
            <ellipse cx="35" cy="49" rx="5.4" ry="7.2" fill="#143e39"/>
            <ellipse cx="65" cy="49" rx="5.4" ry="7.2" fill="#143e39"/>
            <circle cx="33.5" cy="46" r="1.9" fill="#fff"/>
            <circle cx="63.5" cy="46" r="1.9" fill="#fff"/>
            <circle cx="36.5" cy="52" r=".7" fill="#b0efea" opacity=".7"/>
            <circle cx="66.5" cy="52" r=".7" fill="#b0efea" opacity=".7"/>
          </g>
        </g>
        <path className={styles.smile} d="M43 69Q50 75 57 69" stroke="#143e39" strokeWidth="2.1" strokeLinecap="round"/>
        <g className={styles.openMouth}>
          <ellipse cx="50" cy="71" rx="5" ry="4" fill="#143e39"/>
          <path d="M47 73Q50 71 53 73" stroke="#b0efea" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  </span>;
}

import styles from "@/components/sections/brand-hero.module.css";

/** Static two-tone folio. This paints with the headline; WebGL never has to. */
export function HeroSculptureFallback({ hidden }: { hidden: boolean }) {
  return (
    <div className={styles.mark} data-hidden={hidden ? "true" : "false"} aria-hidden="true">
      <svg viewBox="0 0 200 220" className={styles.markSvg}>
        <ellipse cx="100" cy="196" rx="58" ry="8" fill="#5EEAD4" opacity="0.16" />
        <g className={styles.sheet}>
          <rect x="46" y="28" width="108" height="140" rx="8" fill="#E1CDA8" />
          <rect x="58" y="46" width="46" height="4" rx="2" fill="#050505" opacity="0.35" />
          <rect x="58" y="58" width="72" height="3" rx="1.5" fill="#050505" opacity="0.18" />
          <rect x="58" y="68" width="64" height="3" rx="1.5" fill="#050505" opacity="0.18" />
        </g>
        <g className={styles.plate}>
          <rect x="38" y="92" width="124" height="16" rx="4" fill="#5EEAD4" />
          <rect className={styles.plateB} x="52" y="116" width="108" height="14" rx="4" fill="#5EEAD4" />
        </g>
        <g className={styles.core}>
          <circle cx="100" cy="104" r="34" fill="none" stroke="#E1CDA8" strokeWidth="3" />
          <polygon points="100,74 126,90 126,118 100,134 74,118 74,90" fill="#5EEAD4" />
        </g>
      </svg>
    </div>
  );
}

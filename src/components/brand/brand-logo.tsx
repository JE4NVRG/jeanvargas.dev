interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: {
    root: "text-[13px]",
    glyph: "h-[17px] w-[13px]",
  },
  md: {
    root: "text-[17px]",
    glyph: "h-[22px] w-[16px]",
  },
};

/**
 * JE4NDEV wordmark.
 *
 * The custom 4 is the brand's A replacement. The wordmark stays complete in
 * every navigation context so the identity is always read as JE4NDEV.
 */
export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const classes = sizeClasses[size];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center font-sans font-black uppercase leading-none tracking-[0.08em] text-white ${classes.root} ${className}`}
    >
      <span>JE</span>
      <svg
        viewBox="0 0 18 24"
        fill="none"
        className={`mx-[0.08em] shrink-0 overflow-visible ${classes.glyph}`}
      >
        <path
          d="M13.5 2.5 3 14h12.5"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 2.5v19"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      <span>N</span>
      <span className="ml-[0.12em]">DEV</span>
    </span>
  );
}

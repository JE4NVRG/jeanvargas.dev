import { BrandSymbol } from "@/components/brand/brand-symbol";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: {
    root: "text-[13px]",
    glyph: "h-[17px] w-[13px]",
    symbol: "h-7 w-7",
  },
  md: {
    root: "text-[17px]",
    glyph: "h-[22px] w-[16px]",
    symbol: "h-9 w-9",
  },
};

/**
 * JE4NDEV wordmark.
 *
 * The JD symbol means Jean + Dev. The custom 4 remains inside the complete
 * wordmark, where it replaces the A in Jean without becoming an abbreviation.
 */
export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const classes = sizeClasses[size];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center gap-[0.65em] font-sans font-black uppercase leading-none tracking-[0.08em] text-white ${classes.root} ${className}`}
    >
      <BrandSymbol className={classes.symbol} />
      <span className="inline-flex items-center">
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
    </span>
  );
}

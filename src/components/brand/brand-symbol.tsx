interface BrandSymbolProps {
  className?: string;
}

/** Fused JD monogram: Jean + Dev. */
export function BrandSymbol({ className = "" }: BrandSymbolProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-[0.7em] border border-current/20 ${className}`}
    >
      <svg viewBox="0 0 64 64" fill="none" className="h-[72%] w-[72%]">
        <path
          d="M28 13v27c0 7.5-4.5 12-11.5 12-4 0-7-1.5-9.5-4.5"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 13h9c11 0 19 8 19 19s-8 19-19 19h-9"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface BrandSymbolProps {
  className?: string;
}

/** Compact JD mark for favicon-sized uses. */
export function BrandSymbol({ className = "" }: BrandSymbolProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-sans font-semibold tracking-[0.08em] text-white ${className}`}
    >
      JD
    </span>
  );
}

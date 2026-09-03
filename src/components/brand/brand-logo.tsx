interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "text-[13px] tracking-[0.14em]",
  md: "text-[15px] tracking-[0.16em]",
};

/** Clean JE4NDEV wordmark. No monogram, no custom glyph. */
export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center font-sans font-semibold uppercase leading-none text-white ${sizeClasses[size]} ${className}`}
    >
      JE4NDEV
    </span>
  );
}

import Image from "next/image";

interface BrandSymbolProps {
  className?: string;
}

/** The selected interlocking JE4NDEV symbol, without abbreviating the name. */
export function BrandSymbol({ className = "" }: BrandSymbolProps) {
  return (
    <Image
      src="/brand/je4ndev-symbol-white.svg"
      alt=""
      width={306}
      height={254}
      aria-hidden="true"
      draggable={false}
      unoptimized
      className={`inline-block h-auto w-8 shrink-0 ${className}`}
    />
  );
}

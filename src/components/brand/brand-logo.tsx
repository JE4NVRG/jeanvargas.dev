import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-[164px]",
  md: "w-[198px]",
  lg: "w-[272px]",
};

/** Selected JE4NDEV symbol and wordmark, with lettering stored as vector paths. */
export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  return (
    <Image
      src="/brand/je4ndev-lockup-white.svg"
      alt=""
      width={1276}
      height={254}
      aria-hidden="true"
      draggable={false}
      unoptimized
      loading="eager"
      className={`inline-block h-auto max-w-full shrink-0 ${sizeClasses[size]} ${className}`}
    />
  );
}

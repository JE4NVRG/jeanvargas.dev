interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/25 bg-[#050505] shadow-[0_0_28px_-14px_rgba(34,211,238,0.9)] ${className}`}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.28),transparent_34%),radial-gradient(circle_at_78%_82%,rgba(168,85,247,0.32),transparent_36%)]" />
      <span className="absolute inset-[1px] rounded-[10px] border border-white/[0.08]" />
      <span className="relative font-mono text-[13px] font-black leading-none tracking-normal">
        <span className="text-cyan-200">J</span>
        <span className="text-purple-400">4</span>
      </span>
    </span>
  );
}

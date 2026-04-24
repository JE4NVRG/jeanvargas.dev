export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] text-white">
      <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
        je4ndev
      </div>
    </div>
  );
}

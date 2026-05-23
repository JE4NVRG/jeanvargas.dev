"use client";

const TECH = [
  "TypeScript",
  "Next.js 16",
  "React 19",
  "Supabase",
  "PostgreSQL",
  "Stripe",
  "OpenAI",
  "Anthropic",
  "Three.js",
  "Solidity",
  "Tailwind v4",
  "Framer Motion",
  "GSAP",
  "Python",
  "FastAPI",
  "Ollama",
  "MCP",
  "Cloudflare",
  "Docker",
  "Vercel",
];

/**
 * TechMarquee — infinite horizontal scroll of stack chips.
 * Pure CSS animation (no JS observers) so it works under all conditions.
 * Doubled list seam-lessly loops.
 */
export function TechMarquee() {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.05] bg-[#070707]/80 py-6 backdrop-blur">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent" />

      <div className="marquee flex w-max gap-12 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-zinc-500">
        {[...TECH, ...TECH].map((label, i) => (
          <span key={i} className="flex shrink-0 items-center gap-12">
            <span>{label}</span>
            <span aria-hidden className="text-zinc-700">·</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee {
          animation: marquee 45s linear infinite;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

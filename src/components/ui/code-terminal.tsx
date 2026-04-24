"use client";

import { motion } from "framer-motion";

interface TerminalLine {
  command?: string;
  output?: string;
  tone?: "muted" | "success" | "info" | "warning";
}

interface CodeTerminalProps {
  title?: string;
  lines: TerminalLine[];
  className?: string;
}

const toneClass = {
  muted: "text-zinc-500",
  success: "text-emerald-400",
  info: "text-cyan-300",
  warning: "text-amber-300",
};

export function CodeTerminal({
  title = "je4ndev/runtime",
  lines,
  className = "",
}: CodeTerminalProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/[0.08] bg-[#060708]/95 shadow-2xl shadow-black/40 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-xs text-zinc-500">{title}</span>
      </div>

      <div className="space-y-3 p-4 font-mono text-xs leading-6 sm:text-sm">
        {lines.map((line, index) => (
          <motion.div
            key={`${line.command ?? line.output}-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + index * 0.16 }}
          >
            {line.command && (
              <div className="text-zinc-200">
                <span className="text-emerald-400">$</span> {line.command}
                {index === 0 && (
                  <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-cyan-300/80" />
                )}
              </div>
            )}
            {line.output && (
              <div className={toneClass[line.tone ?? "muted"]}>
                {line.output}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

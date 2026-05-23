"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTranslation } from "@/i18n";

/**
 * Team — grid of the 21 specialist AI agents that make the agency.
 * Each agent has a synthetic 8-bit-style emoji avatar + role + LED status.
 */

type AgentStatus = "running" | "queued" | "idle";

type Agent = {
  id: string;
  name: string;
  role: { en: string; pt: string };
  emoji: string;
  status: AgentStatus;
  accent: string;
};

const AGENTS: Agent[] = [
  { id: "dev", name: "dev", emoji: "🛠️", role: { en: "Lead Engineer", pt: "Eng. Lead" }, status: "running", accent: "cyan" },
  { id: "dev2", name: "dev2", emoji: "🛠️", role: { en: "Backend Eng.", pt: "Eng. Backend" }, status: "running", accent: "cyan" },
  { id: "dev3", name: "dev3", emoji: "🛠️", role: { en: "Frontend Eng.", pt: "Eng. Frontend" }, status: "queued", accent: "cyan" },
  { id: "design", name: "design", emoji: "🎨", role: { en: "Product Design", pt: "Design de Produto" }, status: "running", accent: "fuchsia" },
  { id: "qa", name: "qa", emoji: "🧪", role: { en: "QA Engineer", pt: "Eng. de QA" }, status: "idle", accent: "amber" },
  { id: "qa_browser", name: "qa_browser", emoji: "🌐", role: { en: "Browser QA", pt: "QA de Browser" }, status: "idle", accent: "amber" },
  { id: "security", name: "security", emoji: "🛡️", role: { en: "Security Eng.", pt: "Eng. de Segurança" }, status: "running", accent: "emerald" },
  { id: "gerente", name: "gerente", emoji: "🎯", role: { en: "Product Manager", pt: "Gerente de Produto" }, status: "running", accent: "violet" },
  { id: "research", name: "research", emoji: "🔬", role: { en: "Research", pt: "Research" }, status: "idle", accent: "violet" },
  { id: "marketing", name: "marketing", emoji: "📣", role: { en: "Marketing", pt: "Marketing" }, status: "queued", accent: "pink" },
  { id: "seo", name: "seo", emoji: "🔎", role: { en: "SEO", pt: "SEO" }, status: "idle", accent: "pink" },
  { id: "social", name: "social", emoji: "📱", role: { en: "Social Media", pt: "Social Media" }, status: "idle", accent: "pink" },
  { id: "youtube", name: "youtube", emoji: "🎬", role: { en: "YouTube", pt: "YouTube" }, status: "idle", accent: "pink" },
  { id: "trafego", name: "trafego", emoji: "🎯", role: { en: "Paid Traffic", pt: "Tráfego Pago" }, status: "idle", accent: "pink" },
  { id: "email", name: "email", emoji: "✉️", role: { en: "Email Marketing", pt: "Email Marketing" }, status: "idle", accent: "pink" },
  { id: "vendas", name: "vendas", emoji: "💼", role: { en: "Sales", pt: "Vendas" }, status: "running", accent: "amber" },
  { id: "atendimento", name: "atendimento", emoji: "💬", role: { en: "Customer Support", pt: "Atendimento" }, status: "running", accent: "amber" },
  { id: "financeiro", name: "financeiro", emoji: "💰", role: { en: "Finance", pt: "Financeiro" }, status: "idle", accent: "emerald" },
  { id: "plr", name: "plr", emoji: "📊", role: { en: "PLR / Reports", pt: "PLR / Relatórios" }, status: "idle", accent: "emerald" },
  { id: "stop-judge", name: "stop-judge", emoji: "⚖️", role: { en: "Decision Judge", pt: "Juiz de Decisão" }, status: "running", accent: "violet" },
  { id: "default", name: "default", emoji: "🌀", role: { en: "Orchestrator", pt: "Orquestrador" }, status: "running", accent: "cyan" },
];

const STATUS_STYLE: Record<AgentStatus, { dot: string; ring: string; label: { en: string; pt: string } }> = {
  running: {
    dot: "bg-emerald-400",
    ring: "ring-emerald-400/50",
    label: { en: "live", pt: "ativo" },
  },
  queued: {
    dot: "bg-violet-400",
    ring: "ring-violet-400/40",
    label: { en: "queued", pt: "na fila" },
  },
  idle: {
    dot: "bg-zinc-600",
    ring: "ring-zinc-700/40",
    label: { en: "idle", pt: "parado" },
  },
};

export function Team() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".agent-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "expo.out",
          stagger: { each: 0.025, grid: "auto", from: "start" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="team" className="relative border-t border-white/[0.05] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-300/80">
          {t.team.label}
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {t.team.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-7 text-zinc-400">
          {t.team.subtitle}
        </p>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {AGENTS.map((agent) => {
            const status = STATUS_STYLE[agent.status];
            return (
              <div
                key={agent.id}
                className="agent-card group relative flex flex-col items-center rounded-xl border border-white/[0.06] bg-[#0a0a0a]/80 p-4 backdrop-blur transition-colors hover:border-white/[0.16]"
              >
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 text-2xl ring-1 ${status.ring}`}
                >
                  <span aria-hidden>{agent.emoji}</span>
                  <span
                    className={`absolute right-1 top-1 h-2 w-2 rounded-full ${status.dot}`}
                    title={status.label[locale]}
                  >
                    {agent.status === "running" ? (
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                    ) : null}
                  </span>
                </div>
                <p className="mt-3 font-mono text-xs font-semibold text-white">{agent.name}</p>
                <p className="mt-1 text-center text-[10px] leading-3 text-zinc-500">
                  {agent.role[locale]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

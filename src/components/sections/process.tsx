"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTranslation } from "@/i18n";
import { Compass, KanbanSquare, ShieldCheck, Rocket } from "lucide-react";

/**
 * Process — 4-step "Briefing → Sprint Hermes Kanban → QA + Security → Deploy + Operacao 24/7"
 * Each step reveals on scroll with stagger. The icons are GSAP-animated on enter.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".process-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            delay: i * 0.06,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      // Line that draws between steps
      const line = sectionRef.current?.querySelector(".process-line");
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "expo.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const icons = [Compass, KanbanSquare, ShieldCheck, Rocket];

  return (
    <section ref={sectionRef} id="process" className="relative border-t border-white/[0.05] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300/80">
          {t.process.label}
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {t.process.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-7 text-zinc-400">
          {t.process.subtitle}
        </p>

        <div className="relative mt-20">
          {/* Connecting line (animated draw) */}
          <div
            aria-hidden
            className="process-line absolute left-0 right-0 top-[44px] hidden h-px origin-left bg-gradient-to-r from-cyan-500/0 via-cyan-400/40 to-violet-500/0 lg:block"
          />

          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {t.process.steps.map((step, i) => {
              const Icon = icons[i] ?? Compass;
              return (
                <div
                  key={i}
                  className="process-card group relative flex flex-col rounded-2xl border border-white/[0.08] bg-[#080808]/80 p-7 backdrop-blur transition-colors hover:border-cyan-300/30"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-cyan-500/15 to-violet-500/15 transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
                  <p className="mt-5 text-xs font-mono uppercase tracking-widest text-emerald-300/70">
                    {step.deliverable}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

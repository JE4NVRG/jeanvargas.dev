"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useTranslation } from "@/i18n";
import { Check, MessageCircle, Rocket, Users, Crown } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5511948477047?text=Oi%20Jean%2C%20quero%20conversar%20sobre%20um%20plano.";

const PLAN_ICONS = [Rocket, Users, Crown];
const PLAN_ACCENTS = [
  "from-cyan-500/15 to-cyan-500/0 border-cyan-400/30",
  "from-violet-500/20 to-violet-500/0 border-violet-400/40",
  "from-amber-500/15 to-amber-500/0 border-amber-400/30",
];

export function Pricing() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".pricing-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
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
    <section ref={sectionRef} id="pricing" className="relative border-t border-white/[0.05] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/80">
          {t.pricing.label}
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {t.pricing.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-7 text-zinc-400">{t.pricing.subtitle}</p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.pricing.plans.map((plan, i) => {
            const Icon = PLAN_ICONS[i] ?? Rocket;
            const accent = PLAN_ACCENTS[i] ?? PLAN_ACCENTS[0];
            const featured = plan.featured;
            return (
              <div
                key={plan.name}
                className={`pricing-card relative flex flex-col rounded-2xl border bg-[#0a0a0a]/85 p-7 backdrop-blur ${
                  featured
                    ? "border-violet-400/40 shadow-[0_30px_100px_-40px_rgba(139,92,246,0.45)]"
                    : "border-white/[0.08]"
                }`}
              >
                {featured ? (
                  <span className="absolute -top-3 left-7 rounded-full bg-violet-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    {plan.badge}
                  </span>
                ) : null}

                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br ${accent}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.priceSuffix ? (
                    <span className="text-sm text-zinc-500">{plan.priceSuffix}</span>
                  ) : null}
                </div>
                {plan.priceNote ? (
                  <p className="mt-1 text-xs text-zinc-500">{plan.priceNote}</p>
                ) : null}

                <ul className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-9 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    featured
                      ? "bg-white text-black hover:bg-zinc-100"
                      : "border border-white/[0.16] bg-white/[0.04] text-white hover:border-white/[0.32]"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">{t.pricing.disclaimer}</p>
      </div>
    </section>
  );
}

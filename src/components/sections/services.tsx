"use client";

import {
  Globe,
  Server,
  Bot,
  Plug,
  Smartphone,
  Code2,
  ArrowUpRight,
} from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

const serviceIcons = [Globe, Server, Bot, Plug, Smartphone, Code2];

const WHATSAPP_URL = "https://wa.me/5511914826568";

export function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
            {t.services.label}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t.services.title}
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((service, i) => {
            const Icon = serviceIcons[i] || Code2;
            const message = encodeURIComponent(
              `Hi Jean, I'm interested in your ${service.title} service.`
            );
            return (
              <SectionReveal key={i} delay={0.05 * i}>
                <div className="group flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-purple-500/50">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                    {service.description}
                  </p>
                  <a
                    href={`${WHATSAPP_URL}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition-colors group-hover:text-purple-400"
                  >
                    {t.services.cta}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

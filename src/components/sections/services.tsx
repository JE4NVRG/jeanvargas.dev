"use client";

import Link from "next/link";
import {
  Globe,
  Server,
  Bot,
  Plug,
  ShieldCheck,
  Smartphone,
  Code2,
  ArrowUpRight,
} from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

const serviceIcons = [
  Globe,
  Server,
  Bot,
  Plug,
  ShieldCheck,
  Smartphone,
  Code2,
];

const SERVICE_ROUTES = {
  pt: ["desenvolvimento-saas", "automacoes-ia", "agentes-ia-privados"],
  en: ["saas-development", "ai-automation", "private-ai-agents"],
} as const;

const SERVICE_IDS = [
  "saas",
  "automation",
  "agents",
  "web-platforms",
  "technical-recovery",
  "web3",
] as const;

const WHATSAPP_URL = "https://wa.me/5511948477047";

export function Services() {
  const { t, locale } = useTranslation();

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
            const messageTemplate = t.services.whatsappMessage ?? "Hi Jean, I'm interested in your {service} service.";
            const message = encodeURIComponent(
              messageTemplate.replace("{service}", service.title)
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
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {SERVICE_ROUTES[locale][i] ? (
                      <Link
                        href={`/${locale}/services/${SERVICE_ROUTES[locale][i]}`}
                        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                      >
                        {locale === "pt" ? "Ver detalhes" : "View details"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                    <a
                      href={`${WHATSAPP_URL}?text=${message}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics-event="lead-cta-click"
                      data-cta={`service-${i + 1}`}
                      data-service={SERVICE_IDS[i] ?? `service-${i + 1}`}
                      data-offer="diagnosis-first-milestone"
                      className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-purple-300"
                    >
                      {t.services.cta}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

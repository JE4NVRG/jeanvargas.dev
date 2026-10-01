"use client";

import Link from "next/link";
import {
  Globe, Server, Bot, ArrowUpRight,
} from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

import { COMPANY } from "@/data/company";
import { contactEmailHref } from "@/lib/contact-email";

const serviceIcons = [Globe, Server, Bot];

const SERVICE_IDS = ["website", "systems", "ai-agents"] as const;

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
            const Icon = serviceIcons[i] ?? Bot;
            const messageTemplate = t.services.whatsappMessage ?? "Hi! I'm interested in your {service} service.";
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
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                    {service.description}
                  </p>
                  <div className="mt-6">
                    <a
                      href={locale === "pt" ? `${COMPANY.whatsappUrl}?text=${message}` : contactEmailHref(locale, service.title)}
                      target={locale === "pt" ? "_blank" : undefined}
                      rel={locale === "pt" ? "noopener noreferrer" : undefined}
                      data-analytics-event="lead-cta-click"
                      data-cta={`service-${i + 1}`}
                      data-service={SERVICE_IDS[i]}
                      data-offer="diagnosis-first-milestone"
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-white"
                    >
                      {t.services.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    {i === 0 ? (
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-3">
                        <Link href={`/${locale}/services/${locale === "pt" ? "criacao-de-sites" : "business-websites"}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-200">
                          {locale === "pt" ? "Criação de sites" : "Professional websites"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link href={`/${locale}/services/${locale === "pt" ? "criacao-de-landing-pages" : "landing-page-development"}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-200">
                          {locale === "pt" ? "Landing pages" : "Landing pages"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : i === 1 ? (
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-3">
                        <Link href={`/${locale}/services/${locale === "pt" ? "desenvolvimento-saas" : "saas-development"}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-200">
                          {locale === "pt" ? "Sistemas sob medida" : "Custom systems"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link href={`/${locale}/services/${locale === "pt" ? "automacoes-ia" : "ai-automation"}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-200">
                          {locale === "pt" ? "Automações e integrações" : "Automation and integrations"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : i === 2 ? (
                      <div className="mt-3 border-t border-white/[0.06] pt-3">
                        <p className="mb-3 text-sm leading-relaxed text-zinc-300">{locale === "pt" ? "Gostou da Nora? Podemos criar um assistente para sua rotina ou negócio." : "Like Nora? We can build an assistant for your everyday life or business."}</p>
                        <button type="button" data-cta="service-nora-demo" onClick={() => window.dispatchEvent(new Event("je4ndev:open-nora"))} className="mb-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-cyan-200 transition-colors hover:text-white">
                          {locale === "pt" ? "Experimente a Nora" : "Try Nora"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                        <Link href={`/${locale}/services/${locale === "pt" ? "agentes-ia-privados" : "private-ai-agents"}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-200">
                          {locale === "pt" ? "Assistentes personalizados" : "Personalized AI assistants"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link href={`/${locale}/projects/nora`} data-cta="service-nora-case" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-cyan-200 hover:text-white">{locale === "pt" ? "Veja como construímos a Nora" : "See how we built Nora"}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true"/></Link>
                      </div>
                    ) : null}
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

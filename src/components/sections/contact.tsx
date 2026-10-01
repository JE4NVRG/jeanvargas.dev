"use client";

import { Mail, MessageCircle, ArrowUpRight, Video } from "lucide-react";
import { BrandSymbol } from "@/components/brand/brand-symbol";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";
import { COMPANY } from "@/data/company";
import { contactEmailHref } from "@/lib/contact-email";

export function Contact() {
  const { t, locale } = useTranslation();
  const message = locale === "pt"
    ? "Olá! Quero conversar sobre um projeto. Minha necessidade é: "
    : "Hi! I would like to discuss a project. What I need is: ";
  const whatsappUrl = `${COMPANY.whatsappUrl}?text=${encodeURIComponent(message)}`;
  const emailLink = <a href={contactEmailHref(locale)} data-analytics-event="lead-cta-click" data-cta="contact-email" data-offer="diagnosis-first-milestone" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${locale === "en" ? "bg-white text-[#101010] hover:bg-cyan-100" : "border border-white/15 text-zinc-200 hover:border-white/30 hover:bg-white/[0.04]"}`}><Mail className="h-4 w-4"/>{COMPANY.email}</a>;
  const whatsappLink = <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="lead-cta-click" data-cta="contact-whatsapp" data-offer="diagnosis-first-milestone" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${locale === "pt" ? "bg-white text-[#101010] hover:bg-cyan-100" : "border border-white/15 text-zinc-200 hover:border-white/30 hover:bg-white/[0.04]"}`}><MessageCircle className="h-4 w-4"/>{locale === "pt" ? "Conversar pelo WhatsApp" : "Message us on WhatsApp"}<ArrowUpRight className="h-4 w-4"/></a>;

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.07] py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/[0.08] blur-[110px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionReveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-medium text-cyan-200">{locale === "pt" ? "Vamos conversar" : "Start a conversation"}</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">{locale === "pt" ? "Tem um projeto em mente?" : "Have a project in mind?"}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{locale === "pt" ? "Pode ser um site para apresentar seu trabalho, um sistema para sua equipe ou um assistente de IA personalizado para sua rotina. Conte o que você precisa, como pessoa física ou empresa. A conversa inicial serve para entender o contexto e combinar um próximo passo, sem compromisso." : "It could be a website to showcase your work, a system for your team or a personalized AI assistant for your everyday life. Tell us what you need, as an individual or a business. The first conversation is simply to understand the context and agree on a next step, with no obligation."}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#d8c098]/25 bg-[#d8c098]/[0.06]">
                  <BrandSymbol />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{t.contact.cardTitle}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{t.contact.cardSubtitle}</p>
                </div>
              </div>
              <div className="mt-7 grid gap-3">
                {locale === "en" ? <>{emailLink}{whatsappLink}</> : <>{whatsappLink}{emailLink}</>}
                <a href={contactEmailHref(locale, locale === "pt" ? "Conversa por vídeo" : "Discovery call")} data-analytics-event="lead-cta-click" data-cta="contact-call-request" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm text-cyan-200 hover:bg-white/5"><Video className="h-4 w-4" aria-hidden="true"/>{locale === "pt" ? "Combinar uma conversa por vídeo" : "Request a discovery call"}</a>
              </div>
              <p className="mt-5 text-center text-xs leading-5 text-zinc-400">{locale === "pt" ? "Atendimento remoto em português e inglês. Chamadas são combinadas por e-mail, conforme seu fuso e disponibilidade." : "Remote collaboration in English and Portuguese. Call times are agreed by email around your time zone and availability."}</p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

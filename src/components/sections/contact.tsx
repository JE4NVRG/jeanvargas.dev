"use client";

import { Mail, MessageCircle } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useTranslation } from "@/i18n";

export function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative py-32">
      {/* Subtle gradient orb */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.15) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <SectionReveal>
          <h2 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            {t.contact.title}{" "}
            <span className="bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 bg-clip-text text-transparent">
              {t.contact.titleHighlight}
            </span>
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p className="mt-6 text-lg text-zinc-500">{t.contact.subtitle}</p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              as="a"
              href="mailto:jean@je4ndev.com"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              <Mail className="h-4 w-4" />
              jean@je4ndev.com
            </MagneticButton>

            <MagneticButton
              as="a"
              href="https://wa.me/5511914826568"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-green-500/30 px-8 py-3 text-sm font-medium text-green-400 transition-colors hover:border-green-500/50 hover:bg-green-500/5"
            >
              <MessageCircle className="h-4 w-4" />
              {t.contact.whatsapp}
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

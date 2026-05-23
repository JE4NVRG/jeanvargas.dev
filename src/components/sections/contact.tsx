"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mail, MessageCircle, ShieldCheck, Github, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useTranslation } from "@/i18n";

const WHATSAPP_URL =
  "https://wa.me/5511948477047?text=Oi%20Jean%2C%20quero%20fechar%20um%20projeto%20com%20a%20agencia.";
const EMAIL_URL = "mailto:jean@je4ndev.com";
const GITHUB_URL = "https://github.com/JE4NVRG";

/**
 * Final CTA — "última cena" before the footer.
 *
 * Two-column layout:
 *  - Left: founder card (photo + name + role + location + 3 CTAs + trustline)
 *  - Right: live terminal that types `$ briefing recebido → ... → deploy em produção`
 *    on scroll-into-view, then loops back to the cursor blinking on the last line.
 *
 * The terminal is hand-rolled instead of reusing CodeTerminal so we can drive
 * the per-line stagger from IntersectionObserver (CodeTerminal fires on mount).
 */
export function Contact() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [linesShown, setLinesShown] = useState(0);

  const lines = t.contact.terminalLines;
  const totalLines = lines.length;

  useEffect(() => {
    if (!sectionRef.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setLinesShown(totalLines);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Stagger the lines in — 420ms apart, matches the rest of the page.
            for (let i = 0; i < totalLines; i++) {
              setTimeout(() => setLinesShown((prev) => Math.max(prev, i + 1)), 420 * (i + 1));
            }
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [totalLines]);

  return (
    <section id="contact" className="relative overflow-hidden py-32" ref={sectionRef}>
      {/* Brighter gradient orb behind the card — pulls the eye in */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[700px] w-[700px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(6,182,212,0.35) 35%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/90">
              {t.nav.contact}
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {t.contact.title}{" "}
              <span className="animate-gradient-flow bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                {t.contact.titleHighlight}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-zinc-300">
              {t.contact.subtitle}
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15} className="mt-14">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
            {/* Founder card */}
            <div className="overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 shadow-[0_30px_120px_-40px_rgba(139,92,246,0.45)] backdrop-blur sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.04] sm:h-28 sm:w-28">
                  <Image
                    src="/images/jean-about.png"
                    alt={t.contact.founderName}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover object-[50%_35%]"
                  />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-emerald-300">
                    {"/// founder"}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    {t.contact.founderName}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-zinc-300 sm:text-base">
                    {t.contact.founderRole}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    <MapPin className="h-3 w-3" />
                    {t.contact.founderLocation}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <MagneticButton
                  as="a"
                  href={EMAIL_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_8px_40px_-8px_rgba(94,234,212,0.5)] transition-colors hover:bg-zinc-100 sm:text-base"
                >
                  <Mail className="h-4 w-4" />
                  jean@je4ndev.com
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/[0.06] px-7 py-3.5 text-sm font-semibold text-emerald-300 backdrop-blur transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/[0.1] sm:text-base"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.contact.whatsapp}
                </MagneticButton>

                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-zinc-300 backdrop-blur transition-colors hover:border-white/[0.32] hover:bg-white/[0.08] sm:text-base"
                >
                  <Github className="h-4 w-4" />
                  {t.contact.githubCta}
                </a>
              </div>

              {/* Trustline */}
              <p className="mt-7 inline-flex items-center gap-2 text-sm text-zinc-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {t.contact.trustline}
              </p>
            </div>

            {/* Terminal */}
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#060708]/95 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-mono text-xs text-zinc-500">
                  {t.contact.terminalTitle}
                </span>
              </div>

              <div className="space-y-4 p-5 font-mono text-xs leading-6 sm:p-6 sm:text-sm">
                {lines.map((line, index) => {
                  const visible = index < linesShown;
                  const isLast = index === lines.length - 1;
                  return (
                    <motion.div
                      key={line}
                      initial={false}
                      animate={
                        visible
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 8 }
                      }
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-emerald-400">$</span>
                      <span className="text-zinc-200">{line}</span>
                      {isLast && visible && (
                        <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-cyan-300/80" />
                      )}
                    </motion.div>
                  );
                })}

                {linesShown >= totalLines && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-2 border-t border-white/[0.06] pt-4 text-[11px] uppercase tracking-widest text-emerald-300/90"
                  >
                    {"/// pronto pra começar"}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

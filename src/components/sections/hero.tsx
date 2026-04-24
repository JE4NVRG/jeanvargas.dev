"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { CodeTerminal } from "@/components/ui/code-terminal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useTranslation } from "@/i18n";

const WHATSAPP_URL =
  "https://wa.me/5511914826568?text=Oi%20Jean%2C%20quero%20conversar%20sobre%20um%20projeto.";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-white/[0.06] pt-24">
      <AnimatedGrid />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-14 md:grid-cols-[1.05fr_0.8fr] lg:grid-cols-[1.05fr_0.95fr] lg:pb-16">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              {t.hero.badge}
            </div>
          </motion.div>

          <motion.h1
            className="max-w-4xl break-words text-3xl font-extrabold leading-tight tracking-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            {t.hero.title}{" "}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            className="mt-6 hidden max-w-2xl md:block"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
          >
            <CodeTerminal
              title={t.hero.terminalTitle}
              lines={[
                { command: t.hero.terminalCommand },
                {
                  output: t.hero.terminalOutput,
                  tone: "success",
                },
              ]}
            />
          </motion.div>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
          >
            <MagneticButton
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              <MessageCircle className="h-4 w-4" />
              {t.hero.cta}
            </MagneticButton>

            <MagneticButton
              as="a"
              href="#work"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-7 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-white/[0.24] hover:bg-white/[0.06]"
            >
              {t.hero.secondaryCta}
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-5 flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55 }}
          >
            <a
              href={`mailto:${t.hero.email}`}
              className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" />
              {t.hero.email}
            </a>
            <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              {t.hero.whatsapp}
            </a>
          </motion.div>

          <motion.div
            className="mt-9 grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.65 }}
          >
            {t.hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
              >
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs leading-5 text-zinc-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.35 }}
        >
          <div className="relative mx-auto max-w-[360px] overflow-hidden rounded-[2rem] border border-white/[0.1] bg-white/[0.04] p-2 shadow-2xl shadow-black/40 lg:max-w-[470px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/jean-hero.png"
                alt="Jean Carlos Vargas"
                fill
                className="object-cover object-[52%_35%]"
                sizes="(max-width: 1024px) 90vw, 470px"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-5 backdrop-blur-[2px]">
                <p className="text-base font-bold text-white">
                  {t.about.name}
                </p>
                <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-zinc-100">
                  {t.hero.proof}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 hidden max-w-[470px] gap-2 xl:grid">
            {t.hero.strengths.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#0b0b0b]/90 p-4 text-sm text-zinc-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

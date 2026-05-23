"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

export function Faq() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);

  // FAQPage JSON-LD — surface rich results em SERP do Google. Render
  // SSR via dangerouslySetInnerHTML pra que Googlebot leia sem JS.
  const faqJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }),
    [t.faq.items]
  );

  return (
    <section id="faq" className="relative border-t border-white/[0.05] py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/80">
          {t.faq.label}
        </p>
        <h2 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t.faq.title}
        </h2>
        <p className="mt-5 text-lg leading-7 text-zinc-400">{t.faq.subtitle}</p>

        <div className="mt-12 space-y-3">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/[0.02]"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-white sm:text-lg">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="border-t border-white/[0.05] px-6 py-5 text-sm leading-7 text-zinc-400">
                        {item.a}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

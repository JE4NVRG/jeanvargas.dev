"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
            {t.testimonials.label}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t.testimonials.title}
          </h2>
        </SectionReveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {t.testimonials.items.map((testimonial, i) => (
            <SectionReveal key={i} delay={0.05 * i}>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/80 p-5 transition-colors hover:border-cyan-300/25 hover:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      aria-hidden="true"
                      width={56}
                      height={56}
                      className="h-12 w-12 rounded-xl border border-white/[0.08] object-cover shadow-lg shadow-black/30"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {testimonial.name}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <Quote className="h-5 w-5 shrink-0 text-white/10" />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="truncate rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
                    {testimonial.company}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-6 text-zinc-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-5 border-t border-white/[0.06] pt-4">
                  <p className="text-xs font-medium text-cyan-300">
                    {testimonial.result}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

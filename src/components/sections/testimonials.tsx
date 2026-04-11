"use client";

import { Star } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
            {t.testimonials.label}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t.testimonials.title}
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          {t.testimonials.items.map((testimonial, i) => (
            <SectionReveal key={i} delay={0.05 * i}>
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.05] bg-white/[0.02] p-7">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                <p className="flex-1 text-sm italic leading-relaxed text-zinc-400">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-sm font-semibold text-purple-400">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

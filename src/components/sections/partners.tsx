"use client";

import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

const PARTNERS = [
  { name: "UrlPivot", href: "https://urlpivot.app", label: "urlpivot.app" },
  { name: "FullCommerce360", href: "https://fullcommerce360.com", label: "fullcommerce360.com" },
  { name: "ArchScene", href: "https://archscene.com", label: "archscene.com" },
  { name: "Vultrix 3D", href: "https://www.vultrix3d.com.br", label: "vultrix3d.com.br" },
  { name: "NexPanel", href: "https://nexpanel.agenciamep.com", label: "nexpanel.agenciamep.com" },
  { name: "Arremata Radar", href: "https://arremataradar.com", label: "arremataradar.com" },
];

export function Partners() {
  const { t } = useTranslation();
  const partners = t.partners;

  return (
    <section id="parceiros" className="relative border-t border-white/[0.05] py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d8c098]/90">
            {partners.label}
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            {partners.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-zinc-400">{partners.subtitle}</p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[76px] flex-col justify-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition-colors hover:border-[#d8c098]/30 hover:bg-white/[0.04]"
                >
                  <span className="flex items-center justify-between text-base font-semibold text-zinc-100">
                    {item.name}
                    <ArrowUpRight className="h-4 w-4 text-zinc-500" />
                  </span>
                  <span className="font-mono text-xs text-zinc-500">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-xs leading-5 text-zinc-500">{partners.note}</p>
        </SectionReveal>
      </div>
    </section>
  );
}

"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";
import { btnSecondary } from "@/components/ui/button-classes";

const PUBLIC_LINKS = [
  { href: "https://github.com/JE4NVRG", label: "github.com/JE4NVRG" },
  { href: "https://archscene.com", label: "archscene.com" },
  { href: "https://arremataradar.com", label: "arremataradar.com" },
  { href: "https://fullcommerce360.com", label: "fullcommerce360.com" },
  { href: "https://nexpanel.agenciamep.com", label: "nexpanel.agenciamep.com" },
  { href: "https://www.vultrix3d.com.br", label: "vultrix3d.com.br" },
];

export function GithubProof() {
  const { t } = useTranslation();
  const proof = t.githubProof;

  return (
    <section id="github" className="relative border-t border-white/[0.05] py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300/90">
            {proof.label}
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            {proof.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-zinc-400">{proof.subtitle}</p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {PUBLIC_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 text-sm text-zinc-300 transition-colors hover:border-white/[0.16] hover:text-white"
                >
                  <span className="font-mono">{item.label}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-xs leading-5 text-zinc-400">{proof.verificationNote}</p>
          <a
            href="https://github.com/JE4NVRG"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 ${btnSecondary}`}
          >
            <Github className="h-4 w-4" />
            {proof.cta}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </SectionReveal>
      </div>
    </section>
  );
}

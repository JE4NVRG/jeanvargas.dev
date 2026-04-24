"use client";

import Image from "next/image";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

const techDots = [
  { name: "Next.js", color: "bg-white" },
  { name: "TypeScript", color: "bg-blue-500" },
  { name: "Supabase", color: "bg-green-500" },
  { name: "Node.js", color: "bg-emerald-500" },
  { name: "OpenAI", color: "bg-purple-500" },
  { name: "React", color: "bg-cyan-500" },
];

export function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Photo */}
          <SectionReveal>
            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-2 shadow-2xl shadow-black/30">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#050505]">
                  <Image
                    src="/images/jean-about.png"
                    alt={t.about.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 460px"
                    className="object-cover object-[50%_35%]"
                    priority={false}
                  />
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-4 -right-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-bold text-green-400">
                  {t.about.experience}
                </span>
              </div>
            </div>
          </SectionReveal>

          {/* Content */}
          <SectionReveal delay={0.15}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
                {t.about.label}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {t.about.name}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                {t.about.bio}
              </p>

              {/* Tech dots */}
              <div className="mt-8 flex flex-wrap gap-4">
                {techDots.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 text-sm text-zinc-500"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${tech.color}`}
                    />
                    {tech.name}
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="mt-8 flex gap-3">
                <a
                  href="https://github.com/JE4NVRG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-5 py-2.5 text-sm text-zinc-400 transition-colors hover:border-white/[0.15] hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.linkedin.com/in/je4ndev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-5 py-2.5 text-sm text-zinc-400 transition-colors hover:border-white/[0.15] hover:text-white"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

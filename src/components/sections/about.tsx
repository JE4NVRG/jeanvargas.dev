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
            <div className="relative mx-auto w-fit">
              <div className="rounded-2xl bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 p-[2px]">
                <div className="rounded-2xl bg-[#050505] p-1">
                  <Image
                    src="https://avatars.githubusercontent.com/u/106420077?v=4"
                    alt={t.about.name}
                    width={400}
                    height={400}
                    className="rounded-xl object-cover"
                    priority={false}
                  />
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-4 -right-4 rounded-xl border border-white/[0.1] bg-green-500/10 px-4 py-2 backdrop-blur-sm">
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
                  href="https://www.linkedin.com/in/jean-carlos-vargas-93bbb31b4/"
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

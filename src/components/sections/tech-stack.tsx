"use client";

import Image from "next/image";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useTranslation } from "@/i18n";

interface TechItem {
  name: string;
  icon?: string;
  fallback?: string;
}

type CategoryKey =
  | "frontend"
  | "backend"
  | "database"
  | "ai"
  | "devops"
  | "web3"
  | "tools";

const categories: { key: CategoryKey; techs: TechItem[] }[] = [
  {
    key: "frontend",
    techs: [
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        name: "Tailwind CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
    ],
  },
  {
    key: "backend",
    techs: [
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      },
      {
        name: "Express.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
      },
    ],
  },
  {
    key: "database",
    techs: [
      {
        name: "Supabase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
      },
      {
        name: "Firebase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
    ],
  },
  {
    key: "ai",
    techs: [
      {
        name: "OpenAI",
        icon: "https://cdn.simpleicons.org/openai/white",
      },
      {
        name: "LangChain",
        icon: "https://cdn.simpleicons.org/langchain/white",
      },
      {
        name: "Anthropic",
        icon: "https://cdn.simpleicons.org/anthropic/white",
      },
      {
        name: "Qwen",
        fallback: "QW",
      },
      {
        name: "Kimi",
        fallback: "KI",
      },
      {
        name: "CCXT",
        fallback: "CX",
      },
    ],
  },
  {
    key: "devops",
    techs: [
      {
        name: "Docker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
      },
      {
        name: "Vercel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
      },
      {
        name: "GitHub Actions",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg",
      },
    ],
  },
  {
    key: "web3",
    techs: [
      {
        name: "Solidity",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-original.svg",
      },
      {
        name: "Hardhat",
        icon: "https://cdn.simpleicons.org/ethereum/white",
      },
      {
        name: "OpenZeppelin",
        icon: "https://cdn.simpleicons.org/openzeppelin/4e5ee4",
      },
    ],
  },
  {
    key: "tools",
    techs: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      },
      {
        name: "VS Code",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
      },
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
      },
    ],
  },
];

export function TechStack() {
  const { t } = useTranslation();

  return (
    <section id="stack" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
            {t.stack.label}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t.stack.title}
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, catIdx) => (
            <SectionReveal key={cat.key} delay={0.05 * catIdx}>
              <div>
                <h3 className="mb-4 text-sm font-semibold text-zinc-400">
                  {t.stack.categories[cat.key]}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {cat.techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] p-1.5 transition-transform group-hover:scale-110">
                        {tech.icon ? (
                          <Image
                            src={tech.icon}
                            alt={tech.name}
                            width={24}
                            height={24}
                            className="h-5 w-5 object-contain"
                            unoptimized
                          />
                        ) : (
                          <span className="text-[10px] font-black text-cyan-300">
                            {tech.fallback ?? tech.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-zinc-300">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

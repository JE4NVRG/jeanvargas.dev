import Image from "next/image";
import { CheckCircle2, Eye, LockKeyhole, RefreshCw } from "lucide-react";
import { CodeTerminal } from "@/components/ui/code-terminal";
import type { Project } from "@/types/project";

type ProofLabels = {
  approved: string;
  private: string;
  pending: string;
  editorial: string;
};

const terminalScenes: Record<string, Array<{ command?: string; output?: string; tone?: "muted" | "success" | "warning" | "info" }>> = {
  "openclaw-gateway": [
    { command: "openclaw gateway status" },
    { output: "gateway online · providers routed · MCP registry ready", tone: "success" },
    { command: "openclaw sessions list --active" },
    { output: "context persisted · model fallback available", tone: "info" },
    { command: "openclaw audit --secrets --tools" },
    { output: "human approval gate enabled", tone: "warning" },
  ],
  "hermes-agentes": [
    { command: "hermes profile list --active" },
    { output: "21 specialized profiles · isolated workspaces", tone: "success" },
    { command: "hermes kanban stats" },
    { output: "triage → ready → running → review → done", tone: "info" },
    { command: "hermes worker status" },
    { output: "founder review required before release", tone: "warning" },
  ],
};

function ProofPill({ project, labels }: { project: Project; labels: ProofLabels }) {
  const config = {
    approved: { label: labels.approved, icon: CheckCircle2, cls: "text-emerald-200" },
    "private-demo": { label: labels.private, icon: LockKeyhole, cls: "text-violet-200" },
    "needs-recapture": { label: labels.pending, icon: RefreshCw, cls: "text-amber-200" },
    "editorial-only": { label: labels.editorial, icon: Eye, cls: "text-zinc-300" },
  }[project.assetReview.status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur ${config.cls}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function ProjectMediaFrame({ project, labels, priority = false }: { project: Project; labels: ProofLabels; priority?: boolean }) {
  const terminal = terminalScenes[project.slug];

  if (terminal) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[#07090b] p-3 shadow-[0_35px_100px_-45px_rgba(94,234,212,0.35)] sm:p-5">
        <div className="absolute right-5 top-5 z-10"><ProofPill project={project} labels={labels} /></div>
        <CodeTerminal title={`${project.slug}/private-system-demo`} lines={terminal} className="min-h-[340px] border-white/[0.08]" />
      </div>
    );
  }

  const artwork = project.image ?? project.coverImage;
  if (!artwork) return null;

  return (
    <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[#080808] shadow-[0_35px_100px_-45px_rgba(94,234,212,0.28)]">
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${project.gradient ?? "from-zinc-900 to-black"}`}>
        <Image
          src={artwork}
          alt={`${project.title} product interface`}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.015]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <div className="absolute bottom-4 left-4"><ProofPill project={project} labels={labels} /></div>
      </div>
    </div>
  );
}

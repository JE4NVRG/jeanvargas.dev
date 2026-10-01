// Browser-safe visitor API contract. No credentials or server implementation here.
export const MEMORY_FIELDS = ["name", "language", "business", "goal", "tools", "constraints", "decisions", "pending", "nextStep"] as const;
export type MemoryField = typeof MEMORY_FIELDS[number];
export type MemoryFact = { value: string; source: "visitor_message" | "visitor_edit"; updatedAt: string; sourceRef?: string };
export type MemoryProject = { id: string; title: string; facts: Partial<Record<MemoryField, MemoryFact>> };
export type VisitorSnapshot = {
  csrfToken: string;
  protection?: { siteKey: string };
  registrationRequired?: boolean;
  profile?: { name: string; hasWhatsApp: boolean; leadId: string; intent?: "nora_demo" | "assistant_project" };
  tier: "anonymous" | "registered";
  quota: { limit: number; used: number; remaining: number; resetsAt: string };
  memory: { enabled: boolean; linked?: boolean; expiresAt: string | null; activeProjectId: string | null; projects: MemoryProject[] };
};
export type VisitorAction =
  | { action: "bootstrap" }
  | { action: "consent"; enabled: boolean }
  | { action: "linkMemory" }
  | { action: "restoreMemory"; code: string; consent: true }
  | { action: "save"; projectId: string; title: string; facts: Partial<Record<MemoryField, string>> }
  | { action: "createProject"; title: string }
  | { action: "selectProject"; projectId: string }
  | { action: "forgetProject"; projectId: string }
  | { action: "forgetAll" };
// POST /api/concierge/visitor. Bootstrap requires same-origin + trusted ingress.
// All subsequent mutations require x-nora-csrf. Response is VisitorSnapshot.
// POST /api/concierge additionally requires session cookie + x-nora-csrf.
// Successful contact registration upgrades only that cookie-owned session.

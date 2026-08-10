export const FUNNEL_LEAD_STATUSES = [
  "new",
  "contacted",
  "conversation_started",
  "qualified",
  "proposal_sent",
  "closed_won",
  "closed_lost",
  "not_a_fit",
] as const;

export type FunnelLeadStatus = (typeof FUNNEL_LEAD_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<FunnelLeadStatus, readonly FunnelLeadStatus[]> = {
  new: ["contacted", "not_a_fit"],
  contacted: ["conversation_started", "closed_lost", "not_a_fit"],
  conversation_started: ["qualified", "closed_lost", "not_a_fit"],
  qualified: ["proposal_sent", "closed_lost", "not_a_fit"],
  proposal_sent: ["closed_won", "closed_lost", "not_a_fit"],
  closed_won: [],
  closed_lost: [],
  not_a_fit: [],
};

export function isAllowedLeadTransition(from: FunnelLeadStatus, to: FunnelLeadStatus) {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertAllowedLeadTransition(from: FunnelLeadStatus, to: FunnelLeadStatus) {
  if (!isAllowedLeadTransition(from, to)) {
    throw new Error(`Invalid lead transition: ${from} -> ${to}`);
  }
}

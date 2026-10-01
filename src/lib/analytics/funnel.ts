import type { AnalyticsEventInput } from "./schema";

export const NORA_FUNNEL_EVENTS = [
  "nora-open",
  "nora-conversation-response",
  "nora-contact-form-open",
  "nora-lead-saved",
  "nora-lead-delivered",
] as const;

export type NoraFunnelEvent = (typeof NORA_FUNNEL_EVENTS)[number];
export type AnalyticsBasePayload = Omit<AnalyticsEventInput, "event">;

export function safeAnalyticsDestinationPath(channel: AnalyticsEventInput["channel"], pathname: string) {
  if (channel === "whatsapp" || !pathname.startsWith("/")) return undefined;
  return pathname.slice(0, 256);
}

export function isAcceptedLeadReceipt(consent: boolean, receipt: { saved?: unknown } | null) {
  return consent && receipt?.saved === true;
}

export function isConfirmedDeliveryReceipt(notification: unknown) {
  return notification === "sent";
}

export function isAnalyticsExcluded(search: string, previous = false) {
  const flag = new URLSearchParams(search).get("analytics_exclude");
  if (flag === "1") return true;
  if (flag === "0") return false;
  return previous;
}

export function noraEventPayload(
  event: NoraFunnelEvent,
  base: AnalyticsBasePayload,
): AnalyticsEventInput {
  return { event, ...base };
}

export function dispatchNoraAnalyticsSignal(
  target: EventTarget,
  seen: Set<string>,
  key: string,
  event: NoraFunnelEvent,
) {
  if (seen.has(key)) return false;
  seen.add(key);
  target.dispatchEvent(new CustomEvent("portfolio:nora-analytics", { detail: { event, key } }));
  return true;
}

export function isNoraFunnelEvent(value: unknown): value is NoraFunnelEvent {
  return typeof value === "string" && (NORA_FUNNEL_EVENTS as readonly string[]).includes(value);
}

export function handleNoraAnalyticsSignal(
  detail: unknown,
  seen: Set<string>,
  send: (payload: AnalyticsEventInput) => void,
  base: AnalyticsBasePayload,
) {
  if (!detail || typeof detail !== "object") return false;
  const signal = detail as { event?: unknown; key?: unknown };
  if (!isNoraFunnelEvent(signal.event) || typeof signal.key !== "string" || !signal.key) return false;
  return emitNoraEventOnce(seen, signal.key, signal.event, send, base);
}

/** The key stays in component memory; it is never part of the analytics payload. */
export function emitNoraEventOnce(
  seen: Set<string>,
  key: string,
  event: NoraFunnelEvent,
  send: (payload: AnalyticsEventInput) => void,
  base: AnalyticsBasePayload,
) {
  if (seen.has(key)) return false;
  seen.add(key);
  send(noraEventPayload(event, base));
  return true;
}

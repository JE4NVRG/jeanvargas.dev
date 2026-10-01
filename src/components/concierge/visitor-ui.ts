import type { VisitorSnapshot } from "../../lib/concierge/visitor-contract";

export type ConversationEntry = { role: "user" | "assistant"; content: string };
export function visitorHistoryWindow<T extends ConversationEntry>(messages: readonly T[], maxEntries = 11): T[] {
  const window = messages.slice(-maxEntries);
  // Preserve alternating complete turns while bounding UTF-8 request bytes,
  // including long model replies and non-Latin visitor messages.
  const encoder = new TextEncoder();
  while (window.length > 1 && encoder.encode(JSON.stringify({locale:"pt",messages:window})).byteLength > 14_000) window.splice(0,2);
  return window;
}
export function visitorTurnsRemaining(snapshot: Pick<VisitorSnapshot, "quota"> | null): number | null {
  return snapshot ? Math.max(0, snapshot.quota.remaining) : null;
}

export function visitorRequestPayload(locale: "pt" | "en", messages: readonly ConversationEntry[], briefContext?: Record<string, string>) {
  const payload = { locale, messages: visitorHistoryWindow(messages), ...(briefContext ? { briefContext } : {}) };
  const size = () => new TextEncoder().encode(JSON.stringify(payload)).byteLength;
  while (payload.messages.length > 1 && size() > 16_000) payload.messages.splice(0, 2);
  // Preserve the latest visitor message even with a pathological prior brief.
  if (size() > 16_000) delete payload.briefContext;
  return payload;
}

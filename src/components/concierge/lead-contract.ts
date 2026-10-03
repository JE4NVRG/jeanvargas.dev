export type LeadContactType = "email" | "whatsapp";
export type LeadRequestBody = {
  requestId: string;
  locale: "pt" | "en";
  name: string;
  contactType: LeadContactType;
  contact: string;
  alternateContact?: string;
  summary: string;
  sourcePath: string;
  consent: true;
  intent?: "nora_demo" | "assistant_project";
};
export type SavedContactRequestBody = {
  requestId: string;
  locale: "pt" | "en";
  summary: string;
  sourcePath: string;
  consent: true;
  useSavedContact: true;
  registeredContactId: string;
};
export type LeadAttemptBody = LeadRequestBody | SavedContactRequestBody;
export type LeadReceipt = { leadId: string; saved: true; notification: "pending" | "sent" | "unconfirmed" };

export function mayReleaseLeadAttempt(status: number, retrying: boolean): boolean {
  return !retrying && status >= 400 && status < 500 && status !== 409;
}

export function parseLeadReceipt(payload: unknown): LeadReceipt | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  if (data.saved !== true || typeof data.leadId !== "string" || !data.leadId || (data.notification !== "pending" && data.notification !== "sent" && data.notification !== "unconfirmed")) return null;
  return { leadId: data.leadId, saved: true, notification: data.notification };
}

export function cleanLeadContact(type: LeadContactType, value: string): string {
  return type === "email" ? value.trim() : value.trim().replace(/[()\s.-]/g, "");
}

export function isValidLeadContact(type: LeadContactType, value: string): boolean {
  const clean = cleanLeadContact(type, value);
  return type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) : /^\+[1-9]\d{7,14}$/.test(clean);
}

export function leadRequestBody(input: Omit<LeadRequestBody, "requestId">): LeadRequestBody {
  return {
    requestId: crypto.randomUUID(), locale: input.locale, name: input.name.trim().slice(0, 100),
    contactType: input.contactType, contact: cleanLeadContact(input.contactType, input.contact), summary: input.summary.trim().slice(0, 1500),
    sourcePath: input.sourcePath.split(/[?#]/, 1)[0].slice(0, 256), consent: true,
    ...(input.alternateContact?.trim() ? { alternateContact: cleanLeadContact(input.contactType === "email" ? "whatsapp" : "email", input.alternateContact) } : {}),
    ...(input.intent ? { intent: input.intent } : {}),
  };
}


// Whitelist the callback fields; canonical contact stays on the server.
export function savedContactRequestBody(input: Omit<SavedContactRequestBody, "requestId" | "useSavedContact">): SavedContactRequestBody {
  return {
    requestId: crypto.randomUUID(), locale: input.locale,
    summary: input.summary.trim().slice(0, 1500),
    sourcePath: input.sourcePath.split(/[?#]/, 1)[0].slice(0, 256),
    consent: true, useSavedContact: true, registeredContactId: input.registeredContactId,
  };
}

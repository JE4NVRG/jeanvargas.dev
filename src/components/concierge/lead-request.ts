export type LeadContactType = "email" | "whatsapp";
export type LeadRequestBody = {
  requestId: string;
  locale: "pt" | "en";
  name: string;
  contactType: LeadContactType;
  contact: string;
  summary: string;
  sourcePath: string;
  consent: true;
};

export type LeadReceipt = { leadId: string; saved: true; notification: "pending" | "sent" };

export function parseLeadReceipt(payload: unknown): LeadReceipt | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  if (data.saved !== true || typeof data.leadId !== "string" || !data.leadId || (data.notification !== "pending" && data.notification !== "sent")) return null;
  return { leadId: data.leadId, saved: true, notification: data.notification };
}

export function isValidLeadContact(type: LeadContactType, value: string): boolean {
  const clean = value.trim();
  return type === "email"
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)
    : /^\+[1-9]\d{7,14}$/.test(clean);
}

export function leadRequestBody(input: Omit<LeadRequestBody, "requestId">): LeadRequestBody {
  const pathname = input.sourcePath.split(/[?#]/, 1)[0].slice(0, 256);
  return {
    requestId: crypto.randomUUID(),
    locale: input.locale,
    name: input.name.trim().slice(0, 100),
    contactType: input.contactType,
    contact: input.contact.trim(),
    summary: input.summary.trim().slice(0, 1500),
    sourcePath: pathname,
    consent: true,
  };
}

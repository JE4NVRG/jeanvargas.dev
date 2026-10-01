import assert from "node:assert/strict";
import test from "node:test";
import { conciergeCopy, conciergeErrorKind, leadCopy } from "../components/concierge/copy";
import { isValidLeadContact, leadRequestBody, parseLeadReceipt, mayReleaseLeadAttempt } from "../components/concierge/lead-contract";

test("uncertain retries preserve the operation after a conflict or other rejection", () => {
  for (const status of [400, 403, 409, 429, 503]) assert.equal(mayReleaseLeadAttempt(status, true), false);
  assert.equal(mayReleaseLeadAttempt(409, false), false);
  assert.equal(mayReleaseLeadAttempt(400, false), true);
  assert.equal(mayReleaseLeadAttempt(503, false), false);
  assert.equal(parseLeadReceipt({ leadId: "test", saved: true, notification: "unconfirmed" })?.notification, "unconfirmed");
  assert.match(leadCopy.pt.unconfirmed, /não foi possível confirmar/);
  assert.match(leadCopy.en.unconfirmed, /couldn't confirm/);
});

test("Nora is identified as an AI assistant in both locales", () => {
  assert.match(conciergeCopy.pt.ai, /Nora.*IA/);
  assert.match(conciergeCopy.en.ai, /Nora.*AI/);
  assert.match(conciergeCopy.pt.intro, /sou Nora/);
  assert.match(conciergeCopy.en.intro, /I'm Nora/);
  assert.match(conciergeCopy.pt.open, /Nora/);
  assert.match(conciergeCopy.en.open, /Nora/);
});

test("privacy and human handoff copy never implies automatic WhatsApp sending", () => {
  assert.match(conciergeCopy.pt.privacy, /Nada é enviado ao WhatsApp automaticamente/);
  assert.match(conciergeCopy.en.privacy, /Nothing is sent to WhatsApp automatically/);
  assert.match(conciergeCopy.pt.handoff, /WhatsApp/);
  assert.match(conciergeCopy.en.handoff, /WhatsApp/);
});

test("lead request body matches the strict consented API contract", () => {
  const body = leadRequestBody({ locale: "en", name: "  Jo  ", contactType: "email", contact: " jo@example.com ", summary: "I need a portfolio site", sourcePath: "/en/work?utm_source=private#contact", consent: true });
  assert.deepEqual(Object.keys(body).sort(), ["consent", "contact", "contactType", "locale", "name", "requestId", "sourcePath", "summary"].sort());
  assert.match(body.requestId, /^[0-9a-f-]{36}$/i);
  assert.equal(body.name, "Jo");
  assert.equal(body.contact, "jo@example.com");
  assert.equal(body.sourcePath, "/en/work");
  assert.equal(body.consent, true);
  const longPath = leadRequestBody({ locale: "pt", name: "N", contactType: "whatsapp", contact: "+5511999999999", summary: "Pelo menos dez", sourcePath: `/pt/${"a".repeat(300)}`, consent: true });
  assert.equal(longPath.sourcePath.length, 256);
});

test("consented lead capture localizes and distinguishes saved-pending from notified", () => {
  assert.match(leadCopy.pt.title, /Pedir retorno/);
  assert.match(leadCopy.en.title, /Request a reply/);
  assert.match(leadCopy.pt.consent, /Autorizo.*Google Sheets.*Telegram/);
  assert.match(leadCopy.en.consent, /I authorize.*Google Sheets.*Telegram/);
  assert.match(leadCopy.pt.pending, /notificação está pendente/);
  assert.match(leadCopy.en.pending, /notification is pending/);
  assert.match(leadCopy.pt.sent, /notificação foi enviada/);
  assert.match(leadCopy.en.sent, /notification was sent/);
  assert.match(leadCopy.en.retrySame, /same details/);
  assert.deepEqual(parseLeadReceipt({ leadId: "abc-123", saved: true, notification: "pending" }), { leadId: "abc-123", saved: true, notification: "pending" });
  assert.deepEqual(parseLeadReceipt({ leadId: "abc-456", saved: true, notification: "sent" }), { leadId: "abc-456", saved: true, notification: "sent" });
  assert.equal(parseLeadReceipt({ leadId: "abc", saved: false, notification: "sent" }), null);
  assert.equal(parseLeadReceipt({ leadId: "abc", saved: true, notification: "unknown" }), null);
  assert.equal(parseLeadReceipt({ error: "invalid" }), null);
});

test("contact selection validates email and international WhatsApp formats", () => {
  assert.equal(isValidLeadContact("email", "visitor@example.com"), true);
  assert.equal(isValidLeadContact("email", "not-an-email"), false);
  assert.equal(isValidLeadContact("whatsapp", "+14155552671"), true);
  assert.equal(isValidLeadContact("whatsapp", "4155552671"), false);
});

test("service failures have distinct recovery guidance", () => {
  assert.equal(conciergeErrorKind("rate_limited"), "rate_limited");
  assert.equal(conciergeErrorKind("busy"), "busy");
  assert.equal(conciergeErrorKind("temporarily_unavailable"), "busy");
  assert.equal(conciergeErrorKind("upstream_unavailable"), "upstream");
  assert.equal(conciergeErrorKind("unexpected"), "unknown");
  assert.match(conciergeCopy.pt.rateLimited, /WhatsApp/);
  assert.match(conciergeCopy.pt.busy, /preservado/);
  assert.match(conciergeCopy.pt.upstream, /mais tarde/);
  assert.match(conciergeCopy.pt.limit, /não redefine limites/);
  assert.match(conciergeCopy.en.limit, /does not reset service limits/);
});

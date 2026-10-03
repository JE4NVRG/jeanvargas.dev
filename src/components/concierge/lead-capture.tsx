"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, X } from "lucide-react";
import { leadCopy } from "./copy";
import { leadReference } from "@/lib/leads/reference";
import { dispatchNoraAnalyticsSignal, isAcceptedLeadReceipt, isConfirmedDeliveryReceipt } from "@/lib/analytics/funnel";
import styles from "./lead-capture.module.css";

import type { VisitorSnapshot } from "@/lib/concierge/visitor-contract";
import { isValidLeadContact, leadRequestBody, savedContactRequestBody, parseLeadReceipt, mayReleaseLeadAttempt, type LeadContactType, type LeadAttemptBody, type LeadReceipt } from "./lead-contract";
export * from "./lead-contract";

type Locale = "pt" | "en";

export function LeadCapture({ locale, registeredProfile, initialSummary, onSummaryChange, onLockChange, csrfToken, verificationToken, onVerificationUsed, onSaved, onRegistrationChanged, onClose }: { locale: Locale; registeredProfile?: VisitorSnapshot["profile"]; initialSummary: string; onSummaryChange: (summary: string) => void; onLockChange: (locked: boolean) => void; csrfToken?: string; verificationToken?:string; onVerificationUsed?:()=>void; onSaved?: (leadId: string) => void; onRegistrationChanged?: () => Promise<void>; onClose: () => void }) {
  const t = leadCopy[locale];
  const [name, setName] = useState<string | undefined>(undefined);
  const [useOtherContact, setUseOtherContact] = useState(false);
  const leadName = name ?? registeredProfile?.name ?? "";
  const [contactType, setContactType] = useState<LeadContactType>("email");
  const [contact, setContact] = useState("");
  const [alternateContact, setAlternateContact] = useState("");

  const [consent, setConsent] = useState(false);
  const [attempt, setAttempt] = useState<LeadAttemptBody | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<LeadReceipt | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const receiptInput = useRef<HTMLInputElement>(null);
  async function copyReceipt() {
    if (!receipt) return;
    try { await navigator.clipboard.writeText(receipt.leadId); setCopyStatus("copied"); }
    catch { setCopyStatus("failed"); receiptInput.current?.focus(); receiptInput.current?.select(); }
  }
  const inFlight = useRef(false);
  const analyticsSignals = useRef(new Set<string>());
  const trackReceipt = (event: "nora-lead-saved" | "nora-lead-delivered", requestId: string) => {
    dispatchNoraAnalyticsSignal(document, analyticsSignals.current, `${event}:${requestId}`, event);
  };
  const summary = attempt?.summary ?? initialSummary;
  // A retry keeps its original mode and body even if bootstrap refreshes the profile.
  const usingSavedContact = attempt ? "useSavedContact" in attempt : !!registeredProfile?.hasWhatsApp && !useOtherContact;
  const savedContactExplanation = locale === "pt" ? "Usaremos o WhatsApp cadastrado na entrada. Revise o resumo e autorize o retorno." : "We'll use the WhatsApp registered at the start. Review the summary and authorize a reply.";
  const savedContactConsent = locale === "pt" ? "Autorizo a JE4NDEV a usar meu WhatsApp cadastrado e este resumo para retornar sobre meu pedido." : "I authorize JE4NDEV to use my registered WhatsApp and this summary to follow up on my request.";
  useEffect(() => { onLockChange(busy || (!!attempt && receipt?.notification !== "sent")); }, [attempt, busy, receipt, onLockChange]);

  async function save() {
    if (inFlight.current || receipt) return;
    let body = attempt;
    if (!body) {
      if (!consent || summary.trim().length < 10 || summary.trim().length > 1_500 || (!usingSavedContact && (!leadName.trim() || !isValidLeadContact(contactType, contact) || (alternateContact.trim() && !isValidLeadContact(contactType === "email" ? "whatsapp" : "email", alternateContact))))) {
        setError(usingSavedContact ? (locale === "pt" ? "Revise o resumo (entre 10 e 1.500 caracteres) e autorize o retorno." : "Review the summary (10 to 1,500 characters) and authorize a reply.") : t.validation);
        return;
      }
      body = usingSavedContact
        ? savedContactRequestBody({registeredContactId: registeredProfile!.leadId, locale, summary, sourcePath: window.location.pathname, consent: true })
        : leadRequestBody({ locale, name: leadName, contactType, contact, ...(alternateContact.trim() ? {alternateContact} : {}), summary, sourcePath: window.location.pathname, consent: true });
      if (new TextEncoder().encode(JSON.stringify(body)).byteLength > 8192) { setError(locale === "pt" ? "O resumo é muito grande para enviar. Reduza o texto e tente novamente." : "The summary is too large to send. Shorten it and try again."); return; }
      setAttempt(body);
      onSummaryChange(body.summary);
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json", ...(csrfToken ? { "x-nora-csrf": csrfToken } : {}), ...(verificationToken ? {"x-nora-turnstile":verificationToken}: {}) }, credentials: "same-origin", body: JSON.stringify(body), signal: AbortSignal.timeout(15_000) });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        if(response.status===409 && payload && typeof payload === "object" && "error" in payload && payload.error === "registration_changed") {
          setAttempt(null);setConsent(false);onLockChange(false);
          setError(locale === "pt" ? "Seu cadastro mudou em outra aba. Atualizamos o contato: revise o nome e o resumo e autorize novamente. Nenhum pedido foi enviado por esta tentativa." : "Your registration changed in another tab. We refreshed the contact: review the name and summary and authorize again. This attempt did not send a request.");
          try{await onRegistrationChanged?.();}catch{setError(locale === "pt" ? "Não conseguimos atualizar seu cadastro. Seu resumo foi preservado; reabra o site antes de autorizar o retorno." : "We could not refresh your registration. Your summary was preserved; reopen the site before authorizing a callback.");}
          return;
        }
        if (mayReleaseLeadAttempt(response.status, !!attempt)) { setAttempt(null); setError(t.saveError); return; }
        if (response.status === 409) { setError(t.conflict); return; }
        throw new Error(t.saveError);
      }
      const receipt = parseLeadReceipt(payload);
      if (!receipt) throw new Error(t.saveError);
      setReceipt(receipt);
      if (isAcceptedLeadReceipt(consent, receipt)) trackReceipt("nora-lead-saved", body.requestId);
      try { onSaved?.(receipt.leadId); } catch { /* a saved lead must not become a failed submission */ }
    } catch {
      setError(t.retrySame);
    } finally {
      onVerificationUsed?.();
      inFlight.current = false;
      setBusy(false);
    }
  }

  useEffect(() => {
    if (receipt?.notification !== "pending" || !attempt) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>, checks = 0;
    const check = async () => {
      checks++;
      try {
        const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json", ...(csrfToken ? { "x-nora-csrf": csrfToken } : {}) }, credentials: "same-origin", body: JSON.stringify(attempt), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]) });
        const next = response.ok ? parseLeadReceipt(await response.json()) : null;
        if (!controller.signal.aborted && next?.leadId === receipt.leadId && next.notification !== "pending") { setReceipt(next); return; }
      } catch { /* A status check never changes the saved receipt into a failed submission. */ }
      if (!controller.signal.aborted && checks < 6) timer = setTimeout(() => void check(), 15_000);
    };
    timer = setTimeout(() => void check(), 15_000);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [receipt, attempt, csrfToken]);

  useEffect(() => {
    if (isConfirmedDeliveryReceipt(receipt?.notification) && attempt) {
      trackReceipt("nora-lead-delivered", attempt.requestId);
    }
  }, [receipt, attempt]);

  const locked = !!attempt || busy;
  return <section aria-labelledby="lead-title" className={styles.panel}>
    <div className={styles.header}>
      <div><h3 id="lead-title" tabIndex={-1} className={styles.title}>{t.title}</h3><p className={styles.explain}>{receipt ? t.savedExplanation : usingSavedContact ? savedContactExplanation : t.explain}</p></div>
      <button type="button" aria-label={t.close} onClick={onClose} className={styles.close}><X size={18}/></button>
    </div>
    {receipt ? <div role="status" className={styles.receipt}>
      <p>{receipt.notification === "sent" ? t.sent : receipt.notification === "unconfirmed" ? t.unconfirmed : t.pending}</p>
      <p data-lead-reference><strong>{leadReference(receipt.leadId)}</strong></p>
      <label className={styles.field}>{t.fullReceipt}<input ref={receiptInput} data-lead-receipt readOnly value={receipt.leadId} onFocus={event => event.currentTarget.select()} className={styles.control}/></label>
      <button type="button" data-copy-receipt className={styles.submit} onClick={() => void copyReceipt()}>{copyStatus === "copied" ? t.copiedReceipt : t.copyReceipt}</button>
      {copyStatus === "failed" && <p role="alert" className={styles.error}>{t.copyFailed}</p>}
    </div> : <div className={styles.fields}>
      {usingSavedContact ? <div data-saved-contact>
        <p className={styles.field}>{locale === "pt" ? "Nome cadastrado" : "Registered name"}<strong style={{overflowWrap:"anywhere"}}>{registeredProfile?.name}</strong></p>
        <button type="button" disabled={locked} className={styles.control} onClick={() => {setUseOtherContact(true);setConsent(false);setError("");}}>{locale === "pt" ? "Usar outro contato" : "Use another contact"}</button>
      </div> : <>
      {registeredProfile?.hasWhatsApp && <button type="button" disabled={locked} className={styles.control} onClick={() => {setUseOtherContact(false);setConsent(false);setError("");}}>{locale === "pt" ? "Usar o WhatsApp cadastrado" : "Use registered WhatsApp"}</button>}
      <label className={styles.field}>{t.name}<input autoComplete="name" maxLength={100} value={leadName} disabled={locked} onChange={e => setName(e.target.value)} className={styles.control}/></label>
      <fieldset disabled={locked} className={styles.methods}><legend>{t.contactMethod}</legend>
        <label className={styles.method}><input type="radio" name="lead-contact-type" checked={contactType === "email"} onChange={() => { setContactType("email"); setContact(alternateContact); setAlternateContact(contact); }}/><Mail size={16}/>{t.email}</label>
        <label className={styles.method}><input type="radio" name="lead-contact-type" checked={contactType === "whatsapp"} onChange={() => { setContactType("whatsapp"); setContact(alternateContact); setAlternateContact(contact); }}/><Phone size={16}/>{t.whatsapp}</label>
      </fieldset>
      <label className={styles.field}>{contactType === "email" ? t.emailAddress : t.whatsappNumber}<input autoComplete={contactType === "email" ? "email" : "tel"} type={contactType === "email" ? "email" : "tel"} maxLength={254} value={contact} disabled={locked} onChange={e => setContact(e.target.value)} className={styles.control}/></label>
      <label className={styles.field}>{contactType === "email" ? t.alternatePhone : t.alternateEmail}<input data-lead-alternate autoComplete={contactType === "email" ? "tel" : "email"} type={contactType === "email" ? "tel" : "email"} placeholder={contactType === "email" ? (locale === "pt" ? "+55 11 91234-5678" : "+ country code and phone number") : (locale === "pt" ? "nome@exemplo.com" : "you@example.com")} maxLength={254} value={alternateContact} disabled={locked} onChange={e => setAlternateContact(e.target.value)} className={styles.control}/><span>{t.alternateHelp}</span></label>
      </>}
      <label className={styles.field}>{t.summary}<textarea minLength={10} maxLength={1500} rows={4} value={summary} disabled={locked} onChange={e => onSummaryChange(e.target.value)} className={`${styles.control} ${styles.summary}`}/><span className={styles.counter}>{summary.length}/1500</span></label>
      <label className={styles.consent}><input type="checkbox" checked={consent} disabled={locked} onChange={e => setConsent(e.target.checked)}/><span>{usingSavedContact ? savedContactConsent : t.consent}</span></label>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button type="button" disabled={busy || !consent} onClick={() => void save()} className={styles.submit}>{busy ? t.saving : attempt ? t.retryButton : t.send}</button>
    </div>}
  </section>;
}

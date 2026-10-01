"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, Check, LockKeyhole, Mail } from "lucide-react";
import { contactEmailHref } from "@/lib/contact-email";
import { cleanLeadContact, isValidLeadContact, leadRequestBody, mayReleaseLeadAttempt, parseLeadReceipt, type LeadReceipt, type LeadRequestBody } from "./lead-contract";
import styles from "./nora-welcome.module.css";

type Intent = "nora_demo" | "assistant_project";
type WelcomeAttempt = LeadRequestBody & { intent: Intent };
type NoraWelcomeProps = {
  locale: "pt" | "en";
  csrfToken: string;
  verificationToken: string;
  verificationRequired: boolean;
  onVerificationUsed: () => void;
  onRegistered: (leadId: string) => Promise<void>;
};

const copy = {
  pt: {
    eyebrow: "Nora · IA do estúdio JE4NDEV",
    title: "Conheça a Nora",
    intro: "Experimente uma conversa ou explore um assistente para seu site ou app, na sua rotina pessoal ou na sua empresa.",
    choose: "O que traz você aqui?",
    demo: "Quero testar a Nora",
    demoDetail: "Conhecer o atendimento e explorar ideias, sem compromisso de contratar.",
    project: "Quero um assistente para meu projeto",
    projectDetail: "Conversar sobre uma necessidade pessoal, profissional ou da minha empresa.",
    name: "Como podemos chamar você?",
    namePlaceholder: "Seu nome",
    country: "País / DDI",
    countryPlaceholder: "+55",
    whatsapp: "Seu WhatsApp",
    phonePlaceholder: "DDD + número",
    phoneHelp: "Informe o DDI do país. Você também pode colar o número completo começando com +.",
    consent: "Autorizo registrar meu nome, WhatsApp e um resumo desta conversa para atendimento pela JE4NDEV.",
    privacy: "O contato e o resumo ficam no servidor e na planilha privada da equipe no Google Sheets. O cadastro pode gerar um aviso no Telegram privado da equipe. O cadastro não ativa marketing nem a memória opcional; testar não é pedir orçamento.",
    start: "Iniciar conversa",
    saving: "Confirmando cadastro…",
    retry: "Tentar novamente",
    open: "Abrir conversa",
    opening: "Abrindo conversa…",
    validation: "Informe seu nome, um WhatsApp com DDI válido e autorize o cadastro para continuar.",
    verification: "Conclua a verificação de acesso para iniciar a conversa.",
    waitingVerification: "A verificação de acesso precisa estar concluída antes de enviar.",
    retrySame: "Não conseguimos confirmar esta tentativa. Seus dados estão preservados; tente novamente para verificar o mesmo cadastro.",
    rejected: "O cadastro não foi aceito. Confira seus dados e tente novamente.",
    conflict: "Esta tentativa não pôde ser confirmada. Tente novamente com os mesmos dados; não crie outro cadastro.",
    unavailable: "Seu cadastro foi salvo, mas o acesso à conversa ainda não foi confirmado. Tente novamente para concluir o mesmo cadastro.",
    confirmed: "Cadastro confirmado. Vamos abrir sua conversa com a Nora.",
    refresh: "Seu cadastro está confirmado. Não conseguimos abrir a conversa agora; tente abrir novamente sem reenviar seus dados.",
    frozen: "Estamos confirmando esta tentativa. Seus dados ficam preservados para evitar cadastros duplicados.",
    demoSummary: "Cadastro para experimentar o atendimento da Nora e explorar ideias, sem pedido de orçamento ou contratação.",
    projectSummary: "Cadastro para conversar com a Nora sobre um assistente de IA para um projeto pessoal, profissional, site ou app.",
  },
  en: {
    eyebrow: "Nora · AI from JE4NDEV studio",
    title: "Meet Nora",
    intro: "Try a conversation or explore an assistant for your website or app, personal routine or business.",
    choose: "What brings you here?",
    demo: "I'd like to try Nora",
    demoDetail: "Explore the conversation and ideas, with no commitment to hire.",
    project: "I'd like an assistant for my project",
    projectDetail: "Discuss a personal, professional or business need.",
    name: "What should we call you?",
    namePlaceholder: "Your name",
    country: "Country code",
    countryPlaceholder: "+",
    whatsapp: "Your WhatsApp",
    phonePlaceholder: "Area code + number",
    phoneHelp: "Enter your country code. You can also paste the full international number starting with +.",
    consent: "I agree to register my name, WhatsApp and a summary of this conversation for JE4NDEV support.",
    privacy: "Your contact and summary are stored on the server and the team's private Google Sheets. Registration may also notify the team on its private Telegram. Registration does not enable marketing or optional memory; trying Nora is not a quote request.",
    start: "Start conversation",
    saving: "Confirming registration…",
    retry: "Try again",
    open: "Open conversation",
    opening: "Opening conversation…",
    validation: "Enter your name, a valid WhatsApp with country code and agree to registration to continue.",
    verification: "Complete access verification to start the conversation.",
    waitingVerification: "Access verification must be complete before submitting.",
    retrySame: "We couldn't confirm this attempt. Your details are preserved; try again to check the same registration.",
    rejected: "Registration was not accepted. Check your details and try again.",
    conflict: "This attempt could not be confirmed. Retry with the same details; do not create another registration.",
    unavailable: "Your registration was saved, but access to the conversation is not yet confirmed. Retry to complete the same registration.",
    confirmed: "Registration confirmed. Let's open your conversation with Nora.",
    refresh: "Your registration is confirmed. We couldn't open the conversation right now; try opening it again without resubmitting your details.",
    frozen: "We're confirming this attempt. Your details are preserved to avoid duplicate registrations.",
    demoSummary: "Registration to try Nora's conversation and explore ideas, without a quote request or hiring agreement.",
    projectSummary: "Registration to discuss an AI assistant with Nora for a personal or professional project, website or app.",
  },
};

export function NoraWelcome({ locale, csrfToken, verificationToken, verificationRequired, onVerificationUsed, onRegistered }: NoraWelcomeProps) {
  const t = copy[locale], id = useId();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState(locale === "pt" ? "+55" : "");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState<Intent>("nora_demo");
  const [consent, setConsent] = useState(false);
  const [attempt, setAttempt] = useState<WelcomeAttempt | null>(null);
  const [confirmed, setConfirmed] = useState<LeadReceipt | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const pending = useRef<WelcomeAttempt | null>(null);
  const saved = useRef<LeadReceipt | null>(null), registered = useRef<LeadReceipt | null>(null);
  const inFlight = useRef(false);
  const nameInput = useRef<HTMLInputElement>(null), phoneInput = useRef<HTMLInputElement>(null);

  async function openConversation(receipt: LeadReceipt) {
    try { await onRegistered(receipt.leadId); }
    catch { setError(t.refresh); }
  }

  async function submit() {
    if (inFlight.current) return;
    if (registered.current) {
      inFlight.current = true; setBusy(true); setError("");
      try { await openConversation(registered.current); }
      finally { inFlight.current = false; setBusy(false); }
      return;
    }
    if (!csrfToken || (verificationRequired && !verificationToken)) { setError(t.verification); return; }
    const retrying = !!pending.current;
    let body = pending.current;
    if (!body) {
      const fullInternationalNumber = phone.trim().startsWith("+");
      const prefix = cleanLeadContact("whatsapp", countryCode.trim().startsWith("+") ? countryCode : `+${countryCode.trim()}`);
      const contact = cleanLeadContact("whatsapp", fullInternationalNumber ? phone : `${prefix}${phone}`);
      if (!name.trim() || name.trim().length > 100 || !consent || (!fullInternationalNumber && !/^\+[1-9]\d{0,2}$/.test(prefix)) || !isValidLeadContact("whatsapp", contact)) {
        setError(t.validation);
        if (!name.trim()) nameInput.current?.focus(); else phoneInput.current?.focus();
        return;
      }
      body = {
        ...leadRequestBody({ locale, name, contactType: "whatsapp", contact, summary: intent === "nora_demo" ? t.demoSummary : t.projectSummary, sourcePath: window.location.pathname, consent: true }),
        intent,
      };
      pending.current = body; setAttempt(body);
    }
    inFlight.current = true; setBusy(true); setError("");
    let fetchAttempted = false;
    try {
      fetchAttempted = true;
      const response = await fetch("/api/leads", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "content-type": "application/json", "x-nora-csrf": csrfToken, ...(verificationToken ? { "x-nora-turnstile": verificationToken } : {}) },
        body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        if (!saved.current && mayReleaseLeadAttempt(response.status, retrying)) { pending.current = null; setAttempt(null); setError(t.rejected); }
        else setError(response.status === 409 ? t.conflict : t.retrySame);
        return;
      }
      const receipt = parseLeadReceipt(payload);
      if (!receipt || (saved.current && saved.current.leadId !== receipt.leadId)) throw new Error("registration not confirmed");
      saved.current = receipt;
      const registration = (payload as Record<string, unknown>).registration;
      if (registration !== "upgraded") { setError(t.unavailable); return; }
      // Confirm before refreshing the parent: a refresh failure must never resubmit a saved registration.
      registered.current = receipt; setConfirmed(receipt);
      await openConversation(receipt);
    } catch { setError(t.retrySame); }
    finally {
      inFlight.current = false; setBusy(false);
      if (fetchAttempted) onVerificationUsed();
    }
  }

  const locked = !!attempt || busy || !!confirmed;
  const waitingVerification = !confirmed && verificationRequired && !verificationToken;
  const buttonLabel = busy ? (confirmed ? t.opening : t.saving) : confirmed ? t.open : attempt ? t.retry : t.start;

  return <section className={styles.panel} aria-labelledby={`${id}-title`} data-nora-welcome>
    <header className={styles.header}>
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <h3 id={`${id}-title`} className={styles.title}>{t.title}</h3>
      <p className={styles.intro}>{t.intro}</p>
      <a className={styles.email} href={contactEmailHref(locale, "Nora")} data-analytics-event="lead-cta-click" data-cta="nora-welcome-email"><Mail size={15} aria-hidden="true"/>{locale === "pt" ? "Prefere conversar por e-mail?" : "Prefer to discuss your project by email?"}<ArrowUpRight size={14} aria-hidden="true"/></a>
    </header>
    <form className={styles.form} noValidate onSubmit={event => { event.preventDefault(); void submit(); }} aria-busy={busy}>
      <fieldset className={styles.intents} disabled={locked}>
        <legend>{t.choose}</legend>
        {(["nora_demo", "assistant_project"] as const).map(value => <label className={styles.intent} key={value}>
          <input type="radio" name={`${id}-intent`} value={value} checked={intent === value} onChange={() => setIntent(value)}/>
          <span><strong>{value === "nora_demo" ? t.demo : t.project}</strong><small>{value === "nora_demo" ? t.demoDetail : t.projectDetail}</small></span>
        </label>)}
      </fieldset>
      <label className={styles.field} htmlFor={`${id}-name`}>
        {t.name}
        <input ref={nameInput} id={`${id}-name`} autoComplete="given-name" maxLength={100} value={name} disabled={locked} onChange={event => setName(event.target.value)} placeholder={t.namePlaceholder} className={styles.control}/>
      </label>
      <div className={styles.phoneFields}>
        <label className={styles.field} htmlFor={`${id}-country`}>
          {t.country}
          <input id={`${id}-country`} type="tel" inputMode="tel" autoComplete="tel-country-code" maxLength={5} value={countryCode} disabled={locked} onChange={event => setCountryCode(event.target.value)} placeholder={t.countryPlaceholder} className={styles.control} aria-describedby={`${id}-phone-help`}/>
        </label>
        <label className={styles.field} htmlFor={`${id}-phone`}>
          {t.whatsapp}
          <input ref={phoneInput} id={`${id}-phone`} type="tel" inputMode="tel" autoComplete="tel-national" maxLength={30} value={phone} disabled={locked} onChange={event => setPhone(event.target.value)} placeholder={t.phonePlaceholder} className={styles.control} aria-describedby={`${id}-phone-help`}/>
        </label>
      </div>
      <p id={`${id}-phone-help`} className={styles.help}>{t.phoneHelp}</p>
      <div className={styles.permission}>
        <label className={styles.consent}><input type="checkbox" checked={consent} disabled={locked} onChange={event => setConsent(event.target.checked)} aria-describedby={`${id}-privacy`}/><span>{t.consent}</span></label>
        <p id={`${id}-privacy`} className={styles.privacy}><LockKeyhole size={14} aria-hidden="true"/><span>{t.privacy}</span></p>
      </div>
      {attempt && !confirmed && <p className={styles.notice}>{t.frozen}</p>}
      {confirmed && <p className={styles.confirmed} role="status"><Check size={17} aria-hidden="true"/>{t.confirmed}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {waitingVerification && <p className={styles.help} role="status">{t.waitingVerification}</p>}
      <button type="submit" className={styles.submit} disabled={busy || waitingVerification || (!confirmed && !csrfToken)} data-cta={attempt || confirmed ? "nora-registration-retry" : "nora-registration-start"}>
        <span>{buttonLabel}</span><ArrowUpRight size={18} aria-hidden="true"/>
      </button>
    </form>
  </section>;
}

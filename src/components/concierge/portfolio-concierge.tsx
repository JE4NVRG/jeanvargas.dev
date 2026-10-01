"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mail, ArrowUp, ArrowUpRight, ChevronRight, RotateCcw, LockKeyhole, UserRound, X } from "lucide-react";
import styles from "./chat.module.css";
import memoryStyles from "./memory.module.css";
import { COMPANY } from "@/data/company";
import { contactEmailHref } from "@/lib/contact-email";
import { leadReference } from "@/lib/leads/reference";
import { CONCIERGE_NAME } from "@/lib/concierge/identity";
import { MEMORY_FIELDS, type MemoryField, type VisitorAction, type VisitorSnapshot } from "@/lib/concierge/visitor-contract";
import { conciergeCopy, conciergeErrorKind, type ConciergeErrorKind } from "./copy";
import type { ConversationBrief } from "@/lib/concierge/concierge";
import { visitorRequestPayload, visitorTurnsRemaining } from "./visitor-ui";
import { LeadCapture } from "./lead-capture";
import { BotVerification } from "./bot-verification";
import { NoraWelcome } from "./nora-welcome";
import { NoraAvatar } from "./nora-avatar";
import { MemoryRecovery } from "./memory-recovery";
import { requestsContact, requestsWhatsApp, declinesContact, contactSummary, reviewedContactSummary } from "./contact-intent";
import { dispatchNoraAnalyticsSignal } from "@/lib/analytics/funnel";
import { containsRecoveryCode } from "@/lib/concierge/recovery-code";

type Locale = "pt" | "en";
type ChatMessage = { role: "user" | "assistant"; content: string };
const isBrief = (value: unknown): value is ConversationBrief => !!value && typeof value === "object" && !Array.isArray(value) && ["goal", "situation", "desiredSolution", "constraints", "openQuestions"].every(key => typeof (value as Record<string, unknown>)[key] === "string" && ((value as Record<string, string>)[key].length <= 500));
const fieldLabels: Record<MemoryField, { pt: string; en: string }> = {
  name: { pt: "Nome preferido", en: "Preferred name" }, language: { pt: "Idioma", en: "Language" }, business: { pt: "Atividade", en: "Business" }, goal: { pt: "Objetivo", en: "Goal" }, tools: { pt: "Ferramentas", en: "Tools" }, constraints: { pt: "Restrições", en: "Constraints" }, decisions: { pt: "Decisões", en: "Decisions" }, pending: { pt: "Questão pendente", en: "Pending question" }, nextStep: { pt: "Próximo passo", en: "Next step" },
};

function MemoryPanel({ active, locale, disabled, onSave }: { active: VisitorSnapshot["memory"]["projects"][number] | null; locale: Locale; disabled: boolean; onSave: (project: NonNullable<VisitorSnapshot["memory"]["projects"][number]>, facts: Partial<Record<MemoryField, string>>) => void }) {
  const [facts, setFacts] = useState<Partial<Record<MemoryField, string>>>(() => Object.fromEntries(MEMORY_FIELDS.map(field => [field, active?.facts[field]?.value || ""])));
  const baseline = useRef<Partial<Record<MemoryField, string>>>(Object.fromEntries(MEMORY_FIELDS.map(field => [field, active?.facts[field]?.value || ""])));
  useEffect(() => {
    if (!active) return;
    const incoming = Object.fromEntries(MEMORY_FIELDS.map(field => [field, active.facts[field]?.value || ""])) as Partial<Record<MemoryField, string>>;
    const previous = baseline.current;
    setFacts(current => Object.fromEntries(MEMORY_FIELDS.map(field => [field, current[field] === previous[field] ? incoming[field] : current[field]])));
    baseline.current = incoming;
  }, [active]);
  if (!active) return null;
  return <div className={memoryStyles.fields}>
    <h4 className={memoryStyles.projectTitle}>{active.title}</h4>
    {MEMORY_FIELDS.map(field => {
      const fact = active.facts[field];
      return <label className={memoryStyles.field} key={field}>{fieldLabels[field][locale]}
        {fact && <small className={memoryStyles.metadata}>{fact.source === "visitor_edit" ? (locale === "pt" ? "Editado" : "Edited") : (locale === "pt" ? "Compartilhado" : "Shared")}: {new Date(fact.updatedAt).toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}</small>}
        <textarea data-memory-field={field} maxLength={500} rows={2} value={facts[field] || ""} disabled={disabled} onChange={e => setFacts(current => ({ ...current, [field]: e.target.value }))}/>
      </label>;
    })}
    <button type="button" data-cta="memory-save" disabled={disabled} onClick={() => onSave(active, Object.fromEntries(MEMORY_FIELDS.map(field => [field, (facts[field] || "").trim()])) as Partial<Record<MemoryField, string>>)}>{locale === "pt" ? "Salvar memória" : "Save memory"}</button>
  </div>;
}

export function PortfolioConcierge({ locale }: { locale: Locale }) {
  const t = conciergeCopy[locale];
  const [open, setOpen] = useState(false), [messages, setMessages] = useState<ChatMessage[]>([]), [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false), [failed, setFailed] = useState(false), [errorKind, setErrorKind] = useState<ConciergeErrorKind>("unknown");
  const [speaking, setSpeaking] = useState(false);
  const speakingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [leadOpen, setLeadOpen] = useState(false), [memoryOpen, setMemoryOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<VisitorSnapshot | null>(null), [sessionError, setSessionError] = useState("");
  const [contextNotice, setContextNotice] = useState("");
  const [verificationToken, setVerificationToken] = useState(""), [verificationAttempt, setVerificationAttempt] = useState(0);
  const globalLimited = useRef(false);
  const [contactDismissed, setContactDismissed] = useState(false), [leadSaved, setLeadSaved] = useState(false);
  const [savedLeadId, setSavedLeadId] = useState("");
  const [offerReady, setOfferReady] = useState(false);
  const offerPresented = useRef(false);
  const [approvedSummary, setApprovedSummary] = useState("");
  const [leadAttemptLocked, setLeadAttemptLocked] = useState(false), [conversationKey, setConversationKey] = useState(0);
  const briefContext = useRef<ConversationBrief | undefined>(undefined), summaryEdited = useRef(false);
  const [memoryError, setMemoryError] = useState(""), [busyMemory, setBusyMemory] = useState(false), [projectTitle, setProjectTitle] = useState("");
  const opener = useRef<HTMLButtonElement>(null), input = useRef<HTMLTextAreaElement>(null), scrollArea = useRef<HTMLDivElement>(null);
  const reading = useRef<{ latest?: ChatMessage; details: boolean; chatTop: number; lastTop: number; follow: boolean }>({ details: false, chatTop: 0, lastTop: 0, follow: true });
  const wasOpen = useRef(false), inFlight = useRef(false), bootstrapping = useRef<Promise<VisitorSnapshot | null> | null>(null);
  const analyticsSignals = useRef(new Set<string>());
  const trackNora = (event: "nora-open" | "nora-conversation-response" | "nora-contact-form-open", key: string) => {
    dispatchNoraAnalyticsSignal(document, analyticsSignals.current, key, event);
  };
  const openLeadForm = () => {
    trackNora("nora-contact-form-open", "contact-form-open");
    setLeadOpen(true); setMemoryOpen(false);
  };
  const remaining = visitorTurnsRemaining(snapshot) ?? 0, limited = !!snapshot && remaining <= 0;
  const needsRegistration = !!snapshot?.registrationRequired && !snapshot.profile?.hasWhatsApp;
  const ui = locale === "pt" ? {
    memory: "Memória", memoryTitle: "Sua memória com Nora", memoryIntro: "Opcional: guarde fatos dos seus projetos por até 30 dias após a última atualização. Você pode retomar neste navegador ou vincular ao WhatsApp cadastrado mais um código pessoal de recuperação. O número sozinho não permite acessar a memória. O resumo de atendimento é separado.",
    consent: "Permitir memória neste navegador", create: "Criar projeto", select: "Projeto ativo", save: "Salvar memória", forget: "Apagar toda a memória", off: "Memória desativada", empty: "Ativar a memória cria um projeto para você antes de qualquer captura.", stored: "Memória salva no servidor e vinculada a este navegador.", quotaLimit: "O limite diário desta sessão foi atingido; renova à meia-noite UTC.", quota: (n: number) => `${n} mensagens restantes hoje`, expired: "Sua sessão expirou. O navegador não enviou o pedido novamente.", unavailable: "Não foi possível iniciar a sessão. Tente novamente; seu texto continua aqui.", global: "O limite geral do serviço foi atingido; tente mais tarde.",
  } : {
    memory: "Memory", memoryTitle: "Your memory with Nora", memoryIntro: "Optional: keep project facts for up to 30 days after their last update. Resume in this browser or link to your registered WhatsApp plus a personal recovery code. The number alone cannot access memory. The support summary is separate.",
    consent: "Allow memory in this browser", create: "Create project", select: "Active project", save: "Save memory", forget: "Forget all memory", off: "Memory is off", empty: "Enabling memory creates a project before anything is captured.", stored: "Memory saved on the server and linked to this browser.", quotaLimit: "This session's daily limit was reached; it resets at midnight UTC.", quota: (n: number) => `${n} messages left today`, expired: "Your session expired. The browser did not resend the request.", unavailable: "Could not start a session. Try again; your text is still here.", global: "The service-wide limit was reached; try again later.",
  };
  async function visitor(action: VisitorAction, requireCsrf = action.action !== "bootstrap"): Promise<VisitorSnapshot & {recoveryCode?:string}> {
    const response = await fetch("/api/concierge/visitor", { method: "POST", headers: { "content-type": "application/json", ...(requireCsrf && snapshot?.csrfToken ? { "x-nora-csrf": snapshot.csrfToken } : {}) }, body: JSON.stringify(action), credentials: "same-origin", cache: "no-store" });
    const payload = await response.json().catch(() => null) as (VisitorSnapshot & { error?: string; recoveryCode?:string }) | null;
    if (!response.ok || !payload || !payload.quota || !payload.memory) {
      if (payload?.error === "session_expired") setSessionError(ui.expired);
      else if (payload?.error === "global_limited") { globalLimited.current = true; setSessionError(ui.global); setErrorKind("rate_limited"); }
      throw new Error(payload?.error || "visitor_unavailable");
    }
    if (snapshot && snapshot.memory.activeProjectId !== payload.memory.activeProjectId) {
      setOfferReady(false); offerPresented.current = false; setContactDismissed(false); setSavedLeadId("");
      briefContext.current = undefined; setMessages([]); setFailed(false); setContextNotice(locale === "pt" ? "O projeto ativo mudou. A conversa anterior foi separada; revise sua mensagem antes de continuar." : "The active project changed. The previous conversation was separated; review your message before continuing.");
      if (!leadAttemptLocked && !leadSaved) { summaryEdited.current = false; setApprovedSummary(""); setConversationKey(value => value + 1); setLeadOpen(false); }
    }
    const {recoveryCode, ...cleanSnapshot}=payload;
    setSnapshot(cleanSnapshot); if (!globalLimited.current) setSessionError("");
    return {...cleanSnapshot,...(typeof recoveryCode === "string" ? {recoveryCode} : {})};
  }
  function bootstrap() {
    if (snapshot) return Promise.resolve(snapshot);
    if (!bootstrapping.current) bootstrapping.current = visitor({ action: "bootstrap" }, false).catch(() => { setSessionError(ui.unavailable); return null; }).finally(() => { bootstrapping.current = null; });
    return bootstrapping.current;
  }
  async function mutate(action: VisitorAction) {
    if (busyMemory || loading || leadAttemptLocked) return;
    setBusyMemory(true); setMemoryError("");
    try { const updated = await visitor(action); setSnapshot(updated); if (updated.memory.activeProjectId !== snapshot?.memory.activeProjectId || action.action === "forgetAll" || action.action === "forgetProject") restart(); }
    catch { setMemoryError(sessionError || ui.unavailable); }
    finally { setBusyMemory(false); }
  }
  async function recoverMemory(action: VisitorAction) {
    if (busyMemory || loading || leadAttemptLocked) throw new Error("memory_busy");
    setBusyMemory(true); setMemoryError("");
    try {const {recoveryCode,...cleanSnapshot}=await visitor(action);return {snapshot:cleanSnapshot,...(recoveryCode ? {recoveryCode} : {})};}
    finally {setBusyMemory(false);}
  }
  async function refreshAfterLead(leadId: string) {
    setLeadSaved(true); setSavedLeadId(leadId);
    try {
      const updated = await visitor({ action: "bootstrap" }, false);
      if (!globalLimited.current && (visitorTurnsRemaining(updated) ?? 0) > 0) {
        setErrorKind(current => current === "rate_limited" ? "unknown" : current);
        setSessionError("");
      }
    } catch { /* lead receipt remains successful if quota refresh fails */ }
  }
  useEffect(() => { if (open) { if (leadOpen) document.getElementById("lead-title")?.focus(); else if (needsRegistration) document.querySelector<HTMLInputElement>('[data-nora-welcome] input[autocomplete="given-name"]')?.focus(); else input.current?.focus(); } else if (wasOpen.current) opener.current?.focus(); wasOpen.current = open; }, [open, leadOpen, needsRegistration]);
  useEffect(() => { const show = () => opener.current?.click(); window.addEventListener("je4ndev:open-nora", show); return () => window.removeEventListener("je4ndev:open-nora", show); }, []);
  useEffect(() => () => clearTimeout(speakingTimer.current), []);
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [open]);
  useEffect(() => {
    const area = scrollArea.current, state = reading.current;
    if (!area || !open) return;
    const move = (top: number) => { area.scrollTo({ top, behavior: "instant" }); state.lastTop = area.scrollTop; };
    if (memoryOpen || leadOpen) { state.details = true; move(0); return; }
    if (state.details) { state.details = false; move(state.chatTop); }
    const latest = messages.at(-1);
    if (latest !== state.latest) {
      state.latest = latest;
      if (!latest) { state.follow = true; move(0); }
      else if (latest.role === "user") { state.follow = true; move(area.scrollHeight); }
      else if (state.follow) {
        const reply = area.querySelector<HTMLElement>('[data-message-role="assistant"]:last-child');
        if (reply) move(area.scrollTop + reply.getBoundingClientRect().top - area.getBoundingClientRect().top - parseFloat(getComputedStyle(area).paddingTop));
      }
    }
    state.chatTop = area.scrollTop;
  }, [messages, loading, open, leadOpen, memoryOpen]);
  function rememberReadingPosition() {
    const area = scrollArea.current, state = reading.current;
    if (!area || !open || leadOpen || memoryOpen) return;
    if (area.scrollTop < state.lastTop - 2) state.follow = false;
    if (area.scrollHeight - area.clientHeight - area.scrollTop < 24) state.follow = true;
    state.chatTop = area.scrollTop; state.lastTop = area.scrollTop;
  }
  useEffect(() => { if (!input.current || !open || leadOpen || memoryOpen) return; input.current.style.height = "auto"; input.current.style.height = `${Math.min(input.current.scrollHeight, 108)}px`; }, [draft, open, leadOpen, memoryOpen]);

  async function requestReply(history: ChatMessage[]) {
    if (inFlight.current || !snapshot) return;
    if (snapshot.protection && !verificationToken) { setErrorKind("verification"); setFailed(true); return; }
    inFlight.current = true; setLoading(true); setFailed(false); setErrorKind("unknown"); setOfferReady(false);
    try {
      const boundedPayload = { ...visitorRequestPayload(locale, history, briefContext.current), projectId: snapshot.memory.enabled ? snapshot.memory.activeProjectId : null };
      const response = await fetch("/api/concierge", { method: "POST", headers: { "content-type": "application/json", "x-nora-csrf": snapshot.csrfToken, ...(verificationToken ? { "x-nora-turnstile": verificationToken } : {}) }, credentials: "same-origin", body: JSON.stringify(boundedPayload), signal: AbortSignal.timeout(60_000) });
      const payload: unknown = await response.json().catch(() => null);
      const record = payload && typeof payload === "object" ? payload as { content?: unknown; brief?: unknown; handoff?: unknown; error?: unknown } : {};
      if (!response.ok || typeof record.content !== "string") {
        if (record.error === "context_changed") { briefContext.current = undefined; setMessages([]); setDraft(history.at(-1)?.content || ""); setContextNotice(locale === "pt" ? "O projeto ativo mudou em outra aba. Revise a mensagem antes de enviá-la no novo projeto." : "The active project changed in another tab. Review your message before sending it to the new project."); return; }
        if (record.error === "registration_required") { await visitor({action:"bootstrap"},false); setDraft(history.at(-1)?.content || ""); setMessages(history.slice(0,-1)); return; }
        if (record.error === "global_limited") { globalLimited.current = true; setSessionError(ui.global); setErrorKind("rate_limited"); }
        else if (record.error === "session_expired") setSessionError(ui.expired);
        else setErrorKind(conciergeErrorKind(record.error));
        throw new Error("assistant response unavailable");
      }
      setContextNotice(""); trackNora("nora-conversation-response", "first-conversation-response");
      if (isBrief(record.brief)) {
        briefContext.current = record.brief;
        if (!summaryEdited.current) setApprovedSummary(reviewedContactSummary(history, locale, record.brief));
              } else if (!summaryEdited.current) setApprovedSummary(reviewedContactSummary(history, locale));
      setMessages([...history, { role: "assistant", content: record.content }]);
      clearTimeout(speakingTimer.current); setSpeaking(true);
      speakingTimer.current = setTimeout(() => setSpeaking(false), 2400);
      if (record.handoff === "offer_contact" && isBrief(record.brief) && !contactDismissed && !leadSaved && !offerPresented.current) {
        offerPresented.current = true; setOfferReady(true);
      }
    } catch { setFailed(true); }
    finally {
      setVerificationToken(""); setVerificationAttempt(value => value + 1);
      try { await visitor({ action: "bootstrap" }, false); } catch { /* preserve the chat outcome if quota refresh fails */ }
      inFlight.current = false; setLoading(false);
    }
  }
  async function submit(text = draft) {
    const clean = text.trim();
    if (!clean || inFlight.current || clean.length > 1_200 || needsRegistration) return;
    if (containsRecoveryCode(clean)) {setMemoryOpen(true);setLeadOpen(false);setContextNotice(locale === "pt" ? "Use seu código somente no campo Recuperar memória. Ele não foi enviado ao chat." : "Use your code only in the Restore memory field. It was not sent to chat.");return;}
    setOfferReady(false);
    const history = failed && messages.at(-1)?.role === "user" ? messages.slice(0, -1) : messages;
    if (requestsWhatsApp(clean)) {
      const next = [...history, { role: "user" as const, content: clean }];
      if (!summaryEdited.current) setApprovedSummary(reviewedContactSummary(next, locale, briefContext.current));
      setMessages([...next, { role: "assistant", content: locale === "pt" ? "Claro, sem cadastro. Revise o texto em “Revisar resumo para o contato” e use o botão WhatsApp: a mensagem já abre preenchida com esse resumo. Você pode editar antes de enviar. Eu não envio nem confirmo a entrega por você." : "Of course, no registration needed. Review the text under “Review your contact summary” and use the WhatsApp button: the message opens prefilled with that summary. You can edit it before sending. I do not send it or confirm delivery for you." }]);
      setLeadOpen(false); setMemoryOpen(false); setDraft(""); setFailed(false); setContactDismissed(true);
      return;
    }
    if (requestsContact(clean)) {
      setMessages([...history, { role: "user", content: clean }, { role: "assistant", content: t.contactOpened }]);
      if (!summaryEdited.current) setApprovedSummary(reviewedContactSummary([...history, { role: "user", content: clean }], locale, briefContext.current));
      setDraft(""); setFailed(false); openLeadForm();
      return;
    }
    if (declinesContact(clean)) setContactDismissed(true);
    if (limited || errorKind === "rate_limited") return;
    if (!snapshot) { setSessionError(ui.unavailable); return; }
    const next = [...history, { role: "user" as const, content: clean }];
    if (!summaryEdited.current) setApprovedSummary(reviewedContactSummary(next, locale, briefContext.current)); setMessages(next); setDraft(""); await requestReply(next);
  }
  function changeApprovedSummary(summary: string) { summaryEdited.current = true; setApprovedSummary(summary); }
  function restart() { if (inFlight.current || leadAttemptLocked) return; setConversationKey(value => value + 1); setLeadOpen(false); setMessages([]); setDraft(""); setContactDismissed(false); setOfferReady(false); offerPresented.current = false; setLeadSaved(false); setSavedLeadId(""); setFailed(false); setErrorKind("unknown"); briefContext.current = undefined; summaryEdited.current = false; setApprovedSummary(""); input.current?.focus(); }
  const handoff = [locale === "pt" ? "Olá! Encontrei o portfólio da JE4NDEV e gostaria de conversar sobre meu projeto." : "Hi! I found the JE4NDEV portfolio and would like to discuss my project.", "", locale === "pt" ? "O que preciso:" : "What I need:", approvedSummary || contactSummary(messages, locale) || draft.trim() || (locale === "pt" ? "(adicione seu contexto aqui)" : "(add your context here)")].join("\n");
  const receiptContext = savedLeadId ? (locale === "pt" ? `\n\nContinuando o pedido já registrado: ${leadReference(savedLeadId)}\nProtocolo: ${savedLeadId}` : `\n\nContinuing my existing request: ${leadReference(savedLeadId)}\nReceipt: ${savedLeadId}`) : "";
  const whatsapp = `${COMPANY.whatsappUrl}?text=${encodeURIComponent(handoff + receiptContext)}`;
  const failureMessage = errorKind === "verification" ? (locale === "pt" ? "Precisamos verificar este acesso antes de responder. Seu texto continua aqui; conclua a verificação e tente novamente." : "We need to verify this access before replying. Your text is still here; complete verification and retry.") : errorKind === "rate_limited" ? (locale === "pt" ? "O limite diário foi atingido. Seu texto foi preservado; fale com a equipe ou tente amanhã." : "The daily limit was reached. Your text is preserved; contact the team or try tomorrow.") : errorKind === "busy" ? t.busy : errorKind === "upstream" ? t.upstream : t.error;
  const active = snapshot?.memory.projects.find((project) => project.id === snapshot.memory.activeProjectId) ?? null;
  const quotaText = snapshot ? ui.quota(remaining) : "";
  return <div className={styles.root} data-concierge-root data-agent-name={CONCIERGE_NAME}>
    <section id="portfolio-concierge" hidden={!open} aria-labelledby="concierge-title" className={`${styles.panel} ${messages.length || leadOpen || memoryOpen ? styles.expanded : ""}`}>
      <header className={styles.header}><NoraAvatar size="header" state={loading ? "thinking" : speaking ? "speaking" : "idle"}/><div className={styles.identity}><h2 id="concierge-title">{CONCIERGE_NAME}</h2><p>{t.subtitle}</p></div>
        {(messages.length > 0 || leadSaved) && !leadOpen && !memoryOpen && <button type="button" aria-label={t.restart} title={t.restart} disabled={loading || leadAttemptLocked} onClick={restart} className={styles.iconButton}><RotateCcw size={16}/></button>}
        <button type="button" aria-label={t.close} onClick={() => setOpen(false)} className={styles.iconButton}><X size={19}/></button></header>
      <div ref={scrollArea} onScroll={rememberReadingPosition} data-conversation-scroll aria-live="polite" aria-relevant="additions" className={styles.body}>
        {needsRegistration && snapshot && <div hidden={leadOpen || memoryOpen}><NoraWelcome locale={locale} csrfToken={snapshot.csrfToken} verificationToken={verificationToken} verificationRequired={!!snapshot.protection} onVerificationUsed={() => {setVerificationToken("");setVerificationAttempt(value=>value+1);}} onRegistered={async () => {const updated=await visitor({action:"bootstrap"},false);if(!updated.profile?.hasWhatsApp)throw new Error("registration pending");setMessages([]);setDraft("");}}/></div>}
        <div hidden={leadOpen || memoryOpen || needsRegistration}><p className={styles.welcome}>{snapshot?.profile?.name ? (locale === "pt" ? `Oi, ${snapshot.profile.name.split(/\s+/)[0]}! Eu sou Nora. Você pode me testar ou conversar sobre um assistente para seu site, app ou rotina. O que gostaria de explorar?` : `Hi, ${snapshot.profile.name.split(/\s+/)[0]}! I'm Nora. You can try me out or explore an assistant for your website, app or routine. What would you like to explore?`) : t.intro}</p><div className={styles.messages}>{messages.map((message, index) => <p key={`${index}-${message.role}`} data-message-role={message.role} className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant}`}>{message.content}</p>)}</div>
          {!loading && !leadSaved && !contactDismissed && offerReady && <div data-contact-offer className={styles.contactOffer}><p>{t.contactOffer}</p><small>{locale === "pt" ? "Leve o resumo do que você contou, com suas necessidades e restrições. Você revisa e autoriza antes de enviar." : "Bring the summary of your needs and constraints. You review and approve it before sending."}</small><div><button type="button" data-cta="contact-offer-accept" onClick={openLeadForm}>{t.human}<ArrowUpRight size={14} aria-hidden="true"/></button><button type="button" data-cta="contact-offer-dismiss" onClick={() => setContactDismissed(true)}>{t.contactDecline}</button></div></div>}
          {loading && <p className={styles.loading} role="status"><span className={styles.dots} aria-hidden="true"><i/><i/><i/></span>{t.loading}</p>}
          {failed && <div role="alert" className={styles.error}><p>{failureMessage}</p>{errorKind !== "rate_limited" && <button type="button" disabled={loading} className={styles.retry} onClick={() => void requestReply(messages)}>{t.retry}</button>}</div>}
          {sessionError && <div role="alert" className={styles.error}><p>{sessionError}</p>{!snapshot && errorKind !== "rate_limited" && <button type="button" disabled={loading} className={styles.retry} onClick={() => void bootstrap()}>{t.retry}</button>}</div>}{snapshot && <p className={styles.loading} aria-live="polite">{quotaText}</p>}
          {limited && <p className={styles.error}>{ui.quotaLimit}</p>}{messages.length === 0 && <div className={styles.suggestions}>{t.prompts.map((prompt) => <button type="button" key={prompt} disabled={loading || !snapshot || limited} onClick={() => void submit(prompt)}>{prompt}<ChevronRight size={15} aria-hidden="true"/></button>)}</div>}</div>
        <div hidden={!leadOpen || memoryOpen}><LeadCapture key={conversationKey} onLockChange={setLeadAttemptLocked} locale={locale} csrfToken={snapshot?.csrfToken} verificationToken={verificationToken} onVerificationUsed={() => {setVerificationToken("");setVerificationAttempt(value=>value+1);}} initialSummary={approvedSummary || contactSummary(messages, locale)} onSummaryChange={changeApprovedSummary} onSaved={refreshAfterLead} onClose={() => setLeadOpen(false)}/></div>
        {memoryOpen && <section data-nora-memory-panel className={memoryStyles.panel} aria-labelledby="nora-memory-title"><h3 id="nora-memory-title">{ui.memoryTitle}</h3><p className={memoryStyles.intro}>{ui.memoryIntro}</p>
          {memoryError && <p role="alert" className={styles.error}>{memoryError}</p>}
          {!snapshot ? <p role="status">{sessionError || ui.unavailable}</p> : <>
            <label className={memoryStyles.control}>{ui.select}<select data-cta="memory-select-project" value={snapshot.memory.activeProjectId || ""} disabled={busyMemory || loading || leadAttemptLocked} onChange={e => void mutate({ action: "selectProject", projectId: e.target.value })}><option value="" disabled>—</option>{snapshot.memory.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
            {!snapshot.memory.projects.length && <p>{ui.empty}</p>}
            {snapshot.memory.enabled && <div className={memoryStyles.create}><input aria-label={locale === "pt" ? "Nome do projeto" : "Project name"} value={projectTitle} maxLength={80} onChange={e => setProjectTitle(e.target.value)}/><button type="button" data-cta="memory-create-project" disabled={busyMemory || loading || leadAttemptLocked || !projectTitle.trim() || snapshot.memory.projects.length >= 5} onClick={async () => { const title = projectTitle.trim(); if (!title) return; await mutate({ action: "createProject", title }); setProjectTitle(""); }}>{ui.create}</button></div>}
            <label className={memoryStyles.consent}><input type="checkbox" data-cta="memory-consent" checked={snapshot.memory.enabled} disabled={busyMemory || loading || leadAttemptLocked} onChange={e => void mutate({ action: "consent", enabled: e.target.checked })}/>{ui.consent}</label>
            {snapshot.profile?.hasWhatsApp && <MemoryRecovery locale={locale} linked={!!snapshot.memory.linked} enabled={snapshot.memory.enabled} disabled={busyMemory || loading || leadAttemptLocked} onAction={recoverMemory}/>}
            {!active && snapshot.memory.enabled && <p>{ui.empty}</p>}
            {active && <MemoryPanel key={active.id} active={active} locale={locale} disabled={!snapshot.memory.enabled || busyMemory || loading || leadAttemptLocked} onSave={(project, facts) => void mutate({ action: "save", projectId: project.id, title: project.title, facts })}/>}
            {active && <button type="button" className={memoryStyles.secondary} disabled={busyMemory || loading || leadAttemptLocked} onClick={() => void mutate({ action: "forgetProject", projectId: active.id })}>{locale === "pt" ? "Apagar projeto" : "Forget project"}</button>}
            <button type="button" data-cta="memory-forget-all" className={memoryStyles.secondary} disabled={busyMemory || loading || leadAttemptLocked || !snapshot.memory.enabled} onClick={() => void mutate({ action: "forgetAll" })}>{ui.forget}</button>
            {!snapshot.memory.enabled && <p>{ui.off}</p>}
          </>}
        </section>}
      </div>
      <div className={styles.footer}>
        {open && snapshot?.protection && <BotVerification siteKey={snapshot.protection.siteKey} locale={locale} attempt={verificationAttempt} onToken={setVerificationToken}/>}
        <form hidden={leadOpen || memoryOpen || needsRegistration} onSubmit={e => { e.preventDefault(); void submit(); }} className={styles.composer}><label className="sr-only" htmlFor="concierge-message">{t.placeholder}</label><textarea ref={input} id="concierge-message" value={draft} maxLength={1200} rows={1} disabled={loading || !snapshot} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void submit(); } }} placeholder={t.placeholder}/><button type="submit" disabled={loading || !draft.trim() || ((!snapshot || limited || errorKind === "rate_limited" || (!!snapshot.protection && !verificationToken)) && !requestsContact(draft) && !requestsWhatsApp(draft))} aria-label={t.send} className={styles.send}><ArrowUp size={20}/></button></form>
        {contextNotice && <p role="status" className={styles.notice}>{contextNotice}</p>}
        <details data-brief-review className={styles.privacy}><summary>{locale === "pt" ? "Revisar resumo para o contato" : "Review your contact summary"}</summary><textarea aria-label={locale === "pt" ? "Resumo para contato" : "Contact summary"} rows={5} maxLength={1500} value={approvedSummary || contactSummary(messages, locale)} disabled={leadAttemptLocked || leadSaved} onChange={e => changeApprovedSummary(e.target.value)} style={{width:"100%",resize:"vertical",padding:"8px",color:"inherit",background:"transparent",border:"1px solid #cbd5e1",borderRadius:8}}/><p>{locale === "pt" ? "Revise antes de continuar. Abrir o WhatsApp não envia a mensagem. Suas edições são preservadas." : "Review before continuing. Opening WhatsApp does not send the message. Your edits are preserved."}</p></details>
        <div className={styles.actions}><a href={contactEmailHref(locale, "Nora", handoff + receiptContext)} data-analytics-event="lead-cta-click" data-cta="concierge-email" className={styles.human}><Mail size={15} aria-hidden="true"/>{locale === "pt" ? "E-mail" : "Email"}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer" data-analytics-event="lead-cta-click" data-cta="concierge-whatsapp" className={styles.whatsapp}><MessageCircle size={15} aria-hidden="true"/>{t.handoff}</a>
          <button type="button" data-cta="concierge-handoff" aria-expanded={leadOpen} onClick={() => { if (leadOpen) setLeadOpen(false); else openLeadForm(); }} className={styles.human}><UserRound size={15} aria-hidden="true"/>{leadOpen ? t.back : t.human}<ArrowUpRight size={13} aria-hidden="true"/></button>
          <button type="button" data-cta="nora-memory" aria-expanded={memoryOpen} onClick={() => { setMemoryOpen(value => !value); setLeadOpen(false); if (!snapshot) void bootstrap(); }} className={styles.human}>{ui.memory}</button></div>
        <details className={styles.privacy}><summary><LockKeyhole size={11} aria-hidden="true"/>{t.privacyLabel}</summary><p>{t.privacy}</p></details></div>
    </section>
    <button ref={opener} hidden={open} type="button" aria-expanded={open} aria-controls="portfolio-concierge" aria-label={t.open} onClick={() => { trackNora("nora-open", "nora-open"); setOpen(true); void bootstrap(); }} data-cta="concierge-toggle" className={styles.launcher}><span className={styles.launcherMark} aria-hidden="true"><NoraAvatar/></span><span>{t.open}</span></button>
  </div>;
}

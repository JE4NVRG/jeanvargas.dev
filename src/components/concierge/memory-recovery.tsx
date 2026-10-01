"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import type { VisitorAction, VisitorSnapshot } from "@/lib/concierge/visitor-contract";
import styles from "./memory-recovery.module.css";

type Props = {
  locale: "pt" | "en";
  linked: boolean;
  enabled: boolean;
  disabled?: boolean;
  onAction: (action: VisitorAction) => Promise<{ snapshot: VisitorSnapshot; recoveryCode?: string }>;
};

export function MemoryRecovery({ locale, linked, enabled, disabled = false, onAction }: Props) {
  const pt = locale === "pt", id = useId(), inFlight = useRef(false), output = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false), [code, setCode] = useState(""), [consent, setConsent] = useState(false);
  // This secret is deliberately kept only in this mounted component, never in the visitor snapshot.
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null), [message, setMessage] = useState("");
  const locked = disabled || busy;

  async function act(action: VisitorAction) {
    if (inFlight.current || disabled) return;
    inFlight.current = true; setBusy(true); setMessage("");
    try {
      const result = await onAction(action);
      if (action.action === "linkMemory") {
        setRecoveryCode(result.recoveryCode ?? null);
        setMessage(result.recoveryCode ? (pt ? "Guarde seu código agora. Ele não será mostrado novamente." : "Save your code now. It will not be shown again.") : (pt ? "Esta memória já está vinculada. O código anterior continua válido." : "This memory is already linked. Your previous code remains valid."));
      } else {
        setRecoveryCode(null); setCode(""); setConsent(false);
        setMessage(pt ? "Memória recuperada neste navegador." : "Memory restored in this browser.");
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : "";
      setMessage(/recovery_rate_limited/.test(detail)
        ? (pt ? "Muitas tentativas. Aguarde 15 minutos antes de tentar novamente." : "Too many attempts. Wait 15 minutes before trying again.")
        : /invalid_recovery/.test(detail)
          ? (pt ? "Não foi possível recuperar. Confira o código e o número informado no cadastro." : "Unable to restore. Check your code and the number entered during registration.")
          : (pt ? "Não foi possível concluir. Tente novamente. Se o vínculo já foi salvo, o código não será gerado de novo." : "Unable to complete. Try again. If the link was already saved, a new code will not be generated."));
    } finally { inFlight.current = false; setBusy(false); }
  }

  async function copyCode() {
    if (!recoveryCode) return;
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setMessage(pt ? "Código copiado. Guarde em um lugar seguro." : "Code copied. Keep it somewhere safe.");
    } catch {
      output.current?.focus(); output.current?.select();
      setMessage(pt ? "Selecione e copie o código manualmente." : "Select and copy the code manually.");
    }
  }

  function restore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!locked && consent && code.trim()) void act({ action: "restoreMemory", code: code.trim(), consent: true });
  }

  return (
    <section className={styles.recovery} aria-labelledby={`${id}-title`} aria-busy={busy}>
      <h4 id={`${id}-title`}>{pt ? "Sua memória em outro navegador" : "Your memory in another browser"}</h4>
      <p>{pt ? "Opcional: use o número informado no cadastro e um código pessoal para retomar seus projetos por até 30 dias sem atualização. Não enviamos SMS ou WhatsApp, e o número não é verificado." : "Optional: use the number entered during registration and a personal code to resume your projects for up to 30 days without updates. No SMS or WhatsApp is sent, and the number is not verified."}</p>
      {linked ? <p className={styles.linked}>{pt ? "Memória vinculada neste navegador." : "Memory linked in this browser."}</p> : (
        <>
          <button type="button" disabled={locked || !enabled} onClick={() => void act({ action: "linkMemory" })}>
            {busy ? (pt ? "Aguarde…" : "Please wait…") : (pt ? "Criar meu código pessoal" : "Create my personal code")}
          </button>
          {!enabled && <p>{pt ? "Ative a memória opcional acima para criar um código." : "Enable optional memory above to create a code."}</p>}
          <form onSubmit={restore} className={styles.form}>
            <label htmlFor={`${id}-code`}>{pt ? "Já tem um código pessoal?" : "Already have a personal code?"}</label>
            <input id={`${id}-code`} type="password" autoComplete="off" spellCheck={false} maxLength={128} value={code} onChange={event => setCode(event.target.value)} placeholder="NORA-…" disabled={locked} aria-describedby={`${id}-restore-help`} />
            <p id={`${id}-restore-help`}>{pt ? "Cadastre neste navegador o mesmo número usado ao criar o código. O código sozinho não recupera a memória." : "Register the same number used when creating the code in this browser. The code alone cannot restore memory."}</p>
            <label className={styles.consent}><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} disabled={locked} /><span>{pt ? "Quero recuperar e usar minha memória opcional neste navegador." : "I want to restore and use my optional memory in this browser."}</span></label>
            <button type="submit" className={styles.secondary} disabled={locked || !consent || !code.trim()}>{pt ? "Recuperar minha memória" : "Restore my memory"}</button>
          </form>
        </>
      )}
      {recoveryCode && linked && enabled && <div className={styles.secret}>
        <label htmlFor={`${id}-new-code`}>{pt ? "Seu código pessoal — exibido uma vez" : "Your personal code — shown once"}</label>
        <input ref={output} id={`${id}-new-code`} readOnly value={recoveryCode} autoComplete="off" spellCheck={false} onFocus={event => event.target.select()} />
        <p>{pt ? "Quem tiver seu número e este código poderá acessar a memória. Guarde o código em local seguro; não o envie no chat. Sem ele, será preciso criar uma memória nova." : "Anyone with your number and this code can access the memory. Keep it safe; do not send it in chat. Without it, you will need to create new memory."}</p>
        <div className={styles.actions}><button type="button" onClick={() => void copyCode()} disabled={locked}>{pt ? "Copiar código" : "Copy code"}</button><button type="button" className={styles.secondary} onClick={() => { setRecoveryCode(null); setMessage(pt ? "Código ocultado. Use-o com o mesmo número para recuperar sua memória." : "Code hidden. Use it with the same number to restore your memory."); }} disabled={locked}>{pt ? "Já guardei" : "I saved it"}</button></div>
      </div>}
      <p className={styles.status} role="status" aria-live="polite">{message}</p>
    </section>
  );
}

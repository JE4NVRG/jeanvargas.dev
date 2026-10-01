"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widget: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

export function BotVerification({ siteKey, locale, attempt, onToken }: { siteKey: string; locale: "pt" | "en"; attempt: number; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [scriptFailed, setScriptFailed] = useState(false);
  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    onToken("");
    const widget = api.render(container.current, {
      sitekey: siteKey, action: "nora_chat", language: locale === "pt" ? "pt-BR" : "en",
      theme: "light", size: "flexible", appearance: "interaction-only", "response-field": false,
      callback: (token: string) => { setFailed(false); onToken(token); },
      "error-callback": () => { setFailed(true); onToken(""); },
      "expired-callback": () => onToken(""),
      "timeout-callback": () => { setFailed(true); onToken(""); },
    });
    return () => { api.remove(widget); onToken(""); };
  }, [ready, siteKey, locale, attempt, onToken]);
  return <div data-nora-verification>
    <Script id="nora-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => { setScriptFailed(false); setReady(true); }} onError={() => { setScriptFailed(true); setFailed(true); }}/>
    <div ref={container}/>
    {failed && <p role="status">{locale === "pt" ? "Não foi possível verificar este acesso. Confira a conexão e tente novamente." : "We couldn't verify this access. Check your connection and try again."}</p>}
    {scriptFailed && <button type="button" onClick={() => window.location.reload()}>{locale === "pt" ? "Recarregar página para verificar o acesso" : "Reload page to verify access"}</button>}
  </div>;
}

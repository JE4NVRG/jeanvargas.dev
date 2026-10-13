"use client";

import { useEffect, useState } from "react";
import {
  eloziCopy,
  mountEloziWidget,
  resolveEloziConfig,
  resolveWhatsAppUrl,
  type EloziPublicConfig,
  type EloziStatus,
} from "../../lib/communication/elozi-widget";

export type EloziChatProps = EloziPublicConfig & {
  /** Explicit authorized public agency WhatsApp URL. No inferred contact or default IDs. */
  whatsappUrl?: string;
};

/** Replace the legacy concierge in the parent layout; do not render both. */
export function EloziChat({ locale, apiOrigin, tenantId, channelId, whatsappUrl }: EloziChatProps) {
  const [runtime, setRuntime] = useState<{ key: string; status: EloziStatus } | null>(null);
  const key = JSON.stringify([locale, apiOrigin, tenantId, channelId]);
  const enabled = resolveEloziConfig({ locale, apiOrigin, tenantId, channelId }) !== null;
  const status = !enabled ? "disabled" : runtime?.key === key ? runtime.status : "loading";
  const copy = eloziCopy(locale), contact = resolveWhatsAppUrl(whatsappUrl);

  useEffect(() => {
    const mount = mountEloziWidget({ locale, apiOrigin, tenantId, channelId }, {
      document,
      window,
      onState: state => setRuntime({ key, status: state }),
    });
    return () => mount.destroy();
  }, [locale, apiOrigin, tenantId, channelId, key]);

  if (status === "ready" || (status === "disabled" && !contact)) return null;
  return (
    <aside
      lang={locale === "en" ? "en" : "pt-BR"}
      aria-label={copy.launcher}
      className="fixed bottom-5 right-5 z-[2147483000] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-zinc-100 shadow-lg"
    >
      {status === "loading" && (
        <button type="button" disabled aria-busy="true" className="min-h-11 px-3 font-medium">
          {copy.launcher}
        </button>
      )}
      {status === "unavailable" && <p role="status" className="mb-2 max-w-64 text-sm">{copy.unavailable}</p>}
      {contact && (
        <a href={contact} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"
          className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
          {status === "disabled" ? copy.launcher : copy.contact}
          {status === "disabled" && <span className="ml-2 text-xs">WhatsApp</span>}
        </a>
      )}
    </aside>
  );
}

/**
 * Elozi 0.51.25 public SDK snapshot, fetched from https://elozi.je4ndev.com
 * on 2026-10-13; byte-identical to F:/MepChat.staging/public (read-only).
 * Only the five published ES modules are vendored; no runtime credentials.
 * Literal local import is bundled normally by Next, not eval or remote import.
 */
export const ELOZI_SDK_PROVENANCE = {
  version: "0.51.25",
  origin: "https://elozi.je4ndev.com",
  sha256: {
    "widget.js": "f1511081200c3e573b3103b65c2f4bfc2ae3377683ee90f48937d9b060c5cbd1",
    "channel-capabilities.js": "8fffeaa774c962904f88055659d29018f6db0e20b4d4dd972de9ebbe942a21cf",
    "webchat-media.js": "e66c6b4e73d02d20e573dfc7c28e000aa87961909b41fb08d332dd85bd8503e7",
    "i18n.js": "e586488b4eb439de0a31b4f427dd0742b606af3ca31abc2177bfe79c29e9fa7e",
    "locales-media.js": "2c7462ae45c149f6a20a3204a78eadf2c081e7da2213f7ad4af78cb6e0781231",
  },
} as const;

/** Public open intent for the single page-owned chat; carries no visitor data. */
export const ELOZI_OPEN_CHAT_EVENT = "je4ndev:open-chat";

export type EloziLocale = "pt" | "pt-BR" | "en";
export type EloziPublicConfig = {
  locale?: EloziLocale;
  apiOrigin?: string;
  tenantId?: string;
  channelId?: string;
};
export type EloziConfig = {
  locale: "pt-BR" | "en";
  apiOrigin: string;
  tenantId: string;
  channelId: string;
};
export type EloziWidget = {
  host: HTMLElement;
  open(): void;
  close(): void;
  destroy(): void;
};
export type EloziSdk = {
  createWebchatWidget(options: EloziConfig & { document: Document; window: Window }): EloziWidget;
};
export type EloziStatus = "ready" | "disabled" | "unavailable";

export function eloziCopy(locale?: EloziLocale) {
  return locale === "en"
    ? { launcher: "Chat with JE4NDEV", unavailable: "Chat is unavailable right now.", contact: "Contact our team on WhatsApp" }
    : { launcher: "Fale com a JE4NDEV", unavailable: "O chat está indisponível neste momento.", contact: "Fale com nossa equipe pelo WhatsApp" };
}

/** Incomplete or malformed public configuration must never load or contact the SDK. */
export function resolveEloziConfig(config: EloziPublicConfig): EloziConfig | null {
  const { apiOrigin, tenantId, channelId, locale } = config;
  if (typeof apiOrigin !== "string" || typeof tenantId !== "string" || typeof channelId !== "string"
    || !apiOrigin || !tenantId || !channelId || !/^[A-Za-z0-9_-]{1,120}$/.test(tenantId)
    || !/^[A-Za-z0-9_-]{1,120}$/.test(channelId)
    || (locale !== undefined && !["pt", "pt-BR", "en"].includes(locale))) return null;
  try {
    const url = new URL(apiOrigin);
    // Exact origin, HTTPS only (even localhost), no paths, credentials, query or fragment.
    if (url.protocol !== "https:" || url.username || url.password || url.origin !== apiOrigin) return null;
    return { apiOrigin, tenantId, channelId, locale: locale === "en" ? "en" : "pt-BR" };
  } catch { return null; }
}

/** Caller supplies an authorized public agency URL; never infer a phone number. */
export function resolveWhatsAppUrl(value?: string): string | null {
  if (!value || value.length > 2200 || /[\u0000-\u0020\u007f]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash) return null;
    if (url.hostname === "wa.me") {
      if (!/^\/[0-9]{7,15}$/.test(url.pathname) || [...url.searchParams.keys()].some(key => key !== "text")) return null;
    } else if (url.hostname === "api.whatsapp.com") {
      if (url.pathname !== "/send" || !/^[0-9]{7,15}$/.test(url.searchParams.get("phone") ?? "")
        || [...url.searchParams.keys()].some(key => !["phone", "text"].includes(key))) return null;
    } else return null;
    if (url.searchParams.getAll("text").length > 1 || url.searchParams.getAll("phone").length > 1) return null;
    return url.href;
  } catch { return null; }
}

let sdkPromise: Promise<EloziSdk> | undefined;
export function loadEloziSdk(): Promise<EloziSdk> {
  if (!sdkPromise) {
    sdkPromise = import("../../../public/elozi/widget.js").then(module => {
      if (typeof module.createWebchatWidget !== "function") throw new Error("Elozi SDK unavailable");
      return module as unknown as EloziSdk;
    }).catch(error => { sdkPromise = undefined; throw error; });
  }
  return sdkPromise;
}

const owners = new WeakMap<Document, object>();
export type EloziMount = {
  ready: Promise<void>;
  open(): void;
  close(): void;
  destroy(): void;
};

/** Owns a single page widget; transport/session capability stays inside the real SDK. */
export function mountEloziWidget(config: EloziPublicConfig, {
  document: doc,
  window: view,
  loadSdk = loadEloziSdk,
  onState,
}: {
  document: Document;
  window: Window;
  /** Dependency seam for isolated loader failures/delays, not a mock widget in production. */
  loadSdk?: () => Promise<EloziSdk>;
  onState?: (state: EloziStatus) => void;
}): EloziMount {
  const resolved = resolveEloziConfig(config), owner = {};
  const duplicate = owners.has(doc);
  let disposed = false, widget: EloziWidget | undefined, labels: MutationObserver | undefined;
  let pendingOpen = false;
  let timeout: ReturnType<Window["setTimeout"]> | undefined;
  let cancel!: () => void;
  const cancellation = new Promise<null>(resolve => { cancel = () => resolve(null); });
  if (resolved && !duplicate) owners.set(doc, owner);
  const open = () => {
    if (disposed || owners.get(doc) !== owner) return;
    if (widget) widget.open();
    else pendingOpen = true;
  };
  const close = () => {
    pendingOpen = false;
    if (!disposed) widget?.close();
  };
  // Reserve and listen synchronously, before the SDK loader's first microtask.
  // The boolean intent belongs only to this owner, never the next locale/config.
  if (resolved && !duplicate) view.addEventListener(ELOZI_OPEN_CHAT_EVENT, open);
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    pendingOpen = false;
    if (resolved && !duplicate) view.removeEventListener(ELOZI_OPEN_CHAT_EVENT, open);
    cancel();
    if (timeout !== undefined) view.clearTimeout(timeout);
    labels?.disconnect();
    try { widget?.destroy(); } finally {
      widget = undefined;
      if (owners.get(doc) === owner) owners.delete(doc);
    }
  };
  const ready = Promise.resolve().then(async () => {
    if (disposed) return;
    if (!resolved) { onState?.("disabled"); return; }
    if (duplicate) { onState?.("unavailable"); return; }
    try {
      const sdk = await Promise.race([
        loadSdk(),
        cancellation,
        new Promise<never>((_, reject) => {
          timeout = view.setTimeout(() => reject(new Error("Elozi loader timeout")), 10_000);
        }),
      ]);
      if (!sdk || disposed || owners.get(doc) !== owner) return;
      view.clearTimeout(timeout);
      timeout = undefined;
      widget = sdk.createWebchatWidget({ ...resolved, document: doc, window: view });
      const root = widget.host.shadowRoot;
      const paintLabels = () => {
        const launcher = root?.getElementById("widget-launcher-label"), title = root?.getElementById("widget-title");
        const copy = eloziCopy(config.locale);
        if (launcher && launcher.textContent !== copy.launcher) launcher.textContent = copy.launcher;
        if (title && title.textContent !== "JE4NDEV") title.textContent = "JE4NDEV";
      };
      paintLabels();
      // Public channel branding may arrive asynchronously; preserve this site's identity.
      const Observer = (view as Window & { MutationObserver: typeof MutationObserver }).MutationObserver;
      labels = new Observer(paintLabels);
      if (root) labels.observe(root, { subtree: true, childList: true, characterData: true });
      if (pendingOpen) {
        pendingOpen = false;
        widget.open();
      }
      onState?.("ready");
    } catch {
      if (!disposed) {
        destroy();
        onState?.("unavailable");
      }
    } finally {
      if (timeout !== undefined) view.clearTimeout(timeout);
      timeout = undefined;
    }
  });
  return {
    ready,
    open,
    close,
    destroy,
  };
}

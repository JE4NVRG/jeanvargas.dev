import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { test } from "node:test";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { EloziChat } from "../../components/communication/elozi-chat";
import {
  ELOZI_OPEN_CHAT_EVENT as openChatEvent,
  ELOZI_SDK_PROVENANCE,
  eloziCopy,
  loadEloziSdk,
  mountEloziWidget,
  resolveEloziConfig,
  resolveWhatsAppUrl,
  type EloziPublicConfig,
  type EloziSdk,
} from "./elozi-widget";

// DOM and HTTP are isolated; every successful lifecycle uses the published SDK,
// not a stand-in createWebchatWidget. Use the pinned checkout dependency by
// default; ELOZI_TEST_DOM_DIR may point to an already-owned isolated runner.
const requireDom = createRequire(join(process.env.ELOZI_TEST_DOM_DIR ?? process.cwd(), "package.json"));
const { Window: DomWindow } = requireDom("happy-dom") as {
  Window: new (options: { url: string }) => Window & typeof globalThis & { happyDOM: { abort(): Promise<void> } };
};
const config = { apiOrigin: "https://elozi.je4ndev.com", tenantId: "isolated_test_tenant", channelId: "isolated_test_channel" };

const tick = () => new Promise<void>(resolve => setImmediate(resolve));
/** Count calls while forwarding every successful factory/open to the real SDK. */
async function observedSdk() {
  const actual = await loadEloziSdk();
  const calls = { creations: 0, opens: 0 };
  const sdk: EloziSdk = {
    createWebchatWidget(options) {
      calls.creations++;
      const widget = actual.createWebchatWidget(options), open = widget.open.bind(widget);
      widget.open = () => { calls.opens++; open(); };
      return widget;
    },
  };
  return { sdk, calls };
}
function chatListeners(window: Window) {
  const listeners = new Set<EventListenerOrEventListenerObject>();
  const add = window.addEventListener.bind(window), remove = window.removeEventListener.bind(window);
  window.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
    if (type === openChatEvent) listeners.add(listener);
    add(type, listener, options);
  }) as typeof window.addEventListener;
  window.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
    if (type === openChatEvent) listeners.delete(listener);
    remove(type, listener, options);
  }) as typeof window.removeEventListener;
  return listeners;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
function fixture() {
  const window = new DomWindow({ url: "https://portfolio.example.test" });
  const requests: { url: string; init: RequestInit }[] = [];
  // Config transport only. There are no production conversations or recipients.
  window.fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    requests.push({ url: String(input), init });
    return new Response(JSON.stringify({ brand: { name: "Isolated test brand" }, widget: { displayName: "Old brand", openButtonLabel: "Old label" } }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
  for (const storage of [window.localStorage, window.sessionStorage]) {
    storage.setItem = () => { throw new Error("Credential persistence is forbidden"); };
  }
  return { window, document: window.document, requests };
}

for (const [filename, expected] of Object.entries(ELOZI_SDK_PROVENANCE.sha256)) {
  test(`published SDK byte provenance: ${filename}`, () => {
    const bytes = readFileSync(new URL(`../../../public/elozi/${filename}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected);
  });
}
test("real module loader is single-flight and exposes the public factory", async () => {
  const a = loadEloziSdk(), b = loadEloziSdk();
  assert.equal(a, b);
  assert.equal(typeof (await a).createWebchatWidget, "function");
});
test("explicit optional config and PT/EN localization", () => {
  assert.equal(openChatEvent, "je4ndev:open-chat");
  assert.equal(resolveEloziConfig({}), null);
  assert.equal(resolveEloziConfig(config)?.locale, "pt-BR");
  assert.equal(resolveEloziConfig({ ...config, locale: "pt" })?.locale, "pt-BR");
  assert.equal(resolveEloziConfig({ ...config, locale: "en" })?.locale, "en");
  assert.equal(eloziCopy("pt").launcher, "Fale com a JE4NDEV");
  assert.equal(eloziCopy("en").launcher, "Chat with JE4NDEV");
});
test("HTTP, credentials, paths, query, fragments and malformed identifiers fail closed", async () => {
  const { window, document, requests } = fixture();
  const listeners = chatListeners(window);
  let loads = 0;
  const invalid: EloziPublicConfig[] = [
    ...["http://elozi.je4ndev.com", "http://localhost:3000", "https://name:secret@elozi.je4ndev.com", "https://elozi.je4ndev.com/", "https://elozi.je4ndev.com/path", "https://elozi.je4ndev.com?token=no", "https://elozi.je4ndev.com#no"].map(apiOrigin => ({ ...config, apiOrigin })),
    { ...config, tenantId: " invalid " }, { ...config, channelId: "a/b" }, { ...config, channelId: "" },
    { ...config, locale: "es" as "en" }, { ...config, channelId: "x".repeat(121) },
    { ...config, tenantId: 123 as unknown as string }, { ...config, channelId: true as unknown as string },
  ];
  for (const value of invalid) {
    assert.equal(resolveEloziConfig(value), null);
    const mount = mountEloziWidget(value, { document, window, loadSdk: () => { loads++; return loadEloziSdk(); } });
    window.dispatchEvent(new window.Event(openChatEvent)); mount.open();
    assert.equal(listeners.size, 0, "Invalid config must never listen for hero intents");
    await mount.ready;
    mount.destroy();
  }
  assert.equal(loads, 0);
  assert.equal(requests.length, 0);
  assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
  await window.happyDOM.abort();
});
test("WhatsApp fallback accepts only explicit public HTTPS WhatsApp routes", () => {
  assert.equal(resolveWhatsAppUrl(), null);
  assert.equal(resolveWhatsAppUrl("https://wa.me/5511999999999"), "https://wa.me/5511999999999");
  assert.ok(resolveWhatsAppUrl("https://api.whatsapp.com/send?phone=5511999999999&text=Hello"));
  for (const value of ["http://wa.me/5511999999999", "https://u:p@wa.me/5511999999999", "https://wa.me.evil.test/5511999999999", "https://evil.test", "javascript:alert(1)", "https://wa.me/5511999999999#token", "https://wa.me/5511999999999?token=secret", "https://api.whatsapp.com/send?phone=1", "https://wa.me/5511999999999?text=a&text=b"]) {
    assert.equal(resolveWhatsAppUrl(value), null, value);
  }
});
for (const locale of ["pt", "pt-BR", "en"] as const) {
  test(`actual SDK mounts, opens, closes and destroys idempotently in ${locale}`, async () => {
    const { window, document, requests } = fixture();
    const mount = mountEloziWidget({ ...config, locale }, { document, window });
    await mount.ready;
    await tick();
    const host = document.querySelector<HTMLElement>("[data-elozi-widget]");
    assert.ok(host?.shadowRoot);
    assert.equal(host.lang, locale === "en" ? "en" : "pt-BR");
    assert.equal(host.shadowRoot.getElementById("widget-launcher-label")?.textContent, eloziCopy(locale).launcher);
    assert.equal(host.shadowRoot.getElementById("widget-title")?.textContent, "JE4NDEV");
    const panel = host.shadowRoot.getElementById("widget-panel")!;
    mount.open(); assert.equal(panel.hidden, false);
    mount.close(); assert.equal(panel.hidden, true);
    assert.ok(requests.length > 0);
    assert.ok(requests.every(({ url, init }) => url === `${config.apiOrigin}/api/public/webchat/${config.tenantId}/${config.channelId}/config` && init.credentials === "omit"));
    mount.destroy(); mount.destroy(); mount.open(); mount.close();
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
    assert.equal(window.localStorage.length, 0); assert.equal(window.sessionStorage.length, 0);
    await window.happyDOM.abort();
  });
}
for (const locale of ["pt", "en"] as const) {
  test(`public chat event queues one early intent and reuses the real ${locale} widget`, async () => {
    const { window, document, requests } = fixture(), listeners = chatListeners(window);
    const delay = deferred<EloziSdk>(), { sdk, calls } = await observedSdk();
    const mount = mountEloziWidget({ ...config, locale }, { document, window, loadSdk: () => delay.promise });
    try {
      // Dispatch synchronously: even the loader microtask has not started yet.
      window.dispatchEvent(new window.Event(openChatEvent));
      window.dispatchEvent(new window.Event(openChatEvent));
      mount.open();
      await tick();
      assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
      delay.resolve(sdk); await mount.ready; await tick();
      const host = document.querySelector<HTMLElement>("[data-elozi-widget]");
      assert.ok(host?.shadowRoot);
      const panel = host.shadowRoot.getElementById("widget-panel")!;
      assert.equal(panel.hidden, false, "The hero intent must open after readiness");
      assert.deepEqual(calls, { creations: 1, opens: 1 }, "All pending opens coalesce exactly once");
      assert.equal(listeners.size, 1);
      mount.close(); await tick();
      assert.equal(panel.hidden, true, "Consumed intent must not reopen a closed panel");
      window.dispatchEvent(new window.Event(openChatEvent));
      window.dispatchEvent(new window.Event(openChatEvent));
      assert.equal(document.querySelector("[data-elozi-widget]"), host);
      assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
      assert.equal(panel.hidden, false);
      assert.deepEqual(calls, { creations: 1, opens: 3 });
      assert.equal(requests.length, 1, "Opening must not refetch config or start a conversation");
      mount.destroy(); mount.destroy();
      assert.equal(listeners.size, 0);
      window.dispatchEvent(new window.Event(openChatEvent)); mount.open(); mount.close();
      assert.equal(calls.opens, 3);
      assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
    } finally { mount.destroy(); await window.happyDOM.abort(); }
  });
}
test("closing during SDK loading cancels the queued public open intent", async () => {
  const { window, document } = fixture(), delay = deferred<EloziSdk>();
  const { sdk, calls } = await observedSdk();
  const mount = mountEloziWidget(config, { document, window, loadSdk: () => delay.promise });
  try {
    window.dispatchEvent(new window.Event(openChatEvent)); mount.open(); mount.close();
    delay.resolve(sdk); await mount.ready;
    const panel = document.querySelector<HTMLElement>("[data-elozi-widget]")!.shadowRoot!.getElementById("widget-panel")!;
    assert.equal(panel.hidden, true); assert.deepEqual(calls, { creations: 1, opens: 0 });
    window.dispatchEvent(new window.Event(openChatEvent));
    assert.equal(panel.hidden, false); assert.equal(calls.opens, 1);
  } finally { mount.destroy(); await window.happyDOM.abort(); }
});
test("cancelled early intent and late import cannot touch the replacement locale/channel owner", async () => {
  const { window, document, requests } = fixture(), listeners = chatListeners(window);
  const stale = deferred<EloziSdk>(), current = deferred<EloziSdk>(), { sdk, calls } = await observedSdk();
  const oldStates: string[] = [], newStates: string[] = [];
  const old = mountEloziWidget(config, { document, window, loadSdk: () => stale.promise, onState: state => oldStates.push(state) });
  let fresh: ReturnType<typeof mountEloziWidget> | undefined;
  try {
    window.dispatchEvent(new window.Event(openChatEvent)); await tick(); old.destroy(); old.destroy();
    // Cancellation settles even if the module/network never resolves.
    await old.ready; assert.equal(listeners.size, 0);
    fresh = mountEloziWidget({ ...config, locale: "en", channelId: "replacement_test_channel" }, {
      document, window, loadSdk: () => current.promise, onState: state => newStates.push(state),
    });
    window.dispatchEvent(new window.Event(openChatEvent));
    stale.resolve(sdk); await tick();
    assert.deepEqual(calls, { creations: 0, opens: 0 });
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
    current.resolve(sdk); await fresh.ready; await tick();
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
    const host = document.querySelector<HTMLElement>("[data-elozi-widget]")!;
    assert.equal(host.lang, "en"); assert.equal(host.shadowRoot!.getElementById("widget-panel")!.hidden, false);
    assert.deepEqual(calls, { creations: 1, opens: 1 });
    assert.deepEqual(oldStates, []); assert.deepEqual(newStates, ["ready"]); assert.equal(listeners.size, 1);
    assert.ok(requests.every(({ url }) => url.includes("/replacement_test_channel/config")));
    old.open(); old.close(); old.destroy(); assert.equal(listeners.size, 1);
    fresh.close(); window.dispatchEvent(new window.Event(openChatEvent));
    assert.equal(calls.opens, 2); assert.equal(host.shadowRoot!.getElementById("widget-panel")!.hidden, false);
  } finally { old.destroy(); fresh?.destroy(); assert.equal(listeners.size, 0); await window.happyDOM.abort(); }
});
test("unmount before the loader microtask drops queued intent rather than replaying it into a new owner", async () => {
  const { window, document } = fixture(), listeners = chatListeners(window), { sdk, calls } = await observedSdk();
  let loads = 0;
  const old = mountEloziWidget(config, { document, window, loadSdk: async () => { loads++; return sdk; } });
  window.dispatchEvent(new window.Event(openChatEvent)); old.open(); old.destroy(); await old.ready;
  assert.equal(loads, 0); assert.equal(listeners.size, 0);
  const fresh = mountEloziWidget({ ...config, locale: "en" }, { document, window, loadSdk: async () => sdk });
  try {
    await fresh.ready;
    assert.deepEqual(calls, { creations: 1, opens: 0 });
    const panel = document.querySelector<HTMLElement>("[data-elozi-widget]")!.shadowRoot!.getElementById("widget-panel")!;
    assert.equal(panel.hidden, true, "A new locale must not inherit the disposed owner's intent");
    window.dispatchEvent(new window.Event(openChatEvent)); assert.equal(panel.hidden, false);
  } finally { fresh.destroy(); await window.happyDOM.abort(); }
});
test("duplicate owners neither add a public listener nor remove the current owner's listener", async () => {
  const { window, document } = fixture(), listeners = chatListeners(window), { sdk, calls } = await observedSdk();
  const first = mountEloziWidget(config, { document, window, loadSdk: async () => sdk }); await first.ready;
  const states: string[] = []; let duplicateLoads = 0;
  const second = mountEloziWidget({ ...config, channelId: "other_isolated_channel" }, {
    document, window, onState: s => states.push(s), loadSdk: async () => { duplicateLoads++; return sdk; },
  });
  try {
    await second.ready; assert.equal(listeners.size, 1); second.open(); second.destroy();
    assert.deepEqual(states, ["unavailable"]); assert.equal(duplicateLoads, 0);
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
    assert.equal(listeners.size, 1);
    window.dispatchEvent(new window.Event(openChatEvent));
    assert.deepEqual(calls, { creations: 1, opens: 1 });
  } finally { second.destroy(); first.destroy(); assert.equal(listeners.size, 0); await window.happyDOM.abort(); }
});
for (const failure of ["rejection", "timeout", "factory", "queued-open"] as const) {
  test(`${failure} with early hero intent cleans up and never opens a later retry owner`, async () => {
    const { window, document } = fixture(), listeners = chatListeners(window), { sdk, calls } = await observedSdk();
    const delayed = deferred<EloziSdk>(), states: string[] = [];
    if (failure === "timeout") {
      const schedule = window.setTimeout.bind(window);
      window.setTimeout = ((handler: TimerHandler, ms?: number, ...args: unknown[]) =>
        schedule(handler, ms === 10_000 ? 0 : ms, ...args)) as typeof window.setTimeout;
    }
    const loadSdk = async (): Promise<EloziSdk> => {
      if (failure === "rejection") throw new Error("isolated offline loader");
      if (failure === "timeout") return delayed.promise;
      return {
        createWebchatWidget(options) {
          if (failure === "factory") throw new Error("isolated factory failure");
          const widget = sdk.createWebchatWidget(options);
          widget.open = () => { throw new Error("isolated queued-open failure"); };
          return widget;
        },
      };
    };
    const failed = mountEloziWidget(config, { document, window, loadSdk, onState: s => states.push(s) });
    let retry: ReturnType<typeof mountEloziWidget> | undefined;
    try {
      window.dispatchEvent(new window.Event(openChatEvent)); assert.equal(listeners.size, 1);
      await failed.ready;
      assert.deepEqual(states, ["unavailable"]); assert.equal(listeners.size, 0);
      assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
      window.dispatchEvent(new window.Event(openChatEvent)); failed.open(); failed.close(); failed.destroy();
      retry = mountEloziWidget(config, { document, window, loadSdk: async () => sdk }); await retry.ready;
      const host = document.querySelector<HTMLElement>("[data-elozi-widget]")!;
      const panel = host.shadowRoot!.getElementById("widget-panel")!;
      assert.equal(panel.hidden, true, "The failed owner's intent must not leak into retry");
      const count = { ...calls };
      delayed.resolve(sdk); await tick();
      assert.deepEqual(calls, count, "Late timed-out resolution must remain cancelled");
      assert.equal(document.querySelector("[data-elozi-widget]"), host);
      window.dispatchEvent(new window.Event(openChatEvent));
      assert.equal(panel.hidden, false); assert.equal(calls.opens, count.opens + 1);
      assert.equal(listeners.size, 1);
    } finally { failed.destroy(); retry?.destroy(); assert.equal(listeners.size, 0); await window.happyDOM.abort(); }
  });
}
test("SDK request in flight is aborted and stale response cannot revive a destroyed host", async () => {
  const { window, document } = fixture(); const delayed = deferred<Response>(); let signal: AbortSignal | undefined;
  window.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => { signal = init?.signal ?? undefined; return delayed.promise; }) as typeof fetch;
  const mount = mountEloziWidget(config, { document, window }); await mount.ready;
  assert.equal(signal?.aborted, false); mount.destroy(); assert.equal(signal?.aborted, true);
  delayed.resolve(new Response(JSON.stringify({ widget: { displayName: "Stale brand" } }), { status: 200 }));
  await tick(); assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
  await window.happyDOM.abort();
});
test("React SSR without public config never loads or enables chat; safe PT/EN contact only", () => {
  assert.equal(renderToStaticMarkup(React.createElement(EloziChat, {})), "");
  for (const locale of ["pt", "en"] as const) {
    const html = renderToStaticMarkup(React.createElement(EloziChat, { locale, whatsappUrl: "https://wa.me/5511999999999" }));
    assert.ok(html.includes(eloziCopy(locale).launcher)); assert.ok(html.includes("noopener noreferrer")); assert.ok(!html.includes("Nora"));
  }
  assert.equal(renderToStaticMarkup(React.createElement(EloziChat, { whatsappUrl: "https://evil.test" })), "");
});
test("actual React StrictMode, rerenders, locale/config change and unmount use real SDK once", async () => {
  const { window, document, requests } = fixture(), listeners = chatListeners(window);
  const names = ["window", "document", "HTMLElement", "Element", "Node", "MutationObserver", "IS_REACT_ACT_ENVIRONMENT"];
  const previous = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  let root: Root | undefined;
  try {
    for (const name of names) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value: name === "IS_REACT_ACT_ENVIRONMENT" ? true : Reflect.get(window, name) });
    const container = document.createElement("main"); document.body.append(container); root = createRoot(container);
    const render = (props: EloziPublicConfig) => React.createElement(React.StrictMode, null, React.createElement(EloziChat, { ...props, key: props.locale ?? "pt" }));
    await act(async () => { root!.render(render(config)); await tick(); await tick(); });
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1); assert.equal(listeners.size, 1);
    const ptHost = document.querySelector<HTMLElement>("[data-elozi-widget]");
    const ptPanel = ptHost!.shadowRoot!.getElementById("widget-panel")!;
    window.dispatchEvent(new window.Event("je4ndev:open-nora")); assert.equal(ptPanel.hidden, true);
    window.dispatchEvent(new window.Event(openChatEvent)); assert.equal(ptPanel.hidden, false);
    const count = requests.length;
    await act(async () => { root!.render(render(config)); await tick(); });
    assert.equal(document.querySelector("[data-elozi-widget]"), ptHost); assert.equal(requests.length, count);
    assert.equal(listeners.size, 1); assert.equal(ptPanel.hidden, false);
    await act(async () => { root!.render(render({ ...config, locale: "en" })); await tick(); await tick(); });
    assert.equal(ptHost?.isConnected, false);
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1); assert.equal(listeners.size, 1);
    assert.equal(document.querySelector<HTMLElement>("[data-elozi-widget]")?.lang, "en");
    const enPanel = document.querySelector<HTMLElement>("[data-elozi-widget]")!.shadowRoot!.getElementById("widget-panel")!;
    assert.equal(enPanel.hidden, true);
    window.dispatchEvent(new window.Event(openChatEvent)); assert.equal(enPanel.hidden, false);
    await act(async () => { root!.render(render({ ...config, apiOrigin: "http://localhost" })); await tick(); });
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0); assert.equal(listeners.size, 0);
    window.dispatchEvent(new window.Event(openChatEvent));
    await act(async () => { root!.unmount(); }); root = undefined;
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0); assert.equal(listeners.size, 0);
  } finally {
    if (root) await act(async () => { root!.unmount(); });
    for (const [name, descriptor] of previous) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else Reflect.deleteProperty(globalThis, name); }
    await window.happyDOM.abort();
  }
});

for (const locale of ["pt-BR", "en"] as const) {
  test(`real anonymous SDK session keeps capability out of DOM/storage in ${locale}`, async () => {
    const { window, document } = fixture();
    const bodies: { url: string; body: Record<string, unknown> }[] = [];
    const syntheticCapability = "t".repeat(43);
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      bodies.push({ url, body: JSON.parse(String(init?.body)) });
      const result = url.endsWith("/challenge") ? { challenge: "isolated-test-challenge" }
        : url.endsWith("/session") ? { token: syntheticCapability, expiresAt: new Date(Date.now() + 60_000).toISOString() }
        : url.endsWith("/history") ? { messages: [], nextCursor: null, hasMore: false }
        : {};
      return new Response(JSON.stringify(result), { status: 200 });
    }) as typeof fetch;
    const mount = mountEloziWidget({ ...config, locale }, { document, window });
    try {
      await mount.ready; mount.open();
      const shadow = document.querySelector<HTMLElement>("[data-elozi-widget]")!.shadowRoot!;
      (shadow.getElementById("widget-name") as HTMLInputElement).value = "Isolated visitor";
      shadow.getElementById("widget-intro")!.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
      await tick(); await tick();
      assert.equal(bodies.find(({ url }) => url.endsWith("/session"))?.body.locale, locale);
      assert.equal(bodies.find(({ url }) => url.endsWith("/history"))?.body.token, syntheticCapability);
      assert.ok(!shadow.innerHTML.includes(syntheticCapability));
      assert.ok(!document.documentElement.outerHTML.includes(syntheticCapability));
      assert.equal(window.localStorage.length, 0); assert.equal(window.sessionStorage.length, 0);
    } finally { mount.destroy(); await window.happyDOM.abort(); }
  });
}

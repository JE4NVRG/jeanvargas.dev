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
// not a stand-in createWebchatWidget. Install happy-dom only in an owned scratch
// dir; set ELOZI_TEST_DOM_DIR to it (no package/lockfile changes in this checkout).
const requireDom = createRequire(join(process.env.ELOZI_TEST_DOM_DIR ?? process.cwd(), "package.json"));
const { Window: DomWindow } = requireDom("happy-dom") as {
  Window: new (options: { url: string }) => Window & typeof globalThis & { happyDOM: { abort(): Promise<void> } };
};
const config = { apiOrigin: "https://elozi.je4ndev.com", tenantId: "isolated_test_tenant", channelId: "isolated_test_channel" };
const tick = () => new Promise<void>(resolve => setImmediate(resolve));
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
  assert.equal(resolveEloziConfig({}), null);
  assert.equal(resolveEloziConfig(config)?.locale, "pt-BR");
  assert.equal(resolveEloziConfig({ ...config, locale: "pt" })?.locale, "pt-BR");
  assert.equal(resolveEloziConfig({ ...config, locale: "en" })?.locale, "en");
  assert.equal(eloziCopy("pt").launcher, "Fale com a JE4NDEV");
  assert.equal(eloziCopy("en").launcher, "Chat with JE4NDEV");
});
test("HTTP, credentials, paths, query, fragments and malformed identifiers fail closed", async () => {
  const { window, document, requests } = fixture();
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
test("cancelled delayed import cannot mount after unmount; new owner mounts exactly once", async () => {
  const { window, document, requests } = fixture();
  const delay = deferred<EloziSdk>();
  const old = mountEloziWidget(config, { document, window, loadSdk: () => delay.promise });
  await tick(); old.destroy(); old.destroy();
  // Cancellation must settle even if the module/network never resolves.
  await old.ready;
  const fresh = mountEloziWidget({ ...config, locale: "en" }, { document, window });
  await fresh.ready;
  const count = requests.length;
  delay.resolve(await loadEloziSdk()); await old.ready; await tick();
  assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
  assert.equal(document.querySelector<HTMLElement>("[data-elozi-widget]")?.lang, "en");
  assert.equal(requests.length, count);
  fresh.destroy(); await window.happyDOM.abort();
});
test("duplicate owners fail closed without destroying the first real widget", async () => {
  const { window, document } = fixture();
  const first = mountEloziWidget(config, { document, window }); await first.ready;
  const states: string[] = [];
  const second = mountEloziWidget({ ...config, channelId: "other_isolated_channel" }, { document, window, onState: s => states.push(s) });
  await second.ready; second.destroy();
  assert.deepEqual(states, ["unavailable"]);
  assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
  first.destroy(); await window.happyDOM.abort();
});
test("loader rejection releases ownership and offers unavailable state, not success", async () => {
  const { window, document, requests } = fixture(); const states: string[] = [];
  const failed = mountEloziWidget(config, { document, window, loadSdk: async () => { throw new Error("isolated offline loader"); }, onState: s => states.push(s) });
  await failed.ready; failed.destroy();
  assert.deepEqual(states, ["unavailable"]); assert.equal(requests.length, 0);
  const retry = mountEloziWidget(config, { document, window }); await retry.ready;
  assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
  retry.destroy(); await window.happyDOM.abort();
});
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
  const { window, document, requests } = fixture();
  const names = ["window", "document", "HTMLElement", "Element", "Node", "MutationObserver", "IS_REACT_ACT_ENVIRONMENT"];
  const previous = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  let root: Root | undefined;
  try {
    for (const name of names) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value: name === "IS_REACT_ACT_ENVIRONMENT" ? true : Reflect.get(window, name) });
    const container = document.createElement("main"); document.body.append(container); root = createRoot(container);
    const render = (props: EloziPublicConfig) => React.createElement(React.StrictMode, null, React.createElement(EloziChat, props));
    await act(async () => { root!.render(render(config)); await tick(); await tick(); });
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
    const ptHost = document.querySelector("[data-elozi-widget]");
    const count = requests.length;
    await act(async () => { root!.render(render(config)); await tick(); });
    assert.equal(document.querySelector("[data-elozi-widget]"), ptHost); assert.equal(requests.length, count);
    await act(async () => { root!.render(render({ ...config, locale: "en" })); await tick(); await tick(); });
    assert.equal(ptHost?.isConnected, false);
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 1);
    assert.equal(document.querySelector<HTMLElement>("[data-elozi-widget]")?.lang, "en");
    await act(async () => { root!.render(render({ ...config, apiOrigin: "http://localhost" })); await tick(); });
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
    await act(async () => { root!.unmount(); }); root = undefined;
    assert.equal(document.querySelectorAll("[data-elozi-widget]").length, 0);
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

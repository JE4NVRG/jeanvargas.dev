import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import React, { act } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import ts from "typescript";
import { useStudioMotionPreferences } from "../../components/ui/studio-motion-provider";
import { LanguageContext, type Locale } from "../../i18n/provider";
import { en } from "../../i18n/translations/en";
import { pt } from "../../i18n/translations/pt";
import { useTranslation } from "../../i18n/use-translation";
import { shouldLoadStudioMedia } from "../studio-motion-policy";
import * as adapter from "./elozi-widget";
import type { EloziChatProps } from "../../components/communication/elozi-chat";

const requireDom = createRequire(join(process.env.ELOZI_TEST_DOM_DIR ?? process.cwd(), "package.json"));
const { Window: DomWindow } = requireDom("happy-dom") as {
  Window: new (options: { url: string; width: number }) => Window & typeof globalThis & { happyDOM: { abort(): Promise<void> } };
};
const rootPath = fileURLToPath(new URL("../../../", import.meta.url));
const publicConfig = { apiOrigin: "https://elozi.je4ndev.com", tenantId: "hero_fixture_tenant", channelId: "hero_fixture_channel" };
const agencyContact = "https://wa.me/5511999999999";
const tick = () => new Promise<void>(resolve => setImmediate(resolve));
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

/** Execute current TSX with real React/hooks and the production adapter. Only
 * unrelated Next image/media/CSS/product shell is isolated. The adapter seam
 * adds loadSdk delays/failures to the real mount; it never substitutes a widget.
 * This is DOM-isolated caller integration, not a browser/backend acceptance test.
 */
function loadComponent<T>(relativePath: string, imports: Record<string, unknown>, window: Window & typeof globalThis): T {
  const path = join(rootPath, relativePath), source = readFileSync(path, "utf8");
  const compiled = ts.transpileModule(source, {
    fileName: path,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    reportDiagnostics: true,
  });
  assert.deepEqual(compiled.diagnostics, []);
  const exports: Record<string, T> = {};
  runInNewContext(compiled.outputText, {
    exports, window, document: window.document, Event: window.Event, HTMLElement: window.HTMLElement,
    require: (name: string) => {
      assert.ok(Object.hasOwn(imports, name), `Unexpected caller import: ${name}`);
      return imports[name];
    },
  }, { filename: path, timeout: 1_000 });
  const component = Object.values(exports)[0];
  assert.equal(typeof component, "function");
  return component;
}
function loadHero(window: Window & typeof globalThis) {
  const empty = () => null;
  return loadComponent<React.ComponentType>("src/components/sections/hero.tsx", {
    "react": React, "react/jsx-runtime": jsxRuntime,
    "next/dynamic": { default: () => function HeroSculptureStub() { return null; } },
    "next/image": { default: empty },
    "lucide-react": { ArrowDown: empty, ArrowUpRight: empty, MessageCircle: empty, Sparkles: empty },
    "@/components/ui/hero-sculpture-fallback": { HeroSculptureFallback: empty },
    "@/components/ui/studio-motion-provider": { useStudioMotionPreferences },
    "@/lib/studio-motion-policy": { shouldLoadStudioMedia },
    "@/components/ui/button-classes": { btnPrimary: "fixture-primary", btnSecondary: "fixture-secondary" },
    "@/data/product-presentation": { getProductPresentation: () => { throw new Error("No product cards in this focused fixture"); } },
    "@/data/flagships": { FLAGSHIP_SLUGS: [] }, "@/data/projects": { projects: [] },
    "@/i18n": { useTranslation }, "@/data/company": { COMPANY: { whatsappUrl: agencyContact } },
    "@/lib/contact-email": { contactEmailHref: () => "mailto:hero-fixture@example.test" },
    "@/lib/communication/elozi-widget": adapter,
    "./brand-hero.module.css": { default: { nora: "fixture-existing-chat-style" } },
  }, window);
}
function loadChat(window: Window & typeof globalThis, loadSdk: () => Promise<adapter.EloziSdk>, mounts: adapter.EloziMount[]) {
  return loadComponent<React.ComponentType<EloziChatProps>>("src/components/communication/elozi-chat.tsx", {
    "react": React, "react/jsx-runtime": jsxRuntime,
    "../../lib/communication/elozi-widget": {
      ...adapter,
      mountEloziWidget(config: adapter.EloziPublicConfig, options: Parameters<typeof adapter.mountEloziWidget>[1]) {
        const mount = adapter.mountEloziWidget(config, { ...options, loadSdk });
        mounts.push(mount);
        return mount;
      },
    },
  }, window);
}
async function fixture() {
  const window = new DomWindow({ url: "https://portfolio.example.test/pt", width: 360 });
  const document = window.document, requests: string[] = [];
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    requests.push(String(input));
    assert.equal(init?.credentials, "omit");
    assert.match(String(input), /\/api\/public\/webchat\/hero_fixture_tenant\/hero_fixture_channel\/config$/);
    return new Response(JSON.stringify({ widget: { displayName: "Isolated brand" } }), { status: 200 });
  }) as typeof fetch;
  const globalNames = ["window", "document", "navigator", "HTMLElement", "Element", "Node", "MutationObserver", "IS_REACT_ACT_ENVIRONMENT"];
  const previous = new Map(globalNames.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  for (const name of globalNames) Object.defineProperty(globalThis, name, {
    configurable: true, writable: true, value: name === "IS_REACT_ACT_ENVIRONMENT" ? true : Reflect.get(window, name),
  });
  const container = document.createElement("main"); document.body.append(container);
  const root = createRoot(container), Hero = loadHero(window);
  let legacyEvents = 0, chatEvents = 0;
  window.addEventListener("je4ndev:open-nora", () => { legacyEvents++; });
  window.addEventListener(adapter.ELOZI_OPEN_CHAT_EVENT, () => { chatEvents++; });
  const tree = (locale: Locale, chat?: React.ReactNode) => React.createElement(React.StrictMode, null,
    React.createElement(LanguageContext.Provider, {
      value: { locale, t: (locale === "pt" ? pt : en) as typeof en, toggleLocale: () => {} },
    }, React.createElement(Hero), chat));
  return {
    window, document, root, requests, tree,
    get legacyEvents() { return legacyEvents; }, get chatEvents() { return chatEvents; },
    button() {
      const button = container.querySelector<HTMLButtonElement>('[data-cta="hero-nora-demo"]');
      assert.ok(button); assert.equal(button.type, "button");
      assert.equal(button.className, "fixture-existing-chat-style");
      assert.equal(button.hasAttribute("data-analytics-event"), false, "Do not change the existing analytics contract");
      return button;
    },
    async destroy() {
      await act(async () => { root.unmount(); });
      for (const [name, descriptor] of previous) {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor); else Reflect.deleteProperty(globalThis, name);
      }
      await window.happyDOM.abort();
    },
  };
}

for (const locale of ["pt", "en"] as const) {
  test(`actual ${locale} hero button queues early intent then opens only the mounted SDK host`, async () => {
    const f = await fixture(), delay = deferred<adapter.EloziSdk>();
    const mount = adapter.mountEloziWidget({ ...publicConfig, locale }, { document: f.document, window: f.window, loadSdk: () => delay.promise });
    try {
      await act(async () => { f.root.render(f.tree(locale)); });
      const button = f.button();
      assert.equal(button.textContent, locale === "pt" ? "Fale com a JE4NDEV" : "Chat with JE4NDEV");
      assert.doesNotMatch(button.textContent ?? "", /Nora|AI assistant|assistente de IA/i);
      assert.equal(f.document.querySelectorAll("[data-elozi-widget]").length, 0);
      await act(async () => { button.click(); button.click(); });
      delay.resolve(await adapter.loadEloziSdk()); await mount.ready; await tick();
      const host = f.document.querySelector<HTMLElement>("[data-elozi-widget]")!;
      assert.ok(host?.shadowRoot); assert.equal(host.lang, locale === "en" ? "en" : "pt-BR");
      const panel = host.shadowRoot.getElementById("widget-panel")!;
      assert.equal(panel.hidden, false);
      mount.close(); assert.equal(panel.hidden, true);
      await act(async () => { button.click(); button.click(); });
      assert.equal(panel.hidden, false); assert.equal(f.document.querySelector("[data-elozi-widget]"), host);
      assert.equal(f.document.querySelectorAll("[data-elozi-widget]").length, 1);
      assert.equal(f.requests.length, 1); assert.equal(f.chatEvents, 4); assert.equal(f.legacyEvents, 0);
    } finally { mount.destroy(); await f.destroy(); }
  });
}

test("actual hero + EloziChat StrictMode locale remount discards stale pending intent and module resolution", async () => {
  const f = await fixture(), stale = deferred<adapter.EloziSdk>(), current = deferred<adapter.EloziSdk>();
  const mounts: adapter.EloziMount[] = [];
  let load = stale;
  const Chat = loadChat(f.window, () => load.promise, mounts);
  const chat = (locale: Locale, enabled = true) => React.createElement(Chat, {
    ...publicConfig, locale, key: locale, apiOrigin: enabled ? publicConfig.apiOrigin : "http://invalid.example.test", whatsappUrl: agencyContact,
  });
  try {
    await act(async () => { f.root.render(f.tree("pt", chat("pt"))); await tick(); });
    await act(async () => { f.button().click(); });
    load = current;
    await act(async () => { f.root.render(f.tree("en", chat("en"))); await tick(); });
    stale.resolve(await adapter.loadEloziSdk()); await tick();
    assert.equal(f.document.querySelectorAll("[data-elozi-widget]").length, 0);
    current.resolve(await adapter.loadEloziSdk());
    await act(async () => { await mounts[mounts.length - 1].ready; await tick(); });
    const host = f.document.querySelector<HTMLElement>("[data-elozi-widget]")!;
    const panel = host.shadowRoot!.getElementById("widget-panel")!;
    assert.equal(host.lang, "en"); assert.equal(panel.hidden, true, "The old hero intent must not survive a locale remount");
    assert.equal(f.button().textContent, "Chat with JE4NDEV");
    await act(async () => { f.button().click(); }); assert.equal(panel.hidden, false);
    const requestCount = f.requests.length;
    await act(async () => { f.root.render(f.tree("en", chat("en"))); await tick(); });
    assert.equal(f.document.querySelector("[data-elozi-widget]"), host); assert.equal(f.requests.length, requestCount);
    await act(async () => { f.root.render(f.tree("en", chat("en", false))); await tick(); });
    assert.equal(host.isConnected, false); assert.equal(f.document.querySelectorAll("[data-elozi-widget]").length, 0);
    await act(async () => { f.button().click(); });
    assert.equal(f.document.querySelectorAll("[data-elozi-widget]").length, 0);
    const fallback = f.document.querySelector<HTMLAnchorElement>("aside a");
    assert.equal(fallback?.href, agencyContact); assert.equal(f.legacyEvents, 0);
  } finally { await f.destroy(); for (const mount of mounts) mount.destroy(); }
});

for (const locale of ["pt", "en"] as const) {
  test(`actual ${locale} hero loading failure shows honest unavailable state and explicit agency fallback`, async () => {
    const f = await fixture(), failure = deferred<adapter.EloziSdk>(), mounts: adapter.EloziMount[] = [];
    const Chat = loadChat(f.window, async () => { await failure.promise; throw new Error("isolated SDK unavailable"); }, mounts);
    try {
      const chat = React.createElement(Chat, { ...publicConfig, locale, whatsappUrl: agencyContact });
      await act(async () => { f.root.render(f.tree(locale, chat)); await tick(); });
      await act(async () => { f.button().click(); });
      failure.resolve(await adapter.loadEloziSdk());
      await act(async () => { await mounts[mounts.length - 1].ready; await tick(); });
      assert.equal(f.document.querySelector('[role="status"]')?.textContent, adapter.eloziCopy(locale).unavailable);
      const fallback = f.document.querySelector<HTMLAnchorElement>("aside a");
      assert.equal(fallback?.href, agencyContact); assert.equal(fallback?.textContent, adapter.eloziCopy(locale).contact);
      assert.equal(fallback?.rel, "noopener noreferrer"); assert.equal(fallback?.referrerPolicy, "no-referrer");
      assert.equal(f.document.querySelectorAll("[data-elozi-widget]").length, 0); assert.equal(f.requests.length, 0);
      await act(async () => { f.button().click(); f.button().click(); });
      assert.equal(f.document.querySelector('[role="status"]')?.textContent, adapter.eloziCopy(locale).unavailable);
      assert.equal(f.document.querySelectorAll("[data-elozi-widget]").length, 0); assert.equal(f.legacyEvents, 0);
    } finally { await f.destroy(); for (const mount of mounts) mount.destroy(); }
  });
}

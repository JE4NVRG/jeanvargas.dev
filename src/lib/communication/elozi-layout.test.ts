import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { EloziChat, type EloziChatProps } from "../../components/communication/elozi-chat";
import { eloziCopy, resolveEloziConfig, resolveWhatsAppUrl } from "./elozi-widget";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const layoutPath = join(root, "src/app/[locale]/layout.tsx");
const source = readFileSync(layoutPath, "utf8");
const ast = ts.createSourceFile(layoutPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const agency = {
  apiOrigin: "https://elozi.je4ndev.com",
  tenantId: "499f0367-4860-4fd1-98b3-3b1c90883a2f",
  channelId: "9266559b-cf66-4c0c-bca6-7edb7278624b",
  whatsappUrl: "https://wa.me/5511914826568",
} as const;

type Layout = (props: { children: React.ReactNode; params: Promise<{ locale: string }> }) => Promise<React.ReactElement>;
const shell = {
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
  Navbar: () => null,
  Footer: () => null,
  PortfolioAnalytics: () => null,
  UmamiAnalytics: () => null,
};

/** Execute the real async layout JSX, isolating only unrelated Next/font/CSS/shell
 * imports. EloziChat, React and the public config validators are never replaced.
 * No DOM effects, SDK transport, customer messages or real contact requests run.
 */
function loadLayout(): Layout {
  const imports: Record<string, unknown> = {
    "react/jsx-runtime": jsxRuntime,
    "next/font/google": {
      Geist: ({ variable }: { variable: string }) => ({ variable }),
      Geist_Mono: ({ variable }: { variable: string }) => ({ variable }),
    },
    "next/navigation": { notFound: () => { throw new Error("layout-not-found"); } },
    "@/i18n": { LanguageProvider: shell.LanguageProvider },
    "@/components/layout/navbar": { Navbar: shell.Navbar },
    "@/components/layout/footer": { Footer: shell.Footer },
    "@/components/analytics/portfolio-analytics": { PortfolioAnalytics: shell.PortfolioAnalytics },
    "@/components/analytics/umami-analytics": { UmamiAnalytics: shell.UmamiAnalytics },
    "@/components/communication/elozi-chat": { EloziChat },
    "@/data/company": { COMPANY: { whatsappDisplay: "isolated fixture" } },
    "@/data/services": { serviceOffers: [] },
    "../globals.css": {},
  };
  const compiled = ts.transpileModule(source, {
    fileName: layoutPath,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    reportDiagnostics: true,
  });
  assert.deepEqual(compiled.diagnostics, []);
  const exports: { default?: Layout } = {};
  runInNewContext(compiled.outputText, {
    exports,
    require: (name: string) => {
      assert.ok(Object.hasOwn(imports, name), `Unexpected global layout import: ${name}`);
      return imports[name];
    },
  }, { filename: layoutPath, timeout: 1_000 });
  assert.equal(typeof exports.default, "function");
  return exports.default!;
}

function nodes(file: ts.SourceFile, predicate: (node: ts.Node) => boolean): ts.Node[] {
  const found: ts.Node[] = [];
  function visit(node: ts.Node) {
    if (predicate(node)) found.push(node);
    ts.forEachChild(node, visit);
  }
  visit(file);
  return found;
}

function elements(tree: React.ReactNode): React.ReactElement<Record<string, unknown>>[] {
  const found: React.ReactElement<Record<string, unknown>>[] = [];
  React.Children.forEach(tree, child => {
    if (!React.isValidElement<Record<string, unknown>>(child)) return;
    found.push(child);
    found.push(...elements(child.props.children as React.ReactNode));
  });
  return found;
}

function appLayouts(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? appLayouts(path) : /^layout\.(tsx?|jsx?)$/.test(entry.name) ? [path] : [];
  });
}

test("root layout imports the existing EloziChat adapter and contains exactly one mount", () => {
  const imports = nodes(ast, node => ts.isImportDeclaration(node)
    && node.moduleSpecifier.getText(ast) === '"@/components/communication/elozi-chat"');
  assert.equal(imports.length, 1);
  const imported = (imports[0] as ts.ImportDeclaration).importClause?.namedBindings;
  assert.ok(imported && ts.isNamedImports(imported));
  assert.deepEqual(imported.elements.map(entry => entry.getText(ast)), ["EloziChat"]);
  const mounts = nodes(ast, node => (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node))
    && node.tagName.getText(ast) === "EloziChat");
  assert.equal(mounts.length, 1);
  const attributes = (mounts[0] as ts.JsxSelfClosingElement).attributes.properties;
  const explicitAttributes = attributes.filter(ts.isJsxAttribute);
  assert.equal(explicitAttributes.length, attributes.length, "Global config must be explicit, not spread or inferred");
  assert.deepEqual(explicitAttributes.map(attribute => attribute.name.getText(ast)).sort(),
    ["apiOrigin", "channelId", "key", "locale", "tenantId", "whatsappUrl"]);
});

for (const locale of ["pt", "en"] as const) {
  test(`async ${locale} root mounts one real adapter with exact authorized agency config`, async () => {
    const tree = await loadLayout()({ children: React.createElement("main", null, "isolated page"), params: Promise.resolve({ locale }) });
    const all = elements(tree);
    const mounts = all.filter(element => element.type === EloziChat);
    assert.equal(mounts.length, 1);
    const mount = mounts[0];
    assert.equal(mount.key, locale, "A locale transition must replace the previous owner");
    // JSX props can have a VM-realm prototype; compare their exact own fields.
    assert.deepEqual({ ...mount.props }, { ...agency, locale });
    const props = mount.props as EloziChatProps;
    assert.deepEqual(resolveEloziConfig(props), {
      apiOrigin: agency.apiOrigin, tenantId: agency.tenantId, channelId: agency.channelId,
      locale: locale === "pt" ? "pt-BR" : "en",
    });
    assert.equal(resolveWhatsAppUrl(props.whatsappUrl), agency.whatsappUrl);
    assert.equal(all.find(element => element.type === "html")?.props.lang, locale === "pt" ? "pt-BR" : "en");
    assert.equal(all.find(element => element.type === shell.LanguageProvider)?.props.locale, locale);
  });

  test(`${locale} global adapter SSR uses localized copy and agency WhatsApp, never Nora`, async () => {
    const tree = await loadLayout()({ children: null, params: Promise.resolve({ locale }) });
    const mount = elements(tree).find(element => element.type === EloziChat);
    assert.ok(mount);
    const html = renderToStaticMarkup(mount);
    assert.ok(html.includes(eloziCopy(locale).launcher));
    assert.ok(html.includes(eloziCopy(locale).contact));
    assert.ok(html.includes(`lang="${locale === "pt" ? "pt-BR" : "en"}"`));
    assert.ok(html.includes(`href="${agency.whatsappUrl}"`));
    assert.ok(html.includes('rel="noopener noreferrer"'));
    assert.ok(html.includes('referrerPolicy="no-referrer"'));
    assert.doesNotMatch(html, /Nora|PortfolioConcierge|7047|\/api\/concierge/i);
  });
}

test("unsupported locale fails before rendering the global adapter", async () => {
  const layout = loadLayout();
  for (const locale of ["es", "", "pt-BR", "EN"]) {
    await assert.rejects(() => layout({ children: null, params: Promise.resolve({ locale }) }), /layout-not-found/);
  }
});

test("global layout preserves the surrounding provider, analytics, navigation and page", async () => {
  const page = React.createElement("main", { id: "isolated-child" });
  const tree = await loadLayout()({ children: page, params: Promise.resolve({ locale: "pt" }) });
  const all = elements(tree);
  const provider = all.find(element => element.type === shell.LanguageProvider);
  assert.ok(provider);
  const children = React.Children.toArray(provider.props.children as React.ReactNode);
  assert.deepEqual(children.filter(React.isValidElement).map(child => child.type),
    [shell.PortfolioAnalytics, shell.UmamiAnalytics, shell.Navbar, "main", shell.Footer, EloziChat]);
  assert.ok(all.some(element => element.type === "main" && element.props.id === "isolated-child"));
  assert.ok(all.some(element => element.type === "body"));
  assert.ok(all.some(element => element.type === "script" && element.props.type === "application/ld+json"));
  assert.ok(!ast.statements.some(statement => ts.isExpressionStatement(statement)
    && ts.isStringLiteral(statement.expression) && statement.expression.text === "use client"));
});

test("all global layouts exclude legacy Nora imports/mounts and duplicate raw SDK ownership", () => {
  let globalMounts = 0;
  for (const path of appLayouts(join(root, "src/app"))) {
    const text = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.doesNotMatch(text, /PortfolioConcierge|components\/concierge\/|createWebchatWidget|mountEloziWidget|public\/elozi\/widget/);
    globalMounts += nodes(file, node => (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node))
      && node.tagName.getText(file) === "EloziChat").length;
  }
  assert.equal(globalMounts, 1);
});

test("switching the global mount does not delete legacy Nora code, visitor data contracts or case pages", () => {
  const protectedPaths = [
    "docs/brand/README.md",
    "src/components/concierge/portfolio-concierge.tsx",
    "src/components/concierge/chat.module.css",
    "src/components/concierge/visitor-ui.ts",
    "src/lib/concierge/concierge.ts",
    "src/lib/concierge/identity.ts",
    "src/lib/concierge/visitor.ts",
    "src/lib/concierge/visitor-contract.ts",
    "src/app/api/concierge/route.ts",
    "src/app/api/concierge/visitor/route.ts",
    "src/data/legal.ts",
    "src/data/nora-project.ts",
    "src/data/nora-reply-content.test.ts",
  ];
  const templatePath = ".env.example";
  const sourceManifestPath = process.env.PORTFOLIO_BUILD_SOURCE_MANIFEST;
  if (sourceManifestPath) {
    // The hermetic build omits all environment paths; prove the tracked template
    // still belongs to the committed source instead of copying it into the build.
    const snapshot = JSON.parse(readFileSync(sourceManifestPath, "utf8")) as {
      sourceRevision: string; files: Record<string, string>; excludedSource: Record<string, string>;
    };
    assert.match(snapshot.sourceRevision, /^[a-f0-9]{40}$/);
    assert.equal(snapshot.files[templatePath], undefined);
    assert.match(snapshot.excludedSource[templatePath], /^[a-f0-9]{64}$/);
    for (const path of ["package.json", "src/app/[locale]/layout.tsx", ...protectedPaths]) {
      assert.equal(createHash("sha256").update(readFileSync(join(root, path))).digest("hex"), snapshot.files[path],
        `Source snapshot differs: ${path}`);
    }
  } else {
    assert.ok(statSync(join(root, templatePath)).isFile(), `Protected legacy template missing: ${templatePath}`);
  }
  for (const path of protectedPaths) assert.ok(statSync(join(root, path)).isFile(), `Protected legacy artifact missing: ${path}`);
  assert.match(readFileSync(join(root, "src/data/nora-project.ts"), "utf8"), /export const noraProject/);
});

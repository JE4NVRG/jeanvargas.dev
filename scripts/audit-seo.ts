import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sitemap from "../src/app/sitemap";
import { getProjectSeoDescription } from "../src/data/project-seo";
import { serviceOffers } from "../src/data/services";

const canonicalBase = "https://je4ndev.com";
const timeoutMs = 8000;
const concurrency = 4;
const decode = (s: string) => s.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex: string | undefined, decimal: string | undefined) => String.fromCodePoint(parseInt(hex ?? decimal!, hex ? 16 : 10))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const cleanText = (s: string) => decode(s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")).trim();

function attributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) attrs[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "");
  return attrs;
}
function unique(values: string[]) { return [...new Set(values.map((value) => value.trim()).filter(Boolean))]; }
function metas(html: string, name: string): string[] {
  return unique([...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => attributes(m[0])).filter((a) => a.name?.toLowerCase() === name.toLowerCase()).map((a) => a.content ?? ""));
}
function links(html: string, rel: string): string[] {
  return unique([...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attributes(m[0])).filter((a) => (a.rel ?? "").toLowerCase().split(/\s+/).includes(rel.toLowerCase())).map((a) => a.href ?? ""));
}
function hreflangs(html: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const a = attributes(match[0]);
    if ((a.rel ?? "").toLowerCase().split(/\s+/).includes("alternate") && a.hreflang && a.href) result[a.hreflang.toLowerCase()] = a.href;
  }
  return result;
}
function parseSitemap(xml: string) {
  return [...xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)].map((match) => {
    const block = match[1];
    const loc = decode(block.match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/i)?.[1] ?? "").trim();
    const alternates: Record<string, string> = {};
    for (const link of block.matchAll(/<xhtml:link\b[^>]*>/gi)) {
      const a = attributes(link[0]);
      if (a.hreflang && a.href) alternates[a.hreflang.toLowerCase()] = a.href;
    }
    return { loc, alternates };
  }).filter((entry) => entry.loc);
}
async function fetchSameOrigin(url: string, origin: string) {
  let current = new URL(url);
  for (let redirects = 0; redirects <= 3; redirects++) {
    if (current.origin !== origin) throw new Error(`blocked cross-origin request: ${current.href}`);
    const response = await fetch(current, { redirect: "manual", signal: AbortSignal.timeout(timeoutMs), headers: { accept: "text/html,application/xml,text/xml" } });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`redirect ${response.status} without Location`);
      const next = new URL(location, current);
      if (next.origin !== origin) throw new Error(`blocked cross-origin redirect: ${next.href}`);
      current = next;
      continue;
    }
    return { response, body: await response.text(), finalUrl: current.href };
  }
  throw new Error("too many redirects (limit 3)");
}
async function mapBounded<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const output = new Array<R>(items.length); let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => { while (next < items.length) { const index = next++; output[index] = await fn(items[index]); } }));
  return output;
}
function expectedLang(path: string) { return path.startsWith("/pt/") || path === "/pt" ? "pt-BR" : "en"; }
function homepageOfferErrors(html: string, locale: "pt" | "en"): string[] {
  const errors: string[] = [];
  const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
  const records: Record<string, unknown>[] = [];
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (attributes(script[1]).type !== "application/ld+json") continue;
    try {
      const parsed: unknown = JSON.parse(script[2]);
      records.push(...(Array.isArray(parsed) ? parsed : [parsed]).filter(object));
    } catch { errors.push("invalid JSON-LD"); }
  }
  const organization = records.find(record => record["@id"] === `${canonicalBase}/#organization`);
  const catalog = organization?.hasOfferCatalog;
  const offers = object(catalog) && Array.isArray(catalog.itemListElement) ? catalog.itemListElement.filter(object).map(offer => offer.itemOffered).filter(object) : [];
  for (const service of serviceOffers) {
    const url = `${canonicalBase}/${locale}/services/${service.slugs[locale]}`;
    if (!offers.some(offer => offer["@type"] === "Service" && offer.name === service.title[locale] && offer.url === url)) errors.push(`JSON-LD missing current service ${service.id}`);
  }
  if (!String(organization?.description).includes(locale === "pt" ? "pessoas físicas e jurídicas" : "individuals and businesses")) errors.push("JSON-LD missing individuals/businesses audience");
  return errors;
}
function errorsForPage(html: string, route: { loc: string; alternates: Record<string, string> }, status: number, finalUrl: string) {
  const errors: string[] = [];
  const expectedPath = new URL(route.loc).pathname;
  if (expectedPath === "/pt" || expectedPath === "/en") errors.push(...homepageOfferErrors(html, expectedPath === "/pt" ? "pt" : "en"));
  if (status !== 200) errors.push(`HTTP ${status}`);
  if (new URL(finalUrl).pathname !== expectedPath) errors.push(`redirected to ${new URL(finalUrl).pathname}`);
  const canonicals = links(html, "canonical");
  const expectedCanonical = `${canonicalBase}${expectedPath}`;
  if (canonicals.length !== 1 || canonicals[0] !== expectedCanonical) errors.push(`canonical expected exactly ${expectedCanonical}; found ${JSON.stringify(canonicals)}`);
  const titles = unique([...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi)].map((m) => cleanText(m[1])));
  if (titles.length !== 1 || !titles[0]) errors.push(`expected one nonempty title; found ${JSON.stringify(titles)}`);
  const descriptions = metas(html, "description");
  if (descriptions.length !== 1 || !descriptions[0]) errors.push(`expected one nonempty description; found ${JSON.stringify(descriptions)}`);
  const projectRoute = expectedPath.match(/^\/(pt|en)\/projects\/([^/]+)$/);
  if (projectRoute) {
    const expectedDescription = getProjectSeoDescription(projectRoute[2], projectRoute[1] as "pt" | "en");
    if (descriptions[0] !== expectedDescription) errors.push("project meta description differs from the reviewed SEO catalog");
    if ((descriptions[0]?.length ?? 0) < 150 || (descriptions[0]?.length ?? 0) > 160) errors.push(`project meta description length ${descriptions[0]?.length ?? 0} outside editorial target 150-160`);
    const socialMetas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
    for (const name of ["og:description", "twitter:description"]) {
      const values = socialMetas.filter((meta) => (meta.property ?? meta.name) === name).map((meta) => meta.content);
      if (values.length !== 1 || values[0] !== expectedDescription) errors.push(`${name} differs from reviewed project metadata`);
    }
  }
  const lang = html.match(/<html\b[^>]*>/i)?.[0];
  if (attributes(lang ?? "").lang !== expectedLang(expectedPath)) errors.push(`html lang expected ${expectedLang(expectedPath)}; found ${attributes(lang ?? "").lang ?? "missing"}`);
  if (metas(html, "robots").some((value) => /\bnoindex\b/i.test(value))) errors.push("indexable route contains robots noindex");
  const actualAlternates = hreflangs(html);
  for (const [locale, url] of Object.entries(route.alternates)) if (actualAlternates[locale] !== url) errors.push(`hreflang ${locale} expected ${url}; found ${actualAlternates[locale] ?? "missing"}`);
  for (const [locale, url] of Object.entries(actualAlternates)) if (route.alternates[locale] !== url) errors.push(`unexpected hreflang ${locale}=${url}`);
  return errors;
}

async function main() {
  const args = process.argv.slice(2);
  const option = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const origin = new URL(option("--origin") ?? "http://127.0.0.1:3188").origin;
  const outputPath = option("--output");
  if (!outputPath) throw new Error("Usage: npm exec -- tsx scripts/audit-seo.ts --origin http://127.0.0.1:3188 --output <json-path>");
  const routeResults: Array<{ url: string; status: number | null; errors: string[] }> = [];
  const globalErrors: string[] = [];
  let routes: ReturnType<typeof parseSitemap> = [];
  try {
    const { response, body } = await fetchSameOrigin(`${origin}/sitemap.xml`, origin);
    if (!response.ok) globalErrors.push(`sitemap HTTP ${response.status}`);
    routes = parseSitemap(body);
    if (/<lastmod\b/i.test(body)) globalErrors.push("preview sitemap includes lastmod; it does not reflect the source change removing fabricated build-time dates");
    if (!routes.length) globalErrors.push("sitemap yielded no loc URLs");
  } catch (error) { globalErrors.push(`sitemap fetch/parse: ${String(error)}`); }
  const seen = new Set<string>();
  for (const route of routes) {
    if (seen.has(route.loc)) globalErrors.push(`duplicate sitemap URL ${route.loc}`);
    seen.add(route.loc);
    try {
      const routeUrl = new URL(route.loc);
      if (routeUrl.origin !== canonicalBase) { routeResults.push({ url: route.loc, status: null, errors: [`noncanonical sitemap origin ${routeUrl.origin}`] }); continue; }
      for (const [locale, alternate] of Object.entries(route.alternates)) {
        const reciprocal = routes.find((candidate) => candidate.loc === alternate);
        if (!reciprocal || !Object.values(reciprocal.alternates).includes(route.loc)) globalErrors.push(`${route.loc}: ${locale} alternate ${alternate} is not reciprocal`);
        if (new URL(alternate).origin !== canonicalBase) globalErrors.push(`${route.loc}: external alternate ${alternate}`);
      }
    } catch (error) { routeResults.push({ url: route.loc, status: null, errors: [`invalid sitemap route: ${String(error)}`] }); }
  }
  const expectedUrls = new Set(sitemap().map((route) => route.url));
  for (const url of expectedUrls) if (!seen.has(url)) globalErrors.push(`missing expected route ${url}`);
  for (const url of seen) if (!expectedUrls.has(url)) globalErrors.push(`unexpected route ${url}`);
  const checks = await mapBounded(routes.filter((r) => { try { return new URL(r.loc).origin === canonicalBase; } catch { return false; } }), concurrency, async (route) => {
    const path = new URL(route.loc).pathname;
    try {
      const { response, body, finalUrl } = await fetchSameOrigin(new URL(path, origin).href, origin);
      return { url: route.loc, status: response.status, errors: errorsForPage(body, route, response.status, finalUrl) };
    } catch (error) { return { url: route.loc, status: null, errors: [String(error)] }; }
  });
  routeResults.push(...checks);
  const sources = ["src/app/sitemap.ts", "src/data/services.ts", "src/data/project-seo.ts", "src/app/[locale]/projects/[slug]/page.tsx", "scripts/audit-seo.ts", "src/data/seo-sitemap.test.ts"];
  const sourceSha256: Record<string, string> = {};
  for (const source of sources) {
    try { sourceSha256[source] = createHash("sha256").update(await readFile(resolve(source))).digest("hex"); }
    catch (error) { sourceSha256[source] = `unavailable: ${String(error)}`; }
  }
  const failures = routeResults.filter((result) => result.errors.length).length;
  const report = { generatedAt: new Date().toISOString(), origin, sourceSha256, expected: expectedUrls.size, observed: routes.length, uniqueObserved: seen.size, routeFailures: failures, globalErrors: unique(globalErrors), routes: routeResults };
  const target = resolve(outputPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ output: target, expected: report.expected, observed: report.observed, uniqueObserved: report.uniqueObserved, routeFailures: report.routeFailures, globalErrors: report.globalErrors, routesWithErrors: routeResults.filter((r) => r.errors.length).length }));
  if (report.observed !== report.expected || report.uniqueObserved !== report.observed || failures || report.globalErrors.length) process.exitCode = 1;
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

// Translate product copy at its source. Customer content is never scanned.
const translations = new Map();
const translatedCopy = new Set(['Unable to complete this action. Please try again.']);
const sourceCopy = new Map();
const KEY = 'elozi:locale';
// Bumped whenever a catalog adds copy, so cached h`` templates are translated again.
let catalogVersion = 0;
let locale = 'pt-BR';
try { locale = normalizeLocale(globalThis.localStorage?.getItem(KEY)); } catch {}
export function normalizeLocale(value) { return value === 'en' || value === 'en-US' || value === 'en-GB' ? 'en' : 'pt-BR'; }
export function getLocale() { return locale; }
export function registerTranslations(dictionary) {
  for (const [source, target] of Object.entries(dictionary)) {
    if (typeof target !== 'string' || !target) throw new TypeError('Invalid translation');
    if (translations.has(source) && translations.get(source) !== target) {
      // Shared labels may be registered by independently loaded UI modules.
      // Keep the first wording; neither value can contain customer content.
      continue;
    }
    translations.set(source, target);
    catalogVersion++;
    translatedCopy.add(target);
    if (!sourceCopy.has(target)) sourceCopy.set(target, source);
  }
}
export function setLocale(value, { persist = true, notify = true } = {}) {
  const next = normalizeLocale(value), changed = next !== locale;
  locale = next;
  if (persist) try { globalThis.localStorage?.setItem(KEY, next); } catch {}
  if (globalThis.document?.documentElement) globalThis.document.documentElement.lang = next;
  if (changed && notify && globalThis.window?.dispatchEvent && typeof globalThis.CustomEvent === 'function') {
    globalThis.window.dispatchEvent(new CustomEvent('elozi:localechange', { detail: { locale: next } }));
  }
  return next;
}
export function t(source, parameters = {}) {
  return tForLocale(locale, source, parameters);
}
// Embedded widgets may use a different language from the operator's panel.
export function tForLocale(language, source, parameters = {}) {
  const text = normalizeLocale(language) === 'en' ? translations.get(String(source)) ?? String(source) : String(source);
  return text.replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => Object.hasOwn(parameters, key) ? String(parameters[key]) : match);
}
export function txt(strings, ...values) {
  return t(strings.reduce((text, part, i) => text + (i ? `{${i - 1}}` : '') + part, ''), Object.fromEntries(values.map((v, i) => [i, v])));
}
export function labels(dictionary) {
  const result = Array.isArray(dictionary) ? [] : {};
  for (const key of Object.keys(dictionary)) Object.defineProperty(result, key, {
    enumerable: true, configurable: true,
    get() { const value = dictionary[key]; return typeof value === 'string' ? t(value) : value; }
  });
  return result;
}
const SLOT = /\uE000(\d+)\uE001/g;
const slotsToParameters = value => value.replace(SLOT, (_, i) => `{${i}}`);
const parametersToSlots = value => value.replace(/\{(\d+)\}/g, (_, i) => `\uE000${i}\uE001`);
function copy(value) {
  const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(value);
  if (!match[2]) return value;
  return match[1] + parametersToSlots(t(slotsToParameters(match[2]))) + match[3];
}
export function translateMarkupSource(source) {
  // Only compile-time literal markup is supplied here. Values are inserted later.
  return source.split(/(<[^>]*>)/g).map(part => part.startsWith('<')
    ? part.replace(/\b(aria-label|title|placeholder|alt|label|data-nav-label)=("|')([\s\S]*?)\2/g, (_, name, quote, value) => `${name}=${quote}${copy(value).replaceAll(quote, quote === '"' ? '&quot;' : '&#39;')}${quote}`)
    : copy(part)).join('');
}
export function html(strings, ...values) {
  const source = strings.reduce((text, part, i) => text + (i ? `\uE000${i - 1}\uE001` : '') + part, '');
  return translateMarkupSource(source).replace(SLOT, (_, i) => String(values[Number(i)]));
}
export function markup(source) { return html([source]); }
// Markup for new code (FRONTEND-V2 §4.1). h`` translates its literal parts exactly like html``, but
// every interpolated value is escaped unless it is SafeHTML, or an array whose items are rendered
// the same way and joined. null, undefined and false render nothing. Legacy code keeps html``.
// Declared as `export const` (not `export class`): text-coupled tests evaluate i18n.js as a script
// after stripping `export ` before const/function declarations.
export const SafeHTML = class SafeHTML {
  #value;
  constructor(value) { this.#value = String(value ?? ''); }
  toString() { return this.#value; }
  toJSON() { return this.#value; }
};
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, character => HTML_ESCAPES[character]); }
/** Marks trusted, already-built markup (e.g. a legacy html`` fragment) for interpolation in h``. */
export function raw(value) { return value instanceof SafeHTML ? value : new SafeHTML(value); }
function interpolate(value) {
  if (value instanceof SafeHTML) return value.toString();
  if (Array.isArray(value)) return value.map(interpolate).join('');
  return value === null || value === undefined || value === false ? '' : escapeHTML(value);
}
const compiledTemplates = new WeakMap();
export function h(strings, ...values) {
  let compiled = compiledTemplates.get(strings);
  if (!compiled || compiled.locale !== locale || compiled.version !== catalogVersion) {
    const source = strings.reduce((text, part, i) => text + (i ? `${i - 1}` : '') + part, '');
    compiled = { locale, version: catalogVersion, markup: translateMarkupSource(source) };
    compiledTemplates.set(strings, compiled);
  }
  return new SafeHTML(compiled.markup.replace(SLOT, (_, i) => interpolate(values[Number(i)])));
}
export function translateStatic(root = globalThis.document) {
  if (!root?.querySelectorAll) return;
  for (const node of root.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  for (const attribute of ['title', 'placeholder', 'aria-label', 'alt']) {
    for (const node of root.querySelectorAll(`[data-i18n-${attribute}]`)) node.setAttribute(attribute, t(node.getAttribute(`data-i18n-${attribute}`)));
  }
}
export function translateError(message) {
  if (locale !== 'en') return sourceCopy.get(String(message ?? '')) ?? String(message ?? '');
  const source = String(message ?? '');
  if (translatedCopy.has(source)) return source;
  if (translations.has(source)) return t(source);
  // Unknown provider/server diagnostics are not guessed or machine translated.
  // A neutral English message keeps private content out of client-facing errors.
  return 'Unable to complete this action. Please try again.';
}
// Only for controller-owned status copy, never for messages or editable values.
export function translateCopy(value) {
  const source = String(value ?? '');
  return locale === 'en' ? translations.get(source) ?? source : sourceCopy.get(source) ?? source;
}

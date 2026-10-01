type Locale = "pt" | "en";

/** Use the server-rendered alternate URL when a translated page has a different slug. */
export function localizedPath(pathname: string, locale: Locale, alternateHref?: string | null): string {
  if (alternateHref) {
    try {
      const alternate = new URL(alternateHref, "https://je4ndev.com");
      if (
        alternate.origin === "https://je4ndev.com" &&
        (alternate.pathname === `/${locale}` || alternate.pathname.startsWith(`/${locale}/`))
      ) {
        return alternate.pathname;
      }
    } catch {
      // Missing or invalid metadata falls back to the existing locale-prefix behavior.
    }
  }
  if (!/^\/(pt|en)(?=$|\/)/.test(pathname)) return `/${locale}`;
  return pathname.replace(/^\/(pt|en)(?=$|\/)/, `/${locale}`);
}

import english from "./guides/workflow-automation.en.json";
import portuguese from "./guides/workflow-automation.pt.json";

export const GUIDE_SLUG = "ai-agent-or-workflow-automation";
export const GUIDE_PUBLISHED = "2026-10-01";
export const guides = { en: english, pt: portuguese };
export type GuideLocale = keyof typeof guides;

export function getGuide(locale: string, slug = GUIDE_SLUG) {
  return (locale === "en" || locale === "pt") && slug === GUIDE_SLUG ? guides[locale] : undefined;
}

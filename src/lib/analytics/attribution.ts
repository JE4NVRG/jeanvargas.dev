export type PageContext = {
  pageType: "home" | "service" | "project" | "other";
  project?: string;
  service?: string;
};

export type Attribution = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  landingPath: string;
  referrerHost?: string;
};

const SERVICE_BY_SLUG: Record<string, string> = {
  "desenvolvimento-saas": "saas",
  "saas-development": "saas",
  "automacoes-ia": "automation",
  "ai-automation": "automation",
  "agentes-ia-privados": "agents",
  "private-ai-agents": "agents",
};

const SEARCH_SOURCES: Array<[RegExp, string]> = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)search\.yahoo\.com$/, "yahoo"],
];

const REFERRAL_SOURCES: Array<[RegExp, string]> = [
  [/(^|\.)t\.co$/, "x"],
  [/(^|\.)x\.com$/, "x"],
  [/(^|\.)twitter\.com$/, "x"],
  [/(^|\.)linkedin\.com$/, "linkedin"],
  [/(^|\.)github\.com$/, "github"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)facebook\.com$/, "facebook"],
];

export function sanitizeAnalyticsToken(value: string | null | undefined, maxLength = 96) {
  if (!value) return undefined;

  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "")
    .slice(0, maxLength);

  return normalized || undefined;
}

function normalizeHost(hostname: string) {
  return hostname.trim().toLowerCase().replace(/^www\./, "").slice(0, 253);
}

function readExternalReferrerHost(referrer: string, siteHost: string) {
  if (!referrer) return undefined;

  try {
    const hostname = normalizeHost(new URL(referrer).hostname);
    if (!hostname || hostname === normalizeHost(siteHost)) return undefined;
    return hostname;
  } catch {
    return undefined;
  }
}

function classifyReferrer(hostname: string) {
  for (const [pattern, source] of SEARCH_SOURCES) {
    if (pattern.test(hostname)) return { source, medium: "organic" };
  }

  for (const [pattern, source] of REFERRAL_SOURCES) {
    if (pattern.test(hostname)) return { source, medium: "referral" };
  }

  return {
    source: sanitizeAnalyticsToken(hostname, 64) ?? "referral",
    medium: "referral",
  };
}

export function deriveAttribution({
  search,
  referrer,
  siteHost,
  landingPath,
}: {
  search: string;
  referrer: string;
  siteHost: string;
  landingPath: string;
}): Attribution {
  const params = new URLSearchParams(search);
  const utmSource = sanitizeAnalyticsToken(params.get("utm_source"), 64);
  const utmMedium = sanitizeAnalyticsToken(params.get("utm_medium"), 64);
  const campaign = sanitizeAnalyticsToken(params.get("utm_campaign"));
  const content = sanitizeAnalyticsToken(params.get("utm_content"));
  const referrerHost = readExternalReferrerHost(referrer, siteHost);
  const referral = referrerHost ? classifyReferrer(referrerHost) : undefined;

  return {
    source: utmSource ?? referral?.source ?? "direct",
    medium: utmMedium ?? (utmSource ? "campaign" : referral?.medium ?? "direct"),
    campaign,
    content,
    landingPath: landingPath.startsWith("/") ? landingPath.slice(0, 256) : "/",
    referrerHost,
  };
}

export function hasCampaignAttribution(search: string) {
  const params = new URLSearchParams(search);
  return ["utm_source", "utm_medium", "utm_campaign", "utm_content"].some((key) =>
    Boolean(params.get(key)),
  );
}

export function derivePageContext(pathname: string): PageContext {
  const cleanPath = pathname.split(/[?#]/, 1)[0] || "/";
  if (/^\/(pt|en)\/?$/.test(cleanPath)) return { pageType: "home" };

  const serviceMatch = cleanPath.match(/^\/(?:pt|en)\/services\/([^/]+)\/?$/);
  if (serviceMatch) {
    return {
      pageType: "service",
      service: SERVICE_BY_SLUG[serviceMatch[1]] ?? sanitizeAnalyticsToken(serviceMatch[1], 64),
    };
  }

  const projectMatch = cleanPath.match(/^\/(?:pt|en)\/projects\/([^/]+)\/?$/);
  if (projectMatch) {
    return {
      pageType: "project",
      project: sanitizeAnalyticsToken(projectMatch[1], 64),
    };
  }

  return { pageType: "other" };
}

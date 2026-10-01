const bounded = (raw: string | undefined, fallback: number, maximum: number) => {
  const value = raw ? Number(raw) : fallback;
  return Number.isSafeInteger(value) && value > 0 ? Math.min(value, maximum) : fallback;
};

/** Resolve deployment overrides per request; never freeze env at module import. */
export function conciergeLimits(env: NodeJS.ProcessEnv = process.env) {
  return Object.freeze({
    globalDaily: bounded(env.HERMES_CONCIERGE_GLOBAL_DAILY_LIMIT, 3_000, 100_000),
    sessionDaily: bounded(env.HERMES_CONCIERGE_SESSION_DAILY_LIMIT, 300, 10_000),
    burst: 8,
    burstWindowMs: 60_000,
    concurrency: 2,
  });
}

/** Default limits for UI/contracts; enforcement resolves overrides per request. */
export const CONCIERGE_LIMITS = conciergeLimits();

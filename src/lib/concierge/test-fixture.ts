import { processVisitorRequest } from "./visitor";
/** Synthetic test-only bootstrap through the real session boundary. */
export async function authorizeFixture(request: Request, env: NodeJS.ProcessEnv, now = new Date()) {
  const origin = env.HERMES_CONCIERGE_ORIGIN || request.headers.get("origin")!;
  const result = await processVisitorRequest(new Request(`${origin}/api/concierge/visitor`, {
    method: "POST", headers: { origin, "content-type": "application/json", "x-concierge-proxy": env.HERMES_CONCIERGE_PROXY_KEY!, "x-real-ip": request.headers.get("x-real-ip") || "192.0.2.1" },
    body: JSON.stringify({ action: "bootstrap" }),
  }), { ...env, HERMES_CONCIERGE_ORIGIN: origin }, now);
  request.headers.set("cookie", result.setCookie!.split(";")[0]);
  request.headers.set("x-nora-csrf", result.snapshot.csrfToken);
  return request;
}

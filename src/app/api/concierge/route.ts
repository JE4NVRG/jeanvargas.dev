import { ConciergeError, errorResponse, processConciergeRequest } from "@/lib/concierge/concierge";
import { after } from "next/server";
import { dispatchSheetsOutbox } from "@/lib/leads/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const result = await processConciergeRequest(request);
    after(async () => { await dispatchSheetsOutbox().catch(() => undefined); });
    return Response.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error instanceof ConciergeError ? error : undefined);
  }
}

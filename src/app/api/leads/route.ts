import { dispatchSheetsOutbox, errorResponse, processLeadRequest, recordNoraMemoryPreference } from "@/lib/leads/leads";
import { after } from "next/server";
import { upgradeVisitor } from "@/lib/concierge/visitor";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const bodyRequest = request.clone();
    const { visitorProfile, reusedContactLeadId, ...receipt } = await processLeadRequest(request);
    let registration: "upgraded" | "unavailable" = "unavailable";
    try {
      const body = await bodyRequest.json() as { requestId?: unknown };
      if (typeof body.requestId === "string") { await upgradeVisitor(request, receipt.leadId, body.requestId, process.env, new Date(), visitorProfile, reusedContactLeadId); registration = "upgraded"; await recordNoraMemoryPreference(request).catch(()=>{console.warn("nora_callback_memory_persistence_failed");}); }
    } catch { /* Lead is already durably saved; registration status is separate. */ }
    after(async () => { await dispatchSheetsOutbox().catch(() => undefined); });
    return Response.json({ ...receipt, registration }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return errorResponse(error); }
}

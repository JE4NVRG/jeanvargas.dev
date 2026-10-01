import { processVisitorRequest, visitorErrorResponse } from "@/lib/concierge/visitor";
import { after } from "next/server";
import { dispatchSheetsOutbox, recordNoraMemoryPreference } from "@/lib/leads/leads";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request:Request){try{
  const bodyRequest=request.clone();
  const result=await processVisitorRequest(request);
  const body=await bodyRequest.json() as {action?:string};
  if(body.action!=="bootstrap") {
    await recordNoraMemoryPreference(request).catch(()=>{console.warn("nora_memory_preference_persistence_failed");});
    after(async()=>{await dispatchSheetsOutbox().catch(()=>undefined);});
  }
  return Response.json({...result.snapshot,...(result.recoveryCode ? {recoveryCode:result.recoveryCode} : {})},{headers:{"cache-control":"no-store",...(result.setCookie?{"set-cookie":result.setCookie}:{})}});
}catch(error){return visitorErrorResponse(error);}}

import { z } from "zod";
import {
  FUNNEL_LEAD_STATUSES,
  assertAllowedLeadTransition,
  type FunnelLeadStatus,
} from "../src/lib/analytics/lead-status";

const TABLE = "portfolio_funnel_leads";
const token = z.string().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/).max(96);
const statusSchema = z.enum(FUNNEL_LEAD_STATUSES);
const channelSchema = z.enum([
  "x",
  "email",
  "dm",
  "whatsapp",
  "referral",
  "github",
  "linkedin",
  "tiktok",
  "other",
]);

function readArg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireArg(name: string) {
  const value = readArg(name)?.trim();
  if (!value) throw new Error(`Missing required ${name}`);
  return value;
}

function requireConfig() {
  const url = process.env.ANALYTICS_SUPABASE_URL?.trim();
  const key = process.env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Set ANALYTICS_SUPABASE_URL and ANALYTICS_SUPABASE_SERVICE_ROLE_KEY before updating the lead ledger.",
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string, prefer?: string) {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    ...(prefer ? { prefer } : {}),
  };
}

async function addLead(url: string, key: string) {
  const code = token.parse(requireArg("--code"));
  const businessName = requireArg("--business");
  const source = token.parse(readArg("--source") ?? "unknown");
  const medium = token.parse(readArg("--medium") ?? "unknown");
  const campaign = readArg("--campaign");
  const channel = channelSchema.parse(readArg("--channel") ?? "other");
  const landingPath = readArg("--landing-path") ?? null;

  if (businessName.length > 160) throw new Error("--business must be at most 160 characters");
  if (campaign) token.parse(campaign);
  if (landingPath && (!landingPath.startsWith("/") || landingPath.length > 256)) {
    throw new Error("--landing-path must start with / and be at most 256 characters");
  }

  const response = await fetch(`${url}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: headers(key, "return=representation"),
    body: JSON.stringify({
      lead_code: code,
      business_name: businessName,
      source,
      medium,
      campaign: campaign ?? null,
      channel,
      landing_path: landingPath,
    }),
  });
  if (!response.ok) throw new Error(`Lead creation failed with HTTP ${response.status}`);
  console.log(`Lead created: ${code} (${businessName})`);
}

async function moveLead(url: string, key: string) {
  const code = token.parse(requireArg("--code"));
  const status = statusSchema.parse(requireArg("--status"));

  const currentEndpoint = new URL(`${url}/rest/v1/${TABLE}`);
  currentEndpoint.searchParams.set("select", "lead_code,status");
  currentEndpoint.searchParams.set("lead_code", `eq.${code}`);
  const currentResponse = await fetch(currentEndpoint, { headers: headers(key) });
  if (!currentResponse.ok) {
    throw new Error(`Lead lookup failed with HTTP ${currentResponse.status}`);
  }
  const currentRows = (await currentResponse.json()) as Array<{
    lead_code: string;
    status: FunnelLeadStatus;
  }>;
  if (currentRows.length !== 1) {
    throw new Error(`Expected one lead for ${code}, found ${currentRows.length}`);
  }
  const currentStatus = statusSchema.parse(currentRows[0].status);
  assertAllowedLeadTransition(currentStatus, status);

  const now = new Date().toISOString();
  const payload: Record<string, string | number | null> = {
    status,
    updated_at: now,
  };
  const stageTimestamp: Partial<Record<FunnelLeadStatus, string>> = {
    contacted: "first_contact_at",
    conversation_started: "conversation_started_at",
    qualified: "qualified_at",
    proposal_sent: "proposal_sent_at",
    closed_won: "closed_at",
    closed_lost: "closed_at",
    not_a_fit: "closed_at",
  };
  const timestampField = stageTimestamp[status];
  if (timestampField) payload[timestampField] = now;

  const valueBrl = readArg("--value-brl");
  if (valueBrl !== undefined) {
    const numeric = Number(valueBrl);
    if (!Number.isFinite(numeric) || numeric < 0) {
      throw new Error("--value-brl must be a non-negative number");
    }
    payload.deal_value_brl = numeric;
  }

  const note = readArg("--note");
  if (note) {
    if (note.length > 2000) throw new Error("--note must be at most 2000 characters");
    payload.notes = note;
  }

  const endpoint = new URL(`${url}/rest/v1/${TABLE}`);
  endpoint.searchParams.set("lead_code", `eq.${code}`);
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: headers(key, "return=representation"),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Lead update failed with HTTP ${response.status}`);
  const updated = (await response.json()) as Array<{ lead_code: string }>;
  if (updated.length !== 1) throw new Error(`Expected one lead for ${code}, updated ${updated.length}`);
  console.log(`Lead moved: ${code} -> ${status}`);
}

async function listLeads(url: string, key: string) {
  const endpoint = new URL(`${url}/rest/v1/${TABLE}`);
  endpoint.searchParams.set(
    "select",
    "lead_code,business_name,status,source,medium,campaign,channel,updated_at",
  );
  endpoint.searchParams.set("order", "updated_at.desc");
  endpoint.searchParams.set("limit", "50");
  const response = await fetch(endpoint, { headers: headers(key) });
  if (!response.ok) throw new Error(`Lead list failed with HTTP ${response.status}`);
  const leads = (await response.json()) as Array<Record<string, unknown>>;
  console.log(JSON.stringify(leads, null, 2));
}

async function main() {
  const command = process.argv[2];
  if (!command || !["add", "move", "list"].includes(command)) {
    throw new Error("Usage: funnel:lead -- <add|move|list> [options]");
  }
  const { url, key } = requireConfig();
  if (command === "add") await addLead(url, key);
  if (command === "move") await moveLead(url, key);
  if (command === "list") await listLeads(url, key);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown funnel lead error";
  console.error(message);
  process.exitCode = 1;
});

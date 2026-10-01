import { LeadError, prunePortfolioLeads } from "../src/lib/leads/leads";

async function main() {
  const args = process.argv.slice(2);
  let retentionDays = 90;
  if (args.length) {
    if (args.length !== 2 || args[0] !== "--days" || !/^\d+$/.test(args[1])) throw new Error("invalid_arguments");
    retentionDays = Number(args[1]);
  }
  const result = await prunePortfolioLeads({ retentionDays });
  process.stdout.write(`${JSON.stringify({ ok: true, operation: "prune-portfolio-leads", ...result })}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({ ok: false, error: error instanceof LeadError ? error.code : "maintenance_failed" })}\n`);
  process.exitCode = 1;
});

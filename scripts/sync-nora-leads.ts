import { dispatchSheetsOutbox } from "../src/lib/leads/leads";

async function main() {
  if (process.argv.slice(2).length) throw new Error("invalid_arguments");
  // A supervised scheduler can invoke this command periodically. One bounded item per run.
  const result = await dispatchSheetsOutbox();
  process.stdout.write(`${result.outcome}\n`);
  if (result.outcome === "retry") process.exitCode = 2;
}
main().catch(() => {process.stderr.write("sheets_sync_failed\n");process.exitCode=1;});

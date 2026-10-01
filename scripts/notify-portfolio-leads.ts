import { dispatchOutbox, LeadError } from "../src/lib/leads/leads";

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== "--token-stdin")) throw new Error("invalid_arguments");
  let token: string | undefined;
  if (args.includes("--token-stdin")) {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of process.stdin) {
      const bytes = Buffer.from(chunk);
      size += bytes.length;
      if (size > 512) throw new Error("invalid_credential_input");
      chunks.push(bytes);
    }
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_credential_input");
    const input = value as Record<string, unknown>;
    if (Object.keys(input).length !== 1 || typeof input.token !== "string" || !/^[0-9]{6,}:[A-Za-z0-9_-]{20,}$/.test(input.token)) throw new Error("invalid_credential_input");
    token = input.token;
  }
  const result = await dispatchOutbox({ token });
  process.stdout.write(`${result.outcome}${"leadId" in result ? ` ${result.leadId}` : ""}\n`);
  if (result.outcome === "ambiguous") process.exitCode = 2;
}
main().catch(error => {
  process.stderr.write(`${error instanceof LeadError ? error.code : "notification_failed"}\n`);
  process.exitCode = 1;
});

import { pruneVisitorState, VisitorError } from "../src/lib/concierge/visitor";

pruneVisitorState().then(() => {
  console.log(JSON.stringify({ ok: true, operation: "prune-visitor-memory" }));
}).catch((error: unknown) => {
  console.error(JSON.stringify({ ok: false, error: error instanceof VisitorError ? error.code : "maintenance_failed" }));
  process.exitCode = 1;
});

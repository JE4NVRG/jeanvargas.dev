import assert from "node:assert/strict";
import test from "node:test";
import { leadReference } from "./reference";
import { parseLeadReceipt } from "../../components/concierge/lead-contract";

test("short reference is a display aid and preserves the complete receipt identity", () => {
  const id = "c2ab5101-b692-46b8-ad36-e5a9130e5e5b";
  assert.equal(leadReference(id), "NORA-C2AB5101B6");
  assert.equal(parseLeadReceipt({leadId:id,saved:true,notification:"sent"})?.leadId,id);
  const other = "c2ab5101-b692-46b8-ad36-e5a9130e5e5c";
  assert.equal(leadReference(id),leadReference(other));
  assert.notEqual(parseLeadReceipt({leadId:id,saved:true,notification:"sent"})?.leadId,parseLeadReceipt({leadId:other,saved:true,notification:"sent"})?.leadId);
  assert.equal(leadReference("legacy-receipt"),"legacy-receipt");
});

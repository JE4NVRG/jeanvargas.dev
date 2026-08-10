import assert from "node:assert/strict";
import test from "node:test";
import {
  assertAllowedLeadTransition,
  isAllowedLeadTransition,
} from "./lead-status";

test("allows the evidence-backed happy path and explicit terminal outcomes", () => {
  assert.equal(isAllowedLeadTransition("new", "contacted"), true);
  assert.equal(isAllowedLeadTransition("contacted", "conversation_started"), true);
  assert.equal(isAllowedLeadTransition("conversation_started", "qualified"), true);
  assert.equal(isAllowedLeadTransition("qualified", "proposal_sent"), true);
  assert.equal(isAllowedLeadTransition("proposal_sent", "closed_won"), true);
  assert.equal(isAllowedLeadTransition("qualified", "closed_lost"), true);
  assert.equal(isAllowedLeadTransition("new", "not_a_fit"), true);
});

test("rejects skipped, reversed and reopened transitions", () => {
  assert.equal(isAllowedLeadTransition("new", "qualified"), false);
  assert.equal(isAllowedLeadTransition("proposal_sent", "conversation_started"), false);
  assert.equal(isAllowedLeadTransition("closed_won", "qualified"), false);
  assert.throws(
    () => assertAllowedLeadTransition("contacted", "proposal_sent"),
    /Invalid lead transition/,
  );
});

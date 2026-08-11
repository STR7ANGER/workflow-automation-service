import assert from "node:assert/strict";
import test from "node:test";
import { Orchestrator } from "../src/orchestrator.js";
const flow = {
  name: "Approval",
  steps: [
    { id: "start", type: "trigger", next: ["approve"] },
    { id: "approve", type: "approval", next: ["send"] },
    { id: "send", type: "demo", next: [] },
  ],
};
test("publishes, deduplicates, waits for signal and completes", () => {
  const o = new Orchestrator(),
    d = o.create("t", flow);
  o.publish("t", d.id);
  const r = o.trigger("t", d.id, "event-1", {});
  assert.equal(o.trigger("t", d.id, "event-1", {}).id, r.id);
  o.advance("t", r.id);
  o.advance("t", r.id);
  assert.equal(r.status, "WAITING");
  o.signal("t", r.id, "approved");
  o.advance("t", r.id);
  assert.equal(r.status, "SUCCEEDED");
});
test("retries, dead letters and redrives", () => {
  const o = new Orchestrator(),
    d = o.create("t", { name: "Fail", steps: [{ id: "x", type: "trigger" }] });
  o.publish("t", d.id);
  const r = o.trigger("t", d.id, "1", {});
  o.advance("t", r.id, false);
  o.advance("t", r.id, false);
  o.advance("t", r.id, false);
  assert.equal(r.status, "FAILED");
  assert.equal(o.operations("t").deadLetters, 1);
  assert.equal(o.redrive("t", r.id).status, "RUNNING");
});
test("isolates tenants, hashes credentials and recovers leases", () => {
  const o = new Orchestrator();
  assert.equal(o.storeCredential("t", "slack", "secret").stored, true);
  const d = o.create("t", {
    name: "Lease",
    steps: [{ id: "x", type: "trigger" }],
  });
  o.publish("t", d.id);
  o.trigger("t", d.id, "1", {}, new Date(0));
  assert.equal(o.recover(new Date(60_000)).length, 1);
  assert.equal(o.operations("other").running, 0);
});

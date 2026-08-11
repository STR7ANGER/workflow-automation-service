import assert from "node:assert/strict";
import test from "node:test";
import { workflowSchema } from "./index.js";
test("validates workflow transitions", () => {
  assert.equal(
    workflowSchema.safeParse({
      name: "Demo",
      steps: [
        { id: "a", type: "trigger", next: ["b"] },
        { id: "b", type: "demo" },
      ],
    }).success,
    true,
  );
  assert.equal(
    workflowSchema.safeParse({
      name: "Bad",
      steps: [{ id: "a", type: "trigger", next: ["missing"] }],
    }).success,
    false,
  );
});

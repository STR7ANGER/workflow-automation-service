import { createHash, randomUUID } from "node:crypto";
import { workflowSchema, type WorkflowInput } from "@workflow/contracts";
type Status = "RUNNING" | "WAITING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
interface Definition {
  id: string;
  tenantId: string;
  version: number;
  published: boolean;
  input: WorkflowInput;
}
interface Execution {
  id: string;
  tenantId: string;
  workflowId: string;
  status: Status;
  stepId: string;
  attempt: number;
  leaseUntil: string;
  trace: string[];
  input: unknown;
  error?: string;
}
export class WorkflowError extends Error {
  constructor(
    readonly code: string,
    readonly status = 422,
  ) {
    super(code);
  }
}
export class Orchestrator {
  readonly definitions = new Map<string, Definition>();
  readonly executions = new Map<string, Execution>();
  readonly dedupe = new Map<string, string>();
  readonly deadLetters: string[] = [];
  readonly audits: string[] = [];
  readonly credentials = new Map<string, string>();
  create(tenantId: string, input: unknown) {
    const parsed = workflowSchema.safeParse(input);
    if (!parsed.success) throw new WorkflowError("INVALID_WORKFLOW");
    const value = {
      id: randomUUID(),
      tenantId,
      version: 1,
      published: false,
      input: parsed.data,
    };
    this.definitions.set(value.id, value);
    return value;
  }
  publish(tenantId: string, id: string) {
    const value = this.definition(tenantId, id);
    value.published = true;
    this.audits.push(`published:${id}`);
    return value;
  }
  trigger(
    tenantId: string,
    workflowId: string,
    key: string,
    input: unknown,
    now = new Date(),
  ) {
    const previous = this.dedupe.get(`${tenantId}:${key}`);
    if (previous) return this.executions.get(previous)!;
    const definition = this.definition(tenantId, workflowId);
    if (!definition.published)
      throw new WorkflowError("WORKFLOW_NOT_PUBLISHED", 409);
    const first = definition.input.steps[0]!;
    const value: Execution = {
      id: randomUUID(),
      tenantId,
      workflowId,
      status: "RUNNING",
      stepId: first.id,
      attempt: 0,
      leaseUntil: new Date(now.getTime() + 30_000).toISOString(),
      trace: [`trigger:${first.id}`],
      input,
    };
    this.executions.set(value.id, value);
    this.dedupe.set(`${tenantId}:${key}`, value.id);
    return value;
  }
  advance(tenantId: string, id: string, success = true, now = new Date()) {
    const run = this.execution(tenantId, id);
    const definition = this.definition(tenantId, run.workflowId);
    const step = definition.input.steps.find((x) => x.id === run.stepId)!;
    if (!success) {
      run.attempt++;
      if (run.attempt < 3) {
        run.trace.push(`retry:${run.attempt}`);
        run.leaseUntil = new Date(
          now.getTime() + 2 ** run.attempt * 1000,
        ).toISOString();
        return run;
      }
      run.status = "FAILED";
      run.error = "STEP_RETRIES_EXHAUSTED";
      this.deadLetters.push(run.id);
      return run;
    }
    if (step.type === "approval" || step.type === "delay") {
      run.status = "WAITING";
      run.trace.push(`waiting:${step.type}`);
      return run;
    }
    const next = step.next[0];
    if (!next) {
      run.status = "SUCCEEDED";
      run.trace.push("completed");
      return run;
    }
    run.stepId = next;
    run.attempt = 0;
    run.leaseUntil = new Date(now.getTime() + 30_000).toISOString();
    run.trace.push(`step:${next}`);
    return run;
  }
  signal(tenantId: string, id: string, name: string) {
    const run = this.execution(tenantId, id);
    if (run.status !== "WAITING")
      throw new WorkflowError("EXECUTION_NOT_WAITING", 409);
    const definition = this.definition(tenantId, run.workflowId);
    const current = definition.input.steps.find(
      (step) => step.id === run.stepId,
    )!;
    const next = current.next[0];
    run.status = next ? "RUNNING" : "SUCCEEDED";
    if (next) run.stepId = next;
    run.trace.push(`signal:${name}`);
    return run;
  }
  cancel(tenantId: string, id: string) {
    const run = this.execution(tenantId, id);
    run.status = "CANCELLED";
    run.trace.push("compensation:requested");
    return run;
  }
  redrive(tenantId: string, id: string) {
    const run = this.execution(tenantId, id);
    if (run.status !== "FAILED") throw new WorkflowError("NOT_FAILED", 409);
    run.status = "RUNNING";
    run.attempt = 0;
    delete run.error;
    run.trace.push("redriven");
    return run;
  }
  recover(now = new Date()) {
    return [...this.executions.values()]
      .filter((x) => x.status === "RUNNING" && new Date(x.leaseUntil) < now)
      .map((x) => {
        x.leaseUntil = new Date(now.getTime() + 30_000).toISOString();
        x.trace.push("lease:recovered");
        return x;
      });
  }
  storeCredential(tenantId: string, name: string, secret: string) {
    this.credentials.set(
      `${tenantId}:${name}`,
      createHash("sha256").update(secret).digest("hex"),
    );
    this.audits.push(`credential.stored:${tenantId}:${name}`);
    return { name, stored: true };
  }
  operations(tenantId: string) {
    const runs = [...this.executions.values()].filter(
      (x) => x.tenantId === tenantId,
    );
    return {
      running: runs.filter((x) => x.status === "RUNNING").length,
      failed: runs.filter((x) => x.status === "FAILED").length,
      deadLetters: this.deadLetters.filter(
        (id) => this.executions.get(id)?.tenantId === tenantId,
      ).length,
      traces: runs
        .flatMap((x) => x.trace.map((event) => ({ executionId: x.id, event })))
        .slice(-100),
    };
  }
  private definition(t: string, id: string) {
    const x = this.definitions.get(id);
    if (!x || x.tenantId !== t)
      throw new WorkflowError("WORKFLOW_NOT_FOUND", 404);
    return x;
  }
  private execution(t: string, id: string) {
    const x = this.executions.get(id);
    if (!x || x.tenantId !== t)
      throw new WorkflowError("EXECUTION_NOT_FOUND", 404);
    return x;
  }
}

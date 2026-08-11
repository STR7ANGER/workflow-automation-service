import { Hono } from "hono";
import { Orchestrator, WorkflowError } from "./orchestrator.js";
export function createApp(o = new Orchestrator()) {
  const app = new Hono<{ Variables: { tenant: string } }>();
  app.onError((e, c) =>
    c.json(
      { code: e instanceof WorkflowError ? e.code : "INTERNAL_ERROR" },
      e instanceof WorkflowError ? (e.status as 400) : 500,
    ),
  );
  app.get("/health", (c) => c.json({ status: "ok" }));
  app.use("/v1/*", async (c, n) => {
    const tenant = c.req.header("x-tenant-id"),
      key = c.req.header("x-api-key");
    if (!tenant || !key || key.length < 16)
      return c.json({ code: "UNAUTHENTICATED" }, 401);
    c.set("tenant", tenant);
    await n();
  });
  app.post("/v1/workflows", async (c) =>
    c.json(o.create(c.get("tenant"), await c.req.json()), 201),
  );
  app.post("/v1/workflows/:id/publish", (c) =>
    c.json(o.publish(c.get("tenant"), c.req.param("id")!)),
  );
  app.post("/v1/workflows/:id/trigger", async (c) =>
    c.json(
      o.trigger(
        c.get("tenant"),
        c.req.param("id")!,
        c.req.header("idempotency-key") ?? "",
        await c.req.json(),
      ),
      202,
    ),
  );
  app.post("/v1/executions/:id/advance", async (c) =>
    c.json(
      o.advance(
        c.get("tenant"),
        c.req.param("id")!,
        ((await c.req.json()) as { success: boolean }).success,
      ),
    ),
  );
  app.post("/v1/executions/:id/signal", async (c) =>
    c.json(
      o.signal(
        c.get("tenant"),
        c.req.param("id")!,
        ((await c.req.json()) as { name: string }).name,
      ),
    ),
  );
  app.post("/v1/executions/:id/redrive", (c) =>
    c.json(o.redrive(c.get("tenant"), c.req.param("id")!)),
  );
  app.get("/v1/operations", (c) => c.json(o.operations(c.get("tenant"))));
  return app;
}

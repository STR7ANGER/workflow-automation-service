import { z } from "zod";
export const stepSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "trigger",
    "http",
    "condition",
    "delay",
    "approval",
    "subflow",
    "demo",
  ]),
  next: z.array(z.string()).default([]),
  config: z.record(z.string(), z.unknown()).default({}),
});
export const workflowSchema = z
  .object({
    name: z.string().min(2),
    steps: z.array(stepSchema).min(1).max(100),
    maxConcurrency: z.number().int().min(1).max(100).default(10),
  })
  .superRefine((value, ctx) => {
    const ids = new Set(value.steps.map((x) => x.id));
    for (const step of value.steps)
      for (const next of step.next)
        if (!ids.has(next))
          ctx.addIssue({
            code: "custom",
            message: `unknown transition ${next}`,
          });
  });
export type WorkflowInput = z.infer<typeof workflowSchema>;

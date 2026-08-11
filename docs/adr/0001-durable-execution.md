# ADR 0001: Durable execution semantics

PostgreSQL is authoritative for workflow versions, executions, leases, timers, approvals, and audit envelopes. Redis carries expendable queue signals; MongoDB archives bounded payloads. Definition DAGs are immutable after publish. Commands are tenant-scoped and idempotent.

Workers acquire 30-second leases, heartbeat, and recover expired work. Steps retry three times with exponential backoff before dead-lettering. Cancellation requests compensation in reverse completed-step order. Webhook/cron triggers deduplicate by tenant and event key; replay creates an audited new attempt without rewriting history.

Credentials are encrypted at rest, injected only into connector processes, redacted from traces, and never included in payload archives. HTTP connectors enforce allowlists, 1 MB payloads, ten-second timeouts, and SSRF-safe DNS resolution. Approvals and callbacks use expiring signed tokens; loops and subflows have depth/iteration/concurrency ceilings.

# Production runbook

Migrate PostgreSQL, deploy workers, API, then console. Verify publish, trigger deduplication, approval signal, timeout retry, dead letter, and redrive. Roll back images before additive schema.

For queue lag, pause triggers, inspect lease age and Redis, recover expired executions, then resume gradually. For connector incidents, disable the connector, rotate credentials, inspect redacted traces, and redrive only safe idempotent steps. Alerts cover p95 dispatch latency, lease recovery spikes, dead letters, webhook rejection, and approval age. Retain execution envelopes 365 days and payload archives 30 days.

# Workflow Automation Service — 30-Task Execution Plan

Complete tasks in order unless a dependency is explicitly removed. Each day has 10 active tasks; unfinished work rolls forward before later tasks begin. Keep at most 10 task checkboxes marked `[~]` (in progress) at once; use `[x]` only after verification.

## Day 1 — Foundation and first vertical slice (Tasks 1–10)

- [ ] 1. Design workspace, Docker, CI, execution semantics, and workflow JSON schema; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 2. Implement workspace, Docker, CI, execution semantics, and workflow JSON schema; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 3. Verify workspace, Docker, CI, execution semantics, and workflow JSON schema with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 4. Design tenants, auth, API keys, RBAC, credentials, encryption, and audits; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 5. Implement tenants, auth, API keys, RBAC, credentials, encryption, and audits; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 6. Verify tenants, auth, API keys, RBAC, credentials, encryption, and audits with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 7. Design definition parser, validation, versions, publish lifecycle, and GraphQL queries; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 8. Implement definition parser, validation, versions, publish lifecycle, and GraphQL queries; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 9. Verify definition parser, validation, versions, publish lifecycle, and GraphQL queries with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 10. Design Go state machine, persistence, leases, heartbeats, timers, and recovery; write acceptance criteria, contracts, risks, and the smallest vertical slice.

## Day 2 — Core workflows and integrations (Tasks 11–20)

- [ ] 11. Implement Go state machine, persistence, leases, heartbeats, timers, and recovery; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 12. Verify Go state machine, persistence, leases, heartbeats, timers, and recovery with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 13. Design queues, retries, backoff, timeout, cancellation, compensation, and dead letters; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 14. Implement queues, retries, backoff, timeout, cancellation, compensation, and dead letters; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 15. Verify queues, retries, backoff, timeout, cancellation, compensation, and dead letters with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 16. Design webhook/cron triggers, idempotency, deduplication, rate limits, and replay; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 17. Implement webhook/cron triggers, idempotency, deduplication, rate limits, and replay; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 18. Verify webhook/cron triggers, idempotency, deduplication, rate limits, and replay with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 19. Design connector SDK, HTTP and demo connectors, secret injection, and payload limits; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 20. Implement connector SDK, HTTP and demo connectors, secret injection, and payload limits; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.

## Day 3 — Advanced behavior and production hardening (Tasks 21–30)

- [ ] 21. Verify connector SDK, HTTP and demo connectors, secret injection, and payload limits with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 22. Design approvals, signals, callbacks, subflows, loops, and concurrency controls; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 23. Implement approvals, signals, callbacks, subflows, loops, and concurrency controls; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 24. Verify approvals, signals, callbacks, subflows, loops, and concurrency controls with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 25. Design operations console, live traces, redrive, metrics, alerts, and retention; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 26. Implement operations console, live traces, redrive, metrics, alerts, and retention; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 27. Verify operations console, live traces, redrive, metrics, alerts, and retention with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 28. Design failure/load/contract tests, SDK examples, API/events docs, and runbook; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 29. Implement failure/load/contract tests, SDK examples, API/events docs, and runbook; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 30. Verify failure/load/contract tests, SDK examples, API/events docs, and runbook with tests, failure cases, telemetry, documentation, and a reviewable demo.

## Task completion checklist

A task is complete only when code is formatted and typed, tests pass, migrations are reproducible, UI states are handled, authorization is enforced, logs contain no secrets, and relevant docs are updated. Track blockers beneath the task instead of silently widening scope.


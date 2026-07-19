# Reliability Strategy

## Reliability Objective

The runtime must preserve workflow correctness, evidence integrity, approval boundaries, and recoverability before optimizing completion speed. A degraded system may delay work; it must not fabricate completion, duplicate side effects, or bypass control.

## Failure Taxonomy

| Class | Examples | Default response |
|---|---|---|
| Transient infrastructure | timeout, connection reset, worker loss | Bounded retry with jitter |
| Capacity | queue saturation, provider rate limit | Backpressure, defer, shed low-priority work |
| Dependency | model/tool unavailable | Circuit break, approved fallback or wait |
| Data | invalid schema, stale DNA snapshot | Quarantine or require refresh |
| Policy | denied action, expired approval | Fail closed and surface remediation |
| Deterministic code | validation failure, invariant violation | No blind retry; dead-letter and investigate |
| Security | injection, credential misuse, tenant mismatch | Stop, isolate, alert, preserve evidence |
| Regional | control plane or data store unavailable | Fail over according to service tier |

## Retry Policy

| Operation | Attempts | Backoff | Retry condition |
|---|---:|---|---|
| Read-only internal call | 3 | Exponential + jitter | Transient only |
| Model request | 2–3 | Provider-aware | Timeout, 429, 5xx; budget available |
| Tool read | 3 | Exponential + jitter | Idempotent transient failure |
| Tool write | 0 automatically unless idempotency verified | Explicit | Registered effect key and safe status query |
| State transition | 3 | Short jitter | Optimistic conflict with refreshed state |
| Policy/approval | 1 | None | Never convert denial to retry |

Retries consume an end-to-end deadline and retry budget. Nested layers do not independently multiply attempts.

## Idempotency and Side Effects

- Every mutating command requires an idempotency key scoped to tenant and operation.
- The Tool Gateway registers intent before execution and records provider receipt/result after execution.
- Ambiguous outcomes enter `ReconciliationRequired`, not automatic re-execution.
- External systems supporting status lookup are reconciled before retry.
- Result hashes protect against a provider returning inconsistent results for one key.
- Deduplication records outlive the maximum retry and message-retention interval.

## Circuit Breakers and Bulkheads

Breakers exist per provider, model, tool, tenant, and operation class. They open on rolling failure/latency thresholds, probe with limited half-open traffic, and expose operator overrides with expiry. Separate worker pools and concurrency limits prevent one tenant, tool, or long-running agent from exhausting shared capacity.

## Checkpoint and Recovery

Workflow checkpoints are written after every durable stage boundary and before/after irreversible effects. On worker loss, a new worker obtains the task lease, verifies the checkpoint and effect registry, then resumes from the last committed boundary. Reconciliation repairs differences between workflow state, outbox delivery, and external effects.

## Compensation and Rollback

Database migrations and deployments use forward-compatible expand/migrate/contract sequencing. Workflow definition rollback affects new runs; existing runs remain pinned to their version or use an explicitly tested migration. Business side effects use compensating actions rather than database rollback. Compensation itself is governed, auditable, and may require approval.

## Graceful Degradation

| Dependency unavailable | Permitted behavior | Forbidden behavior |
|---|---|---|
| Model provider | Deterministic explanation fallback or queue | Invent model execution |
| Tool provider | Preserve plan and wait | Mark tool action complete |
| Enterprise DNA projection | Read pinned snapshot | Use unversioned stale facts silently |
| Search/cache | Query authoritative store with limits | Treat cache miss as absent fact |
| Analytics | Delay dashboards | Block workflow transactions |
| Audit sink | Buffer durably within limit | Execute governed side effect without audit durability |

## Session Recovery

Session state is not workflow state. A returning user loads authoritative case/workflow state, restores non-sensitive UI preferences, and receives any state changes since the last seen version. Expired sessions require reauthentication; abandoned browser connections do not cancel workflows.

## Data Protection and Disaster Recovery

- Point-in-time recovery for transactional stores.
- Versioning and cross-region replication for evidence artifacts.
- Encrypted, immutable backup copies with separate administrative authority.
- Restore tests at least quarterly and after material data-platform changes.
- Rebuild procedures for caches, indexes, and projections from authoritative data/events.
- Documented regional evacuation, DNS/traffic shift, and tenant communication runbooks.

## Reliability Verification

- Fault injection for worker termination, queue redelivery, provider timeout, and stale leases.
- Property tests for legal state transitions and idempotency.
- Replay tests using sanitized event/checkpoint fixtures.
- Chaos exercises in non-production and scoped production game days.
- Backup restoration and regional recovery drills measured against RTO/RPO.
- Synthetic journeys continuously validate start, approval, resume, and evidence access.

## Invariants

1. No acknowledged transition is lost.
2. No governed action executes without a recorded policy decision.
3. No high-risk action executes without a valid approval bound to that action.
4. A retry never creates a second logical side effect.
5. Recovery never crosses tenant boundaries.
6. Degraded operation is visible to users and operators.

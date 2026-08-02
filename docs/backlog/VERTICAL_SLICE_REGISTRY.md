# Official Vertical Slice Registry

**Status date:** 2026-08-02
**Status evidence:** Git `HEAD`, current working tree, tests, and `work_results/`.

Complexity is relative: `S` (1 day), `M` (2 days), `L` (3 days) for one engineer,
matching the approved Runtime Spine plan. “Implemented, uncommitted” is not
Complete and cannot enter a release.

## Foundation slice

| ID | Name | Program | Epic | Dependencies | Status | Acceptance summary | Complexity |
|---|---|---|---|---|---|---|---|
| BASE-01 | Reproducible repository baseline | PGM-FOUNDATION | EPIC-00/01 | Current workspace foundation | Proposed | Separate and commit coherent existing changes; exact commit passes full clean-checkout Python/JavaScript and documentation gates; no behavior change | M |

## Runtime Spine slices

| ID | Name | Epic | Dependencies | Status | Acceptance summary | Complexity |
|---|---|---|---|---|---|---|
| RS-01 | Regression and state inventory | EPIC-01 | Approved PRS | Complete (`1a16782`) | Characterization and state ownership baseline committed | S |
| RS-02 | Versioned runtime contracts | EPIC-01 | RS-01 | Complete (`1a16782`) | Strict provider-neutral contracts committed; runtime inactive | L |
| RS-03 | Typed runtime configuration | EPIC-01 | RS-02 | Implemented, uncommitted; inactive | Safe local configuration validates without selecting adapters | M |
| RS-04 | In-process service and compatibility adapter | EPIC-01 | RS-01–03, BASE-01 | Planned; not authorized until dependencies are Complete | Existing behavior runs through typed seam behind safe flag | L |
| RS-05 | Persistence models and migration | EPIC-02 | RS-02–03 | Planned | Tenant-scoped schema and migration contract pass | L |
| RS-06 | SQLite repository and optimistic concurrency | EPIC-02 | RS-05 | Planned | Durable create/read and version conflict behavior pass | L |
| RS-07 | Atomic transition and outbox | EPIC-02 | RS-06 | Planned | State, task, metadata, and outbox commit atomically | L |
| RS-08 | DNA snapshot and authoritative view | EPIC-02 | RS-07 | Planned | Workflow pins immutable DNA snapshot and returns one versioned view | M |
| RS-09 | Artifact and evidence storage contracts | EPIC-02 | RS-05–08 | Planned | Payload/reference separation and integrity checks pass | L |
| RS-10 | Idempotent outbox publisher | EPIC-02 | RS-07 | Planned | Committed events publish safely under retry | M |
| RS-11 | Versioned queue adapter | EPIC-02 | RS-09–10 | Planned | Provider-neutral envelope and redelivery contract pass | L |
| RS-12 | Bounded worker leasing | EPIC-02 | RS-11 | Planned | One worker leases and completes one bounded task atomically | L |
| RS-13 | Durable command/task idempotency | EPIC-02 | RS-06, RS-12 | Planned | Duplicate logical intent cannot duplicate effects | L |
| RS-14 | Effect registry and reconciliation | EPIC-02 | RS-13 | Planned | Ambiguous effects stop and reconcile explicitly | L |
| RS-15 | Versioned checkpoint integrity | EPIC-02 | RS-09, RS-12 | Planned | Checkpoints are versioned, bounded, and integrity checked | L |
| RS-16 | Pause, resume, cancellation | EPIC-02 | RS-13, RS-15 | Planned | Commands act at safe durable boundaries | L |
| RS-17 | Process/session recovery | EPIC-02 | RS-14–16 | Planned | Restart restores authoritative state without duplicate effect | L |
| RS-18 | Managed relational conformance | EPIC-02 | RS-05–17, service selection | Planned | Managed adapter matches repository/migration contracts | L |
| RS-19 | Managed queue conformance | EPIC-02 | RS-11–17, service selection | Planned | Managed redelivery/lease semantics match queue contract | L |
| RS-20 | Managed object storage conformance | EPIC-02 | RS-09, service selection | Planned | Managed artifact adapter preserves integrity and tenancy | L |
| RS-21 | Structural tenant/runtime safety | EPIC-03 | RS-18–20, trust contracts | Planned | Tenant and safe-runtime structure enforced across spine | L |
| RS-22 | Runtime fault evaluation | EPIC-05 | RS-17–21 | Planned | Required failure scenarios recover or fail safely | L |
| RS-23 | Performance/capacity envelope | EPIC-05 | RS-18–22 | Planned | Candidate limits are measured and published | M |
| RS-24 | Regression, rollback, Epic exit | EPIC-06 | RS-01–23 | Planned | Full product, security, reliability, rollback, and clean-checkout gates pass | L |

## Deferred decomposition

Trust, governed intelligence, operations, Controlled Pilot, Enterprise
Production, and General Availability work remains at epic/feature level until an
approved PRS and 1–3 day implementation plan exist. This prevents the registry
from inventing scope beyond the frozen ARB decision.

## Status update rule

Changing a status to Ready requires approved scope and dependencies. Changing it
to Complete requires a commit hash, current test evidence, completion report,
review, and clean-checkout validation. Release assignment is made only in the
[Release Registry](../releases/RELEASE_REGISTRY.md).

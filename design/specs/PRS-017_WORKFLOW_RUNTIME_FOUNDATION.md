# Product Requirement Specification

## PRS-017 — Workflow Runtime Foundation

## Document Control

| Field | Value |
|---|---|
| Requirement ID | PRS-017 |
| Title | Workflow Runtime Foundation |
| Status | Proposed |
| Target | Production Candidate v1 |
| Product | Modernization AI Lab |
| Governing vision | `design/00_PRODUCT_CONSTITUTION.md` |
| Architecture authority | `docs/enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md` |
| Delivery authority | `docs/enterprise-runtime-foundation/17_ENGINEERING_BACKLOG.md` |
| Primary workstream | Runtime Engineering |
| Required reviewers | Product, Architecture, Runtime Engineering, Security, SRE, Data/Enterprise DNA, Quality Engineering |
| Implementation authorization | Not granted by this document |

## 1. Executive Summary

Modernization AI Lab currently demonstrates a complete Guided Journey and shared
workflow experience. Production Candidate v1 requires the same journey to become
durable without changing its behavior or introducing a second workflow model.

PRS-017 defines the minimum Workflow Runtime Foundation:

- one canonical, versioned workflow state machine;
- tenant-scoped durable workflow and task state;
- transactional checkpoints and integration events;
- one managed queue adapter and one bounded worker path;
- idempotent task and side-effect handling;
- reliable pause, resume, retry, cancellation, and recovery;
- immutable references to Enterprise DNA snapshots and stored artifacts;
- compatibility with the current user experience and deterministic fallback.

This is a runtime foundation, not a workflow-platform product. It must remain a
module within the existing Python codebase and must not introduce microservices,
a custom orchestration platform, or a redesigned Journey.

## 2. Problem Statement

The current product experience proves the modernization workflow, but
browser/process-local execution is not sufficient for a production candidate.
Long-running work may cross browser sessions, worker processes, provider calls,
and human approval waits. Without durable state and explicit recovery semantics,
an interruption can lose progress, repeat work, create ambiguous side effects,
or present incorrect status to Mission Control.

The product needs a small, trustworthy execution foundation before additional
agents, connectors, or enterprise scale are considered.

## 3. Product Outcome

An authorized user can start the existing Guided Journey, leave or lose the
session, and later return to the same authoritative workflow state. The runtime
can safely resume after application or worker interruption without duplicating a
logical task or reporting uncommitted work as complete.

Mission Control, Modernization HQ, and the Guided Journey continue to show one
synchronized case status, current owner, current blocker, next action, evidence,
and workflow stage.

## 4. Product Principles

1. The Journey orchestrates work; it is not the source of enterprise truth.
2. Enterprise DNA remains authoritative for governed enterprise facts.
3. The existing state machine is extended, not replaced or duplicated.
4. Acknowledged state must survive process and session failure.
5. Delivery may be at least once; logical effects must be effectively once.
6. Every workflow, task, artifact, and event is tenant-scoped.
7. Models may explain results but cannot invent numeric scores or mutate state.
8. Every assessment run creates stored, attributable artifacts.
9. High-risk actions remain subject to human approval.
10. A degraded runtime must expose uncertainty; it must never fabricate success.

## 5. Scope

### 5.1 Included

- State ownership contract for case, workflow, task, checkpoint, evidence
  reference, approval reference, audit event, and derived UI state.
- Existing workflow-state-machine inventory and versioned transition contract.
- Workflow instance and task persistence in a managed relational database.
- SQLite-compatible local deterministic execution for development and tests.
- Managed queue abstraction and one bounded worker process/deployment.
- Transactional outbox for durable integration-event publication.
- Task leases, heartbeats, attempt tracking, timeouts, and dead-letter state.
- Idempotency keys and transactional effect registration.
- Safe pause, resume, cancel, retry, and checkpoint recovery.
- Session recovery from authoritative runtime state.
- Immutable Enterprise DNA snapshot reference per workflow run.
- Versioned artifact/evidence references.
- Command/query compatibility boundary for the existing product UI.
- Runtime telemetry and correlation fields required to validate correctness.
- Migration, rollback, fault, and regression verification for this foundation.

### 5.2 Excluded

- New Journey stages, specialist behavior, recommendations, or UI redesign.
- A standalone workflow service or custom workflow-engine product.
- Kubernetes, service mesh, or internal developer platform.
- Standalone model, tool, context, evidence, approval, policy, or audit services.
- Arbitrary code execution, repository ingestion, or unrestricted tools.
- A connector or agent marketplace.
- Graph database adoption.
- Long-term semantic agent memory.
- Multi-region failover or active/active writes.
- Dedicated tenant infrastructure and commercial isolation tiers.
- Advanced policy, identity, AIOps, FinOps, or observability platforms.
- Autonomous remediation or production engineering.
- General-availability scale claims.

### 5.3 Adjacent but Separately Governed

PRS-017 must provide enforcement hooks and identifiers for identity,
authorization, approval, evidence, audit, model, tool, and operations concerns.
The full implementation requirements for those concerns belong to separate
specifications and must not be silently absorbed into this work packet.

## 6. Actors

| Actor | Runtime responsibility |
|---|---|
| Mission Commander | Starts, pauses, resumes, cancels, inspects, and approves authorized work |
| Product UI | Sends commands and reads authoritative case/workflow views |
| Workflow Runtime | Validates and commits legal state transitions |
| Worker | Executes leased, bounded tasks and commits results/checkpoints |
| AI Specialist | Produces typed task output through the worker contract |
| Enterprise DNA | Supplies the immutable enterprise-context snapshot reference |
| Evidence/Artifact Store | Stores versioned payloads referenced by runtime metadata |
| Queue | Delivers durable task messages at least once |
| Human Approver | Authorizes a separately governed high-risk action |
| Operator | Inspects runtime health and performs documented recovery |

## 7. Terminology

| Term | Definition |
|---|---|
| Workflow definition | Immutable, versioned legal stages and transitions |
| Workflow instance | One tenant-scoped execution of a workflow definition for a case |
| Run | One execution attempt for a workflow instance |
| Task | Smallest durable unit leased to a worker |
| Attempt | One execution try for a logical task |
| Checkpoint | Integrity-protected state needed to resume at a durable boundary |
| Effect | An externally observable mutation initiated by a task |
| Idempotency key | Stable key identifying one logical command or effect |
| Outbox event | Integration event committed with authoritative state |
| DNA snapshot | Immutable reference to the enterprise facts used by a workflow |
| Derived view | Rebuildable projection for Mission Control or another workspace |

## 8. State Ownership Requirements

| State | Authoritative owner | Runtime rule |
|---|---|---|
| Enterprise facts and relationships | Enterprise DNA | Workflow reads a pinned snapshot; changes require stewardship |
| Product case definition | Product/case store | Runtime references `case_id`; it does not redefine the case |
| Workflow stage and execution status | Workflow runtime store | One versioned workflow aggregate is authoritative |
| Task lease, attempt, and result | Workflow runtime store | Worker cannot own durable truth in memory |
| Evidence/artifact payload | Versioned object storage | Runtime stores reference, hash, classification, and provenance |
| Approval decision | Approval authority | Runtime stores immutable reference and validates it before action |
| Audit history | Append-only audit record | Workflow transitions emit attributable audit events |
| Mission Control status | Derived projection | Rebuildable from authoritative case/workflow state |
| Browser/session preferences | Session state | Never authoritative for workflow progress |

## 9. Functional Requirements

### 9.1 Workflow Definition and Commands

#### PRS-017-FR-001 — Canonical workflow definition

The runtime shall use one immutable, versioned definition for the existing
Guided Journey stages and legal transitions.

**Acceptance:** No UI, worker, agent, or projection maintains an independent
workflow-stage model. Existing behavior remains covered by regression tests.

#### PRS-017-FR-002 — Typed command boundary

The runtime shall expose typed commands for start, pause, resume, cancel, retry,
inspect, and any existing approved transition.

Each command shall include tenant, subject, case, workflow or idempotency key,
expected state version, correlation, and command timestamp as applicable.

**Acceptance:** Unknown commands or fields are rejected; unauthorized or illegal
transitions do not change state; repeated commands return the existing logical
result.

#### PRS-017-FR-003 — Query boundary

The runtime shall expose authoritative queries for workflow status, stage,
current owner, current task, blocker, next action, evidence references, pending
approval, and task history.

**Acceptance:** Mission Control and Modernization HQ derive synchronized status
from the same workflow version; a browser refresh does not change state.

### 9.2 Persistence and Concurrency

#### PRS-017-FR-004 — Durable workflow aggregate

The runtime shall persist workflow ID, tenant, case, definition version, state,
state version, current stage, owner, next action, DNA snapshot, evidence manifest,
checkpoint, timestamps, and terminal outcome.

**Acceptance:** An acknowledged command remains visible after application and
database-client restart; mandatory tenant and version constraints are enforced.

#### PRS-017-FR-005 — Optimistic concurrency

Each mutating command shall require or derive an expected state version and shall
commit only if that version remains current.

**Acceptance:** Concurrent commands cannot silently overwrite one another; a
conflict returns a stable error and the current version for safe refresh.

#### PRS-017-FR-006 — Transactional outbox

Authoritative state transition and its integration event shall commit in the
same database transaction.

**Acceptance:** Failure after commit but before publication cannot lose the
event; publication may repeat but consumers safely deduplicate it.

### 9.3 Queue and Worker

#### PRS-017-FR-007 — Managed queue abstraction

The runtime shall publish bounded task envelopes through an internal queue
interface implemented by a managed production queue and a deterministic local
test adapter.

**Acceptance:** Domain code has no provider-specific queue dependency; messages
include schema version, tenant, workflow, task, attempt, correlation, causation,
deadline, and trace context.

#### PRS-017-FR-008 — Task leasing

A worker shall obtain a time-bounded lease before task execution and shall renew
it only while making progress.

**Acceptance:** A lost worker's lease expires; another worker can safely resume;
two workers cannot commit conflicting success for one task version.

#### PRS-017-FR-009 — Bounded execution

Each task shall have a declared type, input schema, deadline, retry class,
resource budget, and permitted adapter set.

**Acceptance:** An unregistered task type or expired task is rejected; one task
cannot acquire arbitrary model, tool, filesystem, network, or credential access.

#### PRS-017-FR-010 — Task result commit

A successful task result, artifact references, state transition, checkpoint, and
outbox event shall commit atomically where they belong to one aggregate boundary.

**Acceptance:** The UI never reports a stage complete when its durable result or
checkpoint failed to commit.

### 9.4 Idempotency, Retry, and Effects

#### PRS-017-FR-011 — Command idempotency

Every mutating command shall use an idempotency key scoped by tenant and
operation.

**Acceptance:** Repeating a command with the same key and content returns the
same logical result; reuse with different content is rejected and audited.

#### PRS-017-FR-012 — Task retry

Retries shall use the same logical task ID, increment the attempt number, obey an
end-to-end deadline, and apply bounded exponential backoff with jitter only to
classified transient failures.

**Acceptance:** Deterministic validation, policy denial, and invariant failures
are not blindly retried; nested retry layers cannot multiply beyond the approved
budget.

#### PRS-017-FR-013 — Effect registration

Before any permitted external mutation, the runtime shall register tenant,
logical effect key, typed action, target, input hash, approval reference, and
status.

**Acceptance:** A retry cannot create a second logical effect; an ambiguous
provider outcome enters `ReconciliationRequired` and cannot be marked complete
without evidence.

#### PRS-017-FR-014 — Dead-letter handling

Tasks exhausting their retry policy shall enter an inspectable terminal or
operator-action state with safe error classification and next action.

**Acceptance:** Dead-letter work is tenant-scoped, visible to authorized
operators, attributable, and cannot be silently replayed.

### 9.5 Checkpoint, Pause, Resume, and Recovery

#### PRS-017-FR-015 — Durable checkpoints

The runtime shall create an integrity-protected checkpoint after each durable
stage boundary and before/after an irreversible permitted effect.

**Acceptance:** Checkpoints contain references rather than secrets or unrestricted
payloads and record schema, workflow definition, state version, DNA snapshot,
completed/pending tasks, evidence manifest, and integrity hash.

#### PRS-017-FR-016 — Pause semantics

A pause request shall stop new task scheduling and transition to `Paused` only
after the active atomic transition reaches a safe checkpoint.

**Acceptance:** Pause never abandons a partial transaction or reports an
uncommitted boundary; the product communicates that pause is pending when work is
still reaching safety.

#### PRS-017-FR-017 — Resume semantics

Resume shall continue the same workflow, definition version, DNA snapshot, and
last committed checkpoint unless an explicit governed migration or refresh is
authorized.

**Acceptance:** Completed tasks are not repeated; pending tasks continue in
order; owner, blocker, next action, and evidence remain synchronized.

#### PRS-017-FR-018 — Cancellation semantics

Cancellation shall prevent new work and move the workflow to a legal terminal
state without deleting evidence, audit history, or completed external effects.

**Acceptance:** Cancellation is idempotent; active work reaches a defined safe
boundary; any required reconciliation remains visible.

#### PRS-017-FR-019 — Process recovery

After application or worker interruption, the runtime shall reconstruct work
from authoritative state, active leases, checkpoints, outbox, and effect records.

**Acceptance:** Recovery neither skips uncommitted work nor repeats completed
logical effects; state is reconciled before new execution proceeds.

#### PRS-017-FR-020 — Session recovery

A returning authenticated user shall load authoritative case and workflow state
rather than relying on the previous browser session.

**Acceptance:** Browser close, refresh, or session expiry does not cancel a
workflow; expired authentication requires login before protected state is shown.

### 9.6 Enterprise DNA, Evidence, and Derived Views

#### PRS-017-FR-021 — DNA snapshot pinning

Every workflow run shall reference one immutable Enterprise DNA snapshot.

**Acceptance:** Findings are reproducible against the recorded snapshot; new DNA
facts do not silently alter in-progress work; refresh is an explicit, audited
transition.

#### PRS-017-FR-022 — Artifact persistence

Every assessment run shall create versioned artifact/evidence references with
tenant, source, provenance, classification, integrity hash, and timestamps.

**Acceptance:** Payload and metadata access is tenant-scoped; missing or failed
artifact persistence prevents the dependent stage from completing.

#### PRS-017-FR-023 — Derived status publication

Committed transitions shall publish versioned events for Mission Control and
workspace projections.

**Acceptance:** Projections are idempotent and rebuildable; temporary projection
lag is visible; authoritative queries provide read-your-writes behavior to the
initiating session.

### 9.7 Deterministic Fallback

#### PRS-017-FR-024 — Offline-compatible execution

The workflow shall remain executable without an OpenAI call through the existing
deterministic fallback.

**Acceptance:** Fallback uses the same workflow, task, checkpoint, evidence, and
artifact contracts; the UI accurately identifies deterministic behavior; Python
calculates all numeric scores.

## 10. Workflow States

The minimum runtime state model shall support:

```text
Created
  -> Validating
  -> Ready
  -> Running
  -> Waiting | ApprovalRequired | Pausing | Compensating
  -> Paused | Ready
  -> Completed | Failed | Cancelled | Rejected
```

The implementation may map existing user-visible labels to these runtime states,
but it shall not change the current Guided Journey stages or expose internal
states without a product requirement.

### 10.1 Transition Invariants

- Only the runtime commits workflow transitions.
- Every transition has an actor or workload identity.
- Every transition includes tenant, workflow, expected version, correlation, and
  causation.
- Terminal state is never inferred from queue delivery alone.
- `Completed` requires durable artifacts and checkpoint.
- `ApprovalRequired` cannot advance without a valid approval reference.
- `Failed` may retry only through an explicitly authorized legal transition.
- A DNA snapshot change requires an explicit refresh or migration transition.

## 11. Data Requirements

### 11.1 Minimum Workflow Record

```text
tenant_id
workflow_id
case_id
definition_name
definition_version
state
state_version
current_stage
current_owner
current_blocker
next_action
dna_snapshot_id
evidence_manifest_hash
checkpoint_reference
created_by
created_at
updated_at
completed_at
```

### 11.2 Minimum Task Record

```text
tenant_id
task_id
workflow_id
task_type
state
attempt
lease_owner
lease_expires_at
deadline
idempotency_key
input_hash
result_reference
error_class
created_at
updated_at
```

### 11.3 Event Envelope

Every outbox/integration event shall include:

```text
event_id
schema_version
event_type
tenant_id
aggregate_id
aggregate_version
actor_id
correlation_id
causation_id
occurred_at
classification
payload_or_reference
```

## 12. Non-Functional Requirements

### 12.1 Reliability

- No acknowledged workflow transition may be lost.
- Queue delivery may be at least once; logical task/effect completion must be
  effectively once.
- Retry, timeout, and lease values shall be configuration-controlled and bounded.
- Derived views shall be rebuildable from authoritative records and events.
- Backup/restore and reconciliation shall meet the separately approved candidate
  RTO/RPO.

### 12.2 Availability

- Production shall use managed single-region, multi-zone persistence and queue
  services.
- A model/provider outage shall use approved fallback or explicit waiting state;
  it shall not block state inspection or fabricate execution.
- A projection or telemetry outage shall not corrupt authoritative workflow
  state.

### 12.3 Performance

- Workflow command acceptance p95 target: no more than 2 seconds.
- Ready-task dispatch p95 target: no more than 500 milliseconds, excluding
  deliberate backpressure.
- Agent scheduling overhead p95 target: no more than 1 second.
- Product status reads p95 target: no more than 500 milliseconds.
- Performance shall be measured separately for queue wait, runtime overhead,
  provider time, persistence, and projection lag.

Targets are Production Candidate objectives to validate, not claims about the
current implementation.

### 12.4 Scalability

- Candidate limits for tenants, concurrent workflows, tasks, queue age, evidence
  volume, DNA entities/relationships, and context size shall be explicit.
- Per-tenant quotas and concurrency limits shall provide backpressure.
- The implementation shall not claim unlimited enterprise scale.
- Horizontal worker scaling may use the selected managed platform but shall not
  require Kubernetes.

### 12.5 Security and Privacy

- Tenant scope shall be enforced at persistence, queue, artifact, query, and
  telemetry boundaries.
- Secrets and credentials shall never be stored in checkpoints, messages,
  prompts, logs, or artifacts.
- Sensitive payloads shall be referenced and minimized.
- Production and pilot data use requires separately approved identity, policy,
  classification, retention, and provider-sharing controls.
- Governed mutations fail closed when identity, authorization, approval, or audit
  prerequisites are unavailable.

### 12.6 Observability

The runtime shall emit OpenTelemetry-compatible signals with tenant-safe
correlation across command, transition, outbox, queue, task, model, tool,
checkpoint, artifact, and projection operations.

Required metrics include command latency/outcome, workflow state duration, queue
depth/age, task attempts, lease expiry, dead letters, checkpoint latency,
outbox lag, recovery result, projection lag, and fallback reason.

Telemetry shall not include chain-of-thought, secrets, credentials, or
unrestricted enterprise content.

### 12.7 Accessibility and Responsive Behavior

PRS-017 shall not change user interface structure. Any runtime status or recovery
message exposed through the existing UI shall preserve keyboard access, focus
behavior, reduced-motion support, readable responsive layouts, and existing
accessibility semantics.

## 13. Error Model

| Error class | Runtime behavior | User-visible outcome |
|---|---|---|
| Validation | Reject without retry | Clear correction required |
| Authorization/policy | Fail closed | Access/action denied without hidden progress |
| Version conflict | Preserve current state | Refresh and retry legal command |
| Transient dependency | Bounded retry or waiting | Work delayed with reason/next action |
| Capacity | Queue/backpressure | Accepted with wait or explicit retry response |
| Deterministic runtime defect | Stop and dead-letter | Failed state with support reference |
| Ambiguous external effect | Reconciliation required | Paused/blocked; never reported complete |
| Worker loss | Lease expiry and resume | No duplicate logical work |
| Projection failure | Authoritative read remains available | Status may be delayed and identified |

Errors shall use stable safe codes. Internal stack traces and sensitive provider
details shall not be returned to users.

## 14. Migration Requirements

1. Capture the current workflow and browser regression baseline before changing
   execution ownership.
2. Introduce a command/query compatibility boundary around current behavior.
3. Add durable schemas and adapters behind a disabled feature flag.
4. Dual execution is prohibited if it creates two authoritative state owners.
   Shadow comparison may be read-only and must not publish user-visible state.
5. Migrate one complete Guided Journey path first.
6. Preserve local deterministic mode and existing tests.
7. Enable durable execution for bounded test tenants only after recovery and
   tenant-isolation tests pass.
8. Rollback shall route new work to the prior path while preserving and safely
   resolving already durable workflows.

## 15. Acceptance Scenarios

### AC-001 — Durable start

**Given** an authorized tenant user and a valid modernization case\
**When** the user starts the existing Guided Journey\
**Then** one workflow instance is committed before start is acknowledged\
**And** the same idempotency key cannot create another workflow.

### AC-002 — Application restart

**Given** a workflow has reached a committed stage\
**When** the product application restarts\
**Then** the user sees the same stage, owner, blocker, next action, and evidence\
**And** no completed task reruns.

### AC-003 — Worker loss

**Given** a worker holds an active task lease\
**When** the worker terminates before result commit\
**Then** the lease expires and another worker resumes safely\
**And** at most one successful result is committed.

### AC-004 — Duplicate delivery

**Given** a queue delivers the same logical task more than once\
**When** workers process the deliveries\
**Then** one logical task/effect result exists\
**And** duplicate attempts are attributable.

### AC-005 — Safe pause and resume

**Given** a workflow is executing\
**When** the user requests pause and later resume\
**Then** pause occurs at a durable boundary\
**And** resume continues the same definition, DNA snapshot, and checkpoint.

### AC-006 — Browser/session loss

**Given** a workflow continues after browser close\
**When** the user authenticates in a new session\
**Then** the UI loads authoritative runtime state\
**And** the workflow has not been cancelled or duplicated.

### AC-007 — Provider outage

**Given** an AI task reaches the model adapter\
**When** the approved provider is unavailable\
**Then** the workflow uses the approved deterministic fallback or waits explicitly\
**And** the product does not imply that a model executed when it did not.

### AC-008 — Artifact failure

**Given** a task produces a required assessment artifact\
**When** durable artifact storage fails\
**Then** the dependent workflow stage does not complete\
**And** retry/recovery preserves the same logical artifact identity.

### AC-009 — Concurrent commands

**Given** two commands target the same workflow version\
**When** both attempt incompatible transitions\
**Then** only one commits\
**And** the other receives a version conflict without overwriting state.

### AC-010 — Cross-tenant attempt

**Given** an authenticated user from one tenant\
**When** the user references another tenant's workflow, task, or artifact ID\
**Then** access is denied without revealing foreign metadata\
**And** the attempt is audited.

### AC-011 — Reset regression

**Given** the existing demonstration workflow is active\
**When** Full Reset is invoked in the supported demo mode\
**Then** existing demo behavior remains unchanged\
**And** production durable records are never deleted by a client-side reset.

### AC-012 — Deterministic numeric authority

**Given** a workflow calculates prioritization or readiness scores\
**When** an explanation is generated with or without a model provider\
**Then** Python-calculated numeric scores remain unchanged\
**And** generated text cannot replace or invent them.

## 16. Validation Plan

| Test class | Required evidence |
|---|---|
| Unit | Legal/illegal transitions, score authority, retry classification, idempotency |
| Contract | Commands, queries, event envelope, queue adapter, worker task schemas |
| Persistence | Migrations, optimistic conflicts, outbox atomicity, checkpoints, tenant constraints |
| Integration | Managed database, queue, object storage, backup, and deterministic local adapters |
| Fault injection | App/worker loss, duplicate delivery, timeout, artifact failure, outbox replay |
| Recovery | Pause/resume, session recovery, backup restore, reconciliation |
| Security | Tenant isolation, safe errors, secret exclusion, unauthorized transitions |
| Regression | Existing Python, JavaScript, Guided Journey, Mission Control, reset, and fallback suites |
| Browser | Desktop/tablet/mobile, keyboard, reduced motion, synchronized status |
| Performance | Approved candidate and 2x planned-pilot envelopes |

## 17. Release Gates

PRS-017 implementation is releasable only when:

- The P0 architecture contracts in the ARB decision are approved.
- All functional and non-functional acceptance criteria pass.
- Existing product tests remain green from a clean checkout.
- No duplicate workflow state owner exists.
- Tenant isolation and concurrent-transition tests pass.
- Restart, redelivery, pause/resume, and restore exercises pass.
- No acknowledged transition is lost and no logical effect is duplicated.
- Required artifacts are durably stored and attributable.
- Telemetry provides end-to-end correlation without sensitive content.
- Candidate capacity and performance limits are published.
- Deployment and rollback are demonstrated.
- Known limitations accurately describe the bounded candidate.

## 18. Dependencies

- Approved state ownership, tenant, workflow, risk, data, reliability, and
  operations contracts.
- Managed-service selections for relational database, queue, object storage,
  hosting, identity, secrets/keys, telemetry, and backup.
- Existing workflow state machine and regression baseline.
- Enterprise DNA snapshot contract.
- Separate Trust requirements for identity, authorization, approval, evidence,
  audit, secrets, and content defense.
- Separate Operations requirements for SLOs, incident response, release, and
  recovery ownership.

## 19. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Existing workflow regression | Compatibility seam, feature flag, baseline browser and state tests |
| Duplicate source of truth | Approved ownership contract and schema review |
| Queue duplicate causes duplicate work | Idempotency, effect registry, optimistic state version |
| Partial commit loses event | Transactional outbox |
| Worker recovery repeats completed task | Lease, checkpoint, completed-task registry |
| Provider outage stalls journey | Bounded retry, explicit wait, deterministic fallback |
| Managed-service lock-in | Internal adapter contracts and portable domain schemas |
| Scope expands into platform build | ARB exclusions and change control |
| Sensitive data enters messages/logs | References, classification, redaction, contract tests |
| Migration strands workflows | Version pinning and tested rollback/reconciliation |

## 20. Backlog Traceability

| PRS-017 area | Engineering backlog |
|---|---|
| State ownership and identifiers | PCV1-ARC-001, PCV1-ARC-002 |
| Workflow contract and baseline | PCV1-WF-001, PCV1-QA-001 |
| Runtime boundary and configuration | PCV1-RT-001, PCV1-CFG-001 |
| Durable relational state | PCV1-DB-001 |
| Enterprise DNA snapshot | PCV1-DNA-001 |
| Evidence/artifact persistence | PCV1-ART-001 |
| Queue and worker | PCV1-Q-001 |
| Idempotency and effects | PCV1-REL-002 |
| Checkpoint/session recovery | PCV1-REL-003 |
| Governed model/tool integration | PCV1-MDL-001, PCV1-TOOL-001 |
| Telemetry and qualification | PCV1-OBS-001, PCV1-REL-004, PCV1-QA-002 |

## 21. Open Decisions Before Implementation

1. Which managed relational database, queue, and object-storage services satisfy
   the approved portability and regional constraints?
2. What exact Production Candidate tenant, workflow, evidence, DNA, token, and
   concurrency limits will be published?
3. What candidate RTO/RPO and retention values will be approved?
4. Which existing workflow states map to the internal runtime states without
   changing visible behavior?
5. Which read-oriented tools, if any, are allowed in the first durable workflow?
6. What is the migration/rollback treatment for a workflow already running when
   a workflow-definition version changes?

These decisions must be resolved through the P0 contracts and managed-service
selection. They do not authorize widening PRS-017.

## 22. Approval

| Role | Decision | Name | Date |
|---|---|---|---|
| Product Owner | Pending |  |  |
| Product Architecture | Pending |  |  |
| Runtime Engineering | Pending |  |  |
| Security Engineering | Pending |  |  |
| SRE/Operations | Pending |  |  |
| Data/Enterprise DNA | Pending |  |  |
| Quality Engineering | Pending |  |  |

Implementation shall not begin until the required approvers accept this
specification and all P0 prerequisite contracts are ready.

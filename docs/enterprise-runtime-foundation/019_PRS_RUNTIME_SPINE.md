# Product Requirement Specification

## PRS-019 — Production Candidate v1 Runtime Spine

## Document Control

| Field | Value |
|---|---|
| Requirement ID | PRS-019 |
| Title | Production Candidate v1 Runtime Spine |
| Status | Proposed — approval required before implementation |
| Scope authority | Architecture Review Board Production Candidate v1 decision |
| Epic | EPIC-01 — Compatibility Boundary and Wave 1 minimum Runtime Spine |
| Backlog stories | PCV1-QA-001, PCV1-RT-001, PCV1-CFG-001, PCV1-DB-001, PCV1-DNA-001, PCV1-ART-001, PCV1-Q-001, PCV1-REL-002, PCV1-REL-003 |
| Governing baseline | EGB-018 Engineering Governance Baseline |
| Product owner | Pending assignment |
| Engineering owner | Pending assignment |
| Required reviewers | Product, Architecture, Runtime Engineering, Security, SRE, Data/Enterprise DNA, Quality Engineering |
| Target release | Production Candidate v1 |

The Engineering Governance Baseline is treated as approved based on the explicit
direction authorizing this contract. Updating approval metadata in earlier
documents is outside this PRS and is not performed here.

## 1. Objective

Implement the smallest durable runtime spine that allows the existing
Modernization AI Lab Guided Journey to execute through a stable Python
command/query boundary, persist authoritative workflow state, schedule bounded
tasks through one queue/worker path, checkpoint progress, store evidence and
artifact references, and recover safely after browser, application, or worker
interruption.

The runtime spine must preserve current user-visible behavior. It is an internal
execution foundation, not a new product experience, orchestration platform, or
service estate.

### 1.1 Required Outcome

At completion:

- A start command is acknowledged only after one workflow instance is durably
  committed.
- Mission Control and Modernization HQ read the same authoritative workflow
  version.
- Long-running tasks execute outside the browser request through one bounded
  worker path.
- Duplicate command/message delivery cannot create duplicate logical work.
- Pause and resume use a safe durable checkpoint.
- Restart or session loss restores the same workflow definition, Enterprise DNA
  snapshot, completed work, evidence references, and next action.
- Existing deterministic execution and all validated product paths remain
  operational.

## 2. Business Value

### 2.1 Enterprise Value

- **Continuity:** accepted modernization work survives common process and session
  failures.
- **Trust:** the product displays committed work rather than transient browser or
  worker memory.
- **Accountability:** each workflow, task, result, artifact, and event is
  attributable to a tenant, case, run, actor, and version.
- **Operational control:** failed, waiting, paused, and ambiguous work has an
  inspectable reason and next action.
- **Future readiness:** later Trust, governed AI, and Operations waves can attach
  to stable contracts without replacing the Journey.

### 2.2 Product Value

- Preserves the current Guided Journey and Mission Commander experience.
- Removes browser-session continuity as a condition for workflow correctness.
- Keeps Enterprise DNA as the enterprise-fact authority.
- Avoids premature microservices and platform engineering.
- Maintains offline demonstration and testability through deterministic local
  adapters.

### 2.3 Success Measures

| Measure | Target |
|---|---|
| Lost acknowledged workflow transitions in fault evaluation | 0 |
| Duplicate logical workflows/tasks/effects under duplicate delivery | 0 |
| Required Runtime Spine BDD scenarios passing | 100% |
| Existing release-required Python/JavaScript/browser regressions passing | 100% |
| Recovery from tested application/worker interruption | Same workflow version and checkpoint |
| Production domain dependencies on a specific queue/storage provider | 0 outside adapters |
| New user-visible workflow stages or redesigned interactions | 0 |

## 3. Scope

### 3.1 Included Runtime Spine

1. Current regression baseline for affected product paths.
2. Modular Python command/query boundary around the existing state machine.
3. Typed runtime configuration with deterministic local mode.
4. Tenant-scoped relational workflow/task/checkpoint/effect/outbox schema.
5. SQLite local implementation and managed relational production adapter.
6. Immutable Enterprise DNA snapshot reference per workflow run.
7. Versioned evidence/artifact metadata and object-storage adapter.
8. Transactional outbox and idempotent event publication.
9. Managed queue adapter and deterministic in-process/test adapter.
10. One bounded worker process/deployment with leases and attempt tracking.
11. Command/task/effect idempotency and ambiguous-effect reconciliation state.
12. Pause, resume, cancel, retry, checkpoint, process, and session recovery.
13. Tenant and correlation identifiers propagated through the spine.
14. Minimum runtime signals needed to verify state correctness and performance.

### 3.2 Runtime Spine Boundary

```text
Existing Streamlit / Mission Control Experience
                    |
          Typed Command / Query Boundary
                    |
       Modular Python Workflow Runtime
       - existing state machine adapter
       - transaction and checkpoint module
       - task scheduling module
       - idempotency/effect module
       - projection publication module
                    |
   Relational Store | Queue | Object Storage
                    |
             One Bounded Worker
```

The diagram identifies logical boundaries. It does not authorize separate
network services.

## 4. Actors and Responsibilities

| Actor/component | Responsibility in this PRS |
|---|---|
| Mission Commander | Uses existing controls to start, pause, resume, cancel, reset demo state, and inspect work |
| Existing product UI | Submits typed commands and reads authoritative views |
| Runtime module | Validates and atomically commits legal transitions |
| Existing state machine | Defines legal journey behavior and stage progression |
| Relational store | Owns durable workflow, task, checkpoint, effect, outbox, and metadata state |
| Queue adapter | Delivers bounded task envelopes at least once |
| Worker | Leases tasks, executes approved task types, and commits typed results |
| Enterprise DNA | Supplies the immutable snapshot reference used by the workflow |
| Artifact adapter | Stores versioned payloads; runtime stores metadata and integrity references |
| Projection consumer | Builds synchronized, rebuildable Mission Control/workspace status |
| Operator | Inspects failed/dead-letter/reconciliation state through supported diagnostics |

Identity-provider integration, policy decisions, approval implementation, and
governed model/tool execution belong to later waves. This spine provides their
required fields and extension points but does not implement those platforms.

## 5. Functional Requirements

### 5.1 Compatibility and Runtime Boundary

#### PRS-019-FR-001 — Preserve canonical workflow behavior

The runtime shall adapt the existing workflow state machine rather than create a
second definition of stages or legal transitions.

**Acceptance:** Existing stages, owner/blocker/next-action behavior, reset, and
case synchronization remain unchanged; a code/schema review finds one
authoritative workflow aggregate.

#### PRS-019-FR-002 — Typed commands

The runtime shall define typed commands for existing start, pause, resume,
cancel, retry, and transition behaviors.

Each mutating command shall contain or derive:

- schema version;
- tenant, subject, case, and workflow identifiers;
- idempotency key;
- expected workflow-state version;
- correlation and causation identifiers;
- command timestamp and deadline;
- typed action payload.

**Acceptance:** Unknown fields, unsupported schema versions, illegal transitions,
or mismatched identifiers are rejected without state mutation.

#### PRS-019-FR-003 — Typed queries

The runtime shall provide queries for case/workflow status, current stage,
current owner, current task, blocker, next action, evidence/artifact references,
pending work, and transition history.

**Acceptance:** Mission Control and Modernization HQ return the same aggregate
version and do not treat a derived projection as authoritative.

#### PRS-019-FR-004 — Compatibility adapter

The existing product shall call the command/query boundary through a compatibility
adapter that preserves current event handlers and user-visible behavior.

**Acceptance:** The durable path can be enabled for bounded test tenants through
a safe configuration/feature flag; disabling it preserves the current local
deterministic path for new demo workflows.

### 5.2 Configuration

#### PRS-019-FR-005 — Typed runtime configuration

Configuration shall be schema-validated at startup and cover execution mode,
relational/queue/artifact adapter selection, connection references, lease and
retry limits, concurrency, feature flags, and performance limits.

**Acceptance:** Invalid or incomplete production configuration fails safely;
local deterministic defaults require no cloud service or API call; secrets are
referenced, not stored in configuration.

### 5.3 Durable Workflow State

#### PRS-019-FR-006 — Workflow aggregate

The relational store shall persist at minimum:

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

**Acceptance:** Required identifiers are non-null; state version increases on
each successful mutation; an acknowledged transition is visible after process
restart.

#### PRS-019-FR-007 — Optimistic concurrency

Mutating workflow commands shall commit only when the expected state version is
current.

**Acceptance:** Concurrent incompatible commands result in one commit and one
stable version-conflict response; no last-writer-wins overwrite is possible.

#### PRS-019-FR-008 — Transactional transition

A workflow state change, task scheduling decision, checkpoint/artifact metadata
required by the transition, and outbox event shall commit atomically within the
aggregate transaction boundary.

**Acceptance:** The product cannot report completion when required state,
checkpoint, metadata, or event commit fails.

#### PRS-019-FR-009 — Schema migrations

Persisted schemas shall be versioned and changed through reviewed migrations
compatible with the approved release/rollback sequence.

**Acceptance:** A clean database, representative existing data, forward
migration, mixed-version read, and documented rollback path are tested in both
SQLite-compatible local mode and the selected managed relational engine.

### 5.4 Enterprise DNA and Artifacts

#### PRS-019-FR-010 — DNA snapshot pinning

Each workflow run shall reference one immutable Enterprise DNA snapshot.

**Acceptance:** Recovery uses the recorded snapshot; newly discovered enterprise
facts do not silently change in-progress work; refresh requires a future explicit
governed transition.

#### PRS-019-FR-011 — Artifact payload and metadata separation

Payloads shall be stored through the object-storage adapter. The relational store
shall contain tenant, artifact/evidence ID, workflow/task ID, type, version,
source, provenance, classification, integrity hash, object reference, and
timestamps.

**Acceptance:** Missing or failed required artifact storage blocks dependent
transition completion; integrity mismatch is an explicit failure; queue messages
and checkpoints contain references rather than unrestricted payloads.

#### PRS-019-FR-012 — Every assessment run stores artifacts

Every supported assessment run, including deterministic local execution, shall
produce versioned artifact/evidence records through the same domain contract.

**Acceptance:** Model availability does not change storage obligations; a run is
not marked complete before required artifact metadata is committed.

### 5.5 Outbox, Queue, and Worker

#### PRS-019-FR-013 — Transactional outbox

Every event required to schedule work or update a projection shall be written in
the same transaction as its authoritative state transition.

**Acceptance:** Publisher failure after commit cannot lose the event; repeated
publication is safe; publication state and lag are inspectable.

#### PRS-019-FR-014 — Versioned task envelope

The queue envelope shall contain:

```text
schema_version
message_id
tenant_id
workflow_id
run_id
task_id
task_type
attempt
idempotency_key
correlation_id
causation_id
trace_context
deadline
input_reference_or_bounded_payload
```

**Acceptance:** Provider-specific queue fields do not enter the domain contract;
invalid/expired messages cannot execute.

#### PRS-019-FR-015 — Task leasing

A worker shall acquire a time-bounded lease before executing a task and may renew
the lease only while making progress.

**Acceptance:** A terminated worker's lease expires; another worker can resume;
two attempts cannot both commit success against the same task state version.

#### PRS-019-FR-016 — Bounded worker execution

The worker shall execute only registered task types with typed input/output,
deadline, retry class, resource limits, and permitted internal adapters.

**Acceptance:** An unregistered task or adapter is rejected. Wave 1 provides no
arbitrary model, tool, filesystem, repository, credential, or network authority.

#### PRS-019-FR-017 — Task result commit

Task result metadata, artifact references, task state, workflow transition,
checkpoint, and outbox events belonging to one aggregate boundary shall commit
atomically.

**Acceptance:** Queue acknowledgement occurs only after durable result commit;
commit failure leaves the task retryable or inspectable, not falsely complete.

#### PRS-019-FR-018 — Dead-letter state

A task that exhausts approved attempts or reaches a non-retryable failure shall
enter an inspectable dead-letter or terminal state with safe error class,
correlation reference, owner, and next action.

**Acceptance:** Dead-letter tasks do not replay automatically and never reveal
foreign tenant metadata or sensitive payloads.

### 5.6 Idempotency and Effects

#### PRS-019-FR-019 — Command idempotency

Every mutating command shall use a stable key scoped by tenant, operation, and
logical target.

**Acceptance:** Same key and content return the same logical result; same key with
different content is rejected and recorded as an integrity conflict.

#### PRS-019-FR-020 — Task idempotency

Queue redelivery and worker retry shall retain the same logical task ID and
idempotency key while incrementing the attempt number.

**Acceptance:** Duplicate delivery produces one committed logical result and an
attributable duplicate/attempt record.

#### PRS-019-FR-021 — Effect registry

The runtime schema shall register any externally observable mutation before
execution with tenant, effect key, action type, target, input hash, status, and
result/receipt reference.

Wave 1 does not introduce new external write-capable adapters. The registry is
required to preserve current approved behavior and provide the contract for later
governed adapters.

**Acceptance:** A repeated effect key cannot start a second logical effect;
unknown outcome transitions to `ReconciliationRequired` rather than retry or
completion.

#### PRS-019-FR-022 — Bounded retries

Retries shall apply only to classified transient failures, use exponential
backoff with jitter, remain within one end-to-end deadline/budget, and never
multiply independently across layers.

**Acceptance:** Validation, version conflict requiring refresh, policy denial,
invariant failure, and ambiguous effect are not blindly retried.

### 5.7 Checkpoint and Recovery

#### PRS-019-FR-023 — Checkpoint envelope

Each durable checkpoint shall include schema version, tenant, workflow, run,
state version, definition version, stage, DNA snapshot, completed/pending task
IDs, artifact references, evidence-manifest hash, timestamp, and integrity hash.

**Acceptance:** Checkpoint contains no secret or unrestricted artifact payload;
corruption or incompatible schema fails safely and prevents resume.

#### PRS-019-FR-024 — Checkpoint timing

The runtime shall checkpoint after every durable stage boundary and before/after
any currently permitted irreversible effect.

**Acceptance:** Restart resumes from the latest committed safe boundary and does
not infer completion from an expired lease or delivered message.

#### PRS-019-FR-025 — Pause

Pause shall stop scheduling new tasks and reach `Paused` only after the active
atomic transition reaches a safe checkpoint.

**Acceptance:** While reaching safety the status is `Pausing`; no partial
transaction or uncommitted artifact is abandoned or presented as paused.

#### PRS-019-FR-026 — Resume

Resume shall continue the same workflow ID, definition version, DNA snapshot,
state version lineage, and latest valid checkpoint.

**Acceptance:** Completed logical tasks do not repeat; owner, blocker, next
action, evidence, and stage remain synchronized.

#### PRS-019-FR-027 — Cancellation

Cancel shall stop new task scheduling and transition to a legal terminal state
after active work reaches its defined safe boundary.

**Acceptance:** Cancel is idempotent; it does not delete completed evidence,
artifacts, checkpoints, effects, or audit references; unresolved reconciliation
remains visible.

#### PRS-019-FR-028 — Application/worker recovery

After process interruption, the runtime shall reconstruct work from the
authoritative workflow/task state, leases, checkpoints, outbox, and effect
records.

**Acceptance:** Recovered work neither skips uncommitted tasks nor repeats
committed logical results; a reconciliation pass completes before unsafe new
execution.

#### PRS-019-FR-029 — Session recovery

After browser refresh, close, or session expiry, the existing product shall load
authoritative workflow state rather than reconstruct progress from browser
memory.

**Acceptance:** Browser loss does not cancel, reset, or duplicate a durable
workflow. Authentication behavior remains unchanged until the Trust wave.

### 5.8 Derived Views and Reset

#### PRS-019-FR-030 — Idempotent projections

Mission Control and workspace status projections shall consume versioned events
idempotently and be rebuildable from authoritative runtime records.

**Acceptance:** Duplicate/out-of-order events cannot regress the displayed
aggregate version; projection lag is distinguishable from authoritative state.

#### PRS-019-FR-031 — Read-your-writes

The initiating session shall observe the committed command result immediately
through an authoritative read or aggregate version token.

**Acceptance:** The UI does not display the prior stage after a command has been
acknowledged solely because a projection is delayed.

#### PRS-019-FR-032 — Reset compatibility and safety

The existing Full Reset shall preserve current deterministic demo behavior.
Client/demo reset shall not delete production durable workflow, evidence,
artifact, effect, or audit records.

**Acceptance:** Demo-mode reset returns the validated initial experience;
production-mode durable data deletion requires a separately governed operation
outside this PRS.

## 6. Non-Functional Requirements

### 6.1 Compatibility

- Existing public product behavior and navigation remain unchanged.
- Existing Python, JavaScript, browser, accessibility, responsive, multi-case,
  reset, and deterministic fallback tests remain release gates.
- Local development and tests operate without managed services or an OpenAI call.

### 6.2 Maintainability

- Runtime, persistence, queue, artifact, and projection interfaces are typed and
  provider-neutral.
- One repository and owning team remain responsible for application and worker.
- New modules follow directional dependency rules and do not import UI state as
  domain truth.
- Schema, message, event, checkpoint, and workflow-definition versions are
  explicit.

### 6.3 Operability

- Safe error codes and correlation IDs are available for every command/task.
- Queue/outbox lag, attempts, lease expiry, dead-letter count, checkpoint failure,
  recovery outcome, and projection lag are measurable.
- Wave 1 instrumentation may use existing/local sinks; the managed telemetry
  backend and production alerting are Wave 4.

### 6.4 Portability

- Domain contracts contain no managed-provider SDK type.
- SQLite/local adapters and selected managed adapters pass the same contract
  suite where semantics overlap.
- Differences in transaction, lease, delivery, ordering, and visibility semantics
  are documented and tested.

## 7. Architecture Constraints

1. One modular Python codebase; no Runtime Spine microservices.
2. At most two application deployment roles: existing UI/application and one
   worker role.
3. Existing state machine is canonical; no second workflow engine/model.
4. Managed relational database in candidate environments; SQLite locally.
5. Managed queue and object storage selected through approved platform decision;
   deterministic local adapters remain available.
6. Transactional current state plus append-only events/outbox; no universal event
   sourcing.
7. Enterprise DNA remains fact authority; runtime pins immutable snapshot IDs.
8. Queue delivery is at least once; logical results/effects are effectively once.
9. Derived views are rebuildable and never authoritative.
10. Pydantic or the approved existing typed-validation mechanism defines external
    and asynchronous boundaries.
11. No direct provider calls from product UI or domain state machine.
12. No Kubernetes, service mesh, graph database, custom workflow engine, custom
    policy engine, or new web framework.
13. No production secrets in source, configuration values, queue messages,
    checkpoints, logs, or artifact metadata.
14. No user-interface redesign or new Journey stage.

## 8. BDD Scenarios

### BDD-019-001 — Durable workflow start

**Given** a valid tenant-scoped case and the existing Guided Journey start action\
**When** the user starts the journey\
**Then** one workflow instance and initial outbox event commit atomically\
**And** acknowledgement contains the committed workflow ID and state version\
**And** repeating the same idempotency key does not create another workflow.

### BDD-019-002 — Application restart

**Given** an acknowledged workflow transition and committed checkpoint\
**When** the application process restarts\
**Then** the product loads the same workflow, definition, stage, owner, blocker,
next action, DNA snapshot, and evidence references\
**And** no completed task executes again.

### BDD-019-003 — Worker termination and lease recovery

**Given** a worker has leased a task but has not committed its result\
**When** that worker terminates and its lease expires\
**Then** another worker may lease the same logical task\
**And** one successful result can commit\
**And** both attempts remain attributable.

### BDD-019-004 — Duplicate queue delivery

**Given** the managed queue delivers one task message twice\
**When** both deliveries are processed\
**Then** the runtime commits one logical task result\
**And** any repeated effect key cannot create a second effect.

### BDD-019-005 — Concurrent workflow commands

**Given** two incompatible commands reference the same workflow state version\
**When** both attempt to commit\
**Then** exactly one transition commits\
**And** the other receives a version conflict with the current version\
**And** no state is overwritten.

### BDD-019-006 — Safe pause and resume

**Given** a workflow is executing an atomic transition\
**When** pause is requested\
**Then** no new task is scheduled\
**And** the runtime reaches `Paused` only after a safe checkpoint\
**When** resume is requested\
**Then** execution continues from that checkpoint using the same definition and
DNA snapshot.

### BDD-019-007 — Browser/session loss

**Given** a workflow continues after the browser closes\
**When** the user returns in a valid session\
**Then** the product reads authoritative workflow state\
**And** the workflow was neither cancelled, reset, nor duplicated by session
loss.

### BDD-019-008 — Required artifact storage failure

**Given** a task produces an artifact required to complete a stage\
**When** object storage or metadata commit fails\
**Then** the stage does not complete\
**And** retry preserves the same logical artifact identity\
**And** no missing artifact is presented as evidence.

### BDD-019-009 — Outbox publisher interruption

**Given** a workflow transition and outbox event have committed\
**When** the publisher stops before queue/projection acknowledgement\
**Then** the event remains pending\
**And** a later publisher safely republishes it\
**And** consumers apply the aggregate version once.

### BDD-019-010 — Ambiguous effect

**Given** an effect was registered and the external response is lost\
**When** the runtime cannot establish whether execution occurred\
**Then** the effect and workflow enter `ReconciliationRequired`\
**And** no blind retry occurs\
**And** the work is not presented as complete.

### BDD-019-011 — DNA snapshot stability

**Given** a workflow is pinned to a DNA snapshot\
**When** Enterprise DNA receives newer facts\
**Then** the in-progress workflow continues using its recorded snapshot\
**And** the new facts do not silently alter its result.

### BDD-019-012 — Deterministic local execution

**Given** no managed service or OpenAI connection is available\
**When** the supported local journey executes\
**Then** it uses deterministic local adapters through the same domain contracts\
**And** Python-calculated scores and required artifacts remain available.

### BDD-019-013 — Projection lag

**Given** a command has committed but a Mission Control projection is delayed\
**When** the initiating session reads status\
**Then** it receives the committed aggregate version\
**And** the system does not report the prior state as current.

### BDD-019-014 — Full Reset boundary

**Given** demo mode contains a deterministic workflow\
**When** Full Reset is used\
**Then** the existing demo experience returns to its validated initial state\
**And** no production durable record can be deleted by the same client action.

### BDD-019-015 — Cross-tenant identifier attempt

**Given** a trusted execution context for tenant A\
**When** a command, query, task, or artifact reference names a tenant B resource\
**Then** the runtime rejects the mismatch before access or mutation\
**And** returns no tenant B metadata.

Wave 1 does not implement OIDC or the complete authorization platform. This
scenario validates structural tenant propagation and mismatch rejection using
the trusted-context contract and deterministic security fixtures.

## 9. Evaluation Criteria

All evaluations are blocking for Epic 1 completion.

| Evaluation | Evidence | Passing threshold |
|---|---|---|
| EVAL-019-001 — Contract correctness | Command/query/event/message/checkpoint schema tests | All supported schemas valid; all unknown/invalid forms rejected |
| EVAL-019-002 — State correctness | Legal/illegal transition and optimistic concurrency tests | No illegal commit or silent overwrite |
| EVAL-019-003 — Durability | Application/worker termination after each commit boundary | No acknowledged transition or required artifact reference lost |
| EVAL-019-004 — Idempotency | Duplicate commands, messages, tasks, and effect keys | One logical workflow/task/effect result |
| EVAL-019-005 — Recovery | Pause/resume, lease expiry, checkpoint corruption, outbox replay, session recovery | Resume from latest valid boundary; unsafe corruption fails closed |
| EVAL-019-006 — Storage portability | SQLite/local and managed relational/queue/artifact contract suites | Domain-equivalent behavior passes; documented semantic differences |
| EVAL-019-007 — DNA/evidence integrity | Snapshot stability, artifact failure, hash validation | No silent snapshot drift or evidence completion without payload/integrity |
| EVAL-019-008 — Security structure | Tenant mismatch, secret scanning, payload minimization, unsafe task rejection | 100% negative cases pass; no secret/payload leakage |
| EVAL-019-009 — Product regression | Existing Python, JavaScript, browser, accessibility, responsive, multi-case, reset, fallback suites | 100% release-required tests pass |
| EVAL-019-010 — Performance | Approved candidate command/query/queue/checkpoint/recovery load | All budgets in Section 12 pass at candidate load |
| EVAL-019-011 — Scope conformance | Dependency/deployment/state-owner review | No forbidden component, new UI behavior, or duplicate authority |

An aggregate score cannot compensate for failure of any evaluation.

## 10. Security Requirements

### SEC-019-001 — Tenant propagation

Every workflow, task, checkpoint, effect, event, queue message, artifact metadata,
object path, query, and trace shall contain trusted tenant scope.

### SEC-019-002 — Tenant mismatch rejection

The runtime shall reject any object or message whose tenant does not match the
trusted execution context before retrieving or mutating data.

### SEC-019-003 — No implicit authorization claim

Wave 1 tenant context is a structural interface and deterministic test fixture,
not a substitute for Wave 2 managed identity/authorization. Production enablement
remains blocked until the Trust wave enforces that context.

### SEC-019-004 — Secret exclusion

Secrets, credentials, tokens, private keys, and connection values shall not enter
domain records, queue messages, checkpoints, logs, browser state, or artifact
metadata.

### SEC-019-005 — Data minimization

Messages/checkpoints shall use references and bounded typed payloads. Artifact
payloads shall remain behind the artifact adapter and shall carry classification
and integrity metadata.

### SEC-019-006 — Safe worker boundary

Workers shall execute registered task types only and shall not receive arbitrary
filesystem, repository, shell, network, model, tool, or secret access.

### SEC-019-007 — Integrity

Commands, task inputs, artifacts, evidence manifests, checkpoints, and effects
shall use stable content hashes where required to detect changed or conflicting
content.

### SEC-019-008 — Safe errors

Errors shall expose stable code, workflow/task reference, and remediation without
foreign tenant metadata, internal stack trace, secret, or unrestricted payload.

### SEC-019-009 — Audit extension point

Every committed transition shall include actor/workload, tenant, correlation,
causation, input/output hash/reference, version, and timestamp fields required by
the later immutable audit implementation.

### SEC-019-010 — Supply-chain discipline

Any new client library required by the selected managed adapters shall undergo
license, maintenance, vulnerability, size, and operational-impact review. No
managed adapter is introduced through this PRS until service selection is
approved.

## 11. Reliability Requirements

### REL-019-001 — Durable acknowledgement

The runtime shall acknowledge a mutation only after authoritative state and its
outbox event commit.

### REL-019-002 — At-least-once/effectively-once semantics

Queue messages may repeat. Workflow, task, artifact identity, and registered
logical effects shall not duplicate.

### REL-019-003 — Bounded retries

Retry attempts, delays, jitter, deadlines, and retryable error classes shall be
configuration-controlled and tested. Nested layers shall share one retry budget.

### REL-019-004 — Lease recovery

Worker death shall release work only through lease expiry or explicit safe
release; heartbeat alone shall not imply task completion.

### REL-019-005 — Checkpoint integrity

Checkpoints shall be created at defined boundaries, versioned, integrity-checked,
and forward-readable or explicitly migrated.

### REL-019-006 — Outbox recovery

Unpublished committed events shall remain discoverable and republishable;
consumers shall be idempotent by event and aggregate version.

### REL-019-007 — Ambiguous-effect safety

An unknown external outcome shall stop for reconciliation. It shall not be
retried, cancelled as though nothing happened, or reported complete.

### REL-019-008 — Projection recovery

Mission Control/workspace projections shall rebuild from authoritative state and
events without changing workflow truth.

### REL-019-009 — Graceful local degradation

Absence of managed infrastructure or OpenAI shall preserve the supported local
deterministic path. The product shall identify its execution mode accurately.

### REL-019-010 — Fault verification

Tests shall terminate the application/worker and interrupt storage/publication at
every material boundary. Mock-only happy-path coverage is insufficient.

Full managed backup/restore, multi-zone failover, SLO alerting, and incident
runbooks are Wave 4. Wave 1 must produce schemas and recovery behavior compatible
with that later work.

## 12. Performance Budgets

Budgets are Production Candidate objectives measured with representative
synthetic data at the approved candidate envelope. Provider/model time is outside
the Runtime Spine and excluded from these measurements.

| Operation | Budget |
|---|---:|
| Workflow command validation and durable acceptance, p95 | <= 2 seconds |
| Authoritative workflow status query, p95 | <= 500 milliseconds |
| Queue enqueue after outbox availability, p95 | <= 100 milliseconds platform overhead |
| Ready-task dispatch after queue visibility, p95 | <= 500 milliseconds |
| Worker lease acquisition overhead, p95 | <= 250 milliseconds |
| Checkpoint metadata commit, p95 | <= 500 milliseconds |
| Artifact metadata commit excluding payload transfer, p95 | <= 500 milliseconds |
| Projection freshness, p99 | <= 5 seconds |
| Initiating-session read-your-writes | Immediate from committed response/version |
| Recovery scheduling after expired lease is detected, p95 | <= 5 seconds plus configured lease expiry |
| Local deterministic runtime overhead versus current baseline, p95 | <= 20% regression |

### 12.1 Capacity Envelope

Before implementation is Ready, Product and SRE shall approve numeric limits for:

- tenants and users in candidate evaluation;
- concurrent workflows per tenant and total;
- tasks per workflow and worker concurrency;
- maximum task duration and retry attempts;
- queue depth/oldest age;
- Enterprise DNA entities, relationships, and traversal bounds;
- artifact count/size and total storage;
- checkpoint and event retention;
- query and projection batch size.

This PRS does not claim performance beyond those published limits.

## 13. Acceptance Criteria

Epic 1 is accepted only when all statements are true:

1. One canonical state machine and workflow aggregate own execution status.
2. Existing UI uses the typed compatibility boundary without redesigned behavior.
3. A workflow start is durable and idempotent before acknowledgement.
4. Managed relational and SQLite/local adapters pass the approved contract suite.
5. Workflow/task schemas enforce tenant, version, and referential constraints.
6. Transition and outbox event commit atomically.
7. One managed queue adapter and one bounded worker path pass delivery/lease tests.
8. Duplicate commands/messages/tasks/effect keys create one logical outcome.
9. Required artifacts and evidence metadata are versioned and integrity-linked.
10. Each workflow is pinned to one immutable Enterprise DNA snapshot.
11. Pause, resume, cancel, application restart, worker loss, and session recovery
    behave as specified.
12. Ambiguous effects stop for reconciliation and are not falsely completed.
13. Mission Control and Modernization HQ show one synchronized aggregate version.
14. Demo Full Reset remains compatible and cannot delete production durable data.
15. Deterministic local execution works without managed infrastructure or OpenAI.
16. All BDD-019 scenarios and EVAL-019 evaluations pass.
17. All performance budgets pass at the approved candidate envelope.
18. No implementation from later waves or explicit out-of-scope list is present.
19. Existing release-required regression suites pass from a clean checkout.
20. Files, commands, tests, results, limitations, rollback, and evidence are
    recorded in the required completion report.

## 14. Dependencies

### 14.1 Blocking Governance Dependencies

- Approved Product Constitution.
- Approved ARB Production Candidate v1 decision.
- Approved Engineering Governance Baseline.
- Approved state ownership contract (`PCV1-ARC-001`).
- Approved identity/correlation contract (`PCV1-ARC-002`).
- Approved workflow transition contract (`PCV1-WF-001`).
- Approved data contract (`PCV1-DATA-001`).
- Approved reliability contract (`PCV1-REL-001`).
- Approved managed-service selection (`PCV1-PLAT-001`).
- Locked current regression baseline (`PCV1-QA-001`).

### 14.2 Product and Technical Dependencies

- Current Streamlit application and standalone Mission Control behavior.
- Existing workflow state machine and shared case model.
- Enterprise DNA foundation and snapshot contract.
- Existing deterministic fallback and Python scoring logic.
- Pydantic-compatible typed validation.
- SQLite local/test support.
- Selected managed relational database, queue, and object storage with local
  adapter substitutes.
- Test tooling for Python, JavaScript, browser, accessibility, fault, and
  performance validation.

### 14.3 Later-Wave Dependencies Not Required to Build the Spine

- Managed OIDC/workload identity and complete tenant authorization.
- Versioned policy and action-bound human approval enforcement.
- Immutable audit export.
- Governed model/context/tool adapters and content defense.
- Managed telemetry backend, SLO alerts, runbooks, DR exercise, and CI/CD
  qualification.

The spine must expose compatible extension fields but must not implement or mock
these later capabilities as though they were production controls.

## 15. Risks

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| Duplicate workflow source of truth | Critical | State ownership contract, one aggregate, architecture fitness test | Product Architecture |
| Guided Journey regression | High | Baseline before change, compatibility adapter, feature flag, full regression | Product/QA |
| Queue duplicates logical work | Critical | Command/task idempotency, optimistic versioning, effect registry | Runtime Engineering |
| Partial transition loses scheduling/event | Critical | Transactional outbox and atomic aggregate commit | Runtime Engineering |
| Worker recovery repeats completed task | Critical | Leases, attempt state, checkpoint, idempotent result commit | Runtime Engineering |
| Ambiguous effect is retried | Critical | ReconciliationRequired state and no-blind-retry invariant | Runtime/Security |
| Managed service leaks into domain | Medium | Adapter contracts and cross-adapter contract tests | Product Architecture |
| SQLite/managed semantic mismatch | High | Documented differences, integration tests on target engine | Runtime/Data |
| DNA snapshot drifts during workflow | High | Immutable pinned snapshot and explicit future refresh | Enterprise DNA |
| Artifact payload missing after completion | High | Store-before-complete transaction boundary and integrity checks | Runtime/Data |
| Tenant scope is treated as authentication | Critical | Explicit trusted-context limitation; production blocked until Trust wave | Security |
| Checkpoint schema becomes incompatible | High | Versioning, forward-read/migration tests, definition pinning | Runtime Engineering |
| Projection displays stale state as current | Medium | Aggregate versions, read-your-writes, visible lag | Runtime/Product |
| Scope expands into platform build | High | Explicit exclusions, dependency review, ARB change control | Engineering Manager |
| Performance budgets set without capacity limit | High | Approve numeric envelope before Ready | Product/SRE |

## 16. Definition of Ready

Implementation may begin only when:

- PRS-019 is approved by all required reviewers.
- Every blocking dependency in Section 14.1 is accepted and linked.
- Exact files/modules in scope and current behavior are inspected.
- Managed service choices and local adapters are approved.
- Candidate capacity values and lease/retry/checkpoint settings have initial
  approved bounds.
- Database, message, event, checkpoint, artifact, and query schemas are reviewed.
- Migration, feature-flag, rollback, and in-flight-workflow behavior are defined.
- Required BDD/evaluation tests are mapped to test locations.
- Security and data reviewers approve structural tenant and payload boundaries.
- Work is decomposed into backlog stories of 8 points or fewer.

## 17. Definition of Done

The Runtime Spine epic is Done only when:

- All included backlog stories meet the Engineering Governance Baseline
  Definition of Done.
- All functional and non-functional requirements are implemented within scope.
- All BDD, evaluation, security, reliability, performance, and acceptance gates
  pass.
- Targeted tests and the complete release-required regression suite pass from a
  clean checkout.
- Fault injection covers application/worker loss, duplicate delivery, commit
  interruption, outbox replay, checkpoint corruption, artifact failure, and
  projection lag.
- Schema migrations and rollback/in-flight compatibility are demonstrated.
- Local deterministic and managed adapter contract suites pass.
- No secret, unrestricted enterprise content, or local absolute path is exposed
  in source, telemetry, artifacts, or user-facing documentation.
- Mission Control and Modernization HQ remain synchronized and accessible across
  supported viewports and keyboard/reduced-motion modes.
- Completion evidence lists files, commands, tests, results, accepted criteria,
  known limitations, risks, migration, rollback, and exact validation steps.
- Architecture, Product, Security, SRE, Data/Enterprise DNA, Quality, and Runtime
  Engineering approve Epic 1 exit.

Completion of code alone is not Epic completion.

## 18. Explicit Out of Scope

The following shall not be implemented under PRS-019:

- New Journey stages, case types, recommendations, specialist behavior, or UI
  redesign.
- Managed OIDC, MFA, workload identity, full RBAC/ABAC, policy administration, or
  approval user experience.
- Standalone identity, policy, approval, evidence, audit, context, model, tool,
  workflow, or telemetry services.
- New model-provider routing, model prompts, semantic memory, embeddings, or
  model-quality features.
- New external tools, connectors, production writes, code execution, repository
  ingestion, or sandbox platform.
- Immutable audit export, enterprise SIEM/DLP integration, or advanced content
  defense.
- Managed telemetry backend, SLO/error-budget automation, incident platform,
  AIOps, or autonomous remediation.
- Full backup/restore certification, multi-zone failover exercise, warm regional
  standby, or active/active regions.
- Worker autoscaling, weighted fair scheduling, dedicated tenant shards, or
  multiple isolation/availability tiers.
- Distributed cache, graph database, event-sourcing platform, service mesh,
  Kubernetes, Docker mandate, or internal developer platform.
- Custom workflow engine, queue, database, object store, secrets, identity,
  policy, observability, FinOps, or release platform.
- Canary/blue-green rollout platform, custom CI/CD, or general release-engineering
  implementation beyond the interfaces needed by later work.
- Controlled Pilot, Enterprise Production, or General Availability claims.

Any proposed addition requires evidence, impact analysis, backlog/PRS amendment,
and the approval required by EGB-018. A deferred capability may not be smuggled
into the Runtime Spine as refactoring or infrastructure convenience.

## 19. Traceability

| PRS-019 area | Backlog | BDD/evaluation |
|---|---|---|
| Regression baseline | PCV1-QA-001 | EVAL-019-009 |
| Runtime command/query boundary | PCV1-RT-001 | BDD-019-001, 005, 013; EVAL-019-001, 002 |
| Typed configuration | PCV1-CFG-001 | BDD-019-012; EVAL-019-006 |
| Relational workflow state | PCV1-DB-001 | BDD-019-001, 002, 005; EVAL-019-002, 003 |
| Enterprise DNA snapshot | PCV1-DNA-001 | BDD-019-011; EVAL-019-007 |
| Artifact/evidence references | PCV1-ART-001 | BDD-019-008; EVAL-019-007 |
| Queue and worker | PCV1-Q-001 | BDD-019-003, 004; EVAL-019-003, 006 |
| Idempotency/effect/outbox | PCV1-REL-002 | BDD-019-004, 009, 010; EVAL-019-004 |
| Checkpoint/session recovery | PCV1-REL-003 | BDD-019-002, 003, 006, 007; EVAL-019-005 |
| Structural tenant boundary | PCV1-ARC-002 | BDD-019-015; EVAL-019-008 |
| Scope conformance | ARB Wave 1 | EVAL-019-011 |

## 20. Approval

| Role | Decision | Name | Date |
|---|---|---|---|
| Product Owner | Pending |  |  |
| Principal Engineering Manager | Pending |  |  |
| Product Architecture | Pending |  |  |
| Runtime Engineering | Pending |  |  |
| Security Engineering | Pending |  |  |
| SRE/Operations | Pending |  |  |
| Data/Enterprise DNA | Pending |  |  |
| Quality Engineering | Pending |  |  |

Implementation shall not begin until PRS-019 and all Definition of Ready
conditions are approved.

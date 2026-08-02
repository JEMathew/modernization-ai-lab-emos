# Runtime Spine Implementation Plan

## Production Candidate v1 — Epic 1

## Document Control

| Field | Value |
|---|---|
| Plan ID | RSIP-020 |
| Status | Proposed execution plan |
| Requirement | `019_PRS_RUNTIME_SPINE.md` |
| Architecture authority | `16_ARCHITECTURE_REVIEW_BOARD_DECISION.md` |
| Governance authority | `018_ENGINEERING_GOVERNANCE_BASELINE.md` |
| Backlog authority | `17_ENGINEERING_BACKLOG.md` |
| Delivery model | Five releasable sprints; 1–3 day single-engineer slices |
| Implementation authorization | Not granted by this document |
| Scope | Wave 1 minimum Runtime Spine only |

## 1. Plan Objective

Deliver the approved Runtime Spine through small vertical slices that preserve the
existing product after every merge. The sequence establishes behavioral contracts
before persistence, persistence before asynchronous execution, and durable
execution before recovery hardening.

Each sprint ends with demonstrable functionality and a releasable repository.
Incomplete paths remain disabled by a safe runtime feature flag; the existing
deterministic journey remains the default until the complete Epic 1 exit gate
passes.

## 2. Planning Rules

1. One slice is owned by one engineer and estimated at one to three working days.
2. A slice must be independently reviewable, testable, reversible, and
   demonstrable.
3. Tests and contract fixtures are part of the slice, not follow-up work.
4. No slice introduces a second workflow state machine or durable state owner.
5. No slice changes user-visible Journey behavior or redesigns the UI.
6. All runtime behavior remains available through deterministic local adapters.
7. Managed-provider selection and credentials remain configuration/adapters; no
   domain module imports provider-specific SDK types.
8. The existing product remains releasable with the Runtime Spine flag disabled.
9. A failed security, state-correctness, recovery, or regression gate blocks the
   next dependent slice.
10. Expected file paths are planning targets. A required path change must preserve
    module boundaries and be documented in the slice review; it cannot expand
    scope.

## 3. Expected Module Shape

```text
engine/runtime/
  __init__.py
  contracts.py
  config.py
  models.py
  service.py
  repository.py
  sqlite_repository.py
  migrations/
  artifacts.py
  outbox.py
  queue.py
  worker.py
  effects.py
  checkpoints.py
  recovery.py
  projections.py
  security.py

tests/runtime/
  test_contracts.py
  test_config.py
  test_repository.py
  test_migrations.py
  test_artifacts.py
  test_outbox.py
  test_queue.py
  test_worker.py
  test_effects.py
  test_checkpoints.py
  test_recovery.py
  test_projections.py
  test_security.py
  test_faults.py
  test_performance.py
```

This is one logical package in the existing Python codebase, not a service
decomposition. `engine/workflow.py`, `engine/__init__.py`, and `app/main.py` may
change only through explicit compatibility slices. Standalone Mission Control
implementation files are not expected to change.

## 4. Sprint Summary

| Sprint | Demonstrable outcome | Slices | Release posture |
|---|---|---:|---|
| Sprint 1 | Existing Journey runs through typed runtime seam in deterministic mode | 4 | Runtime flag off by default; existing behavior intact |
| Sprint 2 | Workflow start/status survive application restart using local durable storage | 4 | Durable path enabled only for test/demo tenant |
| Sprint 3 | One bounded task persists artifacts and completes through outbox, queue, and worker | 4 | Async path feature-flagged; sync fallback intact |
| Sprint 4 | Duplicate delivery, pause/resume, worker loss, and ambiguous effects recover safely | 5 | Complete local Runtime Spine candidate path |
| Sprint 5 | Security structure, fault, performance, and full regressions produce Epic exit evidence | 4 | Epic 1 releasable for next-wave integration |

## 5. Common Slice Definition of Done

Every slice is Done only when:

- Its objective and acceptance criteria are implemented without excluded scope.
- New/changed contracts are typed and versioned.
- Required unit, contract, integration, security, reliability, and regression
  tests pass.
- Failure and rollback behavior is verified.
- Tenant and correlation identifiers propagate through changed boundaries.
- No secret, credential, private data, or unrestricted enterprise content enters
  source, fixtures, messages, checkpoints, logs, or artifacts.
- Existing deterministic happy path remains operational.
- The completion report records files, commands, tests, results, acceptance,
  limitations, and rollback.
- Required reviewers approve the cohesive diff.

## 6. Sprint 1 — Contracts and Compatibility Seam

### Sprint Goal

Route the existing workflow through typed runtime contracts without changing its
state ownership, persistence behavior, or user experience.

### Sprint Demonstration

From a clean reset, run the current Guided Journey through a local in-process
runtime adapter. Show typed start/status commands, stable correlation IDs, and
identical current behavior with the feature flag both off and on.

### Sprint Release Gate

- Existing Python and JavaScript suites pass.
- Guided Journey and Mission Control critical browser paths pass.
- Runtime flag defaults off outside explicit local/test configuration.
- No new persistent state or asynchronous worker is active.

### RS-01 — Lock Runtime Spine regression and state inventory

**Estimate:** 1–2 days, one QA/runtime engineer.

- **Objective:** Convert current workflow behavior and state ownership into an
  executable baseline before inserting a runtime seam.
- **Business value:** Protects the stable product and prevents accidental second
  sources of truth.
- **Functional scope:** Inventory current stages, commands, state fields, reset,
  case synchronization, deterministic fallback, and artifact behavior; add
  missing characterization tests only.
- **Explicit exclusions:** Production code refactor, schema, queue, feature
  behavior, UI changes.
- **Dependencies:** Approved PRS-019; PCV1-WF-001 and PCV1-QA-001 ready.
- **Files expected to change:** `tests/test_workflow.py`,
  `tests/test_agency.py`; new `tests/runtime/test_current_behavior.py`;
  test-only documentation in the required work result. No product file expected.
- **BDD scenarios:** Baseline prerequisites for BDD-019-001, 002, 006, 007, 012,
  013, and 014.
- **Evaluation requirements:** Establish EVAL-019-009 baseline; record exact
  commands, counts, and known expected failures.
- **Security checks:** Fixtures are synthetic; no secrets/local absolute paths;
  characterize current tenant/case identifiers without claiming enforcement.
- **Reliability checks:** Confirm current reset/fallback behavior and identify
  every in-memory state owner and interruption boundary.
- **Regression scope:** Full current Python suite; all existing prototype
  JavaScript tests; Guided Journey, multi-case, reset, responsive, accessibility,
  keyboard, reduced-motion, and console baselines.
- **Acceptance criteria:** One approved inventory maps each visible status to its
  current owner; critical behaviors have repeatable tests; no production behavior
  changes.
- **Definition of Done:** Common DoD plus baseline artifacts reviewed by Product,
  Architecture, Runtime, and QA.

### RS-02 — Define versioned runtime contracts

**Estimate:** 2–3 days, one Python/runtime engineer.

- **Objective:** Define typed identifiers, commands, queries, results, task/event
  envelopes, safe errors, and state-version tokens without executing new logic.
- **Business value:** Creates a stable seam for durable execution and later Trust
  controls.
- **Functional scope:** Pydantic-compatible contracts for tenant, subject, case,
  workflow, run, task, correlation/causation, start/pause/resume/cancel/retry,
  status query, workflow view, error result, and schema version.
- **Explicit exclusions:** Database models, business transition logic, queue
  provider, identity/authentication, UI integration.
- **Dependencies:** RS-01; PCV1-ARC-001/002 and workflow contract approved.
- **Files expected to change:** New `engine/runtime/__init__.py`,
  `engine/runtime/contracts.py`, `tests/runtime/__init__.py`,
  `tests/runtime/test_contracts.py`; possible export-only change to
  `engine/__init__.py` deferred unless required.
- **BDD scenarios:** Contract support for BDD-019-001, 005, 015.
- **Evaluation requirements:** EVAL-019-001; positive/negative schema fixtures;
  deterministic serialization snapshots.
- **Security checks:** Tenant required; unknown fields rejected; safe errors omit
  stack/payload; identifier mismatch representable; no secret fields.
- **Reliability checks:** Idempotency, expected version, deadline, correlation,
  causation, and schema version are mandatory where applicable.
- **Regression scope:** RS-01 suite plus import/backward-compatibility tests.
- **Acceptance criteria:** All contract types validate/serialize deterministically;
  invalid versions/unknown fields/missing tenant fail; no runtime behavior changes.
- **Definition of Done:** Common DoD plus Architecture and Security contract review.

### RS-03 — Add typed Runtime Spine configuration

**Estimate:** 1–2 days, one Python/runtime engineer.

- **Objective:** Introduce safe, typed selection of execution mode and adapters.
- **Business value:** Enables incremental rollout and preserves installation-free
  local deterministic behavior.
- **Functional scope:** Configuration for `legacy_local` and
  `runtime_local` modes, adapter names, feature flag, database/object locations
  by reference, lease/retry/concurrency bounds, and validation.
- **Explicit exclusions:** Managed provider SDKs, credentials, infrastructure,
  production flag enablement, dynamic configuration service.
- **Dependencies:** RS-02; approved initial limit ranges.
- **Files expected to change:** New `engine/runtime/config.py`,
  `tests/runtime/test_config.py`; minimal configuration loading hook in
  `engine/runtime/__init__.py`.
- **BDD scenarios:** Supports BDD-019-012 and safe rollout of all other scenarios.
- **Evaluation requirements:** EVAL-019-001, 006, 011.
- **Security checks:** Secret-looking values rejected from serializable config;
  production mode cannot select fake/test adapters; flag defaults safe.
- **Reliability checks:** Invalid production config fails startup; local defaults
  require no external service or OpenAI call.
- **Regression scope:** Full Python suite and deterministic startup test.
- **Acceptance criteria:** Both local modes load deterministically; invalid modes
  or unsafe combinations fail with safe error; no environment secret is logged.
- **Definition of Done:** Common DoD plus documented configuration matrix and
  rollback to `legacy_local`.

### RS-04 — Implement the in-process runtime service and UI compatibility adapter

**Estimate:** 2–3 days, one senior Python/product engineer.

- **Objective:** Route existing workflow start/status behavior through the typed
  seam using current in-memory execution.
- **Business value:** Proves integration before adding persistence and isolates
  future runtime change from product UI.
- **Functional scope:** Runtime service interface; adapter over current
  `engine/workflow.py`; typed start/status; stable IDs/correlation; minimal
  `app/main.py` integration behind `runtime_local` flag.
- **Explicit exclusions:** Durable store, queue, worker, new transitions, UI
  redesign, standalone Mission Control integration, model/tool changes.
- **Dependencies:** RS-01, RS-02, RS-03.
- **Files expected to change:** New `engine/runtime/service.py`,
  `tests/runtime/test_service.py`; minimal changes to `engine/workflow.py`,
  `engine/__init__.py`, `app/main.py`, and affected existing tests.
- **BDD scenarios:** Initial local form of BDD-019-001, 012, 013, 014.
- **Evaluation requirements:** EVAL-019-001, 002, 009, 011.
- **Security checks:** Tenant/correlation propagate through adapter; no new
  authority; no sensitive state rendered/logged.
- **Reliability checks:** Same idempotency key is accepted as contract input but
  durable deduplication remains explicitly unsupported until Sprint 2/4; flag-off
  rollback is verified.
- **Regression scope:** Full Python/JavaScript suites and exact Guided Journey
  start/status/reset browser path in both modes.
- **Acceptance criteria:** User-visible output is equivalent; typed runtime result
  drives current UI; flag off restores prior path; no duplicate work object/state.
- **Definition of Done:** Common DoD plus Product/Architecture approval of the
  compatibility seam and recorded Sprint 1 demo.

## 7. Sprint 2 — Durable State and Authoritative Reads

### Sprint Goal

Persist workflow state, state versions, outbox records, DNA snapshot references,
and authoritative status in SQLite local mode without asynchronous execution.

### Sprint Demonstration

Start a workflow through the existing UI, restart the application, and show the
same workflow ID, stage, owner, blocker, next action, DNA snapshot, and committed
aggregate version. Demonstrate a concurrent command conflict and immediate
read-your-writes.

### Sprint Release Gate

- Durable mode remains enabled only for local/test tenant configuration.
- Schema/migrations and repository contracts pass on clean and representative
  databases.
- Sprint 1 and full current regressions pass.
- Application restart loses no acknowledged transition.

### RS-05 — Define runtime persistence models and initial migration

**Estimate:** 2–3 days, one data/runtime engineer.

- **Objective:** Create versioned relational schema for workflow, task,
  checkpoint metadata, effects, outbox, artifact metadata, and schema history.
- **Business value:** Establishes the single durable owner needed for continuity.
- **Functional scope:** Tenant constraints, primary/foreign keys, state/version,
  timestamps, immutable identifiers, migration runner, local SQLite schema.
- **Explicit exclusions:** Managed database adapter, queue execution, artifact
  payload storage, policy/approval/audit behavior, data backfill from browser.
- **Dependencies:** RS-02, RS-03; approved state/data contracts.
- **Files expected to change:** New `engine/runtime/models.py`,
  `engine/runtime/repository.py`, `engine/runtime/migrations/001_runtime_spine.sql`,
  `engine/runtime/migrations/__init__.py`, `tests/runtime/test_migrations.py`,
  `tests/runtime/test_models.py`.
- **BDD scenarios:** Schema support for BDD-019-001, 002, 004, 005, 008–011, 015.
- **Evaluation requirements:** EVAL-019-001, 002, 006, 008.
- **Security checks:** Tenant in every table/key path; no credential/payload
  columns; immutable IDs and integrity metadata constrained.
- **Reliability checks:** Migration transactionality; repeated migration safe;
  interrupted migration recovery documented/tested.
- **Regression scope:** Sprint 1 plus clean/upgrade SQLite fixtures.
- **Acceptance criteria:** Clean migration succeeds; schema constraints reject
  missing tenant/invalid references; version table records migration; rollback
  treatment documented.
- **Definition of Done:** Common DoD plus Data/Architecture schema review.

### RS-06 — Implement SQLite repository and optimistic concurrency

**Estimate:** 2–3 days, one Python/data engineer.

- **Objective:** Implement the repository contract for workflow create/read and
  compare-and-swap state transition.
- **Business value:** Makes accepted state durable and prevents silent concurrent
  overwrite.
- **Functional scope:** Unit of work, create, authoritative read, transition with
  expected state version, transaction rollback, deterministic local database.
- **Explicit exclusions:** Task queue, outbox publishing, artifact payload,
  managed relational implementation, UI feature enablement.
- **Dependencies:** RS-05.
- **Files expected to change:** New `engine/runtime/sqlite_repository.py`,
  `tests/runtime/test_repository.py`; updates to `engine/runtime/repository.py` and
  `engine/runtime/models.py`.
- **BDD scenarios:** BDD-019-001 persistence core, 002, 005, 015.
- **Evaluation requirements:** EVAL-019-002, 003, 006, 008.
- **Security checks:** All repository methods require trusted tenant argument;
  cross-tenant ID mismatch returns no foreign metadata; parameterized SQL only.
- **Reliability checks:** Commit/rollback injection; concurrent writers; database
  busy/locked classification; connection lifecycle.
- **Regression scope:** Sprint 1; repository tests against fresh and migrated DB.
- **Acceptance criteria:** Acknowledged create/read survives process reconnect;
  one of two same-version transitions commits; conflict returns current version;
  transaction failure leaves prior state intact.
- **Definition of Done:** Common DoD plus persistence contract review.

### RS-07 — Commit durable start, transition, and outbox atomically

**Estimate:** 2–3 days, one senior runtime engineer.

- **Objective:** Move start and one representative existing transition to the
  durable repository with transactional outbox creation.
- **Business value:** Produces the first truthful durable workflow acknowledgement.
- **Functional scope:** Service unit of work, command idempotency reservation
  schema hook, workflow aggregate commit, initial task intent/outbox event,
  authoritative result/version.
- **Explicit exclusions:** Outbox publisher, queue, worker, complete idempotency
  behavior, every transition migration.
- **Dependencies:** RS-04, RS-06.
- **Files expected to change:** `engine/runtime/service.py`,
  `engine/runtime/repository.py`, `engine/runtime/sqlite_repository.py`,
  `engine/runtime/models.py`, migration amendment or `002_command_outbox.sql`,
  new `tests/runtime/test_transactions.py`.
- **BDD scenarios:** BDD-019-001, 005, 009 (event remains pending only).
- **Evaluation requirements:** EVAL-019-002, 003, 011.
- **Security checks:** Tenant/case consistency before transaction; safe conflict
  errors; no event payload contains unrestricted case data.
- **Reliability checks:** Failure injected before/after workflow insert and outbox
  insert; acknowledgement only after commit; pending event remains discoverable.
- **Regression scope:** Sprint 1/2; Guided Journey start with flag off/on.
- **Acceptance criteria:** One transaction contains workflow and outbox; injected
  failure produces neither or both; returned version reads immediately; legacy
  path remains intact.
- **Definition of Done:** Common DoD plus recorded durable-start demonstration.

### RS-08 — Pin DNA snapshot and expose authoritative workflow view

**Estimate:** 2–3 days, one Python/Enterprise DNA engineer.

- **Objective:** Record immutable DNA snapshot reference at start and serve a
  synchronized authoritative workflow view to the existing UI.
- **Business value:** Makes decisions reproducible and eliminates browser-derived
  status after restart.
- **Functional scope:** Snapshot-reference contract, start validation, workflow
  view projection in-process, read-your-writes token, owner/blocker/next-action
  mapping, restart integration.
- **Explicit exclusions:** New Enterprise DNA features, graph store, snapshot
  refresh, asynchronous projection consumer, UI redesign.
- **Dependencies:** RS-07 and existing Enterprise DNA foundation.
- **Files expected to change:** New `engine/runtime/projections.py`,
  `tests/runtime/test_projections.py`; updates to `engine/runtime/contracts.py`,
  `engine/runtime/service.py`, `engine/runtime/models.py`, `app/main.py`, and
  relevant workflow tests.
- **BDD scenarios:** BDD-019-002, 011, 013, 014, 015.
- **Evaluation requirements:** EVAL-019-002, 003, 007, 008, 009.
- **Security checks:** Snapshot tenant/case match; view excludes internal payloads;
  trusted tenant required for query.
- **Reliability checks:** Restart uses stored snapshot/version; delayed derived
  view cannot override authoritative read; missing snapshot fails before start.
- **Regression scope:** Full tests plus Mission Control/HQ status synchronization,
  multi-case selection, reset, browser refresh.
- **Acceptance criteria:** Restart returns identical workflow view; DNA updates do
  not alter active snapshot; initiating session sees committed version; demo reset
  behavior remains unchanged.
- **Definition of Done:** Common DoD plus Sprint 2 restart demonstration and
  Product/Data approval.

## 8. Sprint 3 — Artifacts, Outbox, Queue, and Worker

### Sprint Goal

Execute one existing bounded workflow task asynchronously through local adapters,
persist its required artifact, commit its result/checkpoint metadata, and update
authoritative status.

### Sprint Demonstration

Start a test-tenant workflow, show a pending outbox event, publish a versioned task
to the deterministic queue, lease and execute it in the bounded worker, persist a
versioned artifact, commit the result, and display the next committed workflow
state. Restart the UI during execution to demonstrate session independence.

### Sprint Release Gate

- Async mode remains feature-flagged for explicit local/test tenants.
- Existing sync/deterministic fallback remains available.
- Artifact failure cannot complete a stage.
- Queue delivery and worker behavior pass contract and negative tests.
- Sprint 1–2 and full current regressions pass.

### RS-09 — Implement artifact and evidence storage contracts

**Estimate:** 2–3 days, one data/runtime engineer.

- **Objective:** Separate artifact payload storage from durable tenant-scoped
  metadata and integrity records.
- **Business value:** Ensures every assessment run produces attributable evidence
  before a stage is considered complete.
- **Functional scope:** Artifact/evidence contracts; deterministic local object
  adapter; metadata repository; content hash; version; classification/provenance;
  store/read/integrity verification.
- **Explicit exclusions:** Cloud-provider SDK, retention/deletion automation,
  immutable audit export, user-facing evidence redesign.
- **Dependencies:** RS-05, RS-06, approved data contract.
- **Files expected to change:** New `engine/runtime/artifacts.py`,
  `tests/runtime/test_artifacts.py`; updates to `engine/runtime/contracts.py`,
  `engine/runtime/models.py`, `engine/runtime/repository.py`,
  `engine/runtime/sqlite_repository.py`; migration `003_artifacts.sql` if not in
  the initial schema.
- **BDD scenarios:** BDD-019-008, 012, 015.
- **Evaluation requirements:** EVAL-019-006, 007, 008.
- **Security checks:** Tenant-scoped object key; path traversal blocked; payload
  excluded from logs/messages/checkpoints; synthetic fixtures; integrity hash.
- **Reliability checks:** Payload write/metadata commit failure matrix; duplicate
  artifact ID/content behavior; corrupted/missing payload fails explicitly.
- **Regression scope:** Existing assessment/artifact tests plus Sprint 1–2.
- **Acceptance criteria:** Artifact can be stored/read through domain adapter;
  required metadata persists; mismatch/missing payload blocks completion; local
  deterministic run produces artifact contract output.
- **Definition of Done:** Common DoD plus Data/Security review of artifact boundary.

### RS-10 — Implement idempotent outbox publisher

**Estimate:** 2 days, one runtime engineer.

- **Objective:** Publish committed outbox events safely to an abstract event/task
  destination.
- **Business value:** Eliminates the commit-versus-scheduling loss window.
- **Functional scope:** Pending-event scan/claim, versioned event envelope,
  publish attempt/result, backoff metadata, acknowledgement, idempotent local
  consumer test fixture.
- **Explicit exclusions:** Managed queue SDK, worker execution, production
  scheduler, telemetry backend.
- **Dependencies:** RS-07.
- **Files expected to change:** New `engine/runtime/outbox.py`,
  `tests/runtime/test_outbox.py`; updates to repository/models and migration if
  claim/publish fields are added.
- **BDD scenarios:** BDD-019-009, 015.
- **Evaluation requirements:** EVAL-019-001, 003, 004, 008.
- **Security checks:** Tenant/correlation in event; bounded reference payload;
  publisher cannot cross tenant; safe errors.
- **Reliability checks:** Crash before/after destination acceptance and before
  acknowledgement; duplicate publication; abandoned claim recovery; bounded
  backoff.
- **Regression scope:** Sprint 1–2 plus transaction/outbox tests.
- **Acceptance criteria:** Every committed pending event is eventually publishable;
  interruption cannot lose it; repeated publication is safe for test consumer;
  uncommitted events never publish.
- **Definition of Done:** Common DoD plus failure-boundary test evidence.

### RS-11 — Add versioned queue adapter and task envelope

**Estimate:** 2–3 days, one distributed-systems engineer.

- **Objective:** Introduce provider-neutral queue semantics and deterministic
  local delivery for bounded task envelopes.
- **Business value:** Separates long work from the browser without creating a
  custom queue platform.
- **Functional scope:** Queue protocol; local deterministic adapter; enqueue,
  receive, visibility/lease token, acknowledge, reject/dead-letter; schema
  validation; task-envelope conversion from outbox.
- **Explicit exclusions:** Managed provider implementation until service
  selection is approved, autoscaling, priority/fair queues, multiple worker pools.
- **Dependencies:** RS-02, RS-03, RS-10.
- **Files expected to change:** New `engine/runtime/queue.py`,
  `tests/runtime/test_queue.py`; updates to `engine/runtime/outbox.py`,
  `engine/runtime/contracts.py`, and `engine/runtime/config.py`.
- **BDD scenarios:** BDD-019-003, 004, 009, 015.
- **Evaluation requirements:** EVAL-019-001, 004, 006, 008.
- **Security checks:** Unknown/expired/wrong-tenant envelopes rejected; bounded
  payload/reference; no credential fields; deterministic test queue unavailable
  in production mode.
- **Reliability checks:** At-least-once delivery, duplicate message, visibility
  timeout, acknowledgement loss, dead-letter threshold.
- **Regression scope:** Sprint 1–3 plus outbox replay.
- **Acceptance criteria:** Valid event produces one typed task envelope; local
  adapter can deliberately redeliver; consumer contract safely identifies
  duplicates; domain code imports no provider type.
- **Definition of Done:** Common DoD plus queue semantic differences documented.

### RS-12 — Implement bounded worker leasing and atomic task completion

**Estimate:** 3 days, one senior runtime engineer.

- **Objective:** Lease and execute one registered existing task type, store its
  artifact, and atomically commit task/workflow result and outbox/checkpoint
  metadata.
- **Business value:** Delivers the first end-to-end asynchronous modernization
  work unit independent of the browser.
- **Functional scope:** Worker loop entry point; task registry; lease/heartbeat;
  typed handler; deadline/resource checks; result commit; acknowledge after
  commit; terminal/dead-letter classification; graceful stop.
- **Explicit exclusions:** Arbitrary task/plugin discovery, model/tool authority,
  concurrent autoscaling, production daemon supervisor, multiple task classes.
- **Dependencies:** RS-09, RS-11, repository/task schema.
- **Files expected to change:** New `engine/runtime/worker.py`,
  `tests/runtime/test_worker.py`; updates to service/repository/models/artifacts;
  possible new `engine/runtime/handlers.py` for one registered task only.
- **BDD scenarios:** BDD-019-003, 004, 008, 012, 015.
- **Evaluation requirements:** EVAL-019-002, 003, 004, 006, 007, 008.
- **Security checks:** Closed task registry; trusted tenant match at lease/commit;
  no shell/filesystem/network/model/tool capability; bounded error output.
- **Reliability checks:** Worker crash before/after artifact and result commit;
  lease expiry; heartbeat failure; acknowledgement loss; dead-letter behavior.
- **Regression scope:** Sprint 1–3; existing workflow/assessment behavior; browser
  start/status while worker runs.
- **Acceptance criteria:** One queued task runs outside UI process; required
  artifact persists; result/state commit atomically; queue acknowledges only after
  commit; crash/redelivery cannot produce a second committed result.
- **Definition of Done:** Common DoD plus Sprint 3 end-to-end demo and
  Runtime/Data/QA approval.

## 9. Sprint 4 — Idempotency, Checkpoints, and Recovery

### Sprint Goal

Complete the local Runtime Spine correctness model for duplicate delivery,
effects, pause/resume/cancel, checkpoint integrity, worker loss, process restart,
and browser/session recovery.

### Sprint Demonstration

Run a workflow while deliberately duplicating a command/message, terminating the
worker, pausing/resuming, and simulating an unknown external effect. Show one
logical result, recovery from the latest checkpoint, and an explicit
`ReconciliationRequired` stop rather than a blind retry.

### Sprint Release Gate

- All Sprint 1–4 Runtime Spine BDD scenarios pass locally.
- No acknowledged transition is lost under supported fault injection.
- Duplicate delivery creates no duplicate logical result/effect.
- Existing deterministic path and product regressions remain green.
- Async Runtime Spine remains bounded to approved local/test tenants.

### RS-13 — Enforce durable command and task idempotency

**Estimate:** 2–3 days, one runtime/data engineer.

- **Objective:** Complete persistent deduplication for mutating commands and task
  results.
- **Business value:** Makes retries and queue redelivery safe and predictable.
- **Functional scope:** Idempotency record lifecycle; content hash; in-progress,
  completed, conflict, expiry/retention state; command and task integration;
  stable replay result.
- **Explicit exclusions:** External effect execution, cross-region deduplication,
  administrative replay UI.
- **Dependencies:** RS-06, RS-07, RS-12.
- **Files expected to change:** New or updated `engine/runtime/effects.py`,
  repository/models/migration `004_idempotency_effects.sql`, service/worker;
  `tests/runtime/test_idempotency.py`.
- **BDD scenarios:** BDD-019-001, 004, 005.
- **Evaluation requirements:** EVAL-019-002, 004, 008.
- **Security checks:** Tenant-operation-target scope; same key/different content is
  integrity conflict; results disclose no foreign record.
- **Reliability checks:** Crash after reservation/before commit; concurrent same
  key; replay after success; retention longer than delivery/retry window.
- **Regression scope:** Sprint 1–3 plus duplicate command/task fixtures.
- **Acceptance criteria:** Same key/content returns same logical result; same
  key/different content fails; concurrent duplicates commit once; task redelivery
  cannot create a second result.
- **Definition of Done:** Common DoD plus concurrency test evidence.

### RS-14 — Implement effect registry and reconciliation state

**Estimate:** 2 days, one runtime/security engineer.

- **Objective:** Record logical side-effect intent/outcome and stop safely when an
  outcome is unknown.
- **Business value:** Prevents duplicate or fabricated completion during external
  uncertainty.
- **Functional scope:** Effect record/state machine; register-before-execute
  contract; input/result hashes/references; statuses including
  `ReconciliationRequired`; deterministic fake-effect adapter for tests only.
- **Explicit exclusions:** New production write adapter, automated compensation,
  reconciliation UI, policy/approval implementation.
- **Dependencies:** RS-13; approved risk boundary.
- **Files expected to change:** `engine/runtime/effects.py`, repository/models and
  migration, `tests/runtime/test_effects.py`; minimal worker hook.
- **BDD scenarios:** BDD-019-004, 010, 015.
- **Evaluation requirements:** EVAL-019-004, 005, 008, 011.
- **Security checks:** No effect without tenant/task/action/target/content hash;
  no credentials stored; production adapters remain absent.
- **Reliability checks:** Timeout before/after fake acceptance; duplicate effect
  key; reconciliation transition; no blind retry or false completion.
- **Regression scope:** Sprint 1–4; verify current approved behavior unaffected.
- **Acceptance criteria:** Unknown result stops workflow visibly; duplicate effect
  cannot execute; resolved fake effect requires explicit reconciliation evidence;
  no new external authority exists.
- **Definition of Done:** Common DoD plus Security review of future extension seam.

### RS-15 — Implement versioned checkpoint envelope and integrity validation

**Estimate:** 2–3 days, one runtime engineer.

- **Objective:** Persist the minimum state needed to resume safely at defined
  workflow boundaries.
- **Business value:** Makes long-running work recoverable without replaying
  completed stages.
- **Functional scope:** Checkpoint model/serializer; completed/pending task IDs;
  definition/state/DNA/evidence versions; artifact refs; integrity hash;
  store/read/latest-valid; corruption/incompatibility handling.
- **Explicit exclusions:** Full payload snapshots, secrets, provider state,
  workflow-definition migration tooling.
- **Dependencies:** RS-08, RS-09, RS-12.
- **Files expected to change:** New `engine/runtime/checkpoints.py`,
  `tests/runtime/test_checkpoints.py`; repository/models/migration and worker
  result-commit integration.
- **BDD scenarios:** BDD-019-002, 006, 008, 011.
- **Evaluation requirements:** EVAL-019-001, 003, 005, 007, 008.
- **Security checks:** References/bounded metadata only; tenant/workflow match;
  integrity validation; safe corruption error.
- **Reliability checks:** Checkpoint before/after boundary; partial write;
  incompatible version; latest-valid selection; completed-task preservation.
- **Regression scope:** Sprint 1–4 plus workflow-stage boundary tests.
- **Acceptance criteria:** Valid checkpoint round-trips deterministically;
  corruption/incompatible version prevents unsafe resume; completed work is
  identifiable; no secret/payload stored.
- **Definition of Done:** Common DoD plus checkpoint schema review.

### RS-16 — Implement pause, resume, and cancellation semantics

**Estimate:** 2–3 days, one workflow/runtime engineer.

- **Objective:** Connect existing user controls to durable safe-boundary
  transitions.
- **Business value:** Gives Mission Commander reliable control over work without
  corrupting or abandoning it.
- **Functional scope:** `Pausing`, `Paused`, resume, and cancel command handling;
  stop-new-task rule; active-task boundary; checkpoint requirement; idempotency;
  synchronized workflow view.
- **Explicit exclusions:** New UI controls/labels, forced task kill, evidence
  deletion, compensation platform, approval behavior.
- **Dependencies:** RS-13, RS-15, current pause/resume/reset behavior inventory.
- **Files expected to change:** `engine/runtime/service.py`,
  `engine/runtime/checkpoints.py`, `engine/runtime/worker.py`,
  `engine/runtime/projections.py`, `engine/workflow.py`, `app/main.py` only if
  required to wire existing controls; new `tests/runtime/test_pause_resume.py`.
- **BDD scenarios:** BDD-019-006, 014.
- **Evaluation requirements:** EVAL-019-002, 003, 005, 009.
- **Security checks:** Trusted tenant/subject propagated; cancel cannot delete
  durable evidence/effects; safe status/errors.
- **Reliability checks:** Pause during active transition; repeated pause/resume/
  cancel; worker loss during Pausing; resume from checkpoint only.
- **Regression scope:** Full Guided Journey controls, reset, case switching,
  keyboard/focus/reduced-motion; Sprint 1–4.
- **Acceptance criteria:** Pause reaches safe checkpoint before `Paused`; resume
  preserves workflow/definition/DNA snapshot; cancel is terminal/idempotent and
  retains evidence; current controls remain visually unchanged.
- **Definition of Done:** Common DoD plus Product/QA browser demonstration.

### RS-17 — Implement process and session recovery coordinator

**Estimate:** 2–3 days, one senior reliability/runtime engineer.

- **Objective:** Reconcile durable state after application/worker/browser
  interruption and safely schedule resumable work.
- **Business value:** Completes the Runtime Spine's continuity promise.
- **Functional scope:** Recovery scan; expired leases; pending outbox; in-progress
  idempotency/effects; checkpoint selection; reconciliation ordering; authoritative
  session reload; dry-run diagnostics.
- **Explicit exclusions:** Managed DR/backup restore, multi-zone failover,
  autonomous production remediation, operator UI.
- **Dependencies:** RS-10, RS-13–16.
- **Files expected to change:** New `engine/runtime/recovery.py`,
  `tests/runtime/test_recovery.py`; updates to service/outbox/worker/effects/
  checkpoints/projections and `app/main.py` session-loading seam.
- **BDD scenarios:** BDD-019-002, 003, 006, 007, 009, 010, 013.
- **Evaluation requirements:** EVAL-019-003, 004, 005, 007, 009.
- **Security checks:** Recovery tenant-scoped; diagnostics expose references only;
  no recovery broadens authority or bypasses future approval hooks.
- **Reliability checks:** Crash at every state/outbox/lease/checkpoint boundary;
  repeat recovery idempotency; unsafe ambiguity remains stopped.
- **Regression scope:** Full product suite; browser refresh/new session; worker and
  application restart; multi-case synchronization.
- **Acceptance criteria:** Recovery is repeatable and idempotent; no committed work
  repeats; pending safe work resumes; ambiguous work does not; returning browser
  reads authoritative state.
- **Definition of Done:** Common DoD plus Sprint 4 fault demonstration and
  Runtime/SRE approval.

## 10. Sprint 5 — Managed Adapters and Epic Qualification

### Sprint Goal

Prove the completed Runtime Spine against the selected managed relational,
queue, and object-storage services; enforce structural security boundaries; meet
fault/performance budgets; and assemble objective Epic 1 exit evidence.

### Sprint Demonstration

In a production-shaped staging environment using synthetic data, run the existing
Guided Journey through durable start, asynchronous task/artifact completion,
application/worker interruption, pause/resume, and authoritative status. Show
managed-adapter conformance, a rejected cross-tenant reference, bounded duplicate
delivery, performance results, and safe flag-off rollback.

### Sprint Release Gate

- Selected managed adapters pass the same domain contract suites as local
  adapters for applicable semantics.
- All EVAL-019 evaluations and BDD-019 scenarios pass.
- Existing full product regression, accessibility, responsive, and clean-console
  gates pass.
- Runtime Spine is enabled only for approved candidate/test tenancy; Trust Wave
  remains required before production tenant enablement.
- Epic exit evidence is reviewed by Product, Architecture, Runtime, Security,
  SRE, Data/Enterprise DNA, and Quality Engineering.

### RS-18 — Implement managed relational adapter and migration conformance

**Estimate:** 2–3 days, one data/platform engineer.

- **Objective:** Implement the selected managed relational adapter behind the
  existing repository contract and validate schema/migration semantics.
- **Business value:** Proves the durable state owner on production-shaped
  infrastructure without changing domain behavior.
- **Functional scope:** Connection/session lifecycle; transaction isolation;
  parameter binding; compare-and-swap update; migration execution; local/staging
  configuration; contract test matrix.
- **Explicit exclusions:** Database clustering/failover certification, read
  replicas, sharding, production customer data, domain schema redesign.
- **Dependencies:** RS-05–08; approved PCV1-PLAT-001 selection and staging access.
- **Files expected to change:** New provider-isolated module under
  `engine/runtime/adapters/` such as `managed_repository.py` and package init;
  `engine/runtime/config.py`; migration compatibility files;
  `tests/runtime/test_managed_repository.py`; dependency manifest only if the
  approved client is absent.
- **BDD scenarios:** BDD-019-001, 002, 005, 009, 015.
- **Evaluation requirements:** EVAL-019-002, 003, 006, 008, 010.
- **Security checks:** Encrypted connection configuration by reference; workload
  credential seam; parameterized queries; tenant constraints; no test credential
  in source/logs.
- **Reliability checks:** Transaction rollback, connection interruption,
  concurrency, outbox persistence, reconnect, migration retry.
- **Regression scope:** Full repository/migration suite on SQLite and managed
  engine; Sprint 1–4.
- **Acceptance criteria:** Managed adapter passes domain contract; documented
  semantic differences have tests; workflow survives app restart; no provider
  type leaks outside adapter/config.
- **Definition of Done:** Common DoD plus Data/Security/SRE managed-service review.

### RS-19 — Implement managed queue adapter conformance

**Estimate:** 2–3 days, one platform/runtime engineer.

- **Objective:** Implement the selected managed queue behind the queue contract.
- **Business value:** Proves durable asynchronous delivery without building queue
  infrastructure.
- **Functional scope:** Enqueue, receive, visibility/lease, acknowledge, reject/
  dead-letter mapping; provider receipt reference; limits; staging configuration;
  contract and duplicate-delivery tests.
- **Explicit exclusions:** Autoscaling, weighted fairness, priority service,
  multi-region queue, provider-specific behavior in domain code.
- **Dependencies:** RS-10–12; approved queue selection and staging access.
- **Files expected to change:** New
  `engine/runtime/adapters/managed_queue.py`, adapter package/config, selected
  dependency manifest if approved, `tests/runtime/test_managed_queue.py`.
- **BDD scenarios:** BDD-019-003, 004, 009, 015.
- **Evaluation requirements:** EVAL-019-003, 004, 006, 008, 010.
- **Security checks:** Workload credential seam; encryption; tenant in envelope;
  payload/reference limit; safe provider errors.
- **Reliability checks:** Redelivery, visibility expiry, ack loss, provider
  timeout, dead letter, throttling/backpressure classification.
- **Regression scope:** Local and managed queue contract suites; outbox/worker/
  idempotency/recovery; Sprint 1–4.
- **Acceptance criteria:** Managed queue intentionally redelivers without
  duplicate logical result; ack occurs after durable commit; provider errors map
  to stable domain classes; local adapter remains default for tests.
- **Definition of Done:** Common DoD plus queue semantics and limits documented.

### RS-20 — Implement managed object-storage adapter conformance

**Estimate:** 1–2 days, one data/platform engineer.

- **Objective:** Store versioned assessment payloads through the selected managed
  object service while retaining domain metadata in the relational store.
- **Business value:** Proves durable artifact separation and integrity in a
  production-shaped environment.
- **Functional scope:** Put/get/head; version/reference capture; integrity check;
  tenant object prefix/key; bounded transfer; local/staging configuration;
  contract tests.
- **Explicit exclusions:** Lifecycle/retention automation, cross-region
  replication, customer-managed key product, user-facing file browser.
- **Dependencies:** RS-09; approved object-storage selection and staging access.
- **Files expected to change:** New
  `engine/runtime/adapters/managed_artifacts.py`, adapter package/config, selected
  dependency manifest if approved, `tests/runtime/test_managed_artifacts.py`.
- **BDD scenarios:** BDD-019-008, 012, 015.
- **Evaluation requirements:** EVAL-019-006, 007, 008, 010.
- **Security checks:** Workload credential seam; encrypted storage; tenant key
  isolation; path injection; classification metadata; no public access.
- **Reliability checks:** Timeout/partial upload, metadata commit failure,
  missing/corrupt object, repeated put with same logical ID.
- **Regression scope:** Local/managed artifact contracts; assessment artifact and
  deterministic fallback suites.
- **Acceptance criteria:** Managed payload and relational metadata maintain
  integrity; missing/corrupt object blocks evidence use; provider reference does
  not leak into domain beyond opaque reference.
- **Definition of Done:** Common DoD plus Data/Security adapter review.

### RS-21 — Enforce structural tenant and runtime safety checks

**Estimate:** 2–3 days, one application-security/runtime engineer.

- **Objective:** Validate tenant/context integrity at every Runtime Spine boundary
  and prevent unsafe task/config/payload use.
- **Business value:** Prevents the spine from embedding security debt before the
  Trust Wave supplies managed identity and authorization.
- **Functional scope:** Trusted execution-context type; tenant-match guards for
  command/query/repository/queue/artifact/checkpoint/effect/projection; safe
  errors; secret/payload scanning tests; closed task registry assertions.
- **Explicit exclusions:** OIDC, MFA, workload identity implementation, RBAC/ABAC,
  policy engine, approval service, immutable audit export.
- **Dependencies:** RS-02, RS-09–20; approved security fixtures.
- **Files expected to change:** New `engine/runtime/security.py`,
  `tests/runtime/test_security.py`; guarded changes across runtime adapters;
  test fixtures only outside the package if required.
- **BDD scenarios:** BDD-019-015 and security aspects of 001–014.
- **Evaluation requirements:** EVAL-019-001, 008, 011.
- **Security checks:** Cross-tenant matrix for every resource; unknown task/
  adapter rejection; no production fake context; secret/payload/log inspection;
  safe error behavior.
- **Reliability checks:** Security failure makes no state change and is not
  retried; recovery cannot broaden tenant or task authority.
- **Regression scope:** Full runtime and product suite with multiple synthetic
  tenant fixtures.
- **Acceptance criteria:** Every boundary rejects mismatched tenant before data
  access; negative results reveal no foreign metadata; Wave 1 is explicitly not
  represented as complete authentication/authorization.
- **Definition of Done:** Common DoD plus Security sign-off and threat-model update.

### RS-22 — Execute comprehensive Runtime Spine fault evaluation

**Estimate:** 2–3 days, one principal QA/SRE engineer.

- **Objective:** Validate correctness at every material application, transaction,
  artifact, outbox, queue, worker, checkpoint, and projection failure boundary.
- **Business value:** Converts design invariants into objective recovery evidence.
- **Functional scope:** Deterministic fault injector/fixtures; process and
  dependency interruption matrix; duplicate delivery; lease expiry; corruption;
  reconciliation; managed-adapter failure simulation and selected live staging
  faults.
- **Explicit exclusions:** Regional disaster recovery, destructive production
  chaos, autonomous remediation, full backup/restore certification.
- **Dependencies:** RS-13–21.
- **Files expected to change:** New `tests/runtime/test_faults.py`, synthetic fault
  fixtures/helpers under `tests/runtime/`; production runtime changes only when a
  verified defect requires a separately reviewed fix within PRS scope.
- **BDD scenarios:** BDD-019-002–010, 013, 015.
- **Evaluation requirements:** EVAL-019-003, 004, 005, 007, 008.
- **Security checks:** Fault diagnostics contain no secret/payload; injected
  tenant mismatch never accesses foreign data; failure cannot bypass guards.
- **Reliability checks:** No lost acknowledged transition, duplicate logical
  effect, skipped required artifact, unsafe resume, or false completion.
- **Regression scope:** Full Runtime Spine suite repeated under fault fixtures;
  baseline product tests before/after.
- **Acceptance criteria:** Every fault point has deterministic expected state and
  next action; all critical invariants pass; unresolved defects block Sprint exit.
- **Definition of Done:** Common DoD plus retained fault matrix/results reviewed by
  Runtime, SRE, Security, and QA.

### RS-23 — Validate performance and publish candidate capacity envelope

**Estimate:** 2–3 days, one performance/SRE engineer.

- **Objective:** Measure Runtime Spine overhead and establish honest bounded
  candidate limits.
- **Business value:** Prevents untested enterprise-scale claims and identifies
  safe pilot capacity before later waves.
- **Functional scope:** Repeatable synthetic load harness; command/query/queue/
  lease/checkpoint/artifact metadata/projection/recovery measurements; concurrency
  and backpressure tests; local and managed staging comparison.
- **Explicit exclusions:** Autoscaling implementation, capacity platform,
  production traffic, model/tool provider latency, general-availability scale.
- **Dependencies:** RS-18–22; Product/SRE initial capacity proposal.
- **Files expected to change:** New `tests/runtime/test_performance.py` and bounded
  load fixtures; runtime configuration limit docs/tests; performance result in
  work-result evidence. No optimization change without a scoped defect.
- **BDD scenarios:** Timing/scale application to BDD-019-001, 003, 004, 009, 013.
- **Evaluation requirements:** EVAL-019-010, 011.
- **Security checks:** Synthetic data; tenant-attributed measurements; load cannot
  disable guards or expose payloads.
- **Reliability checks:** Backpressure under limit breach; queue age and retry
  stability; no correctness degradation at 2x planned candidate load.
- **Regression scope:** Performance comparison to Sprint 1 baseline; full runtime
  correctness after load/soak.
- **Acceptance criteria:** Section 12 budgets pass or scope/limits are reduced;
  tenant/workflow/task/DNA/artifact/concurrency limits are published; no hidden
  provider time is counted as platform overhead.
- **Definition of Done:** Common DoD plus Product/SRE approval of capacity envelope.

### RS-24 — Complete full regression, rollback, and Epic exit evidence

**Estimate:** 2–3 days, one principal QA/technical program engineer.

- **Objective:** Prove PRS-019 acceptance and produce the reviewable Epic 1
  evidence package.
- **Business value:** Ensures implementation is releasable, reversible, and ready
  for Trust Wave integration rather than merely code-complete.
- **Functional scope:** Clean-checkout validation; all BDD/EVAL/security/
  reliability/performance checks; browser/accessibility/responsive/console suite;
  migration and flag-off rollback; in-flight workflow compatibility; known limits
  and release demo.
- **Explicit exclusions:** Fixes outside PRS-019, Trust/AI/Operations wave work,
  Production Candidate label or pilot authorization without reviewer decision.
- **Dependencies:** RS-01–23.
- **Files expected to change:** New completion report under `work_results/` using
  repository convention; test/evidence manifests only. Production changes require
  a separate defect slice and rerun.
- **BDD scenarios:** BDD-019-001–015.
- **Evaluation requirements:** EVAL-019-001–011.
- **Security checks:** Secret/path/private-data scan; tenant matrix; dependency
  review; deferred-control language accurate.
- **Reliability checks:** Complete fault matrix; rollback with durable in-flight
  workflow; flag-off preserves legacy new-work path without losing durable work.
- **Regression scope:** All Python tests, all JavaScript tests, Guided Journey,
  Mission Control/HQ, Enterprise DNA, multi-case, reset, accessibility, keyboard,
  reduced motion, supported viewports, clean console, deterministic fallback.
- **Acceptance criteria:** Every PRS-019 acceptance criterion has traceable passing
  evidence; no P0/P1 defect remains; exact limits/known limitations are published;
  reviewers record approval or rejection.
- **Definition of Done:** Common DoD plus Epic exit review signed by Product,
  Architecture, Runtime, Security, SRE, Data/Enterprise DNA, and QA.

## 11. Implementation Sequence and Dependencies

```text
Sprint 1
RS-01 -> RS-02 -> RS-03 -> RS-04

Sprint 2
RS-05 -> RS-06 -> RS-07 -> RS-08
             RS-04 ----^

Sprint 3
RS-09 -----------\
RS-07 -> RS-10 -> RS-11 -> RS-12

Sprint 4
RS-12 -> RS-13 -> RS-14
RS-09 -> RS-15 -> RS-16 -> RS-17
RS-10 ----------------------^

Sprint 5
RS-18 --\
RS-19 ---+-> RS-21 -> RS-22 -> RS-23 -> RS-24
RS-20 --/
RS-17 -----------------^
```

Within a sprint, parallel work is allowed only where shown by independent
dependencies and only when engineers do not concurrently edit the same runtime
contract. Contract/schema owners merge first; adapter/test work rebases on that
accepted version.

## 12. Sprint-Level Regression Matrix

| Regression gate | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 |
|---|:---:|:---:|:---:|:---:|:---:|
| Current Python suite | Required | Required | Required | Required | Required |
| Existing JavaScript suite | Required | Required | Required | Required | Required |
| Guided Journey critical path | Required | Required | Required | Required | Full |
| Mission Control/HQ synchronization | Baseline | Required | Required | Required | Full |
| Multi-case/program behavior | Baseline | Required | Required | Required | Full |
| Reset | Required | Required | Required | Required | Full/security boundary |
| Deterministic fallback | Required | Required | Required | Required | Full |
| Accessibility/keyboard/reduced motion | Critical path | Critical path | Critical path | Full controls | Full |
| Responsive viewports | Smoke | Smoke | Smoke | Full controls | Full |
| Browser console | Clean | Clean | Clean | Clean | Clean |
| Runtime contract/persistence | Contract | Full local | Local async | Local recovery | Local + managed |
| Security tenant matrix | Contract fixtures | Repository | Queue/artifact | Recovery/effects | Complete |
| Fault injection | Not applicable | Transactions | Queue/worker/artifact | Comprehensive local | Local + managed staging |
| Performance | Baseline | Command/read smoke | Queue/worker smoke | Recovery smoke | Full budget/capacity |

## 13. Evaluation Traceability

| Evaluation | Primary slices | Final gate |
|---|---|---|
| EVAL-019-001 Contract correctness | RS-02–04, RS-10–11, RS-15 | RS-24 |
| EVAL-019-002 State correctness | RS-06–08, RS-12–13, RS-16 | RS-24 |
| EVAL-019-003 Durability | RS-07, RS-10, RS-12, RS-15, RS-17–19 | RS-22/24 |
| EVAL-019-004 Idempotency | RS-10–14 | RS-22/24 |
| EVAL-019-005 Recovery | RS-14–17 | RS-22/24 |
| EVAL-019-006 Storage portability | RS-09, RS-11, RS-18–20 | RS-24 |
| EVAL-019-007 DNA/evidence integrity | RS-08–09, RS-12, RS-15 | RS-22/24 |
| EVAL-019-008 Security structure | RS-02, RS-05–20, RS-21 | RS-22/24 |
| EVAL-019-009 Product regression | RS-01, every sprint gate | RS-24 |
| EVAL-019-010 Performance | Smoke checks each sprint, RS-23 | RS-24 |
| EVAL-019-011 Scope conformance | Every review, RS-21/23 | RS-24 |

## 14. Plan Risks

| Risk | Early indicator | Response |
|---|---|---|
| Slice exceeds three days | Contract and implementation cannot be reviewed independently | Split by contract, adapter, behavior, or evaluation before starting |
| UI and runtime both own status | Same field can differ after refresh | Stop; resolve state ownership before merge |
| Schema churn blocks parallel work | Multiple slices edit one migration/contract | Serialize contract owner; use additive migrations after acceptance |
| Managed provider chosen late | Sprint 5 adapter work cannot start | Close PCV1-PLAT-001 before Sprint 2; preserve provider-neutral local contracts |
| SQLite hides target-engine semantics | Managed concurrency/migration failures appear in Sprint 5 | Run target-engine contract smoke by Sprint 2 if environment is available |
| Queue semantics misunderstood | Ack/visibility behavior conflicts with domain lease | Document mapping in RS-11; validate selected service in RS-19 |
| Runtime flag creates two durable owners | Legacy and runtime paths both update one workflow | Only one path owns a given workflow; flag applies at creation and is pinned |
| Fault tests are deferred | Happy path appears complete before recovery works | Sprint 2–4 fault checks are part of every slice DoD |
| Later Trust work is mocked as production control | Tenant fixture is presented as authentication | Use explicit trusted-context terminology; block production enablement until Wave 2 |
| Scope expands through infrastructure convenience | New service/framework/platform appears | Reject through EGB-018/ARB scope review; use selected managed adapter only |
| Existing dirty worktree contaminates slices | Unrelated files are staged or overwritten | Inspect status; isolate cohesive diffs; preserve user-owned changes |
| Performance optimization changes behavior | Premature caching/batching creates stale state | Measure first; create scoped defect with correctness regression before change |

## 15. Releasable-State Rules

At the end of every sprint:

1. The default user path is functional from a clean checkout.
2. Incomplete Runtime Spine behavior is disabled by safe configuration.
3. A workflow is pinned to the execution mode selected at creation; a feature
   flag cannot switch its authoritative owner mid-run.
4. Database migrations are additive and compatible with rollback expectations.
5. Local deterministic mode requires no external service or OpenAI call.
6. All required regressions and sprint-specific evaluations pass.
7. Known limitations and the exact demonstration path are documented.
8. No future-wave capability is represented as implemented.

## 16. Epic 1 Final Acceptance

The plan is complete only when RS-01 through RS-24 are Done, all PRS-019 BDD and
evaluation gates pass, managed/local adapters satisfy approved contracts, and the
reviewers accept the Epic exit evidence.

The result is a Runtime Spine ready for the subsequent Trust Wave. It is not by
itself authorization for production customer tenants, a Controlled Pilot,
Enterprise Production, or General Availability.

## 17. Explicit Plan Exclusions

- Any implementation not included in PRS-019.
- UI redesign or new Journey behavior.
- Full identity, authorization, approval, or immutable audit implementation.
- Governed model/context/tool adapters and content-defense implementation.
- SLO platform, on-call process, backup/restore certification, release platform,
  AIOps, FinOps platform, or autonomous remediation.
- Autoscaling, multi-region, tenant tiers, graph infrastructure, service mesh,
  Kubernetes, custom orchestration, or microservices.
- Production customer data or production enablement.

Requests for excluded work require a separate PRS/backlog wave and the governance
approval defined by EGB-018.

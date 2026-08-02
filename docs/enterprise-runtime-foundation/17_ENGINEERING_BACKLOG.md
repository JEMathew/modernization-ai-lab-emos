# Production Candidate v1 Engineering Backlog

## Backlog Authority

This backlog translates the approved-with-conditions scope in
`16_ARCHITECTURE_REVIEW_BOARD_DECISION.md` into executable engineering work.
It does not expand the Architecture Review Board decision.

| Field | Value |
|---|---|
| Target | Production Candidate v1 |
| Architecture | Modular Python runtime plus managed infrastructure |
| Delivery posture | Preserve the existing product and migrate incrementally |
| Priorities | P0 prerequisite, P1 Production Candidate requirement |
| Out of scope | Every P2/P3, deferred, or removed capability in the ARB decision |
| Current authorization | Backlog definition only; implementation remains subject to P0 approval |

The repository review found the Product Constitution, Enterprise Runtime
Foundation, ARB decision, and this backlog. It did not establish authoritative
files named Engineering Constitution or Development Playbook. Their location or
creation and approval remains the blocking story `PCV1-GOV-001`; this backlog
does not infer their contents.

## Objective

Deliver the smallest production-shaped runtime that can execute the existing
Guided Journey durably, safely, observably, and recoverably for a bounded pilot
without redesigning Mission Control, Enterprise DNA, the AI Agency, or the
Journey.

## Delivery Constraints

1. Preserve current Guided Journey behavior and deterministic fallback.
2. Extend the existing state machine; do not create a second workflow model.
3. Keep one codebase and one owning team.
4. Limit deployment units to the existing product application and one worker.
5. Use managed services for identity, secrets/keys, relational persistence,
   queueing, object storage, telemetry, and backups.
6. Permit only typed, allowlisted model and read-oriented tool operations.
7. Keep numeric scores deterministic and calculated by Python.
8. Store every assessment run and its evidence/artifacts.
9. Require human approval for every high-risk action.
10. Use synthetic enterprise data until a separately approved pilot data
    contract exists.

## Explicit Non-Backlog

The following work must not enter Production Candidate v1 through refinement,
technical preference, or opportunistic implementation:

- Kubernetes, service mesh, or an internal developer platform.
- Microservice extraction or standalone runtime gateway services.
- A custom workflow engine, policy language, identity service, secret store,
  queue, database, object store, or telemetry backend.
- Graph database adoption.
- Multi-region active/active or warm-standby architecture.
- Autonomous production remediation or self-modifying agents.
- Arbitrary code execution, repository ingestion, or unrestricted connectors.
- Long-term semantic memory or cross-tenant knowledge reuse.
- Custom FinOps, AIOps, service-catalog, or chargeback platforms.
- General-availability scale, availability, or isolation tiers.

## Definition of Ready

A backlog item may enter implementation only when:

- Its owner and reviewer are named.
- Dependencies are complete or explicitly scheduled.
- The affected state owner and tenant boundary are identified.
- Acceptance tests and rollback behavior are agreed.
- Security and data classifications are known.
- Managed-service assumptions are recorded without embedding provider-specific
  logic in the domain model.
- Existing workflow regression tests covering the affected path are identified.

## Definition of Done

A backlog item is complete only when:

- Code, schema, configuration, and documentation are reviewed.
- Unit, contract, integration, security, and regression tests appropriate to
  the change pass.
- Failure, retry, timeout, and rollback behavior is verified.
- Tenant and correlation identifiers propagate through the affected path.
- Logs and errors contain no secrets or unrestricted enterprise content.
- Generated output and evidence are durably stored when applicable.
- The existing happy path and deterministic fallback remain operational.
- Operational ownership and runbook impact are updated.

## Workstream Ownership

| Role | Accountability |
|---|---|
| Product Architecture | State ownership, compatibility, scope control |
| Runtime Engineering | State machine, persistence, queue, worker, adapters |
| Security Engineering | Identity, tenant isolation, policy, approval, content defense |
| Data/Enterprise DNA | DNA authority, snapshots, evidence, retention |
| SRE/Operations | Telemetry, SLOs, runbooks, recovery, capacity |
| Release Engineering | Build provenance, scans, deployment, rollback |
| Quality Engineering | Cross-cutting test strategy and release evidence |
| Product Owner | Journey behavior, pilot boundary, acceptance |

## Story Point Scale

Story points express relative uncertainty, integration breadth, and validation
effort. They are not elapsed-time commitments.

| Points | Relative meaning |
|---:|---|
| 2 | Small governance or review outcome with one owner |
| 3 | Bounded change with known interfaces and limited integration |
| 5 | Multi-module change or contract with meaningful test effort |
| 8 | Cross-cutting runtime/control change with failure-path validation |
| 13 | Too large for implementation; must be decomposed before Ready |

No Production Candidate story may enter a wave at 13 points.

## Epics

| Epic | Outcome | Priority | Wave | Required skills | Exit evidence |
|---|---|---:|---:|---|---|
| EPIC-00 — Governance and Contracts | All ARB conditions are executable contracts | P0 | 0 | Enterprise architecture, product, security, SRE, data governance | Approved state, tenant, workflow, risk, data, reliability, operations, and managed-service contracts |
| EPIC-01 — Compatibility Boundary | Existing UI and Journey use one protected runtime seam | P0/P1 | 1 | Python architecture, Pydantic contracts, product QA, accessibility | Clean current regression suite and command/query contract tests |
| EPIC-02 — Durable Runtime Spine | One workflow persists, queues, checkpoints, and recovers | P0/P1 | 1 | Python, relational modeling, SQLite/PostgreSQL, distributed queues, fault testing | Restart/redelivery/recovery evaluation passes |
| EPIC-03 — Trust Boundary | Every runtime action is tenant-scoped, authorized, attributable, and approval-aware | P0/P1 | 2 | OIDC/IAM, application security, threat modeling, audit, cryptography | Isolation, policy, approval-bypass, secret, and audit evaluations pass |
| EPIC-04 — Governed AI Execution | Models and tools operate only through bounded adapters | P1 | 3 | OpenAI/provider adapters, schema validation, prompt-injection defense, evidence engineering | Provider/fallback, context, tool, and content-defense evaluations pass |
| EPIC-05 — Operable Candidate | Runtime is observable, recoverable, releasable, and bounded | P0/P1 | 4 | OpenTelemetry, SRE, performance, incident response, CI/CD, IaC | SLO, restore, load, game-day, provenance, and rollback evidence |
| EPIC-06 — Qualification | ARB receives complete objective release evidence | P0 | 5 | Technical program management, QA governance, architecture review | Signed go/no-go decision with no waived P0/P1 control |

## User Stories

User stories define the observable product and operator outcomes. Technical
stories implement them without adding new user-facing workflow behavior.

### PCV1-US-001 — Durable journey continuity

**As a** Mission Commander, **I want** a started modernization journey to survive
application, worker, and browser interruption **so that** accepted enterprise
work is not lost or silently repeated.

| Attribute | Value |
|---|---|
| Epic | EPIC-01, EPIC-02 |
| Priority | P0 |
| Story points | 8 |
| Wave | 1 |
| Dependencies | PCV1-WF-001, PCV1-QA-001, PCV1-RT-001, PCV1-DB-001, PCV1-Q-001, PCV1-REL-003 |
| BDD references | BDD-017-001, BDD-017-002, BDD-017-003 |
| Evaluation | EVAL-017-001, EVAL-017-002, EVAL-017-004 |

**Acceptance criteria:** Start is acknowledged only after durable commit; restart
restores the same authoritative workflow version; completed logical tasks do not
repeat; existing Guided Journey behavior remains unchanged.

### PCV1-US-002 — Safe pause and resume

**As a** Mission Commander, **I want** pause and resume to occur at a safe work
boundary **so that** I can control execution without corrupting the case.

| Attribute | Value |
|---|---|
| Epic | EPIC-02 |
| Priority | P1 |
| Story points | 5 |
| Wave | 1 |
| Dependencies | PCV1-WF-001, PCV1-REL-003 |
| BDD references | BDD-017-005 |
| Evaluation | EVAL-017-001, EVAL-017-002 |

**Acceptance criteria:** Pause waits for the active atomic transition and durable
checkpoint; resume uses the same definition, DNA snapshot, and checkpoint; UI
communicates pending pause rather than claiming premature completion.

### PCV1-US-003 — Synchronized work status

**As a** Mission Commander, **I want** Mission Control and Modernization HQ to
show the same stage, owner, blocker, next action, and evidence **so that** I can
trust the current modernization status.

| Attribute | Value |
|---|---|
| Epic | EPIC-01, EPIC-02 |
| Priority | P1 |
| Story points | 5 |
| Wave | 1 |
| Dependencies | PCV1-ARC-001, PCV1-RT-001, PCV1-DB-001, PCV1-DNA-001, PCV1-ART-001 |
| BDD references | BDD-017-002, BDD-017-009 |
| Evaluation | EVAL-017-001, EVAL-017-004 |

**Acceptance criteria:** Both workspaces read one authoritative workflow version;
derived views are rebuildable; read-your-writes is provided to the initiating
session; projection lag is explicit.

### PCV1-US-004 — Governed high-risk action

**As a** human approver, **I want** approval bound to the exact action and evidence
I reviewed **so that** an agent cannot execute changed or unapproved work.

| Attribute | Value |
|---|---|
| Epic | EPIC-03 |
| Priority | P0 |
| Story points | 8 |
| Wave | 2 |
| Dependencies | PCV1-IAM-001, PCV1-TEN-001, PCV1-POL-001, PCV1-APR-001, PCV1-AUD-001 |
| BDD references | BDD-017-010, BDD-017-013 |
| Evaluation | EVAL-017-003, EVAL-017-005 |

**Acceptance criteria:** Material input change invalidates approval; rejected or
expired approval cannot execute; direct worker/adapter invocation cannot bypass
policy; decision and evidence hashes are auditable.

### PCV1-US-005 — Accurate AI/fallback behavior

**As a** Mission Commander, **I want** the product to distinguish model execution
from deterministic fallback **so that** recommendations and numeric scores remain
credible during provider failure.

| Attribute | Value |
|---|---|
| Epic | EPIC-04 |
| Priority | P1 |
| Story points | 5 |
| Wave | 3 |
| Dependencies | PCV1-MDL-001, PCV1-CTX-001, PCV1-DEF-001 |
| BDD references | BDD-017-007, BDD-017-012 |
| Evaluation | EVAL-017-006 |

**Acceptance criteria:** Python remains numeric authority; the model cannot mutate
authoritative state; provider outage uses approved fallback or an explicit wait;
the UI never implies a live model call when none occurred.

### PCV1-US-006 — Recoverable operations

**As an** operator, **I want** correlated telemetry, alerts, checkpoints, effect
records, and tested restore procedures **so that** I can recover work without
guessing or duplicating side effects.

| Attribute | Value |
|---|---|
| Epic | EPIC-05 |
| Priority | P0 |
| Story points | 8 |
| Wave | 4 |
| Dependencies | PCV1-OBS-001, PCV1-SLO-001, PCV1-OPS-002, PCV1-DR-001, PCV1-REL-004 |
| BDD references | BDD-017-003, BDD-017-004, BDD-017-014 |
| Evaluation | EVAL-017-002, EVAL-017-007 |

**Acceptance criteria:** One command is traceable end to end; an ambiguous effect
stops for reconciliation; restore meets approved RTO/RPO; runbooks and rollback
are exercised before candidate approval.

### PCV1-US-007 — Preserved product experience

**As a** product owner, **I want** runtime hardening to preserve all validated
journeys and accessibility **so that** production work does not redesign or
regress the product.

| Attribute | Value |
|---|---|
| Epic | EPIC-01, EPIC-06 |
| Priority | P0 |
| Story points | 5 |
| Wave | 1–5 |
| Dependencies | PCV1-QA-001, every implementation story, PCV1-QA-002 |
| BDD references | BDD-017-011, BDD-017-015 |
| Evaluation | EVAL-017-004, EVAL-017-008 |

**Acceptance criteria:** Python, JavaScript, browser, responsive, accessibility,
keyboard, reduced-motion, reset, multi-case, and deterministic fallback suites
remain green; no duplicate work object or state owner is introduced.

## Technical Story Index

The detailed story descriptions and acceptance criteria remain in the Ordered
Backlog. This index supplies relative estimates, wave placement, skills, and
evaluation traceability for sequencing.

| Technical story | Epic | Wave | Priority | Points | Required skills | BDD/evaluation reference |
|---|---|---:|---:|---:|---|---|
| PCV1-GOV-001 | EPIC-00 | 0 | P0 | 2 | Architecture governance, technical writing | EVAL-017-008 |
| PCV1-ARC-001 | EPIC-00 | 0 | P0 | 5 | Domain modeling, enterprise architecture | EVAL-017-001 |
| PCV1-ARC-002 | EPIC-00 | 0 | P0 | 5 | Distributed tracing, identity modeling | EVAL-017-001, EVAL-017-003 |
| PCV1-WF-001 | EPIC-00 | 0 | P0 | 5 | State machines, product behavior, BDD | BDD-017-001–006 |
| PCV1-SEC-001 | EPIC-00 | 0 | P0 | 5 | Threat modeling, tool security | EVAL-017-003 |
| PCV1-DATA-001 | EPIC-00 | 0 | P0 | 5 | Data governance, privacy, retention | EVAL-017-003 |
| PCV1-REL-001 | EPIC-00 | 0 | P0 | 5 | Distributed reliability, DR | EVAL-017-002 |
| PCV1-OPS-001 | EPIC-00 | 0 | P0 | 5 | SRE, SLOs, incident management | EVAL-017-007 |
| PCV1-PLAT-001 | EPIC-00 | 0 | P0 | 5 | Cloud architecture, security, FinOps | EVAL-017-007 |
| PCV1-QA-001 | EPIC-01 | 1 | P0 | 5 | Pytest, JavaScript/browser QA, accessibility | EVAL-017-004 |
| PCV1-RT-001 | EPIC-01 | 1 | P1 | 8 | Python architecture, Pydantic, contract testing | BDD-017-001, EVAL-017-001 |
| PCV1-CFG-001 | EPIC-01 | 1 | P1 | 3 | Typed configuration, secrets boundaries | EVAL-017-003, EVAL-017-008 |
| PCV1-DB-001 | EPIC-02 | 1 | P1 | 8 | SQL, SQLite/PostgreSQL, migrations, transactions | BDD-017-001, BDD-017-009 |
| PCV1-DNA-001 | EPIC-02 | 1 | P1 | 5 | Enterprise DNA, relational modeling, snapshots | EVAL-017-001 |
| PCV1-ART-001 | EPIC-02 | 1 | P1 | 5 | Object storage, integrity, evidence provenance | BDD-017-008, EVAL-017-003 |
| PCV1-Q-001 | EPIC-02 | 1 | P1 | 8 | Queues, worker leases, asynchronous Python | BDD-017-003, BDD-017-004 |
| PCV1-REL-002 | EPIC-02 | 1 | P1 | 8 | Idempotency, outbox, effect reconciliation | BDD-017-004, BDD-017-014 |
| PCV1-REL-003 | EPIC-02 | 1 | P1 | 8 | Checkpoints, recovery, fault injection | BDD-017-002, BDD-017-003, BDD-017-005, BDD-017-006 |
| PCV1-IAM-001 | EPIC-03 | 2 | P1 | 5 | OIDC, MFA, workload identity | EVAL-017-003 |
| PCV1-TEN-001 | EPIC-03 | 2 | P0 | 8 | Multi-tenancy, authorization testing, data isolation | BDD-017-010, EVAL-017-003 |
| PCV1-POL-001 | EPIC-03 | 2 | P1 | 5 | RBAC/ABAC, policy testing | BDD-017-013, EVAL-017-003 |
| PCV1-APR-001 | EPIC-03 | 2 | P0 | 8 | Approval workflows, integrity hashes, security tests | BDD-017-013, EVAL-017-003 |
| PCV1-AUD-001 | EPIC-03 | 2 | P1 | 5 | Audit schemas, immutable retention, privacy | EVAL-017-003, EVAL-017-007 |
| PCV1-SEC-002 | EPIC-03 | 2 | P0 | 5 | KMS/secrets, encryption, egress controls | EVAL-017-003 |
| PCV1-MDL-001 | EPIC-04 | 3 | P1 | 8 | OpenAI/provider SDK, structured outputs, budgets | BDD-017-007, BDD-017-012, EVAL-017-006 |
| PCV1-CTX-001 | EPIC-04 | 3 | P1 | 5 | Retrieval, provenance, data classification | EVAL-017-006 |
| PCV1-TOOL-001 | EPIC-04 | 3 | P1 | 8 | Typed adapters, tool security, idempotency | BDD-017-013, BDD-017-014 |
| PCV1-DEF-001 | EPIC-04 | 3 | P1 | 5 | Prompt injection, DLP concepts, schema validation | EVAL-017-003, EVAL-017-006 |
| PCV1-OBS-001 | EPIC-05 | 4 | P1 | 8 | OpenTelemetry, structured logging, privacy | EVAL-017-007 |
| PCV1-SLO-001 | EPIC-05 | 4 | P1 | 5 | SRE, SLI/SLO design, alerting | EVAL-017-007 |
| PCV1-OPS-002 | EPIC-05 | 4 | P1 | 5 | Incident response, game days, runbooks | BDD-017-014, EVAL-017-007 |
| PCV1-DR-001 | EPIC-05 | 4 | P0 | 8 | Backup/restore, reconciliation, DR testing | EVAL-017-002, EVAL-017-007 |
| PCV1-REL-004 | EPIC-05 | 4 | P1 | 8 | Chaos/fault testing, graceful degradation | EVAL-017-002 |
| PCV1-PERF-001 | EPIC-05 | 4 | P1 | 5 | Load/soak testing, capacity analysis | EVAL-017-009 |
| PCV1-COST-001 | EPIC-05 | 4 | P1 | 3 | Token accounting, cloud budgets, FinOps basics | EVAL-017-009 |
| PCV1-RELENG-001 | EPIC-05 | 4 | P0 | 8 | CI/CD, IaC, SBOM, provenance, rollback | EVAL-017-008 |
| PCV1-QA-002 | EPIC-06 | 5 | P0 | 5 | Test governance, evidence management, release QA | EVAL-017-001–009 |
| PCV1-ARB-001 | EPIC-06 | 5 | P0 | 2 | Architecture review, risk acceptance, TPM | EVAL-017-008 |

## BDD References

BDD references point to the executable acceptance scenarios in
`design/specs/PRS-017_WORKFLOW_RUNTIME_FOUNDATION.md`. Automation may live in
Python, JavaScript, or browser suites, but one BDD reference must map to one
observable outcome.

| BDD ID | PRS scenario | Behavior |
|---|---|---|
| BDD-017-001 | AC-001 | Durable start creates one workflow |
| BDD-017-002 | AC-002 | Application restart preserves authoritative state |
| BDD-017-003 | AC-003 | Worker loss safely resumes leased work |
| BDD-017-004 | AC-004 | Duplicate delivery creates one logical result |
| BDD-017-005 | AC-005 | Pause and resume use a safe checkpoint |
| BDD-017-006 | AC-006 | Browser/session loss does not lose or duplicate work |
| BDD-017-007 | AC-007 | Provider outage uses fallback or explicit wait |
| BDD-017-008 | AC-008 | Artifact failure prevents false completion |
| BDD-017-009 | AC-009 | Concurrent commands cannot overwrite state |
| BDD-017-010 | AC-010 | Cross-tenant access is denied without disclosure |
| BDD-017-011 | AC-011 | Reset behavior remains compatible and safe |
| BDD-017-012 | AC-012 | Python remains numeric-score authority |
| BDD-017-013 | New security scenario | Changed, rejected, expired, or bypassed approval cannot execute |
| BDD-017-014 | New reliability scenario | Ambiguous external effect stops for reconciliation |
| BDD-017-015 | Existing regression suite | Guided Journey, Mission Control, accessibility, responsive behavior, and fallback remain unchanged |

BDD-017-013 and BDD-017-014 must be added to PRS-017 or a dedicated behavioral
specification before their implementation stories satisfy Definition of Ready.

## Required Skills

| Skill area | Required competency | Stories/epics |
|---|---|---|
| Enterprise architecture | State ownership, boundaries, ADRs, managed-service evaluation | EPIC-00, EPIC-06 |
| Product and program management | Story slicing, dependency/risk control, release evidence | EPIC-00, EPIC-06 |
| Python runtime engineering | Python, Pydantic, modular design, deterministic fallbacks | EPIC-01, EPIC-02, EPIC-04 |
| Data engineering | SQL, SQLite/PostgreSQL, migrations, outbox, snapshots | EPIC-02 |
| Distributed systems | Queues, leases, retries, idempotency, reconciliation | EPIC-02 |
| AI platform engineering | Provider adapters, structured output, token budgets, evaluation | EPIC-04 |
| Application security | OIDC, RBAC/ABAC, tenant isolation, approval, threat modeling | EPIC-03, EPIC-04 |
| Data governance | Classification, provenance, retention, deletion, evidence integrity | EPIC-00, EPIC-02, EPIC-03 |
| SRE/observability | OpenTelemetry, SLOs, alerting, DR, incident response | EPIC-05 |
| Quality engineering | Pytest, JavaScript, browser, BDD, fault, load, accessibility | Every epic |
| Release/platform engineering | CI/CD, IaC, SBOM, signing, managed hosting, rollback | EPIC-05 |
| FinOps fundamentals | Model/tool attribution, budgets, anomaly response | EPIC-05 |

## Evaluation Requirements

| Evaluation | Required evidence | Passing threshold | Blocking |
|---|---|---|---|
| EVAL-017-001 — Functional correctness | State/contract tests and BDD-017-001/002/005/009 | 100% required scenarios pass; no illegal transition commits | Yes |
| EVAL-017-002 — Reliability and recovery | Restart, duplicate delivery, lease expiry, checkpoint, restore, reconciliation tests | No lost acknowledged transition or duplicate logical effect | Yes |
| EVAL-017-003 — Security and isolation | Threat model, tenant matrix, authorization, approval bypass, injection, secret/egress tests | No critical/high finding; 100% tenant-negative cases pass | Yes |
| EVAL-017-004 — Product regression | Existing Python, JavaScript, browser, accessibility, responsive, reset, multi-case suites | All release-required tests pass; no accepted critical-path regression | Yes |
| EVAL-017-005 — Evidence and audit | Provenance, hash, retention, immutable export, approval-link tests | Every governed action is attributable and evidence-linked | Yes |
| EVAL-017-006 — AI quality and fallback | Structured-output validity, numeric-score invariance, provenance coverage, provider-failure tests | Numeric outputs identical with/without model; fallback accurately labeled | Yes |
| EVAL-017-007 — Operational readiness | SLO dashboards, alert tests, runbook game day, backup restore | Approved SLO instrumentation and RTO/RPO exercise pass | Yes |
| EVAL-017-008 — Release readiness | Clean build, scans, SBOM/provenance, migration, deploy, rollback, scope audit | Same signed artifact promoted; rollback demonstrated; no deferred scope | Yes |
| EVAL-017-009 — Performance and cost | Candidate and 2x pilot load, quota, latency, token/tool cost results | Approved budgets met; backpressure works; limits published | Yes |

No aggregate score can compensate for failure of a blocking evaluation.

## Security Requirements

| Security requirement | Mandatory control | Stories | Verification |
|---|---|---|---|
| SEC-017-001 — Tenant isolation | Tenant in every row/message/path/query/decision; server-derived scope | ARC-002, DB-001, Q-001, TEN-001 | Cross-tenant positive/negative matrix |
| SEC-017-002 — Identity | Managed OIDC and workload identity; production test identity disabled | IAM-001 | Authentication/session/workload tests |
| SEC-017-003 — Authorization | Versioned RBAC/attribute rules; mutations fail closed | POL-001 | Role/resource/risk decision tests |
| SEC-017-004 — Approval | Action/evidence/version-bound, expiring approval | APR-001, TOOL-001 | Bypass, mutation, rejection, expiry tests |
| SEC-017-005 — Secrets and keys | Managed secrets/KMS, short-lived credentials, rotation | SEC-002, RELENG-001 | Secret scanning and rotation exercise |
| SEC-017-006 — Content defense | Untrusted source boundaries, taint, validation, redaction | CTX-001, DEF-001 | Injection/exfiltration/adversarial fixtures |
| SEC-017-007 — Tool authority | Typed allowlist, egress/resource bounds, effect registration | SEC-001, TOOL-001 | Unknown-tool, schema, network, duplicate-effect tests |
| SEC-017-008 — Audit | Transactional append-only events and immutable managed export | AUD-001 | Coverage, integrity, export-lag, access tests |
| SEC-017-009 — Data minimization | References over payloads; classification/provider-sharing rules | DATA-001, ART-001, OBS-001 | Log/prompt/message/artifact inspection |
| SEC-017-010 — Supply chain | Scans, signed provenance, SBOM, controlled promotion | RELENG-001 | Pipeline policy and artifact verification |

## Regression Requirements

| Regression requirement | Minimum coverage | Enforcement |
|---|---|---|
| REG-017-001 — Python behavior | Scoring, 6R, prioritization, replanning, workflow, agency | Required CI gate |
| REG-017-002 — JavaScript behavior | Mission Control state, navigation, labels, portfolio lab, guided controls | Required CI gate |
| REG-017-003 — Guided Journey | Clean reset through executive outcome and intentional validation correction | Required browser gate |
| REG-017-004 — Multi-case/program | DR-CIC-001, DR-SQP-002, selection synchronization, no duplicate objects | Required browser gate |
| REG-017-005 — Accessibility | Keyboard, focus, semantics, contrast checks, reduced motion | Required accessibility gate |
| REG-017-006 — Responsive | Approved desktop, tablet landscape/portrait, mobile portrait viewports | Required viewport gate |
| REG-017-007 — Deterministic mode | Complete supported journey without model/API access | Required integration gate |
| REG-017-008 — Reset safety | Demo reset restores UI; cannot delete production durable records | Required BDD/security gate |
| REG-017-009 — State ownership | One authoritative workflow; no browser/worker duplicate truth | Architecture and persistence review |
| REG-017-010 — Console/telemetry hygiene | No browser console errors, secrets, raw sensitive content, or broken correlation | Required release gate |

## Implementation Waves

### Wave 0 — Decision Readiness (No Runtime Implementation)

Complete EPIC-00. Approve governance and runtime contracts, managed-service
choices, candidate limits, and the current regression baseline. Failure to locate
or approve the Engineering Constitution and Development Playbook blocks Wave 1.

### Wave 1 — Minimum Production Candidate Runtime Spine

Implement only the minimum ARB-approved runtime capabilities:

- EPIC-01 compatibility boundary and typed configuration.
- EPIC-02 managed relational state, DNA snapshot reference, object artifacts,
  managed queue, one worker, outbox, idempotency/effect records, checkpoints,
  pause/resume, and session/process recovery.
- Tenant and correlation identifiers propagated through the spine, with local
  deterministic adapters retained.

Wave 1 must not add standalone services, new workflow stages, broad tools,
multi-provider routing, graph infrastructure, Kubernetes, advanced memory,
multi-region operation, AIOps, or UI redesign.

**Wave 1 exit:** EVAL-017-001, EVAL-017-002, and EVAL-017-004 pass for the
durable path; existing product behavior remains unchanged.

### Wave 2 — Minimum Trust Controls

Complete EPIC-03: managed identity/secrets, tenant enforcement, versioned
authorization, action-bound approval, audit/immutable export, encryption, and
egress constraints.

**Wave 2 exit:** EVAL-017-003 and EVAL-017-005 pass with no critical/high finding.

### Wave 3 — Governed AI and Tool Adapters

Complete EPIC-04 using one approved model route, deterministic fallback, bounded
context, typed allowlisted tools, and baseline content defense.

**Wave 3 exit:** EVAL-017-006 passes; model/tool execution cannot bypass Wave 2.

### Wave 4 — Operability and Release Qualification

Complete EPIC-05: telemetry, SLOs, alerts, runbooks, restore/reconciliation,
failure/load/cost validation, reproducible release, IaC, and rollback.

**Wave 4 exit:** EVAL-017-007, EVAL-017-008, and EVAL-017-009 pass.

### Wave 5 — Evidence and ARB Go/No-Go

Complete EPIC-06. Assemble objective evidence for every BDD, evaluation, security,
regression, operational, and scope gate. The ARB decides whether the result may be
labeled Production Candidate v1.

No controlled-pilot, enterprise-production, or general-availability backlog is
authorized by this document.

## Release Milestones

| Milestone | Outcome | Exit condition |
|---|---|---|
| M0 — Architecture prerequisites | Implementation contracts are approved | All P0 governance items accepted |
| M1 — Compatibility boundary | Existing experience calls a stable runtime seam | Baseline and contract suites pass |
| M2 — Durable execution | One journey survives application/worker restart | State, queue, retry, and recovery tests pass |
| M3 — Trust boundary | Every request and action is tenant-scoped and governed | Isolation and approval-bypass tests pass |
| M4 — Governed AI execution | Models/tools operate through bounded adapters | Fallback, content-defense, and effect tests pass |
| M5 — Operable candidate | Candidate is deployable, observable, recoverable | SLO, restore, runbook, and rollback exercises pass |
| M6 — Qualification | All ARB gates have evidence | ARB go/no-go review completed |

## Ordered Backlog

### M0 — Architecture and Governance Prerequisites

#### PCV1-GOV-001 — Establish authoritative engineering governance

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Product Architecture |
| Depends on | None |
| Size | S |

**Outcome:** Locate and approve the authoritative Engineering Constitution and
Development Playbook, or create them through a separately approved governance
action. Record ownership, precedence, and repository location.

**Acceptance:** Implementation standards are available in the repository;
conflicts with the Product Constitution or ARB decision are resolved; no team
claims compliance with missing documents.

#### PCV1-ARC-001 — Approve the state ownership contract

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Product Architecture |
| Depends on | PCV1-GOV-001 |
| Size | M |

**Outcome:** Define the sole authority for Enterprise DNA facts, case state,
workflow state, evidence, approvals, audit, session data, and derived views.

**Acceptance:** Every mutable datum has one owner; promotion into Enterprise DNA
requires validation/stewardship; workflow memory cannot silently become an
enterprise fact; duplicate state is explicitly prohibited.

#### PCV1-ARC-002 — Freeze identity and correlation contracts

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Product Architecture and Security Engineering |
| Depends on | PCV1-ARC-001 |
| Size | M |

**Outcome:** Define immutable identifiers and propagation rules for tenant,
subject, case, session, workflow, run, task, agent, model request, tool
invocation, evidence, approval, trace, and causation.

**Acceptance:** Schema examples exist for database rows, queue envelopes,
artifact paths, logs, and authorization decisions; `tenant_id` is never inferred
from an untrusted object identifier.

#### PCV1-WF-001 — Freeze the workflow transition contract

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Runtime Engineering and Product Owner |
| Depends on | PCV1-ARC-001 |
| Size | M |

**Outcome:** Version the existing legal journey transitions, terminal states,
pause/resume behavior, cancellation, retries, approval waits, and checkpoint
boundaries without changing user-visible behavior.

**Acceptance:** Illegal transitions are enumerated; every transition defines
input, output, owner, durability boundary, failure result, and next action; the
Guided Journey remains the compatibility baseline.

#### PCV1-SEC-001 — Freeze the risk and execution boundary

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Security Engineering and Product Owner |
| Depends on | PCV1-GOV-001 |
| Size | M |

**Outcome:** Enumerate allowed models, tools, data classes, network destinations,
read/write operations, and actions requiring approval.

**Acceptance:** Arbitrary execution, unrestricted connectors, privilege changes,
and unapproved production writes are explicitly denied; each allowed action has
a risk class, schema, credential boundary, and approval rule.

#### PCV1-DATA-001 — Approve the candidate data contract

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Data/Enterprise DNA and Security Engineering |
| Depends on | PCV1-ARC-001, PCV1-SEC-001 |
| Size | M |

**Outcome:** Define classification, provenance, integrity, retention, deletion,
residency, provider exposure, backup, and synthetic-data requirements.

**Acceptance:** Every persisted class has an owner and retention rule; model/tool
sharing rules are enforceable; test and lower environments use synthetic data;
legal hold and deletion conflicts are documented.

#### PCV1-REL-001 — Approve the reliability contract

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Runtime Engineering and SRE/Operations |
| Depends on | PCV1-WF-001, PCV1-SEC-001 |
| Size | M |

**Outcome:** Set retry, timeout, lease, idempotency, reconciliation, dead-letter,
checkpoint, backup, restore, RTO, and RPO rules for the bounded candidate.

**Acceptance:** No governed write is blindly retried; ambiguous effects enter
reconciliation; retry multiplication is prevented; candidate RTO/RPO and restore
evidence are measurable.

#### PCV1-OPS-001 — Approve the operating contract

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | SRE/Operations and Release Engineering |
| Depends on | PCV1-REL-001 |
| Size | M |

**Outcome:** Name the service owner, escalation path, candidate SLOs, deployment
method, rollback method, incident roles, required alerts, and runbooks.

**Acceptance:** Ownership is accepted; error-budget behavior is defined; the
candidate cannot enter pilot without on-call coverage and exercised runbooks.

#### PCV1-PLAT-001 — Select managed services

| Attribute | Value |
|---|---|
| Decision | USE MANAGED SERVICE |
| Priority | P0 |
| Owner | Product Architecture, Security Engineering, and SRE/Operations |
| Depends on | PCV1-DATA-001, PCV1-REL-001, PCV1-OPS-001 |
| Size | M |

**Outcome:** Select managed hosting, relational database, queue, object storage,
OIDC identity, secrets/keys, telemetry, immutable retention, and backup services.

**Acceptance:** Each selection records encryption, tenant/isolation behavior,
availability, backup/restore, auditability, regional constraints, portability,
cost envelope, operational owner, and exit strategy. No custom substitute enters
scope.

### M1 — Compatibility Boundary

#### PCV1-QA-001 — Lock the current regression baseline

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Quality Engineering and Product Owner |
| Depends on | PCV1-WF-001 |
| Size | M |

**Outcome:** Capture automated baseline coverage for Mission Control, Guided
Journey, Enterprise DNA, AI Agency, approval, validation, reset, accessibility,
responsive behavior, deterministic fallback, and stored artifacts.

**Acceptance:** Current Python and JavaScript suites pass from a clean checkout;
critical browser journeys are reproducible; failures block runtime migration.

#### PCV1-RT-001 — Introduce the modular runtime boundary

| Attribute | Value |
|---|---|
| Decision | MERGE |
| Priority | P1 |
| Owner | Runtime Engineering |
| Depends on | PCV1-ARC-001, PCV1-ARC-002, PCV1-WF-001, PCV1-QA-001 |
| Size | L |

**Outcome:** Define command/query interfaces around the existing workflow and
move no behavior until contract tests protect the seam.

**Acceptance:** Existing UI uses the compatibility boundary; internal variable
or state duplication is absent; deterministic local execution remains possible;
all baseline tests pass.

#### PCV1-CFG-001 — Establish typed runtime configuration

| Attribute | Value |
|---|---|
| Decision | MERGE |
| Priority | P1 |
| Owner | Runtime Engineering and Release Engineering |
| Depends on | PCV1-PLAT-001 |
| Size | S |

**Outcome:** Add schema-validated configuration for environment, limits,
providers, feature flags, and managed-service endpoints without embedding
secrets.

**Acceptance:** Invalid configuration fails safely; defaults preserve local
deterministic execution; configuration and secrets are separated; flags have
owner and safe default.

### M2 — Durable Execution

#### PCV1-DB-001 — Implement the transactional runtime schema

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | Runtime Engineering and Data/Enterprise DNA |
| Depends on | PCV1-RT-001, PCV1-PLAT-001 |
| Size | L |

**Outcome:** Persist tenant-scoped workflow instances, tasks, checkpoints,
effects, approvals, evidence metadata, audit events, and outbox records in the
managed relational database while retaining SQLite for local deterministic use.

**Acceptance:** Versioned migrations are forward/backward tested; optimistic
state versioning prevents silent overwrite; constraints enforce tenant and
referential integrity; no source-of-truth duplication is introduced.

#### PCV1-DNA-001 — Persist versioned Enterprise DNA snapshots

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | Data/Enterprise DNA |
| Depends on | PCV1-DB-001, PCV1-DATA-001 |
| Size | M |

**Outcome:** Pin each workflow to an immutable Enterprise DNA snapshot using the
relational entity/relationship model.

**Acceptance:** Re-running against the same snapshot yields the same input facts;
snapshot refresh is explicit; bounded dependency navigation meets the candidate
limit; no graph database is introduced.

#### PCV1-ART-001 — Store versioned artifacts and evidence

| Attribute | Value |
|---|---|
| Decision | USE MANAGED SERVICE |
| Priority | P1 |
| Owner | Data/Enterprise DNA and Runtime Engineering |
| Depends on | PCV1-DB-001, PCV1-DATA-001 |
| Size | M |

**Outcome:** Store payloads in managed object storage and transactional metadata,
hashes, provenance, classifications, and references in the relational store.

**Acceptance:** Every assessment run creates durable artifacts; integrity and
tenant isolation are verified; prompts carry bounded excerpts/references rather
than unrestricted payloads.

#### PCV1-Q-001 — Implement queue and worker execution

| Attribute | Value |
|---|---|
| Decision | USE MANAGED SERVICE / BUILD NOW |
| Priority | P1 |
| Owner | Runtime Engineering |
| Depends on | PCV1-DB-001, PCV1-CFG-001 |
| Size | L |

**Outcome:** Add one managed queue adapter and one bounded worker deployment for
durable workflow tasks.

**Acceptance:** Queue envelopes carry tenant and correlation IDs; tasks use
leases and attempt numbers; duplicate delivery is safe; web-session loss does not
cancel work; local deterministic execution remains supported.

#### PCV1-REL-002 — Enforce idempotency and effect reconciliation

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | Runtime Engineering |
| Depends on | PCV1-Q-001, PCV1-DB-001 |
| Size | L |

**Outcome:** Register mutating intent, idempotency key, attempt, provider result,
and reconciliation state transactionally.

**Acceptance:** Duplicate messages produce one logical effect; timeout after an
external response cannot trigger blind re-execution; ambiguous outcomes stop in
`ReconciliationRequired`; fault tests cover every transition.

#### PCV1-REL-003 — Implement checkpoint and session recovery

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | Runtime Engineering and Quality Engineering |
| Depends on | PCV1-Q-001, PCV1-REL-002, PCV1-DNA-001, PCV1-ART-001 |
| Size | L |

**Outcome:** Resume workflows from the last committed boundary after application,
worker, provider, or browser interruption.

**Acceptance:** Pause completes after a safe checkpoint; resume continues the
same workflow/version/snapshot; completed tasks are not repeated; returning users
load authoritative state; restart and redelivery fault tests pass.

### M3 — Trust Boundary

#### PCV1-IAM-001 — Integrate managed OIDC identity

| Attribute | Value |
|---|---|
| Decision | USE MANAGED SERVICE |
| Priority | P1 |
| Owner | Security Engineering |
| Depends on | PCV1-PLAT-001, PCV1-ARC-002 |
| Size | M |

**Outcome:** Authenticate human users through managed OIDC with tenant and role
claims; use managed workload identity for application and worker access.

**Acceptance:** Unauthenticated access is denied; session expiry requires
reauthentication; service credentials are short-lived; identity events are
audited; local test identity is explicit and unavailable in production mode.

#### PCV1-TEN-001 — Enforce tenant isolation end to end

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Security Engineering and Runtime Engineering |
| Depends on | PCV1-IAM-001, PCV1-DB-001, PCV1-ART-001, PCV1-Q-001 |
| Size | L |

**Outcome:** Enforce authenticated tenant scope across commands, queries,
persistence, queueing, artifact access, caches, telemetry, and administration.

**Acceptance:** Cross-tenant positive and negative tests cover every resource
type; object IDs cannot override tenant scope; administrative access is separate
and audited; failures reveal no foreign metadata.

#### PCV1-POL-001 — Implement versioned authorization policy

| Attribute | Value |
|---|---|
| Decision | MERGE |
| Priority | P1 |
| Owner | Security Engineering |
| Depends on | PCV1-SEC-001, PCV1-IAM-001, PCV1-TEN-001 |
| Size | M |

**Outcome:** Enforce a small role/attribute policy in the modular runtime for
case, evidence, workflow, model, tool, approval, and administrative actions.

**Acceptance:** Policy version and decision ID are recorded; governed mutations
fail closed; denial cannot be converted into a retry; policy tests enumerate all
roles, risk classes, and resource types; no custom policy language/service is
introduced.

#### PCV1-APR-001 — Enforce action-bound human approval

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Security Engineering and Runtime Engineering |
| Depends on | PCV1-POL-001, PCV1-ART-001 |
| Size | L |

**Outcome:** Bind approval to actor, target, typed action parameters, evidence
manifest, relevant versions, risk class, and expiry.

**Acceptance:** Material input change invalidates approval; rejected/expired
approval cannot execute; approver role and separation are enforced; direct worker
or adapter calls cannot bypass the gate; approval-bypass tests pass.

#### PCV1-AUD-001 — Implement audit and managed immutable export

| Attribute | Value |
|---|---|
| Decision | MERGE / USE MANAGED SERVICE |
| Priority | P1 |
| Owner | Security Engineering and SRE/Operations |
| Depends on | PCV1-DB-001, PCV1-POL-001, PCV1-APR-001, PCV1-PLAT-001 |
| Size | M |

**Outcome:** Append transactional audit/trajectory records and export them to
managed immutable retention.

**Acceptance:** Authentication, policy, state, evidence, model/tool, approval,
configuration, and administrative events are covered; hashes/references replace
sensitive payloads; export lag is monitored; ordinary operators cannot modify
retained records.

#### PCV1-SEC-002 — Enforce secrets, encryption, and egress controls

| Attribute | Value |
|---|---|
| Decision | USE MANAGED SERVICE |
| Priority | P0 |
| Owner | Security Engineering and Release Engineering |
| Depends on | PCV1-PLAT-001, PCV1-IAM-001 |
| Size | M |

**Outcome:** Use managed secrets/keys, encrypted transport/storage, workload
identity, network allowlists, and bounded process resources.

**Acceptance:** Secrets never enter source, logs, prompts, artifacts, or browser
state; rotation is tested; only approved destinations are reachable; production
uses no shared long-lived application credential.

### M4 — Governed AI and Tool Execution

#### PCV1-MDL-001 — Implement the governed model adapter

| Attribute | Value |
|---|---|
| Decision | MERGE |
| Priority | P1 |
| Owner | Runtime Engineering and Security Engineering |
| Depends on | PCV1-CFG-001, PCV1-POL-001, PCV1-SEC-002, PCV1-ART-001 |
| Size | L |

**Outcome:** Route typed requests through one adapter with one approved provider,
model/version configuration, deadlines, token/cost budgets, structured output
validation, telemetry, and deterministic fallback.

**Acceptance:** Callers cannot access provider credentials; model output cannot
invent numeric scores or directly mutate authoritative state; fallback behavior
is explicit; provider timeout, malformed output, quota, and outage tests pass.

#### PCV1-CTX-001 — Assemble bounded, provenance-aware context

| Attribute | Value |
|---|---|
| Decision | MERGE |
| Priority | P1 |
| Owner | Data/Enterprise DNA and Runtime Engineering |
| Depends on | PCV1-DNA-001, PCV1-ART-001, PCV1-MDL-001 |
| Size | M |

**Outcome:** Build task-scoped context from the pinned DNA snapshot and ranked
evidence under deterministic size and classification limits.

**Acceptance:** Every context item retains provenance/classification; truncation
is deterministic and visible; tenant boundaries are enforced; model output is
not promoted to case or DNA authority without validation.

#### PCV1-TOOL-001 — Implement typed allowlisted tool adapters

| Attribute | Value |
|---|---|
| Decision | MERGE |
| Priority | P1 |
| Owner | Runtime Engineering and Security Engineering |
| Depends on | PCV1-REL-002, PCV1-POL-001, PCV1-APR-001, PCV1-SEC-002 |
| Size | L |

**Outcome:** Execute only approved schemas and operations through a centralized
adapter module with effect registration and policy/approval enforcement.

**Acceptance:** Model text cannot call a tool directly; unknown tools/fields are
rejected; credentials are injected after authorization; read operations are
bounded; any permitted write is idempotent and approval-bound; arbitrary code
execution is impossible.

#### PCV1-DEF-001 — Add baseline content and output defense

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | Security Engineering and Runtime Engineering |
| Depends on | PCV1-CTX-001, PCV1-TOOL-001 |
| Size | M |

**Outcome:** Treat retrieved/uploaded content as untrusted data using source
boundaries, taint labels, schema/MIME checks, instruction-pattern detection,
redaction, output validation, and safe failure.

**Acceptance:** Untrusted content cannot alter policy or tool authority; detected
high-risk content stops or narrows execution; injection, exfiltration, malformed
content, and false-positive recovery tests pass; no custom defense platform is
built.

### M5 — Operable and Releasable Candidate

#### PCV1-OBS-001 — Instrument end-to-end telemetry

| Attribute | Value |
|---|---|
| Decision | BUILD NOW / USE MANAGED SERVICE |
| Priority | P1 |
| Owner | SRE/Operations and Runtime Engineering |
| Depends on | PCV1-ARC-002, PCV1-Q-001, PCV1-MDL-001, PCV1-TOOL-001 |
| Size | L |

**Outcome:** Emit OpenTelemetry-compatible traces, metrics, and structured logs
through asynchronous workflow, model, tool, policy, approval, and storage paths.

**Acceptance:** One command can be correlated through its complete execution;
queue wait and provider time are separated from platform overhead; security,
approval, and failure events are never sampled away; telemetry contains no
secrets or unrestricted payloads.

#### PCV1-SLO-001 — Establish candidate SLOs, dashboards, and alerts

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | SRE/Operations |
| Depends on | PCV1-OBS-001, PCV1-OPS-001 |
| Size | M |

**Outcome:** Implement the 99.9% candidate availability objective, workflow
command, state freshness, queue age, audit export, approval age, and provider
dependency indicators.

**Acceptance:** Alerts are symptom-based, owned, and linked to runbooks; burn
alerts stop nonessential releases; dashboards distinguish user impact from
provider failures; synthetic critical journeys run continuously.

#### PCV1-OPS-002 — Create and exercise the minimum runbooks

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | SRE/Operations, Security Engineering, and Runtime Engineering |
| Depends on | PCV1-SLO-001, PCV1-AUD-001 |
| Size | M |

**Outcome:** Create service-degradation, workflow-backlog, ambiguous-tool-effect,
and database-restore runbooks plus incident roles and communications.

**Acceptance:** Each runbook is exercised in a game day; evidence and follow-up
actions are retained; unsafe mutations can be frozen; escalation ownership is
confirmed.

#### PCV1-DR-001 — Prove backup, restore, and reconciliation

| Attribute | Value |
|---|---|
| Decision | BUILD NOW / USE MANAGED SERVICE |
| Priority | P0 |
| Owner | SRE/Operations and Data/Enterprise DNA |
| Depends on | PCV1-DB-001, PCV1-ART-001, PCV1-AUD-001, PCV1-REL-003 |
| Size | L |

**Outcome:** Configure managed backups and execute a clean-environment restore of
workflow, DNA snapshot, evidence, approval, audit, and artifact state.

**Acceptance:** Approved RTO/RPO are met; queues/outbox/effects reconcile without
duplicate work; restored tenant and integrity checks pass; derived views can be
rebuilt; restore evidence is reviewed.

#### PCV1-REL-004 — Validate failure and graceful degradation

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | Quality Engineering, Runtime Engineering, and SRE/Operations |
| Depends on | PCV1-REL-003, PCV1-MDL-001, PCV1-TOOL-001, PCV1-OBS-001 |
| Size | L |

**Outcome:** Exercise worker loss, duplicate delivery, provider timeout/quota,
tool ambiguity, database failover, telemetry degradation, and audit-export lag.

**Acceptance:** No acknowledged state is lost; no duplicate logical effect
occurs; governed actions fail closed; deterministic fallback is accurately
represented; user/operator status and next action remain clear.

#### PCV1-PERF-001 — Verify capacity and performance envelope

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P1 |
| Owner | Quality Engineering and SRE/Operations |
| Depends on | PCV1-OBS-001, PCV1-SLO-001, PCV1-Q-001 |
| Size | M |

**Outcome:** Define and test maximum pilot tenants, users, workflows, queue depth,
DNA entities/edges, evidence volume, context size, tokens, and tool concurrency.

**Acceptance:** Candidate meets approved browser/API/workflow/DNA/tool budgets at
normal and 2x planned pilot load; quotas provide backpressure; a noisy tenant
cannot exhaust all capacity; results and limitations are published.

#### PCV1-COST-001 — Enforce basic runtime cost controls

| Attribute | Value |
|---|---|
| Decision | BUILD NOW / USE MANAGED SERVICE |
| Priority | P1 |
| Owner | SRE/Operations and Product Owner |
| Depends on | PCV1-MDL-001, PCV1-TOOL-001, PCV1-OBS-001 |
| Size | S |

**Outcome:** Attribute model tokens, tool calls, storage, and workflow cost; apply
tenant/workflow budgets and managed anomaly alerts.

**Acceptance:** Budget exhaustion queues or safely rejects work; it never silently
lowers required quality/control; cost is visible by tenant, workflow, agent,
model, and tool; no custom FinOps platform is introduced.

#### PCV1-RELENG-001 — Establish reproducible release and rollback

| Attribute | Value |
|---|---|
| Decision | BUILD NOW / USE MANAGED SERVICE |
| Priority | P0 |
| Owner | Release Engineering and Security Engineering |
| Depends on | PCV1-CFG-001, PCV1-PLAT-001, PCV1-QA-001 |
| Size | L |

**Outcome:** Implement one managed CI/CD path with reproducible builds, dependency
and secret scanning, provenance/SBOM, automated tests, environment promotion,
infrastructure as code, and rollback.

**Acceptance:** The same signed artifact is promoted; failed gates prevent
release; migrations support mixed/rollback-safe versions; production secrets are
absent from build artifacts; rollback is demonstrated without losing workflow
state.

### M6 — Qualification and ARB Reassessment

#### PCV1-QA-002 — Assemble the Production Candidate evidence package

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Quality Engineering |
| Depends on | All M1–M5 items |
| Size | M |

**Outcome:** Produce traceable evidence for every ARB go/no-go gate.

**Acceptance:** Evidence includes test commands/results, release artifact and
provenance, threat/control results, isolation tests, approval tests, recovery
exercise, load results, accessibility/browser results, SLO dashboards, runbook
exercises, known risks, and exact candidate limits.

#### PCV1-ARB-001 — Conduct Production Candidate go/no-go review

| Attribute | Value |
|---|---|
| Decision | BUILD NOW |
| Priority | P0 |
| Owner | Architecture Review Board |
| Depends on | PCV1-QA-002 |
| Size | S |

**Outcome:** Decide whether the implementation satisfies the frozen scope and may
be labeled Production Candidate v1.

**Acceptance:** Product, Architecture, Security, SRE, Data Governance, Release,
and accountable business owner record approval or rejection; every exception has
an owner and expiry; no P0/P1 trust, state-correctness, recovery, or regression
gate is waived.

## Critical Path

```text
GOV-001
  -> ARC-001 -> ARC-002 -> WF-001 -> QA-001 -> RT-001
  -> DB-001 -> Q-001 -> REL-002 -> REL-003
  -> IAM-001 -> TEN-001 -> POL-001 -> APR-001
  -> MDL-001 / TOOL-001 / DEF-001
  -> OBS-001 -> SLO-001 -> REL-004 / PERF-001
  -> QA-002 -> ARB-001
```

Managed-service selection, the data/reliability/operations contracts, artifact
storage, release engineering, and backup/restore proceed in parallel where their
listed dependencies permit.

## Backlog Dependency Rules

- No persistence schema is approved before state and tenant contracts.
- No queue worker is approved before idempotency semantics are specified.
- No model or tool adapter is approved before identity, policy, secrets, and
  risk boundaries.
- No high-risk execution is approved before action-bound approval tests.
- No pilot is approved before restore, fault, load, security, accessibility, and
  product-regression evidence.
- A deferred capability cannot be substituted for an incomplete P0/P1 control.

## Required Test Inventory

| Test class | Minimum candidate coverage |
|---|---|
| Unit | Scoring, 6R, prioritization, replanning, state transitions, policy, confidence |
| Contract | Commands/queries, queue envelopes, model/tool schemas, managed adapters |
| Persistence | Migrations, optimistic concurrency, outbox, checkpoints, tenant constraints |
| Integration | Database, queue, object storage, identity, secrets, telemetry, immutable export |
| Security | Tenant isolation, authorization matrix, approval bypass, injection, secret leakage, egress |
| Reliability | Duplicate delivery, retry budget, worker loss, ambiguous effect, restore, reconciliation |
| AI runtime | Structured output, deterministic fallback, numeric-score authority, provenance |
| Browser | Guided Journey, Mission Control, Enterprise DNA, reset, keyboard, reduced motion |
| Accessibility | Automated checks plus keyboard/focus/screen-reader critical path |
| Responsive | Supported desktop, tablet, and mobile viewports |
| Performance | Candidate load, 2x planned pilot load, context limits, provider degradation |
| Release | Clean build, scans, migration compatibility, deploy, rollback |

## Risk Register

| Risk | Probability | Impact | Trigger | Mitigation / contingency | Owner |
|---|---|---|---|---|---|
| RISK-017-001 — Governance inputs remain missing | High | High | Engineering Constitution or Development Playbook cannot be located/approved | Keep Wave 1 blocked through PCV1-GOV-001; do not infer standards | Product Architecture |
| RISK-017-002 — Duplicate workflow truth | Medium | Critical | UI, worker, or new schema owns an independent stage/status | Enforce PCV1-ARC-001; reject dual writes; architecture review schemas and projections | Product Architecture |
| RISK-017-003 — Existing product regression | Medium | High | Guided Journey, Mission Control, reset, multi-case, accessibility, or fallback fails | Baseline before extraction; compatibility seam; feature flag; rollback; EVAL-017-004 | Product Owner / QA |
| RISK-017-004 — Cross-tenant disclosure | Medium | Critical | Object ID, queue message, artifact, or telemetry bypasses tenant scope | Server-derived tenant, schema constraints, isolation matrix, fail closed | Security Engineering |
| RISK-017-005 — Duplicate or ambiguous side effect | Medium | Critical | Queue redelivery or provider timeout follows a possible mutation | Stable idempotency key, effect registry, status reconciliation, approval, no blind retry | Runtime Engineering |
| RISK-017-006 — Checkpoint incompatibility | Medium | High | Workflow definition/schema changes while instances are active | Version pinning, migration tests, forward-readable checkpoint, explicit run migration | Runtime Engineering |
| RISK-017-007 — Managed-service lock-in | Medium | Medium | Domain code depends directly on provider SDK/semantics | Adapter contracts, portable schemas, documented exit plan; accept bounded operational coupling | Product Architecture |
| RISK-017-008 — Provider/model outage or drift | High | Medium | Latency, quota, malformed output, or changed output quality | Deadlines, structured validation, deterministic fallback, pinned version/config, EVAL-017-006 | AI Platform Engineering |
| RISK-017-009 — Sensitive content in prompts or telemetry | Medium | Critical | Classification, minimization, or redaction test fails | Reference payloads, data contract, taint/classification, secret scanning, telemetry contract | Security / Data Governance |
| RISK-017-010 — Restore cannot meet objectives | Medium | Critical | Clean restore or reconciliation misses RTO/RPO | PCV1-DR-001 before candidate; managed backups; repeated restore exercises; no pilot waiver | SRE/Operations |
| RISK-017-011 — Queue/retry storm | Medium | High | Queue age, attempts, or provider throttling exceeds envelope | Admission limits, bounded retries, jitter, concurrency bulkheads, dead letter, alerts | Runtime Engineering / SRE |
| RISK-017-012 — Scope expands into platform build | High | High | Standalone services, Kubernetes, graph, multi-region, marketplace, or AIOps enters a wave | Explicit Non-Backlog, ARB change control, remove equivalent scope or defer request | Technical Program Manager |
| RISK-017-013 — Candidate limits are not representative | Medium | Medium | Pilot demand exceeds tested tenant/workflow/data/token envelope | Publish limits, instrument saturation, load at 2x planned pilot, reassess before commitment | Product / SRE |
| RISK-017-014 — Operational ownership is insufficient | Medium | High | Alerts or incidents have no trained responder | PCV1-OPS-001, runbook game day, named on-call, no controlled pilot before acceptance | Engineering Manager / SRE |
| RISK-017-015 — Release rollback strands durable workflows | Medium | Critical | Application rollback cannot read current schema/checkpoint/version | Expand/migrate/contract, mixed-version tests, definition pinning, rollback rehearsal | Release / Runtime Engineering |

Critical risks cannot be accepted by the delivery team alone. Any residual
Critical risk requires recorded ARB, Security, SRE, and accountable business-owner
review before Production Candidate labeling.

## Backlog Change Control

The Product Owner may clarify acceptance criteria but may not add a deferred or
removed capability to Production Candidate v1. Any scope addition requires:

1. A named customer or control requirement.
2. Evidence that the existing minimal architecture cannot satisfy it.
3. Security, reliability, operational, and cost impact.
4. An ADR or ARB amendment.
5. Removal or rescheduling of equivalent effort unless the release date is
   explicitly changed.

## Production Candidate v1 Completion Rule

Production Candidate v1 is complete only when all P0 and P1 items are done, the
existing product remains regression-clean, the evidence package is complete, and
the ARB records a Go decision. Completion of code without operational and trust
evidence is not Production Candidate completion.

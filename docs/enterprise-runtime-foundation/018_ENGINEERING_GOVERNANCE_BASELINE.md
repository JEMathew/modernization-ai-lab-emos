# Engineering Governance Baseline

## Production Candidate v1

## Document Control

| Field | Value |
|---|---|
| Document ID | EGB-018 |
| File | `018_ENGINEERING_GOVERNANCE_BASELINE.md` |
| Status | Approved |
| Scope | Modernization AI Lab Production Candidate v1 |
| Purpose | Minimum combined engineering constitution and development playbook baseline |
| Governing product authority | `design/00_PRODUCT_CONSTITUTION.md` |
| Architecture authority | `docs/enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md` |
| Engineering plan | `docs/enterprise-runtime-foundation/17_ENGINEERING_BACKLOG.md` |
| Runtime requirement | `design/specs/PRS-017_WORKFLOW_RUNTIME_FOUNDATION.md` |
| Repository guidance | `AGENTS.md` |
| Effective date | 2026-08-02 |
| Review cadence | At every release gate and at least quarterly while active |

## 1. Executive Decision

This document defines the minimum engineering governance required to implement
Production Candidate v1 responsibly. It combines constitution-like engineering
rules with a practical delivery playbook because separate authoritative files
named Engineering Constitution and Development Playbook are not currently
evidenced in the repository.

This baseline is effective for Production Candidate v1. Its approval satisfies
the governance intent of backlog story `PCV1-GOV-001` for that scope only. It
does not authorize implementation by itself; the ARB conditions, PRS approval,
Definition of Ready, and wave gates still apply.

The baseline does not supersede the Product Constitution or ARB decision. It
turns them into enforceable engineering practices while preserving the current
product, stack, architecture, and validated workflows.

## 2. Authority and Precedence

When instructions conflict, the following precedence applies:

1. Applicable law, contractual controls, and approved security/data obligations.
2. Product Constitution.
3. Approved Architecture Review Board decisions and ADRs.
4. Approved Product Requirement Specifications.
5. This Engineering Governance Baseline.
6. Approved engineering backlog and implementation-wave plan.
7. Repository-local `AGENTS.md` instructions.
8. Work-packet plans and implementation notes.

Lower-precedence artifacts may add detail but may not weaken a higher-precedence
control. A conflict stops the affected work until the accountable approvers
record a resolution.

## 3. Scope and Boundaries

### 3.1 Governed Work

This baseline governs:

- Production Candidate v1 runtime, trust, operations, release, and validation
  work.
- Changes to the existing Python application, Streamlit experience, engine,
  Enterprise DNA, AI Agency, workflow, tests, and standalone Mission Control
  prototype when they are part of an approved work packet.
- Managed-service adapters, data schemas, migrations, infrastructure as code,
  configuration, prompts, policies, runbooks, and release evidence.
- Human and AI-assisted engineering activity performed in this repository.

### 3.2 Excluded Work

This baseline does not authorize:

- Controlled Pilot, Enterprise Production, or General Availability scope.
- Features classified BUILD LATER or REMOVE by the ARB.
- Product redesign or replacement of the current Journey.
- A second workflow, case, Enterprise DNA, evidence, approval, or audit authority.
- Microservice extraction, Kubernetes, service mesh, graph database, custom
  platform services, AIOps, autonomous remediation, or arbitrary execution.
- Production customer data before a separately approved data and pilot contract.

## 4. Engineering Constitution

The following rules are non-negotiable for Production Candidate v1.

### EC-001 — Preserve Product Intent

Modernization AI Lab is an Enterprise Modernization Operating System and AI
agency, not a chatbot or a narrow application-modernization utility. Engineering
decisions must preserve Mission Control, Enterprise DNA, Enterprise
Intelligence, the Modernization AI Agency, and the Journey as distinct but
connected responsibilities.

### EC-002 — Preserve the Validated Product

The current Guided Journey, Mission Control, Modernization HQ, Enterprise DNA,
multi-case behavior, deterministic fallback, accessibility, responsive behavior,
and reset behavior are compatibility contracts. Runtime work must extend them
without redesign, silent behavior change, or duplicate state.

### EC-003 — One Authoritative Owner per State

Every durable datum has exactly one authoritative owner. Projections, caches,
browser state, worker memory, model output, and telemetry are never independent
sources of truth. Enterprise DNA remains authoritative for governed enterprise
facts; the runtime owns workflow execution state; the Journey orchestrates but
does not redefine enterprise understanding.

### EC-004 — Tenant Isolation Is Structural

Tenant scope is required in every persisted record, queue message, artifact path,
cache key, query, authorization decision, trace, and administrative action. It is
derived from trusted identity/context and never trusted solely from a caller's
object identifier.

### EC-005 — Durable Before Distributed

Acknowledged work must be durable before new services or scale mechanisms are
introduced. Production Candidate v1 uses one modular Python application, one
bounded worker, and managed infrastructure. Logical module boundaries are
preserved without premature network boundaries.

### EC-006 — Effectively-Once Logical Effects

Queue delivery may be at least once. Commands, tasks, and external effects must
use stable idempotency, optimistic state versions, effect registration, bounded
retry, and reconciliation so one logical intent cannot silently execute twice.

### EC-007 — Human Authority for High Risk

High-risk actions require a durable human approval bound to the exact action,
target, evidence manifest, relevant versions, risk class, and expiry. A UI flag
is not an authorization control. Changed inputs invalidate approval.

### EC-008 — Deterministic Numeric Authority

Python calculates scoring, 6R, prioritization, replanning, confidence components,
and other numeric decisions. Models may explain results but must not invent,
replace, or silently alter numeric scores.

### EC-009 — Honest AI Behavior

The product must accurately distinguish live model execution, tool execution,
deterministic fallback, cached result, and mocked/synthetic behavior. A degraded
system may wait or fall back; it must not fabricate execution or completion.

### EC-010 — Evidence Is Required

Every assessment run creates versioned artifacts with tenant, provenance,
classification, integrity hash, timestamps, and producing workflow/task. A stage
cannot complete when its required artifact or checkpoint failed to persist.

### EC-011 — Least Authority

Models and agents have no implicit credentials or tool authority. They operate
through typed, allowlisted adapters with bounded context, time, tokens, cost,
network, and resources. Arbitrary code, repository, filesystem, and production
execution are outside Production Candidate v1.

### EC-012 — Fail Closed, Degrade Clearly

Identity, authorization, approval, secrets, evidence integrity, and audit
prerequisites fail closed for governed mutations. Read-only status may degrade
only when uncertainty, freshness, and next action are explicit.

### EC-013 — Observable Without Oversharing

Every command is correlated through workflow, queue, task, model, tool, policy,
approval, evidence, and artifact operations. Telemetry must not contain secrets,
credentials, chain-of-thought, or unrestricted enterprise payloads.

### EC-014 — Managed Before Custom

Use managed identity, secrets/keys, relational database, queue, object storage,
telemetry, immutable retention, backups, and hosting. A custom platform requires
evidence that the approved managed approach cannot satisfy a requirement and a
new ADR/ARB decision.

### EC-015 — Test Failure Is Evidence

A failing required test, control, recovery exercise, or SLO evaluation is not a
documentation inconvenience. It blocks the relevant wave or release until fixed
or the scope is reduced. Critical trust, state-correctness, recovery, and product
regression gates cannot be waived by the delivery team.

### EC-016 — Smallest Safe Change

Each work packet implements the smallest approved behavior that can pass its
acceptance criteria. Refactoring, dependency replacement, architectural
extraction, or adjacent feature work requires explicit scope and regression
evidence.

## 5. Approved Technology Baseline

### 5.1 Application Stack

- Python.
- Streamlit for the current application experience.
- Pandas where the existing product uses tabular analysis.
- Pydantic for typed boundaries and validation.
- SQLite for deterministic local development and tests.
- Managed relational database for Production Candidate durable state, subject to
  approved service selection.
- OpenAI Python SDK behind the governed model adapter.
- Pytest for Python validation.
- HTML5, CSS3, vanilla JavaScript, and inline SVG for the standalone Mission
  Control prototype.

### 5.2 Managed Runtime Dependencies

Production Candidate v1 may select managed hosting, queue, object storage, OIDC,
workload identity, secrets/keys, telemetry, immutable retention, and backup
services through `PCV1-PLAT-001`.

Domain models and contracts must remain provider-agnostic. Provider-specific
configuration and SDK use remain inside adapters and infrastructure definitions.

### 5.3 Prohibited by Default

- React, TypeScript, npm, FastAPI, Docker, Kubernetes, cloud databases, or other
  technologies may not be introduced merely by preference. A technology already
  required by an approved Production Candidate managed deployment may be proposed
  through an ADR and work packet.
- No custom workflow engine, policy engine, identity provider, queue, database,
  object store, telemetry backend, FinOps system, or internal developer platform.
- No dependency without license, maintenance, vulnerability, size, and
  operational-impact review.

The repository instruction prohibiting new major technologies remains in force.
Where the ARB's managed production topology requires a capability beyond the
current stack, selection and introduction require explicit ADR approval rather
than implicit implementation.

## 6. Architecture Governance

### 6.1 Required Design Artifacts

Before implementation, a work packet identifies:

- Governing PRS and ARB/backlog stories.
- Current behavior and regression surface.
- State owners and tenant boundary.
- Interfaces, schemas, events, and versioning.
- Failure, retry, timeout, recovery, and rollback behavior.
- Security/data classification and approval implications.
- Telemetry, evaluation, and operational ownership.
- Managed-service dependency and local deterministic fallback.

### 6.2 ADR Triggers

An ADR is required for:

- New authoritative state or a change of state ownership.
- New production data store, queue, provider, tool class, deployment unit, or
  managed-service category.
- New cross-module public interface or event schema.
- Change to consistency, tenancy, identity, authorization, approval, audit,
  retention, RTO/RPO, or SLO semantics.
- New dependency with meaningful security or operational impact.
- A deviation from the approved stack or ARB disposition.

### 6.3 ARB Re-review Triggers

ARB re-review is mandatory for:

- Any BUILD LATER or REMOVE capability.
- A new service boundary or source of truth.
- Arbitrary execution or a new write-capable external tool.
- Multi-region operation, dedicated tenant topology, graph infrastructure,
  Kubernetes, service mesh, or platform product.
- A waived P0/P1 architecture, trust, reliability, or regression gate.
- A material increase in candidate data class, scale, availability, or autonomy.

### 6.4 Architecture Fitness Checks

Automated or reviewed checks must detect:

- Missing tenant/correlation fields.
- Duplicate workflow or Enterprise DNA ownership.
- Direct model/tool/provider calls outside adapters.
- Secrets in source, configuration, prompts, logs, fixtures, or artifacts.
- Illegal state transitions and unversioned schemas.
- Non-idempotent mutating tasks.
- UI/browser state treated as durable workflow truth.
- Prohibited dependencies or deployment components.

## 7. Development Playbook

### 7.1 Work Packet Lifecycle

Every implementation packet follows this sequence:

1. **Discover:** inspect repository status, current code, tests, docs, and active
   behavior before proposing changes.
2. **Trace:** identify PRS, backlog story, BDD, security, evaluation, regression,
   and Definition of Done references.
3. **Bound:** state files/modules in scope, exclusions, risks, dependencies, and
   assumptions.
4. **Design:** define the minimal contract, state transition, data migration,
   failure behavior, and rollback.
5. **Test first:** add or identify failing acceptance/contract tests before
   altering production behavior where practical.
6. **Implement:** make the smallest cohesive change; preserve architecture and
   local deterministic mode.
7. **Verify:** run targeted tests, full required regressions, static checks,
   security scans, browser/console validation, and relevant evaluations.
8. **Review:** obtain code, product, security, data, SRE, or architecture review
   appropriate to the risk.
9. **Release evidence:** document files, commands, results, acceptance criteria,
   known issues, rollback, and demo/verification steps.
10. **Close:** merge only after all gates pass and artifacts are stored.

### 7.2 Repository Safety

- Inspect `git status` before and after work.
- Treat pre-existing changes as user-owned; never overwrite or stage them without
  explicit scope.
- Do not use destructive reset/checkout operations without explicit approval.
- Stage and commit only cohesive work-packet files.
- Do not mix documentation, feature, refactor, dependency, and unrelated cleanup
  changes in one commit.
- Preserve a working happy path after every change.

### 7.3 Change Size

- Prefer one backlog story or one independently testable vertical slice per pull
  request.
- Split work larger than 13 relative points before implementation.
- Database schema, state behavior, provider adapter, and UI changes should be
  separately reviewable unless atomic delivery is necessary for correctness.
- Use feature flags only when they reduce migration risk; flags require owner,
  safe default, expiry, and removal story.

### 7.4 Code Quality

- Keep modules cohesive and dependencies directional.
- Use explicit typed interfaces at runtime, queue, storage, model, and tool
  boundaries.
- Validate all external input before domain use.
- Keep business calculations deterministic and independently testable.
- Separate domain errors from safe user-facing errors.
- Prefer standard-library and existing dependencies; justify every new package.
- Remove dead paths introduced by the same work packet once migration is
  complete; do not perform unrelated cleanup.
- Document non-obvious invariants and failure semantics, not obvious syntax.

### 7.5 Schema and State Changes

- Every persisted schema and event has an explicit version.
- Use expand/migrate/contract changes compatible with mixed application versions.
- Test forward and rollback behavior with representative stored workflows.
- Never rewrite immutable evidence, approval, effect, or audit history.
- Data repair is a versioned, reviewed, auditable operation with dry-run and
  reconciliation output.
- Workflow definitions are immutable; active runs remain pinned unless an
  explicit migration is approved and tested.

### 7.6 Error and Recovery Design

Every operation classifies failures as validation, authorization, transient,
capacity, deterministic defect, ambiguous effect, or terminal dependency error.

- Retry only classified transient failures within one propagated deadline.
- Do not nest unbounded retry policies.
- Governed writes require stable idempotency and effect registration.
- An ambiguous external effect stops for reconciliation.
- User-visible state includes safe reason and next action.
- Operators receive correlation and runbook references, not sensitive payloads.

## 8. AI Engineering Governance

### 8.1 Model Use

- One approved primary model route and deterministic fallback for Production
  Candidate v1.
- Model/provider/version, prompt-template version/hash, token budget, deadline,
  output schema, and fallback reason are recorded.
- Structured outputs are validated before domain use.
- Models cannot approve actions, assign authority, reveal credentials, or commit
  state directly.
- Provider failure never changes deterministic numeric results.

### 8.2 Prompt and Context Changes

Prompts and context policies are versioned production artifacts. A change must
include:

- Purpose and affected task.
- Input/output schema and context budget.
- Evidence/provenance rules.
- Injection/exfiltration considerations.
- Golden fixtures and quality/fallback evaluation.
- Token/latency/cost comparison.
- Rollback version.

Raw chain-of-thought is never required, stored, logged, or displayed. Governed
decision trajectories record evidence, versions, actions, validation, and
outcomes instead.

### 8.3 Tool Changes

Each tool operation requires a typed schema, risk class, allowed identities,
tenant/resource scope, credential boundary, idempotency behavior, timeout/retry
policy, egress allowlist, audit fields, test adapter, and approval rule.

Unknown tools, unknown fields, model-generated endpoints, or unapproved writes
are rejected.

### 8.4 AI Evaluation

Required AI evaluations cover:

- Structured-output validity.
- Numeric-score invariance.
- Evidence/provenance coverage.
- Deterministic fallback equivalence for supported outcomes.
- Provider timeout, quota, malformed response, and outage.
- Prompt injection and attempted tool-authority escalation.
- Token, latency, and cost budgets.
- No false claim of model/tool execution.

## 9. Security and Data Governance

### 9.1 Secure Development Baseline

- Threat model each new trust boundary, data class, provider, and tool.
- Use managed OIDC, workload identity, secrets, and keys.
- Enforce least privilege and deny by default.
- Separate human, workload, approver, operator, and break-glass authority.
- Scan source, dependencies, artifacts, and infrastructure definitions.
- Generate and retain build provenance and an SBOM.
- Patch Critical vulnerabilities before release; High vulnerabilities require
  Security approval, mitigation, owner, and expiry and cannot affect a P0/P1
  control.

### 9.2 Data Handling

- Classify before ingesting or sharing data.
- Minimize model/tool context and telemetry.
- Store payloads in governed artifact storage; use references elsewhere.
- Encrypt in transit and at rest.
- Define retention, deletion, residency, backup, and legal-hold behavior.
- Use synthetic data in development, tests, demos, and lower environments.
- Never place secrets, credentials, private keys, personal data, or unrestricted
  enterprise content in source control.

### 9.3 Security Review Gates

Security review is required before:

- Introducing identity, authorization, approval, or audit behavior.
- Enabling a provider, tool, network destination, data class, or production
  write.
- Changing tenant partitioning, encryption, secrets, retention, or immutable
  export.
- Accepting a security-test exception.

## 10. Reliability and SRE Governance

### 10.1 Service Objectives

The candidate shall use approved SLIs/SLOs for user-visible availability,
workflow command acceptance, state freshness, queue age, approval age, audit
export, and recovery. External provider latency and availability are measured
separately from internal platform overhead.

### 10.2 Reliability Requirements

- No acknowledged transition is lost.
- No logical effect executes twice.
- No governed action bypasses authorization or approval.
- Process/browser loss does not cancel durable work.
- Restore and reconciliation meet approved RTO/RPO.
- Backpressure protects downstream services and tenant fairness.
- Degradation is visible to users and operators.

### 10.3 Operational Readiness

Before Production Candidate labeling, the service must have:

- Named owner and escalation path.
- SLO dashboard and actionable alerts.
- Service-degradation, workflow-backlog, ambiguous-effect, and database-restore
  runbooks.
- Tested backup/restore and rollback.
- Candidate capacity, quota, and cost limits.
- Incident roles and completed game day.
- Known limitations and dependency status communication.

### 10.4 Error Budget

Material error-budget burn stops nonessential releases. Product scope may be
reduced to restore reliability; trust, state-correctness, recovery, and audit
controls may not be relaxed to recover delivery velocity.

## 11. Observability Governance

- Use OpenTelemetry-compatible traces, metrics, and structured logs.
- Propagate tenant-safe workflow, run, task, model, tool, evidence, approval,
  correlation, causation, trace, service, version, environment, and region fields.
- Keep high-cardinality identifiers out of unrestricted metric labels.
- Never sample away security, approval, ambiguous-effect, failure, or high-risk
  traces.
- Redact/tokenize sensitive values at source.
- Audit access to sensitive diagnostics.
- Validate telemetry schemas and end-to-end trace continuity in CI/integration
  tests.

## 12. Test and Evaluation Governance

### 12.1 Required Test Layers

| Layer | Minimum scope |
|---|---|
| Unit | Calculations, state transitions, validation, policy, confidence |
| Contract | Commands, queries, queues, events, model/tool schemas, adapters |
| Persistence | Migrations, concurrency, outbox, checkpoints, tenant constraints |
| Integration | Managed-service adapters and deterministic local substitutes |
| Security | Tenant isolation, authorization, approval bypass, injection, secrets, egress |
| Reliability | Duplicate delivery, retry, worker loss, ambiguity, restore, reconciliation |
| AI | Structured output, provenance, numeric invariance, fallback, provider failure |
| Browser | Guided Journey, Mission Control, HQ, multi-case, reset, console |
| Accessibility | Keyboard, focus, semantics, contrast checks, reduced motion |
| Responsive | Approved desktop, tablet, and mobile viewport behavior |
| Performance | Candidate and 2x planned-pilot envelopes, soak, backpressure |
| Release | Clean build, scans, migration compatibility, deploy, rollback |

### 12.2 Evaluation Rules

- Every story maps to acceptance criteria and a BDD/evaluation reference.
- Test fixtures use synthetic data and fixed seeds where applicable.
- Flaky tests are defects; quarantine requires owner, reason, expiry, and
  compensating gate.
- Expected failures must be explicit and assert the intended failure mode.
- A test is not evidence if it does not fail when the protected behavior is
  deliberately broken.
- Manual testing supplements but does not replace automatable critical controls.
- Evaluation results, commands, environment, versions, and artifacts are retained
  in the release evidence package.

### 12.3 Regression Baseline

No packet may weaken existing coverage for scoring, 6R, prioritization,
replanning, workflow, AI Agency, Mission Control, Guided Journey, multi-case,
validation, executive roadmap, accessibility, responsive behavior, deterministic
fallback, reset, and clean browser console.

## 13. Review and Approval Model

### 13.1 Minimum Review

| Change | Required approval |
|---|---|
| Product behavior or acceptance criteria | Product Owner and Quality Engineering |
| State model, interface, event, or dependency direction | Product Architecture and Runtime Engineering |
| Identity, tenant, policy, approval, secrets, content defense, audit | Security Engineering |
| Enterprise DNA, evidence, classification, retention | Data/Enterprise DNA and Security Engineering |
| Queue, retry, recovery, SLO, alert, runbook, capacity | SRE/Operations and Runtime Engineering |
| Build, dependency, infrastructure, deployment, rollback | Release Engineering and Security Engineering |
| Deferred/removed ARB capability or architecture exception | Architecture Review Board |

The author cannot be the sole approver of a high-risk change.

### 13.2 Review Evidence

Reviewers require:

- Clear scope and linked requirement/story.
- Design/state/failure explanation proportional to risk.
- Focused diff without unrelated user changes.
- Commands and complete test results.
- Security/data/reliability impact.
- Migration and rollback behavior.
- Known limitations and follow-up ownership.

## 14. Release Engineering Baseline

- Reproducible build from a clean checkout.
- Same immutable artifact promoted through environments.
- Automated required tests, scans, schema checks, and policy gates.
- Signed artifact/provenance and retained SBOM.
- Infrastructure/configuration reviewed as code.
- Secrets resolved at runtime from managed service.
- Database changes use expand/migrate/contract and are rollback-aware.
- Workflow definitions, prompts, model routes, tool schemas, policies, and feature
  flags are versioned independently and included in release evidence.
- Rollback is exercised against durable in-flight workflows before candidate
  approval.

## 15. Environments

| Environment | Data | Purpose | External effects |
|---|---|---|---|
| Local | Synthetic | Deterministic development and unit/contract tests | Disabled or fake adapters |
| Test/CI | Synthetic | Automated integration, security, migration, browser tests | Isolated test services only |
| Staging | Synthetic representative scale | Release, fault, load, restore, runbook exercises | Allowlisted non-production targets |
| Production Candidate | Approved bounded dataset; synthetic by default | Candidate evidence and authorized evaluation | Explicitly allowlisted and approval-gated |

Production customer data requires a Controlled Pilot decision and is not
authorized solely by this baseline.

## 16. Definition of Ready

A story is Ready only when:

- Its epic, wave, owner, priority, story points, and dependencies are known.
- Governing PRS, backlog ID, acceptance criteria, BDD, evaluation, security, and
  regression references are linked.
- Current repository behavior and files in scope are understood.
- State owner, tenant boundary, data classification, failure semantics, and
  rollback are defined.
- Managed-service and local deterministic behavior are clear.
- Required reviewers and evidence are identified.
- No unresolved P0 dependency remains.
- The story is 8 points or fewer; larger work is decomposed.

## 17. Definition of Done

A story is Done only when:

- Approved behavior is implemented without unauthorized scope.
- Code, schemas, migrations, configuration, infrastructure, and documentation are
  reviewed by required owners.
- Acceptance criteria and BDD scenarios pass.
- Required unit, contract, persistence, integration, security, reliability, AI,
  browser, accessibility, responsive, performance, and release tests pass as
  applicable.
- Tenant and correlation identifiers propagate correctly.
- Failure, retry, timeout, recovery, and rollback behavior is verified.
- Required artifacts and evidence are stored and attributable.
- No secret or unrestricted enterprise content appears in source or telemetry.
- Existing product happy path and deterministic fallback remain operational.
- Operational dashboards/runbooks and release evidence are updated.
- Known limitations, risks, and follow-up ownership are recorded.

A wave is Done only when all of its blocking evaluations pass. Production
Candidate v1 is Done only after the ARB records a Go decision.

## 18. Pull Request and Commit Rules

- One cohesive work packet per pull request wherever practical.
- Title and description reference PRS, backlog story, and evaluation.
- Commit messages describe intent, not file mechanics.
- Generated/vendor artifacts are excluded unless required and reviewed.
- No unrelated formatting or cleanup.
- No force-push or history rewrite to shared release branches without explicit
  release-owner approval.
- Protected branches require passing gates and independent review.
- Emergency changes follow the same audit and retrospective requirements, with
  expedited rather than omitted review.

## 19. Evidence and Completion Report

Each packet creates or updates a completion report containing:

- Requirement, story, BDD, and evaluation references.
- Files changed.
- Commands run.
- Tests and evaluations run with complete results.
- Acceptance criteria met.
- Security, data, reliability, and operational evidence.
- Migration and rollback verification.
- Known issues and residual risks.
- Demo or validation steps.
- Commit and release artifact identifiers when applicable.

Evidence must be reproducible from a clean checkout and must not contain secrets,
personal data, private enterprise data, or local absolute paths in user-facing
documentation.

## 20. Exception Process

An exception request must include:

1. Exact control and reason.
2. Customer/business impact if not granted.
3. Security, data, reliability, operational, and product impact.
4. Alternatives considered and why scope reduction is insufficient.
5. Compensating controls.
6. Owner, expiry, and removal plan.
7. Required approval.

The delivery team cannot approve its own exception. No exception may permit
cross-tenant exposure, fabricated execution/completion, lost acknowledged state,
unapproved high-risk action, exposed secrets, or deletion/modification of audit
and evidence history.

## 21. Governance Metrics

Track only metrics that drive a decision:

- Required-test and evaluation pass rate.
- Escaped critical-path regressions.
- Change failure and rollback rate.
- Mean time to detect, acknowledge, mitigate, and recover.
- SLO/error-budget consumption.
- Queue age, retries, dead letters, and reconciliation age.
- Security findings by severity and remediation age.
- Restore success and achieved RTO/RPO.
- Cost per workflow/outcome and budget exceptions.
- Feature-flag and exception age.
- Percentage of stories entering implementation without full Definition of Ready
  (target: zero).

Metrics must not reward output volume, model calls, story-point completion, or
autonomy at the expense of quality, safety, or customer outcomes.

## 22. Governance Ownership

| Role | Accountability |
|---|---|
| Product Owner | Product intent, acceptance, scope, user-visible truth |
| Principal Engineering Manager | Staffing, delivery controls, ownership, escalation |
| Product Architecture | Boundaries, state ownership, ADRs, architectural fitness |
| Runtime Engineering | Workflow correctness, persistence, adapters, recovery |
| Security Engineering | Threat model, identity, tenancy, policy, approval, audit |
| Data/Enterprise DNA | Enterprise fact authority, evidence, classification, retention |
| SRE/Operations | SLOs, telemetry, incidents, capacity, backup/restore |
| Release Engineering | Build, supply chain, infrastructure, deployment, rollback |
| Quality Engineering | Test strategy, BDD/evaluation evidence, regression gates |
| Technical Program Manager | Dependency, wave, risk, decision, and gate tracking |
| Architecture Review Board | Scope exceptions and Production Candidate go/no-go |

## 23. Adoption Sequence

1. Review this baseline against the Product Constitution and ARB decision.
2. Resolve conflicts and name accountable owners.
3. Obtain approval from the roles listed below.
4. Mark `PCV1-GOV-001` complete with the approved commit reference.
5. Apply Definition of Ready to every Wave 1 story.
6. Configure required repository/review/release gates.
7. Begin implementation only after all Wave 0 blockers are closed.
8. Review baseline effectiveness at every wave exit.

## 24. Approval

| Role | Decision | Name | Date |
|---|---|---|---|
| Product Owner | Pending |  |  |
| Principal Engineering Manager | Pending |  |  |
| Product Architecture | Pending |  |  |
| Runtime Engineering | Pending |  |  |
| Security Engineering | Pending |  |  |
| Data/Enterprise DNA | Pending |  |  |
| SRE/Operations | Pending |  |  |
| Release Engineering | Pending |  |  |
| Quality Engineering | Pending |  |  |
| Technical Program Manager | Pending |  |  |

Until approval is recorded, this document is a proposal and Wave 1 remains
blocked.

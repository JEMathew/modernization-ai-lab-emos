# Architecture Review Board Decision — Production Candidate v1

## Decision Record

| Field | Decision |
|---|---|
| Review body | Modernization AI Lab Enterprise Architecture Review Board |
| Review scope | Enterprise Runtime Foundation and minimum Production Candidate v1 architecture |
| Decision | **Architecture approved with conditions** |
| Implementation authorization | **Conditional approval for Production Candidate v1 only** |
| Controlled pilot authorization | Not yet approved; requires the exit gates in this decision |
| Enterprise production authorization | Not approved |
| General availability authorization | Not approved |

## Executive Decision

The Enterprise Runtime Foundation is a credible future-state direction. It correctly separates product intelligence, runtime execution, trust, and operations; keeps Enterprise DNA authoritative; and treats the Journey as orchestration rather than enterprise truth.

The complete target architecture is **not** approved as the implementation scope for Production Candidate v1. Building every documented component now would create more distributed state, operational surface, security boundaries, and maintenance obligations than the current product and customer evidence justify.

The ARB freezes Production Candidate v1 as a deliberately bounded architecture:

1. Preserve the current product, Guided Journey, Mission Control, Enterprise DNA, and deterministic fallback.
2. Use one modular Python application boundary and one separately runnable worker, not a microservice estate.
3. Add durable workflow state to a managed relational database using the existing state machine as the canonical journey definition.
4. Use managed queue, object storage, identity, secrets/key management, backups, and telemetry services.
5. Enforce tenant scope, authorization, evidence provenance, approval, idempotency, and audit within the modular runtime.
6. Permit only predefined, typed, allowlisted model and tool operations. Arbitrary code execution and broad production writes are outside scope.
7. Operate in one region across managed failure zones with tested backup and restore. Multi-region operation is deferred.
8. Support a small, explicitly bounded controlled-pilot workload; do not claim general enterprise scale.

This is the smallest architecture the ARB considers a credible enterprise production candidate.

## Architecture Scores

| Architecture | Score | ARB interpretation |
|---|---:|---|
| Current implemented production architecture | **3/10** | Strong demonstrator, but durable execution, enterprise identity/control, audit integrity, and operations are not yet production-proven. |
| Documented future architecture | **8/10** | Sound principles and extensible boundaries, but too many independently operable capabilities if implemented immediately. |
| Frozen Production Candidate v1 scope | **8/10 for intended pilot boundary** | Credible if all mandatory controls and verification gates below are met; intentionally insufficient for general availability. |

Scores assess production fitness, not product value or demo quality.

## Conditions of Approval

Implementation may begin only after these architecture prerequisites are accepted:

1. **State ownership contract:** one owner each for Enterprise DNA facts, case state, workflow state, evidence, approval, and audit.
2. **Tenant contract:** `tenant_id` is mandatory in every persisted record, queue message, cache key, artifact path, and authorization decision.
3. **Workflow contract:** legal transitions, terminal states, retries, pause/resume, cancellation, and checkpoint boundaries are versioned and tested.
4. **Risk boundary:** Production Candidate v1 tools are enumerated; all arbitrary execution, unapproved connectors, and unrestricted production writes are prohibited.
5. **Identity and authorization contract:** managed identity provider, roles, tenant claims, administrative separation, and approval roles are defined.
6. **Data contract:** classifications, retention, deletion, residency assumptions, provider exposure, and synthetic/test-data rules are approved.
7. **Reliability contract:** idempotency keys, retry limits, timeouts, dead-letter handling, reconciliation, backup, restore, RTO, and RPO are measurable.
8. **Operational contract:** named owner, deployment process, SLOs, alerts, runbooks, incident roles, and rollback path exist before pilot traffic.
9. **Compatibility contract:** existing Guided Journey behavior is captured by regression tests before runtime extraction begins.
10. **Managed-service decision:** selected services meet portability, encryption, isolation, availability, audit, backup, and cost requirements.

Missing governance documents must not be assumed to exist. The repository currently evidences the Product Constitution and Runtime Foundation; the authoritative Engineering Constitution and Development Playbook must be located, approved, or created through a separate governance action before implementation standards are claimed.

## Production Candidate v1 Scope

### Smallest Viable Runtime Platform

```text
Existing Product UI
        |
Modular Python Runtime
  - command/query boundary
  - existing journey state machine
  - authorization and policy module
  - evidence/approval/audit module
  - model/tool adapter module
        |
Managed relational database + managed queue + managed object storage
        |
One bounded worker pool
        |
Allowlisted model provider and allowlisted read-oriented tools
```

The application and worker may be separate processes or deployment units, but they remain one codebase and one owning team. There is no internal network of runtime microservices in Production Candidate v1.

### Smallest Viable Trust Platform

- Managed OIDC identity provider with MFA capability.
- Application-enforced tenant isolation and small role model.
- Managed secrets and key management.
- Versioned authorization rules in the runtime; no separate policy service.
- Durable approval record bound to the exact action and evidence hash.
- Append-only audit records in the transactional store, exported to managed immutable log/object retention.
- Evidence provenance, integrity hashes, data classification, and provider-sharing controls.
- Schema validation, prompt/content boundary labeling, output validation, tool allowlist, and egress restrictions.
- Managed container/process isolation; no custom sandbox platform.

### Smallest Viable Operations Platform

- Managed single-region, multi-zone hosting.
- Managed relational database, queue, object storage, backups, and restore tooling.
- One CI/CD workflow with build provenance, automated gates, controlled promotion, and rollback.
- Managed logs, metrics, traces, dashboards, and alerts using OpenTelemetry-compatible instrumentation.
- Four initial runbooks: service degradation, workflow backlog, ambiguous tool effect, and database restore.
- Basic provider/cloud budgets and cost attribution; no custom FinOps platform.
- Named service owner and on-call escalation for the controlled pilot.

## Capability Disposition Summary

### Capabilities Included

- Durable workflow state and checkpoints.
- One queue-backed worker path.
- Bounded retries, timeouts, idempotency, dead-letter handling, and reconciliation.
- Managed relational persistence and versioned artifact storage.
- Tenant isolation, federated identity, basic RBAC, and versioned policy rules.
- Evidence provenance and action-bound human approval.
- Append-only audit with managed immutable export.
- Governed model and tool adapters with deterministic fallback.
- Baseline content defense and runtime restriction.
- Single-region, multi-zone availability with backup/restore.
- OpenTelemetry-compatible telemetry, minimal SLOs, alerts, and runbooks.
- CI/CD, rollback, dependency/security scanning, and release evidence.
- Basic quotas, concurrency limits, performance budgets, and cost controls.

### Capabilities Deferred

- Independent workflow-engine product selection unless the database-backed approach fails the recovery proof.
- Standalone model gateway, tool gateway, context service, evidence service, approval service, and policy service.
- Graph database or graph processing platform.
- Multi-region failover or active/active operation.
- Dedicated tenant infrastructure and tiered isolation products.
- Advanced memory compaction, reusable semantic memory, and cross-workflow learning.
- Broad connector marketplace, agent marketplace, and arbitrary tool onboarding.
- Automated compensation for unrestricted production writes.
- Advanced capacity forecasting, showback/chargeback, and cost optimization.
- Full service catalog, internal developer platform, and service mesh.

### Capabilities Removed from Production Candidate v1

- Kubernetes requirement.
- Service mesh.
- Custom workflow orchestration platform.
- Custom policy language or policy engine.
- Custom identity provider, secret store, telemetry backend, queue, database, or object store.
- Autonomous production remediation.
- Self-modifying agents, prompts, policies, or workflow definitions.
- Arbitrary code/repository execution.
- Active/active multi-region writes.
- Claims of unlimited enterprise scale or broad production engineering for arbitrary uploads.

### Capabilities Merged

| Separate future components | Production Candidate v1 merge |
|---|---|
| Workflow control API, scheduler, checkpoint service | Runtime orchestration module plus managed queue |
| Context service, memory service, evidence metadata | Evidence and context module using relational metadata and object storage |
| Model gateway and routing service | Model adapter module with one primary route and deterministic fallback |
| Tool gateway, effect registry, reconciliation service | Tool adapter module with transactional effect records |
| Authorization service, policy decision point, policy administration | Versioned authorization/policy module |
| Approval service and risk gate | Approval module in the Trust boundary |
| Audit service and AI trajectory store | Shared append-only audit/trajectory schema with managed immutable export |
| Capacity service, quota service, cost controller | Runtime limits plus managed provider/cloud budgets |
| Release controller and platform portal | CI/CD pipeline plus managed hosting controls |
| Service catalog and ownership registry | Version-controlled service manifest and runbooks |

## Component Decisions

The allowed decisions are **BUILD NOW**, **BUILD LATER**, **USE MANAGED SERVICE**, **MERGE**, and **REMOVE**. Priority `P0` is a prerequisite, `P1` is required for Production Candidate v1, `P2` is controlled-pilot hardening, and `P3` requires demonstrated enterprise demand.

### Runtime

| Component | Decision | Reason | Principal risk | Priority | Implementation phase |
|---|---|---|---|---:|---|
| State ownership and runtime contracts | BUILD NOW | Prevents duplicate truth and incompatible migration | Ambiguous ownership corrupts cases and evidence | P0 | Pre-implementation |
| Existing journey state machine | BUILD NOW | Reuse validated behavior as canonical workflow | Extraction could regress the Guided Journey | P0 | Pre-implementation / PC v1 |
| Durable workflow persistence | BUILD NOW | Required for restart, pause, resume, and recovery | Partial transitions or lost acknowledgements | P1 | PC v1 |
| Workflow control API, scheduler, checkpoint service | MERGE | One orchestration module is sufficient at pilot scale | Module boundaries may erode | P1 | PC v1 |
| Managed task queue | USE MANAGED SERVICE | Avoids custom delivery, durability, and HA engineering | Vendor semantics and lock-in | P1 | PC v1 |
| Worker pool | BUILD NOW | Separates long work from web sessions | Lease and retry defects | P1 | PC v1 |
| Custom workflow engine | REMOVE | Existing state machine plus durable queue is adequate initially | Later migration may be required | P3 | Reassess after pilot load |
| Agent runtime | MERGE | Specialists can run as typed worker tasks | Poor isolation if contracts are weak | P1 | PC v1 |
| Model gateway | MERGE | One adapter module and fallback meet initial need | Provider behavior may leak into callers | P1 | PC v1 |
| Multi-provider dynamic router | BUILD LATER | One primary provider plus fallback is enough | Provider outage reduces capability | P2 | Controlled Pilot |
| Tool gateway and effect registry | MERGE | Small allowlisted tool set does not justify a service | Ambiguous side effects | P1 | PC v1 |
| Arbitrary tool/connector platform | REMOVE | Expands threat and support surface without customer evidence | Future connectors need governance path | P3 | Enterprise Production |
| Context, memory, and evidence services | MERGE | Shared module and stores preserve boundaries cheaply | Accidental promotion of model output to fact | P1 | PC v1 |
| Long-term semantic agent memory | BUILD LATER | Not required for a bounded journey | Context quality may plateau | P3 | Enterprise Production |
| Enterprise DNA relational core and snapshots | BUILD NOW | Authoritative, reproducible enterprise context is foundational | Snapshot freshness and stewardship | P1 | PC v1 |
| Graph database | REMOVE | Relational edges and bounded queries suffice initially | Complex traversal may miss future SLOs | P3 | Only after measured need |

### Trust, Security, and Runtime Protection

| Component | Decision | Reason | Principal risk | Priority | Implementation phase |
|---|---|---|---|---:|---|
| Federated human identity | USE MANAGED SERVICE | Identity and MFA should not be custom-built | IdP dependency and claim mapping | P0 | PC v1 |
| Workload identity | USE MANAGED SERVICE | Eliminates shared long-lived service credentials | Platform configuration errors | P1 | PC v1 |
| Tenant isolation | BUILD NOW | Non-negotiable enterprise security boundary | Cross-tenant disclosure | P0 | Pre-implementation / PC v1 |
| RBAC and contextual authorization | BUILD NOW | Small role set plus tenant/risk attributes is sufficient | Rules may spread through code | P0 | PC v1 |
| Standalone policy service and custom policy language | REMOVE | Operationally excessive for initial policy set | Later extraction cost | P3 | Enterprise Production if complexity demands |
| Policy administration UI | BUILD LATER | Version-controlled review is sufficient initially | Slower policy changes | P3 | Enterprise Production |
| Human approval enforcement | BUILD NOW | High-risk decisions require accountable authorization | UI-only approval could be bypassed | P0 | PC v1 |
| Evidence service and confidence controls | MERGE | Keep provenance, hashes, and calculated confidence in one module | Evidence integrity defects | P1 | PC v1 |
| Append-only audit ledger | MERGE | Transactional append-only records plus immutable managed export suffice | Database administrators retain influence before export | P1 | PC v1 |
| Immutable audit retention | USE MANAGED SERVICE | Durability and retention are infrastructure concerns | Misconfigured retention | P1 | PC v1 |
| Secrets and encryption keys | USE MANAGED SERVICE | Custom secret/key systems are unjustified and unsafe | Provider dependency | P0 | PC v1 |
| Prompt-injection/content defense baseline | BUILD NOW | Enterprise content is untrusted even with a small tool set | False negatives or excessive blocking | P1 | PC v1 |
| Advanced content-defense platform | BUILD LATER | Multi-classifier orchestration is premature | Emerging attacks may require faster upgrade | P2 | Controlled Pilot |
| Typed tool schemas and allowlist | BUILD NOW | Bounds model authority and validates actions | Missing schema edge cases | P0 | PC v1 |
| Custom runtime sandbox | REMOVE | Arbitrary execution is prohibited; use managed process isolation | Future code execution needs redesign | P3 | Only with approved engineering use case |
| Network egress and resource restrictions | USE MANAGED SERVICE | Hosting controls provide sufficient initial containment | Cloud policy misconfiguration | P1 | PC v1 |
| DLP and enterprise SIEM integration | BUILD LATER | Baseline minimization/redaction comes first | Some regulated pilots may require earlier delivery | P2 | Controlled Pilot by customer requirement |

### Reliability and Availability

| Component | Decision | Reason | Principal risk | Priority | Implementation phase |
|---|---|---|---|---:|---|
| Idempotency, bounded retry, timeout, and dead letter | BUILD NOW | At-least-once delivery requires correctness controls | Duplicate or stuck work | P0 | PC v1 |
| Checkpoint recovery and session recovery | BUILD NOW | Required to survive process/browser loss | Stale or incompatible checkpoints | P1 | PC v1 |
| Circuit breakers and concurrency bulkheads | MERGE | Implement in adapters/worker limits, not as services | Retry storms | P1 | PC v1 |
| Automated compensation platform | BUILD LATER | Initial tools are read-oriented or approval-gated | Manual recovery for an allowed write | P2 | Controlled Pilot |
| Managed multi-zone database/queue/storage | USE MANAGED SERVICE | Credible availability without custom clustering | Regional dependency | P1 | PC v1 |
| Backup, restore, and reconciliation | BUILD NOW | Backups are meaningless without tested recovery | Unrecoverable or inconsistent state | P0 | PC v1 |
| Warm regional standby | BUILD LATER | Cost exceeds initial pilot need | Regional outage exceeds target RTO | P3 | Enterprise Production |
| Active/active multi-region | REMOVE | Conflict semantics and cost are unjustified | Cannot promise continuous regional availability | P3 | Reassess for GA contracts |
| 99.9% candidate SLO | BUILD NOW | Provides a measurable operating target | Target may be missed before tuning | P1 | PC v1 |
| Multiple availability tiers | BUILD LATER | One bounded service tier is enough | Cannot meet varied enterprise contracts | P3 | Enterprise Production |

### Scalability and Performance

| Component | Decision | Reason | Principal risk | Priority | Implementation phase |
|---|---|---|---|---:|---|
| Explicit pilot capacity envelope | BUILD NOW | Honest limits are safer than untested scale claims | Poorly chosen limits restrict pilots | P0 | Pre-implementation |
| Tenant quotas and concurrency limits | BUILD NOW | Prevents accidental overload and cost runaway | Static limits require tuning | P1 | PC v1 |
| Managed worker autoscaling | USE MANAGED SERVICE | Handles bounded peaks with low platform burden | Queue-driven scaling lag | P2 | Controlled Pilot |
| Weighted fair scheduling | BUILD LATER | Few bounded tenants do not require sophisticated fairness | A large pilot tenant can dominate | P2 | Controlled Pilot |
| Dedicated tenant shards/infrastructure | BUILD LATER | Required only for regulation or measured noisy-neighbor issues | Shared tier may exclude some customers | P3 | Enterprise Production |
| Performance budgets and trace decomposition | BUILD NOW | Prevents hidden platform overhead and context growth | External provider latency remains variable | P1 | PC v1 |
| Load and soak testing at candidate limits | BUILD NOW | Production claims need measured evidence | Synthetic load may miss real skew | P1 | PC v1 exit gate |
| Distributed caching platform | REMOVE | Versioned relational/object reads should be adequate initially | Read latency may rise | P2 | Add only after profiling |
| Advanced capacity forecasting | BUILD LATER | Managed metrics and simple forecasts suffice | Capacity surprises | P3 | Enterprise Production |

### Observability and Operations

| Component | Decision | Reason | Principal risk | Priority | Implementation phase |
|---|---|---|---|---:|---|
| OpenTelemetry instrumentation | BUILD NOW | Portable end-to-end correlation is essential | High-cardinality or sensitive telemetry | P1 | PC v1 |
| Telemetry backend | USE MANAGED SERVICE | Storage, querying, alerting, and retention are commodity services | Cost and vendor lock-in | P1 | PC v1 |
| Workflow/model/tool correlation IDs | BUILD NOW | Required for diagnosis and audit linkage | Missing propagation across queue boundaries | P0 | PC v1 |
| AI trajectory and audit records | MERGE | One governed record can serve operations and accountability | Overcollection of sensitive content | P1 | PC v1 |
| SLOs, alerts, dashboards, and four core runbooks | BUILD NOW | Minimum responsible operating model | Alert gaps during early pilot | P1 | PC v1 |
| Full service catalog platform | REMOVE | One codebase and team need a manifest, not a platform | Ownership data may become stale | P3 | Reassess with service count |
| Dedicated SRE platform | REMOVE | Managed services and product ownership are sufficient initially | Team must still staff on-call | P3 | Enterprise Production scale |
| Incident management process | BUILD NOW | Tools do not replace accountable response | Low incident maturity | P1 | PC v1 |
| AIOps recommendation capability | BUILD LATER | Useful only after reliable telemetry and incident history | Premature automation creates noise | P3 | Enterprise Production |
| Autonomous AIOps remediation | REMOVE | Risk exceeds evidence and need | Slower mitigation remains manual | P3 | Not before GA governance |

### FinOps, Release Engineering, and Platform Engineering

| Component | Decision | Reason | Principal risk | Priority | Implementation phase |
|---|---|---|---|---:|---|
| Provider token/tool usage measurement | BUILD NOW | Required for budgets and unit economics | Incomplete attribution | P1 | PC v1 |
| Cloud/provider budgets and anomaly alerts | USE MANAGED SERVICE | Commodity cost controls are adequate | Delayed or coarse alerts | P1 | PC v1 |
| Custom FinOps platform and chargeback | REMOVE | No scale or customer contract justifies it | Limited internal allocation detail | P3 | Enterprise Production |
| Reproducible build, scans, provenance, and rollback | BUILD NOW | Minimum software supply-chain and release control | Pipeline misconfiguration | P0 | PC v1 |
| CI/CD and managed deployment controls | USE MANAGED SERVICE | Avoids custom release infrastructure | Provider coupling | P1 | PC v1 |
| Canary or blue/green deployment | BUILD LATER | Simple rollback is sufficient for earliest bounded candidate | Larger blast radius per release | P2 | Controlled Pilot |
| Feature flags | MERGE | A small versioned configuration module is enough | Stale flags | P1 | PC v1 |
| Kubernetes and service mesh | REMOVE | No demonstrated scheduling or networking need | Later migration if scale changes | P3 | Only with evidence |
| Internal developer platform/portal | REMOVE | One product team does not need a platform product | Manual environment setup | P3 | Reassess with multiple teams/services |
| Infrastructure as code | BUILD NOW | Reproducibility and review are required | State/config drift | P1 | PC v1 |

## Architecture Simplifications

1. **From many services to modules:** retain logical boundaries in code and schemas, deploy only the UI/application and worker initially.
2. **From custom orchestration to durable state:** extend the existing state machine with relational checkpoints and a managed queue.
3. **From separate trust services to one trust boundary:** authorization, evidence, approval, policy, and audit remain distinct modules but share one transactional store and deployment.
4. **From gateway products to adapters:** model and tool governance is centralized in modules without introducing standalone network hops.
5. **From graph infrastructure to relational relationships:** Enterprise DNA uses indexed entities/edges and bounded traversal.
6. **From an operations platform to managed operations:** instrument once, export to managed telemetry, and maintain only essential dashboards, alerts, and runbooks.
7. **From autonomous operations to human-controlled operations:** AIOps and autonomous remediation are excluded.

## What Must Not Be Built Without Customer Evidence

- Multi-region active/active execution.
- Dedicated tenant topology as the default.
- Kubernetes, service mesh, or a custom internal developer platform.
- A custom workflow engine, policy language, identity service, secret store, telemetry store, or FinOps system.
- A graph database solely because Enterprise DNA contains relationships.
- Autonomous production engineering, self-modifying agents, or autonomous incident remediation.
- A marketplace for agents, tools, or connectors.
- Long-term cross-case semantic memory.
- Unlimited portfolio scale or unbounded dependency traversal.
- Multiple commercial availability/isolation tiers.

Each deferred capability requires a named customer requirement, measured constraint, security review, operational owner, cost model, and a new ADR before implementation.

## Release Stages

### Production Candidate v1

**Purpose:** Prove that the stable product journey can execute durably and safely in a production-shaped environment.

**Boundary:** Small number of authorized users and tenants; bounded portfolio size and concurrency; one region; managed multi-zone services; predefined model route; allowlisted read-oriented tools; deterministic fallback; human approval for every high-risk action.

**Exit evidence:** Regression-clean Guided Journey, tenant-isolation tests, restart/recovery tests, idempotency tests, approval-bypass tests, audit integrity, backup restore, candidate load test, dependency failure tests, accessibility tests, clean telemetry, and operational runbooks.

### Controlled Pilot

**Purpose:** Validate enterprise usage and operating assumptions with selected customers.

**Adds:** Managed autoscaling, fair scheduling, stronger content defense, optional DLP/SIEM integration, progressive deployment, compensation for specifically approved writes, expanded provider fallback, and pilot-specific isolation controls.

**Entry gate:** All Production Candidate v1 exit evidence passes; Product, Security, SRE, Data Governance, and accountable business owner approve the workload and data classes.

### Enterprise Production

**Purpose:** Support contracted enterprise workloads with measured scale and compliance needs.

**Potential additions:** Dedicated tenant tiers, warm regional standby, standalone policy or gateway services where complexity warrants, advanced capacity/FinOps, broader governed connectors, formal service catalog, and expanded on-call organization.

**Entry gate:** Controlled-pilot SLO, security, quality, cost, recovery, and customer-outcome evidence supports the contract. Deferred components require individual ADRs.

### General Availability

**Purpose:** Offer repeatable, supportable service to a broader market.

**Potential additions:** Only capabilities justified by pilot and enterprise-production evidence. Active/active regions, autonomous operations, graph infrastructure, and a platform/marketplace remain optional—not default maturity requirements.

**Entry gate:** Sustained SLO attainment, independent security assurance, repeatable onboarding, tested regional recovery, support readiness, cost viability, legal/compliance approval, and demonstrated customer outcomes.

## Production Candidate v1 Go/No-Go Gates

| Gate | Required result |
|---|---|
| Architecture | This decision and prerequisite contracts accepted |
| Product regression | Existing Guided Journey and Mission Control tests pass unchanged |
| State correctness | Workflow transition, pause/resume, retry, and recovery tests pass |
| Trust | Tenant isolation, authorization, approval, secrets, and injection controls pass |
| Data | Evidence provenance, retention, backup, restore, and deletion behavior verified |
| Reliability | No lost acknowledged transition or duplicate logical effect under fault tests |
| Operations | SLO telemetry, alerts, dashboards, owners, and runbooks exercised |
| Performance | Candidate limits meet approved latency and throughput budgets |
| Release | Reproducible deployment and rollback demonstrated |
| Scope | No deferred capability is represented as implemented or production-ready |

Failure of any P0 or P1 gate is a **No-Go**. Scope reduction is preferred over waiving a trust, state-correctness, or recovery control.

## Final ARB Ruling

**Architecture approved with conditions.**

The future architecture is retained as direction, not as a mandatory first implementation. Production Candidate v1 is frozen to the modular, managed-service-first architecture in this decision. Teams may implement only the included and merged capabilities required by the P0/P1 gates. Deferred or removed capabilities require new customer evidence and ARB review.

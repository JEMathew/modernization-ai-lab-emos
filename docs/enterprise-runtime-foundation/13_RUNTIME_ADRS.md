# Runtime Architecture Decision Records

All decisions are **Proposed** until reviewed and accepted. They describe a target architecture, not current implementation.

## ADR-001: Durable Workflow Orchestration

**Context:** Enterprise journeys span minutes to days, pause for humans and providers, and must survive process failure.

**Decision:** Store workflow state and checkpoints durably; execute bounded tasks through leased queues. Web sessions do not own workflow execution.

**Consequences:** Reliable pause/resume and recovery; additional orchestration and migration discipline.

**Alternatives:** In-memory/browser state was rejected for durability. A workflow engine product is not yet selected; build-versus-buy requires a proof of concept.

## ADR-002: Transactional State with Append-Only History, Not Universal Event Sourcing

**Context:** Correct current state, auditability, and integration events are required.

**Decision:** Use a relational transactional source of truth plus transactional outbox and append-only audit/event history.

**Consequences:** Simpler reads and recovery; historical reconstruction remains available where designed. Consumers must be idempotent.

**Alternatives:** Full event sourcing adds projection/version complexity without demonstrated need.

## ADR-003: Enterprise DNA Remains the Enterprise Fact Authority

**Context:** Journeys reason about enterprise facts but must not silently rewrite them.

**Decision:** Enterprise DNA owns governed enterprise entities and relationships. Workflows pin immutable DNA snapshots; validated findings are proposed back through stewardship.

**Consequences:** Reproducible decisions and clear ownership; snapshot and promotion workflows are required.

**Alternatives:** Making workflow memory authoritative would duplicate state and subordinate enterprise understanding to a journey.

## ADR-004: Governed Gateways for Models and Tools

**Context:** Providers and tools differ and must not receive implicit authority.

**Decision:** All model and tool calls pass through typed, policy-enforcing gateways with telemetry, quotas, versioning, and effect registration.

**Consequences:** Provider portability and centralized controls; gateway availability and scale become critical.

**Alternatives:** Direct calls from agents reduce latency slightly but fragment control and observability.

## ADR-005: Externalized Policy with Fail-Closed Mutations

**Context:** Authorization depends on identity, tenant, data, workflow stage, and risk.

**Decision:** Use centrally governed policy decisions enforced at API, context, model, tool, and approval boundaries. Governed mutations fail closed.

**Consequences:** Consistent controls; policy services need high availability and decision caching with revocation semantics.

**Alternatives:** Hard-coded role checks cannot express contextual control reliably.

## ADR-006: Approval Bound to Immutable Proposal and Evidence

**Context:** Approval of a human-readable label alone can be reused after inputs change.

**Decision:** Bind approval to action parameters, target, evidence manifest, relevant versions, and expiry using an integrity hash.

**Consequences:** Defensible authorization; material changes require reapproval.

**Alternatives:** Stage-level boolean approval is ambiguous and unsafe.

## ADR-007: OpenTelemetry as Observability Contract

**Context:** Runtime behavior spans asynchronous services, models, tools, and providers.

**Decision:** Adopt OpenTelemetry-compatible signals and semantic conventions extended with governed AI/workflow identifiers.

**Consequences:** Portable telemetry and end-to-end correlation; schema governance and cardinality controls are required.

**Alternatives:** Vendor-native instrumentation alone creates lock-in and inconsistent correlations.

## ADR-008: Modular Control Plane Before Microservice Proliferation

**Context:** Current product maturity does not justify many independently operated services.

**Decision:** Begin with a modular control API and isolated worker/gateway processes, enforcing internal module contracts. Extract services when scaling, isolation, ownership, or availability evidence requires it.

**Consequences:** Lower initial operational burden; discipline is needed to preserve boundaries.

**Alternatives:** Immediate microservices/Kubernetes increase delivery and failure complexity without measured benefit.

## ADR-009: Relational Enterprise DNA Core with Optional Graph Projection

**Context:** Enterprise relationships need navigation and future scale, but graph workload is not measured.

**Decision:** Store governed entities/edges in a relational model initially and build versioned read projections. Add a graph engine only after representative benchmarks prove necessity.

**Consequences:** Simple transactional governance; deep traversal may later require a specialized projection.

**Alternatives:** A graph database first introduces another critical data platform prematurely.

## ADR-010: Managed Multi-Zone Platform; Kubernetes Is Conditional

**Context:** The runtime needs resilient containers, queues, stores, and scaling while preserving a small engineering footprint.

**Decision:** Prefer managed container/serverless and managed data services with multi-zone support. Adopt Kubernetes only for demonstrated scheduling, portability, isolation, or platform-standard requirements.

**Consequences:** Faster operational maturity and less undifferentiated work; provider abstractions and exit plans remain necessary.

**Alternatives:** Self-managed orchestration is not justified for the first production increment.

## ADR-011: Tiered Tenant Isolation

**Context:** Tenants vary in regulation, scale, and cost tolerance.

**Decision:** Provide a shared logical-isolation tier with tenant-keyed data and fair scheduling, plus dedicated compute/data/key options for higher isolation.

**Consequences:** Efficient default economics and an upgrade path; isolation controls must be testable across both tiers.

**Alternatives:** One physical stack per tenant is costly; shared-only cannot satisfy all regulated workloads.

## ADR-012: At-Least-Once Delivery with Effectively-Once Side Effects

**Context:** Distributed queues cannot guarantee exactly-once end-to-end execution across external systems.

**Decision:** Accept at-least-once task delivery; enforce idempotency keys, effect registry, provider status reconciliation, and compensation.

**Consequences:** Honest failure semantics and recoverability; tool adapters require more rigorous contracts.

**Alternatives:** Claiming exactly once would hide ambiguous external outcomes.

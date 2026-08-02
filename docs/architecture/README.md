# Architecture Index

## Current implementation

The current product is a modular local Python application plus a standalone
browser prototype:

```text
Streamlit UI (app/main.py)
  -> shared workflow facade (engine/workflow.py)
  -> deterministic assessment, engineering, and agency modules
  -> local JSON, ZIP, and SQLite assessment evidence

Standalone Mission Control (prototype/mission-control/)
  -> vanilla JavaScript in-memory state and projections
  -> synthetic sample data
```

The two surfaces share product concepts but not a common deployed runtime or
durable state store. `engine.workflow` remains the sole current Python workflow
behavior owner. The browser prototype owns its own in-memory demonstration state.

## Approved target

The Production Candidate target is a modular Python application with a typed
command/query boundary, durable relational workflow state, a managed queue and
object store, and one bounded worker path. Managed identity, secrets, telemetry,
backups, and immutable retention replace custom platforms.

Authoritative sources:

1. [Product Constitution](../../design/00_PRODUCT_CONSTITUTION.md)
2. [Runtime Architecture](../enterprise-runtime-foundation/01_RUNTIME_ARCHITECTURE.md)
3. [Responsibility Matrix](../enterprise-runtime-foundation/04_RESPONSIBILITY_MATRIX.md)
4. [Architecture Review Board Decision](../enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md)
5. [Runtime Spine PRS](../enterprise-runtime-foundation/019_PRS_RUNTIME_SPINE.md)

The broader Runtime Architecture is a future-state reference. The ARB decision
narrows what may be built for Production Candidate v1.

## Invariants

- Enterprise DNA owns governed enterprise facts and relationships.
- Runtime owns durable workflow execution state once activated.
- The Journey orchestrates work; it is not enterprise truth.
- Product surfaces read authoritative state and do not create parallel owners.
- Python owns deterministic numeric decisions.
- Models explain or synthesize; they do not invent scores or approvals.
- High-risk actions require durable human approval.
- Provider-specific code stays behind adapters.
- Managed services are preferred to custom infrastructure.
- No runtime module is activated without an approved compatibility slice.

See [Architecture Compliance Baseline](../engineering/ARCHITECTURE_COMPLIANCE_BASELINE.md)
for current deviations and gaps.

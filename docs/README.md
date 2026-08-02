# EMOS Documentation Workspace

This directory is the navigation layer for the Modernization AI Lab engineering
workspace. It does not replace the governing documents or imply that proposed
architecture is implemented.

## Authority map

| Concern | Authoritative source | Current role |
|---|---|---|
| Product direction | [`design/00_PRODUCT_CONSTITUTION.md`](../design/00_PRODUCT_CONSTITUTION.md) | Governing product constitution |
| Production Candidate architecture | [`enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md`](enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md) | Frozen ARB scope and conditions |
| Engineering governance | [`enterprise-runtime-foundation/018_ENGINEERING_GOVERNANCE_BASELINE.md`](enterprise-runtime-foundation/018_ENGINEERING_GOVERNANCE_BASELINE.md) | Approved engineering rules for Production Candidate v1 |
| Runtime requirements | [`enterprise-runtime-foundation/019_PRS_RUNTIME_SPINE.md`](enterprise-runtime-foundation/019_PRS_RUNTIME_SPINE.md) | Runtime Spine contract |
| Runtime implementation plan | [`enterprise-runtime-foundation/020_RUNTIME_SPINE_IMPLEMENTATION_PLAN.md`](enterprise-runtime-foundation/020_RUNTIME_SPINE_IMPLEMENTATION_PLAN.md) | Approved slice sequence |
| Current-state evidence | [`production-readiness/CURRENT_PRODUCT_STATE.md`](production-readiness/CURRENT_PRODUCT_STATE.md) | Point-in-time assessment; verify against current Git state |

## Workspace map

- [`architecture/`](architecture/README.md): current and target architecture routing.
- [`runtime/`](runtime/README.md): Runtime Spine routing and activation boundary.
- [`engineering/`](engineering/README.md): operating model, standards, metrics, and packet template.
- [`adr/`](adr/README.md): architecture decision records and template.
- [`backlog/`](backlog/ENGINEERING_BACKLOG.md): program hierarchy and slice registry.
- [`roadmap/`](roadmap/ENGINEERING_ROADMAP.md): dependency-led delivery view.
- [`releases/`](releases/RELEASE_REGISTRY.md): release composition by slice.
- [`enterprise-runtime-foundation/`](enterprise-runtime-foundation/REVIEW_PACKAGE.md): approved and proposed Runtime Foundation source set.
- [`production-readiness/`](production-readiness/CURRENT_PRODUCT_STATE.md): repository assessments.

Completion evidence remains in the repository-root [`work_results/`](../work_results/)
directory. It is not duplicated under `docs/`.

## Document-state rule

Every document must identify whether it describes **current implementation**,
**approved target**, **proposed design**, **historical evidence**, or **planned
work**. Documentation never proves implementation by itself; source and tests do.

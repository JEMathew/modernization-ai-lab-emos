# Runtime Workspace

This directory routes runtime engineering to the existing Enterprise Runtime
Foundation. It deliberately contains no executable runtime implementation.

## Read in order

1. [ARB Decision](../enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md)
2. [Engineering Governance Baseline](../enterprise-runtime-foundation/018_ENGINEERING_GOVERNANCE_BASELINE.md)
3. [Runtime Spine PRS](../enterprise-runtime-foundation/019_PRS_RUNTIME_SPINE.md)
4. [Runtime Spine Implementation Plan](../enterprise-runtime-foundation/020_RUNTIME_SPINE_IMPLEMENTATION_PLAN.md)
5. [Vertical Slice Registry](../backlog/VERTICAL_SLICE_REGISTRY.md)

## Current activation boundary

- RS-01 characterizes existing behavior.
- RS-02 defines versioned contracts in `engine/runtime/contracts.py`.
- RS-03 typed configuration exists in the working tree and remains inactive.
- `engine.runtime` is not connected to `app/main.py`, `engine/workflow.py`, or
  `engine/agency.py`.
- `engine.workflow` remains the current Python workflow and state-transition owner.

The next runtime integration cannot begin merely because a type or configuration
exists. It requires an approved slice, a clean reproducible baseline, and the
regression gates in the implementation plan.

# Modernization AI Lab — Mission Control 0.8

Mission Control is a standalone visual and interaction prototype for exploring
the Modernization AI Lab as three connected environments:

1. Portfolio Command Center
2. Agent Decision Room
3. Codex Modernization Factory

Version 0.8 preserves the complete Mission Control, Modernization HQ, Living
Workspace, Shared Decision Room, propagation, and Engineering Workspace
journeys. It extends `DR-CIC-001` with an independent Validation Workspace.

After Assessment Ready, the user can start a deterministic specialist sequence:
Portfolio Intelligence hands off evidence, Architecture attaches its review,
Business Strategy attaches value findings, and Risk & Governance pauses the
case at Decision Pending. Pause and Resume preserve the exact stored stage and
finish the current transition before stopping. At Decision Pending, three
specialist positions attach to the case with evidence, assumptions, confidence,
and consequences. The Mission Commander can compare them, inspect a governed
challenge, reduce the conflict to one question, and choose any of three decision
gate paths. The primary path creates a Human Constraint and reaches Ready for
Replanning.

The Mission Commander can then watch that constraint update strategy,
architecture, timeline, cost, risk, waves, engineering controls, and governance
in a deterministic cause-and-effect sequence. Five revised work objects appear
progressively. Only the Customer Service Portal changes waves, while the
Customer Analytics Warehouse remains in Wave 1 and Finance Warehouse receives
a protected boundary. After revised-plan approval, the case ends at Engineering
Ready.

The Engineering Workspace first exposes a provider-neutral Engineering
Contract containing the approved Oracle-to-BigQuery strategy, Human Constraint,
protected dependency, controls, validation expectations, and governance action.
Generation starts only after an explicit click. Six mocked artifacts then
appear progressively with purpose, lineage, dependencies, governance condition,
validation status, preview, and next action. A separate package-assembly action
moves the case to Validation Ready with the Validation Specialist as owner.
The provider-neutral Validation Contract defines seven deterministic checks,
thresholds, authority, constraints, and governance prerequisites. An explicit
validation run preserves six passes and surfaces one intentional Aggregate
Equivalence failure caused by nested Oracle null-handling semantic drift. The
Modernization Engineer proposes a one-artifact correction and regression test;
Mission Commander approval is required before it is applied.

Only Null-Behaviour Equivalence, Aggregate Equivalence, and Representative-Query
Comparison rerun. The final report records seven of seven critical checks
passing, a 1.8% to 0.0% aggregate variance correction, High confidence, and a
Validated with Conditions package status. Version 0.8 does not create the
executive roadmap.

No recurring timer, continuous loop, backend, or live model call is used.

The persistent experience switch can move between Mission Control and HQ
without losing state. Reset Demo restores both experiences to the initial
Unverified portfolio. No movement starts before an explicit user action.

The prototype is isolated from the Streamlit application and does not call a
backend, API, or AI service. Its one-shot animations start only from explicit
user actions; it has no recurring timers or continuous state loops.

## Run

Open `index.html` directly in a modern browser, or serve this directory from the
repository root:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/prototype/mission-control/
```

No installation or build step is required.

## Files

- `index.html` — semantic interface structure and inline SVG symbols
- `styles.css` — responsive mission-control presentation and motion settings
- `script.js` — mocked products, agents, panels, navigation, and reset behavior

All enterprise names and operational details shown here are synthetic.

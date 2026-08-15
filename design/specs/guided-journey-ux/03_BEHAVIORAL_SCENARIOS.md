# Guided Journey Behavioral Scenarios

Each scenario preserves existing Journey state authority. “Inspection” means presentation-only, read-only access.

## S01 — Open the Guided Journey

**Requirements:** UX-GMJ-001, UX-STA-001, UX-ACC-002, UX-HLP-001
**Given** the launchpad is open and DR-CIC-001 is Unverified
**When** the user selects Run Guided Demo
**Then** the Journey Inspector opens in the responsive default mode, identifies Stage 1 of 9, focuses its heading, exposes Begin Portfolio Discovery as the only primary action, and shows the first-use collapse/exit hint once.

## S02 — Collapse and continue using Mission Control

**Requirements:** UX-GMJ-002, UX-NAV-001, UX-COG-002
**Given** the inspector is expanded at any live stage
**When** the user activates Collapse Journey
**Then** it becomes a compact rail, Journey state is unchanged, focus moves to Restore Journey, and Mission Control remains usable.

## S03 — Restore without state loss

**Requirements:** UX-GMJ-002, UX-GMJ-005, UX-ACC-002
**Given** the guide is compact at Stage 4 with Decision Pending
**When** the user activates Restore Journey
**Then** the expanded inspector shows the same case, stage, decision, owner, blocker, and next action and restores the previous inspector focus when possible.

## S04 — Return to Mission Control from any stage

**Requirements:** UX-NAV-001, UX-PER-001
**Given** the user is in HQ, Engineering, Validation, or Executive Roadmap
**When** Return to Mission Control is activated
**Then** Mission Control becomes visible, the active case is centered, and journey progress and inspector mode are preserved.

## S05 — Inspect a completed stage

**Requirements:** UX-NAV-002, UX-COG-001, UX-ACC-002
**Given** Portfolio Discovery is complete and the live journey is at Stage 5
**When** the user selects the completed Portfolio Discovery stage
**Then** a Read-Only Stage Review shows attached evidence and outcome, states that the live journey remains at Stage 5, and makes Return to Live Stage available.

## S06 — Attempt to navigate to a locked future stage

**Requirements:** UX-NAV-003, UX-STA-002
**Given** the journey is at Capability Formation
**When** the user selects Validation
**Then** progression does not change and the inspector explains that Engineering Package assembly is a prerequisite.

## S07 — Identify current stage

**Requirements:** UX-STA-001–003
**Given** the inspector is expanded or compact
**When** the user reviews the journey header
**Then** stage number, stage name, status, owner/processing state, and next action are visible in text.

## S08 — Identify next stage

**Requirements:** UX-STA-001, UX-NAV-003
**Given** the current stage is Architecture Review
**When** the user inspects progress
**Then** Business Review is identified as upcoming and its prerequisite is understandable.

## S09 — Identify completed with conditions

**Requirements:** UX-STA-002, UX-STA-004
**Given** a stage completed while a governance condition remains
**When** it appears in the stage tracker
**Then** it is labelled Completed with Conditions and the condition is available without relying on color.

## S10 — Pause and resume policy

**Requirements:** UX-GMJ-002, UX-STA-003
**Given** a deterministic transition is running
**When** the user collapses or exits the guide
**Then** the transition continues and status updates persist; no global Pause action is shown.
**And given** the user is in the existing Living Workspace paused state
**When** Resume Workspace is activated
**Then** only the existing workspace state resumes.

## S11 — Reach Decision Pending

**Requirements:** UX-STA-004, UX-AIX-002
**Given** Risk Review completes with the Finance reporting conflict
**When** the case reaches Decision Pending
**Then** the guide names Mission Commander as owner, identifies the conflict, and exposes the existing governed decision action.

## S12 — Reach Execution Ready with Conditions

**Requirements:** UX-END-001, UX-END-004
**Given** validation passes after the approved correction and Wave 1 is approved
**When** the journey reaches 100%
**Then** the completion summary states Execution Ready with Conditions and does not claim execution started or modernization completed.

## S13 — Complete the final stage

**Requirements:** UX-END-001–002, UX-ACC-003
**Given** the Executive Roadmap is prepared
**When** the Mission Commander approves Wave 1
**Then** the final status is announced once, the readiness summary receives focus appropriately, and Return to Mission Control is primary.

## S14 — Choose a next action after completion

**Requirements:** UX-END-002–003
**Given** the readiness summary is visible
**When** the user chooses Review Conditions, Inspect Decision Lineage, View Migration Starter Package, or Open Executive Roadmap
**Then** the existing destination opens without changing the approved journey state.

## S15 — Trigger validation failure

**Requirements:** UX-ERR-002, UX-ACC-003
**Given** the package is ready for independent validation
**When** the user runs the existing checks
**Then** the intentional Aggregate Equivalence failure is announced, Failed/Attention Required is shown, evidence remains visible, and Investigate Failure is the primary action.

## S16 — Correct and perform targeted rerun

**Requirements:** UX-ERR-002, UX-AIX-002–003
**Given** the correction proposal is evidence linked
**When** the Mission Commander approves it and runs impacted validation
**Then** only the three existing impacted checks rerun, What Changed identifies the governed correction, and the final seven-of-seven result remains unchanged.

## S17 — Reset the demo

**Requirements:** UX-NAV-004, UX-ERR-001, UX-GMJ-005
**Given** journey progress exists
**When** Full Reset is selected and confirmed
**Then** Journey state returns to the current V1.3 initial state, guide presentation returns to the responsive default, DR-CIC-001 is active, and Enterprise DNA remains read-only.
**When** confirmation is cancelled
**Then** no state or focus context is lost.

## S18 — Mobile 390×844

**Requirements:** UX-RSP-003–004, UX-ACC-004
**Given** the viewport is 390×844
**When** the guide is restored
**Then** a full-width sheet no taller than 88vh appears, header/action controls remain reachable, content scrolls internally, targets are at least 44×44 px, and compacting reveals the workspace.

## S19 — Keyboard-only journey

**Requirements:** UX-ACC-001–002, UX-NAV-006
**Given** no pointing device is used
**When** the user opens, progresses, collapses, restores, inspects completed stages, resolves the decision, corrects validation, and completes the journey
**Then** all actions are reachable in logical order, focus is visible, focus restoration is predictable, and no keyboard trap occurs.

## S20 — Reduced motion

**Requirements:** UX-ACC-005
**Given** `prefers-reduced-motion: reduce` is active
**When** the user performs the full journey
**Then** presentation transitions complete without meaningful motion and all work/status changes remain understandable.

## S21 — Exit and resume

**Requirements:** UX-GMJ-004–005
**Given** the journey is at Stage 6
**When** Exit Journey is selected
**Then** the guide hides, the toolbar offers Resume Guided Journey, and Stage 6 remains live.
**When** Resume is selected
**Then** the same state returns.

## S22 — Resize desktop dock

**Requirements:** UX-GMJ-003, UX-RSP-001, UX-ACC-002
**Given** a desktop viewport of at least 1200 px
**When** pointer or keyboard resizing is used
**Then** width remains between 320 and 520 px, the workspace reflows, and no document-level horizontal clipping occurs.

## S23 — Invalid stored width after orientation change

**Requirements:** UX-ERR-003, UX-RSP-002–004
**Given** a 500 px desktop dock preference exists
**When** the viewport changes to tablet portrait or mobile
**Then** the component adopts its responsive bounded size without changing Journey state.

## S24 — Escape key boundaries

**Requirements:** UX-ACC-002, UX-NAV-004
**Given** the expanded drawer/sheet has focus
**When** Escape is pressed
**Then** it collapses and does not exit, reset, or restart.
**Given** a reset confirmation is open
**When** Escape is pressed
**Then** confirmation closes and no state changes.

## S25 — Secondary case isolation

**Requirements:** UX-GMJ-005, UX-STA-004
**Given** DR-SQP-002 is selected while Guided Demo is active
**When** the guide renders
**Then** it states that the guided path is paused for the selected case and exposes Return to Customer Intelligence Case without copying or mutating either case state.

## S26 — Missing source workflow control

**Requirements:** UX-ERR-002, UX-STA-003
**Given** the current delegated source control cannot be found
**When** the guide renders
**Then** the primary action is disabled, a clear unavailable-control status is announced, and no duplicate action is created.

## S27 — Zoom and limited height

**Requirements:** UX-ACC-004, UX-RSP-004
**Given** the browser is zoomed to 200% or viewport height is 600 px
**When** the guide is expanded
**Then** header, status, primary action, collapse, and exit remain reachable through the inspector’s scroll region without horizontal document scrolling.

## S28 — Read-only review cannot mutate

**Requirements:** UX-NAV-002, UX-NAV-005
**Given** a completed decision stage is being reviewed
**When** the user activates evidence, rationale, or lineage links
**Then** only inspection content changes; approval records, current stage, generated artifacts, and validation results remain byte-for-byte equivalent.

## S29 — Destructive reset cancellation

**Requirements:** UX-ERR-001
**Given** Restart Guided Demo is selected at Stage 8
**When** confirmation is displayed and Cancel is chosen
**Then** Stage 8, correction proposal, active case, panel mode, and previous focus remain unchanged.

## S30 — Completion follow-on unavailable

**Requirements:** UX-END-003
**Given** a proposed follow-on capability has no real destination
**When** the completion summary is rendered
**Then** no dead or simulated action for that capability is displayed.

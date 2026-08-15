# Guided Journey Control and Orientation Capability Specification

## 1. Problem statement

The Guided Modernization Journey provides essential orientation and the single next action, but its current always-expanded sticky presentation consumes workspace, cannot be collapsed or resized, and does not distinguish safe navigation from state-changing actions. Completed stages are visible but not inspectable. Completion is accurate but does not yet provide a prioritized execution-readiness handoff.

## 2. Product objective

Enable the Mission Commander to keep the journey continuously understandable while retaining control of workspace, navigation, review, and completion—without changing the journey state machine or duplicating state.

## 3. User outcomes

- See the current stage, status, owner, blocker, and next action at all times.
- Collapse or exit the guide without losing journey progress.
- Restore the guide at the exact live state.
- Inspect completed stages without changing them.
- Understand why future stages are locked.
- Return to Mission Control from every stage.
- Distinguish presentation controls, navigation, approvals, and destructive reset actions.
- Understand that the final state is execution readiness, not completed modernization.

## 4. Scope

- Adaptive Guided Journey container.
- Collapse, restore, resize, and non-destructive exit.
- Compact journey rail.
- Read-only completed-stage inspection.
- Locked-stage explanation.
- Persistent live-stage summary and semantic status model.
- Completion summary and next actions.
- Focus, keyboard, touch, reduced-motion, and responsive contracts.
- Contextual help and explainability enhancements using existing data.

## 5. Non-goals

- Changing journey stages, order, transitions, actions, timings, or outcomes.
- Adding a second workflow engine, case selector, or state authority.
- Editing completed stages or reopening approved decisions.
- Changing Enterprise DNA or enabling DNA writes.
- Implementing global workflow pause, undoing approvals, arbitrary stage jumps, drag-and-drop panels, chat, live AI inference, or autonomous actions.
- Replacing Mission Control, HQ, or the Guided Demo storyline.

## 6. Architectural invariants

1. Existing Journey state remains authoritative for progression, tasks, blockers, assignments, approvals, artifacts, validation, and execution checkpoints.
2. Presentation state for open/collapsed/closed, width, and inspected stage MUST remain separate from Journey state.
3. Enterprise DNA remains read-only context and MUST NOT acquire journey progression fields.
4. A read-only stage inspection MUST NOT call reset, replay, advance, approval, generation, validation, or propagation functions.
5. Existing single-primary-action delegation to the real workflow control MUST remain intact.
6. Full Reset retains its current journey reset semantics and additionally resets only the guide’s presentation preferences to defaults.
7. Existing DR-CIC-001, DR-SQP-002, validation failure/correction, program governance, and Wave 1 outcomes MUST remain unchanged.

## 7. Requirements

### Guided Journey panel

#### UX-GMJ-001 — Adaptive Docked Journey Inspector

- **Problem:** The current sticky panel obscures and outgrows workspace content.
- **Requirement:** The product MUST present the guide as one Adaptive Docked Journey Inspector that participates in desktop layout and adapts to a bounded drawer/sheet on smaller screens.
- **Rationale:** Users need simultaneous instruction and enterprise context.
- **Priority:** Must.
- **Personas:** All.
- **Dependencies:** Existing guide render data; responsive layout.
- **Acceptance:** Meets the size, reflow, semantics, and viewport criteria in `02_INTERACTION_MODEL.md` and `04_ACCEPTANCE_CRITERIA.md`.
- **Responsive:** Desktop dock; tablet drawer; mobile sheet plus compact rail.
- **Keyboard/accessibility:** Complementary region with labelled header; no focus trap when docked.
- **Non-goals:** Modal or new workflow workspace.
- **Heuristic:** User control, minimalist design.
- **Validation:** Browser geometry, DOM semantics, keyboard and responsive tests.

#### UX-GMJ-002 — Collapse and Restore

The user MUST be able to collapse the inspector to a compact rail and restore it without changing Journey state. The compact rail MUST show stage number/name, semantic status, next eligible action or processing state, and an accessible Restore control. Collapse MUST remain available during deterministic processing.

#### UX-GMJ-003 — Bounded Resize

On desktop, the user SHOULD be able to resize the dock between 320 and 520 CSS px using pointer or keyboard. Resize MUST change presentation only, MUST preserve content reflow, and MUST NOT be offered on tablet/mobile where bounded responsive sizes apply.

#### UX-GMJ-004 — Exit Without Reset

The user MUST be able to choose **Exit Journey** to hide the inspector while retaining Journey state. The toolbar entry MUST change to **Resume Guided Journey**. Exit MUST NOT invoke Full Reset, Reset Current Stage, or Restart Guided Demo.

#### UX-GMJ-005 — Presentation-State Boundary

Open/collapsed/closed mode, desktop width, and inspected stage MAY persist for the browser session. They MUST NOT be stored in Enterprise DNA, case state, program state, approval records, or generated artifacts.

#### UX-GMJ-006 — Predictable Placement

The inspector MUST NOT be draggable or freely movable. Predictable docking is required for enterprise layout, keyboard use, responsive adaptation, and reduced cognitive load.

### Navigation and user control

#### UX-NAV-001 — Return to Mission Control

A visible **Return to Mission Control** action MUST be available from every live journey stage and completion state. It MUST preserve progress and active case selection.

#### UX-NAV-002 — Inspect Completed Stage

Completed stage entries MUST be focusable and selectable for read-only inspection. Inspection MUST show the stage summary, decisions, evidence, outputs, and conditions already present in current state and MUST NOT mutate state.

#### UX-NAV-003 — Explain Locked Future Stage

Future stages MUST remain visible but unavailable. Selecting or focusing a locked stage MUST expose the prerequisite and current blocking condition without moving the Journey.

#### UX-NAV-004 — Separate Destructive Actions

Restart Guided Demo, Reset Current Stage/Case, and Full Reset MUST be visually and semantically separated from navigation and primary workflow actions. Their scope and consequence MUST be stated before confirmation.

#### UX-NAV-005 — No Ambiguous Back Mutation

The immediate release MUST NOT add a generic Back action that rewinds Journey state. Read-only stage inspection and Return to Live Stage provide orientation without hidden mutation.

#### UX-NAV-006 — Efficient Keyboard Access

The inspector SHOULD support a documented shortcut to collapse/restore when focus is within the product. The shortcut MUST avoid browser/assistive-technology conflicts and MUST have an equivalent visible control.

### Status and orientation

#### UX-STA-001 — Persistent Progress Model

The live stage, semantic status, progress position, and next eligible action MUST remain visible in expanded and compact modes. Expanded mode MUST show all nine stages; compact mode MUST show current stage plus previous/next context.

#### UX-STA-002 — Controlled Status Vocabulary

The presentation MUST use the controlled statuses: Not Started, Available, Current, In Progress, Completed, Completed with Conditions, Attention Required, Failed, Blocked, Decision Pending, and Execution Ready with Conditions. Each status MUST have text, not color alone.

#### UX-STA-003 — Processing Versus Waiting

When deterministic work is running, the inspector MUST state what is processing and disable the primary action. When user action is required, it MUST name the decision or action and current owner.

#### UX-STA-004 — Conditions and Attention

Blocked, failed, decision-pending, and completed-with-conditions states MUST surface the blocking/remaining condition adjacent to the status and announce meaningful changes politely.

### End of journey

#### UX-END-001 — Execution Readiness Summary

At 100%, the inspector MUST replace routine stage detail with a concise **Execution Ready with Conditions** summary containing decisions made, validated package status, generated artifacts, approved Wave 1, expected outcomes, remaining conditions, accountable owner, and evidence lineage.

#### UX-END-002 — Completion Actions

The primary completion action MUST be **Return to Mission Control**. Secondary actions MUST be **Review Conditions**, **Inspect Decision Lineage**, **View Migration Starter Package**, and **Open Executive Roadmap**, where the existing destination is available.

#### UX-END-003 — Optional Follow-on Actions

Download, executive presentation generation, scenario comparison, continuous monitoring, and Start Another Initiative MAY be offered only when corresponding real capability exists. They MUST NOT be dead-end or simulated controls.

#### UX-END-004 — Precise Completion Language

The UI MUST distinguish Assessment Completed, Decision Approved, Plan Generated, Validation Passed, Execution Ready with Conditions, Execution Started, and Modernization Completed. V1.3 MUST NOT claim execution started or modernization completed.

### Discoverability and hierarchy

#### UX-DIS-001 — Obvious Container Controls

Collapse, Restore, Exit Journey, Return to Mission Control, and overflow controls MUST be visible text-labelled controls on first use; icon-only variants require accessible names and persistent tooltips.

#### UX-DIS-002 — Contextual Product Concepts

Mission Control, HQ, Living Workspace, Enterprise DNA, and Enterprise Intelligence MUST retain their strategic names. First-use supporting descriptions SHOULD explain their role without permanent instructional clutter.

#### UX-DIS-003 — Clickable Affordances

Completed stages, rationale controls, evidence citations, and work-object links MUST look interactive and expose hover, focus, active, disabled, and selected states.

#### UX-COG-001 — Three-Level Disclosure

The guide MUST organize information as: (1) executive summary, (2) operational detail, and (3) evidence/technical depth. Only level 1 and the primary action are mandatory in compact mode.

#### UX-COG-002 — One Primary Action

The guide MUST continue to present exactly one current primary workflow action. Navigation, inspection, collapse, and exit MUST use secondary styling and MUST NOT invoke duplicate workflow controls.

#### UX-COG-003 — Contextual Relevance

Presenter cues, detailed enterprise hierarchy, evidence lists, and technical metadata SHOULD be collapsed by default and revealed only when relevant or requested.

### AI experience and personas

#### UX-AIX-001 — Explain Recommendation

The UI SHOULD expose **Why This Recommendation?** using existing Enterprise Intelligence conclusion, method, evidence references, assumptions, alternatives, confidence provenance, and review condition. It MUST identify deterministic reasoning accurately.

#### UX-AIX-002 — Human Approval Boundary

System-generated recommendations and user-approved decisions MUST be visually and semantically distinct. The UI MUST name the Mission Commander action required for consequential decisions.

#### UX-AIX-003 — What Changed

After decision, correction, or propagation events, the guide SHOULD provide a concise “What Changed” summary derived from current deterministic state and linked evidence.

#### UX-PER-001 — Shared Persona Summary

The same live summary MUST answer what matters, owner, evidence, required decision, consequence, and next step for all enterprise personas. Persona-specific depth MAY be provided through progressive disclosure, not separate products.

### Accessibility, responsive, errors, and help

#### UX-ACC-001 — Semantic Container and Controls

The inspector MUST be a labelled complementary region when docked and a labelled non-modal drawer/sheet when overlaid. Toggle controls MUST expose `aria-expanded` and `aria-controls`; the active stage MUST expose `aria-current="step"`.

#### UX-ACC-002 — Keyboard and Focus

Every control and completed stage MUST be keyboard operable. Opening/restoring MUST focus the inspector heading or previously focused inspector control; collapse/exit MUST restore focus to the invoking control. Focus MUST remain visible.

#### UX-ACC-003 — Announcements

Stage, processing, failure, blocker, correction, and completion changes MUST be announced through targeted status regions without re-announcing the entire inspector.

#### UX-ACC-004 — Readability and Targets

Text MUST remain readable at 200% zoom, controls MUST meet a 44×44 CSS px target where touch applies, and information MUST not rely on color, position, or animation alone.

#### UX-ACC-005 — Reduced Motion

Collapse, restore, resize, stage inspection, and completion MUST work with no meaningful animation when reduced motion is requested.

#### UX-RSP-001 — Desktop Split View

At 1200 CSS px and above, the inspector MUST dock without document-level horizontal overflow and the workspace MUST reflow rather than sit behind it.

#### UX-RSP-002 — Tablet Drawer

From 768–1199 CSS px, the inspector MUST use a bounded non-modal drawer or compact rail. It MUST not reduce the primary workspace below a usable width.

#### UX-RSP-003 — Mobile Sheet

Below 768 CSS px, expanded mode MUST use a full-width sheet bounded to the viewport with its own scroll region; compact mode MUST leave the current workspace and its core action reachable.

#### UX-RSP-004 — Limited Height

At heights down to 600 CSS px, the inspector header, current status, primary action, and collapse/exit controls MUST remain reachable without document-level horizontal scrolling.

#### UX-ERR-001 — Confirm Destructive Reset

Restart and reset actions MUST require confirmation that names the state being cleared. Cancel MUST preserve state and return focus to the initiating control.

#### UX-ERR-002 — Preserve Failure Context

Validation failure and correction states MUST retain failed-check evidence, current owner, proposed correction, approval boundary, and targeted rerun scope while the guide is collapsed, exited, or inspected.

#### UX-ERR-003 — Recover Presentation State

If a stored panel width or mode is invalid for the current viewport, the UI MUST recover to the responsive default without changing Journey state.

#### UX-HLP-001 — First-Use Hint

On first open only, the inspector SHOULD state that it can be collapsed and that exiting preserves progress. The hint MUST be dismissible and not recur during the session.

#### UX-HLP-002 — Status and Term Definitions

The product SHOULD provide concise definitions for HQ, Enterprise DNA, Enterprise Intelligence, Decision Pending, and Execution Ready with Conditions at point of need.

#### UX-HLP-003 — Optional Presenter Guidance

Presenter cues MAY remain available in an optional disclosure and MUST NOT occupy persistent level-1 space.

### Requirement metadata and cross-reference contract

For every requirement above, detailed acceptance criteria are normative in `04_ACCEPTANCE_CRITERIA.md`; responsive, keyboard, and accessibility expectations are normative in `02_INTERACTION_MODEL.md` and `05_ACCESSIBILITY_SPEC.md`. The table below completes the per-requirement rationale/priority/persona/dependency/non-goal/heuristic/validation contract.

| ID | Rationale / problem addressed | Priority | Personas | Dependencies | Responsive / keyboard / accessibility | Non-goal | Heuristic | Validation |
|---|---|---:|---|---|---|---|---|---|
| UX-GMJ-001 | Preserve workspace context | Must | All | Shell layout | Adaptive modes; labelled non-modal region | New workspace | Control, minimalist design | Geometry + DOM |
| UX-GMJ-002 | Reclaim space without state loss | Must | All | Presentation state | Focused toggle; compact at all viewports | Pause workflow | Control/freedom | State equality |
| UX-GMJ-003 | Support varied enterprise displays | Should | CTO, architect, consultant | Desktop dock | Keyboard separator; desktop only | Free movement | Flexibility | Resize matrix |
| UX-GMJ-004 | Make exit meaning explicit | Must | All | Toolbar entry | Focus restores to Resume | Reset | Control/freedom | Exit/resume test |
| UX-GMJ-005 | Prevent duplicate authority | Must | Engineering, architecture | Separate state module | Session-only; no workflow fields | Persistent Journey copy | Consistency/error prevention | Allowed-key test |
| UX-GMJ-006 | Preserve predictable placement | Must | All | Dock model | No drag keyboard/touch burden | Movable window | Consistency | Absence review |
| UX-NAV-001 | Restore enterprise overview | Must | All | Existing experience switch | Keyboard-visible at every mode | Reset/rewind | Recognition/control | Nine-stage test |
| UX-NAV-002 | Replace recall with inspection | Must | All | Read-only projections | Focusable stages and review heading | Editing/replay | Recognition | Mutation guard |
| UX-NAV-003 | Explain eligibility | Must | All | Stage prerequisite map | Focusable explanation; text status | Premature action | Error prevention | Negative test |
| UX-NAV-004 | Prevent accidental data loss | Must | Mission Commander | Confirmation pattern | Modal confirmation semantics | Redefine reset | Error prevention | Cancel/confirm test |
| UX-NAV-005 | Avoid ambiguous rewind | Must | All | Explicit navigation | No generic Back control | State reversal | Match/control | Static absence |
| UX-NAV-006 | Improve presenter efficiency | Should | Consultant, frequent users | Conflict review | Visible equivalent required | Shortcut-only access | Flexibility | Keyboard matrix |
| UX-STA-001 | Maintain orientation | Must | All | Journey projections | Compact and expanded text status | Second progress model | Status visibility | DOM snapshots |
| UX-STA-002 | Standardize meaning | Must | All | Status mapping | Text plus color/icon | Change workflow states | Consistency | Fixture matrix |
| UX-STA-003 | Distinguish system/user wait | Must | All | Existing descriptors | Targeted announcement; disabled action | Fake activity | Status visibility | Transition tests |
| UX-STA-004 | Keep conditions prominent | Must | Executive, risk, engineering | Existing blocker/condition | Text adjacent; polite announcement | Invent conditions | Error recognition | State captures |
| UX-END-001 | Provide credible handoff | Must | CIO, CTO, transformation | Existing outputs | Focus once; responsive summary | Claim execution | Match/status | Completion test |
| UX-END-002 | Give clear next steps | Must | All | Existing destinations | Keyboard actions; stacked mobile | Dead controls | Control/help | Destination tests |
| UX-END-003 | Avoid speculative promises | Must | Executives | Real capability check | Hide unavailable actions | Simulated capability | Error prevention/trust | Absence scan |
| UX-END-004 | Protect semantic precision | Must | All | Approved terminology | Screen-reader copy identical | Rename stages | Match/consistency | Prohibited-copy scan |
| UX-DIS-001 | Expose container control | Must | First-time users | Header controls | Visible labels/tooltip/names | Icon-only ambiguity | Recognition | Name-role-value |
| UX-DIS-002 | Explain strategic concepts | Should | Executive, consultant | Approved copy | Point-of-need descriptions | Rename product pillars | Help/match | Content review |
| UX-DIS-003 | Clarify affordances | Must | All | Interaction styling | Hover/focus/selected/disabled | Permanent hints | Consistency | Visual states |
| UX-COG-001 | Reduce simultaneous density | Must | All | Disclosure structure | Logical heading/order at all widths | Hide essential status | Minimalist design | DOM order review |
| UX-COG-002 | Prevent duplicate execution | Must | Mission Commander | Existing delegation | One accessible primary action | Second handler | Error prevention | Static + flow test |
| UX-COG-003 | Defer nonessential detail | Should | Executives, presenters | Disclosure controls | Keyboard disclosures | Remove evidence | Minimalist design | Default-state test |
| UX-AIX-001 | Make recommendation traceable | Should | Executive, architect, risk | Existing EI finding | Accessible disclosure/citations | Live AI claim | Match/help | Projection fixture |
| UX-AIX-002 | Preserve human accountability | Must | Mission Commander, risk | Existing approval state | Clear labels/announcements | Autonomous approval | Error prevention/match | Decision snapshots |
| UX-AIX-003 | Explain consequence | Should | All | Existing state deltas | Concise responsive summary | Generated narrative invention | Status/help | Deterministic fixtures |
| UX-PER-001 | Serve roles without fragmentation | Must | Eight reviewed personas | Shared summary | Same semantic content all modes | Separate persona products | Match/minimalism | Persona checklist |
| UX-ACC-001 | Expose correct semantics | Must | Assistive-tech users | Final container DOM | Complementary/non-modal; expanded state | Modal dock | Consistency | Automated/manual a11y |
| UX-ACC-002 | Ensure full keyboard control | Must | Keyboard users | Focus manager | Full key/focus contract | Pointer-only behavior | Flexibility | Keyboard journey |
| UX-ACC-003 | Communicate dynamic state | Must | Screen-reader users | Targeted status regions | No whole-panel announcement | Fake progress speech | Status visibility | Announcement transcript |
| UX-ACC-004 | Maintain readable/reachable UI | Must | Low-vision/touch users | Responsive CSS | 200% reflow; 44 px targets | Shrink-to-fit | Accessibility/minimalism | Geometry/zoom |
| UX-ACC-005 | Preserve meaning without motion | Must | Motion-sensitive users | Media query | Immediate equivalent updates | Remove workflow information | Flexibility | Reduced-motion flow |
| UX-RSP-001 | Use desktop space responsibly | Must | Desktop users | Split-view dock | ≥1200; no horizontal overflow | Overlay workspace | Minimalist design | 1440×900 browser |
| UX-RSP-002 | Protect tablet workspace | Must | Tablet users | Drawer/rail | 1024×768 and 768×1024 | Compressed desktop | Flexibility | Exact viewport |
| UX-RSP-003 | Make mobile usable | Must | Mobile/touch users | Sheet/rail | 390×844; internal scroll | Full-page takeover | Flexibility | Exact viewport |
| UX-RSP-004 | Support limited height | Must | Laptop/zoom users | Sticky header/action | 600 px height boundary | Document clipping | Control | Boundary geometry |
| UX-ERR-001 | Guard destructive reset | Must | All | Confirmation dialog | Escape/cancel/focus restore | Change reset semantics | Error prevention | State/focus equality |
| UX-ERR-002 | Retain diagnostic context | Must | Engineering, risk | Existing validation state | Compact failure summary/announcement | New validation logic | Recovery | Failure regression |
| UX-ERR-003 | Recover invalid preferences | Must | All | Responsive normalizer | Safe fallback/no focus loss | Reset Journey | Error recovery | Preference fixtures |
| UX-HLP-001 | Teach control once | Should | First-time users | Session preference | Dismissible/focusable | Permanent onboarding | Help | Session test |
| UX-HLP-002 | Clarify formal terms | Should | Executives, consultants | Approved glossary | Point-of-need accessible descriptions | Rename strategic concepts | Help/match | Copy review |
| UX-HLP-003 | Support presenters quietly | May | Consultants/presenters | Existing cue text | Closed disclosure; keyboard operable | Permanent clutter | Help/minimalism | Disclosure test |

## 8. Success criteria

- From every stage, users can identify current stage, owner, status, blocker/condition, and next action without relying on memory.
- The guide never permanently obscures the workspace and can be collapsed/restored without state loss.
- Completed stages are inspectable without mutation; future stages explain why they are locked.
- Navigation and destructive actions are visually and behaviorally distinct.
- Completion accurately communicates execution readiness and offers a clear return path.
- Keyboard-only and reduced-motion users can complete the full guided journey.
- Existing Journey outcomes, state, resets, validation, artifacts, and Enterprise DNA boundaries remain unchanged.

## 9. Risks

- A presentation selector could accidentally call existing reset/replay functions; tests must prohibit this.
- A desktop dock could cause workspace compression; enforce min/max widths and reflow tests.
- A mobile drawer could become modal by accident; semantics and focus behavior must match the non-modal contract.
- Read-only inspection could be mistaken for editing; label it and keep the live-stage return visible.
- Persisted presentation preferences could become duplicate workflow state; restrict and schema-test the boundary.

## 10. Open questions

1. Should desktop resizing ship in the first release or follow collapse/restore after usability validation?
2. Should Exit Journey be a direct control or an overflow item once Collapse is prominent?
3. Is a keyboard shortcut desired for Build Week, and which combination passes platform conflict review?
4. Which existing artifact views qualify for **View Migration Starter Package** at completion?
5. Should read-only completed-stage inspection update the underlying workspace view or remain entirely inside the inspector? The recommendation is inspector-only for the first release.

## 11. Decision log

| Decision | Status | Rationale |
|---|---|---|
| Use Adaptive Docked Journey Inspector | Recommended | Preserves workspace context and supports compact mode without a new workflow |
| Do not use modal | Decided | The guide must coexist with Mission Control |
| Do not allow free movement | Decided | Predictability, accessibility, and responsive behavior outweigh flexibility |
| Completed stages are read-only | Recommended | Recognition without state mutation |
| No generic Back | Recommended | Back is ambiguous in a governed state machine |
| No global Pause | Recommended | Existing transitions are explicit and bounded; collapse/exit provides presentation control |
| Completion primary action is Return to Mission Control | Recommended | Restores enterprise context and avoids implying execution began |

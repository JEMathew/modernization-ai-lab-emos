# Guided Journey UX Test Plan

## 1. Test strategy

Validation combines unit contracts, DOM interactions, exact-viewport browser execution, keyboard and accessibility checks, complete Journey regression, negative mutation tests, console inspection, and manual enterprise UX review. Tests must verify presentation improvements without weakening existing V1.3 assertions.

## 2. Unit and contract tests

| Test | Requirements | Expected assertion |
|---|---|---|
| Presentation-state allowed keys | UX-GMJ-005 | Only mode, width, inspected stage, focus token, and first-use hint preference exist |
| Responsive mode normalization | UX-RSP-001–004, UX-ERR-003 | Invalid width/mode maps to viewport default; Journey snapshot unchanged |
| Status mapping fixtures | UX-STA-002–004 | Every Journey state maps to one controlled text status |
| Completed-stage eligibility | UX-NAV-002–003 | Completed/current/future classifications are deterministic |
| Read-only projection | UX-NAV-002, UX-AIX-001 | Review data derives from existing state and DNA projections without mutation methods |
| What Changed fixtures | UX-AIX-003 | Decision, propagation, and correction summaries are deterministic |
| Completion copy contract | UX-END-001–004 | Required fields exist; prohibited execution/completion claims absent |
| Destructive action scopes | UX-NAV-004, UX-ERR-001 | Reset confirmation describes correct state scope |
| One primary action | UX-COG-002 | Exactly one guide primary action and one delegated handler |

## 3. DOM interaction tests

| Test | Requirements | Steps/evidence |
|---|---|---|
| Open → Collapse → Restore | UX-GMJ-001–002 | Assert attributes, visibility, focus, and state equality |
| Exit → Resume | UX-GMJ-004–005 | Assert closed UI and exact live-state restoration |
| Completed-stage review | UX-NAV-002 | Assert read-only label and deep-equal Journey state |
| Locked-stage activation | UX-NAV-003 | Assert prerequisite text and unchanged stage |
| Return to Mission Control | UX-NAV-001 | Exercise from all nine stages |
| Reset confirmation cancel/confirm | UX-ERR-001 | Assert cancel equality and confirmed reset semantics |
| Disclosure defaults | UX-COG-001–003, UX-HLP-003 | Executive level open; evidence/presenter level closed |
| Resume label | UX-GMJ-004, UX-DIS-001 | Toolbar reads Resume Guided Journey after exit |
| Active stage semantics | UX-ACC-001 | One and only one `aria-current=step` |
| Targeted live regions | UX-ACC-003 | No whole-panel live-region churn |

## 4. Full Journey regression

Run the existing 22 explicit actions from Full Reset:

1. Begin Portfolio Discovery.
2. Continue to Assessment.
3. Inspect Customer Intelligence Capability.
4. Assess as One Initiative.
5. Continue to Decision Room.
6. Start Workspace Flow.
7. Assemble Decision Positions.
8. Resolve Decision.
9. Approve six-month finance protection.
10. Propagate Constraint.
11. Approve Revised Plan.
12. Continue to Engineering Workspace.
13. Generate Migration Starter Package.
14. Assemble Package.
15. Continue to Validation Workspace.
16. Run Independent Validation.
17. Investigate Failure.
18. Approve Correction and Rerun.
19. Rerun Impacted Validation.
20. Continue to Executive Workspace.
21. Prepare Executive Roadmap.
22. Approve Wave 1.

**Requirements:** UX-COG-002, UX-STA-001–004, UX-END-001–004, UX-ERR-002.
**Pass:** final state remains Execution Ready with Conditions; six artifacts, intentional failure, approved correction, three-check rerun, seven passing checks, and Wave 1 approval remain intact.

Repeat the flow with:

- Inspector expanded.
- Inspector compact where actions are available.
- Exit/resume at Stages 4, 7, and 8.
- Reduced motion.
- Keyboard only.

## 5. Secondary case and program governance

| Test | Requirements | Expected |
|---|---|---|
| Select DR-SQP-002 | UX-GMJ-005, UX-STA-004 | Guided path states it is paused for this case |
| Run supplier reviews | Architectural invariant | Stops at Decision Pending |
| Return to DR-CIC-001 | UX-NAV-001 | Primary Journey state remains unchanged |
| Program constraint propagation | Architectural invariant | Direct/indirect impacts remain selective |
| Reset current case | UX-ERR-001 | Other case and program decision preserved per existing behavior |
| Full Reset | UX-GMJ-005 | Both case/program and presentation defaults reset according to existing contract |

## 6. Responsive browser matrix

Use a deterministic browser runtime and report requested and actual dimensions.

| Viewport | Expected model | Required checks |
|---|---|---|
| 1440×900 | Docked split view | 320–520 width, resize, no document overflow, workspace controls reachable |
| 1024×768 | Tablet drawer/compact rail | Drawer ≤52vw, compact mode usable, Mission Control reachable |
| 768×1024 | Portrait drawer/sheet | Internal scroll, vertical stages, no desktop separator |
| 390×844 | Mobile sheet/compact rail | ≤88vh, 44 px targets, sticky header/action, no horizontal clipping |
| 1280×600 | Limited-height desktop | Header/action/collapse/exit reachable; internal scroll |
| 320×568 effective | Zoom/reflow boundary | One-column content; no lost controls |

At every viewport:

- Open Guided Demo.
- Identify current/next stage.
- Collapse and restore.
- Return to Mission Control and HQ.
- Start discovery.
- Inspect one completed and one locked stage.
- Trigger/capture a blocked or validation state using deterministic step setup.
- Exit/resume.
- Full Reset.
- Capture console warnings/errors.

**Requirements:** UX-RSP-001–004, UX-ACC-004, UX-ERR-003.

## 7. Keyboard tests

- Tab through toolbar and inspector in logical order (`UX-ACC-002`).
- Activate every visible control with Enter and Space (`UX-ACC-002`).
- Navigate stages with arrows/Home/End (`UX-NAV-002–003`).
- Resize with arrow, Shift+Arrow, Home, and End (`UX-GMJ-003`).
- Escape collapses sheet, exits review, and cancels confirmation without reset (`UX-ACC-002`, UX-ERR-001).
- Focus restoration passes for collapse, restore, exit, review, locked explanation, and reset (`UX-ACC-002`).
- Complete the 22-action journey without pointer (`UX-COG-002`).

Record active element and accessible name after each transition.

## 8. Accessibility tests

- Automated semantic scan at every major workspace and error/completion state (`UX-ACC-001–004`).
- Role/name/value assertions for all inspector controls (`UX-DIS-001`, UX-ACC-001).
- Live-region transcript for stage, work, blocker, failure, correction, rerun, and completion (`UX-ACC-003`).
- Contrast audit for statuses, focus, text, and resize separator (`UX-ACC-004`).
- Touch-target geometry at tablet/mobile (`UX-ACC-004`).
- 200% zoom and text spacing review (`UX-ACC-004`).
- VoiceOver/Safari smoke test; Chromium screen-reader smoke test where available (`UX-ACC-001–003`).

## 9. Reduced-motion tests

Emulate `prefers-reduced-motion: reduce` and verify:

- Collapse/restore is immediate.
- No scrolling animation is required for orientation.
- Stage and status changes are still visible.
- Full deterministic Journey reaches identical state.
- Failure, correction, rerun, and completion are understandable.
- No recurring animation/timer is introduced.

**Requirements:** UX-ACC-005.

## 10. Console and performance checks

- Capture errors and warnings from page load through Full Reset.
- Assert no missing delegated workflow control in valid states.
- Assert no duplicate IDs or listeners.
- Resize/collapse MUST not trigger continuous state loops or recurring timers.
- Presentation updates SHOULD remain below a perceptible interaction threshold in the static prototype.

**Requirements:** UX-COG-002, UX-ERR-002–003.

## 11. Reset synchronization tests

- Reset Current Stage rebuilds the current deterministic stage and retains guide presentation unless the confirmation contract specifies otherwise.
- Restart Guided Demo returns to Stage 1 and responsive presentation default after confirmation.
- Full Reset restores DR-CIC-001, Unverified, zero artifacts, validation Not Run, roadmap Not Prepared, and guide default.
- Mission Control/HQ, Program Intelligence, Enterprise Context, and active case remain synchronized.
- Enterprise DNA remains loaded and read-only.

**Requirements:** UX-GMJ-005, UX-NAV-004, UX-ERR-001.

## 12. Manual enterprise persona review

For CIO, CTO, Architect, Transformation Lead, Product Manager, Engineering Lead, Risk Lead, and Consultant, answer:

1. Can the persona identify why the case matters within 30 seconds?
2. Can they identify owner, blocker, decision, evidence, consequence, and next step?
3. Can they reclaim workspace without losing progress?
4. Can they inspect prior work without changing it?
5. Do they understand Execution Ready with Conditions precisely?

**Requirement:** UX-PER-001.

## 13. Exit criteria

- All Must requirements pass.
- No unresolved Severity 3 defect.
- Existing regression suites pass without weakening.
- Exact viewport and keyboard evidence is attached.
- Browser console clean.
- Accessibility manual review has no blocker.
- Product owner approves completion language and open questions selected for release.

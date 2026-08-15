# Guided Journey Acceptance Criteria

## Traceability matrix

| Requirement ID | Acceptance criterion | Priority | Validation type | Expected evidence |
|---|---|---:|---|---|
| UX-GMJ-001 | Desktop inspector docks beside content; tablet/mobile use bounded adaptive presentations; Journey logic is unchanged | Must | Browser + state regression | Geometry captures and identical journey snapshots |
| UX-GMJ-002 | Collapse/restore preserves stage, owner, blocker, decision, artifacts, and next action | Must | DOM interaction | Before/after state equality and screenshots |
| UX-GMJ-003 | Desktop resize is 320–520 px, keyboard operable, and causes no horizontal clipping | Should | Browser geometry + keyboard | Requested/actual width table |
| UX-GMJ-004 | Exit hides only presentation; Resume restores exact live state | Must | DOM + state regression | State equality and focus trace |
| UX-GMJ-005 | Presentation state contains no Journey, case, approval, validation, artifact, or DNA authority fields | Must | Unit/static contract | Allowed-key assertion |
| UX-GMJ-006 | No drag/move affordance or persisted position exists | Must | DOM/static review | Absence assertion |
| UX-NAV-001 | Return to Mission Control exists at every stage and preserves progress | Must | Nine-stage browser test | Stage snapshots before/after |
| UX-NAV-002 | Completed stages are keyboard-selectable, labelled read-only, and cannot mutate state | Must | DOM + mutation guard | Deep-equality state assertion |
| UX-NAV-003 | Locked stage selection explains prerequisite and does not advance | Must | Negative interaction | Unchanged current-stage assertion |
| UX-NAV-004 | Reset/restart controls are separated and show scoped confirmation | Must | UX + DOM | Confirmation accessible name and cancel test |
| UX-NAV-005 | No generic workflow-rewinding Back action is introduced | Must | Static contract | Absence assertion |
| UX-NAV-006 | Any shortcut has a visible equivalent and no reviewed platform conflict | Should | Keyboard/manual | Shortcut matrix |
| UX-STA-001 | Current stage, status, progress, and next action remain visible expanded and compact | Must | Browser + accessibility | Text and accessible-tree assertions |
| UX-STA-002 | All controlled statuses are text-labelled and programmatically determinable | Must | Unit + DOM | Status fixture matrix |
| UX-STA-003 | Processing disables action and names work; user-waiting state names owner/action | Must | Journey regression | All transition-state snapshots |
| UX-STA-004 | Failed, blocked, decision-pending, and conditional states show the condition adjacent to status | Must | Browser + accessibility | Failure/decision/completion captures |
| UX-END-001 | 100% view summarizes decisions, package, validation, Wave 1, outcomes, conditions, owner, and lineage | Must | Completion browser test | Completion accessible snapshot |
| UX-END-002 | Return to Mission Control is primary; four supported secondary actions reach real destinations | Must | DOM interaction | Destination assertions |
| UX-END-003 | Unsupported follow-on actions are absent | Must | Static/DOM negative | Absence assertion |
| UX-END-004 | V1.3 never labels readiness as execution started or modernization completed | Must | Copy contract | Prohibited-copy scan |
| UX-DIS-001 | Collapse, Restore, Exit, Return, and overflow controls have visible labels or persistent tooltips/accessibility names | Must | Accessibility/manual | Name-role-value report |
| UX-DIS-002 | Strategic terms retain names and receive first-use descriptions | Should | Content review | Approved terminology inventory |
| UX-DIS-003 | Interactive stage/rationale/evidence elements expose hover, focus, selected, and disabled states | Must | Visual + keyboard | State screenshots |
| UX-COG-001 | Expanded content follows executive, operational, and evidence disclosure levels | Must | DOM/content review | Heading/order assertion |
| UX-COG-002 | Exactly one primary workflow action exists and delegates to the existing source control | Must | Static + interaction | One-handler/one-action assertion |
| UX-COG-003 | Presenter and technical detail are collapsed by default | Should | DOM | Default `aria-expanded=false` assertions |
| UX-AIX-001 | Rationale identifies deterministic method, evidence, assumptions, alternatives, and review condition without invented scores | Should | Content/unit | Finding projection fixture |
| UX-AIX-002 | System recommendation and Mission Commander approval are visually and semantically distinct | Must | Browser/accessibility | Decision-state snapshot |
| UX-AIX-003 | Decision, propagation, and correction expose state-derived What Changed summaries | Should | Unit + DOM | Deterministic text fixtures |
| UX-PER-001 | Shared summary answers what, why, owner, evidence, decision, consequence, and next step | Must | Persona review | Eight-persona checklist |
| UX-ACC-001 | Correct complementary/drawer/sheet semantics, labels, expansion state, and active step exist | Must | Automated a11y + DOM | Role/attribute assertions |
| UX-ACC-002 | Keyboard-only completion, logical focus, restoration, resize, inspection, and no trap pass | Must | Keyboard browser test | Focus-order log |
| UX-ACC-003 | Targeted announcements occur for stage, processing, failure, blocker, correction, and completion without duplicate panel announcement | Must | Screen-reader/manual + DOM | Announcement transcript |
| UX-ACC-004 | 200% zoom reflows; touch targets ≥44 px; status does not rely on color/motion | Must | Browser geometry/manual | Target and overflow report |
| UX-ACC-005 | Reduced motion preserves all information and actions without meaningful movement | Must | Emulated media browser | Reduced-motion recording/assertions |
| UX-RSP-001 | 1440×900 docked mode has no document-level horizontal overflow and workspace remains usable | Must | Exact viewport browser | Requested/actual geometry report |
| UX-RSP-002 | 1024×768 and 768×1024 drawer/rail modes keep core workspace controls reachable | Must | Exact viewport browser | Reachability and clipping report |
| UX-RSP-003 | 390×844 sheet/rail remains within viewport and internally scrollable | Must | Exact viewport browser | Geometry and interaction report |
| UX-RSP-004 | At 600 px height, header, action, collapse, and exit are reachable | Must | Boundary viewport browser | Element bounds report |
| UX-ERR-001 | Reset/restart confirmation names impact; Cancel changes nothing and restores focus | Must | DOM/state/keyboard | State equality and focus assertion |
| UX-ERR-002 | Failure/correction context survives collapse, exit, review, and restore | Must | Validation regression | Before/after evidence snapshot |
| UX-ERR-003 | Invalid presentation preference normalizes safely without Journey mutation | Must | Unit + responsive | Preference fixture tests |
| UX-HLP-001 | First-use collapse/exit hint appears once, is dismissible, and does not recur in session | Should | Session interaction | First/second-open assertions |
| UX-HLP-002 | Approved definitions exist at point of need for five strategic/status terms | Should | Content review | Terminology checklist |
| UX-HLP-003 | Presenter cue remains optional and closed by default | May | DOM | Disclosure state assertion |

## Release-level acceptance gates

1. All Must criteria pass.
2. Full 22-action DR-CIC-001 Guided Demo still reaches Execution Ready with Conditions.
3. DR-SQP-002 still stops at Decision Pending and remains isolated.
4. Validation still produces the intentional failure, governed correction, targeted three-check rerun, and seven-of-seven final result.
5. No duplicate workflow action, state authority, work object, case, artifact, or Enterprise DNA mapping is introduced.
6. Browser console contains no new warnings or errors.
7. Existing JavaScript and Python tests pass unchanged; new presentation tests pass.
8. Exact responsive viewport evidence is captured for 1440×900, 1024×768, 768×1024, and 390×844.

# Guided Journey UX Heuristic Evaluation

**Product:** Modernization AI Lab V1.3
**Evaluation scope:** Mission Control, Modernization HQ, and the nine-stage Guided Modernization Journey
**Evaluation date:** 2026-07-18
**Phase:** Specification only

## 1. Executive summary

Modernization AI Lab already communicates an unusually strong enterprise story: one governed modernization case moves from evidence through decision, engineering, independent validation, correction, and executive approval. The current UI exposes owner, blocker, next action, work objects, evidence lineage, human approval boundaries, and deterministic validation. The underlying journey is coherent and should not be redesigned.

The primary usability weakness is the Guided Modernization Journey container. It behaves as a large sticky complementary panel but does not identify that model to users. In the inspected 1280×720 browser, the open guide measured approximately **390×870 px**, began below the application toolbar, extended beyond the viewport, and had no internal scroll, resize, collapse, or restore affordance. Its persistent controls were the current action, **Restart Guided Demo**, and **Turn Off**. This creates a Severity 3 user-control problem: the guide helps users orient, but competes with and can obscure the workspace it is meant to explain.

The recommended correction is an **Adaptive Docked Journey Inspector**. On desktop it participates in a split view and can be resized or collapsed to a compact rail. On smaller screens the same inspector becomes a bounded drawer/sheet with an always-available compact rail. Collapse and exit affect presentation only; the existing journey state machine remains authoritative and unchanged.

## 2. Current UX score

**64 / 100 — Functionally credible, interaction model needs productization.**

The score reflects strong status visibility, real-world terminology, deterministic error recovery, and governed human decisions, offset by limited journey-container control, weak distinction between navigation and mutation, incomplete completion affordances, and screen-height pressure.

## 3. Evidence inspected

- Entry launchpad, Guided Demo toggle, pace controls, and reset controls.
- Mission Control portfolio, enterprise hierarchy, Program Intelligence, active case, Enterprise DNA context, product cards, and inspectors.
- Modernization HQ, Living Workspace, Work Queue, specialist personas, case panel, and stage transitions.
- Shared Decision Room, decision positions, evidence, alternatives, Mission Commander decision, and decision record.
- Constraint propagation, Engineering Workspace, generated package, Validation Workspace, intentional failure, correction approval, targeted rerun, Executive Roadmap, and Wave 1 approval.
- DR-CIC-001 happy path and DR-SQP-002 isolation.
- Empty, waiting, in-progress, blocked, failure, correction, completion, and reset states represented by current deterministic state.
- Keyboard-focusable controls, focus styles, live regions, reduced-motion CSS, and responsive breakpoints.
- Guided container DOM, computed geometry, available controls, semantics, and current tests.

## 4. Nielsen heuristic scorecard

| # | Heuristic | Score / 10 | Evidence | Severity | Affected personas | Recommended direction | Requirements |
|---:|---|---:|---|---:|---|---|---|
| 1 | Visibility of system status | 8 | Owner, task, blocker, next action, progress, validation, and work-object states are visible. The guide can extend below the viewport, hiding some of its own status. | 2 | All | Keep a compact persistent stage header and expose processing/attention states without scrolling. | UX-STA-001–004, UX-RSP-003 |
| 2 | Match between system and real world | 8 | Case, evidence, review, decision, engineering, validation, and approval vocabulary maps well to enterprise practice. “Turn Off” and “Execution Ready” need clearer operational meaning. | 2 | CIO, transformation lead, consultant | Preserve strategic concepts; define status terms and clarify exit/completion language. | UX-NAV-003, UX-END-001, UX-END-004, UX-HLP-002 |
| 3 | User control and freedom | 4 | No collapse, restore, resize, read-only stage inspection, or explicit non-destructive exit. Restart is adjacent to the ambiguous Turn Off action. | 3 | All, especially PM and architect | Adaptive docked inspector, collapse/restore, Exit Journey, Return to Mission Control, and guarded reset. | UX-GMJ-001–006, UX-NAV-001–005, UX-ERR-001 |
| 4 | Consistency and standards | 7 | Strong button and focus conventions; however, sticky guide, modal entry, full-screen lab, HQ, and inspectors use different container models without sufficient explanation. | 2 | First-time users, consultants | Give the guide explicit complementary/drawer semantics and consistent control labels. | UX-GMJ-001, UX-DIS-001, UX-ACC-001 |
| 5 | Error prevention | 7 | High-risk decisions require human approval and validation failures remain visible. Restart/reset do not receive enough separation or confirmation in the journey context. | 2 | Mission Commander, risk lead | Put destructive actions in an overflow group, label scope, and confirm state loss. | UX-NAV-004, UX-ERR-001–003 |
| 6 | Recognition rather than recall | 5 | Nine stages remain listed, but completed stages cannot be inspected and the user must remember earlier evidence and decisions. Future stages say Pending without explaining eligibility. | 3 | Executives, consultants, architects | Read-only completed-stage inspection, locked-stage explanations, and concise “what changed” summaries. | UX-NAV-002–003, UX-STA-001–004, UX-AIX-003 |
| 7 | Flexibility and efficiency of use | 5 | Fast pace and direct actions help presenters. No compact mode, no resizing, no safe stage review, and limited keyboard accelerators. | 3 | Frequent presenters, specialists | Collapsible rail, bounded resizing, focusable stage list, and optional documented shortcut. | UX-GMJ-002–003, UX-NAV-006, UX-ACC-002 |
| 8 | Aesthetic and minimalist design | 6 | Professional visual language and improved typography; the guide simultaneously shows context, five status facts, action, nine stages, metadata, and presenter cue. | 3 | All | Three-level disclosure: live summary, operational detail, evidence/presenter depth. | UX-COG-001–003, UX-GMJ-002 |
| 9 | Help users recognize, diagnose, and recover from errors | 8 | Validation failure names the failed check, actual variance, owner, correction, and targeted rerun. Journey-container recovery and accidental restart recovery are weaker. | 2 | Engineering and risk leaders | Preserve validation UX; add reset confirmation, focus restoration, and clear continuation after errors. | UX-ERR-001–003, UX-ACC-003 |
| 10 | Help and documentation | 6 | Presenter cues and explanatory context exist, but discoverability of HQ, Enterprise DNA, evidence depth, and guide container controls is uneven. | 2 | First-time users, executives | Contextual first-use hint, “Why this matters,” term definitions, and optional help without permanent clutter. | UX-DIS-001–003, UX-HLP-001–003 |

## 5. Severity-ranked issues

### Severity 3 — Major

| Issue | Evidence | Consequence | Requirements |
|---|---|---|---|
| Journey container obstructs and outgrows the workspace | 390×870 px guide in a 1280×720 viewport; sticky placement; no internal scroll or resize | Users lose workspace context and may not reach lower guide content without page movement | UX-GMJ-001–003, UX-RSP-001–004 |
| No collapse/restore or clear non-destructive exit | Only Restart and Turn Off are available | Users cannot reclaim space confidently; “Turn Off” may be interpreted as reset | UX-GMJ-002, UX-GMJ-004, UX-NAV-001 |
| Completed work is not inspectable from the stage tracker | Lifecycle items are generated as non-interactive list items | Users must remember prior evidence and decisions; recognition is replaced by recall | UX-NAV-002, UX-STA-001 |
| Navigation and mutation are insufficiently separated | Reset Current Stage, Restart Guided Demo, current action, and Turn Off share nearby presentation | Accidental destructive actions are harder to distinguish from navigation | UX-NAV-004–005, UX-ERR-001 |

### Severity 2 — Minor but material

- Completion reaches 100% and exposes Decision Lineage, but does not become a clear execution-readiness summary with prioritized next actions (`UX-END-001–004`).
- The guide is a complementary region but has no explicit expandable/collapsible semantics or focus-restoration contract (`UX-ACC-001–003`).
- Pending and blocked stages are visible, but eligibility and conditions are not consistently explained (`UX-STA-002–004`).
- Enterprise DNA and Enterprise Intelligence are present but can appear as product features rather than quiet evidence context without supporting descriptions (`UX-DIS-002`, `UX-AIX-001`).
- The guide mixes executive context, operational status, presenter instructions, and lifecycle detail in one always-expanded surface (`UX-COG-001–003`).
- Mobile rules avoid a compressed desktop layout, but the full nine-stage guide still needs a bounded sheet and explicit compact mode (`UX-RSP-002–004`).

### Severity 1 — Cosmetic

- Some all-capital operational labels require supporting plain-language descriptions, not renaming (`UX-HLP-002`).
- The status vocabulary needs a formal glossary to distinguish complete, approved, validated, and execution ready (`UX-STA-002`, `UX-END-004`).

## 6. Persona impact

| Persona | What works | Primary gap | Needed outcome |
|---|---|---|---|
| CIO | Strategy, business outcomes, roadmap, and conditions are traceable | Completion does not summarize executive consequence prominently enough | Concise execution-readiness summary and Return to Mission Control |
| CTO | Engineering and validation are evidence linked | The guide can obscure technical workspaces | Collapse/resize while preserving current stage and action |
| Enterprise Architect | Dependencies, conflict, and architecture position are explicit | Prior-stage decisions require memory | Read-only stage and decision inspection |
| Transformation Office lead | Program, cases, owner, blocker, and next step are visible | No compact portfolio-and-journey split | Persistent compact rail and broader context access |
| Product Manager | Capability and business value are visible | Too much operational metadata is shown simultaneously | Executive summary first; operational detail on demand |
| Engineering leader | Package lineage, checks, and correction are credible | Completion may be read as completed modernization | Precise execution-readiness language and artifact access |
| Risk and Governance leader | Human approval and failure recovery are strong | Conditions can be visually subordinate at completion | Attention and “completed with conditions” states |
| Consultant | Guided story and presenter cues are useful | No efficient review of previous stages | Stage inspection, compact presenter mode, clear navigation |

## 7. Accessibility findings

### Strengths

- Native buttons and links are used broadly.
- Visible focus styling exists.
- The guide exposes an accessible label, `aria-live="polite"`, an `aria-current="step"` lifecycle item, and a status region for the primary action.
- Reduced motion collapses animation and smooth scrolling duration.
- Mission Control and HQ use semantic regions and headings.

### Gaps

- The guide lacks an explicit expandable/collapsible control and `aria-expanded`/`aria-controls` relationship.
- No focus placement or restoration behavior is defined when opening, collapsing, restoring, or exiting.
- Stage items are not interactive and therefore cannot support keyboard read-only inspection.
- The large sticky panel can extend beyond limited-height viewports without an explicit internal scroll boundary.
- “Turn Off” does not communicate whether journey state is preserved to screen-reader or sighted users.
- Processing announcements must avoid repeating the entire panel on each render.

## 8. Responsive findings

- Desktop: the guide consumes a narrow column but can be taller than the viewport and competes with case content.
- Tablet landscape: the current width is proportionally significant and the nine-stage horizontal tracker requires horizontal scrolling.
- Tablet portrait: the guide and underlying workspace stack, increasing travel between instruction and evidence.
- Mobile portrait: current CSS moves the guide between fixed and sticky historical rules; the final cascade is sticky and full width, but the expanded content can dominate the screen.
- Large displays: unused space could support a true split-view inspector rather than an overlay-like sticky card.

The responsive solution must preserve one component and state contract while adapting its presentation: docked inspector on wide screens, bounded drawer on tablet, bounded sheet with compact rail on mobile.

## 9. Discoverability inventory

| Surface | Current discoverability | Finding |
|---|---|---|
| Mission Control | High | Preserve label and primary navigation prominence |
| Modernization HQ | Medium–high | Preserve name; add a short “specialist workspace” description for first use |
| Guided Journey | High entry, weak container controls | Add Collapse, Exit Journey, Return to Mission Control, and Resume labels |
| Living Workspace | Medium | Explain as the place where case ownership and work progression are visible |
| Decision Room | High during the journey | Keep outcome and human-decision framing |
| Enterprise DNA | Medium | Preserve concept; explain as enterprise context, not a page to manage |
| Enterprise Intelligence | Medium–low | Expose “Why this recommendation?” with method/evidence, not a separate destination |
| Engineering / Validation / Executive Roadmap | High when reached | Future stages should remain visible but locked with eligibility explanations |
| Specialist personas | Visually clickable | Keep concise reason-for-involvement and current responsibility |
| Evidence and dependencies | Strong in workspaces | Add read-only completed-stage access from the guide |

## 10. Product maturity assessment

The product is beyond a concept demo in workflow coherence but not yet at enterprise interaction maturity for guided-workspace control. The recommended release is a presentation-layer productization increment, not an architectural redesign. Journey logic, Enterprise DNA, deterministic state transitions, cases, artifacts, validation, and reset behavior should remain unchanged.

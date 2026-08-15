# Guided Journey Interaction Model

## 1. Recommended model: Adaptive Docked Journey Inspector

The Guided Modernization Journey should become an **Adaptive Docked Journey Inspector**: one non-modal, state-aware presentation component that sits beside the current workspace, collapses to a compact rail, and adapts to a bounded drawer/sheet on smaller viewports.

It is an inspector because it combines orientation, the single next action, and read-only review. It is not a new workspace, dialog, workflow engine, or source of enterprise understanding.

```text
Desktop expanded
┌──────────────────────────────────────────────┬──────────────────────┐
│ Mission Control / Modernization HQ workspace│ Journey Inspector     │
│                                              │ Stage 4 of 9          │
│ Evidence, case, agents, decisions            │ Decision Pending      │
│ remain visible and usable                    │ Owner / blocker       │
│                                              │ [Primary action]      │
│                                              │ Stage list / details  │
└──────────────────────────────────────────────┴──────────────────────┘

Desktop collapsed
┌─────────────────────────────────────────────────────────────────────┐
│ Workspace                                                           │
├─────────────────────────────────────────────────────────────────────┤
│ Journey: 4/9 · Decision Pending · Mission Commander · [Restore]    │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Why this model fits

- Preserves the guide’s existing complementary role.
- Keeps the workspace visible while progressing.
- Supports enterprise desktop split-view conventions.
- Makes collapse and restore predictable.
- Provides read-only history without creating editable past states.
- Separates presentation state from Journey state.
- Adapts coherently to smaller screens without forcing a compressed desktop.

## 3. Alternatives considered

| Pattern | Decision | Reason |
|---|---|---|
| Floating panel | Reject | Still obscures content; position persistence and collision handling add complexity |
| Freely movable window | Reject | Inconsistent placement, difficult keyboard/touch control, and unnecessary window-management burden |
| Modal | Reject | Prevents referencing Mission Control and misrepresents a persistent journey |
| Full-screen workspace | Reject | Removes enterprise context and makes the guide compete with HQ/Engineering/Validation |
| Persistent side navigation only | Reject | Navigation alone cannot show owner, blocker, evidence, and primary action |
| Horizontal stepper only | Reject | Nine long stages do not fit well and cannot carry operational detail |
| Vertical timeline only | Reject | Useful inside expanded mode, insufficient as the entire container model |
| Resizable drawer only | Reject | Lacks compact rail and mobile adaptation |
| Split view without collapse | Reject | Better than overlay, but fails user control and limited-width requirements |
| Compact journey rail only | Reject | Excellent secondary mode, insufficient for decision and failure detail |

## 4. Container interaction contract

### Default open state

- Selecting **Run Guided Demo** opens the inspector expanded.
- Reopening a journey in the same browser session restores the last non-invalid presentation mode.
- Full Reset restores the presentation default: expanded on desktop, compact rail on mobile.

### Default, minimum, and maximum size

| Context | Default | Minimum | Maximum |
|---|---:|---:|---:|
| Desktop ≥1200 px | 380 px wide | 320 px | 520 px or 42% viewport, whichever is smaller |
| Tablet 768–1199 px | 400 px drawer | 340 px | 52% viewport |
| Mobile <768 px | Full-width sheet, 64vh | 44 px compact rail | 88vh expanded |
| Limited height ≤600 px | Width rules unchanged | Header + action visible | 88vh with internal scroll |

The desktop resize handle MUST expose `role="separator"`, `aria-orientation="vertical"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. Arrow keys adjust by 16 px; Shift+Arrow adjusts by 48 px. Home/End set minimum/maximum. Pointer dragging is constrained to bounds.

### Dock behavior

- Desktop: right dock in the application grid; workspace reflows.
- Tablet: right non-modal drawer over a dim-free workspace; compact rail remains available when closed.
- Mobile: bottom sheet anchored to viewport; compact rail remains at the top or bottom application edge according to established shell layout.
- The component MUST NOT cover the current primary action when collapsed.

### Collapse and restore

- **Collapse Journey** changes only `presentationMode` to `compact`.
- Compact rail shows: `Stage n of 9`, stage name, semantic status, owner or processing indicator, and either the current primary action or **Restore Journey** depending on available width.
- **Restore Journey** returns to the prior expanded presentation and focus target.
- Collapse during processing does not pause or cancel work. The rail updates when the deterministic transition completes.

### Close/exit

- **Exit Journey** changes presentation mode to `closed` and returns focus to the toolbar **Resume Guided Journey** control.
- Exiting preserves the live Journey state and active case.
- No confirmation is required because state is preserved.
- **Restart Guided Demo** and reset actions are separate destructive operations and require confirmation.

### Move and resize permissions

- Move panel: **No**.
- Resize on desktop: **Yes**, bounded.
- Resize on tablet/mobile: **No**; responsive bounds are automatic.
- Collapse: **Yes**.
- Exit: **Yes**.
- Reopen: **Yes**, via **Resume Guided Journey**.
- Navigate Mission Control while open: **Yes**.
- Continue journey while collapsed: **Yes** when the compact rail exposes the current action; otherwise restore first.

## 5. Presentation state model

```text
guidePresentation = {
  mode: "expanded" | "compact" | "closed",
  desktopWidth: 320..520,
  inspectedStage: null | completedStageNumber,
  previousFocusToken: presentation-only reference,
  firstUseHintDismissed: boolean
}
```

Allowed transitions:

```text
closed --Resume--> expanded
expanded --Collapse--> compact
compact --Restore--> expanded
expanded --Exit--> closed
compact --Exit--> closed
expanded --Inspect completed--> expanded + inspectedStage
inspection --Return to Live Stage--> expanded + inspectedStage:null
viewport change --Normalize--> valid responsive presentation
Full Reset --Reset presentation--> responsive default
```

Forbidden fields include Journey stage, task, owner, blocker, approval, active case, validation state, artifacts, Enterprise DNA object selection, or modernization lifecycle.

## 6. Information architecture

### Level 1 — Executive summary (always visible expanded)

- Stage number and title.
- Semantic status.
- Active case.
- Current owner.
- Blocker/remaining condition when present.
- One primary action or deterministic processing state.
- Collapse, Return to Mission Control, and overflow controls.

### Level 2 — Operational detail

- Nine-stage progress tracker.
- Current task/work object.
- Previous and upcoming stage.
- What changed since the prior stage.
- Completed-stage read-only summary.

### Level 3 — Evidence and technical depth

- Enterprise context.
- Evidence references and rationale.
- Assumptions and alternatives.
- Presenter cue.
- Technical validation or artifact details linked to existing workspaces.

Levels 2 and 3 use disclosures and are not simultaneously forced open.

## 7. Navigation model

### Live versus inspected state

The live Journey always remains authoritative. Selecting a completed stage opens an inspector view labelled **Read-Only Stage Review**. The header continues to show a persistent **Live: Stage n** marker and a **Return to Live Stage** control.

```text
Stage tracker selection
├── completed → read-only inspection
├── current   → live summary
└── future    → locked explanation; no navigation
```

Past inspection MUST NOT replay animation, navigate the underlying workspace, reset state, or change the next action in the live compact rail.

### Return to Mission Control

- Available at every stage and completion.
- Switches experience to Mission Control and centers the active case.
- Keeps guide expanded/compact according to presentation state.
- Does not change Journey progress.

### Back behavior

No generic Back button is specified. Browser Back retains existing URL/hash behavior. Product navigation uses explicit labels to avoid implying workflow reversal.

### Pause and resume

A global pause is not recommended. Journey transitions are explicit, short, deterministic, and event-driven. Collapse/Exit provides presentation control without inventing a second execution state. The existing Living Workspace Pause/Resume behavior remains unchanged and is surfaced contextually only at that stage.

## 8. Progress model

The expanded inspector uses a focusable vertical stage list on desktop and an accessible horizontally scrollable/stacked list where space requires. Each item includes number, stage name, text status, and optional condition.

| Status | Meaning | Interaction |
|---|---|---|
| Not Started | Journey has not begun | Current first-stage action available |
| Available | Prerequisites met | Action available only if it is the live current stage |
| Current | Live stage awaiting user or work | Current action/status visible |
| In Progress | Deterministic work executing | Action disabled; live status announced |
| Completed | Stage outputs attached | Read-only inspection available |
| Completed with Conditions | Stage completed; explicit conditions remain | Read-only inspection; conditions emphasized |
| Attention Required | User review needed | Current owner and action visible |
| Failed | A deterministic check failed | Failure details and recovery path visible |
| Blocked | Cannot proceed | Blocker and accountable owner visible |
| Decision Pending | Mission Commander decision required | Human decision action visible |
| Execution Ready with Conditions | Approved, generated, and validated with remaining prerequisites | Completion summary and next actions |

Color is supplementary. Every state includes a text label and, where useful, a non-decorative icon with an accessible name or hidden duplicate.

## 9. Completion model

```text
Execution Ready with Conditions
├── Outcomes: expected, not yet realized
├── Decisions: approved
├── Plan: Wave 1 approved
├── Package: generated and validated
├── Conditions: ownership/governance prerequisites remain
├── Primary: Return to Mission Control
├── Secondary: Review Conditions
├── Secondary: Inspect Decision Lineage
├── Secondary: View Migration Starter Package
└── Secondary: Open Executive Roadmap
```

A restrained milestone treatment MAY appear once. It MUST not imply deployment or completed modernization and MUST be removed under reduced motion.

## 10. Responsive model

### Desktop ≥1200 px

- Expanded by default.
- Right split-view dock.
- Bounded resize.
- Workspace minimum width 640 px.
- Stage list may be vertical to avoid horizontal overflow.

### Tablet landscape 1024×768

- Compact rail by default after first stage, unless the user explicitly restored.
- Expanded right drawer max 52vw with internal scrolling.
- Workspace remains independently scrollable and accessible.

### Tablet portrait 768×1024

- Compact rail default.
- Expanded drawer/sheet max 72vh; stage list uses vertical layout.
- No desktop resize handle.

### Mobile 390×844

- Compact rail default after entry guidance.
- Expanded bottom sheet full width, max 88vh.
- Sticky inspector header contains Collapse and Exit.
- Primary action remains within the sheet’s sticky action area.
- Internal content scrolls; background workspace does not become inert because this is non-modal.
- Touch targets at least 44×44 CSS px.

### Orientation and viewport changes

- Preserve Journey state.
- Normalize invalid width/mode to responsive defaults.
- Preserve inspected stage if it remains eligible; otherwise return to live stage.
- Do not move focus unexpectedly unless the focused control disappears; then focus the compact/expanded toggle.

## 11. Keyboard model

| Key | Context | Behavior |
|---|---|---|
| Tab / Shift+Tab | Anywhere | Normal document order; no docked focus trap |
| Enter / Space | Buttons and completed stages | Activate visible control/read-only inspection |
| Arrow Up/Down | Stage list | Move roving focus among stage items without activating |
| Home / End | Stage list | First/last stage focus |
| Enter | Focused stage | Inspect completed/current or explain locked future stage |
| Arrow Left/Right | Resize separator | Adjust width by 16 px |
| Shift+Arrow | Resize separator | Adjust width by 48 px |
| Escape | Expanded drawer/sheet | Collapse to compact; never reset or exit |
| Escape | Read-only stage inspection | Return to live stage |
| Optional shortcut | Product focus | Collapse/restore after platform conflict review |

## 12. Focus model

- Open from entry: focus inspector heading, then announce current stage.
- Restore: focus the previously focused inspector control when valid; otherwise heading.
- Collapse: focus compact rail Restore control.
- Exit: focus toolbar Resume Guided Journey.
- Read-only inspection: focus review heading; Escape/Return restores focus to selected stage item.
- Locked stage: focus inline prerequisite explanation; closing returns focus to stage item.
- Completion: focus completion heading once; do not move focus on subsequent renders.
- Validation failure: announce failure, but do not steal focus from the current control unless the user’s action caused navigation into the failure state.

## 13. Touch and pointer model

- Controls meet 44×44 px targets on touch layouts.
- Swipe-to-dismiss is not required and SHOULD NOT be the only way to collapse/exit.
- Desktop resize requires an 8 px visible/16 px effective hit area.
- No drag-to-move gesture.
- Scrolling within the expanded sheet does not scroll the underlying page until the sheet boundary is reached; overscroll containment SHOULD be applied.

## 14. Mock interaction descriptions

### First open

The inspector opens expanded. A one-time hint beneath the header says: “Keep Mission Control visible: collapse this journey at any time. Exiting preserves progress.” Collapse and Return to Mission Control are visible; destructive reset is in overflow.

### Compact rail

The rail reads: “Stage 4 of 9 · Shared Decision Room · Decision Pending · Mission Commander.” It exposes **Resolve Decision** and **Restore Journey** where width allows. At mobile width it exposes Restore and a concise status; the action is available after restore.

### Completed-stage review

Selecting Portfolio Discovery shows evidence ready/incomplete/conflict results, owner, outputs, and the completion time/state already present. A banner states “Read-only review — live journey remains at Stage 6.”

### Locked future stage

Selecting Validation before Engineering completes shows: “Validation is locked. Required first: assemble the Migration Starter Package.” No workflow action is invoked.

### Completion

The inspector title becomes “Execution Ready with Conditions.” The remaining Finance ownership condition is placed before actions. Return to Mission Control is primary. No celebratory language says “modernization complete.”

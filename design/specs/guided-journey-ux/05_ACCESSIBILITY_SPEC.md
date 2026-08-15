# Guided Journey Accessibility Specification

## 1. Accessibility objective

The Adaptive Docked Journey Inspector must provide equivalent orientation, progression, review, error recovery, and completion for keyboard, touch, screen-reader, zoom, and reduced-motion users. Accessibility behavior must not change or duplicate the Journey state machine.

## 2. Semantic behavior

### Docked desktop

- Container: `<aside>` or equivalent `role="complementary"`.
- Accessible name: **Guided Modernization Journey** via `aria-labelledby`.
- It is not modal and MUST NOT trap focus.
- Workspace and inspector remain in normal document order.

### Tablet drawer and mobile sheet

- Remain non-modal unless a future approved design intentionally makes the background inert.
- Use a labelled region; `aria-modal` MUST be absent/false.
- If visual overlay is used, it MUST not imply modal semantics.
- Internal scroll region MUST be programmatically identifiable and keyboard scrollable.

### Compact rail

- Region labelled **Guided Journey Summary**.
- Restore control exposes `aria-expanded="false"` and `aria-controls` for the inspector.
- Current stage retains `aria-current="step"` in the compact summary or an equivalent accessible current-stage statement.

### Stage tracker

- Use an ordered list.
- Current stage uses `aria-current="step"`.
- Completed and current items use buttons when inspectable.
- Locked future items may use disabled buttons only if the prerequisite remains available to assistive technology; otherwise use `aria-disabled="true"` with focusability and an activation explanation.
- Status text is included in each accessible name/description.

## 3. Keyboard behavior

### Required controls

- Open/Resume Journey.
- Collapse Journey.
- Restore Journey.
- Exit Journey.
- Return to Mission Control.
- Current primary workflow action.
- Read-only completed-stage items.
- Locked-stage explanation.
- Evidence/rationale disclosures.
- Overflow menu and reset confirmation.
- Desktop resize separator.

### Order

Expanded inspector order:

1. Heading.
2. Collapse Journey.
3. Return to Mission Control.
4. Overflow/Exit.
5. Live stage summary.
6. Primary workflow action.
7. Stage tracker.
8. Operational-detail disclosure.
9. Evidence/rationale disclosure.
10. Optional presenter guidance.

The primary action appears early because it is the expected task. Destructive reset actions remain later and separated.

### Key contracts

- Enter/Space activates buttons and stage inspection.
- Arrow Up/Down and Home/End provide roving focus within the stage tracker.
- Escape from expanded tablet/mobile presentation collapses; it never exits or resets.
- Escape from stage review returns to live stage.
- Escape from confirmation cancels and restores focus.
- Resize separator supports Left/Right, Shift+Left/Right, Home, and End.
- No custom shortcut is permitted until conflict testing with browsers and assistive technologies is complete.

## 4. Focus management

| Event | Required focus result |
|---|---|
| Open from launchpad | Inspector heading; concise stage announcement |
| Open/Resume from toolbar | Previously focused valid inspector control, otherwise heading |
| Collapse | Compact Restore Journey control |
| Restore | Prior valid inspector control, otherwise heading |
| Exit | Toolbar Resume Guided Journey control |
| Select completed stage | Read-Only Stage Review heading |
| Return to live stage | Previously selected stage button |
| Select locked stage | Prerequisite explanation; closing returns to stage button |
| Open reset confirmation | Confirmation heading or safe Cancel action |
| Cancel confirmation | Initiating reset control |
| Confirm reset | Responsive default guide heading or launch control per existing reset UX |
| Reach completion | Completion heading once, only after user-caused transition |

Re-rendering ordinary status MUST NOT repeatedly move focus.

## 5. Screen-reader behavior

### Names and descriptions

- Control labels use visible text first.
- Icon-only fallback controls require explicit accessible names and persistent tooltips.
- Current primary action uses `aria-describedby` for readiness/processing status.
- Collapse/Exit descriptions state: “Journey progress is preserved.”
- Reset descriptions state the exact scope cleared.

### Announcements

Use separate, targeted polite status regions for:

- Stage changed.
- Work started/completed.
- Owner changed.
- Blocker/condition attached or cleared.
- Read-only inspection entered/exited.
- Journey collapsed/restored/exited.
- Validation failed.
- Correction approved.
- Targeted rerun completed.
- Execution Ready with Conditions reached.

Use assertive announcement only when an error blocks the current action and immediate correction is required. Do not place the entire frequently re-rendered inspector inside one live region.

Example completion announcement:

> Execution Ready with Conditions. Wave 1 approved. Seven validation checks passed. Finance reporting ownership remains a prerequisite. Return to Mission Control is available.

## 6. Error and validation accessibility

- Validation failure heading receives programmatic association with failed check, severity, actual result, expected result, owner, and next action.
- Error is not color-only; use text **Failed** and an icon/indicator.
- Correction proposal identifies system proposal versus Mission Commander approval.
- Approve, Request Evidence, Reject, and Return controls have distinct accessible names.
- Targeted rerun announces scope: three impacted checks, not all seven.
- Collapsing/exiting during a failure preserves the failure summary in the compact rail or toolbar resume description.

## 7. Reset accessibility

- Restart Guided Demo, Reset Current Stage/Case, and Full Reset each use distinct labels.
- Confirmation is a true modal dialog because it blocks a destructive operation.
- Dialog has labelled title, concise consequence, safe Cancel, destructive Confirm, focus trap, Escape-to-cancel, and focus restoration.
- Confirm is not the first focus target; Cancel is preferred.
- No reset occurs before explicit confirmation.

## 8. Reduced motion

- Respect `prefers-reduced-motion: reduce`.
- Collapse/restore completes without sliding, scaling, or opacity choreography.
- Resize is immediate.
- Stage/status updates use static changes and announcements.
- Specialist movement and existing workflow animation retain current reduced-motion behavior.
- Completion acknowledgment is static.
- Information, ordering, and timing outcomes remain equivalent.

## 9. Contrast and non-color cues

- Text and essential icons meet WCAG AA contrast against their backgrounds.
- Normal text target: at least 4.5:1.
- Large text and essential graphical objects: at least 3:1.
- Focus indicator: at least 3:1 against adjacent colors and not clipped.
- Status always includes text and may include shape/icon; color is supplementary.
- Disabled controls remain readable and explain prerequisites.

## 10. Readability, zoom, and reflow

- Support browser zoom to 200% without loss of content or function.
- At an effective 320 CSS px width, use one-column inspector content.
- No two-dimensional scrolling for ordinary text/status content.
- Technical tables may scroll horizontally within labelled containers.
- Inspector header and action area remain reachable at 600 px viewport height.
- Body and operational text follow the product’s readable typography floor; truncation requires an accessible full-value mechanism.

## 11. Touch and pointer

- Touch controls at least 44×44 CSS px with adequate separation.
- Resize handle not shown on touch-only tablet/mobile layouts.
- No hover-only information.
- Swipe is optional enhancement and cannot replace Collapse/Exit controls.
- Stage items expose the same explanation on tap as keyboard activation.

## 12. Orientation change

- State is preserved.
- Focus remains on the equivalent control when possible.
- If a desktop resize separator disappears, focus moves to the inspector heading or Collapse control with a polite layout-change announcement only if necessary.
- Invalid width preferences normalize silently.

## 13. Accessibility acceptance checklist

- [ ] Open, collapse, restore, exit, and resume work with keyboard and touch.
- [ ] Focus moves and restores according to the table.
- [ ] No non-modal focus trap.
- [ ] Current stage and status are announced and text-labelled.
- [ ] Completed-stage review is explicitly read-only.
- [ ] Locked stages explain prerequisites to keyboard and screen-reader users.
- [ ] Primary action remains one delegated control.
- [ ] Validation failure/correction/rerun is understandable without color or animation.
- [ ] Completion language and remaining conditions are announced accurately.
- [ ] Reset confirmation prevents accidental loss and is fully keyboard accessible.
- [ ] 200% zoom and 390×844 reflow preserve core actions.
- [ ] Reduced motion preserves all information.
- [ ] Automated accessibility scan has no new serious/critical findings.
- [ ] Manual screen-reader smoke tests pass with at least VoiceOver/Safari and one Chromium screen reader where available.

# Guided Journey UX Implementation Roadmap

Estimates are planning ranges, not commitments. Every phase is presentation-layer only and must preserve the existing Journey and Enterprise DNA boundaries.

## 1. Proposed phases

### Phase 0 — Baseline and guardrails

**Purpose:** Freeze behavioral evidence before UI work.
**Requirements:** UX-GMJ-005, UX-COG-002, UX-END-004.
**Work:** Capture current state fixtures, 22-action outcome, secondary-case behavior, reset states, exact viewport evidence, and console baseline. Add presentation-state boundary tests before implementation.

**Stop/go gate G0:** Proceed only if the baseline is reproducible and unrelated working-tree changes are isolated.

### Phase 1 — Quick wins (approximately 1–2 hours each)

| Recommendation | IDs | User value | Severity | Effort | Implementation risk | Regression risk | Dependencies |
|---|---|---|---:|---|---|---|---|
| Rename Turn Off to Exit Journey and expose Resume Guided Journey | UX-GMJ-004, UX-DIS-001 | Clarifies state preservation | 3 | 1–2 h | Low | Medium if handler resets | Presentation-state boundary |
| Add Collapse/Restore control and compact summary | UX-GMJ-002, UX-STA-001 | Reclaims workspace | 3 | 1–2 h | Medium | Medium | Presentation state |
| Add Return to Mission Control | UX-NAV-001 | Restores enterprise context | 3 | 1 h | Low | Low | Existing experience switch |
| Separate reset/restart in overflow and add scope copy | UX-NAV-004, UX-ERR-001 | Prevents accidental loss | 2 | 2 h | Medium | Medium | Confirmation component |
| Collapse presenter cue/evidence detail by default | UX-COG-001–003, UX-HLP-003 | Reduces density | 2 | 1 h | Low | Low | Existing details behavior |
| Add controlled status labels and definitions | UX-STA-002, UX-HLP-002 | Improves orientation | 2 | 2 h | Low | Low | Status mapping fixtures |

**Checkpoint C1:** Collapse/restore, exit/resume, Return to Mission Control, and reset confirmation pass keyboard and state-equality tests.

### Phase 2 — Small improvements (approximately one working day)

| Recommendation | IDs | User value | Severity | Risk | Dependencies |
|---|---|---|---:|---|---|
| Convert container to desktop split-view dock | UX-GMJ-001, UX-RSP-001 | Keeps workspace visible | 3 | Medium | Shell grid and viewport tests |
| Implement bounded internal scrolling and limited-height behavior | UX-RSP-003–004 | Keeps core controls reachable | 3 | Low | Sticky header/action region |
| Add semantic container/focus/announcement contracts | UX-ACC-001–003 | Keyboard and screen-reader equivalence | 3 | Medium | Final DOM structure |
| Add first-use hint and supporting term definitions | UX-HLP-001–002, UX-DIS-002 | Reduces onboarding ambiguity | 2 | Low | Session presentation preference |
| Add precise completion header and primary/secondary actions | UX-END-001–004 | Provides credible handoff | 2 | Medium | Existing completion destinations |

**Checkpoint C2:** Exact desktop/mobile geometry, keyboard focus, completion, reset, and console tests pass.

### Phase 3 — Medium features (approximately 2–5 working days)

| Recommendation | IDs | User value | Severity | Risk | Dependencies |
|---|---|---|---:|---|---|
| Read-only completed-stage inspection | UX-NAV-002, UX-COG-001 | Replaces recall with recognition | 3 | Medium–high | Stable stage projections |
| Locked-stage prerequisite explanations | UX-NAV-003, UX-STA-002 | Makes roadmap understandable | 2 | Medium | Eligibility mapping |
| Desktop keyboard/pointer resizing | UX-GMJ-003 | Supports varied enterprise displays | 2 | Medium | Dock completed and stable |
| Deterministic What Changed summaries | UX-AIX-003 | Increases perceived intelligence and trust | 2 | Medium | State-derived summary fixtures |
| Why This Recommendation disclosure | UX-AIX-001 | Improves explainability | 2 | Low–medium | Existing Enterprise Intelligence projection |

**Checkpoint C3:** Mutation guards prove stage review cannot alter Journey, case, artifacts, decisions, or DNA.

### Phase 4 — Strategic enhancements

| Recommendation | IDs | Value | Risk/dependency |
|---|---|---|---|
| Cross-workspace deep links from read-only stage review | UX-NAV-002, UX-DIS-003 | Faster specialist review | Requires a governed navigation contract; must not reconstruct history |
| Persist guide presentation preferences beyond session | UX-GMJ-005 | User efficiency | Requires identity/preferences architecture; must remain outside Journey |
| Broader persona-specific depth presets | UX-PER-001 | Tailored information density | Must remain one shared product and avoid separate state |
| Continuous modernization readiness monitor | UX-END-003 | Long-term operating model | Requires real execution/monitoring capabilities |

### Future vision — not immediate release

- Start Another Initiative only when multi-initiative creation is real.
- Scenario comparison only when governed alternative models exist.
- Download/export only for real stored artifacts.
- Executive presentation generation only when traceable output generation exists.
- No free-moving windows, chat-first journey, autonomous execution, or deceptive AI activity.

## 2. Dependency map

```text
Baseline fixtures
  └── Presentation-state boundary
       ├── Collapse / Restore
       ├── Exit / Resume
       ├── Return to Mission Control
       └── Reset confirmation
            └── Adaptive dock + responsive modes
                 ├── Accessibility/focus/announcements
                 ├── Completion summary
                 └── Completed-stage read-only projections
                      ├── Locked-stage explanations
                      ├── What Changed
                      └── Why This Recommendation
```

## 3. Recommended release sequence

1. Guardrails and state-boundary tests.
2. Collapse/restore and Exit/Resume.
3. Return to Mission Control and reset separation.
4. Desktop dock, tablet drawer, mobile sheet.
5. Accessibility and focus completion.
6. Execution-readiness summary.
7. Read-only completed-stage review.
8. Explainability enhancements.
9. Full regression and release audit.

## 4. Regression risks

| Risk | Impact | Mitigation |
|---|---|---|
| Presentation action invokes reset/replay | Critical state loss | Deep-equality mutation guards; separate handlers |
| Duplicate primary action | Double execution | Retain delegated source control and one handler assertion |
| Dock compresses workspace | Responsive blocker | Enforce width bounds and exact viewport tests |
| Overlay traps focus despite non-modal contract | Accessibility blocker | Semantic/focus tests and manual screen-reader review |
| Read-only review reconstructs or mutates history | Governance violation | Projection-only API and prohibited-call static tests |
| Completion implies execution | Trust issue | Prohibited-copy tests and product-owner review |
| Presentation preference enters Journey/DNA | Architectural violation | Allowed-key schema and storage boundary tests |
| Reset confirmation changes validated reset outcome | Regression | Existing reset snapshots remain authoritative |

## 5. Recommended checkpoints

- **Checkpoint A:** state boundary and one-primary-action tests.
- **Checkpoint B:** open/collapse/restore/exit/resume keyboard flow.
- **Checkpoint C:** four exact viewport checks plus 1280×600 height boundary.
- **Checkpoint D:** completed-stage mutation guard.
- **Checkpoint E:** validation failure/correction/rerun regression.
- **Checkpoint F:** 22-action full journey and DR-SQP-002 isolation.
- **Checkpoint G:** accessibility, console, docs, and product-owner copy review.

## 6. Stop/go gates

- **Stop** if any phase changes Journey state shape or Enterprise DNA authority.
- **Stop** if a second primary action can execute the same transition.
- **Stop** if reset outcomes differ from V1.3.
- **Stop** if exact 390×844 or keyboard-only core actions are blocked.
- **Stop** if read-only inspection mutates state.
- **Stop** if completion copy claims modernization execution/completion.
- **Go** only after all Must acceptance criteria for the phase pass and no Severity 3 regression remains.

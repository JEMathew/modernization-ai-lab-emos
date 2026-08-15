# Persistent Application Navigation — Result

## Objective

Introduce a consistent application-level navigation model across Home, Mission
Control, Modernization HQ, Portfolio Intelligence Lab, and the Guided
Modernization Journey without changing workflow or business logic.

## Navigation UX Review

The previous experience used three disconnected navigation patterns:

- a full-screen landing chooser;
- Mission Control/HQ controls inside the application topbar;
- local Mission Control environment controls;
- a Journey-specific Mission Control return button.

Portfolio Intelligence Lab was another full-screen surface with only local
close/cancel controls. The landing and Lab overlays obscured the topbar, so
users could not see a persistent Home or workspace destination. The Journey
state already survived experience changes, but the UI did not make that
continuity discoverable.

The primary UX risks were:

- users feeling trapped in the Journey or Lab;
- unclear distinction between application destinations and Mission Control
  environments;
- no visible route back to Home;
- no persistent explanation of the current location;
- underlying controls remaining reachable behind full-screen surfaces;
- returning to a Journey while its required workspace was not visible.

## Updated Navigation Model

The product now uses two navigation levels:

1. **Persistent application destinations**
   - Home
   - Mission Control
   - Modernization HQ
   - Portfolio Intelligence Lab
   - Guided Journey, shown contextually after a Journey has started
2. **Mission Control environments**
   - Portfolio
   - Decision Room
   - Modernization Factory

The existing environment navigation remains local to Mission Control.

A persistent orientation trail shows the active destination, selected Mission
Control environment, and current Guided Journey step where applicable.

## UI and Interaction Changes

- Added a fixed primary navigation landmark above every current surface.
- Added one always-visible Home control.
- Reused the existing Mission Control, HQ, and Portfolio Lab controls inside
  the persistent navigation.
- Added a contextual Guided Journey return control.
- Added a live orientation trail and current-page semantics.
- Added a skip link whose target follows the active surface.
- Changed the landing chooser from an incorrectly modal-labelled overlay to a
  labelled Home region.
- Added native `inert` boundaries so Home and Portfolio Lab isolate underlying
  controls from keyboard and assistive-technology navigation.
- Preserved the selected Mission Control environment when switching to HQ and
  back.
- Aligned a resumed Journey to the workspace required by its current step.
- Preserved Journey workflow, evidence, case, progress, width, and
  collapse/restore state when leaving.
- Portfolio Lab now returns to the surface from which it was opened.

## State and Architecture

No new workflow state owner was introduced.

Application orientation is derived from:

- the visibility of Home and Portfolio Lab;
- existing `state.experience`;
- existing `state.view`;
- existing Guided Journey state and current-step calculation.

The only new Lab value records whether the Lab was opened from Home so its
Close and Escape behavior can return to the correct presentation surface. It
does not contain portfolio, workflow, enterprise, or runtime state.

## Files Modified

- `prototype/mission-control/index.html`
- `prototype/mission-control/styles.css`
- `prototype/mission-control/script.js`
- `prototype/mission-control/portfolio-lab-ui.js`
- `prototype/mission-control/tests/application-navigation.test.js`
- `prototype/mission-control/tests/guided-discovery-action.test.js`
- `prototype/mission-control/tests/typography-labels.test.js`
- `work_results/PERSISTENT-APPLICATION-NAVIGATION-result.md`

No Streamlit, engine, Runtime Spine, Enterprise DNA, AI Agency, scoring, or
workflow implementation file changed.

## Browser Validation

Validated in the locally served product:

- Home → Guided Demo.
- Guided Discovery → Step 2.
- Step 2 → Home.
- Home showed `Guided Journey preserved at Capability Formation`.
- Home → Guided Journey returned to Step 2, retained Discovery Complete
  evidence, restored Portfolio, and focused the Journey heading.
- Mission Control → Modernization HQ → Mission Control retained Journey state.
- Mission Control Portfolio → Decision Room → HQ → Mission Control retained
  Decision Room.
- Home → Portfolio Intelligence Lab → Close returned Home.
- Mission Control → Portfolio Intelligence Lab → Close returned Mission
  Control.
- Portfolio Lab received current-page semantics, orientation, heading focus,
  and an inert underlying application.
- Starting Guided Demo after previously visiting Decision Room correctly
  realigned the product to Portfolio and exposed Begin Portfolio Discovery.

No browser runtime failure or missing resource was observed.

## Responsive Validation

| Requested viewport | Actual viewport | Persistent navigation | Home visible | Document overflow |
| --- | --- | --- | --- | --- |
| Desktop | `1440 × 900` | Fixed, full orientation | Yes | None |
| Current viewport | `952 × 924` | Fixed, bounded destinations | Yes | None |
| Tablet portrait | `768 × 1024` | Fixed, bounded destinations | Yes | None |
| Mobile portrait | `390 × 844` | Fixed, horizontally scrollable destinations | Yes, sticky | None |

All primary navigation controls have a minimum height of `44px`. On mobile,
Home remains pinned at the left edge while additional present and future
destinations remain reachable in the navigation’s own horizontal scroller.

## Accessibility Validation

- Primary navigation uses a named `nav` landmark.
- Workspace switches retain button and pressed-state semantics.
- Exactly one application destination receives `aria-current="page"`.
- The orientation trail uses polite, atomic live-region semantics.
- Home and Lab exclude obscured controls using native `inert`.
- Destination controls use native buttons and links, retaining browser keyboard
  activation semantics.
- Navigation changes move focus to the destination heading.
- Guided Journey return moves focus to the current Journey title.
- Skip-link destination follows Home, Lab, Mission Control environment, or HQ.
- Persistent controls provide 44px targets.
- Existing global focus-visible styling remains active.
- No duplicate IDs were introduced.
- The mobile navigation does not create document-level horizontal overflow.
- Existing reduced-motion behavior remains unchanged.

## Regression Results

Commands:

```text
node prototype/mission-control/tests/application-navigation.test.js
node prototype/mission-control/tests/enterprise-dna.test.js
node prototype/mission-control/tests/guided-discovery-action.test.js
node prototype/mission-control/tests/guided-resize.test.js
node prototype/mission-control/tests/portfolio-lab.test.js
node prototype/mission-control/tests/program-intelligence.test.js
node prototype/mission-control/tests/typography-labels.test.js
node --check prototype/mission-control/script.js
node --check prototype/mission-control/portfolio-lab-ui.js
git diff --check
```

Results:

- Persistent application navigation: Pass.
- Enterprise DNA foundation: Pass.
- Guided discovery action: Pass.
- Guided dock-right resize: Pass.
- Portfolio Upload Lab: Pass.
- Multi-case Program Intelligence: Pass.
- Typography and display labels: Pass.
- JavaScript syntax: Pass.
- Diff whitespace: Pass.
- Real-browser navigation, focus, state preservation, responsive, and
  accessibility checks: Pass.

## Known Limitations

- The standalone prototype continues to use hash replacement rather than a
  client-side router.
- Mobile destinations use a horizontal navigation scroller to preserve readable
  labels without redesigning the application header.
- Guided Journey remains a companion to Mission Control or HQ, not a separate
  workflow page.
- Future workspaces require only another persistent destination and derived
  orientation label; no speculative workspace was added in this packet.

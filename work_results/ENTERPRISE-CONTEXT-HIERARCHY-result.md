# Enterprise Context Hierarchy Result

## Enterprise problem addressed

The active modernization case was visible, but its sponsoring business initiative, source portfolio, and owning modernization program were not. This made executive purpose, accountability, and future multi-case ownership difficult to understand.

## Use case matured

A Mission Commander can now trace `DR-CIC-001` from Connected Customer Growth through the Apex Enterprise Technology Portfolio and Customer Intelligence Modernization Program in both Mission Control and Modernization HQ.

## Files changed

- `prototype/mission-control/README.md`
- `prototype/mission-control/enterprise-context.js`
- `prototype/mission-control/index.html`
- `prototype/mission-control/script.js`
- `prototype/mission-control/styles.css`
- `prototype/mission-control/tests/portfolio-lab.test.js`
- `work_results/ENTERPRISE-CONTEXT-HIERARCHY-result.md`

## Commands run

- `node --check prototype/mission-control/enterprise-context.js`
- `node --check prototype/mission-control/script.js`
- `node --check prototype/mission-control/portfolio-lab.js`
- `node --check prototype/mission-control/portfolio-lab-ui.js`
- `node prototype/mission-control/tests/portfolio-lab.test.js`
- `.venv/bin/python -m pytest -q`
- `git diff --check -- prototype/mission-control`
- `python3 -m http.server 8082`
- Browser interaction and visual checks against `http://localhost:8082/`

## Tests run and results

- PASS — Enterprise hierarchy order, unique references, required metadata, case lineage, and unknown-case rejection.
- PASS — Both Mission Control and Modernization HQ render from the same domain definition.
- PASS — Context inspection exposes owner, purpose, outcome, relationship, status, and next responsibility.
- PASS — Portfolio and case statuses update after discovery in both experiences.
- PASS — Full reset clears selected context and restores initial statuses.
- PASS — Portfolio Upload Lab still reaches the metadata-only assessment gate.
- PASS — Guided Demo still starts Portfolio Discovery.
- PASS — Desktop browser check found no horizontal overflow.
- PASS — Responsive rules collapse the hierarchy and detail grid at tablet and mobile breakpoints.
- PASS — Portfolio Upload Lab tests passed.
- PASS — 45 Python regression tests passed.
- PASS — JavaScript syntax and Git whitespace validation passed.

## Acceptance criteria met

- Initiative → Portfolio → Program → Case is visible in both primary experiences.
- Each hierarchy level is clickable and inspectable.
- Static ownership and expected business outcomes are explicit.
- Active case owner, next responsibility, and status come from the existing shared workflow state.
- Reset is recoverable and does not create or mutate a second workflow.
- All data remains synthetic and the domain model remains provider neutral.

## State-model changes

- Added `selectedEnterpriseContextId` as presentation state only.
- Existing case and workflow state remains authoritative for dynamic status, ownership, and next action.
- Reset clears the selected hierarchy level.

## Work objects added or updated

- Added provider-neutral domain records for Business Initiative `BI-CX-2026-01`, Enterprise Portfolio `PF-APEX-TECH-01`, Modernization Program `MP-CI-01`, and existing Modernization Case `DR-CIC-001`.
- No engineering, validation, or decision work objects were duplicated or altered.

## Known limitations

- This slice establishes the hierarchy for one synthetic reference case; it does not yet create or coordinate multiple independent cases.
- Initiative and program status are deterministic projections of the existing case workflow, not persisted enterprise records.
- Tablet and mobile behavior is implemented through CSS breakpoints; no device-specific application state exists.

## Demo steps

1. Run `cd prototype/mission-control && python3 -m http.server 8080`.
2. Open `http://localhost:8080/` and select **Run Guided Demo**.
3. Select each level in the enterprise hierarchy and inspect its accountable owner, purpose, outcome, relationship, and next responsibility.
4. Start Portfolio Discovery and confirm Portfolio and Case statuses update in the hierarchy.
5. Switch to Modernization HQ and confirm the same selected level and status are preserved.
6. Select **Reset Full Demo** and confirm the hierarchy returns to its initial status with no selection.

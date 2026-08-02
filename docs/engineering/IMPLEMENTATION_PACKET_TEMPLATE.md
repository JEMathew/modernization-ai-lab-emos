# Implementation Packet Template

## Document control

| Field | Value |
|---|---|
| Slice ID | `<registry ID>` |
| Name | `<short outcome>` |
| Program / Epic / Feature | `<traceability>` |
| Owner | `<single accountable engineer>` |
| Status | Proposed |
| Target release | `<release ID or unassigned>` |
| Authorities | `<constitution, ARB, PRS, ADR links>` |

## Objective and business value

State one observable outcome and why it matters.

## Scope

### Included

- `<smallest end-to-end behavior>`

### Explicit exclusions

- `<adjacent or later work>`

## Dependencies and readiness

- Predecessor slices:
- Required decisions/contracts:
- Existing behavior baseline:
- Data/configuration prerequisites:

## Expected change set

| File or boundary | Reason |
|---|---|
| `<path>` | `<why it must change>` |

List files that must not change and preserve unrelated working-tree changes.

## Acceptance criteria

1. Given `<context>`, when `<action>`, then `<observable result>`.
2. Failure behavior is explicit and safe.
3. Existing happy path remains unchanged unless the packet explicitly says otherwise.

## Validation plan

- Unit/contract tests:
- Integration/BDD scenarios:
- Browser/accessibility/responsive regression:
- Security checks:
- Reliability/fault checks:
- Performance budget:
- Clean-checkout validation:

## Risks and rollback

| Risk | Mitigation | Rollback signal/action |
|---|---|---|
| `<risk>` | `<control>` | `<safe reversal>` |

## Definition of Done

- [ ] Scope and exclusions satisfied.
- [ ] Acceptance and BDD scenarios pass.
- [ ] Security, reliability, and regression evidence passes.
- [ ] Documentation, ADRs, and registry entries are current.
- [ ] Completion report exists in `work_results/`.
- [ ] Exact commit passes clean-checkout validation.
- [ ] No unrelated file is included.

## Completion report

Record files changed, commands, tests/results, acceptance criteria, security and
reliability review, known issues, rollback, and demo steps in
`work_results/<SLICE-ID>-result.md`.

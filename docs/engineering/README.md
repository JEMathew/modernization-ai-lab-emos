# EMOS Engineering Operating Workspace

## Purpose

This workspace turns approved product and architecture decisions into small,
traceable, independently releasable work. It is a control surface for engineering,
not a new architecture authority.

## Start here for every packet

1. Read the [Product Constitution](../../design/00_PRODUCT_CONSTITUTION.md).
2. Confirm the applicable ARB, PRS, governance, and ADR authorities.
3. Inspect current source, tests, Git status, and prior completion evidence.
4. Select one authorized slice from the [Slice Registry](../backlog/VERTICAL_SLICE_REGISTRY.md).
5. Create the work packet using the [Implementation Packet Template](IMPLEMENTATION_PACKET_TEMPLATE.md).
6. Implement the smallest cohesive change and preserve the happy path.
7. Run the slice, security, reliability, regression, and documentation gates.
8. Create a completion report in repository-root `work_results/`.
9. Update registry status only with review evidence; release inclusion is separate.

## Operating documents

- [Repository Organization](REPOSITORY_ORGANIZATION.md)
- [Architecture Compliance Baseline](ARCHITECTURE_COMPLIANCE_BASELINE.md)
- [Development Standards](DEVELOPMENT_STANDARDS.md)
- [Engineering Metrics](ENGINEERING_METRICS.md)
- [Implementation Packet Template](IMPLEMENTATION_PACKET_TEMPLATE.md)
- [ADR process](../adr/README.md)
- [Engineering Backlog](../backlog/ENGINEERING_BACKLOG.md)
- [Release Registry](../releases/RELEASE_REGISTRY.md)

## State vocabulary

| State | Meaning |
|---|---|
| Proposed | Candidate work without approval |
| Ready | Approved scope and dependencies satisfy Definition of Ready |
| In progress | One owner is implementing the slice |
| Implemented, uncommitted | Working-tree implementation exists but is not reproducible from `HEAD` |
| Complete | Code, tests, evidence, review, and clean-checkout validation are committed |
| Released | A release registry entry includes the complete slice and passes its gate |
| Deferred | Explicitly postponed by ARB, roadmap, or dependency decision |
| Removed | Not approved for the stated product horizon |

“Implemented” is never treated as “released,” and a completion report is not a
substitute for test evidence or a reproducible commit.

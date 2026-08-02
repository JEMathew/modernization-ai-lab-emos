# Architecture Decision Records

ADRs record durable decisions; they do not replace the ARB or approve a feature.

## When an ADR is required

Create an ADR before changing:

- authoritative state ownership or consistency model;
- public command, query, event, evidence, or artifact contracts;
- persistence technology, schema strategy, or recovery boundary;
- dependency direction, package boundary, or deployment unit;
- model/tool/provider adapter strategy;
- identity, tenant, authorization, approval, audit, or secret boundary;
- managed-service selection or material third-party dependency;
- availability, SLO, backup, restore, or release model;
- a previous accepted architecture decision.

Routine implementation inside an accepted design does not need an ADR.

## Lifecycle

`Proposed -> Accepted | Rejected -> Superseded | Deprecated`

1. Copy [`0000-template.md`](0000-template.md) to the next four-digit number.
2. Link governing requirements and affected slices.
3. Document alternatives, consequences, security, reliability, operations, and rollback.
4. Obtain the reviewers required by the governance baseline.
5. Never rewrite an accepted decision to change history; supersede it with a new ADR.

The consolidated historical runtime decisions in
[`13_RUNTIME_ADRS.md`](../enterprise-runtime-foundation/13_RUNTIME_ADRS.md) remain
reference input. New decisions use one file per ADR here.

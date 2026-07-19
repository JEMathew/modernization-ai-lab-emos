# Availability Strategy

## Service Tiers and SLOs

Initial SLOs are targets for validation during pilot; they are not claims about the current prototype.

| Service indicator | Standard target | Higher-isolation target |
|---|---:|---:|
| Mission Control/API successful requests | 99.90% monthly | 99.95% monthly |
| Workflow command acceptance | 99.90% monthly | 99.95% monthly |
| Workflow state read freshness | 99% within 5 seconds | 99% within 2 seconds |
| Approval service availability | 99.95% monthly | 99.99% monthly |
| Audit commit availability for governed actions | 99.95% monthly | 99.99% monthly |

Asynchronous workflow completion is measured separately by deadline attainment; it must not be hidden inside API availability.

## Recovery Objectives

| Capability | Standard RTO/RPO | Higher-isolation RTO/RPO |
|---|---|---|
| Transactional workflow and trust state | 60 min / 5 min | 15 min / 1 min |
| Evidence artifacts | 4 hr / 15 min | 60 min / 5 min |
| Mission Control projections | 4 hr / rebuildable | 60 min / rebuildable |
| Cache/search | 8 hr / rebuildable | 4 hr / rebuildable |

Acknowledged workflow transitions, approvals, and audit/outbox records are committed transactionally. The infrastructure RPO is not permission to silently lose those records; reconciliation and operator notification are mandatory after recovery.

## Topology

- Stateless APIs and gateways run across at least two failure zones.
- Workers use distributed leases and can restart in another zone.
- Transactional stores use managed multi-zone high availability.
- Queues and object stores use managed durability and replication.
- Regional failover is warm standby initially; active/active is deferred until business need and conflict semantics justify it.
- Provider routing supports multiple models/providers without assuming identical behavior.

## Health Model

| Probe | Meaning | Traffic effect |
|---|---|---|
| Liveness | Process can make progress | Restart only on sustained failure |
| Readiness | Instance can safely serve its role | Remove from traffic |
| Dependency health | Downstream service condition | Degrade/reroute, not necessarily restart |
| Synthetic journey | User-critical path works | Page and influence release decisions |

Health checks are shallow, fast, and do not create side effects. Dependency status is separately exposed to prevent restart storms.

## Failover Procedure

1. Incident command confirms scope and data integrity risk.
2. Freeze nonessential mutations if state convergence is uncertain.
3. Promote regional data services using approved runbook.
4. Shift stateless traffic and restart workers from durable leases/checkpoints.
5. Reconcile outbox, queue, approval, audit, and external effects.
6. Run synthetic journeys and compare state counts/hashes.
7. Reopen mutations, communicate status, and retain recovery evidence.

## Dependency Availability

Model and tool dependencies have independent health scores, concurrency budgets, and circuit breakers. Routing chooses only policy-compatible alternatives. If no compatible dependency exists, workflows wait with an explicit reason and next action. Authorization, audit, and approval services fail closed for governed mutations.

## Maintenance and Release Availability

- Rolling or blue/green deployment for stateless services.
- Expand/contract data changes with mixed-version compatibility.
- Workflow definitions are immutable and version-pinned.
- Feature flags include owner, expiry, audit history, and safe default.
- Release health compares canary error rate, latency, workflow correctness, and cost before promotion.

## Error Budgets

Each SLO has a monthly error budget. Burning 25% in 24 hours or 50% in seven days stops nonessential releases and triggers reliability review. Budget policy excludes approved planned maintenance only when contractually allowed; provider failures remain visible even if contract attribution differs.

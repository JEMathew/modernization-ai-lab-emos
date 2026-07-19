# Scalability Strategy

## Scaling Dimensions

The system must scale independently across tenants, users, cases, concurrent workflows, agent tasks, context size, Enterprise DNA entities/relationships, evidence volume, queue depth, and provider/tool demand.

## Partitioning Model

| Workload | Primary partition | Secondary controls |
|---|---|---|
| API/session | `tenant_id` | subject, region |
| Workflow | `tenant_id`, `workflow_id` | priority, definition |
| Agent task | tenant queue or fair-share shard | model/tool class |
| Enterprise DNA | `tenant_id`, entity namespace | snapshot/version |
| Evidence | `tenant_id`, case/workflow | classification, retention |
| Audit | `tenant_id`, time bucket | actor/action |
| Metrics | service/tenant tier | bounded tenant labels |

Tenant is always part of the physical or logical partition key. Extremely large tenants may receive dedicated shards; small tenants share capacity behind fair scheduling.

## Horizontal Scaling

- Stateless APIs, policy decision points, gateways, and workers scale horizontally.
- Queue depth, oldest-message age, task latency, and provider headroom drive worker scaling.
- Work types use separate pools: interactive, batch, tool side effect, context/indexing, and recovery.
- Long-running work is decomposed into bounded durable tasks rather than held in web requests.
- Autoscaling respects downstream concurrency and cost limits to prevent overload amplification.

## Enterprise DNA at Scale

The transactional source stores governed entities and relationships. Read-optimized projections support Mission Control and bounded dependency traversal. Start with indexed relational adjacency and materialized projections; introduce a graph engine only when measured traversal complexity or latency requires it. Snapshot creation is incremental and content-addressed.

Traversal APIs require depth, node-count, time, and classification limits. Expensive analytics run asynchronously and publish versioned results.

## Context and Memory Scale

- Context assembly uses retrieval budgets, ranked evidence, and deterministic truncation.
- Large artifacts remain in object storage; prompts carry selected excerpts and references.
- Reusable embeddings/indexes are tenant-scoped and versioned.
- Agent memory has per-scope size, retention, and cost quotas.
- Compaction produces a traceable summary linked to source evidence; it never replaces authoritative facts.

## Admission Control and Backpressure

Requests are admitted using tenant entitlement, risk class, concurrency, estimated token/tool cost, and system headroom. Excess work is queued with position/ETA or rejected with a retryable response. Queue aging prevents starvation; priority cannot bypass trust controls.

## Quotas

Quotas cover concurrent workflows, model tokens, tool calls, evidence storage, DNA entities/edges, API rate, and background jobs. Limits are observable and configurable per tenant tier. Hard safety limits cannot be raised by ordinary tenant administrators.

## Noisy-Neighbor Protection

- Weighted fair queues and per-tenant concurrency semaphores.
- Per-provider and per-tool bulkheads.
- Query cost limits and statement timeouts.
- Memory/CPU limits per worker task.
- Tenant-attributed cost and saturation telemetry.
- Optional dedicated compute, keys, and data stores for regulated or high-scale tenants.

## Capacity Planning

Capacity models use active users, workflow arrival rate, tasks per workflow, token distribution, tool latency, evidence growth, and DNA graph growth. Quarterly forecasts cover normal, peak, provider-failover, and regional-failover conditions. Load tests must include skewed tenants and retry storms, not only uniform traffic.

## Scale Gates

- Add queue partitions when shard utilization or oldest age violates target under failover load.
- Add read replicas/projections when authoritative read load reaches 60% sustained capacity.
- Evaluate graph storage only after bounded traversal misses its SLO at representative scale.
- Evaluate Kubernetes only when scheduling/isolation requirements exceed the selected managed container platform.
- Move to dedicated tenant infrastructure based on regulatory need, sustained load, or isolation contract—not vanity scale.

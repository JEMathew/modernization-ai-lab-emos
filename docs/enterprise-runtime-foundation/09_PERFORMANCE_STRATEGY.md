# Performance Strategy

## Principle

Performance budgets protect the Mission Commander experience and bound runtime cost. Provider latency is reported separately from platform overhead so external slowness cannot conceal internal regressions.

## Initial Budgets

These are target budgets to validate with representative synthetic enterprise data.

| Path | Target |
|---|---:|
| Mission Control largest contentful paint, p75 | <= 2.5 s |
| Mission Control interaction response, p75 | <= 200 ms |
| Product API read, p95 | <= 500 ms |
| Workflow command acceptance, p95 | <= 2 s |
| Agent task scheduling overhead, p95 | <= 1 s |
| First agent task starts after accepted workflow, p95 | <= 3 s |
| Model routing/policy overhead, p95 | <= 100 ms |
| Context assembly for interactive request, p95 | <= 1.5 s |
| Enterprise DNA point query, p95 | <= 300 ms |
| Bounded dependency traversal, p95 | <= 2 s |
| Tool Gateway overhead excluding provider, p95 | <= 250 ms |
| Queue enqueue, p95 | <= 100 ms |
| Ready-task dispatch, p95 | <= 500 ms |
| Recommendation first token when streaming, p95 | <= 2 s plus provider |
| Interactive recommendation complete, p95 | <= 15 s end-to-end |

Background workflows have explicit deadlines by workflow definition rather than a universal interactive target.

## Budget Decomposition

Every trace reports queue wait, admission, policy, DNA/evidence retrieval, context assembly, provider time, parsing/validation, persistence, and presentation separately. The workflow deadline is propagated to downstream calls; components reject work they cannot complete inside the remaining budget.

## Optimization Order

1. Remove unbounded queries and prompt/context growth.
2. Move long work out of synchronous request paths.
3. Index authoritative queries and precompute stable summaries.
4. Cache only policy-safe, version-addressed data.
5. Batch independent reads/model requests where correctness permits.
6. Scale resources after algorithmic and contention issues are addressed.

## Caching

Cache keys include tenant, authorization-relevant scope, data version, policy version, and locale where applicable. Enterprise DNA snapshots and immutable artifacts are cache-friendly. Approval, revocation, and current authorization decisions use short TTLs or active invalidation. A cache miss must not change correctness.

## Model and Context Efficiency

- Route to the smallest policy-approved model meeting task quality needs.
- Enforce prompt, completion, and total workflow token budgets.
- Retrieve evidence by relevance and authority, with deterministic maximums.
- Parallelize independent specialist analysis with bounded fan-out.
- Validate structured outputs once at the gateway boundary.
- Record model latency, token use, cache hits, and fallback reason.

## Performance Testing

- Browser performance tests at supported viewports and constrained network/CPU profiles.
- API and queue load tests at expected, 2x peak, failover, and noisy-neighbor loads.
- DNA traversal tests with representative topology and high-degree nodes.
- Context tests with near-limit evidence sets.
- Provider simulations for latency, 429, timeout, malformed output, and stream interruption.
- Soak tests for memory leaks, lease churn, queue age, and cost drift.

Regression gates block release for material SLO degradation unless an explicit, time-bounded exception is approved.

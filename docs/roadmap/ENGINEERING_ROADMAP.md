# EMOS Engineering Roadmap

This roadmap is dependency-led, not date-led. The detailed approved sequence is
the [Runtime Spine Implementation Plan](../enterprise-runtime-foundation/020_RUNTIME_SPINE_IMPLEMENTATION_PLAN.md);
the ARB controls scope.

| Horizon | Outcome | Slice boundary | Exit decision |
|---|---|---|---|
| H0 — Repository integrity | Exact baseline is reproducible and governed | BASE-01 and RS-01–RS-03 complete | Complete; clean checkout and registry evidence passed |
| H1 — Compatibility seam | Current Journey can use typed in-process boundary without behavior change | RS-03–RS-04 | Sprint 1 gate |
| H2 — Durable local spine | One workflow persists state, snapshots, and authoritative status | RS-05–RS-08 | Sprint 2 gate |
| H3 — Bounded asynchronous execution | One task stores artifacts and completes through outbox/queue/worker | RS-09–RS-12 | Sprint 3 gate |
| H4 — Recovery semantics | Duplicate delivery, ambiguous effects, pause/resume, and restart are safe | RS-13–RS-17 | Sprint 4 gate |
| H5 — Candidate conformance | Managed adapters, safety, faults, performance, regressions, and rollback qualify | RS-18–RS-24 | Runtime Epic exit; not pilot approval |
| H6 — Trust and governed intelligence | Identity, tenant, policy, approval, audit, model/tool controls | New approved slice plans required | Trust and AI evaluation gates |
| H7 — Operable controlled pilot | Managed deployment, SLOs, runbooks, restore, release evidence | New approved operating slices required | ARB pilot go/no-go |

## Sequencing constraints

- BASE-01 is complete and remains the required release boundary for later
  integration; intentionally uncommitted product work is outside that boundary.
- RS-03 is reviewed, committed, clean-checkout verified, and remains inactive.
- Runtime does not activate before the compatibility slice.
- Durable state precedes queue/worker execution.
- Idempotency, effect records, and checkpoints precede recovery claims.
- Tenant enforcement and approval are required before governed external effects.
- Controlled Pilot is a separate authorization, not the automatic result of RS-24.

## Explicit deferrals

Kubernetes, service mesh, microservice decomposition, custom identity/policy/
queue/database/telemetry platforms, graph-database adoption, active/active
multi-region writes, autonomous remediation, arbitrary code execution, broad
connector marketplaces, and self-modifying agents remain deferred or removed as
specified by the ARB.

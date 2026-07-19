# Operations Architecture

## Operating Model

Operations is a first-class plane, not a collection of post-launch dashboards. Product engineering owns service health; an SRE function defines reliability standards, supports incident command, and builds shared operational capabilities. Security and AI Platform participate in rotations for their domains.

## Operational Components

| Component | Responsibility |
|---|---|
| Service catalog | Ownership, dependencies, tier, runbooks, SLOs |
| Telemetry pipeline | Collect, process, route, retain signals |
| SLO platform | Indicators, budgets, burn alerts |
| Incident platform | Paging, command, timeline, communication |
| Deployment controller | Progressive delivery and rollback |
| Configuration/feature flags | Versioned, audited runtime configuration |
| Capacity service | Forecasts, quotas, saturation, admission inputs |
| FinOps analytics | Tenant/workflow/model/tool unit economics |
| Synthetic monitors | Critical user and workflow probes |
| Recovery automation | Backup validation, restore, reconciliation |

## Service Ownership

Every production component has one accountable team, primary/secondary on-call, tier, SLO, dependency map, dashboard, alert set, runbook, recovery objective, data classification, and deprecation plan. Unowned services cannot reach production.

## Incident Management

Severity is based on customer impact, data/control integrity, and blast radius. Security or tenant-isolation events are high severity even with low request volume. Incident command separates commander, operations lead, communications, and scribe. Changes during incidents use break-glass controls and are reviewed afterward.

Required lifecycle:

1. Detect and classify.
2. Contain unsafe mutations.
3. Mitigate user impact.
4. Recover and reconcile state.
5. Communicate facts and uncertainty.
6. Preserve evidence.
7. Complete blameless review with owned actions.

## Release Engineering

- Reproducible builds, signed artifacts, software bill of materials, and provenance.
- Automated unit, contract, security, migration, accessibility, and journey gates.
- Environment promotion of the same artifact.
- Canary or blue/green rollout with automated health comparison.
- Feature flags default safe, expire, and are auditable.
- Workflow definitions, prompts, policies, model routes, and tool schemas are independently versioned.
- Rollback plans include data and in-flight workflow compatibility.

## Configuration and Secrets

Configuration is schema-validated, environment-specific, versioned, and never bundled with secrets. Secrets reside in a managed secret service, use workload identity where possible, rotate automatically, and never enter prompts/logs. Emergency access is time-limited and independently audited.

## Capacity and Cost Operations

Capacity dashboards show concurrency, queue age, database saturation, model quotas, tool quotas, storage growth, and recovery headroom. Cost is attributed to tenant, workflow, agent, model, and tool. Budgets generate warnings, admission decisions, and approved fallback routing; cost policy must not silently lower required quality or control.

## AIOps Boundaries

Automation may correlate signals, summarize incidents, propose remediation, and execute preapproved reversible runbooks. It may not suppress high-severity alerts, broaden access, alter policy, delete evidence, or perform irreversible remediation without human authorization. AIOps activity is itself observable and auditable.

## Runbook Minimums

- Provider/model outage
- Tool outage or ambiguous side effect
- Workflow queue saturation
- Transactional store failover
- Audit pipeline degradation
- Policy service outage
- Tenant-isolation suspicion
- Credential exposure
- Prompt-injection campaign
- Regional evacuation and restoration
- Cost anomaly
- Workflow-definition rollback

## Operational Readiness Review

Before production, each service demonstrates SLOs, alerts, dashboards, load limits, runbooks, backup restoration, dependency failure behavior, on-call training, and an ownership acceptance. A pilot may proceed only with bounded tenants and explicit manual rollback paths.

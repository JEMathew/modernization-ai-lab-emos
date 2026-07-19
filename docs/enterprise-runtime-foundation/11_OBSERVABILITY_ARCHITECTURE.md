# Observability Architecture

## Goals

Observability must explain what the user experienced, what the workflow decided, which evidence and controls applied, where time/cost accrued, and whether execution was safe—without logging sensitive prompts, secrets, or chain-of-thought.

## Standard

Use OpenTelemetry-compatible traces, metrics, and structured logs. Telemetry schemas are versioned and validated. Vendor-specific exporters remain replaceable.

## Correlation Model

Signals carry the applicable identifiers:

- `tenant_id`, `subject_id`, `session_id`
- `case_id`, `workflow_id`, `run_id`, `task_id`
- `agent_run_id`, `model_request_id`, `tool_invocation_id`
- `dna_snapshot_id`, `evidence_id`, `approval_id`
- `trace_id`, `span_id`, `correlation_id`, `causation_id`
- service/version/environment/region

High-cardinality identifiers belong in traces/logs, not unrestricted metric labels.

## Trace Topology

One user command begins a trace that links asynchronous workflow spans through persisted trace context. Major spans cover admission, authentication, authorization, workflow transition, queue wait, agent execution, context assembly, evidence retrieval, policy evaluation, model routing/call, output validation, tool authorization/call, approval wait, artifact commit, and projection update.

Long waits use span links/events rather than holding a single open span indefinitely.

## Metrics

### User and Workflow

- Command success, error, and latency by operation.
- Workflow starts, completions, cancellations, failures, and deadline attainment.
- Time in each state; waiting reason; approval age.
- Queue depth, oldest age, dispatch latency, retries, dead letters.

### AI Runtime

- Agent success, retry, handoff, and quality evaluation.
- Model latency, availability, token use, structured-output validity, fallback.
- Context items/bytes/tokens, retrieval quality, truncation, provenance coverage.
- Tool latency, authorization outcome, ambiguous effect, reconciliation result.

### Trust

- Policy allow/deny/error, approval request/outcome/expiry.
- Injection and taint detections, sensitive-data blocks, sandbox violations.
- Evidence freshness, confidence distribution, audit commit failures.

### Platform

- Saturation, errors, latency, traffic, resource use, replication lag, backup age.
- Tenant fairness, quota use, cost per workflow/outcome, provider headroom.

## Structured Logs

Logs record event name, timestamp, severity, actor/workload, operation, result, safe error code, identifiers, latency, version, and payload hashes/references. Raw prompts, model reasoning, secrets, credentials, and unrestricted enterprise content are prohibited. Stack traces are restricted to controlled stores.

## AI Decision Trajectory

A trajectory is a governed operational record, not hidden reasoning. It includes task objective, selected evidence references, context policy, model/provider/version, prompt-template version and hash, tool proposals/results, validation results, confidence, policy decisions, human approvals, final artifact reference, and timestamps. It excludes chain-of-thought and minimizes sensitive content.

## Privacy and Security

- Classification-aware collection at source.
- Redaction/tokenization before export.
- Tenant-isolated access and retention.
- Role-separated access to operational versus audit data.
- Sampling never drops security, approval, failure, or high-risk traces.
- Telemetry exports are encrypted and region/policy constrained.
- Access to sensitive diagnostics is audited.

## Alerts

Alerts are actionable, symptom-oriented, and tied to an owner/runbook. Multi-window burn alerts cover SLOs; separate alerts cover audit failure, policy errors, tenant mismatch, ambiguous tool effects, approval backlog, queue starvation, provider exhaustion, backup age, and anomalous cost. Dashboard-only conditions do not page.

## Retention

Metrics, traces, logs, trajectories, and audit have distinct retention schedules. Audit and evidence follow governance obligations; operational telemetry uses shorter periods and aggregation. Deletion/legal hold is tenant-aware.

## Validation

Contract tests verify required fields and redaction. Synthetic journeys assert end-to-end trace continuity. Periodic access reviews verify that tenant users, operators, security, and auditors see only authorized signal classes.

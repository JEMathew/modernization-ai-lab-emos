# Trust and Control Architecture

## Trust Principle

No model, agent, tool, user interface, or network location is inherently trusted. Authority is explicit, least-privileged, time-bounded, tenant-scoped, and evaluated at every consequential boundary.

## Components

| Component | Responsibility |
|---|---|
| Identity broker | Human federation, MFA, session assurance |
| Workload identity | Short-lived service/agent identity |
| Authorization service | RBAC plus attribute/policy decisions |
| Policy administration | Versioned policy authoring, review, deployment |
| Approval service | Human authorization bound to exact action/evidence |
| Evidence service | Provenance, classification, integrity, confidence |
| Tool authorization gateway | Capability tokens and side-effect enforcement |
| Content defense | Injection, exfiltration, malware, unsafe-output controls |
| Audit ledger | Tamper-evident action and decision history |
| Key/secret services | Encryption and credential lifecycle |
| Runtime sandbox | Network, filesystem, resource, and execution isolation |

## Identity and Authorization

Human identity comes from enterprise federation with MFA and session-risk signals. Agents and services use workload identity, never shared API keys. Authorization combines roles with attributes including tenant, data classification, case, environment, action risk, workflow stage, device/session assurance, and purpose.

The policy enforcement point receives a signed decision containing policy version, subject, resource, action, conditions, expiry, and decision ID. Trust services fail closed for mutations when a decision cannot be obtained.

## Agent Authority

An agent receives a narrow task capability: allowed evidence, models, tools, actions, token/cost budget, expiry, and tenant/case scope. Agents cannot delegate broader authority. Specialist output is a proposal until validated and committed by the orchestrator.

## Tool Control

1. Model/agent proposes a typed tool action.
2. Gateway validates schema and provenance.
3. Policy evaluates actor, tenant, risk, resource, and current workflow state.
4. High-risk action creates an approval request.
5. Gateway issues a single-purpose, short-lived capability token.
6. Sandbox executes with network/resource allowlists.
7. Effect registry and audit store outcome before workflow advances.

Credentials are injected only at the gateway/executor and are never visible to a model.

## Prompt-Injection and Content Defense

All external and enterprise content is untrusted data. The context service preserves source boundaries and taint labels; retrieved content cannot redefine system policy or tool authority. Controls include MIME/schema validation, malware scanning, instruction-pattern detection, data-loss prevention, provenance ranking, output validation, URL/network allowlists, and human review for high-risk anomalies.

Detection raises risk and may quarantine content or stop the workflow. It never relies on a single classifier.

## Human Approval

Approval is required by policy for high-risk decisions, irreversible writes, production changes, broad data export, privilege change, or evidence below threshold. The approver sees action, target, impact, evidence, confidence, objections, model/tool versions, and expiry. Approval is cryptographically bound to the proposal/evidence manifest hash; changed inputs invalidate it.

## Evidence and Confidence

Every material claim references evidence with source, acquisition time, owner, classification, integrity hash, freshness, extraction method, and corroboration. Confidence is calculated from transparent components such as source authority, completeness, freshness, corroboration, extraction certainty, and conflict penalty. Models may explain a score but do not invent it.

Trust scores never replace policy or human accountability. Low confidence results in additional evidence, narrowed recommendation, or blocked action.

## Data Protection

- Encryption in transit and at rest with managed tenant-aware keys.
- Field/object classification and regional residency enforcement.
- Minimized model context and provider data-retention controls.
- Separate secrets, evidence payload, metadata, and telemetry stores.
- Tenant-scoped backup, export, deletion, and legal hold.
- No production enterprise data in lower environments; approved synthetic fixtures only.

## Audit

Audit records authentication, authorization, context/evidence selection, model/tool invocation metadata, approvals, state changes, configuration/policy changes, administrative access, and break-glass actions. Records are append-only, integrity-protected, time-synchronized, exportable, and inaccessible for modification by normal operators.

## Threats and Controls

| Threat | Primary controls |
|---|---|
| Cross-tenant access | Tenant keys, policy checks, partitioning, tests |
| Prompt injection | Taint, context separation, least authority, output checks |
| Tool abuse | Typed gateway, policy, capability tokens, sandbox, approval |
| Data exfiltration | DLP, egress allowlists, minimization, audit |
| Model/provider compromise | Provider abstraction, signed config, validation, fallback |
| Insider abuse | Segregation, JIT access, immutable audit, review |
| Supply-chain compromise | Signed builds, SBOM, provenance, dependency scanning |
| Replay/duplicate execution | Nonces, idempotency, expiry, effect registry |

## Assurance

Threat modeling, abuse-case tests, tenant-isolation tests, policy unit/decision tests, penetration tests, dependency scanning, key-rotation drills, approval-bypass tests, and independent audit-log integrity checks are release requirements appropriate to risk.

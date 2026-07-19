# Enterprise Runtime Foundation — Sequence Diagrams

**Status:** Proposed architecture
**Implementation status:** Design only

## 1. Start a modernization workflow

```mermaid
sequenceDiagram
  autonumber
  actor User as Mission Commander
  participant UI as Mission Control
  participant ID as Identity/Policy
  participant WF as Workflow Engine
  participant DNA as Enterprise DNA
  participant CE as Context Engine
  participant Q as Queue Manager
  participant A as Agent Runtime
  participant CP as Checkpoint Engine
  participant AU as Audit Ledger

  User->>UI: Start governed workflow
  UI->>ID: Authorize actor, tenant, case, action
  ID-->>UI: Permit with conditions + decision ID
  UI->>WF: StartWorkflow(idempotency key, case, definition)
  WF->>WF: Persist run + outbox atomically
  WF->>AU: workflow.started with policy decision
  WF->>DNA: Request authorized snapshot
  DNA-->>WF: Snapshot ID and version
  WF->>CE: Build context manifest
  CE-->>WF: Context package reference
  WF->>CP: Commit pre-task checkpoint
  WF->>Q: Enqueue specialist task
  Q->>A: Deliver signed task envelope
  A-->>WF: Task accepted
  WF-->>UI: Running projection and current owner
```

## 2. Agent reasoning with model routing

```mermaid
sequenceDiagram
  autonumber
  participant A as Agent Runtime
  participant CE as Context Engine
  participant PD as Prompt Defense
  participant PE as Policy Engine
  participant MR as Model Router
  participant P1 as Primary Provider
  participant P2 as Alternate Provider
  participant EV as Evidence/Confidence
  participant CP as Checkpoint Engine

  A->>CE: Request task-scoped context
  CE->>PD: Classify and sanitize untrusted content
  PD-->>CE: Trust labels, removed instructions, warnings
  CE->>PE: Authorize context fields and data class
  PE-->>CE: Permit with redaction conditions
  CE-->>A: Versioned context manifest
  A->>MR: Invoke capability with SLA, policy, budget
  MR->>PE: Authorize provider/model/data region
  PE-->>MR: Allowed routes and limits
  MR->>P1: Structured request
  alt Primary succeeds
    P1-->>MR: Structured response
  else Timeout or open circuit
    MR->>P2: Fallback request
    P2-->>MR: Structured response
  else No provider allowed/healthy
    MR-->>A: Explicit deterministic-fallback route
  end
  MR-->>A: Response + usage + route receipt
  A->>EV: Validate schema, evidence coverage, consistency
  EV-->>A: Confidence components and trust score
  A->>CP: Commit result and receipts
```

## 3. Governed tool invocation

```mermaid
sequenceDiagram
  autonumber
  participant A as Agent Runtime
  participant TR as Tool Router
  participant TA as Tool Authorization
  participant HA as Human Approval
  participant AD as Adapter/MCP Gateway
  participant T as Enterprise Tool
  participant AU as Audit Ledger
  participant CP as Checkpoint Engine

  A->>TR: Request tool action with intent and evidence
  TR->>TA: Evaluate actor, agent, tool, resource, risk
  alt Low-risk permitted action
    TA-->>TR: Permit with scopes and expiry
  else Human approval required
    TA-->>TR: Approval required
    TR->>HA: Create approval bound to exact action hash
    HA-->>TR: Approved by authorized Mission Commander
  else Denied
    TA-->>TR: Deny with policy reason
    TR-->>A: Controlled denial
  end
  TR->>CP: Commit pre-side-effect checkpoint
  TR->>AD: Signed invocation + idempotency key + short-lived token
  AD->>T: Allowlisted operation
  T-->>AD: Outcome / external receipt
  AD-->>TR: Normalized result + side-effect receipt
  TR->>AU: Append invocation and authorization evidence
  TR->>CP: Commit post-side-effect checkpoint
  TR-->>A: Result reference
```

## 4. Prompt-injection detection

```mermaid
sequenceDiagram
  autonumber
  participant CE as Context Engine
  participant PD as Prompt Defense
  participant PE as Policy Engine
  participant A as Agent Runtime
  participant SOC as Security Operations
  participant AU as Audit Ledger

  CE->>PD: Inspect uploaded/tool-retrieved content
  PD->>PD: Detect instruction patterns and classify provenance
  alt Benign data
    PD-->>CE: Data-only content with trust labels
  else Suspicious content
    PD->>PE: Evaluate quarantine policy
    PE-->>PD: Remove, quarantine, or require review
    PD->>AU: content.security_flagged
    PD->>SOC: Security signal with redacted sample/hash
    PD-->>CE: Sanitized content + warning metadata
  else Critical exfiltration attempt
    PD->>AU: content.blocked
    PD->>SOC: High-severity alert
    PD-->>CE: Blocked
  end
  CE-->>A: Only authorized context or controlled failure
```

## 5. Checkpoint recovery after worker failure

```mermaid
sequenceDiagram
  autonumber
  participant WF as Workflow Engine
  participant Q as Queue Manager
  participant W1 as Worker 1
  participant CP as Checkpoint Engine
  participant W2 as Worker 2
  participant AU as Audit Ledger

  WF->>CP: Load last committed checkpoint
  WF->>Q: Dispatch task with attempt and idempotency key
  Q->>W1: Lease task
  W1->>CP: Record progress before side effect
  W1--xQ: Worker terminates
  Q->>WF: Lease expired
  WF->>AU: task.retry_scheduled
  WF->>CP: Reconcile side-effect receipts
  alt No side effect committed
    WF->>Q: Redispatch same task
  else Side effect already committed
    WF->>WF: Reuse receipt; skip duplicate invocation
  else Outcome uncertain
    WF->>WF: Pause and create reconciliation task
  end
  Q->>W2: Deliver recovered task
  W2->>CP: Resume from checkpoint
  W2-->>WF: Complete with prior/new receipt
```

## 6. Human approval with evidence binding

```mermaid
sequenceDiagram
  autonumber
  participant WF as Workflow Engine
  participant EV as Evidence Engine
  participant HA as Human Approval
  actor User as Approver
  participant AU as Audit Ledger

  WF->>EV: Freeze evidence manifest and proposed action
  EV-->>WF: Immutable evidence/action hash
  WF->>HA: Request approval with role and expiry
  HA->>User: Present decision, alternatives, risk, evidence
  User->>HA: Approve / reject / request evidence
  HA->>HA: Verify identity, role, freshness, segregation
  HA->>AU: Append signed decision record
  HA-->>WF: Decision + conditions + evidence hash
  alt Evidence/action changed
    WF->>HA: Invalidate approval and request again
  else Approved and unchanged
    WF->>WF: Continue guarded transition
  else Rejected or evidence requested
    WF->>WF: Pause or route evidence task
  end
```

## 7. Session recovery

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant UI as Mission Control
  participant SE as Session Engine
  participant WF as Workflow Engine
  participant CP as Checkpoint Engine
  participant PE as Policy Engine

  User->>UI: Resume active case
  UI->>SE: ResumeSession(session token)
  SE->>PE: Re-authorize user, tenant, case
  PE-->>SE: Permit with current conditions
  SE->>WF: Load active run projection
  WF->>CP: Resolve latest valid checkpoint
  CP-->>WF: State sequence and pending action
  WF-->>SE: Current stage, owner, blocker, next action
  SE-->>UI: Rehydrated projection; no workflow replay
```

## 8. Disaster recovery promotion

```mermaid
sequenceDiagram
  autonumber
  participant Mon as Monitoring
  participant IC as Incident Commander
  participant DR as Recovery Controller
  participant Data as Backup/Replication Catalog
  participant Sec as Secondary Region
  participant DNS as Traffic Manager

  Mon->>IC: Primary region unavailable
  IC->>DR: Authorize declared disaster procedure
  DR->>Data: Verify replication and recovery points
  Data-->>DR: Valid RPO and integrity status
  DR->>Sec: Promote transactional, DNA, audit, and artifact services
  Sec-->>DR: Readiness checks passed
  DR->>DNS: Shift controlled traffic
  DNS-->>DR: Traffic active in secondary
  DR->>Mon: Start workflow reconciliation and SLO watch
  Mon-->>IC: Recovery status and residual risk
```

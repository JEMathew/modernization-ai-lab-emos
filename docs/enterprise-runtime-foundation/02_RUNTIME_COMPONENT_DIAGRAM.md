# Enterprise Runtime Foundation — Component Diagram

**Status:** Proposed architecture
**Implementation status:** Design only

## 1. Logical component model

```mermaid
flowchart TB
  subgraph Product["Product & Intelligence Plane"]
    MC["Mission Control"]
    HQ["Modernization HQ"]
    EI["Enterprise Intelligence"]
    API["Experience API / BFF"]
    MC --> API
    HQ --> API
    EI --> API
  end

  subgraph Trust["Trust & Control Plane"]
    ID["Identity Broker"]
    AZ["Authorization + Policy Engine"]
    RP["Runtime Protection"]
    PD["Prompt / Content Defense"]
    TA["Tool Authorization"]
    HA["Human Approval"]
    EV["Evidence Engine"]
    CF["Confidence + Trust Score"]
    AU["Immutable Audit Ledger"]
  end

  subgraph Runtime["Runtime & Execution Plane"]
    GW["Command Gateway"]
    WF["Durable Workflow Engine"]
    SE["Session Engine"]
    CE["Context Engine"]
    CP["Checkpoint Engine"]
    AR["Agent Runtime"]
    MR["Model Router"]
    SR["Skill Router"]
    TR["Tool Router"]
    MM["Scoped Memory"]
    QM["Queue Manager"]
    AS["Artifact Service"]

    GW --> WF
    WF <--> SE
    WF <--> CP
    WF --> QM --> AR
    AR --> CE
    AR --> SR
    AR --> MR
    AR --> TR
    AR <--> MM
    AR --> AS
  end

  subgraph Data["Authoritative Data Services"]
    DB[("Transactional Store")]
    DNA[("Enterprise DNA")]
    OBJ[("Versioned Object Store")]
    CACHE[("Non-authoritative Cache")]
    BUS[("Durable Queue / Event Stream")]
  end

  subgraph External["Governed External Capabilities"]
    LLM["LLM Providers"]
    MCP["MCP Tool Adapters"]
    A2A["Future A2A Gateway"]
    ENT["Enterprise Systems"]
  end

  subgraph Ops["Operations Plane"]
    OT["OpenTelemetry Collectors"]
    OBS["Logs · Metrics · Traces"]
    SLO["SLO / Alerting"]
    DEP["Deployment + Feature Flags"]
    CAP["Capacity + FinOps"]
    DR["Backup · Restore · DR"]
    OT --> OBS --> SLO
    OBS --> CAP
  end

  API --> ID
  API --> GW
  GW --> AZ
  WF --> AZ
  CE --> AZ
  TR --> TA
  MR --> RP
  CE --> PD
  WF --> HA
  AR --> EV --> CF
  AZ --> AU
  HA --> AU
  EV --> AU
  WF --> AU

  WF <--> DB
  SE <--> DB
  CP <--> DB
  CE <--> DNA
  CE <--> CACHE
  MM <--> DB
  AS <--> OBJ
  QM <--> BUS

  MR --> LLM
  TR --> MCP --> ENT
  TR --> A2A

  API -. telemetry .-> OT
  WF -. telemetry .-> OT
  AR -. telemetry .-> OT
  AZ -. telemetry .-> OT
  MR -. telemetry .-> OT
  TR -. telemetry .-> OT
  DEP -. deploys .-> API
  DEP -. deploys .-> Runtime
  DR -. protects .-> DB
  DR -. protects .-> DNA
  DR -. protects .-> OBJ
```

## 2. Trust boundaries

```mermaid
flowchart LR
  Browser["Untrusted client"] -->|OIDC token| Edge["Edge / Experience API"]
  Edge -->|workload identity| Control["Runtime control services"]
  Control -->|signed task envelope| Workers["Isolated workers"]
  Workers -->|short-lived scoped credential| Gateway["Model / Tool gateways"]
  Gateway -->|allowlisted egress| External["External provider or enterprise system"]

  Policy["Policy Engine"] -. decision .-> Edge
  Policy -. decision .-> Control
  Policy -. decision .-> Gateway
  Audit["Audit Ledger"] -. required receipt .-> Edge
  Audit -. required receipt .-> Control
  Audit -. required receipt .-> Gateway
```

Trust boundaries are crossed only through authenticated APIs or signed task
envelopes. Workers never receive broad tenant credentials. Model and tool
gateways enforce egress, data classification, quotas, and audit independently
of agent instructions.

## 3. Deployment units

The logical diagram does not require one service per box. Initial deployment
units should be:

1. Experience API and control API.
2. Durable Workflow Engine and Queue Manager using a managed workflow/queue
   capability.
3. General agent workers plus isolated high-risk tool workers.
4. Model Gateway.
5. Tool Gateway with MCP/A2A adapter boundary.
6. Enterprise DNA API and storage.
7. Trust services: policy, approval, evidence/confidence, audit.
8. OpenTelemetry Collector tier.

Session, Context, Checkpoint, Skill, and Memory modules may begin inside the
control/runtime services and separate only when scaling, security, or ownership
evidence requires it.

## 4. Dependency rules

- Product components may call Experience APIs, never storage directly.
- Agent Runtime may request context but may not query Enterprise DNA directly.
- Tool and Model Routers are the only permitted external execution paths.
- Trust Plane must not depend on model output to authorize a request.
- Operations may observe all planes but cannot mutate domain state outside a
  versioned recovery or deployment procedure.
- Audit receives facts from all planes and exposes read-only evidence APIs.
- Cache loss cannot cause domain or approval loss.

## 5. Technology selection boundaries

Required capabilities, not mandated products:

- PostgreSQL-compatible transactional semantics with tenant isolation.
- Durable workflow/timer execution and at-least-once task delivery.
- Versioned, encrypted object storage.
- Bounded cache and distributed rate limiting.
- OpenTelemetry-compatible instrumentation and collection.
- Enterprise OIDC/SAML federation and workload identity.
- Versioned policy-as-code evaluation.

Graph-specific storage, Kubernetes, service mesh, and multi-region active/active
remain optional decisions gated by measured need.

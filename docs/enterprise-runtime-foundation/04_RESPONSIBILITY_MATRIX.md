# Enterprise Runtime Foundation — Responsibility Matrix

**Status:** Proposed architecture
**Implementation status:** Design only

## 1. State ownership matrix

| State or decision | Authoritative owner | Readers | Explicit non-owner |
|---|---|---|---|
| Enterprise facts and relationships | Enterprise DNA | Context Engine, Enterprise Intelligence, Product | Workflow and models |
| Workflow stage and task lifecycle | Workflow Engine | Product, agents, Operations | Enterprise DNA and UI |
| User continuity | Session Engine | Product, Workflow Engine | Browser local state |
| Recovery boundary | Checkpoint Engine | Workflow Engine, operators | Agent prompt |
| Artifacts and versions | Artifact Service | Product, Evidence Engine, agents | Model provider |
| Model route | Model Router | Workflow, Audit, FinOps | Agent implementation |
| Skill selection | Skill Router | Agent Runtime, Audit | UI persona |
| Tool permission | Tool Authorization/Policy | Tool Router, Audit | Agent/model output |
| Human decision | Human Approval Service | Workflow, Product, Audit | Agent/model |
| Evidence manifest | Evidence Engine | Confidence, approvals, Product | Free-form narrative |
| Confidence components | Confidence Engine | Trust Score, Product, policy | Model self-rating |
| Trust score | Trust Score Service | Policy, Product, Audit | Human approval replacement |
| Operational telemetry | Operations Plane | SRE, security, FinOps | Domain state reconstruction |
| Audit record | Audit Ledger | Compliance, security, authorized users | Mutable service database |

## 2. Component RACI

Roles:

- **PO:** Product Owner
- **ARCH:** Platform Architecture
- **RTE:** Runtime Engineering
- **TRUST:** Security/Trust Engineering
- **DNA:** Enterprise DNA Engineering
- **SRE:** Site Reliability Engineering
- **DATA:** Data Governance
- **FIN:** FinOps
- **APP:** Enterprise Approver/Mission Commander

| Capability | PO | ARCH | RTE | TRUST | DNA | SRE | DATA | FIN | APP |
|---|---|---|---|---|---|---|---|---|---|
| Workflow definitions | A | C | R | C | C | C | I | I | I |
| Workflow runtime | I | A | R | C | I | C | I | I | I |
| Enterprise DNA schema | C | C | I | C | R | I | A | I | I |
| Context assembly | C | A | R | C | C | I | C | I | I |
| Model routing | C | A | R | C | I | C | I | C | I |
| Skills and agent contracts | A | C | R | C | C | I | I | I | I |
| Tool adapters/MCP | C | A | R | R | I | C | C | I | I |
| Identity and authorization | I | C | C | A/R | I | C | C | I | I |
| Policy definitions | C | C | C | A/R | C | I | R | C | I |
| Human approval rules | A | C | C | R | I | I | C | I | R |
| Evidence/confidence | A | C | R | R | C | I | C | I | I |
| Audit and retention | I | C | C | A | I | R | C | I | I |
| SLOs and error budgets | C | C | C | C | C | A/R | I | C | I |
| Capacity and scaling | I | C | R | C | C | A | I | C | I |
| Cost allocation | I | I | C | I | I | C | I | A/R | I |
| Incident response | I | C | C | C | C | A/R | I | I | I |
| Disaster recovery | I | A | C | C | C | R | C | I | I |
| Production go/no-go | A | R | R | R | C | R | C | C | I |

## 3. Plane responsibility boundaries

### Product & Intelligence Plane

- Presents state, explanations, evidence, and approvals.
- Issues commands through authenticated APIs.
- Never directly invokes providers/tools or mutates workflow storage.
- Owns experience semantics, not execution truth.

### Runtime & Execution Plane

- Owns durable execution, scheduling, checkpoints, and receipts.
- Requests trust decisions; never self-authorizes.
- Reads Enterprise DNA through scoped snapshot APIs.
- Produces artifacts but does not declare them trusted without validation.

### Trust & Control Plane

- Owns authorization, policy, approvals, evidence integrity, and audit.
- Does not execute modernization work or invent business facts.
- Can block or condition transitions but cannot silently modify workflow intent.

### Operations Plane

- Owns service health, recovery, capacity, and operational evidence.
- Cannot bypass policy or mutate domain decisions through automation.
- AIOps can recommend; approved runbooks execute bounded operational actions.

## 4. Human accountability

| Decision | Required human role | AI/system authority |
|---|---|---|
| Low-risk evidence collection | Configurable data owner oversight | May execute within policy |
| Deterministic score calculation | Method owner approves formula/version | System calculates only |
| High-risk modernization recommendation | Mission Commander reviews evidence | AI may recommend/explain |
| External write/tool side effect | Resource owner or delegated approver | System executes only after grant |
| Policy exception | Security/data authority | AI cannot approve |
| Production deployment | Authorized change owner | Automation validates and executes |
| Disaster declaration/failover | Incident Commander | Automation gathers evidence and performs approved procedure |

## 5. Segregation-of-duties minimums

- The actor generating a high-risk recommendation cannot be its sole approver.
- Tool-adapter owners cannot unilaterally relax authorization policy.
- Policy changes require review separate from runtime deployment approval.
- Audit administrators cannot modify source workflow records.
- Break-glass access requires a second-party review after use.
- Model providers never receive enterprise credentials or approval authority.

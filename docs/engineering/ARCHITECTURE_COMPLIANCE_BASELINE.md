# Architecture Compliance Baseline

**Assessment basis:** current working tree on 2026-08-02
**Purpose:** identify gaps and debt; this document authorizes no remediation.

## Authorities reviewed

- [Product Constitution](../../design/00_PRODUCT_CONSTITUTION.md)
- [Runtime Architecture](../enterprise-runtime-foundation/01_RUNTIME_ARCHITECTURE.md)
- [Runtime Responsibility Matrix](../enterprise-runtime-foundation/04_RESPONSIBILITY_MATRIX.md)
- [ARB Decision](../enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md)
- [Engineering Governance Baseline](../enterprise-runtime-foundation/018_ENGINEERING_GOVERNANCE_BASELINE.md)
- [Runtime Spine PRS](../enterprise-runtime-foundation/019_PRS_RUNTIME_SPINE.md)
- [Current Product State](../production-readiness/CURRENT_PRODUCT_STATE.md)

The Runtime Architecture describes a future state. Compliance with it is not
claimed until source and tests demonstrate the capability. The ARB decision is
the controlling Production Candidate scope when it narrows the reference design.

## Compliance summary

| Principle | Current evidence | Assessment |
|---|---|---|
| Preserve existing happy path | Python workflow, Streamlit app, JavaScript prototype, regression suites | Aligned for local/demo scope |
| Deterministic numeric authority | `engine/assessment.py`, `engine/agency.py`, tests | Aligned |
| Synthetic enterprise data | Demo/sample data and product disclosures | Aligned |
| Stored assessment artifacts | Local JSON/ZIP and SQLite assessment bundle | Aligned locally; not operationalized |
| One Python workflow owner | `engine/workflow.py` | Aligned in Python; browser prototype remains separate |
| Versioned runtime boundary | `engine/runtime/contracts.py` | Implemented but inactive |
| Typed runtime configuration | `engine/runtime/config.py` | Implemented in working tree but inactive/uncommitted |
| Enterprise DNA authority | Browser model and synthetic relationships | Partial prototype; no durable enterprise authority |
| Human approval for high risk | UI/state concepts and agency status | Partial; no durable authorization enforcement |
| Durable execution and recovery | No activated Runtime Spine | Gap by design |
| Tenant isolation | Contract identifiers only | Not enforced |
| Managed trust and operations | Architecture documents only | Designed, not implemented |

## Violations, coupling, and debt

| ID | Finding | Evidence | Consequence | Disposition |
|---|---|---|---|---|
| AC-001 | Two user surfaces maintain independent state and business projections. | Streamlit `app/main.py`; standalone `prototype/mission-control/script.js` | Cross-surface state can diverge; Product Constitution synchronization is not a deployed guarantee. | Defer correction to approved compatibility/runtime slices. |
| AC-002 | Presentation and orchestration are concentrated in large controller files. | `app/main.py`; `prototype/mission-control/script.js` | High change collision and regression radius. | Do not refactor with feature work; measure first. |
| AC-003 | `engine/__init__.py` exposes a broad eager facade. | Top-level re-exports across assessment, evidence, persistence, agency, engineering, workflow | Public-surface growth and circular-import risk. | Preserve compatibility; narrow only through ADR-backed migration. |
| AC-004 | Workflow and much UI state are session/process local. | `st.session_state`; browser memory | Browser or process loss cannot recover the journey. | Approved Runtime Spine work, not this packet. |
| AC-005 | Artifact storage is local and path-oriented. | `generated_packages/`, local SQLite assessment database | No tenant-safe durable object boundary, retention, or managed recovery. | PC v1 managed storage slices. |
| AC-006 | Human approval is represented but not enforced at a trusted boundary. | Agency approval status and prototype decision state | UI state could be mistaken for authorization. | Trust Platform backlog; fail claims closed. |
| AC-007 | Enterprise DNA is rich in the prototype but lacks a durable Python authority. | `enterprise-dna.js`, explorer modules | Journey and intelligence cannot yet consume a governed shared model. | Future approved Enterprise DNA runtime work. |
| AC-008 | Root documentation contains stale or contradictory statements. | Empty `ARCHITECTURE.md`/`DECISIONS.md`; `PRODUCT.md` claims tools not active; `EVENT_SCHEMA.md` says events are truth | Onboarding and architecture claims can be wrong. | Route readers through this workspace; remediate separately. |
| AC-009 | Event terminology predates current EMOS language and overstates implementation. | `EVENT_SCHEMA.md` uses “Modernization AI Factory 2D” and declares event sourcing | May be mistaken for current runtime architecture. | Treat as conceptual/historical until superseded by ADR. |
| AC-010 | Current worktree contains a large set of mixed, uncommitted product/runtime/docs changes. | `git status --short` | Clean-checkout reproducibility and release attribution are weak. | First recommended slice is a reproducible baseline checkpoint. |
| AC-011 | Runtime contracts/configuration are definition-only while the workflow remains direct. | No imports from app/workflow/agency into `engine.runtime` | Expected inactive boundary, but risks accidental claims of runtime completion. | Maintain explicit activation scan and status labels. |
| AC-012 | No repository-evidenced CI pipeline, coverage threshold, service manifest, or CODEOWNERS policy was found. | Repository inventory | Quality gates depend on local execution and tacit ownership. | Add only through an approved engineering slice. |

## Hidden dependencies and responsibility duplication

- `app/main.py` depends on the top-level `engine` compatibility surface, making
  package exports part of application reproducibility.
- `engine.workflow` coordinates domain engines and local persistence; future
  Runtime Spine integration must adapt this owner, not reproduce transitions.
- Mission Control duplicates workflow semantics for a standalone demo. It is not
  evidence of a shared backend or durable Enterprise DNA.
- `EVENT_SCHEMA.md` and Runtime Spine events describe different maturity levels;
  neither is an activated event-sourced runtime.
- Completion reports contain historical test results. They do not prove the
  current working tree passes until commands are rerun.

## Governance consistency

The Engineering Governance Baseline is approved and effective for Production
Candidate v1. That approval establishes engineering rules but does not by itself
authorize a slice or establish Production Candidate readiness; the applicable
ARB, PRS, dependency, validation, and release gates remain mandatory.

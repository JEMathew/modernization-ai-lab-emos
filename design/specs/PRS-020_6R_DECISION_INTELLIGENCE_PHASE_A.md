# PRS-020 — Governed 6R Decision Intelligence, Phase A

| Field | Value |
|---|---|
| Status | Approved for slice `6R-01` |
| Date | 2026-08-15 |
| Product horizon | Horizon 1 extension; local synthetic demonstration |
| Authorities | [Product Constitution](../00_PRODUCT_CONSTITUTION.md), user authorization dated 2026-08-15 |
| Execution authority | None |

## Problem statement

EMOS calculates a legacy 6R label, but it does not yet own a canonical,
versioned recommendation record that explains why one strategy was selected,
why alternatives were not selected, which immutable evidence supports the
result, or whether the recommendation is ready for human decisioning. A label
must not be mistaken for an approved decision or authorization to execute.

## User and persona

The primary user is the Mission Commander, supported by enterprise architects,
modernization advisors, risk reviewers, and portfolio leaders. They need to
challenge a recommendation using traceable evidence before any governed
decision occurs.

## Decision workflow

`Evidence snapshot -> deterministic assessment -> findings -> versioned 6R recommendation -> future governed decision`

The workflow stops at recommendation. DS-01 through DS-03 semantics remain
separate and unchanged. No recommendation state in this slice represents
prepared, reviewed, approved, rejected, or execution-authorized work.

## Functional requirements

1. Define one canonical catalogue for Retain, Retire, Rehost, Replatform,
   Refactor, and Repurchase, with Replace accepted as a compatibility alias.
2. Each strategy defines its meaning, eligibility, positive and negative
   signals, required evidence, typical risks, expected benefits, planning
   requirements, execution pattern, validation requirements, and outcome
   categories.
3. Generate immutable recommendations from the existing deterministic
   assessment and immutable evidence snapshot.
4. Store the asset identifier and type, recommended strategy, rationale,
   evidence references and provenance, confidence, trust status, alternatives,
   timestamp, version, engine version, and authority boundary.
5. Explain why the recommended strategy was selected and why the other five
   strategies were not selected.
6. Map assessment evidence health to recommendation trust without changing the
   underlying numeric scores.
7. Persist recommendations transactionally with their assessment run and
   include them in the stored assessment artifact.
8. Expose the selected asset's recommendation, alternatives, evidence,
   rationale, confidence, trust, and version in Streamlit.
9. Demonstrate an application scenario and the existing Oracle Customer
   Analytics Warehouse data-platform scenario using synthetic evidence.
10. Reject any attempt to claim execution authority from a recommendation.

## Non-functional requirements

- Python owns all numeric strategy evaluation and confidence calculations.
- Models are strict, immutable, provider-neutral, and versioned.
- Recommendations are reproducible for identical assessment and evidence
  inputs, excluding run identity and timestamp.
- SQLite writes remain parameterized and transactional.
- The deterministic path requires no OpenAI call.
- Failures are controlled and do not leave a partially persisted recommendation.
- Existing public assessment DataFrame behavior and Apex golden scores remain
  compatible.
- Only synthetic enterprise evidence is accepted by the reference scenarios.

## Acceptance criteria

1. The canonical catalogue contains exactly six strategies and normalizes
   Replace to Repurchase.
2. Each assessed asset receives one evidence-backed recommendation containing
   five ranked alternatives.
3. Supporting evidence resolves to the run's immutable evidence snapshot and
   retains provenance.
4. Missing blocking evidence or a blocking conflict produces Blocked trust;
   non-blocking weakness produces Warning; sufficient evidence produces Ready.
5. Confidence is deterministic, bounded, and lowered by weak evidence; it is
   not presented as an LLM probability.
6. Recommendations persist immutably and cannot be overwritten at the same
   run, asset, and version.
7. Stored JSON and SQLite recommendation records agree.
8. The legacy application scenario recommends Refactor and the Oracle warehouse
   scenario recommends Replatform from their respective evidence.
9. Streamlit displays the governed recommendation boundary without changing
   existing DS-01 through DS-03 state.
10. An execution-authority check fails closed for every Phase A recommendation.
11. Focused tests, the complete Python suite, relevant JavaScript suites,
    compilation, dependency, formatting, and Streamlit health checks pass.

## Explicitly out of scope

- Governed decision preparation, review, approval, rejection, or rework.
- DS-04 modernization planning and plan approval.
- Portfolio/wave optimization changes.
- Agent or tool execution, deployment, infrastructure mutation, or migration.
- DS-05 through DS-08 execution, validation, benefit realization, and learning.
- Authentication, RBAC, tenant isolation, managed storage, or production claims.
- LLM selection of a strategy or LLM-generated numeric scores.
- Changes to the standalone Mission Control prototype.

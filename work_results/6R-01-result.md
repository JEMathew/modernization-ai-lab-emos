# 6R-01 — Canonical 6R Decision Intelligence Result

## Status and outcome

**Implemented, uncommitted** on 2026-08-15. Local implementation and validation
gates pass. The registry cannot say Complete until a reviewed commit passes
clean-checkout validation.

EMOS now creates one immutable, evidence-backed, versioned 6R recommendation per
assessed asset. It explains why its strategy was selected, why the other five
were not selected, and whether evidence makes it Ready, Warning, or Blocked.

`Evidence Snapshot -> Criterion Results -> Findings -> Recommendation -> future Governed Decision`

Every Phase A record is `Recommended`, has authority `RecommendOnly`, and has
`Execution Authority = None`.

## Governance and architecture

Created:

- `design/specs/PRS-020_6R_DECISION_INTELLIGENCE_PHASE_A.md`
- `docs/adr/0001-canonical-6r-recommendation-boundary.md`
- `work_packets/6R-01.md`
- registry entry `6R-01`

ADR-0001 makes recommendations immutable children of the existing assessment-run
aggregate. The assessment workflow remains the operation owner. No parallel
service, approval command, execution command, or new dependency was introduced.
Legacy `Replace` is normalized to canonical `Repurchase` in recommendation
records while the existing assessment DataFrame remains compatible.

## Files created

- `engine/modernization_strategy.py`
- `design/specs/PRS-020_6R_DECISION_INTELLIGENCE_PHASE_A.md`
- `docs/adr/0001-canonical-6r-recommendation-boundary.md`
- `work_packets/6R-01.md`
- `demo_data/phase_a_6r/README.md`
- `demo_data/phase_a_6r/enterprise_profile.json`
- `demo_data/phase_a_6r/portfolio.csv`
- `demo_data/phase_a_6r/evidence_registry.json`
- `tests/test_modernization_strategy.py`
- `tests/test_6r_reference_scenarios.py`
- `work_results/6R-01-result.md`

## Files modified

- `engine/assessment_models.py`
- `engine/assessment.py`
- `engine/persistence.py`
- `engine/workflow.py`
- `app/main.py`
- `docs/backlog/VERTICAL_SLICE_REGISTRY.md`

The `app/main.py` change is a narrow additive projection; pre-existing responsive
work was preserved. No `prototype/mission-control/` file or `engine/__init__.py`
change belongs to this packet.

## 6R support matrix

| Strategy | Canonical support | Primary evidence boundary |
|---|---|---|
| Retain | Definition and alternative evaluation | Lifecycle, roadmap, risk acceptance, cost |
| Retire | Definition and alternative evaluation | Usage, dependencies, retention, consumers |
| Rehost | Definition and alternative evaluation | Runtime, infrastructure, network, performance |
| Replatform | Definition and alternative evaluation | Compatibility, schema, dependencies, target service |
| Refactor | Definition and alternative evaluation | Architecture/code, roadmap, APIs/data, tests |
| Repurchase | Definition and alternative evaluation; Replace alias | Capability, product, contract, data/integrations |

Each definition also records eligibility, positive/negative signals, risks,
benefits, planning requirements, execution pattern, validation requirements, and
outcome categories. Execution patterns are descriptive metadata only.

## Implementation and persistence

- Added strict frozen strategy, evidence-reference, alternative, and
  recommendation contracts.
- Added deterministic strategy comparison, rationale, alternative rejection,
  trust mapping, confidence, and stable content hashing.
- Added run/enterprise/asset referential validation and one recommendation per
  asset per run.
- Added shared workflow-state projection without changing DS-01–DS-03 states.
- Added a fail-closed execution-authority check.
- Added the idempotent SQLite table `modernization_recommendations`, unique on
  `(run_id, asset_id, recommendation_version)`.
- Recommendation writes share the existing assessment transaction.
- Schema-v1 JSON artifacts include recommendation records versioned `1.0.0`.
  Historical artifacts remain readable and are not fabricated or backfilled.

## UI changes

The existing Streamlit candidate view now shows strategy, deterministic
confidence, trust, version, rationale, all five alternatives, evidence and
provenance, missing/conflicting evidence, immutable IDs/hashes, authority scope,
and Execution Authority None. Blocked results are not presented as approved.

## Reference scenarios

### Application — Legacy Order Fulfillment Suite

| Field | Result |
|---|---|
| Enterprise / type | Synthetic Northstar / Enterprise Application |
| Recommendation | Refactor |
| Confidence / trust | 1.000 / Ready |
| Evidence / alternatives | 1 / 5 |
| Missing / conflicting | 0 / 0 |

The evidence shows a critical, end-of-support, tightly coupled application. Its
stored JSON and SQLite recommendation records agree.

### Data platform — Oracle Customer Analytics Warehouse

| Field | Result |
|---|---|
| Enterprise / type | Synthetic Apex Aerospace / Data Warehouse |
| Recommendation | Replatform |
| Confidence / trust | 0.585 / Blocked |
| Evidence / alternatives | 6 / 5 |
| Missing requirements / conflicting evidence | 3 / 2 |

The ownership conflict, stale lifecycle evidence, and missing evidence remain
visible and block trusted progression; they do not change the Python score.

## Tests and commands

Baseline: `146 passed in 1.97s`.

Focused Phase A plus affected regression:

```text
PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest -q -p no:cacheprovider tests/test_modernization_strategy.py tests/test_6r_reference_scenarios.py tests/test_assessment.py tests/test_workflow.py
38 passed in 0.96s
```

Final Python regression:

```text
PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest -q -p no:cacheprovider
159 passed in 1.18s
```

An intermediate final run reported `158 passed, 1 failed`: the replay-integrity
test found that run-scoped finding IDs affected the recommendation content hash.
The hash was corrected to use semantic finding content while retaining run-local
finding references. The focused replay/scenario rerun passed `13 passed in
0.73s`, followed by the clean 159-test result above.

Additional results:

- All 10 JavaScript suites passed.
- `compileall` passed.
- `pip check`: no broken requirements.
- `git diff --check` passed.
- Engine/app prohibited execution-authority scan passed.
- Phase A credential-pattern scan passed.
- Streamlit started successfully; `/_stcore/health` returned `ok`.
- Streamlit emitted the existing LibreSSL warning and optional Watchdog
  suggestion; neither affected health.

## Acceptance and controls

All PRS-020 behavioral acceptance criteria pass locally: exact canonical
catalogue, aliasing, one recommendation plus five alternatives, provenance,
missing/conflicting/low-confidence handling, stable hashing, version/state
integrity, JSON/SQLite agreement, both reference scenarios, UI projection, and
fail-closed execution.

Verified invariants:

- Recommendation is not a decision.
- No approved decision is created.
- No migration, infrastructure mutation, external tool, or provider call runs.
- Numeric fit and confidence remain Python-owned.
- Reference evidence is explicitly synthetic.

## Known limitations

- Local SQLite is not tenant-safe or tamper-proof production storage.
- Alternative fit scores are bounded decision support, not calibrated
  probabilities or portfolio optimization.
- The application reference intentionally begins with one authoritative
  inventory record; future Enterprise DNA work can enrich it without changing
  the recommendation contract.
- Existing Apex evidence intentionally leaves Oracle Blocked.
- The worktree contains unrelated uncommitted Mission Control, responsive UI,
  documentation, and `engine/__init__.py` work owned by the user.
- No reviewed commit or clean-checkout validation was produced.

## Demo steps

1. Run `.venv/bin/python -m streamlit run app/main.py`.
2. Load Apex and run the modernization assessment.
3. Inspect **Governed 6R Recommendation** under the selected candidate.
4. Review Replatform, 58.5% confidence, Blocked trust, five alternatives,
   provenance, immutable hashes, and Execution Authority None.
5. Run the same workflow with `demo_data/phase_a_6r/portfolio.csv`, enterprise
   `NORTHSTAR-MFG-001`, and its evidence registry to inspect the stored Refactor
   application recommendation.

## Recommended next slice

Authorize `6R-02 — Governed Recommendation-to-Decision Handoff`. It should let
DS-03 create an immutable Prepared decision record referencing one recommendation
ID/hash, enforce reviewer and approver eligibility, and preserve Returned,
Rejected, and Approved history. Planning and execution should remain out of
scope until that handoff is separately approved.

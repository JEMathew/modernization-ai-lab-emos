# Trusted Modernization Intelligence v1.0 — Slice 01 Result

## 1. Executive summary

Implemented the first vertical slice for evidence-backed, versioned, deterministic
assessment runs in the authoritative Python/Streamlit application. Every assessment
executed through `engine.workflow.run_assessment` now uses a validated synthetic Apex
evidence registry, creates a content-addressed evidence snapshot, records a versioned
assessment definition and 56 criterion results, persists trusted metadata in SQLite,
and writes a schema-v1 JSON artifact.

The existing assessment DataFrame API, Apex scores, Oracle candidate selection, 6R
recommendation, migration wave, engineering ZIP behavior, replanning behavior, and
Mission Control implementation remain unchanged by this packet.

## 2. Baseline repository state

The worktree was already dirty before this packet. Tracked modifications and
untracked files included Streamlit, runtime, Mission Control, documentation, tests,
and prior result reports. No pre-existing work was deleted or reset.

Baseline validation:

- Python: 108 tests passed.
- JavaScript: 10 existing suites passed.
- `git diff --check`: passed.
- Required runtime files `engine/workflow.py`, `engine/runtime/contracts.py`, and
  `engine/runtime/config.py` were present in the working tree.

## 3. Files added

- `engine/assessment_models.py`
- `engine/evidence.py`
- `engine/persistence.py`
- `demo_data/apex_aerospace/evidence_registry.json`
- `tests/test_evidence.py`
- `tests/test_assessment_definitions.py`
- `work_results/TRUSTED-MODERNIZATION-INTELLIGENCE-V1-SLICE-01-result.md`

## 4. Files modified

- `engine/assessment.py`
- `engine/workflow.py`
- `engine/__init__.py`
- `app/main.py`
- `tests/test_assessment.py`
- `tests/test_workflow.py`

`app/main.py` and `engine/__init__.py` contained pre-existing user changes. This
packet made narrow additions to their current working-tree versions. No file under
`prototype/mission-control/` was changed by this packet.

## 5. Schema changes

The local SQLite bootstrap schema contains:

- `evidence_versions`
- `evidence_snapshots`
- `evidence_snapshot_items`
- `assessment_definitions`
- `assessment_runs`
- `criterion_results`
- `artifact_references`

The schema uses foreign keys, composite keys for immutable evidence versions,
uniqueness constraints, parameterized statements, and transactions. There was no
existing database to migrate, so this is a schema bootstrap rather than a historical
data migration. SQLite database files remain ignored by Git.

## 6. Assessment-definition structure

Definition ID: `MODERNIZATION-PORTFOLIO-ASSESSMENT`

Version: `1.0.0`

Engine version: `1.0.0`

The immutable definition records:

- eight criterion definitions;
- dimensions and output fields;
- formulas and current weights;
- required source fields and evidence categories;
- scoring bounds and current lookup parameters;
- migration-risk and priority weights;
- current 6R ordering, wave thresholds, and candidate exclusions;
- Python as the numeric calculation owner; and
- a deterministic SHA-256 definition hash.

Scoring functions remain in Python and were not duplicated into the definition or
an AI layer.

## 7. Evidence snapshot design

The Apex registry contains seven synthetic evidence records, one for each platform.
Each record has a stable ID, enterprise and asset IDs, category, source type and
reference, captured/effective timestamps, provenance, confidence, content hash,
criterion references, and the exact normalized portfolio facts used for scoring.

Snapshot construction:

1. validates registry shape and the synthetic-demo disclosure;
2. validates strict Pydantic records and content hashes;
3. selects records for the assessed asset IDs;
4. deep-copies and canonically sorts records by evidence ID;
5. calculates a deterministic SHA-256 over the complete normalized record copies;
6. derives a stable `DNA-SNAPSHOT-*` ID from that hash; and
7. persists the snapshot and exact evidence-version references.

Changing a registry object after snapshot construction does not mutate the snapshot.
A missing asset stops the run with a controlled error. A missing criterion link
creates an explicit unsupported criterion result and lowers completeness without
changing unrelated deterministic scores.

## 8. Persistence design

`TrustedAssessmentStore` uses Python's standard `sqlite3` module. Evidence versions,
snapshot metadata/items, the definition, the run, criterion results, and artifact
reference are inserted in one transaction. The JSON artifact is atomically written
through a temporary file while that transaction is open. Artifact failures roll back
database rows; database failures do not claim an artifact was produced. A rare commit
failure after artifact creation triggers best-effort artifact cleanup.

This is a local modular-monolith store. It is not represented as multi-instance,
tamper-proof, or enterprise-scale persistence.

## 9. UI changes

The Streamlit assessment result now displays:

- definition ID and version;
- definition hash;
- evidence snapshot ID and hash;
- evidence completeness;
- calculation owner;
- engine and result hashes; and
- `Verified` or `Qualified` reproducibility state.

Missing evidence displays a warning. Malformed/empty evidence, missing asset evidence,
SQLite failures, and artifact failures flow through the existing controlled assessment
error state without exposing low-level database details.

## 10. Tests added

Coverage added for:

- strict/frozen Pydantic validation;
- registry validation and content hashes;
- canonical ordering and stable snapshot hashing;
- snapshot copy isolation;
- snapshot-to-portfolio reconstruction;
- empty, malformed, and missing-asset evidence;
- missing criterion evidence and qualified runs;
- stable definition hashing and semantic version validation;
- definition weights, thresholds, and invalid definitions;
- exact Apex golden scores, Oracle selection, Replatform disposition, and Wave 1;
- criterion traceability;
- deterministic replay;
- SQLite/artifact consistency;
- transaction rollback;
- controlled database and artifact failures;
- legacy-v0 artifact reading; and
- trust metadata in shared Streamlit workflow state.

## 11. Commands executed

```text
PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest -q -p no:cacheprovider
for f in prototype/mission-control/tests/*.test.js; do node "$f"; done
git diff --check
PYTHONPYCACHEPREFIX=/tmp/modernization-ai-lab-pyc .venv/bin/python -m compileall -q app engine tests
.venv/bin/python -m pip check
.venv/bin/python -m streamlit run app/main.py --server.headless true --server.port 8765 --browser.gatherUsageStats false
curl --fail --silent http://127.0.0.1:8765/_stcore/health
git status --short
git diff --stat
```

Focused test commands were also run throughout implementation for assessment,
workflow, evidence, and definition tests.

## 12. Test results

- Final Python suite: **134 passed**.
- JavaScript regression: **10 suites passed**.
- Python compile check: passed.
- Dependency check: no broken requirements.
- Streamlit startup: passed.
- Streamlit health endpoint: returned `ok`.
- `git diff --check`: passed.

The local Streamlit process continues to report the pre-existing urllib3/LibreSSL
warning and optional Watchdog recommendation. Neither blocked startup.

## 13. Acceptance criteria met

All 20 packet acceptance criteria were met:

1. Existing Apex scores unchanged.
2. Oracle Customer Analytics Warehouse remains selected.
3. Replatform and Wave 1 behavior unchanged.
4. New workflow runs have definition ID/version/hash.
5. New workflow runs have snapshot ID/hash.
6. Identical snapshot/definition inputs reproduce criterion and result hashes.
7. Criterion traceability is separately persisted.
8. Missing evidence is explicit and qualified.
9. Historical artifacts were not rewritten.
10. Schema-v1 JSON and SQLite run metadata agree.
11. Streamlit exposes trust metadata.
12. Database and artifact failures are controlled and rollback is tested.
13. Existing Python regression passes.
14. New tests pass.
15. JavaScript regression passes.
16. `git diff --check` passes.
17. No Mission Control file was changed by this packet.
18. No AI dependency was added.
19. No out-of-scope capability is claimed.
20. Limitations are documented below.

## 14. Acceptance criteria not met

None.

## 15. Known limitations

- The registry covers the synthetic Apex portfolio only.
- SQLite and local filesystem artifacts are appropriate for the local demo, not
  concurrent multi-instance operation.
- Hashes provide integrity/reproducibility evidence but do not prevent a privileged
  local user from editing the database or files.
- The low-level backward-compatible `store_assessment_artifact` helper can still write
  the historical v0 shape when called without an `AssessmentRun`. User-executed
  assessments through `run_assessment` always write schema v1.
- A criterion with missing registry attribution retains the deterministic numeric
  calculation from the snapshotted platform facts but is marked unsupported; no
  confidence claim is made for that criterion.
- No authentication, RBAC, approvals, overrides, comparison, connector, or live AI
  behavior was added.
- Historical v0 artifacts have no inferred snapshot or definition metadata.

## 16. Security considerations

- SQL uses parameterized statements and foreign-key enforcement.
- Errors presented across persistence and evidence boundaries are controlled and do
  not expose database statements or credentials.
- Resource references are local opaque references and contain no secrets.
- Evidence content hashes and snapshot/definition/result hashes support integrity
  checks, not authorization or non-repudiation.
- The registry is explicitly marked synthetic and no production source is contacted.

## 17. Manual demo steps

1. Run `python -m streamlit run app/main.py`.
2. Select and load the Apex Aerospace demo.
3. Click **Run Modernization Assessment**.
4. Confirm the Trust & Reproducibility section shows definition `1.0.0`, 100% evidence
   completeness, Python calculation ownership, and Verified status.
5. Expand the lineage panel and inspect the definition, snapshot, and result hashes.
6. Confirm Oracle Customer Analytics Warehouse remains priority 1, Replatform, and
   Wave 1 with priority 64.4.
7. Inspect the new schema-v1 JSON artifact under `generated_packages/assessments/`.
8. Continue to the implementation package and replanning experience to verify the
   existing happy path remains available.

## 18. Recommended next slice

Implement generic evidence quality and evidence-backed findings: freshness policies,
criterion-level missing/conflict findings, inspectable evidence lineage, and bounded
finding severity. Continue using the Python domain and SQLite store as authoritative;
do not connect Mission Control or add model calls until that domain behavior is tested.

# BASE-01 — Reproducible Repository Baseline Result

## 1. Executive summary

BASE-01 converted the approved Python intelligence foundations, inactive Runtime
Spine configuration, and EMOS engineering workspace from a healthy but mixed
working tree into three coherent commits. The exact committed baseline at
`eec5fd5` was then installed, tested, launched, and exercised from a clean
worktree without copying any untracked source from the original repository.

Trusted Modernization Intelligence Slices 01 and 02 are committed together
because their final models, persistence schema, workflow, artifacts, UI, and
tests are cumulative and could not be separated into truthful intermediate
states without reconstructing history. RS-03 is a separate inactive checkpoint.
Substantial Mission Control, UX, sample, Explorer, specification, and historical
result work remains deliberately uncommitted and was neither deleted nor reset.

## 2. Starting branch and HEAD

- Branch: `feature/responsive-functional-parity`
- Starting HEAD: `5740085032a5882b62861c48289d7febaaabf3fb`
- Starting commit: `fix(engine): restore workflow public API export`
- Safety reference: `codex/backup-base01-20260802` at starting HEAD
- Baseline date: 2026-08-02

## 3. Initial working-tree inventory

- Tracked modifications: 17 files.
- Untracked source, test, documentation, data, and evidence: 83 files.
- Ignored/local-only roots: `.venv/`, `.pytest_cache/`, and
  `generated_packages/`.
- Largest ignored repository artifact: `.venv` library content (approximately
  40 MB individual binaries).
- Largest ignored runtime artifact: `generated_packages/trusted_assessments.db`
  (380,928 bytes).
- Largest ignored generated assessment: 189,300 bytes.
- Initial Python baseline: 146 passed.
- Initial JavaScript baseline: 10 suites passed.
- Initial dependency check and `git diff --check`: passed.

No ignored cache, environment, database, ZIP, generated JSON, browser artifact,
credential, or machine-specific file was staged.

## 4. File classification

The group letters are the BASE-01 classifications. Every path in a subsection
shares the stated ownership, disposition, dependency, and risk treatment.

### A and B — Trusted Modernization Intelligence Slices 01 and 02

These files are required for the current trusted-assessment product path and
were committed in checkpoint `7dbd014`. Excluding any new domain, evidence,
persistence, data, or test file would break clean-checkout execution or its
evidence. Inclusion risk was bounded by strict synthetic data, focused tests,
transaction tests, and clean-checkout validation.

| Path | Group | Reason and dependency |
|---|---|---|
| `demo_data/apex_aerospace/evidence_registry.json` | A/B | Synthetic immutable evidence input used by the workflow |
| `engine/assessment.py` | A/B | Versioned assessment construction and artifact compatibility |
| `engine/assessment_models.py` | A/B | Strict frozen assessment, evidence, quality, and finding models |
| `engine/evidence.py` | A/B | Registry validation, snapshots, canonical hashes, reconstruction |
| `engine/evidence_quality.py` | B | Deterministic requirements, freshness, links, findings, trust |
| `engine/persistence.py` | A/B | Transactional local SQLite and artifact persistence |
| `engine/workflow.py` | A/B | Current workflow integration and state projection |
| `app/main.py` selected hunks | A/B/I | Required workflow integration and progressive trust UI; responsive and stage-navigation hunks excluded |
| `engine/agency.py` | I prerequisite | Candidate-aware delivery chain required by the integrated app |
| `tests/test_agency.py` | I prerequisite | Validates the required delivery-chain signature |
| `tests/test_assessment.py` | A/B | Golden results and artifact compatibility |
| `tests/test_assessment_definitions.py` | A | Definition identity, weights, and validation |
| `tests/test_evidence.py` | A/B | Registry, snapshot, hash, and missing-evidence behavior |
| `tests/test_evidence_quality.py` | B | Quality, freshness, authority, confidence, and conflict rules |
| `tests/test_findings.py` | B | Finding traceability, trust precedence, persistence, rollback |
| `tests/test_workflow.py` | A/B | Transaction, replay, failure, and shared-state behavior |
| `work_results/TRUSTED-MODERNIZATION-INTELLIGENCE-V1-SLICE-01-result.md` | G/A | Slice 01 completion evidence |
| `work_results/TRUSTED-MODERNIZATION-INTELLIGENCE-V1-SLICE-02-result.md` | G/B | Slice 02 completion evidence |

### C — Runtime Spine compatibility work

All four files are required for RS-03 and were committed independently at
`711200c`. They depend only on committed RS-02 contracts. Inclusion risk is
configuration-contract expansion; activation risk is controlled because no
application or top-level engine module imports `engine.runtime`.

| Path | Group | Reason |
|---|---|---|
| `engine/runtime/__init__.py` | C | Public exports for typed configuration only |
| `engine/runtime/config.py` | C | Strict, immutable, provider-neutral inactive configuration |
| `tests/runtime/test_config.py` | C | Defaults, bounds, rejection, and safe-error tests |
| `work_results/RUNTIME-SPINE-RS-03-result.md` | G/C | RS-03 completion evidence |

### D — Engineering workspace and governance

These files are required for the approved engineering operating environment and
were committed at `eec5fd5`. Their risk is documentation drift; links, headings,
fences, terminology, status labels, and clean-checkout behavior were validated.

| Path | Group | Purpose |
|---|---|---|
| `AGENTS.md` | D | Repository engineering instructions and workspace routing |
| `docs/README.md` | D | Documentation authority and navigation map |
| `docs/adr/0000-template.md` | D | ADR template |
| `docs/adr/README.md` | D | ADR lifecycle |
| `docs/architecture/README.md` | D | Current/target architecture boundary |
| `docs/backlog/ENGINEERING_BACKLOG.md` | D | Program-to-slice portfolio view |
| `docs/backlog/VERTICAL_SLICE_REGISTRY.md` | D | Official slice registry |
| `docs/engineering/ARCHITECTURE_COMPLIANCE_BASELINE.md` | D | Evidence-based compliance baseline |
| `docs/engineering/DEVELOPMENT_STANDARDS.md` | D | Development and validation standards |
| `docs/engineering/ENGINEERING_METRICS.md` | D | Metrics definitions |
| `docs/engineering/IMPLEMENTATION_PACKET_TEMPLATE.md` | D | Future packet contract template |
| `docs/engineering/README.md` | D | Engineering operating workflow |
| `docs/engineering/REPOSITORY_ORGANIZATION.md` | D | Ownership and dependency boundaries |
| `docs/enterprise-runtime-foundation/16_ARCHITECTURE_REVIEW_BOARD_DECISION.md` | D | Frozen ARB decision |
| `docs/enterprise-runtime-foundation/17_ENGINEERING_BACKLOG.md` | D | Approved PC v1 backlog |
| `docs/enterprise-runtime-foundation/018_ENGINEERING_GOVERNANCE_BASELINE.md` | D | Approved governance baseline |
| `docs/enterprise-runtime-foundation/019_PRS_RUNTIME_SPINE.md` | D | Runtime Spine requirements |
| `docs/enterprise-runtime-foundation/020_RUNTIME_SPINE_IMPLEMENTATION_PLAN.md` | D | Approved runtime slice plan |
| `docs/production-readiness/CURRENT_PRODUCT_STATE.md` | D | Historical point-in-time assessment |
| `docs/production-readiness/REVIEW_PACKAGE.md` | D | Historical readiness review package |
| `docs/releases/RELEASE_REGISTRY.md` | D | Slice-based release composition |
| `docs/roadmap/ENGINEERING_ROADMAP.md` | D | Dependency-led roadmap |
| `docs/runtime/README.md` | D | Runtime authority and activation routing |
| `work_results/EMOS-ENGINEERING-WORKSPACE-FOUNDATION-result.md` | G/D | Workspace completion evidence |

### E — Mission Control and browser prototype, deliberately excluded

These files are product/prototype work, not required by the Python/runtime/docs
baseline. They remain in the working tree for a separately approved checkpoint.
Inclusion would have mixed responsive, navigation, onboarding, sample, Explorer,
and UX changes into BASE-01. Exclusion does not affect the committed prototype;
its four committed JavaScript suites and browser Guided Journey passed.

| Path | State |
|---|---|
| `prototype/mission-control/README.md` | Modified, preserved |
| `prototype/mission-control/index.html` | Modified, preserved |
| `prototype/mission-control/portfolio-lab-ui.js` | Modified, preserved |
| `prototype/mission-control/script.js` | Modified, preserved |
| `prototype/mission-control/styles.css` | Modified, preserved |
| `prototype/mission-control/tests/enterprise-dna.test.js` | Modified, preserved |
| `prototype/mission-control/tests/guided-discovery-action.test.js` | Modified, preserved |
| `prototype/mission-control/enterprise-dna-explorer-model.js` | Untracked, preserved |
| `prototype/mission-control/enterprise-dna-explorer.css` | Untracked, preserved |
| `prototype/mission-control/enterprise-dna-explorer.js` | Untracked, preserved |
| `prototype/mission-control/sample-portfolio-ui.js` | Untracked, preserved |
| `prototype/mission-control/samples/enterprise/README.md` | Untracked, preserved |
| `prototype/mission-control/samples/enterprise/sample-enterprise.js` | Untracked, preserved |
| `prototype/mission-control/samples/enterprise/sample-enterprise.json` | Untracked, preserved |
| `prototype/mission-control/tests/application-navigation.test.js` | Untracked, preserved |
| `prototype/mission-control/tests/enterprise-dna-explorer.test.js` | Untracked, preserved |
| `prototype/mission-control/tests/guided-resize.test.js` | Untracked, preserved |
| `prototype/mission-control/tests/product-hardening.test.js` | Untracked, preserved |
| `prototype/mission-control/tests/synthetic-sample-portfolio.test.js` | Untracked, preserved |
| `prototype/mission-control/tests/typography-labels.test.js` | Untracked, preserved |

### F — Design and product documentation, deliberately excluded

These documents are not dependencies of the committed product baseline and
require separate product/specification review. Their exclusion risk is loss if
the user deletes the working tree; BASE-01 mitigates accidental inclusion, not
that ownership decision.

| Path | State |
|---|---|
| `design/specs/PRS-017_WORKFLOW_RUNTIME_FOUNDATION.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/00_HEURISTIC_EVALUATION.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/01_CAPABILITY_SPEC.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/02_INTERACTION_MODEL.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/03_BEHAVIORAL_SCENARIOS.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/04_ACCEPTANCE_CRITERIA.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/05_ACCESSIBILITY_SPEC.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/06_TEST_PLAN.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/07_IMPLEMENTATION_ROADMAP.md` | Untracked, preserved |
| `design/specs/guided-journey-ux/08_SPEC_REVIEW.md` | Untracked, preserved |

### G — Unrelated completion reports and review evidence, excluded

Each path is historical evidence for an excluded product/prototype packet. It is
not needed by the committed Python baseline and remains untracked pending a
coherent product checkpoint. Inclusion risk is false attribution; exclusion
risk is limited to uncommitted evidence ownership.

| Path | State |
|---|---|
| `work_results/GUIDED-JOURNEY-RESIZABLE-DOCK-RIGHT-result.md` | Preserved |
| `work_results/GUIDED-JOURNEY-UX-REFINEMENT-V2.md` | Preserved |
| `work_results/GUIDED-JOURNEY-UX-REPAIR-result.md` | Preserved |
| `work_results/GUIDED-JOURNEY-UX-REVIEW.md` | Preserved |
| `work_results/MISSION-CONTROL-SCAFFOLD-result.md` | Preserved |
| `work_results/MISSION-CONTROL-V0.1-result.md` | Preserved |
| `work_results/MISSION-CONTROL-V0.2-result.md` | Preserved |
| `work_results/MISSION-CONTROL-V0.3-result.md` | Preserved |
| `work_results/MISSION-CONTROL-V1.2-result.md` | Preserved |
| `work_results/MISSION-CONTROL-V1.3-result.md` | Preserved |
| `work_results/PERSISTENT-APPLICATION-NAVIGATION-result.md` | Preserved |
| `work_results/PORTFOLIO-INTELLIGENCE-STABILIZATION-V1.0.1-result.md` | Preserved |
| `work_results/PRODUCT-HARDENING-SPRINT-result.md` | Preserved |
| `work_results/PRODUCT-SPRINT-01-result.md` | Preserved |
| `work_results/PRODUCT-SPRINT-02-result.md` | Preserved |
| `work_results/PRODUCT-SPRINT-03-result.md` | Preserved |
| `work_results/PRODUCT_EXPERIENCE_REVIEW.md` | Preserved |
| `work_results/PRODUCT_GA_REVIEW.md` | Preserved |
| `work_results/PRODUCT_REVIEW_SAMPLE_ENTERPRISE.md` | Preserved |
| `work_results/RESPONSIVE-STAGE-NAV-result.md` | Preserved |
| `work_results/SPRINT-02-result.md` | Preserved |
| `work_results/SYNTHETIC-SAMPLE-PORTFOLIO-result.md` | Preserved |
| `work_results/TYPOGRAPHY-READABILITY-result.md` | Preserved |

### H — Generated or local-only files, excluded

`.venv/`, `.pytest_cache/`, generated SQLite databases, assessment JSON,
implementation ZIP files, and replan JSON are local or generated artifacts.
They are ignored by the existing `.gitignore`, are not source dependencies, and
were not staged. Committing them would create machine-specific, privacy,
reproducibility, and repository-size risks.

### I — Ambiguous or mixed-responsibility files

| Path | Resolution | Risk treatment |
|---|---|---|
| `app/main.py` | Required workflow and TMI hunks committed; responsive CSS and stage-navigation hunks preserved unstaged | Exact staged tree tested before commit |
| `engine/__init__.py` | Entire broad facade expansion preserved unstaged; committed `run_assessment` export already satisfies current public API | Avoided unnecessary public API and circular-import growth |
| `engine/agency.py` | Candidate-aware delivery-chain dependency committed with TMI | Paired with its test and full regression |
| `tests/test_agency.py` | Required signature assertion committed with dependency | No unrelated assertion absorbed |

## 5. Checkpoint plan

| Checkpoint | Exact boundary | Purpose | Dependencies | Commit message | Reproducible independently |
|---|---|---|---|---|---|
| 1 | The 18 A/B and prerequisite paths listed above, with selective `app/main.py` hunks | Trusted Modernization Intelligence Slices 01–02 | Starting committed workflow/runtime baseline | `feat: add evidence-backed modernization intelligence` | Yes; 118 Python and four committed JS suites passed in a temporary checkout |
| 2 | Four C paths | Inactive RS-03 typed configuration | RS-02 plus checkpoint 1 baseline | `chore: establish inactive runtime configuration foundation` | Yes; 84 focused and 146 full Python tests passed |
| 3 | Twenty-four D/G paths | Approved EMOS engineering and governance workspace | Checkpoints 1–2 for accurate current-state routing | `docs: establish EMOS engineering governance workspace` | Yes; 40 Markdown files and whitespace passed before commit |
| 4 | BASE-01 registry/status updates and this report | Record clean-checkout evidence and complete BASE-01 | Clean validation of `eec5fd5` | `chore: complete reproducible repository baseline` | Yes after final documentation-only verification |

No checkpoint with ambiguous ownership was staged in full.

## 6. Commits created and hashes

| Hash | Commit |
|---|---|
| `7dbd014` | `feat: add evidence-backed modernization intelligence` |
| `711200c` | `chore: establish inactive runtime configuration foundation` |
| `eec5fd5` | `docs: establish EMOS engineering governance workspace` |
| Final BASE-01 completion commit | Contains status metadata and this report; immutable hash reported by the release response |

## 7. Files and hunks included per commit

- `7dbd014`: all A/B source, tests, synthetic evidence, and Slice 01/02 reports;
  only application imports, workflow delegation, trust UI, candidate continuity,
  engineering handoff, approval display, and replan delegation from `app/main.py`.
- `711200c`: only `engine/runtime/__init__.py`, `engine/runtime/config.py`,
  `tests/runtime/test_config.py`, and the RS-03 result report.
- `eec5fd5`: the 24 approved engineering/governance paths listed in section 4.
- Final commit: direct BASE-01/RS-03 status routing and this completion report.

## 8. Files deliberately excluded

All E, F, G, H, and unresolved I paths in section 4 remain excluded. No
Mission Control or browser prototype implementation was committed by BASE-01.
No untracked product review or UX result was absorbed merely because it existed.

## 9. `.gitignore` changes

None. The existing ignore rules already cover `.env`, virtual environments,
bytecode, macOS metadata, SQLite databases, pytest cache, Streamlit local state,
and generated assessment, implementation, and replan artifacts. No broader rule
was necessary.

## 10. Test commands executed

```text
PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest -p no:cacheprovider -q
node --test prototype/mission-control/tests/*.test.js
.venv/bin/python -m pip check
PYTHONPYCACHEPREFIX=/tmp/... .venv/bin/python -m compileall -q app engine tests
.venv/bin/python -m json.tool demo_data/apex_aerospace/evidence_registry.json
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m streamlit run app/main.py --server.headless true --server.port 8767 --browser.gatherUsageStats false
curl --fail --silent http://127.0.0.1:8767/_stcore/health
python3 -m http.server 8768 --directory prototype/mission-control
git diff --check
git diff --cached --check
```

Additional read-only scans checked Runtime Spine imports, credential patterns,
Markdown H1/heading order, fenced and Mermaid blocks, and relative links.

## 11. Test results per checkpoint

- Checkpoint 1 exact staged tree: 118 Python passed; four committed JavaScript
  suites passed; syntax, dependencies, whitespace, Streamlit start, and health
  passed.
- Checkpoint 2 exact staged tree: 84 focused runtime/workflow/agency tests and
  146 full Python tests passed; syntax, whitespace, and activation scan passed.
- Checkpoint 3: 40 Markdown files passed heading, fence, and link validation;
  `git diff --cached --check` passed.
- Current mixed working-tree baseline before checkpointing: 146 Python and ten
  JavaScript suites passed.

## 12. Clean-checkout validation

Clean worktree: `/tmp/emos-base01-final`, created from `eec5fd5`.

- Fresh virtual environment creation: passed.
- Dependency installation from `requirements.txt`: passed without copying the
  original `.venv`.
- Full Python suite: 146 passed.
- Full committed JavaScript suite: four suites passed.
- Python compilation and `pip check`: passed.
- Evidence registry JSON validation: passed.
- Streamlit startup and health endpoint: passed (`ok`).
- Real Streamlit journey: intake, trusted assessment, package generation, and
  budget replanning passed.
- Real Mission Control journey: Guided Demo, discovery action, discovery
  completion, Mission Control/HQ synchronization, and Full Reset passed.
- Clean worktree remained clean after test outputs because generated artifacts
  and environments are ignored.

No source or test file was copied manually from the original working tree.

## 13. Apex golden-result verification

Automated and browser evidence confirmed:

- Oracle Customer Analytics Warehouse remains priority 1.
- Priority score remains 64.4.
- Deterministic disposition remains Replatform.
- Migration wave remains Wave 1.
- Assessment trust is Blocked by the intentional synthetic ownership conflict;
  evidence health is 97.3% complete and the numeric score is unchanged.
- Schema-v1 assessment artifact and SQLite metadata agree in automated tests.

## 14. Runtime activation verification

No import of `engine.runtime`, `.runtime`, or runtime configuration exists in
`app/main.py` or current top-level `engine/*.py` execution modules. Importing
RS-03 defines configuration only. No adapter, connection, queue, worker,
persistence runtime, checkpoint, retry executor, authorization boundary, or
telemetry path was activated. `engine.workflow` remains the sole current Python
workflow and behavior owner.

## 15. Security and credential checks

- Refined credential-pattern scan: zero findings.
- Earlier broad scans produced only benign `task-*`/`RISK-*` identifier matches
  and negative assertions such as `"api_key" not in lowered`.
- No `.env`, database, private key, token, password, API key, local absolute
  user path, or provider credential was committed.
- Evidence is explicitly synthetic and uses bounded `demo://` references.

## 16. Remaining working-tree changes

After the three foundation checkpoints and before this final evidence commit,
the original worktree contains 55 intentionally preserved paths: nine tracked
modifications and 46 untracked files. They are listed individually in sections
4E, 4F, 4G, and 4I. Ignored local/runtime output remains present but untracked.

## 17. BASE-01 acceptance criteria

| Criterion | Result |
|---|---|
| Slice 01 source, tests, data, UI, artifacts, and evidence committed | Pass |
| Slice 02 source, tests, evidence quality, findings, UI, and evidence committed | Pass |
| Approved engineering workspace/governance committed | Pass |
| Runtime work isolated or explicitly deferred | Pass; RS-03 isolated and inactive |
| Mission Control/product work preserved and not absorbed | Pass |
| No user work deleted or overwritten | Pass |
| No secret, database, cache, environment, or machine artifact committed | Pass |
| Coherent attributable commits | Pass |
| Relevant validation per commit | Pass |
| Final clean checkout full suite and health | Pass |
| No untracked-source dependency | Pass |
| Apex golden behavior unchanged | Pass |
| Guided Journey unchanged | Pass |
| Runtime inactive | Pass |
| Whitespace and credential scans | Pass |
| Governance metadata accurate | Pass |
| Remaining changes inventoried | Pass |
| Rollback reference exists | Pass |
| Completion report evidence-backed | Pass |

## 18. Criteria not met

None of the critical BASE-01 criteria are unmet.

## 19. Known limitations

- The main working tree is intentionally not clean because unrelated product and
  prototype work remains preserved. Reproducibility applies to committed HEAD.
- The clean committed JavaScript suite contains four tests; six additional
  working-tree suites belong to excluded product work and are not baseline tests.
- Streamlit emitted one framework warning that an optional JavaScript worker was
  unavailable. The server also emitted the existing LibreSSL warning and
  optional Watchdog recommendation. No browser error occurred and health stayed
  `ok`.
- `requirements.txt` uses bounded ranges rather than a lockfile, so exact
  transitive package versions may change within those ranges. Fresh installation
  succeeded, but byte-for-byte dependency reproducibility is not claimed.
- Local SQLite and filesystem artifacts remain single-process demo boundaries,
  not production durability or tenant isolation.

## 20. Exact repository state after completion

- Branch: `feature/responsive-functional-parity`.
- Safety branch: `codex/backup-base01-20260802` at `5740085`.
- Functional and governance validation baseline: `eec5fd5`.
- Final HEAD: BASE-01 completion commit containing this report and registry
  update; exact hash is reported in the release response.
- Intentionally preserved work: 55 modified/untracked paths as catalogued above.
- Staged unrelated files: none.

## 21. Recommendation for the next registered slice

RS-04 is the next planned Runtime Spine slice because BASE-01 and RS-03 are now
Complete. It is not authorized by this result. Before implementation, obtain the
separate RS-04 work-packet approval and preserve the default inactive/legacy
behavior. DS-01 and the MMEP were not started.

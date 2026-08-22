# AGENCY-01 — Grounded Risk Specialist Agent Result

## Status and outcome

**Implemented and committed** on 2026-08-22 at implementation commit `bbd1f5d`.
That exact commit passed clean-archive Python regression, compilation, and the
no-key CLI demo. The approved packet was committed separately at `3027a0e`
before implementation began.

AGENCY-01 adds one bounded Risk specialist that can call exactly three
read-only deterministic tools. Model output is accepted only when every summary
line exactly matches a claim returned by those tools and every citation exactly
matches the evidence IDs attached to those claims. Provider, schema, tool, and
grounding failures use the deterministic fallback.

`Evidence -> deterministic engines -> three read-only tools -> grounded narrative`

## Governance and architecture

- Governing packet: `work_packets/WP-AGENCY-01-risk-agent.md`.
- Official packet identifier: `AGENCY-01`; no registry or release status was
  changed because AGENCY-01 is not present in the current official registries.
- No ADR was added. The implementation stays inside the packet's explicit
  model/tool boundary, adds no authoritative state, persistence boundary,
  deployment unit, or public top-level engine export.
- `engine/assessment.py`, `engine/modernization_strategy.py`,
  `engine/workflow.py`, and `engine/engineering.py` were not modified.
- The agent has a closed dispatcher with only `get_evidence_quality`,
  `get_assessment`, and `get_recommendation`. Unknown names fail closed.
- No write, deploy, execution, artifact-generation, workflow, or engineering
  function is exposed to the agent.
- Numeric scores, recommendation, trust state, and execution authority remain
  outputs of the existing deterministic Python engines. `RiskNarrative`
  forbids extra fields, so it cannot carry a replacement numeric score.

## Files created

- `engine/agents/__init__.py`
- `engine/agents/risk_agent.py`
- `scripts/demo_risk_agent.py`
- `tests/test_risk_agent.py`
- `work_results/AGENCY-01-result.md`

## Files modified

- `requirements.txt` — declares the approved optional OpenAI Python SDK used by
  the live Responses API path.

The pre-existing change in
`prototype/mission-control/portfolio-lab-ui.js` was preserved and excluded from
both AGENCY-01 commits.

## Tool support matrix

| Tool | Existing deterministic owner | Returned boundary | Effects |
|---|---|---|---|
| `get_evidence_quality(asset_id)` | `engine/evidence_quality.py` | Asset quality results, findings, trust, evidence IDs, exact grounded claim | Read only |
| `get_assessment(asset_id)` | `engine/assessment.py` | Existing assessment row, calculation owner, evidence IDs, exact grounded claim | Read only |
| `get_recommendation(asset_id)` | `engine/modernization_strategy.py` | Existing governed 6R recommendation, evidence IDs, exact grounded claim | Read only |

All tool schemas use strict mode, require only `asset_id`, and reject additional
properties. The live path requires all three tools exactly once with the
original asset ID. A duplicate, omitted, unknown, or altered call fails into
the deterministic fallback without executing the unauthorized request.

## Structured output and grounding

`RiskNarrative` contains only:

- `summary: str`
- `cited_findings: list[str]`
- `confidence: Literal["low", "medium", "high"]`

Grounding is enforced after model output, not trusted to prompting alone:

1. Every non-empty summary line must exactly equal a tool-returned claim.
2. Citations must be unique and equal the evidence IDs attached to the selected
   claims.
3. Every citation must exist in an evidence-ID list returned during that call.
4. Invalid or malformed model output is discarded and rebuilt from tool
   returns by the deterministic fallback.

The confidence field describes only confidence in the narrative. It is not a
numeric evidence confidence, assessment score, recommendation confidence, or
trust-state replacement.

## Deterministic fallback and error handling

- With `OPENAI_API_KEY` absent, no OpenAI import or call is attempted.
- Provider and malformed/ungrounded response failures execute the read-only
  tools locally and build the narrative directly from their exact claim values.
- If one read-only tool fails, fallback uses only successful tool returns and
  keeps the same grounding proof.
- If no tool can return grounded evidence, the agent raises a controlled
  `RiskAgentError`.
- Malformed identifiers are rejected before any provider or tool call; unknown
  synthetic identifiers fail with a sanitized controlled error.

## Tests and commands

Focused AGENCY-01 validation with the API key explicitly removed:

```text
env -u OPENAI_API_KEY PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest -q -p no:cacheprovider tests/test_risk_agent.py
10 passed in 0.55s
```

An earlier focused run passed `9 passed in 1.39s`; the final tenth test was added
to prove the closed dispatcher rejects every non-allowlisted function.

Final Python regression:

```text
env -u OPENAI_API_KEY PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest -q -p no:cacheprovider
169 passed in 1.04s
```

Exact-commit clean-archive regression for `bbd1f5d`:

```text
git archive bbd1f5d | tar -x -C <temporary-directory>
env -u OPENAI_API_KEY PYTHONDONTWRITEBYTECODE=1 <workspace-venv>/bin/python -m pytest -q -p no:cacheprovider
169 passed in 1.05s
```

Additional results:

- `git diff --check`: passed.
- `pip check`: no broken requirements; pip reported only its unwritable external
  cache warning.
- `compileall`: passed with bytecode redirected to a task-specific `/tmp`
  location.
- The first `compileall` attempt failed because macOS redirected bytecode to an
  external user cache blocked by the sandbox; the source files were not the
  cause, and the controlled `/tmp` rerun passed.
- Prohibited-file diff scan: no changes.
- Write/deploy/execution and credential-pattern scans: no exposed agent tool or
  credential found.
- No-key CLI demo: passed and displayed the grounded Apex narrative.
- Streamlit initially could not bind a sandboxed port; the approved localhost
  rerun started successfully and `/_stcore/health` returned `ok`.
- Streamlit emitted the existing LibreSSL warning and optional Watchdog
  suggestion; neither affected health.

## Acceptance and controls

1. **Valid live and fallback output:** passed. The golden live transcript uses
   an injected Responses-compatible client with an API key present; missing-key
   and provider-failure paths return valid `RiskNarrative` objects.
2. **Programmatic citation traceability:** passed. Tests independently compare
   every summary line and citation with the captured per-call tool returns, and
   the production grounding validator enforces the same invariant.
3. **No numeric or governed-state override:** passed. Tool wrappers return
   deterministic values unchanged; the narrative schema rejects numeric score
   fields and recommendation execution authority remains `None`.
4. **New and existing tests:** passed: `10` focused and `169` full-suite tests.
5. **Completion report:** satisfied by this file.

Definition-of-done evidence:

- App starts and reports healthy.
- The feature is visible through the bounded CLI demo.
- Narrative output is displayed as structured JSON.
- Missing key, provider failure, partial tool failure, malformed output,
  malformed ID, unknown ID, and unauthorized function names are handled.
- Existing Python features pass the full regression suite.

## Known limitations

- This first specialist intentionally uses only the synthetic Apex evidence
  registry and its fixed reproducible assessment timestamp.
- The optional Streamlit panel was not added; the packet's minimum visible
  surface is the read-only CLI demo.
- No paid or external OpenAI request was made during validation. The live
  protocol is covered by the fixed Responses-compatible golden transcript;
  production credentials and network access remain environment concerns.
- The current workspace virtual environment does not contain the newly declared
  OpenAI SDK. This does not affect the required no-key path; a normal dependency
  installation is required before a real provider call.
- Narrative output is displayed but not persisted. The packet explicitly allows
  a script display as the minimum feature surface and introduces no new
  persistence scope.

## Demo steps

1. Ensure `OPENAI_API_KEY` is unset to exercise the guaranteed fallback.
2. From the repository root, run:

   ```text
   env -u OPENAI_API_KEY .venv/bin/python -m scripts.demo_risk_agent APX-PLT-001
   ```

3. Confirm the JSON names Oracle Customer Analytics Warehouse, preserves
   migration risk `70.8`, preserves the deterministic `Replatform`
   recommendation with `Blocked` trust and execution authority `None`, and
   lists only returned `EVD-*` identifiers in `cited_findings`.
4. Run the focused proof:

   ```text
   env -u OPENAI_API_KEY .venv/bin/python -m pytest -q -p no:cacheprovider tests/test_risk_agent.py
   ```

No other work packet was started.

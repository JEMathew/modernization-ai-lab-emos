# Work Packet: AGENCY-01 — Grounded Risk Specialist Agent

## Objective

Introduce the first genuinely agentic (LLM + tool-calling) specialist into the
Modernization AI Agency: a Risk agent that explains risk findings by calling
existing deterministic engine functions as tools, rather than by returning a
scripted string. This proves the grounded-agent pattern before it is extended
to other specialists.

This packet does **not** change scoring, workflow, or UI structure. It adds a
new, isolated capability behind the existing Agency interface.

## Why this scope

Phase 1 of a five-phase rollout toward an agentic Modernization AI Agency.
Kept intentionally small so the tool-calling pattern, grounding guarantees,
and fallback behavior can be reviewed and tested before any orchestration or
UI change is attempted.

## In scope

- A new module, `engine/agents/risk_agent.py`, implementing a single
  tool-calling agent.
- Tool functions the agent may call (read-only, wrapping existing code —
  no new logic duplicated):
  - `get_evidence_quality(asset_id)` → wraps `engine/evidence_quality.py`
  - `get_assessment(asset_id)` → wraps `engine/assessment.py`
  - `get_recommendation(asset_id)` → wraps `engine/modernization_strategy.py`
- A structured output schema (Pydantic), e.g. `RiskNarrative`, containing:
  - `summary: str`
  - `cited_findings: list[str]` (must reference tool-returned evidence IDs)
  - `confidence: Literal["low","medium","high"]` (LLM's stated confidence in
    its narrative only — never a substitute for the deterministic evidence
    confidence already produced by `engine/evidence_quality.py`)
- Deterministic fallback: if no `OPENAI_API_KEY` is configured, or a call
  fails, return a rule-based narrative built directly from tool outputs
  (no free text generation) — matching today's "works with zero API key"
  guarantee.
- Golden-transcript tests: fixed evidence input → assert tool calls made,
  assert output schema validity, assert every `cited_findings` entry
  traces to an actual tool return value. Do **not** assert exact LLM prose.
- A completion report in `work_results/` per the existing template.

## Out of scope (explicitly)

- No changes to `engine/assessment.py`, `engine/modernization_strategy.py`,
  or any scoring logic.
- No changes to `engine/workflow.py` or Decision Room orchestration.
- No new Streamlit UI beyond a single read-only panel to display the
  agent's narrative for manual review (optional, only if time allows).
- No other specialist agents in this packet (Discovery, Planning, etc. are
  future packets).
- No write/execution tools — the agent cannot call `engine/engineering.py`
  or any function that produces artifacts or external effects.
- No removal of existing scripted specialist behavior in the browser
  prototype (`prototype/mission-control/`) — Python and prototype surfaces
  remain unconnected, as today.

## Dependencies

- `OPENAI_API_KEY` (optional — must degrade gracefully without it).
- Existing `engine/evidence.py`, `engine/evidence_quality.py`,
  `engine/assessment.py`, `engine/modernization_strategy.py` (read-only use).
- OpenAI Python SDK (already an approved dependency per `AGENTS.md`).

## Product rules that apply (from AGENTS.md, restated for this packet)

- The agent explains; it does not invent or override numeric scores.
- Every narrative claim must cite a tool-returned finding or evidence ID.
- The app must work with zero API calls (deterministic fallback required).
- No execution authority — the agent has no access to any write/deploy tool.
- Add tests before considering the packet done.

## Acceptance criteria

1. `RiskAgent.explain(asset_id)` returns a valid `RiskNarrative` in both
   live (API key present) and fallback (no key / call failure) modes.
2. Every entry in `cited_findings` is verifiably present in the tool output
   for that call (test asserts this programmatically, not by inspection).
3. No test or code path allows the agent to alter a numeric score,
   recommendation, or trust state.
4. New tests pass; all existing tests continue to pass unmodified.
5. A completion report exists in `work_results/` documenting files changed,
   commands run, and test results.

## Definition of done

Per `AGENTS.md`: app starts, required tests pass, feature is visible
(at minimum via a script or notebook demo, ideally a read-only UI panel),
generated output is stored or displayed, error states are handled
(missing key, tool failure, malformed asset_id), existing features
still work.

## Suggested file layout

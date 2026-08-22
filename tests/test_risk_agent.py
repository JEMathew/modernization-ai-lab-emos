import json
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

import engine.agents.risk_agent as risk_module
from engine.agents.risk_agent import (
    TOOL_DEFINITIONS,
    TOOL_NAMES,
    RiskAgent,
    RiskAgentError,
    RiskNarrative,
    get_assessment,
    get_evidence_quality,
    get_recommendation,
    is_grounded_narrative,
)


ASSET_ID = "APX-PLT-001"


class GoldenTranscriptClient:
    def __init__(self, malformed_final: bool = False) -> None:
        self.responses = self
        self.calls = []
        self.malformed_final = malformed_final

    def create(self, **kwargs):
        self.calls.append(kwargs)
        if len(self.calls) == 1:
            output = [
                SimpleNamespace(
                    type="function_call",
                    name=name,
                    arguments=json.dumps({"asset_id": ASSET_ID}),
                    call_id=f"call-{index}",
                )
                for index, name in enumerate(TOOL_NAMES)
            ]
            return SimpleNamespace(output=output)

        tool_outputs = [
            json.loads(item["output"])
            for item in kwargs["input"]
            if isinstance(item, dict) and item.get("type") == "function_call_output"
        ]
        claims = [output["claims"][0] for output in tool_outputs]
        citations = sorted(
            {item for claim in claims for item in claim["evidence_ids"]}
        )
        summary = "Untraceable model claim." if self.malformed_final else "\n".join(
            claim["text"] for claim in claims
        )
        return SimpleNamespace(
            output_text=json.dumps(
                {
                    "summary": summary,
                    "cited_findings": citations,
                    "confidence": "medium",
                }
            )
        )


class FailingClient:
    def __init__(self) -> None:
        self.responses = self

    def create(self, **kwargs):
        raise RuntimeError("simulated provider failure")


def test_tool_wrappers_return_existing_deterministic_values() -> None:
    quality = get_evidence_quality(ASSET_ID)
    assessment = get_assessment(ASSET_ID)
    recommendation = get_recommendation(ASSET_ID)

    assert quality["trust_status"] == "Blocked"
    assert assessment["assessment"]["migration_risk"] == 70.8
    assert recommendation["recommendation"]["recommended_strategy"] == "Replatform"
    assert recommendation["recommendation"]["execution_authority"] == "None"


def test_no_key_calls_all_tools_and_returns_grounded_fallback(monkeypatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    agent = RiskAgent()

    narrative = agent.explain(ASSET_ID)

    assert isinstance(narrative, RiskNarrative)
    assert agent.last_tool_calls == TOOL_NAMES
    assert set(agent.last_tool_outputs) == set(TOOL_NAMES)
    assert is_grounded_narrative(narrative, agent.last_tool_outputs)
    assert narrative.confidence == "low"


def test_golden_transcript_calls_only_three_read_only_tools(monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-placeholder")
    client = GoldenTranscriptClient()
    agent = RiskAgent(client=client)

    narrative = agent.explain(ASSET_ID)

    assert agent.last_tool_calls == TOOL_NAMES
    assert is_grounded_narrative(narrative, agent.last_tool_outputs)
    declared_names = tuple(tool["name"] for tool in client.calls[0]["tools"])
    assert declared_names == TOOL_NAMES
    assert declared_names == (
        "get_evidence_quality",
        "get_assessment",
        "get_recommendation",
    )
    assert all(tool["strict"] for tool in TOOL_DEFINITIONS)
    assert all(
        tool["parameters"]["additionalProperties"] is False
        for tool in TOOL_DEFINITIONS
    )


def test_closed_dispatcher_rejects_every_other_function() -> None:
    with pytest.raises(RiskAgentError, match="not authorized"):
        risk_module._call_tool("store_or_execute", ASSET_ID)


def test_every_claim_and_citation_is_programmatically_traceable(monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-placeholder")
    agent = RiskAgent(client=GoldenTranscriptClient())
    narrative = agent.explain(ASSET_ID)

    returned_claims = {
        claim["text"]
        for output in agent.last_tool_outputs.values()
        for claim in output["claims"]
    }
    returned_evidence = {
        evidence_id
        for output in agent.last_tool_outputs.values()
        for evidence_id in output["evidence_ids"]
    }
    assert set(narrative.summary.splitlines()).issubset(returned_claims)
    assert set(narrative.cited_findings).issubset(returned_evidence)
    assert is_grounded_narrative(narrative, agent.last_tool_outputs)


def test_ungrounded_live_output_is_replaced_by_grounded_fallback(monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-placeholder")
    agent = RiskAgent(client=GoldenTranscriptClient(malformed_final=True))

    narrative = agent.explain(ASSET_ID)

    assert is_grounded_narrative(narrative, agent.last_tool_outputs)
    assert "Untraceable model claim" not in narrative.summary


def test_provider_failure_uses_deterministic_fallback(monkeypatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "test-placeholder")
    agent = RiskAgent(client=FailingClient())

    narrative = agent.explain(ASSET_ID)

    assert agent.last_tool_calls == TOOL_NAMES
    assert is_grounded_narrative(narrative, agent.last_tool_outputs)


def test_one_tool_failure_uses_only_remaining_tool_returns(monkeypatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    def fail_quality(asset_id: str):
        raise RuntimeError("simulated read failure")

    monkeypatch.setattr(risk_module, "get_evidence_quality", fail_quality)
    agent = RiskAgent()
    narrative = agent.explain(ASSET_ID)

    assert agent.last_tool_calls == TOOL_NAMES
    assert set(agent.last_tool_outputs) == {"get_assessment", "get_recommendation"}
    assert is_grounded_narrative(narrative, agent.last_tool_outputs)


def test_malformed_and_unknown_asset_ids_fail_safely(monkeypatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(ValueError, match="valid bounded identifier"):
        RiskAgent().explain("../../secret")
    with pytest.raises(RiskAgentError, match="No grounded risk evidence"):
        RiskAgent().explain("APX-PLT-999")


def test_output_schema_cannot_carry_or_override_numeric_scores() -> None:
    with pytest.raises(ValidationError, match="extra_forbidden"):
        RiskNarrative.model_validate(
            {
                "summary": "claim",
                "cited_findings": [],
                "confidence": "low",
                "migration_risk": 0,
            }
        )

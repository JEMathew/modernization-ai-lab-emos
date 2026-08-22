"""Grounded risk specialist with three read-only deterministic tools."""

from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from engine.assessment import (
    assess_portfolio,
    build_criterion_results,
    current_assessment_definition,
)
from engine.evidence import (
    create_evidence_snapshot,
    load_evidence_registry,
    portfolio_from_snapshot,
)
from engine.evidence_quality import (
    derive_assessment_trust_status,
    evaluate_evidence_quality,
)
from engine.modernization_strategy import build_modernization_recommendations


_ROOT_DIR = Path(__file__).resolve().parents[2]
_EVIDENCE_PATH = _ROOT_DIR / "demo_data" / "apex_aerospace" / "evidence_registry.json"
_AS_OF = datetime(2026, 8, 1, tzinfo=timezone.utc)
_RUN_ID = "AGENCY-01-RISK"
_ASSET_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")


class RiskNarrative(BaseModel):
    """A narrative whose claims are validated against read-only tool returns."""

    model_config = ConfigDict(extra="forbid", strict=True, str_strip_whitespace=True)

    summary: str = Field(min_length=1)
    cited_findings: list[str] = Field(default_factory=list)
    confidence: Literal["low", "medium", "high"]


class RiskAgentError(RuntimeError):
    """Controlled failure when no grounded narrative can be produced."""


def _validate_asset_id(asset_id: str) -> str:
    if not isinstance(asset_id, str) or not _ASSET_ID_PATTERN.fullmatch(asset_id):
        raise ValueError("asset_id must be a valid bounded identifier")
    return asset_id


def _build_grounded_context(asset_id: str) -> dict[str, Any]:
    """Run the existing deterministic engines without changing their outputs."""

    asset_id = _validate_asset_id(asset_id)
    records = load_evidence_registry(_EVIDENCE_PATH)
    enterprise_ids = {record.enterprise_id for record in records}
    if len(enterprise_ids) != 1:
        raise RiskAgentError("Risk evidence must belong to one synthetic enterprise.")
    enterprise_id = next(iter(enterprise_ids))
    asset_ids = sorted(
        {
            record.asset_id
            for record in records
            if record.evidence_category == "portfolio_inventory"
        }
    )
    if asset_id not in asset_ids:
        raise ValueError(f"Unknown synthetic asset_id: {asset_id}")

    snapshot = create_evidence_snapshot(records, enterprise_id, asset_ids, _AS_OF)
    assessment = assess_portfolio(portfolio_from_snapshot(snapshot))
    definition = current_assessment_definition()
    criterion_results = build_criterion_results(assessment, snapshot, definition)
    quality = evaluate_evidence_quality(
        _RUN_ID,
        snapshot,
        definition,
        criterion_results,
        _AS_OF,
    )
    recommendations = build_modernization_recommendations(
        assessment.to_dict(orient="records"),
        snapshot,
        _RUN_ID,
        _AS_OF,
        criterion_results,
        quality.quality_results,
        quality.findings,
    )
    return {
        "snapshot": snapshot,
        "assessment": assessment,
        "criterion_results": criterion_results,
        "quality": quality,
        "recommendations": recommendations,
    }


def get_evidence_quality(asset_id: str) -> dict[str, Any]:
    """Return evidence health and findings from the deterministic quality engine."""

    context = _build_grounded_context(asset_id)
    snapshot = context["snapshot"]
    bundle = context["quality"]
    quality_results = tuple(
        result for result in bundle.quality_results if result.asset_id == asset_id
    )
    findings = tuple(
        finding for finding in bundle.findings if finding.asset_id == asset_id
    )
    evidence_ids = sorted(
        record.evidence_id for record in snapshot.records if record.asset_id == asset_id
    )
    implicated_ids = sorted(
        {
            evidence_id
            for result in quality_results
            for evidence_id in (
                *result.stale_evidence_ids,
                *result.conflicting_evidence_ids,
            )
        }
    )
    citations = implicated_ids or evidence_ids
    trust_status, trust_explanation = derive_assessment_trust_status(quality_results)
    claim = (
        f"Evidence quality for {asset_id} is {trust_status}: "
        f"{trust_explanation}"
    )
    return {
        "tool": "get_evidence_quality",
        "asset_id": asset_id,
        "trust_status": trust_status,
        "quality_results": [
            result.model_dump(mode="json") for result in quality_results
        ],
        "findings": [finding.model_dump(mode="json") for finding in findings],
        "evidence_ids": evidence_ids,
        "claims": [{"text": claim, "evidence_ids": citations}],
    }


def get_assessment(asset_id: str) -> dict[str, Any]:
    """Return the existing Python-calculated assessment row for one asset."""

    context = _build_grounded_context(asset_id)
    snapshot = context["snapshot"]
    assessment = context["assessment"]
    row = assessment.loc[assessment["platform_id"] == asset_id].iloc[0].to_dict()
    evidence_ids = sorted(
        record.evidence_id
        for record in snapshot.records
        if record.asset_id == asset_id
        and record.evidence_category == "portfolio_inventory"
    )
    claim = (
        f"{row['platform_name']} has Python-calculated migration risk "
        f"{row['migration_risk']} and priority rank {row['priority_rank']}."
    )
    return {
        "tool": "get_assessment",
        "asset_id": asset_id,
        "assessment": row,
        "calculation_owner": "Python deterministic assessment engine",
        "evidence_ids": evidence_ids,
        "claims": [{"text": claim, "evidence_ids": evidence_ids}],
    }


def get_recommendation(asset_id: str) -> dict[str, Any]:
    """Return the existing governed 6R recommendation without decision authority."""

    context = _build_grounded_context(asset_id)
    recommendation = next(
        item for item in context["recommendations"] if item.asset_id == asset_id
    )
    evidence_ids = sorted(
        item.evidence_id for item in recommendation.supporting_evidence
    )
    claim = (
        f"{recommendation.asset_name} has deterministic "
        f"{recommendation.recommended_strategy.value} recommendation with "
        f"{recommendation.trust_status} trust and execution authority "
        f"{recommendation.execution_authority}."
    )
    return {
        "tool": "get_recommendation",
        "asset_id": asset_id,
        "recommendation": recommendation.model_dump(mode="json"),
        "evidence_ids": evidence_ids,
        "claims": [{"text": claim, "evidence_ids": evidence_ids}],
    }


TOOL_NAMES = (
    "get_evidence_quality",
    "get_assessment",
    "get_recommendation",
)
TOOL_DEFINITIONS = tuple(
    {
        "type": "function",
        "name": name,
        "description": description,
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "asset_id": {
                    "type": "string",
                    "description": "Synthetic asset identifier to inspect.",
                }
            },
            "required": ["asset_id"],
            "additionalProperties": False,
        },
    }
    for name, description in (
        ("get_evidence_quality", "Read deterministic evidence quality and findings."),
        ("get_assessment", "Read the deterministic assessment for an asset."),
        ("get_recommendation", "Read the governed deterministic 6R recommendation."),
    )
)

_NARRATIVE_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string", "minLength": 1},
        "cited_findings": {"type": "array", "items": {"type": "string"}},
        "confidence": {"type": "string", "enum": ["low", "medium", "high"]},
    },
    "required": ["summary", "cited_findings", "confidence"],
    "additionalProperties": False,
}


def is_grounded_narrative(
    narrative: RiskNarrative,
    tool_outputs: dict[str, dict[str, Any]],
) -> bool:
    """Prove each summary line and citation came from this call's tool returns."""

    claim_citations: dict[str, set[str]] = {}
    returned_evidence_ids: set[str] = set()
    for output in tool_outputs.values():
        returned_evidence_ids.update(output.get("evidence_ids", []))
        for claim in output.get("claims", []):
            claim_citations[str(claim["text"])] = set(claim["evidence_ids"])

    lines = [line.strip() for line in narrative.summary.splitlines() if line.strip()]
    if not lines or any(line not in claim_citations for line in lines):
        return False
    expected_citations = set().union(*(claim_citations[line] for line in lines))
    actual_citations = narrative.cited_findings
    return (
        len(actual_citations) == len(set(actual_citations))
        and set(actual_citations) == expected_citations
        and set(actual_citations).issubset(returned_evidence_ids)
    )


def _call_tool(name: str, asset_id: str) -> dict[str, Any]:
    """Dispatch through the closed read-only allowlist; no extension hook exists."""

    if name == "get_evidence_quality":
        return get_evidence_quality(asset_id)
    if name == "get_assessment":
        return get_assessment(asset_id)
    if name == "get_recommendation":
        return get_recommendation(asset_id)
    raise RiskAgentError("The requested tool is not authorized.")


class RiskAgent:
    """Explain deterministic risk using only the three declared read-only tools."""

    def __init__(self, client: Any | None = None, model: str = "gpt-5.6") -> None:
        self._client = client
        self._model = model
        self.last_tool_calls: tuple[str, ...] = ()
        self.last_tool_outputs: dict[str, dict[str, Any]] = {}

    def explain(self, asset_id: str) -> RiskNarrative:
        asset_id = _validate_asset_id(asset_id)
        if self._client is None and not os.getenv("OPENAI_API_KEY"):
            return self._fallback(asset_id)
        try:
            return self._explain_live(asset_id)
        except Exception:
            return self._fallback(asset_id)

    def _explain_live(self, asset_id: str) -> RiskNarrative:
        client = self._client or _create_openai_client()
        input_items: list[Any] = [
            {
                "role": "user",
                "content": (
                    f"Explain risk for {asset_id}. Call all three tools exactly once. "
                    "Never create or change a score."
                ),
            }
        ]
        response = client.responses.create(
            model=self._model,
            instructions=(
                "You are a read-only risk specialist. Use only the supplied tools. "
                "Call all three once with the requested asset_id."
            ),
            tools=list(TOOL_DEFINITIONS),
            parallel_tool_calls=True,
            input=input_items,
        )
        input_items.extend(response.output)
        outputs: dict[str, dict[str, Any]] = {}
        calls: list[str] = []
        for item in response.output:
            if item.type != "function_call":
                continue
            if item.name not in TOOL_NAMES or item.name in outputs:
                raise RiskAgentError("The model requested an unauthorized tool call.")
            arguments = json.loads(item.arguments)
            if arguments != {"asset_id": asset_id}:
                raise RiskAgentError("The model changed the bounded tool arguments.")
            result = _call_tool(item.name, asset_id)
            calls.append(item.name)
            outputs[item.name] = result
            input_items.append(
                {
                    "type": "function_call_output",
                    "call_id": item.call_id,
                    "output": json.dumps(result, sort_keys=True),
                }
            )
        if set(outputs) != set(TOOL_NAMES) or len(calls) != len(TOOL_NAMES):
            raise RiskAgentError("The model did not call every required read-only tool.")

        final_response = client.responses.create(
            model=self._model,
            instructions=(
                "Return JSON only. The summary must contain one or more exact claim "
                "strings from tool output, one per line. cited_findings must equal "
                "the evidence_ids attached to those selected claims. Do not add prose, "
                "facts, scores, recommendations, or citations. Confidence describes "
                "only the narrative."
            ),
            tools=list(TOOL_DEFINITIONS),
            tool_choice="none",
            input=input_items,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "risk_narrative",
                    "schema": _NARRATIVE_SCHEMA,
                    "strict": True,
                }
            },
        )
        narrative = RiskNarrative.model_validate_json(final_response.output_text)
        if not is_grounded_narrative(narrative, outputs):
            raise RiskAgentError("The model response was not grounded in tool output.")
        self.last_tool_calls = tuple(calls)
        self.last_tool_outputs = outputs
        return narrative

    def _fallback(self, asset_id: str) -> RiskNarrative:
        outputs: dict[str, dict[str, Any]] = {}
        calls: list[str] = []
        for name in TOOL_NAMES:
            calls.append(name)
            try:
                outputs[name] = _call_tool(name, asset_id)
            except Exception:
                continue
        self.last_tool_calls = tuple(calls)
        self.last_tool_outputs = outputs
        if not outputs:
            raise RiskAgentError(
                f"No grounded risk evidence is available for asset {asset_id}."
            )

        claims = [output["claims"][0] for output in outputs.values()]
        citations = sorted(
            {evidence_id for claim in claims for evidence_id in claim["evidence_ids"]}
        )
        quality_status = outputs.get("get_evidence_quality", {}).get("trust_status")
        confidence: Literal["low", "medium", "high"] = {
            "Ready": "high",
            "ReadyWithWarnings": "medium",
        }.get(quality_status, "low")
        narrative = RiskNarrative(
            summary="\n".join(claim["text"] for claim in claims),
            cited_findings=citations,
            confidence=confidence,
        )
        if not is_grounded_narrative(narrative, outputs):
            raise RiskAgentError("Deterministic risk narrative grounding failed.")
        return narrative


def _create_openai_client() -> Any:
    try:
        from openai import OpenAI
    except ImportError as exc:
        raise RiskAgentError("The optional OpenAI SDK is unavailable.") from exc
    return OpenAI()

"""Deterministic modernization consulting assessment engine.

Every score and recommendation in this module is calculated by Python. No AI
or external service participates in assessment decisions.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

import pandas as pd

from .assessment_models import (
    AssessmentDefinition,
    AssessmentRun,
    CriterionDefinition,
    CriterionResult,
)
from .evidence import EvidenceSnapshot, sha256_json
from .evidence_quality import (
    FINDING_GENERATION_VERSION,
    FRESHNESS_POLICY_VERSION,
    evaluate_evidence_quality,
)
from .modernization_strategy import build_modernization_recommendations


SCORE_COLUMNS = (
    "business_value",
    "technical_debt",
    "cloud_readiness",
    "ai_readiness",
    "complexity",
    "migration_risk",
    "priority_score",
)

ASSESSMENT_SCHEMA_VERSION = "1.0"
ASSESSMENT_DEFINITION_ID = "MODERNIZATION-PORTFOLIO-ASSESSMENT"
ASSESSMENT_DEFINITION_VERSION = "1.0.0"
ASSESSMENT_ENGINE_VERSION = "1.0.0"
CALCULATION_OWNER = "Python deterministic assessment engine"

CRITICALITY_SCORE = {"critical": 90, "high": 76, "medium": 60, "low": 38}
LIFECYCLE_DEBT = {
    "end of support": 92,
    "extended support": 68,
    "vendor supported": 38,
    "strategic": 20,
}
PLATFORM_VALUE = {
    "data warehouse": 8,
    "data lake": 7,
    "data integration": 6,
    "business intelligence": 5,
    "operational reporting": 4,
    "data mart": 3,
}
PLATFORM_CLOUD_READINESS = {
    "data warehouse": 82,
    "data lake": 72,
    "data integration": 66,
    "business intelligence": 78,
    "operational reporting": 70,
    "data mart": 76,
}
PLATFORM_AI_READINESS = {
    "data warehouse": 86,
    "data lake": 90,
    "data integration": 68,
    "business intelligence": 72,
    "operational reporting": 60,
    "data mart": 64,
}
PLATFORM_COMPLEXITY = {
    "data warehouse": 18,
    "data lake": 24,
    "data integration": 22,
    "business intelligence": 12,
    "operational reporting": 14,
    "data mart": 10,
}


def _bounded(value: float) -> float:
    return round(max(0.0, min(100.0, value)), 1)


def _normalized(value: float) -> str:
    return str(value).strip().casefold()


def _business_value(row: pd.Series) -> float:
    criticality = CRITICALITY_SCORE.get(_normalized(row["criticality"]), 50)
    platform_value = PLATFORM_VALUE.get(_normalized(row["platform_type"]), 2)
    return _bounded(criticality + platform_value)


def _technical_debt(row: pd.Series) -> float:
    debt = LIFECYCLE_DEBT.get(_normalized(row["lifecycle_status"]), 50)
    technology = _normalized(row["primary_technology"])
    version = _normalized(row["version"])
    if any(term in technology for term in ("oracle", "teradata", "cloudera", "cognos")):
        debt += 7
    if version in {"12.2", "2016", "6.3", "11.1"}:
        debt += 5
    return _bounded(debt)


def _cloud_readiness(row: pd.Series) -> float:
    readiness = PLATFORM_CLOUD_READINESS.get(_normalized(row["platform_type"]), 65)
    if _normalized(row["hosting"]) == "on-premises":
        readiness -= 10
    readiness -= min(float(row["data_volume_tb"]) / 50, 20)
    return _bounded(readiness)


def _ai_readiness(row: pd.Series) -> float:
    readiness = PLATFORM_AI_READINESS.get(_normalized(row["platform_type"]), 55)
    description = _normalized(row["description"])
    if any(term in description for term in ("analytics", "telemetry", "customer")):
        readiness += 5
    if "reporting" in description:
        readiness -= 3
    return _bounded(readiness)


def _complexity(row: pd.Series) -> float:
    volume = float(row["data_volume_tb"])
    volume_component = min(45, 10 + volume / 20)
    platform_component = PLATFORM_COMPLEXITY.get(_normalized(row["platform_type"]), 15)
    criticality_component = {
        "critical": 18,
        "high": 12,
        "medium": 7,
        "low": 3,
    }.get(_normalized(row["criticality"]), 8)
    return _bounded(volume_component + platform_component + criticality_component)


def recommend_6r(row: pd.Series, technical_debt: float, complexity: float) -> str:
    """Return one of the six deterministic modernization dispositions."""

    criticality = _normalized(row["criticality"])
    lifecycle = _normalized(row["lifecycle_status"])
    platform_type = _normalized(row["platform_type"])

    if criticality == "low" and float(row["annual_cost_usd"]) > 0:
        return "Retire"
    if criticality == "medium" and lifecycle in {"vendor supported", "strategic"}:
        return "Retain"
    if platform_type in {"business intelligence", "data integration"} and technical_debt >= 35:
        return "Replace"
    if lifecycle == "end of support" or complexity >= 80:
        return "Refactor"
    if platform_type in {"data warehouse", "data lake"} or technical_debt >= 65:
        return "Replatform"
    return "Rehost"


def _migration_wave(priority_score: float, migration_risk: float, disposition: str) -> str:
    if disposition in {"Retain", "Retire"}:
        return "No Migration Wave"
    if priority_score >= 60 and migration_risk < 80:
        return "Wave 1"
    if priority_score >= 48:
        return "Wave 2"
    return "Wave 3"


def assess_portfolio(portfolio: pd.DataFrame) -> pd.DataFrame:
    """Calculate portfolio scores, 6R recommendation, rank, and migration wave."""

    if portfolio.empty:
        raise ValueError("Cannot assess an empty portfolio.")

    assessed_rows: list[dict[str, object]] = []
    maximum_cost = float(portfolio["annual_cost_usd"].max())

    for _, row in portfolio.iterrows():
        business_value = _business_value(row)
        technical_debt = _technical_debt(row)
        cloud_readiness = _cloud_readiness(row)
        ai_readiness = _ai_readiness(row)
        complexity = _complexity(row)
        criticality_score = CRITICALITY_SCORE.get(_normalized(row["criticality"]), 50)
        migration_risk = _bounded(
            complexity * 0.45 + technical_debt * 0.35 + criticality_score * 0.20
        )
        operating_cost = float(row["annual_cost_usd"])
        cost_pressure = operating_cost / maximum_cost * 100 if maximum_cost else 0
        priority_score = _bounded(
            business_value * 0.25
            + technical_debt * 0.15
            + cloud_readiness * 0.15
            + ai_readiness * 0.15
            + cost_pressure * 0.15
            - complexity * 0.08
            - migration_risk * 0.07
        )
        disposition = recommend_6r(row, technical_debt, complexity)

        assessed_rows.append(
            {
                "platform_id": row["platform_id"],
                "platform_name": row["platform_name"],
                "business_value": business_value,
                "technical_debt": technical_debt,
                "cloud_readiness": cloud_readiness,
                "ai_readiness": ai_readiness,
                "complexity": complexity,
                "migration_risk": migration_risk,
                "operating_cost_usd": operating_cost,
                "priority_score": priority_score,
                "six_r_recommendation": disposition,
                "migration_wave": _migration_wave(priority_score, migration_risk, disposition),
            }
        )

    assessment = pd.DataFrame(assessed_rows).sort_values(
        ["priority_score", "business_value", "platform_name"],
        ascending=[False, False, True],
    )
    assessment.insert(0, "priority_rank", range(1, len(assessment) + 1))
    return assessment.reset_index(drop=True)


def select_modernization_candidate(assessment: pd.DataFrame) -> pd.Series:
    """Select the highest-ranked migration candidate using deterministic results."""

    candidates = assessment[
        ~assessment["six_r_recommendation"].isin(["Retain", "Retire"])
    ]
    if candidates.empty:
        raise ValueError("Assessment contains no modernization candidates.")
    return candidates.sort_values("priority_rank").iloc[0]


def consulting_recommendation(candidate: pd.Series) -> str:
    """Produce Hermes's deterministic consulting recommendation."""

    return (
        f"Proceed with {candidate['platform_name']} as the recommended modernization "
        f"candidate in {candidate['migration_wave']}. The portfolio evidence supports a "
        f"{candidate['six_r_recommendation']} disposition, with business value "
        f"{candidate['business_value']:.1f}, priority {candidate['priority_score']:.1f}, "
        f"and migration risk {candidate['migration_risk']:.1f}. Establish an executive "
        "sponsor, confirm source-system owners, and validate operational constraints "
        "before implementation planning."
    )


def current_assessment_definition() -> AssessmentDefinition:
    """Return the immutable metadata definition for the existing calculations."""

    criteria = (
        CriterionDefinition(
            criterion_id="business_value",
            dimension="Business Value",
            output_field="business_value",
            formula="bounded(criticality_score + platform_value)",
            weight=0.25,
            required_fields=("criticality", "platform_type"),
            required_evidence_categories=("portfolio_inventory",),
        ),
        CriterionDefinition(
            criterion_id="technical_debt",
            dimension="Technical Debt",
            output_field="technical_debt",
            formula="bounded(lifecycle_debt + legacy_technology_adjustment + legacy_version_adjustment)",
            weight=0.15,
            required_fields=("lifecycle_status", "primary_technology", "version"),
            required_evidence_categories=("portfolio_inventory",),
        ),
        CriterionDefinition(
            criterion_id="cloud_readiness",
            dimension="Cloud Readiness",
            output_field="cloud_readiness",
            formula="bounded(platform_readiness - on_premises_adjustment - volume_adjustment)",
            weight=0.15,
            required_fields=("platform_type", "hosting", "data_volume_tb"),
            required_evidence_categories=("portfolio_inventory",),
        ),
        CriterionDefinition(
            criterion_id="ai_readiness",
            dimension="AI Readiness",
            output_field="ai_readiness",
            formula="bounded(platform_readiness + analytics_signal - reporting_adjustment)",
            weight=0.15,
            required_fields=("platform_type", "description"),
            required_evidence_categories=("portfolio_inventory",),
        ),
        CriterionDefinition(
            criterion_id="complexity",
            dimension="Delivery Complexity",
            output_field="complexity",
            formula="bounded(volume_component + platform_component + criticality_component)",
            weight=-0.08,
            required_fields=("data_volume_tb", "platform_type", "criticality"),
            required_evidence_categories=("portfolio_inventory",),
        ),
        CriterionDefinition(
            criterion_id="migration_risk",
            dimension="Migration Risk",
            output_field="migration_risk",
            formula="bounded(complexity * 0.45 + technical_debt * 0.35 + criticality_score * 0.20)",
            weight=-0.07,
            required_fields=("criticality", "platform_type", "lifecycle_status"),
            required_evidence_categories=("portfolio_inventory",),
        ),
        CriterionDefinition(
            criterion_id="operating_cost_pressure",
            dimension="Operating Cost Pressure",
            output_field="operating_cost_pressure",
            formula="annual_cost_usd / maximum_portfolio_cost * 100",
            weight=0.15,
            required_fields=("annual_cost_usd",),
            required_evidence_categories=("portfolio_inventory",),
        ),
        CriterionDefinition(
            criterion_id="priority_score",
            dimension="Modernization Priority",
            output_field="priority_score",
            formula="bounded(value*0.25 + debt*0.15 + cloud*0.15 + ai*0.15 + cost*0.15 - complexity*0.08 - risk*0.07)",
            weight=None,
            required_fields=(
                "criticality",
                "platform_type",
                "lifecycle_status",
                "hosting",
                "data_volume_tb",
                "annual_cost_usd",
            ),
            required_evidence_categories=("portfolio_inventory",),
            thresholds={"minimum": 0.0, "maximum": 100.0},
        ),
    )
    parameters = {
        "score_bounds": {"minimum": 0.0, "maximum": 100.0, "precision": 1},
        "criticality_scores": CRITICALITY_SCORE,
        "lifecycle_debt": LIFECYCLE_DEBT,
        "platform_value": PLATFORM_VALUE,
        "platform_cloud_readiness": PLATFORM_CLOUD_READINESS,
        "platform_ai_readiness": PLATFORM_AI_READINESS,
        "platform_complexity": PLATFORM_COMPLEXITY,
        "technical_debt_adjustments": {
            "legacy_technologies": ["oracle", "teradata", "cloudera", "cognos"],
            "legacy_technology_points": 7.0,
            "legacy_versions": ["12.2", "2016", "6.3", "11.1"],
            "legacy_version_points": 5.0,
        },
        "cloud_readiness_adjustments": {
            "on_premises_points": -10.0,
            "volume_divisor_tb": 50.0,
            "maximum_volume_adjustment": 20.0,
        },
        "ai_readiness_adjustments": {
            "positive_description_terms": ["analytics", "telemetry", "customer"],
            "positive_points": 5.0,
            "reporting_points": -3.0,
        },
        "migration_risk_weights": {
            "complexity": 0.45,
            "technical_debt": 0.35,
            "criticality": 0.20,
        },
        "priority_weights": {
            "business_value": 0.25,
            "technical_debt": 0.15,
            "cloud_readiness": 0.15,
            "ai_readiness": 0.15,
            "operating_cost_pressure": 0.15,
            "complexity": -0.08,
            "migration_risk": -0.07,
        },
    }
    decision_rules = {
        "six_r_order": ["Retire", "Retain", "Replace", "Refactor", "Replatform", "Rehost"],
        "six_r_rules": [
            "Retire when criticality is low and annual cost is positive",
            "Retain when criticality is medium and lifecycle is vendor supported or strategic",
            "Replace business-intelligence or data-integration platforms when technical debt is at least 35",
            "Refactor when lifecycle is end of support or complexity is at least 80",
            "Replatform data warehouses or data lakes, or when technical debt is at least 65",
            "Rehost otherwise",
        ],
        "migration_waves": {
            "no_wave_dispositions": ["Retain", "Retire"],
            "wave_1_minimum_priority": 60.0,
            "wave_1_maximum_risk_exclusive": 80.0,
            "wave_2_minimum_priority": 48.0,
        },
        "candidate_excluded_dispositions": ["Retain", "Retire"],
    }
    hash_payload = {
        "definition_id": ASSESSMENT_DEFINITION_ID,
        "version": ASSESSMENT_DEFINITION_VERSION,
        "scoring_owner": CALCULATION_OWNER,
        "engine_version": ASSESSMENT_ENGINE_VERSION,
        "parameters": parameters,
        "decision_rules": decision_rules,
        "criteria": [criterion.model_dump(mode="json") for criterion in criteria],
    }
    return AssessmentDefinition(
        definition_id=ASSESSMENT_DEFINITION_ID,
        version=ASSESSMENT_DEFINITION_VERSION,
        scoring_owner=CALCULATION_OWNER,
        engine_version=ASSESSMENT_ENGINE_VERSION,
        parameters=parameters,
        decision_rules=decision_rules,
        criteria=criteria,
        definition_hash=sha256_json(hash_payload),
    )


def build_criterion_results(
    assessment: pd.DataFrame,
    snapshot: EvidenceSnapshot,
    definition: AssessmentDefinition,
) -> tuple[CriterionResult, ...]:
    """Create evidence traceability without changing the assessment DataFrame."""

    assessment_by_asset = {
        str(row["platform_id"]): row for _, row in assessment.iterrows()
    }
    portfolio_evidence = tuple(
        record
        for record in snapshot.records
        if record.evidence_category == "portfolio_inventory"
    )
    maximum_cost = max(
        float(record.facts["annual_cost_usd"]) for record in portfolio_evidence
    )
    results: list[CriterionResult] = []
    for asset_id in sorted(assessment_by_asset):
        row = assessment_by_asset[asset_id]
        asset_evidence = tuple(
            record for record in snapshot.records if record.asset_id == asset_id
        )
        for criterion in definition.criteria:
            matching = tuple(
                record
                for record in asset_evidence
                if criterion.criterion_id in record.criterion_references
                and record.evidence_category in criterion.required_evidence_categories
            )
            present_categories = {record.evidence_category for record in matching}
            missing_categories = tuple(
                category
                for category in criterion.required_evidence_categories
                if category not in present_categories
            )
            if criterion.output_field == "operating_cost_pressure":
                operating_cost = float(
                    next(
                        record
                        for record in asset_evidence
                        if record.evidence_category == "portfolio_inventory"
                    ).facts["annual_cost_usd"]
                )
                value = operating_cost / maximum_cost * 100 if maximum_cost else 0.0
            else:
                value = float(row[criterion.output_field])
            results.append(
                CriterionResult(
                    criterion_result_id=f"CR-{asset_id}-{criterion.criterion_id}",
                    asset_id=asset_id,
                    criterion_id=criterion.criterion_id,
                    value=value,
                    evidence_ids=tuple(record.evidence_id for record in matching),
                    evidence_status="missing" if missing_categories else "supported",
                    missing_evidence_categories=missing_categories,
                    supported=not missing_categories,
                )
            )
    return tuple(results)


def build_assessment_run(
    assessment: pd.DataFrame,
    snapshot: EvidenceSnapshot,
    definition: AssessmentDefinition,
    run_id: str,
    generated_at: datetime,
    artifact_reference: str,
) -> AssessmentRun:
    records = tuple(assessment.to_dict(orient="records"))
    criterion_results = build_criterion_results(assessment, snapshot, definition)
    evidence_quality = evaluate_evidence_quality(
        run_id,
        snapshot,
        definition,
        criterion_results,
        generated_at,
    )
    recommendations = build_modernization_recommendations(
        records,
        snapshot,
        run_id,
        generated_at,
        criterion_results,
        evidence_quality.quality_results,
        evidence_quality.findings,
    )
    supported = sum(result.supported for result in criterion_results)
    completeness = round(supported / len(criterion_results) * 100, 1)
    return AssessmentRun(
        run_id=run_id,
        enterprise_id=snapshot.enterprise_id,
        generated_at=generated_at,
        definition_id=definition.definition_id,
        definition_version=definition.version,
        definition_hash=definition.definition_hash,
        evidence_snapshot_id=snapshot.snapshot_id,
        evidence_snapshot_hash=snapshot.snapshot_hash,
        evidence_completeness=completeness,
        evidence_complete=supported == len(criterion_results),
        calculation_owner=definition.scoring_owner,
        engine_version=definition.engine_version,
        result_hash=sha256_json(records),
        criterion_results=criterion_results,
        evidence_requirements=evidence_quality.requirements,
        freshness_policies=evidence_quality.policies,
        evidence_links=evidence_quality.links,
        evidence_quality_results=evidence_quality.quality_results,
        findings=evidence_quality.findings,
        finding_evidence_relationships=evidence_quality.finding_relationships,
        evidence_health=evidence_quality.trust_summary,
        freshness_policy_version=FRESHNESS_POLICY_VERSION,
        finding_generation_version=FINDING_GENERATION_VERSION,
        modernization_recommendations=recommendations,
        assessment=records,
        artifact_reference=artifact_reference,
    )


def assessment_artifact_payload(run: AssessmentRun) -> dict[str, object]:
    """Build the auditable schema-v1 assessment artifact."""

    return {
        "schema_version": run.schema_version,
        "run_id": run.run_id,
        "enterprise_id": run.enterprise_id,
        "generated_at": run.generated_at.isoformat(),
        "generated_timestamp": run.generated_at.isoformat(),
        "created_at": run.generated_at.isoformat(),
        "definition_id": run.definition_id,
        "definition_version": run.definition_version,
        "definition_hash": run.definition_hash,
        "evidence_snapshot_id": run.evidence_snapshot_id,
        "evidence_snapshot_hash": run.evidence_snapshot_hash,
        "evidence_completeness": run.evidence_completeness,
        "evidence_complete": run.evidence_complete,
        "calculation_owner": run.calculation_owner,
        "engine_version": run.engine_version,
        "result_hash": run.result_hash,
        "criterion_results": [
            result.model_dump(mode="json") for result in run.criterion_results
        ],
        "evidence_requirements_evaluated": [
            requirement.model_dump(mode="json")
            for requirement in run.evidence_requirements
        ],
        "freshness_policies": [
            policy.model_dump(mode="json") for policy in run.freshness_policies
        ],
        "evidence_quality_summary": (
            run.evidence_health.model_dump(mode="json")
            if run.evidence_health is not None
            else None
        ),
        "criterion_evidence_quality": [
            result.model_dump(mode="json")
            for result in run.evidence_quality_results
        ],
        "evidence_links": [
            link.model_dump(mode="json") for link in run.evidence_links
        ],
        "findings": [finding.model_dump(mode="json") for finding in run.findings],
        "finding_to_evidence_relationships": [
            relationship.model_dump(mode="json")
            for relationship in run.finding_evidence_relationships
        ],
        "assessment_trust_status": (
            run.evidence_health.trust_status
            if run.evidence_health is not None
            else "Unavailable"
        ),
        "freshness_policy_version": run.freshness_policy_version,
        "finding_generation_version": run.finding_generation_version,
        "modernization_recommendations": [
            recommendation.model_dump(mode="json")
            for recommendation in run.modernization_recommendations
        ],
        "assessment": list(run.assessment),
    }


def write_assessment_artifact(path: str | Path, payload: dict[str, object]) -> Path:
    """Atomically write one assessment artifact with a controlled failure."""

    artifact_path = Path(path)
    temporary_path = artifact_path.with_suffix(f"{artifact_path.suffix}.tmp")
    try:
        artifact_path.parent.mkdir(parents=True, exist_ok=True)
        temporary_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        temporary_path.replace(artifact_path)
    except OSError as exc:
        try:
            temporary_path.unlink(missing_ok=True)
        except OSError:
            pass
        raise RuntimeError("Unable to store assessment artifact.") from exc
    return artifact_path


def load_assessment_artifact(path: str | Path) -> dict[str, object]:
    """Read schema-v1 artifacts and truthfully label historical artifacts as v0."""

    try:
        payload = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError("Unable to read assessment artifact.") from exc
    if not isinstance(payload, dict):
        raise RuntimeError("Assessment artifact must contain a JSON object.")
    if "schema_version" not in payload:
        return {**payload, "schema_version": "0", "legacy": True}
    return payload


def store_assessment_artifact(
    assessment: pd.DataFrame,
    output_directory: str | Path,
    enterprise_id: str,
    assessment_run: AssessmentRun | None = None,
) -> Path:
    """Persist a completed assessment as a timestamped JSON artifact."""

    directory = Path(output_directory)
    timestamp = datetime.now(timezone.utc)
    run_id = assessment_run.run_id if assessment_run else f"ASSESS-{timestamp:%Y%m%dT%H%M%SZ}-{uuid4().hex[:8]}"
    artifact_path = directory / f"{run_id}.json"
    if assessment_run is not None:
        return write_assessment_artifact(
            artifact_path, assessment_artifact_payload(assessment_run)
        )
    payload = {
        "run_id": run_id,
        "enterprise_id": enterprise_id,
        "created_at": timestamp.isoformat(),
        "calculation_owner": "Python deterministic assessment engine",
        "assessment": assessment.to_dict(orient="records"),
    }
    return write_assessment_artifact(artifact_path, payload)

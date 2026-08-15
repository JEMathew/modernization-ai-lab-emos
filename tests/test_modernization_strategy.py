from datetime import datetime, timezone
from pathlib import Path

import pytest
from pydantic import ValidationError

from engine.assessment import assess_portfolio, build_assessment_run, current_assessment_definition
from engine.assessment_models import EvidenceQualityResult, ModernizationStrategy
from engine.data_loader import load_portfolio
from engine.evidence import create_evidence_snapshot, load_evidence_registry, portfolio_from_snapshot
from engine.evidence_quality import evaluate_evidence_quality
from engine.modernization_strategy import (
    ExecutionNotAuthorizedError,
    build_modernization_recommendations,
    canonical_strategy,
    require_execution_authority,
    strategy_catalogue,
)


ROOT_DIR = Path(__file__).resolve().parents[1]
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"
APPLICATION_DATA_DIR = ROOT_DIR / "demo_data" / "phase_a_6r"
AS_OF = datetime(2026, 8, 15, 9, 0, tzinfo=timezone.utc)


def _application_inputs():
    portfolio = load_portfolio(APPLICATION_DATA_DIR / "portfolio.csv")
    records = load_evidence_registry(
        APPLICATION_DATA_DIR / "evidence_registry.json", "NORTHSTAR-MFG-001"
    )
    snapshot = create_evidence_snapshot(
        records, "NORTHSTAR-MFG-001", portfolio["platform_id"].tolist(), AS_OF
    )
    assessment = assess_portfolio(portfolio_from_snapshot(snapshot))
    definition = current_assessment_definition()
    run = build_assessment_run(
        assessment,
        snapshot,
        definition,
        "ASSESS-APPLICATION-REFERENCE",
        AS_OF,
        "artifact://test/application.json",
    )
    return assessment, snapshot, definition, run


def test_canonical_catalogue_defines_exactly_six_complete_strategies() -> None:
    catalogue = strategy_catalogue()

    assert {item.strategy for item in catalogue} == set(ModernizationStrategy)
    assert len(catalogue) == 6
    assert len({item.strategy_id for item in catalogue}) == 6
    for item in catalogue:
        assert item.version == "1.0.0"
        assert item.eligibility_criteria
        assert item.positive_signals
        assert item.negative_signals
        assert item.required_evidence
        assert item.typical_risks
        assert item.expected_benefits
        assert item.planning_requirements
        assert item.execution_pattern
        assert item.validation_requirements
        assert item.expected_outcome_categories


def test_replace_is_only_a_repurchase_compatibility_alias() -> None:
    assert canonical_strategy("Replace") is ModernizationStrategy.REPURCHASE
    assert canonical_strategy("Repurchase") is ModernizationStrategy.REPURCHASE
    with pytest.raises(ValueError, match="Unknown modernization strategy"):
        canonical_strategy("Rebuild")


def test_application_reference_is_evidence_backed_refactor() -> None:
    assessment, snapshot, _, run = _application_inputs()
    recommendation = run.modernization_recommendations[0]

    assert assessment.iloc[0]["six_r_recommendation"] == "Refactor"
    assert recommendation.asset_id == "NS-APP-001"
    assert recommendation.asset_type == "Enterprise Application"
    assert recommendation.recommended_strategy is ModernizationStrategy.REFACTOR
    assert recommendation.trust_status == "Ready"
    assert recommendation.confidence == 1.0
    assert len(recommendation.alternatives) == 5
    assert {item.strategy for item in recommendation.alternatives} == (
        set(ModernizationStrategy) - {ModernizationStrategy.REFACTOR}
    )
    assert recommendation.supporting_evidence[0].evidence_id == snapshot.records[0].evidence_id
    assert recommendation.supporting_evidence[0].provenance == snapshot.records[0].provenance
    assert recommendation.finding_ids
    assert "End of Support" in recommendation.rationale
    assert recommendation.status == "Recommended"
    assert recommendation.execution_authority == "None"


def test_apex_data_platform_reference_is_blocked_replatform_with_conflict() -> None:
    portfolio = load_portfolio(APEX_DATA_DIR / "portfolio.csv")
    snapshot = create_evidence_snapshot(
        load_evidence_registry(APEX_DATA_DIR / "evidence_registry.json"),
        "APEX-AERO-001",
        portfolio["platform_id"].tolist(),
        AS_OF,
    )
    assessment = assess_portfolio(portfolio_from_snapshot(snapshot))
    run = build_assessment_run(
        assessment,
        snapshot,
        current_assessment_definition(),
        "ASSESS-DATA-REFERENCE",
        AS_OF,
        "artifact://test/data-platform.json",
    )
    oracle = next(
        item for item in run.modernization_recommendations if item.asset_id == "APX-PLT-001"
    )

    assert oracle.asset_name == "Oracle Customer Analytics Warehouse"
    assert oracle.asset_type == "Data Warehouse"
    assert oracle.recommended_strategy is ModernizationStrategy.REPLATFORM
    assert oracle.trust_status == "Blocked"
    assert oracle.conflicting_evidence_ids == (
        "EVD-APX-PLT-001-OWNER-A",
        "EVD-APX-PLT-001-OWNER-B",
    )
    assert "Trust is qualified" in oracle.rationale
    assert len(oracle.alternatives) == 5


def test_missing_blocking_evidence_blocks_recommendation() -> None:
    assessment, snapshot, _, run = _application_inputs()
    quality = list(run.evidence_quality_results)
    quality[0] = quality[0].model_copy(
        update={
            "completeness_score": 50.0,
            "missing_requirement_ids": ("REQ-MISSING-OWNER",),
            "blocking_missing_requirement_ids": ("REQ-MISSING-OWNER",),
        }
    )

    recommendation = build_modernization_recommendations(
        assessment.to_dict(orient="records"),
        snapshot,
        "ASSESS-MISSING-EVIDENCE",
        AS_OF,
        run.criterion_results,
        tuple(quality),
        run.findings,
    )[0]

    assert recommendation.trust_status == "Blocked"
    assert recommendation.missing_evidence_requirement_ids == ("REQ-MISSING-OWNER",)
    assert recommendation.confidence < 1.0


def test_low_confidence_is_warning_without_changing_strategy() -> None:
    assessment, snapshot, _, run = _application_inputs()
    low_confidence = tuple(
        item.model_copy(update={"confidence_score": 50.0})
        for item in run.evidence_quality_results
    )

    recommendation = build_modernization_recommendations(
        assessment.to_dict(orient="records"),
        snapshot,
        "ASSESS-LOW-CONFIDENCE",
        AS_OF,
        run.criterion_results,
        low_confidence,
        run.findings,
    )[0]

    assert recommendation.recommended_strategy is ModernizationStrategy.REFACTOR
    assert recommendation.trust_status == "Warning"
    assert recommendation.confidence == 0.5


def test_recommendation_model_prevents_authority_escalation_and_execution() -> None:
    *_, run = _application_inputs()
    recommendation = run.modernization_recommendations[0]

    with pytest.raises(ExecutionNotAuthorizedError, match="no execution authority"):
        require_execution_authority(recommendation)
    with pytest.raises(ValidationError):
        recommendation.__class__.model_validate(
            {
                **recommendation.model_dump(mode="python"),
                "execution_authority": "Approved",
            }
        )


def test_recommendation_hash_is_stable_across_run_identity_and_time() -> None:
    assessment, snapshot, definition, first = _application_inputs()
    second_quality = evaluate_evidence_quality(
        "ASSESS-APPLICATION-REPLAY",
        snapshot,
        definition,
        first.criterion_results,
        AS_OF,
    )
    second = build_modernization_recommendations(
        assessment.to_dict(orient="records"),
        snapshot,
        "ASSESS-APPLICATION-REPLAY",
        AS_OF.replace(hour=10),
        first.criterion_results,
        second_quality.quality_results,
        second_quality.findings,
    )[0]

    assert first.modernization_recommendations[0].recommendation_id != second.recommendation_id
    assert first.modernization_recommendations[0].recommendation_hash == second.recommendation_hash


def test_assessment_run_rejects_duplicate_asset_recommendation_state() -> None:
    *_, run = _application_inputs()
    recommendation = run.modernization_recommendations[0]

    with pytest.raises(ValidationError, match="unique by asset"):
        run.__class__.model_validate(
            {
                **run.model_dump(mode="python"),
                "modernization_recommendations": (recommendation, recommendation),
            }
        )


def test_quality_result_contract_remains_strict_for_recommendation_inputs() -> None:
    with pytest.raises(ValidationError):
        EvidenceQualityResult.model_validate(
            {
                "quality_result_id": "QUALITY-1",
                "assessment_run_id": "ASSESS-1",
                "criterion_result_id": "CR-1",
                "asset_id": "ASSET-1",
                "criterion_id": "criterion-1",
                "completeness_score": 101.0,
                "freshness_status": "Current",
                "confidence_score": 90.0,
                "authority_score": 90.0,
                "conflict_status": "NoConflict",
            }
        )

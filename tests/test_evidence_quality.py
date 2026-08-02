from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
from pydantic import ValidationError

from engine.assessment import (
    assess_portfolio,
    build_criterion_results,
    current_assessment_definition,
)
from engine.assessment_models import EvidenceQualityResult, EvidenceRequirement
from engine.data_loader import load_portfolio
from engine.evidence import (
    create_evidence_snapshot,
    load_evidence_registry,
    portfolio_from_snapshot,
)
from engine.evidence_quality import (
    current_evidence_requirements,
    current_freshness_policies,
    derive_assessment_trust_status,
    detect_bounded_conflicts,
    evaluate_evidence_quality,
    evaluate_freshness,
)


ROOT_DIR = Path(__file__).resolve().parents[1]
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"
AS_OF = datetime(2026, 8, 1, tzinfo=timezone.utc)


@pytest.fixture
def quality_bundle():
    records = load_evidence_registry(APEX_DATA_DIR / "evidence_registry.json")
    portfolio = load_portfolio(APEX_DATA_DIR / "portfolio.csv")
    snapshot = create_evidence_snapshot(
        records,
        "APEX-AERO-001",
        portfolio["platform_id"].tolist(),
        AS_OF,
    )
    definition = current_assessment_definition()
    assessment = assess_portfolio(portfolio_from_snapshot(snapshot))
    criterion_results = build_criterion_results(assessment, snapshot, definition)
    return evaluate_evidence_quality(
        "ASSESS-QUALITY-TEST",
        snapshot,
        definition,
        criterion_results,
        AS_OF,
    )


def test_evidence_requirement_is_versioned_strict_and_frozen() -> None:
    requirement = current_evidence_requirements(current_assessment_definition())[0]

    assert requirement.assessment_definition_version == "1.0.0"
    assert requirement.minimum_count == 1
    with pytest.raises(ValidationError, match="frozen"):
        requirement.minimum_count = 2
    with pytest.raises(ValidationError):
        EvidenceRequirement.model_validate(
            {**requirement.model_dump(mode="python"), "unexpected": True}
        )
    with pytest.raises(ValidationError):
        EvidenceRequirement.model_validate(
            {**requirement.model_dump(mode="python"), "minimum_count": 0}
        )


def test_freshness_policy_validates_bounds_and_all_states() -> None:
    policy = current_freshness_policies()[0]
    record = load_evidence_registry(APEX_DATA_DIR / "evidence_registry.json")[0]

    assert evaluate_freshness(record, policy, AS_OF) == "Current"
    assert evaluate_freshness(
        record.model_copy(update={"effective_at": AS_OF - timedelta(days=200)}),
        policy,
        AS_OF,
    ) == "Aging"
    assert evaluate_freshness(
        record.model_copy(update={"effective_at": AS_OF - timedelta(days=400)}),
        policy,
        AS_OF,
    ) == "Stale"
    assert evaluate_freshness(record, None, AS_OF) == "Unknown"
    with pytest.raises(ValidationError, match="warning age"):
        policy.model_copy(
            update={"warning_age_days": 365, "stale_age_days": 180}
        ).__class__.model_validate(
            {**policy.model_dump(mode="python"), "warning_age_days": 365}
        )


def test_apex_quality_demonstrates_complete_missing_stale_and_low_confidence(
    quality_bundle,
) -> None:
    by_key = {
        (item.asset_id, item.criterion_id): item
        for item in quality_bundle.quality_results
    }

    assert len(quality_bundle.quality_results) == 56
    assert by_key[("APX-PLT-002", "business_value")].completeness_score == 100.0
    assert by_key[("APX-PLT-001", "cloud_readiness")].completeness_score == 50.0
    assert by_key[("APX-PLT-001", "cloud_readiness")].blocking_missing_requirement_ids
    assert by_key[("APX-PLT-001", "priority_score")].missing_requirement_ids
    assert not by_key[("APX-PLT-001", "priority_score")].blocking_missing_requirement_ids
    assert by_key[("APX-PLT-001", "technical_debt")].freshness_status == "Stale"
    assert by_key[("APX-PLT-001", "ai_readiness")].confidence_score == 72.5
    assert by_key[("APX-PLT-001", "complexity")].authority_score == 90.0


def test_bounded_conflict_requires_same_target_overlap_and_incompatible_value() -> None:
    records = {
        item.evidence_id: item
        for item in load_evidence_registry(APEX_DATA_DIR / "evidence_registry.json")
    }
    left = records["EVD-APX-PLT-001-OWNER-A"]
    right = records["EVD-APX-PLT-001-OWNER-B"]

    assert detect_bounded_conflicts((left, right)) == tuple(
        sorted((left.evidence_id, right.evidence_id))
    )
    same_value = right.model_copy(update={"normalized_value": left.normalized_value})
    assert detect_bounded_conflicts((left, same_value)) == ()
    later = right.model_copy(
        update={
            "effective_at": datetime(2027, 1, 1, tzinfo=timezone.utc),
            "effective_until": datetime(2027, 6, 1, tzinfo=timezone.utc),
        }
    )
    assert detect_bounded_conflicts((left, later)) == ()
    confidence_only = right.model_copy(
        update={
            "normalized_value": left.normalized_value,
            "confidence": 0.1,
        }
    )
    assert detect_bounded_conflicts((left, confidence_only)) == ()


def test_links_and_quality_ids_are_deterministic(quality_bundle) -> None:
    records = load_evidence_registry(APEX_DATA_DIR / "evidence_registry.json")
    portfolio = load_portfolio(APEX_DATA_DIR / "portfolio.csv")
    snapshot = create_evidence_snapshot(
        records, "APEX-AERO-001", portfolio["platform_id"].tolist(), AS_OF
    )
    definition = current_assessment_definition()
    results = build_criterion_results(
        assess_portfolio(portfolio_from_snapshot(snapshot)), snapshot, definition
    )
    replay = evaluate_evidence_quality(
        "ASSESS-QUALITY-TEST", snapshot, definition, results, AS_OF
    )

    assert replay.links == quality_bundle.links
    assert replay.quality_results == quality_bundle.quality_results
    assert replay.findings == quality_bundle.findings
    assert len({item.link_id for item in replay.links}) == len(replay.links)


def test_assessment_trust_status_precedence_is_explicit() -> None:
    base = EvidenceQualityResult(
        quality_result_id="QUALITY-1",
        assessment_run_id="ASSESS-1",
        criterion_result_id="CR-1",
        asset_id="ASSET-1",
        criterion_id="criterion-1",
        completeness_score=100.0,
        freshness_status="Current",
        confidence_score=90.0,
        authority_score=90.0,
        conflict_status="NoConflict",
    )

    assert derive_assessment_trust_status((base,))[0] == "Ready"
    warning = base.model_copy(update={"confidence_score": 60.0})
    assert derive_assessment_trust_status((warning,))[0] == "ReadyWithWarnings"
    needs = base.model_copy(
        update={
            "completeness_score": 50.0,
            "blocking_missing_requirement_ids": ("REQ-1",),
        }
    )
    assert derive_assessment_trust_status((needs,))[0] == "NeedsEvidence"
    blocked = base.model_copy(
        update={
            "conflict_status": "Conflict",
            "blocking_conflicting_evidence_ids": ("EVD-1", "EVD-2"),
        }
    )
    assert derive_assessment_trust_status((blocked,))[0] == "Blocked"


def test_apex_trust_summary_is_explainable_and_score_independent(
    quality_bundle,
) -> None:
    summary = quality_bundle.trust_summary

    assert summary.trust_status == "Blocked"
    assert summary.stale_evidence_count == 1
    assert summary.missing_requirement_count == 3
    assert summary.conflict_count == 1
    assert summary.low_confidence_evidence_count == 1
    assert "conflict" in summary.explanation.casefold()

import json
from pathlib import Path

import pytest

from engine.assessment import assessment_artifact_payload, load_assessment_artifact
from engine.persistence import (
    TrustedAssessmentPersistenceError,
    TrustedAssessmentStore,
)
from engine.workflow import load_demo_engagement, run_assessment


ROOT_DIR = Path(__file__).resolve().parents[1]
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"


@pytest.fixture
def assessment_result(tmp_path: Path):
    intake = load_demo_engagement(APEX_DATA_DIR)
    return run_assessment(
        intake.portfolio,
        tmp_path / "assessments",
        intake.enterprise_profile.enterprise_id,
        database_path=tmp_path / "trusted.db",
    )


def test_findings_are_deterministic_typed_and_traceable(assessment_result) -> None:
    run = assessment_result.run
    finding_ids = {finding.finding_id for finding in run.findings}
    result_ids = {result.criterion_result_id for result in run.criterion_results}
    evidence_ids = {
        record.evidence_id for record in assessment_result.evidence_snapshot.records
    }
    requirement_ids = {
        requirement.requirement_id for requirement in run.evidence_requirements
    }
    link_ids = {link.link_id for link in run.evidence_links}

    assert len(finding_ids) == len(run.findings)
    assert {
        "Observed", "Derived", "Inferred", "Recommended"
    }.issubset({finding.classification for finding in run.findings})
    assert "Approved" not in {finding.classification for finding in run.findings}
    assert "AssessmentLimitation" in {
        finding.finding_type for finding in run.findings
    }
    assert all(
        relationship.finding_id in finding_ids
        and relationship.criterion_result_id in result_ids
        and (
            relationship.evidence_id is None
            or relationship.evidence_id in evidence_ids
        )
        and (
            relationship.missing_requirement_id is None
            or relationship.missing_requirement_id in requirement_ids
        )
        and (
            relationship.evidence_link_id is None
            or relationship.evidence_link_id in link_ids
        )
        for relationship in run.finding_evidence_relationships
    )
    assert {
        relationship.finding_id for relationship in run.finding_evidence_relationships
    } == finding_ids


def test_artifact_and_database_findings_agree(assessment_result) -> None:
    run = assessment_result.run
    payload = json.loads(assessment_result.artifact_path.read_text(encoding="utf-8"))
    store = TrustedAssessmentStore(assessment_result.database_path)
    stored_summary = store.get_evidence_health(run.run_id)

    assert payload["assessment_trust_status"] == run.evidence_health.trust_status
    assert payload["evidence_quality_summary"] == run.evidence_health.model_dump(
        mode="json"
    )
    assert stored_summary is not None
    assert json.loads(stored_summary["summary_json"]) == payload[
        "evidence_quality_summary"
    ]
    assert len(payload["criterion_evidence_quality"]) == len(
        store.get_evidence_quality_results(run.run_id)
    )
    assert len(payload["findings"]) == len(store.get_findings(run.run_id))
    assert len(payload["finding_to_evidence_relationships"]) == len(
        run.finding_evidence_relationships
    )


def test_finding_persistence_failure_rolls_back_entire_bundle(
    assessment_result, tmp_path: Path
) -> None:
    store = TrustedAssessmentStore(tmp_path / "rollback.db")
    store.initialize()
    with store._connect() as connection:
        connection.execute(
            """CREATE TRIGGER fail_finding_insert
               BEFORE INSERT ON assessment_findings
               BEGIN SELECT RAISE(FAIL, 'synthetic finding failure'); END;"""
        )
    artifact_path = tmp_path / "rolled-back.json"

    with pytest.raises(
        TrustedAssessmentPersistenceError, match="could not be persisted"
    ):
        store.persist_assessment_bundle(
            assessment_result.evidence_snapshot,
            assessment_result.definition,
            assessment_result.run,
            artifact_path,
            assessment_artifact_payload(assessment_result.run),
            lambda path, payload: path,
        )

    assert store.count_runs() == 0
    assert not artifact_path.exists()


def test_schema_v1_slice_01_artifact_without_findings_remains_readable(
    tmp_path: Path,
) -> None:
    artifact = tmp_path / "slice-01.json"
    artifact.write_text(
        json.dumps(
            {
                "schema_version": "1.0",
                "run_id": "ASSESS-SLICE-01",
                "criterion_results": [],
            }
        ),
        encoding="utf-8",
    )

    loaded = load_assessment_artifact(artifact)

    assert loaded["schema_version"] == "1.0"
    assert "findings" not in loaded
    assert "legacy" not in loaded


def test_streamlit_exposes_progressive_and_degraded_quality_states() -> None:
    source = (ROOT_DIR / "app" / "main.py").read_text(encoding="utf-8")

    assert "Assessment Trust & Evidence Health" in source
    assert "Dimension & Criterion Evidence Review" in source
    assert "Evidence relationships" in source
    assert "Missing requirements" in source
    assert "Finding" in source or "Findings and remediation" in source
    assert "partially available" in source
    assert "earlier schema-compatible assessment" in source

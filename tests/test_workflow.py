from datetime import datetime, timezone
import json
from pathlib import Path

import pytest

from engine.assessment import assessment_artifact_payload
from engine.persistence import (
    TrustedAssessmentPersistenceError,
    TrustedAssessmentStore,
)

from engine.workflow import (
    apply_budget_reduction,
    complete_replan_request,
    download_package,
    initialize_agency_state,
    load_agency_context,
    load_demo_engagement,
    original_plan,
    recommendation_for_assessment,
    request_replan,
    run_assessment,
    run_engineering,
    run_replan,
    selected_candidate,
    store_assessment,
    store_engineering,
    store_intake,
    store_replan,
    workflow_stage,
)


ROOT_DIR = Path(__file__).resolve().parents[1]
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"
START_TIME = datetime(2026, 7, 12, 9, 0, tzinfo=timezone.utc)


def test_one_workflow_runs_the_complete_responsive_experience(tmp_path: Path) -> None:
    state: dict[str, object] = {}

    intake = load_demo_engagement(APEX_DATA_DIR)
    store_intake(state, intake)
    assert workflow_stage(state) == 1
    assert intake.summary == {
        "platform_count": 7,
        "annual_platform_cost": 12_510_000.0,
        "critical_platform_count": 3,
    }

    assessment_result = run_assessment(
        intake.portfolio,
        tmp_path / "assessments",
        intake.enterprise_profile.enterprise_id,
    )
    store_assessment(state, assessment_result)
    assert workflow_stage(state) == 3
    assert selected_candidate(assessment_result.assessment).equals(
        assessment_result.candidate
    )
    assert (
        recommendation_for_assessment(assessment_result.assessment)
        == assessment_result.recommendation
    )

    engineering_result = run_engineering(
        APEX_DATA_DIR,
        tmp_path / "implementation",
        assessment_result.candidate,
    )
    store_engineering(state, engineering_result)
    assert workflow_stage(state) == 4
    assert download_package(engineering_result.package_path)

    context = load_agency_context(APEX_DATA_DIR / "business_constraints.json")
    initialize_agency_state(state, context, START_TIME)
    assert context.approval == "Pending Human Approval"
    assert original_plan(
        assessment_result.assessment, context.original_budget
    )["Planned Funding (USD)"].sum() == context.original_budget

    apply_budget_reduction(state)
    assert state["agency_budget"] == 5_950_000.0
    assert state["agency_replan_requested"] is True
    replan_result = run_replan(
        assessment_result.assessment,
        context.original_budget,
        float(state["agency_budget"]),
        int(state["agency_downtime"]),
        str(state["agency_business_priority"]),
        tmp_path / "replans",
    )
    store_replan(state, replan_result)
    complete_replan_request(state)
    assert state["agency_replan_requested"] is False
    assert replan_result.replan["budget_reduction_percent"] == 30.0
    assert replan_result.artifact_path.is_file()


def test_shared_state_transitions_invalidate_only_downstream_results(
    tmp_path: Path,
) -> None:
    state: dict[str, object] = {}
    intake = load_demo_engagement(APEX_DATA_DIR)
    assessment_result = run_assessment(
        intake.portfolio,
        tmp_path / "assessments",
        intake.enterprise_profile.enterprise_id,
    )
    engineering_result = run_engineering(
        APEX_DATA_DIR,
        tmp_path / "implementation",
        assessment_result.candidate,
    )

    store_intake(state, intake)
    store_assessment(state, assessment_result)
    store_engineering(state, engineering_result)
    state["agency_replan"] = {"status": "complete"}
    state["agency_replan_artifact"] = "replan.json"

    store_assessment(state, assessment_result)
    assert "enterprise_profile" in state
    assert "assessment" in state
    assert "engineering_engagement" not in state
    assert "agency_replan" not in state


def test_engineering_rejects_a_candidate_not_selected_for_the_package(
    tmp_path: Path,
) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    assessment_result = run_assessment(
        intake.portfolio,
        tmp_path / "assessments",
        intake.enterprise_profile.enterprise_id,
    )
    wrong_candidate = assessment_result.candidate.copy()
    wrong_candidate["platform_name"] = "Different Platform"

    with pytest.raises(ValueError, match="does not match assessment selection"):
        run_engineering(
            APEX_DATA_DIR,
            tmp_path / "implementation",
            wrong_candidate,
        )


def test_replan_request_uses_one_shared_state_flag() -> None:
    state: dict[str, object] = {"agency_replan_requested": False}

    request_replan(state)
    assert state["agency_replan_requested"] is True

    complete_replan_request(state)
    assert state["agency_replan_requested"] is False


def test_trusted_assessment_artifact_and_database_metadata_agree(
    tmp_path: Path,
) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    database_path = tmp_path / "trusted.db"
    result = run_assessment(
        intake.portfolio,
        tmp_path / "assessments",
        intake.enterprise_profile.enterprise_id,
        database_path=database_path,
    )

    payload = json.loads(result.artifact_path.read_text(encoding="utf-8"))
    stored = TrustedAssessmentStore(database_path).get_run(result.run.run_id)

    assert stored is not None
    assert payload["schema_version"] == "1.0"
    assert payload["run_id"] == stored["run_id"]
    assert payload["definition_hash"] == stored["definition_hash"]
    assert payload["evidence_snapshot_id"] == stored["snapshot_id"]
    assert payload["evidence_snapshot_hash"] == stored["snapshot_hash"]
    assert payload["evidence_completeness"] == stored["evidence_completeness"]
    assert payload["calculation_owner"] == stored["calculation_owner"]
    assert len(payload["criterion_results"]) == 56


def test_trusted_assessment_replay_is_reproducible(tmp_path: Path) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    first = run_assessment(
        intake.portfolio,
        tmp_path / "first",
        intake.enterprise_profile.enterprise_id,
        database_path=tmp_path / "trusted.db",
    )
    second = run_assessment(
        intake.portfolio,
        tmp_path / "second",
        intake.enterprise_profile.enterprise_id,
        database_path=tmp_path / "trusted.db",
    )

    assert first.run.run_id != second.run.run_id
    assert first.run.evidence_snapshot_id == second.run.evidence_snapshot_id
    assert first.run.evidence_snapshot_hash == second.run.evidence_snapshot_hash
    assert first.run.definition_hash == second.run.definition_hash
    assert first.run.result_hash == second.run.result_hash
    assert first.run.criterion_results == second.run.criterion_results
    assert first.candidate["platform_name"] == "Oracle Customer Analytics Warehouse"
    assert first.candidate["six_r_recommendation"] == "Replatform"
    assert first.candidate["migration_wave"] == "Wave 1"


def test_persistence_transaction_rolls_back_when_artifact_write_fails(
    tmp_path: Path,
) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    source = run_assessment(
        intake.portfolio,
        tmp_path / "source",
        intake.enterprise_profile.enterprise_id,
        database_path=tmp_path / "source.db",
    )
    store = TrustedAssessmentStore(tmp_path / "rollback.db")
    artifact_path = tmp_path / "rolled-back.json"

    def failing_writer(path: Path, payload: dict[str, object]) -> Path:
        raise RuntimeError("Unable to store assessment artifact.")

    with pytest.raises(RuntimeError, match="Unable to store assessment artifact"):
        store.persist_assessment_bundle(
            source.evidence_snapshot,
            source.definition,
            source.run,
            artifact_path,
            assessment_artifact_payload(source.run),
            failing_writer,
        )

    assert store.count_runs() == 0
    assert not artifact_path.exists()


def test_artifact_write_failure_is_controlled_and_rolls_back_database(
    tmp_path: Path,
) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    blocked_output = tmp_path / "not-a-directory"
    blocked_output.write_text("file", encoding="utf-8")
    database_path = tmp_path / "artifact-failure.db"

    with pytest.raises(RuntimeError, match="Unable to store assessment artifact"):
        run_assessment(
            intake.portfolio,
            blocked_output,
            intake.enterprise_profile.enterprise_id,
            database_path=database_path,
        )

    assert TrustedAssessmentStore(database_path).count_runs() == 0


def test_database_failure_is_controlled_without_creating_artifact(
    tmp_path: Path,
) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    database_directory = tmp_path / "database-directory"
    database_directory.mkdir()
    output_directory = tmp_path / "assessments"

    with pytest.raises(
        TrustedAssessmentPersistenceError, match="database is unavailable"
    ):
        run_assessment(
            intake.portfolio,
            output_directory,
            intake.enterprise_profile.enterprise_id,
            database_path=database_directory,
        )

    assert not output_directory.exists()


def test_store_assessment_exposes_trust_metadata_in_shared_state(
    tmp_path: Path,
) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    result = run_assessment(
        intake.portfolio,
        tmp_path / "assessments",
        intake.enterprise_profile.enterprise_id,
    )
    state: dict[str, object] = {}

    store_assessment(state, result)

    trust = state["assessment_trust"]
    assert trust["definition_version"] == "1.0.0"
    assert trust["evidence_snapshot_id"].startswith("DNA-SNAPSHOT-")
    assert trust["evidence_completeness"] == 100.0
    assert trust["evidence_complete"] is True
    assert trust["trust_status"] == "Blocked"
    assert trust["missing_requirement_count"] == 3
    assert trust["conflict_count"] == 1
    assert state["assessment_run"] is result.run
    assert state["assessment_evidence_snapshot"] is result.evidence_snapshot


def test_workflow_persists_qualified_run_when_criterion_evidence_is_missing(
    tmp_path: Path,
) -> None:
    intake = load_demo_engagement(APEX_DATA_DIR)
    registry = json.loads(
        (APEX_DATA_DIR / "evidence_registry.json").read_text(encoding="utf-8")
    )
    registry["records"][0]["criterion_references"].remove("business_value")
    registry_path = tmp_path / "qualified-registry.json"
    registry_path.write_text(json.dumps(registry), encoding="utf-8")

    result = run_assessment(
        intake.portfolio,
        tmp_path / "assessments",
        intake.enterprise_profile.enterprise_id,
        evidence_registry_path=registry_path,
        database_path=tmp_path / "trusted.db",
    )
    payload = json.loads(result.artifact_path.read_text(encoding="utf-8"))
    missing = [item for item in payload["criterion_results"] if not item["supported"]]

    assert result.run.evidence_complete is False
    assert result.run.evidence_completeness == 98.2
    assert len(missing) == 1
    assert missing[0]["asset_id"] == "APX-PLT-001"
    assert missing[0]["criterion_id"] == "business_value"
    assert result.candidate["priority_score"] == 64.4

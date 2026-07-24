from datetime import datetime, timezone
from pathlib import Path

import pytest

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

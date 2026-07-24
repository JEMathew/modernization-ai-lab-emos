"""Characterize the pre-Runtime-Spine workflow without changing its behavior.

RS-01 protects the current state ownership, invalidation rules, deterministic
decisions, and stored artifacts before later slices introduce runtime contracts.
These tests intentionally exercise only the existing public workflow helpers.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZipFile

import pandas as pd
import pytest

from engine.workflow import (
    ASSESSMENT_STATE_KEYS,
    ENGINEERING_STATE_KEYS,
    REPLAN_STATE_KEYS,
    AgencyContext,
    AssessmentResult,
    EngineeringResult,
    IntakeResult,
    apply_budget_reduction,
    clear_assessment,
    clear_engineering,
    clear_intake,
    clear_replan,
    complete_replan_request,
    initialize_agency_state,
    load_agency_context,
    load_demo_engagement,
    request_replan,
    run_assessment,
    run_engineering,
    selected_candidate,
    store_assessment,
    store_engineering,
    store_intake,
    workflow_stage,
)


ROOT_DIR = Path(__file__).resolve().parents[2]
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"
START_TIME = datetime(2026, 7, 12, 9, 0, tzinfo=timezone.utc)

INTAKE_STATE_KEYS = (
    "enterprise_profile",
    "portfolio",
    "portfolio_summary",
)
AGENCY_BASE_STATE_KEYS = (
    "agency_original_budget",
    "agency_budget",
    "agency_downtime",
    "agency_business_priority",
    "agency_start_time",
    "agency_replan_requested",
)


@pytest.fixture
def current_results(
    tmp_path: Path,
) -> tuple[IntakeResult, AssessmentResult, EngineeringResult]:
    """Build the existing synthetic workflow through its public facade."""

    intake = load_demo_engagement(APEX_DATA_DIR)
    assessment = run_assessment(
        intake.portfolio,
        tmp_path / "assessment",
        intake.enterprise_profile.enterprise_id,
    )
    engineering = run_engineering(
        APEX_DATA_DIR,
        tmp_path / "engineering",
        assessment.candidate,
    )
    return intake, assessment, engineering


def test_current_stage_and_state_owner_inventory(
    current_results: tuple[IntakeResult, AssessmentResult, EngineeringResult],
) -> None:
    """Lock the session-state markers that currently drive visible progress."""

    intake, assessment, engineering = current_results
    state: dict[str, object] = {}

    assert workflow_stage(state) == 0

    store_intake(state, intake)
    assert workflow_stage(state) == 1
    assert set(INTAKE_STATE_KEYS).issubset(state)

    store_assessment(state, assessment)
    assert workflow_stage(state) == 3
    assert set(ASSESSMENT_STATE_KEYS).issubset(state)
    assert selected_candidate(state["assessment"])["platform_name"] == (
        "Oracle Customer Analytics Warehouse"
    )

    store_engineering(state, engineering)
    assert workflow_stage(state) == 4
    assert set(ENGINEERING_STATE_KEYS).issubset(state)
    assert Path(str(state["assessment_artifact"])).is_file()
    assert Path(str(state["implementation_package"])).is_file()


def test_upstream_updates_invalidate_only_current_downstream_state(
    current_results: tuple[IntakeResult, AssessmentResult, EngineeringResult],
) -> None:
    """Characterize current invalidation without adding new cascade semantics."""

    intake, assessment, engineering = current_results
    state: dict[str, object] = {
        "unrelated_user_preference": "preserve",
        **{key: object() for key in ASSESSMENT_STATE_KEYS},
        **{key: object() for key in ENGINEERING_STATE_KEYS},
        **{key: object() for key in REPLAN_STATE_KEYS},
    }

    store_intake(state, intake)
    assert set(INTAKE_STATE_KEYS).issubset(state)
    assert not set(
        ASSESSMENT_STATE_KEYS + ENGINEERING_STATE_KEYS + REPLAN_STATE_KEYS
    ).intersection(state)
    assert state["unrelated_user_preference"] == "preserve"

    store_assessment(state, assessment)
    assert set(INTAKE_STATE_KEYS + ASSESSMENT_STATE_KEYS).issubset(state)

    state.update({key: object() for key in ENGINEERING_STATE_KEYS + REPLAN_STATE_KEYS})
    store_assessment(state, assessment)
    assert not set(ENGINEERING_STATE_KEYS + REPLAN_STATE_KEYS).intersection(state)

    state.update({key: object() for key in REPLAN_STATE_KEYS})
    store_engineering(state, engineering)
    assert set(
        INTAKE_STATE_KEYS + ASSESSMENT_STATE_KEYS + ENGINEERING_STATE_KEYS
    ).issubset(state)
    assert not set(REPLAN_STATE_KEYS).intersection(state)


def test_clear_helpers_remove_only_their_owned_state() -> None:
    """Record that current clear commands are scoped, not a durable full reset."""

    owned_keys = (
        INTAKE_STATE_KEYS
        + ASSESSMENT_STATE_KEYS
        + ENGINEERING_STATE_KEYS
        + REPLAN_STATE_KEYS
    )
    state: dict[str, object] = {
        "unrelated_user_preference": "preserve",
        **{key: object() for key in owned_keys},
    }

    clear_replan(state)
    assert not set(REPLAN_STATE_KEYS).intersection(state)
    assert set(INTAKE_STATE_KEYS + ASSESSMENT_STATE_KEYS + ENGINEERING_STATE_KEYS).issubset(state)

    clear_engineering(state)
    assert not set(ENGINEERING_STATE_KEYS).intersection(state)
    assert set(INTAKE_STATE_KEYS + ASSESSMENT_STATE_KEYS).issubset(state)

    clear_assessment(state)
    assert not set(ASSESSMENT_STATE_KEYS).intersection(state)
    assert set(INTAKE_STATE_KEYS).issubset(state)

    clear_intake(state)
    assert not set(owned_keys).intersection(state)
    assert state == {"unrelated_user_preference": "preserve"}
    assert workflow_stage(state) == 0


def test_deterministic_decisions_and_required_artifacts_are_preserved(
    tmp_path: Path,
) -> None:
    """Protect Python-owned decisions and artifact-backed workflow outcomes."""

    intake = load_demo_engagement(APEX_DATA_DIR)
    first = run_assessment(
        intake.portfolio,
        tmp_path / "assessment-first",
        intake.enterprise_profile.enterprise_id,
    )
    second = run_assessment(
        intake.portfolio,
        tmp_path / "assessment-second",
        intake.enterprise_profile.enterprise_id,
    )

    pd.testing.assert_frame_equal(first.assessment, second.assessment)
    assert first.candidate.equals(second.candidate)
    assert first.recommendation == second.recommendation
    assert first.candidate["platform_name"] == "Oracle Customer Analytics Warehouse"

    assessment_payload = json.loads(first.artifact_path.read_text(encoding="utf-8"))
    assert assessment_payload["enterprise_id"] == "APEX-AERO-001"
    assert assessment_payload["calculation_owner"] == (
        "Python deterministic assessment engine"
    )
    assert assessment_payload["assessment"] == first.assessment.to_dict(
        orient="records"
    )

    engineering = run_engineering(
        APEX_DATA_DIR,
        tmp_path / "engineering",
        first.candidate,
    )
    assert engineering.engagement["narrative_source"] == "Deterministic fallback"
    assert engineering.engagement["candidate"] == first.candidate["platform_name"]

    with ZipFile(engineering.package_path) as package:
        names = set(package.namelist())
        manifest = json.loads(package.read("manifest.json"))

    assert {
        "Executive_Summary.md",
        "Source_Target_Mapping.csv",
        "Converted_SQL.sql",
        "Validation_Report.md",
        "manifest.json",
    }.issubset(names)
    assert manifest["candidate"] == "Oracle Customer Analytics Warehouse"
    assert manifest["calculation_owner"] == (
        "Python deterministic engineering engine"
    )
    assert manifest["narrative_source"] == "Deterministic fallback"


def test_agency_state_is_shared_and_reinitialization_is_non_destructive() -> None:
    """Protect the existing shared planning state and human-approval baseline."""

    context: AgencyContext = load_agency_context(
        APEX_DATA_DIR / "business_constraints.json"
    )
    state: dict[str, object] = {}
    initialize_agency_state(state, context, START_TIME)

    assert set(AGENCY_BASE_STATE_KEYS).issubset(state)
    assert context.approval == "Pending Human Approval"
    assert state["agency_budget"] == 8_500_000.0
    assert state["agency_replan_requested"] is False

    apply_budget_reduction(state)
    assert state["agency_budget"] == 5_950_000.0
    assert state["agency_replan_requested"] is True

    # Streamlit reruns reinitialize the view; setdefault must retain active work.
    initialize_agency_state(state, context, START_TIME)
    assert state["agency_budget"] == 5_950_000.0
    assert state["agency_replan_requested"] is True

    complete_replan_request(state)
    assert state["agency_replan_requested"] is False
    request_replan(state)
    assert state["agency_replan_requested"] is True

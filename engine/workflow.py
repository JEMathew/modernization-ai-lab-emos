"""Shared application workflow for every Streamlit viewport.

This module coordinates the existing deterministic engine capabilities and
owns workflow state transitions without depending on Streamlit. Presentation
code passes its single session-state mapping into these helpers.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Mapping, MutableMapping

import pandas as pd

from .agency import (
    approval_status,
    create_plan,
    load_business_constraints,
    replan_for_constraints,
    store_replan_artifact,
)
from .assessment import (
    assess_portfolio,
    consulting_recommendation,
    select_modernization_candidate,
    store_assessment_artifact,
)
from .data_loader import EnterpriseProfile, load_enterprise_profile, load_portfolio
from .engineering import (
    build_engineering_engagement,
    generate_implementation_package,
    package_bytes,
)


ASSESSMENT_STATE_KEYS = (
    "assessment",
    "assessment_artifact",
    "assessment_recommendation",
)
ENGINEERING_STATE_KEYS = ("engineering_engagement", "implementation_package")
REPLAN_STATE_KEYS = ("agency_replan", "agency_replan_artifact")


@dataclass(frozen=True)
class IntakeResult:
    enterprise_profile: EnterpriseProfile
    portfolio: pd.DataFrame
    summary: dict[str, object]


@dataclass(frozen=True)
class AssessmentResult:
    assessment: pd.DataFrame
    candidate: pd.Series
    recommendation: str
    artifact_path: Path


@dataclass(frozen=True)
class EngineeringResult:
    engagement: dict[str, object]
    package_path: Path


@dataclass(frozen=True)
class AgencyContext:
    original_budget: float
    original_downtime: int
    approval: str


@dataclass(frozen=True)
class ReplanResult:
    replan: dict[str, object]
    artifact_path: Path


def portfolio_summary(portfolio: pd.DataFrame) -> dict[str, object]:
    """Return the shared intake metrics displayed at every viewport."""

    return {
        "platform_count": len(portfolio),
        "annual_platform_cost": float(portfolio["annual_cost_usd"].sum()),
        "critical_platform_count": int(
            portfolio["criticality"].str.casefold().eq("critical").sum()
        ),
    }


def load_demo_engagement(data_directory: str | Path) -> IntakeResult:
    """Load the synthetic demo through one validated intake workflow."""

    data_directory = Path(data_directory)
    profile = load_enterprise_profile(data_directory / "enterprise_profile.json")
    portfolio = load_portfolio(data_directory / "portfolio.csv")
    return IntakeResult(profile, portfolio, portfolio_summary(portfolio))


def run_assessment(
    portfolio: pd.DataFrame,
    output_directory: str | Path,
    enterprise_id: str,
) -> AssessmentResult:
    """Assess, select, explain, and persist through one engine workflow."""

    assessment = assess_portfolio(portfolio)
    candidate = select_modernization_candidate(assessment)
    recommendation = consulting_recommendation(candidate)
    artifact_path = store_assessment_artifact(
        assessment, output_directory, enterprise_id
    )
    return AssessmentResult(assessment, candidate, recommendation, artifact_path)


def selected_candidate(assessment: pd.DataFrame) -> pd.Series:
    """Expose the single deterministic candidate-selection path to the UI."""

    return select_modernization_candidate(assessment)


def recommendation_for_assessment(assessment: pd.DataFrame) -> str:
    """Build the recommendation from the shared selected candidate."""

    return consulting_recommendation(selected_candidate(assessment))


def run_engineering(
    data_directory: str | Path,
    output_directory: str | Path,
    candidate: pd.Series,
) -> EngineeringResult:
    """Generate the package for the candidate selected by the assessment engine."""

    engagement = build_engineering_engagement(data_directory)
    candidate_name = str(candidate["platform_name"])
    if engagement["candidate"] != candidate_name:
        raise ValueError(
            "Engineering engagement candidate does not match assessment selection: "
            f"{engagement['candidate']} != {candidate_name}"
        )
    package_path = generate_implementation_package(engagement, output_directory)
    return EngineeringResult(engagement, package_path)


def download_package(package_path: str | Path) -> bytes:
    """Return the same generated package bytes to every responsive rendering."""

    return package_bytes(package_path)


def load_agency_context(constraints_path: str | Path) -> AgencyContext:
    """Load the shared planning constraints and approval state."""

    constraints = load_business_constraints(constraints_path)
    return AgencyContext(
        original_budget=float(constraints["annual_modernization_budget_usd"]),
        original_downtime=int(constraints["maximum_planned_downtime_hours"]),
        approval=approval_status(),
    )


def original_plan(assessment: pd.DataFrame, original_budget: float) -> pd.DataFrame:
    """Build the original plan through the agency engine."""

    return create_plan(assessment, original_budget)


def run_replan(
    assessment: pd.DataFrame,
    original_budget: float,
    new_budget: float,
    downtime_hours: int,
    business_priority: str,
    output_directory: str | Path,
) -> ReplanResult:
    """Replan and persist the result through one agency workflow."""

    replan = replan_for_constraints(
        assessment,
        original_budget_usd=original_budget,
        new_budget_usd=new_budget,
        downtime_hours=downtime_hours,
        business_priority=business_priority,
    )
    artifact_path = store_replan_artifact(replan, output_directory)
    return ReplanResult(replan, artifact_path)


def workflow_stage(state: Mapping[str, object]) -> int:
    """Return the shared completed-stage count for the progress indicator."""

    if "engineering_engagement" in state:
        return 4
    if "assessment" in state:
        return 3
    if "enterprise_profile" in state:
        return 1
    return 0


def _remove_keys(state: MutableMapping[str, object], keys: tuple[str, ...]) -> None:
    for key in keys:
        state.pop(key, None)


def store_intake(state: MutableMapping[str, object], result: IntakeResult) -> None:
    state["enterprise_profile"] = result.enterprise_profile
    state["portfolio"] = result.portfolio
    state["portfolio_summary"] = result.summary
    _remove_keys(state, ASSESSMENT_STATE_KEYS + ENGINEERING_STATE_KEYS + REPLAN_STATE_KEYS)


def clear_intake(state: MutableMapping[str, object]) -> None:
    _remove_keys(state, ("enterprise_profile", "portfolio", "portfolio_summary"))


def store_assessment(state: MutableMapping[str, object], result: AssessmentResult) -> None:
    state["assessment"] = result.assessment
    state["assessment_artifact"] = str(result.artifact_path)
    state["assessment_recommendation"] = result.recommendation
    _remove_keys(state, ENGINEERING_STATE_KEYS + REPLAN_STATE_KEYS)


def clear_assessment(state: MutableMapping[str, object]) -> None:
    _remove_keys(state, ASSESSMENT_STATE_KEYS)


def store_engineering(state: MutableMapping[str, object], result: EngineeringResult) -> None:
    state["engineering_engagement"] = result.engagement
    state["implementation_package"] = str(result.package_path)
    _remove_keys(state, REPLAN_STATE_KEYS)


def clear_engineering(state: MutableMapping[str, object]) -> None:
    _remove_keys(state, ENGINEERING_STATE_KEYS)


def initialize_agency_state(
    state: MutableMapping[str, object],
    context: AgencyContext,
    start_time: datetime | None = None,
) -> None:
    state.setdefault("agency_original_budget", context.original_budget)
    state.setdefault("agency_budget", context.original_budget)
    state.setdefault("agency_downtime", context.original_downtime)
    state.setdefault("agency_business_priority", "Customer Analytics Continuity")
    state.setdefault(
        "agency_start_time", (start_time or datetime.now(timezone.utc)).isoformat()
    )
    state.setdefault("agency_replan_requested", False)


def request_replan(state: MutableMapping[str, object]) -> None:
    state["agency_replan_requested"] = True


def complete_replan_request(state: MutableMapping[str, object]) -> None:
    state["agency_replan_requested"] = False


def apply_budget_reduction(
    state: MutableMapping[str, object], reduction_percent: float = 30.0
) -> None:
    if not 0 <= reduction_percent < 100:
        raise ValueError("Budget reduction percent must be between zero and 100.")
    state["agency_budget"] = round(
        float(state["agency_original_budget"]) * (1 - reduction_percent / 100), 2
    )
    request_replan(state)


def store_replan(state: MutableMapping[str, object], result: ReplanResult) -> None:
    state["agency_replan"] = result.replan
    state["agency_replan_artifact"] = str(result.artifact_path)


def clear_replan(state: MutableMapping[str, object]) -> None:
    _remove_keys(state, REPLAN_STATE_KEYS)

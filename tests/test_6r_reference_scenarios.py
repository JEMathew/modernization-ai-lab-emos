import json
from pathlib import Path

from engine.data_loader import load_portfolio
from engine.persistence import TrustedAssessmentStore
from engine.workflow import run_assessment, store_assessment


ROOT_DIR = Path(__file__).resolve().parents[1]
APPLICATION_DATA_DIR = ROOT_DIR / "demo_data" / "phase_a_6r"
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"


def _run_reference(data_dir: Path, enterprise_id: str, tmp_path: Path):
    return run_assessment(
        load_portfolio(data_dir / "portfolio.csv"),
        tmp_path / enterprise_id / "assessments",
        enterprise_id,
        evidence_registry_path=data_dir / "evidence_registry.json",
        database_path=tmp_path / enterprise_id / "trusted.db",
    )


def test_application_reference_persists_recommendation_and_ui_state(tmp_path: Path) -> None:
    result = _run_reference(APPLICATION_DATA_DIR, "NORTHSTAR-MFG-001", tmp_path)
    payload = json.loads(result.artifact_path.read_text(encoding="utf-8"))
    stored = TrustedAssessmentStore(result.database_path).get_recommendations(
        result.run.run_id
    )
    state: dict[str, object] = {}
    store_assessment(state, result)

    assert result.candidate["platform_name"] == "Legacy Order Fulfillment Suite"
    assert result.run.modernization_recommendations[0].recommended_strategy.value == "Refactor"
    assert len(payload["modernization_recommendations"]) == 1
    assert stored[0]["recommendation_hash"] == payload["modernization_recommendations"][0]["recommendation_hash"]
    assert state["modernization_recommendations"] == result.run.modernization_recommendations
    assert result.artifact_path.is_file()


def test_data_platform_reference_persists_replatform_without_approval(tmp_path: Path) -> None:
    result = _run_reference(APEX_DATA_DIR, "APEX-AERO-001", tmp_path)
    oracle = next(
        item
        for item in result.run.modernization_recommendations
        if item.asset_id == "APX-PLT-001"
    )
    stored = TrustedAssessmentStore(result.database_path).get_recommendations(
        result.run.run_id
    )
    stored_oracle = next(item for item in stored if item["asset_id"] == "APX-PLT-001")

    assert oracle.recommended_strategy.value == "Replatform"
    assert oracle.status == "Recommended"
    assert oracle.authority_scope == "RecommendOnly"
    assert oracle.execution_authority == "None"
    assert stored_oracle["execution_authority"] == "None"
    assert len(stored) == 7


def test_each_apex_asset_has_one_versioned_recommendation_and_five_alternatives(
    tmp_path: Path,
) -> None:
    result = _run_reference(APEX_DATA_DIR, "APEX-AERO-001", tmp_path)

    assert len(result.run.modernization_recommendations) == len(result.assessment)
    assert len({item.asset_id for item in result.run.modernization_recommendations}) == 7
    assert all(item.recommendation_version == "1.0.0" for item in result.run.modernization_recommendations)
    assert all(len(item.alternatives) == 5 for item in result.run.modernization_recommendations)
    assert all(item.supporting_evidence for item in result.run.modernization_recommendations)

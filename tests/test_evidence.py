import json
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import pytest
from pydantic import ValidationError

from engine.assessment import (
    assess_portfolio,
    build_criterion_results,
    current_assessment_definition,
)
from engine.assessment_models import EvidenceRecord
from engine.data_loader import load_portfolio
from engine.evidence import (
    EvidenceError,
    create_evidence_snapshot,
    load_evidence_registry,
    portfolio_from_snapshot,
)


ROOT_DIR = Path(__file__).resolve().parents[1]
APEX_DATA_DIR = ROOT_DIR / "demo_data" / "apex_aerospace"
REGISTRY_PATH = APEX_DATA_DIR / "evidence_registry.json"


def test_apex_registry_is_valid_synthetic_evidence() -> None:
    records = load_evidence_registry(REGISTRY_PATH, "APEX-AERO-001")

    assert len(records) == 12
    assert {record.asset_id for record in records} == {
        f"APX-PLT-{number:03d}" for number in range(1, 8)
    }
    assert all(record.source_type == "synthetic_demo_registry" for record in records)
    assert sum(record.evidence_category == "portfolio_inventory" for record in records) == 7
    assert sum(record.evidence_category != "portfolio_inventory" for record in records) == 5


def test_evidence_models_are_strict_and_frozen() -> None:
    record = load_evidence_registry(REGISTRY_PATH)[0]

    with pytest.raises(ValidationError, match="frozen"):
        record.confidence = 0.5
    with pytest.raises(ValidationError):
        EvidenceRecord.model_validate(
            {**record.model_dump(mode="python"), "unsupported": True}
        )


def test_snapshot_order_and_hash_are_canonical() -> None:
    records = load_evidence_registry(REGISTRY_PATH)
    asset_ids = [record.asset_id for record in records]
    captured = datetime(2026, 8, 1, tzinfo=timezone.utc)

    first = create_evidence_snapshot(records, "APEX-AERO-001", asset_ids, captured)
    second = create_evidence_snapshot(
        reversed(records), "APEX-AERO-001", reversed(asset_ids), captured
    )

    assert [record.evidence_id for record in first.records] == sorted(
        record.evidence_id for record in first.records
    )
    assert first.snapshot_id == second.snapshot_id
    assert first.snapshot_hash == second.snapshot_hash


def test_snapshot_copies_registry_records_immutably() -> None:
    records = list(load_evidence_registry(REGISTRY_PATH))
    snapshot = create_evidence_snapshot(
        records, "APEX-AERO-001", [record.asset_id for record in records]
    )
    original_name = snapshot.records[0].facts["platform_name"]

    changed_facts = dict(records[0].facts)
    changed_facts["platform_name"] = "Changed after snapshot"
    records[0] = records[0].model_copy(update={"facts": changed_facts})

    assert snapshot.records[0].facts["platform_name"] == original_name


def test_snapshot_reconstructs_current_apex_portfolio() -> None:
    records = load_evidence_registry(REGISTRY_PATH)
    portfolio = load_portfolio(APEX_DATA_DIR / "portfolio.csv")
    snapshot = create_evidence_snapshot(
        records, "APEX-AERO-001", portfolio["platform_id"].tolist()
    )

    reconstructed = portfolio_from_snapshot(snapshot)
    expected = portfolio.sort_values("platform_id").reset_index(drop=True)

    pd.testing.assert_frame_equal(
        reconstructed[expected.columns], expected, check_dtype=False
    )


def test_missing_required_criterion_evidence_is_explicit_and_deterministic() -> None:
    records = list(load_evidence_registry(REGISTRY_PATH))
    records[0] = records[0].model_copy(
        update={
            "criterion_references": tuple(
                item
                for item in records[0].criterion_references
                if item != "business_value"
            )
        }
    )
    snapshot = create_evidence_snapshot(
        records, "APEX-AERO-001", [record.asset_id for record in records]
    )
    assessment = assess_portfolio(portfolio_from_snapshot(snapshot))

    results = build_criterion_results(
        assessment, snapshot, current_assessment_definition()
    )
    missing = [result for result in results if not result.supported]

    assert len(missing) == 1
    assert missing[0].asset_id == "APX-PLT-001"
    assert missing[0].criterion_id == "business_value"
    assert missing[0].evidence_status == "missing"
    assert missing[0].missing_evidence_categories == ("portfolio_inventory",)


def test_empty_and_malformed_registries_fail_with_controlled_errors(
    tmp_path: Path,
) -> None:
    empty = tmp_path / "empty.json"
    empty.write_text(
        json.dumps({"synthetic_demo_evidence": True, "records": []}),
        encoding="utf-8",
    )
    malformed = tmp_path / "malformed.json"
    malformed.write_text("{", encoding="utf-8")

    with pytest.raises(EvidenceError, match="no evidence"):
        load_evidence_registry(empty)
    with pytest.raises(EvidenceError, match="could not be loaded"):
        load_evidence_registry(malformed)


def test_missing_asset_evidence_stops_the_run() -> None:
    records = tuple(
        record
        for record in load_evidence_registry(REGISTRY_PATH)
        if record.asset_id != "APX-PLT-007"
    )

    with pytest.raises(EvidenceError, match="APX-PLT-007"):
        create_evidence_snapshot(
            records,
            "APEX-AERO-001",
            [f"APX-PLT-{number:03d}" for number in range(1, 8)],
        )

"""Synthetic evidence registry and immutable snapshot construction."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import pandas as pd
from pydantic import ValidationError

from .assessment_models import EvidenceRecord, EvidenceSnapshot
from .data_loader import DataLoadError, REQUIRED_PORTFOLIO_COLUMNS, load_json_safely


class EvidenceError(RuntimeError):
    """Controlled evidence-boundary failure safe for presentation to a user."""


def canonical_json(value: Any) -> str:
    """Serialize supported data deterministically for hashes and persistence."""

    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
        default=str,
    )


def sha256_json(value: Any) -> str:
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


def evidence_content_hash(facts: dict[str, Any]) -> str:
    return sha256_json(facts)


def load_evidence_registry(
    path: str | Path, enterprise_id: str | None = None
) -> tuple[EvidenceRecord, ...]:
    """Load and strictly validate a non-empty synthetic evidence registry."""

    try:
        payload = load_json_safely(path)
    except DataLoadError as exc:
        raise EvidenceError(f"Evidence registry could not be loaded. {exc}") from exc
    if not isinstance(payload, dict) or not isinstance(payload.get("records"), list):
        raise EvidenceError("Evidence registry must contain a records list.")
    if not payload["records"]:
        raise EvidenceError("Evidence registry contains no evidence records.")
    if payload.get("synthetic_demo_evidence") is not True:
        raise EvidenceError("Evidence registry must identify synthetic demo evidence.")
    try:
        records = tuple(
            EvidenceRecord.model_validate_json(json.dumps(item))
            for item in payload["records"]
        )
    except ValidationError as exc:
        raise EvidenceError("Evidence registry contains invalid evidence metadata.") from exc
    ids = [record.evidence_id for record in records]
    if len(ids) != len(set(ids)):
        raise EvidenceError("Evidence registry contains duplicate evidence identifiers.")
    for record in records:
        if evidence_content_hash(record.facts) != record.content_hash:
            raise EvidenceError(
                f"Evidence record {record.evidence_id} failed its content hash check."
            )
        if enterprise_id and record.enterprise_id != enterprise_id:
            raise EvidenceError("Evidence registry contains records for another enterprise.")
    return records


def create_evidence_snapshot(
    records: Iterable[EvidenceRecord],
    enterprise_id: str,
    asset_ids: Iterable[str],
    created_at: datetime | None = None,
) -> EvidenceSnapshot:
    """Copy relevant evidence into a canonically ordered, content-addressed snapshot."""

    wanted = set(asset_ids)
    selected = tuple(
        sorted(
            (
                record.model_copy(deep=True)
                for record in records
                if record.enterprise_id == enterprise_id and record.asset_id in wanted
            ),
            key=lambda record: record.evidence_id,
        )
    )
    if not selected:
        raise EvidenceError("No relevant evidence was found for this assessment.")
    covered_assets = {record.asset_id for record in selected}
    missing_assets = sorted(wanted.difference(covered_assets))
    if missing_assets:
        raise EvidenceError(
            "Required portfolio evidence is missing for assets: "
            + ", ".join(missing_assets)
        )
    hash_payload = [record.model_dump(mode="json") for record in selected]
    snapshot_hash = sha256_json(hash_payload)
    return EvidenceSnapshot(
        snapshot_id=f"DNA-SNAPSHOT-{snapshot_hash[:20].upper()}",
        enterprise_id=enterprise_id,
        created_at=created_at or datetime.now(timezone.utc),
        snapshot_hash=snapshot_hash,
        records=selected,
    )


def portfolio_from_snapshot(snapshot: EvidenceSnapshot) -> pd.DataFrame:
    """Reconstruct the exact deterministic scoring input from snapshot copies."""

    facts_by_asset: dict[str, dict[str, Any]] = {}
    portfolio_records = tuple(
        record
        for record in snapshot.records
        if record.evidence_category == "portfolio_inventory"
    )
    if not portfolio_records:
        raise EvidenceError("Snapshot contains no portfolio inventory evidence.")
    for record in portfolio_records:
        existing = facts_by_asset.get(record.asset_id)
        if existing is not None and existing != record.facts:
            raise EvidenceError(
                f"Conflicting portfolio evidence exists for asset {record.asset_id}."
            )
        facts_by_asset[record.asset_id] = dict(record.facts)
    portfolio = pd.DataFrame(
        [facts_by_asset[asset_id] for asset_id in sorted(facts_by_asset)]
    )
    missing_columns = sorted(REQUIRED_PORTFOLIO_COLUMNS.difference(portfolio.columns))
    if missing_columns:
        raise EvidenceError(
            "Snapshot portfolio evidence is missing required fields: "
            + ", ".join(missing_columns)
        )
    for column in ("annual_cost_usd", "data_volume_tb"):
        try:
            portfolio[column] = pd.to_numeric(portfolio[column], errors="raise")
        except (TypeError, ValueError) as exc:
            raise EvidenceError(
                f"Snapshot evidence field '{column}' must be numeric."
            ) from exc
    return portfolio

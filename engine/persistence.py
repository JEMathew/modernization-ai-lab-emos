"""Narrow SQLite persistence for trusted local assessment metadata."""

from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Callable

from .assessment_models import AssessmentDefinition, AssessmentRun
from .evidence import EvidenceSnapshot


class TrustedAssessmentPersistenceError(RuntimeError):
    """Controlled local persistence failure without database internals."""


SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS evidence_versions (
    evidence_id TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    enterprise_id TEXT NOT NULL,
    asset_id TEXT NOT NULL,
    evidence_category TEXT NOT NULL,
    metadata_json TEXT NOT NULL,
    PRIMARY KEY (evidence_id, content_hash)
);

CREATE TABLE IF NOT EXISTS evidence_snapshots (
    snapshot_id TEXT PRIMARY KEY,
    enterprise_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    snapshot_hash TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS evidence_snapshot_items (
    snapshot_id TEXT NOT NULL REFERENCES evidence_snapshots(snapshot_id),
    evidence_id TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    ordinal INTEGER NOT NULL,
    PRIMARY KEY (snapshot_id, evidence_id),
    FOREIGN KEY (evidence_id, content_hash)
        REFERENCES evidence_versions(evidence_id, content_hash),
    UNIQUE (snapshot_id, ordinal)
);

CREATE TABLE IF NOT EXISTS assessment_definitions (
    definition_hash TEXT PRIMARY KEY,
    definition_id TEXT NOT NULL,
    version TEXT NOT NULL,
    definition_json TEXT NOT NULL,
    UNIQUE (definition_id, version)
);

CREATE TABLE IF NOT EXISTS assessment_runs (
    run_id TEXT PRIMARY KEY,
    schema_version TEXT NOT NULL,
    enterprise_id TEXT NOT NULL,
    generated_at TEXT NOT NULL,
    definition_hash TEXT NOT NULL REFERENCES assessment_definitions(definition_hash),
    snapshot_id TEXT NOT NULL REFERENCES evidence_snapshots(snapshot_id),
    snapshot_hash TEXT NOT NULL,
    evidence_completeness REAL NOT NULL,
    evidence_complete INTEGER NOT NULL,
    calculation_owner TEXT NOT NULL,
    engine_version TEXT NOT NULL,
    result_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS criterion_results (
    run_id TEXT NOT NULL REFERENCES assessment_runs(run_id),
    asset_id TEXT NOT NULL,
    criterion_id TEXT NOT NULL,
    value REAL NOT NULL,
    evidence_status TEXT NOT NULL,
    supported INTEGER NOT NULL,
    result_json TEXT NOT NULL,
    PRIMARY KEY (run_id, asset_id, criterion_id)
);

CREATE TABLE IF NOT EXISTS freshness_policies (
    policy_id TEXT PRIMARY KEY,
    version TEXT NOT NULL,
    policy_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence_requirements (
    requirement_id TEXT PRIMARY KEY,
    definition_hash TEXT NOT NULL REFERENCES assessment_definitions(definition_hash),
    criterion_id TEXT NOT NULL,
    freshness_policy_id TEXT NOT NULL REFERENCES freshness_policies(policy_id),
    blocking INTEGER NOT NULL,
    requirement_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence_links (
    link_id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES assessment_runs(run_id),
    criterion_result_id TEXT NOT NULL,
    evidence_id TEXT,
    missing_requirement_id TEXT REFERENCES evidence_requirements(requirement_id),
    relationship_type TEXT NOT NULL,
    link_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence_quality_results (
    quality_result_id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES assessment_runs(run_id),
    criterion_result_id TEXT NOT NULL,
    trust_status TEXT NOT NULL,
    quality_json TEXT NOT NULL,
    UNIQUE (run_id, criterion_result_id)
);

CREATE TABLE IF NOT EXISTS assessment_evidence_health (
    run_id TEXT PRIMARY KEY REFERENCES assessment_runs(run_id),
    trust_status TEXT NOT NULL,
    freshness_policy_version TEXT NOT NULL,
    finding_generation_version TEXT NOT NULL,
    summary_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assessment_findings (
    finding_id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES assessment_runs(run_id),
    criterion_result_id TEXT NOT NULL,
    finding_type TEXT NOT NULL,
    classification TEXT NOT NULL,
    severity TEXT NOT NULL,
    finding_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS finding_evidence_relationships (
    relationship_id TEXT PRIMARY KEY,
    finding_id TEXT NOT NULL REFERENCES assessment_findings(finding_id),
    criterion_result_id TEXT NOT NULL,
    evidence_link_id TEXT REFERENCES evidence_links(link_id),
    evidence_id TEXT,
    missing_requirement_id TEXT REFERENCES evidence_requirements(requirement_id),
    relationship_type TEXT NOT NULL,
    relationship_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS modernization_recommendations (
    recommendation_id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES assessment_runs(run_id),
    asset_id TEXT NOT NULL,
    recommended_strategy TEXT NOT NULL,
    trust_status TEXT NOT NULL,
    confidence REAL NOT NULL,
    recommendation_version TEXT NOT NULL,
    recommendation_hash TEXT NOT NULL,
    authority_scope TEXT NOT NULL,
    execution_authority TEXT NOT NULL,
    recommendation_json TEXT NOT NULL,
    UNIQUE (run_id, asset_id, recommendation_version)
);

CREATE TABLE IF NOT EXISTS artifact_references (
    run_id TEXT NOT NULL REFERENCES assessment_runs(run_id),
    artifact_type TEXT NOT NULL,
    artifact_reference TEXT NOT NULL,
    PRIMARY KEY (run_id, artifact_type)
);
"""


ArtifactWriter = Callable[[Path, dict[str, object]], Path]


class TrustedAssessmentStore:
    """Transactional store suitable for the current local modular monolith."""

    def __init__(self, database_path: str | Path):
        self.database_path = Path(database_path)

    def _connect(self) -> sqlite3.Connection:
        try:
            self.database_path.parent.mkdir(parents=True, exist_ok=True)
            connection = sqlite3.connect(self.database_path)
            connection.row_factory = sqlite3.Row
            connection.execute("PRAGMA foreign_keys = ON")
            return connection
        except (OSError, sqlite3.Error) as exc:
            raise TrustedAssessmentPersistenceError(
                "Trusted assessment database is unavailable."
            ) from exc

    def initialize(self) -> None:
        try:
            with self._connect() as connection:
                connection.executescript(SCHEMA)
        except sqlite3.Error as exc:
            raise TrustedAssessmentPersistenceError(
                "Trusted assessment database could not be initialized."
            ) from exc

    def persist_assessment_bundle(
        self,
        snapshot: EvidenceSnapshot,
        definition: AssessmentDefinition,
        run: AssessmentRun,
        artifact_path: str | Path,
        artifact_payload: dict[str, object],
        artifact_writer: ArtifactWriter,
    ) -> Path:
        """Persist related metadata and artifact as one best-effort local unit."""

        self.initialize()
        target = Path(artifact_path)
        target_existed = target.exists()
        try:
            with self._connect() as connection:
                for record in snapshot.records:
                    connection.execute(
                        """
                        INSERT OR IGNORE INTO evidence_versions
                            (evidence_id, content_hash, enterprise_id, asset_id,
                             evidence_category, metadata_json)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (
                            record.evidence_id,
                            record.content_hash,
                            record.enterprise_id,
                            record.asset_id,
                            record.evidence_category,
                            record.model_dump_json(),
                        ),
                    )
                connection.execute(
                    """
                    INSERT OR IGNORE INTO evidence_snapshots
                        (snapshot_id, enterprise_id, created_at, snapshot_hash)
                    VALUES (?, ?, ?, ?)
                    """,
                    (
                        snapshot.snapshot_id,
                        snapshot.enterprise_id,
                        snapshot.created_at.isoformat(),
                        snapshot.snapshot_hash,
                    ),
                )
                for ordinal, record in enumerate(snapshot.records):
                    connection.execute(
                        """
                        INSERT OR IGNORE INTO evidence_snapshot_items
                            (snapshot_id, evidence_id, content_hash, ordinal)
                        VALUES (?, ?, ?, ?)
                        """,
                        (
                            snapshot.snapshot_id,
                            record.evidence_id,
                            record.content_hash,
                            ordinal,
                        ),
                    )
                connection.execute(
                    """
                    INSERT OR IGNORE INTO assessment_definitions
                        (definition_hash, definition_id, version, definition_json)
                    VALUES (?, ?, ?, ?)
                    """,
                    (
                        definition.definition_hash,
                        definition.definition_id,
                        definition.version,
                        definition.model_dump_json(),
                    ),
                )
                connection.execute(
                    """
                    INSERT INTO assessment_runs
                        (run_id, schema_version, enterprise_id, generated_at,
                         definition_hash, snapshot_id, snapshot_hash,
                         evidence_completeness, evidence_complete,
                         calculation_owner, engine_version, result_hash)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        run.run_id,
                        run.schema_version,
                        run.enterprise_id,
                        run.generated_at.isoformat(),
                        run.definition_hash,
                        run.evidence_snapshot_id,
                        run.evidence_snapshot_hash,
                        run.evidence_completeness,
                        int(run.evidence_complete),
                        run.calculation_owner,
                        run.engine_version,
                        run.result_hash,
                    ),
                )
                for policy in run.freshness_policies:
                    connection.execute(
                        """
                        INSERT OR IGNORE INTO freshness_policies
                            (policy_id, version, policy_json)
                        VALUES (?, ?, ?)
                        """,
                        (policy.policy_id, policy.version, policy.model_dump_json()),
                    )
                for requirement in run.evidence_requirements:
                    connection.execute(
                        """
                        INSERT OR IGNORE INTO evidence_requirements
                            (requirement_id, definition_hash, criterion_id,
                             freshness_policy_id, blocking, requirement_json)
                        VALUES (?, ?, ?, ?, ?, ?)
                        """,
                        (
                            requirement.requirement_id,
                            run.definition_hash,
                            requirement.criterion_id,
                            requirement.freshness_policy_id,
                            int(requirement.blocking),
                            requirement.model_dump_json(),
                        ),
                    )
                for result in run.criterion_results:
                    connection.execute(
                        """
                        INSERT INTO criterion_results
                            (run_id, asset_id, criterion_id, value,
                             evidence_status, supported, result_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            run.run_id,
                            result.asset_id,
                            result.criterion_id,
                            result.value,
                            result.evidence_status,
                            int(result.supported),
                            result.model_dump_json(),
                        ),
                    )
                trust_status = (
                    run.evidence_health.trust_status
                    if run.evidence_health is not None
                    else "Unavailable"
                )
                for link in run.evidence_links:
                    connection.execute(
                        """
                        INSERT INTO evidence_links
                            (link_id, run_id, criterion_result_id, evidence_id,
                             missing_requirement_id, relationship_type, link_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            link.link_id,
                            run.run_id,
                            link.criterion_result_id,
                            link.evidence_id,
                            link.missing_requirement_id,
                            link.relationship_type,
                            link.model_dump_json(),
                        ),
                    )
                for quality in run.evidence_quality_results:
                    connection.execute(
                        """
                        INSERT INTO evidence_quality_results
                            (quality_result_id, run_id, criterion_result_id,
                             trust_status, quality_json)
                        VALUES (?, ?, ?, ?, ?)
                        """,
                        (
                            quality.quality_result_id,
                            run.run_id,
                            quality.criterion_result_id,
                            trust_status,
                            quality.model_dump_json(),
                        ),
                    )
                if run.evidence_health is not None:
                    connection.execute(
                        """
                        INSERT INTO assessment_evidence_health
                            (run_id, trust_status, freshness_policy_version,
                             finding_generation_version, summary_json)
                        VALUES (?, ?, ?, ?, ?)
                        """,
                        (
                            run.run_id,
                            run.evidence_health.trust_status,
                            run.freshness_policy_version,
                            run.finding_generation_version,
                            run.evidence_health.model_dump_json(),
                        ),
                    )
                for finding in run.findings:
                    connection.execute(
                        """
                        INSERT INTO assessment_findings
                            (finding_id, run_id, criterion_result_id,
                             finding_type, classification, severity, finding_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            finding.finding_id,
                            run.run_id,
                            f"CR-{finding.asset_id}-{finding.criterion_id}",
                            finding.finding_type,
                            finding.classification,
                            finding.severity,
                            finding.model_dump_json(),
                        ),
                    )
                for relationship in run.finding_evidence_relationships:
                    connection.execute(
                        """
                        INSERT INTO finding_evidence_relationships
                            (relationship_id, finding_id, criterion_result_id,
                             evidence_link_id, evidence_id,
                             missing_requirement_id, relationship_type,
                             relationship_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            relationship.relationship_id,
                            relationship.finding_id,
                            relationship.criterion_result_id,
                            relationship.evidence_link_id,
                            relationship.evidence_id,
                            relationship.missing_requirement_id,
                            relationship.relationship_type,
                            relationship.model_dump_json(),
                        ),
                    )
                for recommendation in run.modernization_recommendations:
                    connection.execute(
                        """
                        INSERT INTO modernization_recommendations
                            (recommendation_id, run_id, asset_id,
                             recommended_strategy, trust_status, confidence,
                             recommendation_version, recommendation_hash,
                             authority_scope, execution_authority,
                             recommendation_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            recommendation.recommendation_id,
                            run.run_id,
                            recommendation.asset_id,
                            recommendation.recommended_strategy.value,
                            recommendation.trust_status,
                            recommendation.confidence,
                            recommendation.recommendation_version,
                            recommendation.recommendation_hash,
                            recommendation.authority_scope,
                            recommendation.execution_authority,
                            recommendation.model_dump_json(),
                        ),
                    )
                connection.execute(
                    """
                    INSERT INTO artifact_references
                        (run_id, artifact_type, artifact_reference)
                    VALUES (?, ?, ?)
                    """,
                    (run.run_id, "assessment_json", run.artifact_reference),
                )
                artifact_writer(target, artifact_payload)
            return target
        except RuntimeError:
            if target.is_file() and not target_existed:
                target.unlink(missing_ok=True)
            raise
        except (OSError, sqlite3.Error) as exc:
            if target.is_file() and not target_existed:
                target.unlink(missing_ok=True)
            raise TrustedAssessmentPersistenceError(
                "Trusted assessment metadata could not be persisted."
            ) from exc

    def get_run(self, run_id: str) -> dict[str, object] | None:
        """Return persisted run metadata for verification and local queries."""

        self.initialize()
        try:
            with self._connect() as connection:
                row = connection.execute(
                    "SELECT * FROM assessment_runs WHERE run_id = ?", (run_id,)
                ).fetchone()
                return dict(row) if row else None
        except sqlite3.Error as exc:
            raise TrustedAssessmentPersistenceError(
                "Trusted assessment metadata could not be read."
            ) from exc

    def count_runs(self) -> int:
        self.initialize()
        try:
            with self._connect() as connection:
                row = connection.execute(
                    "SELECT COUNT(*) AS count FROM assessment_runs"
                ).fetchone()
                return int(row["count"])
        except sqlite3.Error as exc:
            raise TrustedAssessmentPersistenceError(
                "Trusted assessment metadata could not be read."
            ) from exc

    def get_findings(self, run_id: str) -> tuple[dict[str, object], ...]:
        """Return deterministic findings for artifact/database verification."""

        self.initialize()
        try:
            with self._connect() as connection:
                rows = connection.execute(
                    "SELECT * FROM assessment_findings WHERE run_id = ? ORDER BY finding_id",
                    (run_id,),
                ).fetchall()
                return tuple(dict(row) for row in rows)
        except sqlite3.Error as exc:
            raise TrustedAssessmentPersistenceError(
                "Trusted assessment findings could not be read."
            ) from exc

    def get_evidence_quality_results(
        self, run_id: str
    ) -> tuple[dict[str, object], ...]:
        """Return persisted criterion quality records for local verification."""

        self.initialize()
        try:
            with self._connect() as connection:
                rows = connection.execute(
                    """SELECT * FROM evidence_quality_results
                       WHERE run_id = ? ORDER BY quality_result_id""",
                    (run_id,),
                ).fetchall()
                return tuple(dict(row) for row in rows)
        except sqlite3.Error as exc:
            raise TrustedAssessmentPersistenceError(
                "Evidence-quality results could not be read."
            ) from exc

    def get_evidence_health(self, run_id: str) -> dict[str, object] | None:
        """Return the persisted assessment-level trust summary."""

        self.initialize()
        try:
            with self._connect() as connection:
                row = connection.execute(
                    "SELECT * FROM assessment_evidence_health WHERE run_id = ?",
                    (run_id,),
                ).fetchone()
                return dict(row) if row else None
        except sqlite3.Error as exc:
            raise TrustedAssessmentPersistenceError(
                "Assessment evidence health could not be read."
            ) from exc

    def get_recommendations(self, run_id: str) -> tuple[dict[str, object], ...]:
        """Return immutable recommendations for local artifact verification."""

        self.initialize()
        try:
            with self._connect() as connection:
                rows = connection.execute(
                    """SELECT * FROM modernization_recommendations
                       WHERE run_id = ? ORDER BY asset_id""",
                    (run_id,),
                ).fetchall()
                return tuple(dict(row) for row in rows)
        except sqlite3.Error as exc:
            raise TrustedAssessmentPersistenceError(
                "Modernization recommendations could not be read."
            ) from exc

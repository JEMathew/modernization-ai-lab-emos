"""Canonical, deterministic 6R modernization recommendation intelligence.

This module can recommend and explain. It cannot approve a decision or authorize
execution. Numeric fit and confidence values are calculated by Python only.
"""

from __future__ import annotations

from datetime import datetime
from typing import Iterable

from .assessment_models import (
    AssessmentFinding,
    CriterionResult,
    EvidenceQualityResult,
    EvidenceSnapshot,
    ModernizationRecommendation,
    ModernizationStrategy,
    RecommendationEvidenceReference,
    StrategyAlternative,
    StrategyDefinition,
)
from .evidence import sha256_json


STRATEGY_DEFINITION_VERSION = "1.0.0"
RECOMMENDATION_VERSION = "1.0.0"
RECOMMENDATION_ENGINE_VERSION = "1.0.0"
RECOMMENDATION_OWNER = "Python deterministic 6R recommendation engine"


class ExecutionNotAuthorizedError(PermissionError):
    """Raised when recommendation evidence is incorrectly used as authority."""


def _definition(
    strategy: ModernizationStrategy,
    definition: str,
    eligibility: tuple[str, ...],
    positive: tuple[str, ...],
    negative: tuple[str, ...],
    evidence: tuple[str, ...],
    risks: tuple[str, ...],
    benefits: tuple[str, ...],
    planning: tuple[str, ...],
    execution: tuple[str, ...],
    validation: tuple[str, ...],
    outcomes: tuple[str, ...],
    aliases: tuple[str, ...] = (),
) -> StrategyDefinition:
    return StrategyDefinition(
        strategy_id=f"6R-{strategy.value.upper()}",
        strategy=strategy,
        name=("Repurchase / Replace" if strategy is ModernizationStrategy.REPURCHASE else strategy.value),
        definition=definition,
        eligibility_criteria=eligibility,
        positive_signals=positive,
        negative_signals=negative,
        required_evidence=evidence,
        typical_risks=risks,
        expected_benefits=benefits,
        planning_requirements=planning,
        execution_pattern=execution,
        validation_requirements=validation,
        expected_outcome_categories=outcomes,
        aliases=aliases,
        version=STRATEGY_DEFINITION_VERSION,
    )


STRATEGY_CATALOGUE = (
    _definition(
        ModernizationStrategy.RETAIN,
        "Keep the asset in its current form under explicit controls and a reassessment trigger.",
        ("Current capability remains relevant", "Modernization benefit does not yet justify risk or cost"),
        ("Supported lifecycle", "Manageable technical debt", "Stable demand"),
        ("End-of-support exposure", "Material unmet business need", "Unsustainable operating cost"),
        ("Business roadmap", "Lifecycle support", "Risk acceptance", "Cost baseline"),
        ("Risk acceptance ages without reassessment", "Deferred debt increases"),
        ("Avoided near-term disruption", "Protected continuity"),
        ("Accepted risks and controls", "Monitoring", "Reassessment date and triggers"),
        ("Operate under controls", "Monitor triggers", "Reassess"),
        ("Control effectiveness", "Operational health", "Reassessment evidence"),
        ("Risk exposure", "Operational cost", "Time-to-change"),
    ),
    _definition(
        ModernizationStrategy.RETIRE,
        "Decommission an asset after proving that required consumers, data, and obligations are protected.",
        ("Capability has low or no continuing value", "Dependencies can be removed or migrated safely"),
        ("Low adoption", "Duplicated capability", "Avoidable run cost"),
        ("Critical active consumers", "Unresolved retention obligation", "Unknown dependencies"),
        ("Usage telemetry", "Dependency inventory", "Retention policy", "Consumer ownership"),
        ("Hidden consumer outage", "Regulatory data loss", "Incomplete benefit capture"),
        ("License and infrastructure savings", "Reduced attack surface"),
        ("Consumer migration", "Archival and retention", "Shutdown and rollback controls"),
        ("Confirm usage", "Migrate consumers", "Archive", "Controlled shutdown"),
        ("Zero required usage", "Archive retrieval", "Dependency removal", "Cost removal"),
        ("Licensing cost", "Infrastructure cost", "Security exposure", "Estate complexity"),
    ),
    _definition(
        ModernizationStrategy.REHOST,
        "Move the asset to a new infrastructure environment with minimal application change.",
        ("Architecture is portable", "Change risk should be minimized", "Target infrastructure is compatible"),
        ("Low code debt", "Moderate cloud readiness", "Low integration complexity"),
        ("Platform incompatibility", "High structural debt", "Managed-service value requires redesign"),
        ("Runtime inventory", "Infrastructure map", "Network and security dependencies", "Performance baseline"),
        ("Lift-and-shift cost transfer", "Configuration drift", "Cutover failure"),
        ("Faster data-center exit", "Infrastructure elasticity", "Reduced hardware ownership"),
        ("Environment mapping", "Configuration", "Network/security", "Cutover and rollback"),
        ("Provision target", "Replicate configuration", "Migrate", "Smoke test", "Cut over"),
        ("Functional smoke", "Connectivity", "Performance parity", "Rollback rehearsal"),
        ("Infrastructure cost", "Availability", "Operational effort"),
    ),
    _definition(
        ModernizationStrategy.REPLATFORM,
        "Move to a managed or modern platform while making bounded compatibility and architecture adjustments.",
        ("Business capability remains valuable", "A target platform materially improves operations", "Bounded changes are feasible"),
        ("Cloud-compatible workload", "High platform debt", "Managed-service fit"),
        ("Required behavior needs major redesign", "Target incompatibility", "Unresolved data risk"),
        ("Compatibility assessment", "Schema and dependency inventory", "Performance baseline", "Target service evidence"),
        ("Behavioral incompatibility", "Performance regression", "Data migration error"),
        ("Reduced platform operations", "Scalability", "Improved supportability"),
        ("Target services", "Compatibility changes", "Migration", "Integration changes", "Cutover"),
        ("Configure platform", "Adapt compatibility boundaries", "Migrate", "Validate", "Cut over"),
        ("Functional", "Integration", "Data reconciliation", "Performance", "Security"),
        ("Platform cost", "Availability", "Processing performance", "Operational effort"),
    ),
    _definition(
        ModernizationStrategy.REFACTOR,
        "Restructure code, data, or architecture to remove material constraints while preserving business capability.",
        ("Capability is strategically important", "Structural technical debt blocks required change", "Investment is justified"),
        ("High business value", "End-of-support runtime", "High maintainability debt"),
        ("Weak roadmap relevance", "Insufficient test coverage or ownership", "Repurchase is a closer capability fit"),
        ("Architecture and code analysis", "Business roadmap", "API and data dependencies", "Test baseline"),
        ("Scope expansion", "Regression", "Backward incompatibility", "Long delivery cycle"),
        ("Faster change", "Reduced technical debt", "Improved resilience and maintainability"),
        ("Architecture decomposition", "Incremental code and data changes", "Automated tests", "Compatibility"),
        ("Decompose incrementally", "Release behind compatible seams", "Migrate consumers", "Retire old components"),
        ("Automated functional", "API compatibility", "Data", "Security", "Performance"),
        ("Deployment frequency", "Incident rate", "Technical debt", "Time-to-change"),
    ),
    _definition(
        ModernizationStrategy.REPURCHASE,
        "Replace the current asset with a commercial product or SaaS capability and migrate users, data, and integrations.",
        ("Capability is sufficiently commoditized", "A supported product meets required outcomes", "Migration economics are favorable"),
        ("Packaged capability fit", "High licensing or maintenance burden", "Low differentiation"),
        ("Material bespoke differentiation", "Unacceptable vendor lock-in", "Unresolved migration or contract constraints"),
        ("Capability map", "Product evaluation", "Contract and licensing", "Data and integration inventory"),
        ("Capability gap", "Vendor dependency", "Data portability", "Adoption failure"),
        ("Vendor-supported capability", "Reduced custom maintenance", "Faster feature adoption"),
        ("Product selection", "Configuration", "Data/integration migration", "User transition", "Legacy decommissioning"),
        ("Select and contract", "Configure", "Migrate data and integrations", "Transition users", "Decommission"),
        ("Capability acceptance", "Data reconciliation", "Integration", "Security", "User acceptance"),
        ("Licensing cost", "Operational effort", "User adoption", "Time-to-change"),
        aliases=("Replace",),
    ),
)


def canonical_strategy(value: str | ModernizationStrategy) -> ModernizationStrategy:
    """Normalize a strategy without allowing an unrecognized seventh outcome."""

    if isinstance(value, ModernizationStrategy):
        return value
    normalized = str(value).strip().casefold()
    if normalized == "replace":
        return ModernizationStrategy.REPURCHASE
    for strategy in ModernizationStrategy:
        if strategy.value.casefold() == normalized:
            return strategy
    raise ValueError(f"Unknown modernization strategy: {value}")


def strategy_catalogue() -> tuple[StrategyDefinition, ...]:
    return STRATEGY_CATALOGUE


def _bounded(value: float) -> float:
    return round(max(0.0, min(100.0, value)), 1)


def _fit_scores(row: dict[str, object], facts: dict[str, object]) -> dict[ModernizationStrategy, float]:
    business = float(row["business_value"])
    debt = float(row["technical_debt"])
    cloud = float(row["cloud_readiness"])
    complexity = float(row["complexity"])
    risk = float(row["migration_risk"])
    criticality = str(facts.get("criticality", "")).casefold()
    lifecycle = str(facts.get("lifecycle_status", "")).casefold()
    platform_type = str(facts.get("platform_type", "")).casefold()
    data_bonus = 18.0 if platform_type in {"data warehouse", "data lake"} else 0.0
    package_bonus = 24.0 if platform_type in {"business intelligence", "data integration", "erp", "crm"} else 0.0
    return {
        ModernizationStrategy.RETAIN: _bounded((100 - debt) * 0.45 + (100 - risk) * 0.25 + (20 if lifecycle in {"strategic", "vendor supported"} else 0)),
        ModernizationStrategy.RETIRE: _bounded((100 - business) * 0.65 + (25 if criticality == "low" else 0)),
        ModernizationStrategy.REHOST: _bounded(cloud * 0.4 + (100 - complexity) * 0.35 + (100 - debt) * 0.25),
        ModernizationStrategy.REPLATFORM: _bounded(cloud * 0.35 + debt * 0.3 + business * 0.2 + data_bonus),
        ModernizationStrategy.REFACTOR: _bounded(business * 0.35 + debt * 0.35 + complexity * 0.2 + (15 if lifecycle == "end of support" else 0)),
        ModernizationStrategy.REPURCHASE: _bounded(debt * 0.35 + business * 0.15 + (100 - complexity) * 0.15 + package_bonus),
    }


def _selection_reason(strategy: ModernizationStrategy, row: dict[str, object], facts: dict[str, object]) -> str:
    lifecycle = str(facts.get("lifecycle_status", "unknown"))
    platform_type = str(facts.get("platform_type", "unknown"))
    return (
        f"The deterministic assessment selected {strategy.value} from {platform_type} "
        f"and {lifecycle} evidence with business value {float(row['business_value']):.1f}, "
        f"technical debt {float(row['technical_debt']):.1f}, cloud readiness "
        f"{float(row['cloud_readiness']):.1f}, complexity {float(row['complexity']):.1f}, "
        f"and migration risk {float(row['migration_risk']):.1f}."
    )


def _alternative_reason(
    alternative: ModernizationStrategy,
    selected: ModernizationStrategy,
    score: float,
) -> str:
    definition = next(item for item in STRATEGY_CATALOGUE if item.strategy is alternative)
    return (
        f"Not selected: the evidence matched the deterministic {selected.value} rule first. "
        f"{alternative.value} fit was {score:.1f}/100; it would require stronger evidence that "
        f"{definition.eligibility_criteria[0].lower()}."
    )


def _trust_and_confidence(
    quality_results: tuple[EvidenceQualityResult, ...],
) -> tuple[str, float, tuple[str, ...], tuple[str, ...]]:
    if not quality_results:
        return "Blocked", 0.0, ("QUALITY-EVIDENCE-UNAVAILABLE",), ()
    missing = tuple(sorted({item for quality in quality_results for item in quality.missing_requirement_ids}))
    conflicts = tuple(sorted({item for quality in quality_results for item in quality.conflicting_evidence_ids}))
    blocking = any(
        quality.blocking_missing_requirement_ids
        or quality.blocking_stale_evidence_ids
        or quality.blocking_conflicting_evidence_ids
        for quality in quality_results
    )
    base = sum(
        (quality.confidence_score / 100.0) * (quality.completeness_score / 100.0)
        for quality in quality_results
    ) / len(quality_results)
    confidence = round(max(0.0, min(1.0, base - (0.2 if conflicts else 0.0))), 3)
    if blocking:
        trust = "Blocked"
    elif missing or conflicts or any(quality.freshness_status != "Current" for quality in quality_results) or confidence < 0.7:
        trust = "Warning"
    else:
        trust = "Ready"
    return trust, confidence, missing, conflicts


def build_modernization_recommendations(
    assessment_records: Iterable[dict[str, object]],
    snapshot: EvidenceSnapshot,
    run_id: str,
    generated_at: datetime,
    criterion_results: tuple[CriterionResult, ...],
    quality_results: tuple[EvidenceQualityResult, ...],
    findings: tuple[AssessmentFinding, ...],
) -> tuple[ModernizationRecommendation, ...]:
    """Build one recommendation per asset from the existing governed run inputs."""

    recommendations: list[ModernizationRecommendation] = []
    for row in sorted(assessment_records, key=lambda item: str(item["platform_id"])):
        asset_id = str(row["platform_id"])
        records = tuple(record for record in snapshot.records if record.asset_id == asset_id)
        portfolio_record = next((record for record in records if record.evidence_category == "portfolio_inventory"), None)
        if portfolio_record is None:
            raise ValueError(f"Recommendation requires portfolio evidence for {asset_id}.")
        selected = canonical_strategy(str(row["six_r_recommendation"]))
        asset_quality = tuple(item for item in quality_results if item.asset_id == asset_id)
        trust, confidence, missing, conflicts = _trust_and_confidence(asset_quality)
        scores = _fit_scores(row, portfolio_record.facts)
        alternatives = tuple(
            StrategyAlternative(
                strategy=strategy,
                fit_score=scores[strategy],
                reason_not_selected=_alternative_reason(strategy, selected, scores[strategy]),
            )
            for strategy in sorted(
                (item for item in ModernizationStrategy if item is not selected),
                key=lambda item: (-scores[item], item.value),
            )
        )
        supported_criterion_ids = {
            result.criterion_id
            for result in criterion_results
            if result.asset_id == asset_id and result.supported
        }
        evidence = tuple(
            RecommendationEvidenceReference(
                evidence_id=record.evidence_id,
                evidence_category=record.evidence_category,
                source_type=record.source_type,
                source_reference=record.source_reference,
                provenance=record.provenance,
                confidence=record.confidence,
                content_hash=record.content_hash,
                criterion_ids=tuple(sorted(set(record.criterion_references) & supported_criterion_ids)) or record.criterion_references,
            )
            for record in records
            if set(record.criterion_references) & supported_criterion_ids
        )
        asset_findings = tuple(
            finding for finding in findings if finding.asset_id == asset_id
        )
        high_findings = [
            finding.title
            for finding in asset_findings
            if finding.severity in {"High", "Critical"}
        ]
        finding_ids = tuple(
            sorted(finding.finding_id for finding in asset_findings)
        )
        if not finding_ids:
            raise ValueError(f"Recommendation requires assessment findings for {asset_id}.")
        rationale = _selection_reason(selected, row, portfolio_record.facts)
        if high_findings:
            rationale += " Trust is qualified by: " + "; ".join(sorted(high_findings)) + "."
        hash_payload = {
            "asset_id": asset_id,
            "strategy": selected.value,
            "rationale": rationale,
            "evidence": [item.model_dump(mode="json") for item in evidence],
            "findings": [
                {
                    "criterion_id": finding.criterion_id,
                    "finding_type": finding.finding_type,
                    "classification": finding.classification,
                    "title": finding.title,
                    "severity": finding.severity,
                }
                for finding in sorted(
                    asset_findings,
                    key=lambda item: (
                        item.criterion_id,
                        item.finding_type,
                        item.title,
                    ),
                )
            ],
            "confidence": confidence,
            "trust": trust,
            "alternatives": [item.model_dump(mode="json") for item in alternatives],
            "missing": missing,
            "conflicts": conflicts,
            "version": RECOMMENDATION_VERSION,
        }
        recommendations.append(
            ModernizationRecommendation(
                recommendation_id=(
                    "REC-"
                    + sha256_json([run_id, asset_id, RECOMMENDATION_VERSION])[:24].upper()
                ),
                assessment_run_id=run_id,
                enterprise_id=snapshot.enterprise_id,
                asset_id=asset_id,
                asset_name=str(row["platform_name"]),
                asset_type=str(portfolio_record.facts["platform_type"]),
                recommended_strategy=selected,
                rationale=rationale,
                supporting_evidence=evidence,
                finding_ids=finding_ids,
                confidence=confidence,
                trust_status=trust,
                alternatives=alternatives,
                missing_evidence_requirement_ids=missing,
                conflicting_evidence_ids=conflicts,
                recommendation_timestamp=generated_at,
                recommendation_version=RECOMMENDATION_VERSION,
                engine_version=RECOMMENDATION_ENGINE_VERSION,
                recommendation_hash=sha256_json(hash_payload),
            )
        )
    return tuple(recommendations)


def require_execution_authority(recommendation: ModernizationRecommendation) -> None:
    """Fail closed: Phase A recommendation records never authorize execution."""

    raise ExecutionNotAuthorizedError(
        f"Recommendation {recommendation.recommendation_id} has no execution authority."
    )

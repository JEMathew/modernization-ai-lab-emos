"""Deterministic evidence quality, finding, and assessment-trust evaluation."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from itertools import combinations
from typing import Iterable

from .assessment_models import (
    AssessmentDefinition,
    AssessmentFinding,
    AssessmentTrustSummary,
    CriterionResult,
    EvidenceLink,
    EvidenceQualityResult,
    EvidenceRecord,
    EvidenceRequirement,
    EvidenceSnapshot,
    FindingEvidenceRelationship,
    FreshnessPolicy,
)
from .evidence import sha256_json


FRESHNESS_POLICY_VERSION = "1.0.0"
FINDING_GENERATION_VERSION = "1.0.0"
EVIDENCE_QUALITY_OWNER = "Python deterministic evidence-quality engine"

AUTHORITY_SCORES = {
    "Authoritative": 100.0,
    "Trusted": 80.0,
    "Supporting": 60.0,
    "Unverified": 25.0,
}
FRESHNESS_ORDER = {"Current": 0, "Aging": 1, "Unknown": 2, "Stale": 3}


class EvidenceQualityError(RuntimeError):
    """Controlled deterministic evidence-quality evaluation failure."""


@dataclass(frozen=True)
class EvidenceQualityBundle:
    requirements: tuple[EvidenceRequirement, ...]
    policies: tuple[FreshnessPolicy, ...]
    links: tuple[EvidenceLink, ...]
    quality_results: tuple[EvidenceQualityResult, ...]
    findings: tuple[AssessmentFinding, ...]
    finding_relationships: tuple[FindingEvidenceRelationship, ...]
    trust_summary: AssessmentTrustSummary


def _stable_id(prefix: str, *values: object) -> str:
    digest = sha256_json([str(value) for value in values])[:24].upper()
    return f"{prefix}-{digest}"


def current_freshness_policies() -> tuple[FreshnessPolicy, ...]:
    """Return versioned policies whose ages are evaluated at the run timestamp."""

    return (
        FreshnessPolicy(
            policy_id="FRESHNESS-PORTFOLIO-1",
            name="Portfolio inventory freshness",
            warning_age_days=180,
            stale_age_days=365,
            applies_to_categories=("portfolio_inventory",),
            version=FRESHNESS_POLICY_VERSION,
        ),
        FreshnessPolicy(
            policy_id="FRESHNESS-DECISION-1",
            name="Decision evidence freshness",
            warning_age_days=90,
            stale_age_days=180,
            applies_to_categories=(
                "business_ownership",
                "runtime_lifecycle",
                "cloud_readiness_assessment",
                "ai_readiness_assessment",
                "dependency_inventory",
                "decision_record",
            ),
            version=FRESHNESS_POLICY_VERSION,
        ),
    )


def current_evidence_requirements(
    definition: AssessmentDefinition,
) -> tuple[EvidenceRequirement, ...]:
    """Extend Slice 01 criterion categories with a bounded Apex review profile."""

    requirements: list[EvidenceRequirement] = []
    for criterion in definition.criteria:
        requirements.append(
            EvidenceRequirement(
                requirement_id=f"REQ-V1-{criterion.criterion_id.upper()}-INVENTORY",
                assessment_definition_id=definition.definition_id,
                assessment_definition_version=definition.version,
                criterion_id=criterion.criterion_id,
                required_evidence_category="portfolio_inventory",
                minimum_count=1,
                freshness_policy_id="FRESHNESS-PORTFOLIO-1",
                minimum_confidence=0.8,
                accepted_source_types=("synthetic_demo_registry",),
                source_authority_requirement="Trusted",
                blocking=True,
                description="A current trusted inventory record must support the calculated criterion.",
            )
        )

    targeted = (
        ("business_value", "business_ownership", "Trusted", 0.8, True, "Current ownership evidence must support the business-value interpretation."),
        ("technical_debt", "runtime_lifecycle", "Trusted", 0.8, True, "Current runtime lifecycle evidence must support the technical-debt interpretation."),
        ("cloud_readiness", "cloud_readiness_assessment", "Trusted", 0.8, True, "A current landing-zone readiness assessment is required before a cloud decision."),
        ("ai_readiness", "ai_readiness_assessment", "Supporting", 0.7, False, "AI-readiness metadata improves confidence but does not own the numeric score."),
        ("complexity", "dependency_inventory", "Authoritative", 0.8, False, "Authoritative dependency evidence supports delivery-complexity review."),
        ("priority_score", "decision_record", "Trusted", 0.8, False, "A decision record is expected before the recommendation is treated as approved."),
    )
    for criterion_id, category, authority, confidence, blocking, description in targeted:
        requirements.append(
            EvidenceRequirement(
                requirement_id=f"REQ-V1-{criterion_id.upper()}-{category.upper()}",
                assessment_definition_id=definition.definition_id,
                assessment_definition_version=definition.version,
                criterion_id=criterion_id,
                required_evidence_category=category,
                minimum_count=1,
                freshness_policy_id="FRESHNESS-DECISION-1",
                minimum_confidence=confidence,
                accepted_source_types=("synthetic_demo_registry",),
                source_authority_requirement=authority,
                blocking=blocking,
                description=description,
                asset_ids=("APX-PLT-001",),
            )
        )
    return tuple(requirements)


def evaluate_freshness(
    evidence: EvidenceRecord,
    policy: FreshnessPolicy | None,
    as_of: datetime,
) -> str:
    """Return a deterministic age band; Unknown never implies current evidence."""

    if policy is None or evidence.evidence_category not in policy.applies_to_categories:
        return "Unknown"
    age_days = (as_of - evidence.effective_at).total_seconds() / 86400
    if age_days < 0:
        return "Unknown"
    if age_days >= policy.stale_age_days:
        return "Stale"
    if age_days >= policy.warning_age_days:
        return "Aging"
    return "Current"


def _periods_overlap(left: EvidenceRecord, right: EvidenceRecord) -> bool:
    left_end = left.effective_until or datetime.max.replace(tzinfo=left.effective_at.tzinfo)
    right_end = right.effective_until or datetime.max.replace(tzinfo=right.effective_at.tzinfo)
    return left.effective_at <= right_end and right.effective_at <= left_end


def detect_bounded_conflicts(
    evidence: Iterable[EvidenceRecord],
) -> tuple[str, ...]:
    """Detect only explicit, overlapping, normalized assertion disagreements."""

    records = tuple(evidence)
    conflicting: set[str] = set()
    for left, right in combinations(records, 2):
        if not left.normalized_subject or not right.normalized_subject:
            continue
        same_target = (
            left.normalized_subject.casefold() == right.normalized_subject.casefold()
            and left.normalized_attribute
            and right.normalized_attribute
            and left.normalized_attribute.casefold() == right.normalized_attribute.casefold()
        )
        if not same_target or not _periods_overlap(left, right):
            continue
        left_value = str(left.normalized_value).strip().casefold()
        right_value = str(right.normalized_value).strip().casefold()
        if left_value != right_value:
            conflicting.update((left.evidence_id, right.evidence_id))
    return tuple(sorted(conflicting))


def _worst_freshness(statuses: Iterable[str]) -> str:
    values = tuple(statuses)
    return max(values, key=lambda item: FRESHNESS_ORDER[item]) if values else "Unknown"


def derive_assessment_trust_status(
    quality_results: Iterable[EvidenceQualityResult],
) -> tuple[str, str]:
    """Apply the documented trust-state precedence without model inference."""

    results = tuple(quality_results)
    if any(item.blocking_conflicting_evidence_ids for item in results):
        return (
            "Blocked",
            "An unresolved conflict affects evidence required for a consequential criterion.",
        )
    if any(
        item.blocking_missing_requirement_ids or item.blocking_stale_evidence_ids
        for item in results
    ):
        return (
            "NeedsEvidence",
            "Blocking evidence is missing or stale and must be remediated before decision review.",
        )
    if any(
        item.completeness_score < 100
        or item.freshness_status != "Current"
        or item.conflict_status != "NoConflict"
        or item.confidence_score < 70
        or item.authority_score < 80
        for item in results
    ):
        return (
            "ReadyWithWarnings",
            "The assessment is reproducible, but non-blocking evidence-quality warnings remain.",
        )
    return (
        "Ready",
        "All evaluated requirements are complete, current, sufficiently confident, and conflict-free.",
    )


def _finding(
    *,
    run_id: str,
    result: CriterionResult,
    dimension: str,
    finding_type: str,
    classification: str,
    title: str,
    description: str,
    severity: str,
    confidence: float,
    remediation: str,
    created_at: datetime,
    assumption: str | None = None,
    identity: object = "",
) -> AssessmentFinding:
    return AssessmentFinding(
        finding_id=_stable_id(
            "FINDING", run_id, result.criterion_result_id, finding_type, identity
        ),
        assessment_run_id=run_id,
        asset_id=result.asset_id,
        dimension_id=dimension.replace(" ", "-").upper(),
        criterion_id=result.criterion_id,
        finding_type=finding_type,
        classification=classification,
        title=title,
        description=description,
        severity=severity,
        confidence=confidence,
        remediation=remediation,
        assumption=assumption,
        generated_by=EVIDENCE_QUALITY_OWNER,
        created_at=created_at,
    )


def _finding_relationship(
    finding: AssessmentFinding,
    result: CriterionResult,
    relationship_type: str,
    *,
    evidence_link_id: str | None = None,
    evidence_id: str | None = None,
    missing_requirement_id: str | None = None,
) -> FindingEvidenceRelationship:
    return FindingEvidenceRelationship(
        relationship_id=_stable_id(
            "FINDREL",
            finding.finding_id,
            relationship_type,
            evidence_link_id or evidence_id or missing_requirement_id or result.criterion_result_id,
        ),
        finding_id=finding.finding_id,
        criterion_result_id=result.criterion_result_id,
        relationship_type=relationship_type,
        evidence_link_id=evidence_link_id,
        evidence_id=evidence_id,
        missing_requirement_id=missing_requirement_id,
    )


def evaluate_evidence_quality(
    run_id: str,
    snapshot: EvidenceSnapshot,
    definition: AssessmentDefinition,
    criterion_results: tuple[CriterionResult, ...],
    as_of: datetime,
) -> EvidenceQualityBundle:
    """Build one immutable evidence-to-finding projection for an assessment run.

    Confidence is the arithmetic mean of preserved evidence confidence values. It is
    an evidence-quality indicator, not a calibrated probability and never changes a
    modernization score.
    """

    requirements = current_evidence_requirements(definition)
    policies = current_freshness_policies()
    policy_by_id = {policy.policy_id: policy for policy in policies}
    criterion_by_id = {criterion.criterion_id: criterion for criterion in definition.criteria}
    evidence_by_id = {record.evidence_id: record for record in snapshot.records}
    requirement_by_id = {item.requirement_id: item for item in requirements}
    links: list[EvidenceLink] = []
    quality_results: list[EvidenceQualityResult] = []
    findings: list[AssessmentFinding] = []
    finding_relationships: list[FindingEvidenceRelationship] = []
    freshness_observations: dict[str, str] = {}

    for result in criterion_results:
        criterion = criterion_by_id[result.criterion_id]
        applicable = tuple(
            requirement
            for requirement in requirements
            if requirement.criterion_id == result.criterion_id
            and (not requirement.asset_ids or result.asset_id in requirement.asset_ids)
        )
        matched_by_requirement: dict[str, tuple[EvidenceRecord, ...]] = {}
        missing: list[str] = []
        linked_records: dict[str, EvidenceRecord] = {}
        for requirement in applicable:
            candidates = tuple(
                record
                for record in snapshot.records
                if record.asset_id == result.asset_id
                and record.evidence_category == requirement.required_evidence_category
                and record.source_type in requirement.accepted_source_types
                and result.criterion_id in record.criterion_references
            )
            matched_by_requirement[requirement.requirement_id] = candidates
            linked_records.update((record.evidence_id, record) for record in candidates)
            eligible = tuple(
                record
                for record in candidates
                if record.confidence >= requirement.minimum_confidence
                and AUTHORITY_SCORES[record.source_authority]
                >= AUTHORITY_SCORES[requirement.source_authority_requirement]
            )
            if len(eligible) < requirement.minimum_count:
                missing.append(requirement.requirement_id)

        conflicts = detect_bounded_conflicts(linked_records.values())
        freshness_by_evidence: dict[str, str] = {}
        for requirement in applicable:
            policy = policy_by_id.get(requirement.freshness_policy_id)
            if policy is None:
                raise EvidenceQualityError(
                    f"Freshness policy {requirement.freshness_policy_id} is unavailable."
                )
            for record in matched_by_requirement[requirement.requirement_id]:
                status = evaluate_freshness(
                    record, policy, as_of
                )
                freshness_by_evidence[record.evidence_id] = status
                previous = freshness_observations.get(record.evidence_id)
                if previous is None or FRESHNESS_ORDER[status] > FRESHNESS_ORDER[previous]:
                    freshness_observations[record.evidence_id] = status

        stale = tuple(
            sorted(
                evidence_id
                for evidence_id, status in freshness_by_evidence.items()
                if status == "Stale"
            )
        )
        for record in sorted(linked_records.values(), key=lambda item: item.evidence_id):
            relationship_type = "Contradicts" if record.evidence_id in conflicts else "Supports"
            links.append(
                EvidenceLink(
                    link_id=_stable_id(
                        "EVLINK", run_id, result.criterion_result_id, record.evidence_id, relationship_type
                    ),
                    assessment_run_id=run_id,
                    criterion_result_id=result.criterion_result_id,
                    evidence_id=record.evidence_id,
                    relationship_type=relationship_type,
                    contribution=-1.0 if relationship_type == "Contradicts" else 1.0,
                    explanation=(
                        "Explicit normalized assertions materially conflict."
                        if relationship_type == "Contradicts"
                        else "Evidence contributes to the criterion review without changing its score."
                    ),
                    created_by=EVIDENCE_QUALITY_OWNER,
                    created_at=as_of,
                )
            )
        for requirement_id in sorted(missing):
            links.append(
                EvidenceLink(
                    link_id=_stable_id(
                        "EVLINK", run_id, result.criterion_result_id, requirement_id, "missing"
                    ),
                    assessment_run_id=run_id,
                    criterion_result_id=result.criterion_result_id,
                    evidence_id=None,
                    relationship_type="RequiredButMissing",
                    contribution=0.0,
                    explanation="The minimum eligible evidence count was not met.",
                    created_by=EVIDENCE_QUALITY_OWNER,
                    created_at=as_of,
                    missing_requirement_id=requirement_id,
                )
            )

        record_values = tuple(linked_records.values())
        completeness = round(
            (len(applicable) - len(missing)) / len(applicable) * 100, 1
        ) if applicable else 100.0
        confidence = round(
            sum(record.confidence for record in record_values) / len(record_values) * 100,
            1,
        ) if record_values else 0.0
        authority = round(
            sum(AUTHORITY_SCORES[record.source_authority] for record in record_values)
            / len(record_values),
            1,
        ) if record_values else 0.0
        quality = EvidenceQualityResult(
            quality_result_id=_stable_id("QUALITY", run_id, result.criterion_result_id),
            assessment_run_id=run_id,
            criterion_result_id=result.criterion_result_id,
            asset_id=result.asset_id,
            criterion_id=result.criterion_id,
            completeness_score=completeness,
            freshness_status=_worst_freshness(freshness_by_evidence.values()),
            confidence_score=confidence,
            authority_score=authority,
            conflict_status="Conflict" if conflicts else "NoConflict",
            missing_requirement_ids=tuple(sorted(missing)),
            stale_evidence_ids=stale,
            conflicting_evidence_ids=conflicts,
            blocking_missing_requirement_ids=tuple(
                sorted(
                    requirement_id
                    for requirement_id in missing
                    if requirement_by_id[requirement_id].blocking
                )
            ),
            blocking_stale_evidence_ids=tuple(
                sorted(
                    evidence_id
                    for requirement in applicable
                    if requirement.blocking
                    for evidence_id in stale
                    if evidence_id
                    in {
                        record.evidence_id
                        for record in matched_by_requirement[requirement.requirement_id]
                    }
                )
            ),
            blocking_conflicting_evidence_ids=tuple(
                sorted(
                    evidence_id
                    for requirement in applicable
                    if requirement.blocking
                    for evidence_id in conflicts
                    if evidence_id
                    in {
                        record.evidence_id
                        for record in matched_by_requirement[requirement.requirement_id]
                    }
                )
            ),
        )
        quality_results.append(quality)

        result_links = [link for link in links if link.criterion_result_id == result.criterion_result_id]
        supporting = [link for link in result_links if link.relationship_type == "Supports"]
        if supporting:
            finding = _finding(
                run_id=run_id,
                result=result,
                dimension=criterion.dimension,
                finding_type="SupportingEvidence",
                classification="Observed",
                title=f"{criterion.dimension} has traceable supporting evidence",
                description=f"{len(supporting)} evidence record(s) support this calculated criterion result.",
                severity="Info",
                confidence=min(1.0, confidence / 100),
                remediation="Retain the immutable evidence links with the assessment run.",
                created_at=as_of,
                identity=tuple(link.evidence_id for link in supporting),
            )
            findings.append(finding)
            for link in supporting:
                finding_relationships.append(
                    _finding_relationship(
                        finding, result, "SupportedBy", evidence_link_id=link.link_id
                    )
                )

        for requirement_id in quality.missing_requirement_ids:
            requirement = requirement_by_id[requirement_id]
            finding = _finding(
                run_id=run_id,
                result=result,
                dimension=criterion.dimension,
                finding_type="MissingEvidence",
                classification="Observed",
                title=f"Required {requirement.required_evidence_category.replace('_', ' ')} evidence is missing",
                description=requirement.description,
                severity="Critical" if requirement.blocking else "Medium",
                confidence=1.0,
                remediation=f"Provide {requirement.minimum_count} eligible {requirement.required_evidence_category.replace('_', ' ')} record(s).",
                created_at=as_of,
                identity=requirement_id,
            )
            findings.append(finding)
            finding_relationships.append(
                _finding_relationship(
                    finding,
                    result,
                    "MissingRequirement",
                    missing_requirement_id=requirement_id,
                )
            )

        for evidence_id in quality.stale_evidence_ids:
            record = evidence_by_id[evidence_id]
            finding = _finding(
                run_id=run_id,
                result=result,
                dimension=criterion.dimension,
                finding_type="StaleEvidence",
                classification="Derived",
                title=f"{record.evidence_category.replace('_', ' ').title()} evidence is stale",
                description=f"Evidence {evidence_id} exceeded its versioned stale-age threshold.",
                severity="High",
                confidence=1.0,
                remediation="Refresh the source evidence and rerun the assessment to create a new immutable snapshot.",
                created_at=as_of,
                identity=evidence_id,
            )
            findings.append(finding)
            finding_relationships.append(
                _finding_relationship(finding, result, "SupportedBy", evidence_id=evidence_id)
            )

        if quality.conflicting_evidence_ids:
            finding = _finding(
                run_id=run_id,
                result=result,
                dimension=criterion.dimension,
                finding_type="ConflictingEvidence",
                classification="Derived",
                title=f"{criterion.dimension} evidence contains an explicit conflict",
                description="Overlapping evidence records assert materially incompatible normalized values for the same subject and attribute.",
                severity="Critical",
                confidence=1.0,
                remediation="Reconcile the source records and capture the accountable resolution as new evidence.",
                created_at=as_of,
                identity=quality.conflicting_evidence_ids,
            )
            findings.append(finding)
            for evidence_id in quality.conflicting_evidence_ids:
                finding_relationships.append(
                    _finding_relationship(
                        finding, result, "ContradictedBy", evidence_id=evidence_id
                    )
                )

        low_confidence = tuple(
            record.evidence_id for record in record_values if record.confidence < 0.7
        )
        for evidence_id in sorted(low_confidence):
            finding = _finding(
                run_id=run_id,
                result=result,
                dimension=criterion.dimension,
                finding_type="LowConfidenceEvidence",
                classification="Observed",
                title="Evidence confidence is below the review threshold",
                description=f"Evidence {evidence_id} preserves a source confidence below 0.70.",
                severity="Medium",
                confidence=1.0,
                remediation="Obtain corroborating evidence from a higher-confidence source.",
                created_at=as_of,
                identity=evidence_id,
            )
            findings.append(finding)
            finding_relationships.append(
                _finding_relationship(finding, result, "SupportedBy", evidence_id=evidence_id)
            )

        low_authority = tuple(
            record.evidence_id
            for record in record_values
            if record.source_authority in {"Supporting", "Unverified"}
        )
        for evidence_id in sorted(low_authority):
            finding = _finding(
                run_id=run_id,
                result=result,
                dimension=criterion.dimension,
                finding_type="LowAuthorityEvidence",
                classification="Observed",
                title="Evidence source authority is limited",
                description=f"Evidence {evidence_id} is classified as {evidence_by_id[evidence_id].source_authority}.",
                severity="Medium",
                confidence=1.0,
                remediation="Confirm the claim with a trusted or authoritative source.",
                created_at=as_of,
                identity=evidence_id,
            )
            findings.append(finding)
            finding_relationships.append(
                _finding_relationship(finding, result, "SupportedBy", evidence_id=evidence_id)
            )

        if (
            quality.completeness_score < 100
            or quality.freshness_status in {"Stale", "Unknown"}
            or quality.conflict_status == "Conflict"
        ):
            finding = _finding(
                run_id=run_id,
                result=result,
                dimension=criterion.dimension,
                finding_type="CriterionRisk",
                classification="Inferred",
                title=f"{criterion.dimension} score is reproducible but evidence-qualified",
                description="The deterministic score remains unchanged; evidence quality limits decision confidence.",
                severity="High" if quality.conflict_status == "Conflict" else "Medium",
                confidence=min(1.0, max(0.5, confidence / 100)),
                remediation="Resolve the listed evidence-quality findings before relying on this criterion for a consequential decision.",
                created_at=as_of,
                identity=quality.quality_result_id,
            )
            findings.append(finding)
            finding_relationships.append(
                _finding_relationship(finding, result, "DerivedFrom")
            )

    trust_status, explanation = derive_assessment_trust_status(quality_results)

    limiting_quality = next(
        (
            item
            for item in quality_results
            if item.conflict_status == "Conflict"
            or item.missing_requirement_ids
            or item.stale_evidence_ids
        ),
        None,
    )
    if limiting_quality is not None:
        limiting_result = next(
            result
            for result in criterion_results
            if result.criterion_result_id == limiting_quality.criterion_result_id
        )
        limiting_dimension = criterion_by_id[limiting_result.criterion_id].dimension
        limitation = _finding(
            run_id=run_id,
            result=limiting_result,
            dimension=limiting_dimension,
            finding_type="AssessmentLimitation",
            classification="Recommended",
            title="Assessment trust limitations require remediation",
            description="The assessment remains reproducible, but its evidence-health rules prevent an unqualified decision recommendation.",
            severity="Critical" if trust_status == "Blocked" else "High",
            confidence=1.0,
            remediation="Resolve blocking conflicts and missing or stale requirements, then create a new immutable assessment run.",
            created_at=as_of,
            identity=trust_status,
        )
        findings.append(limitation)
        finding_relationships.append(
            _finding_relationship(limitation, limiting_result, "DerivedFrom")
        )

    unique_linked = {
        link.evidence_id
        for link in links
        if link.evidence_id is not None
    }
    freshness_states = {
        evidence_id: freshness_observations.get(evidence_id, "Unknown")
        for evidence_id in unique_linked
    }
    current_count = sum(status == "Current" for status in freshness_states.values())
    summary = AssessmentTrustSummary(
        trust_status=trust_status,
        evidence_completeness=round(
            sum(item.completeness_score for item in quality_results)
            / len(quality_results),
            1,
        ),
        current_evidence_percentage=round(
            current_count / len(unique_linked) * 100, 1
        ) if unique_linked else 0.0,
        stale_evidence_count=len(
            {item for quality in quality_results for item in quality.stale_evidence_ids}
        ),
        missing_requirement_count=sum(
            len(quality.missing_requirement_ids) for quality in quality_results
        ),
        conflict_count=sum(
            quality.conflict_status == "Conflict" for quality in quality_results
        ),
        low_confidence_evidence_count=len(
            {
                evidence_id
                for evidence_id in unique_linked
                if evidence_by_id[evidence_id].confidence < 0.7
            }
        ),
        confidence_score=round(
            sum(item.confidence_score for item in quality_results) / len(quality_results),
            1,
        ),
        authority_score=round(
            sum(item.authority_score for item in quality_results) / len(quality_results),
            1,
        ),
        explanation=explanation,
    )

    return EvidenceQualityBundle(
        requirements=requirements,
        policies=policies,
        links=tuple(sorted(links, key=lambda item: item.link_id)),
        quality_results=tuple(
            sorted(quality_results, key=lambda item: item.quality_result_id)
        ),
        findings=tuple(sorted(findings, key=lambda item: item.finding_id)),
        finding_relationships=tuple(
            sorted(finding_relationships, key=lambda item: item.relationship_id)
        ),
        trust_summary=summary,
    )

"""Strict domain models for trusted, reproducible assessment runs."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Literal, Optional, Union

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)


SHA256_PATTERN = r"^[0-9a-f]{64}$"
IDENTIFIER_PATTERN = r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$"


class TrustedAssessmentModel(BaseModel):
    """Immutable, closed model used by the trusted assessment boundary."""

    model_config = ConfigDict(
        extra="forbid", frozen=True, strict=True, str_strip_whitespace=True
    )


class EvidenceRecord(TrustedAssessmentModel):
    evidence_id: str = Field(pattern=IDENTIFIER_PATTERN)
    enterprise_id: str = Field(pattern=IDENTIFIER_PATTERN)
    asset_id: str = Field(pattern=IDENTIFIER_PATTERN)
    evidence_category: str = Field(min_length=1, max_length=128)
    source_type: str = Field(min_length=1, max_length=128)
    source_reference: str = Field(min_length=1, max_length=512)
    captured_at: AwareDatetime
    effective_at: AwareDatetime
    provenance: str = Field(min_length=1, max_length=500)
    confidence: float = Field(ge=0.0, le=1.0)
    source_authority: Literal[
        "Authoritative", "Trusted", "Supporting", "Unverified"
    ] = "Trusted"
    normalized_subject: Optional[str] = Field(
        default=None, min_length=1, max_length=256
    )
    normalized_attribute: Optional[str] = Field(
        default=None, min_length=1, max_length=128
    )
    normalized_value: Optional[Union[str, float, bool]] = None
    effective_until: Optional[AwareDatetime] = None
    content_hash: str = Field(pattern=SHA256_PATTERN)
    criterion_references: tuple[str, ...] = Field(min_length=1)
    facts: dict[str, Any]

    @field_validator("criterion_references")
    @classmethod
    def unique_criterion_references(cls, value: tuple[str, ...]) -> tuple[str, ...]:
        if len(set(value)) != len(value):
            raise ValueError("criterion references must be unique")
        return value

    @model_validator(mode="after")
    def validate_assertion(self) -> "EvidenceRecord":
        assertion_fields = (
            self.normalized_subject,
            self.normalized_attribute,
            self.normalized_value,
        )
        if any(value is not None for value in assertion_fields) and not all(
            value is not None for value in assertion_fields
        ):
            raise ValueError("normalized evidence assertions must be complete")
        if self.effective_until and self.effective_until < self.effective_at:
            raise ValueError("effective-until timestamp cannot precede effective-at")
        return self


class EvidenceSnapshot(TrustedAssessmentModel):
    snapshot_id: str = Field(pattern=IDENTIFIER_PATTERN)
    enterprise_id: str = Field(pattern=IDENTIFIER_PATTERN)
    created_at: AwareDatetime
    snapshot_hash: str = Field(pattern=SHA256_PATTERN)
    records: tuple[EvidenceRecord, ...] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_records(self) -> "EvidenceSnapshot":
        ids = [record.evidence_id for record in self.records]
        if ids != sorted(ids):
            raise ValueError("snapshot records must use canonical evidence-id ordering")
        if len(ids) != len(set(ids)):
            raise ValueError("snapshot evidence identifiers must be unique")
        if any(record.enterprise_id != self.enterprise_id for record in self.records):
            raise ValueError("snapshot evidence must belong to one enterprise")
        return self


class CriterionDefinition(TrustedAssessmentModel):
    criterion_id: str = Field(pattern=IDENTIFIER_PATTERN)
    dimension: str = Field(min_length=1, max_length=128)
    output_field: str = Field(min_length=1, max_length=128)
    formula: str = Field(min_length=1, max_length=1000)
    weight: Optional[float] = Field(default=None, ge=-1.0, le=1.0)
    required_fields: tuple[str, ...] = Field(min_length=1)
    required_evidence_categories: tuple[str, ...] = Field(min_length=1)
    thresholds: dict[str, Union[float, str]] = Field(default_factory=dict)


class AssessmentDefinition(TrustedAssessmentModel):
    definition_id: str = Field(pattern=IDENTIFIER_PATTERN)
    version: str = Field(pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")
    definition_hash: str = Field(pattern=SHA256_PATTERN)
    scoring_owner: str = Field(min_length=1, max_length=256)
    engine_version: str = Field(min_length=1, max_length=64)
    parameters: dict[str, Any]
    decision_rules: dict[str, Any]
    criteria: tuple[CriterionDefinition, ...] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_criteria(self) -> "AssessmentDefinition":
        ids = [criterion.criterion_id for criterion in self.criteria]
        outputs = [criterion.output_field for criterion in self.criteria]
        if len(ids) != len(set(ids)):
            raise ValueError("criterion identifiers must be unique")
        if len(outputs) != len(set(outputs)):
            raise ValueError("criterion output fields must be unique")
        return self


class CriterionResult(TrustedAssessmentModel):
    criterion_result_id: str = Field(pattern=IDENTIFIER_PATTERN)
    asset_id: str = Field(pattern=IDENTIFIER_PATTERN)
    criterion_id: str = Field(pattern=IDENTIFIER_PATTERN)
    value: float
    evidence_ids: tuple[str, ...] = ()
    evidence_status: Literal["supported", "missing"]
    missing_evidence_categories: tuple[str, ...] = ()
    supported: bool

    @model_validator(mode="after")
    def validate_support(self) -> "CriterionResult":
        if self.supported != (self.evidence_status == "supported"):
            raise ValueError("supported flag must agree with evidence status")
        if self.supported and self.missing_evidence_categories:
            raise ValueError("supported results cannot list missing evidence")
        if not self.supported and not self.missing_evidence_categories:
            raise ValueError("missing results must identify missing evidence")
        return self


class EvidenceRequirement(TrustedAssessmentModel):
    requirement_id: str = Field(pattern=IDENTIFIER_PATTERN)
    assessment_definition_id: str = Field(pattern=IDENTIFIER_PATTERN)
    assessment_definition_version: str = Field(pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")
    criterion_id: str = Field(pattern=IDENTIFIER_PATTERN)
    required_evidence_category: str = Field(min_length=1, max_length=128)
    minimum_count: int = Field(ge=1, le=100)
    freshness_policy_id: str = Field(pattern=IDENTIFIER_PATTERN)
    minimum_confidence: float = Field(ge=0.0, le=1.0)
    accepted_source_types: tuple[str, ...] = Field(min_length=1)
    source_authority_requirement: Literal[
        "Authoritative", "Trusted", "Supporting", "Unverified"
    ]
    blocking: bool
    description: str = Field(min_length=1, max_length=500)
    asset_ids: tuple[str, ...] = ()

    @field_validator("accepted_source_types", "asset_ids")
    @classmethod
    def unique_values(cls, value: tuple[str, ...]) -> tuple[str, ...]:
        if len(set(value)) != len(value):
            raise ValueError("requirement values must be unique")
        return value


class FreshnessPolicy(TrustedAssessmentModel):
    policy_id: str = Field(pattern=IDENTIFIER_PATTERN)
    name: str = Field(min_length=1, max_length=128)
    warning_age_days: int = Field(ge=0, le=36500)
    stale_age_days: int = Field(ge=1, le=36500)
    applies_to_categories: tuple[str, ...] = Field(min_length=1)
    version: str = Field(pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")

    @model_validator(mode="after")
    def validate_age_bounds(self) -> "FreshnessPolicy":
        if self.warning_age_days >= self.stale_age_days:
            raise ValueError("warning age must be less than stale age")
        if len(set(self.applies_to_categories)) != len(self.applies_to_categories):
            raise ValueError("freshness categories must be unique")
        return self


class EvidenceLink(TrustedAssessmentModel):
    link_id: str = Field(pattern=IDENTIFIER_PATTERN)
    assessment_run_id: str = Field(pattern=IDENTIFIER_PATTERN)
    criterion_result_id: str = Field(pattern=IDENTIFIER_PATTERN)
    evidence_id: Optional[str] = Field(default=None, pattern=IDENTIFIER_PATTERN)
    relationship_type: Literal[
        "Supports", "Contradicts", "Contextualizes", "RequiredButMissing"
    ]
    contribution: float = Field(ge=-1.0, le=1.0)
    explanation: str = Field(min_length=1, max_length=500)
    created_by: str = Field(min_length=1, max_length=128)
    created_at: AwareDatetime
    missing_requirement_id: Optional[str] = Field(
        default=None, pattern=IDENTIFIER_PATTERN
    )

    @model_validator(mode="after")
    def validate_target(self) -> "EvidenceLink":
        if self.relationship_type == "RequiredButMissing":
            if self.evidence_id is not None or self.missing_requirement_id is None:
                raise ValueError("missing links must target one evidence requirement")
        elif self.evidence_id is None or self.missing_requirement_id is not None:
            raise ValueError("evidence links must target one evidence record")
        return self


class EvidenceQualityResult(TrustedAssessmentModel):
    quality_result_id: str = Field(pattern=IDENTIFIER_PATTERN)
    assessment_run_id: str = Field(pattern=IDENTIFIER_PATTERN)
    criterion_result_id: str = Field(pattern=IDENTIFIER_PATTERN)
    asset_id: str = Field(pattern=IDENTIFIER_PATTERN)
    criterion_id: str = Field(pattern=IDENTIFIER_PATTERN)
    completeness_score: float = Field(ge=0.0, le=100.0)
    freshness_status: Literal["Current", "Aging", "Stale", "Unknown"]
    confidence_score: float = Field(ge=0.0, le=100.0)
    authority_score: float = Field(ge=0.0, le=100.0)
    conflict_status: Literal["NoConflict", "Conflict", "Unknown"]
    missing_requirement_ids: tuple[str, ...] = ()
    stale_evidence_ids: tuple[str, ...] = ()
    conflicting_evidence_ids: tuple[str, ...] = ()
    blocking_missing_requirement_ids: tuple[str, ...] = ()
    blocking_stale_evidence_ids: tuple[str, ...] = ()
    blocking_conflicting_evidence_ids: tuple[str, ...] = ()


class AssessmentFinding(TrustedAssessmentModel):
    finding_id: str = Field(pattern=IDENTIFIER_PATTERN)
    assessment_run_id: str = Field(pattern=IDENTIFIER_PATTERN)
    asset_id: str = Field(pattern=IDENTIFIER_PATTERN)
    dimension_id: str = Field(pattern=IDENTIFIER_PATTERN)
    criterion_id: str = Field(pattern=IDENTIFIER_PATTERN)
    finding_type: Literal[
        "SupportingEvidence",
        "MissingEvidence",
        "StaleEvidence",
        "ConflictingEvidence",
        "LowConfidenceEvidence",
        "LowAuthorityEvidence",
        "CriterionRisk",
        "AssessmentLimitation",
    ]
    classification: Literal[
        "Observed", "Derived", "Inferred", "Assumed", "Recommended"
    ]
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=1000)
    severity: Literal["Info", "Low", "Medium", "High", "Critical"]
    confidence: float = Field(ge=0.0, le=1.0)
    remediation: str = Field(min_length=1, max_length=1000)
    assumption: Optional[str] = Field(default=None, min_length=1, max_length=500)
    status: Literal["Open", "Resolved", "Dismissed"] = "Open"
    generated_by: str = Field(min_length=1, max_length=128)
    created_at: AwareDatetime

    @model_validator(mode="after")
    def validate_assumption(self) -> "AssessmentFinding":
        if self.classification == "Assumed" and not self.assumption:
            raise ValueError("assumed findings must state the assumption")
        return self


class FindingEvidenceRelationship(TrustedAssessmentModel):
    relationship_id: str = Field(pattern=IDENTIFIER_PATTERN)
    finding_id: str = Field(pattern=IDENTIFIER_PATTERN)
    criterion_result_id: str = Field(pattern=IDENTIFIER_PATTERN)
    relationship_type: Literal[
        "SupportedBy", "ContradictedBy", "MissingRequirement", "DerivedFrom"
    ]
    evidence_link_id: Optional[str] = Field(default=None, pattern=IDENTIFIER_PATTERN)
    evidence_id: Optional[str] = Field(default=None, pattern=IDENTIFIER_PATTERN)
    missing_requirement_id: Optional[str] = Field(
        default=None, pattern=IDENTIFIER_PATTERN
    )

    @model_validator(mode="after")
    def validate_relationship_target(self) -> "FindingEvidenceRelationship":
        targets = (
            self.evidence_link_id,
            self.evidence_id,
            self.missing_requirement_id,
        )
        if sum(value is not None for value in targets) > 1:
            raise ValueError("finding relationships may have only one external target")
        return self


class AssessmentTrustSummary(TrustedAssessmentModel):
    trust_status: Literal["Ready", "ReadyWithWarnings", "NeedsEvidence", "Blocked"]
    evidence_completeness: float = Field(ge=0.0, le=100.0)
    current_evidence_percentage: float = Field(ge=0.0, le=100.0)
    stale_evidence_count: int = Field(ge=0)
    missing_requirement_count: int = Field(ge=0)
    conflict_count: int = Field(ge=0)
    low_confidence_evidence_count: int = Field(ge=0)
    confidence_score: float = Field(ge=0.0, le=100.0)
    authority_score: float = Field(ge=0.0, le=100.0)
    explanation: str = Field(min_length=1, max_length=1000)


class ModernizationStrategy(str, Enum):
    """Canonical strategy identifiers; Replace is an input compatibility alias."""

    RETAIN = "Retain"
    RETIRE = "Retire"
    REHOST = "Rehost"
    REPLATFORM = "Replatform"
    REFACTOR = "Refactor"
    REPURCHASE = "Repurchase"


class StrategyDefinition(TrustedAssessmentModel):
    strategy_id: str = Field(pattern=IDENTIFIER_PATTERN)
    strategy: ModernizationStrategy
    name: str = Field(min_length=1, max_length=128)
    definition: str = Field(min_length=1, max_length=1000)
    eligibility_criteria: tuple[str, ...] = Field(min_length=1)
    positive_signals: tuple[str, ...] = Field(min_length=1)
    negative_signals: tuple[str, ...] = Field(min_length=1)
    required_evidence: tuple[str, ...] = Field(min_length=1)
    typical_risks: tuple[str, ...] = Field(min_length=1)
    expected_benefits: tuple[str, ...] = Field(min_length=1)
    planning_requirements: tuple[str, ...] = Field(min_length=1)
    execution_pattern: tuple[str, ...] = Field(min_length=1)
    validation_requirements: tuple[str, ...] = Field(min_length=1)
    expected_outcome_categories: tuple[str, ...] = Field(min_length=1)
    aliases: tuple[str, ...] = ()
    version: str = Field(pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")


class RecommendationEvidenceReference(TrustedAssessmentModel):
    evidence_id: str = Field(pattern=IDENTIFIER_PATTERN)
    evidence_category: str = Field(min_length=1, max_length=128)
    source_type: str = Field(min_length=1, max_length=128)
    source_reference: str = Field(min_length=1, max_length=512)
    provenance: str = Field(min_length=1, max_length=500)
    confidence: float = Field(ge=0.0, le=1.0)
    content_hash: str = Field(pattern=SHA256_PATTERN)
    criterion_ids: tuple[str, ...] = Field(min_length=1)


class StrategyAlternative(TrustedAssessmentModel):
    strategy: ModernizationStrategy
    fit_score: float = Field(ge=0.0, le=100.0)
    reason_not_selected: str = Field(min_length=1, max_length=1000)


class ModernizationRecommendation(TrustedAssessmentModel):
    recommendation_id: str = Field(pattern=IDENTIFIER_PATTERN)
    assessment_run_id: str = Field(pattern=IDENTIFIER_PATTERN)
    enterprise_id: str = Field(pattern=IDENTIFIER_PATTERN)
    asset_id: str = Field(pattern=IDENTIFIER_PATTERN)
    asset_name: str = Field(min_length=1, max_length=256)
    asset_type: str = Field(min_length=1, max_length=128)
    recommended_strategy: ModernizationStrategy
    rationale: str = Field(min_length=1, max_length=2000)
    supporting_evidence: tuple[RecommendationEvidenceReference, ...] = Field(
        min_length=1
    )
    finding_ids: tuple[str, ...] = Field(min_length=1)
    confidence: float = Field(ge=0.0, le=1.0)
    trust_status: Literal["Ready", "Warning", "Blocked"]
    alternatives: tuple[StrategyAlternative, ...] = Field(min_length=5, max_length=5)
    missing_evidence_requirement_ids: tuple[str, ...] = ()
    conflicting_evidence_ids: tuple[str, ...] = ()
    recommendation_timestamp: AwareDatetime
    recommendation_version: str = Field(pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")
    engine_version: str = Field(pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")
    recommendation_hash: str = Field(pattern=SHA256_PATTERN)
    status: Literal["Recommended"] = "Recommended"
    authority_scope: Literal["RecommendOnly"] = "RecommendOnly"
    execution_authority: Literal["None"] = "None"

    @model_validator(mode="after")
    def validate_alternatives(self) -> "ModernizationRecommendation":
        strategies = [alternative.strategy for alternative in self.alternatives]
        if self.recommended_strategy in strategies:
            raise ValueError("alternatives cannot repeat the recommended strategy")
        if len(strategies) != len(set(strategies)):
            raise ValueError("alternative strategies must be unique")
        if set(strategies) | {self.recommended_strategy} != set(ModernizationStrategy):
            raise ValueError("recommendation must evaluate all six strategies")
        if len(self.finding_ids) != len(set(self.finding_ids)):
            raise ValueError("recommendation finding identifiers must be unique")
        return self


class AssessmentRun(TrustedAssessmentModel):
    schema_version: Literal["1.0"] = "1.0"
    run_id: str = Field(pattern=IDENTIFIER_PATTERN)
    enterprise_id: str = Field(pattern=IDENTIFIER_PATTERN)
    generated_at: AwareDatetime
    definition_id: str = Field(pattern=IDENTIFIER_PATTERN)
    definition_version: str = Field(pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$")
    definition_hash: str = Field(pattern=SHA256_PATTERN)
    evidence_snapshot_id: str = Field(pattern=IDENTIFIER_PATTERN)
    evidence_snapshot_hash: str = Field(pattern=SHA256_PATTERN)
    evidence_completeness: float = Field(ge=0.0, le=100.0)
    evidence_complete: bool
    calculation_owner: str = Field(min_length=1, max_length=256)
    engine_version: str = Field(min_length=1, max_length=64)
    result_hash: str = Field(pattern=SHA256_PATTERN)
    criterion_results: tuple[CriterionResult, ...] = Field(min_length=1)
    evidence_requirements: tuple[EvidenceRequirement, ...] = ()
    freshness_policies: tuple[FreshnessPolicy, ...] = ()
    evidence_links: tuple[EvidenceLink, ...] = ()
    evidence_quality_results: tuple[EvidenceQualityResult, ...] = ()
    findings: tuple[AssessmentFinding, ...] = ()
    finding_evidence_relationships: tuple[FindingEvidenceRelationship, ...] = ()
    evidence_health: Optional[AssessmentTrustSummary] = None
    freshness_policy_version: Optional[str] = Field(
        default=None, pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$"
    )
    finding_generation_version: Optional[str] = Field(
        default=None, pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$"
    )
    modernization_recommendations: tuple[ModernizationRecommendation, ...] = ()
    assessment: tuple[dict[str, Any], ...] = Field(min_length=1)
    artifact_reference: str = Field(min_length=1, max_length=1024)

    @model_validator(mode="after")
    def validate_completeness(self) -> "AssessmentRun":
        expected = all(result.supported for result in self.criterion_results)
        if self.evidence_complete != expected:
            raise ValueError("evidence completeness flag does not match criterion results")
        result_ids = {result.criterion_result_id for result in self.criterion_results}
        if len(result_ids) != len(self.criterion_results):
            raise ValueError("criterion result identifiers must be unique within a run")
        slice_two_present = any(
            (
                self.evidence_requirements,
                self.freshness_policies,
                self.evidence_links,
                self.evidence_quality_results,
                self.findings,
                self.finding_evidence_relationships,
            )
        )
        if slice_two_present and (
            self.evidence_health is None
            or self.freshness_policy_version is None
            or self.finding_generation_version is None
        ):
            raise ValueError("Slice 02 runs require trust and generator versions")
        collections = (
            (self.evidence_links, "link_id"),
            (self.evidence_quality_results, "quality_result_id"),
            (self.findings, "finding_id"),
            (self.finding_evidence_relationships, "relationship_id"),
            (self.evidence_requirements, "requirement_id"),
            (self.freshness_policies, "policy_id"),
        )
        for values, identifier in collections:
            ids = [getattr(value, identifier) for value in values]
            if len(ids) != len(set(ids)):
                raise ValueError(f"{identifier} values must be unique within a run")
        if any(
            link.assessment_run_id != self.run_id
            or link.criterion_result_id not in result_ids
            for link in self.evidence_links
        ):
            raise ValueError("evidence links must belong to this run and its criteria")
        if any(
            quality.assessment_run_id != self.run_id
            or quality.criterion_result_id not in result_ids
            for quality in self.evidence_quality_results
        ):
            raise ValueError("evidence quality must belong to this run and its criteria")
        finding_ids = {finding.finding_id for finding in self.findings}
        if any(
            finding.assessment_run_id != self.run_id
            or f"CR-{finding.asset_id}-{finding.criterion_id}" not in result_ids
            for finding in self.findings
        ):
            raise ValueError("findings must belong to this run and its criteria")
        link_ids = {link.link_id for link in self.evidence_links}
        if any(
            relationship.finding_id not in finding_ids
            or relationship.criterion_result_id not in result_ids
            or (
                relationship.evidence_link_id is not None
                and relationship.evidence_link_id not in link_ids
            )
            for relationship in self.finding_evidence_relationships
        ):
            raise ValueError("finding relationships must resolve within the run")
        recommendation_assets = [
            recommendation.asset_id
            for recommendation in self.modernization_recommendations
        ]
        assessment_assets = {str(row["platform_id"]) for row in self.assessment}
        if len(recommendation_assets) != len(set(recommendation_assets)):
            raise ValueError("recommendations must be unique by asset within a run")
        if any(
            recommendation.assessment_run_id != self.run_id
            or recommendation.enterprise_id != self.enterprise_id
            or recommendation.asset_id not in assessment_assets
            for recommendation in self.modernization_recommendations
        ):
            raise ValueError("recommendations must belong to this run and its assets")
        return self


def utc_now() -> datetime:
    """Provide an aware UTC timestamp behind one testable boundary."""

    from datetime import timezone

    return datetime.now(timezone.utc)

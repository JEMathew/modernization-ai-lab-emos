from pathlib import Path

import pytest
from pydantic import ValidationError

from engine.assessment import current_assessment_definition
from engine.assessment_models import AssessmentDefinition, CriterionDefinition


def test_current_definition_is_stable_and_versioned() -> None:
    first = current_assessment_definition()
    second = current_assessment_definition()

    assert first == second
    assert first.definition_id == "MODERNIZATION-PORTFOLIO-ASSESSMENT"
    assert first.version == "1.0.0"
    assert first.definition_hash == second.definition_hash
    assert len(first.definition_hash) == 64
    assert first.parameters["priority_weights"]["business_value"] == 0.25
    assert first.decision_rules["migration_waves"]["wave_1_minimum_priority"] == 60.0
    assert {criterion.criterion_id for criterion in first.criteria} == {
        "business_value",
        "technical_debt",
        "cloud_readiness",
        "ai_readiness",
        "complexity",
        "migration_risk",
        "operating_cost_pressure",
        "priority_score",
    }


def test_definition_records_current_priority_weights() -> None:
    definition = current_assessment_definition()
    weights = {
        criterion.criterion_id: criterion.weight for criterion in definition.criteria
    }

    assert weights == {
        "business_value": 0.25,
        "technical_debt": 0.15,
        "cloud_readiness": 0.15,
        "ai_readiness": 0.15,
        "complexity": -0.08,
        "migration_risk": -0.07,
        "operating_cost_pressure": 0.15,
        "priority_score": None,
    }


def test_definition_is_strict_and_frozen() -> None:
    definition = current_assessment_definition()

    with pytest.raises(ValidationError, match="frozen"):
        definition.version = "2.0.0"
    with pytest.raises(ValidationError):
        AssessmentDefinition.model_validate(
            {**definition.model_dump(mode="python"), "unknown": "field"}
        )


def test_duplicate_criteria_and_output_fields_are_rejected() -> None:
    definition = current_assessment_definition()
    duplicate = definition.criteria[0]

    with pytest.raises(ValidationError, match="criterion identifiers"):
        AssessmentDefinition.model_validate(
            {
                **definition.model_dump(mode="python"),
                "criteria": (
                    duplicate.model_dump(mode="python"),
                    duplicate.model_dump(mode="python"),
                ),
            }
        )


@pytest.mark.parametrize("version", ["1", "v1.0.0", "1.0", "latest"])
def test_invalid_semantic_versions_are_rejected(version: str) -> None:
    definition = current_assessment_definition()

    with pytest.raises(ValidationError):
        AssessmentDefinition.model_validate(
            {**definition.model_dump(mode="python"), "version": version}
        )


def test_invalid_criterion_weight_is_rejected() -> None:
    criterion = current_assessment_definition().criteria[0]

    with pytest.raises(ValidationError):
        CriterionDefinition.model_validate(
            {**criterion.model_dump(mode="python"), "weight": 1.5}
        )

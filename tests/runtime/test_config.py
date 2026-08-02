"""RS-03 tests for the inert Runtime Spine configuration boundary."""

from __future__ import annotations

from datetime import date

import pytest
from pydantic import ValidationError

from engine.runtime import (
    CONFIG_SCHEMA_VERSION,
    ArtifactAdapter,
    DeploymentEnvironment,
    ExecutionMode,
    QueueAdapter,
    RelationalAdapter,
    RuntimeConfiguration,
    RuntimeConfigurationError,
    load_runtime_configuration,
)


def runtime_local_values() -> dict[str, object]:
    return {
        "execution_mode": "runtime_local",
        "runtime_feature": {
            "enabled": True,
            "owner": "Runtime Engineering",
            "expires_on": "2027-01-31",
            "removal_story": "RS-04 compatibility adapter rollout",
        },
    }


def test_default_configuration_preserves_disabled_legacy_local_execution() -> None:
    first = load_runtime_configuration()
    second = load_runtime_configuration()

    assert first == second
    assert first.schema_version == CONFIG_SCHEMA_VERSION
    assert first.environment is DeploymentEnvironment.LOCAL
    assert first.execution_mode is ExecutionMode.LEGACY_LOCAL
    assert first.relational_adapter is RelationalAdapter.NONE
    assert first.queue_adapter is QueueAdapter.NONE
    assert first.artifact_adapter is ArtifactAdapter.LOCAL_FILESYSTEM
    assert first.database_reference is None
    assert first.queue_reference is None
    assert first.runtime_feature.enabled is False
    assert first.model_dump(mode="json") == second.model_dump(mode="json")


def test_runtime_local_requires_explicit_owned_flag_and_uses_local_references() -> None:
    configuration = load_runtime_configuration(runtime_local_values())

    assert configuration.execution_mode is ExecutionMode.RUNTIME_LOCAL
    assert configuration.relational_adapter is RelationalAdapter.SQLITE
    assert configuration.queue_adapter is QueueAdapter.IN_PROCESS
    assert configuration.database_reference is not None
    assert str(configuration.database_reference.reference).startswith("sqlite://")
    assert configuration.queue_reference is not None
    assert str(configuration.queue_reference.reference).startswith("queue://")
    assert configuration.runtime_feature.enabled is True
    assert configuration.runtime_feature.owner == "Runtime Engineering"
    assert configuration.runtime_feature.expires_on == date(2027, 1, 31)
    assert configuration.runtime_feature.removal_story.startswith("RS-04")


def test_runtime_configuration_is_immutable_and_rejects_unknown_fields() -> None:
    configuration = load_runtime_configuration()

    with pytest.raises(ValidationError, match="Instance is frozen"):
        configuration.execution_mode = ExecutionMode.RUNTIME_LOCAL
    with pytest.raises(ValidationError, match="Instance is frozen"):
        configuration.limits.worker_concurrency = 2
    with pytest.raises(RuntimeConfigurationError) as error:
        load_runtime_configuration({"unsupported_setting": True})

    assert error.value.code == "invalid_runtime_configuration"
    assert str(error.value) == "Runtime Spine configuration is invalid."


@pytest.mark.parametrize(
    "values",
    (
        {"execution_mode": "unknown"},
        {"execution_mode": "runtime_local"},
        {
            "execution_mode": "legacy_local",
            "runtime_feature": {
                "enabled": True,
                "owner": "Runtime Engineering",
                "expires_on": "2027-01-31",
                "removal_story": "RS-04",
            },
        },
        {
            "execution_mode": "runtime_local",
            "runtime_feature": {
                "enabled": True,
                "owner": "Runtime Engineering",
                "removal_story": "RS-04",
            },
        },
    ),
)
def test_unsafe_mode_and_flag_combinations_fail_with_safe_error(
    values: dict[str, object],
) -> None:
    with pytest.raises(RuntimeConfigurationError) as error:
        load_runtime_configuration(values)

    assert str(error.value) == "Runtime Spine configuration is invalid."
    assert repr(values) not in str(error.value)


def test_production_activation_fails_closed_in_rs03() -> None:
    values = {
        **runtime_local_values(),
        "environment": "production",
        "relational_adapter": "managed_relational",
        "queue_adapter": "managed_queue",
        "artifact_adapter": "managed_object_storage",
        "database_reference": {"reference": "database://managed/runtime"},
        "queue_reference": {"reference": "queue://managed/runtime"},
        "artifact_reference": {"reference": "artifact://managed/runtime"},
    }

    with pytest.raises(RuntimeConfigurationError, match="configuration is invalid"):
        load_runtime_configuration(values)


@pytest.mark.parametrize(
    ("field", "value"),
    (
        ("lease_seconds", 4),
        ("lease_seconds", 901),
        ("max_retry_attempts", -1),
        ("max_retry_attempts", 11),
        ("worker_concurrency", 0),
        ("worker_concurrency", 33),
        ("command_timeout_seconds", 0),
        ("task_timeout_seconds", 3601),
    ),
)
def test_runtime_bounds_reject_invalid_values(field: str, value: int) -> None:
    with pytest.raises(RuntimeConfigurationError):
        load_runtime_configuration({"limits": {field: value}})


@pytest.mark.parametrize(
    "secret_value",
    (
        "api_" + "key=synthetic-value",
        "pass" + "word: synthetic-value",
        "client_" + "secret=synthetic-value",
        "access_" + "token=synthetic-value",
        "sk-" + "1234567890abcdef",
    ),
)
def test_secret_looking_serializable_values_are_rejected(
    secret_value: str,
) -> None:
    with pytest.raises(RuntimeConfigurationError) as error:
        load_runtime_configuration(
            {
                "runtime_feature": {
                    "enabled": False,
                    "owner": secret_value,
                    "removal_story": "RS-04",
                }
            }
        )

    assert secret_value not in str(error.value)


@pytest.mark.parametrize(
    "reference",
    (
        "sqlite:///tmp/runtime.db",
        "sqlite://user:" + "password@local/runtime",
        "artifact://local/generated-packages?token=value",
        "artifact://local/../private",
        "file:///Users/example/runtime.db",
    ),
)
def test_unsafe_connection_references_are_rejected(reference: str) -> None:
    with pytest.raises(RuntimeConfigurationError):
        load_runtime_configuration(
            {
                **runtime_local_values(),
                "database_reference": {"reference": reference},
            }
        )


def test_direct_configuration_requires_explicit_schema_version() -> None:
    payload = load_runtime_configuration().model_dump(mode="python")
    payload.pop("schema_version")

    with pytest.raises(ValidationError, match="schema_version"):
        RuntimeConfiguration.model_validate(payload)


def test_configuration_serialization_contains_no_secret_or_provider_fields() -> None:
    serialized = load_runtime_configuration(runtime_local_values()).model_dump_json()
    lowered = serialized.casefold()

    assert "password" not in lowered
    assert "api_key" not in lowered
    assert "secret" not in lowered
    assert "aws" not in lowered
    assert "azure" not in lowered
    assert "google" not in lowered

"""Typed, inert configuration for the future Runtime Spine.

RS-03 defines configuration only. Loading this module does not select a runtime,
open a connection, initialize an adapter, or change the existing workflow.
"""

from __future__ import annotations

from datetime import date
from enum import Enum
import re
from typing import Annotated, Any, Literal, Mapping, Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StrictInt,
    ValidationError,
    model_validator,
)

from .contracts import ResourceReference


CONFIG_SCHEMA_VERSION = "1.0"


class DeploymentEnvironment(str, Enum):
    """Deployment boundary understood by the RS-03 configuration contract."""

    LOCAL = "local"
    TEST = "test"
    PRODUCTION = "production"


class ExecutionMode(str, Enum):
    """Approved incremental execution modes."""

    LEGACY_LOCAL = "legacy_local"
    RUNTIME_LOCAL = "runtime_local"


class RelationalAdapter(str, Enum):
    """Provider-neutral relational adapter selections."""

    NONE = "none"
    SQLITE = "sqlite"
    MANAGED_RELATIONAL = "managed_relational"


class QueueAdapter(str, Enum):
    """Provider-neutral queue adapter selections."""

    NONE = "none"
    IN_PROCESS = "in_process"
    MANAGED_QUEUE = "managed_queue"


class ArtifactAdapter(str, Enum):
    """Provider-neutral artifact adapter selections."""

    LOCAL_FILESYSTEM = "local_filesystem"
    MANAGED_OBJECT_STORAGE = "managed_object_storage"


class RuntimeConfigurationError(ValueError):
    """Caller-safe startup failure that never includes supplied configuration."""

    code = "invalid_runtime_configuration"


class ConfigurationModel(BaseModel):
    """Strict immutable base for serializable runtime configuration."""

    model_config = ConfigDict(
        extra="forbid",
        frozen=True,
        str_strip_whitespace=True,
    )


class RuntimeFeatureFlag(ConfigurationModel):
    """Owned rollout flag for the future runtime compatibility seam."""

    enabled: bool = False
    owner: str = Field(default="Runtime Engineering", min_length=1, max_length=128)
    expires_on: Optional[date] = None
    removal_story: str = Field(
        default="RS-04 compatibility adapter rollout",
        min_length=1,
        max_length=128,
    )

    @model_validator(mode="after")
    def require_expiry_when_enabled(self) -> "RuntimeFeatureFlag":
        if self.enabled and self.expires_on is None:
            raise ValueError("enabled runtime feature flag requires expires_on")
        return self


class RuntimeLimits(ConfigurationModel):
    """Conservative local bounds; enforcement belongs to later runtime slices."""

    lease_seconds: Annotated[StrictInt, Field(ge=5, le=900)] = 60
    max_retry_attempts: Annotated[StrictInt, Field(ge=0, le=10)] = 3
    worker_concurrency: Annotated[StrictInt, Field(ge=1, le=32)] = 1
    command_timeout_seconds: Annotated[StrictInt, Field(ge=1, le=300)] = 30
    task_timeout_seconds: Annotated[StrictInt, Field(ge=1, le=3600)] = 300


_SECRET_VALUE_PATTERN = re.compile(
    r"(?i)(?:^|[^a-z0-9])(?:"
    r"sk-[a-z0-9_-]{8,}|"
    r"(?:api[_-]?key|password|client[_-]?secret|access[_-]?token)"
    r"\s*[:=]\s*\S+"
    r")"
)


def _contains_secret_looking_value(value: Any) -> bool:
    if isinstance(value, str):
        return bool(_SECRET_VALUE_PATTERN.search(value))
    if isinstance(value, Mapping):
        return any(_contains_secret_looking_value(item) for item in value.values())
    if isinstance(value, (list, tuple, set, frozenset)):
        return any(_contains_secret_looking_value(item) for item in value)
    return False


class RuntimeConfiguration(ConfigurationModel):
    """Validated configuration boundary for RS-03.

    The two local modes are intentionally exact:

    - ``legacy_local`` preserves the current deterministic workflow and does not
      select runtime persistence or queue adapters.
    - ``runtime_local`` selects only deterministic local adapter names and
      references, but RS-03 does not instantiate those future adapters.

    Production activation and managed adapters remain unavailable until their
    separately approved implementation slices.
    """

    schema_version: Literal["1.0"]
    environment: DeploymentEnvironment
    execution_mode: ExecutionMode
    relational_adapter: RelationalAdapter
    queue_adapter: QueueAdapter
    artifact_adapter: ArtifactAdapter
    database_reference: Optional[ResourceReference] = None
    queue_reference: Optional[ResourceReference] = None
    artifact_reference: ResourceReference
    limits: RuntimeLimits = Field(default_factory=RuntimeLimits)
    runtime_feature: RuntimeFeatureFlag = Field(default_factory=RuntimeFeatureFlag)

    @model_validator(mode="after")
    def validate_supported_configuration(self) -> "RuntimeConfiguration":
        if self.environment is DeploymentEnvironment.PRODUCTION:
            raise ValueError("production runtime activation is outside RS-03")

        if self.execution_mode is ExecutionMode.LEGACY_LOCAL:
            expected = (
                self.relational_adapter is RelationalAdapter.NONE
                and self.queue_adapter is QueueAdapter.NONE
                and self.artifact_adapter is ArtifactAdapter.LOCAL_FILESYSTEM
                and self.database_reference is None
                and self.queue_reference is None
                and not self.runtime_feature.enabled
            )
            if not expected:
                raise ValueError(
                    "legacy_local requires disabled runtime and legacy adapters"
                )

        if self.execution_mode is ExecutionMode.RUNTIME_LOCAL:
            expected = (
                self.relational_adapter is RelationalAdapter.SQLITE
                and self.queue_adapter is QueueAdapter.IN_PROCESS
                and self.artifact_adapter is ArtifactAdapter.LOCAL_FILESYSTEM
                and self.database_reference is not None
                and self.queue_reference is not None
                and self.runtime_feature.enabled
            )
            if not expected:
                raise ValueError(
                    "runtime_local requires explicit local adapters, references, "
                    "and an enabled owned feature flag"
                )

        if _contains_secret_looking_value(self.model_dump(mode="json")):
            raise ValueError("configuration contains a secret-looking value")
        return self


_COMMON_DEFAULTS: dict[str, Any] = {
    "schema_version": CONFIG_SCHEMA_VERSION,
    "environment": DeploymentEnvironment.LOCAL.value,
    "limits": {},
    "runtime_feature": {},
}

_MODE_DEFAULTS: dict[ExecutionMode, dict[str, Any]] = {
    ExecutionMode.LEGACY_LOCAL: {
        "execution_mode": ExecutionMode.LEGACY_LOCAL.value,
        "relational_adapter": RelationalAdapter.NONE.value,
        "queue_adapter": QueueAdapter.NONE.value,
        "artifact_adapter": ArtifactAdapter.LOCAL_FILESYSTEM.value,
        "database_reference": None,
        "queue_reference": None,
        "artifact_reference": {
            "reference": "artifact://local/generated-packages",
            "media_type": "application/octet-stream",
        },
    },
    ExecutionMode.RUNTIME_LOCAL: {
        "execution_mode": ExecutionMode.RUNTIME_LOCAL.value,
        "relational_adapter": RelationalAdapter.SQLITE.value,
        "queue_adapter": QueueAdapter.IN_PROCESS.value,
        "artifact_adapter": ArtifactAdapter.LOCAL_FILESYSTEM.value,
        "database_reference": {
            "reference": "sqlite://local/runtime-spine",
            "media_type": "application/vnd.sqlite3",
        },
        "queue_reference": {
            "reference": "queue://local/in-process",
            "media_type": "application/json",
        },
        "artifact_reference": {
            "reference": "artifact://local/generated-packages",
            "media_type": "application/octet-stream",
        },
    },
}


def load_runtime_configuration(
    values: Optional[Mapping[str, Any]] = None,
) -> RuntimeConfiguration:
    """Validate trusted startup values without reading environment or secrets.

    The no-argument path deterministically returns the disabled
    ``legacy_local`` configuration. Selecting ``runtime_local`` requires an
    explicit enabled feature flag with owner, expiry, and removal story.
    Invalid input is converted to a bounded caller-safe error.
    """

    supplied = dict(values or {})
    raw_mode = supplied.get("execution_mode", ExecutionMode.LEGACY_LOCAL.value)
    try:
        mode = ExecutionMode(raw_mode)
        candidate = {
            **_COMMON_DEFAULTS,
            **_MODE_DEFAULTS[mode],
            **supplied,
        }
        return RuntimeConfiguration.model_validate(candidate)
    except (TypeError, ValueError, ValidationError):
        raise RuntimeConfigurationError(
            "Runtime Spine configuration is invalid."
        ) from None

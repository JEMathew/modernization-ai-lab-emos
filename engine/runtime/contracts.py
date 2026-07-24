"""Versioned, provider-agnostic contracts for the Runtime Spine boundary.

This module defines data shapes only. It deliberately contains no workflow
transitions, persistence, queue delivery, authorization, or execution logic.
The existing workflow remains the sole behavior owner until a later approved
slice connects it through these contracts.
"""

from __future__ import annotations

from enum import Enum
import re
from typing import (
    Annotated,
    Literal,
    Optional,
    Protocol,
    Tuple,
    Union,
    runtime_checkable,
)

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    RootModel,
    StrictInt,
    field_validator,
    model_validator,
)


class ContractVersion(str, Enum):
    """Runtime contract versions accepted by this application build."""

    V1 = "1.0"


CURRENT_CONTRACT_VERSION = ContractVersion.V1
SUPPORTED_CONTRACT_VERSIONS = frozenset(version.value for version in ContractVersion)


def supports_contract_version(version: str) -> bool:
    """Return whether ``version`` can be parsed by this application build."""

    return version in SUPPORTED_CONTRACT_VERSIONS


class RuntimeIdentifier(RootModel[str]):
    """Base type for non-empty, bounded identifiers crossing the runtime seam."""

    model_config = ConfigDict(frozen=True)

    @field_validator("root")
    @classmethod
    def validate_identifier(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("identifier must not be empty")
        if len(value) > 128:
            raise ValueError("identifier must not exceed 128 characters")
        allowed = set(
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._:-"
        )
        if not value[0].isalnum() or any(
            character not in allowed for character in value
        ):
            raise ValueError(
                "identifier may contain only letters, numbers, '.', '_', ':', and '-'"
            )
        return value

    def __str__(self) -> str:
        return self.root


class TenantId(RuntimeIdentifier):
    """Trusted tenant boundary identifier."""


class SubjectId(RuntimeIdentifier):
    """Human or workload subject identifier."""


class CaseId(RuntimeIdentifier):
    """Modernization case identifier."""


class WorkflowId(RuntimeIdentifier):
    """Logical workflow instance identifier."""


class RunId(RuntimeIdentifier):
    """Workflow execution-run identifier."""


class TaskId(RuntimeIdentifier):
    """Logical task identifier retained across delivery attempts."""


class MessageId(RuntimeIdentifier):
    """Task-message delivery identifier."""


class EventId(RuntimeIdentifier):
    """Domain-event identifier."""


class CorrelationId(RuntimeIdentifier):
    """Identifier joining one logical request across boundaries."""


class CausationId(RuntimeIdentifier):
    """Identifier of the command or event that caused new work."""


class IdempotencyKey(RuntimeIdentifier):
    """Stable logical-operation key; enforcement belongs to a later slice."""


class DnaSnapshotId(RuntimeIdentifier):
    """Immutable Enterprise DNA snapshot reference."""


class EvidenceId(RuntimeIdentifier):
    """Evidence metadata identifier."""


class ArtifactId(RuntimeIdentifier):
    """Artifact metadata identifier."""


class StateVersion(RootModel[StrictInt]):
    """Optimistic workflow aggregate version token."""

    model_config = ConfigDict(frozen=True)

    @field_validator("root")
    @classmethod
    def validate_state_version(cls, value: int) -> int:
        if isinstance(value, bool) or value < 0:
            raise ValueError("state version must be a non-negative integer")
        return value

    def __int__(self) -> int:
        return self.root


class ContractModel(BaseModel):
    """Strict immutable base for every Runtime Spine boundary object."""

    model_config = ConfigDict(
        extra="forbid",
        frozen=True,
        str_strip_whitespace=True,
    )


class TrustedExecutionContext(ContractModel):
    """Identity scope supplied by a future trusted application boundary.

    A trusted producer must derive this context from an authenticated boundary,
    then reject any command/query tenant or subject mismatch before data access.
    RS-02 defines that comparison boundary but does not implement authentication,
    authorization, or mismatch enforcement.
    """

    schema_version: ContractVersion
    tenant_id: TenantId
    subject_id: SubjectId
    correlation_id: CorrelationId


class ResourceReference(ContractModel):
    """Opaque runtime-owned reference used instead of an unrestricted payload.

    Producers must emit a scheme-qualified reference without credentials, query
    parameters, fragments, local filesystem paths, or inline data. Consumers
    must resolve it through an owned resource adapter rather than treating it as
    a directly fetchable URL or path.
    """

    reference: str = Field(min_length=1, max_length=512)
    media_type: Optional[str] = Field(default=None, max_length=128)
    integrity_hash: Optional[str] = Field(default=None, min_length=1, max_length=128)

    @field_validator("reference")
    @classmethod
    def validate_reference(cls, value: str) -> str:
        if not re.fullmatch(
            r"[A-Za-z][A-Za-z0-9+.-]*://[A-Za-z0-9][A-Za-z0-9._:/-]*",
            value,
        ):
            raise ValueError(
                "reference must be a scheme-qualified opaque identifier without "
                "credentials, query parameters, fragments, whitespace, or inline data"
            )
        if any(segment in {".", ".."} for segment in value.split("/")):
            raise ValueError("reference must not contain relative path segments")
        return value


class StartWorkflowPayload(ContractModel):
    """Inputs required to identify the existing workflow definition and facts."""

    definition_name: str = Field(min_length=1, max_length=128)
    definition_version: str = Field(min_length=1, max_length=64)
    dna_snapshot_id: DnaSnapshotId


class ReasonPayload(ContractModel):
    """Optional operator reason for pause or resume commands."""

    reason: Optional[str] = Field(default=None, max_length=500)


class CancelWorkflowPayload(ContractModel):
    """Explicit reason for a cancellation request."""

    reason: str = Field(min_length=1, max_length=500)


class RetryTaskPayload(ContractModel):
    """Logical task selected for an explicit retry request."""

    task_id: TaskId
    reason: Optional[str] = Field(default=None, max_length=500)


class RuntimeCommandBase(ContractModel):
    """Metadata required on every mutating Runtime Spine command."""

    schema_version: ContractVersion
    tenant_id: TenantId
    subject_id: SubjectId
    case_id: CaseId
    workflow_id: WorkflowId
    idempotency_key: IdempotencyKey
    expected_state_version: StateVersion
    correlation_id: CorrelationId
    causation_id: CausationId
    issued_at: AwareDatetime
    deadline: AwareDatetime

    @model_validator(mode="after")
    def validate_deadline(self) -> "RuntimeCommandBase":
        if self.deadline <= self.issued_at:
            raise ValueError("deadline must be later than issued_at")
        return self


class StartWorkflowCommand(RuntimeCommandBase):
    """Request creation of one workflow using the canonical definition."""

    action: Literal["start"] = "start"
    payload: StartWorkflowPayload


class PauseWorkflowCommand(RuntimeCommandBase):
    """Request a safe pause; this contract does not implement pause behavior."""

    action: Literal["pause"] = "pause"
    payload: ReasonPayload = Field(default_factory=ReasonPayload)


class ResumeWorkflowCommand(RuntimeCommandBase):
    """Request resume from a future durable checkpoint."""

    action: Literal["resume"] = "resume"
    payload: ReasonPayload = Field(default_factory=ReasonPayload)


class CancelWorkflowCommand(RuntimeCommandBase):
    """Request a legal terminal cancellation without deleting evidence."""

    action: Literal["cancel"] = "cancel"
    payload: CancelWorkflowPayload


class RetryTaskCommand(RuntimeCommandBase):
    """Request retry of one existing logical task."""

    action: Literal["retry"] = "retry"
    payload: RetryTaskPayload


RuntimeCommand = Union[
    StartWorkflowCommand,
    PauseWorkflowCommand,
    ResumeWorkflowCommand,
    CancelWorkflowCommand,
    RetryTaskCommand,
]


class WorkflowStatusQuery(ContractModel):
    """Read one tenant-scoped authoritative workflow view."""

    schema_version: ContractVersion
    tenant_id: TenantId
    subject_id: SubjectId
    case_id: CaseId
    workflow_id: WorkflowId
    correlation_id: CorrelationId
    requested_at: AwareDatetime


class TransitionRecord(ContractModel):
    """Versioned summary of a committed workflow transition."""

    state_version: StateVersion
    transition: str = Field(min_length=1, max_length=128)
    owner: Optional[str] = Field(default=None, max_length=128)
    occurred_at: AwareDatetime


class PendingWorkItem(ContractModel):
    """Bounded work reference exposed by the workflow status query."""

    task_id: TaskId
    task_type: str = Field(min_length=1, max_length=128)
    status: str = Field(min_length=1, max_length=64)


class WorkflowView(ContractModel):
    """Provider-neutral authoritative workflow status response shape.

    ``state`` and stage values are emitted by the canonical workflow adapter;
    this contract intentionally does not define a second transition model.
    """

    schema_version: ContractVersion
    tenant_id: TenantId
    case_id: CaseId
    workflow_id: WorkflowId
    run_id: RunId
    state_version: StateVersion
    definition_name: str = Field(min_length=1, max_length=128)
    definition_version: str = Field(min_length=1, max_length=64)
    state: str = Field(min_length=1, max_length=64)
    current_stage: str = Field(min_length=1, max_length=128)
    current_owner: Optional[str] = Field(default=None, max_length=128)
    current_task: Optional[str] = Field(default=None, max_length=256)
    current_blocker: Optional[str] = Field(default=None, max_length=500)
    next_action: Optional[str] = Field(default=None, max_length=256)
    dna_snapshot_id: DnaSnapshotId
    evidence_ids: Tuple[EvidenceId, ...] = ()
    artifact_ids: Tuple[ArtifactId, ...] = ()
    pending_work: Tuple[PendingWorkItem, ...] = ()
    transition_history: Tuple[TransitionRecord, ...] = ()
    updated_at: AwareDatetime


class SafeErrorCode(str, Enum):
    """Stable, payload-free error classifications for boundary callers."""

    VALIDATION_ERROR = "validation_error"
    UNSUPPORTED_VERSION = "unsupported_version"
    IDENTIFIER_MISMATCH = "identifier_mismatch"
    VERSION_CONFLICT = "version_conflict"
    DEADLINE_EXCEEDED = "deadline_exceeded"
    ILLEGAL_TRANSITION = "illegal_transition"
    NOT_FOUND = "not_found"
    INTERNAL_ERROR = "internal_error"


class SafeError(ContractModel):
    """Structurally bounded caller-safe error.

    Producers must map internal failures to an approved public message. They
    must never copy exception text, stack traces, secrets, resource references,
    or request/enterprise payload content into ``message``.
    """

    code: SafeErrorCode
    message: str = Field(min_length=1, max_length=500)
    retryable: bool = False
    correlation_id: CorrelationId


class CommandAccepted(ContractModel):
    """Typed acknowledgement shape for a successfully accepted command."""

    schema_version: ContractVersion
    outcome: Literal["accepted"] = "accepted"
    workflow_id: WorkflowId
    state_version: StateVersion
    correlation_id: CorrelationId
    accepted_at: AwareDatetime


class CommandRejected(ContractModel):
    """Typed rejection shape that exposes only a safe error."""

    schema_version: ContractVersion
    outcome: Literal["rejected"] = "rejected"
    error: SafeError
    current_state_version: Optional[StateVersion] = None


CommandResult = Union[CommandAccepted, CommandRejected]


class TraceContext(ContractModel):
    """Bounded W3C trace-context fields without diagnostic payload.

    This definition limits shape and size only. A trusted telemetry boundary
    must parse and validate W3C syntax before propagating either field.
    """

    traceparent: Optional[str] = Field(default=None, min_length=1, max_length=128)
    tracestate: Optional[str] = Field(default=None, min_length=1, max_length=512)


class TaskEnvelope(ContractModel):
    """Provider-neutral task envelope; execution is outside RS-02."""

    schema_version: ContractVersion
    message_id: MessageId
    tenant_id: TenantId
    workflow_id: WorkflowId
    run_id: RunId
    task_id: TaskId
    task_type: str = Field(min_length=1, max_length=128)
    attempt: Annotated[StrictInt, Field(ge=1)]
    idempotency_key: IdempotencyKey
    correlation_id: CorrelationId
    causation_id: CausationId
    trace_context: TraceContext = Field(default_factory=TraceContext)
    deadline: AwareDatetime
    input_reference: ResourceReference


class EventEnvelope(ContractModel):
    """Versioned domain-event envelope for future outbox/projection adapters."""

    schema_version: ContractVersion
    event_id: EventId
    event_type: str = Field(min_length=1, max_length=128)
    tenant_id: TenantId
    case_id: CaseId
    workflow_id: WorkflowId
    run_id: RunId
    aggregate_version: StateVersion
    correlation_id: CorrelationId
    causation_id: CausationId
    occurred_at: AwareDatetime
    data_reference: Optional[ResourceReference] = None


@runtime_checkable
class RuntimeCommandPort(Protocol):
    """Structural interface for a future command-side runtime adapter."""

    def submit(
        self, context: TrustedExecutionContext, command: RuntimeCommand
    ) -> CommandResult:
        """Validate and submit one typed command."""

        ...


@runtime_checkable
class RuntimeQueryPort(Protocol):
    """Structural interface for a future authoritative query adapter."""

    def get_workflow(
        self, context: TrustedExecutionContext, query: WorkflowStatusQuery
    ) -> WorkflowView:
        """Return one authoritative workflow view."""

        ...

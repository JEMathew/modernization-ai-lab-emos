"""Contract tests for the isolated RS-02 Runtime Spine boundary."""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

import pytest
from pydantic import ValidationError

from engine import run_assessment
from engine.runtime import (
    CURRENT_CONTRACT_VERSION,
    SUPPORTED_CONTRACT_VERSIONS,
    CancelWorkflowCommand,
    CommandAccepted,
    CommandRejected,
    EventEnvelope,
    PauseWorkflowCommand,
    ResourceReference,
    ResumeWorkflowCommand,
    RetryTaskCommand,
    RuntimeCommandPort,
    RuntimeQueryPort,
    SafeError,
    StartWorkflowCommand,
    TaskEnvelope,
    TenantId,
    TrustedExecutionContext,
    WorkflowStatusQuery,
    WorkflowView,
    supports_contract_version,
)


NOW = datetime(2026, 7, 20, 8, 30, tzinfo=timezone.utc)
DEADLINE = NOW + timedelta(minutes=5)


def command_metadata() -> dict[str, object]:
    return {
        "schema_version": "1.0",
        "tenant_id": "tenant-apex",
        "subject_id": "mission-commander-1",
        "case_id": "DR-CIC-001",
        "workflow_id": "workflow-cic-001",
        "idempotency_key": "start:DR-CIC-001:001",
        "expected_state_version": 0,
        "correlation_id": "correlation-001",
        "causation_id": "guided-demo-action-001",
        "issued_at": NOW,
        "deadline": DEADLINE,
    }


def start_command() -> StartWorkflowCommand:
    return StartWorkflowCommand(
        **command_metadata(),
        payload={
            "definition_name": "enterprise-modernization-journey",
            "definition_version": "1.3",
            "dna_snapshot_id": "dna-apex-001",
        },
    )


def resource_reference() -> ResourceReference:
    return ResourceReference(
        reference="artifact://tenant-apex/workflow-cic-001/input-001",
        media_type="application/json",
        integrity_hash="sha256:synthetic",
    )


def task_envelope() -> TaskEnvelope:
    return TaskEnvelope(
        schema_version="1.0",
        message_id="message-001",
        tenant_id="tenant-apex",
        workflow_id="workflow-cic-001",
        run_id="run-cic-001",
        task_id="task-discovery-001",
        task_type="portfolio-discovery",
        attempt=1,
        idempotency_key="task:discovery:001",
        correlation_id="correlation-004",
        causation_id="command-start-001",
        deadline=DEADLINE,
        input_reference=resource_reference(),
    )


def event_envelope() -> EventEnvelope:
    return EventEnvelope(
        schema_version="1.0",
        event_id="event-001",
        event_type="workflow-start-requested",
        tenant_id="tenant-apex",
        case_id="DR-CIC-001",
        workflow_id="workflow-cic-001",
        run_id="run-cic-001",
        aggregate_version=0,
        correlation_id="correlation-004",
        causation_id="command-start-001",
        occurred_at=NOW,
        data_reference=resource_reference(),
    )


def test_current_contract_version_and_identifier_types_are_stable() -> None:
    assert CURRENT_CONTRACT_VERSION.value == "1.0"
    assert SUPPORTED_CONTRACT_VERSIONS == frozenset({"1.0"})
    assert supports_contract_version("1.0") is True
    assert supports_contract_version("2.0") is False
    assert str(TenantId("tenant-apex")) == "tenant-apex"

    with pytest.raises(ValidationError):
        TenantId("  ")
    with pytest.raises(ValidationError):
        TenantId("tenant/apex")
    with pytest.raises(ValidationError):
        StartWorkflowCommand(
            **{**command_metadata(), "expected_state_version": "0"},
            payload={
                "definition_name": "enterprise-modernization-journey",
                "definition_version": "1.3",
                "dna_snapshot_id": "dna-apex-001",
            },
        )


def test_all_approved_command_shapes_validate_without_executing_behavior() -> None:
    common = command_metadata()
    commands = (
        start_command(),
        PauseWorkflowCommand(**common),
        ResumeWorkflowCommand(**common, payload={"reason": "Evidence updated"}),
        CancelWorkflowCommand(**common, payload={"reason": "Commander cancelled"}),
        RetryTaskCommand(
            **common,
            payload={"task_id": "task-discovery-001", "reason": "Transient failure"},
        ),
    )

    assert [command.action for command in commands] == [
        "start",
        "pause",
        "resume",
        "cancel",
        "retry",
    ]
    assert all(
        command.schema_version == CURRENT_CONTRACT_VERSION for command in commands
    )
    assert all(int(command.expected_state_version) == 0 for command in commands)


def test_contract_serialization_is_deterministic_and_provider_neutral() -> None:
    command = start_command()
    first = command.model_dump(mode="json")
    second = command.model_dump(mode="json")

    assert first == second
    assert json.loads(command.model_dump_json()) == first
    assert (
        StartWorkflowCommand.model_validate_json(command.model_dump_json()) == command
    )
    assert first == {
        "schema_version": "1.0",
        "tenant_id": "tenant-apex",
        "subject_id": "mission-commander-1",
        "case_id": "DR-CIC-001",
        "workflow_id": "workflow-cic-001",
        "idempotency_key": "start:DR-CIC-001:001",
        "expected_state_version": 0,
        "correlation_id": "correlation-001",
        "causation_id": "guided-demo-action-001",
        "issued_at": "2026-07-20T08:30:00Z",
        "deadline": "2026-07-20T08:35:00Z",
        "action": "start",
        "payload": {
            "definition_name": "enterprise-modernization-journey",
            "definition_version": "1.3",
            "dna_snapshot_id": "dna-apex-001",
        },
    }
    serialized = command.model_dump_json().casefold()
    assert "aws" not in serialized
    assert "azure" not in serialized
    assert "google" not in serialized


def test_version_is_explicitly_required_at_every_external_boundary() -> None:
    contracts = (
        start_command(),
        TrustedExecutionContext(
            schema_version="1.0",
            tenant_id="tenant-apex",
            subject_id="mission-commander-1",
            correlation_id="correlation-005",
        ),
        WorkflowStatusQuery(
            schema_version="1.0",
            tenant_id="tenant-apex",
            subject_id="mission-commander-1",
            case_id="DR-CIC-001",
            workflow_id="workflow-cic-001",
            correlation_id="correlation-002",
            requested_at=NOW,
        ),
        task_envelope(),
        event_envelope(),
    )

    for contract in contracts:
        payload = contract.model_dump(mode="python")
        assert payload.pop("schema_version") == CURRENT_CONTRACT_VERSION
        with pytest.raises(ValidationError, match="schema_version"):
            type(contract).model_validate(payload)


def test_contract_models_and_nested_payloads_reject_mutation() -> None:
    command = start_command()

    with pytest.raises(ValidationError, match="Instance is frozen"):
        command.subject_id = "different-subject"
    with pytest.raises(ValidationError, match="Instance is frozen"):
        command.payload.definition_name = "different-workflow"
    with pytest.raises(ValidationError, match="Instance is frozen"):
        command.tenant_id.root = "different-tenant"


@pytest.mark.parametrize(
    ("field", "value"),
    (
        ("tenant_id", ""),
        ("schema_version", "2.0"),
        ("expected_state_version", -1),
        ("issued_at", datetime(2026, 7, 20, 8, 30)),
    ),
)
def test_invalid_required_command_metadata_fails_closed(
    field: str, value: object
) -> None:
    data = command_metadata()
    data[field] = value

    with pytest.raises(ValidationError):
        StartWorkflowCommand(
            **data,
            payload={
                "definition_name": "enterprise-modernization-journey",
                "definition_version": "1.3",
                "dna_snapshot_id": "dna-apex-001",
            },
        )


def test_unknown_fields_and_expired_command_shape_are_rejected() -> None:
    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        StartWorkflowCommand(
            **command_metadata(),
            payload={
                "definition_name": "enterprise-modernization-journey",
                "definition_version": "1.3",
                "dna_snapshot_id": "dna-apex-001",
            },
            provider_queue_url="not-a-domain-field",
        )

    missing_tenant = command_metadata()
    missing_tenant.pop("tenant_id")
    with pytest.raises(ValidationError, match="tenant_id"):
        StartWorkflowCommand(
            **missing_tenant,
            payload={
                "definition_name": "enterprise-modernization-journey",
                "definition_version": "1.3",
                "dna_snapshot_id": "dna-apex-001",
            },
        )

    data = command_metadata()
    data["deadline"] = NOW
    with pytest.raises(ValidationError, match="deadline must be later"):
        StartWorkflowCommand(
            **data,
            payload={
                "definition_name": "enterprise-modernization-journey",
                "definition_version": "1.3",
                "dna_snapshot_id": "dna-apex-001",
            },
        )


def test_query_and_workflow_view_share_tenant_case_workflow_and_version() -> None:
    query = WorkflowStatusQuery(
        schema_version="1.0",
        tenant_id="tenant-apex",
        subject_id="mission-commander-1",
        case_id="DR-CIC-001",
        workflow_id="workflow-cic-001",
        correlation_id="correlation-002",
        requested_at=NOW,
    )
    view = WorkflowView(
        schema_version="1.0",
        tenant_id="tenant-apex",
        case_id="DR-CIC-001",
        workflow_id="workflow-cic-001",
        run_id="run-cic-001",
        state_version=3,
        definition_name="enterprise-modernization-journey",
        definition_version="1.3",
        state="active",
        current_stage="Architecture Review",
        current_owner="Chief Architect",
        current_task="Review dependencies",
        current_blocker=None,
        next_action="Complete architecture review",
        dna_snapshot_id="dna-apex-001",
        evidence_ids=("evidence-001",),
        artifact_ids=("artifact-001",),
        pending_work=(
            {
                "task_id": "task-architecture-001",
                "task_type": "architecture-review",
                "status": "pending",
            },
        ),
        transition_history=(
            {
                "state_version": 3,
                "transition": "begin-architecture-review",
                "owner": "Chief Architect",
                "occurred_at": NOW,
            },
        ),
        updated_at=NOW,
    )

    assert query.tenant_id == view.tenant_id
    assert query.case_id == view.case_id
    assert query.workflow_id == view.workflow_id
    assert int(view.state_version) == 3
    assert view.current_owner == "Chief Architect"


def test_safe_errors_and_results_exclude_stack_and_payload_fields() -> None:
    error = SafeError(
        code="identifier_mismatch",
        message="The supplied identifiers do not describe one workflow.",
        correlation_id="correlation-003",
    )
    rejected = CommandRejected(
        schema_version="1.0", error=error, current_state_version=4
    )
    accepted = CommandAccepted(
        schema_version="1.0",
        workflow_id="workflow-cic-001",
        state_version=1,
        correlation_id="correlation-003",
        accepted_at=NOW,
    )

    assert rejected.outcome == "rejected"
    assert int(rejected.current_state_version) == 4
    assert accepted.outcome == "accepted"
    assert set(error.model_dump()) == {"code", "message", "retryable", "correlation_id"}
    assert "stack" not in rejected.model_dump_json().casefold()
    assert "payload" not in rejected.model_dump_json().casefold()

    with pytest.raises(ValidationError):
        SafeError(
            code="internal_error",
            message="Safe failure",
            correlation_id="correlation-003",
            stack_trace="sensitive implementation detail",
        )


def test_task_and_event_envelopes_are_versioned_reference_only_contracts() -> None:
    task = task_envelope()
    event = event_envelope()

    assert task.schema_version == event.schema_version == CURRENT_CONTRACT_VERSION
    assert task.input_reference == event.data_reference
    assert "payload" not in TaskEnvelope.model_json_schema()["properties"]
    assert "provider" not in task.model_dump_json().casefold()


def test_task_and_event_envelopes_reject_unknown_fields() -> None:
    for envelope in (task_envelope(), event_envelope()):
        payload = envelope.model_dump(mode="python")
        payload["provider_queue_url"] = "not-a-domain-field"
        with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
            type(envelope).model_validate(payload)


def test_task_and_event_envelopes_reject_malformed_timestamps() -> None:
    task_payload = task_envelope().model_dump(mode="python")
    task_payload["deadline"] = datetime(2026, 7, 20, 8, 35)
    with pytest.raises(ValidationError, match="timezone"):
        TaskEnvelope.model_validate(task_payload)

    event_payload = event_envelope().model_dump(mode="python")
    event_payload["occurred_at"] = datetime(2026, 7, 20, 8, 30)
    with pytest.raises(ValidationError, match="timezone"):
        EventEnvelope.model_validate(event_payload)


@pytest.mark.parametrize("attempt", (0, -1, True, "1"))
def test_task_envelope_rejects_invalid_attempts(attempt: object) -> None:
    payload = task_envelope().model_dump(mode="python")
    payload["attempt"] = attempt

    with pytest.raises(ValidationError, match="attempt"):
        TaskEnvelope.model_validate(payload)


@pytest.mark.parametrize(
    "reference",
    (
        "",
        "a" * 513,
        "/tmp/runtime-input.json",
        "file:///tmp/runtime-input.json",
        "data:application/json,inline-payload",
        "https://user:secret@example.test/input",
        "artifact://tenant-apex/input?token=secret",
        "artifact://tenant-apex/input#fragment",
        "artifact://tenant-apex/../other-tenant/input",
        "artifact://tenant apex/input",
    ),
)
def test_resource_reference_rejects_oversized_or_unsafe_values(
    reference: str,
) -> None:
    with pytest.raises(ValidationError, match="reference"):
        ResourceReference(reference=reference)


def test_ports_are_structural_and_existing_engine_import_is_preserved() -> None:
    class CommandAdapter:
        def submit(self, context, command):
            raise NotImplementedError

    class QueryAdapter:
        def get_workflow(self, context, query):
            raise NotImplementedError

    context = TrustedExecutionContext(
        schema_version="1.0",
        tenant_id="tenant-apex",
        subject_id="mission-commander-1",
        correlation_id="correlation-005",
    )

    assert isinstance(CommandAdapter(), RuntimeCommandPort)
    assert isinstance(QueryAdapter(), RuntimeQueryPort)
    assert context.tenant_id == start_command().tenant_id
    assert callable(run_assessment)

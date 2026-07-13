# Event Schema

Modernization AI Factory 2D is an event-driven operating system for AI organizations. Nothing in the factory moves because a screen refreshes or because an animation timeline plays. Agents, tasks, artifacts, approvals, constraints, handoffs, retries, failures, successes, and visual timeline changes are all consequences of events.

This document defines the conceptual event model and a JSON Schema for the event envelope and payloads.

## 1. Event Model Principles

1. Events are the source of truth.
   - Every meaningful factory change is emitted as an immutable event.
   - UI state is derived from the event stream.
   - Animations are visual projections of events, not decorative motion.

2. Agents do not silently work.
   - An agent must emit events when it starts, waits, hands off, retries, escalates, succeeds, or fails.
   - Users must be able to inspect what happened, why it happened, and what evidence supports it.

3. Artifacts are first-class citizens.
   - Documents, assessments, implementation packages, approvals, constraints, validation reports, and replans are artifacts.
   - Artifacts move through the factory by event.

4. Human authority is explicit.
   - High-risk actions require approval events.
   - Approval events must reference the decision, evidence, constraints, and approving human role.

5. Replanning is event replay plus new constraints.
   - When budget, downtime, or business priority changes, the system does not restart the entire factory.
   - It reuses prior successful events and reruns only the affected agents or tasks.

6. Confidence is inspectable.
   - Confidence is not just a number.
   - Each confidence value must reference evidence, assumptions, open questions, and escalation triggers.

## 2. Core Event Types

| Domain | Event Type | Purpose |
|---|---|---|
| Agent | `agent.spawned` | A specialist agent appears in the factory. |
| Agent | `agent.ready` | Agent is available to accept work. |
| Agent | `agent.started` | Agent begins work on a task. |
| Agent | `agent.paused` | Agent pauses because of a dependency, approval, or constraint. |
| Agent | `agent.resumed` | Agent resumes work after unblock. |
| Agent | `agent.completed` | Agent completes assigned work. |
| Agent | `agent.failed` | Agent cannot complete work. |
| Task | `task.created` | A unit of work is created. |
| Task | `task.assigned` | Task is assigned to an agent. |
| Task | `task.started` | Task execution begins. |
| Task | `task.blocked` | Task is blocked by missing input, constraint, dependency, or approval. |
| Task | `task.completed` | Task produces expected output. |
| Task | `task.cancelled` | Task is intentionally stopped. |
| Artifact | `artifact.created` | Artifact is created. |
| Artifact | `artifact.updated` | Artifact receives a new version or additional evidence. |
| Artifact | `artifact.validated` | Artifact passes validation. |
| Artifact | `artifact.rejected` | Artifact fails validation or human review. |
| Artifact | `artifact.handoff` | Artifact moves from one agent/station to another. |
| Approval | `approval.requested` | Human approval is requested. |
| Approval | `approval.granted` | Human approves a decision. |
| Approval | `approval.rejected` | Human rejects a decision. |
| Approval | `approval.deferred` | Human delays decision pending more evidence. |
| Constraint | `constraint.created` | New constraint is introduced. |
| Constraint | `constraint.changed` | Existing constraint changes. |
| Constraint | `constraint.violated` | Current plan violates a constraint. |
| Constraint | `constraint.resolved` | Constraint violation is resolved. |
| Timeline | `timeline.marker.created` | A visible milestone is placed on the factory timeline. |
| Timeline | `timeline.phase.changed` | Factory moves from one engagement phase to another. |
| Timeline | `timeline.replay.started` | Prior events are replayed for inspection or replanning. |
| Handoff | `handoff.started` | One agent begins transferring work to another. |
| Handoff | `handoff.accepted` | Receiving agent accepts responsibility. |
| Handoff | `handoff.rejected` | Receiving agent rejects incomplete or invalid work. |
| Retry | `retry.scheduled` | Retry is planned. |
| Retry | `retry.started` | Retry begins. |
| Retry | `retry.exhausted` | Retry budget is exhausted. |
| Failure | `failure.detected` | A failure is detected. |
| Failure | `failure.escalated` | Failure requires higher-level agent or human intervention. |
| Failure | `failure.resolved` | Failure is resolved. |
| Success | `success.recorded` | A successful outcome is recorded and can be reused. |
| Replan | `replan.requested` | New constraint or executive change requires replanning. |
| Replan | `replan.completed` | Factory produces a revised plan. |

## 3. Event Envelope

Every event uses the same envelope. The envelope answers: what happened, when, where, who caused it, what it refers to, and what should change in the factory.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://modernization-ai-factory.local/schemas/factory-event.schema.json",
  "title": "Modernization AI Factory Event",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "event_id",
    "event_type",
    "occurred_at",
    "factory_id",
    "engagement_id",
    "actor",
    "subject",
    "payload",
    "trace"
  ],
  "properties": {
    "event_id": {
      "type": "string",
      "description": "Globally unique event identifier.",
      "pattern": "^evt_[A-Za-z0-9_-]+$"
    },
    "event_type": {
      "type": "string",
      "enum": [
        "agent.spawned",
        "agent.ready",
        "agent.started",
        "agent.paused",
        "agent.resumed",
        "agent.completed",
        "agent.failed",
        "task.created",
        "task.assigned",
        "task.started",
        "task.blocked",
        "task.completed",
        "task.cancelled",
        "artifact.created",
        "artifact.updated",
        "artifact.validated",
        "artifact.rejected",
        "artifact.handoff",
        "approval.requested",
        "approval.granted",
        "approval.rejected",
        "approval.deferred",
        "constraint.created",
        "constraint.changed",
        "constraint.violated",
        "constraint.resolved",
        "timeline.marker.created",
        "timeline.phase.changed",
        "timeline.replay.started",
        "handoff.started",
        "handoff.accepted",
        "handoff.rejected",
        "retry.scheduled",
        "retry.started",
        "retry.exhausted",
        "failure.detected",
        "failure.escalated",
        "failure.resolved",
        "success.recorded",
        "replan.requested",
        "replan.completed"
      ]
    },
    "occurred_at": {
      "type": "string",
      "format": "date-time"
    },
    "factory_id": {
      "type": "string",
      "description": "Factory instance identifier. Example: factory_apex_demo."
    },
    "engagement_id": {
      "type": "string",
      "description": "Engagement run identifier. Example: engagement_apex_oracle_bq."
    },
    "phase": {
      "type": "string",
      "enum": [
        "intake",
        "discovery",
        "assessment",
        "engineering",
        "validation",
        "executive_review",
        "replanning",
        "completed"
      ]
    },
    "actor": {
      "$ref": "#/$defs/actor"
    },
    "subject": {
      "$ref": "#/$defs/subject"
    },
    "payload": {
      "oneOf": [
        { "$ref": "#/$defs/agentPayload" },
        { "$ref": "#/$defs/taskPayload" },
        { "$ref": "#/$defs/artifactPayload" },
        { "$ref": "#/$defs/approvalPayload" },
        { "$ref": "#/$defs/constraintPayload" },
        { "$ref": "#/$defs/timelinePayload" },
        { "$ref": "#/$defs/handoffPayload" },
        { "$ref": "#/$defs/retryPayload" },
        { "$ref": "#/$defs/failurePayload" },
        { "$ref": "#/$defs/successPayload" },
        { "$ref": "#/$defs/replanPayload" }
      ]
    },
    "evidence": {
      "type": "array",
      "description": "Evidence supporting the event.",
      "items": { "$ref": "#/$defs/evidence" },
      "default": []
    },
    "confidence": {
      "$ref": "#/$defs/confidence"
    },
    "ui_projection": {
      "$ref": "#/$defs/uiProjection"
    },
    "trace": {
      "$ref": "#/$defs/trace"
    }
  },
  "$defs": {
    "actor": {
      "type": "object",
      "additionalProperties": false,
      "required": ["actor_type", "actor_id", "display_name"],
      "properties": {
        "actor_type": {
          "type": "string",
          "enum": ["human", "agent", "system"]
        },
        "actor_id": { "type": "string" },
        "display_name": { "type": "string" },
        "role": {
          "type": "string",
          "description": "Examples: CIO, Hermes, Discovery Agent, Assessment Agent, Engineering Agent, Validation Agent, Executive Agent."
        }
      }
    },
    "subject": {
      "type": "object",
      "additionalProperties": false,
      "required": ["subject_type", "subject_id"],
      "properties": {
        "subject_type": {
          "type": "string",
          "enum": ["agent", "task", "artifact", "approval", "constraint", "timeline", "handoff", "retry", "failure", "success", "replan"]
        },
        "subject_id": { "type": "string" },
        "display_name": { "type": "string" },
        "parent_subject_id": { "type": "string" }
      }
    },
    "evidence": {
      "type": "object",
      "additionalProperties": false,
      "required": ["evidence_id", "evidence_type", "summary"],
      "properties": {
        "evidence_id": { "type": "string" },
        "evidence_type": {
          "type": "string",
          "enum": ["file", "artifact", "calculation", "test_result", "human_input", "system_observation", "agent_report", "approval_record"]
        },
        "summary": { "type": "string" },
        "uri": { "type": "string" },
        "hash": { "type": "string" },
        "created_at": { "type": "string", "format": "date-time" }
      }
    },
    "confidence": {
      "type": "object",
      "additionalProperties": false,
      "required": ["score", "basis", "open_questions"],
      "properties": {
        "score": {
          "type": "number",
          "minimum": 0,
          "maximum": 1
        },
        "basis": {
          "type": "array",
          "items": { "type": "string" }
        },
        "open_questions": {
          "type": "array",
          "items": { "type": "string" }
        },
        "escalate_below": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "default": 0.7
        }
      }
    },
    "uiProjection": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "station_id": { "type": "string" },
        "lane_id": { "type": "string" },
        "animation_event": {
          "type": "string",
          "enum": [
            "agent_appears",
            "agent_pulses",
            "agent_waits",
            "agent_moves",
            "artifact_created",
            "artifact_moves",
            "artifact_glows",
            "approval_card_opens",
            "constraint_alarm",
            "timeline_marker_added",
            "handoff_beam",
            "retry_loop",
            "failure_red_state",
            "success_green_state",
            "factory_replans"
          ]
        },
        "camera_target": { "type": "string" },
        "user_message": { "type": "string" },
        "inspectable": { "type": "boolean", "default": true }
      }
    },
    "trace": {
      "type": "object",
      "additionalProperties": false,
      "required": ["correlation_id", "causation_id"],
      "properties": {
        "correlation_id": {
          "type": "string",
          "description": "Groups all events in one end-to-end business flow."
        },
        "causation_id": {
          "type": ["string", "null"],
          "description": "The event_id that directly caused this event. Null for root events."
        },
        "replay_of_event_id": {
          "type": ["string", "null"],
          "description": "References the original event when this event is emitted during replay or replan."
        },
        "idempotency_key": {
          "type": "string",
          "description": "Prevents duplicate side effects from duplicate event delivery."
        }
      }
    },
    "agentPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "agent_id", "agent_role", "state"],
      "properties": {
        "payload_type": { "const": "agent" },
        "agent_id": { "type": "string" },
        "agent_role": {
          "type": "string",
          "enum": ["hermes", "discovery", "assessment", "engineering", "validation", "executive"]
        },
        "mission": { "type": "string" },
        "state": {
          "type": "string",
          "enum": ["not_spawned", "spawning", "ready", "working", "waiting", "blocked", "completed", "failed", "escalated"]
        },
        "current_task_id": { "type": ["string", "null"] },
        "capabilities": { "type": "array", "items": { "type": "string" } }
      }
    },
    "taskPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "task_id", "task_name", "state"],
      "properties": {
        "payload_type": { "const": "task" },
        "task_id": { "type": "string" },
        "task_name": { "type": "string" },
        "assigned_agent_id": { "type": ["string", "null"] },
        "state": {
          "type": "string",
          "enum": ["created", "assigned", "started", "waiting_for_input", "waiting_for_approval", "blocked", "completed", "cancelled", "failed"]
        },
        "inputs": { "type": "array", "items": { "type": "string" } },
        "expected_outputs": { "type": "array", "items": { "type": "string" } },
        "blocking_reason": { "type": ["string", "null"] }
      }
    },
    "artifactPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "artifact_id", "artifact_type", "state"],
      "properties": {
        "payload_type": { "const": "artifact" },
        "artifact_id": { "type": "string" },
        "artifact_type": {
          "type": "string",
          "enum": ["portfolio", "assessment", "six_r", "candidate_selection", "modernization_plan", "engineering_package", "validation_report", "executive_brief", "approval_packet", "replan"]
        },
        "name": { "type": "string" },
        "version": { "type": "integer", "minimum": 1 },
        "state": {
          "type": "string",
          "enum": ["draft", "in_review", "validated", "approved", "rejected", "superseded"]
        },
        "producer_agent_id": { "type": "string" },
        "storage_uri": { "type": "string" },
        "derived_from": { "type": "array", "items": { "type": "string" } }
      }
    },
    "approvalPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "approval_id", "decision", "risk_level", "state"],
      "properties": {
        "payload_type": { "const": "approval" },
        "approval_id": { "type": "string" },
        "decision": { "type": "string" },
        "risk_level": {
          "type": "string",
          "enum": ["low", "medium", "high", "critical"]
        },
        "required_approver_role": { "type": "string" },
        "actual_approver_id": { "type": ["string", "null"] },
        "state": {
          "type": "string",
          "enum": ["requested", "granted", "rejected", "deferred", "expired"]
        },
        "approval_rules": { "type": "array", "items": { "type": "string" } },
        "conditions": { "type": "array", "items": { "type": "string" } }
      }
    },
    "constraintPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "constraint_id", "constraint_type", "value", "state"],
      "properties": {
        "payload_type": { "const": "constraint" },
        "constraint_id": { "type": "string" },
        "constraint_type": {
          "type": "string",
          "enum": ["budget", "downtime", "business_priority", "data_residency", "regulatory", "blackout_window", "human_approval", "technical_dependency"]
        },
        "value": {},
        "previous_value": {},
        "unit": { "type": "string" },
        "state": {
          "type": "string",
          "enum": ["active", "changed", "violated", "resolved", "retired"]
        },
        "impact": { "type": "string" },
        "affected_agents": { "type": "array", "items": { "type": "string" } },
        "affected_tasks": { "type": "array", "items": { "type": "string" } }
      }
    },
    "timelinePayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "timeline_id", "marker_type", "label"],
      "properties": {
        "payload_type": { "const": "timeline" },
        "timeline_id": { "type": "string" },
        "marker_type": {
          "type": "string",
          "enum": ["phase_start", "phase_end", "milestone", "approval_gate", "constraint_change", "replan", "failure", "success"]
        },
        "label": { "type": "string" },
        "position": { "type": "number" },
        "related_event_ids": { "type": "array", "items": { "type": "string" } }
      }
    },
    "handoffPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "handoff_id", "from_agent_id", "to_agent_id", "state"],
      "properties": {
        "payload_type": { "const": "handoff" },
        "handoff_id": { "type": "string" },
        "from_agent_id": { "type": "string" },
        "to_agent_id": { "type": "string" },
        "artifact_ids": { "type": "array", "items": { "type": "string" } },
        "state": {
          "type": "string",
          "enum": ["started", "accepted", "rejected"]
        },
        "acceptance_criteria": { "type": "array", "items": { "type": "string" } },
        "rejection_reason": { "type": ["string", "null"] }
      }
    },
    "retryPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "retry_id", "target_event_id", "attempt", "max_attempts", "state"],
      "properties": {
        "payload_type": { "const": "retry" },
        "retry_id": { "type": "string" },
        "target_event_id": { "type": "string" },
        "attempt": { "type": "integer", "minimum": 1 },
        "max_attempts": { "type": "integer", "minimum": 1 },
        "state": {
          "type": "string",
          "enum": ["scheduled", "started", "succeeded", "exhausted"]
        },
        "retry_reason": { "type": "string" },
        "next_attempt_at": { "type": ["string", "null"], "format": "date-time" }
      }
    },
    "failurePayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "failure_id", "severity", "state", "summary"],
      "properties": {
        "payload_type": { "const": "failure" },
        "failure_id": { "type": "string" },
        "severity": {
          "type": "string",
          "enum": ["minor", "major", "critical"]
        },
        "state": {
          "type": "string",
          "enum": ["detected", "triaged", "escalated", "resolved", "accepted_risk"]
        },
        "summary": { "type": "string" },
        "root_cause": { "type": ["string", "null"] },
        "mitigation": { "type": ["string", "null"] },
        "owner_agent_id": { "type": ["string", "null"] },
        "requires_human": { "type": "boolean" }
      }
    },
    "successPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "success_id", "summary", "reusable"],
      "properties": {
        "payload_type": { "const": "success" },
        "success_id": { "type": "string" },
        "summary": { "type": "string" },
        "artifact_ids": { "type": "array", "items": { "type": "string" } },
        "reusable": { "type": "boolean" },
        "reuse_conditions": { "type": "array", "items": { "type": "string" } }
      }
    },
    "replanPayload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["payload_type", "replan_id", "trigger", "reuse_strategy", "rerun_agents", "state"],
      "properties": {
        "payload_type": { "const": "replan" },
        "replan_id": { "type": "string" },
        "trigger": { "type": "string" },
        "reuse_strategy": { "type": "string" },
        "rerun_agents": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["hermes", "discovery", "assessment", "engineering", "validation", "executive"]
          }
        },
        "reused_artifacts": { "type": "array", "items": { "type": "string" } },
        "superseded_artifacts": { "type": "array", "items": { "type": "string" } },
        "state": {
          "type": "string",
          "enum": ["requested", "analyzing", "rerunning_required_agents", "completed", "blocked", "failed"]
        },
        "recommendation": { "type": "string" }
      }
    }
  }
}
```

## 4. Factory State Machines

### Agent State Machine

```text
not_spawned
  -> spawning
  -> ready
  -> working
  -> waiting
  -> working
  -> completed
```

Failure paths:

```text
working -> blocked -> escalated
working -> failed -> escalated
waiting -> blocked -> escalated
```

### Task State Machine

```text
created
  -> assigned
  -> started
  -> completed
```

Blocking paths:

```text
started -> waiting_for_input -> started
started -> waiting_for_approval -> started
started -> blocked -> cancelled
started -> failed -> retry.scheduled
```

### Artifact State Machine

```text
draft
  -> in_review
  -> validated
  -> approved
```

Revision paths:

```text
in_review -> rejected -> draft
validated -> superseded
approved -> superseded
```

### Approval State Machine

```text
requested
  -> granted
```

Alternative paths:

```text
requested -> rejected
requested -> deferred -> requested
requested -> expired
```

### Constraint State Machine

```text
active
  -> changed
  -> resolved
```

Violation path:

```text
active -> violated -> replan.requested -> resolved
changed -> violated -> replan.requested -> resolved
```

## 5. Required Events by Factory Flow

### Hermes

Hermes is the operating layer. It accepts the engagement, creates the work graph, assigns agents, watches constraints, and requests approvals.

Minimum events:

1. `agent.spawned` for Hermes
2. `task.created` for engagement orchestration
3. `task.assigned` to Hermes
4. `agent.started`
5. `timeline.phase.changed` to discovery
6. `success.recorded` when the engagement operating plan is ready

### Discovery

Discovery turns enterprise inputs into inspectable source artifacts.

Minimum events:

1. `agent.spawned`
2. `task.assigned`
3. `artifact.created` for enterprise profile
4. `artifact.created` for portfolio
5. `artifact.validated` for source data readiness
6. `handoff.started` to Assessment
7. `handoff.accepted` by Assessment

### Assessment

Assessment calculates business value, technical debt, readiness, complexity, risk, priority, and 6R disposition.

Minimum events:

1. `agent.started`
2. `task.started`
3. `artifact.created` for assessment result
4. `artifact.created` for 6R disposition
5. `artifact.created` for candidate selection
6. `artifact.validated` for deterministic scoring evidence
7. `success.recorded` for selected candidate
8. `handoff.started` to Engineering

### Engineering

Engineering produces the implementation package.

Minimum events:

1. `agent.started`
2. `artifact.created` for metadata discovery
3. `artifact.created` for dependency analysis
4. `artifact.created` for architecture
5. `artifact.created` for source-target mapping
6. `artifact.created` for converted SQL and DDL
7. `artifact.created` for ETL translation
8. `artifact.created` for implementation package
9. `handoff.started` to Validation

### Validation

Validation inspects whether the package is complete, consistent, and safe for executive review.

Minimum events:

1. `agent.started`
2. `task.started`
3. `artifact.validated` or `artifact.rejected`
4. `failure.detected` if required evidence is missing
5. `approval.requested` if manual validation is required
6. `success.recorded` when package is review-ready
7. `handoff.started` to Executive

### Executive

Executive prepares decisions, approvals, risks, and replanning logic.

Minimum events:

1. `agent.started`
2. `artifact.created` for executive brief
3. `artifact.created` for risk register
4. `artifact.created` for approval workflow
5. `approval.requested` for high-risk decision
6. `approval.granted`, `approval.rejected`, or `approval.deferred`
7. `timeline.marker.created` for decision point

## 6. Example: Budget and Downtime Change Replan

```json
{
  "event_id": "evt_budget_downtime_change_001",
  "event_type": "constraint.changed",
  "occurred_at": "2026-07-12T10:00:00Z",
  "factory_id": "factory_apex_aerospace",
  "engagement_id": "engagement_oracle_customer_analytics",
  "phase": "replanning",
  "actor": {
    "actor_type": "human",
    "actor_id": "human_cio",
    "display_name": "Apex CIO",
    "role": "CIO"
  },
  "subject": {
    "subject_type": "constraint",
    "subject_id": "constraint_budget_downtime_priority",
    "display_name": "Budget, downtime, and business priority change"
  },
  "payload": {
    "payload_type": "constraint",
    "constraint_id": "constraint_budget_downtime_priority",
    "constraint_type": "budget",
    "previous_value": 8500000,
    "value": 5950000,
    "unit": "USD",
    "state": "changed",
    "impact": "Budget reduced by 30%; downtime reduced from 8 hours to 2 hours; priority changed to cost reduction. Replan required.",
    "affected_agents": ["hermes", "assessment", "validation", "executive"],
    "affected_tasks": ["prioritization", "cutover_strategy", "approval_workflow", "executive_decision"]
  },
  "evidence": [
    {
      "evidence_id": "ev_user_change_request",
      "evidence_type": "human_input",
      "summary": "CIO changed budget, downtime, and business priority."
    }
  ],
  "confidence": {
    "score": 1,
    "basis": ["Direct human executive input"],
    "open_questions": ["Which Oracle workloads are mandatory for cost-reduction Wave 1A?"],
    "escalate_below": 0.7
  },
  "ui_projection": {
    "station_id": "executive_station",
    "lane_id": "constraints_lane",
    "animation_event": "constraint_alarm",
    "camera_target": "factory_timeline",
    "user_message": "The CIO changed constraints. Hermes will replan using completed work.",
    "inspectable": true
  },
  "trace": {
    "correlation_id": "corr_apex_replan_001",
    "causation_id": null,
    "replay_of_event_id": null,
    "idempotency_key": "apex-budget-downtime-priority-20260712"
  }
}
```

## 7. Event-to-Animation Mapping

| Event | Animation |
|---|---|
| `agent.spawned` | Agent appears at its station with a brief glow. |
| `task.assigned` | Task card travels from Hermes to the agent. |
| `agent.started` | Agent station pulses and workbench activates. |
| `artifact.created` | Artifact tile materializes on the agent workbench. |
| `artifact.handoff` | Artifact moves along a visible conveyor to the next station. |
| `approval.requested` | Approval card rises above the factory floor. |
| `constraint.changed` | Constraint alarm highlights affected lanes. |
| `replan.requested` | Camera zooms out; impacted paths are redrawn. |
| `retry.started` | Task card loops back with attempt count visible. |
| `failure.detected` | Station turns red and pauses adjacent dependent lanes. |
| `success.recorded` | Artifact glows green and is pinned to the timeline. |

## 8. Event Retention and Replay

The factory should retain all events required to reconstruct:

- Current agent states
- Current task states
- Artifact versions
- Approval history
- Active constraints
- Timeline milestones
- Handoffs and dependency paths
- Retries and failures
- Successes reusable during replanning

Replay modes:

1. Executive replay
   - Shows only major decisions, approvals, risks, and outputs.

2. Operator replay
   - Shows every agent task, handoff, retry, and validation result.

3. Evidence replay
   - Shows only artifacts, calculations, tests, approvals, and supporting proof.

4. Replanning replay
   - Reuses prior successful outputs and reruns only affected tasks.

## 9. Design Standard

If the factory changes and no event explains why, the product is wrong.

If an animation plays and no event caused it, the product is wrong.

If a human is asked to approve something and cannot inspect the evidence, the product is wrong.

If replanning reruns work that was already proven reusable, the product is wrong.

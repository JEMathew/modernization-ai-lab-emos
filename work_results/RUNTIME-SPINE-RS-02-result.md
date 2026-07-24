# Runtime Spine RS-02 Result

## Outcome

RS-02 introduces the first versioned, provider-agnostic Runtime Spine contract
package. It defines the future boundary among product experiences, Enterprise
DNA, the AI Agency, and a Runtime Engine without connecting that boundary to the
current application.

The existing workflow, state machine, state ownership, Streamlit application,
Mission Control prototype, deterministic calculations, artifacts, and reset
behavior are unchanged. No persistence, checkpoint, queue, worker, execution,
configuration, policy, model routing, trust, security enforcement, or
observability capability was implemented.

## Files Changed

- `engine/runtime/contracts.py`
  - Strict Pydantic contract models, typed identifiers, version tokens, commands,
    query/view shapes, result/error shapes, task/event envelopes, structural
    ports, explicit boundary versions, and safe opaque-reference validation.
- `engine/runtime/__init__.py`
  - Explicit public exports for the isolated Runtime Spine contract package.
- `tests/runtime/__init__.py`
  - Runtime test-package marker.
- `tests/runtime/test_contracts.py`
  - Positive, negative, compatibility, serialization, security-structure, and
    protocol tests.
- `work_results/RUNTIME-SPINE-RS-02-result.md`
  - RS-02 scope, validation, and review evidence.

No existing production, UI, workflow, engine-export, RS-01, or JavaScript file
was modified for RS-02. Pre-existing unrelated repository changes remain
untouched and unstaged.

## Clean-Checkout Dependency Set

RS-01 and RS-02 depend on an existing-product workflow extraction that is not
part of the Runtime Spine contract package. A reproducible checkpoint must
contain two coherent layers:

### Prerequisite existing-product layer

- `app/main.py`
- `engine/__init__.py`
- `engine/agency.py`
- `engine/workflow.py`
- `tests/test_agency.py`
- `tests/test_workflow.py`

These files establish the sole Python workflow owner, its public facade, current
Streamlit integration, compatible agency API, and prerequisite regression tests.
They must be committed as a reviewed prerequisite checkpoint or included in the
same coherent checkpoint before RS-01/RS-02; committing the Runtime Spine files
alone against a revision without `engine/workflow.py` is not reproducible.

### RS-01/RS-02 layer

- `tests/runtime/__init__.py`
- `tests/runtime/test_current_behavior.py`
- `engine/runtime/__init__.py`
- `engine/runtime/contracts.py`
- `tests/runtime/test_contracts.py`
- `work_results/RUNTIME-SPINE-RS-01-result.md`
- `work_results/RUNTIME-SPINE-RS-02-result.md`

Prototype, design, production-readiness, and other work-result changes are not
part of this checkpoint.

## New Contracts

### Version and identifiers

- `ContractVersion` with current/supported version `1.0`; every versioned
  external boundary requires the version explicitly rather than silently
  defaulting omitted input.
- `supports_contract_version` compatibility check.
- Distinct tenant, subject, case, workflow, run, task, message, event,
  correlation, causation, idempotency, Enterprise DNA snapshot, evidence, and
  artifact identifier types.
- Strict non-negative `StateVersion` optimistic-version token.
- `TrustedExecutionContext` for a future trusted tenant/subject boundary.

### Commands and payloads

- `StartWorkflowCommand` / `StartWorkflowPayload`.
- `PauseWorkflowCommand` / `ReasonPayload`.
- `ResumeWorkflowCommand` / `ReasonPayload`.
- `CancelWorkflowCommand` / `CancelWorkflowPayload`.
- `RetryTaskCommand` / `RetryTaskPayload`.
- `RuntimeCommand` union.

Every mutating command contains a schema version, tenant, subject, case,
workflow, idempotency key, expected state version, correlation and causation
identifiers, aware issue/deadline timestamps, and a typed action payload.

### Query, view, results, and envelopes

- `WorkflowStatusQuery`.
- `WorkflowView`, `TransitionRecord`, and `PendingWorkItem`.
- `CommandAccepted`, `CommandRejected`, and `CommandResult`.
- `SafeError` and stable `SafeErrorCode` values.
- `ResourceReference` with a bounded opaque-reference syntax and bounded W3C
  `TraceContext` fields.
- Versioned, reference-only `TaskEnvelope` and `EventEnvelope`.
- Structural `RuntimeCommandPort` and `RuntimeQueryPort` protocols.

The workflow view intentionally accepts canonical state/stage values from the
future compatibility adapter. It does not define legal transitions or create a
second workflow model.

## Existing Contracts Preserved

- `engine.workflow` remains the only Python workflow behavior and current state
  owner.
- Existing `engine` top-level imports and public functions are unchanged.
- Streamlit session-state fields and invalidation/reset behavior are unchanged.
- Python remains the numeric-decision authority.
- Deterministic no-OpenAI fallback and stored artifacts are unchanged.
- Mission Control and Modernization HQ JavaScript state/projections are
  unchanged.
- RS-01 characterization tests are unchanged and passing.

No compatibility adapter was added. The approved plan assigns that integration
to RS-04 after RS-03 configuration exists.

## Tests Added

The RS-02 suite contains 30 collected test cases covering:

1. Current and supported contract versions.
2. Typed identifier validation.
3. Strict state-version validation.
4. All five approved command shapes.
5. Deterministic serialization snapshot for the start command.
6. Provider-neutral serialized contracts.
7. Rejection of unsupported versions, missing/empty tenant, unknown fields,
   invalid deadlines, naive timestamps, and invalid state versions.
8. Tenant/case/workflow/version alignment between query and workflow view.
9. Safe error and accepted/rejected result shapes.
10. Reference-only task/event envelopes.
11. Structural command/query ports with trusted execution context.
12. Backward-compatible access to the existing engine facade.
13. Mutation rejection for boundary models, nested payloads, and identifiers.
14. Missing schema-version rejection across command, trusted-context, query,
    task, and event boundaries.
15. Task/event unknown-field and malformed-timestamp rejection.
16. Invalid task-attempt rejection.
17. Oversized and unsafe resource-reference rejection.

## BDD Coverage

- **BDD-019-001:** start-command, idempotency, workflow ID, state-version, and
  acknowledgement shapes are supported. Durable commit/deduplication remains a
  future slice.
- **BDD-019-005:** expected/current state-version and safe version-conflict shapes
  are supported. Concurrency enforcement remains a future slice.
- **BDD-019-015:** trusted execution context, mandatory tenant propagation, and
  safe identifier-mismatch representation are supported. Authentication,
  authorization, and tenant enforcement remain later approved work.

RS-02 satisfies the contract prerequisites for these BDD scenarios; it does not
claim their future runtime behavior is implemented.

## Evaluation Requirements

- **EVAL-019-001 — Contract correctness:** satisfied for the RS-02 contract
  surface. Supported explicit schemas validate; tested omitted/unsupported
  versions and unknown, missing, malformed, immutable, or unsafe inputs fail
  closed.
- **EVAL-019-009 — Product regression:** Python and all existing standalone
  JavaScript suites pass.
- **EVAL-019-011 — Scope conformance:** only the isolated contract package,
  contract tests, test marker, and this result record changed. No forbidden
  component, dependency, UI behavior, or duplicate state owner was introduced.

State mutation, durable concurrency, cross-tenant enforcement, queue semantics,
and recovery evaluations are not applicable to this definition-only slice.

## Security Review

- Tenant and subject identifiers are required at command/query boundaries.
- A separate trusted execution-context contract makes future identifier mismatch
  comparison explicit; command-provided tenant IDs are not designated trusted.
- Contract models are strict and reject unknown fields.
- Safe errors contain only code, bounded message, retryability, and correlation
  ID; stack traces and request/enterprise payload fields are absent and rejected.
  Producers are explicitly required to map internal failures to approved public
  messages rather than copying exception, secret, reference, or payload content.
- Task/event contracts use bounded opaque references rather than unrestricted
  payloads. References reject credentials, query parameters, fragments, local
  filesystem paths, inline data, whitespace, and relative path segments.
- Trace context is limited to bounded W3C `traceparent`/`tracestate` fields;
  producer documentation requires trusted syntax validation before propagation.
- Trusted-context documentation requires tenant/subject comparison before data
  access; enforcement remains deliberately deferred.
- No provider SDK type, secret, credential, private data, or new dependency was
  introduced.
- This slice defines security structure only; it does not claim authentication,
  authorization, or tenant isolation enforcement.

## Reliability Review

- Commands require an explicit schema version, idempotency key, expected state
  version, correlation, causation, issue time, and deadline.
- Task envelopes require stable logical task ID, delivery message ID, attempt,
  idempotency key, deadline, and reference-only input.
- Events carry aggregate state version and correlation/causation lineage.
- Command rejection can safely report the current state version for a future
  optimistic-concurrency conflict.
- Models reject mutation at their contract boundary and serialize
  deterministically for the tested fixtures.
- No deduplication, retry, checkpoint, recovery, queue, or persistence behavior
  was implemented or implied.

## Validation Commands and Results

- `.venv/bin/python -m pytest -q -p no:cacheprovider`: **80 passed**.
- Contract and RS-01 suites (`tests/runtime/test_contracts.py` and
  `tests/runtime/test_current_behavior.py`):
  **35 passed**.
- Focused RS-01/RS-02 plus workflow and agency suites: **49 passed**.
- RS-02 contract suite: **30 passed**.
- RS-01 characterization tests within the full suite: **5 passed**.
- `node --test prototype/mission-control/tests/enterprise-dna.test.js`: **PASS**.
- Guided discovery action JavaScript suite: **PASS**.
- `node --test prototype/mission-control/tests/portfolio-lab.test.js`: **PASS**.
- `node --test prototype/mission-control/tests/program-intelligence.test.js`: **PASS**.
- `node --test prototype/mission-control/tests/typography-labels.test.js`: **PASS**.
- Python syntax compilation for the coherent Python checkpoint set: **PASS**.
- Trailing-whitespace scan for the proposed checkpoint set: **PASS**.
- Runtime activation scan outside `engine/runtime/`: **PASS**; no application,
  workflow, agency, or engine-facade import activates the package.
- Credential-pattern scan across the proposed checkpoint set: **PASS**.
- Real-browser Guided Demo regression: **PASS**.
  - Run Guided Demo exposed one enabled `Begin Portfolio Discovery` action at
    Step 1 of 9.
  - The action advanced to Step 2 of 9 and `Discovery Complete`.
  - Switching to Modernization HQ retained DR-CIC-001 and guided progress.
  - Full Reset restored Mission Control, Step 1, and Unverified state.
  - Browser console warnings/errors: none.
- Known expected failures: none.

## Acceptance and Definition of Done

- Typed/versioned contracts require an explicit version, validate, and serialize
  deterministically: **met**.
- Invalid/unsupported versions fail: **met**.
- Unknown fields fail: **met**.
- Missing or invalid tenant fails: **met**.
- Safe mismatch and version-conflict responses are representable: **met**.
- Provider-specific types are absent: **met**.
- Existing behavior and public engine facade remain unchanged: **met**.
- RS-01 and complete current regressions pass: **met**.
- Completion evidence records commands, results, exclusions, risks, and rollback:
  **met**.

## Risks and Limitations

- Contracts are deliberately unused until the approved compatibility slice;
  interface correctness is proven, but runtime integration is not.
- Pydantic model schemas are now a future compatibility commitment. Changes must
  follow explicit versioning rather than silently altering version `1.0`.
- Tenant and identifier mismatch detection is representable but not enforced.
- Safe public-message production, resource resolution, and W3C trace parsing are
  documented producer responsibilities but not implemented in this definition-only
  slice.
- Idempotency and state-version tokens carry no execution semantics yet.
- Workflow `state` and stage strings remain owned by the canonical workflow; a
  future adapter must map them without inventing a second state machine.
- The initial task contract supports reference-only input. A future approved
  bounded-payload requirement would require an additive, versioned contract.

## Rollback

Remove `engine/runtime/`, `tests/runtime/test_contracts.py`, the test package
marker if no longer needed, and this result record. No application state, data,
schema, or UI rollback is required because the contracts are not integrated.

## Remaining Work

The next approved slice is RS-03: typed Runtime Spine configuration. It may add
safe `legacy_local` and `runtime_local` selection with local defaults, but it must
not integrate the UI/runtime seam, add persistence, or implement any RS-04+
behavior.

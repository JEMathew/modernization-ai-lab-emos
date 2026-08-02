# EMOS Development Standards

These standards operationalize existing governance. They do not authorize work
or supersede the Product Constitution, ARB decisions, PRSs, or approved ADRs.

## Naming and identifiers

- Python modules and functions: `snake_case`; classes and typed contracts:
  `PascalCase`; constants: `UPPER_SNAKE_CASE`.
- User-facing text is title-cased and human-readable; internal identifiers are
  not renamed for presentation.
- Programs: `PGM-<AREA>`; epics: existing `EPIC-NN` or `<PROGRAM>-E##`;
  vertical slices: stable `<AREA>-NN`; ADRs: `NNNN-short-title.md`.
- Commands are imperative (`StartWorkflowCommand`), queries are interrogative
  or read-oriented (`WorkflowStatusQuery`), and events use completed facts
  (`workflow.started`) after the state change commits.
- IDs are opaque, immutable, bounded, and tenant-scoped at persistence and
  authorization boundaries.

## Package and dependency standards

- Presentation depends on public workflow/application ports, not domain internals.
- Domain calculations remain deterministic and provider-neutral.
- Runtime owns execution mechanics, never product scoring or enterprise facts.
- Adapters translate providers, databases, queues, storage, models, or tools;
  they do not contain business policy.
- Avoid generic shared-service packages. Extract only a cohesive capability with
  one owner and a stable contract.
- New third-party dependencies require need, security/license review, lock or
  reproducibility treatment, rollback, and an ADR when architectural.

## State and data standards

- Define one authoritative owner for every state field before implementation.
- Every external or durable schema is versioned and rejects unsupported fields.
- Persisted mutations use explicit transaction, version, idempotency, and
  rollback semantics appropriate to the approved slice.
- Session state and projections are caches/views, not durable authorities.
- Enterprise DNA facts require provenance; workflow state references immutable
  DNA snapshots rather than silently changing in-progress context.
- Secrets, credentials, private data, and unrestricted payloads never enter
  source, fixtures, logs, events, evidence, or completion reports.

## Commands, queries, and events

- Commands carry trusted tenant/subject context, correlation, idempotency, an
  expected version where mutating, a bounded deadline, and a typed payload.
- Queries never mutate state and return an explicit version/freshness boundary.
- Events are emitted only for committed facts, carry correlation and causation,
  and are not used to reconstruct state unless an ADR explicitly adopts event
  sourcing.
- Error contracts expose stable codes and sanitized messages, never stack traces,
  secrets, credentials, local paths, or enterprise payloads.

## Evidence and artifacts

- Numeric results name the deterministic Python calculation owner and version.
- Every assessment run produces stored, versioned artifacts with provenance and
  integrity metadata appropriate to its maturity stage.
- Evidence distinguishes source fact, deterministic result, model explanation,
  human decision, historical test evidence, and current automated evidence.
- A completion report records commands and results; it cannot convert a failed
  or unrun check into a pass.

## Testing

- Unit tests protect deterministic rules and validation failures.
- Contract tests protect public schemas, versions, compatibility, and rejection.
- Characterization tests lock behavior before refactoring or inserting seams.
- Integration tests prove transactions, artifacts, adapters, and workflow handoffs.
- Browser tests protect Guided Journey, Mission Control/HQ synchronization,
  reset, keyboard, accessibility, reduced motion, and responsive paths.
- Security and reliability tests are added with the capability, not deferred.
- Run focused tests first, then the full Python and relevant JavaScript suites.
- Validate from a clean checkout before declaring a slice Complete.

## Documentation and change control

- Use exact status labels: current, inactive, proposed, designed, deferred, or removed.
- Link to authorities instead of copying normative text.
- An ADR is required for state ownership, public API, persistence, provider,
  deployment, security boundary, event semantics, or dependency-direction changes.
- Keep one behavior change per cohesive commit. Preserve unrelated working-tree
  changes and use selective staging when necessary.
- Update completion evidence and registries in the same delivery packet only when
  their claims are verified.

## Definition of Done

A slice is Done only when scope and exclusions are satisfied, tests and required
evaluations pass, security/reliability checks pass, documentation and evidence
are current, rollback is known, the happy path remains working, and the exact
commit is reproducible from a clean checkout.

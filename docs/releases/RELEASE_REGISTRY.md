# EMOS Release Registry

Releases are composed from vertical slices, never from loosely named features.
Only Complete slices may enter a release. Each release records an immutable Git
reference and its validation evidence when cut.

| Release | Purpose | Slice composition | State | Exit gate |
|---|---|---|---|---|
| Release 1 — Demonstration Baseline | Preserve the working local product and initial runtime contracts | Existing product commits, RS-01, RS-02 | Current committed foundation; not a Production Candidate | Existing Python/JavaScript happy path and clean-checkout evidence |
| Release 2 — Compatibility Boundary | Introduce the inactive configuration and typed in-process seam | BASE-01, RS-03, RS-04 | Planned | Runtime Sprint 1 gate; flag-off behavior identical |
| Release 3 — Durable Local Spine | Persist authoritative workflow state and bounded task execution | RS-05–RS-12 | Planned | Runtime Sprint 2 and 3 gates |
| Release 4 — Recoverable Runtime Spine | Add idempotency, effects, checkpoints, pause/resume, and recovery | RS-13–RS-17 | Planned | Runtime Sprint 4 gate |
| Release 5 — Production Candidate Runtime Qualification | Prove managed adapters, structural safety, faults, capacity, regression, and rollback | RS-18–RS-24 | Planned | Runtime Epic exit and ARB evidence review |
| Release 6 — Controlled Pilot | Add approved Trust, governed AI, and Operations slices | Unassigned; future approved plans only | Deferred pending ARB authorization | Security, reliability, operations, and pilot go/no-go |

## Release record requirements

Before changing a release to Released, add:

- immutable commit/tag;
- exact included slice IDs and hashes;
- dependency lock/reproducibility evidence;
- Python, JavaScript, browser, accessibility, security, reliability, and
  performance results applicable to the release;
- migration and rollback evidence;
- known limitations and operator ownership;
- ARB or accountable go/no-go decision when required.

No release may claim Controlled Pilot, Enterprise Production, or General
Availability based solely on local tests or completion reports.

# Engineering Metrics

Metrics expose risk and delivery flow; they are not targets to game. Until an
automated source exists, report a metric as `Unknown`, not zero or complete.

| Metric | Definition | Source | Cadence | Initial gate |
|---|---|---|---|---|
| Architecture compliance | Approved fitness checks passing / applicable checks | ADR reviews, dependency/activation scans, ARB evidence | Per slice and release | No unresolved critical violation |
| Technical-debt exposure | Open debt weighted by severity and age | Compliance baseline and reviewed debt register | Monthly | No unowned critical debt |
| Python statement/branch coverage | Executed statements/branches in governed Python scope | Approved coverage tool in CI | Per change | Baseline first; threshold requires separate decision |
| Critical-journey coverage | Required browser journeys with current passing evidence / required journeys | Browser regression manifest | Per release | 100% of release-critical journeys |
| Contract compatibility | Supported-version fixtures passing / supported fixtures | Runtime contract tests | Per change | 100% |
| Slice completion | Complete slices / committed release scope | Slice registry plus Git evidence | Weekly | No partial slice counted complete |
| Lead time | Ready-to-Complete elapsed time per slice | Registry timestamps/issue system | Per slice, rolling median | Observe baseline before target |
| Change failure rate | Releases requiring rollback/hotfix / total releases | Release registry and incident evidence | Per release | Trend downward; no hidden rollback |
| Mean recovery time | Restore of accepted service after validated incident start | Incident/runbook evidence | Per exercise/incident | Against approved RTO when one exists |
| Deployment readiness | Required release gates passing / applicable gates | Release checklist | Per candidate | 100% P0/P1 gates; no waiver by delivery team |
| Reproducibility | Clean-checkout validation passes for exact commit | CI and clean-worktree evidence | Every slice | Required for Complete |
| Dependency freshness/risk | Supported dependencies without unresolved critical advisory / total | Dependency and security scan | Weekly/release | No known critical unmitigated issue |
| Evidence completeness | Required completion-report fields with linked proof / required fields | Work result review | Per slice | 100% |

## Metric controls

- Record numerator, denominator, source commit, tool version, date, and exclusions.
- Separate working-tree, committed, and released results.
- Do not aggregate prototype and production-candidate maturity into one score.
- Coverage does not replace behavior, security, reliability, or browser tests.
- A red gate remains red until fixed or scope is formally reduced.
- Metric-definition changes require review and retain historical interpretation.

## Recommended first baseline

The first metrics slice should automate only: clean-checkout test reproducibility,
current Python/JavaScript suite results, Markdown/link validation, diff hygiene,
runtime activation scan, and credential-pattern scan. Deployment/SLO metrics wait
until an operable service exists.

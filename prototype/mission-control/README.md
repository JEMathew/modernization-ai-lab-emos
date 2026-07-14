# Modernization AI Lab — Mission Control 1.0.1

Turn a synthetic legacy portfolio into a traceable, human-approved modernization roadmap and implementation-ready migration starter package in under three minutes.

Mission Control is a standalone HTML, CSS, and JavaScript prototype created for OpenAI Build Week. It requires no installation, backend, external account, API key, or live model call.

## What this prototype demonstrates

- Portfolio discovery across ten synthetic applications and data platforms.
- Formation of the Customer Intelligence Capability around shared consequence.
- A Living Workspace where specialist ownership and work-object movement are visible.
- Human resolution of conflicting specialist recommendations.
- Deterministic propagation of one human constraint through strategy, architecture, cost, risk, sequencing, controls, and governance.
- Six inspectable Oracle-to-BigQuery starter artifacts generated under an Engineering Contract.
- Independent validation that intentionally finds a semantic failure, applies an approved correction, and reruns only three impacted checks.
- An evidence-linked three-wave portfolio roadmap and explicit Wave 1 approval.
- An experimental Portfolio Upload Lab with local CSV/JSON validation, dependency checks, transparent scoring, and synthetic industry samples.

## Screenshots

Screenshot placeholders for the submission package:

1. `screenshots/01-portfolio-discovery.png` — Portfolio evidence and dependency map.
2. `screenshots/02-decision-propagation.png` — Human constraint and visible plan delta.
3. `screenshots/03-validation-failure.png` — Independent 1.8% aggregate exception.
4. `screenshots/04-executive-roadmap.png` — Final roadmap and Wave 1 approval.

## Architecture overview

The prototype has one shared in-memory case state rendered through two synchronized experiences:

```text
Mission Control ─┐
                 ├─ Shared Modernization Case DR-CIC-001
Modernization HQ ┘      │
                        ├─ Evidence and specialist decisions
                        ├─ Provider-neutral contracts
                        ├─ Mocked engineering artifacts
                        ├─ Deterministic validation results
                        └─ Executive roadmap and approval record
```

- `index.html` contains semantic structure and inline SVG symbols.
- `styles.css` provides responsive enterprise presentation, one-shot motion, Fast pace, and reduced-motion support.
- `script.js` contains mocked data, deterministic workflow state, provider-neutral contracts, validation results, judge-mode cues, and reset reconstruction.
- `portfolio-lab.js` contains the standalone parser, schema validation, dependency checks, ten-unit limit, and deterministic scoring engine.
- `portfolio-lab-ui.js` connects that engine to upload, mapping, validation, sample, scoring, capability-formation, assessment, and engineering-evidence-gate views.

No React, Streamlit, npm, TypeScript, external library, API, or backend is used by this standalone prototype.

## Launch

Open `index.html` directly in a current desktop browser, or serve the repository root:

```bash
cd /path/to/modernization-ai-lab
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/prototype/mission-control/
```

You may also serve the prototype directory itself:

```bash
cd prototype/mission-control
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Guided Demo

1. Enable **Guided Demo** in the Build Week toolbar.
2. Select **Fast** under Demo Pace for the judge path.
3. Follow the exact next action shown in the unobtrusive cue.
4. Use the presenter cue as a short narration prompt.
5. At any point, use **Reset Current Stage**, **Restart Guided Demo**, or **Reset Full Demo**.

Guided Demo reads the existing shared workflow state. It does not create, skip, or maintain a separate workflow. Switching between Mission Control and Modernization HQ preserves the cue and case state.

## Portfolio Upload Lab

The entry launchpad keeps **Run Guided Demo** as the recommended Apex Aerospace experience. **Upload Portfolio** opens an experimental local sandbox, while **Load Sample Portfolio** provides synthetic Retail, Manufacturing, and Financial Services examples.

The lab accepts:

- `portfolio.csv` or a JSON portfolio with the required fields `asset_id`, `asset_name`, `asset_type`, `business_capability`, `technology`, `business_criticality`, `owner`, `lifecycle_status`, `dependencies`, `annual_cost`, `technical_health`, and `business_value`;
- optional `dependencies.csv` with `source_asset_id` and `target_asset_id`; and
- optional `constraints.json` containing a JSON object.

Validation reports missing values or mappings, duplicate IDs or headers, invalid asset types, broken dependencies, empty portfolios and rows, invalid costs or enumerated values, ignored columns, malformed UTF-8 or binary artifacts, unsupported delimiters, oversized files, and unsupported formats. Empty portfolios remain stopped with retry, sample, and CSV-template recovery actions. Familiar source names such as `System Name`, `Category`, and `Importance` can be mapped to the canonical schema. Accepted portfolios are limited to ten modernization units using **Analyze First 10** or **Select 10**. Files are capped at 2 MB.

The Modernization Priority Score is calculated locally from Technical Urgency (30%), Business Value (25%), Operating Cost (15%), Dependency Readiness (15%), Risk Reduction (10%), and Evidence Confidence (5%). Every component score is displayed. A primary candidate is recommended only when its total is at least 60; otherwise the lab reports **No Qualified Modernization Candidate** and does not start a journey.

An uploaded candidate can progress through capability formation and portfolio assessment only. The lab then enforces an engineering evidence gate requiring **Representative SQL**, **Source Schema**, and **Target Platform**. Metadata-only portfolios stop with **Engineering Journey requires additional engineering metadata.** The upload lab never enters the Apex Engineering, Validation, or Executive workspaces and never generates Apex artifacts for arbitrary uploads. Use **Run Guided Demo** for the complete synthetic Apex Aerospace journey.

## Three-minute demo path

| Step | Objective | Recommended action | Expected visual outcome | Presenter cue | Time |
|---|---|---|---|---|---:|
| 1. Portfolio Discovery | Reveal evidence quality and dependencies | Begin Portfolio Discovery | Ten products resolve to evidence states and dependency links appear | “Start with evidence, not opinions.” | 15s |
| 2. Capability Formation | Form one consequence-led case | Continue to Assessment; assess as one initiative | Three products become the Customer Intelligence Capability | “Modernization follows business consequence, not system boundaries.” | 18s |
| 3. Living Workspace | Make ownership and progress visible | Start Workspace Flow | Four specialist work objects attach to one shared case | “The work moves; the user never hunts for status.” | 15s |
| 4. Shared Decision Room | Reduce disagreement to one human decision | Assemble positions; Resolve Decision; protect reports | Three positions converge on the six-month finance-report constraint | “One human constraint resolves the conflict without hiding it.” | 23s |
| 5. Visible Decision Propagation | Show cause and effect | Propagate Constraint; approve revised plan | Timeline becomes seven months, cost rises 11%, risk falls 34%, portal moves to Wave 2 | “The constraint changes only what it causally affects.” | 18s |
| 6. Engineering Workspace | Produce governed starter artifacts | Generate Migration Starter Package; Assemble Package | Six linked Oracle-to-BigQuery artifacts become validation-ready | “Generation is controlled engineering work, not a magic prompt.” | 22s |
| 7. Validation Failure | Demonstrate independent trust controls | Run Independent Validation | A 1.8% quarterly-renewal aggregate variance blocks the package | “Codex-generated does not mean validated.” | 18s |
| 8. Correction and Validation Success | Correct only affected work | Investigate; approve correction; rerun impacted checks | Variance reaches 0.0%; seven of seven checks pass | “The human approves one targeted correction; unrelated work is preserved.” | 18s |
| 9. Executive Roadmap and Wave 1 Approval | Reach a governed portfolio outcome | Prepare Executive Roadmap; approve Wave 1 | Two initiatives approved; case is Execution Ready with Conditions | “Every recommendation is traceable and every assumption challengeable.” | 18s |

Target duration: **2 minutes 45 seconds**. Fast pace shortens transitions without skipping state or hiding signature outcomes.

## Sample enterprise and data

All content is synthetic. Apex Aerospace Manufacturing includes five applications and five data platforms. The primary case combines Customer Analytics Warehouse, Customer Service Portal, and Product Telemetry Platform, with Finance Warehouse and twelve dependent finance reports as the governed external dependency.

The happy path produces a staged Oracle-to-Google-BigQuery starter package and a separate Supplier Quality Portal incremental-refactor proposal.

## OpenAI attribution

### GPT-5.6

The product is designed to use GPT-5.6 for modernization reasoning, trade-off analysis, constraint impact, and executive synthesis. This standalone prototype does not make a live GPT-5.6 API call; those responses are deterministic simulations.

### Codex

Codex accelerated implementation of the prototype and is represented in-product as the Modernization Engineer that turns an approved Engineering Contract into inspectable migration artifacts. Artifact contents are mocked and remain subject to independent validation.

### Provider-neutral production path

Domain objects, workflow state, human approvals, contracts, numeric results, and validation remain provider-neutral. Production adapters can replace mocked providers with live GPT-5.6 and Codex integrations without changing the user experience or governance model.

## Deterministic and mocked behavior

- The Apex Aerospace portfolio is synthetic.
- Agent responses and workflow outcomes are deterministic.
- Engineering artifact contents are mocked but inspectable.
- Validation results, including the intentional 1.8% failure and 0.0% corrected result, are deterministic.
- Workflow controls, state synchronization, accessibility behavior, stage resets, artifact inspection, and human approval gates are real interactive implementations.

The **Demo Simulation** badge opens the same disclosure inside the product.

## Reset and replay

- **Reset Current Stage** reconstructs only the active milestone’s expected entry state while preserving the logically completed upstream path.
- **Restart Guided Demo** enables the guide and returns to Step 1.
- **Reset Full Demo** returns all products and workspaces to the initial Unverified state.
- **Replay Demo** is available in the final completion summary.

## Browser requirements

Use a current desktop version of Chrome, Edge, Firefox, or Safari with JavaScript enabled. A minimum width of 320px is supported; a desktop viewport of at least 1280px is recommended for judging. The interface honors `prefers-reduced-motion`, and primary controls are keyboard reachable with visible focus indicators.

## Limitations

- No live GPT-5.6 or Codex API execution.
- No persistence after browser refresh.
- No deployment, authentication, collaboration, enterprise connectors, persistence, or large-portfolio analysis.
- Portfolio Upload Lab is capped at ten units and 2 MB per primary file. It does not parse documents, repositories, images, source code, or architecture diagrams.
- Uploaded portfolios end at assessment in this release; arbitrary engineering, validation, and executive execution are intentionally unavailable.
- No production database or external service.
- Wave 1 approval does not deploy or launch workloads.

## Build Week implementation record

Primary Codex task: **Create mission control prototype**

Primary Codex session ID: **019f5d84-a8b6-7192-8183-7eb4f6b976b2**

All enterprise names, operational details, evidence, artifacts, and validation results shown here are synthetic.

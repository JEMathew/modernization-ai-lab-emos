# Product Sprint 3 — Enterprise DNA Explorer

## Outcome

Enterprise DNA Explorer is now a dedicated, read-only workspace for tracing business intent through capabilities, digital products, applications, APIs, data, infrastructure, ownership, risk, evidence, and modernization consequence.

The Explorer is a projection over the existing validated Enterprise DNA model. It does not create a second enterprise model, workflow, recommendation source, case state, or approval state.

## Product Review

The current product already contained:

- a strategy-led Enterprise DNA model with 39 objects and 76 governed relationships;
- Mission Control projections that summarize portfolio and decision context;
- deterministic Portfolio Intelligence scoring;
- two governed modernization cases;
- an existing Guided Modernization Journey that owns execution state;
- workspace projections for decision, engineering, validation, and executive experiences.

The primary product gap was navigation and explanation across that model. Users could see summaries, but could not independently trace why an object mattered, how it connected to strategy, what depended on it, what could be affected, or which modernization candidate ranked next.

## Explorer Design

### Capability Explorer

Traces Business Strategy through Business Initiatives, Business Outcomes, Business Capabilities, and Digital Products.

### Dependency Explorer

Shows the broadest bounded relationship view and defaults to the Finance Warehouse dependency so users can inspect consumers, risk, and blast radius.

### Technology Explorer

Connects Applications, APIs, Data Products, Data Platforms, Databases, Pipelines, AI Models, and Infrastructure.

### Application Explorer

Centers applications and exposes their API, team, owner, risk, and technical-debt boundaries.

### Modernization Explorer

Connects modernization cases, products, technology, readiness, risks, debt, and expected business outcomes. It reuses deterministic Portfolio Intelligence ranking rather than inventing a second recommendation.

## Enterprise Intelligence Questions

Every selected Enterprise DNA object exposes concise, evidence-bounded answers to:

- Why?
- How?
- What depends on this?
- What breaks?
- What should be modernized next?

Impact language explicitly states that traversal is bounded to three governed hops. An absence of asserted downstream impact is not presented as proof of zero impact.

## Interaction Model

- Open **Enterprise DNA Explorer** from persistent application navigation.
- Switch among five purpose-specific perspectives.
- Search strategy, capability, product, technology, ownership, and risk.
- Filter by object type and lifecycle state.
- Adjust relationship depth from one to three hops.
- Select objects from the accessible inventory or interactive SVG map.
- Navigate direct incoming and outgoing relationships.
- Inspect attributes, provenance, evidence references, impact, and deterministic modernization priority.
- Return to the prior workspace with its Journey state preserved.
- Use Escape to close the Explorer.

The underlying application workspace is inert and visually isolated while the Explorer is active. Direct links using `#enterprise-dna` restore correct breadcrumbs, current-navigation state, and skip-link destination.

## Architecture and State Boundaries

- `enterprise-dna.js` remains the Enterprise DNA model and query owner.
- `script.js` remains the application, case, and Guided Journey state owner.
- `portfolio-lab.js` remains the deterministic candidate-scoring owner.
- `enterprise-dna-explorer-model.js` derives bounded, immutable read projections only.
- `enterprise-dna-explorer.js` owns temporary presentation state only: perspective, focus, search, filters, depth, and selected question.
- Opening and closing the Explorer does not reset or advance the Guided Journey.
- Mission Control, Guided Journey, Runtime Foundation, onboarding, and Enterprise DNA source data were not modified for Sprint 3.

## Files Modified

- `prototype/mission-control/index.html`
- `prototype/mission-control/enterprise-dna-explorer.css`
- `prototype/mission-control/enterprise-dna-explorer-model.js`
- `prototype/mission-control/enterprise-dna-explorer.js`
- `prototype/mission-control/tests/enterprise-dna-explorer.test.js`
- `work_results/PRODUCT-SPRINT-03-result.md`

The repository contained pre-existing modified and untracked work. No files were staged or committed.

## Validation

### JavaScript

- `node prototype/mission-control/tests/enterprise-dna-explorer.test.js` — PASS
- All ten `prototype/mission-control/tests/*.test.js` suites — PASS
- Syntax validation for prototype controllers, sample package, and tests — PASS
- `git diff --check` for Sprint 3 files — PASS

Protected suites:

- Persistent application navigation
- Enterprise DNA foundation
- Guided discovery action
- Guided panel resize
- Portfolio Upload Lab
- Product hardening
- Multi-case Program Intelligence
- Synthetic Sample Portfolio
- Typography and display labels

### Python Regression

- `PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest -p no:cacheprovider -q` — **108 passed**
- The system `python3` did not provide `pytest`; the repository virtual environment was used.

### Browser Validation

The in-app browser exercised the live product from `http://localhost:8080/`.

- Opened the Explorer from persistent navigation.
- Verified 39 objects, 76 relationships, five capabilities, 12 technology objects, three risk signals, and nine evidence sources.
- Switched perspectives with pointer and keyboard.
- Searched for Customer Service Portal and received the expected Application result.
- Selected objects from the inventory.
- Inspected the Finance Warehouse breakage answer: seven affected technology objects and five affected outcomes within three governed hops.
- Verified the deterministic primary candidate remains Customer Analytics Warehouse at priority 96.
- Closed with Escape and with the visible return action.
- Verified focus returned to the Explorer entry.
- Verified an active Guided Journey remained at Portfolio Discovery before and after an Explorer visit.
- Verified direct-link orientation, Explorer skip-link behavior, and underlying workspace isolation.
- Browser console warnings and errors: none.

### Responsive Validation

| Viewport | Requested | Actual | Result |
| --- | ---: | ---: | --- |
| Desktop | 1440 × 900 | 1440 × 900 | PASS |
| Tablet landscape | 1024 × 768 | 1024 × 768 | PASS |
| Tablet portrait | 768 × 1024 | 768 × 1024 | PASS |
| Mobile portrait | 390 × 844 | 390 × 844 | PASS |

At every viewport:

- the Explorer opened and the selected perspective changed;
- search and return controls were reachable;
- no document-level horizontal overflow was detected;
- wide relationship maps scrolled only inside their graph container;
- no visible Explorer control measured below 24 × 24 CSS pixels;
- the prior application location was restored on close.

## Accessibility

- The Explorer is a labelled region with one focused page heading.
- Perspective and question controls use keyboard-operable tablists with Arrow, Home, and End navigation.
- Keyboard focus follows the selected tab after dynamic rendering.
- SVG objects expose names and keyboard activation inside a labelled interactive group.
- The object inventory provides an equivalent native-button navigation path.
- Search and filters use native labelled controls.
- Secondary information uses native `details` and `summary`.
- The application workspace is marked inert while the Explorer is active.
- The skip link targets the visible Explorer and restores its prior destination on close.
- Selection, lifecycle, confidence, boundaries, and result counts are conveyed in text rather than color alone.
- Reduced-motion rules suppress nonessential transition and animation behavior.

## Known Limitations

- The Explorer is read-only and uses the current deterministic, synthetic Apex Aerospace Enterprise DNA.
- Impact is bounded to three relationship hops and 100 traversed objects; graph rendering is bounded to 36 objects for readability.
- Enterprise Intelligence answers are deterministic explanations over current evidence, not live model execution.
- Search covers current object metadata but does not provide fuzzy matching or saved queries.
- The SVG is a practical relationship map, not an automatic large-enterprise graph-layout engine.
- This validation confirms browser semantics, keyboard behavior, target size, responsive layout, and console health; it is not a formal third-party WCAG certification.

## Demo Steps

1. Open **Enterprise DNA Explorer** from persistent navigation.
2. Begin in **Capability Explorer** and trace Connected Customer Growth to Customer Intelligence.
3. Open **Dependency Explorer** to inspect Finance Warehouse.
4. Ask **What breaks?** and review the bounded blast radius.
5. Search for **Customer Service Portal** and inspect its ownership and direct relationships.
6. Open **Technology Explorer** to trace applications, APIs, data, and infrastructure.
7. Open **Modernization Explorer** to compare deterministic portfolio priorities.
8. Return to the previous workspace and confirm the Guided Journey is unchanged.

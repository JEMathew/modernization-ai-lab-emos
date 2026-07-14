# Modernization AI Lab — Mission Control 0.3

Mission Control is a standalone visual and interaction prototype for exploring
the Modernization AI Lab as three connected environments:

1. Portfolio Command Center
2. Agent Decision Room
3. Codex Modernization Factory

Version 0.3 preserves the complete discovery journey and adds a consequence-led
assessment landscape. After discovery, the same ten product cards reorganize
into the Customer Intelligence Capability, an external Finance Warehouse
reporting dependency, and two secondary consequence clusters. Three assessment
specialists converge on the capability, expose its reasoning signals, and let
the user choose individual assessment or the primary one-initiative path.

Selecting the capability as one modernization initiative places it into
Assessment Ready and unlocks the Decision Room handoff. The journey remains
fully resettable to Version 0.2's initial Unverified portfolio.

The prototype is isolated from the Streamlit application and does not call a
backend, API, or AI service. Its one-shot animations start only from explicit
user actions; it has no recurring timers or continuous state loops.

## Run

Open `index.html` directly in a modern browser, or serve this directory from the
repository root:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/prototype/mission-control/
```

No installation or build step is required.

## Files

- `index.html` — semantic interface structure and inline SVG symbols
- `styles.css` — responsive mission-control presentation and motion settings
- `script.js` — mocked products, agents, panels, navigation, and reset behavior

All enterprise names and operational details shown here are synthetic.

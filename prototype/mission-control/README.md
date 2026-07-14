# Modernization AI Lab — Mission Control 0.4A

Mission Control is a standalone visual and interaction prototype for exploring
the Modernization AI Lab as three connected environments:

1. Portfolio Command Center
2. Agent Decision Room
3. Codex Modernization Factory

Version 0.4A preserves the complete Version 0.3 Mission Control journey and adds
Modernization HQ as an alternative, connected experience. HQ renders the same
journey state as a professional workplace floor with eight zones and eight
specialist personas. The active Customer Intelligence Capability remains one
shared case file across both experiences.

Selecting the capability as one modernization initiative places it into
Assessment Ready and unlocks the Decision Room handoff. Continuing moves the
case file, its evidence tokens, and the Architecture, Business Strategy, and
Risk specialists into the Shared Decision Room. Persona actions expose concise
mocked evidence, responsibility, concern, and perspective responses. Future
engineering, validation, and executive zones remain visibly locked.

The persistent experience switch can move between Mission Control and HQ
without losing state. Reset Demo restores both experiences to the initial
Unverified portfolio. No movement starts before an explicit user action.

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

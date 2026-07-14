# Modernization AI Lab — Mission Control 0.4X

Mission Control is a standalone visual and interaction prototype for exploring
the Modernization AI Lab as three connected environments:

1. Portfolio Command Center
2. Agent Decision Room
3. Codex Modernization Factory

Version 0.4X preserves the complete Version 0.3 Mission Control and Version 0.4A
Modernization HQ journeys, then adds the Living Workspace foundation. Mission
Control and HQ render one shared Customer Intelligence Capability case with a
visible owner, task, blocker, next action, five attached work objects, and a
five-lane work queue.

After Assessment Ready, the user can start a deterministic specialist sequence:
Portfolio Intelligence hands off evidence, Architecture attaches its review,
Business Strategy attaches value findings, and Risk & Governance pauses the
case at Decision Pending. Pause and Resume preserve the exact stored stage and
finish the current transition before stopping. No recurring timer, continuous
loop, backend, or live model call is used.

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

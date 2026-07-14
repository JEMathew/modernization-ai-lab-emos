# Portfolio Upload Lab Result

## Files changed

- `prototype/mission-control/index.html`
- `prototype/mission-control/styles.css`
- `prototype/mission-control/README.md`
- `prototype/mission-control/portfolio-lab.js`
- `prototype/mission-control/portfolio-lab-ui.js`
- `prototype/mission-control/tests/portfolio-lab.test.js`
- `prototype/mission-control/tests/fixtures/mapped-portfolio.csv`
- `prototype/mission-control/tests/fixtures/portfolio.json`
- `work_results/PORTFOLIO-UPLOAD-LAB-result.md`

## Commands run

- `node --check prototype/mission-control/portfolio-lab.js`
- `node --check prototype/mission-control/portfolio-lab-ui.js`
- `node --check prototype/mission-control/script.js`
- `node prototype/mission-control/tests/portfolio-lab.test.js`
- `PYTHONPATH=. .venv/bin/pytest -q`
- `git diff --check`
- Browser interaction checks at `http://localhost:8080/`

## Tests run

- Portfolio parser and validation unit tests for CSV, JSON, unsupported formats, alias mapping, duplicate IDs, invalid asset types, broken dependencies, deterministic scoring, and the ten-unit limit.
- Existing Python test suite.
- Browser checks for the three-option launchpad, all three synthetic sectors, validation report, score display, primary recommendation, uploaded-candidate journey handoff, lab reset, full demo reset, and browser console output.
- Complete Fast Guided Demo regression from portfolio discovery through Wave 1 approval, including the intentional validation failure and correction.

## Test results

- Portfolio Upload Lab tests: passed.
- Existing suite: 45 passed.
- JavaScript syntax: passed.
- HTML parsing: passed.
- Browser console: no warnings or errors.
- Existing guided demo: reached Step 9 of 9 and Execution Ready with Conditions.

## Acceptance criteria met

- Guided Demo remains the recommended Apex Aerospace experience.
- CSV and JSON portfolios are parsed locally without a backend.
- Optional dependency and constraint artifacts are validated.
- Unsupported document, repository, image, archive, and diagram formats are rejected.
- Required schema and alias-based column mapping are implemented.
- Missing values, duplicate IDs, invalid asset types, broken dependencies, empty rows, invalid costs, malformed artifacts, and unsupported formats appear in a validation report.
- Accepted records can continue or be cancelled.
- Portfolios above ten units offer Analyze First 10 or Select 10.
- All six weighted score components and the final Modernization Priority Score are calculated and displayed for every accepted unit.
- Exactly one primary candidate is recommended with a score-based explanation.
- Start Modernization Journey carries the uploaded candidate name and validated-unit count into the standard guided journey.
- The engineering-evidence limitation is explicit.
- Lab reset and full demo reset restore reliable initial state.

## Known issues

- The Codex in-app browser cannot automate native file chooser uploads. CSV and JSON file paths are covered by committed fixtures and Node unit tests; browser UI verification uses the same validation and scoring engine through built-in synthetic samples.
- Uploaded portfolio context is an experimental metadata handoff. Deep workflow stages retain the stable guided scenario and do not generate arbitrary engineering output without representative technical evidence.
- Portfolio state is in memory and is lost on refresh.

## Demo steps

1. Open `index.html` or serve the prototype with `python3 -m http.server 8080`.
2. Choose **Run Guided Demo** for the unchanged Apex Aerospace path.
3. Reload and choose **Upload Portfolio**, then provide `portfolio.csv` or JSON and optional artifacts.
4. Resolve column mappings when source headers differ.
5. Review validation issues and continue with accepted records.
6. For more than ten records, choose **Analyze First 10** or **Select 10**.
7. Inspect every score and the single primary recommendation.
8. Select **Start Modernization Journey** to attach the candidate to the standard guided journey.
9. Use **Reset Lab** or **Reset Full Demo** to restore the initial state.

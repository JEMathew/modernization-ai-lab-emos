"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const prototypeRoot = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(prototypeRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(prototypeRoot, "script.js"), "utf8");
const styles = fs.readFileSync(path.join(prototypeRoot, "styles.css"), "utf8");

assert.equal((html.match(/id="begin-discovery"/g) || []).length, 1, "discovery has one action control");
assert.match(html, /id="begin-discovery"[^>]*type="button"[^>]*>Begin Portfolio Discovery/, "the action has the required accessible label");
assert.equal((html.match(/id="guided-primary-action"/g) || []).length, 1, "the guide has one primary action control");
assert.match(html, /id="guided-lifecycle"[^>]*aria-label="Guided journey lifecycle"/, "the lifecycle exposes an accessible label");
assert.match(script, /aria-current=\"step\"/, "the current lifecycle stage is exposed semantically");
assert.match(script, /source\.click\(\);[\s\S]*renderGuidedDemo\(\);/, "the guide invokes the existing workflow control and refreshes immediately");
assert.equal((script.match(/#guided-primary-action"\)\.addEventListener\("click"/g) || []).length, 1, "the guide attaches one action handler");
[
  "#begin-discovery", "#continue-assessment", "#select-capability", "#assess-initiative", "#continue-decision-room", "#start-workspace",
  "#assemble-positions", "#propagate-constraint", "#approve-revised-plan", "#continue-engineering", "#generate-package", "#continue-validation",
  "#run-validation", "#investigate-failure", "#rerun-impacted", "#continue-executive", "#prepare-roadmap", "#inspect-decision-lineage"
].forEach((selector) => assert.ok(script.includes(`selector: "${selector}"`), `guide maps existing control ${selector}`));
assert.match(script, /data-decision-action=\"resolve\"/, "the guide maps the existing decision-resolution control");
assert.match(script, /data-commander-decision=\"yes\"/, "the guide maps the existing Mission Commander decision");
assert.match(script, /data-engineering-action=\"assemble\"/, "the guide maps the existing package assembly control");
assert.match(script, /data-correction-decision=\"approve\"/, "the guide maps the governed correction approval");
assert.match(script, /data-wave-decision=\"approve\"/, "the guide maps the existing Wave 1 approval");
assert.match(script, /Return to Customer Intelligence Case/, "case switching pauses rather than reroutes the guided workflow");
assert.match(script, /button\.disabled = true;[\s\S]*button\.firstChild\.textContent = "Discovery in progress "/, "discovery disables the action as execution starts");
assert.match(script, /button\.disabled = false;[\s\S]*button\.firstChild\.textContent = "Begin Portfolio Discovery "/, "full reset restores the action");
assert.match(html, /id="guided-collapse"[^>]*aria-expanded="true"[^>]*aria-controls="guided-expanded"/, "the inspector exposes an accessible collapse control");
assert.match(html, /id="guided-restore"[^>]*aria-expanded="false"[^>]*aria-controls="guided-expanded"/, "the compact summary exposes an accessible restore control");
assert.match(html, /id="guided-progress"[^>]*role="progressbar"[^>]*aria-valuenow="0"/, "journey completion uses progressbar semantics");
assert.match(html, /id="guided-progress"[^>]*aria-valuetext="Step 1 of 9; 0 stages complete"/, "journey progress has a step-based accessible description");
assert.match(html, /id="guided-step-progress"/, "the guide provides a visible step-based progress indicator");
assert.match(html, /id="disable-guided-demo"[^>]*>Exit Guide</, "ambiguous Turn Off language is replaced by a non-destructive exit");
assert.match(html, /id="guided-exit-description">Journey progress is preserved\./, "exit scope is stated at the point of action");
assert.match(html, /<details class="guided-operational-details guided-journey-details">[\s\S]*<span>Journey Details<\/span>/, "case and orientation detail use progressive disclosure");
assert.match(html, /Journey Details[\s\S]*PREVIOUS STAGE[\s\S]*UPCOMING STAGE[\s\S]*TIME[\s\S]*PRESENTER CUE/, "secondary journey context is consolidated in one disclosure");
assert.ok(html.indexOf("guided-action-panel") < html.indexOf("guided-execution-context"), "the immediate next action leads the expanded inspector");
assert.match(html, /class="guided-execution-context"[\s\S]*CURRENT STAGE[\s\S]*STATUS[\s\S]*OWNER[\s\S]*WORK OBJECT[\s\S]*BLOCKER/, "execution context groups the live operating fields");
["guided-health-evidence", "guided-health-confidence", "guided-health-readiness"].forEach((id) => assert.ok(html.includes(`id="${id}"`), `Journey Health exposes ${id}`));
assert.match(script, /const guidedPresentation = \{[\s\S]*collapsed: false,[\s\S]*wide: false,[\s\S]*inspectedStep: null/, "panel preferences remain separate from journey state");
assert.match(script, /function guidedHealthSnapshot\(step\)/, "Journey Health is derived from existing journey state");
assert.match(script, /OF 9 STAGES COMPLETE/, "step completion replaces an ambiguous percentage-only label");
assert.match(script, /data-guided-stage="\$\{index\}"/, "the lifecycle renders inspectable stage controls");
assert.match(script, /complete: "Completed", current: "Current stage", pending: "Upcoming"/, "timeline states use explicit completed, current, and upcoming labels");
assert.match(script, /This inspection does not advance or reset the journey\./, "future-stage inspection explains its read-only boundary");
assert.match(script, /function returnGuidedToMissionControl\(\)[\s\S]*openExperience\("mission-control"\);[\s\S]*navigate\(state\.view\);/, "the inspector returns to the current Mission Control workspace without resetting journey state");
assert.match(styles, /body\.guided-inspector-active \.app-shell/, "desktop dock reserves workspace rather than obscuring it");
assert.match(styles, /@media \(max-width: 1180px\)[\s\S]*max-height: min\(82vh, 760px\)/, "tablet presentation is a bounded drawer");
assert.match(styles, /@media \(max-width: 560px\)[\s\S]*max-height: 88vh/, "mobile presentation is a bounded sheet");
assert.match(styles, /min-height: 44px/, "panel controls meet the minimum touch target");
assert.match(styles, /\.guided-expanded\[hidden\],[\s\S]*\.guided-compact-summary\[hidden\][\s\S]*display: none !important/, "collapse and restore override legacy panel display rules");
assert.match(styles, /@media \(max-width: 1180px\)[\s\S]*\.guided-cue\.is-collapsed[\s\S]*top: 12px !important/, "collapsed responsive panels remain anchored within the viewport");
assert.match(styles, /\.guided-action-panel[\s\S]*border-left: 4px solid var\(--teal\)/, "the immediate action receives dominant visual treatment");
assert.match(styles, /\.guided-health > div[\s\S]*grid-template-columns: repeat\(3/, "Journey Health presents three concise signals");
assert.match(styles, /\.guided-lifecycle li\.is-complete[\s\S]*\.guided-lifecycle li\.is-current[\s\S]*\.guided-lifecycle li\.is-pending/, "timeline states have distinct visual treatments");

console.log("Guided discovery action tests passed");

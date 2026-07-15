"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const prototypeRoot = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(prototypeRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(prototypeRoot, "script.js"), "utf8");

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

console.log("Guided discovery action tests passed");

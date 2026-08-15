"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const portfolioEngine = require("../portfolio-lab.js");
const enterpriseDna = require("../enterprise-dna.js");
const sampleApi = require("../samples/enterprise/sample-enterprise.js");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const sampleUi = fs.readFileSync(path.join(root, "sample-portfolio-ui.js"), "utf8");
const snapshot = sampleApi.buildMissionControlSnapshot(portfolioEngine, enterpriseDna);

assert.deepEqual(snapshot.businessCase.estimatedInvestment, { low: 1200000, high: 1600000 }, "investment range is deterministic");
assert.deepEqual(snapshot.businessCase.expectedAnnualBenefit, { low: 320000, high: 400000 }, "annual benefit range is deterministic");
assert.deepEqual(snapshot.businessCase.expectedPaybackYears, { low: 3, high: 5 }, "payback range is derived from the bounded economics");
assert.equal(snapshot.businessCase.implementationTimeline, "7 months", "timeline comes from the governed wave");
assert.equal(snapshot.businessCase.confidencePercent, 91, "confidence comes from the existing recommendation evidence");
assert.match(snapshot.businessCase.estimateLabel, /synthetic · not audited/, "economics are explicitly directional");
assert.equal(snapshot.businessCase.derivation.sourceAnnualCost, 1600000, "business-case derivation exposes its source value");
assert.ok(snapshot.businessCase.assumptions.length >= 4, "business-case assumptions are explicit");
assert.ok(snapshot.businessCase.decisionConditions.some((item) => item.includes("Finance Warehouse ownership")), "finance ownership remains a condition");

assert.equal(snapshot.evidenceBrief.evidence.length, 6, "recommendation rationale names specific evidence");
assert.equal(snapshot.evidenceBrief.alternatives.length, 2, "two alternatives are challengeable");
assert.equal(snapshot.evidenceBrief.confidencePercent, 91, "evidence confidence uses Enterprise DNA");
assert.match(snapshot.evidenceBrief.confidenceMethod, /Deterministic strategy-to-outcome trace/, "confidence method is disclosed");
assert.ok(snapshot.evidenceBrief.limitations.some((item) => item.includes("No live model")), "inactive production capabilities are disclosed");
assert.match(snapshot.decisionAssurance.sensitiveDataStatus, /no production PII detection is active/, "sensitive-data status avoids a false control claim");
assert.match(snapshot.decisionAssurance.policyStatus, /no production policy engine is active/, "policy status avoids a false enforcement claim");

["Try Sample Enterprise", "Import Your Portfolio", "Start a New Modernization Initiative"].forEach((label) => {
  assert.equal((html.match(new RegExp(`<h2>${label}</h2>`, "g")) || []).length, 1, `${label} is one distinct entry path`);
});
assert.match(html, /id="investment-case-title"/, "investment-grade business case is visible");
assert.match(html, /id="recommendation-evidence-brief"/, "recommendation evidence is progressively disclosed");
assert.match(html, /id="decision-assurance"/, "Decision Assurance is progressively disclosed");
assert.match(html, /NO DUPLICATE ACTION/, "Decision Center preserves the Guided Journey as the action surface");
assert.doesNotMatch(html, /id="(?:begin|start|approve)-decision-center-workflow"/, "hardening introduces no second workflow action");

assert.match(script, /function authoritativeCaseProjection\(/, "one read-only authoritative case projection exists");
assert.match(script, /function authoritativeProgramProjection\(/, "program summaries derive from the authoritative cases");
assert.match(script, /index === 0 && state\.discovery === "complete" \? "Complete" : workObjectStatus\(index\)/, "completed discovery cannot display a pending Evidence Package");
assert.match(script, /const active = authoritativeCaseProjection\(\)/, "Program Intelligence uses the authoritative active case");
assert.match(script, /const snapshot = authoritativeCaseProjection\(activeId\)/, "Guided Journey uses the same case projection");
assert.match(script, /renderProgramIntelligence\(\);\s*renderMissionDecisionCenter\(\);/, "case changes refresh program and executive projections together");
assert.match(script, /Wave 1 is approved for governed mobilization/, "final approval replaces stale assessment language");
assert.match(script, /7 of 7 Critical Checks Passed/, "final evidence state is synchronized");
assert.match(script, /state\.sampleEnterpriseLoaded = false/, "Full Reset still clears sample state");

assert.match(sampleUi, /formatCurrencyRange\(businessCase\.estimatedInvestment\)/, "the UI renders calculated investment ranges");
assert.match(sampleUi, /evidenceBrief\.alternatives\.map/, "the UI renders challengeable alternatives");
assert.match(sampleUi, /assurance\.productionBoundary/, "the UI renders the non-enforcement boundary");
assert.match(styles, /\.investment-case-grid/, "business economics have responsive presentation styles");
assert.match(styles, /\.recommendation-evidence-content/, "evidence disclosure has presentation styles");
assert.match(styles, /\.decision-assurance-grid/, "Decision Assurance has presentation styles");
assert.match(styles, /@media \(max-width:620px\).+engagement-economics-summary/s, "hardening content has a mobile layout");

console.log("Product Hardening tests passed");

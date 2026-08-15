"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const portfolioEngine = require("../portfolio-lab.js");
const enterpriseDna = require("../enterprise-dna.js");
const sampleApi = require("../samples/enterprise/sample-enterprise.js");

const validation = sampleApi.validatePackage({ portfolioEngine, enterpriseDna });
assert.deepEqual(validation, { valid: true, errors: [] }, "the canonical sample package validates");
assert.equal(sampleApi.sample.synthetic, true, "sample is explicitly synthetic");
assert.equal(sampleApi.sample.deterministic, true, "sample is deterministic");
assert.equal(sampleApi.sample.enterprise.domain, "Aerospace Manufacturing", "one understandable industry domain is used");
assert.equal(sampleApi.sample.portfolio.length, 10, "sample contains the supported ten-unit portfolio");
assert.equal(sampleApi.sample.portfolio.filter((item) => item.asset_type === "application").length, 5, "sample contains five applications");
assert.equal(sampleApi.sample.portfolio.filter((item) => item.asset_type === "data_platform").length, 5, "sample contains five data platforms");

const graphObjects = [sampleApi.sample.enterprise, ...sampleApi.graphCollections.flatMap((key) => sampleApi.sample[key])];
const graphIds = new Set(graphObjects.map((item) => item.id || item.asset_id));
assert.ok(sampleApi.sample.dependencies.every((item) => graphIds.has(item.sourceId) && graphIds.has(item.targetId)), "all sample relationship endpoints exist");
const degree = new Map([...graphIds].map((id) => [id, 0]));
sampleApi.sample.dependencies.forEach((item) => {
  degree.set(item.sourceId, degree.get(item.sourceId) + 1);
  degree.set(item.targetId, degree.get(item.targetId) + 1);
});
assert.deepEqual([...degree].filter(([id, count]) => id !== sampleApi.sample.enterprise.id && count === 0), [], "the sample package contains no disconnected graph objects");
const brokenPackage = {
  ...sampleApi.sample,
  dependencies: [{ id: "SREL-BROKEN", sourceId: "ENT-APEX", targetId: "MISSING-ASSET", type: "CONTAINS" }]
};
const brokenValidation = sampleApi.validatePackage({ sample: brokenPackage, portfolioEngine, enterpriseDna });
assert.equal(brokenValidation.valid, false, "broken sample packages are rejected");
assert.ok(brokenValidation.errors.includes("Unknown dependency target: MISSING-ASSET"), "loader validation reports the broken relationship");

const dnaDegree = new Map(enterpriseDna.objects.map((item) => [item.id, 0]));
enterpriseDna.relationships.forEach((item) => {
  dnaDegree.set(item.sourceId, dnaDegree.get(item.sourceId) + 1);
  dnaDegree.set(item.targetId, dnaDegree.get(item.targetId) + 1);
});
assert.deepEqual([...dnaDegree].filter(([, count]) => count === 0), [], "the authoritative Enterprise DNA contains no disconnected objects");
assert.ok(sampleApi.sample.enterpriseDna.requiredKinds.every((kind) => enterpriseDna.getObjectsByKind(kind).length), "all required Enterprise DNA kinds are populated");

const snapshot = sampleApi.buildMissionControlSnapshot(portfolioEngine, enterpriseDna);
assert.deepEqual(snapshot.summary, {
  modernizationUnits: 10, applications: 5, dataPlatforms: 5, businessUnits: 5,
  capabilities: 8, annualCost: 10130000
}, "Mission Control summary is calculated from the package");
assert.equal(snapshot.topCandidates[0].record.asset_id, "data-01", "Customer Analytics Warehouse is the deterministic primary candidate");
assert.equal(snapshot.topCandidates[0].total, 96, "primary candidate score remains reproducible");
assert.equal(snapshot.recommendedWave.id, "WAVE-1", "the governed first wave is exposed");
assert.equal(snapshot.enterpriseDna.objects, 39, "Mission Control reports authoritative Enterprise DNA statistics");

assert.deepEqual(sampleApi.sample.journey.map((item) => item.stage), [
  "Portfolio Discovery", "Assessment", "Business Value", "Architecture", "Wave Planning", "Execution Planning"
], "the complete requested journey has evidence");
assert.ok(sampleApi.sample.journey.every((stage) => stage.evidence.length >= 3), "every journey stage contains realistic evidence");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "sample-portfolio-ui.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "samples/enterprise/sample-enterprise.json"), "utf8"));
assert.equal(manifest.packageId, sampleApi.sample.packageId, "portable descriptor identifies the executable package");
assert.ok(html.indexOf("sample-enterprise.js") < html.indexOf("script.js"), "sample data loads before the application controller");
assert.match(html, /id="load-sample-portfolio"/, "one keyboard-accessible sample action is present");
assert.match(html, />Try Sample Enterprise <svg/, "the recommended entry starts a prepared sample engagement");
assert.match(html, /id="sample-engagement-experience" hidden/, "the engagement experience is progressively disclosed");
assert.match(html, /id="sample-agency-preparation"/, "AI Agency preparation is visible before the executive brief");
assert.equal((html.match(/data-sample-agency-step=/g) || []).length, 5, "five finite specialist preparation steps are present");
assert.match(html, /id="sample-engagement-brief" hidden/, "the executive engagement brief is revealed after preparation");
assert.match(html, /id="enter-sample-engagement"/, "the Mission Commander explicitly enters Mission Control");
assert.match(html, /39 Enterprise DNA objects confirmed/, "the brief reports validated enterprise context");
assert.match(html, /77 relationships traced/, "the brief reports traced enterprise relationships");
assert.match(html, /Protect twelve dependent Finance Warehouse reports/, "the material condition is visible before entry");
assert.match(html, /id="sample-executive-brief" hidden/, "an Enterprise Decision Center leads the loaded Mission Control experience");
assert.match(html, /<h1 id="portfolio-title">Enterprise Decision Center<\/h1>/, "Mission Control is explicitly framed as a decision center");
assert.match(html, /MISSION CONTROL \/ EXECUTIVE DECISION BRIEF/, "the primary Mission Control brief is decision-led");
assert.match(html, /id="decision-executive-summary-title"/, "a concise executive summary leads decision intelligence");
assert.match(html, /id="decision-health-title"/, "enterprise health signals are visible");
assert.match(html, /id="priority-intelligence-title"/, "priority intelligence explains portfolio leadership");
assert.match(html, /id="decision-intelligence-title"/, "the governed executive decision is explicit");
assert.match(html, /id="business-outcomes-title"/, "business outcomes are a first-class decision input");
assert.match(html, /id="readiness-intelligence-title"/, "modernization readiness gates are visible");
assert.match(html, /id="recommendation-intelligence-title"/, "recommendation rationale and boundary are explicit");
assert.match(html, /This authorizes deeper evidence-backed assessment\. It does not approve engineering or cutover\./, "the decision boundary prevents accidental over-authorization");
assert.match(html, /id="sample-portfolio-evidence" hidden/, "reporting views are progressively disclosed as supporting evidence");
assert.match(html, /NO DUPLICATE ACTION/, "the Decision Center defers workflow authorization to the Guided Journey");
assert.match(html, /id="sample-portfolio-dashboard" hidden/, "sample intelligence is progressively disclosed after load");
[
  "sample-summary", "sample-technology-distribution", "sample-risk-distribution", "sample-business-value",
  "sample-application-inventory", "sample-top-candidates", "sample-recommended-wave", "sample-journey-status",
  "sample-executive-recommendation"
].forEach((id) => assert.match(html, new RegExp(`id="${id}"`), `${id} is present in Mission Control`));
assert.match(script, /function applySyntheticEnterpriseSample/, "sample load uses the existing application state controller");
assert.match(script, /revealDependencies\(\);\s*completeDiscovery\(\);/, "sample advances the existing discovery workflow without duplicating it");
assert.match(script, /Portfolio Evidence Package complete/, "completed discovery exposes a completed evidence work object");
assert.match(script, /10 products reviewed · 7 ready · 3 blocked/, "completed discovery exposes concise evidence state");
assert.doesNotMatch(script, /portfolio-title"\)\.textContent = "Portfolio Command Center"/, "workflow transitions preserve the Enterprise Decision Center identity");
assert.match(script, /function renderMissionDecisionCenter\(\)/, "Mission Control decision intelligence synchronizes with the existing case state");
assert.match(script, /renderProgramIntelligence\(\);\s*renderMissionDecisionCenter\(\);/, "case rendering refreshes Mission Control without introducing another state owner");
assert.match(script, /Changing case context does not alter either case record/, "case switching preserves a clear decision-context boundary");
assert.match(script, /Approval authorizes mobilization, not cutover/, "executive approval keeps the protected cutover condition visible");
assert.match(script, /state\.sampleEnterpriseLoaded = false/, "Full Reset clears sample state");
assert.match(ui, /const agencyStages = \[/, "the loading experience is modeled as a finite specialist sequence");
assert.match(ui, /showEngagementBrief\(\)/, "successful preparation hands off to the executive engagement brief");
assert.match(ui, /sample-executive-brief-title.*focus/, "Mission Control entry focuses the Executive Advisor brief");
assert.match(ui, /getObjectsByKind\("Business Outcome"\)/, "business outcomes are consumed from the existing Enterprise DNA model");
assert.match(ui, /highValueUnits/, "business-value health is calculated from accepted portfolio records");
assert.match(ui, /primary\.total - candidate\.total/, "priority comparison gaps are calculated from deterministic scores");
assert.match(ui, /sample-portfolio-evidence.*hidden = false/, "supporting portfolio evidence is available after preparation");
assert.match(ui, /window\.renderMissionDecisionCenter\(\)/, "sample entry synchronizes the decision brief after it becomes visible");
assert.match(ui, /reload-sample-portfolio.*addEventListener\("click", loadSample\)/, "Reload is wired");
assert.match(ui, /reset-sample-portfolio.*addEventListener\("click", resetSample\)/, "dedicated Reset is wired");
assert.match(ui, /enter-sample-engagement.*addEventListener\("click", enterMissionControl\)/, "engagement entry is wired");
assert.doesNotMatch(ui, /setInterval/, "loading uses no recurring state loop");

console.log("Synthetic Sample Portfolio tests passed");

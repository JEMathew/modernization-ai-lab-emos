"use strict";

const assert = require("node:assert/strict");
const engine = require("../portfolio-lab.js");

const headers = engine.SCHEMA.join(",");
const csv = `${headers}\nAPP-1,Service Portal,application,Customer Service,.NET,High,Customer Ops,aging,DATA-1,900000,poor,critical\nDATA-1,Analytics Warehouse,data_platform,Customer Intelligence,Oracle,Critical,Data Office,end of support,,1500000,critical,critical\n`;
const parsedCsv = engine.parsePortfolioArtifact("portfolio.csv", csv);
assert.equal(parsedCsv.records.length, 2, "CSV upload parses portfolio rows");

const parsedJson = engine.parsePortfolioArtifact("portfolio.json", JSON.stringify({ portfolio: parsedCsv.records }));
assert.equal(parsedJson.records.length, 2, "JSON upload accepts a portfolio array wrapper");
assert.throws(() => engine.parsePortfolioArtifact("portfolio.pdf", "not a portfolio"), /Unsupported format/, "unsupported files are rejected");
assert.throws(() => engine.parsePortfolioArtifact("portfolio.csv", "asset_id;asset_name\nA;B"), /delimiter/, "non-comma CSV delimiters are rejected clearly");
assert.throws(() => engine.parsePortfolioArtifact("portfolio.csv", "asset_id,Asset ID\nA,B"), /Duplicate column header/, "duplicate normalized headers are rejected");
assert.throws(() => engine.parsePortfolioArtifact("portfolio.csv", "asset_id,asset_name\nA,\u0000B"), /Binary content/, "binary content is rejected");

const aliasedCsv = "System ID,System Name,Category,Capability,Technology,Importance,Owner,Lifecycle,Depends On,Operating Cost,Health,Value\nSYS-1,Order Hub,Application,Orders,Java,High,Operations,aging,,500000,poor,high";
const aliased = engine.parsePortfolioArtifact("portfolio.csv", aliasedCsv);
const mapping = engine.suggestMapping(aliased.headers);
assert.equal(mapping.asset_name, "System Name", "column mapping recognizes System Name");
assert.equal(mapping.asset_type, "Category", "column mapping recognizes Category");
assert.equal(mapping.business_criticality, "Importance", "column mapping recognizes Importance");
const mapped = engine.applyColumnMapping(aliased.records, mapping);
assert.equal(mapped[0].asset_name, "Order Hub", "mapped values use the canonical schema");

const canonical = engine.applyColumnMapping(parsedCsv.records, Object.fromEntries(engine.SCHEMA.map((field) => [field, field])));
const dependencyLinks = engine.parseDependencyArtifact("source_asset_id,target_asset_id\nAPP-1,DATA-1\nAPP-1,MISSING-1");
const validation = engine.validatePortfolio(canonical, { dependencies: dependencyLinks });
assert.equal(validation.accepted.length, 2, "valid records continue to analysis");
assert.ok(validation.issues.some((issue) => issue.code === "broken-dependency"), "broken dependencies appear in validation");

const invalid = canonical.concat({ ...canonical[0], __row: 4 }, { ...canonical[0], asset_id: "APP-2", asset_type: "repository", __row: 5 });
const invalidReport = engine.validatePortfolio(invalid);
assert.ok(invalidReport.issues.some((issue) => issue.code === "duplicate-id"), "duplicate IDs are rejected");
assert.ok(invalidReport.issues.some((issue) => issue.code === "invalid-asset-type"), "invalid asset types are rejected");

const emptyReport = engine.validatePortfolio([]);
assert.equal(emptyReport.accepted.length, 0, "empty portfolios have no accepted records");
assert.ok(emptyReport.issues.some((issue) => issue.code === "empty-portfolio" && issue.message === "Portfolio contains no modernization assets."), "empty portfolios receive the required recovery error");

const invalidLabels = engine.validatePortfolio([{ ...canonical[0], asset_id: "APP-9", lifecycle_status: "unknown", technical_health: "mystery", business_value: "maximum" }]);
assert.ok(invalidLabels.issues.some((issue) => issue.code === "invalid-lifecycle-status"), "unsupported lifecycle values are rejected");
assert.ok(invalidLabels.issues.some((issue) => issue.code === "invalid-technical-health"), "unsupported technical-health values are rejected");
assert.ok(invalidLabels.issues.some((issue) => issue.code === "invalid-business-value"), "unsupported business-value values are rejected");

const scores = engine.scorePortfolio(validation.accepted);
assert.equal(scores.length, 2, "every accepted record receives a score");
assert.ok(scores.every((score) => [score.total, score.technicalUrgency, score.businessValue, score.operatingCost, score.dependencyReadiness, score.riskReduction, score.evidenceConfidence].every(Number.isFinite)), "all score components are numeric");
assert.equal(scores[0].record.asset_name, "Analytics Warehouse", "candidate ranking is deterministic");
assert.ok(engine.qualifiedCandidate(scores), "a score meeting the qualification threshold is recommended");

const lowPriority = [{
  ...validation.accepted[0], asset_id: "LOW-1", asset_name: "Low Priority Asset", annual_cost: 0,
  technical_health: "excellent", business_value: "low", lifecycle_status: "current",
  business_criticality: "low", dependencies: []
}];
const lowScores = engine.scorePortfolio(lowPriority);
assert.ok(lowScores[0].total < engine.MIN_MODERNIZATION_SCORE, "low-priority portfolio remains below qualification threshold");
assert.equal(engine.qualifiedCandidate(lowScores), null, "no candidate is returned below score 60");

assert.deepEqual(engine.engineeringEvidence(scores[0].record), {
  complete: false,
  missing: ["representative_sql", "source_schema", "target_platform"]
}, "metadata-only candidates remain stopped at the engineering gate");
const evidenceReady = engine.engineeringEvidence({ representative_sql: "select 1", source_schema: "CUSTOMERS", target_platform: "BigQuery" });
assert.equal(evidenceReady.complete, true, "all three engineering evidence fields satisfy the evidence check");

const eleven = Array.from({ length: 11 }, (_, index) => ({ ...validation.accepted[0], asset_id: `UNIT-${index}` }));
assert.equal(engine.selectModernizationUnits(eleven, "first").length, 10, "Analyze First 10 enforces the sandbox limit");
assert.throws(() => engine.selectModernizationUnits(eleven, "selected", ["UNIT-1"]), /exactly 10/, "Select 10 requires exactly ten units");

console.log("Portfolio Upload Lab tests passed");

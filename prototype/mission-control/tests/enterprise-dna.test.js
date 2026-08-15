"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dna = require("../enterprise-dna.js");

assert.equal(dna.validateModel().valid, true, "Enterprise DNA model is valid");
assert.deepEqual(new Set(dna.objects.map((item) => item.kind)), new Set(dna.OBJECT_KINDS), "every supported business and technology object kind is represented");
assert.equal(new Set(dna.objects.map((item) => item.id)).size, dna.objects.length, "object IDs are globally unique");
assert.equal(new Set(dna.relationships.map((item) => item.id)).size, dna.relationships.length, "relationship IDs are globally unique");
assert.ok(dna.relationships.every((item) => dna.getObject(item.sourceId) && dna.getObject(item.targetId)), "every relationship endpoint exists");
assert.ok(dna.relationships.every((item) => dna.RELATIONSHIP_TYPES.includes(item.type)), "relationships use the controlled vocabulary");
assert.ok(dna.objects.every((item) => item.provenance && Number.isFinite(item.confidence) && item.confidence >= 0 && item.confidence <= 1), "objects expose provenance and valid confidence");
assert.ok(dna.relationships.every((item) => item.provenance && Number.isFinite(item.confidence) && item.confidence >= 0 && item.confidence <= 1), "relationships expose provenance and valid confidence");
assert.ok(dna.objects.filter((item) => ["Risk", "Modernization Case Reference", "Business Strategy", "Business Initiative", "Business Outcome"].includes(item.kind)).every((item) => item.evidenceReferences.length), "decision-relevant objects carry evidence");
assert.ok(dna.objects.every((item) => dna.LIFECYCLE_STATUSES.includes(item.lifecycleStatus)), "objects use controlled lifecycle values");

const invalidEndpoint = { ...dna.relationships[0], id: "REL-INVALID", targetId: "UNKNOWN" };
assert.equal(dna.validateModel(dna.objects, [invalidEndpoint], dna.findings).valid, false, "unknown relationship endpoints are rejected");
const invalidType = { ...dna.relationships[0], id: "REL-BAD-TYPE", type: "IMAGINES" };
assert.equal(dna.validateModel(dna.objects, [invalidType], dna.findings).valid, false, "unknown relationship types are rejected");
const duplicateEdges = [dna.relationships[0], { ...dna.relationships[0], id: "REL-DUPLICATE" }];
assert.ok(dna.validateModel(dna.objects, duplicateEdges, dna.findings).errors.some((item) => item.startsWith("Duplicate relationship")), "duplicate directed edges are rejected");
const invalidConfidence = dna.objects.map((item, index) => index ? item : { ...item, confidence: 1.2 });
assert.equal(dna.validateModel(invalidConfidence, [], []).valid, false, "out-of-range confidence is rejected");
const invalidLifecycle = dna.objects.map((item, index) => index ? item : { ...item, lifecycleStatus: "Unknown" });
assert.equal(dna.validateModel(invalidLifecycle, [], []).valid, false, "unknown lifecycle values are rejected");

const strategy = dna.capabilitiesAndProductsForStrategy("STR-CX-2026-01");
assert.equal(strategy.strategy.name, "Connected Customer Growth", "the model begins with business strategy");
assert.equal(strategy.initiatives[0].name, "Customer Intelligence Transformation", "strategy is advanced by a business initiative");
assert.deepEqual(strategy.capabilities.map((item) => item.name).sort(), ["Customer Analytics", "Customer Intelligence", "Customer Service", "Executive Reporting", "Product Telemetry"].sort(), "strategy traces to all five capabilities");
assert.deepEqual(strategy.digitalProducts.map((item) => item.name), ["Customer Intelligence"], "capabilities trace to the durable digital product");

const initiative = dna.initiativeContext("BI-CX-2026-01");
assert.equal(initiative.outcomes.length, 5, "initiative exposes five measurable outcomes");
assert.ok(initiative.technology.some((item) => item.name === "Customer Analytics Warehouse"), "initiative traces to technology assets");
assert.ok(initiative.teams.some((item) => item.name === "Commercial Data Engineering"), "initiative traces to engineering teams");
assert.ok(initiative.risks.some((item) => item.name === "Finance reporting ownership conflict"), "initiative traces to enterprise risk");

const finding = dna.whyCaseRecommended("DR-CIC-001");
assert.equal(finding.id, "EI-FINDING-DR-CIC-001", "DR-CIC-001 has one deterministic Enterprise Intelligence finding");
assert.match(finding.conclusion, /Connected Customer Growth/);
assert.match(finding.conclusion, /Finance Warehouse ownership conflict/);
assert.ok(finding.evidenceReferences.length >= 8 && finding.method.startsWith("Deterministic"), "finding is evidence-backed and deterministic");
assert.ok(finding.affectedObjectIds.every((id) => dna.getObject(id)), "finding trace contains only stable Enterprise DNA objects");

const outcomes = dna.expectedOutcomesForCase("DR-CIC-001");
assert.equal(outcomes.length, 5, "case exposes expected business outcomes");
const caseObjects = dna.objectsForCase("DR-CIC-001");
assert.ok(caseObjects.some((item) => item.kind === "Business Capability"), "case traces to capabilities");
assert.ok(caseObjects.some((item) => item.kind === "Digital Product"), "case traces to its digital product");
assert.ok(caseObjects.some((item) => item.kind === "Risk"), "case traces to risk");

const finance = dna.financeDependencyImpact();
assert.equal(finance.dependency.name, "Finance Warehouse", "Finance Warehouse is the governed dependency");
assert.ok(finance.assets.some((item) => item.name === "Customer Intelligence"), "dependency impact reaches the affected digital product");
assert.ok(finance.teams.some((item) => item.name === "Finance Data Governance"), "dependency impact reaches the responsible team");
assert.ok(finance.risks.some((item) => item.id === "RISK-FINANCE-OWNERSHIP"), "dependency impact reaches its ownership risk");

const dependencies = dna.productDependencies();
assert.deepEqual(dependencies.upstream.map((item) => item.name), ["Finance Warehouse"], "digital product has one direct upstream governed dependency");
assert.ok(dependencies.components.some((item) => item.name === "Customer Service Portal"), "digital product dependency view includes application components");
assert.ok(dependencies.components.some((item) => item.name === "Customer 360 Insight"), "digital product dependency view includes data products");

const threats = dna.risksThreateningOutcomes();
assert.deepEqual(threats.map((item) => item.outcome.id).sort(), ["OUT-CX-03", "OUT-CX-04"], "risk-to-outcome query returns only threatened outcomes");

const bounded = dna.traverse("DP-CUSTOMER-INTELLIGENCE", { maxDepth: 99, limit: 3 });
assert.equal(bounded.length, 3, "traversal enforces result limits");
assert.ok(bounded.every((item) => item.depth <= 6), "traversal enforces maximum depth");
const cycleSafe = dna.traverse("CASE-DR-CIC-001", { maxDepth: 6, limit: 250 });
assert.equal(new Set(cycleSafe.map((item) => item.object.id)).size, cycleSafe.length, "bidirectional traversal is cycle-safe");

assert.equal(dna.resolveId("app-03"), "APP-CUSTOMER-SERVICE", "legacy application ID maps stably");
assert.equal(dna.resolveId("data-01"), "PLATFORM-CUSTOMER-ANALYTICS", "legacy warehouse ID maps stably");
assert.equal(dna.resolveId("DR-CIC-001"), "CASE-DR-CIC-001", "Journey case ID maps without replacement");
assert.equal(dna.getObject("UNKNOWN"), null, "unknown references are handled explicitly");

const journey = Object.freeze({ stage: "Decision Pending", owner: "Mission Commander", task: "Waiting for Mission Commander", blocker: "Finance ownership conflict", next: "Assemble Decision Positions" });
const missionProjection = dna.projectionForCase("DR-CIC-001", journey);
assert.equal(missionProjection.strategy.name, "Connected Customer Growth", "Mission Control projection is strategy-led");
assert.deepEqual(missionProjection.journey, journey, "projection reads Journey state without replacing it");
const decisionProjection = dna.workspaceProjection("decision", "DR-CIC-001", journey);
assert.equal(decisionProjection.dependency.name, "Finance Warehouse", "Decision Room projection exposes the causal dependency");
assert.ok(decisionProjection.responsibleTeams.length, "Decision Room projection exposes accountable teams");
const engineeringProjection = dna.workspaceProjection("engineering", "DR-CIC-001", journey);
assert.ok(engineeringProjection.changedObjects.some((item) => item.kind === "Digital Product"), "Engineering projection identifies intended Enterprise DNA changes");
const validationProjection = dna.workspaceProjection("validation", "DR-CIC-001", journey);
assert.ok(validationProjection.validatedObjects.some((item) => item.kind === "Data Product"), "Validation projection identifies validated Enterprise DNA objects");
const executiveProjection = dna.workspaceProjection("executive", "DR-CIC-001", journey);
assert.equal(executiveProjection.outcomes.length, 5, "Executive projection preserves business-outcome traceability");

assert.equal("stage" in dna.state, false, "Enterprise DNA does not duplicate Journey stage");
assert.equal("activeCaseId" in dna.state, false, "Enterprise DNA does not own a second active case");
assert.equal("approvalStatus" in dna.state, false, "Enterprise DNA does not own Journey approvals");

const prototypeRoot = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(prototypeRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(prototypeRoot, "script.js"), "utf8");
const styles = fs.readFileSync(path.join(prototypeRoot, "styles.css"), "utf8");
assert.match(html, /enterprise-dna\.js/, "Enterprise DNA loads before the V1.3 controller");
assert.ok(html.indexOf("enterprise-dna.js") < html.indexOf("script.js"), "Enterprise DNA loads before the Journey UI controller");
assert.equal((html.match(/id="enterprise-dna-context"/g) || []).length, 1, "Mission Control has one Enterprise DNA context surface");
assert.match(script, /const enterpriseDna = globalThis\.EnterpriseDNA/, "V1.3 consumes the shared Enterprise DNA contract");
assert.match(script, /enterpriseDna\.projectionForCase\("DR-CIC-001", authoritativeCaseProjection\("DR-CIC-001"\)\)/, "authoritative Journey state is passed into a read-only projection");
assert.match(script, /renderEnterpriseDnaContext\(\);[\s\S]*renderEnterpriseContext\(\);/, "Mission Control renders Enterprise DNA without replacing the enterprise hierarchy");
assert.match(script, /workspaceProjection\("decision"/, "Decision Room consumes an Enterprise DNA projection");
assert.match(script, /workspaceProjection\("engineering"/, "Engineering consumes an Enterprise DNA projection");
assert.match(script, /workspaceProjection\("validation"/, "Validation consumes an Enterprise DNA projection");
assert.match(script, /workspaceProjection\("executive"/, "Executive Roadmap consumes an Enterprise DNA projection");
assert.match(script, /id="enterprise-dna-disclosure" type="button" aria-expanded=/, "progressive disclosure is a keyboard-accessible button");
assert.match(script, /detail\.hidden = expanded/, "disclosure exposes content without creating workflow state");
assert.match(styles, /@media \(prefers-reduced-motion:reduce\)[^{]*\{[^}]*\.enterprise-dna-disclosure/, "Enterprise DNA presentation explicitly respects reduced motion");
console.log("Enterprise DNA foundation tests passed");

"use strict";

const enterpriseContext = globalThis.EnterpriseContext;
const programIntelligence = globalThis.ProgramIntelligence;

function activeCaseId() { return programIntelligence?.state.activeCaseId || "DR-CIC-001"; }
function isSupplierCase() { return activeCaseId() === "DR-SQP-002"; }

const products = [
  { id: "app-01", group: "applications", name: "Supplier Quality Portal", platform: "Java / Oracle", owner: "Supply Chain", criticality: "High", age: "12 years", disposition: "Replatform", summary: "Coordinates supplier nonconformance cases and corrective actions across the production network." },
  { id: "app-02", group: "applications", name: "Maintenance System", platform: "IBM Maximo", owner: "Plant Operations", criticality: "Critical", age: "15 years", disposition: "Retain", summary: "Schedules asset maintenance and preserves the production-service history for critical equipment." },
  { id: "app-03", group: "applications", name: "Customer Service Portal", platform: ".NET / SQL Server", owner: "Customer Care", criticality: "High", age: "9 years", disposition: "Replatform", summary: "Supports customer cases, service entitlements, and order-status inquiries across aerospace programs." },
  { id: "app-04", group: "applications", name: "Engineering Viewer", platform: "C++ / Files", owner: "Engineering", criticality: "Medium", age: "18 years", disposition: "Retain", summary: "Provides controlled access to engineering drawings and product configuration references." },
  { id: "app-05", group: "applications", name: "Dealer Order Management", platform: "Oracle Forms", owner: "Commercial", criticality: "High", age: "17 years", disposition: "Rearchitect", summary: "Captures dealer orders and coordinates availability, configuration, and fulfillment milestones." },
  { id: "data-01", group: "data", name: "Customer Analytics Warehouse", platform: "Oracle Exadata", owner: "Commercial Data", criticality: "Critical", age: "14 years", disposition: "Replatform", summary: "Consolidates customer, order, service, and dealer signals for enterprise commercial analytics.", priority: true },
  { id: "data-02", group: "data", name: "Manufacturing Data Mart", platform: "Teradata", owner: "Manufacturing", criticality: "Critical", age: "11 years", disposition: "Replatform", summary: "Serves plant performance, yield, throughput, and production-quality reporting." },
  { id: "data-03", group: "data", name: "Supplier Data Lake", platform: "Hadoop", owner: "Supply Chain", criticality: "High", age: "8 years", disposition: "Rearchitect", summary: "Stores supplier delivery, quality, sourcing, and operational event feeds for analysis." },
  { id: "data-04", group: "data", name: "Finance Warehouse", platform: "SAP BW", owner: "Finance", criticality: "Critical", age: "13 years", disposition: "Retain", summary: "Supports governed financial consolidation, management reporting, and statutory analysis." },
  { id: "data-05", group: "data", name: "Product Telemetry Platform", platform: "Kafka / Cassandra", owner: "Digital Products", criticality: "High", age: "6 years", disposition: "Refactor", summary: "Processes product telemetry streams for fleet health, reliability, and service insights." }
];

const agents = [
  { id: "agent-01", name: "Portfolio Discovery Agent", code: "PD", role: "Evidence intake", angle: -90, mandate: ["Inventory products and dependencies", "Validate synthetic source evidence", "Surface missing or inconsistent metadata"], evidence: "Portfolio, metadata, dependencies", boundary: "Cannot assign numeric scores" },
  { id: "agent-02", name: "Enterprise Architect Agent", code: "EA", role: "Target architecture", angle: -45, mandate: ["Shape target-state architecture", "Evaluate platform fit and constraints", "Document architecture decisions"], evidence: "Technology and dependency signals", boundary: "Escalates material architecture risk" },
  { id: "agent-03", name: "Business Value Agent", code: "BV", role: "Outcome framing", angle: 0, mandate: ["Connect products to business outcomes", "Explain Python-calculated value signals", "Identify value-realization dependencies"], evidence: "Business profile and calculated scores", boundary: "Does not invent financial benefits" },
  { id: "agent-04", name: "Risk & Governance Agent", code: "RG", role: "Control assurance", angle: 45, mandate: ["Classify risk and control needs", "Identify approval checkpoints", "Preserve human accountability"], evidence: "Risk, criticality, and policy signals", boundary: "High-risk decisions require approval" },
  { id: "agent-05", name: "Wave Planning Agent", code: "WP", role: "Sequence design", angle: 90, mandate: ["Sequence modernization waves", "Balance value, complexity, and risk", "Replan when constraints change"], evidence: "Priorities, dependencies, constraints", boundary: "Uses deterministic score inputs" },
  { id: "agent-06", name: "Modernization Engineer", code: "ME", role: "Powered by Codex", angle: 135, mandate: ["Convert governed engineering intent", "Generate target starter artifacts", "Record lineage and review items"], evidence: "Contract, SQL, mappings, metadata", boundary: "Flags ambiguous conversions" },
  { id: "agent-07", name: "Validation Agent", code: "VA", role: "Quality controls", angle: 180, mandate: ["Run structural and behavioral checks", "Reconcile expected control totals", "Publish exceptions and evidence"], evidence: "Source and target validation results", boundary: "Cannot waive failed controls" },
  { id: "agent-08", name: "Executive Advisor", code: "EX", role: "Decision narrative", angle: 225, mandate: ["Synthesize decision-ready findings", "Explain tradeoffs and confidence", "Prepare executive handoffs"], evidence: "All governed specialist outputs", boundary: "Explains scores; never creates them" }
];

const discoveryAgentIds = new Set(["agent-01", "agent-04"]);
const assessmentAgentIds = new Set(["agent-01", "agent-02", "agent-03"]);
const capabilityProductIds = new Set(["app-03", "data-01", "data-05"]);
const assessmentSignals = {
  "app-03": "High business importance",
  "data-01": "High technical urgency",
  "data-05": "High future strategic value"
};

const hqSpecialists = {
  "agent-01": { title: "Portfolio Intelligence Specialist", role: "Evidence steward", zone: "Portfolio Intelligence Studio", active: true, evidence: "The shared case contains three evidence-ready products and the Finance Warehouse reporting dependency.", responsibility: "I preserve the evidence chain and keep every specialist aligned to one modernization record.", concern: "The Finance Warehouse ownership conflict remains visible even though the capability is Assessment Ready.", perspective: "I prioritize evidence completeness and traceability before recommendation quality." },
  "agent-02": { title: "Chief Enterprise Architect", role: "Architecture authority", zone: "Architecture Studio", active: true, evidence: "Customer Analytics Warehouse carries high technical urgency and anchors the Oracle-to-BigQuery boundary.", responsibility: "I define the shared technical boundary, target-state implications, and architecture decision points.", concern: "Twelve dependent finance reports increase coupling at the reporting boundary.", perspective: "I optimize for a coherent capability architecture without hiding integration consequence." },
  "agent-03": { title: "Business Strategist", role: "Value and outcome lead", zone: "Business Strategy Studio", active: true, evidence: "Customer Service Portal has high business importance and Product Telemetry has high future strategic value.", responsibility: "I connect the combined initiative to customer outcomes and measurable enterprise value.", concern: "Separating the three products would fragment value realization across multiple delivery tracks.", perspective: "I favor one initiative because the business outcome spans all three products." },
  "agent-04": { title: "Risk & Governance Specialist", role: "Control and approval lead", zone: "Risk & Governance Center", active: true, evidence: "Evidence coverage is complete for the three capability products; Finance ownership remains conflicted.", responsibility: "I preserve accountable decisions, surface unresolved controls, and define human approval boundaries.", concern: "The reporting dependency must remain explicit in every downstream decision record.", perspective: "I allow assessment to proceed while keeping the ownership conflict as a governed exception." },
  "agent-05": { title: "Wave Planning Specialist", role: "Constraint propagation owner", zone: "Shared Decision Room", active: true, evidence: "The six-month finance-report freeze is attached to DR-CIC-001.", responsibility: "I propagate governed constraints through strategy, timeline, cost, risk, and wave sequencing.", concern: "The portal must follow the warehouse without moving unaffected products.", perspective: "I revise only plan elements causally affected by the Human Constraint." },
  "agent-06": { title: "Modernization Engineer", role: "Powered by Codex", zone: "Codex Engineering Lab", active: true, evidence: "The Engineering Contract contains the approved strategy, protected dependency, controls, and validation expectations.", responsibility: "I turn governed engineering intent into inspectable migration artifacts.", concern: "Report ownership must be confirmed before cutover, but it does not block package generation.", perspective: "Every generated file must explain why it exists and what must validate it." },
  "agent-07": { title: "Validation Specialist", role: "Quality and controls", zone: "Validation Lab", active: false },
  "agent-08": { title: "Executive Advisor", role: "Constraint impact explanation", zone: "Executive Briefing Room", active: true, evidence: "The revised plan records a three-month extension, eleven-percent cost increase, and thirty-four-percent risk reduction.", responsibility: "I explain visible decision consequences and preserve traceability to DR-CIC-001.", concern: "Ownership validation remains open after the protected boundary is created.", perspective: "The revised plan trades time and cost for lower disruption and explicit governance." }
};

const workspaceWorkObjects = [
  { id: "evidence", title: "Evidence Package", stage: "Evidence Collected", owner: "Portfolio Intelligence Specialist", agentId: "agent-01", sequence: "01", evidenceCount: "4 sources", finding: "Three capability evidence packages and the dependency map are ready.", concern: "Finance Warehouse ownership conflicts across two sources.", next: "Hand the governed evidence set to Architecture." },
  { id: "architecture", title: "Architecture Review", stage: "Architecture Review", owner: "Chief Enterprise Architect", agentId: "agent-02", sequence: "02", evidenceCount: "3 signals", finding: "Oracle Exadata anchors the Oracle-to-BigQuery modernization boundary.", concern: "Twelve dependent finance reports increase reporting-boundary coupling.", next: "Attach the target-boundary review and hand off to Business Strategy." },
  { id: "business", title: "Business Review", stage: "Business Review", owner: "Business Strategist", agentId: "agent-03", sequence: "03", evidenceCount: "3 outcomes", finding: "One capability initiative preserves customer insight value across all three products.", concern: "Separate product tracks would fragment value realization.", next: "Attach value and urgency findings for Risk review." },
  { id: "risk", title: "Risk Review", stage: "Risk Review", owner: "Risk & Governance Specialist", agentId: "agent-04", sequence: "04", evidenceCount: "2 controls", finding: "Assessment may proceed with the Finance dependency recorded as an exception.", concern: "Finance Warehouse ownership must be resolved by an accountable human.", next: "Pause the case at Decision Pending with a governed blocker." },
  { id: "decision", title: "Decision Record Placeholder", stage: "Decision Pending", owner: "Mission Commander", agentId: null, sequence: "05", evidenceCount: "4 reviews", finding: "DR-CIC-001 is ready to receive a governed decision in Version 0.5.", concern: "No recommendation is approved while ownership remains conflicting.", next: "Open the Shared Decision Room in Version 0.5." }
];

const decisionPositions = {
  business: { title: "Business Strategist", confidence: "82%", recommendation: "Rebuild the broader Customer Intelligence Capability around a unified customer-service experience.", evidence: ["High customer-service business importance", "Fragmented customer intelligence", "Planned future capabilities", "High potential strategic value"], counter: ["Greater functional-change scope", "Longer delivery risk", "Protected finance reports complicate transition"], assumption: "Finance reporting can tolerate coordinated semantic and integration changes.", consequence: "Business disruption and delayed value." },
  architect: { title: "Chief Enterprise Architect", confidence: "91%", recommendation: "Replatform the Customer Analytics Warehouse first, then decouple the Customer Service Portal incrementally.", evidence: ["Clear Oracle-to-BigQuery compatibility path", "High warehouse technical urgency", "Manageable staged architecture", "Reduced initial change surface"], counter: ["Temporary dual-platform complexity", "Dependency isolation remains necessary"], assumption: "Finance-report compatibility can be preserved during a staged migration.", consequence: "Unexpected reporting breakage and extended dual run." },
  risk: { title: "Risk & Governance Specialist", confidence: "77%", recommendation: "Do not approve either strategy until the twelve Finance Warehouse-dependent reports and their ownership are governed.", evidence: ["Twelve dependent finance reports", "Conflicting ownership across sources", "Executive metric sensitivity", "Incomplete change authority"], counter: ["Delay increases operating cost and platform obsolescence"], assumption: "The organization cannot safely modify or retire reports without confirmed ownership and approval.", consequence: "Financial reporting defects or unauthorized changes." }
};

const decisionTimeline = ["Evidence Received", "Architecture Position Added", "Business Position Added", "Risk Objection Added", "Decision Unresolved", "Human Decision Required"];

const propagationNodes = [
  { id: "strategy", label: "Strategy", owner: "Wave Planning Specialist", reason: "The six-month freeze favors staged replatforming over a broad rebuild." },
  { id: "architecture", label: "Architecture", owner: "Chief Enterprise Architect", reason: "Compatibility views and a dual run protect unchanged finance reports." },
  { id: "timeline", label: "Timeline", owner: "Wave Planning Specialist", reason: "The protected transition extends delivery from four to seven months." },
  { id: "cost", label: "Migration Cost", owner: "Wave Planning Specialist", reason: "Compatibility and reconciliation controls add eleven percent." },
  { id: "risk", label: "Operational Risk", owner: "Risk & Governance Specialist", reason: "The protected boundary reduces operational risk by thirty-four percent." },
  { id: "wave", label: "Wave Planning", owner: "Wave Planning Specialist", reason: "The portal moves behind the warehouse to preserve reporting behavior." },
  { id: "engineering", label: "Engineering Controls", owner: "Chief Enterprise Architect", reason: "Compatibility views, dual run, regression tests, and ownership validation become mandatory." },
  { id: "governance", label: "Governance", owner: "Executive Advisor", reason: "Ownership validation remains open and every revision traces to the Human Constraint." }
];

const propagationWorkObjects = [
  { id: "revised-strategy", title: "Revised Strategy", owner: "Wave Planning Specialist", releaseAt: 0, finding: "Staged replatform replaces the broader rebuild to honor the six-month freeze." },
  { id: "revised-architecture", title: "Revised Architecture", owner: "Chief Enterprise Architect", releaseAt: 1, finding: "Compatibility views and dual-run reconciliation protect the finance boundary." },
  { id: "revised-wave", title: "Revised Wave Plan", owner: "Wave Planning Specialist", releaseAt: 5, finding: "Customer Service Portal moves from Wave 1 to Wave 2; the warehouse remains Wave 1." },
  { id: "risk-control", title: "Risk Control Plan", owner: "Risk & Governance Specialist", releaseAt: 6, finding: "Regression tests and ownership validation become required controls." },
  { id: "impact-summary", title: "Constraint Impact Summary", owner: "Executive Advisor", releaseAt: 7, finding: "Seven-month staged plan, eleven-percent cost increase, and thirty-four-percent risk reduction." }
];

const engineeringContract = {
  id: "EC-DR-CIC-001", caseId: "DR-CIC-001", approvedStrategy: "Staged replatforming", sourcePlatform: "Oracle Customer Analytics Warehouse", targetPlatform: "Google BigQuery",
  migrationStages: ["Stage 1 · Compatibility layer and six-week dual run", "Stage 2 · BigQuery migration after finance-report decoupling"],
  humanConstraints: ["Finance reports must remain unchanged for six months"], protectedDependencies: ["Finance Warehouse", "Twelve dependent finance reports"],
  engineeringControls: ["Compatibility views", "Report-preservation tests", "Dual-run reconciliation", "Executive-metric regression tests", "Ownership and change-authority confirmation before cutover"],
  validationExpectations: ["Schema compatibility", "Row-count reconciliation", "Null-behaviour equivalence", "Aggregate equivalence", "Date-logic equivalence", "Finance-report preservation", "Representative-query comparison"],
  governanceActions: ["Resolve ownership and change authority for twelve reports"], sourceEvidence: ["Human Constraint", "Revised Architecture", "Revised Wave Plan", "Risk-Control Plan", "Approved Revised Plan"], approvalReference: "Mission Commander approval / DR-CIC-001 / V0.6"
};

const engineeringArtifacts = [
  { id: "target-schema", filename: "target_schema.sql", type: "BigQuery DDL", owner: "Modernization Engineer", purpose: "Create the target BigQuery schema.", sourceDecision: "Approved target architecture", sourceConstraint: "Preserve finance-report contracts", sourceEvidence: "Revised Architecture", dependencies: "Engineering Contract", governanceCondition: "Ownership confirmation before cutover", validationStatus: "Not run", nextAction: "Validate schema compatibility", preview: `<pre><code>CREATE TABLE customer_analytics.customer_metrics (\n  customer_id STRING NOT NULL,\n  metric_date DATE,\n  service_cases INT64,\n  revenue NUMERIC\n)\nPARTITION BY metric_date\nCLUSTER BY customer_id;</code></pre><p>Partitioned by metric date and clustered by customer identifier.</p>` },
  { id: "source-mapping", filename: "source_target_mapping.csv", type: "Field mapping", owner: "Modernization Engineer", purpose: "Map Oracle fields to BigQuery targets and transformations.", sourceDecision: "Approved staged migration strategy", sourceConstraint: "Finance semantics remain unchanged", sourceEvidence: "Oracle source metadata", dependencies: "target_schema.sql", governanceCondition: "Mapping changes require governed approval", validationStatus: "Not run", nextAction: "Review mapping compatibility", preview: `<div class="preview-table"><span>ORACLE FIELD</span><span>BIGQUERY FIELD</span><span>RULE</span><span>STATUS</span><span>CUSTOMER_ID</span><span>customer_id</span><span>TO_CHAR</span><span>Compatible</span><span>METRIC_DT</span><span>metric_date</span><span>DATE()</span><span>Review</span></div>` },
  { id: "converted-sql", filename: "customer_metrics_converted.sql", type: "Converted SQL", owner: "Modernization Engineer", purpose: "Translate representative Oracle customer metrics to BigQuery SQL.", sourceDecision: "Compatibility-first migration", sourceConstraint: "Preserve metric results for six months", sourceEvidence: "Representative Oracle SQL", dependencies: "target_schema.sql · source_target_mapping.csv", governanceCondition: "Finance metric behavior cannot change", validationStatus: "Not run", nextAction: "Compare representative query results", preview: `<div class="sql-compare"><div><small>ORACLE / BEFORE</small><pre><code>SELECT NVL(SUM(amount),0)\nFROM customer_metrics\nWHERE TRUNC(metric_dt)=:run_dt;</code></pre></div><div><small>BIGQUERY / AFTER</small><pre><code>SELECT IFNULL(SUM(amount),0)\nFROM customer_metrics\nWHERE DATE(metric_date)=@run_date;</code></pre></div></div><p>Null-handling equivalence requires independent validation.</p>` },
  { id: "reconciliation-tests", filename: "reconciliation_tests.py", type: "Pytest controls", owner: "Modernization Engineer", purpose: "Validate source-versus-target structures and representative metrics.", sourceDecision: "Six-week dual-run control", sourceConstraint: "Finance reports must remain unchanged", sourceEvidence: "Validation thresholds and risk controls", dependencies: "All SQL and mapping artifacts", governanceCondition: "Failures block cutover readiness", validationStatus: "Not run", nextAction: "Run independent validation", preview: `<pre><code>def test_schema_compatibility(): ...\ndef test_row_count_reconciliation(): ...\ndef test_aggregate_equivalence(): ...\ndef test_null_behaviour(): ...</code></pre>` },
  { id: "dual-run-plan", filename: "dual_run_plan.md", type: "Operating plan", owner: "Modernization Engineer", purpose: "Define the six-week parallel operating period.", sourceDecision: "Approved staged replatform", sourceConstraint: "Six-month finance-report freeze", sourceEvidence: "Risk-Control Plan", dependencies: "reconciliation_tests.py", governanceCondition: "Daily exceptions require escalation", validationStatus: "Not run", nextAction: "Approve dual-run exit criteria", preview: `<ol><li>Weeks 1–2: baseline and daily reconciliation</li><li>Weeks 3–4: issue remediation and metric review</li><li>Weeks 5–6: stability evidence and exit decision</li></ol><p>Escalate any finance-report variance; exit only after agreed thresholds pass.</p>` },
  { id: "cutover-checklist", filename: "cutover_checklist.md", type: "Governance checklist", owner: "Modernization Engineer", purpose: "Define cutover prerequisites, approvals, rollback, and ownership confirmation.", sourceDecision: "Approved revised plan", sourceConstraint: "Protected Finance Warehouse boundary", sourceEvidence: "Remaining governance actions", dependencies: "All five prior artifacts", governanceCondition: "Ownership and change authority required", validationStatus: "Not run", nextAction: "Complete final validation gate", preview: `<ul><li>Confirm report ownership and change authority</li><li>Obtain finance-report preservation approval</li><li>Verify rollback readiness</li><li>Pass final independent validation gate</li></ul>` }
];

const engineeringSequence = ["Contract Received", "Engineering Plan Created", "Target Schema Generated", "Mapping Generated", "Converted SQL Generated", "Tests Generated", "Dual-Run Plan Generated", "Cutover Checklist Generated", "Package Assembled", "Validation Handoff Ready"];
const engineeringWorkObjects = [
  { id: "engineering-contract", title: "Engineering Contract", releaseAt: -1 }, { id: "engineering-plan", title: "Engineering Plan", releaseAt: 1 }, { id: "target-schema-object", title: "Target Schema", releaseAt: 2 }, { id: "mapping-object", title: "Source-to-Target Mapping", releaseAt: 3 }, { id: "converted-sql-object", title: "Converted SQL", releaseAt: 4 }, { id: "test-suite-object", title: "Reconciliation Test Suite", releaseAt: 5 }, { id: "dual-run-object", title: "Dual-Run Plan", releaseAt: 6 }, { id: "cutover-object", title: "Cutover Checklist", releaseAt: 7 }, { id: "package-object", title: "Migration Starter Package", releaseAt: 8 }
];

function createMigrationPackage() {
  return { caseId: "DR-CIC-001", contractId: "EC-DR-CIC-001", generatedArtifacts: [], artifactDependencies: {}, lineageReferences: ["DR-CIC-001", "Human Constraint", "Approved Revised Plan"], generationStatus: "Not started", validationStatus: "Not run", governancePrerequisites: ["Resolve ownership and change authority for twelve dependent reports before cutover"], nextAction: "Generate Migration Starter Package" };
}

const validationChecks = [
  { id: "schema", name: "Schema Compatibility", artifact: "target_schema.sql", expected: "Oracle and BigQuery structures satisfy the approved mapping.", initialActual: "All representative fields and types are compatible.", evidence: "Schema diff VC-E01", severity: "Medium", nextAction: "Preserve pass", initialStatus: "Pass" },
  { id: "row-count", name: "Row-Count Reconciliation", artifact: "reconciliation_tests.py", expected: "Source and target row counts reconcile within 0.1%.", initialActual: "0.0% variance across the representative partition.", evidence: "Row-count result VC-E02", severity: "High", nextAction: "Preserve pass", initialStatus: "Pass" },
  { id: "null", name: "Null-Behaviour Equivalence", artifact: "customer_metrics_converted.sql", expected: "Null behavior is equivalent for representative expressions.", initialActual: "Top-level null cases match; nested aggregate condition not yet exercised.", evidence: "Null behavior sample VC-E03", severity: "High", nextAction: "Rerun after regression-test addition", initialStatus: "Pass" },
  { id: "aggregate", name: "Aggregate Equivalence", artifact: "customer_metrics_converted.sql", expected: "Oracle and BigQuery aggregates match within 0.1%.", initialActual: "Quarterly customer-renewal aggregate differs by 1.8%.", evidence: "Aggregate comparison VC-E04", severity: "High", nextAction: "Investigate translated null handling", initialStatus: "Fail" },
  { id: "date", name: "Date-Logic Equivalence", artifact: "customer_metrics_converted.sql", expected: "Oracle TRUNC and BigQuery DATE logic return equivalent periods.", initialActual: "Representative daily and quarterly windows match.", evidence: "Date logic result VC-E05", severity: "Medium", nextAction: "Preserve pass", initialStatus: "Pass" },
  { id: "finance", name: "Finance-Report Preservation", artifact: "dual_run_plan.md", expected: "Twelve finance reports retain unchanged contracts.", initialActual: "Compatibility views preserve all sampled report contracts.", evidence: "Report preservation result VC-E06", severity: "Critical", nextAction: "Preserve pass; retain governance condition", initialStatus: "Pass" },
  { id: "representative", name: "Representative-Query Comparison", artifact: "customer_metrics_converted.sql", expected: "Representative queries return equivalent results.", initialActual: "Six of seven representative queries match; aggregate finding governs correction.", evidence: "Query comparison VC-E07", severity: "High", nextAction: "Rerun impacted query after correction", initialStatus: "Pass" }
];

const validationContract = { caseId: "DR-CIC-001", packageId: "Migration Starter Package", sourcePlatform: "Oracle", targetPlatform: "Google BigQuery", checks: validationChecks.map((check) => check.id), thresholds: { aggregateVariance: "≤ 0.1%", rowCountVariance: "≤ 0.1%" }, constraints: ["Finance reports frozen for six months", "Six-week dual run"], governancePrerequisites: ["Resolve ownership and change authority for twelve dependent reports before cutover"], validationAuthority: "Validation Specialist", correctionApprovalRequired: true };

function createValidationRun() { return { runId: "VR-DR-CIC-001-01", caseId: "DR-CIC-001", packageId: "Migration Starter Package", executedChecks: [], passedChecks: [], failedChecks: [], findings: [], status: "Not started", startedAt: null, completedAt: null }; }
function createCorrectionProposal() { return { proposalId: "CP-DR-CIC-001", failedCheckId: "aggregate", affectedArtifact: "customer_metrics_converted.sql", originalVersion: "v1", correctedVersion: "v2", explanation: "Move null normalization inside the nested CASE expression before aggregation.", addedTests: ["Quarterly renewal null-handling regression test"], impactedChecks: ["null", "aggregate", "representative"], unchangedArtifacts: engineeringArtifacts.filter((item) => item.id !== "converted-sql").map((item) => item.filename), evidenceReferences: ["VC-E03", "VC-E04", "VC-E07"], approvalStatus: "Pending" }; }
function createValidationReport() { return { caseId: "DR-CIC-001", packageId: "Migration Starter Package", initialResults: { checksExecuted: 7, passes: 6, failures: 1 }, correctionApplied: true, rerunResults: { impactedChecks: 3, passes: 3, aggregateVariance: "0.0%" }, finalStatus: "Validated with Conditions", confidence: "High", remainingConditions: ["Resolve ownership and change authority for twelve dependent finance reports before cutover"], nextAction: "Prepare Executive Modernization Roadmap" }; }

const validationWorkObjects = [
  { id: "validation-contract-object", title: "Validation Contract" }, { id: "validation-run-object", title: "Validation Run" }, { id: "validation-finding-object", title: "Validation Finding" }, { id: "failure-investigation-object", title: "Failure Investigation" }, { id: "correction-proposal-object", title: "Correction Proposal" }, { id: "correction-approval-object", title: "Correction Approval" }, { id: "targeted-rerun-object", title: "Targeted Rerun" }, { id: "validation-report-object", title: "Validation Report" }
];

const executiveEvidenceChain = [
  ["portfolio", "Portfolio Evidence", "Ten products assessed; the Customer Intelligence Capability selected."],
  ["architecture", "Architecture Review", "Oracle-to-BigQuery staged replatforming established."],
  ["business", "Business Review", "Customer intelligence value and technical urgency confirmed."],
  ["risk", "Risk Review", "Finance reporting ownership recorded as a governed condition."],
  ["constraint", "Mission Commander Constraint", "Finance reports must remain unchanged for six months."],
  ["revised", "Revised Plan", "Timeline moved to seven months; risk reduced by 34%."],
  ["engineering", "Engineering Package", "Six implementation-ready starter artifacts generated."],
  ["finding", "Validation Finding", "Quarterly renewal aggregate variance of 1.8% detected."],
  ["correction", "Correction", "Null-handling correction approved and applied as version 2."],
  ["report", "Final Validation Report", "Seven of seven critical checks pass with high confidence."],
  ["recommendation", "Executive Recommendation", "Two complementary Wave 1 initiatives proposed."]
].map(([id, label, summary], index) => ({ id, label, summary, sequence: String(index + 1).padStart(2, "0") }));

const executiveRecommendation = {
  id: "ER-DR-CIC-001", caseId: "DR-CIC-001", owner: "Executive Advisor", approvalStatus: "Pending Mission Commander",
  initiatives: [
    { productId: "data-01", name: "Customer Analytics Warehouse", strategy: "Staged Oracle-to-BigQuery replatform", rationale: "Removes critical platform urgency while preserving twelve dependent finance reports through compatibility controls." },
    { productId: "app-01", name: "Supplier Quality Portal", strategy: "Incremental refactor with supplier-inspection extraction", rationale: "Proves a second modernization pattern and releases supplier-quality value without a disruptive full rebuild." }
  ],
  rationale: "Launch one validated data-platform migration and one bounded application refactor. Together they demonstrate portfolio momentum while keeping high-consequence dependencies governed."
};

const roadmapProducts = [
  ["data-01", "Replatform", 1, "Validated path removes critical Oracle urgency.", "Finance Warehouse reports", "Validated with Conditions", "Execution candidate", "Confirm report ownership", "Launch after Wave 1 approval"],
  ["app-01", "Incremental refactor", 1, "Bounded extraction delivers supplier-quality value with lower disruption.", "Manufacturing inspection workflow", "Assessed", "Planning Ready", "Capability boundary approval", "Create four starter objects"],
  ["app-03", "Incremental decouple and replatform", 2, "Customer experience follows the warehouse foundation.", "Customer Analytics Warehouse", "Sequenced After Warehouse", "Architecture Ready", "Protected reporting transition", "Begin after Wave 1 exit"],
  ["data-03", "Rearchitect", 2, "Establish governed supplier data ownership and product boundaries.", "Product Telemetry Platform", "Evidence Incomplete", "Evidence Pending", "Three downstream owners unconfirmed", "Confirm dependency owners"],
  ["data-02", "Replatform", 2, "Modernize plant analytics after higher-consequence foundations.", "Production reporting", "Evidence Ready", "Assessment Ready", "Migration capacity", "Confirm Wave 2 capacity"],
  ["app-02", "Retain and optimize", 3, "Stable operational core does not justify near-term replacement.", "Plant operations controls", "Evidence Ready", "Monitor", "None", "Review optimization backlog"],
  ["app-04", "Retain", 3, "Controlled viewer remains fit while engineering data boundaries mature.", "Engineering file controls", "Evidence Ready", "Monitor", "Configuration ownership", "Document future interface"],
  ["app-05", "Rearchitect", 3, "Order capability needs boundary redesign after core data waves.", "Commercial order services", "Evidence Ready", "Assessment Ready", "Future service boundary", "Complete domain assessment"],
  ["data-04", "Retain and protect", 3, "Financial reporting remains unchanged through the protected transition.", "Twelve dependent finance reports", "Protected Boundary", "Governance Hold", "Ownership and change authority", "Resolve accountable ownership"],
  ["data-05", "Refactor", 3, "Telemetry modernization follows governed supplier-data dependencies.", "Supplier Data Lake", "Evidence Ready", "Sequenced", "Supplier-data ownership", "Begin after Supplier Data Lake" ]
].map(([productId, strategy, wave, rationale, dependency, status, readiness, blocker, nextAction]) => ({ productId, strategy, wave, rationale, dependency, status, readiness, blocker, nextAction }));

const portfolioRoadmap = {
  id: "PR-DR-CIC-001", caseId: "DR-CIC-001", approvalStatus: "Pending Mission Commander",
  baselineWaves: { 1: ["data-01", "app-01"], 2: ["app-03", "data-03", "data-02"], 3: ["app-02", "app-04", "app-05", "data-04", "data-05"] },
  productAssignments: roadmapProducts,
  capacityAssumptions: "Baseline assumes full approved modernization capacity across three governed waves.",
  sequencingRationale: "Sequence validated high-value work first, preserve finance reporting, then modernize dependent data and application boundaries.",
  simulationResult: { reduction: "25%", movedProductId: "data-02", fromWave: 2, toWave: 3, rationale: "Manufacturing Data Mart has lower immediate customer consequence than the other Wave 2 dependencies.", protected: ["Customer Service Portal remains Wave 2", "Supplier Data Lake remains Wave 2 because Product Telemetry depends on it", "Wave 1 remains unchanged"] }
};

const executiveWorkObjects = [
  ["executive-evidence-pack", "Evidence Pack", "Executive Advisor"], ["executive-recommendation-object", "Executive Recommendation", "Executive Advisor"],
  ["portfolio-roadmap-object", "Portfolio Roadmap", "Executive Advisor"], ["wave-one-proposal", "Wave 1 Proposal", "Executive Advisor"],
  ["capacity-simulation", "Capacity Simulation", "Mission Commander"], ["wave-one-approval", "Wave 1 Approval", "Mission Commander"],
  ["executive-decision-record", "Executive Decision Record", "Mission Commander"]
].map(([id, title, owner], index) => ({ id, title, owner, sequence: String(index + 1).padStart(2, "0") }));

function createExecutiveDecisionRecord() {
  return { id: "EDR-DR-CIC-001", caseId: "DR-CIC-001", decision: "Approve Wave 1", approver: "Mission Commander", status: "Execution Ready with Conditions", owner: "Transformation Office", nextAction: "Launch Wave 1", evidenceReference: "Executive Evidence Chain · 11 stages", validationReference: "VC-DR-CIC-001 · 7/7 passed", roadmapReference: "PR-DR-CIC-001 · baseline Wave 1", remainingCondition: "Resolve ownership and change authority for twelve dependent finance reports before cutover" };
}

const guidedDemoSteps = [
  { title: "Portfolio Discovery", objective: "Reveal evidence quality and portfolio dependencies.", expected: "Ten products resolve into ready, incomplete, or conflicting evidence states.", presenter: "Start with evidence, not opinions.", duration: 15 },
  { title: "Capability Formation", objective: "Turn related products into one modernization case.", expected: "Three products form the Customer Intelligence Capability with one external finance dependency.", presenter: "Modernization follows business consequence, not system boundaries.", duration: 18 },
  { title: "Living Workspace", objective: "Make specialist ownership and case progression visible.", expected: "Evidence, Architecture, Business, and Risk reviews attach to one shared case.", presenter: "The work moves; the user never has to hunt for status.", duration: 15 },
  { title: "Shared Decision Room", objective: "Reduce specialist disagreement to one human decision.", expected: "Three governed positions converge on the six-month finance-report question.", presenter: "One human constraint resolves the conflict without hiding it.", duration: 23 },
  { title: "Visible Decision Propagation", objective: "Show one constraint changing the complete plan.", expected: "Strategy, timeline, cost, risk, sequencing, controls, and governance update visibly.", presenter: "The constraint changes only what it causally affects.", duration: 18 },
  { title: "Engineering Workspace", objective: "Turn governed intent into inspectable migration artifacts.", expected: "Codex produces six linked Oracle-to-BigQuery starter artifacts under an explicit contract.", presenter: "Generation is controlled engineering work, not a magic prompt.", duration: 22 },
  { title: "Validation Failure", objective: "Prove that generated output is not automatically trusted.", expected: "Independent validation detects a 1.8% semantic aggregate variance.", presenter: "Codex-generated does not mean validated.", duration: 18 },
  { title: "Correction and Validation Success", objective: "Apply one governed correction and rerun only impacted checks.", expected: "The semantic variance reaches 0.0% and all seven critical checks pass.", presenter: "The human approves one targeted correction; unrelated work is preserved.", duration: 18 },
  { title: "Executive Roadmap and Wave 1 Approval", objective: "Convert traceable evidence into a governed portfolio decision.", expected: "Two initiatives are approved and the case becomes Execution Ready with Conditions.", presenter: "Every recommendation is traceable and every assumption remains challengeable.", duration: 18 }
];

const state = {
  view: "portfolio",
  productId: null,
  agentId: null,
  discovery: "unverified",
  portfolioState: "Unverified",
  capabilityState: null,
  assessmentMode: null,
  assessmentReady: false,
  experience: "mission-control",
  hqEntered: false,
  hqTransition: "idle",
  hqCaseLocation: "portfolio-studio",
  selectedHqAgent: null,
  selectedWorkObjectId: null,
  selectedEnterpriseContextId: null,
  workspaceStage: -1,
  workspaceStatus: "idle",
  workspaceTransition: false,
  workspacePauseRequested: false,
  completedWorkObjectIds: new Set(),
  decisionStatus: "idle",
  decisionStep: -1,
  positionsAttached: new Set(),
  decisionChallengeAttached: false,
  decisionQuestionOpen: false,
  commanderDecision: null,
  humanConstraintAttached: false,
  propagationStatus: "idle",
  propagationStep: -1,
  propagatedNodeIds: new Set(),
  propagationWorkObjectIds: new Set(),
  engineeringEntered: false,
  engineeringStatus: "idle",
  engineeringStep: -1,
  generatedArtifactIds: new Set(),
  engineeringWorkObjectIds: new Set(),
  selectedArtifactId: null,
  migrationPackage: createMigrationPackage(),
  validationEntered: false,
  validationStatus: "idle",
  validationStep: -1,
  validationCheckStatuses: new Map(),
  validationWorkObjectIds: new Set(),
  validationRun: createValidationRun(),
  correctionProposal: createCorrectionProposal(),
  correctedArtifactVersion: "v1",
  regressionTestAttached: false,
  rerunStep: -1,
  validationReport: null,
  executiveEntered: false,
  executiveStatus: "idle",
  executivePrepared: false,
  executiveSelectedEvidence: null,
  selectedRoadmapProductId: null,
  roadmapView: "baseline",
  capacitySimulationActive: false,
  executiveWorkObjectIds: new Set(),
  executiveDecisionRecord: null,
  guidedDemo: false,
  demoPace: "normal",
  productStates: new Map(),
  agentStates: new Map()
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function initializeEntityStates() {
  state.productStates = new Map(products.map((product) => [product.id, "Unverified"]));
  state.agentStates = new Map(agents.map((agent) => [agent.id, "Idle"]));
}

function discoveryResult(product) {
  if (product.name === "Finance Warehouse") return { label: "Conflict Detected", className: "status-conflict", message: "Ownership data conflicts across two sources." };
  if (product.name === "Supplier Data Lake") return { label: "Evidence Incomplete", className: "status-incomplete", message: "Three downstream dependencies have no confirmed owner." };
  return { label: "Evidence Ready", className: "status-ready", message: "Evidence is consistent and ready for assessment." };
}

function stateClass(label) {
  return {
    "Evidence Ready": "status-ready",
    "Evidence Incomplete": "status-incomplete",
    "Conflict Detected": "status-conflict",
    "Assessing": "status-assessing",
    "Assessment Complete": "status-complete",
    "Plan Revised": "status-complete",
    "Sequenced After Warehouse": "status-complete",
    "Protected Boundary": "status-incomplete",
    "Execution Ready with Conditions": "status-complete",
    "Planning Ready": "status-ready"
  }[label] || "";
}

function productCard(product, index) {
  const number = String(index + 1).padStart(2, "0");
  return `<button class="product-card${product.priority ? " is-priority" : ""}" type="button" data-product-id="${product.id}" aria-pressed="false">
    <span class="product-card-top"><span class="product-code">${product.group === "data" ? "DAT" : "APP"}-${number}</span><span class="product-health" aria-label="${product.criticality} criticality"></span></span>
    <h3>${product.name}</h3>
    <span class="product-status">Unverified</span>
    <span class="product-meta"><span>${product.platform}</span><span>${product.criticality}</span></span>
  </button>`;
}

function bindProductCards(root = document) {
  $$("[data-product-id]", root).forEach((card) => card.addEventListener("click", () => selectProduct(card.dataset.productId)));
}

function renderProducts() {
  const applications = products.filter((product) => product.group === "applications");
  const dataProducts = products.filter((product) => product.group === "data");
  $("#applications-grid").innerHTML = applications.map(productCard).join("");
  $("#data-grid").innerHTML = dataProducts.map(productCard).join("");
  bindProductCards($(".portfolio-board"));
}

function setProductState(id, label) {
  state.productStates.set(id, label);
  const card = $(`[data-product-id="${id}"]`);
  if (!card) return;
  card.classList.remove("status-ready", "status-incomplete", "status-conflict", "status-assessing", "status-complete");
  const className = stateClass(label);
  if (className) card.classList.add(className);
  $(".product-status", card).textContent = label;
}

function selectProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  state.productId = id;
  $$("[data-product-id]").forEach((card) => {
    const selected = card.dataset.productId === id;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
  const result = discoveryResult(product);
  const currentState = state.productStates.get(id) || "Unverified";
  const evidenceMessage = state.discovery === "complete"
    ? `<div class="panel-callout ${result.className}">${result.message}</div>`
    : `<div class="panel-callout">Begin Portfolio Discovery to validate this product's evidence and dependencies.</div>`;
  $("#product-panel").innerHTML = `<div class="panel-content">
    <div class="panel-kicker"><span>${product.group === "data" ? "DATA PLATFORM" : "APPLICATION"} / ${product.id.toUpperCase()}</span><button class="panel-close" type="button" aria-label="Close product detail"><svg aria-hidden="true"><use href="#icon-close"></use></svg></button></div>
    <h2>${product.name}</h2><p class="panel-subtitle">${product.platform} · ${product.owner}</p>
    <div class="signal-grid"><div><small>CRITICALITY</small><strong>${product.criticality}</strong></div><div><small>PLATFORM AGE</small><strong>${product.age}</strong></div><div><small>6R SIGNAL</small><strong>${product.disposition}</strong></div><div><small>CURRENT STATE</small><strong>${currentState}</strong></div></div>
    <span class="panel-section-label">BUSINESS CONTEXT</span><p class="panel-summary">${product.summary}</p>${evidenceMessage}
  </div>`;
  $("#product-panel .panel-close").addEventListener("click", clearProduct);
}

function clearProduct() {
  state.productId = null;
  $$("[data-product-id]").forEach((card) => { card.classList.remove("is-selected"); card.setAttribute("aria-pressed", "false"); });
  $("#product-panel").innerHTML = `<div class="panel-empty"><span class="target-reticle" aria-hidden="true"><i></i></span><p class="eyebrow">PRODUCT TELEMETRY</p><h2>Select a product</h2><p>Choose any portfolio card to reveal platform signals, business context, and evidence state.</p></div>`;
}

function renderAgents() {
  const container = $("#agent-nodes");
  container.innerHTML = agents.map((agent) => {
    const radians = agent.angle * Math.PI / 180;
    const left = 50 + Math.cos(radians) * 38;
    const top = 50 + Math.sin(radians) * 39;
    return `<button class="agent-node" type="button" data-agent-id="${agent.id}" aria-pressed="false" style="left:${left}%;top:${top}%"><span class="agent-glyph">${agent.code}</span><span><strong>${agent.name}</strong><small data-agent-status>${agent.role.toUpperCase()}</small></span></button>`;
  }).join("");
  $$("[data-agent-id]").forEach((node) => node.addEventListener("click", () => selectAgent(node.dataset.agentId)));
}

function selectAgent(id) {
  const agent = agents.find((item) => item.id === id);
  if (!agent) return;
  state.agentId = id;
  $$("[data-agent-id]").forEach((node) => { const selected = node.dataset.agentId === id; node.classList.toggle("is-selected", selected); node.setAttribute("aria-pressed", String(selected)); });
  const agentState = state.agentStates.get(id) || "Idle";
  $("#agent-panel").innerHTML = `<div class="panel-content"><div class="panel-kicker"><span>SPECIALIST / ${agent.code}</span><button class="panel-close" type="button" aria-label="Close agent detail"><svg aria-hidden="true"><use href="#icon-close"></use></svg></button></div><h2>${agent.name}</h2><p class="panel-subtitle">${agent.role} · ${agentState}</p><div class="agent-panel-tags"><span>STATE / ${agentState.toUpperCase()}</span><span>CONFIDENCE / MOCKED</span><span>API COST / $0.00</span></div><span class="panel-section-label">MANDATE</span><ul class="mandate-list">${agent.mandate.map((item) => `<li>${item}</li>`).join("")}</ul><div class="signal-grid"><div><small>EVIDENCE</small><strong>${agent.evidence}</strong></div><div><small>GOVERNANCE BOUNDARY</small><strong>${agent.boundary}</strong></div></div><div class="panel-callout">Version 0.3 stops before specialist disagreement begins.</div></div>`;
  $("#agent-panel .panel-close").addEventListener("click", clearAgent);
}

function clearAgent() {
  state.agentId = null;
  $$("[data-agent-id]").forEach((node) => { node.classList.remove("is-selected"); node.setAttribute("aria-pressed", "false"); });
  $("#agent-panel").innerHTML = `<div class="panel-empty"><span class="target-reticle agent-reticle" aria-hidden="true"><i></i></span><p class="eyebrow">SPECIALIST CONTEXT</p><h2>Select an agent</h2><p>Choose a specialist node to inspect its mandate, evidence responsibility, and governance boundary.</p></div>`;
}

function refreshAgentNodes() {
  $$("[data-agent-id]").forEach((node) => {
    const agent = agents.find((item) => item.id === node.dataset.agentId);
    const agentState = state.agentStates.get(agent.id) || "Idle";
    const active = agentState !== "Idle";
    node.classList.toggle("is-active-agent", active);
    $("[data-agent-status]", node).textContent = active ? agentState.toUpperCase() : agent.role.toUpperCase();
  });
}

function setDiscoveryAgents(active) {
  $$("[data-activation-agent]").forEach((chip) => {
    chip.classList.toggle("is-active", active);
    $("small", chip).textContent = active ? "ACTIVE / EVIDENCE REVIEW" : "STANDBY";
  });
  if (active) {
    state.agentStates.set("agent-01", "Investigating");
    state.agentStates.set("agent-04", "Investigating");
  } else if (state.portfolioState === "Unverified") {
    state.agentStates.set("agent-01", "Idle");
    state.agentStates.set("agent-04", "Idle");
  }
  refreshAgentNodes();
}

function revealDependencies() {
  const map = $("#dependency-map");
  map.hidden = false;
  map.classList.remove("is-revealed");
  void map.offsetWidth;
  map.classList.add("is-revealed");
}

function launchEvidenceTokens() {
  const board = $(".portfolio-board");
  const boardBox = board.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "evidence-token-layer";
  layer.setAttribute("aria-hidden", "true");
  board.append(layer);
  let completedTokens = 0;
  $$("[data-product-id]").forEach((card, index) => {
    const cardBox = card.getBoundingClientRect();
    const product = products.find((item) => item.id === card.dataset.productId);
    const result = discoveryResult(product);
    const token = document.createElement("span");
    token.className = `evidence-token${result.className === "status-conflict" ? " is-risk" : ""}${result.className === "status-incomplete" ? " is-incomplete" : ""}`;
    token.style.setProperty("--start-x", `${boardBox.width / 2}px`);
    token.style.setProperty("--start-y", "-18px");
    token.style.setProperty("--end-x", `${cardBox.left - boardBox.left + cardBox.width / 2}px`);
    token.style.setProperty("--end-y", `${cardBox.top - boardBox.top + cardBox.height / 2}px`);
    token.style.setProperty("--token-delay", `${index * 55}ms`);
    token.addEventListener("animationend", (event) => {
      if (event.target !== token) return;
      token.remove();
      completedTokens += 1;
      if (completedTokens === products.length && state.discovery === "running") completeDiscovery();
    }, { once: true });
    layer.append(token);
  });
}

function beginDiscovery() {
  if (state.discovery !== "unverified") return;
  state.discovery = "running";
  state.portfolioState = "Discovery Active";
  const button = $("#begin-discovery");
  button.disabled = true;
  button.firstChild.textContent = "Discovery in progress ";
  $("#portfolio-state").textContent = "DISCOVERY ACTIVE";
  $("#discovery-progress").textContent = "Agents active · resolving portfolio evidence";
  $("#discovery-progress").classList.add("is-running");
  setDiscoveryAgents(true);
  revealDependencies();
  launchEvidenceTokens();
  renderHqState();
}

function completeDiscovery() {
  state.discovery = "complete";
  state.portfolioState = "Discovery Complete";
  products.forEach((product, index) => {
    const result = discoveryResult(product);
    setProductState(product.id, result.label);
    const card = $(`[data-product-id="${product.id}"]`);
    card.classList.add("is-resolved");
    card.style.setProperty("--resolve-delay", `${index * 30}ms`);
  });
  state.agentStates.set("agent-01", "Complete");
  state.agentStates.set("agent-04", "Complete");
  refreshAgentNodes();
  $("#portfolio-state").textContent = "DISCOVERY COMPLETE";
  $(".discovery-state").classList.add("is-complete");
  $("#discovery-progress").textContent = "10 products reviewed · 6 dependency connections revealed";
  $("#discovery-progress").classList.remove("is-running");
  $("#begin-discovery").firstChild.textContent = "Discovery Complete ";
  $("#discovery-summary").hidden = false;
  if (state.productId) selectProduct(state.productId);
  renderHqState();
}

function destinationForProduct(id) {
  if (capabilityProductIds.has(id)) return $("#capability-products");
  if (id === "data-04") return $("#finance-dependency-card");
  if (["app-01", "app-02", "data-02"].includes(id)) return $("#operations-products");
  return $("#enablement-products");
}

function addReasoningSignal(card) {
  const signalText = assessmentSignals[card.dataset.productId];
  if (!signalText || $(".reasoning-signal", card)) return;
  const signal = document.createElement("span");
  signal.className = "reasoning-signal";
  signal.textContent = signalText;
  $("h3", card).insertAdjacentElement("afterend", signal);
}

function reorganizeProducts() {
  const cards = $$("[data-product-id]");
  const previousPositions = new Map(cards.map((card) => [card.dataset.productId, card.getBoundingClientRect()]));
  cards.forEach((card) => {
    card.classList.add("assessment-product", "is-clustering");
    addReasoningSignal(card);
    destinationForProduct(card.dataset.productId).append(card);
  });
  $(".portfolio-layout").hidden = true;
  cards.forEach((card) => {
    const previous = previousPositions.get(card.dataset.productId);
    const current = card.getBoundingClientRect();
    card.style.transition = "none";
    card.style.transform = `translate(${previous.left - current.left}px, ${previous.top - current.top}px)`;
    card.style.opacity = ".68";
  });
  cards.forEach((card) => void card.offsetWidth);
  cards.forEach((card) => {
    card.style.removeProperty("transition");
    card.style.removeProperty("transform");
    card.style.removeProperty("opacity");
  });
}

function setAssessmentAgentStates(stage) {
  agents.forEach((agent) => state.agentStates.set(agent.id, "Idle"));
  if (stage === "running") {
    state.agentStates.set("agent-01", "Investigating");
    state.agentStates.set("agent-02", "Reasoning");
    state.agentStates.set("agent-03", "Reasoning");
  } else if (stage === "complete") {
    assessmentAgentIds.forEach((id) => state.agentStates.set(id, "Complete"));
  }
  refreshAgentNodes();
  $$("[data-assessment-agent]").forEach((persona) => {
    const personaState = state.agentStates.get(persona.dataset.assessmentAgent);
    $("[data-persona-state]", persona).textContent = personaState.toUpperCase();
  });
}

function continueToAssessment() {
  if (state.discovery !== "complete" || state.portfolioState !== "Discovery Complete") return;
  state.portfolioState = "Assessment Running";
  state.capabilityState = "Forming";
  state.assessmentMode = null;
  state.assessmentReady = false;
  clearProduct();
  $("#portfolio-title").textContent = "Modernization Consequence Landscape";
  $("#portfolio-title + p").textContent = "The enterprise is reorganizing around shared modernization consequence and business capability.";
  $("#discovery-console").hidden = true;
  $("#discovery-summary").hidden = true;
  const landscape = $("#assessment-landscape");
  landscape.hidden = false;
  landscape.classList.remove("is-capability-formed");
  $("#assessment-portfolio-state").textContent = "ASSESSMENT RUNNING";
  $("#capability-state").textContent = "FORMING";
  $("#customer-intelligence-cluster").className = "capability-cluster is-forming";
  $("#select-capability").disabled = true;
  capabilityProductIds.forEach((id) => setProductState(id, "Assessing"));
  setAssessmentAgentStates("running");
  reorganizeProducts();
  const agentField = $(".assessment-agent-field");
  agentField.classList.remove("is-complete", "is-assessing");
  void agentField.offsetWidth;
  agentField.classList.add("is-assessing");
  renderHqState();
}

function completeCapabilityFormation() {
  if (state.portfolioState !== "Assessment Running") return;
  state.portfolioState = "Capability Formed";
  state.capabilityState = "Ready for Assessment";
  capabilityProductIds.forEach((id) => setProductState(id, "Assessment Complete"));
  setAssessmentAgentStates("complete");
  $("#assessment-portfolio-state").textContent = "CAPABILITY FORMED";
  $("#capability-state").textContent = "READY FOR ASSESSMENT";
  $("#assessment-landscape").classList.add("is-capability-formed");
  const cluster = $("#customer-intelligence-cluster");
  cluster.classList.remove("is-forming");
  cluster.classList.add("is-ready");
  $("#select-capability").disabled = false;
  $(".assessment-agent-field").classList.add("is-complete");
  renderHqState();
}

function selectCapability() {
  if (state.capabilityState !== "Ready for Assessment" && state.capabilityState !== "Assessment Ready") return;
  $("#customer-intelligence-cluster").classList.add("is-selected");
  $("#capability-inspector").hidden = false;
}

function assessIndividually() {
  if (state.capabilityState !== "Ready for Assessment" && state.capabilityState !== "Assessment Ready") return;
  state.assessmentMode = "individual";
  state.assessmentReady = false;
  state.portfolioState = "Capability Formed";
  state.capabilityState = "Ready for Assessment";
  $("#assessment-portfolio-state").textContent = "CAPABILITY FORMED";
  $("#capability-state").textContent = "READY FOR ASSESSMENT";
  $("#customer-intelligence-cluster").classList.remove("is-initiative");
  $("#initiative-confirmation").hidden = true;
  $("#decision-room-handoff").hidden = true;
  $("#assess-individually").classList.add("is-selected");
  $("#assess-initiative").classList.remove("is-selected");
  $$("#capability-products .product-card").forEach((card) => card.classList.add("is-individual-choice"));
  $("#assessment-choice-status").textContent = "Individual assessment selected · three product tracks prepared.";
  renderHqState();
}

function assessAsInitiative() {
  if (state.capabilityState !== "Ready for Assessment" && state.capabilityState !== "Assessment Ready") return;
  state.assessmentMode = "initiative";
  state.assessmentReady = true;
  state.portfolioState = "Assessment Ready";
  state.capabilityState = "Assessment Ready";
  $("#assessment-portfolio-state").textContent = "ASSESSMENT READY";
  $("#capability-state").textContent = "ASSESSMENT READY";
  const cluster = $("#customer-intelligence-cluster");
  cluster.classList.remove("is-initiative");
  void cluster.offsetWidth;
  cluster.classList.add("is-initiative");
  $("#initiative-confirmation").hidden = false;
  $("#decision-room-handoff").hidden = false;
  $("#assess-individually").classList.remove("is-selected");
  $("#assess-initiative").classList.add("is-selected");
  $$("#capability-products .product-card").forEach((card) => card.classList.remove("is-individual-choice"));
  $("#assessment-choice-status").textContent = "One initiative selected · shared assessment boundary confirmed.";
  renderHqState();
}

function hqNextAction() {
  if (state.executiveStatus === "approved") return "LAUNCH WAVE 1";
  if (state.executivePrepared) return "MISSION COMMANDER WAVE 1 DECISION";
  if (state.executiveStatus === "preparing") return "PREPARING EXECUTIVE ROADMAP";
  if (state.executiveEntered) return "PREPARE EXECUTIVE ROADMAP";
  if (state.validationStatus === "complete") return "PREPARE EXECUTIVE MODERNIZATION ROADMAP";
  if (state.validationStatus === "rerunning") return "RERUN IMPACTED VALIDATION";
  if (state.validationStatus === "correction-applied") return "RERUN IMPACTED VALIDATION";
  if (["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus)) return "MISSION COMMANDER CORRECTION DECISION";
  if (state.validationStatus === "exception") return "INVESTIGATE VALIDATION FAILURE";
  if (state.validationStatus === "running") return "RUNNING INDEPENDENT VALIDATION";
  if (state.validationStatus === "contract-review") return "RUN INDEPENDENT VALIDATION";
  if (state.engineeringStatus === "validation-ready") return "RUN INDEPENDENT VALIDATION";
  if (state.engineeringStatus === "package-generated") return "ASSEMBLE MIGRATION PACKAGE";
  if (state.engineeringStatus === "generating") return "GENERATING MIGRATION STARTER PACKAGE";
  if (state.engineeringStatus === "contract-review") return "GENERATE MIGRATION STARTER PACKAGE";
  if (state.propagationStatus === "approved") return "GENERATE MIGRATION STARTER PACKAGE";
  if (state.propagationStatus === "complete") return "APPROVE REVISED PLAN";
  if (state.propagationStatus === "running") return "PROPAGATING HUMAN CONSTRAINT";
  if (state.decisionStatus === "ready-replanning") return "PROPAGATE CONSTRAINT";
  if (state.decisionStatus === "waiting-evidence") return "RETURN TO DECISION GATE";
  if (state.decisionStatus === "unresolved") return "RESOLVE DECISION";
  if (state.decisionStatus === "assembling") return "ATTACH SPECIALIST POSITIONS";
  if (state.workspaceStatus === "blocked") return "GOVERNED DECISION REQUIRED";
  if (state.workspaceStatus === "paused") return "RESUME WORKSPACE";
  if (state.workspaceStatus === "running") return workspaceWorkObjects[state.workspaceStage].next.toUpperCase();
  if (state.hqCaseLocation === "decision-room") return "START WORKSPACE FLOW";
  if (state.assessmentReady) return "ENTER SHARED DECISION ROOM";
  if (state.portfolioState === "Capability Formed") return "CHOOSE ASSESSMENT BOUNDARY";
  if (state.portfolioState === "Assessment Running") return "FORMING CAPABILITY";
  if (state.portfolioState === "Discovery Complete") return "CONTINUE TO ASSESSMENT";
  if (state.discovery === "running") return "EVIDENCE REVIEW IN PROGRESS";
  return "BEGIN DISCOVERY IN MISSION CONTROL";
}

function currentCaseSnapshot(caseId = activeCaseId()) {
  if (caseId === "DR-SQP-002") {
    const snapshot = programIntelligence.caseSnapshot(caseId);
    return { ...snapshot, ownerId: { "Chief Enterprise Architect": "agent-02", "Business Strategist": "agent-03", "Risk & Governance Specialist": "agent-04" }[snapshot.owner] || null, recommendation: snapshot.recommendation.toUpperCase() };
  }
  if (state.executiveStatus === "approved") return { stage: "Execution Ready with Conditions", owner: "Transformation Office", ownerId: null, task: "Wave 1 approved", blocker: "Governance ownership prerequisite before cutover", next: "Launch Wave 1", evidence: "11-stage evidence chain · 7 of 7 checks passed", recommendation: "WAVE 1 APPROVED" };
  if (state.executivePrepared) return { stage: "Executive Decision Pending", owner: "Mission Commander", ownerId: null, task: state.executiveStatus === "revision-requested" ? "Revised roadmap requested" : "Review Wave 1 proposal", blocker: "Mission Commander Wave 1 approval required", next: state.executiveStatus === "revision-requested" ? "Review evidence and revise roadmap" : "Approve Wave 1", evidence: "Executive Recommendation + Portfolio Roadmap", recommendation: "TWO WAVE 1 INITIATIVES" };
  if (state.executiveStatus === "preparing") return { stage: "Executive Synthesis", owner: "Executive Advisor", ownerId: "agent-08", task: "Prepare Executive Modernization Roadmap", blocker: "None", next: "Publish recommendation for Mission Commander", evidence: "11-stage governed evidence chain", recommendation: "SYNTHESIS IN PROGRESS" };
  if (state.executiveEntered) return { stage: "Executive Review", owner: "Executive Advisor", ownerId: "agent-08", task: "Trace validation evidence", blocker: "None", next: "Prepare Executive Roadmap", evidence: "Validation Complete · High confidence", recommendation: "EVIDENCE REVIEW" };
  if (state.validationStatus === "complete") return { stage: "Validation Complete", owner: "Executive Advisor", ownerId: "agent-08", task: "Validated with Conditions", blocker: "Governance prerequisite before cutover", next: "Prepare Executive Modernization Roadmap", evidence: "7 of 7 critical checks passed · High confidence", recommendation: "VALIDATED WITH CONDITIONS" };
  if (state.validationStatus === "rerunning") return { stage: "Targeted Rerun", owner: "Validation Specialist", ownerId: "agent-07", task: `Rerun ${validationChecks.find((check) => check.id === ["null", "aggregate", "representative"][state.rerunStep])?.name}`, blocker: "None", next: "Complete impacted checks", evidence: `${state.rerunStep} of 3 impacted checks rerun`, recommendation: "CORRECTION UNDER VALIDATION" };
  if (state.validationStatus === "correction-applied") return { stage: "Correction Applied", owner: "Validation Specialist", ownerId: "agent-07", task: "Correction v2 and regression test attached", blocker: "None", next: "Rerun Impacted Validation", evidence: "Mission Commander approval attached", recommendation: "TARGETED RERUN REQUIRED" };
  if (["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus)) return { stage: "Correction Proposed", owner: state.validationStatus === "evidence-requested" ? "Modernization Engineer" : "Mission Commander", ownerId: state.validationStatus === "evidence-requested" ? "agent-06" : null, task: state.validationStatus === "evidence-requested" ? "Provide targeted correction evidence" : "Review governed correction proposal", blocker: "Mission Commander approval required", next: state.validationStatus === "evidence-requested" ? "Return to Correction Gate" : "Approve Correction and Rerun", evidence: "Failed validation evidence + Codex proposal", recommendation: "CORRECTION NOT APPLIED" };
  if (state.validationStatus === "exception") return { stage: "Validation Exception", owner: "Validation Specialist", ownerId: "agent-07", task: "Investigate Aggregate Equivalence failure", blocker: "Quarterly renewal aggregate differs by 1.8%", next: "Investigate Failure", evidence: "6 passes · 1 high-severity failure", recommendation: "PACKAGE NOT TRUSTED" };
  if (state.validationStatus === "running") return { stage: "Validation In Progress", owner: "Validation Specialist", ownerId: "agent-07", task: `Execute ${validationChecks[state.validationStep]?.name}`, blocker: "None", next: validationChecks[state.validationStep + 1]?.name || "Publish validation result", evidence: `${state.validationRun.executedChecks.length} of 7 checks executed`, recommendation: "INDEPENDENT VALIDATION RUNNING" };
  if (state.validationStatus === "contract-review") return { stage: "Validation In Progress", owner: "Validation Specialist", ownerId: "agent-07", task: "Review Validation Contract", blocker: "None", next: "Run Independent Validation", evidence: "Validation Contract attached", recommendation: "PACKAGE NOT YET VALIDATED" };
  if (state.engineeringStatus === "validation-ready") return { stage: "Validation Ready", owner: "Validation Specialist", ownerId: "agent-07", task: "Migration Starter Package ready", blocker: "Governance prerequisite before cutover", next: "Run Independent Validation", evidence: `${state.generatedArtifactIds.size} generated artifacts + Engineering Contract`, recommendation: "MIGRATION STARTER PACKAGE" };
  if (state.engineeringStatus === "package-generated") return { stage: "Engineering Package Generated", owner: "Modernization Engineer", ownerId: "agent-06", task: "Assemble validation handoff", blocker: "Governance prerequisite before cutover", next: "Assemble Migration Starter Package", evidence: `${state.generatedArtifactIds.size} generated artifacts`, recommendation: "PACKAGE GENERATED / NOT VALIDATED" };
  if (state.engineeringStatus === "generating") { const label = engineeringSequence[state.engineeringStep]; return { stage: "Engineering In Progress", owner: "Modernization Engineer", ownerId: "agent-06", task: label, blocker: "None", next: engineeringSequence[state.engineeringStep + 1] || "Assemble package", evidence: `${state.generatedArtifactIds.size} of 6 artifacts generated`, recommendation: "ENGINEERING PACKAGE IN PROGRESS" }; }
  if (state.engineeringStatus === "contract-review") return { stage: "Engineering In Progress", owner: "Modernization Engineer", ownerId: "agent-06", task: "Review Engineering Contract", blocker: "None", next: "Generate Migration Starter Package", evidence: "Engineering Contract attached", recommendation: "GOVERNED ENGINEERING INTENT" };
  if (state.propagationStatus === "approved") return { stage: "Engineering Ready", owner: "Modernization Engineer", ownerId: "agent-06", task: "Approved revised plan attached", blocker: "None", next: "Generate Migration Starter Package", evidence: "5 revised work objects + Human Constraint", recommendation: "STAGED REPLATFORM APPROVED" };
  if (state.propagationStatus === "complete") return { stage: "Revised Plan Ready", owner: "Mission Commander", ownerId: null, task: "Review propagated plan", blocker: "Revised plan requires human approval", next: "Approve Revised Plan", evidence: "8 propagated impacts + 5 work objects", recommendation: "STAGED REPLATFORM / APPROVAL PENDING" };
  if (state.propagationStatus === "running") { const node = propagationNodes[state.propagationStep]; return { stage: "Decision Propagating", owner: "Wave Planning Specialist", ownerId: "agent-05", task: `Coordinate ${node.label} update with ${node.owner}`, blocker: "None", next: `Propagate to ${propagationNodes[state.propagationStep + 1]?.label || "revised-plan approval"}`, evidence: `${state.propagatedNodeIds.size} of 8 impacts attached`, recommendation: "STAGED REPLATFORM / REVISING" }; }
  if (state.decisionStatus === "ready-replanning") return { stage: "Ready for Replanning", owner: "Wave Planning Specialist", ownerId: "agent-05", task: "Human Constraint attached", blocker: "Report ownership remains a governance action", next: "Propagate Constraint", evidence: "4 reviews + Mission Commander decision", recommendation: state.commanderDecision === "yes" ? "STAGED REPLATFORM WITH SIX-MONTH FREEZE" : "GOVERNED CHANGE PATH APPROVED" };
  if (state.decisionStatus === "waiting-evidence") return { stage: "Waiting", owner: "Portfolio Intelligence Specialist", ownerId: "agent-01", task: "Collect targeted decision evidence", blocker: "Four evidence requests are pending", next: "Return to Decision Gate", evidence: "Targeted requests issued", recommendation: "DECISION DEFERRED" };
  if (["unresolved", "assembling"].includes(state.decisionStatus)) return { stage: state.decisionStatus === "unresolved" ? "Decision Unresolved" : "Decision Pending", owner: "Mission Commander", ownerId: null, task: state.decisionStatus === "unresolved" ? "Human Decision Required" : "Specialist positions assembling", blocker: "Finance reporting constraint requires a human decision", next: state.decisionStatus === "unresolved" ? "Resolve Decision" : "Complete position assembly", evidence: `${state.positionsAttached.size} specialist positions attached`, recommendation: "MULTIPLE GOVERNED POSITIONS" };
  if (state.workspaceStatus === "blocked" || state.workspaceStage === 4) {
    return { stage: "Decision Pending", owner: "Mission Commander", ownerId: null, task: "Waiting for Mission Commander.", blocker: "Finance Warehouse reporting dependency and conflicting ownership evidence", next: "Assemble Decision Positions", evidence: "4 completed specialist reviews", recommendation: "PENDING GOVERNED DECISION" };
  }
  if (state.workspaceStage >= 0) {
    const workObject = workspaceWorkObjects[state.workspaceStage];
    return { stage: workObject.stage, owner: workObject.owner, ownerId: workObject.agentId, task: workObject.title, blocker: "None", next: state.workspaceStatus === "paused" ? "Resume the stored workspace flow" : workObject.next, evidence: `${workObject.evidenceCount} attached`, recommendation: "PENDING SPECIALIST REVIEW" };
  }
  if (state.assessmentReady) return { stage: "Ready to Start", owner: "Portfolio Intelligence Specialist", ownerId: "agent-01", task: "Prepare evidence handoff", blocker: "None", next: state.hqCaseLocation === "decision-room" ? "Start Workspace Flow" : "Enter Modernization HQ", evidence: "4 governed sources ready", recommendation: "PENDING SPECIALIST REVIEW" };
  if (state.capabilityState) return { stage: state.capabilityState, owner: "Portfolio Intelligence Specialist", ownerId: "agent-01", task: "Confirm assessment boundary", blocker: "None", next: hqNextAction(), evidence: "3 capability packages", recommendation: "NOT STARTED" };
  return { stage: state.portfolioState, owner: "Portfolio Intelligence Specialist", ownerId: "agent-01", task: "Collect portfolio evidence", blocker: "None", next: hqNextAction(), evidence: state.discovery === "complete" ? "10 products reviewed" : "Portfolio inventory pending", recommendation: "NOT STARTED" };
}

function workObjectStatus(index) {
  const workObject = workspaceWorkObjects[index];
  if (index === 4 && state.decisionStatus === "ready-replanning") return "Complete";
  if (index === 4 && state.decisionStatus === "waiting-evidence") return "Waiting";
  if (state.completedWorkObjectIds.has(workObject.id)) return "Complete";
  if (state.workspaceStage === 4 && index === 4) return "Blocked";
  if (state.workspaceStage === index && state.workspaceStatus === "paused") return "Waiting";
  if (state.workspaceStage === index && state.workspaceStatus === "running") return "In Review";
  if (state.workspaceStage < 0 && index === 0 && state.assessmentReady) return "Incoming";
  return "Waiting";
}

function enterpriseContextStatus(id, snapshot) {
  if (id === "initiative") return state.executiveStatus === "approved" ? "WAVE 1 AUTHORIZED" : "ACTIVE";
  if (id === "portfolio") return state.portfolioState.toUpperCase();
  if (id === "program") {
    if (state.executiveStatus === "approved") return "WAVE 1 APPROVED";
    if (state.executiveEntered) return "EXECUTIVE REVIEW";
    if (state.engineeringEntered || state.validationEntered) return "DELIVERY READINESS";
    return state.capabilityState ? "ACTIVE" : "AWAITING CASE FORMATION";
  }
  return snapshot.stage.toUpperCase();
}

function renderEnterpriseContext() {
  if (!enterpriseContext?.validateHierarchy()) return;
  const snapshot = currentCaseSnapshot();
  $$('[data-enterprise-context-rail]').forEach((rail) => {
    if (rail.childElementCount) return;
    rail.innerHTML = enterpriseContext.levels.map((node, index) => `${index ? '<i aria-hidden="true">→</i>' : ""}<button type="button" data-enterprise-context-id="${node.id}" aria-pressed="false"><small>${node.type.toUpperCase()}</small><strong>${node.name}</strong><span>${node.id === "case" ? node.reference : node.owner}</span><em data-enterprise-context-status="${node.id}">${enterpriseContextStatus(node.id, snapshot)}</em></button>`).join("");
  });
  $$('[data-enterprise-context-status]').forEach((node) => {
    node.textContent = enterpriseContextStatus(node.dataset.enterpriseContextStatus, snapshot);
  });
  $$('[data-enterprise-context-id]').forEach((button) => {
    const selected = button.dataset.enterpriseContextId === state.selectedEnterpriseContextId;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  $$('[data-enterprise-context-detail]').forEach((detail) => {
    const node = enterpriseContext.getLevel(state.selectedEnterpriseContextId);
    detail.hidden = !node;
    if (!node) { detail.innerHTML = ""; return; }
    const owner = node.id === "case" ? snapshot.owner : node.owner;
    const nextResponsibility = node.id === "case" ? snapshot.next : node.nextResponsibility;
    detail.innerHTML = `<div class="enterprise-context-detail-heading"><div><small>${node.type.toUpperCase()} / ${node.reference}</small><h3>${node.name}</h3></div><strong>${enterpriseContextStatus(node.id, snapshot)}</strong></div><div class="enterprise-context-detail-grid"><span><small>ACCOUNTABLE OWNER</small><strong>${owner}</strong></span><span><small>PURPOSE</small><strong>${node.purpose}</strong></span><span><small>EXPECTED BUSINESS OUTCOME</small><strong>${node.outcome}</strong></span><span><small>RELATIONSHIP</small><strong>${node.relationship}</strong></span><span><small>NEXT RESPONSIBILITY</small><strong>${nextResponsibility}</strong></span></div>`;
  });
}

function renderProgramIntelligence() {
  if (!programIntelligence?.validateModel()) return;
  const summary = programIntelligence.programSummary();
  const active = programIntelligence.caseSnapshot();
  const objects = programIntelligence.workObjectsForCase();
  $$('[data-program-intelligence]').forEach((panel) => {
    panel.innerHTML = `<header><div><small>V1.2 / MULTI-CASE PROGRAM</small><strong>${summary.name}</strong></div><span>${summary.caseCount} GOVERNED CASES</span></header>
      <div class="program-overview"><div><small>PROGRAM OWNER</small><strong>${summary.owner}</strong></div><div><small>READINESS</small><strong>${summary.readiness}</strong></div><div><small>PROGRAM BLOCKER</small><strong>${summary.blocker}</strong></div></div>
      <div class="program-case-grid">${Object.values(programIntelligence.cases).map((item) => { const snapshot = currentCaseSnapshot(item.id); const selected = item.id === active.id; return `<article class="program-case${selected ? " is-selected" : ""}" data-program-case-card="${item.id}"><div><small>${item.type.toUpperCase()} / ${item.id}</small><h3>${item.name}</h3></div><p>${item.purpose}</p><dl><div><dt>STATUS</dt><dd>${snapshot.stage}</dd></div><div><dt>OWNER</dt><dd>${snapshot.owner}</dd></div><div><dt>BLOCKER</dt><dd>${snapshot.blocker}</dd></div><div><dt>NEXT</dt><dd>${snapshot.next}</dd></div></dl><button type="button" data-program-action="select" data-case-id="${item.id}" ${selected ? "disabled" : ""}>${selected ? "Selected Case" : "Select Case"}</button><button type="button" data-program-action="inspect" data-case-id="${item.id}">Inspect Case</button></article>`; }).join("")}</div>
      <section class="active-case-work"><header><div><small>ACTIVE CASE / ${active.id}</small><strong>${active.name}</strong></div><span>${active.stage.toUpperCase()}</span></header><div class="case-work-facts"><button type="button" data-program-action="inspect-owner"><small>CURRENT OWNER</small><strong>${active.owner}</strong></button><button type="button" data-program-action="inspect-blocker"><small>CURRENT BLOCKER</small><strong>${active.blocker}</strong></button><button type="button" data-program-action="inspect-next"><small>NEXT ACTION</small><strong>${active.next}</strong></button></div>
      <div class="program-workflow">${programIntelligence.WORKFLOW.map((stage, index) => `<span class="${index < active.stageIndex ? "is-complete" : index === active.stageIndex ? "is-active" : ""}"><i>${index + 1}</i><strong>${stage.stage}</strong></span>`).join("")}</div>
      <div class="program-work-objects">${objects.map((object) => `<button type="button" data-program-action="inspect-object" data-object-id="${object.id}" ${object.lifecycle === "locked" ? "disabled" : ""}><small>${object.caseId} · ${object.lifecycle.toUpperCase()}</small><strong>${object.title}</strong><span>${object.owner}</span></button>`).join("")}</div>
      <div class="program-actions"><button type="button" data-program-action="return-program">Return to Program</button>${isSupplierCase() ? `<button type="button" data-program-action="advance" ${active.stage === "Decision Pending" || active.paused ? "disabled" : ""}>${active.stageIndex === 0 ? "Start Supplier Quality Journey" : "Complete Current Review"}</button><button type="button" data-program-action="pause" ${active.paused || active.stage === "Decision Pending" ? "disabled" : ""}>Pause Case</button><button type="button" data-program-action="resume" ${active.paused ? "" : "disabled"}>Resume Case</button><button type="button" data-program-action="reset">Reset Current Case</button>` : ""}</div>
      <div class="program-inspector" data-program-inspector hidden aria-live="polite"></div></section>
      <footer><strong>PROGRAM SEQUENCE</strong><span>${summary.sequence.join(" → ")}</span><p>${summary.rationale}</p><div><small>SHARED DEPENDENCY · REPRESENTED ONCE</small><strong>${summary.sharedDependencies[0].name}</strong><span>Direct: Supplier Quality Portal Modernization · ${summary.sharedDependencies[0].status}</span></div></footer>`;
  });
}

function inspectProgramItem(title, body) {
  $$('[data-program-inspector]').forEach((panel) => { panel.hidden = false; panel.innerHTML = `<small>PROGRAM INSPECTION</small><h3>${title}</h3><p>${body}</p>`; });
}

function handleProgramAction(button) {
  const action = button.dataset.programAction;
  const caseId = button.dataset.caseId;
  if (action === "select") { programIntelligence.selectCase(caseId); state.selectedWorkObjectId = null; renderHqState(); return; }
  if (action === "inspect") { const item = programIntelligence.cases[caseId]; inspectProgramItem(`${item.name} / ${item.id}`, `${item.purpose} Application owner: ${item.applicationOwner}. Technical owner: ${item.technicalOwner}. Dependencies: ${item.dependencies.join(", ")}. Evidence lineage: ${item.lineage.join(" → ")}.`); return; }
  const snapshot = programIntelligence.caseSnapshot();
  if (action === "inspect-owner") inspectProgramItem(`Current owner · ${snapshot.owner}`, snapshot.task);
  if (action === "inspect-blocker") inspectProgramItem(`Current blocker · ${snapshot.blocker}`, snapshot.blocker === "None" ? "No blocker prevents the next governed review." : "The blocker remains attached only to this case.");
  if (action === "inspect-next") inspectProgramItem(`Next action · ${snapshot.next}`, `Current evidence: ${snapshot.evidence}.`);
  if (action === "inspect-object") { const object = programIntelligence.workObjectsForCase().find((item) => item.id === button.dataset.objectId); inspectProgramItem(`${object.title} · ${object.lifecycle}`, `Owner: ${object.owner}. Evidence: ${object.evidence}. Dependencies: ${object.dependencies.join(", ")}. Next: ${object.next}.`); }
  if (action === "advance") { programIntelligence.advanceCase(); renderHqState(); }
  if (action === "pause") { programIntelligence.pauseCase(); renderHqState(); }
  if (action === "resume") { programIntelligence.resumeCase(); renderHqState(); }
  if (action === "reset") { programIntelligence.resetCase(); renderHqState(); }
  if (action === "return-program") { inspectProgramItem("Program coordination", programIntelligence.programSummary().rationale); }
}

function selectEnterpriseContext(id) {
  if (!enterpriseContext?.getLevel(id)) return;
  state.selectedEnterpriseContextId = state.selectedEnterpriseContextId === id ? null : id;
  renderEnterpriseContext();
}

function renderMissionCase() {
  const snapshot = currentCaseSnapshot();
  $(".mission-case-identity strong").textContent = programIntelligence?.cases[activeCaseId()]?.name || "Customer Intelligence Capability";
  $("#mission-case-stage").textContent = snapshot.stage.toUpperCase();
  $("#mission-case-owner").textContent = snapshot.owner.toUpperCase();
  $("#mission-case-blocker").textContent = snapshot.blocker.toUpperCase();
  $("#mission-case-next").textContent = snapshot.next.toUpperCase();
  $("#mission-artifact-count").textContent = String(state.generatedArtifactIds.size);
  $("#mission-validation-status").textContent = state.migrationPackage.validationStatus.toUpperCase();
  $("#mission-roadmap-status").textContent = state.executiveStatus === "approved" ? "WAVE 1 APPROVED" : state.capacitySimulationActive ? "SIMULATION PREVIEW" : state.executivePrepared ? "BASELINE READY" : "NOT PREPARED";
  $("#mission-case-dock").classList.toggle("is-blocked", snapshot.blocker !== "None");
  renderEnterpriseContext();
  renderProgramIntelligence();
}

function renderWorkObjects() {
  if (isSupplierCase()) {
    const objects = programIntelligence.workObjectsForCase();
    $("#workspace-work-objects").innerHTML = objects.filter((item) => item.lifecycle !== "locked").map((item, index) => `<button class="work-object status-${item.lifecycle}" type="button" data-program-action="inspect-object" data-object-id="${item.id}"><span class="work-object-sequence">${String(index + 1).padStart(2, "0")}</span><span><strong>${item.title}</strong><small>${item.owner}</small></span><em>${item.caseId}</em><b>${item.lifecycle.toUpperCase()}</b></button>`).join("");
    return;
  }
  const availableThrough = state.workspaceStage >= 0 ? state.workspaceStage : state.assessmentReady ? 0 : -1;
  const availableWorkObjects = workspaceWorkObjects.slice(0, availableThrough + 1);
  $("#workspace-work-objects").innerHTML = availableWorkObjects.length ? availableWorkObjects.map((workObject) => {
    const index = workspaceWorkObjects.indexOf(workObject);
    const status = workObjectStatus(index);
    const selected = state.selectedWorkObjectId === workObject.id;
    return `<button class="work-object status-${status.toLowerCase().replaceAll(" ", "-")}${selected ? " is-selected" : ""}" type="button" data-work-object="${workObject.id}" aria-pressed="${selected}"><span class="work-object-sequence">${workObject.sequence}</span><span><strong>${workObject.title}</strong><small>${workObject.owner}</small></span><em>${workObject.evidenceCount}</em><b>${status.toUpperCase()}</b></button>`;
  }).join("") : `<div class="work-object-empty"><strong>WORK OBJECTS NOT YET RELEASED</strong><small>Complete capability assessment to prepare the Evidence Package.</small></div>`;
  if (state.humanConstraintAttached) $("#workspace-work-objects").insertAdjacentHTML("beforeend", `<button class="work-object status-incoming" type="button" data-work-object="constraint"><span class="work-object-sequence">06</span><span><strong>Human Constraint</strong><small>Mission Commander</small></span><em>DR-CIC-001</em><b>ATTACHED</b></button>`);
  propagationWorkObjects.filter((item) => state.propagationWorkObjectIds.has(item.id)).forEach((item, index) => $("#workspace-work-objects").insertAdjacentHTML("beforeend", `<button class="work-object status-complete" type="button" data-work-object="${item.id}"><span class="work-object-sequence">${String(index + 7).padStart(2, "0")}</span><span><strong>${item.title}</strong><small>${item.owner}</small></span><em>DR-CIC-001</em><b>ATTACHED</b></button>`));
  engineeringWorkObjects.filter((item) => state.engineeringWorkObjectIds.has(item.id)).forEach((item, index) => $("#workspace-work-objects").insertAdjacentHTML("beforeend", `<button class="work-object status-complete" type="button" data-work-object="${item.id}"><span class="work-object-sequence">${String(index + 12).padStart(2, "0")}</span><span><strong>${item.title}</strong><small>${item.id === "engineering-contract" ? "Mission Commander" : "Modernization Engineer"}</small></span><em>DR-CIC-001</em><b>ATTACHED</b></button>`));
  validationWorkObjects.filter((item) => state.validationWorkObjectIds.has(item.id)).forEach((item, index) => $("#workspace-work-objects").insertAdjacentHTML("beforeend", `<button class="work-object status-complete" type="button" data-work-object="${item.id}"><span class="work-object-sequence">${String(index + 21).padStart(2, "0")}</span><span><strong>${item.title}</strong><small>${item.id.includes("correction") ? "Mission Commander" : "Validation Specialist"}</small></span><em>DR-CIC-001</em><b>ATTACHED</b></button>`));
  executiveWorkObjects.filter((item) => state.executiveWorkObjectIds.has(item.id)).forEach((item, index) => $("#workspace-work-objects").insertAdjacentHTML("beforeend", `<button class="work-object status-complete" type="button" data-work-object="${item.id}"><span class="work-object-sequence">${String(index + 29).padStart(2, "0")}</span><span><strong>${item.title}</strong><small>${item.owner}</small></span><em>DR-CIC-001</em><b>ATTACHED</b></button>`));
}

function renderWorkQueue() {
  const statuses = ["Incoming", "In Review", "Waiting", "Blocked", "Complete"];
  if (isSupplierCase()) {
    const snapshot = programIntelligence.caseSnapshot();
    const lane = snapshot.stage === "Decision Pending" ? "Waiting" : snapshot.paused ? "Waiting" : snapshot.stageIndex === 0 ? "Incoming" : "In Review";
    const objects = programIntelligence.workObjectsForCase();
    $("#workspace-queue").innerHTML = statuses.map((status) => `<div class="queue-lane status-${status.toLowerCase().replaceAll(" ", "-")}${status === lane ? " is-current" : ""}"><span><strong>${status}</strong><small>${objects.filter((item) => item.lifecycle.toLowerCase().replace("-", " ") === status.toLowerCase()).length}</small></span>${status === lane ? `<div class="queue-case-chip"><i></i><span>${snapshot.name}<small>${snapshot.stage}</small></span></div>` : ""}<div class="queue-items">${objects.filter((item) => item.lifecycle === (status === "In Review" ? "in-review" : status.toLowerCase())).map((item) => `<small>${item.title}</small>`).join("") || "<small>NO WORK OBJECTS</small>"}</div></div>`).join("");
    return;
  }
  const activeQueue = state.validationStatus === "complete" ? "Complete" : state.validationStatus === "exception" ? "Blocked" : ["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus) ? "Waiting" : ["running", "rerunning"].includes(state.validationStatus) ? "In Review" : ["contract-review", "correction-applied"].includes(state.validationStatus) ? "Incoming" : state.engineeringStatus === "validation-ready" ? "Complete" : state.engineeringStatus === "package-generated" ? "Waiting" : state.engineeringStatus === "generating" ? "In Review" : state.engineeringStatus === "contract-review" ? "Incoming" : state.propagationStatus === "approved" ? "Complete" : state.propagationStatus === "complete" ? "Waiting" : state.propagationStatus === "running" ? "In Review" : state.decisionStatus === "ready-replanning" ? "Incoming" : state.decisionStatus === "waiting-evidence" ? "Waiting" : state.workspaceStatus === "blocked" ? "Blocked" : state.workspaceStatus === "paused" ? "Waiting" : state.workspaceStatus === "running" ? "In Review" : "Incoming";
  $("#workspace-queue").innerHTML = statuses.map((status) => {
    const items = workspaceWorkObjects.filter((_, index) => workObjectStatus(index) === status);
    const caseHere = activeQueue === status;
    return `<div class="queue-lane status-${status.toLowerCase().replaceAll(" ", "-")}${caseHere ? " is-current" : ""}"><span><strong>${status}</strong><small>${items.length}</small></span>${caseHere ? `<div class="queue-case-chip"><i></i><span>Customer Intelligence Capability<small>${currentCaseSnapshot().stage}</small></span></div>` : ""}<div class="queue-items">${items.map((item) => `<small>${item.sequence} / ${item.title}</small>`).join("") || "<small>NO WORK OBJECTS</small>"}</div></div>`;
  }).join("");
}

function renderWorkspaceState() {
  const snapshot = currentCaseSnapshot();
  if (isSupplierCase()) {
    $$('[data-workflow-stage]').forEach((node) => { const index = Number(node.dataset.workflowStage); node.classList.toggle("is-complete", index < snapshot.stageIndex); node.classList.toggle("is-active", index === snapshot.stageIndex); node.classList.toggle("is-blocked", index === 4); });
    $("#workspace-observatory-title").textContent = snapshot.name;
    $("#case-progress-marker").style.setProperty("--case-stage", String(snapshot.stageIndex));
    $("#case-progress-marker").classList.toggle("is-blocked", snapshot.stage === "Decision Pending");
    $("#case-progress-label").textContent = snapshot.stage.toUpperCase();
    $("#workspace-status-line").textContent = snapshot.stage === "Decision Pending" ? "Decision Pending · Waiting for Mission Commander." : `${snapshot.owner} · ${snapshot.task}.`;
    $("#start-workspace").disabled = snapshot.stageIndex > 0 || snapshot.paused;
    $("#start-workspace").textContent = "Start Supplier Quality Journey";
    $("#pause-workspace").disabled = snapshot.paused || snapshot.stage === "Decision Pending";
    $("#resume-workspace").disabled = !snapshot.paused;
    renderWorkObjects(); renderWorkQueue(); renderMissionCase();
    return;
  }
  $("#workspace-observatory-title").textContent = "Customer Intelligence Capability";
  $("#start-workspace").textContent = "Start Workspace Flow";
  const decisionBlocked = state.workspaceStatus === "blocked" && !["ready-replanning", "waiting-evidence"].includes(state.decisionStatus);
  const stageForRail = state.workspaceStage;
  $$("[data-workflow-stage]").forEach((node) => {
    const index = Number(node.dataset.workflowStage);
    node.classList.toggle("is-complete", index < stageForRail || state.completedWorkObjectIds.has(workspaceWorkObjects[index].id));
    node.classList.toggle("is-active", index === stageForRail);
    node.classList.toggle("is-blocked", index === 4 && decisionBlocked);
  });
  const markerStage = Math.max(0, state.workspaceStage);
  $("#case-progress-marker").style.setProperty("--case-stage", String(markerStage));
  $("#case-progress-marker").classList.toggle("is-moving", state.workspaceTransition);
  $("#case-progress-marker").classList.toggle("is-blocked", decisionBlocked);
  $("#case-progress-label").textContent = state.workspaceStage >= 0 ? snapshot.stage.toUpperCase() : state.assessmentReady ? "READY FOR EVIDENCE" : "AWAITING START";
  $("#workspace-status-line").textContent = state.validationStatus === "complete" ? "Validation Complete · package validated with conditions · Executive Advisor owns the next action." : state.validationStatus === "exception" ? "Validation Exception · Aggregate Equivalence failed by 1.8%." : state.validationStatus === "correction-applied" ? "Correction Applied · only three impacted checks require rerun." : state.validationStatus === "rerunning" ? `Targeted Rerun · ${snapshot.task}.` : ["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus) ? "Correction Proposed · Mission Commander approval required before code changes." : state.validationStatus === "running" ? `Independent validation · ${snapshot.task}.` : state.validationStatus === "contract-review" ? "Validation In Progress · inspect the contract before running checks." : state.engineeringStatus === "validation-ready" ? "Validation Ready · six generated artifacts handed to the Validation Specialist." : state.engineeringStatus === "package-generated" ? "Engineering Package Generated · assembling validation handoff." : state.engineeringStatus === "generating" ? `Modernization Engineer · ${snapshot.task}.` : state.engineeringStatus === "contract-review" ? "Engineering In Progress · inspect the governed contract before generation." : state.propagationStatus === "approved" ? "Engineering Ready · Modernization Engineer owns the next action." : state.propagationStatus === "complete" ? "Revised Plan Ready · waiting for Mission Commander approval." : state.propagationStatus === "running" ? `${snapshot.owner} · ${snapshot.task} because the Human Constraint changed the plan.` : state.decisionStatus === "ready-replanning" ? "Ready for Replanning · Human Constraint attached · Wave Planning owns the next action." : state.decisionStatus === "waiting-evidence" ? "Waiting · Portfolio Intelligence owns four targeted evidence requests." : state.decisionStatus === "unresolved" ? "Decision Unresolved · Human Decision Required." : state.workspaceStatus === "blocked" ? "Decision Pending · Waiting for Mission Commander." : state.workspaceStatus === "paused" ? `Paused after the current transition · ${snapshot.owner} retains ownership.` : state.workspaceStatus === "running" ? `${snapshot.owner} · ${snapshot.task}` : state.assessmentReady ? "Assessment Ready · start the visible specialist workflow." : "Form the capability in Mission Control to activate the workspace.";
  $("#start-workspace").disabled = !state.assessmentReady || state.hqTransition !== "complete" || state.workspaceStatus !== "idle";
  $("#pause-workspace").disabled = state.workspaceStatus !== "running" || state.workspacePauseRequested;
  $("#resume-workspace").disabled = state.workspaceStatus !== "paused";
  $("#workspace-observatory").classList.toggle("is-blocked", decisionBlocked);
  renderWorkObjects();
  renderWorkQueue();
  renderMissionCase();
  renderDecisionRoom();
  renderPropagationWorkspace();
  renderEngineeringWorkspace();
  renderValidationWorkspace();
}

function positionDetail(key) {
  const position = decisionPositions[key];
  return `<p class="eyebrow">SPECIALIST POSITION / ${position.confidence} CONFIDENCE</p><h3>${position.title}</h3><p><strong>Recommendation:</strong> ${position.recommendation}</p><div class="position-evidence-grid"><div><small>SUPPORTING EVIDENCE</small><ul>${position.evidence.map((item) => `<li>${item}</li>`).join("")}</ul></div><div><small>COUNTER-EVIDENCE</small><ul>${position.counter.map((item) => `<li>${item}</li>`).join("")}</ul></div><div><small>KEY ASSUMPTION</small><p>${position.assumption}</p></div><div><small>CONSEQUENCE IF WRONG</small><p>${position.consequence}</p></div></div>`;
}

function decisionComparison() {
  const rows = [
    ["Business value", "Highest / unified experience", "High / analytics foundation", "Protected by governance"],
    ["Technical feasibility", "Moderate", "High", "Conditional"],
    ["Operational risk", "High", "Moderate", "Lowest before approval"],
    ["Expected disruption", "High", "Low–moderate", "Delay"],
    ["Delivery speed", "Slower", "Faster first value", "Blocked"],
    ["Dependency exposure", "High", "Controlled", "Unresolved"],
    ["Reversibility", "Lower", "Higher", "Highest"],
    ["Confidence", "82%", "91%", "77%"]
  ];
  return `<p class="eyebrow">CONCISE RECOMMENDATION COMPARISON</p><h3>Three governed positions · one shared case</h3><div class="comparison-table"><div><strong>DIMENSION</strong><strong>BUSINESS</strong><strong>ARCHITECTURE</strong><strong>RISK</strong></div>${rows.map((row) => `<div>${row.map((cell) => `<span>${cell}</span>`).join("")}</div>`).join("")}</div>`;
}

function decisionActionContent(action) {
  const content = {
    compare: decisionComparison(),
    shared: `<p class="eyebrow">SHARED EVIDENCE</p><h3>Evidence all three positions accept</h3><p>Customer Analytics Warehouse has high technical urgency; customer intelligence is fragmented; twelve Finance Warehouse-dependent reports cross the modernization boundary; and action delayed increases obsolescence.</p>`,
    conflict: `<p class="eyebrow">CONFLICTING EVIDENCE</p><h3>Finance dependency is technically visible but not governable yet</h3><p>Two sources conflict on report ownership, change authority is incomplete, and executive-metric sensitivity is confirmed. The evidence supports modernization, but not an unqualified transition choice.</p>`,
    assumptions: `<p class="eyebrow">KEY ASSUMPTIONS</p><h3>The conflict is about tolerance for change</h3><p><strong>Business:</strong> coordinated semantic change is tolerable. <strong>Architecture:</strong> compatibility can be preserved. <strong>Risk:</strong> reports cannot safely change without confirmed authority.</p>`,
    change: `<p class="eyebrow">WHAT WOULD CHANGE THEIR MINDS?</p><h3>Targeted evidence, not another broad assessment</h3><p>Business needs proof that a staged path will not fragment customer outcomes. Architecture needs compatibility-test failures to reject staging. Risk needs confirmed ownership, change authority, and reconciliation controls to permit approval.</p>`,
    challenge: `<p class="eyebrow">GOVERNED CHALLENGE / ATTACHED TO DR-CIC-001</p><h3>Risk Specialist challenges the Chief Enterprise Architect</h3><blockquote><strong>Risk:</strong> The staged replatform recommendation depends on preserving twelve Finance Warehouse-dependent reports, but ownership and change authority are unresolved.</blockquote><blockquote><strong>Architect:</strong> The strategy remains feasible if the reports are protected through compatibility views, dual-run reconciliation, and an explicit six-month freeze.</blockquote>`,
    blocked: governedQuestionContent(),
    resolve: governedQuestionContent()
  };
  return content[action];
}

function governedQuestionContent() {
  return `<p class="eyebrow">UNRESOLVED HUMAN DECISION</p><h3>Must the twelve Finance Warehouse-dependent reports remain unchanged during the first six months?</h3><p>Yes favors staged replatforming with compatibility controls. No makes broader rebuild or semantic redesign more viable. More evidence delays the decision but reduces uncertainty. Ownership remains a required governance follow-up.</p>`;
}

function renderDecisionRecord() {
  const decisionLabel = state.commanderDecision === "yes" ? "Yes — protect finance reports for six months" : state.commanderDecision === "no" ? "No — finance reports may change" : state.commanderDecision === "evidence" ? "Request more evidence" : "Pending";
  $("#decision-record-fields").innerHTML = `<span><small>CASE ID</small><strong>DR-CIC-001</strong></span><span><small>SPECIALIST POSITIONS</small><strong>${state.positionsAttached.size} / 3 attached</strong></span><span><small>EVIDENCE REFERENCES</small><strong>Evidence Package · Architecture · Business · Risk</strong></span><span><small>ASSUMPTIONS</small><strong>3 governed assumptions</strong></span><span><small>CHALLENGE</small><strong>${state.decisionChallengeAttached ? "Attached" : "Not requested"}</strong></span><span><small>UNRESOLVED QUESTION</small><strong>Six-month report freeze</strong></span><span><small>MISSION COMMANDER DECISION</small><strong>${decisionLabel}</strong></span><span><small>CONSTRAINT</small><strong>${state.humanConstraintAttached ? (state.commanderDecision === "yes" ? "Finance reports frozen for six months" : "Governed report change permitted") : "Pending"}</strong></span><span><small>REMAINING GOVERNANCE ACTION</small><strong>Confirm report ownership and change authority</strong></span><span><small>SEQUENCE</small><strong>DR-CIC-001 / V0.6 / ${state.propagatedNodeIds.size + 6}</strong></span><span><small>NEXT WORKFLOW STAGE</small><strong>${state.propagationStatus === "approved" ? "Engineering Ready" : state.propagationStatus === "complete" ? "Revised Plan Approval" : state.propagationStatus === "running" ? "Decision Propagation" : state.decisionStatus === "ready-replanning" ? "Ready for Replanning" : state.decisionStatus === "waiting-evidence" ? "Waiting" : "Human Decision Required"}</strong></span>`;
}

function renderDecisionRoom() {
  const visible = state.workspaceStage === 4 || state.decisionStatus !== "idle";
  const canvas = $("#shared-decision-canvas");
  canvas.hidden = !visible;
  if (!visible) return;
  const snapshot = currentCaseSnapshot();
  $("#decision-canvas-state").textContent = snapshot.stage.toUpperCase();
  $("#decision-case-core-state").textContent = snapshot.stage.toUpperCase();
  $("#assemble-positions").hidden = state.decisionStatus !== "idle";
  $$("[data-decision-position]").forEach((node) => {
    const attached = state.positionsAttached.has(node.dataset.decisionPosition);
    node.classList.toggle("is-attached", attached);
    $("em", node).textContent = attached ? node.dataset.decisionPosition === "risk" ? "OBJECTION ATTACHED" : "POSITION ATTACHED" : node.dataset.decisionPosition === "risk" ? "OBJECTION WAITING" : "POSITION WAITING";
  });
  const activeTimeline = state.decisionStatus === "idle" ? 1 : state.decisionStatus === "assembling" ? Math.min(4, state.positionsAttached.size + 1) : 6;
  $("#decision-timeline").innerHTML = decisionTimeline.map((item, index) => `<span class="${index < activeTimeline ? "is-complete" : ""}"><i>${String(index + 1).padStart(2, "0")}</i><strong>${item}</strong></span>`).join("");
  $("#decision-actions").classList.toggle("is-enabled", state.decisionStatus !== "idle" && state.decisionStatus !== "assembling");
  $$("[data-decision-action]").forEach((button) => { button.disabled = !["unresolved", "waiting-evidence", "ready-replanning"].includes(state.decisionStatus); });
  renderDecisionRecord();
}

function startDecisionMovement() {
  if (state.decisionStatus !== "idle") return;
  state.decisionStatus = "assembling";
  state.decisionStep = 0;
  runDecisionStep();
}

function runDecisionStep() {
  const stage = $("#decision-stage");
  stage.dataset.decisionStep = String(state.decisionStep);
  stage.classList.remove("is-positioning");
  void stage.offsetWidth;
  stage.classList.add("is-positioning");
  renderHqState();
}

function completeDecisionStep() {
  if (state.decisionStatus !== "assembling") return;
  const order = ["business", "architect", "risk"];
  state.positionsAttached.add(order[state.decisionStep]);
  if (state.decisionStep < 2) { state.decisionStep += 1; runDecisionStep(); return; }
  $("#decision-stage").classList.remove("is-positioning");
  $("#decision-stage").dataset.decisionStep = "3";
  state.decisionStatus = "unresolved";
  state.decisionStep = 3;
  ["agent-02", "agent-03", "agent-04"].forEach((id) => state.agentStates.set(id, "Position Attached"));
  $("#decision-inspector").innerHTML = decisionComparison();
  renderHqState();
}

function handleDecisionAction(action) {
  if (state.decisionStatus === "idle" || state.decisionStatus === "assembling") return;
  if (action === "challenge") state.decisionChallengeAttached = true;
  if (["blocked", "resolve"].includes(action)) { state.decisionQuestionOpen = true; $("#human-decision-gate").hidden = false; }
  $("#decision-inspector").innerHTML = decisionActionContent(action);
  $$("[data-decision-action]").forEach((button) => button.classList.toggle("is-selected", button.dataset.decisionAction === action));
  renderDecisionRecord();
}

function selectDecisionPosition(key) {
  if (!state.positionsAttached.has(key)) return;
  $("#decision-inspector").innerHTML = positionDetail(key);
}

function selectCommanderDecision(decision) {
  if (!state.decisionQuestionOpen || !["yes", "no", "evidence"].includes(decision)) return;
  state.commanderDecision = decision;
  if (decision === "evidence") {
    state.decisionStatus = "waiting-evidence";
    state.humanConstraintAttached = false;
    $("#decision-outcome").innerHTML = `<p class="eyebrow">TARGETED EVIDENCE REQUESTS / DR-CIC-001</p><h3>Case moved to Waiting</h3><div class="evidence-request-list"><span>Report ownership</span><span>Change authority</span><span>Oracle compatibility</span><span>Executive-metric dependencies</span></div><button class="primary-action" type="button" id="return-decision-gate">Return to Decision Gate</button>`;
  } else {
    state.decisionStatus = "ready-replanning";
    state.humanConstraintAttached = true;
    const constraint = decision === "yes" ? "Finance reports frozen for six months" : "Finance reports may change under governed change control";
    $("#decision-outcome").innerHTML = `<p class="eyebrow">HUMAN CONSTRAINT / ATTACHED TO DR-CIC-001</p><h3>${constraint}</h3><div class="outcome-facts"><span><small>DECISION AUTHORITY</small><strong>Mission Commander</strong></span><span><small>CASE STATE</small><strong>Ready for Replanning</strong></span><span><small>CURRENT OWNER</small><strong>Wave Planning Specialist</strong></span><span><small>GOVERNANCE FOLLOW-UP</small><strong>Confirm ownership and change authority</strong></span></div><button class="primary-action" type="button" id="continue-propagation">Continue to Decision Propagation</button><p id="propagation-boundary">Version 0.5 ends at Ready for Replanning.</p>`;
  }
  $("#decision-outcome").hidden = false;
  $("#human-decision-gate").hidden = decision !== "evidence";
  renderHqState();
}

function propagationDelta() {
  const rows = [
    ["Strategy", "Rebuild", "Staged Replatform"], ["Timeline", "4 Months", "7 Months"], ["Initial Disruption", "High", "Low"], ["Migration Cost", "Baseline", "+11%"], ["Operational Risk", "High", "Reduced 34%"], ["Customer Service Portal", "Wave 1", "Wave 2"], ["Finance Warehouse", "Exposed", "Protected Boundary"], ["Engineering Controls", "Compatibility views", "Dual run · regression tests · ownership validation"]
  ];
  return `<p class="eyebrow">DECISION DELTA / HUMAN CONSTRAINT</p><h3>What changed because finance reports must remain unchanged for six months</h3><div class="delta-table"><div><strong>PLAN ELEMENT</strong><strong>BEFORE</strong><strong>AFTER</strong></div>${rows.map((row) => `<div>${row.map((cell) => `<span>${cell}</span>`).join("")}</div>`).join("")}</div>`;
}

function propagationActionContent(action) {
  const content = {
    delta: propagationDelta(), compare: propagationDelta(),
    strategy: `<p class="eyebrow">REVISED STRATEGY / DR-CIC-001</p><h3>Staged Replatform</h3><p>The six-month report freeze replaces the broader rebuild with a warehouse-first staged path. Customer value remains the goal, but transition compatibility now governs sequencing.</p>`,
    architecture: `<p class="eyebrow">REVISED ARCHITECTURE / DR-CIC-001</p><h3>Protected reporting boundary</h3><p>Compatibility views preserve report contracts while dual-run reconciliation proves parity. The Customer Service Portal decouples only after the warehouse boundary is stable.</p>`,
    wave: `<p class="eyebrow">REVISED WAVE PLAN / DR-CIC-001</p><h3>Warehouse first; portal second</h3><p>Customer Analytics Warehouse remains Wave 1. Customer Service Portal moves from Wave 1 to Wave 2. Product Telemetry Platform and the remaining products do not move.</p>`,
    risk: `<p class="eyebrow">RISK CONTROL PLAN / DR-CIC-001</p><h3>Operational risk reduced 34%</h3><p>Compatibility views, dual-run reconciliation, regression tests, and ownership validation control the protected transition. Cost rises eleven percent to fund those controls.</p>`,
    governance: `<p class="eyebrow">GOVERNANCE / DR-CIC-001</p><h3>Protected boundary with an open ownership action</h3><p>The Finance Warehouse receives a Protected Boundary. Its unresolved ownership marker remains visible and must be validated before controlled report changes are authorized.</p>`
  };
  return content[action];
}

function renderPropagationProducts() {
  const waveRevised = state.propagatedNodeIds.has("wave");
  $("#wave-plan").innerHTML = `<div class="wave-lane"><span>WAVE 1</span><article class="wave-product is-revised"><small>PLAN REVISED</small><strong>Customer Analytics Warehouse</strong><em>Remains Wave 1</em></article>${waveRevised ? "" : `<article class="wave-product portal-product"><small>BASELINE</small><strong>Customer Service Portal</strong><em>Wave 1</em></article>`}</div><div class="wave-transfer ${waveRevised ? "is-visible" : ""}"><span>HUMAN CONSTRAINT</span><strong>Portal sequenced after warehouse</strong><i>→</i></div><div class="wave-lane"><span>WAVE 2</span>${waveRevised ? `<article class="wave-product portal-product is-moved"><small>SEQUENCED AFTER WAREHOUSE</small><strong>Customer Service Portal</strong><em>Moved from Wave 1</em></article>` : `<small class="empty-wave">AWAITING PROPAGATION</small>`}</div><div class="protected-products"><article class="wave-product finance-product ${state.propagatedNodeIds.has("architecture") ? "is-protected" : ""}"><small>${state.propagatedNodeIds.has("architecture") ? "PROTECTED BOUNDARY" : "EXPOSED"}</small><strong>Finance Warehouse</strong><em>Ownership unresolved</em></article><article class="wave-product"><small>NO WAVE MOVEMENT</small><strong>Product Telemetry Platform</strong><em>Plan unchanged</em></article><span>6 remaining products · no movement</span></div>`;
}

function renderPropagationObjects() {
  const released = propagationWorkObjects.filter((item) => state.propagationWorkObjectIds.has(item.id));
  $("#propagation-work-objects").innerHTML = released.length ? released.map((item) => `<button type="button" data-propagation-object="${item.id}"><span>✓</span><div><strong>${item.title}</strong><small>${item.owner}</small></div><em>ATTACHED TO DR-CIC-001</em></button>`).join("") : `<div class="propagation-empty"><strong>NO REVISED WORK OBJECTS YET</strong><small>Objects appear only when their causal node completes.</small></div>`;
}

function renderPropagationWorkspace() {
  const eligible = state.commanderDecision === "yes" && state.humanConstraintAttached;
  const workspace = $("#propagation-workspace");
  workspace.hidden = !eligible;
  if (!eligible) return;
  $("#propagation-nodes").innerHTML = propagationNodes.map((node, index) => { const done = state.propagatedNodeIds.has(node.id); const active = state.propagationStatus === "running" && state.propagationStep === index; return `<article class="propagation-node${done ? " is-complete" : ""}${active ? " is-active" : ""}" data-propagation-node="${node.id}"><i>${String(index + 1).padStart(2, "0")}</i><div><strong>${node.label}</strong><small>${node.owner}</small><p>${done || active ? node.reason : "Waiting for upstream consequence."}</p></div><em>${done ? "UPDATED" : active ? "UPDATING" : "WAITING"}</em></article>`; }).join("");
  const labels = { idle: "READY TO PROPAGATE", running: `UPDATING ${propagationNodes[state.propagationStep]?.label.toUpperCase()}`, complete: "REVISED PLAN READY", approved: "ENGINEERING READY" };
  $("#propagation-status").textContent = labels[state.propagationStatus];
  $("#propagate-constraint").hidden = state.propagationStatus !== "idle";
  $("#propagation-actions").classList.toggle("is-enabled", ["complete", "approved"].includes(state.propagationStatus));
  $$("[data-propagation-action]").forEach((button) => { button.disabled = !["complete", "approved"].includes(state.propagationStatus); });
  $("#revised-plan-gate").hidden = state.propagationStatus !== "complete";
  $("#engineering-handoff").hidden = state.propagationStatus !== "approved";
  renderPropagationProducts();
  renderPropagationObjects();
}

function openPropagationWorkspace() {
  if (state.commanderDecision !== "yes" || !state.humanConstraintAttached) return;
  renderHqState();
  $("#propagation-workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startPropagation() {
  if (state.propagationStatus !== "idle" || state.commanderDecision !== "yes" || !state.humanConstraintAttached) return;
  state.propagationStatus = "running";
  state.propagationStep = 0;
  state.agentStates.set("agent-05", "Propagating");
  runPropagationStep();
}

function runPropagationStep() {
  const chain = $("#propagation-chain");
  const contributorId = { "Wave Planning Specialist": "agent-05", "Chief Enterprise Architect": "agent-02", "Risk & Governance Specialist": "agent-04", "Executive Advisor": "agent-08" }[propagationNodes[state.propagationStep].owner];
  if (contributorId) state.agentStates.set(contributorId, "Updating");
  chain.dataset.propagationStep = String(state.propagationStep);
  chain.classList.remove("is-propagating");
  void chain.offsetWidth;
  chain.classList.add("is-propagating");
  renderHqState();
}

function completePropagationStep() {
  if (state.propagationStatus !== "running") return;
  const node = propagationNodes[state.propagationStep];
  const contributorId = { "Wave Planning Specialist": "agent-05", "Chief Enterprise Architect": "agent-02", "Risk & Governance Specialist": "agent-04", "Executive Advisor": "agent-08" }[node.owner];
  if (contributorId) state.agentStates.set(contributorId, "Work Attached");
  state.propagatedNodeIds.add(node.id);
  if (node.id === "strategy") setProductState("data-01", "Plan Revised");
  if (node.id === "architecture") setProductState("data-04", "Protected Boundary");
  if (node.id === "wave") setProductState("app-03", "Sequenced After Warehouse");
  propagationWorkObjects.filter((item) => item.releaseAt === state.propagationStep).forEach((item) => state.propagationWorkObjectIds.add(item.id));
  if (node.id === "architecture") state.agentStates.set("agent-02", "Architecture Revised");
  if (node.id === "risk") state.agentStates.set("agent-04", "Controls Revised");
  if (node.id === "governance") state.agentStates.set("agent-08", "Impact Explained");
  if (state.propagationStep < propagationNodes.length - 1) { state.propagationStep += 1; runPropagationStep(); return; }
  $("#propagation-chain").classList.remove("is-propagating");
  state.propagationStatus = "complete";
  state.agentStates.set("agent-05", "Plan Revised");
  $("#propagation-inspector").innerHTML = propagationDelta();
  renderHqState();
}

function handlePropagationAction(action) {
  if (!["complete", "approved"].includes(state.propagationStatus)) return;
  $("#propagation-inspector").innerHTML = propagationActionContent(action);
  $$("[data-propagation-action]").forEach((button) => button.classList.toggle("is-selected", button.dataset.propagationAction === action));
}

function inspectPropagationObject(id) {
  const item = propagationWorkObjects.find((candidate) => candidate.id === id && state.propagationWorkObjectIds.has(candidate.id));
  if (!item) return;
  $("#propagation-inspector").innerHTML = `<p class="eyebrow">WORK OBJECT / ATTACHED TO DR-CIC-001</p><h3>${item.title}</h3><p><strong>${item.owner}</strong> attached this object because the Human Constraint changed the plan.</p><p>${item.finding}</p>`;
}

function approveRevisedPlan() {
  if (state.propagationStatus !== "complete") return;
  state.propagationStatus = "approved";
  state.agentStates.set("agent-05", "Handoff Complete");
  state.agentStates.set("agent-06", "Engineering Ready");
  renderHqState();
}

function renderEngineeringContract() {
  const fields = [
    ["CASE ID", engineeringContract.caseId], ["MODERNIZATION STRATEGY", engineeringContract.approvedStrategy], ["SOURCE PLATFORM", engineeringContract.sourcePlatform], ["TARGET PLATFORM", engineeringContract.targetPlatform], ["MIGRATION STAGES", engineeringContract.migrationStages.join(" · ")], ["HUMAN CONSTRAINT", engineeringContract.humanConstraints.join(" · ")], ["PROTECTED DEPENDENCY", engineeringContract.protectedDependencies.join(" · ")], ["REQUIRED CONTROLS", engineeringContract.engineeringControls.join(" · ")], ["VALIDATION EXPECTATIONS", engineeringContract.validationExpectations.join(" · ")], ["REMAINING GOVERNANCE ACTION", engineeringContract.governanceActions.join(" · ")], ["APPROVAL REFERENCE", engineeringContract.approvalReference]
  ];
  $("#engineering-contract-fields").innerHTML = fields.map(([label, value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("");
}

function renderEngineeringQueue() {
  const current = { "contract-review": "Incoming", generating: "Generating", "package-generated": "Review Required", "validation-ready": "Validation Ready" }[state.engineeringStatus] || "Incoming";
  $("#engineering-queue-lanes").innerHTML = ["Incoming", "Generating", "Review Required", "Validation Ready", "Complete"].map((lane) => `<div class="engineering-queue-lane${current === lane ? " is-current" : ""}"><span><strong>${lane}</strong><small>${current === lane ? "1" : "0"}</small></span>${current === lane ? `<div class="engineering-package-chip"><i></i><span>Migration Starter Package<small>${state.generatedArtifactIds.size} / 6 artifacts</small></span></div>` : ""}</div>`).join("");
}

function renderEngineeringArtifacts() {
  const generated = engineeringArtifacts.filter((artifact) => state.generatedArtifactIds.has(artifact.id));
  $("#artifact-count").textContent = String(generated.length);
  $("#artifact-list").innerHTML = generated.length ? generated.map((artifact) => `<button class="artifact-card${state.selectedArtifactId === artifact.id ? " is-selected" : ""}" type="button" data-artifact-id="${artifact.id}"><span><small>${artifact.type.toUpperCase()}</small><em>GENERATED</em></span><strong>${artifact.filename}${artifact.id === "converted-sql" && state.correctedArtifactVersion === "v2" ? " · v2" : ""}</strong><p>${artifact.purpose}</p><div><small>WHY IT EXISTS</small><span>${artifact.sourceDecision} · ${artifact.sourceConstraint}</span></div><b>VALIDATION / ${artifact.id === "converted-sql" && state.correctedArtifactVersion === "v2" ? "CORRECTED" : artifact.validationStatus.toUpperCase()} · INSPECT ARTIFACT</b></button>`).join("") : `<div class="engineering-empty"><strong>NO ARTIFACTS GENERATED</strong><small>The Engineering Contract is visible; generation still requires explicit authorization.</small></div>`;
}

function renderEngineeringObjects() {
  const objects = engineeringWorkObjects.filter((item) => state.engineeringWorkObjectIds.has(item.id));
  $("#engineering-work-objects").innerHTML = objects.map((item, index) => `<button type="button" data-engineering-object="${item.id}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${item.title}</strong><small>DR-CIC-001 · SEQUENCE ${index + 1}</small></div><em>ATTACHED</em></button>`).join("");
}

function renderEngineeringWorkspace() {
  const workspace = $("#engineering-workspace");
  workspace.hidden = !state.engineeringEntered;
  if (!state.engineeringEntered) return;
  renderEngineeringContract();
  $("#engineering-status").textContent = currentCaseSnapshot().stage.toUpperCase();
  $("#engineering-owner").textContent = currentCaseSnapshot().owner.toUpperCase();
  $("#generate-package").hidden = state.engineeringStatus !== "contract-review";
  const completeThrough = state.engineeringStatus === "validation-ready" ? 9 : state.engineeringStatus === "package-generated" ? 8 : state.engineeringStep - 1;
  $("#engineering-sequence-steps").innerHTML = engineeringSequence.map((label, index) => `<span class="${index <= completeThrough ? "is-complete" : state.engineeringStatus === "generating" && index === state.engineeringStep ? "is-active" : ""}"><i>${String(index + 1).padStart(2, "0")}</i><strong>${label}</strong></span>`).join("");
  $("#engineering-sequence-label").textContent = state.engineeringStatus === "contract-review" ? "CONTRACT READY / GENERATION NOT STARTED" : state.engineeringStatus === "generating" ? engineeringSequence[state.engineeringStep].toUpperCase() : state.engineeringStatus === "package-generated" ? "ENGINEERING PACKAGE GENERATED" : "VALIDATION HANDOFF READY";
  renderEngineeringQueue();
  renderEngineeringArtifacts();
  renderEngineeringObjects();
  $("#validation-handoff").hidden = state.engineeringStatus !== "validation-ready";
  $$("[data-engineering-action]").forEach((button) => { const action = button.dataset.engineeringAction; button.disabled = action === "assemble" ? state.engineeringStatus !== "package-generated" : !["contract", "decision", "constraint", "governance", "revised"].includes(action) && state.generatedArtifactIds.size === 0; });
}

function openEngineeringWorkspace() {
  if (state.propagationStatus !== "approved" || state.engineeringStatus !== "idle") return;
  state.engineeringEntered = true;
  state.engineeringStatus = "contract-review";
  state.engineeringStep = -1;
  state.engineeringWorkObjectIds.add("engineering-contract");
  state.agentStates.set("agent-06", "Contract Review");
  state.migrationPackage.generationStatus = "Contract ready";
  const lab = $(".zone-codex");
  lab.classList.remove("is-locked");
  lab.classList.add("is-open");
  $(".zone-lock", lab).hidden = true;
  $("#engineering-workspace").classList.remove("is-entering");
  void $("#engineering-workspace").offsetWidth;
  $("#engineering-workspace").classList.add("is-entering");
  renderHqState();
  $("#engineering-workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startEngineeringGeneration() {
  if (state.engineeringStatus !== "contract-review") return;
  state.engineeringStatus = "generating";
  state.engineeringStep = 0;
  state.migrationPackage.generationStatus = "Generating";
  state.agentStates.set("agent-06", "Generating");
  runEngineeringStep();
}

function runEngineeringStep() {
  const sequence = $("#engineering-sequence");
  sequence.dataset.engineeringStep = String(state.engineeringStep);
  sequence.classList.remove("is-generating");
  void sequence.offsetWidth;
  sequence.classList.add("is-generating");
  renderHqState();
}

function completeEngineeringStep() {
  if (state.engineeringStatus !== "generating") return;
  if (state.engineeringStep === 1) state.engineeringWorkObjectIds.add("engineering-plan");
  if (state.engineeringStep >= 2 && state.engineeringStep <= 7) {
    const artifact = engineeringArtifacts[state.engineeringStep - 2];
    state.generatedArtifactIds.add(artifact.id);
    state.engineeringWorkObjectIds.add(engineeringWorkObjects[state.engineeringStep].id);
    state.migrationPackage.generatedArtifacts.push(artifact.filename);
    state.migrationPackage.artifactDependencies[artifact.filename] = artifact.dependencies;
  }
  if (state.engineeringStep === 8) {
    state.engineeringWorkObjectIds.add("package-object");
    state.migrationPackage.generationStatus = "Assembled";
    state.migrationPackage.nextAction = "Prepare validation handoff";
    state.engineeringStatus = "package-generated";
    $("#engineering-sequence").classList.remove("is-generating");
    state.agentStates.set("agent-06", "Package Generated");
    renderHqState();
    return;
  }
  state.engineeringStep += 1;
  runEngineeringStep();
}

function artifactInspector(id) {
  const artifact = engineeringArtifacts.find((item) => item.id === id && state.generatedArtifactIds.has(item.id));
  if (!artifact) return;
  state.selectedArtifactId = id;
  renderEngineeringArtifacts();
  $("#engineering-inspector").innerHTML = `<p class="eyebrow">ARTIFACT PREVIEW / ${artifact.type.toUpperCase()}</p><h3>${artifact.filename}</h3><div class="artifact-lineage"><span><small>OWNER</small><strong>${artifact.owner}</strong></span><span><small>PURPOSE</small><strong>${artifact.purpose}</strong></span><span><small>SOURCE DECISION</small><strong>${artifact.sourceDecision}</strong></span><span><small>APPLIED CONSTRAINT</small><strong>${artifact.sourceConstraint}</strong></span><span><small>SOURCE EVIDENCE</small><strong>${artifact.sourceEvidence}</strong></span><span><small>DEPENDENCIES</small><strong>${artifact.dependencies}</strong></span><span><small>GOVERNANCE CONDITION</small><strong>${artifact.governanceCondition}</strong></span><span><small>VALIDATION STATUS</small><strong>${artifact.validationStatus}</strong></span><span><small>NEXT ACTION</small><strong>${artifact.nextAction}</strong></span></div>${artifact.preview}`;
}

function engineeringActionContent(action) {
  const selected = engineeringArtifacts.find((item) => item.id === state.selectedArtifactId) || engineeringArtifacts.find((item) => state.generatedArtifactIds.has(item.id));
  const content = {
    contract: `<p class="eyebrow">ENGINEERING CONTRACT / EC-DR-CIC-001</p><h3>Governed intent, not a vague migration prompt</h3><p>Codex receives the approved strategy, two migration stages, Human Constraint, protected dependency, five controls, seven validation expectations, and the open governance action.</p>`,
    lineage: selected ? `<p class="eyebrow">ARTIFACT LINEAGE / ${selected.filename}</p><h3>Why this file exists</h3><p>${selected.sourceDecision} and ${selected.sourceConstraint} triggered this artifact. Evidence: ${selected.sourceEvidence}. Dependency: ${selected.dependencies}. Trace: DR-CIC-001 → EC-DR-CIC-001 → ${selected.filename}.</p>` : "",
    decision: `<p class="eyebrow">SOURCE DECISION / DR-CIC-001</p><h3>Approved staged replatforming</h3><p>Oracle Customer Analytics Warehouse moves to Google BigQuery through a compatibility layer and six-week dual run before finance-report decoupling.</p>`,
    constraint: `<p class="eyebrow">APPLIED HUMAN CONSTRAINT</p><h3>Finance reports must remain unchanged for six months</h3><p>This constraint causes compatibility views, preservation tests, dual-run reconciliation, regression controls, and governed cutover conditions.</p>`,
    dependencies: `<p class="eyebrow">ARTIFACT DEPENDENCIES</p><h3>A structured package, not six unrelated files</h3><p>Schema → mapping → converted SQL → reconciliation tests → dual-run plan → cutover checklist. Each artifact consumes governed outputs from the prior engineering step.</p>`,
    sql: engineeringArtifacts[2].preview,
    validation: `<p class="eyebrow">VALIDATION COVERAGE / NOT RUN</p><h3>Seven independent checks required next</h3><p>${engineeringContract.validationExpectations.join(" · ")}. Generated artifacts are validation-ready, not validated.</p>`,
    governance: `<p class="eyebrow">GOVERNANCE PREREQUISITE / BEFORE CUTOVER</p><h3>Resolve ownership and change authority for twelve reports</h3><p>This issue does not block package generation. It remains attached to DR-CIC-001 and will block final execution readiness later.</p>`
  };
  return content[action];
}

function handleEngineeringAction(action) {
  if (action === "revised") { $("#propagation-workspace").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  if (action === "assemble") { finalizeMigrationPackage(); return; }
  const content = engineeringActionContent(action);
  if (content) $("#engineering-inspector").innerHTML = content;
  $$("[data-engineering-action]").forEach((button) => button.classList.toggle("is-selected", button.dataset.engineeringAction === action));
}

function finalizeMigrationPackage() {
  if (state.engineeringStatus !== "package-generated" || state.generatedArtifactIds.size !== 6) return;
  state.engineeringStep = 9;
  state.engineeringStatus = "validation-ready";
  state.migrationPackage.generationStatus = "Complete";
  state.migrationPackage.validationStatus = "Ready";
  state.migrationPackage.nextAction = "Run Independent Validation";
  state.agentStates.set("agent-06", "Handoff Complete");
  state.agentStates.set("agent-07", "Validation Ready");
  renderHqState();
}

function renderValidationContract() {
  const fields = [["CASE ID", validationContract.caseId], ["PACKAGE", validationContract.packageId], ["SOURCE", validationContract.sourcePlatform], ["TARGET", validationContract.targetPlatform], ["ARTIFACTS", "6"], ["VALIDATION EXPECTATIONS", engineeringContract.validationExpectations.join(" · ")], ["HUMAN CONSTRAINT", validationContract.constraints[0]], ["REQUIRED CONTROL", validationContract.constraints[1]], ["GOVERNANCE PREREQUISITE", validationContract.governancePrerequisites[0]], ["VALIDATION AUTHORITY", validationContract.validationAuthority]];
  $("#validation-contract-fields").innerHTML = fields.map(([label, value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("");
}

function renderValidationChecks() {
  $("#validation-check-list").innerHTML = validationChecks.map((check) => { const status = state.validationCheckStatuses.get(check.id) || "Pending"; return `<button class="validation-check status-${status.toLowerCase().replaceAll(" ", "-")}" type="button" data-validation-check="${check.id}"><span><i>${status === "Pass" ? "✓" : status === "Fail" ? "!" : "·"}</i><small>${check.severity.toUpperCase()}</small></span><strong>${check.name}</strong><p>${check.artifact}</p><em>${status.toUpperCase()}</em></button>`; }).join("");
}

function renderValidationObjects() {
  const objects = validationWorkObjects.filter((item) => state.validationWorkObjectIds.has(item.id));
  $("#validation-work-objects").innerHTML = objects.map((item, index) => `<button type="button" data-validation-object="${item.id}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${item.title}</strong><small>DR-CIC-001 · ${index + 1}</small></div><em>ATTACHED</em></button>`).join("");
}

function renderValidationReport() {
  if (!state.validationReport) { $("#validation-report-title").textContent = "PENDING"; $("#validation-report-fields").innerHTML = `<p>Complete the independent validation and governed correction flow to publish the report.</p>`; return; }
  const report = state.validationReport;
  $("#validation-report-title").textContent = "VR-DR-CIC-001 / FINAL";
  const fields = [["CASE ID", report.caseId], ["PACKAGE", report.packageId], ["CHECKS EXECUTED", "7"], ["INITIAL PASSES", "6"], ["INITIAL FAILURES", "1"], ["CORRECTION APPLIED", "Yes"], ["IMPACTED CHECKS RERUN", "3"], ["FINAL CRITICAL CHECKS", "7 of 7 passed"], ["PACKAGE STATUS", report.finalStatus], ["REMAINING CONDITION", report.remainingConditions[0]], ["CONFIDENCE", report.confidence], ["NEXT ACTION", report.nextAction]];
  $("#validation-report-fields").innerHTML = fields.map(([label, value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("");
}

function renderCorrectionProposal() {
  $("#correction-content").innerHTML = `<div class="correction-summary"><span><small>AFFECTED ARTIFACT</small><strong>customer_metrics_converted.sql · v1 → v2</strong></span><span><small>ADDED TEST</small><strong>Quarterly renewal null-handling regression</strong></span><span><small>IMPACTED CHECKS</small><strong>Null Behaviour · Aggregate · Representative Query</strong></span><span><small>UNCHANGED ARTIFACTS</small><strong>5 of 6 preserved</strong></span></div><div class="correction-sql"><div><small>ORIGINAL BIGQUERY SQL / V1</small><pre><code>SUM(CASE WHEN renewal_value IS NULL\n  THEN 0 ELSE renewal_value END)</code></pre></div><i>→</i><div><small>CORRECTED BIGQUERY SQL / V2</small><pre><code>SUM(IFNULL(CASE WHEN is_renewal\n  THEN renewal_value END, 0))</code></pre></div></div><p>Change explanation: normalize nulls inside the nested CASE expression before aggregation. Lineage: VC-E04 → Aggregate failure → CP-DR-CIC-001.</p>`;
}

function renderValidationWorkspace() {
  const workspace = $("#validation-workspace");
  workspace.hidden = !state.validationEntered;
  if (!state.validationEntered) return;
  const snapshot = currentCaseSnapshot();
  renderValidationContract();
  renderValidationChecks();
  renderValidationObjects();
  renderValidationReport();
  $("#validation-status").textContent = snapshot.stage.toUpperCase();
  $("#validation-owner").textContent = snapshot.owner.toUpperCase();
  $("#run-validation").hidden = state.validationStatus !== "contract-review";
  $("#validation-specialist-state").textContent = state.validationStatus === "contract-review" ? "CONTRACT REVIEW" : state.validationStatus === "running" ? "EXECUTING CHECKS" : state.validationStatus === "exception" ? "INVESTIGATING EXCEPTION" : state.validationStatus === "rerunning" ? "TARGETED RERUN" : state.validationStatus === "complete" ? "VALIDATION COMPLETE" : "GOVERNED CORRECTION";
  $("#validation-result-state").textContent = state.validationStatus === "complete" ? "VALIDATED WITH CONDITIONS" : state.validationStatus === "exception" ? "VALIDATION EXCEPTION" : state.validationStatus === "running" ? "IN PROGRESS" : state.validationStatus === "rerunning" ? "TARGETED RERUN" : state.validationStatus === "contract-review" ? "NOT RUN" : "CORRECTION CONTROL";
  $("#validation-result-count").textContent = state.validationStatus === "complete" ? "7 / 7 PASSED" : `${state.validationRun.executedChecks.length} / 7 CHECKS`;
  $("#validation-failure").hidden = !["exception", "correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus);
  $("#correction-proposal").hidden = !["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus);
  if (!$("#correction-proposal").hidden) renderCorrectionProposal();
  $("#targeted-rerun").hidden = state.validationStatus !== "correction-applied";
  $("#executive-handoff").hidden = state.validationStatus !== "complete";
  workspace.classList.toggle("is-exception", ["exception", "correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus));
  const inspectable = state.validationRun.executedChecks.length > 0;
  $$("[data-validation-action]").forEach((button) => { const action = button.dataset.validationAction; button.disabled = ["contract", "engineering"].includes(action) ? false : action === "report" ? state.validationStatus !== "complete" : !inspectable; });
}

function openValidationWorkspace() {
  if (state.engineeringStatus !== "validation-ready" || state.validationStatus !== "idle") return;
  state.validationEntered = true;
  state.validationStatus = "contract-review";
  state.validationWorkObjectIds.add("validation-contract-object");
  state.migrationPackage.validationStatus = "Contract ready";
  state.agentStates.set("agent-07", "Contract Review");
  const lab = $(".zone-validation");
  lab.classList.remove("is-locked"); lab.classList.add("is-open"); $(".zone-lock", lab).hidden = true;
  $("#validation-workspace").classList.remove("is-entering"); void $("#validation-workspace").offsetWidth; $("#validation-workspace").classList.add("is-entering");
  renderHqState();
  $("#validation-workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startIndependentValidation() {
  if (state.validationStatus !== "contract-review") return;
  state.validationStatus = "running";
  state.validationStep = 0;
  state.validationWorkObjectIds.add("validation-run-object");
  state.validationRun.status = "Running"; state.validationRun.startedAt = "Sequence 01";
  state.migrationPackage.validationStatus = "In Progress";
  state.agentStates.set("agent-07", "Validating");
  runValidationStep();
}

function runValidationStep() {
  const sequence = $("#validation-check-list");
  state.validationCheckStatuses.set(validationChecks[state.validationStep].id, "Running");
  sequence.dataset.validationStep = String(state.validationStep);
  sequence.classList.remove("is-validating"); void sequence.offsetWidth; sequence.classList.add("is-validating");
  renderHqState();
}

function completeValidationStep() {
  if (state.validationStatus !== "running") return;
  const check = validationChecks[state.validationStep];
  state.validationCheckStatuses.set(check.id, check.initialStatus);
  state.validationRun.executedChecks.push(check.id);
  if (check.initialStatus === "Pass") state.validationRun.passedChecks.push(check.id); else { state.validationRun.failedChecks.push(check.id); state.validationRun.findings.push("Quarterly customer-renewal aggregate differs by 1.8%."); }
  if (state.validationStep < validationChecks.length - 1) { state.validationStep += 1; runValidationStep(); return; }
  $("#validation-check-list").classList.remove("is-validating");
  state.validationStatus = "exception";
  state.validationRun.status = "Exception"; state.validationRun.completedAt = "Sequence 07";
  state.validationWorkObjectIds.add("validation-finding-object");
  state.migrationPackage.validationStatus = "Validation Exception";
  state.agentStates.set("agent-07", "Exception Found");
  renderHqState();
}

function inspectValidationCheck(id) {
  const check = validationChecks.find((item) => item.id === id); if (!check) return;
  const status = state.validationCheckStatuses.get(id) || "Pending";
  $("#validation-inspector").innerHTML = `<p class="eyebrow">VALIDATION CHECK / ${status.toUpperCase()}</p><h3>${check.name}</h3><div class="check-detail"><span><small>OWNER</small><strong>Validation Specialist</strong></span><span><small>ARTIFACT</small><strong>${check.artifact}</strong></span><span><small>EXPECTED</small><strong>${check.expected}</strong></span><span><small>ACTUAL</small><strong>${check.initialActual}</strong></span><span><small>EVIDENCE</small><strong>${check.evidence}</strong></span><span><small>SEVERITY</small><strong>${check.severity}</strong></span><span><small>NEXT ACTION</small><strong>${check.nextAction}</strong></span></div>`;
}

function investigateFailure() {
  if (state.validationStatus !== "exception") return;
  state.validationStatus = "correction-proposed";
  state.validationWorkObjectIds.add("failure-investigation-object");
  state.validationWorkObjectIds.add("correction-proposal-object");
  state.agentStates.set("agent-06", "Correction Proposed");
  $("#validation-inspector").innerHTML = `<p class="eyebrow">FAILURE INVESTIGATION / VC-E04</p><h3>Quarterly customer-renewal aggregate differs by 1.8%</h3><div class="check-detail"><span><small>EXPECTED</small><strong>Match within 0.1%</strong></span><span><small>ACTUAL</small><strong>1.8% variance</strong></span><span><small>AFFECTED METRIC</small><strong>Quarterly customer renewal rate</strong></span><span><small>AFFECTED ARTIFACT</small><strong>customer_metrics_converted.sql</strong></span><span><small>ROOT CAUSE</small><strong>Oracle null-handling in a nested CASE expression was translated incorrectly.</strong></span><span><small>RISK</small><strong>Executive renewal reporting may be materially inconsistent.</strong></span><span><small>RECOMMENDED ACTION</small><strong>Correct SQL and add a null-handling regression test.</strong></span></div>`;
  renderHqState();
}

function handleCorrectionDecision(decision) {
  if (!["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus)) return;
  if (decision === "artifact") { $("#engineering-workspace").scrollIntoView({ behavior: "smooth", block: "start" }); artifactInspector("converted-sql"); return; }
  if (decision === "reject") { state.validationStatus = "correction-rejected"; state.correctionProposal.approvalStatus = "Rejected"; $("#correction-decision-status").textContent = "Correction rejected. The package remains at Validation Exception; no artifact changed."; renderHqState(); return; }
  if (decision === "evidence") { state.validationStatus = "evidence-requested"; state.correctionProposal.approvalStatus = "More evidence requested"; $("#correction-decision-status").innerHTML = `Targeted evidence requested: nested null samples, aggregate trace, and regression-test expectation. <button type="button" id="return-correction-gate">Return to Correction Gate</button>`; renderHqState(); return; }
  if (decision === "approve") {
    state.correctionProposal.approvalStatus = "Approved by Mission Commander";
    state.correctedArtifactVersion = "v2"; state.regressionTestAttached = true;
    state.validationWorkObjectIds.add("correction-approval-object");
    state.validationStatus = "correction-applied";
    state.migrationPackage.validationStatus = "Correction Applied";
    state.agentStates.set("agent-06", "Correction Applied"); state.agentStates.set("agent-07", "Rerun Ready");
    renderHqState();
  }
}

function startTargetedRerun() {
  if (state.validationStatus !== "correction-applied") return;
  state.validationStatus = "rerunning"; state.rerunStep = 0;
  state.validationWorkObjectIds.add("targeted-rerun-object");
  state.agentStates.set("agent-07", "Targeted Rerun");
  runTargetedRerunStep();
}

function runTargetedRerunStep() {
  const ids = ["null", "aggregate", "representative"];
  state.validationCheckStatuses.set(ids[state.rerunStep], "Rerunning");
  const sequence = $("#validation-check-list"); sequence.dataset.rerunStep = String(state.rerunStep); sequence.classList.remove("is-rerunning"); void sequence.offsetWidth; sequence.classList.add("is-rerunning");
  renderHqState();
}

function completeTargetedRerunStep() {
  if (state.validationStatus !== "rerunning") return;
  const ids = ["null", "aggregate", "representative"];
  state.validationCheckStatuses.set(ids[state.rerunStep], "Pass");
  if (state.rerunStep < 2) { state.rerunStep += 1; runTargetedRerunStep(); return; }
  $("#validation-check-list").classList.remove("is-rerunning");
  state.validationStatus = "complete";
  state.validationReport = createValidationReport();
  state.validationWorkObjectIds.add("validation-report-object");
  state.migrationPackage.validationStatus = "Validated with Conditions";
  state.validationRun.status = "Complete";
  state.agentStates.set("agent-07", "Validation Complete"); state.agentStates.set("agent-08", "Roadmap Ready");
  $("#validation-inspector").innerHTML = `<p class="eyebrow">TARGETED RERUN / COMPLETE</p><h3>All impacted checks pass</h3><p>Aggregate variance: <strong>1.8% → 0.0%</strong>. Unrelated checks and five unchanged artifacts were preserved.</p>`;
  renderHqState();
}

function validationActionContent(action) {
  const contents = {
    contract: `<p class="eyebrow">VALIDATION CONTRACT / VC-DR-CIC-001</p><h3>Independent authority and explicit thresholds</h3><p>Seven checks, aggregate and row-count thresholds of 0.1%, six-month report freeze, six-week dual run, and Mission Commander correction approval.</p>`,
    failed: `<p class="eyebrow">FAILED ARTIFACT / CUSTOMER_METRICS_CONVERTED.SQL</p><h3>Aggregate Equivalence failed</h3><p>The generated v1 SQL remains inspectable. It is linked to VC-E04 and has not been replaced without approval.</p>`,
    root: `<p class="eyebrow">ROOT CAUSE</p><h3>Oracle null-handling semantic drift</h3><p>Null normalization was placed outside the translated nested CASE expression, changing the quarterly aggregate by 1.8%.</p>`,
    impact: `<p class="eyebrow">BUSINESS IMPACT / HIGH</p><h3>Executive renewal metric may be incorrect</h3><p>A material inconsistency could reach executive customer-renewal reporting if the package proceeded without correction.</p>`,
    proposal: `<p class="eyebrow">CORRECTION PROPOSAL / CP-DR-CIC-001</p><h3>One artifact replacement; one regression test</h3><p>Codex proposes customer_metrics_converted.sql v2. Five other artifacts remain unchanged. Mission Commander approval is pending.</p>`,
    sql: `<div class="correction-sql"><div><small>ORIGINAL / V1</small><pre><code>SUM(CASE WHEN renewal_value IS NULL\n THEN 0 ELSE renewal_value END)</code></pre></div><i>→</i><div><small>CORRECTED / V2</small><pre><code>SUM(IFNULL(CASE WHEN is_renewal\n THEN renewal_value END, 0))</code></pre></div></div>`,
    regression: `<p class="eyebrow">NEW REGRESSION TEST</p><h3>Quarterly renewal nested-null condition</h3><pre><code>def test_quarterly_renewal_nested_nulls():\n    assert aggregate_variance == 0.0</code></pre><p>Attached only after Mission Commander approval.</p>`,
    rerun: `<p class="eyebrow">TARGETED RERUN</p><h3>Three impacted checks only</h3><p>Null-Behaviour Equivalence · Aggregate Equivalence · Representative-Query Comparison. Four unrelated passes are preserved.</p>`,
    report: state.validationReport ? `<p class="eyebrow">FINAL VALIDATION REPORT</p><h3>Validated with Conditions · High confidence</h3><p>7 of 7 critical checks pass after one governed correction. Remaining condition: ownership and change authority for twelve reports before cutover.</p>` : ""
  }; return contents[action];
}

function handleValidationAction(action) {
  if (action === "engineering") { $("#engineering-workspace").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  const content = validationActionContent(action); if (content) $("#validation-inspector").innerHTML = content;
  $$("[data-validation-action]").forEach((button) => button.classList.toggle("is-selected", button.dataset.validationAction === action));
}

function executiveRoadmapWaves() {
  const waves = Object.fromEntries(Object.entries(portfolioRoadmap.baselineWaves).map(([wave, ids]) => [wave, [...ids]]));
  if (state.roadmapView === "simulation") {
    waves[2] = waves[2].filter((id) => id !== portfolioRoadmap.simulationResult.movedProductId);
    waves[3] = [...waves[3], portfolioRoadmap.simulationResult.movedProductId];
  }
  return waves;
}

function renderExecutiveEvidence() {
  $("#executive-evidence-chain").innerHTML = executiveEvidenceChain.map((item) => `<button type="button" data-executive-evidence="${item.id}" class="${state.executiveSelectedEvidence === item.id ? "is-selected" : ""}"><span>${item.sequence}</span><strong>${item.label}</strong><i>✓</i></button>`).join("");
}

function renderExecutiveRecommendation() {
  $("#executive-recommendation-content").innerHTML = `<div class="recommendation-initiatives">${executiveRecommendation.initiatives.map((item, index) => `<article><small>WAVE 1 / INITIATIVE ${index + 1}</small><h3>${item.name}</h3><strong>${item.strategy}</strong><p>${item.rationale}</p></article>`).join("")}</div><p class="recommendation-rationale">${executiveRecommendation.rationale}</p>`;
}

function roadmapProductCard(id) {
  const product = products.find((item) => item.id === id);
  const assignment = roadmapProducts.find((item) => item.productId === id);
  return `<button type="button" data-roadmap-product="${id}" class="roadmap-product${state.selectedRoadmapProductId === id ? " is-selected" : ""}"><span><strong>${product.name}</strong><small>${assignment.strategy}</small></span><em>${assignment.readiness}</em></button>`;
}

function renderPortfolioRoadmap() {
  const waves = executiveRoadmapWaves();
  $("#roadmap-waves").innerHTML = Object.entries(waves).map(([wave, ids]) => `<section class="roadmap-wave"><header><small>PORTFOLIO SEQUENCE</small><h3>Wave ${wave}</h3><span>${ids.length} products</span></header><div>${ids.map(roadmapProductCard).join("")}</div></section>`).join("");
  $("#simulation-banner").hidden = !state.capacitySimulationActive;
}

function renderExecutiveObjects() {
  const attached = executiveWorkObjects.filter((item) => state.executiveWorkObjectIds.has(item.id));
  $("#executive-work-objects").innerHTML = attached.map((item) => `<button type="button" data-executive-object="${item.id}"><span>${item.sequence}</span><span><strong>${item.title}</strong><small>${item.owner}</small></span><em>ATTACHED</em></button>`).join("") || `<p>Executive work objects are released through explicit synthesis and approval.</p>`;
  if (!state.executiveDecisionRecord) {
    $("#executive-record-title").textContent = "PENDING APPROVAL";
    $("#executive-record-fields").innerHTML = `<p>Wave 1 remains unapproved until the Mission Commander acts.</p>`;
    return;
  }
  $("#executive-record-title").textContent = "APPROVED / TRACE ATTACHED";
  $("#executive-record-fields").innerHTML = Object.entries(state.executiveDecisionRecord).map(([key, value]) => `<span><small>${key.replaceAll(/([A-Z])/g, " $1").toUpperCase()}</small><strong>${value}</strong></span>`).join("");
}

function renderExecutiveWorkspace() {
  $("#executive-workspace").hidden = !state.executiveEntered;
  if (!state.executiveEntered) return;
  renderExecutiveEvidence();
  $("#executive-status").textContent = state.executiveStatus === "approved" ? "EXECUTION READY WITH CONDITIONS" : state.executiveStatus === "preparing" ? "PREPARING ROADMAP" : state.executivePrepared ? "ROADMAP READY" : "EXECUTIVE REVIEW";
  $("#executive-owner").textContent = state.executiveStatus === "approved" ? "TRANSFORMATION OFFICE" : state.executivePrepared ? "MISSION COMMANDER" : "EXECUTIVE ADVISOR";
  $("#prepare-roadmap").hidden = state.executivePrepared || state.executiveStatus === "preparing";
  $("#prepare-roadmap").disabled = state.executiveStatus !== "review";
  ["#executive-recommendation", "#portfolio-roadmap", "#supplier-proof"].forEach((selector) => { $(selector).hidden = !state.executivePrepared; });
  if (state.executivePrepared) { renderExecutiveRecommendation(); renderPortfolioRoadmap(); }
  renderExecutiveObjects();
  $("#wave-approval-gate").hidden = !state.executivePrepared || state.executiveStatus === "approved";
  $("#execution-summary").hidden = state.executiveStatus !== "approved";
  $("#executive-actions").classList.toggle("is-locked", !state.executivePrepared);
}

function openExecutiveWorkspace() {
  if (state.validationStatus !== "complete" || state.executiveEntered) return;
  state.executiveEntered = true;
  state.executiveStatus = "review";
  state.executiveWorkObjectIds.add("executive-evidence-pack");
  state.agentStates.set("agent-08", "Executive Review");
  $("#executive-boundary").textContent = "Executive Workspace active · evidence review precedes roadmap synthesis.";
  renderHqState();
  $("#executive-workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function prepareExecutiveRoadmap() {
  if (state.executiveStatus !== "review") return;
  state.executiveStatus = "preparing";
  state.agentStates.set("agent-08", "Synthesizing");
  const chain = $("#executive-evidence-chain");
  chain.classList.remove("is-synthesizing"); void chain.offsetWidth; chain.classList.add("is-synthesizing");
  renderHqState();
}

function completeExecutiveSynthesis() {
  if (state.executiveStatus !== "preparing") return;
  state.executivePrepared = true;
  state.executiveStatus = "roadmap-ready";
  ["executive-recommendation-object", "portfolio-roadmap-object", "wave-one-proposal"].forEach((id) => state.executiveWorkObjectIds.add(id));
  state.agentStates.set("agent-08", "Recommendation Ready");
  $("#executive-inspector").innerHTML = `<p class="eyebrow">EXECUTIVE ROADMAP / READY FOR DECISION</p><h3>Two Wave 1 initiatives proposed</h3><p>The validated warehouse replatform and bounded supplier-quality refactor are ready for Mission Commander review. No wave has been approved automatically.</p>`;
  renderHqState();
}

function inspectExecutiveEvidence(id) {
  const item = executiveEvidenceChain.find((entry) => entry.id === id); if (!item) return;
  state.executiveSelectedEvidence = id;
  $("#executive-inspector").innerHTML = `<p class="eyebrow">EVIDENCE CHAIN / ${item.sequence} OF 11</p><h3>${item.label}</h3><p>${item.summary}</p><small>Trace: DR-CIC-001 → ${item.label} → ${executiveRecommendation.id}</small>`;
  renderExecutiveEvidence();
}

function inspectRoadmapProduct(id) {
  const product = products.find((item) => item.id === id); const item = roadmapProducts.find((entry) => entry.productId === id); if (!product || !item) return;
  state.selectedRoadmapProductId = id;
  const simulatedMove = state.roadmapView === "simulation" && id === "data-02";
  const nextAction = simulatedMove ? "Reconfirm Wave 3 capacity and production-report prerequisites" : item.nextAction;
  $("#executive-inspector").innerHTML = `<p class="eyebrow">PORTFOLIO ROADMAP / ${product.id.toUpperCase()}</p><h3>${product.name}</h3><div class="executive-detail-grid"><span><small>STRATEGY</small><strong>${item.strategy}</strong></span><span><small>WAVE</small><strong>Wave ${simulatedMove ? 3 : item.wave}</strong></span><span><small>RATIONALE</small><strong>${item.rationale}${simulatedMove ? " Capacity reduced by 25%; prerequisite confirmation moves with the product." : ""}</strong></span><span><small>DEPENDENCY</small><strong>${item.dependency}</strong></span><span><small>STATUS</small><strong>${item.status}</strong></span><span><small>READINESS</small><strong>${item.readiness}</strong></span><span><small>BLOCKER</small><strong>${item.blocker}</strong></span><span><small>NEXT ACTION</small><strong>${nextAction}</strong></span></div>`;
  renderPortfolioRoadmap();
}

function executiveActionContent(action) {
  const content = {
    recommendation: ["Executive Recommendation", executiveRecommendation.rationale],
    evidence: ["Eleven-stage evidence chain", "Every recommendation traces from portfolio evidence through governed correction and final validation."],
    history: ["Decision history", "Risk objection → Mission Commander six-month constraint → revised staged plan → engineering package → correction approval → validation complete."],
    delta: ["What changed", "Timeline 4 → 7 months · cost +11% · operational risk −34% · validation variance 1.8% → 0.0% · confidence High."],
    "wave-1": ["Wave 1", "Customer Analytics Warehouse staged replatform · Supplier Quality Portal incremental refactor."],
    "wave-2": ["Wave 2", "Customer Service Portal · Supplier Data Lake · Manufacturing Data Mart."],
    "wave-3": ["Wave 3", "Maintenance System · Engineering Viewer · Dealer Order Management · Finance Warehouse · Product Telemetry Platform."],
    product: ["Product rationale", "Select any roadmap product to inspect its strategy, dependency, readiness, blocker, and next action."],
    validation: ["Validation evidence", "Six artifacts generated. One 1.8% aggregate exception was corrected. Seven of seven critical checks now pass."],
    condition: ["Remaining condition", "Resolve ownership and change authority for twelve dependent finance reports before cutover."],
    strategies: ["Two modernization strategies", "Customer Analytics Warehouse: staged replatform. Supplier Quality Portal: incremental refactor with supplier-inspection extraction."],
    "validation-return": ["Validation Workspace", "Final status: Validated with Conditions · High confidence · 7/7 critical checks passed."]
  };
  return content[action];
}

function handleExecutiveAction(action) {
  if (action === "validation-return") { $("#validation-workspace").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  if (!state.executivePrepared) return;
  if (action === "capacity") {
    state.capacitySimulationActive = true; state.roadmapView = "simulation"; state.executiveWorkObjectIds.add("capacity-simulation");
    $("#executive-inspector").innerHTML = `<p class="eyebrow">UNAPPROVED CAPACITY SIMULATION / −25%</p><h3>Only Manufacturing Data Mart moves from Wave 2 to Wave 3</h3><p>Customer Service Portal stays in Wave 2. Supplier Data Lake stays in Wave 2 because Product Telemetry depends on it. Wave 1 is unchanged. ${portfolioRoadmap.simulationResult.rationale}</p><small>The approved baseline has not been overwritten.</small>`;
    renderHqState(); return;
  }
  const item = executiveActionContent(action); if (item) $("#executive-inspector").innerHTML = `<p class="eyebrow">EXECUTIVE INSPECTION</p><h3>${item[0]}</h3><p>${item[1]}</p>`;
}

function handleWaveDecision(decision) {
  if (!state.executivePrepared || state.executiveStatus === "approved") return;
  if (decision === "evidence") { $("#executive-evidence-chain").scrollIntoView({ behavior: "smooth", block: "center" }); $("#wave-decision-status").textContent = "Returned to the evidence chain; approval remains pending."; return; }
  if (decision === "revise") { state.executiveStatus = "revision-requested"; portfolioRoadmap.approvalStatus = "Revision Requested"; $("#wave-decision-status").textContent = "Revised roadmap requested. The governed baseline and evidence remain attached."; renderHqState(); return; }
  state.executiveStatus = "approved";
  portfolioRoadmap.approvalStatus = "Wave 1 Approved";
  state.executiveDecisionRecord = createExecutiveDecisionRecord();
  state.executiveWorkObjectIds.add("wave-one-approval"); state.executiveWorkObjectIds.add("executive-decision-record");
  state.agentStates.set("agent-08", "Complete");
  setProductState("data-01", "Execution Ready with Conditions"); setProductState("app-01", "Planning Ready");
  $("#wave-decision-status").textContent = "Wave 1 approved and attached to DR-CIC-001.";
  renderHqState();
}

function inspectExecutiveObject(id) {
  const item = executiveWorkObjects.find((entry) => entry.id === id); if (!item || !state.executiveWorkObjectIds.has(id)) return;
  $("#executive-inspector").innerHTML = `<p class="eyebrow">EXECUTIVE WORK OBJECT / ${item.sequence}</p><h3>${item.title}</h3><p>Owner: ${item.owner}. Attached to DR-CIC-001 with recommendation, roadmap, validation, approval, and remaining-condition traceability.</p>`;
}

function currentDemoStep() {
  if (state.validationStatus === "complete" || state.executiveEntered) return 9;
  if (["exception", "correction-proposed", "evidence-requested", "correction-rejected", "correction-applied", "rerunning"].includes(state.validationStatus)) return 8;
  if (state.engineeringStatus === "validation-ready" || state.validationEntered) return 7;
  if (state.propagationStatus === "approved" || state.engineeringEntered) return 6;
  if (state.decisionStatus === "ready-replanning" || state.propagationStatus !== "idle") return 5;
  if (state.workspaceStatus === "blocked" || state.decisionStatus !== "idle") return 4;
  if (state.assessmentReady || state.hqEntered || state.workspaceStatus !== "idle") return 3;
  if (state.discovery === "complete" || state.portfolioState === "Assessment Running" || state.capabilityState) return 2;
  return 1;
}

function guidedNextAction(step) {
  if (step === 1) return state.discovery === "running" ? "Observe evidence resolution" : "Begin Portfolio Discovery";
  if (step === 2) {
    if (state.portfolioState === "Discovery Complete") return "Continue to Assessment";
    if (state.portfolioState === "Assessment Running") return "Observe capability formation";
    if (!$("#capability-inspector").hidden && state.assessmentMode !== "initiative") return "Assess as One Initiative";
    return "Inspect Customer Intelligence Capability";
  }
  if (step === 3) {
    if (state.experience !== "hq") return "Continue to Decision Room";
    if (state.hqTransition === "running") return "Observe the case handoff";
    if (state.workspaceStatus === "idle") return "Start Workspace Flow";
    return state.workspaceStatus === "paused" ? "Resume Workspace" : "Observe specialist handoffs";
  }
  if (step === 4) {
    if (state.decisionStatus === "idle") return "Assemble Decision Positions";
    if (state.decisionStatus === "assembling") return "Observe specialist positions";
    if (!state.decisionQuestionOpen) return "Resolve Decision";
    return "Yes — protect finance reports for six months";
  }
  if (step === 5) {
    if (state.propagationStatus === "idle") return "Propagate Constraint";
    if (state.propagationStatus === "running") return "Observe the causal plan changes";
    return "Approve Revised Plan";
  }
  if (step === 6) {
    if (state.engineeringStatus === "idle") return "Continue to Engineering Workspace";
    if (state.engineeringStatus === "contract-review") return "Generate Migration Starter Package";
    if (state.engineeringStatus === "generating") return "Observe six linked artifacts";
    return "Assemble Package";
  }
  if (step === 7) {
    if (!state.validationEntered) return "Continue to Validation Workspace";
    if (state.validationStatus === "contract-review") return "Run Independent Validation";
    return "Observe the intentional semantic failure";
  }
  if (step === 8) {
    if (state.validationStatus === "exception") return "Investigate Failure";
    if (["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus)) return "Approve Correction and Rerun";
    if (state.validationStatus === "correction-applied") return "Rerun Impacted Validation";
    return "Observe three targeted checks";
  }
  if (!state.executiveEntered) return "Continue to Executive Workspace";
  if (!state.executivePrepared) return "Prepare Executive Roadmap";
  if (state.executiveStatus !== "approved") return "Approve Wave 1";
  return "Inspect Decision Lineage or Replay Demo";
}

function demoStateIsReliable() {
  const artifacts = state.migrationPackage.generatedArtifacts;
  const baseline = portfolioRoadmap.baselineWaves;
  return new Set(artifacts).size === artifacts.length
    && state.generatedArtifactIds.size <= engineeringArtifacts.length
    && state.executiveWorkObjectIds.size <= executiveWorkObjects.length
    && baseline[1].join("|") === "data-01|app-01"
    && baseline[2].join("|") === "app-03|data-03|data-02"
    && (!state.executiveDecisionRecord || state.executiveStatus === "approved")
    && (state.correctedArtifactVersion !== "v2" || state.correctionProposal.approvalStatus === "Approved by Mission Commander");
}

function renderGuidedDemo() {
  const step = currentDemoStep();
  const definition = guidedDemoSteps[step - 1];
  const cue = $("#guided-cue");
  cue.hidden = !state.guidedDemo;
  cue.dataset.reliable = String(demoStateIsReliable());
  $("#guided-demo-toggle").checked = state.guidedDemo;
  if (!state.guidedDemo) return;
  $("#guided-step-count").textContent = `STEP ${step} OF 9`;
  $("#guided-step-title").textContent = definition.title;
  $("#guided-objective").textContent = definition.objective;
  $("#guided-next-action").textContent = guidedNextAction(step);
  $("#guided-presenter-cue").textContent = `“${definition.presenter}”`;
  $("#guided-duration").textContent = `${definition.duration} seconds`;
  const progress = state.executiveStatus === "approved" ? 100 : Math.round(((step - 1) / 9) * 100);
  $("#guided-progress-label").textContent = `${progress}% COMPLETE`;
  $("#guided-progress-bar").style.width = `${progress}%`;
}

function setGuidedDemo(enabled) {
  state.guidedDemo = Boolean(enabled);
  renderGuidedDemo();
}

function setDemoPace(pace) {
  if (!['normal', 'fast'].includes(pace)) return;
  state.demoPace = pace;
  document.body.classList.toggle("demo-fast", pace === "fast");
  $$('[data-demo-pace]').forEach((button) => { const active = button.dataset.demoPace === pace; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
}

function resetToGuidedStep(targetStep) {
  if (!Number.isInteger(targetStep) || targetStep < 1 || targetStep > 9) return false;
  document.body.classList.add("is-stage-resetting");
  resetDemo();
  if (targetStep >= 2) {
    $("#begin-discovery").disabled = true;
    revealDependencies();
    completeDiscovery();
  }
  if (targetStep >= 3) {
    continueToAssessment(); completeCapabilityFormation(); selectCapability(); assessAsInitiative();
    openExperience("hq"); completeHqHandoff();
  }
  if (targetStep >= 4) {
    startWorkspaceFlow();
    for (let index = 0; index < 4; index += 1) completeWorkspaceTransition();
  }
  if (targetStep >= 5) {
    startDecisionMovement();
    for (let index = 0; index < 3; index += 1) completeDecisionStep();
    handleDecisionAction("resolve"); selectCommanderDecision("yes");
  }
  if (targetStep >= 6) {
    startPropagation();
    for (let index = 0; index < propagationNodes.length; index += 1) completePropagationStep();
    approveRevisedPlan();
  }
  if (targetStep >= 7) {
    openEngineeringWorkspace(); startEngineeringGeneration();
    while (state.engineeringStatus === "generating") completeEngineeringStep();
    finalizeMigrationPackage();
  }
  if (targetStep >= 8) {
    openValidationWorkspace(); startIndependentValidation();
    while (state.validationStatus === "running") completeValidationStep();
  }
  if (targetStep >= 9) {
    investigateFailure(); handleCorrectionDecision("approve"); startTargetedRerun();
    while (state.validationStatus === "rerunning") completeTargetedRerunStep();
  }
  document.body.classList.remove("is-stage-resetting");
  renderHqState();
  return demoStateIsReliable();
}

function resetCurrentStage() {
  if (isSupplierCase()) { programIntelligence.resetCase(); renderHqState(); return; }
  resetToGuidedStep(currentDemoStep());
}
function restartGuidedDemo() { setGuidedDemo(true); resetToGuidedStep(1); }

function toggleDemoInfo(force) {
  const panel = $("#demo-info-panel");
  const open = typeof force === "boolean" ? force : panel.hidden;
  panel.hidden = !open;
  $("#simulation-info").setAttribute("aria-expanded", String(open));
  if (open) $("#demo-info-title").focus?.();
}

function inspectDecisionLineage() {
  if (state.executiveStatus !== "approved") return;
  $("#executive-inspector").innerHTML = `<p class="eyebrow">DECISION LINEAGE / DR-CIC-001</p><h3>Portfolio evidence → Human Constraint → Engineering → Validation → Wave 1 Approval</h3><p>Eleven governed evidence stages connect the Mission Commander’s six-month finance-report constraint, six generated artifacts, one approved semantic correction, seven passing checks, and the final two-initiative roadmap.</p>`;
  $("#executive-inspector").scrollIntoView({ behavior: "smooth", block: "center" });
}

function hqAgentMessage(id) {
  const snapshot = currentCaseSnapshot();
  if (["contract-review", "running", "exception", "correction-applied", "rerunning"].includes(state.validationStatus) && id === "agent-07") return `${snapshot.task}. Independent results remain attached to VC-DR-CIC-001.`;
  if (["correction-proposed", "evidence-requested", "correction-rejected"].includes(state.validationStatus) && id === "agent-06") return "Correction proposal is evidence-linked and awaits Mission Commander authority.";
  if (["contract-review", "generating", "package-generated"].includes(state.engineeringStatus) && id === "agent-06") return `${snapshot.task}. All outputs remain attached to EC-DR-CIC-001.`;
  if (state.engineeringStatus === "validation-ready" && id === "agent-07") return "Migration Starter Package received. Independent validation begins in Version 0.8.";
  if (state.propagationStatus === "running" && state.agentStates.get(id) === "Updating") return `Attaching the ${propagationNodes[state.propagationStep].label} consequence to DR-CIC-001.`;
  if (state.propagationStatus === "running" && snapshot.ownerId === id) return `Updating ${snapshot.task.replace("Update ", "")} because the Human Constraint changed the plan.`;
  if (state.propagationStatus === "complete" && id === "agent-05") return "Five revised work objects attached. Waiting for revised-plan approval.";
  if (state.propagationStatus === "approved" && id === "agent-06") return "Engineering Ready. Waiting to generate the migration starter package in Version 0.7.";
  if (state.workspaceStatus === "running" && snapshot.ownerId === id) return `Working on ${snapshot.task}.`;
  if (state.workspaceStatus === "paused" && snapshot.ownerId === id) return `Workspace paused. Retains ownership of ${snapshot.task}.`;
  if (state.completedWorkObjectIds.has(workspaceWorkObjects.find((item) => item.agentId === id)?.id)) return "Review attached to DR-CIC-001. Returned to specialist workspace.";
  if (state.hqTransition === "running") {
    if (id === "agent-01") return "Sending the shared evidence package into the room.";
    if (["agent-02", "agent-03", "agent-04"].includes(id)) return "Moving to the Shared Decision Room.";
  }
  if (state.hqCaseLocation === "decision-room" && (assessmentAgentIds.has(id) || id === "agent-04")) return "Standing by for the next case handoff.";
  return {
    "agent-01": "Monitoring the enterprise portfolio.",
    "agent-02": "Reviewing platform boundaries.",
    "agent-03": "Mapping capability outcomes.",
    "agent-04": "Watching evidence exceptions.",
    "agent-05": "Waiting for an approved constraint to propagate.",
    "agent-08": "Waiting to explain governed plan consequences."
  }[id] || "Available in a future stage.";
}

function renderHqState() {
  const snapshot = currentCaseSnapshot();
  $("#hq-experience").dataset.activeCase = activeCaseId();
  $("#reset-current-stage").textContent = isSupplierCase() ? "Reset Current Case" : "Reset Current Stage";
  const workflow = state.workspaceStage >= 0 ? snapshot.stage : state.portfolioState || "Unverified";
  $("#hq-workflow-stage").textContent = workflow.toUpperCase();
  $("#hq-selected-capability").textContent = isSupplierCase() ? "SUPPLIER QUALITY PORTAL" : state.capabilityState ? "CUSTOMER INTELLIGENCE" : "AWAITING FORMATION";
  const activeCount = ["agent-01", "agent-02", "agent-03", "agent-04", "agent-05", "agent-08"].filter((id) => ["Working", "Investigating", "Reasoning", "Propagating", "Updating"].includes(state.agentStates.get(id))).length;
  $("#hq-active-count").textContent = String(activeCount);
  $("#hq-next-action").textContent = hqNextAction();
  $("#hq-artifact-count").textContent = `${state.generatedArtifactIds.size} / 6`;
  $("#hq-validation-status").textContent = state.migrationPackage.validationStatus.toUpperCase();
  $("#hq-roadmap-status").textContent = state.executiveStatus === "approved" ? "WAVE 1 APPROVED" : state.capacitySimulationActive ? "SIMULATION PREVIEW" : state.executivePrepared ? "BASELINE READY" : "NOT PREPARED";
  $("#center-active-case").disabled = isSupplierCase() ? false : !state.capabilityState;
  const caseState = state.workspaceStage >= 0 ? snapshot.stage.toUpperCase() : state.hqCaseLocation === "decision-room" ? "IN SHARED DECISION ROOM" : state.assessmentReady ? "ASSESSMENT READY" : state.capabilityState ? state.capabilityState.toUpperCase() : "AWAITING ASSESSMENT";
  $("#hq-case-state").textContent = caseState;
  $("#hq-case-owner").textContent = snapshot.owner.toUpperCase();
  $("#hq-case-task").textContent = snapshot.task.toUpperCase();
  $("#hq-case-blocker").textContent = snapshot.blocker.toUpperCase();
  $("#hq-case-next").textContent = snapshot.next.toUpperCase();
  $("#hq-case-current-evidence").textContent = snapshot.evidence.toUpperCase();
  $("#hq-case-recommendation").textContent = `RECOMMENDATION / ${snapshot.recommendation}`;
  const caseDefinition = programIntelligence?.cases[activeCaseId()];
  $("#hq-active-case-name").textContent = caseDefinition.name;
  $("#hq-active-case-id").textContent = caseDefinition.id;
  $("#hq-case-file").setAttribute("aria-label", `Inspect ${caseDefinition.name} modernization case`);
  if (isSupplierCase()) {
    $("#hq-active-case-products").innerHTML = `<span>Supplier Quality Portal</span>`;
    $("#hq-active-case-dependency").innerHTML = `<i></i><span>Supplier Master API</span><small>Shared program dependency</small>`;
  } else {
    $("#hq-active-case-products").innerHTML = `<span>Customer Service Portal</span><span>Customer Analytics Warehouse</span><span>Product Telemetry Platform</span>`;
    $("#hq-active-case-dependency").innerHTML = `<i></i><span>Finance Warehouse</span><small>12 dependent finance reports</small>`;
  }
  $("#hq-case-file").classList.toggle("is-dormant", !isSupplierCase() && !state.capabilityState);
  $$("[data-hq-agent]").forEach((persona) => {
    const id = persona.dataset.hqAgent;
    const specialist = hqSpecialists[id];
    const personaState = specialist.active || (id === "agent-07" && (state.engineeringStatus === "validation-ready" || state.validationEntered)) ? (state.agentStates.get(id) || "Idle") : "Locked";
    $("[data-hq-state]", persona).textContent = personaState.toUpperCase();
    $("[data-hq-message]", persona).textContent = hqAgentMessage(id);
    persona.classList.toggle("is-collaborating", state.workspaceStatus === "running" && snapshot.ownerId === id);
    persona.classList.toggle("is-review-complete", state.completedWorkObjectIds.has(workspaceWorkObjects.find((item) => item.agentId === id)?.id));
  });
  const executiveZone = $(".zone-executive");
  const executiveEnabled = state.propagationStatus !== "idle";
  executiveZone.classList.toggle("is-locked", !executiveEnabled);
  executiveZone.classList.toggle("is-open", executiveEnabled);
  $(".zone-lock", executiveZone).hidden = executiveEnabled;
  const codexZone = $(".zone-codex");
  codexZone.classList.toggle("is-locked", !state.engineeringEntered);
  codexZone.classList.toggle("is-open", state.engineeringEntered);
  $(".zone-lock", codexZone).hidden = state.engineeringEntered;
  const validationZone = $(".zone-validation");
  validationZone.classList.toggle("is-locked", !state.validationEntered);
  validationZone.classList.toggle("is-open", state.validationEntered);
  $(".zone-lock", validationZone).hidden = state.validationEntered;
  renderWorkspaceState();
  renderExecutiveWorkspace();
  renderGuidedDemo();
  if (state.selectedHqAgent) renderHqAgentPanel(state.selectedHqAgent);
  else if (state.selectedWorkObjectId) renderWorkObjectPanel(state.selectedWorkObjectId);
}

function openExperience(experience, options = {}) {
  if (!["mission-control", "hq"].includes(experience)) return;
  const { updateHash = true, startHandoff = true } = options;
  state.experience = experience;
  $$("[data-experience-panel]").forEach((panel) => { panel.hidden = panel.dataset.experiencePanel !== experience; });
  $$("[data-experience-switch]").forEach((button) => {
    const active = button.dataset.experienceSwitch === experience;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderHqState();
  if (experience === "hq" && state.assessmentReady && !state.hqEntered && startHandoff) beginHqHandoff();
  if (updateHash) history.replaceState(null, "", experience === "hq" ? "#hq" : `#${state.view}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setHqMove(element, target) {
  const sourceBox = element.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();
  element.style.setProperty("--hq-move-x", `${targetBox.left + targetBox.width / 2 - sourceBox.left - sourceBox.width / 2}px`);
  element.style.setProperty("--hq-move-y", `${targetBox.top + targetBox.height / 2 - sourceBox.top - sourceBox.height / 2}px`);
}

function beginHqHandoff() {
  if (!state.assessmentReady || state.hqTransition !== "idle") return;
  state.hqEntered = true;
  state.hqTransition = "running";
  state.hqCaseLocation = "moving";
  state.agentStates.set("agent-01", "Investigating");
  state.agentStates.set("agent-02", "Reasoning");
  state.agentStates.set("agent-03", "Reasoning");
  state.agentStates.set("agent-04", "Reasoning");
  refreshAgentNodes();
  renderHqState();
  const floor = $("#hq-floor");
  setHqMove($("#hq-case-file"), $("#hq-decision-target"));
  ["agent-02", "agent-03", "agent-04"].forEach((id) => setHqMove($(`[data-hq-agent="${id}"]`), $(`[data-collaboration-target="${id}"]`)));
  floor.classList.remove("is-handing-off", "is-handoff-complete", "is-collaboration-ready");
  void floor.offsetWidth;
  floor.classList.add("is-handing-off");
}

function completeHqHandoff() {
  if (state.hqTransition !== "running") return;
  state.hqTransition = "complete";
  state.hqCaseLocation = "decision-room";
  ["agent-01", "agent-02", "agent-03", "agent-04"].forEach((id) => state.agentStates.set(id, "Ready"));
  refreshAgentNodes();
  $("#hq-floor").classList.remove("is-handing-off");
  $("#hq-floor").classList.add("is-handoff-complete", "is-collaboration-ready");
  renderHqState();
}

function renderHqAgentPanel(id) {
  const specialist = hqSpecialists[id];
  if (!specialist) return;
  const agentState = specialist.active ? (state.agentStates.get(id) || "Idle") : id === "agent-05" ? "Idle" : "Locked";
  const actions = specialist.active ? `<div class="hq-action-list"><button type="button" data-hq-action="evidence">Show my evidence</button><button type="button" data-hq-action="responsibility">Explain my responsibility</button><button type="button" data-hq-action="concern">Show current concern</button><button type="button" data-hq-action="compare">Compare my perspective</button><button type="button" data-hq-action="join">Join the Decision Room</button></div><div class="hq-agent-response" id="hq-agent-response">Select a focused action. Responses are concise, mocked, and grounded in the shared case file.</div>` : `<div class="hq-locked-note">This persona is visible for continuity but remains outside the Version 0.4X active scope.</div>`;
  $("#hq-context-panel").innerHTML = `<div class="hq-panel-content"><p class="eyebrow">SPECIALIST CONTEXT</p><div class="hq-panel-title"><span class="persona-figure" aria-hidden="true"><i></i><b></b></span><div><h2>${specialist.title}</h2><p>${specialist.role}</p></div></div><div class="hq-panel-state"><span><small>CURRENT STATE</small><strong>${agentState.toUpperCase()}</strong></span><span><small>HOME WORKSPACE</small><strong>${specialist.zone.toUpperCase()}</strong></span></div><p class="panel-summary">${hqAgentMessage(id)}</p>${actions}</div>`;
}

function selectHqAgent(id) {
  state.selectedHqAgent = id;
  state.selectedWorkObjectId = null;
  $$("[data-hq-agent]").forEach((persona) => {
    const selected = persona.dataset.hqAgent === id;
    persona.classList.toggle("is-selected", selected);
    persona.setAttribute("aria-pressed", String(selected));
  });
  renderHqAgentPanel(id);
}

function renderWorkObjectPanel(id) {
  const workObject = workspaceWorkObjects.find((item) => item.id === id);
  if (!workObject) return;
  const status = workObjectStatus(workspaceWorkObjects.indexOf(workObject));
  $("#hq-context-panel").innerHTML = `<div class="hq-panel-content work-detail"><p class="eyebrow">WORK OBJECT / ${workObject.sequence}</p><div class="work-detail-title"><span>${workObject.sequence}</span><div><h2>${workObject.title}</h2><p>${workObject.owner}</p></div></div><div class="hq-panel-state"><span><small>STATUS</small><strong>${status.toUpperCase()}</strong></span><span><small>ATTACHED EVIDENCE</small><strong>${workObject.evidenceCount.toUpperCase()}</strong></span></div><dl><div><dt>FINDING</dt><dd>${workObject.finding}</dd></div><div><dt>CURRENT CONCERN</dt><dd>${workObject.concern}</dd></div><div><dt>NEXT ACTION</dt><dd>${workObject.next}</dd></div></dl><div class="panel-callout">Attached to shared decision record <strong>DR-CIC-001</strong>.</div></div>`;
}

function selectWorkObject(id) {
  const executiveObject = executiveWorkObjects.find((item) => item.id === id && state.executiveWorkObjectIds.has(item.id));
  if (executiveObject) {
    state.selectedHqAgent = null; state.selectedWorkObjectId = id;
    $("#hq-context-panel").innerHTML = `<div class="hq-panel-content work-detail"><p class="eyebrow">EXECUTIVE WORK OBJECT / DR-CIC-001</p><div class="work-detail-title"><span>${executiveObject.sequence}</span><div><h2>${executiveObject.title}</h2><p>${executiveObject.owner}</p></div></div><div class="hq-panel-state"><span><small>STATUS</small><strong>ATTACHED</strong></span><span><small>ROADMAP</small><strong>PR-DR-CIC-001</strong></span></div><dl><div><dt>TRACEABILITY</dt><dd>Evidence chain → validation report → executive recommendation → governed Wave 1 decision.</dd></div><div><dt>REMAINING CONDITION</dt><dd>Finance report ownership and change authority before cutover.</dd></div></dl></div>`;
    renderWorkObjects(); return;
  }
  const validationObject = validationWorkObjects.find((item) => item.id === id && state.validationWorkObjectIds.has(item.id));
  if (validationObject) {
    state.selectedHqAgent = null; state.selectedWorkObjectId = id;
    $("#hq-context-panel").innerHTML = `<div class="hq-panel-content work-detail"><p class="eyebrow">VALIDATION WORK OBJECT / DR-CIC-001</p><div class="work-detail-title"><span>✓</span><div><h2>${validationObject.title}</h2><p>Validation Specialist</p></div></div><div class="hq-panel-state"><span><small>STATUS</small><strong>ATTACHED</strong></span><span><small>CONTRACT</small><strong>VC-DR-CIC-001</strong></span></div><dl><div><dt>TRACEABILITY</dt><dd>Migration Starter Package → Validation evidence → ${validationObject.title}.</dd></div><div><dt>GOVERNANCE CONDITION</dt><dd>Report ownership and change authority remain required before cutover.</dd></div></dl></div>`;
    renderWorkObjects(); return;
  }
  const engineeringObject = engineeringWorkObjects.find((item) => item.id === id && state.engineeringWorkObjectIds.has(item.id));
  if (engineeringObject) {
    state.selectedHqAgent = null;
    state.selectedWorkObjectId = id;
    $("#hq-context-panel").innerHTML = `<div class="hq-panel-content work-detail"><p class="eyebrow">ENGINEERING WORK OBJECT / DR-CIC-001</p><div class="work-detail-title"><span>✓</span><div><h2>${engineeringObject.title}</h2><p>${engineeringObject.id === "engineering-contract" ? "Mission Commander" : "Modernization Engineer"}</p></div></div><div class="hq-panel-state"><span><small>STATUS</small><strong>ATTACHED</strong></span><span><small>CONTRACT</small><strong>EC-DR-CIC-001</strong></span></div><dl><div><dt>TRACEABILITY</dt><dd>Approved Revised Plan → Engineering Contract → ${engineeringObject.title}.</dd></div><div><dt>VALIDATION</dt><dd>${engineeringObject.id === "package-object" ? "Ready for independent validation." : "Not run."}</dd></div></dl></div>`;
    renderWorkObjects();
    return;
  }
  const propagatedObject = propagationWorkObjects.find((item) => item.id === id && state.propagationWorkObjectIds.has(item.id));
  if (propagatedObject) {
    state.selectedHqAgent = null;
    state.selectedWorkObjectId = id;
    $("#hq-context-panel").innerHTML = `<div class="hq-panel-content work-detail"><p class="eyebrow">PROPAGATED WORK OBJECT / DR-CIC-001</p><div class="work-detail-title"><span>✓</span><div><h2>${propagatedObject.title}</h2><p>${propagatedObject.owner}</p></div></div><div class="hq-panel-state"><span><small>STATUS</small><strong>ATTACHED</strong></span><span><small>CAUSE</small><strong>HUMAN CONSTRAINT</strong></span></div><dl><div><dt>WHY IT CHANGED</dt><dd>${propagatedObject.finding}</dd></div><div><dt>TRACEABILITY</dt><dd>Finance reports frozen for six months · DR-CIC-001.</dd></div></dl></div>`;
    renderWorkObjects();
    return;
  }
  if (id === "constraint" && state.humanConstraintAttached) {
    state.selectedHqAgent = null;
    state.selectedWorkObjectId = "constraint";
    $("#hq-context-panel").innerHTML = `<div class="hq-panel-content work-detail"><p class="eyebrow">HUMAN CONSTRAINT / DR-CIC-001</p><div class="work-detail-title"><span>06</span><div><h2>${state.commanderDecision === "yes" ? "Finance reports frozen for six months" : "Governed report change permitted"}</h2><p>Mission Commander</p></div></div><div class="hq-panel-state"><span><small>STATUS</small><strong>ATTACHED</strong></span><span><small>NEXT OWNER</small><strong>WAVE PLANNING</strong></span></div><dl><div><dt>REMAINING GOVERNANCE ACTION</dt><dd>Confirm report ownership and change authority.</dd></div><div><dt>NEXT ACTION</dt><dd>Propagate Constraint in Version 0.6.</dd></div></dl></div>`;
    renderWorkObjects();
    return;
  }
  if (!workspaceWorkObjects.some((item) => item.id === id)) return;
  state.selectedHqAgent = null;
  state.selectedWorkObjectId = id;
  $$('[data-hq-agent]').forEach((persona) => { persona.classList.remove("is-selected"); persona.setAttribute("aria-pressed", "false"); });
  renderWorkObjects();
  renderWorkObjectPanel(id);
}

function renderCasePanel(focus = "summary") {
  const snapshot = currentCaseSnapshot();
  const definition = programIntelligence.cases[activeCaseId()];
  const focused = {
    owner: `<strong>${snapshot.owner}</strong> currently owns <strong>${snapshot.task}</strong>.`,
    blocker: snapshot.blocker === "None" ? "No active blocker is attached to the case." : `<strong>${snapshot.blocker}.</strong> The case is waiting for accountable human action.`,
    next: `<strong>${snapshot.next}.</strong> Completed work will not replay when the view changes.`
  }[focus] || "Select a focused case action to inspect ownership, blockers, or the next handoff.";
  state.selectedHqAgent = null;
  state.selectedWorkObjectId = null;
  state.selectedEnterpriseContextId = null;
  $("#hq-context-panel").innerHTML = `<div class="hq-panel-content case-detail"><p class="eyebrow">MODERNIZATION CASE / ${definition.id}</p><h2>${definition.name}</h2><p class="panel-summary">${definition.purpose}</p><div class="hq-panel-state"><span><small>CURRENT STAGE</small><strong>${snapshot.stage.toUpperCase()}</strong></span><span><small>CURRENT OWNER</small><strong>${snapshot.owner.toUpperCase()}</strong></span></div><div class="case-detail-actions"><button type="button" data-case-detail="owner">Inspect Current Owner</button><button type="button" data-case-detail="blocker">Show Blocker</button><button type="button" data-case-detail="next">Show Next Action</button></div><div class="hq-agent-response" id="case-detail-response">${focused}</div><div class="case-detail-products">${definition.dependencies.map((item) => `<span class="is-dependency">${item}</span>`).join("")}</div></div>`;
}

function handleCaseAction(action) {
  if (action === "mission") { openExperience("mission-control"); return; }
  if (action === "hq") { openExperience("hq"); return; }
  if (action === "inspect") { openExperience("hq"); renderCasePanel(); }
}

function handleCaseDetail(focus) {
  renderCasePanel(focus);
  $$('[data-case-detail]').forEach((button) => button.classList.toggle("is-selected", button.dataset.caseDetail === focus));
}

function startWorkspaceTransition() {
  if (state.workspaceStatus !== "running" || state.workspaceTransition || state.workspaceStage < 0 || state.workspaceStage > 3) return;
  const workObject = workspaceWorkObjects[state.workspaceStage];
  const floor = $("#hq-floor");
  const persona = $(`[data-hq-agent="${workObject.agentId}"]`);
  setHqMove(persona, $(`[data-collaboration-target="${workObject.agentId}"]`));
  state.workspaceTransition = true;
  state.agentStates.set(workObject.agentId, "Working");
  floor.dataset.workspaceStep = String(state.workspaceStage);
  floor.classList.remove("is-workspace-transition");
  void floor.offsetWidth;
  floor.classList.add("is-workspace-transition");
  renderHqState();
}

function startWorkspaceFlow() {
  if (isSupplierCase()) { programIntelligence.advanceCase(); renderHqState(); return; }
  if (!state.assessmentReady || state.hqTransition !== "complete" || state.workspaceStatus !== "idle") return;
  state.workspaceStage = 0;
  state.workspaceStatus = "running";
  state.workspacePauseRequested = false;
  startWorkspaceTransition();
}

function pauseWorkspace() {
  if (isSupplierCase()) { programIntelligence.pauseCase(); renderHqState(); return; }
  if (state.workspaceStatus !== "running") return;
  state.workspacePauseRequested = true;
  if (!state.workspaceTransition) state.workspaceStatus = "paused";
  renderHqState();
}

function resumeWorkspace() {
  if (isSupplierCase()) { programIntelligence.resumeCase(); renderHqState(); return; }
  if (state.workspaceStatus !== "paused") return;
  state.workspaceStatus = "running";
  state.workspacePauseRequested = false;
  renderHqState();
  startWorkspaceTransition();
}

function completeWorkspaceTransition() {
  if (!state.workspaceTransition || state.workspaceStage < 0 || state.workspaceStage > 3) return;
  const completed = workspaceWorkObjects[state.workspaceStage];
  const floor = $("#hq-floor");
  floor.classList.remove("is-workspace-transition");
  state.workspaceTransition = false;
  state.completedWorkObjectIds.add(completed.id);
  state.agentStates.set(completed.agentId, "Complete");
  if (state.workspaceStage === 3) {
    state.workspaceStage = 4;
    state.workspaceStatus = "blocked";
    state.workspacePauseRequested = false;
  } else {
    state.workspaceStage += 1;
    state.workspaceStatus = state.workspacePauseRequested ? "paused" : "running";
    state.workspacePauseRequested = false;
  }
  renderHqState();
  if (state.workspaceStatus === "running") startWorkspaceTransition();
}

function handleHqAction(action) {
  const specialist = hqSpecialists[state.selectedHqAgent];
  if (!specialist || !specialist.active) return;
  const responses = {
    evidence: specialist.evidence,
    responsibility: specialist.responsibility,
    concern: specialist.concern,
    compare: specialist.perspective,
    join: state.assessmentReady ? state.hqCaseLocation === "decision-room" ? "I am already collaborating around the shared Customer Intelligence Capability record." : "The case is Assessment Ready. I am joining the Shared Decision Room now." : "The capability must reach Assessment Ready before I can join the Shared Decision Room."
  };
  $("#hq-agent-response").textContent = responses[action];
  $$("[data-hq-action]").forEach((button) => button.classList.toggle("is-selected", button.dataset.hqAction === action));
  if (action === "join" && state.assessmentReady && state.hqTransition === "idle") beginHqHandoff();
}

function centerActiveCase() {
  openExperience("hq");
  const target = !isSupplierCase() && state.assessmentReady ? $("#hq-decision-target") : $("#hq-case-file");
  target.scrollIntoView({ behavior: "smooth", block: "center" });
}

function continueToDecisionRoom() {
  if (!state.assessmentReady || state.assessmentMode !== "initiative") return;
  openExperience("hq");
}

function navigate(view, updateHash = true) {
  if (!["portfolio", "decision", "factory"].includes(view)) return;
  state.view = view;
  $$("[data-environment]").forEach((section) => { const active = section.dataset.environment === view; section.hidden = !active; section.classList.toggle("is-visible", active); });
  $$("[data-view]").forEach((control) => { const active = control.dataset.view === view; control.classList.toggle("is-active", active); if (active) control.setAttribute("aria-current", "page"); else control.removeAttribute("aria-current"); });
  $(".environment-nav").dataset.progress = String({ portfolio: 0, decision: 1, factory: 2 }[view]);
  if (updateHash) history.replaceState(null, "", `#${view}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetAssessmentLandscape() {
  $$("[data-product-id]").forEach((card) => card.remove());
  ["#capability-products", "#finance-dependency-card", "#operations-products", "#enablement-products"].forEach((selector) => { $(selector).innerHTML = ""; });
  renderProducts();
  $("#assessment-landscape").hidden = true;
  $("#assessment-landscape").classList.remove("is-capability-formed");
  $(".portfolio-layout").hidden = false;
  $("#discovery-console").hidden = false;
  $("#capability-inspector").hidden = true;
  $("#initiative-confirmation").hidden = true;
  $("#decision-room-handoff").hidden = true;
  $(".assessment-agent-field").classList.remove("is-assessing", "is-complete");
  $("#customer-intelligence-cluster").className = "capability-cluster is-forming";
  $("#select-capability").disabled = true;
  $("#assess-individually").classList.remove("is-selected");
  $("#assess-initiative").classList.remove("is-selected");
  $("#assessment-choice-status").textContent = "Choose an assessment boundary.";
  $("#portfolio-title").textContent = "Portfolio Command Center";
  $("#portfolio-title + p").textContent = "Survey the synthetic Apex Aerospace estate and select a product to inspect its modernization posture.";
}

function resetHqState() {
  state.experience = "mission-control";
  state.hqEntered = false;
  state.hqTransition = "idle";
  state.hqCaseLocation = "portfolio-studio";
  state.selectedHqAgent = null;
  state.selectedWorkObjectId = null;
  state.selectedEnterpriseContextId = null;
  state.workspaceStage = -1;
  state.workspaceStatus = "idle";
  state.workspaceTransition = false;
  state.workspacePauseRequested = false;
  state.completedWorkObjectIds = new Set();
  state.decisionStatus = "idle";
  state.decisionStep = -1;
  state.positionsAttached = new Set();
  state.decisionChallengeAttached = false;
  state.decisionQuestionOpen = false;
  state.commanderDecision = null;
  state.humanConstraintAttached = false;
  state.propagationStatus = "idle";
  state.propagationStep = -1;
  state.propagatedNodeIds = new Set();
  state.propagationWorkObjectIds = new Set();
  state.engineeringEntered = false;
  state.engineeringStatus = "idle";
  state.engineeringStep = -1;
  state.generatedArtifactIds = new Set();
  state.engineeringWorkObjectIds = new Set();
  state.selectedArtifactId = null;
  state.migrationPackage = createMigrationPackage();
  state.validationEntered = false;
  state.validationStatus = "idle";
  state.validationStep = -1;
  state.validationCheckStatuses = new Map();
  state.validationWorkObjectIds = new Set();
  state.validationRun = createValidationRun();
  state.correctionProposal = createCorrectionProposal();
  state.correctedArtifactVersion = "v1";
  state.regressionTestAttached = false;
  state.rerunStep = -1;
  state.validationReport = null;
  state.executiveEntered = false;
  state.executiveStatus = "idle";
  state.executivePrepared = false;
  state.executiveSelectedEvidence = null;
  state.selectedRoadmapProductId = null;
  state.roadmapView = "baseline";
  state.capacitySimulationActive = false;
  state.executiveWorkObjectIds = new Set();
  state.executiveDecisionRecord = null;
  portfolioRoadmap.approvalStatus = "Pending Mission Commander";
  const floor = $("#hq-floor");
  floor.classList.remove("is-handing-off", "is-handoff-complete", "is-collaboration-ready", "is-workspace-transition");
  floor.removeAttribute("data-workspace-step");
  [$("#hq-case-file"), ...$$('[data-hq-agent]')].forEach((element) => {
    element.style.removeProperty("--hq-move-x");
    element.style.removeProperty("--hq-move-y");
    element.classList.remove("is-selected", "is-collaborating", "is-review-complete");
    if (element.hasAttribute("aria-pressed")) element.setAttribute("aria-pressed", "false");
  });
  $("#hq-context-panel").innerHTML = `<div class="hq-panel-empty"><span class="target-reticle" aria-hidden="true"><i></i></span><p class="eyebrow">WORKSPACE CONTEXT</p><h2>Inspect the active work</h2><p>Select the case, a work object, or a specialist to see concise ownership and next-action detail.</p></div>`;
  $("#shared-decision-canvas").hidden = true;
  $("#decision-stage").classList.remove("is-positioning");
  $("#decision-stage").dataset.decisionStep = "-1";
  $$("[data-decision-position]").forEach((node) => node.classList.remove("is-attached"));
  $$("[data-decision-action]").forEach((button) => button.classList.remove("is-selected"));
  $("#human-decision-gate").hidden = true;
  $("#decision-outcome").hidden = true;
  $("#decision-outcome").innerHTML = "";
  $("#decision-inspector").innerHTML = `<p class="eyebrow">DECISION RECORD / INSPECTION</p><h3>Positions are ready to assemble</h3><p>Select Assemble Decision Positions to attach all three governed recommendations to the shared case.</p>`;
  $("#propagation-workspace").hidden = true;
  $("#propagation-chain").classList.remove("is-propagating");
  $("#propagation-chain").dataset.propagationStep = "-1";
  $("#propagation-nodes").innerHTML = "";
  $("#propagation-work-objects").innerHTML = "";
  $("#wave-plan").innerHTML = "";
  $$("[data-propagation-action]").forEach((button) => button.classList.remove("is-selected"));
  $("#propagation-inspector").innerHTML = `<p class="eyebrow">CONSTRAINT IMPACT / AWAITING AUTHORIZATION</p><h3>Propagation has not started</h3><p>Select Propagate Constraint to watch cause and effect move through eight governed planning nodes.</p>`;
  $("#revised-plan-gate").hidden = true;
  $("#engineering-handoff").hidden = true;
  $("#engineering-workspace").hidden = true;
  $("#engineering-workspace").classList.remove("is-entering");
  $("#engineering-sequence").classList.remove("is-generating");
  $("#engineering-sequence").dataset.engineeringStep = "-1";
  $("#engineering-contract-fields").innerHTML = "";
  $("#engineering-sequence-steps").innerHTML = "";
  $("#engineering-queue-lanes").innerHTML = "";
  $("#artifact-list").innerHTML = "";
  $("#engineering-work-objects").innerHTML = "";
  $("#validation-handoff").hidden = true;
  $("#engineering-inspector").innerHTML = `<p class="eyebrow">ENGINEERING INTENT / GOVERNED INPUT</p><h3>Inspect the contract before generation</h3><p>Artifacts are not generated until the Mission Commander explicitly authorizes the Migration Starter Package.</p>`;
  $$("[data-engineering-action]").forEach((button) => button.classList.remove("is-selected"));
  $("#validation-workspace").hidden = true;
  $("#validation-workspace").classList.remove("is-entering", "is-exception");
  $("#validation-check-list").classList.remove("is-validating", "is-rerunning");
  $("#validation-check-list").innerHTML = "";
  $("#validation-contract-fields").innerHTML = "";
  $("#validation-work-objects").innerHTML = "";
  $("#validation-failure").hidden = true;
  $("#correction-proposal").hidden = true;
  $("#targeted-rerun").hidden = true;
  $("#executive-handoff").hidden = true;
  $("#executive-workspace").hidden = true;
  $("#executive-evidence-chain").classList.remove("is-synthesizing");
  $("#executive-evidence-chain").innerHTML = "";
  $("#executive-recommendation").hidden = true;
  $("#portfolio-roadmap").hidden = true;
  $("#supplier-proof").hidden = true;
  $("#wave-approval-gate").hidden = true;
  $("#execution-summary").hidden = true;
  $("#executive-work-objects").innerHTML = "";
  $("#executive-record-fields").innerHTML = `<p>Wave 1 remains unapproved until the Mission Commander acts.</p>`;
  $("#executive-inspector").innerHTML = `<p class="eyebrow">EXECUTIVE SYNTHESIS / EVIDENCE FIRST</p><h3>Trace the case before preparing the roadmap</h3><p>Every evidence-chain stage is inspectable. Roadmap synthesis requires explicit authorization.</p>`;
  $("#wave-decision-status").textContent = "";
  $("#validation-inspector").innerHTML = `<p class="eyebrow">INDEPENDENT QUALITY GATE / AWAITING AUTHORIZATION</p><h3>Validation has not started</h3><p>Inspect the Validation Contract, then explicitly run the seven deterministic checks.</p>`;
  $("#correction-decision-status").innerHTML = "";
  $$("[data-validation-action]").forEach((button) => button.classList.remove("is-selected"));
}

function resetDemo() {
  if (programIntelligence) programIntelligence.resetAll();
  state.discovery = "unverified";
  state.portfolioState = "Unverified";
  state.capabilityState = null;
  state.assessmentMode = null;
  state.assessmentReady = false;
  initializeEntityStates();
  resetHqState();
  clearProduct();
  clearAgent();
  resetAssessmentLandscape();
  setDiscoveryAgents(false);
  refreshAgentNodes();
  $$(".evidence-token-layer").forEach((layer) => layer.remove());
  const dependencyMap = $("#dependency-map");
  dependencyMap.hidden = true;
  dependencyMap.classList.remove("is-revealed");
  $("#discovery-summary").hidden = true;
  $("#portfolio-state").textContent = "UNVERIFIED";
  $(".discovery-state").classList.remove("is-complete");
  $("#discovery-progress").textContent = "Awaiting discovery authorization";
  $("#discovery-progress").classList.remove("is-running");
  const button = $("#begin-discovery");
  button.disabled = false;
  button.firstChild.textContent = "Begin Portfolio Discovery ";
  navigate("portfolio", false);
  openExperience("mission-control");
  if (typeof globalThis.resetPortfolioUploadLab === "function") globalThis.resetPortfolioUploadLab();
}

function init() {
  initializeEntityStates();
  renderProducts();
  renderAgents();
  $("#reset-demo").addEventListener("click", resetDemo);
  $$('[data-enterprise-context]').forEach((context) => context.addEventListener("click", (event) => {
    const node = event.target.closest('[data-enterprise-context-id]');
    if (node) selectEnterpriseContext(node.dataset.enterpriseContextId);
  }));
  $$('[data-program-intelligence]').forEach((panel) => panel.addEventListener("click", (event) => {
    const action = event.target.closest('[data-program-action]');
    if (action) handleProgramAction(action);
  }));
  $$('[data-view]').forEach((control) => control.addEventListener("click", () => navigate(control.dataset.view)));
  $$('[data-view-link]').forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); navigate(link.dataset.viewLink, false); openExperience("mission-control"); }));
  $$('[data-experience-switch]').forEach((button) => button.addEventListener("click", () => openExperience(button.dataset.experienceSwitch)));
  $("#guided-demo-toggle").addEventListener("change", (event) => setGuidedDemo(event.target.checked));
  $$('[data-demo-pace]').forEach((button) => button.addEventListener("click", () => setDemoPace(button.dataset.demoPace)));
  $("#simulation-info").addEventListener("click", () => toggleDemoInfo());
  $("#close-demo-info").addEventListener("click", () => toggleDemoInfo(false));
  $("#reset-current-stage").addEventListener("click", resetCurrentStage);
  $("#restart-guided-demo").addEventListener("click", restartGuidedDemo);
  $("#disable-guided-demo").addEventListener("click", () => setGuidedDemo(false));
  $("#replay-demo").addEventListener("click", restartGuidedDemo);
  $("#inspect-decision-lineage").addEventListener("click", inspectDecisionLineage);
  $("#begin-discovery").addEventListener("click", beginDiscovery);
  $("#continue-assessment").addEventListener("click", continueToAssessment);
  $("#select-capability").addEventListener("click", selectCapability);
  $("#assess-individually").addEventListener("click", assessIndividually);
  $("#assess-initiative").addEventListener("click", assessAsInitiative);
  $("#continue-decision-room").addEventListener("click", continueToDecisionRoom);
  $("#center-active-case").addEventListener("click", centerActiveCase);
  $("#start-workspace").addEventListener("click", startWorkspaceFlow);
  $("#pause-workspace").addEventListener("click", pauseWorkspace);
  $("#resume-workspace").addEventListener("click", resumeWorkspace);
  $("#assemble-positions").addEventListener("click", startDecisionMovement);
  $("#decision-actions").addEventListener("click", (event) => { const button = event.target.closest("[data-decision-action]"); if (button) handleDecisionAction(button.dataset.decisionAction); });
  $("#decision-stage").addEventListener("click", (event) => { const position = event.target.closest("[data-decision-position]"); if (position) selectDecisionPosition(position.dataset.decisionPosition); else if (event.target.closest("#decision-case-core")) renderCasePanel(); });
  $("#human-decision-gate").addEventListener("click", (event) => { const option = event.target.closest("[data-commander-decision]"); if (option) selectCommanderDecision(option.dataset.commanderDecision); });
  $("#decision-outcome").addEventListener("click", (event) => {
    if (event.target.closest("#return-decision-gate")) { state.commanderDecision = null; state.decisionStatus = "unresolved"; state.decisionQuestionOpen = true; $("#decision-outcome").hidden = true; $("#human-decision-gate").hidden = false; renderHqState(); }
    if (event.target.closest("#continue-propagation")) openPropagationWorkspace();
  });
  $("#propagate-constraint").addEventListener("click", startPropagation);
  $("#propagation-actions").addEventListener("click", (event) => { const action = event.target.closest("[data-propagation-action]"); if (action) handlePropagationAction(action.dataset.propagationAction); });
  $("#propagation-work-objects").addEventListener("click", (event) => { const object = event.target.closest("[data-propagation-object]"); if (object) inspectPropagationObject(object.dataset.propagationObject); });
  $("#approve-revised-plan").addEventListener("click", approveRevisedPlan);
  $("#continue-engineering").addEventListener("click", openEngineeringWorkspace);
  $("#generate-package").addEventListener("click", startEngineeringGeneration);
  $("#artifact-list").addEventListener("click", (event) => { const artifact = event.target.closest("[data-artifact-id]"); if (artifact) artifactInspector(artifact.dataset.artifactId); });
  $("#engineering-work-objects").addEventListener("click", (event) => { const object = event.target.closest("[data-engineering-object]"); if (object) selectWorkObject(object.dataset.engineeringObject); });
  $("#engineering-actions").addEventListener("click", (event) => { const action = event.target.closest("[data-engineering-action]"); if (action) handleEngineeringAction(action.dataset.engineeringAction); });
  $("#continue-validation").addEventListener("click", openValidationWorkspace);
  $("#run-validation").addEventListener("click", startIndependentValidation);
  $("#validation-check-list").addEventListener("click", (event) => { const check = event.target.closest("[data-validation-check]"); if (check) inspectValidationCheck(check.dataset.validationCheck); });
  $("#investigate-failure").addEventListener("click", investigateFailure);
  $("#correction-proposal").addEventListener("click", (event) => { const decision = event.target.closest("[data-correction-decision]"); if (decision) handleCorrectionDecision(decision.dataset.correctionDecision); if (event.target.closest("#return-correction-gate")) { state.validationStatus = "correction-proposed"; state.correctionProposal.approvalStatus = "Pending"; $("#correction-decision-status").textContent = "Returned to the governed correction gate."; renderHqState(); } });
  $("#rerun-impacted").addEventListener("click", startTargetedRerun);
  $("#validation-work-objects").addEventListener("click", (event) => { const object = event.target.closest("[data-validation-object]"); if (object) selectWorkObject(object.dataset.validationObject); });
  $("#validation-actions").addEventListener("click", (event) => { const action = event.target.closest("[data-validation-action]"); if (action) handleValidationAction(action.dataset.validationAction); });
  $("#continue-executive").addEventListener("click", openExecutiveWorkspace);
  $("#prepare-roadmap").addEventListener("click", prepareExecutiveRoadmap);
  $("#executive-evidence-chain").addEventListener("click", (event) => { const item = event.target.closest("[data-executive-evidence]"); if (item) inspectExecutiveEvidence(item.dataset.executiveEvidence); });
  $("#roadmap-waves").addEventListener("click", (event) => { const item = event.target.closest("[data-roadmap-product]"); if (item) inspectRoadmapProduct(item.dataset.roadmapProduct); });
  $("#executive-actions").addEventListener("click", (event) => { const action = event.target.closest("[data-executive-action]"); if (action) handleExecutiveAction(action.dataset.executiveAction); });
  $("#executive-work-objects").addEventListener("click", (event) => { const object = event.target.closest("[data-executive-object]"); if (object) inspectExecutiveObject(object.dataset.executiveObject); });
  $("#wave-approval-gate").addEventListener("click", (event) => { const decision = event.target.closest("[data-wave-decision]"); if (decision) handleWaveDecision(decision.dataset.waveDecision); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !$("#demo-info-panel").hidden) toggleDemoInfo(false); });
  $$('[data-hq-agent]').forEach((persona) => persona.addEventListener("click", () => selectHqAgent(persona.dataset.hqAgent)));
  $("#hq-context-panel").addEventListener("click", (event) => {
    const action = event.target.closest("[data-hq-action]");
    if (action) handleHqAction(action.dataset.hqAction);
    const caseDetail = event.target.closest("[data-case-detail]");
    if (caseDetail) handleCaseDetail(caseDetail.dataset.caseDetail);
  });
  $("#workspace-work-objects").addEventListener("click", (event) => {
    const programAction = event.target.closest('[data-program-action]');
    if (programAction) { handleProgramAction(programAction); return; }
    const workObject = event.target.closest("[data-work-object]");
    if (workObject) selectWorkObject(workObject.dataset.workObject);
  });
  $$('[data-case-action]').forEach((button) => button.addEventListener("click", () => handleCaseAction(button.dataset.caseAction)));
  $("#hq-case-file").addEventListener("click", (event) => {
    const caseDetail = event.target.closest("[data-case-detail]");
    if (caseDetail) { event.stopPropagation(); handleCaseDetail(caseDetail.dataset.caseDetail); }
    else renderCasePanel();
  });
  $("#hq-case-file").addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const caseDetail = event.target.closest("[data-case-detail]");
      if (caseDetail) handleCaseDetail(caseDetail.dataset.caseDetail);
      else renderCasePanel();
    }
  });
  $(".assessment-agent-field").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "assessment-sequence") completeCapabilityFormation();
  });
  $("#hq-floor").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "hq-sequence") completeHqHandoff();
    if (event.target === event.currentTarget && event.animationName === "workspace-sequence") completeWorkspaceTransition();
  });
  $("#decision-stage").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "decision-position-sequence") completeDecisionStep();
  });
  $("#propagation-chain").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "constraint-propagation-step") completePropagationStep();
  });
  $("#engineering-sequence").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "engineering-generation-step") completeEngineeringStep();
  });
  $("#validation-check-list").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "validation-check-step") completeValidationStep();
    if (event.target === event.currentTarget && event.animationName === "validation-rerun-step") completeTargetedRerunStep();
  });
  $("#executive-evidence-chain").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "executive-synthesis") completeExecutiveSynthesis();
  });
  const initialHash = location.hash.slice(1);
  navigate(["portfolio", "decision", "factory"].includes(initialHash) ? initialHash : "portfolio", false);
  openExperience(initialHash === "hq" ? "hq" : "mission-control", { updateHash: false, startHandoff: false });
  setDemoPace("normal");
  renderGuidedDemo();
}

document.addEventListener("DOMContentLoaded", init);

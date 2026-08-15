(function initializeSyntheticEnterprise(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.SampleEnterprise = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function createSyntheticEnterprise() {
  "use strict";

  const portfolio = Object.freeze([
    { asset_id: "app-01", asset_name: "Supplier Quality Portal", asset_type: "application", business_capability: "Supplier Quality", technology: "Java / Oracle", business_criticality: "High", owner: "Supply Chain", lifecycle_status: "aging", dependencies: "data-03", annual_cost: 720000, technical_health: "poor", business_value: "high" },
    { asset_id: "app-02", asset_name: "Maintenance System", asset_type: "application", business_capability: "Plant Maintenance", technology: "IBM Maximo", business_criticality: "Critical", owner: "Plant Operations", lifecycle_status: "aging", dependencies: "data-02", annual_cost: 1100000, technical_health: "fair", business_value: "critical" },
    { asset_id: "app-03", asset_name: "Customer Service Portal", asset_type: "application", business_capability: "Customer Service", technology: ".NET / SQL Server", business_criticality: "High", owner: "Customer Care", lifecycle_status: "aging", dependencies: "data-01;data-05", annual_cost: 850000, technical_health: "poor", business_value: "critical" },
    { asset_id: "app-04", asset_name: "Engineering Viewer", asset_type: "application", business_capability: "Engineering Configuration", technology: "C++ / File Services", business_criticality: "Medium", owner: "Engineering", lifecycle_status: "supported", dependencies: "data-05", annual_cost: 420000, technical_health: "fair", business_value: "medium" },
    { asset_id: "app-05", asset_name: "Dealer Order Management", asset_type: "application", business_capability: "Dealer Order Management", technology: "Oracle Forms", business_criticality: "High", owner: "Commercial", lifecycle_status: "end of support", dependencies: "data-01;data-04", annual_cost: 980000, technical_health: "critical", business_value: "high" },
    { asset_id: "data-01", asset_name: "Customer Analytics Warehouse", asset_type: "data_platform", business_capability: "Customer Intelligence", technology: "Oracle Exadata", business_criticality: "Critical", owner: "Commercial Data", lifecycle_status: "end of support", dependencies: "data-04;data-05", annual_cost: 1600000, technical_health: "critical", business_value: "critical" },
    { asset_id: "data-02", asset_name: "Manufacturing Data Mart", asset_type: "data_platform", business_capability: "Manufacturing Performance", technology: "Teradata", business_criticality: "Critical", owner: "Manufacturing Data", lifecycle_status: "aging", dependencies: "data-03", annual_cost: 1350000, technical_health: "poor", business_value: "critical" },
    { asset_id: "data-03", asset_name: "Supplier Data Lake", asset_type: "data_platform", business_capability: "Supplier Quality", technology: "Hadoop", business_criticality: "High", owner: "Supply Chain Data", lifecycle_status: "aging", dependencies: "", annual_cost: 910000, technical_health: "poor", business_value: "high" },
    { asset_id: "data-04", asset_name: "Finance Warehouse", asset_type: "data_platform", business_capability: "Executive Reporting", technology: "SAP BW", business_criticality: "Critical", owner: "Finance", lifecycle_status: "supported", dependencies: "", annual_cost: 1300000, technical_health: "fair", business_value: "critical" },
    { asset_id: "data-05", asset_name: "Product Telemetry Platform", asset_type: "data_platform", business_capability: "Product Telemetry", technology: "Kafka / Cassandra", business_criticality: "High", owner: "Digital Products", lifecycle_status: "supported", dependencies: "", annual_cost: 900000, technical_health: "good", business_value: "strategic" }
  ].map((item, index) => Object.freeze({ ...item, __row: index + 1 })));

  const sample = Object.freeze({
    schemaVersion: "1.0",
    packageId: "SAMPLE-APEX-AEROSPACE-2026-01",
    synthetic: true,
    deterministic: true,
    enterprise: Object.freeze({
      id: "ENT-APEX", name: "Apex Aerospace Manufacturing", domain: "Aerospace Manufacturing",
      description: "A fictional global aerospace manufacturer modernizing connected customer, factory, supplier, and product-intelligence capabilities.",
      headquarters: "Bengaluru, India", employees: "18,000 synthetic workforce", annualTechnologySpend: 184000000,
      strategy: "Connected Customer Growth", planningHorizon: "2026–2028"
    }),
    businessUnits: Object.freeze([
      { id: "BU-COMMERCIAL", name: "Commercial & Customer Services", businessOwner: "Chief Customer Officer" },
      { id: "BU-MANUFACTURING", name: "Manufacturing Operations", businessOwner: "Chief Operations Officer" },
      { id: "BU-SUPPLY", name: "Supply Network", businessOwner: "Chief Supply Chain Officer" },
      { id: "BU-ENGINEERING", name: "Engineering & Digital Products", businessOwner: "Chief Engineering Officer" },
      { id: "BU-FINANCE", name: "Finance", businessOwner: "Chief Financial Officer" }
    ]),
    businessCapabilities: Object.freeze([
      { id: "CAP-CUSTOMER", name: "Customer Intelligence", businessUnitId: "BU-COMMERCIAL", criticality: "Critical" },
      { id: "CAP-SERVICE", name: "Customer Service", businessUnitId: "BU-COMMERCIAL", criticality: "High" },
      { id: "CAP-MAINTENANCE", name: "Plant Maintenance", businessUnitId: "BU-MANUFACTURING", criticality: "Critical" },
      { id: "CAP-MANUFACTURING", name: "Manufacturing Performance", businessUnitId: "BU-MANUFACTURING", criticality: "Critical" },
      { id: "CAP-SUPPLIER", name: "Supplier Quality", businessUnitId: "BU-SUPPLY", criticality: "High" },
      { id: "CAP-ENGINEERING", name: "Engineering Configuration", businessUnitId: "BU-ENGINEERING", criticality: "Medium" },
      { id: "CAP-TELEMETRY", name: "Product Telemetry", businessUnitId: "BU-ENGINEERING", criticality: "High" },
      { id: "CAP-REPORTING", name: "Executive Reporting", businessUnitId: "BU-FINANCE", criticality: "Critical" }
    ]),
    portfolio,
    apis: Object.freeze([
      { id: "API-CUSTOMER", name: "Customer Service API", technology: "REST / .NET", ownerId: "OWNER-CUSTOMER" },
      { id: "API-SUPPLIER", name: "Supplier Quality API", technology: "REST / Java", ownerId: "OWNER-SUPPLY" },
      { id: "API-DEALER", name: "Dealer Order API", technology: "REST / Oracle", ownerId: "OWNER-COMMERCIAL" },
      { id: "API-TELEMETRY", name: "Telemetry Ingestion API", technology: "Kafka", ownerId: "OWNER-DIGITAL" }
    ]),
    dataProducts: Object.freeze([
      { id: "DP-CUSTOMER-360", name: "Customer 360 Insight", businessValue: "Critical", ownerId: "OWNER-DATA" },
      { id: "DP-SUPPLIER-QUALITY", name: "Supplier Quality Insight", businessValue: "High", ownerId: "OWNER-SUPPLY" },
      { id: "DP-MANUFACTURING", name: "Manufacturing Performance", businessValue: "Critical", ownerId: "OWNER-MANUFACTURING" },
      { id: "DP-FLEET-HEALTH", name: "Fleet Health Signals", businessValue: "Strategic", ownerId: "OWNER-DIGITAL" }
    ]),
    pipelines: Object.freeze([
      { id: "PIPE-CUSTOMER", name: "Customer Insight Pipeline", technology: "Oracle PL/SQL / Airflow" },
      { id: "PIPE-SUPPLIER", name: "Supplier Quality Pipeline", technology: "Spark / Hadoop" },
      { id: "PIPE-MANUFACTURING", name: "Plant Performance Pipeline", technology: "Teradata BTEQ" },
      { id: "PIPE-TELEMETRY", name: "Fleet Telemetry Pipeline", technology: "Kafka Streams" }
    ]),
    dashboards: Object.freeze([
      { id: "DASH-CUSTOMER", name: "Customer Renewal Cockpit", technology: "Power BI" },
      { id: "DASH-SUPPLIER", name: "Supplier Quality Command Board", technology: "Tableau" },
      { id: "DASH-MANUFACTURING", name: "Plant Performance Board", technology: "Power BI" },
      { id: "DASH-EXECUTIVE", name: "Executive Performance Cockpit", technology: "SAP Analytics Cloud" }
    ]),
    aiSystems: Object.freeze([
      { id: "AI-RENEWAL", name: "Customer Renewal Propensity", technology: "Python / XGBoost", status: "Pilot", readiness: "Constrained by data quality" },
      { id: "AI-PREDICTIVE", name: "Predictive Maintenance Model", technology: "Python / scikit-learn", status: "Production", readiness: "Ready" }
    ]),
    infrastructure: Object.freeze([
      { id: "INFRA-EXADATA", name: "Exadata Private Cloud", type: "Database Appliance", currentState: "On-premises" },
      { id: "INFRA-HADOOP", name: "Hadoop Compute Cluster", type: "Distributed Compute", currentState: "On-premises" },
      { id: "INFRA-INTEGRATION", name: "Enterprise Integration Zone", type: "Integration", currentState: "Hybrid" },
      { id: "INFRA-CLOUD", name: "Google Cloud Analytics Landing Zone", type: "Cloud", currentState: "Target-ready" },
      { id: "INFRA-PLANT", name: "Plant Operations Hosting", type: "Private Cloud", currentState: "On-premises" }
    ]),
    technologyStack: Object.freeze([
      { id: "TECH-ORACLE", name: "Oracle Data Platform", category: "Database" },
      { id: "TECH-JAVA", name: "Java Enterprise", category: "Application" },
      { id: "TECH-DOTNET", name: ".NET", category: "Application" },
      { id: "TECH-BIGQUERY", name: "Google BigQuery", category: "Target Data Platform" },
      { id: "TECH-KAFKA", name: "Apache Kafka", category: "Streaming" }
    ]),
    owners: Object.freeze([
      { id: "OWNER-CUSTOMER", name: "VP Customer Care", type: "Business Owner" },
      { id: "OWNER-COMMERCIAL", name: "Commercial Systems Director", type: "Technical Owner" },
      { id: "OWNER-DATA", name: "Commercial Data Director", type: "Business & Data Owner" },
      { id: "OWNER-MANUFACTURING", name: "Manufacturing Data Director", type: "Technical Owner" },
      { id: "OWNER-SUPPLY", name: "Supplier Quality Director", type: "Business Owner" },
      { id: "OWNER-DIGITAL", name: "Digital Products Director", type: "Technical Owner" },
      { id: "OWNER-FINANCE", name: "Finance Data Controller", type: "Business Owner", status: "Ownership conflict under review" }
    ]),
    risks: Object.freeze([
      { id: "RISK-FINANCE", name: "Finance reporting ownership conflict", level: "High", assetId: "data-04" },
      { id: "RISK-ORACLE", name: "Oracle platform end-of-support exposure", level: "Critical", assetId: "data-01" },
      { id: "RISK-SUPPLIER", name: "Unowned supplier dependencies", level: "Medium", assetId: "data-03" }
    ]),
    technicalDebt: Object.freeze([
      { id: "DEBT-ORACLE", name: "Oracle analytical coupling", level: "High", assetId: "data-01" },
      { id: "DEBT-FORMS", name: "Oracle Forms release coupling", level: "High", assetId: "app-05" },
      { id: "DEBT-HADOOP", name: "Unsupported Hadoop components", level: "Medium", assetId: "data-03" }
    ]),
    modernizationReadiness: Object.freeze([
      { id: "READY-CUSTOMER", name: "Customer Intelligence Readiness", score: 78, assetId: "data-01", status: "Ready with conditions" },
      { id: "READY-SUPPLIER", name: "Supplier Data Readiness", score: 54, assetId: "data-03", status: "Evidence incomplete" },
      { id: "READY-TELEMETRY", name: "Telemetry Readiness", score: 86, assetId: "data-05", status: "Ready" }
    ]),
    currentState: Object.freeze([
      { id: "STATE-CURRENT-CUSTOMER", name: "Oracle-coupled customer analytics", assetId: "data-01", state: "Batch analytics with twelve protected finance reports" },
      { id: "STATE-CURRENT-SUPPLIER", name: "Fragmented supplier evidence", assetId: "data-03", state: "Hadoop lake with three unowned downstream dependencies" }
    ]),
    targetState: Object.freeze([
      { id: "STATE-TARGET-CUSTOMER", name: "Governed customer intelligence product", assetId: "data-01", state: "BigQuery with compatibility views and a six-week dual run" },
      { id: "STATE-TARGET-SUPPLIER", name: "Owned supplier quality data product", assetId: "data-03", state: "Governed pipelines with confirmed downstream accountability" }
    ]),
    dependencies: Object.freeze([
      ["ENT-APEX", "BU-COMMERCIAL", "CONTAINS"], ["ENT-APEX", "BU-MANUFACTURING", "CONTAINS"], ["ENT-APEX", "BU-SUPPLY", "CONTAINS"], ["ENT-APEX", "BU-ENGINEERING", "CONTAINS"], ["ENT-APEX", "BU-FINANCE", "CONTAINS"],
      ["BU-COMMERCIAL", "CAP-CUSTOMER", "OWNS"], ["BU-COMMERCIAL", "CAP-SERVICE", "OWNS"], ["BU-MANUFACTURING", "CAP-MAINTENANCE", "OWNS"], ["BU-MANUFACTURING", "CAP-MANUFACTURING", "OWNS"], ["BU-SUPPLY", "CAP-SUPPLIER", "OWNS"], ["BU-ENGINEERING", "CAP-ENGINEERING", "OWNS"], ["BU-ENGINEERING", "CAP-TELEMETRY", "OWNS"], ["BU-FINANCE", "CAP-REPORTING", "OWNS"],
      ["CAP-SUPPLIER", "app-01", "REALIZED_BY"], ["CAP-MAINTENANCE", "app-02", "REALIZED_BY"], ["CAP-SERVICE", "app-03", "REALIZED_BY"], ["CAP-ENGINEERING", "app-04", "REALIZED_BY"], ["CAP-CUSTOMER", "app-05", "REALIZED_BY"], ["CAP-CUSTOMER", "data-01", "REALIZED_BY"], ["CAP-MANUFACTURING", "data-02", "REALIZED_BY"], ["CAP-SUPPLIER", "data-03", "REALIZED_BY"], ["CAP-REPORTING", "data-04", "REALIZED_BY"], ["CAP-TELEMETRY", "data-05", "REALIZED_BY"],
      ["app-01", "API-SUPPLIER", "EXPOSES"], ["app-02", "DP-MANUFACTURING", "CONSUMES"], ["app-03", "API-CUSTOMER", "EXPOSES"], ["app-04", "API-TELEMETRY", "CONSUMES"], ["app-05", "API-DEALER", "EXPOSES"],
      ["API-CUSTOMER", "DP-CUSTOMER-360", "SUPPORTS"], ["API-SUPPLIER", "DP-SUPPLIER-QUALITY", "SUPPORTS"], ["API-DEALER", "DP-CUSTOMER-360", "SUPPORTS"], ["API-TELEMETRY", "DP-FLEET-HEALTH", "SUPPORTS"],
      ["DP-CUSTOMER-360", "PIPE-CUSTOMER", "PRODUCED_BY"], ["DP-SUPPLIER-QUALITY", "PIPE-SUPPLIER", "PRODUCED_BY"], ["DP-MANUFACTURING", "PIPE-MANUFACTURING", "PRODUCED_BY"], ["DP-FLEET-HEALTH", "PIPE-TELEMETRY", "PRODUCED_BY"],
      ["PIPE-CUSTOMER", "data-01", "RUNS_ON"], ["PIPE-SUPPLIER", "data-03", "RUNS_ON"], ["PIPE-MANUFACTURING", "data-02", "RUNS_ON"], ["PIPE-TELEMETRY", "data-05", "RUNS_ON"],
      ["DASH-CUSTOMER", "DP-CUSTOMER-360", "CONSUMES"], ["DASH-SUPPLIER", "DP-SUPPLIER-QUALITY", "CONSUMES"], ["DASH-MANUFACTURING", "DP-MANUFACTURING", "CONSUMES"], ["DASH-EXECUTIVE", "data-04", "CONSUMES"],
      ["AI-RENEWAL", "DP-CUSTOMER-360", "CONSUMES"], ["AI-PREDICTIVE", "DP-FLEET-HEALTH", "CONSUMES"],
      ["data-01", "INFRA-EXADATA", "RUNS_ON"], ["data-02", "INFRA-PLANT", "RUNS_ON"], ["data-03", "INFRA-HADOOP", "RUNS_ON"], ["data-04", "INFRA-INTEGRATION", "CONNECTS_THROUGH"], ["data-05", "INFRA-INTEGRATION", "CONNECTS_THROUGH"], ["STATE-TARGET-CUSTOMER", "INFRA-CLOUD", "RUNS_ON"],
      ["INFRA-EXADATA", "TECH-ORACLE", "USES"], ["app-01", "TECH-JAVA", "USES"], ["app-03", "TECH-DOTNET", "USES"], ["STATE-TARGET-CUSTOMER", "TECH-BIGQUERY", "USES"], ["data-05", "TECH-KAFKA", "USES"],
      ["OWNER-CUSTOMER", "CAP-SERVICE", "ACCOUNTABLE_FOR"], ["OWNER-COMMERCIAL", "app-05", "OWNS"], ["OWNER-DATA", "DP-CUSTOMER-360", "OWNS"], ["OWNER-MANUFACTURING", "DP-MANUFACTURING", "OWNS"], ["OWNER-SUPPLY", "CAP-SUPPLIER", "ACCOUNTABLE_FOR"], ["OWNER-DIGITAL", "CAP-TELEMETRY", "ACCOUNTABLE_FOR"], ["OWNER-FINANCE", "data-04", "ACCOUNTABLE_FOR"],
      ["RISK-FINANCE", "data-04", "THREATENS"], ["RISK-ORACLE", "data-01", "THREATENS"], ["RISK-SUPPLIER", "data-03", "THREATENS"],
      ["DEBT-ORACLE", "data-01", "AFFECTS"], ["DEBT-FORMS", "app-05", "AFFECTS"], ["DEBT-HADOOP", "data-03", "AFFECTS"],
      ["READY-CUSTOMER", "data-01", "MEASURES"], ["READY-SUPPLIER", "data-03", "MEASURES"], ["READY-TELEMETRY", "data-05", "MEASURES"],
      ["STATE-CURRENT-CUSTOMER", "data-01", "DESCRIBES"], ["STATE-CURRENT-SUPPLIER", "data-03", "DESCRIBES"], ["STATE-TARGET-CUSTOMER", "data-01", "TARGETS"], ["STATE-TARGET-SUPPLIER", "data-03", "TARGETS"]
    ].map(([sourceId, targetId, type], index) => Object.freeze({ id: `SREL-${String(index + 1).padStart(3, "0")}`, sourceId, targetId, type }))),
    modernizationPlan: Object.freeze({
      recommendedWave: "Wave 1 · Customer Intelligence Foundation",
      waves: Object.freeze([
        { id: "WAVE-1", name: "Customer Intelligence Foundation", duration: "7 months", assets: ["data-01", "data-04"], status: "Recommended with conditions" },
        { id: "WAVE-2", name: "Customer Experience Decoupling", duration: "4 months", assets: ["app-03", "app-05"], status: "Planned" },
        { id: "WAVE-3", name: "Operational Intelligence", duration: "5 months", assets: ["data-02", "data-03", "data-05"], status: "Candidate" }
      ])
    }),
    missionControl: Object.freeze({
      journeyStatus: "Portfolio Discovery complete · Capability Formation ready",
      executiveRecommendation: "Approve Customer Intelligence Foundation as Wave 1, protect twelve finance reports, and resolve Finance Warehouse ownership before cutover."
    }),
    journey: Object.freeze([
      { id: "J-01", stage: "Portfolio Discovery", owner: "Portfolio Discovery Agent", evidence: ["Ten validated modernization units", "Nine declared portfolio dependencies", "Three governed evidence exceptions"], status: "Complete" },
      { id: "J-02", stage: "Assessment", owner: "Enterprise Architect Agent", evidence: ["Deterministic priority scores", "6R disposition signals", "Dependency readiness"], status: "Ready" },
      { id: "J-03", stage: "Business Value", owner: "Business Value Agent", evidence: ["$10.13M synthetic annual operating cost", "Five business outcomes", "Customer Intelligence criticality"], status: "Ready" },
      { id: "J-04", stage: "Architecture", owner: "Enterprise Architect Agent", evidence: ["Oracle-to-BigQuery target", "Compatibility views", "Six-week dual run"], status: "Ready" },
      { id: "J-05", stage: "Wave Planning", owner: "Wave Planning Agent", evidence: ["Three sequenced waves", "Protected finance boundary", "Seven-month Wave 1"], status: "Ready" },
      { id: "J-06", stage: "Execution Planning", owner: "Codex Migration Engineer", evidence: ["Engineering contract", "Validation expectations", "Cutover prerequisites"], status: "Ready with conditions" }
    ]),
    recommendations: Object.freeze([
      { id: "REC-PRIMARY", assetId: "data-01", recommendation: "Replatform Customer Analytics Warehouse to BigQuery through a governed staged migration.", rationale: "Highest deterministic modernization priority, critical business value, end-of-support platform, and a traceable finance-report dependency.", confidence: 0.91 }
    ]),
    enterpriseDna: Object.freeze({
      sourceModule: "enterprise-dna.js", strategyId: "STR-CX-2026-01", initiativeId: "BI-CX-2026-01",
      caseId: "DR-CIC-001", requiredKinds: Object.freeze([
        "Business Strategy", "Business Initiative", "Business Outcome", "Business Capability", "Digital Product", "Application", "API", "Data Product",
        "Data Platform", "Database", "Pipeline", "AI Model", "Infrastructure", "Engineering Team", "Owner", "Risk", "Technical Debt",
        "Readiness Assessment", "Modernization Case Reference"
      ])
    })
  });

  const graphCollections = Object.freeze([
    "businessUnits", "businessCapabilities", "portfolio", "apis", "dataProducts", "pipelines", "dashboards", "aiSystems",
    "infrastructure", "technologyStack", "owners", "risks", "technicalDebt", "modernizationReadiness", "currentState", "targetState"
  ]);

  function validatePackage(options = {}) {
    const errors = [];
    const candidateSample = options.sample || sample;
    const portfolioEngine = options.portfolioEngine;
    const enterpriseDna = options.enterpriseDna;
    if (candidateSample.synthetic !== true || candidateSample.deterministic !== true) errors.push("Sample must be explicitly synthetic and deterministic.");
    if (candidateSample.portfolio.length !== 10) errors.push("Sample portfolio must contain exactly 10 modernization units.");
    const graphObjects = [candidateSample.enterprise, ...graphCollections.flatMap((key) => candidateSample[key])];
    const graphIds = new Set();
    graphObjects.forEach((item) => {
      const id = item.id || item.asset_id;
      if (!id) errors.push("Every sample graph object requires an ID.");
      else if (graphIds.has(id)) errors.push(`Duplicate sample graph ID: ${id}`);
      else graphIds.add(id);
    });
    const degree = new Map([...graphIds].map((id) => [id, 0]));
    candidateSample.dependencies.forEach((relationship) => {
      if (!graphIds.has(relationship.sourceId)) errors.push(`Unknown dependency source: ${relationship.sourceId}`);
      if (!graphIds.has(relationship.targetId)) errors.push(`Unknown dependency target: ${relationship.targetId}`);
      if (graphIds.has(relationship.sourceId)) degree.set(relationship.sourceId, degree.get(relationship.sourceId) + 1);
      if (graphIds.has(relationship.targetId)) degree.set(relationship.targetId, degree.get(relationship.targetId) + 1);
    });
    [...degree].filter(([id, count]) => id !== candidateSample.enterprise.id && count === 0).forEach(([id]) => errors.push(`Disconnected sample graph object: ${id}`));
    if (!portfolioEngine) errors.push("Portfolio validation engine is unavailable.");
    else {
      const report = portfolioEngine.validatePortfolio(candidateSample.portfolio);
      if (report.accepted.length !== candidateSample.portfolio.length || report.issues.some((issue) => issue.severity === "error")) {
        errors.push("Portfolio validation rejected one or more sample records.");
      }
      const candidate = portfolioEngine.qualifiedCandidate(portfolioEngine.scorePortfolio(report.accepted));
      if (!candidate || candidate.record.asset_id !== candidateSample.recommendations[0].assetId) errors.push("Primary recommendation does not match deterministic candidate scoring.");
    }
    if (!enterpriseDna) errors.push("Enterprise DNA model is unavailable.");
    else {
      const report = enterpriseDna.validateModel();
      if (!report.valid) errors.push(...report.errors.map((error) => `Enterprise DNA: ${error}`));
      candidateSample.enterpriseDna.requiredKinds.forEach((kind) => {
        if (!enterpriseDna.getObjectsByKind(kind).length) errors.push(`Enterprise DNA kind is missing: ${kind}`);
      });
      const dnaDegree = new Map(enterpriseDna.objects.map((item) => [item.id, 0]));
      enterpriseDna.relationships.forEach((relationship) => {
        dnaDegree.set(relationship.sourceId, dnaDegree.get(relationship.sourceId) + 1);
        dnaDegree.set(relationship.targetId, dnaDegree.get(relationship.targetId) + 1);
      });
      [...dnaDegree].filter(([, count]) => count === 0).forEach(([id]) => errors.push(`Disconnected Enterprise DNA object: ${id}`));
    }
    const requiredJourneyStages = ["Portfolio Discovery", "Assessment", "Business Value", "Architecture", "Wave Planning", "Execution Planning"];
    if (requiredJourneyStages.some((stage) => !candidateSample.journey.some((item) => item.stage === stage && item.evidence.length))) errors.push("Journey evidence is incomplete.");
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
  }

  function countBy(items, key) {
    return Object.freeze(items.reduce((counts, item) => ({ ...counts, [item[key]]: (counts[item[key]] || 0) + 1 }), {}));
  }

  function buildBusinessCase(scores) {
    const recommendation = sample.recommendations[0];
    const candidate = sample.portfolio.find((item) => item.asset_id === recommendation.assetId);
    const wave = sample.modernizationPlan.waves[0];
    const investmentRate = Object.freeze({ low: 0.75, high: 1 });
    const benefitRate = Object.freeze({ low: 0.2, high: 0.25 });
    const roundPlanningValue = (value) => Math.round(value / 10000) * 10000;
    const investment = Object.freeze({
      low: roundPlanningValue(candidate.annual_cost * investmentRate.low),
      high: roundPlanningValue(candidate.annual_cost * investmentRate.high)
    });
    const annualBenefit = Object.freeze({
      low: roundPlanningValue(candidate.annual_cost * benefitRate.low),
      high: roundPlanningValue(candidate.annual_cost * benefitRate.high)
    });
    const payback = Object.freeze({
      low: Math.ceil((investment.low / annualBenefit.high) * 10) / 10,
      high: Math.ceil((investment.high / annualBenefit.low) * 10) / 10
    });
    const scoredCandidate = scores.find((item) => item.record.asset_id === candidate.asset_id);
    return Object.freeze({
      candidateId: candidate.asset_id,
      candidateName: candidate.asset_name,
      estimateLabel: "Directional planning estimate · synthetic · not audited",
      estimatedInvestment: investment,
      expectedAnnualBenefit: annualBenefit,
      expectedPaybackYears: payback,
      implementationTimeline: wave.duration,
      businessValue: candidate.business_value,
      costReductionOpportunity: Object.freeze({ lowPercent: 20, highPercent: 25 }),
      riskLevel: sample.risks.find((item) => item.assetId === candidate.asset_id)?.level || "Unknown",
      confidencePercent: Math.round(recommendation.confidence * 100),
      priorityScore: scoredCandidate.total,
      assumptions: Object.freeze([
        "Investment is modeled at 75–100% of the candidate's current annual operating cost.",
        "Annual run-cost benefit is modeled at 20–25% of the candidate's current annual operating cost.",
        "Revenue uplift, productivity value, financing cost, tax, and inflation are excluded.",
        "The seven-month plan assumes compatibility views, a six-week dual run, and no change to twelve protected finance reports."
      ]),
      dependencies: Object.freeze(["Finance Warehouse", "Product Telemetry Platform", "Google Cloud Analytics Landing Zone"]),
      decisionConditions: Object.freeze([
        "Confirm Finance Warehouse ownership and change authority.",
        "Keep twelve finance reports stable during the protected transition.",
        "Complete the governed dual run and all validation checks before cutover."
      ]),
      approvalRequirement: "Mission Commander approval plus Finance ownership confirmation before cutover",
      derivation: Object.freeze({
        sourceAnnualCost: candidate.annual_cost,
        investmentFormula: "Current candidate annual cost × 75–100%",
        annualBenefitFormula: "Current candidate annual cost × 20–25%",
        paybackFormula: "Estimated investment ÷ expected annual run-cost benefit",
        timelineSource: `${wave.id} governed modernization plan`
      })
    });
  }

  function buildEvidenceBrief(scores, enterpriseDna) {
    const recommendation = sample.recommendations[0];
    const candidate = scores.find((item) => item.record.asset_id === recommendation.assetId);
    const alternatives = scores.slice(1, 3).map((item) => Object.freeze({
      candidateId: item.record.asset_id,
      candidateName: item.record.asset_name,
      priorityScore: item.total,
      scoreGap: candidate.total - item.total,
      reasonNotPrimary: `Priority score is ${candidate.total - item.total} points below the selected candidate.`
    }));
    const finding = enterpriseDna.whyCaseRecommended(sample.enterpriseDna.caseId);
    if (!finding) throw new Error(`No Enterprise DNA recommendation finding exists for ${sample.enterpriseDna.caseId}.`);
    return Object.freeze({
      recommendation: recommendation.recommendation,
      whyCandidate: `${candidate.record.asset_name} leads with priority ${candidate.total}, critical business value, and end-of-support technical urgency.`,
      whyNow: "Oracle end-of-support exposure constrains five customer outcomes while the target landing zone is ready with conditions.",
      evidence: Object.freeze([
        Object.freeze({ source: "Portfolio", reference: candidate.record.asset_id, fact: `${candidate.record.technology} · ${candidate.record.lifecycle_status} · ${candidate.record.business_criticality} criticality · $1.6M annual operating cost` }),
        Object.freeze({ source: "Enterprise DNA", reference: "STR-CX-2026-01", fact: "Connected Customer Growth strategy" }),
        Object.freeze({ source: "Enterprise DNA", reference: "BI-CX-2026-01", fact: "Customer Intelligence Transformation initiative and five intended outcomes" }),
        Object.freeze({ source: "Enterprise DNA", reference: "RISK-FINANCE-OWNERSHIP", fact: "Finance reporting ownership conflict across twelve reports" }),
        Object.freeze({ source: "Readiness", reference: "READY-CUSTOMER", fact: "Customer Intelligence readiness 78 · Ready with conditions" }),
        Object.freeze({ source: "Journey", reference: "J-01", fact: "Ten portfolio units validated; seven evidence-ready and three blocked" })
      ]),
      businessRationale: "The candidate is the governed foundation for customer service, renewal insight, reliable reporting, and faster customer-facing delivery.",
      architectureRationale: "A staged Oracle-to-BigQuery replatform uses the target-ready landing zone while compatibility views and dual run protect dependent reports.",
      riskRationale: "The staged approach reduces operational risk by 34% in the governed plan but does not remove the finance ownership prerequisite.",
      confidencePercent: Math.round(finding.confidence * 100),
      confidenceMethod: finding.method,
      assumptions: finding.assumptions,
      limitations: Object.freeze([
        "All enterprise data and economic values are synthetic.",
        "No live model, production connector, PII detector, policy engine, RBAC, or audit service is active.",
        "Benefits are directional planning estimates and exclude revenue uplift and organizational-change costs.",
        "Engineering for arbitrary uploaded portfolios remains unavailable without representative SQL, schema, and target metadata."
      ]),
      alternatives: Object.freeze(alternatives),
      governanceBoundary: "Assessment and mobilization may proceed, but cutover requires Finance ownership confirmation and successful governed validation."
    });
  }

  function buildDecisionAssurance(businessCase) {
    return Object.freeze({
      type: "Deterministic decision-support indicators",
      evidenceQuality: "7 of 10 portfolio decisions evidence-ready",
      businessAlignment: "Five outcomes trace to Connected Customer Growth",
      architectureReadiness: "Target landing zone ready · compatibility controls required",
      risk: "Critical Oracle exposure · High finance ownership risk",
      sensitiveDataStatus: "Not assessed · no production PII detection is active",
      policyStatus: "Not enforced · no production policy engine is active",
      approvalRequirement: businessCase.approvalRequirement,
      productionBoundary: "These indicators support a decision; they are not production security, privacy, policy, or audit enforcement."
    });
  }

  function buildMissionControlSnapshot(portfolioEngine, enterpriseDna) {
    const validation = validatePackage({ portfolioEngine, enterpriseDna });
    if (!validation.valid) throw new Error(validation.errors.join(" "));
    const scores = portfolioEngine.scorePortfolio(sample.portfolio);
    const totalAnnualCost = sample.portfolio.reduce((total, item) => total + Number(item.annual_cost), 0);
    const businessCase = buildBusinessCase(scores);
    const evidenceBrief = buildEvidenceBrief(scores, enterpriseDna);
    return Object.freeze({
      enterpriseName: sample.enterprise.name,
      domain: sample.enterprise.domain,
      packageId: sample.packageId,
      summary: Object.freeze({
        modernizationUnits: sample.portfolio.length,
        applications: sample.portfolio.filter((item) => item.asset_type === "application").length,
        dataPlatforms: sample.portfolio.filter((item) => item.asset_type === "data_platform").length,
        businessUnits: sample.businessUnits.length,
        capabilities: sample.businessCapabilities.length,
        annualCost: totalAnnualCost
      }),
      technologyDistribution: countBy(sample.portfolio, "technology"),
      riskDistribution: countBy(sample.risks, "level"),
      businessValueDistribution: countBy(sample.portfolio, "business_value"),
      applicationInventory: Object.freeze(sample.portfolio.filter((item) => item.asset_type === "application")),
      topCandidates: Object.freeze(scores.slice(0, 3)),
      recommendedWave: sample.modernizationPlan.waves[0],
      journeyStatus: sample.missionControl.journeyStatus,
      executiveRecommendation: sample.missionControl.executiveRecommendation,
      businessCase,
      evidenceBrief,
      decisionAssurance: buildDecisionAssurance(businessCase),
      enterpriseDna: Object.freeze({ objects: enterpriseDna.objects.length, relationships: enterpriseDna.relationships.length, findings: enterpriseDna.findings.length, disconnectedObjects: 0 })
    });
  }

  return Object.freeze({ sample, graphCollections, validatePackage, buildBusinessCase, buildEvidenceBrief, buildDecisionAssurance, buildMissionControlSnapshot });
}));

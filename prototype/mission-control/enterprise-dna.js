(function initializeEnterpriseDna(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.EnterpriseDNA = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function createEnterpriseDna() {
  "use strict";

  const OBJECT_KINDS = Object.freeze([
    "Business Strategy", "Business Initiative", "Business Outcome", "Business Capability", "Digital Product",
    "Application", "API", "Data Product", "Data Platform", "Database", "Pipeline", "AI Model", "Infrastructure",
    "Engineering Team", "Owner", "Risk", "Technical Debt", "Readiness Assessment", "Modernization Case Reference"
  ]);

  const RELATIONSHIP_TYPES = Object.freeze([
    "ADVANCES", "TARGETS", "PRODUCES_OUTCOME", "CHANGES", "ENABLES", "ENABLED_BY", "REALIZED_BY", "SUPPORTS",
    "COMPRISES", "DEPENDS_ON", "CONSUMES", "PRODUCES", "EXPOSES", "FLOWS_TO", "RUNS_ON", "STORES_IN",
    "OWNED_BY", "OPERATED_BY", "ENGINEERED_BY", "ACCOUNTABLE_FOR", "THREATENS", "AFFECTS", "MODERNIZED_BY", "MEASURES"
  ]);

  const LIFECYCLE_STATUSES = Object.freeze(["Proposed", "Active", "Confirmed", "At Risk", "Modernizing", "Retired", "Superseded"]);
  const DECISION_RELEVANT_KINDS = new Set(["Business Strategy", "Business Initiative", "Business Outcome", "Risk", "Technical Debt", "Readiness Assessment", "Modernization Case Reference"]);

  const evidence = Object.freeze({
    strategy: "EVD-STRATEGY-01", initiative: "EVD-INITIATIVE-01", outcomes: "EVD-OUTCOMES-01", portfolio: "EVD-PORTFOLIO-01",
    architecture: "EVD-ARCHITECTURE-01", telemetry: "EVD-TELEMETRY-01", finance: "EVD-FINANCE-OWNERSHIP-01",
    readiness: "EVD-READINESS-01", case: "EVD-CASE-DR-CIC-001", engineering: "EVD-ENGINEERING-01"
  });

  function dnaObject(id, kind, name, description, options = {}) {
    return Object.freeze({
      id, kind, name, description,
      lifecycleStatus: options.lifecycleStatus || "Active",
      attributes: Object.freeze({ ...(options.attributes || {}) }),
      tags: Object.freeze([...(options.tags || [])]),
      provenance: options.provenance || "Apex Aerospace synthetic enterprise evidence",
      evidenceReferences: Object.freeze([...(options.evidenceReferences || [])]),
      confidence: options.confidence ?? 0.9,
      createdSequence: options.createdSequence || "DNA-SEQ-001",
      updatedSequence: options.updatedSequence || "DNA-SEQ-001"
    });
  }

  function relationship(id, type, sourceId, targetId, options = {}) {
    return Object.freeze({
      id, type, sourceId, targetId,
      status: options.status || "Confirmed",
      criticality: options.criticality || "Medium",
      confidence: options.confidence ?? 0.9,
      attributes: Object.freeze({ ...(options.attributes || {}) }),
      provenance: options.provenance || "Apex Aerospace synthetic enterprise evidence",
      evidenceReferences: Object.freeze([...(options.evidenceReferences || [])]),
      lifecycleStatus: options.lifecycleStatus || "Active"
    });
  }

  const objects = Object.freeze([
    dnaObject("STR-CX-2026-01", "Business Strategy", "Connected Customer Growth", "Create connected customer experiences and trusted insight across aerospace programs.", { attributes: { strategicObjective: "Improve renewal insight and service responsiveness through reliable customer intelligence.", executiveOwner: "Chief Customer Officer", planningHorizon: "2026–2028", priority: "Enterprise priority", successMeasures: ["Service resolution time", "Renewal insight adoption", "Customer-data reliability"], organizationalScope: "Commercial, Customer Care, Digital Products, Finance", status: "Active" }, evidenceReferences: [evidence.strategy], confidence: 0.96 }),
    dnaObject("BI-CX-2026-01", "Business Initiative", "Customer Intelligence Transformation", "Coordinate business and technology change required to deliver connected customer growth.", { attributes: { accountableExecutive: "Chief Customer Officer", intendedOutcomeIds: ["OUT-CX-01", "OUT-CX-02", "OUT-CX-03", "OUT-CX-04", "OUT-CX-05"], targetCapabilityIds: ["CAP-CI", "CAP-CS", "CAP-CA", "CAP-PT", "CAP-ER"], investmentClassification: "Strategic transformation", timeHorizon: "Seven-month governed first wave", constraints: ["Twelve finance reports must remain unchanged for six months"], health: "At risk — ownership conflict", linkedModernizationCases: ["DR-CIC-001"] }, evidenceReferences: [evidence.initiative, evidence.finance], confidence: 0.94 }),

    dnaObject("OUT-CX-01", "Business Outcome", "Faster customer-service resolution", "Reduce the time required to resolve customer-service cases.", { attributes: { baseline: "5.2 business days", target: "3.5 business days", measure: "Median case-resolution time", owner: "VP Customer Care", status: "Expected" }, evidenceReferences: [evidence.outcomes], confidence: 0.86 }),
    dnaObject("OUT-CX-02", "Business Outcome", "Improved renewal and customer insight", "Give account and service teams more timely renewal and relationship insight.", { attributes: { baseline: "Weekly fragmented reporting", target: "Daily governed customer insight", measure: "Insight freshness and adoption", owner: "Chief Customer Officer", status: "Expected" }, evidenceReferences: [evidence.outcomes], confidence: 0.91 }),
    dnaObject("OUT-CX-03", "Business Outcome", "Reduced duplicate reporting effort", "Reduce manual reconciliation across commercial and finance reporting.", { attributes: { baseline: "12 dependent reports with duplicated checks", target: "Governed compatibility with one reconciliation control", measure: "Manual reconciliation hours", owner: "Finance Data Controller", status: "Expected" }, evidenceReferences: [evidence.outcomes, evidence.finance], confidence: 0.88 }),
    dnaObject("OUT-CX-04", "Business Outcome", "Reliable customer data", "Improve trust in customer metrics used for service and executive decisions.", { attributes: { baseline: "Ownership conflict and semantic variance risk", target: "7 of 7 critical validation checks passed", measure: "Critical validation pass rate", owner: "Commercial Data Director", status: "Expected" }, evidenceReferences: [evidence.outcomes, evidence.case], confidence: 0.93 }),
    dnaObject("OUT-CX-05", "Business Outcome", "Faster customer-facing delivery", "Shorten delivery lead time for customer-facing product improvements.", { attributes: { baseline: "Coupled quarterly release cycle", target: "Independent monthly product increments", measure: "Release lead time", owner: "Digital Products Director", status: "Expected" }, evidenceReferences: [evidence.outcomes], confidence: 0.82 }),

    dnaObject("CAP-CI", "Business Capability", "Customer Intelligence", "Create trusted, actionable understanding of customers and aerospace programs.", { attributes: { maturity: "Constrained", businessCriticality: "Critical" }, evidenceReferences: [evidence.portfolio] }),
    dnaObject("CAP-CS", "Business Capability", "Customer Service", "Manage customer cases, entitlements, and service interactions.", { attributes: { maturity: "Developing", businessCriticality: "High" }, evidenceReferences: [evidence.portfolio] }),
    dnaObject("CAP-CA", "Business Capability", "Customer Analytics", "Produce governed customer, service, order, and renewal insight.", { attributes: { maturity: "At risk", businessCriticality: "Critical" }, evidenceReferences: [evidence.portfolio] }),
    dnaObject("CAP-PT", "Business Capability", "Product Telemetry", "Convert fleet and product signals into service insight.", { attributes: { maturity: "Developing", businessCriticality: "High" }, evidenceReferences: [evidence.telemetry] }),
    dnaObject("CAP-ER", "Business Capability", "Executive Reporting", "Provide governed performance and renewal measures to enterprise leaders.", { attributes: { maturity: "Constrained", businessCriticality: "Critical" }, evidenceReferences: [evidence.finance] }),

    dnaObject("DP-CUSTOMER-INTELLIGENCE", "Digital Product", "Customer Intelligence", "Durable product boundary connecting customer service, analytics, telemetry, reporting, ownership, and modernization work.", { lifecycleStatus: "Modernizing", attributes: { businessValue: "High", modernizationStatus: "Journey active", productOwner: "Customer Intelligence Product Owner", expectedValue: "Faster service, trusted renewal insight, reliable reporting" }, evidenceReferences: [evidence.portfolio, evidence.case], confidence: 0.95 }),
    dnaObject("APP-CUSTOMER-SERVICE", "Application", "Customer Service Portal", "Customer case, entitlement, and order-status experience.", { attributes: { technology: ".NET / SQL Server", lifecycle: "Aging", criticality: "High" }, evidenceReferences: [evidence.portfolio] }),
    dnaObject("API-CUSTOMER-SERVICE", "API", "Customer Service API", "Exposes customer case and entitlement services to the digital product.", { attributes: { style: "REST", lifecycle: "Current", criticality: "High" }, evidenceReferences: [evidence.architecture] }),
    dnaObject("DATA-CUSTOMER-360", "Data Product", "Customer 360 Insight", "Governed customer, service, order, telemetry, and renewal measures.", { attributes: { dataOwner: "Commercial Data Director", qualityStatus: "Conditionally trusted" }, evidenceReferences: [evidence.portfolio, evidence.finance] }),
    dnaObject("PLATFORM-CUSTOMER-ANALYTICS", "Data Platform", "Customer Analytics Warehouse", "Oracle analytics platform supporting commercial and customer insight.", { lifecycleStatus: "Modernizing", attributes: { technology: "Oracle Exadata", age: "14 years", criticality: "Critical" }, evidenceReferences: [evidence.portfolio, evidence.architecture] }),
    dnaObject("PLATFORM-PRODUCT-TELEMETRY", "Data Platform", "Product Telemetry Platform", "Kafka and Cassandra platform supplying fleet and reliability signals.", { attributes: { technology: "Kafka / Cassandra", age: "6 years", criticality: "High" }, evidenceReferences: [evidence.telemetry] }),
    dnaObject("PLATFORM-FINANCE-WAREHOUSE", "Data Platform", "Finance Warehouse", "External governed finance platform supporting twelve dependent reports.", { attributes: { technology: "SAP BW", ownershipStatus: "Conflicting across two sources", reportCount: 12 }, evidenceReferences: [evidence.finance], confidence: 0.74 }),
    dnaObject("DB-CUSTOMER-SERVICE", "Database", "Customer Service Database", "SQL Server operational store for customer cases and entitlements.", { attributes: { technology: "SQL Server", criticality: "High" }, evidenceReferences: [evidence.architecture] }),
    dnaObject("DB-CUSTOMER-ANALYTICS", "Database", "Customer Analytics Oracle Database", "Oracle source database for customer analytics and renewal measures.", { lifecycleStatus: "Modernizing", attributes: { technology: "Oracle", criticality: "Critical" }, evidenceReferences: [evidence.architecture] }),
    dnaObject("PIPE-CUSTOMER-INSIGHT", "Pipeline", "Customer Insight Integration Pipeline", "Moves customer-service and telemetry signals into governed analytics.", { attributes: { technology: "Informatica and Kafka", frequency: "Daily and streaming" }, evidenceReferences: [evidence.architecture, evidence.telemetry] }),
    dnaObject("AI-RENEWAL-PROPENSITY", "AI Model", "Renewal Propensity Model", "Planned model consuming governed Customer 360 insight.", { lifecycleStatus: "Proposed", attributes: { aiReadiness: "Blocked by data reliability", modelStatus: "Not deployed" }, evidenceReferences: [evidence.readiness], confidence: 0.78 }),
    dnaObject("INFRA-ORACLE-EXADATA", "Infrastructure", "Oracle Exadata Estate", "On-premises infrastructure hosting the Customer Analytics Warehouse.", { lifecycleStatus: "At Risk", attributes: { hosting: "On premises", supportStatus: "Approaching end of strategic life" }, evidenceReferences: [evidence.architecture] }),

    dnaObject("TEAM-CUSTOMER-EXPERIENCE", "Engineering Team", "Customer Experience Engineering", "Builds and operates the Customer Service Portal and API.", { attributes: { capacity: "Committed", domain: "Customer Service" }, evidenceReferences: [evidence.portfolio] }),
    dnaObject("TEAM-COMMERCIAL-DATA", "Engineering Team", "Commercial Data Engineering", "Builds and operates customer analytics and Customer 360 data products.", { attributes: { capacity: "Constrained", domain: "Commercial Data" }, evidenceReferences: [evidence.portfolio] }),
    dnaObject("TEAM-DIGITAL-TELEMETRY", "Engineering Team", "Digital Product Telemetry", "Operates product telemetry ingestion and reliability signals.", { attributes: { capacity: "Available", domain: "Product Telemetry" }, evidenceReferences: [evidence.telemetry] }),
    dnaObject("TEAM-FINANCE-DATA", "Engineering Team", "Finance Data Governance", "Governs finance reporting contracts and change authority.", { attributes: { capacity: "Pending owner confirmation", domain: "Finance Reporting" }, evidenceReferences: [evidence.finance], confidence: 0.72 }),
    dnaObject("OWNER-CCO", "Owner", "Chief Customer Officer", "Executive owner for connected customer growth.", { attributes: { ownerType: "Executive", accountability: "Strategy and initiative outcomes" }, evidenceReferences: [evidence.strategy] }),
    dnaObject("OWNER-CI-PRODUCT", "Owner", "Customer Intelligence Product Owner", "Accountable owner for the Customer Intelligence digital product.", { attributes: { ownerType: "Product", accountability: "Digital product value and lifecycle" }, evidenceReferences: [evidence.initiative] }),
    dnaObject("OWNER-COMMERCIAL-DATA", "Owner", "Commercial Data Director", "Accountable owner for customer analytics and governed customer data.", { attributes: { ownerType: "Technology", accountability: "Customer analytics data" }, evidenceReferences: [evidence.portfolio] }),
    dnaObject("OWNER-FINANCE-REPORTING", "Owner", "Finance Reporting Authority", "Proposed accountable role for the protected finance-report boundary.", { lifecycleStatus: "Proposed", attributes: { ownerType: "Governance", accountability: "Change authority for twelve finance reports", confirmationStatus: "Conflicting" }, evidenceReferences: [evidence.finance], confidence: 0.61 }),

    dnaObject("RISK-FINANCE-OWNERSHIP", "Risk", "Finance reporting ownership conflict", "Ownership and change authority conflict across two evidence sources for twelve dependent finance reports.", { lifecycleStatus: "At Risk", attributes: { severity: "High", businessConsequence: "Unauthorized changes or inconsistent executive reporting", mitigation: "Protect report contracts and confirm accountable ownership" }, evidenceReferences: [evidence.finance, evidence.case], confidence: 0.94 }),
    dnaObject("DEBT-ORACLE-PLATFORM", "Technical Debt", "Oracle analytics platform obsolescence", "Aging platform increases operating cost, delivery friction, and strategic platform urgency.", { lifecycleStatus: "At Risk", attributes: { severity: "High", costOfDelay: "Continued platform cost and constrained delivery", remediation: "Staged Oracle-to-BigQuery replatform" }, evidenceReferences: [evidence.architecture, evidence.readiness] }),
    dnaObject("DEBT-PORTAL-COUPLING", "Technical Debt", "Customer portal analytics coupling", "Portal behavior and delivery remain coupled to legacy analytics and reporting boundaries.", { lifecycleStatus: "At Risk", attributes: { severity: "Medium", costOfDelay: "Slower customer-facing releases", remediation: "Incremental decoupling after warehouse foundation" }, evidenceReferences: [evidence.architecture] }),
    dnaObject("READY-BUSINESS-VALUE", "Readiness Assessment", "Customer Intelligence business value", "Deterministic assessment of business value for the Customer Intelligence product.", { attributes: { dimension: "Business Value", result: "High", score: 88, method: "Deterministic weighted portfolio assessment", assessmentStatus: "Confirmed" }, evidenceReferences: [evidence.readiness], confidence: 0.93 }),
    dnaObject("READY-CLOUD", "Readiness Assessment", "Customer Analytics cloud readiness", "Deterministic readiness assessment for the governed warehouse replatform.", { attributes: { dimension: "Cloud Readiness", result: "Ready with conditions", score: 82, method: "Deterministic technology and dependency rules", assessmentStatus: "Confirmed" }, evidenceReferences: [evidence.readiness, evidence.architecture], confidence: 0.9 }),
    dnaObject("READY-AI", "Readiness Assessment", "Customer Intelligence AI readiness", "Readiness assessment for AI use over governed customer data.", { attributes: { dimension: "AI Readiness", result: "Conditional", score: 68, method: "Deterministic data-quality and governance rules", assessmentStatus: "Confirmed" }, evidenceReferences: [evidence.readiness, evidence.finance], confidence: 0.84 }),
    dnaObject("CASE-DR-CIC-001", "Modernization Case Reference", "DR-CIC-001 — Customer Intelligence Capability", "Stable Enterprise DNA reference to the existing governed Journey case.", { lifecycleStatus: "Modernizing", attributes: { journeyCaseId: "DR-CIC-001", modernizationStatus: "Active Journey", recommendation: "Staged Oracle-to-BigQuery replatform with protected finance reporting" }, evidenceReferences: [evidence.case], confidence: 0.97 })
  ]);

  const relationships = Object.freeze([
    relationship("REL-001", "ADVANCES", "BI-CX-2026-01", "STR-CX-2026-01", { criticality: "Critical", evidenceReferences: [evidence.strategy, evidence.initiative] }),
    ...["OUT-CX-01", "OUT-CX-02", "OUT-CX-03", "OUT-CX-04", "OUT-CX-05"].map((id, index) => relationship(`REL-OUT-${index + 1}`, "TARGETS", "BI-CX-2026-01", id, { criticality: "High", evidenceReferences: [evidence.outcomes] })),
    ...["CAP-CI", "CAP-CS", "CAP-CA", "CAP-PT", "CAP-ER"].map((id, index) => relationship(`REL-CAP-${index + 1}`, "CHANGES", "BI-CX-2026-01", id, { criticality: "High", evidenceReferences: [evidence.initiative] })),
    relationship("REL-010", "PRODUCES_OUTCOME", "CAP-CS", "OUT-CX-01", { evidenceReferences: [evidence.outcomes] }),
    relationship("REL-011", "PRODUCES_OUTCOME", "CAP-CI", "OUT-CX-02", { evidenceReferences: [evidence.outcomes] }),
    relationship("REL-012", "PRODUCES_OUTCOME", "CAP-ER", "OUT-CX-03", { evidenceReferences: [evidence.outcomes, evidence.finance] }),
    relationship("REL-013", "PRODUCES_OUTCOME", "CAP-CA", "OUT-CX-04", { evidenceReferences: [evidence.outcomes] }),
    relationship("REL-014", "PRODUCES_OUTCOME", "CAP-PT", "OUT-CX-05", { evidenceReferences: [evidence.outcomes] }),
    ...["CAP-CI", "CAP-CS", "CAP-CA", "CAP-PT", "CAP-ER"].map((id, index) => relationship(`REL-DP-CAP-${index + 1}`, "ENABLES", "DP-CUSTOMER-INTELLIGENCE", id, { criticality: "High", evidenceReferences: [evidence.portfolio] })),
    relationship("REL-020", "REALIZED_BY", "DP-CUSTOMER-INTELLIGENCE", "APP-CUSTOMER-SERVICE", { criticality: "High", evidenceReferences: [evidence.portfolio] }),
    relationship("REL-021", "COMPRISES", "DP-CUSTOMER-INTELLIGENCE", "API-CUSTOMER-SERVICE", { evidenceReferences: [evidence.architecture] }),
    relationship("REL-022", "COMPRISES", "DP-CUSTOMER-INTELLIGENCE", "DATA-CUSTOMER-360", { criticality: "High", evidenceReferences: [evidence.portfolio] }),
    relationship("REL-023", "COMPRISES", "DP-CUSTOMER-INTELLIGENCE", "PLATFORM-CUSTOMER-ANALYTICS", { criticality: "Critical", evidenceReferences: [evidence.portfolio] }),
    relationship("REL-024", "COMPRISES", "DP-CUSTOMER-INTELLIGENCE", "PLATFORM-PRODUCT-TELEMETRY", { evidenceReferences: [evidence.telemetry] }),
    relationship("REL-025", "DEPENDS_ON", "DP-CUSTOMER-INTELLIGENCE", "PLATFORM-FINANCE-WAREHOUSE", { criticality: "Critical", evidenceReferences: [evidence.finance] }),
    relationship("REL-026", "EXPOSES", "APP-CUSTOMER-SERVICE", "API-CUSTOMER-SERVICE", { evidenceReferences: [evidence.architecture] }),
    relationship("REL-027", "STORES_IN", "APP-CUSTOMER-SERVICE", "DB-CUSTOMER-SERVICE", { evidenceReferences: [evidence.architecture] }),
    relationship("REL-028", "CONSUMES", "DATA-CUSTOMER-360", "PLATFORM-CUSTOMER-ANALYTICS", { criticality: "High", evidenceReferences: [evidence.architecture] }),
    relationship("REL-029", "CONSUMES", "DATA-CUSTOMER-360", "PLATFORM-PRODUCT-TELEMETRY", { evidenceReferences: [evidence.telemetry] }),
    relationship("REL-030", "STORES_IN", "PLATFORM-CUSTOMER-ANALYTICS", "DB-CUSTOMER-ANALYTICS", { evidenceReferences: [evidence.architecture] }),
    relationship("REL-031", "FLOWS_TO", "APP-CUSTOMER-SERVICE", "PIPE-CUSTOMER-INSIGHT", { evidenceReferences: [evidence.architecture] }),
    relationship("REL-032", "FLOWS_TO", "PLATFORM-PRODUCT-TELEMETRY", "PIPE-CUSTOMER-INSIGHT", { evidenceReferences: [evidence.telemetry] }),
    relationship("REL-033", "PRODUCES", "PIPE-CUSTOMER-INSIGHT", "DATA-CUSTOMER-360", { criticality: "High", evidenceReferences: [evidence.architecture] }),
    relationship("REL-034", "CONSUMES", "AI-RENEWAL-PROPENSITY", "DATA-CUSTOMER-360", { lifecycleStatus: "Proposed", evidenceReferences: [evidence.readiness] }),
    relationship("REL-035", "RUNS_ON", "PLATFORM-CUSTOMER-ANALYTICS", "INFRA-ORACLE-EXADATA", { criticality: "Critical", evidenceReferences: [evidence.architecture] }),
    relationship("REL-036", "OWNED_BY", "STR-CX-2026-01", "OWNER-CCO", { criticality: "High", evidenceReferences: [evidence.strategy] }),
    relationship("REL-037", "ACCOUNTABLE_FOR", "OWNER-CCO", "BI-CX-2026-01", { criticality: "High", evidenceReferences: [evidence.initiative] }),
    relationship("REL-038", "OWNED_BY", "DP-CUSTOMER-INTELLIGENCE", "OWNER-CI-PRODUCT", { criticality: "High", evidenceReferences: [evidence.initiative] }),
    relationship("REL-039", "OWNED_BY", "PLATFORM-CUSTOMER-ANALYTICS", "OWNER-COMMERCIAL-DATA", { evidenceReferences: [evidence.portfolio] }),
    relationship("REL-040", "OWNED_BY", "PLATFORM-FINANCE-WAREHOUSE", "OWNER-FINANCE-REPORTING", { status: "Disputed", confidence: 0.61, evidenceReferences: [evidence.finance] }),
    relationship("REL-041", "ENGINEERED_BY", "APP-CUSTOMER-SERVICE", "TEAM-CUSTOMER-EXPERIENCE", { evidenceReferences: [evidence.portfolio] }),
    relationship("REL-042", "OPERATED_BY", "API-CUSTOMER-SERVICE", "TEAM-CUSTOMER-EXPERIENCE", { evidenceReferences: [evidence.architecture] }),
    relationship("REL-043", "ENGINEERED_BY", "PLATFORM-CUSTOMER-ANALYTICS", "TEAM-COMMERCIAL-DATA", { evidenceReferences: [evidence.portfolio] }),
    relationship("REL-044", "OPERATED_BY", "PLATFORM-PRODUCT-TELEMETRY", "TEAM-DIGITAL-TELEMETRY", { evidenceReferences: [evidence.telemetry] }),
    relationship("REL-045", "OPERATED_BY", "PLATFORM-FINANCE-WAREHOUSE", "TEAM-FINANCE-DATA", { status: "Proposed", confidence: 0.68, evidenceReferences: [evidence.finance] }),
    relationship("REL-046", "THREATENS", "RISK-FINANCE-OWNERSHIP", "OUT-CX-03", { criticality: "Critical", evidenceReferences: [evidence.finance] }),
    relationship("REL-047", "THREATENS", "RISK-FINANCE-OWNERSHIP", "OUT-CX-04", { criticality: "Critical", evidenceReferences: [evidence.finance] }),
    relationship("REL-048", "AFFECTS", "RISK-FINANCE-OWNERSHIP", "PLATFORM-FINANCE-WAREHOUSE", { criticality: "Critical", evidenceReferences: [evidence.finance] }),
    relationship("REL-049", "AFFECTS", "DEBT-ORACLE-PLATFORM", "PLATFORM-CUSTOMER-ANALYTICS", { criticality: "High", evidenceReferences: [evidence.architecture] }),
    relationship("REL-050", "AFFECTS", "DEBT-PORTAL-COUPLING", "APP-CUSTOMER-SERVICE", { evidenceReferences: [evidence.architecture] }),
    relationship("REL-051", "MEASURES", "READY-BUSINESS-VALUE", "DP-CUSTOMER-INTELLIGENCE", { evidenceReferences: [evidence.readiness] }),
    relationship("REL-052", "MEASURES", "READY-CLOUD", "PLATFORM-CUSTOMER-ANALYTICS", { evidenceReferences: [evidence.readiness] }),
    relationship("REL-053", "MEASURES", "READY-AI", "DP-CUSTOMER-INTELLIGENCE", { evidenceReferences: [evidence.readiness] }),
    relationship("REL-054", "MODERNIZED_BY", "DP-CUSTOMER-INTELLIGENCE", "CASE-DR-CIC-001", { criticality: "Critical", evidenceReferences: [evidence.case] }),
    relationship("REL-055", "MODERNIZED_BY", "PLATFORM-CUSTOMER-ANALYTICS", "CASE-DR-CIC-001", { criticality: "Critical", evidenceReferences: [evidence.case] }),
    relationship("REL-056", "SUPPORTS", "CASE-DR-CIC-001", "BI-CX-2026-01", { criticality: "Critical", evidenceReferences: [evidence.case, evidence.initiative] }),
    ...["OUT-CX-01", "OUT-CX-02", "OUT-CX-03", "OUT-CX-04", "OUT-CX-05"].map((id, index) => relationship(`REL-CASE-OUT-${index + 1}`, "PRODUCES_OUTCOME", "CASE-DR-CIC-001", id, { criticality: "High", evidenceReferences: [evidence.case, evidence.outcomes] })),
    ...["CAP-CI", "CAP-CS", "CAP-CA", "CAP-PT", "CAP-ER", "APP-CUSTOMER-SERVICE", "DATA-CUSTOMER-360", "PLATFORM-PRODUCT-TELEMETRY", "PLATFORM-FINANCE-WAREHOUSE", "TEAM-CUSTOMER-EXPERIENCE", "TEAM-COMMERCIAL-DATA", "RISK-FINANCE-OWNERSHIP", "DEBT-ORACLE-PLATFORM"].map((id, index) => relationship(`REL-CASE-LINK-${index + 1}`, "AFFECTS", "CASE-DR-CIC-001", id, { evidenceReferences: [evidence.case] }))
  ]);

  const findings = Object.freeze([
    Object.freeze({
      id: "EI-FINDING-DR-CIC-001", question: "Why was DR-CIC-001 recommended?",
      conclusion: "DR-CIC-001 was recommended because Connected Customer Growth depends on five customer capabilities realized through one Customer Intelligence digital product, while Oracle platform debt, coupled service and telemetry flows, and the Finance Warehouse ownership conflict threaten five measurable outcomes. A staged warehouse-led replatform preserves reporting contracts while improving customer insight and delivery readiness.",
      affectedObjectIds: Object.freeze(["STR-CX-2026-01", "BI-CX-2026-01", "OUT-CX-01", "OUT-CX-02", "OUT-CX-03", "OUT-CX-04", "OUT-CX-05", "CAP-CI", "CAP-CS", "CAP-CA", "CAP-PT", "CAP-ER", "DP-CUSTOMER-INTELLIGENCE", "APP-CUSTOMER-SERVICE", "PLATFORM-CUSTOMER-ANALYTICS", "PLATFORM-PRODUCT-TELEMETRY", "PLATFORM-FINANCE-WAREHOUSE", "RISK-FINANCE-OWNERSHIP", "DEBT-ORACLE-PLATFORM", "CASE-DR-CIC-001"]),
      evidenceReferences: Object.freeze([evidence.strategy, evidence.initiative, evidence.outcomes, evidence.portfolio, evidence.architecture, evidence.finance, evidence.readiness, evidence.case]),
      assumptions: Object.freeze(["The finance-report contracts can be preserved during a staged transition.", "Customer service, analytics, and telemetry remain one durable product boundary."]),
      confidence: 0.91, method: "Deterministic strategy-to-outcome trace with dependency, risk, technical-debt, and readiness rules",
      alternatives: Object.freeze(["Broader capability rebuild", "Retain and optimize the Oracle platform", "Defer pending complete ownership evidence"]),
      recommendedAction: "Begin DR-CIC-001 with a staged Oracle-to-BigQuery replatform and a protected Finance Warehouse reporting boundary.",
      reviewCondition: "Review if strategy priority, report ownership, dependency scope, or readiness evidence changes.", status: "Confirmed"
    })
  ]);

  const legacyReferenceMap = Object.freeze({
    "BI-CX-2026-01": "BI-CX-2026-01", "DR-CIC-001": "CASE-DR-CIC-001", "app-03": "APP-CUSTOMER-SERVICE",
    "data-01": "PLATFORM-CUSTOMER-ANALYTICS", "data-05": "PLATFORM-PRODUCT-TELEMETRY", "data-04": "PLATFORM-FINANCE-WAREHOUSE"
  });

  function buildIndexes(sourceObjects, sourceRelationships) {
    const objectsById = new Map(); const relationshipsById = new Map();
    const outgoingByObjectId = new Map(); const incomingByObjectId = new Map();
    const objectsByKind = new Map(); const relationshipsByType = new Map();
    sourceObjects.forEach((item) => { objectsById.set(item.id, item); if (!objectsByKind.has(item.kind)) objectsByKind.set(item.kind, []); objectsByKind.get(item.kind).push(item); });
    sourceRelationships.forEach((item) => {
      relationshipsById.set(item.id, item);
      if (!outgoingByObjectId.has(item.sourceId)) outgoingByObjectId.set(item.sourceId, []);
      if (!incomingByObjectId.has(item.targetId)) incomingByObjectId.set(item.targetId, []);
      if (!relationshipsByType.has(item.type)) relationshipsByType.set(item.type, []);
      outgoingByObjectId.get(item.sourceId).push(item); incomingByObjectId.get(item.targetId).push(item); relationshipsByType.get(item.type).push(item);
    });
    return { objectsById, relationshipsById, outgoingByObjectId, incomingByObjectId, objectsByKind, relationshipsByType };
  }

  function validateModel(sourceObjects = objects, sourceRelationships = relationships, sourceFindings = findings) {
    const errors = []; const objectIds = new Set(); const relationshipIds = new Set(); const edgeKeys = new Set();
    sourceObjects.forEach((item) => {
      if (!item.id || objectIds.has(item.id)) errors.push(`Duplicate or missing object ID: ${item.id || "unknown"}`); objectIds.add(item.id);
      if (!OBJECT_KINDS.includes(item.kind)) errors.push(`Unsupported object kind: ${item.kind}`);
      if (!LIFECYCLE_STATUSES.includes(item.lifecycleStatus)) errors.push(`Unsupported lifecycle: ${item.lifecycleStatus}`);
      if (!Number.isFinite(item.confidence) || item.confidence < 0 || item.confidence > 1) errors.push(`Invalid confidence: ${item.id}`);
      if (DECISION_RELEVANT_KINDS.has(item.kind) && (!item.provenance || !item.evidenceReferences.length)) errors.push(`Decision-relevant object lacks provenance or evidence: ${item.id}`);
      if (item.kind === "Risk" && !item.evidenceReferences.length) errors.push(`Risk lacks evidence: ${item.id}`);
    });
    sourceRelationships.forEach((item) => {
      const edgeKey = `${item.type}:${item.sourceId}:${item.targetId}`;
      if (!item.id || relationshipIds.has(item.id)) errors.push(`Duplicate or missing relationship ID: ${item.id || "unknown"}`); relationshipIds.add(item.id);
      if (!RELATIONSHIP_TYPES.includes(item.type)) errors.push(`Unsupported relationship type: ${item.type}`);
      if (!objectIds.has(item.sourceId) || !objectIds.has(item.targetId)) errors.push(`Invalid relationship endpoint: ${item.id}`);
      if (edgeKeys.has(edgeKey)) errors.push(`Duplicate relationship: ${edgeKey}`); edgeKeys.add(edgeKey);
      if (!Number.isFinite(item.confidence) || item.confidence < 0 || item.confidence > 1) errors.push(`Invalid relationship confidence: ${item.id}`);
      if (!LIFECYCLE_STATUSES.includes(item.lifecycleStatus)) errors.push(`Unsupported relationship lifecycle: ${item.id}`);
    });
    sourceFindings.forEach((item) => {
      if (!item.id || !item.question || !item.conclusion || !item.method || !item.recommendedAction) errors.push(`Incomplete intelligence finding: ${item.id || "unknown"}`);
      if (!item.evidenceReferences?.length || !item.affectedObjectIds?.length) errors.push(`Untraceable intelligence finding: ${item.id}`);
      item.affectedObjectIds?.forEach((id) => { if (!objectIds.has(id)) errors.push(`Finding references unknown object: ${id}`); });
      if (!Number.isFinite(item.confidence) || item.confidence < 0 || item.confidence > 1) errors.push(`Invalid finding confidence: ${item.id}`);
    });
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
  }

  const validation = validateModel();
  if (!validation.valid) throw new Error(`Enterprise DNA model is invalid: ${validation.errors.join("; ")}`);
  const indexes = buildIndexes(objects, relationships);
  const intelligenceFindingsById = new Map(findings.map((item) => [item.id, item]));

  function resolveId(id) { return legacyReferenceMap[id] || id; }
  function getObject(id) { return indexes.objectsById.get(resolveId(id)) || null; }
  function getObjectsByKind(kind) { return Object.freeze([...(indexes.objectsByKind.get(kind) || [])]); }
  function getRelationships(id, direction = "both", types = null) {
    const objectId = resolveId(id); const typeSet = types ? new Set(types) : null; let result = [];
    if (direction === "outgoing" || direction === "both") result = result.concat(indexes.outgoingByObjectId.get(objectId) || []);
    if (direction === "incoming" || direction === "both") result = result.concat(indexes.incomingByObjectId.get(objectId) || []);
    return Object.freeze(result.filter((item) => !typeSet || typeSet.has(item.type)));
  }

  function traverse(startId, options = {}) {
    const start = resolveId(startId); const direction = options.direction || "both";
    const maxDepth = Math.min(Math.max(Number(options.maxDepth) || 1, 1), 6);
    const limit = Math.min(Math.max(Number(options.limit) || 50, 1), 250);
    const typeSet = options.types ? new Set(options.types) : null; const visited = new Set([start]); const queue = [{ id: start, depth: 0 }]; const result = [];
    while (queue.length && result.length < limit) {
      const current = queue.shift(); if (current.depth >= maxDepth) continue;
      const links = getRelationships(current.id, direction, typeSet ? [...typeSet] : null);
      for (const link of links) {
        const nextId = link.sourceId === current.id ? link.targetId : link.sourceId;
        if (visited.has(nextId)) continue; visited.add(nextId);
        result.push(Object.freeze({ object: indexes.objectsById.get(nextId), relationship: link, depth: current.depth + 1 }));
        if (result.length >= limit) break; queue.push({ id: nextId, depth: current.depth + 1 });
      }
    }
    return Object.freeze(result);
  }

  function objectsFromRelationships(links, endpoint) { return links.map((link) => indexes.objectsById.get(link[endpoint])).filter(Boolean); }
  function capabilitiesAndProductsForStrategy(strategyId) {
    const initiatives = objectsFromRelationships(getRelationships(strategyId, "incoming", ["ADVANCES"]), "sourceId");
    const capabilities = []; const products = [];
    initiatives.forEach((initiative) => objectsFromRelationships(getRelationships(initiative.id, "outgoing", ["CHANGES"]), "targetId").forEach((item) => capabilities.push(item)));
    capabilities.forEach((capability) => objectsFromRelationships(getRelationships(capability.id, "incoming", ["ENABLES"]), "sourceId").forEach((item) => { if (item.kind === "Digital Product" && !products.some((existing) => existing.id === item.id)) products.push(item); }));
    return Object.freeze({ strategy: getObject(strategyId), initiatives: Object.freeze(initiatives), capabilities: Object.freeze(capabilities), digitalProducts: Object.freeze(products) });
  }

  function initiativeContext(initiativeId) {
    const initiative = getObject(initiativeId); if (!initiative) return null;
    const connected = traverse(initiative.id, { maxDepth: 4, limit: 120 });
    const byKinds = (kinds) => Object.freeze(connected.map((item) => item.object).filter((item) => kinds.includes(item.kind)).filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index));
    return Object.freeze({ initiative, outcomes: byKinds(["Business Outcome"]), capabilities: byKinds(["Business Capability"]), digitalProducts: byKinds(["Digital Product"]), technology: byKinds(["Application", "API", "Data Product", "Data Platform", "Database", "Pipeline", "AI Model", "Infrastructure"]), teams: byKinds(["Engineering Team"]), owners: byKinds(["Owner"]), risks: byKinds(["Risk", "Technical Debt"]), assessments: byKinds(["Readiness Assessment"]) });
  }

  function whyCaseRecommended(caseId = "DR-CIC-001") {
    const resolved = resolveId(caseId);
    return findings.find((item) => item.affectedObjectIds.includes(resolved)) || null;
  }

  function objectsForCase(caseId = "DR-CIC-001", limit = 100) {
    const caseObject = getObject(caseId); if (!caseObject) return Object.freeze([]);
    return Object.freeze(traverse(caseObject.id, { maxDepth: 3, limit: Math.min(limit, 200) }).map((item) => item.object).filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index));
  }

  function expectedOutcomesForCase(caseId = "DR-CIC-001") {
    const caseObject = getObject(caseId); if (!caseObject) return Object.freeze([]);
    return Object.freeze(objectsFromRelationships(getRelationships(caseObject.id, "outgoing", ["PRODUCES_OUTCOME"]), "targetId"));
  }

  function financeDependencyImpact() {
    const dependency = getObject("data-04");
    const affected = traverse(dependency.id, { direction: "both", maxDepth: 3, limit: 80, types: ["DEPENDS_ON", "AFFECTS", "OWNED_BY", "OPERATED_BY", "THREATENS", "PRODUCES_OUTCOME"] });
    const unique = affected.map((item) => item.object).filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);
    return Object.freeze({ dependency, assets: Object.freeze(unique.filter((item) => ["Digital Product", "Application", "API", "Data Product", "Data Platform", "Database", "Pipeline", "Infrastructure"].includes(item.kind))), teams: Object.freeze(unique.filter((item) => item.kind === "Engineering Team")), owners: Object.freeze(unique.filter((item) => item.kind === "Owner")), risks: Object.freeze(unique.filter((item) => item.kind === "Risk")), outcomes: Object.freeze(unique.filter((item) => item.kind === "Business Outcome")) });
  }

  function productDependencies(productId = "DP-CUSTOMER-INTELLIGENCE") {
    const product = getObject(productId); if (!product) return null;
    const upstream = objectsFromRelationships(getRelationships(product.id, "outgoing", ["DEPENDS_ON", "CONSUMES", "RUNS_ON", "STORES_IN"]), "targetId");
    const downstream = objectsFromRelationships(getRelationships(product.id, "incoming", ["DEPENDS_ON", "CONSUMES", "FLOWS_TO", "SUPPORTS"]), "sourceId");
    const components = objectsFromRelationships(getRelationships(product.id, "outgoing", ["COMPRISES", "REALIZED_BY"]), "targetId");
    return Object.freeze({ product, upstream: Object.freeze(upstream), downstream: Object.freeze(downstream), components: Object.freeze(components) });
  }

  function risksThreateningOutcomes(caseId = "DR-CIC-001") {
    const outcomes = expectedOutcomesForCase(caseId); const outcomeIds = new Set(outcomes.map((item) => item.id));
    const threats = (indexes.relationshipsByType.get("THREATENS") || []).filter((link) => outcomeIds.has(link.targetId));
    return Object.freeze(threats.map((link) => Object.freeze({ risk: indexes.objectsById.get(link.sourceId), outcome: indexes.objectsById.get(link.targetId), relationship: link })));
  }

  function projectionForCase(caseId = "DR-CIC-001", journeySnapshot = {}) {
    const caseObject = getObject(caseId); if (!caseObject) return null;
    const initiative = getObject("BI-CX-2026-01"); const strategy = getObject("STR-CX-2026-01"); const product = getObject("DP-CUSTOMER-INTELLIGENCE");
    const outcomes = expectedOutcomesForCase(caseId); const context = initiativeContext(initiative.id); const finding = whyCaseRecommended(caseId);
    return Object.freeze({
      caseObject, strategy, initiative, digitalProduct: product, outcomes,
      capabilities: context.capabilities, affectedAssets: context.technology, teams: context.teams, owners: context.owners,
      primaryDependency: getObject("data-04"), primaryRisk: getObject("RISK-FINANCE-OWNERSHIP"), assessments: context.assessments,
      expectedValue: product.attributes.expectedValue, finding,
      journey: Object.freeze({ stage: journeySnapshot.stage || "Not started", owner: journeySnapshot.owner || "Unassigned", task: journeySnapshot.task || "Not started", blocker: journeySnapshot.blocker || "None", next: journeySnapshot.next || "Begin Portfolio Discovery" })
    });
  }

  function workspaceProjection(workspace, caseId = "DR-CIC-001", journeySnapshot = {}) {
    const base = projectionForCase(caseId, journeySnapshot); if (!base) return null;
    const common = { strategy: base.strategy, initiative: base.initiative, digitalProduct: base.digitalProduct, outcomes: base.outcomes, primaryRisk: base.primaryRisk, journey: base.journey };
    if (workspace === "decision") return Object.freeze({ ...common, dependency: base.primaryDependency, accountableOwners: base.owners, responsibleTeams: base.teams, alternatives: base.finding.alternatives, recommendation: base.finding.recommendedAction });
    if (workspace === "engineering") return Object.freeze({ ...common, changedObjects: [base.digitalProduct, getObject("PLATFORM-CUSTOMER-ANALYTICS"), getObject("DB-CUSTOMER-ANALYTICS"), getObject("PIPE-CUSTOMER-INSIGHT")], architectureOwner: getObject("OWNER-COMMERCIAL-DATA") });
    if (workspace === "validation") return Object.freeze({ ...common, validatedObjects: [base.digitalProduct, getObject("PLATFORM-CUSTOMER-ANALYTICS"), getObject("DATA-CUSTOMER-360"), base.primaryDependency], conditions: [base.primaryRisk, getObject("DEBT-ORACLE-PLATFORM")] });
    if (workspace === "executive") return Object.freeze({ ...common, expectedValue: base.expectedValue, remainingRisks: [base.primaryRisk], capabilities: base.capabilities, recommendation: base.finding.recommendedAction });
    return base;
  }

  return Object.freeze({
    OBJECT_KINDS, RELATIONSHIP_TYPES, LIFECYCLE_STATUSES, evidence, objects, relationships, findings, legacyReferenceMap,
    state: Object.freeze({ ...indexes, intelligenceFindingsById, legacyReferenceMap }), validateModel, buildIndexes, resolveId, getObject,
    getObjectsByKind, getRelationships, traverse, capabilitiesAndProductsForStrategy, initiativeContext, whyCaseRecommended,
    objectsForCase, expectedOutcomesForCase, financeDependencyImpact, productDependencies, risksThreateningOutcomes,
    projectionForCase, workspaceProjection
  });
}));

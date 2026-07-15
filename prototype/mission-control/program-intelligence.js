(function initializeProgramIntelligence(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ProgramIntelligence = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function createProgramIntelligence() {
  "use strict";

  const WORKFLOW = Object.freeze([
    Object.freeze({ stage: "Assessment Ready", owner: "Chief Enterprise Architect", task: "Review application architecture and shared dependencies", blocker: "None", next: "Start Architecture Review", evidence: "Application inventory and dependency evidence" }),
    Object.freeze({ stage: "Architecture Review", owner: "Chief Enterprise Architect", task: "Define the application boundary and integration seams", blocker: "Supplier Master API ownership must remain visible", next: "Complete Architecture Review", evidence: "Architecture Review" }),
    Object.freeze({ stage: "Business Review", owner: "Business Strategist", task: "Confirm supplier-quality value and release outcomes", blocker: "None", next: "Complete Business Review", evidence: "Evidence Package · Architecture Review" }),
    Object.freeze({ stage: "Risk Review", owner: "Risk & Governance Specialist", task: "Review integration fragility and accountable controls", blocker: "Shared API change authority requires confirmation", next: "Complete Risk Review", evidence: "Evidence Package · Architecture Review · Business Review" }),
    Object.freeze({ stage: "Decision Pending", owner: "Mission Commander", task: "Review the governed application modernization case", blocker: "Waiting for Mission Commander", next: "Mission Commander decision", evidence: "Four completed specialist reviews" })
  ]);

  const cases = Object.freeze({
    "DR-CIC-001": Object.freeze({
      id: "DR-CIC-001", name: "Customer Intelligence Capability", type: "Data-platform-led", purpose: "Modernize customer intelligence through a traceable Oracle-to-BigQuery decision record.", applicationOwner: "Customer Care", technicalOwner: "Commercial Data", dependencies: Object.freeze(["Finance Warehouse", "Product Telemetry Platform"]), evidence: "Validated portfolio, architecture, business, risk, engineering, and validation evidence", recommendation: "Execute the warehouse-led staged replatform with governed conditions.", lineage: Object.freeze(["BI-CX-2026-01", "PF-APEX-TECH-01", "MP-CI-01", "DR-CIC-001"])
    }),
    "DR-SQP-002": Object.freeze({
      id: "DR-SQP-002", name: "Supplier Quality Portal Modernization", type: "Application-led", purpose: "Reduce technical debt, fragile integrations, and slow releases around supplier quality operations.", applicationOwner: "Supply Chain Quality", technicalOwner: "Enterprise Applications", dependencies: Object.freeze(["Supplier Master API", "Supplier Quality Database", "Identity and Access Service"]), evidence: "Synthetic application inventory, integration map, lifecycle evidence, and release constraints", recommendation: "Use an incremental application refactor after shared dependency review.", lineage: Object.freeze(["BI-CX-2026-01", "PF-APEX-TECH-01", "MP-CI-01", "DR-SQP-002"])
    })
  });

  const sharedDependencies = Object.freeze([
    Object.freeze({ id: "DEP-SUPPLIER-MASTER", name: "Supplier Master API", owner: "Enterprise Integration", directCases: Object.freeze(["DR-SQP-002"]), indirectCases: Object.freeze([]), status: "Ownership confirmation required" })
  ]);

  const workObjectTemplates = Object.freeze([
    Object.freeze({ id: "evidence", title: "Evidence Package", stageIndex: 0 }),
    Object.freeze({ id: "architecture", title: "Architecture Review", stageIndex: 1 }),
    Object.freeze({ id: "business", title: "Business Review", stageIndex: 2 }),
    Object.freeze({ id: "risk", title: "Risk Review", stageIndex: 3 }),
    Object.freeze({ id: "decision", title: "Decision Record (placeholder)", stageIndex: 4 })
  ]);

  function freshState() { return { stageIndex: 0, status: "ready", paused: false, decisionHistory: [] }; }
  const state = { activeCaseId: "DR-CIC-001", casesById: { "DR-CIC-001": freshState(), "DR-SQP-002": freshState() } };

  function selectCase(caseId) {
    if (!cases[caseId]) return false;
    state.activeCaseId = caseId;
    return true;
  }

  function caseSnapshot(caseId = state.activeCaseId) {
    const definition = cases[caseId];
    const progress = state.casesById[caseId];
    if (!definition || !progress) return null;
    const work = WORKFLOW[progress.stageIndex];
    return { ...definition, ...work, stageIndex: progress.stageIndex, status: progress.status, paused: progress.paused };
  }

  function advanceCase(caseId = state.activeCaseId) {
    const progress = state.casesById[caseId];
    if (!progress || progress.paused || progress.stageIndex >= WORKFLOW.length - 1) return caseSnapshot(caseId);
    const from = WORKFLOW[progress.stageIndex].stage;
    progress.stageIndex += 1;
    progress.status = progress.stageIndex === WORKFLOW.length - 1 ? "waiting" : "in-review";
    progress.decisionHistory.push({ from, to: WORKFLOW[progress.stageIndex].stage });
    return caseSnapshot(caseId);
  }

  function pauseCase(caseId = state.activeCaseId) { const progress = state.casesById[caseId]; if (progress) progress.paused = true; return caseSnapshot(caseId); }
  function resumeCase(caseId = state.activeCaseId) { const progress = state.casesById[caseId]; if (progress) progress.paused = false; return caseSnapshot(caseId); }
  function resetCase(caseId = state.activeCaseId) { if (cases[caseId]) state.casesById[caseId] = freshState(); return caseSnapshot(caseId); }
  function resetAll() { Object.keys(cases).forEach((caseId) => { state.casesById[caseId] = freshState(); }); state.activeCaseId = "DR-CIC-001"; }

  function workObjectsForCase(caseId = state.activeCaseId) {
    const snapshot = caseSnapshot(caseId);
    return workObjectTemplates.map((item) => ({
      ...item,
      caseId,
      owner: WORKFLOW[item.stageIndex].owner,
      evidence: WORKFLOW[item.stageIndex].evidence,
      dependencies: cases[caseId].dependencies.slice(),
      lifecycle: item.stageIndex < snapshot.stageIndex ? "complete" : item.stageIndex === snapshot.stageIndex ? (snapshot.paused ? "paused" : snapshot.status) : "locked",
      next: WORKFLOW[item.stageIndex].next
    }));
  }

  function programSummary() {
    const snapshots = Object.keys(cases).map(caseSnapshot);
    return {
      id: "MP-CI-01", name: "Customer Intelligence Modernization Program", caseCount: 2,
      types: ["Data-platform-led", "Application-led"], owner: "Transformation Office",
      status: snapshots.every((item) => item.stage === "Decision Pending") ? "Decision coordination" : "Active",
      blocker: "Shared dependency ownership and Mission Commander decisions",
      readiness: "One execution-ready case with conditions; one assessment-ready application case",
      sharedDependencies,
      sequence: ["DR-CIC-001 · Execution Ready with Conditions", "DR-SQP-002 · Decision Pending"],
      rationale: "Customer Intelligence proceeds first because its evidence and validated package are more mature; Supplier Quality follows after its application reviews and shared API ownership are governed."
    };
  }

  function validateModel() {
    return Object.keys(cases).length === 2
      && new Set(sharedDependencies.map((item) => item.id)).size === sharedDependencies.length
      && Object.keys(state.casesById).every((caseId) => workObjectsForCase(caseId).every((item) => item.caseId === caseId))
      && WORKFLOW.length === 5;
  }

  return Object.freeze({ WORKFLOW, cases, sharedDependencies, state, selectCase, caseSnapshot, advanceCase, pauseCase, resumeCase, resetCase, resetAll, workObjectsForCase, programSummary, validateModel });
}));

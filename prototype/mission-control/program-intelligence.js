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
    Object.freeze({ id: "DEP-SUPPLIER-MASTER", name: "Supplier Master API", owner: "Enterprise Integration", directCases: Object.freeze(["DR-SQP-002"]), indirectCases: Object.freeze(["DR-CIC-001"]), status: "Ownership confirmation required" })
  ]);

  const PROGRAM_CONSTRAINT_ID = "PC-SMA-001";
  const programConstraintDefinition = Object.freeze({
    id: PROGRAM_CONSTRAINT_ID,
    programId: "MP-CI-01",
    description: "The Supplier Master API must not introduce a breaking interface change during the next six months.",
    businessRationale: "The interface supports multiple modernization cases and active enterprise consumers; an ungoverned breaking change could interrupt supplier and reference-data operations.",
    dependencyId: "DEP-SUPPLIER-MASTER",
    dependency: "Supplier Master API",
    affectedCases: Object.freeze(["DR-SQP-002", "DR-CIC-001"]),
    evidence: Object.freeze(["Supplier Quality integration map", "Active consumer inventory", "Customer Intelligence reference-data assumption review"]),
    owner: "Transformation Office",
    proposedDuration: "Six months",
    impactSummary: "Direct compatibility obligation for DR-SQP-002; limited governance annotation for DR-CIC-001.",
    downstreamObligations: Object.freeze(["Preserve the current Supplier Master API contract", "Add compatibility controls to DR-SQP-002", "Verify reference-data assumptions for DR-CIC-001", "Do not invalidate unaffected completed work"])
  });

  const caseImpactDefinitions = Object.freeze({
    "DR-SQP-002": Object.freeze({ caseId: "DR-SQP-002", impactType: "Direct", currentReadiness: "Assessment Ready", proposedChanges: Object.freeze(["Preserve API compatibility", "Consider a staged modernization or compatibility boundary", "Attach the program constraint to the Decision Record"]), unaffectedWork: "Evidence Package and completed reviews remain valid.", sequencingImpact: "Proceed after the protected interface boundary is approved and attached.", decisionRequired: "Approve the Protected Interface Boundary", owner: "Chief Enterprise Architect", nextAction: "Review compatibility-control obligation" }),
    "DR-CIC-001": Object.freeze({ caseId: "DR-CIC-001", impactType: "Indirect / limited", currentReadiness: "Execution Ready with Conditions", proposedChanges: Object.freeze(["Attach a reference-data governance note only"]), unaffectedWork: "Completed reviews, propagation, six generated artifacts, validation results, and executive approval remain valid.", sequencingImpact: "No workflow replay or sequence delay.", decisionRequired: "Confirm minimum governance annotation", owner: "Transformation Office", nextAction: "Preserve completed state and monitor the dependency note" })
  });

  const programWorkObjectDefinitions = Object.freeze([
    Object.freeze({ id: "PWO-CONSTRAINT-001", title: "Program Constraint", caseId: null, owner: "Transformation Office", evidence: "Active consumer inventory and shared-dependency evidence", nextAction: "Mission Commander decision" }),
    Object.freeze({ id: "PWO-IMPACT-001", title: "Cross-Case Impact Assessment", caseId: null, owner: "Chief Enterprise Architect", evidence: "Direct and indirect case-impact comparison", nextAction: "Review protected interface boundary" }),
    Object.freeze({ id: "PWO-DECISION-001", title: "Program Decision Record", caseId: null, owner: "Mission Commander", evidence: "Program constraint and impact assessment", nextAction: "Approve, request evidence, or reject" }),
    Object.freeze({ id: "PWO-COMPAT-002", title: "Compatibility Control", caseId: "DR-SQP-002", owner: "Chief Enterprise Architect", evidence: "Approved protected interface boundary", nextAction: "Attach to the Supplier Quality Decision Record" }),
    Object.freeze({ id: "PWO-IMPACT-CIC-001", title: "Case Impact Record", caseId: "DR-CIC-001", owner: "Transformation Office", evidence: "Reference-data assumption review", nextAction: "Monitor; do not replay completed work" }),
    Object.freeze({ id: "PWO-SEQUENCE-001", title: "Program Sequencing Update", caseId: null, owner: "Transformation Office", evidence: "Approved decision and selective propagation", nextAction: "Coordinate the protected-boundary obligation" })
  ]);

  const workObjectTemplates = Object.freeze([
    Object.freeze({ id: "evidence", title: "Evidence Package", stageIndex: 0 }),
    Object.freeze({ id: "architecture", title: "Architecture Review", stageIndex: 1 }),
    Object.freeze({ id: "business", title: "Business Review", stageIndex: 2 }),
    Object.freeze({ id: "risk", title: "Risk Review", stageIndex: 3 }),
    Object.freeze({ id: "decision", title: "Decision Record (placeholder)", stageIndex: 4 })
  ]);

  function freshState() { return { stageIndex: 0, status: "ready", paused: false, decisionHistory: [] }; }
  function freshProgramState() {
    return {
      programConstraintsById: { [PROGRAM_CONSTRAINT_ID]: { approvalStatus: "Pending Mission Commander", impactStatus: "Assessed" } },
      programDecisionsById: {},
      caseImpactByConstraintId: { [PROGRAM_CONSTRAINT_ID]: {} },
      propagationStateByConstraintId: { [PROGRAM_CONSTRAINT_ID]: { status: "Not approved", completedCases: [], sequence: 0 } },
      programWorkObjectsById: {},
      sequencingRevisionCount: 0
    };
  }
  const state = { activeCaseId: "DR-CIC-001", casesById: { "DR-CIC-001": freshState(), "DR-SQP-002": freshState() }, ...freshProgramState() };

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
    const impact = state.caseImpactByConstraintId[PROGRAM_CONSTRAINT_ID]?.[caseId];
    const protectedSupplierCase = caseId === "DR-SQP-002" && impact?.status === "Propagated";
    return {
      ...definition, ...work, stageIndex: progress.stageIndex, status: progress.status, paused: progress.paused,
      blocker: protectedSupplierCase ? "Protected Supplier Master API boundary requires compatibility control" : work.blocker,
      next: protectedSupplierCase ? "Review Compatibility Control before the case decision" : work.next,
      programConstraint: impact || null
    };
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
  function resetProgram() {
    const fresh = freshProgramState();
    state.programConstraintsById = fresh.programConstraintsById;
    state.programDecisionsById = fresh.programDecisionsById;
    state.caseImpactByConstraintId = fresh.caseImpactByConstraintId;
    state.propagationStateByConstraintId = fresh.propagationStateByConstraintId;
    state.programWorkObjectsById = fresh.programWorkObjectsById;
    state.sequencingRevisionCount = 0;
  }
  function resetAll() { Object.keys(cases).forEach((caseId) => { state.casesById[caseId] = freshState(); }); state.activeCaseId = "DR-CIC-001"; resetProgram(); }

  function programConstraint() {
    return { ...programConstraintDefinition, ...state.programConstraintsById[PROGRAM_CONSTRAINT_ID] };
  }

  function programDecision() { return state.programDecisionsById[PROGRAM_CONSTRAINT_ID] || null; }

  function decideProgramConstraint(option) {
    const supported = { approve: "Approve Protected Interface Boundary", evidence: "Request More Evidence", reject: "Reject Program Constraint" };
    if (!supported[option]) return null;
    const existingPropagation = state.propagationStateByConstraintId[PROGRAM_CONSTRAINT_ID];
    if (existingPropagation.status === "Complete") return programDecision();
    const approvalStatus = option === "approve" ? "Approved" : option === "evidence" ? "Evidence Requested" : "Rejected";
    const record = {
      id: "PD-SMA-001", programId: "MP-CI-01", constraintId: PROGRAM_CONSTRAINT_ID,
      approver: "Mission Commander", selectedOption: supported[option],
      rationale: option === "approve" ? "Protect active consumers while allowing case-specific modernization work to proceed." : option === "evidence" ? "Confirm consumer ownership and reference-data assumptions before changing the shared boundary." : "The proposed six-month boundary is not authorized.",
      evidence: programConstraintDefinition.evidence.slice(), sequenceMarker: "PROGRAM DECISION / SEQUENCE 01",
      affectedCases: programConstraintDefinition.affectedCases.slice(), downstreamPropagationStatus: option === "approve" ? "Ready" : "Not authorized"
    };
    state.programDecisionsById[PROGRAM_CONSTRAINT_ID] = record;
    state.programConstraintsById[PROGRAM_CONSTRAINT_ID].approvalStatus = approvalStatus;
    state.propagationStateByConstraintId[PROGRAM_CONSTRAINT_ID] = { status: option === "approve" ? "Ready" : "Not authorized", completedCases: [], sequence: 0 };
    state.programWorkObjectsById["PWO-CONSTRAINT-001"] = "Complete";
    state.programWorkObjectsById["PWO-IMPACT-001"] = "Complete";
    state.programWorkObjectsById["PWO-DECISION-001"] = approvalStatus;
    return record;
  }

  function propagateProgramConstraint() {
    const propagation = state.propagationStateByConstraintId[PROGRAM_CONSTRAINT_ID];
    if (programConstraint().approvalStatus !== "Approved" || propagation.status === "Complete") return propagation;
    state.caseImpactByConstraintId[PROGRAM_CONSTRAINT_ID] = {
      "DR-SQP-002": { ...caseImpactDefinitions["DR-SQP-002"], status: "Propagated", obligation: "Protected interface compatibility control" },
      "DR-CIC-001": { ...caseImpactDefinitions["DR-CIC-001"], status: "Annotated", obligation: "Minimum reference-data governance note" }
    };
    propagation.status = "Complete";
    propagation.completedCases = ["DR-SQP-002", "DR-CIC-001"];
    propagation.sequence = 1;
    state.sequencingRevisionCount = 1;
    ["PWO-COMPAT-002", "PWO-IMPACT-CIC-001", "PWO-SEQUENCE-001"].forEach((id) => { state.programWorkObjectsById[id] = "Complete"; });
    state.programDecisionsById[PROGRAM_CONSTRAINT_ID].downstreamPropagationStatus = "Complete";
    return propagation;
  }

  function caseImpact(caseId) { return state.caseImpactByConstraintId[PROGRAM_CONSTRAINT_ID]?.[caseId] || caseImpactDefinitions[caseId] || null; }

  function programWorkObjects() {
    return programWorkObjectDefinitions.map((item) => ({
      ...item, programId: "MP-CI-01", status: state.programWorkObjectsById[item.id] || (item.id === "PWO-CONSTRAINT-001" || item.id === "PWO-IMPACT-001" ? "Ready" : "Locked"),
      sourceDecision: item.id === "PWO-CONSTRAINT-001" || item.id === "PWO-IMPACT-001" ? "Proposed program constraint" : programDecision()?.id || "Awaiting program decision",
      affectedDependency: "Supplier Master API", lifecycle: state.programWorkObjectsById[item.id] ? "Updated / Sequence 01" : "Created / Sequence 00",
      lineage: ["BI-CX-2026-01", "PF-APEX-TECH-01", "MP-CI-01", PROGRAM_CONSTRAINT_ID].concat(item.caseId || []).join(" → ")
    }));
  }

  function workObjectsForCase(caseId = state.activeCaseId) {
    const snapshot = caseSnapshot(caseId);
    const constraintImpact = state.caseImpactByConstraintId[PROGRAM_CONSTRAINT_ID]?.[caseId];
    return workObjectTemplates.map((item) => ({
      ...item,
      caseId,
      owner: WORKFLOW[item.stageIndex].owner,
      evidence: constraintImpact && caseId === "DR-SQP-002" && ["architecture", "decision"].includes(item.id) ? `${WORKFLOW[item.stageIndex].evidence} · ${PROGRAM_CONSTRAINT_ID} Protected Interface Boundary` : WORKFLOW[item.stageIndex].evidence,
      dependencies: cases[caseId].dependencies.slice(),
      lifecycle: item.stageIndex < snapshot.stageIndex ? "complete" : item.stageIndex === snapshot.stageIndex ? (snapshot.paused ? "paused" : snapshot.status) : "locked",
      next: constraintImpact && caseId === "DR-SQP-002" && item.id === "architecture" ? "Preserve API compatibility and attach the Compatibility Control" : constraintImpact && caseId === "DR-SQP-002" && item.id === "decision" ? "Review the program constraint before the Mission Commander case decision" : WORKFLOW[item.stageIndex].next,
      programConstraintId: constraintImpact ? PROGRAM_CONSTRAINT_ID : null
    }));
  }

  function programSummary() {
    const snapshots = Object.keys(cases).map(caseSnapshot);
    const constraint = programConstraint();
    const propagated = state.propagationStateByConstraintId[PROGRAM_CONSTRAINT_ID].status === "Complete";
    return {
      id: "MP-CI-01", name: "Customer Intelligence Modernization Program", caseCount: 2,
      types: ["Data-platform-led", "Application-led"], owner: "Transformation Office",
      status: snapshots.every((item) => item.stage === "Decision Pending") ? "Decision coordination" : "Active",
      blocker: constraint.approvalStatus === "Approved" && propagated ? "Supplier Quality compatibility control remains case-level work" : constraint.approvalStatus === "Evidence Requested" ? "Additional shared-dependency evidence requested" : constraint.approvalStatus === "Rejected" ? "Program constraint rejected; no propagation authorized" : "Protected interface boundary requires Mission Commander approval",
      readiness: propagated ? "Customer Intelligence preserved; Supplier Quality carries a protected interface obligation" : "One execution-ready case with conditions; one assessment-ready application case",
      sharedDependencies: sharedDependencies.map((item) => ({ ...item, status: propagated ? "Protected Boundary" : item.status })),
      sequence: propagated ? ["DR-CIC-001 · Execution Ready with Conditions / unchanged", "DR-SQP-002 · Compatibility Control Required"] : ["DR-CIC-001 · Execution Ready with Conditions", "DR-SQP-002 · Decision Pending"],
      rationale: propagated ? "Customer Intelligence remains first because its completed evidence, artifacts, validation, and approval remain valid. Supplier Quality follows with a protected interface compatibility control." : "Customer Intelligence proceeds first because its evidence and validated package are more mature; Supplier Quality follows after its application reviews and shared API ownership are governed.",
      constraint, decision: programDecision(), propagation: state.propagationStateByConstraintId[PROGRAM_CONSTRAINT_ID], affectedCaseCount: propagated ? 2 : 0
    };
  }

  function validateModel() {
    return Object.keys(cases).length === 2
      && new Set(sharedDependencies.map((item) => item.id)).size === sharedDependencies.length
      && Object.keys(state.casesById).every((caseId) => workObjectsForCase(caseId).every((item) => item.caseId === caseId))
      && programConstraintDefinition.affectedCases.length === 2
      && new Set(programWorkObjectDefinitions.map((item) => item.id)).size === programWorkObjectDefinitions.length
      && WORKFLOW.length === 5;
  }

  return Object.freeze({ WORKFLOW, cases, sharedDependencies, PROGRAM_CONSTRAINT_ID, state, selectCase, caseSnapshot, advanceCase, pauseCase, resumeCase, resetCase, resetProgram, resetAll, workObjectsForCase, programConstraint, programDecision, decideProgramConstraint, propagateProgramConstraint, caseImpact, programWorkObjects, programSummary, validateModel });
}));

"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const program = require("../program-intelligence.js");

assert.equal(program.validateModel(), true, "program model is internally valid");
assert.deepEqual(Object.keys(program.cases), ["DR-CIC-001", "DR-SQP-002"], "program contains the two governed cases");
assert.equal(program.sharedDependencies.filter((item) => item.name === "Supplier Master API").length, 1, "shared dependency is represented once");
assert.deepEqual(program.sharedDependencies[0].indirectCases, ["DR-CIC-001"], "shared dependency records the limited Customer Intelligence relationship once");
assert.deepEqual(program.programSummary().sequence, ["DR-CIC-001 · Execution Ready with Conditions", "DR-SQP-002 · Decision Pending"], "program sequence is explicit and evidence-led");
assert.deepEqual(program.programConstraint().affectedCases, ["DR-SQP-002", "DR-CIC-001"], "one program constraint references both cases");
assert.equal(program.caseImpact("DR-SQP-002").impactType, "Direct", "Supplier Quality has direct shared-dependency impact");
assert.equal(program.caseImpact("DR-CIC-001").impactType, "Indirect / limited", "Customer Intelligence has limited indirect impact");
assert.notDeepEqual(program.caseImpact("DR-SQP-002").proposedChanges, program.caseImpact("DR-CIC-001").proposedChanges, "direct and indirect consequences differ");
assert.equal(program.programConstraint().approvalStatus, "Pending Mission Commander", "constraint is not silently approved");
assert.equal(program.propagateProgramConstraint().status, "Not approved", "constraint cannot propagate before approval");

program.resetAll();
program.selectCase("DR-SQP-002");
assert.equal(program.caseSnapshot().stage, "Assessment Ready", "Supplier Quality begins Assessment Ready");
assert.equal(program.caseSnapshot().owner, "Chief Enterprise Architect", "Supplier Quality has the required initial owner");
assert.equal(program.caseSnapshot().next, "Start Architecture Review", "Supplier Quality has the required initial next action");
assert.deepEqual(program.cases["DR-SQP-002"].dependencies, ["Supplier Master API", "Supplier Quality Database", "Identity and Access Service"], "application dependencies are explicit");

const cicBefore = program.caseSnapshot("DR-CIC-001");
program.advanceCase();
assert.equal(program.caseSnapshot().stage, "Architecture Review", "Supplier Quality advances through the shared workflow");
assert.deepEqual(program.caseSnapshot("DR-CIC-001"), cicBefore, "progressing Supplier Quality does not mutate Customer Intelligence");
program.pauseCase();
assert.equal(program.advanceCase().stage, "Architecture Review", "paused case does not advance");
program.resumeCase();
assert.equal(program.advanceCase().stage, "Business Review", "resume continues from the exact stored stage");
program.advanceCase();
program.advanceCase();
assert.equal(program.caseSnapshot().stage, "Decision Pending", "Supplier Quality stops at Decision Pending");
assert.equal(program.caseSnapshot().blocker, "Waiting for Mission Commander", "Decision Pending records the Mission Commander wait");

const objects = program.workObjectsForCase("DR-SQP-002");
assert.deepEqual(objects.map((item) => item.title), ["Evidence Package", "Architecture Review", "Business Review", "Risk Review", "Decision Record (placeholder)"], "required case work objects are unique and ordered");
assert.equal(new Set(objects.map((item) => `${item.caseId}:${item.id}`)).size, objects.length, "work objects do not duplicate");
assert.ok(objects.every((item) => item.caseId === "DR-SQP-002" && item.owner && item.evidence && item.dependencies && item.lifecycle && item.next), "every work object exposes traceable fields");

program.resetCase("DR-SQP-002");
assert.equal(program.caseSnapshot("DR-SQP-002").stage, "Assessment Ready", "current-case reset affects the selected case");
assert.deepEqual(program.caseSnapshot("DR-CIC-001"), cicBefore, "current-case reset preserves the other case");
program.selectCase("DR-CIC-001");
assert.equal(program.caseSnapshot().id, "DR-CIC-001", "case switching restores the selected record without replay");
program.resetAll();
assert.equal(program.state.activeCaseId, "DR-CIC-001", "full reset returns program focus to the guided case");
assert.ok(Object.keys(program.cases).every((id) => program.caseSnapshot(id).stage === "Assessment Ready"), "full reset clears both program-case states");

const casesBeforeEvidenceRequest = JSON.stringify(program.state.casesById);
const evidenceDecision = program.decideProgramConstraint("evidence");
assert.equal(evidenceDecision.selectedOption, "Request More Evidence", "evidence request is recorded as a governed choice");
assert.equal(JSON.stringify(program.state.casesById), casesBeforeEvidenceRequest, "requesting evidence preserves both case states");
assert.equal(program.programSummary().propagation.status, "Not authorized", "evidence request cannot propagate");

program.resetProgram();
const casesBeforeReject = JSON.stringify(program.state.casesById);
program.decideProgramConstraint("reject");
assert.equal(program.programConstraint().approvalStatus, "Rejected", "rejection is explicit");
assert.equal(program.propagateProgramConstraint().status, "Not authorized", "rejected constraint remains unpropagated");
assert.equal(JSON.stringify(program.state.casesById), casesBeforeReject, "rejection preserves case workflow state");

program.resetProgram();
const cicWorkflowBeforeApproval = JSON.stringify(program.state.casesById["DR-CIC-001"]);
const approvedDecision = program.decideProgramConstraint("approve");
assert.equal(approvedDecision.id, "PD-SMA-001", "approval creates a stable decision ID");
assert.equal(approvedDecision.approver, "Mission Commander", "approval preserves human accountability");
assert.equal(approvedDecision.sequenceMarker, "PROGRAM DECISION / SEQUENCE 01", "approval records deterministic lineage sequence");
assert.equal(approvedDecision.downstreamPropagationStatus, "Ready", "approval does not silently propagate");
assert.equal(program.caseImpact("DR-SQP-002").status, undefined, "direct case remains unchanged before explicit propagation");

const firstPropagation = program.propagateProgramConstraint();
assert.equal(firstPropagation.status, "Complete", "approved constraint propagates selectively");
assert.deepEqual(firstPropagation.completedCases, ["DR-SQP-002", "DR-CIC-001"], "propagation records both assessed cases");
assert.equal(program.caseSnapshot("DR-SQP-002").blocker, "Protected Supplier Master API boundary requires compatibility control", "Supplier Quality receives the compatibility blocker");
assert.equal(program.caseImpact("DR-SQP-002").obligation, "Protected interface compatibility control", "Supplier Quality receives the direct obligation");
assert.equal(program.caseImpact("DR-CIC-001").obligation, "Minimum reference-data governance note", "Customer Intelligence receives only a minimum annotation");
assert.match(program.workObjectsForCase("DR-SQP-002").find((item) => item.id === "architecture").evidence, /PC-SMA-001 Protected Interface Boundary/, "Supplier Quality architecture review exposes the approved compatibility constraint");
assert.match(program.workObjectsForCase("DR-SQP-002").find((item) => item.id === "decision").next, /program constraint/, "Supplier Quality Decision Record exposes the program constraint before case approval");
assert.equal(JSON.stringify(program.state.casesById["DR-CIC-001"]), cicWorkflowBeforeApproval, "Customer Intelligence completed workflow state remains unchanged");
assert.equal(program.state.sequencingRevisionCount, 1, "program sequence updates once");
program.propagateProgramConstraint();
assert.equal(program.state.sequencingRevisionCount, 1, "reopening propagation cannot duplicate the sequence update");

const programObjects = program.programWorkObjects();
assert.deepEqual(programObjects.map((item) => item.title), ["Program Constraint", "Cross-Case Impact Assessment", "Program Decision Record", "Compatibility Control", "Case Impact Record", "Program Sequencing Update"], "required provider-neutral program work objects exist");
assert.equal(new Set(programObjects.map((item) => item.id)).size, programObjects.length, "program work objects are not duplicated");
assert.ok(programObjects.every((item) => item.id && item.programId && item.owner && item.status && item.evidence && item.sourceDecision && item.affectedDependency && item.lifecycle && item.nextAction && item.lineage), "every program work object exposes lifecycle and lineage fields");
assert.equal(programObjects.find((item) => item.id === "PWO-COMPAT-002").caseId, "DR-SQP-002", "compatibility control attaches only to Supplier Quality");

program.selectCase("DR-SQP-002");
program.resetCase();
assert.equal(program.programDecision().downstreamPropagationStatus, "Complete", "current-case reset preserves the program decision");
program.advanceCase();
const sqpStageBeforeProgramReset = program.caseSnapshot().stage;
program.resetProgram();
assert.equal(program.caseSnapshot().stage, sqpStageBeforeProgramReset, "program reset preserves unrelated case workflow state");
assert.equal(program.programDecision(), null, "program reset clears the program decision");
assert.equal(program.caseImpact("DR-SQP-002").status, undefined, "program reset clears propagated case impacts");
program.resetAll();
assert.equal(program.programConstraint().approvalStatus, "Pending Mission Commander", "full reset clears program governance state");

const html = fs.readFileSync(require.resolve("../index.html"), "utf8");
assert.equal((html.match(/data-program-intelligence(?=[\s>])/g) || []).length, 2, "Mission Control and HQ share the program rendering");
assert.match(html, /program-intelligence\.js/, "program domain model loads before the UI controller");
const htmlIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(htmlIds).size, htmlIds.length, "HTML contains no duplicate IDs");
assert.match(html, /PROGRAM INTELLIGENCE \/ V1\.3/, "shell exposes the V1.3 governed program surface");
console.log("Multi-case Program Intelligence tests passed");

"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const program = require("../program-intelligence.js");

assert.equal(program.validateModel(), true, "program model is internally valid");
assert.deepEqual(Object.keys(program.cases), ["DR-CIC-001", "DR-SQP-002"], "program contains the two governed cases");
assert.equal(program.sharedDependencies.filter((item) => item.name === "Supplier Master API").length, 1, "shared dependency is represented once");
assert.deepEqual(program.programSummary().sequence, ["DR-CIC-001 · Execution Ready with Conditions", "DR-SQP-002 · Decision Pending"], "program sequence is explicit and evidence-led");

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

const html = fs.readFileSync(require.resolve("../index.html"), "utf8");
assert.equal((html.match(/data-program-intelligence(?=[\s>])/g) || []).length, 2, "Mission Control and HQ share the program rendering");
assert.match(html, /program-intelligence\.js/, "program domain model loads before the UI controller");
console.log("Multi-case Program Intelligence tests passed");

(function initializeEnterpriseContext(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.EnterpriseContext = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function createEnterpriseContext() {
  "use strict";

  const levels = Object.freeze([
    Object.freeze({
      id: "initiative",
      type: "Business Initiative",
      reference: "BI-CX-2026-01",
      name: "Connected Customer Growth",
      owner: "Chief Customer Officer",
      purpose: "Improve renewal insight and service responsiveness across aerospace customer programs.",
      outcome: "Faster service decisions and trusted customer intelligence.",
      relationship: "Sponsors the enterprise portfolio outcome and funds the modernization program.",
      nextResponsibility: "Confirm that Wave 1 remains aligned to the customer-growth outcome."
    }),
    Object.freeze({
      id: "portfolio",
      type: "Enterprise Portfolio",
      reference: "PF-APEX-TECH-01",
      name: "Apex Enterprise Technology Portfolio",
      owner: "Enterprise Architecture Office",
      purpose: "Govern ten synthetic applications and data platforms as one evidence-linked estate.",
      outcome: "A defensible portfolio priority backed by ownership, lifecycle, cost, and dependency evidence.",
      relationship: "Contains the assets assessed for the Connected Customer Growth initiative.",
      nextResponsibility: "Maintain evidence quality and surface cross-portfolio dependencies."
    }),
    Object.freeze({
      id: "program",
      type: "Modernization Program",
      reference: "MP-CI-01",
      name: "Customer Intelligence Modernization Program",
      owner: "Transformation Office",
      purpose: "Coordinate governed modernization of customer intelligence without disrupting finance reporting.",
      outcome: "A sequenced, validated modernization roadmap with accountable delivery boundaries.",
      relationship: "Owns DR-CIC-001 and translates the portfolio priority into governed work.",
      nextResponsibility: "Coordinate the active case and preserve shared constraints across future cases."
    }),
    Object.freeze({
      id: "case",
      type: "Modernization Case",
      reference: "DR-CIC-001",
      name: "Customer Intelligence Capability",
      owner: "Dynamic workflow owner",
      purpose: "Modernize the customer-intelligence capability through one traceable decision record.",
      outcome: "An implementation-ready, independently validated Oracle-to-BigQuery starter package.",
      relationship: "The active governed work object within MP-CI-01.",
      nextResponsibility: "Follow the current workflow owner, blocker, and next action."
    })
  ]);

  function getLevel(id) {
    return levels.find((level) => level.id === id) || null;
  }

  function lineageForCase(reference) {
    if (reference !== "DR-CIC-001") return [];
    return levels.map((level) => level.reference);
  }

  function validateHierarchy() {
    const required = ["initiative", "portfolio", "program", "case"];
    const ids = levels.map((level) => level.id);
    return required.every((id, index) => ids[index] === id)
      && new Set(levels.map((level) => level.reference)).size === levels.length
      && levels.every((level) => [level.name, level.owner, level.purpose, level.outcome, level.relationship, level.nextResponsibility].every(Boolean));
  }

  return Object.freeze({ levels, getLevel, lineageForCase, validateHierarchy });
}));

"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dna = require("../enterprise-dna.js");
const portfolioLab = require("../portfolio-lab.js");
const sampleEnterprise = require("../samples/enterprise/sample-enterprise.js");
const explorerApi = require("../enterprise-dna-explorer-model.js");

const prototypeRoot = path.resolve(__dirname, "..");
const before = JSON.stringify({ objects: dna.objects, relationships: dna.relationships, state: dna.state });
const model = explorerApi.create(dna, {
  portfolioEngine: portfolioLab,
  sampleApi: sampleEnterprise
});

assert.deepEqual(model.summary, {
  objects: 39,
  relationships: 76,
  capabilities: 5,
  technology: 12,
  risks: 3,
  evidenceReferences: 9
}, "the Explorer summary is derived from the validated Enterprise DNA model");
assert.equal(model.MODES.length, 5, "all five approved Explorer perspectives are available");
assert.deepEqual(model.MODES.map((mode) => mode.label), [
  "Capability Explorer",
  "Dependency Explorer",
  "Technology Explorer",
  "Application Explorer",
  "Modernization Explorer"
], "perspective labels match the Sprint 3 scope");

model.MODES.forEach((mode) => {
  const graph = model.graph(mode.id, mode.defaultId, 2, "", { kind: "all", status: "all" });
  assert.ok(graph.focus, `${mode.label} has an explicit default focus`);
  assert.ok(graph.nodes.some((node) => node.id === graph.focus.id), `${mode.label} keeps its focus visible`);
  assert.ok(graph.nodes.length <= 36, `${mode.label} bounds graph density`);
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  assert.ok(graph.relationships.every((edge) => nodeIds.has(edge.sourceId) && nodeIds.has(edge.targetId)), `${mode.label} has no dangling visible edges`);
});

const strategyPath = model.shortestPath("STR-CX-2026-01", "DP-CUSTOMER-INTELLIGENCE");
assert.equal(strategyPath[0].kind, "Business Strategy", "capability tracing begins with business strategy");
assert.equal(strategyPath.at(-1).kind, "Digital Product", "capability tracing reaches the digital product");

const financeImpact = model.dependencyImpact("PLATFORM-FINANCE-WAREHOUSE");
assert.ok(financeImpact.dependents.some((item) => item.name === "Customer Intelligence"), "dependency impact identifies the governed downstream product");
assert.ok(financeImpact.risks.some((item) => item.name.includes("ownership conflict")), "dependency impact exposes the recorded risk");

const applicationMatches = model.search("application", "customer service", { kind: "all", status: "all" });
assert.ok(applicationMatches.some((item) => item.id === "APP-CUSTOMER-SERVICE"), "application search finds a named application");
assert.ok(model.search("technology", "", { kind: "API", status: "all" }).every((item) => item.kind === "API"), "object-type filtering is exact");

const financeDetail = model.detail("PLATFORM-FINANCE-WAREHOUSE");
["why", "how", "depends", "breaks", "next"].forEach((question) => {
  assert.ok(financeDetail.answers[question], `${question} has an Enterprise Intelligence answer`);
});
assert.match(financeDetail.answers.breaks, /within three governed hops|not proof of zero impact/i, "breakage language communicates the bounded evidence limit");

const primary = model.recommendationFor("PLATFORM-CUSTOMER-ANALYTICS").primaryCandidate;
assert.deepEqual(primary, {
  id: "data-01",
  dnaId: "PLATFORM-CUSTOMER-ANALYTICS",
  name: "Customer Analytics Warehouse",
  score: 96
}, "modernization priority reuses deterministic Portfolio Intelligence scoring");
assert.equal(JSON.stringify({ objects: dna.objects, relationships: dna.relationships, state: dna.state }), before, "Explorer queries do not mutate Enterprise DNA or Journey state");

const html = fs.readFileSync(path.join(prototypeRoot, "index.html"), "utf8");
const controller = fs.readFileSync(path.join(prototypeRoot, "enterprise-dna-explorer.js"), "utf8");
const styles = fs.readFileSync(path.join(prototypeRoot, "enterprise-dna-explorer.css"), "utf8");

assert.equal((html.match(/id="open-enterprise-dna-explorer"/g) || []).length, 1, "one persistent Explorer entry is provided");
assert.equal((html.match(/id="enterprise-dna-explorer"/g) || []).length, 1, "one isolated Explorer workspace is provided");
assert.ok(html.indexOf("enterprise-dna.js") < html.indexOf("enterprise-dna-explorer-model.js"), "Explorer model loads after Enterprise DNA");
assert.ok(html.indexOf("enterprise-dna-explorer-model.js") < html.indexOf("enterprise-dna-explorer.js"), "Explorer controller loads after its model");
assert.match(html, /id="dna-explorer-modes" role="tablist"/, "perspectives use an accessible tablist");
assert.match(html, /id="dna-search" type="search"/, "Enterprise DNA has a native search control");
assert.match(html, /id="dna-graph"[^>]*role="group"[^>]*aria-labelledby=/, "the interactive relationship map has an accessible name and description");
assert.match(html, /<details open>[\s\S]*Impact and blast radius/, "impact is visible while secondary details use progressive disclosure");
assert.match(html, /Enterprise DNA is a read-only projection/, "the interaction boundary is explicit");

assert.match(controller, /application-workspace"\)\.setAttribute\("inert", ""\)/, "opening the Explorer isolates the underlying product");
assert.match(controller, /application-workspace"\)\.removeAttribute\("inert"\)/, "closing the Explorer restores the existing product");
assert.match(controller, /skip-link"\)\?\.setAttribute\("href", "#dna-explorer-title"\)/, "the skip link targets visible Explorer content while it is active");
assert.match(controller, /skip-link"\)\?\.setAttribute\("href", state\.previousSkipTarget\)/, "the previous skip-link target is restored");
assert.match(controller, /state\.previousHash/, "return navigation preserves the prior application location");
assert.match(controller, /event\.key === "Escape" && state\.active/, "Escape closes the isolated workspace");
assert.match(controller, /\["ArrowLeft", "ArrowRight", "Home", "End"\]/, "tablists provide keyboard navigation");
assert.doesNotMatch(controller, /setInterval|requestAnimationFrame/, "Explorer does not introduce recurring or decorative animation loops");
assert.doesNotMatch(controller, /state\.(stage|workflow|approval|activeCase)|setGuidedDemo|resetDemo|runDiscovery/, "Explorer does not mutate current workflow ownership");

assert.match(styles, /\.dna-explorer-active \.app-shell \{[\s\S]*display: none/, "the Explorer is visually isolated without restructuring Mission Control");
assert.match(styles, /\.dna-graph-scroll \{[\s\S]*overflow: auto/, "wide graph content remains contained");
assert.match(styles, /@media \(max-width: 820px\)/, "tablet behavior is explicit");
assert.match(styles, /@media \(max-width: 560px\)/, "mobile behavior is explicit");
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/, "reduced motion is explicit");

console.log("Enterprise DNA Explorer tests passed");

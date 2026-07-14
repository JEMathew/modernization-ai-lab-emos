"use strict";

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
  { id: "agent-06", name: "Codex Migration Engineer", code: "CM", role: "Asset conversion", angle: 135, mandate: ["Convert source implementation assets", "Generate target starter artifacts", "Record assumptions and review items"], evidence: "SQL, ETL, mappings, metadata", boundary: "Flags ambiguous conversions" },
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
  "agent-06": { title: "Codex Modernization Engineer", role: "Migration engineering", zone: "Codex Engineering Lab", active: false },
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
    "Protected Boundary": "status-incomplete"
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

function currentCaseSnapshot() {
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

function renderMissionCase() {
  const snapshot = currentCaseSnapshot();
  $("#mission-case-stage").textContent = snapshot.stage.toUpperCase();
  $("#mission-case-owner").textContent = snapshot.owner.toUpperCase();
  $("#mission-case-blocker").textContent = snapshot.blocker.toUpperCase();
  $("#mission-case-next").textContent = snapshot.next.toUpperCase();
  $("#mission-case-dock").classList.toggle("is-blocked", snapshot.blocker !== "None");
}

function renderWorkObjects() {
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
}

function renderWorkQueue() {
  const statuses = ["Incoming", "In Review", "Waiting", "Blocked", "Complete"];
  const activeQueue = state.propagationStatus === "approved" ? "Complete" : state.propagationStatus === "complete" ? "Waiting" : state.propagationStatus === "running" ? "In Review" : state.decisionStatus === "ready-replanning" ? "Incoming" : state.decisionStatus === "waiting-evidence" ? "Waiting" : state.workspaceStatus === "blocked" ? "Blocked" : state.workspaceStatus === "paused" ? "Waiting" : state.workspaceStatus === "running" ? "In Review" : "Incoming";
  $("#workspace-queue").innerHTML = statuses.map((status) => {
    const items = workspaceWorkObjects.filter((_, index) => workObjectStatus(index) === status);
    const caseHere = activeQueue === status;
    return `<div class="queue-lane status-${status.toLowerCase().replaceAll(" ", "-")}${caseHere ? " is-current" : ""}"><span><strong>${status}</strong><small>${items.length}</small></span>${caseHere ? `<div class="queue-case-chip"><i></i><span>Customer Intelligence Capability<small>${currentCaseSnapshot().stage}</small></span></div>` : ""}<div class="queue-items">${items.map((item) => `<small>${item.sequence} / ${item.title}</small>`).join("") || "<small>NO WORK OBJECTS</small>"}</div></div>`;
  }).join("");
}

function renderWorkspaceState() {
  const snapshot = currentCaseSnapshot();
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
  $("#workspace-status-line").textContent = state.propagationStatus === "approved" ? "Engineering Ready · Modernization Engineer owns the next action." : state.propagationStatus === "complete" ? "Revised Plan Ready · waiting for Mission Commander approval." : state.propagationStatus === "running" ? `${snapshot.owner} · ${snapshot.task} because the Human Constraint changed the plan.` : state.decisionStatus === "ready-replanning" ? "Ready for Replanning · Human Constraint attached · Wave Planning owns the next action." : state.decisionStatus === "waiting-evidence" ? "Waiting · Portfolio Intelligence owns four targeted evidence requests." : state.decisionStatus === "unresolved" ? "Decision Unresolved · Human Decision Required." : state.workspaceStatus === "blocked" ? "Decision Pending · Waiting for Mission Commander." : state.workspaceStatus === "paused" ? `Paused after the current transition · ${snapshot.owner} retains ownership.` : state.workspaceStatus === "running" ? `${snapshot.owner} · ${snapshot.task}` : state.assessmentReady ? "Assessment Ready · start the visible specialist workflow." : "Form the capability in Mission Control to activate the workspace.";
  $("#start-workspace").disabled = !state.assessmentReady || state.hqTransition !== "complete" || state.workspaceStatus !== "idle";
  $("#pause-workspace").disabled = state.workspaceStatus !== "running" || state.workspacePauseRequested;
  $("#resume-workspace").disabled = state.workspaceStatus !== "paused";
  $("#workspace-observatory").classList.toggle("is-blocked", decisionBlocked);
  renderWorkObjects();
  renderWorkQueue();
  renderMissionCase();
  renderDecisionRoom();
  renderPropagationWorkspace();
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

function hqAgentMessage(id) {
  const snapshot = currentCaseSnapshot();
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
  const workflow = state.workspaceStage >= 0 ? snapshot.stage : state.portfolioState || "Unverified";
  $("#hq-workflow-stage").textContent = workflow.toUpperCase();
  $("#hq-selected-capability").textContent = state.capabilityState ? "CUSTOMER INTELLIGENCE" : "AWAITING FORMATION";
  const activeCount = ["agent-01", "agent-02", "agent-03", "agent-04", "agent-05", "agent-08"].filter((id) => ["Working", "Investigating", "Reasoning", "Propagating", "Updating"].includes(state.agentStates.get(id))).length;
  $("#hq-active-count").textContent = String(activeCount);
  $("#hq-next-action").textContent = hqNextAction();
  $("#center-active-case").disabled = !state.capabilityState;
  const caseState = state.workspaceStage >= 0 ? snapshot.stage.toUpperCase() : state.hqCaseLocation === "decision-room" ? "IN SHARED DECISION ROOM" : state.assessmentReady ? "ASSESSMENT READY" : state.capabilityState ? state.capabilityState.toUpperCase() : "AWAITING ASSESSMENT";
  $("#hq-case-state").textContent = caseState;
  $("#hq-case-owner").textContent = snapshot.owner.toUpperCase();
  $("#hq-case-task").textContent = snapshot.task.toUpperCase();
  $("#hq-case-blocker").textContent = snapshot.blocker.toUpperCase();
  $("#hq-case-next").textContent = snapshot.next.toUpperCase();
  $("#hq-case-current-evidence").textContent = snapshot.evidence.toUpperCase();
  $("#hq-case-recommendation").textContent = `RECOMMENDATION / ${snapshot.recommendation}`;
  $("#hq-case-file").classList.toggle("is-dormant", !state.capabilityState);
  $$("[data-hq-agent]").forEach((persona) => {
    const id = persona.dataset.hqAgent;
    const specialist = hqSpecialists[id];
    const personaState = specialist.active || (id === "agent-06" && state.propagationStatus === "approved") ? (state.agentStates.get(id) || "Idle") : "Locked";
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
  renderWorkspaceState();
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
  const focused = {
    owner: `<strong>${snapshot.owner}</strong> currently owns <strong>${snapshot.task}</strong>.`,
    blocker: snapshot.blocker === "None" ? "No active blocker is attached to the case." : `<strong>${snapshot.blocker}.</strong> The case is waiting for accountable human action.`,
    next: `<strong>${snapshot.next}.</strong> Completed work will not replay when the view changes.`
  }[focus] || "Select a focused case action to inspect ownership, blockers, or the next handoff.";
  state.selectedHqAgent = null;
  state.selectedWorkObjectId = null;
  $("#hq-context-panel").innerHTML = `<div class="hq-panel-content case-detail"><p class="eyebrow">MODERNIZATION CASE / DR-CIC-001</p><h2>Customer Intelligence Capability</h2><p class="panel-summary">One shared record for three products and the external Finance Warehouse dependency.</p><div class="hq-panel-state"><span><small>CURRENT STAGE</small><strong>${snapshot.stage.toUpperCase()}</strong></span><span><small>CURRENT OWNER</small><strong>${snapshot.owner.toUpperCase()}</strong></span></div><div class="case-detail-actions"><button type="button" data-case-detail="owner">Inspect Current Owner</button><button type="button" data-case-detail="blocker">Show Blocker</button><button type="button" data-case-detail="next">Show Next Action</button></div><div class="hq-agent-response" id="case-detail-response">${focused}</div><div class="case-detail-products"><span>Customer Analytics Warehouse</span><span>Customer Service Portal</span><span>Product Telemetry Platform</span><span class="is-dependency">Finance Warehouse / external dependency</span></div></div>`;
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
  if (!state.assessmentReady || state.hqTransition !== "complete" || state.workspaceStatus !== "idle") return;
  state.workspaceStage = 0;
  state.workspaceStatus = "running";
  state.workspacePauseRequested = false;
  startWorkspaceTransition();
}

function pauseWorkspace() {
  if (state.workspaceStatus !== "running") return;
  state.workspacePauseRequested = true;
  if (!state.workspaceTransition) state.workspaceStatus = "paused";
  renderHqState();
}

function resumeWorkspace() {
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
  const target = state.assessmentReady ? $("#hq-decision-target") : $("#hq-case-file");
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
}

function resetDemo() {
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
}

function init() {
  initializeEntityStates();
  renderProducts();
  renderAgents();
  $$('[data-view]').forEach((control) => control.addEventListener("click", () => navigate(control.dataset.view)));
  $$('[data-view-link]').forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); navigate(link.dataset.viewLink, false); openExperience("mission-control"); }));
  $$('[data-experience-switch]').forEach((button) => button.addEventListener("click", () => openExperience(button.dataset.experienceSwitch)));
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
  $("#continue-engineering").addEventListener("click", () => { $("#engineering-boundary").textContent = "Engineering Workspace is the Version 0.7 boundary; no artifacts were generated."; });
  $("#reset-demo").addEventListener("click", resetDemo);
  $$('[data-hq-agent]').forEach((persona) => persona.addEventListener("click", () => selectHqAgent(persona.dataset.hqAgent)));
  $("#hq-context-panel").addEventListener("click", (event) => {
    const action = event.target.closest("[data-hq-action]");
    if (action) handleHqAction(action.dataset.hqAction);
    const caseDetail = event.target.closest("[data-case-detail]");
    if (caseDetail) handleCaseDetail(caseDetail.dataset.caseDetail);
  });
  $("#workspace-work-objects").addEventListener("click", (event) => {
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
  const initialHash = location.hash.slice(1);
  navigate(["portfolio", "decision", "factory"].includes(initialHash) ? initialHash : "portfolio", false);
  openExperience(initialHash === "hq" ? "hq" : "mission-control", { updateHash: false, startHandoff: false });
}

document.addEventListener("DOMContentLoaded", init);

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
  "agent-05": { title: "Wave Planning Specialist", role: "Future sequencing lead", zone: "Shared Decision Room", active: false, evidence: "Wave evidence is not active in Version 0.4A.", responsibility: "I will sequence approved initiatives when wave planning becomes active.", concern: "No planning concern is evaluated in this version.", perspective: "Planning begins only after the governed decision stage." },
  "agent-06": { title: "Codex Modernization Engineer", role: "Migration engineering", zone: "Codex Engineering Lab", active: false },
  "agent-07": { title: "Validation Specialist", role: "Quality and controls", zone: "Validation Lab", active: false },
  "agent-08": { title: "Executive Advisor", role: "Executive decision support", zone: "Executive Briefing Room", active: false }
};

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
    "Assessment Complete": "status-complete"
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
  if (state.hqCaseLocation === "decision-room") return "INSPECT SPECIALIST PERSPECTIVES";
  if (state.assessmentReady) return "ENTER SHARED DECISION ROOM";
  if (state.portfolioState === "Capability Formed") return "CHOOSE ASSESSMENT BOUNDARY";
  if (state.portfolioState === "Assessment Running") return "FORMING CAPABILITY";
  if (state.portfolioState === "Discovery Complete") return "CONTINUE TO ASSESSMENT";
  if (state.discovery === "running") return "EVIDENCE REVIEW IN PROGRESS";
  return "BEGIN DISCOVERY IN MISSION CONTROL";
}

function hqAgentMessage(id) {
  if (state.hqTransition === "running") {
    if (id === "agent-01") return "Sending the shared evidence package into the room.";
    if (["agent-02", "agent-03", "agent-04"].includes(id)) return "Moving to the Shared Decision Room.";
  }
  if (state.hqCaseLocation === "decision-room" && (assessmentAgentIds.has(id) || id === "agent-04")) return "Collaborating on the shared case file.";
  return {
    "agent-01": "Monitoring the enterprise portfolio.",
    "agent-02": "Reviewing platform boundaries.",
    "agent-03": "Mapping capability outcomes.",
    "agent-04": "Watching evidence exceptions.",
    "agent-05": "Waiting for the planning stage."
  }[id] || "Available in a future stage.";
}

function renderHqState() {
  const workflow = state.portfolioState || "Unverified";
  $("#hq-workflow-stage").textContent = workflow.toUpperCase();
  $("#hq-selected-capability").textContent = state.capabilityState ? "CUSTOMER INTELLIGENCE" : "AWAITING FORMATION";
  const activeCount = ["agent-01", "agent-02", "agent-03", "agent-04"].filter((id) => (state.agentStates.get(id) || "Idle") !== "Idle").length;
  $("#hq-active-count").textContent = String(activeCount);
  $("#hq-next-action").textContent = hqNextAction();
  $("#center-active-case").disabled = !state.assessmentReady;
  const caseState = state.hqCaseLocation === "decision-room" ? "IN SHARED DECISION ROOM" : state.assessmentReady ? "ASSESSMENT READY" : state.capabilityState ? state.capabilityState.toUpperCase() : "AWAITING ASSESSMENT";
  $("#hq-case-state").textContent = caseState;
  $("#hq-case-file").classList.toggle("is-dormant", !state.capabilityState);
  $$("[data-hq-agent]").forEach((persona) => {
    const id = persona.dataset.hqAgent;
    const specialist = hqSpecialists[id];
    const personaState = specialist.active ? (state.agentStates.get(id) || "Idle") : id === "agent-05" ? "Idle" : "Locked";
    $("[data-hq-state]", persona).textContent = personaState.toUpperCase();
    $("[data-hq-message]", persona).textContent = hqAgentMessage(id);
    persona.classList.toggle("is-collaborating", state.hqCaseLocation === "decision-room" && ["agent-02", "agent-03", "agent-04"].includes(id));
  });
  if (state.selectedHqAgent) renderHqAgentPanel(state.selectedHqAgent);
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
  ["agent-01", "agent-02", "agent-03", "agent-04"].forEach((id) => state.agentStates.set(id, "Complete"));
  refreshAgentNodes();
  $("#hq-floor").classList.remove("is-handing-off");
  $("#hq-floor").classList.add("is-handoff-complete", "is-collaboration-ready");
  renderHqState();
}

function renderHqAgentPanel(id) {
  const specialist = hqSpecialists[id];
  if (!specialist) return;
  const agentState = specialist.active ? (state.agentStates.get(id) || "Idle") : id === "agent-05" ? "Idle" : "Locked";
  const actions = specialist.active ? `<div class="hq-action-list"><button type="button" data-hq-action="evidence">Show my evidence</button><button type="button" data-hq-action="responsibility">Explain my responsibility</button><button type="button" data-hq-action="concern">Show current concern</button><button type="button" data-hq-action="compare">Compare my perspective</button><button type="button" data-hq-action="join">Join the Decision Room</button></div><div class="hq-agent-response" id="hq-agent-response">Select a focused action. Responses are concise, mocked, and grounded in the shared case file.</div>` : `<div class="hq-locked-note">This persona is visible for continuity but remains outside the Version 0.4A active scope.</div>`;
  $("#hq-context-panel").innerHTML = `<div class="hq-panel-content"><p class="eyebrow">SPECIALIST CONTEXT</p><div class="hq-panel-title"><span class="persona-figure" aria-hidden="true"><i></i><b></b></span><div><h2>${specialist.title}</h2><p>${specialist.role}</p></div></div><div class="hq-panel-state"><span><small>CURRENT STATE</small><strong>${agentState.toUpperCase()}</strong></span><span><small>HOME WORKSPACE</small><strong>${specialist.zone.toUpperCase()}</strong></span></div><p class="panel-summary">${hqAgentMessage(id)}</p>${actions}</div>`;
}

function selectHqAgent(id) {
  state.selectedHqAgent = id;
  $$("[data-hq-agent]").forEach((persona) => {
    const selected = persona.dataset.hqAgent === id;
    persona.classList.toggle("is-selected", selected);
    persona.setAttribute("aria-pressed", String(selected));
  });
  renderHqAgentPanel(id);
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
  const floor = $("#hq-floor");
  floor.classList.remove("is-handing-off", "is-handoff-complete", "is-collaboration-ready");
  [$("#hq-case-file"), ...$$('[data-hq-agent]')].forEach((element) => {
    element.style.removeProperty("--hq-move-x");
    element.style.removeProperty("--hq-move-y");
    element.classList.remove("is-selected", "is-collaborating");
    if (element.hasAttribute("aria-pressed")) element.setAttribute("aria-pressed", "false");
  });
  $("#hq-context-panel").innerHTML = `<div class="hq-panel-empty"><span class="persona-figure" aria-hidden="true"><i></i><b></b></span><p class="eyebrow">SPECIALIST CONTEXT</p><h2>Select a persona</h2><p>Choose a specialist to inspect its role, current responsibility, evidence, and concern.</p></div>`;
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
  $("#reset-demo").addEventListener("click", resetDemo);
  $$('[data-hq-agent]').forEach((persona) => persona.addEventListener("click", () => selectHqAgent(persona.dataset.hqAgent)));
  $("#hq-context-panel").addEventListener("click", (event) => {
    const action = event.target.closest("[data-hq-action]");
    if (action) handleHqAction(action.dataset.hqAction);
  });
  $(".assessment-agent-field").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "assessment-sequence") completeCapabilityFormation();
  });
  $("#hq-floor").addEventListener("animationend", (event) => {
    if (event.target === event.currentTarget && event.animationName === "hq-sequence") completeHqHandoff();
  });
  const initialHash = location.hash.slice(1);
  navigate(["portfolio", "decision", "factory"].includes(initialHash) ? initialHash : "portfolio", false);
  openExperience(initialHash === "hq" ? "hq" : "mission-control", { updateHash: false, startHandoff: false });
}

document.addEventListener("DOMContentLoaded", init);

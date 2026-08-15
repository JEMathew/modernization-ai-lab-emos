(function initializeEnterpriseDnaExplorer() {
  "use strict";

  const root = document.querySelector("#enterprise-dna-explorer");
  const openButton = document.querySelector("#open-enterprise-dna-explorer");
  if (!root || !openButton || !globalThis.EnterpriseDNAExplorerModel || !globalThis.EnterpriseDNA) return;

  const model = globalThis.EnterpriseDNAExplorerModel.create(globalThis.EnterpriseDNA, {
    portfolioEngine: globalThis.PortfolioLabEngine,
    sampleApi: globalThis.SampleEnterprise
  });
  const state = {
    active: false,
    mode: "capability",
    focusId: model.getMode("capability").defaultId,
    query: "",
    kind: "all",
    status: "all",
    depth: 2,
    question: "why",
    previousHash: "#home",
    previousSkipTarget: "#application-workspace"
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
  const escapeXml = escapeHtml;
  const displayValue = (value) => Array.isArray(value) ? value.join(" · ") : typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);

  function selectedDetail() {
    return model.detail(state.focusId) || model.detail(model.getMode(state.mode).defaultId);
  }

  function renderSummary() {
    const stats = [
      ["DNA Objects", model.summary.objects],
      ["Relationships", model.summary.relationships],
      ["Capabilities", model.summary.capabilities],
      ["Technology Objects", model.summary.technology],
      ["Risk Signals", model.summary.risks],
      ["Evidence Sources", model.summary.evidenceReferences]
    ];
    root.querySelector("#dna-explorer-summary").innerHTML = stats.map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");
  }

  function renderModeNavigation() {
    root.querySelector("#dna-explorer-modes").innerHTML = model.MODES.map((mode) => `
      <button type="button" role="tab" data-dna-mode="${mode.id}" aria-selected="${mode.id === state.mode}" tabindex="${mode.id === state.mode ? "0" : "-1"}">
        <strong>${escapeHtml(mode.label)}</strong><small>${escapeHtml(mode.question)}</small>
      </button>`).join("");
  }

  function renderFilters() {
    const mode = model.getMode(state.mode);
    const kinds = [...new Set(model.search(mode.id).map((item) => item.kind))].sort();
    const kindSelect = root.querySelector("#dna-kind-filter");
    kindSelect.innerHTML = `<option value="all">All object types</option>${kinds.map((kind) => `<option value="${escapeHtml(kind)}">${escapeHtml(kind)}</option>`).join("")}`;
    if (!kinds.includes(state.kind)) state.kind = "all";
    kindSelect.value = state.kind;
    const statuses = [...new Set(model.search(mode.id).map((item) => item.lifecycleStatus))].sort();
    const statusSelect = root.querySelector("#dna-status-filter");
    statusSelect.innerHTML = `<option value="all">All lifecycle states</option>${statuses.map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`).join("")}`;
    if (!statuses.includes(state.status)) state.status = "all";
    statusSelect.value = state.status;
  }

  function graphPositions(nodes) {
    const groups = ["Business", "Products", "Technology", "Ownership & Modernization"];
    const xByGroup = new Map(groups.map((group, index) => [group, 130 + index * 245]));
    const grouped = new Map(groups.map((group) => [group, []]));
    nodes.forEach((node) => {
      const group = model.groupForKind(node.kind);
      if (!grouped.has(group)) grouped.set(group, []);
      grouped.get(group).push(node);
    });
    const positions = new Map();
    grouped.forEach((items, group) => {
      const step = Math.min(86, 530 / Math.max(items.length, 1));
      items.forEach((item, index) => positions.set(item.id, {
        x: xByGroup.get(group) || 900,
        y: 72 + index * step
      }));
    });
    return positions;
  }

  function renderGraph() {
    const graph = model.graph(state.mode, state.focusId, state.depth, state.query, { kind: state.kind, status: state.status });
    if (!graph.nodes.some((item) => item.id === state.focusId)) state.focusId = graph.focus?.id || model.getMode(state.mode).defaultId;
    const positions = graphPositions(graph.nodes);
    const edgeMarkup = graph.relationships.map((relationship) => {
      const source = positions.get(relationship.sourceId);
      const target = positions.get(relationship.targetId);
      if (!source || !target) return "";
      return `<g class="dna-edge"><line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" marker-end="url(#dna-arrow)"></line><title>${escapeXml(relationship.type)} · ${escapeXml(relationship.sourceId)} → ${escapeXml(relationship.targetId)}</title></g>`;
    }).join("");
    const nodeMarkup = graph.nodes.map((node) => {
      const point = positions.get(node.id);
      const selected = node.id === state.focusId;
      const label = node.name.length > 28 ? `${node.name.slice(0, 27)}…` : node.name;
      return `<g class="dna-graph-node${selected ? " is-selected" : ""}" data-dna-node="${escapeXml(node.id)}" role="button" tabindex="0" aria-label="${escapeXml(`${node.kind}: ${node.name}`)}" transform="translate(${point.x - 96} ${point.y - 27})"><rect width="192" height="54" rx="3"></rect><text class="dna-node-kind" x="10" y="17">${escapeXml(node.kind.toUpperCase())}</text><text class="dna-node-name" x="10" y="38">${escapeXml(label)}</text></g>`;
    }).join("");
    root.querySelector("#dna-graph").innerHTML = `<defs><marker id="dna-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z"></path></marker></defs>${edgeMarkup}${nodeMarkup}`;
    root.querySelector("#dna-graph-title").textContent = graph.mode.label;
    root.querySelector("#dna-graph-description").textContent = `${graph.nodes.length} visible objects · ${graph.relationships.length} visible relationships · ${graph.totalMatches} objects match this scope${graph.bounded ? " · view bounded for readability" : ""}.`;
    root.querySelector("#dna-result-count").textContent = `${graph.totalMatches} MATCHES`;

    const results = model.search(state.mode, state.query, { kind: state.kind, status: state.status });
    root.querySelector("#dna-object-results").innerHTML = results.length
      ? results.slice(0, 100).map((item) => `<li><button type="button" data-dna-result="${escapeHtml(item.id)}" aria-pressed="${item.id === state.focusId}"><span><small>${escapeHtml(item.kind)}</small><strong>${escapeHtml(item.name)}</strong></span><em>${escapeHtml(item.lifecycleStatus)}</em></button></li>`).join("")
      : `<li class="dna-no-results"><strong>No Enterprise DNA objects match</strong><span>Clear the search or filters to restore the current scope.</span></li>`;
  }

  function renderAttributes(detail) {
    const attributes = Object.entries(detail.object.attributes);
    root.querySelector("#dna-object-attributes").innerHTML = attributes.length
      ? attributes.map(([label, value]) => `<div><dt>${escapeHtml(label.replace(/([a-z])([A-Z])/g, "$1 $2"))}</dt><dd>${escapeHtml(displayValue(value))}</dd></div>`).join("")
      : `<div><dt>Metadata</dt><dd>No additional attributes recorded.</dd></div>`;
  }

  function renderConnections(detail) {
    root.querySelector("#dna-direct-connections").innerHTML = detail.connections.length
      ? detail.connections.map((item) => `<li><button type="button" data-dna-connection="${escapeHtml(item.object.id)}"><span>${escapeHtml(item.direction === "outgoing" ? "→" : "←")} ${escapeHtml(item.relationship.type)}</span><strong>${escapeHtml(item.object.name)}</strong><small>${escapeHtml(item.object.kind)} · ${Math.round(item.relationship.confidence * 100)}% confidence</small></button></li>`).join("")
      : `<li><span>No direct relationship is recorded.</span></li>`;
  }

  function renderIntelligence(detail) {
    const questions = [
      ["why", "Why?"],
      ["how", "How?"],
      ["depends", "What depends on this?"],
      ["breaks", "What breaks?"],
      ["next", "What should be modernized next?"]
    ];
    root.querySelector("#dna-intelligence-questions").innerHTML = questions.map(([id, label]) => `<button type="button" role="tab" data-dna-question="${id}" aria-selected="${state.question === id}" tabindex="${state.question === id ? "0" : "-1"}">${label}</button>`).join("");
    root.querySelector("#dna-intelligence-answer").innerHTML = `<small>ENTERPRISE INTELLIGENCE / ${escapeHtml(state.question.toUpperCase())}</small><strong>${escapeHtml(questions.find(([id]) => id === state.question)[1])}</strong><p>${escapeHtml(detail.answers[state.question])}</p>`;
    const impact = detail.impact;
    root.querySelector("#dna-impact-summary").innerHTML = [
      ["Depends On", impact.dependsOn.length],
      ["Direct Dependents", impact.dependents.length],
      ["Affected Technology", impact.affectedTechnology.length],
      ["Affected Outcomes", impact.affectedOutcomes.length],
      ["Risk Signals", impact.risks.length]
    ].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");
    root.querySelector("#dna-modernization-ranking").innerHTML = model.rankedCandidates.length
      ? model.rankedCandidates.slice(0, 3).map((candidate, index) => `<li><span><b>${index + 1}</b><strong>${escapeHtml(candidate.record.asset_name)}</strong></span><em>Priority ${candidate.total}</em></li>`).join("")
      : `<li><span>Portfolio ranking is unavailable.</span></li>`;
  }

  function renderDetail() {
    const detail = selectedDetail();
    if (!detail) return;
    state.focusId = detail.object.id;
    root.querySelector("#dna-object-kind").textContent = detail.object.kind.toUpperCase();
    root.querySelector("#dna-object-name").textContent = detail.object.name;
    root.querySelector("#dna-object-description").textContent = detail.object.description;
    root.querySelector("#dna-object-id").textContent = detail.object.id;
    root.querySelector("#dna-object-status").textContent = detail.object.lifecycleStatus;
    root.querySelector("#dna-object-confidence").textContent = `${Math.round(detail.object.confidence * 100)}%`;
    root.querySelector("#dna-object-provenance").textContent = detail.object.provenance;
    root.querySelector("#dna-object-evidence").textContent = detail.object.evidenceReferences.join(" · ") || "No evidence reference";
    renderAttributes(detail);
    renderConnections(detail);
    renderIntelligence(detail);
  }

  function render() {
    renderModeNavigation();
    renderFilters();
    renderGraph();
    renderDetail();
    root.querySelector("#dna-depth").value = String(state.depth);
    root.querySelector("#dna-depth-value").textContent = `${state.depth} HOPS`;
    root.querySelector("#dna-explorer-status").textContent = `${model.getMode(state.mode).label}. Focus: ${selectedDetail()?.object.name}.`;
  }

  function selectObject(id, focus = false) {
    if (!model.detail(id)) return;
    state.focusId = id;
    renderGraph();
    renderDetail();
    if (focus) root.querySelector("#dna-object-name").focus();
  }

  function syncExplorerPresentation() {
    root.hidden = false;
    document.body.classList.add("dna-explorer-active");
    document.querySelector("#application-workspace").setAttribute("inert", "");
    document.querySelector(".skip-link")?.setAttribute("href", "#dna-explorer-title");
    document.querySelectorAll("[data-app-destination]").forEach((item) => item.removeAttribute("aria-current"));
    openButton.setAttribute("aria-current", "page");
    openButton.setAttribute("aria-pressed", "true");
    document.querySelector("#app-breadcrumbs").textContent = "Home / Enterprise DNA Explorer";
  }

  function openExplorer(options = {}) {
    if (state.active) return;
    state.active = true;
    state.previousHash = location.hash && location.hash !== "#enterprise-dna" ? location.hash : "#home";
    state.previousSkipTarget = document.querySelector(".skip-link")?.getAttribute("href") || "#application-workspace";
    syncExplorerPresentation();
    if (options.updateHash !== false) history.pushState(null, "", "#enterprise-dna");
    render();
    root.querySelector("#dna-explorer-title").focus({ preventScroll: true });
  }

  function closeExplorer(options = {}) {
    if (!state.active) return;
    state.active = false;
    root.hidden = true;
    document.body.classList.remove("dna-explorer-active");
    document.querySelector("#application-workspace").removeAttribute("inert");
    document.querySelector(".skip-link")?.setAttribute("href", state.previousSkipTarget);
    openButton.removeAttribute("aria-current");
    openButton.setAttribute("aria-pressed", "false");
    if (options.restoreHash !== false) history.replaceState(null, "", state.previousHash);
    globalThis.syncApplicationNavigation?.();
    if (options.focus !== false) openButton.focus();
  }

  openButton.addEventListener("click", () => openExplorer());
  root.querySelector("#close-dna-explorer").addEventListener("click", () => closeExplorer());
  root.querySelector("#dna-search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderGraph();
  });
  root.querySelector("#dna-kind-filter").addEventListener("change", (event) => {
    state.kind = event.target.value;
    renderGraph();
  });
  root.querySelector("#dna-status-filter").addEventListener("change", (event) => {
    state.status = event.target.value;
    renderGraph();
  });
  root.querySelector("#dna-depth").addEventListener("input", (event) => {
    state.depth = Number(event.target.value);
    root.querySelector("#dna-depth-value").textContent = `${state.depth} HOPS`;
    renderGraph();
  });
  root.querySelector("#dna-explorer-modes").addEventListener("click", (event) => {
    const button = event.target.closest("[data-dna-mode]");
    if (!button) return;
    state.mode = button.dataset.dnaMode;
    state.focusId = model.getMode(state.mode).defaultId;
    state.query = "";
    state.kind = "all";
    state.status = "all";
    root.querySelector("#dna-search").value = "";
    render();
  });
  root.querySelector("#dna-explorer-modes").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...root.querySelectorAll("[data-dna-mode]")];
    const current = tabs.indexOf(event.target.closest("[data-dna-mode]"));
    if (current < 0) return;
    event.preventDefault();
    const target = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (current + 1) % tabs.length : (current - 1 + tabs.length) % tabs.length;
    tabs[target].click();
    root.querySelector(`[data-dna-mode="${state.mode}"]`)?.focus();
  });
  root.querySelector("#dna-object-results").addEventListener("click", (event) => {
    const button = event.target.closest("[data-dna-result]");
    if (button) selectObject(button.dataset.dnaResult, true);
  });
  root.querySelector("#dna-graph").addEventListener("click", (event) => {
    const node = event.target.closest("[data-dna-node]");
    if (node) selectObject(node.dataset.dnaNode, true);
  });
  root.querySelector("#dna-graph").addEventListener("keydown", (event) => {
    const node = event.target.closest("[data-dna-node]");
    if (node && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      selectObject(node.dataset.dnaNode, true);
    }
  });
  root.querySelector("#dna-direct-connections").addEventListener("click", (event) => {
    const button = event.target.closest("[data-dna-connection]");
    if (button) selectObject(button.dataset.dnaConnection, true);
  });
  root.querySelector("#dna-intelligence-questions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-dna-question]");
    if (!button) return;
    state.question = button.dataset.dnaQuestion;
    renderIntelligence(selectedDetail());
    root.querySelector("#dna-intelligence-answer").focus();
  });
  root.querySelector("#dna-intelligence-questions").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = [...root.querySelectorAll("[data-dna-question]")];
    const current = tabs.indexOf(event.target.closest("[data-dna-question]"));
    if (current < 0) return;
    event.preventDefault();
    const target = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (current + 1) % tabs.length : (current - 1 + tabs.length) % tabs.length;
    state.question = tabs[target].dataset.dnaQuestion;
    renderIntelligence(selectedDetail());
    root.querySelector(`[data-dna-question="${state.question}"]`)?.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.active) closeExplorer();
  });
  document.querySelectorAll(".app-navigation button:not(#open-enterprise-dna-explorer), [data-home-link]").forEach((control) => {
    control.addEventListener("click", () => closeExplorer({ restoreHash: false, focus: false }));
  });
  window.addEventListener("hashchange", () => {
    if (location.hash === "#enterprise-dna") openExplorer({ updateHash: false });
    else if (state.active) closeExplorer({ restoreHash: false, focus: false });
  });

  renderSummary();
  render();
  if (location.hash === "#enterprise-dna") openExplorer({ updateHash: false });
  document.addEventListener("DOMContentLoaded", () => {
    if (state.active) syncExplorerPresentation();
  });
  globalThis.EnterpriseDNAExplorer = Object.freeze({ open: openExplorer, close: closeExplorer, model });
}());

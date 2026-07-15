(function initializePortfolioUploadLab() {
  "use strict";

  const engine = globalThis.PortfolioLabEngine;
  const labState = {
    artifact: null,
    mapping: null,
    dependencyLinks: [],
    constraints: null,
    artifactIssues: [],
    validation: null,
    analysisRecords: [],
    scores: [],
    candidate: null,
    assessmentStarted: false
  };

  const samples = {
    retail: [
      ["RET-APP-01", "Store Operations Portal", "application", "Store Operations", "Java / Oracle", "High", "Retail Operations", "aging", "RET-DAT-01", 680000, "poor", "high"],
      ["RET-APP-02", "Digital Commerce Platform", "application", "Digital Commerce", ".NET / SQL Server", "Critical", "Digital Products", "supported", "RET-DAT-02", 940000, "fair", "critical"],
      ["RET-APP-03", "Merchandising Workbench", "application", "Merchandising", "Oracle Forms", "High", "Merchandising", "end of support", "RET-DAT-01", 510000, "critical", "high"],
      ["RET-DAT-01", "Retail Analytics Warehouse", "data_platform", "Customer Insights", "Oracle Exadata", "Critical", "Data Office", "end of support", "", 1450000, "critical", "critical"],
      ["RET-DAT-02", "Commerce Event Platform", "data_platform", "Digital Commerce", "Kafka / Cassandra", "High", "Digital Products", "supported", "", 820000, "good", "high"],
      ["RET-DAT-03", "Supplier Data Lake", "data_platform", "Supply Chain", "Hadoop", "Medium", "Supply Chain Data", "aging", "RET-MISSING", 730000, "poor", "medium"]
    ],
    manufacturing: [
      ["MFG-APP-01", "Plant Maintenance System", "application", "Plant Operations", "IBM Maximo", "Critical", "Manufacturing IT", "aging", "MFG-DAT-01", 1150000, "poor", "critical"],
      ["MFG-APP-02", "Supplier Quality Portal", "application", "Supplier Quality", "Java / Oracle", "High", "Quality Office", "supported", "MFG-DAT-02", 620000, "fair", "high"],
      ["MFG-APP-03", "Dealer Order Management", "application", "Order Management", "Oracle Forms", "High", "Commercial Systems", "end of support", "MFG-DAT-01", 780000, "critical", "high"],
      ["MFG-DAT-01", "Manufacturing Data Mart", "data_platform", "Plant Operations", "Teradata", "Critical", "Data Engineering", "aging", "", 1380000, "poor", "critical"],
      ["MFG-DAT-02", "Supplier Data Lake", "data_platform", "Supplier Quality", "Hadoop", "High", "Supply Chain Data", "aging", "", 910000, "fair", "high"],
      ["MFG-DAT-03", "Product Telemetry Platform", "data_platform", "Connected Products", "Kafka / Cassandra", "High", "Product Engineering", "supported", "", 860000, "good", "strategic"]
    ],
    "financial-services": [
      ["FIN-APP-01", "Customer Servicing Portal", "application", "Customer Service", ".NET / SQL Server", "Critical", "Customer Operations", "aging", "FIN-DAT-01", 920000, "poor", "critical"],
      ["FIN-APP-02", "Credit Decision Workbench", "application", "Credit Risk", "Java / Oracle", "Critical", "Risk Technology", "supported", "FIN-DAT-02", 1080000, "fair", "critical"],
      ["FIN-APP-03", "Regulatory Reporting Hub", "application", "Regulatory Reporting", "Oracle Forms", "Critical", "Finance Technology", "end of support", "FIN-DAT-01", 880000, "critical", "high"],
      ["FIN-DAT-01", "Customer Analytics Warehouse", "data_platform", "Customer Intelligence", "Oracle Exadata", "Critical", "Data Office", "end of support", "", 1620000, "critical", "critical"],
      ["FIN-DAT-02", "Risk Data Mart", "data_platform", "Credit Risk", "Teradata", "Critical", "Risk Data", "aging", "", 1240000, "poor", "critical"],
      ["FIN-DAT-03", "Payment Event Platform", "data_platform", "Payments", "Kafka / Cassandra", "High", "Payments Technology", "supported", "", 970000, "good", "strategic"]
    ]
  };

  function sampleRecords(sector) {
    return samples[sector].map((values, index) => Object.fromEntries([
      ...engine.SCHEMA.map((field, fieldIndex) => [field, values[fieldIndex]]),
      ["__row", index + 1]
    ]));
  }

  function setEntryVisible(visible) {
    document.querySelector("#entry-launchpad").hidden = !visible;
  }

  function setLabVisible(visible) {
    const lab = document.querySelector("#portfolio-upload-lab");
    lab.hidden = !visible;
    document.body.classList.toggle("portfolio-lab-active", visible);
    if (visible) { lab.scrollTop = 0; document.querySelector("#upload-lab-title").focus(); }
  }

  function clearWorkbench() {
    ["mapping-panel", "upload-validation-report", "unit-limit-panel", "analysis-results", "portfolio-assessment"].forEach((id) => { document.querySelector(`#${id}`).hidden = true; });
    document.querySelector("#upload-lab-empty").hidden = false;
    document.querySelector("#unit-selector").hidden = true;
    document.querySelector("#analyze-selected").hidden = true;
  }

  function resetLab() {
    Object.assign(labState, { artifact: null, mapping: null, dependencyLinks: [], constraints: null, artifactIssues: [], validation: null, analysisRecords: [], scores: [], candidate: null, assessmentStarted: false });
    ["portfolio-file", "dependencies-file", "constraints-file"].forEach((id) => { document.querySelector(`#${id}`).value = ""; });
    document.querySelector("#portfolio-file-name").textContent = "Choose portfolio.csv or JSON";
    document.querySelector("#dependencies-file-name").textContent = "Choose dependencies.csv";
    document.querySelector("#constraints-file-name").textContent = "Choose constraints.json";
    document.querySelector("#start-uploaded-journey").disabled = true;
    clearWorkbench();
  }

  function openLab() {
    setEntryVisible(false);
    setLabVisible(true);
  }

  function closeLab(showEntry = false) {
    setLabVisible(false);
    if (showEntry) setEntryVisible(true);
  }

  function showArtifactError(message) {
    labState.artifactIssues = [{ severity: "error", code: "artifact", message }];
    labState.validation = { accepted: [], rejectedCount: 0, issues: labState.artifactIssues, sourceCount: 0 };
    renderValidation();
  }

  async function readTextFile(file) {
    if (file.size > engine.MAX_FILE_BYTES) throw new Error(`${file.name} exceeds the 2 MB Portfolio Intelligence Lab limit.`);
    const text = await file.text();
    if (text.includes("\uFFFD")) throw new Error(`${file.name} is not valid UTF-8.`);
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) throw new Error(`${file.name} contains unsupported binary content.`);
    return text;
  }

  async function readOptionalArtifacts() {
    labState.artifactIssues = [];
    const dependencyFile = document.querySelector("#dependencies-file").files[0];
    if (dependencyFile) {
      document.querySelector("#dependencies-file-name").textContent = dependencyFile.name;
      if (!dependencyFile.name.toLowerCase().endsWith(".csv")) labState.artifactIssues.push({ severity: "error", code: "unsupported-format", message: "Unsupported dependency format. Use dependencies.csv." });
      else {
        try { labState.dependencyLinks = engine.parseDependencyArtifact(await readTextFile(dependencyFile)); }
        catch (error) { labState.artifactIssues.push({ severity: "error", code: "dependencies", message: error.message }); }
      }
    } else labState.dependencyLinks = [];
    const constraintsFile = document.querySelector("#constraints-file").files[0];
    if (constraintsFile) {
      document.querySelector("#constraints-file-name").textContent = constraintsFile.name;
      if (!constraintsFile.name.toLowerCase().endsWith(".json")) labState.artifactIssues.push({ severity: "error", code: "unsupported-format", message: "Unsupported constraints format. Use constraints.json." });
      else {
        try {
          labState.constraints = JSON.parse(await readTextFile(constraintsFile));
          if (!labState.constraints || Array.isArray(labState.constraints) || typeof labState.constraints !== "object") throw new Error("constraints.json must contain a JSON object.");
        } catch (error) { labState.artifactIssues.push({ severity: "error", code: "constraints", message: `Invalid constraints.json: ${error.message}` }); }
      }
    } else labState.constraints = null;
  }

  async function processPortfolioFile() {
    const file = document.querySelector("#portfolio-file").files[0];
    if (!file) { showArtifactError("portfolio.csv or a JSON portfolio is required."); return; }
    document.querySelector("#portfolio-file-name").textContent = file.name;
    try {
      labState.artifact = engine.parsePortfolioArtifact(file.name, await readTextFile(file));
      await readOptionalArtifacts();
      prepareMappingOrValidation();
    } catch (error) { showArtifactError(error.message); }
  }

  function prepareMappingOrValidation() {
    if (!labState.artifact.records.length) {
      labState.mapping = Object.fromEntries(engine.SCHEMA.map((field) => [field, field]));
      validateMappedRecords();
      return;
    }
    const suggested = engine.suggestMapping(labState.artifact.headers);
    labState.mapping = suggested;
    const requiresConfirmation = engine.SCHEMA.some((field) => suggested[field] !== field);
    if (requiresConfirmation) renderMapping();
    else validateMappedRecords();
  }

  function renderMapping() {
    clearWorkbench();
    document.querySelector("#upload-lab-empty").hidden = true;
    const panel = document.querySelector("#mapping-panel");
    panel.hidden = false;
    const fields = document.querySelector("#mapping-fields");
    fields.className = "mapping-fields";
    fields.innerHTML = engine.SCHEMA.map((field) => `<label><span>${escapeHtml(field)}</span><select data-map-field="${field}"><option value="">Select source column</option>${labState.artifact.headers.map((header) => `<option value="${escapeHtml(header)}"${labState.mapping[field] === header ? " selected" : ""}>${escapeHtml(header)}</option>`).join("")}</select></label>`).join("");
  }

  function applyMapping() {
    const mapping = Object.fromEntries([...document.querySelectorAll("[data-map-field]")].map((select) => [select.dataset.mapField, select.value]));
    const missing = engine.SCHEMA.filter((field) => !mapping[field]);
    if (missing.length) { showArtifactError(`Missing column mappings: ${missing.join(", ")}.`); return; }
    labState.mapping = mapping;
    validateMappedRecords();
  }

  function validateMappedRecords() {
    const mapped = engine.applyColumnMapping(labState.artifact.records, labState.mapping);
    const validation = engine.validatePortfolio(mapped, { dependencies: labState.dependencyLinks, emptyRows: labState.artifact.emptyRows });
    const usedHeaders = new Set(Object.values(labState.mapping).filter(Boolean));
    const ignoredHeaders = labState.artifact.headers.filter((header) => !usedHeaders.has(header) && !engine.OPTIONAL_ENGINEERING_FIELDS.includes(String(header).trim().toLowerCase().replace(/[ -]+/g, "_")));
    if (ignoredHeaders.length) validation.issues.push({ severity: "warning", code: "ignored-columns", message: `Ignored columns: ${ignoredHeaders.join(", ")}.` });
    validation.issues = [...labState.artifactIssues, ...validation.issues];
    labState.validation = validation;
    renderValidation();
  }

  function renderValidation() {
    clearWorkbench();
    document.querySelector("#upload-lab-empty").hidden = true;
    document.querySelector("#upload-validation-report").hidden = false;
    const errors = labState.validation.issues.filter((issue) => issue.severity === "error").length;
    const warnings = labState.validation.issues.filter((issue) => issue.severity === "warning").length;
    document.querySelector("#upload-validation-summary").innerHTML = `<span><small>SOURCE RECORDS</small><strong>${labState.validation.sourceCount}</strong></span><span><small>ACCEPTED</small><strong>${labState.validation.accepted.length}</strong></span><span><small>REJECTED</small><strong>${labState.validation.rejectedCount}</strong></span><span><small>ISSUES</small><strong>${errors} ERROR · ${warnings} WARN</strong></span>`;
    document.querySelector("#upload-validation-issues").innerHTML = labState.validation.issues.length
      ? labState.validation.issues.map((issue) => `<div class="validation-issue ${issue.severity === "error" ? "is-error" : ""}"><strong>${issue.severity.toUpperCase()}</strong><span>${issue.row ? `Row ${issue.row}: ` : ""}${escapeHtml(issue.message)}</span></div>`).join("")
      : `<div class="validation-issue"><strong>READY</strong><span>No schema, ID, type, dependency, or empty-row issues found.</span></div>`;
    document.querySelector("#continue-accepted").disabled = !labState.validation.accepted.length;
    document.querySelector("#empty-portfolio-actions").hidden = labState.validation.accepted.length > 0;
  }

  function continueAccepted() {
    if (!labState.validation || !labState.validation.accepted.length) return;
    if (labState.validation.accepted.length > 10) renderUnitLimit();
    else analyzeRecords(labState.validation.accepted);
  }

  function renderUnitLimit() {
    document.querySelector("#unit-limit-panel").hidden = false;
    document.querySelector("#unit-selector").className = "unit-selector";
    document.querySelector("#unit-selector").innerHTML = labState.validation.accepted.map((record, index) => `<label><input type="checkbox" data-unit-index="${index}"><span>${escapeHtml(record.asset_name)}</span><small>${escapeHtml(record.asset_type)}</small></label>`).join("") + `<p class="unit-selection-status" id="unit-selection-status">0 of 10 selected</p>`;
  }

  function showUnitSelector() {
    document.querySelector("#unit-selector").hidden = false;
    document.querySelector("#analyze-selected").hidden = false;
  }

  function updateUnitSelection(event) {
    const target = event.target.closest("[data-unit-index]");
    if (!target) return;
    const selected = [...document.querySelectorAll("[data-unit-index]:checked")];
    if (selected.length > 10) target.checked = false;
    const count = document.querySelectorAll("[data-unit-index]:checked").length;
    document.querySelector("#unit-selection-status").textContent = `${count} of 10 selected`;
  }

  function analyzeSelected() {
    const indexes = [...document.querySelectorAll("[data-unit-index]:checked")].map((input) => Number(input.dataset.unitIndex));
    if (indexes.length !== 10) { document.querySelector("#unit-selection-status").textContent = `${indexes.length} selected · choose exactly 10`; return; }
    const selectedIds = indexes.map((index) => labState.validation.accepted[index].asset_id);
    analyzeRecords(engine.selectModernizationUnits(labState.validation.accepted, "selected", selectedIds));
  }

  function analyzeRecords(records) {
    labState.analysisRecords = records.slice(0, 10);
    labState.scores = engine.scorePortfolio(labState.analysisRecords);
    labState.candidate = engine.qualifiedCandidate(labState.scores);
    labState.assessmentStarted = false;
    renderAnalysis();
  }

  function renderAnalysis() {
    document.querySelector("#analysis-results").hidden = false;
    const candidate = labState.candidate;
    const recommendation = document.querySelector("#candidate-recommendation");
    if (candidate) {
      const strongest = [["technical urgency", candidate.technicalUrgency], ["business value", candidate.businessValue], ["operating cost", candidate.operatingCost], ["dependency readiness", candidate.dependencyReadiness], ["risk reduction", candidate.riskReduction], ["evidence confidence", candidate.evidenceConfidence]].sort((left, right) => right[1] - left[1]).slice(0, 2).map(([label, value]) => `${label} ${value}`).join(" and ");
      recommendation.className = "candidate-recommendation";
      recommendation.innerHTML = `<div><small>PRIMARY MODERNIZATION CANDIDATE · MINIMUM ${engine.MIN_MODERNIZATION_SCORE}</small><strong>${escapeHtml(candidate.record.asset_name)}</strong><span>Recommended because its weighted profile is led by ${strongest}. All values are calculated from validated portfolio metadata.</span></div><div class="candidate-score">${candidate.total}</div>`;
    } else {
      const top = labState.scores[0];
      recommendation.className = "candidate-recommendation no-qualified-candidate";
      recommendation.innerHTML = `<div><small>QUALIFICATION RESULT · MINIMUM ${engine.MIN_MODERNIZATION_SCORE}</small><strong>No Qualified Modernization Candidate</strong><span>The highest score is ${top ? top.total : 0}. Review the primary qualification factors before adding evidence or reassessing the portfolio.</span><ul><li>Low business value</li><li>Low technical urgency</li><li>Insufficient evidence</li><li>Dependency readiness</li></ul></div>`;
    }
    document.querySelector("#score-table").innerHTML = `<div class="score-row is-header"><span>Asset</span><span>Priority</span><span>Tech urgency</span><span>Business value</span><span>Op. cost</span><span>Dependency</span><span>Risk reduction</span><span>Evidence</span></div>${labState.scores.map((score) => `<div class="score-row"><strong>${escapeHtml(score.record.asset_name)}</strong><span class="total-score">${score.total}</span><span>${score.technicalUrgency}</span><span>${score.businessValue}</span><span>${score.operatingCost}</span><span>${score.dependencyReadiness}</span><span>${score.riskReduction}</span><span>${score.evidenceConfidence}</span></div>`).join("")}`;
    const startButton = document.querySelector("#start-uploaded-journey");
    startButton.disabled = !candidate;
    startButton.innerHTML = candidate ? `Start Modernization Journey <svg aria-hidden="true"><use href="#icon-arrow"></use></svg>` : "No Qualified Candidate";
    document.querySelector("#analysis-results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startJourney() {
    if (!labState.candidate) return;
    labState.assessmentStarted = true;
    renderPortfolioAssessment();
  }

  function renderPortfolioAssessment() {
    const candidate = labState.candidate.record;
    const capabilityAssets = labState.analysisRecords.filter((record) => record.business_capability === candidate.business_capability);
    const dependencies = [...new Set(capabilityAssets.flatMap((record) => engine.dependencyIds(record.dependencies)))];
    const evidence = engine.engineeringEvidence(candidate);
    document.querySelector("#assessment-candidate").textContent = candidate.asset_name;
    document.querySelector("#assessment-capability").textContent = candidate.business_capability;
    document.querySelector("#assessment-units").textContent = capabilityAssets.map((record) => record.asset_name).join(" · ") || candidate.asset_name;
    document.querySelector("#assessment-dependencies").textContent = dependencies.length ? dependencies.join(" · ") : "No declared dependencies";
    const gate = document.querySelector("#engineering-metadata-gate");
    gate.className = `engineering-metadata-gate${evidence.complete ? " is-complete" : ""}`;
    gate.innerHTML = evidence.complete
      ? `<small>ENGINEERING EVIDENCE GATE</small><strong>Engineering metadata recorded.</strong><p>Portfolio Intelligence has completed assessment. Arbitrary engineering execution remains outside this experimental lab.</p>`
      : `<small>ENGINEERING EVIDENCE GATE · STOPPED AFTER ASSESSMENT</small><strong>Engineering Journey requires additional engineering metadata.</strong><p>Provide all three evidence types before a governed engineering handoff:</p><ul><li>Representative SQL</li><li>Source Schema</li><li>Target Platform</li></ul>`;
    document.querySelector("#portfolio-assessment").hidden = false;
    document.querySelector("#portfolio-assessment").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetUploadedJourney() {
    document.querySelector("#uploaded-journey-context").hidden = true;
    const caseTitle = document.querySelector("#mission-case-dock .mission-case-identity strong");
    if (caseTitle) caseTitle.textContent = "Customer Intelligence Capability";
  }

  globalThis.resetPortfolioUploadLab = () => { resetLab(); resetUploadedJourney(); };

  function retryUpload() {
    resetLab();
    document.querySelector("#portfolio-file").focus();
  }

  function downloadTemplate() {
    const csv = `${engine.SCHEMA.join(",")}\n`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-template.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function loadSample(sector) {
    resetLab();
    setEntryVisible(false);
    setLabVisible(true);
    const records = sampleRecords(sector);
    labState.artifact = { format: "SAMPLE", headers: [...engine.SCHEMA], records, emptyRows: 0 };
    labState.mapping = Object.fromEntries(engine.SCHEMA.map((field) => [field, field]));
    document.querySelector("#portfolio-file-name").textContent = `${sector.replace(/-/g, " ")} synthetic sample`;
    validateMappedRecords();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  }

  function bindLabEvents() {
    document.querySelector("#entry-guided-demo").addEventListener("click", () => { setEntryVisible(false); setGuidedDemo(true); });
    document.querySelector("#entry-upload").addEventListener("click", openLab);
    document.querySelectorAll("[data-sample-sector]").forEach((button) => button.addEventListener("click", () => loadSample(button.dataset.sampleSector)));
    document.querySelector("#open-portfolio-lab").addEventListener("click", openLab);
    document.querySelector("#close-portfolio-lab").addEventListener("click", () => closeLab(false));
    document.querySelector("#cancel-upload").addEventListener("click", () => closeLab(true));
    document.querySelector("#cancel-validation").addEventListener("click", () => closeLab(true));
    document.querySelector("#reset-upload-lab").addEventListener("click", resetLab);
    document.querySelector("#portfolio-file").addEventListener("change", processPortfolioFile);
    document.querySelector("#dependencies-file").addEventListener("change", () => { if (labState.artifact) processPortfolioFile(); });
    document.querySelector("#constraints-file").addEventListener("change", () => { if (labState.artifact) processPortfolioFile(); });
    document.querySelector("#validate-upload").addEventListener("click", processPortfolioFile);
    document.querySelector("#apply-column-mapping").addEventListener("click", applyMapping);
    document.querySelector("#continue-accepted").addEventListener("click", continueAccepted);
    document.querySelector("#retry-upload").addEventListener("click", retryUpload);
    document.querySelector("#load-empty-sample").addEventListener("click", () => loadSample("manufacturing"));
    document.querySelector("#download-template").addEventListener("click", downloadTemplate);
    document.querySelector("#analyze-first-ten").addEventListener("click", () => analyzeRecords(engine.selectModernizationUnits(labState.validation.accepted, "first")));
    document.querySelector("#select-ten").addEventListener("click", showUnitSelector);
    document.querySelector("#unit-selector").addEventListener("change", updateUnitSelection);
    document.querySelector("#analyze-selected").addEventListener("click", analyzeSelected);
    document.querySelector("#start-uploaded-journey").addEventListener("click", startJourney);
    document.querySelector("#return-to-scores").addEventListener("click", () => document.querySelector("#analysis-results").scrollIntoView({ behavior: "smooth", block: "start" }));
    document.querySelector("#return-upload-lab").addEventListener("click", openLab);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !document.querySelector("#portfolio-upload-lab").hidden) closeLab(false); });
  }

  document.addEventListener("DOMContentLoaded", bindLabEvents);
}());

(function initializeSyntheticSampleExperience() {
  "use strict";

  const sampleApi = globalThis.SampleEnterprise;
  const portfolioEngine = globalThis.PortfolioLabEngine;
  const enterpriseDna = globalThis.EnterpriseDNA;
  const agencyStages = [
    { progress: 18, message: "Portfolio Discovery Specialist is validating ten modernization units…" },
    { progress: 38, message: "Enterprise Architect is connecting strategy to eight business capabilities…" },
    { progress: 58, message: "Enterprise Intelligence is tracing 77 relationships and accountable owners…" },
    { progress: 78, message: "Risk & Governance Specialist is isolating three evidence conditions…" },
    { progress: 94, message: "Executive Advisor is preparing the Mission Commander brief…" }
  ];
  let loadState = "idle";

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));

  const formatCurrency = (value) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 2
  }).format(value);
  const formatCurrencyRange = (range) => `${formatCurrency(range.low)}–${formatCurrency(range.high)}`;
  const formatList = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  function reducedMotion() {
    return Boolean(globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  }

  function waitForStage() {
    if (reducedMotion()) return Promise.resolve();
    return new Promise((resolve) => globalThis.setTimeout(resolve, 5000));
  }

  function setEntryProgress(value, message) {
    const container = document.querySelector("#sample-load-progress");
    const progress = container.querySelector("[role='progressbar']");
    container.hidden = false;
    progress.setAttribute("aria-valuenow", String(value));
    progress.querySelector("i").style.width = `${value}%`;
    document.querySelector("#sample-load-status").textContent = message;
  }

  function setEngagementVisible(visible) {
    document.querySelector("#sample-engagement-experience").hidden = !visible;
    globalThis.syncApplicationNavigation?.();
  }

  function resetAgencyPreparation() {
    const preparation = document.querySelector("#sample-agency-preparation");
    const brief = document.querySelector("#sample-engagement-brief");
    preparation.hidden = false;
    brief.hidden = true;
    const progress = preparation.querySelector("[role='progressbar']");
    progress.setAttribute("aria-valuenow", "0");
    progress.querySelector("i").style.width = "0%";
    document.querySelector("#sample-agency-status").textContent = "Preparing specialist assignments…";
    document.querySelectorAll("[data-sample-agency-step]").forEach((step) => {
      step.classList.remove("is-active", "is-complete");
      step.querySelector("em").textContent = "QUEUED";
    });
  }

  function updateAgencyStage(index) {
    const stage = agencyStages[index];
    const progress = document.querySelector("#sample-agency-preparation [role='progressbar']");
    progress.setAttribute("aria-valuenow", String(stage.progress));
    progress.querySelector("i").style.width = `${stage.progress}%`;
    document.querySelector("#sample-agency-status").textContent = stage.message;
    document.querySelectorAll("[data-sample-agency-step]").forEach((step, stepIndex) => {
      step.classList.toggle("is-complete", stepIndex < index);
      step.classList.toggle("is-active", stepIndex === index);
      step.querySelector("em").textContent = stepIndex < index ? "COMPLETE" : stepIndex === index ? "WORKING" : "QUEUED";
    });
  }

  function completeAgencyPreparation() {
    const progress = document.querySelector("#sample-agency-preparation [role='progressbar']");
    progress.setAttribute("aria-valuenow", "100");
    progress.querySelector("i").style.width = "100%";
    document.querySelector("#sample-agency-status").textContent = "Executive engagement prepared. One governed recommendation is ready.";
    document.querySelectorAll("[data-sample-agency-step]").forEach((step) => {
      step.classList.remove("is-active");
      step.classList.add("is-complete");
      step.querySelector("em").textContent = "COMPLETE";
    });
  }

  function showEngagementBrief() {
    document.querySelector("#sample-agency-preparation").hidden = true;
    document.querySelector("#sample-engagement-brief").hidden = false;
    setEngagementVisible(true);
    document.querySelector("#sample-engagement-title").focus({ preventScroll: true });
  }

  function renderDistribution(target, distribution) {
    target.innerHTML = Object.entries(distribution)
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([label, count]) => `<span><strong>${escapeHtml(label)}</strong><em>${count}</em></span>`).join("");
  }

  function renderDashboard(sample, snapshot) {
    const dashboard = document.querySelector("#sample-portfolio-dashboard");
    const primary = snapshot.topCandidates[0];
    const highValueUnits = sample.portfolio.filter((item) => ["high", "critical", "strategic"].includes(String(item.business_value).toLowerCase())).length;
    const primaryReadiness = sample.modernizationReadiness.find((item) => item.assetId === primary.record.asset_id);
    const outcomes = enterpriseDna.getObjectsByKind("Business Outcome");
    const businessCase = snapshot.businessCase;
    const evidenceBrief = snapshot.evidenceBrief;
    const assurance = snapshot.decisionAssurance;
    document.querySelector("#decision-cost-in-scope").textContent = formatCurrency(snapshot.summary.annualCost);
    document.querySelector("#decision-evidence-health").textContent = `${sample.portfolio.length - 3} of ${sample.portfolio.length} Ready`;
    document.querySelector("#decision-value-health").textContent = `${highValueUnits} of ${sample.portfolio.length} High Value`;
    document.querySelector("#decision-readiness-health").textContent = `${primaryReadiness.score} / 100`;
    document.querySelector("#decision-primary-candidate").innerHTML = `<small>PRIMARY CANDIDATE</small><strong>${escapeHtml(primary.record.asset_name)}</strong><span>Priority score <b>${primary.total}</b><br>${escapeHtml(primaryReadiness.status)}</span>`;
    document.querySelector("#decision-priority-comparison").innerHTML = snapshot.topCandidates.map((candidate, index) => {
      const gap = primary.total - candidate.total;
      return `<li><span><strong>${escapeHtml(candidate.record.asset_name)}</strong><small>Urgency ${candidate.technicalUrgency} · Business value ${candidate.businessValue}</small></span><span><b>${candidate.total}</b>${index ? `<br>${gap} points behind` : "<br>Portfolio lead"}</span></li>`;
    }).join("");
    document.querySelector("#decision-business-outcomes").innerHTML = outcomes.map((outcome) => `<article><strong>${escapeHtml(outcome.name)}</strong><small>${escapeHtml(outcome.attributes.baseline)} → ${escapeHtml(outcome.attributes.target)}</small></article>`).join("");
    document.querySelector("#engagement-investment").textContent = formatCurrencyRange(businessCase.estimatedInvestment);
    document.querySelector("#engagement-benefit").textContent = `${formatCurrencyRange(businessCase.expectedAnnualBenefit)} / year`;
    document.querySelector("#engagement-payback").textContent = `${businessCase.expectedPaybackYears.low}–${businessCase.expectedPaybackYears.high} years`;
    document.querySelector("#engagement-timeline").textContent = businessCase.implementationTimeline;
    document.querySelector("#engagement-economics-boundary").textContent = businessCase.estimateLabel;
    document.querySelector("#investment-estimate-label").textContent = businessCase.estimateLabel.toUpperCase();
    document.querySelector("#investment-candidate").textContent = businessCase.candidateName;
    document.querySelector("#investment-range").textContent = formatCurrencyRange(businessCase.estimatedInvestment);
    document.querySelector("#benefit-range").textContent = `${formatCurrencyRange(businessCase.expectedAnnualBenefit)} / year`;
    document.querySelector("#payback-range").textContent = `${businessCase.expectedPaybackYears.low}–${businessCase.expectedPaybackYears.high} years`;
    document.querySelector("#investment-timeline").textContent = businessCase.implementationTimeline;
    document.querySelector("#investment-business-value").textContent = businessCase.businessValue.toUpperCase();
    document.querySelector("#cost-reduction-range").textContent = `${businessCase.costReductionOpportunity.lowPercent}–${businessCase.costReductionOpportunity.highPercent}% of candidate run cost`;
    document.querySelector("#investment-risk").textContent = `${businessCase.riskLevel} before governed mitigation`;
    document.querySelector("#investment-confidence").textContent = `${businessCase.confidencePercent}% evidence confidence`;
    document.querySelector("#investment-approval").textContent = businessCase.approvalRequirement;
    document.querySelector("#investment-assumptions").innerHTML = formatList(businessCase.assumptions);
    document.querySelector("#investment-dependencies").innerHTML = formatList(businessCase.dependencies);
    document.querySelector("#investment-conditions").innerHTML = formatList(businessCase.decisionConditions);
    document.querySelector("#investment-derivation").innerHTML = Object.entries(businessCase.derivation).map(([key, value]) => `<div><dt>${escapeHtml(key.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase())}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
    document.querySelector("#evidence-recommendation").textContent = evidenceBrief.recommendation;
    document.querySelector("#evidence-why-candidate").textContent = evidenceBrief.whyCandidate;
    document.querySelector("#evidence-why-now").textContent = evidenceBrief.whyNow;
    document.querySelector("#evidence-business-rationale").textContent = evidenceBrief.businessRationale;
    document.querySelector("#evidence-architecture-rationale").textContent = evidenceBrief.architectureRationale;
    document.querySelector("#evidence-risk-rationale").textContent = evidenceBrief.riskRationale;
    document.querySelector("#evidence-confidence").textContent = `${evidenceBrief.confidencePercent}% evidence confidence`;
    document.querySelector("#evidence-confidence-method").textContent = evidenceBrief.confidenceMethod;
    document.querySelector("#recommendation-evidence-list").innerHTML = evidenceBrief.evidence.map((item) => `<li><span>${escapeHtml(item.source)} · ${escapeHtml(item.reference)}</span><strong>${escapeHtml(item.fact)}</strong></li>`).join("");
    document.querySelector("#recommendation-assumptions").innerHTML = formatList(evidenceBrief.assumptions);
    document.querySelector("#recommendation-limitations").innerHTML = formatList(evidenceBrief.limitations);
    document.querySelector("#recommendation-alternatives").innerHTML = evidenceBrief.alternatives.map((item) => `<article><strong>${escapeHtml(item.candidateName)}</strong><span>Priority ${item.priorityScore} · ${item.scoreGap} points behind</span><p>${escapeHtml(item.reasonNotPrimary)}</p></article>`).join("");
    document.querySelector("#recommendation-governance-boundary").textContent = evidenceBrief.governanceBoundary;
    document.querySelector("#assurance-evidence-quality").textContent = assurance.evidenceQuality;
    document.querySelector("#assurance-business-alignment").textContent = assurance.businessAlignment;
    document.querySelector("#assurance-architecture-readiness").textContent = assurance.architectureReadiness;
    document.querySelector("#assurance-risk").textContent = assurance.risk;
    document.querySelector("#assurance-sensitive-data").textContent = assurance.sensitiveDataStatus;
    document.querySelector("#assurance-policy").textContent = assurance.policyStatus;
    document.querySelector("#assurance-approval").textContent = assurance.approvalRequirement;
    document.querySelector("#assurance-production-boundary").textContent = assurance.productionBoundary;
    document.querySelector("#sample-dashboard-description").textContent = `${snapshot.domain} · ${snapshot.packageId} · Enterprise DNA validated`;
    document.querySelector("#sample-summary").innerHTML = [
      ["Units", snapshot.summary.modernizationUnits],
      ["Applications", snapshot.summary.applications],
      ["Data Platforms", snapshot.summary.dataPlatforms],
      ["Capabilities", snapshot.summary.capabilities],
      ["Annual Cost", formatCurrency(snapshot.summary.annualCost)],
      ["DNA Objects", snapshot.enterpriseDna.objects]
    ].map(([label, value]) => `<span><strong>${escapeHtml(value)}</strong><em>${escapeHtml(label)}</em></span>`).join("");
    renderDistribution(document.querySelector("#sample-technology-distribution"), snapshot.technologyDistribution);
    renderDistribution(document.querySelector("#sample-risk-distribution"), snapshot.riskDistribution);
    renderDistribution(document.querySelector("#sample-business-value"), snapshot.businessValueDistribution);
    document.querySelector("#sample-application-inventory").innerHTML = snapshot.applicationInventory
      .map((item) => `<span><strong>${escapeHtml(item.asset_name)}</strong><em>${escapeHtml(item.technology)} · ${escapeHtml(item.business_criticality)}</em></span>`).join("");
    document.querySelector("#sample-top-candidates").innerHTML = snapshot.topCandidates
      .map((candidate, index) => `<span><strong>${index + 1}. ${escapeHtml(candidate.record.asset_name)}</strong><em>Priority ${candidate.total} · Urgency ${candidate.technicalUrgency} · Value ${candidate.businessValue}</em></span>`).join("");
    document.querySelector("#sample-recommended-wave").innerHTML = `<strong>${escapeHtml(snapshot.recommendedWave.name)}</strong><span>${escapeHtml(snapshot.recommendedWave.duration)} · ${escapeHtml(snapshot.recommendedWave.status)}</span><em>${snapshot.recommendedWave.assets.length} governed assets</em>`;
    document.querySelector("#sample-journey-status").innerHTML = `<strong>${escapeHtml(snapshot.journeyStatus)}</strong><span>${sample.journey.length} evidence-backed stages available</span>`;
    document.querySelector("#sample-executive-recommendation").innerHTML = `<strong>${escapeHtml(snapshot.executiveRecommendation)}</strong><span>Deterministic recommendation · ${Math.round(sample.recommendations[0].confidence * 100)}% evidence confidence</span>`;
    document.querySelector("#sample-executive-brief").hidden = false;
    document.querySelector("#sample-portfolio-evidence").hidden = false;
    dashboard.hidden = false;
    if (typeof window.renderMissionDecisionCenter === "function") {
      window.renderMissionDecisionCenter();
    }
  }

  function resetView() {
    loadState = "idle";
    const button = document.querySelector("#load-sample-portfolio");
    if (!button) return;
    button.disabled = false;
    button.innerHTML = `Try Sample Enterprise <svg aria-hidden="true"><use href="#icon-arrow"></use></svg>`;
    button.removeAttribute("aria-busy");
    document.querySelector("#sample-load-progress").hidden = true;
    document.querySelector("#sample-load-status").textContent = "Best for understanding the complete executive experience.";
    document.querySelector("#sample-executive-brief").hidden = true;
    const portfolioEvidence = document.querySelector("#sample-portfolio-evidence");
    portfolioEvidence.hidden = true;
    portfolioEvidence.open = false;
    document.querySelector("#sample-portfolio-dashboard").hidden = true;
    resetAgencyPreparation();
    setEngagementVisible(false);
  }

  async function loadSample() {
    if (loadState === "loading") return;
    const button = document.querySelector("#load-sample-portfolio");
    loadState = "loading";
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = "Preparing Engagement…";
    resetAgencyPreparation();
    setEntryProgress(8, "AI Agency is preparing the Apex Aerospace engagement…");
    setEngagementVisible(true);
    document.querySelector("#sample-agency-title").focus({ preventScroll: true });
    try {
      let validation;
      for (let index = 0; index < agencyStages.length; index += 1) {
        updateAgencyStage(index);
        await waitForStage();
        if (index === 0) {
          validation = sampleApi.validatePackage({ portfolioEngine, enterpriseDna });
          if (!validation.valid) throw new Error(validation.errors.join(" "));
        }
      }
      const snapshot = sampleApi.buildMissionControlSnapshot(portfolioEngine, enterpriseDna);
      globalThis.applySyntheticEnterpriseSample(sampleApi.sample, snapshot);
      renderDashboard(sampleApi.sample, snapshot);
      completeAgencyPreparation();
      loadState = "loaded";
      setEntryProgress(100, "Engagement ready. Review the Executive Engagement Brief.");
      button.textContent = "Engagement Prepared";
      showEngagementBrief();
    } catch (error) {
      loadState = "error";
      setEntryProgress(0, `Engagement could not be prepared: ${error.message}`);
      setEngagementVisible(false);
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.textContent = "Retry Engagement";
      button.focus();
    }
  }

  function enterMissionControl() {
    if (loadState !== "loaded") return;
    setEngagementVisible(false);
    globalThis.syncApplicationNavigation?.();
    document.querySelector("#sample-executive-brief-title").focus({ preventScroll: true });
    document.querySelector("#sample-executive-brief").scrollIntoView({
      behavior: reducedMotion() ? "auto" : "smooth",
      block: "start"
    });
  }

  function resetSample() {
    resetView();
    globalThis.clearSyntheticEnterpriseSample();
  }

  function bind() {
    if (!sampleApi || !portfolioEngine || !enterpriseDna) {
      document.querySelector("#sample-load-status").textContent = "Sample engagement dependencies are unavailable.";
      document.querySelector("#load-sample-portfolio").disabled = true;
      return;
    }
    document.querySelector("#load-sample-portfolio").addEventListener("click", loadSample);
    document.querySelector("#reload-sample-portfolio").addEventListener("click", loadSample);
    document.querySelector("#reset-sample-portfolio").addEventListener("click", resetSample);
    document.querySelector("#enter-sample-engagement").addEventListener("click", enterMissionControl);
    document.querySelector("#cancel-sample-engagement").addEventListener("click", resetSample);
  }

  globalThis.loadSyntheticSamplePortfolio = loadSample;
  globalThis.resetSyntheticSamplePortfolioView = resetView;
  document.addEventListener("DOMContentLoaded", bind);
}());

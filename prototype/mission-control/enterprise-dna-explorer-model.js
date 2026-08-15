(function initializeEnterpriseDnaExplorerModel(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.EnterpriseDNAExplorerModel = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function createEnterpriseDnaExplorerModelApi() {
  "use strict";

  const MODES = Object.freeze([
    Object.freeze({ id: "capability", label: "Capability Explorer", question: "How does strategy become business capability?", kinds: Object.freeze(["Business Strategy", "Business Initiative", "Business Outcome", "Business Capability", "Digital Product"]), defaultId: "STR-CX-2026-01" }),
    Object.freeze({ id: "dependency", label: "Dependency Explorer", question: "What depends on this, and what breaks?", kinds: null, defaultId: "PLATFORM-FINANCE-WAREHOUSE" }),
    Object.freeze({ id: "technology", label: "Technology Explorer", question: "How is the enterprise technology estate connected?", kinds: Object.freeze(["Application", "API", "Data Product", "Data Platform", "Database", "Pipeline", "AI Model", "Infrastructure"]), defaultId: "PLATFORM-CUSTOMER-ANALYTICS" }),
    Object.freeze({ id: "application", label: "Application Explorer", question: "Who owns and operates each application boundary?", kinds: Object.freeze(["Application", "API", "Engineering Team", "Owner", "Risk", "Technical Debt"]), defaultId: "APP-CUSTOMER-SERVICE" }),
    Object.freeze({ id: "modernization", label: "Modernization Explorer", question: "What should be modernized next, and why?", kinds: Object.freeze(["Modernization Case Reference", "Digital Product", "Application", "Data Platform", "Risk", "Technical Debt", "Readiness Assessment", "Business Outcome"]), defaultId: "CASE-DR-CIC-001" })
  ]);

  const DEPENDENCY_TYPES = new Set(["DEPENDS_ON", "CONSUMES", "RUNS_ON", "STORES_IN", "FLOWS_TO", "SUPPORTS"]);
  const IMPACT_TYPES = new Set(["DEPENDS_ON", "CONSUMES", "FLOWS_TO", "SUPPORTS", "PRODUCES_OUTCOME", "THREATENS", "AFFECTS"]);
  const BUSINESS_KINDS = new Set(["Business Strategy", "Business Initiative", "Business Outcome", "Business Capability"]);
  const PRODUCT_KINDS = new Set(["Digital Product", "Application", "API", "Data Product"]);
  const TECHNOLOGY_KINDS = new Set(["Data Platform", "Database", "Pipeline", "AI Model", "Infrastructure"]);
  const CONTROL_KINDS = new Set(["Engineering Team", "Owner", "Risk", "Technical Debt", "Readiness Assessment", "Modernization Case Reference"]);

  function unique(items) {
    return items.filter((item, index, all) => item && all.findIndex((candidate) => candidate.id === item.id) === index);
  }

  function groupForKind(kind) {
    if (BUSINESS_KINDS.has(kind)) return "Business";
    if (PRODUCT_KINDS.has(kind)) return "Products";
    if (TECHNOLOGY_KINDS.has(kind)) return "Technology";
    if (CONTROL_KINDS.has(kind)) return "Ownership & Modernization";
    return "Enterprise";
  }

  function create(dna, options = {}) {
    if (!dna?.validateModel?.().valid) throw new Error("A valid Enterprise DNA model is required.");
    const objects = Object.freeze([...dna.objects]);
    const relationships = Object.freeze([...dna.relationships]);
    const objectById = new Map(objects.map((item) => [item.id, item]));
    const modeById = new Map(MODES.map((item) => [item.id, item]));
    const scorePortfolio = options.portfolioEngine?.scorePortfolio;
    const portfolio = options.sampleApi?.sample?.portfolio || [];
    const rankedCandidates = typeof scorePortfolio === "function" && portfolio.length
      ? Object.freeze(scorePortfolio(portfolio).slice(0, 5))
      : Object.freeze([]);

    function getMode(modeId) {
      return modeById.get(modeId) || MODES[0];
    }

    function directConnections(objectId) {
      return dna.getRelationships(objectId).map((relationship) => {
        const otherId = relationship.sourceId === objectId ? relationship.targetId : relationship.sourceId;
        return Object.freeze({
          relationship,
          direction: relationship.sourceId === objectId ? "outgoing" : "incoming",
          object: objectById.get(otherId)
        });
      }).filter((item) => item.object);
    }

    function shortestPath(startId, targetId, limit = 8) {
      if (!objectById.has(startId) || !objectById.has(targetId)) return Object.freeze([]);
      if (startId === targetId) return Object.freeze([objectById.get(startId)]);
      const queue = [{ id: startId, path: [startId] }];
      const visited = new Set([startId]);
      while (queue.length) {
        const current = queue.shift();
        if (current.path.length > limit) continue;
        for (const connected of directConnections(current.id)) {
          if (visited.has(connected.object.id)) continue;
          const path = current.path.concat(connected.object.id);
          if (connected.object.id === targetId) return Object.freeze(path.map((id) => objectById.get(id)));
          visited.add(connected.object.id);
          queue.push({ id: connected.object.id, path });
        }
      }
      return Object.freeze([]);
    }

    function inMode(object, mode) {
      return !mode.kinds || mode.kinds.includes(object.kind);
    }

    function search(modeId, query = "", filters = {}) {
      const mode = getMode(modeId);
      const normalized = query.trim().toLowerCase();
      const kind = filters.kind || "all";
      const status = filters.status || "all";
      return Object.freeze(objects.filter((item) => {
        if (!inMode(item, mode)) return false;
        if (kind !== "all" && item.kind !== kind) return false;
        if (status !== "all" && item.lifecycleStatus !== status) return false;
        if (!normalized) return true;
        return [item.id, item.kind, item.name, item.description, ...item.tags, ...Object.values(item.attributes).flat()]
          .some((value) => String(value).toLowerCase().includes(normalized));
      }));
    }

    function graph(modeId, focusId, depth = 2, query = "", filters = {}) {
      const mode = getMode(modeId);
      const focus = objectById.get(focusId) || objectById.get(mode.defaultId);
      const matched = search(mode.id, query, filters);
      const matchedIds = new Set(matched.map((item) => item.id));
      const traversed = focus ? dna.traverse(focus.id, { maxDepth: depth, limit: 120 }) : [];
      let nodes = unique([focus, ...traversed.map((item) => item.object)]).filter((item) => inMode(item, mode));
      if (query || filters.kind !== "all" || filters.status !== "all") nodes = nodes.filter((item) => matchedIds.has(item.id) || item.id === focus?.id);
      if (nodes.length < Math.min(matched.length, 18)) nodes = unique(nodes.concat(matched.slice(0, 18)));
      nodes = nodes.slice(0, 36);
      const ids = new Set(nodes.map((item) => item.id));
      return Object.freeze({
        mode,
        focus,
        nodes: Object.freeze(nodes),
        relationships: Object.freeze(relationships.filter((item) => ids.has(item.sourceId) && ids.has(item.targetId))),
        totalMatches: matched.length,
        bounded: matched.length > nodes.length
      });
    }

    function dependencyImpact(objectId) {
      const focus = objectById.get(objectId);
      if (!focus) return null;
      const direct = directConnections(objectId);
      const dependsOn = direct.filter((item) => DEPENDENCY_TYPES.has(item.relationship.type) && item.direction === "outgoing").map((item) => item.object);
      const dependents = direct.filter((item) => DEPENDENCY_TYPES.has(item.relationship.type) && item.direction === "incoming").map((item) => item.object);
      const impact = dna.traverse(objectId, { direction: "both", maxDepth: 3, limit: 100, types: [...IMPACT_TYPES] });
      const affected = unique(impact.map((item) => item.object));
      return Object.freeze({
        focus,
        dependsOn: Object.freeze(unique(dependsOn)),
        dependents: Object.freeze(unique(dependents)),
        affectedOutcomes: Object.freeze(affected.filter((item) => item.kind === "Business Outcome")),
        affectedTechnology: Object.freeze(affected.filter((item) => PRODUCT_KINDS.has(item.kind) || TECHNOLOGY_KINDS.has(item.kind))),
        risks: Object.freeze(affected.filter((item) => item.kind === "Risk" || item.kind === "Technical Debt"))
      });
    }

    function recommendationFor(objectId) {
      const finding = dna.findings.find((item) => item.affectedObjectIds.includes(objectId)) || dna.whyCaseRecommended();
      const primary = rankedCandidates[0];
      const selectedCandidate = rankedCandidates.find((item) => dna.resolveId(item.record.asset_id) === objectId);
      return Object.freeze({
        finding,
        primaryCandidate: primary ? Object.freeze({ id: primary.record.asset_id, dnaId: dna.resolveId(primary.record.asset_id), name: primary.record.asset_name, score: primary.total }) : null,
        selectedCandidate: selectedCandidate ? Object.freeze({ name: selectedCandidate.record.asset_name, score: selectedCandidate.total, rank: rankedCandidates.indexOf(selectedCandidate) + 1 }) : null,
        next: finding?.recommendedAction || "Inspect the connected evidence and readiness conditions before creating a modernization case."
      });
    }

    function detail(objectId) {
      const object = objectById.get(objectId);
      if (!object) return null;
      const connections = directConnections(object.id);
      const impact = dependencyImpact(object.id);
      const recommendation = recommendationFor(object.id);
      const strategyPath = shortestPath("STR-CX-2026-01", object.id);
      const why = recommendation.finding?.affectedObjectIds.includes(object.id)
        ? recommendation.finding.conclusion
        : `${object.description} Evidence is sourced from ${object.provenance}.`;
      const how = strategyPath.length > 1
        ? strategyPath.map((item) => item.name).join(" → ")
        : `${object.name} has ${connections.length} direct governed relationships in Enterprise DNA.`;
      const depends = impact.dependsOn.length
        ? `${object.name} depends directly on ${impact.dependsOn.map((item) => item.name).join(", ")}.`
        : `No direct outbound dependency is recorded for ${object.name}; inspect incoming relationships for consumers and accountability.`;
      const breaks = impact.affectedOutcomes.length || impact.affectedTechnology.length
        ? `A change can affect ${impact.affectedTechnology.length} technology objects and ${impact.affectedOutcomes.length} business outcomes within three governed hops.`
        : "No downstream breakage is asserted by the current bounded evidence. This is not proof of zero impact.";
      const next = recommendation.selectedCandidate
        ? `${recommendation.selectedCandidate.name} is ranked ${recommendation.selectedCandidate.rank} with priority ${recommendation.selectedCandidate.score}. ${recommendation.next}`
        : recommendation.primaryCandidate
          ? `${recommendation.primaryCandidate.name} remains the portfolio-leading candidate at priority ${recommendation.primaryCandidate.score}. ${recommendation.next}`
          : recommendation.next;
      return Object.freeze({
        object,
        connections: Object.freeze(connections),
        impact,
        recommendation,
        strategyPath,
        answers: Object.freeze({ why, how, depends, breaks, next })
      });
    }

    const summary = Object.freeze({
      objects: objects.length,
      relationships: relationships.length,
      capabilities: objects.filter((item) => item.kind === "Business Capability").length,
      technology: objects.filter((item) => PRODUCT_KINDS.has(item.kind) || TECHNOLOGY_KINDS.has(item.kind)).length,
      risks: objects.filter((item) => item.kind === "Risk" || item.kind === "Technical Debt").length,
      evidenceReferences: new Set(objects.flatMap((item) => item.evidenceReferences)).size
    });

    return Object.freeze({
      MODES,
      summary,
      objects,
      relationships,
      rankedCandidates,
      groupForKind,
      getMode,
      search,
      graph,
      detail,
      directConnections,
      dependencyImpact,
      shortestPath,
      recommendationFor
    });
  }

  return Object.freeze({ MODES, create, groupForKind });
}));

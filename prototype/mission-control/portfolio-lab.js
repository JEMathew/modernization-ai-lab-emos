(function attachPortfolioLabEngine(root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  root.PortfolioLabEngine = engine;
}(typeof globalThis !== "undefined" ? globalThis : this, function createPortfolioLabEngine() {
  "use strict";

  const SCHEMA = [
    "asset_id", "asset_name", "asset_type", "business_capability", "technology",
    "business_criticality", "owner", "lifecycle_status", "dependencies",
    "annual_cost", "technical_health", "business_value"
  ];
  const VALID_ASSET_TYPES = new Set(["application", "data_platform"]);
  const COLUMN_ALIASES = {
    asset_id: ["asset id", "id", "system id"],
    asset_name: ["asset name", "system name", "application name", "platform name"],
    asset_type: ["asset type", "category", "system type"],
    business_capability: ["business capability", "capability"],
    technology: ["technology", "tech stack", "platform"],
    business_criticality: ["business criticality", "importance", "criticality"],
    owner: ["owner", "business owner", "system owner"],
    lifecycle_status: ["lifecycle status", "lifecycle", "status"],
    dependencies: ["dependencies", "depends on", "dependency ids"],
    annual_cost: ["annual cost", "operating cost", "yearly cost"],
    technical_health: ["technical health", "health", "technical condition"],
    business_value: ["business value", "value", "strategic value"]
  };

  function normalizeHeader(value) {
    return String(value || "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  }

  function canonicalHeader(value) {
    const normalized = normalizeHeader(value);
    const match = SCHEMA.find((field) => field === normalized.replace(/ /g, "_")
      || COLUMN_ALIASES[field].includes(normalized));
    return match || null;
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    const source = String(text || "").replace(/^\uFEFF/, "");
    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (character === '"') {
        if (quoted && source[index + 1] === '"') { field += '"'; index += 1; }
        else quoted = !quoted;
      } else if (character === "," && !quoted) {
        row.push(field.trim()); field = "";
      } else if ((character === "\n" || character === "\r") && !quoted) {
        if (character === "\r" && source[index + 1] === "\n") index += 1;
        row.push(field.trim()); field = "";
        rows.push(row); row = [];
      } else field += character;
    }
    if (field.length || row.length) { row.push(field.trim()); rows.push(row); }
    if (!rows.length) return { headers: [], records: [], emptyRows: 0 };
    const headers = rows.shift().map((header) => header.trim());
    let emptyRows = 0;
    const records = rows.flatMap((values, rowIndex) => {
      if (values.every((value) => !String(value).trim())) { emptyRows += 1; return []; }
      const record = { __row: rowIndex + 2 };
      headers.forEach((header, columnIndex) => { record[header] = values[columnIndex] ?? ""; });
      return [record];
    });
    return { headers, records, emptyRows };
  }

  function parsePortfolioArtifact(filename, text) {
    const extension = String(filename || "").toLowerCase().split(".").pop();
    if (!filename || !["csv", "json"].includes(extension)) {
      throw new Error("Unsupported format. Upload portfolio.csv or a JSON portfolio only.");
    }
    if (extension === "csv") return { format: "CSV", ...parseCsv(text) };
    let parsed;
    try { parsed = JSON.parse(text); } catch (error) { throw new Error("Invalid JSON. Correct the file and try again."); }
    const records = Array.isArray(parsed) ? parsed : parsed && Array.isArray(parsed.portfolio) ? parsed.portfolio : null;
    if (!records) throw new Error("JSON must be an array of assets or an object with a portfolio array.");
    const headers = [...new Set(records.flatMap((record) => Object.keys(record || {})))];
    return { format: "JSON", headers, records: records.map((record, index) => ({ ...record, __row: index + 1 })), emptyRows: records.filter((record) => !record || !Object.values(record).some((value) => String(value ?? "").trim())).length };
  }

  function suggestMapping(headers) {
    return Object.fromEntries(SCHEMA.map((field) => {
      const source = headers.find((header) => canonicalHeader(header) === field) || "";
      return [field, source];
    }));
  }

  function applyColumnMapping(records, mapping) {
    return records.map((record) => {
      const mapped = { __row: record.__row };
      SCHEMA.forEach((field) => { mapped[field] = record[mapping[field] || field] ?? ""; });
      return mapped;
    });
  }

  function normalizeAssetType(value) {
    const normalized = normalizeHeader(value).replace(/\s+/g, "_");
    if (["app", "application", "applications"].includes(normalized)) return "application";
    if (["data", "data_platform", "data_platforms", "platform", "data_warehouse"].includes(normalized)) return "data_platform";
    return normalized;
  }

  function dependencyIds(value) {
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
    return String(value || "").split(/[;|]/).map((item) => item.trim()).filter(Boolean);
  }

  function parseDependencyArtifact(text) {
    const parsed = parseCsv(text);
    const sourceHeader = parsed.headers.find((header) => ["source_asset_id", "asset_id", "source"].includes(header.trim().toLowerCase()));
    const targetHeader = parsed.headers.find((header) => ["target_asset_id", "depends_on", "dependency_id", "target"].includes(header.trim().toLowerCase()));
    if (!sourceHeader || !targetHeader) throw new Error("dependencies.csv requires source_asset_id and target_asset_id columns.");
    return parsed.records.map((record) => ({ source: String(record[sourceHeader] || "").trim(), target: String(record[targetHeader] || "").trim(), row: record.__row }));
  }

  function validatePortfolio(records, options = {}) {
    const issues = [];
    const seen = new Set();
    const externalDependencies = options.dependencies || [];
    const rows = records.filter((record) => record && Object.values(record).some((value) => String(value ?? "").trim()));
    const ids = new Set(rows.map((record) => String(record.asset_id || "").trim()).filter(Boolean));
    const accepted = [];
    rows.forEach((record, index) => {
      const row = record.__row || index + 2;
      const id = String(record.asset_id || "").trim();
      const missing = SCHEMA.filter((field) => field !== "dependencies" && !String(record[field] ?? "").trim());
      if (missing.length) issues.push({ severity: "error", code: "missing-values", row, assetId: id, message: `Missing values: ${missing.join(", ")}.` });
      if (seen.has(id) && id) issues.push({ severity: "error", code: "duplicate-id", row, assetId: id, message: `Duplicate asset ID: ${id}.` });
      if (id) seen.add(id);
      const assetType = normalizeAssetType(record.asset_type);
      if (!VALID_ASSET_TYPES.has(assetType)) issues.push({ severity: "error", code: "invalid-asset-type", row, assetId: id, message: `Invalid asset type: ${record.asset_type || "empty"}. Use application or data_platform.` });
      const cost = Number(String(record.annual_cost || "").replace(/[$,]/g, ""));
      if (!Number.isFinite(cost) || cost < 0) issues.push({ severity: "error", code: "invalid-cost", row, assetId: id, message: "annual_cost must be a non-negative number." });
      if (!missing.length && id && !seenDuplicateBefore(records, index, id) && VALID_ASSET_TYPES.has(assetType) && Number.isFinite(cost) && cost >= 0) {
        accepted.push({ ...record, asset_id: id, asset_type: assetType, annual_cost: cost, dependencies: dependencyIds(record.dependencies) });
      }
    });
    externalDependencies.forEach((link) => {
      if (!ids.has(link.source) || !ids.has(link.target)) issues.push({ severity: "warning", code: "broken-dependency", row: link.row, assetId: link.source, message: `Broken dependency: ${link.source || "empty"} → ${link.target || "empty"}.` });
    });
    accepted.forEach((record) => {
      const allTargets = [...record.dependencies, ...externalDependencies.filter((link) => link.source === record.asset_id).map((link) => link.target)];
      const broken = allTargets.filter((target) => !ids.has(target));
      if (broken.length) issues.push({ severity: "warning", code: "broken-dependency", row: record.__row, assetId: record.asset_id, message: `Broken dependencies: ${broken.join(", ")}.` });
      record.dependencies = [...new Set(allTargets)];
      record.broken_dependencies = [...new Set(broken)];
    });
    if (options.emptyRows) issues.push({ severity: "warning", code: "empty-rows", row: null, assetId: null, message: `${options.emptyRows} empty row${options.emptyRows === 1 ? "" : "s"} ignored.` });
    return { accepted, rejectedCount: rows.length - accepted.length, issues, sourceCount: rows.length };
  }

  function seenDuplicateBefore(records, index, id) {
    return records.slice(0, index).some((record) => String(record.asset_id || "").trim() === id);
  }

  function labelScore(value, scale, fallback = 50) {
    const normalized = normalizeHeader(value);
    if (Object.prototype.hasOwnProperty.call(scale, normalized)) return scale[normalized];
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : fallback;
  }

  function scorePortfolio(records) {
    if (!records.length) return [];
    const costs = records.map((record) => Number(record.annual_cost) || 0);
    const maximumCost = Math.max(...costs, 1);
    const ids = new Set(records.map((record) => record.asset_id));
    return records.map((record) => {
      const health = labelScore(record.technical_health, { critical: 10, poor: 20, weak: 30, fair: 55, good: 80, strong: 90, excellent: 100 });
      const technicalUrgency = Math.round(100 - health);
      const businessValue = Math.round(labelScore(record.business_value, { low: 25, medium: 60, high: 85, critical: 100, strategic: 95 }));
      const operatingCost = Math.round(((Number(record.annual_cost) || 0) / maximumCost) * 100);
      const dependencies = dependencyIds(record.dependencies);
      const validDependencies = dependencies.filter((target) => ids.has(target)).length;
      const dependencyReadiness = dependencies.length ? Math.round((validDependencies / dependencies.length) * 100) : 100;
      const lifecycle = labelScore(record.lifecycle_status, { current: 20, supported: 30, aging: 65, "end of support": 90, deprecated: 95, obsolete: 100 });
      const criticality = labelScore(record.business_criticality, { low: 20, medium: 50, high: 80, critical: 100 });
      const riskReduction = Math.round((lifecycle * 0.65) + (criticality * 0.35));
      const filled = SCHEMA.filter((field) => field === "dependencies" || String(record[field] ?? "").trim()).length;
      const evidenceConfidence = Math.max(0, Math.round((filled / SCHEMA.length) * 100) - ((record.broken_dependencies || []).length * 15));
      const total = Math.round((technicalUrgency * 0.30) + (businessValue * 0.25) + (operatingCost * 0.15) + (dependencyReadiness * 0.15) + (riskReduction * 0.10) + (evidenceConfidence * 0.05));
      return { record, total, technicalUrgency, businessValue, operatingCost, dependencyReadiness, riskReduction, evidenceConfidence };
    }).sort((left, right) => right.total - left.total || left.record.asset_name.localeCompare(right.record.asset_name));
  }

  function selectModernizationUnits(records, mode = "first", selectedIds = []) {
    if (records.length <= 10) return [...records];
    if (mode === "first") return records.slice(0, 10);
    const selected = records.filter((record) => selectedIds.includes(record.asset_id));
    if (selected.length !== 10) throw new Error("Select exactly 10 modernization units.");
    return selected;
  }

  return { SCHEMA, VALID_ASSET_TYPES, canonicalHeader, parseCsv, parsePortfolioArtifact, parseDependencyArtifact, suggestMapping, applyColumnMapping, validatePortfolio, scorePortfolio, selectModernizationUnits, dependencyIds };
}));

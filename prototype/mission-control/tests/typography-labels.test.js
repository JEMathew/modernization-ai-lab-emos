"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const labUi = fs.readFileSync(path.join(root, "portfolio-lab-ui.js"), "utf8");

assert.match(styles, /html \{ font-size: 18px; \}/, "desktop typography uses the enlarged root scale");
assert.match(styles, /small, dt \{ font-size: \.625rem !important;/, "labels have a consistent readable floor");
assert.match(styles, /button, input, select, textarea \{ font-size: \.7rem !important;/, "interactive controls share a readable type scale");
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*html \{ font-size: 17px; \}/, "mobile typography remains responsive");
assert.match(script, /function displayTitle\(value\)/, "the core UI humanizes dynamic display keys");
assert.match(script, /displayTitle\(key\)/, "executive record fields use human-readable labels");
assert.match(labUi, /displayTitle\(field\)/, "portfolio schema fields use title-cased display labels");
assert.match(labUi, /displayValidationMessage\(issue\.message\)/, "validation messages humanize schema identifiers at the UI boundary");
assert.match(labUi, /Technical Urgency/, "score headings use full title-cased names");
assert.ok(html.includes("Source Asset ID, Target Asset ID"), "visible dependency field names are human readable");
assert.ok(!html.includes(">source_asset_id, target_asset_id<"), "internal schema names are not exposed as static display labels");
assert.ok(html.includes("styles.css?v=1.8.0"), "the current stylesheet cache key is active");

console.log("Typography and display-label tests passed");

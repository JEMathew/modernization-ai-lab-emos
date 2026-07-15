"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const prototypeRoot = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(prototypeRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(prototypeRoot, "script.js"), "utf8");

assert.equal((html.match(/id="begin-discovery"/g) || []).length, 1, "discovery has one action control");
assert.match(html, /id="begin-discovery"[^>]*type="button"[^>]*>Begin Portfolio Discovery/, "the action has the required accessible label");
assert.equal((html.match(/id="guided-discovery-action"/g) || []).length, 1, "the guided cue has one action slot");
assert.match(script, /guidedSlot\.append\(button\)/, "the existing action moves into the guided cue instead of being duplicated");
assert.match(script, /state\.guidedDemo && step === 1 && state\.discovery === "unverified"/, "the guided action is limited to ready Step 1 state");
assert.match(script, /standardSlot\.append\(button\)/, "the action returns to the portfolio console outside guided Step 1");
assert.match(script, /button\.disabled = true;[\s\S]*button\.firstChild\.textContent = "Discovery in progress "/, "discovery disables the action as execution starts");
assert.match(script, /button\.disabled = false;[\s\S]*button\.firstChild\.textContent = "Begin Portfolio Discovery "/, "full reset restores the action");

console.log("Guided discovery action tests passed");

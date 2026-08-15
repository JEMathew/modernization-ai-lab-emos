"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert.match(html, /id="guided-resize-handle"[^>]*role="separator"[^>]*aria-orientation="vertical"/, "resize handle uses separator semantics");
assert.match(html, /aria-label="Resize Guided Modernization Journey"/, "resize handle has an accessible name");
assert.match(html, /aria-valuemin="360"[^>]*aria-valuemax="640"[^>]*aria-valuenow="430"[^>]*tabindex="0"/, "resize handle exposes its initial range and value");

assert.match(script, /min: 360,[\s\S]*default: 430,[\s\S]*absoluteMax: 640,[\s\S]*breakpoint: 1181/, "width bounds and desktop breakpoint are explicit");
assert.match(script, /workspaceReserve: 560,[\s\S]*viewportRatio: 0\.48/, "maximum width protects the Mission Control workspace");
assert.match(script, /function clampGuidedWidth\(value, viewportWidth = window\.innerWidth\)/, "width values use one clamping boundary");
assert.match(script, /function normalizeGuidedWidthPreference\(value\)[\s\S]*GUIDED_DOCK_WIDTH\.absoluteMax/, "stored desktop width is validated independently of a narrow active viewport");

assert.match(script, /addEventListener\("pointerdown"[\s\S]*setPointerCapture\(event\.pointerId\)/, "pointer resizing captures the active pointer");
assert.match(script, /addEventListener\("pointermove"[\s\S]*startWidth \+ guidedResizeSession\.startX - event\.clientX/, "pointer movement resizes the dock from its left edge");
assert.match(script, /addEventListener\("pointerup", finishGuidedResize\)/, "pointer release ends resizing");
assert.match(script, /addEventListener\("pointercancel", finishGuidedResize\)/, "pointer cancellation ends resizing");
assert.match(styles, /body\.is-resizing-guided-inspector[\s\S]*user-select: none !important/, "dragging prevents accidental text selection");

assert.match(script, /\["ArrowLeft", "ArrowRight"\]/, "resize handle supports horizontal arrow keys");
assert.match(script, /event\.shiftKey \? GUIDED_DOCK_WIDTH\.keyboardLargeStep : GUIDED_DOCK_WIDTH\.keyboardStep/, "Shift enables the larger keyboard step");
assert.match(script, /event\.key === "Home"[\s\S]*GUIDED_DOCK_WIDTH\.min[\s\S]*event\.key === "End"[\s\S]*guidedMaximumWidth\(\)/, "Home and End move to the supported bounds");

assert.match(script, /modernization-ai-lab\.guided-dock-right-width/, "only a presentation preference key is persisted");
assert.match(script, /window\.localStorage\.getItem[\s\S]*normalizeGuidedWidthPreference\(storedValue\)[\s\S]*catch \{[\s\S]*GUIDED_DOCK_WIDTH\.default/, "invalid or unavailable stored preferences fall back safely");
assert.match(script, /window\.localStorage\.setItem\(GUIDED_DOCK_WIDTH_STORAGE_KEY, String\(guidedPresentation\.width\)\)/, "validated width is persisted");
assert.match(script, /guidedPresentation\.width = readGuidedWidthPreference\(\);[\s\S]*guidedDesktopResizeSupported\(\)[\s\S]*clampGuidedWidth\(guidedPresentation\.width\)/, "desktop initialization applies the current viewport's effective maximum");

assert.match(script, /guidedPresentation\.collapsed \? 330 : guidedPresentation\.width/, "collapse uses the compact width without discarding the expanded preference");
assert.doesNotMatch(script, /function resetGuidedPresentation\(\) \{[\s\S]{0,180}guidedPresentation\.width =/, "Journey reset does not erase the user's width preference");
assert.match(script, /window\.addEventListener\("resize"[\s\S]*clampGuidedWidth\(guidedPresentation\.width\)/, "viewport changes re-clamp the expanded width");

assert.match(styles, /@media \(min-width: 1181px\)[\s\S]*guided-resize-handle/, "resize handle is enabled only at the desktop breakpoint");
assert.match(styles, /\.guided-resize-handle \{\s*display: none;/, "resize handle is hidden by default below the breakpoint");
assert.match(styles, /\.guided-resize-handle:focus-visible > span/, "resize handle has a visible keyboard focus state");
assert.match(styles, /width: 24px/, "resize handle provides a usable pointer target");
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*guided-resize-handle/, "resize affordance respects reduced motion");

console.log("Guided dock-right resize tests passed");

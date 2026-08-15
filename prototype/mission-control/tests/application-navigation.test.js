"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const labUi = fs.readFileSync(path.join(root, "portfolio-lab-ui.js"), "utf8");

assert.match(html, /<nav class="app-navigation" aria-label="Primary application navigation">/, "primary navigation is a persistent landmark");
["home", "mission-control", "hq", "portfolio-lab", "guided-journey"].forEach((destination) => {
  assert.ok(html.includes(`data-app-destination="${destination}"`), `navigation exposes ${destination}`);
});
assert.match(html, /id="app-orientation"[^>]*aria-live="polite"[^>]*aria-atomic="true"/, "orientation changes are announced");
assert.match(html, /id="app-breadcrumbs">Home</, "the visible orientation trail starts at Home");
assert.match(html, /class="skip-link" href="#application-workspace"/, "a skip link is available before persistent navigation");
assert.equal((html.match(/data-app-destination="home"/g) || []).length, 1, "the primary Home entry is the single current-page navigation target");
assert.doesNotMatch(html, /id="entry-launchpad"[^>]*aria-modal="true"/, "the Home surface does not incorrectly trap users behind a modal claim");

assert.match(script, /function applicationSurface\(\)[\s\S]*entry-launchpad[\s\S]*portfolio-upload-lab[\s\S]*state\.experience/, "surface orientation is derived from existing state and visibility");
assert.match(script, /function syncApplicationNavigation\(\)[\s\S]*aria-current[\s\S]*app-breadcrumbs/, "navigation and orientation share one synchronization function");
assert.match(script, /globalThis\.syncApplicationNavigation = syncApplicationNavigation/, "Portfolio Lab receives an explicit presentation-only navigation integration boundary");
assert.match(script, /application-workspace"\)\.children[\s\S]*toggleAttribute\("inert"/, "full-screen Home and Lab surfaces isolate underlying controls from keyboard and assistive technology");
assert.match(script, /Home · Guided Journey preserved at/, "Home explains that active Journey state is preserved");
assert.match(script, /function openApplicationHome\(\)[\s\S]*entry-launchpad"\)\.hidden = false[\s\S]*syncApplicationNavigation/, "Home is available without resetting the product");
const homeFunction = script.match(/function openApplicationHome\(\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.doesNotMatch(homeFunction, /resetDemo|setGuidedDemo\(false\)/, "leaving for Home does not reset or disable the Journey");
assert.match(script, /function alignGuidedJourneyWorkspace\(\)[\s\S]*step <= 2[\s\S]*navigate\("portfolio"\)[\s\S]*openExperience\("hq"/, "Journey return aligns the underlying workspace with the existing current step");
assert.match(script, /function returnToGuidedJourney\(\)[\s\S]*setGuidedDemo\(true\)[\s\S]*setGuidedCollapsed\(false, false\)[\s\S]*alignGuidedJourneyWorkspace\(\)[\s\S]*guided-step-title"\)\.focus/, "Journey return restores and focuses the existing companion");
assert.match(script, /function openMissionControlFromNavigation\(\)[\s\S]*navigate\(state\.view\)/, "Mission Control return preserves the selected environment");
assert.match(script, /function openHqFromNavigation\(\)[\s\S]*openExperience\("hq"\)/, "HQ remains directly reachable");
assert.doesNotMatch(script, /applicationSurface:\s*["']|surface:\s*["']home/, "no duplicate application-surface state is added");

assert.match(labUi, /function setEntryVisible\(visible\)[\s\S]*syncApplicationNavigation/, "Home visibility synchronizes the persistent navigation");
assert.match(labUi, /function setLabVisible\(visible\)[\s\S]*syncApplicationNavigation/, "Portfolio Lab visibility synchronizes the persistent navigation");
assert.match(labUi, /returnToHomeAfterLab = !document\.querySelector\("#entry-launchpad"\)\.hidden[\s\S]*function closeLab\(showEntry = returnToHomeAfterLab\)/, "Portfolio Lab returns to the surface that opened it");

assert.match(styles, /\.app-navigation \{[\s\S]*position: fixed;[\s\S]*z-index: 100/, "navigation remains visible above current overlays");
assert.match(styles, /\.entry-launchpad,[\s\S]*\.portfolio-upload-lab \{[\s\S]*top: var\(--app-navigation-height\)/, "full-screen surfaces leave persistent navigation reachable");
assert.match(styles, /\.app-navigation #app-home \{[\s\S]*position: sticky;[\s\S]*left: 0/, "Home remains visible when narrow navigation scrolls");
assert.match(styles, /@media \(max-width: 820px\)[\s\S]*\.app-destinations[\s\S]*overflow-x: auto/, "navigation remains reachable at tablet and mobile widths");
assert.match(styles, /\.app-navigation button \{[\s\S]*min-height: 44px/, "navigation controls retain a usable target size");

console.log("Persistent application navigation tests passed");

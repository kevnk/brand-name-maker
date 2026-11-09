// A keyboard user can see which button has focus: every .btn shows a ring
// while it has keyboard focus, and no outline otherwise, so the page looks the
// same to a mouse user.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import assert from "node:assert/strict";
import BrandNameMaker from "../src/components/BrandNameMaker.vue";
import { button, click, enter, mount, vueErrors } from "./helpers.mjs";

const require = createRequire(import.meta.url);
const { parseComponent } = require("vue-template-compiler");

// setup.mjs skips styles, so compile the component's own SCSS onto the page.
// The sass CLI runs in its own process: in this one, jsdom's `window` makes
// sass think it's in a browser, and it fails.
const source = readFileSync(
  new URL("../src/components/BrandNameMaker.vue", import.meta.url),
  "utf8"
);
for (const { content } of parseComponent(source).styles) {
  const style = document.head.appendChild(document.createElement("style"));
  style.textContent = execFileSync(
    process.execPath,
    [require.resolve("sass/sass.js"), "--stdin", "--no-source-map"],
    { input: content, encoding: "utf8" }
  );
}

// jsdom's getComputedStyle leaves out `outline`, so take it from the last
// matching rule that sets it.
// ponytail: source order only, no specificity; enough while no earlier rule
// outranks .btn:focus-visible.
function outline(node) {
  let value = "";
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      const set = rule.style?.getPropertyValue("outline");
      if (set && node.matches(rule.selectorText)) value = set;
    }
  }
  return value;
}

function focusedAndNot(node) {
  node.focus();
  assert.equal(document.activeElement, node, "the button took focus");
  const focused = outline(node);
  node.blur();
  return { focused, blurred: outline(node) };
}

test("each kind of button shows a ring only while it has keyboard focus", async () => {
  localStorage.clear();
  vueErrors.length = 0;
  const el = await mount(BrandNameMaker);
  const seen = {};

  await enter(el, "Calm");
  seen.next = focusedAndNot(button(el, "NEXT"));
  seen.remove = focusedAndNot(el.querySelector(".list-item button.remove"));

  await click(el, "NEXT");
  seen.back = focusedAndNot(button(el, "BACK"));
  seen.tab = focusedAndNot(el.querySelector("button.link"));

  await enter(el, "Tea");
  await click(el, "NEXT");
  await enter(el, "Warm");
  seen.finish = focusedAndNot(button(el, "FINISH"));

  const ring = { focused: "2px solid #2c3e50", blurred: "none" };
  assert.deepEqual(seen, {
    next: ring,
    remove: ring,
    back: ring,
    tab: ring,
    finish: ring,
  });
  assert.deepEqual(vueErrors, []);
});

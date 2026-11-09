// Mount a component and drive it the way a person does: type, press Enter,
// click buttons, read what's on screen.
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// The full build (with the template compiler), loaded after setup.mjs has
// created `window`, which Vue looks for when it loads.
const Vue = createRequire(import.meta.url)("vue/dist/vue.common.dev.js");
Vue.config.productionTip = false;
Vue.config.devtools = false;

// Vue warnings and render errors land here; tests assert it stays empty.
export const vueErrors = [];
Vue.config.warnHandler = (msg) => vueErrors.push(msg);
Vue.config.errorHandler = (err) => vueErrors.push(String(err));

// Wait for Vue to re-render, then for the setTimeout(0) focus calls its
// watchers queued during that render.
async function settle() {
  await Vue.nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export async function mount(component) {
  const el = document.body.appendChild(document.createElement("div"));
  const vm = new Vue({ render: (h) => h(component) }).$mount(el);
  await settle();
  return vm.$el;
}

const text = (node) => node.textContent.trim();
const all = (el, selector) => [...el.querySelectorAll(selector)];

export const heading = (el) => text(el.querySelector("h2"));
export const stepLabel = (el) => text(el.querySelector(".step"));
export const input = (el) => el.querySelector("input[type=text]");
export const items = (el) => all(el, ".list-item > b").map(text);
export const results = (el) => all(el, ".results .characteristics div").map(text);
export const projects = (el) => all(el, ".projects button").map(text);
const tabButtons = (el) => all(el, "button.link").filter((b) => !b.closest(".projects"));
export const tabs = (el) => tabButtons(el).map(text);
export const activeTab = (el) => text(el.querySelector("button.link.active"));

// Matches "NEXT" to "NEXT →" and "BACK" to "← BACK"; anything else is exact.
export function button(el, label) {
  return all(el, "button, a").find((b) => {
    const t = text(b);
    return t === label || t.startsWith(`${label} `) || t.endsWith(` ${label}`);
  });
}

export async function click(el, label) {
  const target = button(el, label);
  assert.ok(target, `no button or link labeled "${label}"`);
  target.click();
  await settle();
}

// Type into the step's text field and press Enter.
export async function enter(el, value) {
  const field = input(el);
  assert.ok(field, "no text field on screen");
  field.value = value;
  field.dispatchEvent(new Event("input"));
  field.dispatchEvent(new KeyboardEvent("keypress", { charCode: 13 }));
  await settle();
}

// Click the × next to the list item showing `value`.
export async function remove(el, value) {
  const item = all(el, ".list-item").find((i) => text(i.querySelector("b")) === value);
  assert.ok(item, `no list item "${value}"`);
  item.querySelector("button.remove").click();
  await settle();
}

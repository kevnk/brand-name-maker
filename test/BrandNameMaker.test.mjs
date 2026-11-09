import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import BrandNameMaker from "../src/components/BrandNameMaker.vue";
import {
  activeTab,
  button,
  click,
  enter,
  heading,
  input,
  items,
  mount,
  projects,
  remove,
  results,
  stepLabel,
  tabs,
  vueErrors,
} from "./helpers.mjs";

beforeEach(() => {
  localStorage.clear();
  vueErrors.length = 0;
});
afterEach(() => assert.deepEqual(vueErrors, []));

// Feelings "Relieved", "Safe"; embodiments "Hot bath" (Relieved) and
// "Seatbelt" (Safe); characteristic "Steam" (Hot bath). Ends on step 3.
async function fillAllSteps(el) {
  await enter(el, "Relieved");
  await enter(el, "Safe");
  await click(el, "NEXT");
  await enter(el, "Hot bath");
  await click(el, "Safe");
  await enter(el, "Seatbelt");
  await click(el, "NEXT");
  await enter(el, "Steam");
}

test("step 1 adds each feeling on Enter, newest first, and clears the field", async () => {
  const el = await mount(BrandNameMaker);
  assert.equal(heading(el), "Feelings");
  assert.equal(stepLabel(el), "step 1 / 3");
  assert.equal(input(el).placeholder, "eg. Relieved");
  assert.equal(button(el, "NEXT").disabled, true);
  assert.equal(button(el, "BACK"), undefined);

  await enter(el, "Relieved");
  await enter(el, "Safe");

  assert.deepEqual(items(el), ["Safe", "Relieved"]);
  assert.equal(input(el).value, "");
  assert.equal(input(el).placeholder, "");
  assert.equal(button(el, "NEXT").disabled, false);
});

test("the × button removes that feeling only", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "Calm");
  await enter(el, "Bold");
  await enter(el, "Warm");

  await remove(el, "Bold");
  assert.deepEqual(items(el), ["Warm", "Calm"]);

  await remove(el, "Warm");
  await remove(el, "Calm");
  assert.deepEqual(items(el), []);
  assert.equal(button(el, "NEXT").disabled, true);
});

test("entries are kept in localStorage and come back after a reload", async () => {
  const el = await mount(BrandNameMaker);
  await fillAllSteps(el);

  assert.deepEqual(JSON.parse(localStorage.getItem("feelings")), [
    { val: "Safe" },
    { val: "Relieved" },
  ]);
  assert.deepEqual(JSON.parse(localStorage.getItem("characteristics")), [
    { val: "Steam", embodiment: { val: "Hot bath", feeling: { val: "Relieved" } } },
  ]);

  const reloaded = await mount(BrandNameMaker);
  assert.equal(heading(reloaded), "Feelings");
  assert.deepEqual(items(reloaded), ["Safe", "Relieved"]);
  await click(reloaded, "NEXT");
  assert.deepEqual(items(reloaded), ["Hot bath"]);
  await click(reloaded, "NEXT");
  assert.deepEqual(items(reloaded), ["Steam"]);
});

test("step 2 starts on the first feeling and files embodiments under the active one", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "Relieved");
  await enter(el, "Safe");
  await click(el, "NEXT");

  assert.equal(heading(el), "Embodiment");
  assert.equal(stepLabel(el), "step 2 / 3");
  assert.deepEqual(tabs(el), ["Relieved", "Safe"]);
  assert.equal(activeTab(el), "Relieved");
  assert.equal(document.activeElement, input(el));
  assert.equal(button(el, "NEXT").disabled, true);

  await enter(el, "Hot bath");
  assert.deepEqual(items(el), ["Hot bath"]);
  assert.equal(button(el, "NEXT").disabled, false);

  await click(el, "Safe");
  assert.equal(activeTab(el), "Safe");
  assert.equal(document.activeElement, input(el));
  assert.deepEqual(items(el), []);
  await enter(el, "Seatbelt");
  assert.deepEqual(items(el), ["Seatbelt"]);

  await click(el, "Relieved");
  assert.deepEqual(items(el), ["Hot bath"]);
});

test("removing an embodiment removes the one clicked, not a neighbor in the full list", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "Relieved");
  await enter(el, "Safe");
  await click(el, "NEXT");
  await enter(el, "Hot bath");
  await click(el, "Safe");
  await enter(el, "Seatbelt");
  await enter(el, "Helmet");

  await remove(el, "Seatbelt");

  assert.deepEqual(items(el), ["Helmet"]);
  await click(el, "Relieved");
  assert.deepEqual(items(el), ["Hot bath"]);
});

test("step 3 files characteristics under the active embodiment, then FINISH shows results", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "Relieved");
  await click(el, "NEXT");
  await enter(el, "Hot bath");
  await enter(el, "Massage");
  await click(el, "NEXT");

  assert.equal(heading(el), "Characteristic");
  assert.equal(stepLabel(el), "step 3 / 3");
  assert.deepEqual(tabs(el), ["Hot bath", "Massage"]);
  assert.equal(activeTab(el), "Hot bath");
  assert.equal(document.activeElement, input(el));
  assert.equal(button(el, "NEXT"), undefined);
  assert.equal(button(el, "FINISH").disabled, true);

  await enter(el, "Steam");
  assert.equal(button(el, "FINISH").disabled, false);
  await click(el, "Massage");
  assert.deepEqual(items(el), []);
  await enter(el, "Kneading");
  await enter(el, "Oil");
  await remove(el, "Kneading");
  assert.deepEqual(items(el), ["Oil"]);
  await click(el, "Hot bath");
  assert.deepEqual(items(el), ["Steam"]);

  await click(el, "FINISH");
  assert.equal(heading(el), "Results");
  assert.deepEqual(results(el), ["Oil", "Steam"]);
  assert.equal(input(el), null);
});

test("BACK returns to the previous step with its entries intact", async () => {
  const el = await mount(BrandNameMaker);
  await fillAllSteps(el);
  await click(el, "FINISH");

  await click(el, "BACK");
  assert.equal(heading(el), "Characteristic");
  assert.deepEqual(items(el), ["Steam"]);
  await click(el, "BACK");
  assert.equal(heading(el), "Embodiment");
  await click(el, "BACK");
  assert.equal(heading(el), "Feelings");
  assert.deepEqual(items(el), ["Safe", "Relieved"]);
  assert.equal(button(el, "BACK"), undefined);
});

test("Clear & Start Over saves the project, and Load Previous Project brings it back", async () => {
  const el = await mount(BrandNameMaker);
  assert.deepEqual(projects(el), []);
  await fillAllSteps(el);
  await click(el, "FINISH");

  await click(el, "Clear & Start Over");
  assert.equal(heading(el), "Feelings");
  assert.deepEqual(items(el), []);
  assert.deepEqual(projects(el), ["1"]);
  assert.equal(localStorage.getItem("projectCount"), "1");

  await click(el, "1");
  assert.deepEqual(items(el), ["Safe", "Relieved"]);
  await click(el, "NEXT");
  assert.deepEqual(items(el), ["Hot bath"]);
  await click(el, "Safe");
  assert.deepEqual(items(el), ["Seatbelt"]);
  await click(el, "NEXT");
  assert.deepEqual(items(el), ["Steam"]);
});

test("clearing an unchanged loaded project doesn't save a second copy", async () => {
  const el = await mount(BrandNameMaker);
  await fillAllSteps(el);
  await click(el, "FINISH");
  await click(el, "Clear & Start Over");

  await click(el, "1");
  await click(el, "NEXT");
  await click(el, "NEXT");
  await click(el, "FINISH");
  await click(el, "Clear & Start Over");

  assert.deepEqual(projects(el), ["1"]);
});

test("editing a loaded project and clearing it saves the edit as a new project", async () => {
  const el = await mount(BrandNameMaker);
  await fillAllSteps(el);
  await click(el, "FINISH");
  await click(el, "Clear & Start Over");

  await click(el, "1");
  await enter(el, "Bold");
  await click(el, "NEXT");
  await click(el, "NEXT");
  await click(el, "FINISH");
  await click(el, "Clear & Start Over");

  assert.deepEqual(projects(el), ["1", "2"]);
  await click(el, "1");
  assert.deepEqual(items(el), ["Safe", "Relieved"]);
  await click(el, "2");
  assert.deepEqual(items(el), ["Bold", "Safe", "Relieved"]);
});

test("Enter in an empty or blank field adds nothing, on every step", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "");
  await enter(el, "   ");
  assert.deepEqual(items(el), []);
  assert.equal(button(el, "NEXT").disabled, true);

  await enter(el, "Relieved");
  await click(el, "NEXT");
  await enter(el, "");
  await enter(el, " \t ");
  assert.deepEqual(items(el), []);
  assert.equal(button(el, "NEXT").disabled, true);

  await enter(el, "Hot bath");
  await click(el, "NEXT");
  await enter(el, "");
  await enter(el, "  ");
  assert.deepEqual(items(el), []);
  assert.equal(button(el, "FINISH").disabled, true);
});

test("Clear & Start Over after a reload still saves the unsaved work", async () => {
  const before = await mount(BrandNameMaker);
  await fillAllSteps(before);

  const el = await mount(BrandNameMaker);
  await click(el, "NEXT");
  await click(el, "NEXT");
  await click(el, "FINISH");
  assert.deepEqual(results(el), ["Steam"]);
  await click(el, "Clear & Start Over");

  assert.deepEqual(projects(el), ["1"]);
  await click(el, "1");
  assert.deepEqual(items(el), ["Safe", "Relieved"]);
});

test("after a reload, clearing an unchanged loaded project still saves no copy", async () => {
  const before = await mount(BrandNameMaker);
  await fillAllSteps(before);
  await click(before, "FINISH");
  await click(before, "Clear & Start Over");
  await click(before, "1");

  const el = await mount(BrandNameMaker);
  await click(el, "NEXT");
  await click(el, "NEXT");
  await click(el, "FINISH");
  await click(el, "Clear & Start Over");

  assert.deepEqual(projects(el), ["1"]);
});

// Saved work that can't be read back (not JSON, or not the type the app
// saved) starts empty, and a saved list drops entries it can't show, instead
// of stopping the page from mounting. And each text field, × and tab says
// what it is to a screen reader.
import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import BrandNameMaker from "../src/components/BrandNameMaker.vue";
import {
  click,
  enter,
  heading,
  input,
  items,
  mount,
  projects,
  results,
  vueErrors,
} from "./helpers.mjs";

beforeEach(() => {
  localStorage.clear();
  vueErrors.length = 0;
});
afterEach(() => assert.deepEqual(vueErrors, []));

const label = (node) => node.getAttribute("aria-label");
const removeLabels = (el) =>
  [...el.querySelectorAll(".list-item button.remove")].map(label);
// { tab text: aria-pressed } for the step 2 and step 3 tabs
const pressed = (el) =>
  Object.fromEntries(
    [...el.querySelectorAll("button.link")]
      .filter((b) => !b.closest(".projects"))
      .map((b) => [b.textContent.trim(), b.getAttribute("aria-pressed")])
  );

async function allThreeSteps(el) {
  await enter(el, "Relieved");
  await click(el, "NEXT");
  await enter(el, "Hot bath");
  await click(el, "NEXT");
  await enter(el, "Steam");
  await click(el, "FINISH");
}

test("saved lists that aren't JSON or aren't lists start empty, and all three steps still work", async () => {
  localStorage.setItem("feelings", "{not json");
  localStorage.setItem("embodiments", '"Hot bath"');
  localStorage.setItem("characteristics", "42");
  localStorage.setItem("projectCount", "[]");

  const el = await mount(BrandNameMaker);
  assert.equal(heading(el), "Feelings");
  assert.deepEqual(items(el), []);
  assert.deepEqual(projects(el), []);

  await allThreeSteps(el);
  assert.deepEqual(results(el), ["Steam"]);
  assert.equal(localStorage.getItem("feelings"), '[{"val":"Relieved"}]');
});

test('a stored "null" in every key starts empty', async () => {
  for (const key of ["feelings", "embodiments", "characteristics", "projectCount"]) {
    localStorage.setItem(key, "null");
  }
  const el = await mount(BrandNameMaker);
  assert.deepEqual(items(el), []);
  assert.deepEqual(projects(el), []);

  await allThreeSteps(el);
  assert.deepEqual(results(el), ["Steam"]);
});

test("loading a project whose saved lists are bad gives an empty project", async () => {
  localStorage.setItem("projectCount", "1");
  localStorage.setItem("feelings-1", "{oops");
  localStorage.setItem("embodiments-1", "null");
  localStorage.setItem("characteristics-1", "7");

  const el = await mount(BrandNameMaker);
  assert.deepEqual(projects(el), ["1"]);
  await click(el, "1");
  assert.equal(heading(el), "Feelings");
  assert.deepEqual(items(el), []);

  await allThreeSteps(el);
  assert.deepEqual(results(el), ["Steam"]);
});

test("saved list items that aren't the app's own entries are dropped, and the rest still show", async () => {
  localStorage.setItem("feelings", JSON.stringify([null, { val: "Safe" }, "Relieved", { val: 7 }]));
  localStorage.setItem(
    "embodiments",
    JSON.stringify([{ val: "Seatbelt", feeling: { val: "Safe" } }, { val: "Hot bath" }, null])
  );
  localStorage.setItem(
    "characteristics",
    JSON.stringify([{ val: "Click", embodiment: { val: "Seatbelt" } }, 3, { embodiment: { val: "Seatbelt" } }, { val: "Loud" }])
  );

  const el = await mount(BrandNameMaker);
  assert.deepEqual(items(el), ["Safe"]);
  await click(el, "NEXT");
  assert.deepEqual(items(el), ["Seatbelt"]);
  await click(el, "NEXT");
  assert.deepEqual(items(el), ["Click"]);
  await click(el, "FINISH");
  assert.deepEqual(results(el), ["Click"]);
});

test("loading a project drops list items that aren't the app's own entries", async () => {
  localStorage.setItem("projectCount", "1");
  localStorage.setItem("feelings-1", JSON.stringify([{ val: "Calm" }, [], { feeling: "x" }]));
  localStorage.setItem("embodiments-1", JSON.stringify([{ val: "Tea", feeling: null }, { val: "Lake", feeling: { val: "Calm" } }]));
  localStorage.setItem("characteristics-1", JSON.stringify([false, { val: "Still", embodiment: { val: "Lake" } }]));

  const el = await mount(BrandNameMaker);
  await click(el, "1");
  assert.deepEqual(items(el), ["Calm"]);
  await click(el, "NEXT");
  assert.deepEqual(items(el), ["Lake"]);
  await click(el, "NEXT");
  assert.deepEqual(items(el), ["Still"]);
});

test("each text field, × and tab says what it is", async () => {
  const el = await mount(BrandNameMaker);
  assert.equal(label(input(el)), "Add a feeling");
  await enter(el, "Relieved");
  await enter(el, "Safe");
  assert.deepEqual(removeLabels(el), ["Remove Safe", "Remove Relieved"]);

  await click(el, "NEXT");
  assert.deepEqual(pressed(el), { Relieved: "true", Safe: "false" });
  assert.equal(label(input(el)), "Add an embodiment of Relieved");
  await enter(el, "Hot bath");
  assert.deepEqual(removeLabels(el), ["Remove Hot bath"]);
  await click(el, "Safe");
  assert.deepEqual(pressed(el), { Relieved: "false", Safe: "true" });
  assert.equal(label(input(el)), "Add an embodiment of Safe");
  await enter(el, "Seatbelt");

  await click(el, "NEXT");
  assert.deepEqual(pressed(el), { "Hot bath": "true", Seatbelt: "false" });
  assert.equal(label(input(el)), "Add a characteristic of Hot bath");
  await enter(el, "Steam");
  assert.deepEqual(removeLabels(el), ["Remove Steam"]);
});

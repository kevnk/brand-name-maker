import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import BrandNameMaker from "../src/components/BrandNameMaker.vue";
import { button, click, enter, items, mount, remove, results, tabs, vueErrors } from "./helpers.mjs";

beforeEach(() => {
  localStorage.clear();
  vueErrors.length = 0;
});
afterEach(() => assert.deepEqual(vueErrors, []));

const saved = (key) => JSON.parse(localStorage.getItem(key)).map((item) => item.val);

// An embodiment belongs to a feeling, and a characteristic to an embodiment,
// by name: that's how the step 2 and step 3 tabs match them.

test("removing a feeling takes its embodiments and their characteristics with it", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "Calm");
  await click(el, "NEXT");
  await enter(el, "Lake");
  await click(el, "NEXT");
  await enter(el, "Still");
  await click(el, "BACK");
  await click(el, "BACK");

  await remove(el, "Calm");
  await enter(el, "Bold");
  await click(el, "NEXT");

  assert.deepEqual(tabs(el), ["Bold"]);
  assert.deepEqual(items(el), []);
  assert.equal(button(el, "NEXT").disabled, true, "NEXT with no embodiment for any feeling");
  assert.deepEqual(saved("embodiments"), []);
  assert.deepEqual(saved("characteristics"), []);
});

test("removing an embodiment takes its characteristics with it", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "Relieved");
  await click(el, "NEXT");
  await enter(el, "Hot bath");
  await enter(el, "Blanket");
  await click(el, "NEXT");
  await click(el, "Hot bath");
  await enter(el, "Steam");
  await click(el, "Blanket");
  await enter(el, "Weight");
  await click(el, "BACK");

  await remove(el, "Hot bath");
  await click(el, "NEXT");

  assert.deepEqual(tabs(el), ["Blanket"]);
  await click(el, "FINISH");
  assert.deepEqual(results(el), ["Weight"]);
});

test("a feeling removed while another has the same name keeps their embodiments", async () => {
  const el = await mount(BrandNameMaker);
  await enter(el, "Calm");
  await enter(el, "Calm");
  await click(el, "NEXT");
  await enter(el, "Lake");
  await click(el, "BACK");

  await remove(el, "Calm");
  await click(el, "NEXT");

  assert.deepEqual(items(el), ["Lake"]);
  assert.deepEqual(saved("embodiments"), ["Lake"]);
});

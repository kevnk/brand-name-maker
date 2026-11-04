import { test } from "node:test";
import assert from "node:assert/strict";
import App from "../src/App.vue";
import { heading, mount, vueErrors } from "./helpers.mjs";

test("the page credits Ben Pieratt's naming post and opens on step 1", async () => {
  localStorage.clear();
  const el = await mount(App);

  assert.equal(el.id, "app");
  assert.equal(el.querySelector("h1").textContent, "Brand Name Maker");
  assert.deepEqual(
    [...el.querySelectorAll(":scope > a")].map((a) => ({
      text: a.textContent,
      href: a.href,
      target: a.target,
      rel: a.rel,
    })),
    [
      {
        text: "Ben Pieratt",
        href: "https://twitter.com/pieratt",
        target: "_blank",
        rel: "noopener",
      },
      {
        text: "3-step naming process",
        href: "http://blog.pieratt.com/post/77293289254/a-3-step-process-for-naming-a-projectproduct",
        target: "_blank",
        rel: "noopener",
      },
    ]
  );
  assert.equal(heading(el), "Feelings");
  assert.deepEqual(vueErrors, []);
});

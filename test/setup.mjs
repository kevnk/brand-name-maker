// Preloaded with `node --import` (see `yarn test`): gives every test file a
// browser-like DOM and lets it `import` the real .vue files. No build step and
// no network: jsdom stands in for the browser, including localStorage.
import { readFileSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("<!doctype html><body></body>", {
  url: "http://localhost/",
});
for (const key of ["window", "document", "localStorage", "Event", "KeyboardEvent"]) {
  Object.defineProperty(globalThis, key, {
    value: window[key],
    configurable: true,
    writable: true,
  });
}

const { parseComponent } = createRequire(import.meta.url)("vue-template-compiler");

// A .vue file becomes a module whose default export carries its template.
// Vue's full build (see helpers.mjs) compiles that template at mount time.
// Styles are skipped.
registerHooks({
  load(url, context, nextLoad) {
    if (!url.endsWith(".vue")) return nextLoad(url, context);
    const { script, template } = parseComponent(
      readFileSync(fileURLToPath(url), "utf8")
    );
    const source =
      script.content.replace("export default", "const component =") +
      `\ncomponent.template = ${JSON.stringify(template.content)};` +
      "\nexport default component;\n";
    return { format: "module", source, shortCircuit: true };
  },
});

import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  { ignores: ["dist/", "**/*.bak-overflow-*"] },
  js.configs.recommended,
  ...pluginVue.configs["flat/vue2-essential"],
  { languageOptions: { globals: globals.browser } },
  {
    files: ["*.config.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  { files: ["test/**"], languageOptions: { globals: globals.node } },
];

import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "src/assets/js/main.min.js"],
  },
  {
    ...js.configs.recommended,
    files: ["src/assets/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
  },
  {
    ...js.configs.recommended,
    files: ["src/scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
];

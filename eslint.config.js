import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import stylisticJs from '@stylistic/eslint-plugin'


export default defineConfig([
  stylisticJs.configs.recommended,
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js, '@stylistic': stylisticJs }, extends: ["js/recommended"], rules: { '@stylistic/indent': ['error', 2] } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
]);
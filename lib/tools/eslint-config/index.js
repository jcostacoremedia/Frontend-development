/**
 * CoreMedia Blueprint eslint defaults for all bricks and themes.
 */

// Patch eslint to load the plugins as dependencies.
require("@rushstack/eslint-patch/modern-module-resolution");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  ignorePatterns: ["**/target/"],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "error",
    "no-var": "error",
  },
};

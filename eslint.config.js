import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

const DIR_RE =
  "(^|[\\s:!])-?(ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|scroll-ml|scroll-mr|scroll-pl|scroll-pr|text-left|text-right|float-left|float-right)(-|\\s|$)";
const DIR_MSG = "Use logical properties (ms-/me-/ps-/pe-/start-/end-/text-start/text-end)";

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules", "playwright-report", "test-results", "*.config.js"] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { projectService: true },
    },
  },
  reactHooks.configs.flat.recommended,
  {
    files: ["src/ui/**/*.{ts,tsx}", "src/state/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "BinaryExpression[operator='*']", message: "No arithmetic in UI: dose math belongs in src/engine" },
        { selector: "BinaryExpression[operator='/']", message: "No arithmetic in UI: dose math belongs in src/engine" },
        { selector: "AssignmentExpression[operator=/^(\\*|\\/|\\*\\*)=$/]", message: "No arithmetic in UI: dose math belongs in src/engine" },
        { selector: "BinaryExpression[operator='**']", message: "No arithmetic in UI: dose math belongs in src/engine" },
        { selector: `Literal[value=/${DIR_RE}/]`, message: DIR_MSG },
        { selector: `TemplateElement[value.raw=/${DIR_RE}/]`, message: DIR_MSG },
      ],
    },
  },
  {
    // Engine purity: no UI, content, state or React imports (keeps dose math testable and isolated).
    files: ["src/engine/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["**/ui/**", "**/content/**", "**/state/**"], message: "src/engine must stay pure" },
            { group: ["react", "react-dom", "react-router"], message: "src/engine must stay pure" },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    rules: { "@typescript-eslint/no-non-null-assertion": "off" },
  },
);

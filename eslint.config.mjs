import { defineConfig, globalIgnores } from "eslint/config";
import nextCore from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import js from "@eslint/js";

export default defineConfig([
  // Recommended JS rules
  js.configs.recommended,

  // Next.js rules (Core Web Vitals)
  ...nextCore,

  // TypeScript support
  ...nextTs,

  // Custom rules
  {
    rules: {
      // Example customizations:
      // "no-console": "warn",
      // "@next/next/no-img-element": "off",
    },
  },

  // Global ignores
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "dist/**",
    "build/**",
    ".husky/**",
    "*.log",
    "pnpm-lock.yaml",
    "yarn.lock",
    "package-lock.json",
  ]),
]);

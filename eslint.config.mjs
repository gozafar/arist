import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.url
});

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "postcss.config.mjs",
      "next.config.{mjs,js,cjs}",
      "**/.eslintrc.json",
      "**/tsconfig-paths-register.d.ts",
      "**/env.d.ts",
      ".vscode/*",
      "eslint.config.{cjs,mjs,js,json}",
      "**/node_modules",
      "**/package-lock.json",
      "**/yarn.lock",
      "**/pnpm-lock.yaml",
      "**/.next",
      "**/.husky",
      "**/logs",
      "**/loadtest.mjs",
      "**/build",
      "**/dist",
      "**/tsconfig.tsbuildinfo",
      "**/*.log",
      "**/npm-debug.log*",
      "**/yarn-debug.log*",
      "**/yarn-error.log*",
      "**/pnpm-debug.log*",
      "**/lerna-debug.log*",
      "sw.js",
      "sw.js.map",
      "workbox-*.js",
      "workbox-*.js.map",
      "**/public/sw.js",
      "**/public/workbox-*.js",
      "**/public/worker-*.js",
      "**/public/sw.js.map",
      "**/public/workbox-*.js.map",
      "**/public/worker-*.js.map",
      "**/test.{js,ts,mjs}",
      "**/op.{js,ts,mjs}",
      "node_modules",
      "dist",
      "build"
    ]
  }
];

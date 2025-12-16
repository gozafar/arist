// eslint.config.mjs
import globals from 'globals';
import Js from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import { fixupConfigRules } from '@eslint/compat';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
// import nextjs from 'eslint-config-next'; // Uncomment if needed

export default [
  prettier,
  Js.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: 'tsconfig.json',
      },
    },

    settings: {
      'import/resolver': { typescript: true, node: true },
      'react': { version: 'detect' },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'complexity': ['warn', { max: 320 }],
      'semi': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-undef': 'error',
      'no-var': 'warn',
      'no-empty-function': 'warn',
      'no-useless-escape': 'off',
      'no-unused-vars': 'error',
      'prefer-const': 'warn',
      'array-bracket-spacing': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    ignores: [
      'postcss.config.mjs',
      'next.config.{mjs,js,cjs}',
      '**/.eslintrc.json',
      '**/tsconfig-paths-register.d.ts',
      '**/env.d.ts',
      '.vscode/*',
      'eslint.config.{cjs,mjs,js,json}',
      '**/node_modules',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
      '**/.next',
      '**/.husky',
      '**/logs',
      '**/loadtest.mjs',
      '**/build',
      '**/dist',
      '**/tsconfig.tsbuildinfo',
      '**/logs',
      '**/*.log',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*',
      '**/pnpm-debug.log*',
      '**/lerna-debug.log*',
      // # PWA
      'sw.js',
      'sw.js.map',
      'workbox-*.js',
      'workbox-*.js.map',
      //# Auto Generated PWA files
      '**/public/sw.js',
      '**/public/workbox-*.js',
      '**/public/worker-*.js',
      '**/public/sw.js.map',
      '**/public/workbox-*.js.map',
      '**/public/worker-*.js.map',
      '**/test.{js,ts,mjs}',
      '**/op.{js,ts,mjs}',
      'node_modules', 'dist', 'build',
    ],
  },
];

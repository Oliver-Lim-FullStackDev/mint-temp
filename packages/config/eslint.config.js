import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import { fileURLToPath } from 'url';
import path             from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'eslint.config.js',
      'eslint.config.mjs'
    ],
  },
  {
    parser: "@typescript-eslint/parser",
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        project: [
          '../*/packages/*/tsconfig.eslint.json',
          '../*/apps/*/tsconfig.json',
          '../*/apps/*/tsconfig.eslint.json',
        ],
        tsconfigRootDir: __dirname, // import.meta.dirname,
      },
    },
    rules: {
      // turn off core rule to avoid duplicates, we use @typescript-eslint/no-unused-vars
      "no-unused-vars": 0,
      "no-empty": 0,
      "semi": ["error", "always"],

      '@typescript-eslint/consistent-type-imports': 2,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-floating-promises': 1,
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
      '@typescript-eslint/no-shadow': 2,
      '@typescript-eslint/no-redundant-type-constituents': 0,
      '@typescript-eslint/no-duplicate-type-constituents': 0,
      '@typescript-eslint/no-unsafe-argument': 1,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-namespace': 0,
    },
  },
);

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

const unusedVarsOptions = { argsIgnorePattern: '^_' };

export default [
  { ignores: ['**/dist', '**/build', '**/node_modules', '**/coverage'] },
  js.configs.recommended,
  { rules: { 'no-unused-vars': ['error', unusedVarsOptions] } },
  ...tseslint.configs.recommended.map((cfg) => ({ ...cfg, files: ['**/*.{ts,tsx}'] })),
  {
    files: ['**/*.{ts,tsx}'],
    rules: { '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions] },
  },
  {
    files: ['apps/api/**/*.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
    },
  },
  prettier,
];

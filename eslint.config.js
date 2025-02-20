// eslint config
// @AUTHOR CAIHUAZHI <huarse@gmail.com>
// @CREATE 2025/02/20 17:28

import pluginJs from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import pluginPrettier from 'eslint-plugin-prettier/recommended';

/** @type { import('eslint').Linter.Config[] } */
export default [
  { files: ['**/*.{ts,tsx}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  pluginPrettier,
  ...tsEslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/no-unused-expressions': ['warn'],
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },
];

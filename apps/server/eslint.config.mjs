import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").FlatConfig[]} */
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
          'turbo/no-undeclared-env-vars': 'off',
    },
  },
];

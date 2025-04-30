// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';

// Create a FlatCompat instance to support legacy "extends" syntax.
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
    // Plugins in legacy format must be an array of plugin names.
    plugins: ['react-hooks'],
    rules: {
      // Disable react-in-jsx-scope (not needed in React 17+)
      'react/react-in-jsx-scope': 'off',
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'off',
    },
  }),
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
];

export default eslintConfig;

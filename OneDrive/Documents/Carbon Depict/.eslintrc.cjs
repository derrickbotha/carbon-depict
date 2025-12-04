/**
 * ESLint Configuration - Phase 2 Week 7: Code Quality
 * Enhanced rules for production-ready code quality
 */

module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', 'server/node_modules'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh'],
  rules: {
    // React specific
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'warn',
    'prefer-template': 'warn',

    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['warn', 'all'],
    'no-throw-literal': 'error',
    'no-return-await': 'warn',
    'require-await': 'warn',
    'no-async-promise-executor': 'error',

    // Code complexity (Phase 2 Week 7)
    'complexity': ['warn', 15],
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
    'max-nested-callbacks': ['warn', 3],

    // Imports
    'no-duplicate-imports': 'error'
  },
}

const prettierrc = require('./.prettierrc.js');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  ignorePatterns: [".eslintrc.js"],
  plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      prettierrc,
      {
        usePrettierrc: false,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['features/*/*/*'],
      },
    ],
    'no-console': 'warn',
    'no-undef': 'off',
    'react/display-name': 0,
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 'off',
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
};
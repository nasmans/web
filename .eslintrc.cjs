/**
 * @file ESLint configuration for the Next.js project with Prettier integration.
 */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': ['error']
  }
};

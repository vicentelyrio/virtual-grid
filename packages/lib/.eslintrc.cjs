/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.cjs'],
  extends: ['@virtual-grid/eslint-config/index.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
}

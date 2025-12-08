## `@virtualgrid/eslint-config`

Shared ESLint configuration for the Virtual Grid monorepo.

### What this package does

- Provides a **preconfigured ESLint setup** for TypeScript + React projects
- Centralizes lint rules used across all apps and packages in this repo
- Can be reused in other projects for a consistent linting setup

### Installation

```bash
npm install --save-dev @virtualgrid/eslint-config
# or
yarn add -D @virtualgrid/eslint-config
```

### Usage

In your `.eslintrc.cjs` or `.eslintrc.js`:

```js
module.exports = {
  extends: ['@virtualgrid/eslint-config'],
}
```

### Included tooling

This config pulls in:

- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

### Notes

- Licensed under MIT, see the root `LICENSE`.
- The source for this package lives in `packages/eslint-config`.



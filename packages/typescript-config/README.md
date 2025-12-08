## `@virtualgrid/typescript-config`

Shared TypeScript configuration presets for the Virtual Grid monorepo.

### What this package does

- Provides **base `tsconfig` presets** for different environments:
  - `base.json` – core TS options
  - `next.json` – Next.js apps
  - `vite.json` – Vite-based apps and libraries
- Keeps TypeScript settings **consistent across all packages**.

### Usage

Install (if used outside this monorepo):

```bash
npm install --save-dev @virtualgrid/typescript-config
# or
yarn add -D @virtualgrid/typescript-config
```

In your `tsconfig.json`:

```json
{
  "extends": "@virtualgrid/typescript-config/base.json",
  "include": ["src"]
}
```

For a Next.js app:

```json
{
  "extends": "@virtualgrid/typescript-config/next.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

For a Vite app or library:

```json
{
  "extends": "@virtualgrid/typescript-config/vite.json",
  "include": ["src"]
}
```

### Notes

- Licensed under MIT, see the root `LICENSE`.
- The source for this package lives in `packages/typescript-config`.



## `@virtual-grid/playground`

Playground app for the Virtual Grid library, powered by React Cosmos.

### What this package does

- Provides an **interactive environment** to try `@virtual-grid/lib`
- Contains **fixtures and examples** for exploring different grid configurations
- Is intended for **local development only** (not published)

### Development

From the repo root:

```bash
yarn install
yarn dev:playground
```

Or directly inside `apps/playground`:

```bash
cd apps/playground
yarn dev
```

This will start the Cosmos UI where you can browse and tweak fixtures.

### Scripts

- `yarn dev` – Start React Cosmos
- `yarn build` – Export Cosmos fixtures as a static bundle
- `yarn typecheck` – Run TypeScript type checking
- `yarn lint` – Run ESLint on the playground source

### Notes

- This package is **private** and not published to npm.
- It imports `@virtual-grid/lib` to showcase and test the library API.



## `@virtual-grid/docs`

Documentation site for the Virtual Grid library, built with Next.js and Nextra.

### What this package does

- **Hosts the docs site** for `virtual-grid`
- Includes **guides, API reference, and examples**
- Is intended for **local development and deployment as a static site**

### Development

From the repo root:

```bash
yarn install
yarn dev         # runs all apps, including docs
```

Or directly inside `apps/docs`:

```bash
cd apps/docs
yarn dev
```

### Scripts

- `yarn dev` – Run the docs site in development mode
- `yarn build` – Build the production version of the docs
- `yarn start` – Start the production build

### Notes

- This package is **private** and not published to npm.
- It depends on `virtual-grid` to render live examples.



## Contributing to Virtual Grid

Thanks for taking the time to contribute!

This project is a **Yarn + Turborepo monorepo** with multiple packages:

- `@virtual-grid/lib` – main library
- `@virtual-grid/docs` – documentation site (Next.js + Nextra)
- `@virtual-grid/playground` – React Cosmos playground
- `@virtual-grid/eslint-config` – shared ESLint config
- `@virtual-grid/typescript-config` – shared TypeScript configs

Please read this document before opening a pull request.

---

### 1. Prerequisites

- **Node.js**: `>= 18`
- **Yarn**: repo uses classic Yarn (see `packageManager` in `package.json`)

Install dependencies from the repo root:

```bash
yarn install
```

---

### 2. Project layout

```text
virtual-grid/
├── apps/
│   ├── docs/          # Next.js docs site
│   └── playground/    # React Cosmos playground
├── packages/
│   ├── lib/           # Main virtual-grid library
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared TS configurations
└── openspec/          # Project specs and change proposals
```

---

### 3. Development workflow

From the repo root:

```bash
# Install dependencies
yarn install

# Run all dev targets (docs + playground + any others)
yarn dev

# Only playground (React Cosmos)
yarn dev:playground

# Only library (build in watch mode)
yarn dev:lib
```

Common tasks:

```bash
# Build all packages and apps
yarn build

# Lint all packages
yarn lint

# Typecheck all packages
yarn typecheck

# Run tests
yarn test
yarn test:watch
yarn test:coverage
```

For package-specific work, you can `cd` into the package and use its local scripts (e.g. `cd packages/lib && yarn test`).

---

### 4. Making changes

1. **Fork** the repo and create a feature branch:
   ```bash
   git checkout -b feat/my-change
   ```
2. **Implement** your changes, keeping them focused and small.
3. **Add tests** for new behavior (especially for `@virtual-grid/lib`):
   - Unit tests for utils
   - Hook tests for `useVirtualGrid` and related hooks
4. **Run checks** before committing:
   ```bash
   yarn lint
   yarn typecheck
   yarn test
   ```

---

### 5. Changesets (versioning)

This repo uses **Changesets** to manage versions and changelogs.

When you make a change that affects a published package (for now, primarily `@virtual-grid/lib`):

```bash
yarn cs:add
```

The CLI will ask:

- Which package(s) are affected
- What type of change:
  - **major** – breaking change to the public API
  - **minor** – new, backwards-compatible feature
  - **patch** – bug fix or internal improvement
- A short description (will appear in the changelog)

Commit the generated file in `.changeset/` together with your code changes.

You **do not need** to run `yarn cs:version` or `yarn cs:publish` in a normal PR; that’s usually done as part of the release process.

---

### 6. Specs and proposals (`openspec/`)

Larger or behavioral changes may require a spec/update in `openspec/`:

- Specs describe **what the system does** (current truth).
- Changes under `openspec/changes/` describe **what should change**.

If you are making a substantial change (new capability, breaking behavior, or architectural shift), prefer:

- Adding a change proposal under `openspec/changes/<change-id>/`
- Updating or adding spec deltas as needed

If you’re unsure whether your change needs this, open an issue or draft PR and describe the impact; we can decide together.

---

### 7. Commit & PR guidelines

- Use **clear, descriptive commit messages**.
- Keep pull requests **small and focused** when possible.
- In your PR description, include:
  - What changed and why
  - Any breaking changes
  - How it was tested (commands, scenarios)

For visual or behavior changes, screenshots or short descriptions of before/after behavior are helpful.

---

### 8. CI/CD

#### Continuous Integration

Every pull request and push to `main` triggers the CI workflow, which runs:

1. **Lint** (`yarn lint`) – ESLint checks across all packages
2. **Typecheck** (`yarn typecheck`) – TypeScript compilation checks
3. **Test** (`yarn test`) – Jest test suites

**PRs must pass all CI checks before merging.**

You can run these locally before pushing:

```bash
yarn lint
yarn typecheck
yarn test
```

#### Releases

Releases are fully automated via **Changesets** and **GitHub Actions**.

**For contributors – just remember to add a changeset:**

```bash
yarn cs:add
```

Commit the generated `.changeset/*.md` file with your PR. That's it!

**How the automated release works:**

1. PRs with changesets get merged to `main`
2. The Changesets bot automatically creates/updates a **"Release packages"** PR
3. This PR contains version bumps and changelog updates
4. When a maintainer merges the release PR → packages are published to npm

```
Feature PR (with changeset) → merged to main
                ↓
    Bot creates "Release packages" PR
                ↓
    Maintainer merges release PR
                ↓
    Packages published to npm automatically
```

**Required secrets (for maintainers):**

| Secret | Purpose |
|--------|---------|
| `NPM_TOKEN` | Authentication for npm publish |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions |

---

### 9. Running docs & playground

To work on docs:

```bash
cd apps/docs
yarn dev
```

To work on the playground:

```bash
cd apps/playground
yarn dev
```

These apps are intended for **local development** and are not published.

---

### 10. Code style

- TypeScript-first, React hooks-based.
- Prefer small, focused utilities and hooks.
- Keep exports stable and explicit in `@virtual-grid/lib` – they define the public API.

Linting and TypeScript configs are centralized in:

- `@virtual-grid/eslint-config`
- `@virtual-grid/typescript-config`

Use them as references if you’re unsure about style or compiler options.

---

### 11. Questions / help

If something is unclear or you’re not sure how to shape a change:

- Open a **GitHub discussion or issue** describing what you want to do.
- Or open a **draft PR** early to get feedback on direction.

Thank you for contributing to Virtual Grid ❤️



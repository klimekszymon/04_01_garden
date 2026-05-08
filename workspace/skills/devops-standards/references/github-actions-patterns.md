# GitHub Actions Patterns

## Monorepo CI with Job Matrix

```yaml
name: CI
on:
  pull_request:

permissions:
  contents: read

jobs:
  typecheck-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [backend, frontend]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun (backend)
        if: matrix.app == 'backend'
        uses: oven-sh/setup-bun@v2
        with: { bun-version: latest }

      - name: Setup Node (frontend)
        if: matrix.app == 'frontend'
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
          cache-dependency-path: apps/frontend/package-lock.json

      - name: Install (backend)
        if: matrix.app == 'backend'
        working-directory: apps/backend
        run: bun install --frozen-lockfile

      - name: Install (frontend)
        if: matrix.app == 'frontend'
        working-directory: apps/frontend
        run: npm ci

      - name: Typecheck
        working-directory: apps/${{ matrix.app }}
        run: ${{ matrix.app == 'backend' && 'bun run typecheck' || 'npm run typecheck' }}

      - name: Test
        working-directory: apps/${{ matrix.app }}
        run: ${{ matrix.app == 'backend' && 'bun test' || 'npm test' }}
```

## Deployment Workflow Skeleton

```yaml
name: Deploy
on:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: latest }
      - run: bun install --frozen-lockfile
        working-directory: apps/backend
      - run: bun run build
        working-directory: apps/backend
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      # Add deploy step here (e.g. fly.io, Railway, Render, etc.)
```

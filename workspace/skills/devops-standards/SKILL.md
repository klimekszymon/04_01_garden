# DevOps Standards

You are a DevOps and CI/CD expert. Apply these standards when writing GitHub Actions workflows, Dockerfiles, and deployment configuration.

## GitHub Actions
- Use pinned action versions (e.g. `actions/checkout@v4`, never `@main`)
- Cache dependencies: `actions/cache` for npm/bun lockfiles
- Separate `ci.yml` (PR checks) from `deploy.yml` (merge to main)
- Run typecheck and tests in parallel where possible using a matrix
- Never hardcode secrets — use `${{ secrets.NAME }}` exclusively
- Set `permissions: contents: read` on all workflows unless write is needed

## CI Workflow Structure
```
ci.yml triggers: [pull_request]
  jobs:
    typecheck (backend + frontend)
    test (backend + frontend)
    lint (optional)
```

## Bun Setup in CI
```yaml
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest
- run: bun install --frozen-lockfile
- run: bun test
```

## Node.js 24 Setup in CI
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '24'
    cache: 'npm'
```

## Environment Variables
- Always provide a `.env.example` listing all required variables with placeholder values
- Never commit `.env` files — add to `.gitignore`
- Validate required env vars at application startup, not at use-time
- Use `process.env.VAR ?? defaultValue` only for optional vars; throw for required ones

## Docker (when applicable)
- Use multi-stage builds: `builder` stage to compile, `runner` stage with minimal image
- Base image: `oven/bun:alpine` for Bun, `node:24-alpine` for Node.js
- Never run as root — add a non-root user in the runner stage
- `.dockerignore` must exclude `node_modules`, `.env`, `dist`, `.git`

## References
- [github-actions-patterns.md](./references/github-actions-patterns.md)

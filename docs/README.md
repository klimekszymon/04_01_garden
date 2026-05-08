# Dev Assistant — Implementation Docs

This directory contains the implementation plan for extending the Mastra dev assistant beyond the core tutorial.

## Files

- [plan.md](./plan.md) — Full atomic task breakdown across all phases
- [architecture.md](./architecture.md) — System architecture overview

## Stack

| Layer | Technology |
|-------|-----------|
| AI Framework | Mastra (`@mastra/core`) |
| Backend | Bun / Node.js 24, TypeScript, Hono |
| Frontend | Vue 3, TypeScript, Vite, Pinia |
| Storage | LibSQL (default) + DuckDB (observability) |
| CI/CD | GitHub Actions |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project structure & API layer | 🔄 In progress |
| 2 | Specialized agent skills | ⬜ Pending |
| 3 | Specialized agents | ⬜ Pending |
| 4 | GitHub integration | ⬜ Pending |
| 5 | Vue.js frontend | ⬜ Pending |
| 6 | Multi-agent workflow | ⬜ Pending |
| 7 | CI/CD pipeline | ⬜ Pending |

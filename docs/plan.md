# Implementation Plan: Dev Assistant Next Steps

**Stack:** Mastra backend (Bun + Node.js 24, TypeScript) · Vue 3 frontend (TypeScript)

---

## Phase 1 — Project Structure & API Layer

| # | Task | Status |
|---|------|--------|
| 1.1 | Scaffold `apps/backend` directory with Bun + TypeScript (`bun init`, `tsconfig.json`) | ⬜ |
| 1.2 | Scaffold `apps/frontend` with `npm create vue@latest` (Vue 3 + TS + Vite) | ⬜ |
| 1.3 | Add `package.json` workspaces at repo root for monorepo | ⬜ |
| 1.4 | Create `apps/backend/src/server.ts` — Hono HTTP server wiring up Mastra | ⬜ |
| 1.5 | Add streaming endpoint `POST /api/agents/:id/stream` using Server-Sent Events | ⬜ |
| 1.6 | Add `GET /api/agents` endpoint listing available agents | ⬜ |
| 1.7 | Add CORS middleware and request validation (Zod) to backend | ⬜ |
| 1.8 | Write smoke tests for all endpoints with Bun's built-in test runner | ⬜ |

---

## Phase 2 — Specialized Agent Skills

| # | Task | Status |
|---|------|--------|
| 2.1 | Create `workspace/skills/backend-standards/SKILL.md` — Node.js/Bun/TS conventions, REST patterns, DB patterns | ⬜ |
| 2.2 | Create `workspace/skills/frontend-standards/SKILL.md` — Vue 3 Composition API, Pinia, Vite conventions | ⬜ |
| 2.3 | Create `workspace/skills/devops-standards/SKILL.md` — GitHub Actions, Docker, environment config patterns | ⬜ |
| 2.4 | Add reference docs to each skill (`references/` subdirs) as needed | ⬜ |

---

## Phase 3 — Specialized Agents

| # | Task | Status |
|---|------|--------|
| 3.1 | Create `src/mastra/agents/backend-agent.ts` — activates `backend-standards` skill | ⬜ |
| 3.2 | Create `src/mastra/agents/frontend-agent.ts` — activates `frontend-standards` skill | ⬜ |
| 3.3 | Create `src/mastra/agents/devops-agent.ts` — activates `devops-standards` skill | ⬜ |
| 3.4 | Register all three agents in `src/mastra/index.ts` | ⬜ |
| 3.5 | Verify each agent responds correctly via Mastra Studio | ⬜ |

---

## Phase 4 — GitHub Integration

| # | Task | Status |
|---|------|--------|
| 4.1 | Install `@octokit/rest` and configure GitHub tool with `GITHUB_TOKEN` env var | ⬜ |
| 4.2 | Create `src/mastra/tools/github-tool.ts` — wraps `getPR`, `listPRFiles`, `postReview` | ⬜ |
| 4.3 | Create `src/mastra/agents/pr-review-agent.ts` — fetches diff, applies standards, posts review | ⬜ |
| 4.4 | Add `POST /api/github/review` endpoint in backend | ⬜ |
| 4.5 | Add GitHub webhook handler `POST /api/github/webhook` — triggers review on `pull_request.opened` | ⬜ |
| 4.6 | Write integration test for webhook handler with mock PR payload | ⬜ |

---

## Phase 5 — Vue.js Frontend

| # | Task | Status |
|---|------|--------|
| 5.1 | Install and configure Pinia, Vue Router, and Tailwind CSS in `apps/frontend` | ⬜ |
| 5.2 | Create `AgentStore` (Pinia) — fetches agent list, tracks active agent, manages conversation history | ⬜ |
| 5.3 | Create `ChatMessage.vue` — renders user/assistant messages with markdown support | ⬜ |
| 5.4 | Create `ChatInput.vue` — textarea with submit, Enter key, disabled state during streaming | ⬜ |
| 5.5 | Create `ChatWindow.vue` — composes message list + input, auto-scrolls | ⬜ |
| 5.6 | Create `AgentSelector.vue` — tabs to switch between agents | ⬜ |
| 5.7 | Implement SSE streaming in `AgentStore` — `EventSource` appends tokens to active message | ⬜ |
| 5.8 | Create `PRReviewPanel.vue` — input for GitHub PR URL, displays review output | ⬜ |
| 5.9 | Create `AppLayout.vue` + router with routes `/chat`, `/pr-review`, `/workflow` | ⬜ |
| 5.10 | Add loading skeletons, error boundary component, and empty states | ⬜ |
| 5.11 | Run `vue-tsc --noEmit` and fix all type errors | ⬜ |

---

## Phase 6 — Multi-Agent Workflow

| # | Task | Status |
|---|------|--------|
| 6.1 | Create `src/mastra/workflows/feature-dev-workflow.ts` — backend-agent → frontend-agent → devops-agent | ⬜ |
| 6.2 | Add `featureSpec` Zod input schema to workflow (name, description, target files) | ⬜ |
| 6.3 | Add inter-step context passing — each agent receives prior agent's output | ⬜ |
| 6.4 | Register workflow in `src/mastra/index.ts` | ⬜ |
| 6.5 | Add `POST /api/workflows/feature-dev` endpoint in backend | ⬜ |
| 6.6 | Create `WorkflowPanel.vue` — form to submit spec, shows step-by-step progress | ⬜ |
| 6.7 | Add route `/workflow` to Vue Router | ⬜ |

---

## Phase 7 — CI/CD Pipeline

| # | Task | Status |
|---|------|--------|
| 7.1 | Create `.github/workflows/ci.yml` — typecheck + test on PR for both apps | ⬜ |
| 7.2 | Add `test` script to `apps/frontend/package.json` using Vitest | ⬜ |
| 7.3 | Add `typecheck` scripts to both apps | ⬜ |
| 7.4 | Create `.github/workflows/deploy.yml` — build and deploy on merge to `main` | ⬜ |
| 7.5 | Add `.env.example` files for both apps | ⬜ |

---

## Suggested Implementation Order

```
Phase 1 → Phase 2 → Phase 3 → Phase 5 (1-7) → Phase 4 → Phase 5 (8-11) → Phase 6 → Phase 7
```

Get the API layer and specialized agents working before connecting the Vue frontend.
GitHub integration follows stable agents. Multi-agent workflow last.

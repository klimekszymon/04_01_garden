# System Architecture

## Repository Layout

```
04_01_garden/
├── apps/
│   ├── backend/                  # Bun + Hono API server
│   │   ├── src/
│   │   │   ├── server.ts         # HTTP server entry point
│   │   │   └── routes/           # Route handlers
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/                 # Vue 3 + Vite SPA
│       ├── src/
│       │   ├── components/       # ChatMessage, ChatInput, etc.
│       │   ├── stores/           # Pinia: AgentStore
│       │   ├── views/            # Chat, PRReview, Workflow
│       │   ├── router/           # Vue Router config
│       │   └── App.vue
│       ├── package.json
│       └── tsconfig.json
├── src/
│   └── mastra/
│       ├── agents/               # All Mastra agents
│       │   ├── dev-assistant.ts
│       │   ├── backend-agent.ts
│       │   ├── frontend-agent.ts
│       │   ├── devops-agent.ts
│       │   └── pr-review-agent.ts
│       ├── tools/
│       │   └── github-tool.ts
│       ├── workflows/
│       │   └── feature-dev-workflow.ts
│       └── index.ts              # Mastra instance
├── workspace/
│   ├── skills/
│   │   ├── coding-standards/     # Existing
│   │   ├── backend-standards/    # New
│   │   ├── frontend-standards/   # New
│   │   └── devops-standards/     # New
│   └── src/
├── docs/                         # This directory
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
└── package.json                  # Monorepo root
```

## Data Flow

### Chat Flow
```
Vue ChatWindow
  → POST /api/agents/:id/stream (SSE)
    → apps/backend/src/server.ts
      → mastra.getAgent(id).stream(messages)
        → Mastra agent (with workspace skills + memory)
          → SSE tokens back to frontend
```

### PR Review Flow
```
GitHub webhook (pull_request.opened)
  → POST /api/github/webhook
    → validate signature
      → pr-review-agent.generate({ prUrl })
        → github-tool: fetch diff
        → apply coding-standards skill
        → github-tool: post review comment
```

### Multi-Agent Feature Dev Flow
```
POST /api/workflows/feature-dev { featureSpec }
  → feature-dev-workflow
    → Step 1: backend-agent  → writes API code
    → Step 2: frontend-agent → writes Vue component (receives step 1 output)
    → Step 3: devops-agent   → writes CI/deploy config (receives steps 1+2 output)
  → WorkflowPanel streams step progress via SSE
```

## Environment Variables

| Variable | Used by | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | Mastra agents | LLM provider key |
| `GITHUB_TOKEN` | github-tool | GitHub API access for PR reviews |
| `VITE_API_URL` | Frontend | Backend API base URL |
| `PORT` | Backend | HTTP server port (default: 3000) |

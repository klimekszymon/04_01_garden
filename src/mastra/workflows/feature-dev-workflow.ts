import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { backendAgent } from '../agents/backend-agent.js'
import { frontendAgent } from '../agents/frontend-agent.js'
import { devopsAgent } from '../agents/devops-agent.js'

const featureSpecSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  targetFiles: z.array(z.string()).default([]),
})

const backendStep = createStep({
  id: 'backend-step',
  description: 'Backend agent implements the API layer for the feature',
  inputSchema: featureSpecSchema,
  outputSchema: z.object({ implementation: z.string() }),
  execute: async ({ inputData }) => {
    const prompt = `Implement the backend API for this feature:

Feature: ${inputData.name}
Description: ${inputData.description}
${inputData.targetFiles.length ? `Target files: ${inputData.targetFiles.join(', ')}` : ''}

Write the Hono route handlers, Zod validation, and Bun tests. Follow backend-standards.`

    const result = await backendAgent.generate([{ role: 'user', content: prompt }])
    return { implementation: result.text }
  },
})

const frontendStep = createStep({
  id: 'frontend-step',
  description: 'Frontend agent implements the Vue 3 UI for the feature',
  inputSchema: featureSpecSchema.extend({
    backendImplementation: z.string(),
  }),
  outputSchema: z.object({ implementation: z.string() }),
  execute: async ({ inputData }) => {
    const prompt = `Implement the Vue 3 frontend for this feature:

Feature: ${inputData.name}
Description: ${inputData.description}
${inputData.targetFiles.length ? `Target files: ${inputData.targetFiles.join(', ')}` : ''}

The backend API has already been implemented:
<backend-implementation>
${inputData.backendImplementation}
</backend-implementation>

Write the Vue 3 components using <script setup lang="ts">, Pinia store, and Vitest tests. Follow frontend-standards.`

    const result = await frontendAgent.generate([{ role: 'user', content: prompt }])
    return { implementation: result.text }
  },
})

const devopsStep = createStep({
  id: 'devops-step',
  description: 'DevOps agent writes CI/CD config for the feature',
  inputSchema: featureSpecSchema.extend({
    backendImplementation: z.string(),
    frontendImplementation: z.string(),
  }),
  outputSchema: z.object({ implementation: z.string() }),
  execute: async ({ inputData }) => {
    const prompt = `Write CI/CD and deployment configuration for this feature:

Feature: ${inputData.name}
Description: ${inputData.description}

Backend was implemented with Bun + Hono + TypeScript.
Frontend was implemented with Vue 3 + Vite + TypeScript.

Write GitHub Actions CI workflow (ci.yml) that typechecks and tests both apps.
Add any new environment variables to .env.example.
Follow devops-standards.`

    const result = await devopsAgent.generate([{ role: 'user', content: prompt }])
    return { implementation: result.text }
  },
})

export const featureDevWorkflow = createWorkflow({
  id: 'feature-dev-workflow',
  name: 'Feature Development Workflow',
  inputSchema: featureSpecSchema,
  outputSchema: z.object({
    backend: z.string(),
    frontend: z.string(),
    devops: z.string(),
  }),
})
  .then(backendStep)
  .then(frontendStep)
  .then(devopsStep)
  .commit()

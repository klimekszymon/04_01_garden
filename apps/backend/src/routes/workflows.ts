import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { z } from 'zod'
import { mastra } from '../../../../src/mastra/index.js'

export const workflowsRouter = new Hono()

const featureSpecSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  targetFiles: z.array(z.string()).optional().default([]),
})

workflowsRouter.post('/feature-dev', async (c) => {
  const body = await c.req.json()
  const parsed = featureSpecSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400)
  }

  const workflow = mastra.getWorkflow('feature-dev-workflow')
  if (!workflow) {
    return c.json({ error: 'feature-dev-workflow not configured' }, 503)
  }

  return streamSSE(c, async (stream) => {
    const run = workflow.createRun()
    const result = await run.start({ inputData: parsed.data })

    for (const [stepId, stepResult] of Object.entries(result.steps ?? {})) {
      await stream.writeSSE({
        data: JSON.stringify({ step: stepId, result: stepResult }),
      })
    }

    await stream.writeSSE({ data: JSON.stringify({ done: true, final: result }) })
  })
})

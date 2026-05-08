import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { z } from 'zod'
import { mastra } from '../../../../src/mastra/index.js'

export const agentsRouter = new Hono()

agentsRouter.get('/', async (c) => {
  const agents = mastra.getAgents()
  const list = Object.entries(agents).map(([id, agent]) => ({
    id,
    name: (agent as { name?: string }).name ?? id,
  }))
  return c.json(list)
})

const chatBodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
})

agentsRouter.post('/:id/chat', async (c) => {
  const agentId = c.req.param('id')
  const body = await c.req.json()
  const parsed = chatBodySchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400)
  }

  const agent = mastra.getAgent(agentId)
  if (!agent) {
    return c.json({ error: `Agent '${agentId}' not found` }, 404)
  }

  const response = await agent.generate(parsed.data.messages)
  return c.json({ text: response.text })
})

agentsRouter.post('/:id/stream', async (c) => {
  const agentId = c.req.param('id')
  const body = await c.req.json()
  const parsed = chatBodySchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400)
  }

  const agent = mastra.getAgent(agentId)
  if (!agent) {
    return c.json({ error: `Agent '${agentId}' not found` }, 404)
  }

  return streamSSE(c, async (stream) => {
    const result = await agent.stream(parsed.data.messages)
    for await (const chunk of result.textStream) {
      await stream.writeSSE({ data: JSON.stringify({ token: chunk }) })
    }
    await stream.writeSSE({ data: JSON.stringify({ done: true }) })
  })
})

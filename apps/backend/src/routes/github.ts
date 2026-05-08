import { Hono } from 'hono'
import { z } from 'zod'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { mastra } from '../../../../src/mastra/index.js'

export const githubRouter = new Hono()

const reviewBodySchema = z.object({
  prUrl: z.string().url(),
})

githubRouter.post('/review', async (c) => {
  const body = await c.req.json()
  const parsed = reviewBodySchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400)
  }

  const agent = mastra.getAgent('pr-review-agent')
  if (!agent) {
    return c.json({ error: 'PR review agent not configured' }, 503)
  }

  const response = await agent.generate([
    { role: 'user', content: `Review this pull request: ${parsed.data.prUrl}` },
  ])
  return c.json({ review: response.text })
})

githubRouter.post('/webhook', async (c) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (secret) {
    const signature = c.req.header('x-hub-signature-256')
    if (!signature) {
      return c.json({ error: 'Missing signature' }, 401)
    }
    const rawBody = await c.req.text()
    const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`
    const sigBuffer = Buffer.from(signature)
    const expBuffer = Buffer.from(expected)
    if (sigBuffer.length !== expBuffer.length || !timingSafeEqual(sigBuffer, expBuffer)) {
      return c.json({ error: 'Invalid signature' }, 401)
    }
    const payload = JSON.parse(rawBody)
    await handleWebhookPayload(payload)
  } else {
    const payload = await c.req.json()
    await handleWebhookPayload(payload)
  }

  return c.json({ received: true })
})

async function handleWebhookPayload(payload: Record<string, unknown>) {
  if (payload.action !== 'opened' && payload.action !== 'synchronize') return

  const pr = payload.pull_request as Record<string, unknown> | undefined
  const prUrl = pr?.html_url as string | undefined
  if (!prUrl) return

  const agent = mastra.getAgent('pr-review-agent')
  if (!agent) return

  await agent.generate([
    { role: 'user', content: `Review this pull request: ${prUrl}` },
  ])
}

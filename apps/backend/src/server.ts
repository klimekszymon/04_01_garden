import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { agentsRouter } from './routes/agents.js'
import { githubRouter } from './routes/github.js'
import { workflowsRouter } from './routes/workflows.js'

const app = new Hono()

app.use('*', cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/api/agents', agentsRouter)
app.route('/api/github', githubRouter)
app.route('/api/workflows', workflowsRouter)

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, () => {
  console.log(`Backend running on http://localhost:${port}`)
})

export default app

# Backend Testing Patterns

## Route Testing with Hono

```typescript
import { describe, it, expect } from 'bun:test'
import app from '../server.js'

describe('POST /api/agents/:id/chat', () => {
  it('returns 400 for missing messages', async () => {
    const res = await app.fetch(
      new Request('http://localhost/api/agents/dev-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
```

## Mocking Mastra Agents in Tests

```typescript
import { mock } from 'bun:test'

mock.module('../../../../src/mastra/index.js', () => ({
  mastra: {
    getAgent: (id: string) => id === 'dev-assistant'
      ? { generate: async () => ({ text: 'mocked response' }) }
      : null,
    getAgents: () => ({ 'dev-assistant': { name: 'Dev Assistant' } }),
  },
}))
```

## SSE Streaming Test

```typescript
it('streams tokens via SSE', async () => {
  const res = await app.fetch(
    new Request('http://localhost/api/agents/dev-assistant/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
    })
  )
  expect(res.headers.get('content-type')).toContain('text/event-stream')
})
```

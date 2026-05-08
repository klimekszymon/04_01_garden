import { describe, it, expect } from 'bun:test'
import app from '../server.js'

describe('health endpoint', () => {
  it('returns ok', async () => {
    const req = new Request('http://localhost/health')
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ status: 'ok' })
  })
})

describe('GET /api/agents', () => {
  it('returns array of agents', async () => {
    const req = new Request('http://localhost/api/agents')
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })
})

describe('POST /api/agents/:id/chat - validation', () => {
  it('returns 400 for missing messages', async () => {
    const req = new Request('http://localhost/api/agents/dev-assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const res = await app.fetch(req)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/github/webhook', () => {
  it('returns 200 for non-PR events', async () => {
    const req = new Request('http://localhost/api/github/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'labeled' }),
    })
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
  })
})

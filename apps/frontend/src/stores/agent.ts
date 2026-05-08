import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AgentInfo {
  id: string
  name: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export const useAgentStore = defineStore('agent', () => {
  const agents = ref<AgentInfo[]>([])
  const activeAgentId = ref<string>('')
  const messages = ref<Message[]>([])
  const isStreaming = ref(false)
  const error = ref<string | null>(null)

  const activeAgent = computed(() =>
    agents.value.find((a) => a.id === activeAgentId.value) ?? null
  )

  async function fetchAgents() {
    const res = await fetch(`${API_BASE}/api/agents`)
    if (!res.ok) throw new Error('Failed to fetch agents')
    agents.value = await res.json()
    if (agents.value.length > 0 && !activeAgentId.value) {
      activeAgentId.value = agents.value[0].id
    }
  }

  function selectAgent(id: string) {
    activeAgentId.value = id
    messages.value = []
    error.value = null
  }

  async function sendMessage(content: string) {
    if (!activeAgentId.value || isStreaming.value) return

    messages.value.push({ role: 'user', content })
    const assistantMsg: Message = { role: 'assistant', content: '', streaming: true }
    messages.value.push(assistantMsg)
    isStreaming.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/api/agents/${activeAgentId.value}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.value.slice(0, -1) }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`Server error: ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter((l) => l.startsWith('data:'))
        for (const line of lines) {
          const json = JSON.parse(line.slice(5).trim())
          if (json.token) {
            assistantMsg.content += json.token
          }
          if (json.done) break
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      messages.value.pop()
    } finally {
      assistantMsg.streaming = false
      isStreaming.value = false
    }
  }

  return { agents, activeAgentId, activeAgent, messages, isStreaming, error, fetchAgents, selectAgent, sendMessage }
})

# Vue 3 Patterns

## Setup Store (Pinia)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgentStore = defineStore('agent', () => {
  const items = ref<Item[]>([])
  const loading = ref(false)

  const count = computed(() => items.value.length)

  async function fetchItems() {
    loading.value = true
    try {
      const res = await fetch('/api/items')
      items.value = await res.json()
    } finally {
      loading.value = false
    }
  }

  return { items, loading, count, fetchItems }
})
```

## Typed Props and Emits

```vue
<script setup lang="ts">
interface Props {
  message: string
  disabled?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', value: string): void
  (e: 'cancel'): void
}>()
</script>
```

## SSE with EventSource

```typescript
// In a Pinia store action
let source: EventSource | null = null

function startStream(agentId: string) {
  source = new EventSource(`/api/agents/${agentId}/stream`)
  source.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.token) output.value += data.token
    if (data.done) source?.close()
  }
  source.onerror = () => source?.close()
}

function stopStream() {
  source?.close()
  source = null
}
```

## Auto-scroll Pattern

```vue
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const container = ref<HTMLElement | null>(null)

watch(() => messages.value.length, async () => {
  await nextTick()
  container.value?.scrollTo({ top: container.value.scrollHeight, behavior: 'smooth' })
})
</script>
```

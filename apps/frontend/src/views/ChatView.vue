<script setup lang="ts">
import { onMounted } from 'vue'
import { useAgentStore } from '../stores/agent.js'
import AgentSelector from '../components/AgentSelector.vue'
import ChatWindow from '../components/ChatWindow.vue'

const store = useAgentStore()

onMounted(async () => {
  if (store.agents.length === 0) {
    await store.fetchAgents()
  }
})
</script>

<template>
  <div class="chat-view">
    <div class="toolbar">
      <AgentSelector />
    </div>
    <ChatWindow />
  </div>
</template>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}
.toolbar {
  padding-top: 4px;
}
</style>

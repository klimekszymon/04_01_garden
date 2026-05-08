<script setup lang="ts">
import { useAgentStore } from '../stores/agent.js'

const store = useAgentStore()
</script>

<template>
  <div class="agent-selector">
    <button
      v-for="agent in store.agents"
      :key="agent.id"
      :class="['agent-tab', { active: store.activeAgentId === agent.id }]"
      @click="store.selectAgent(agent.id)"
    >
      {{ agent.name }}
    </button>
  </div>
</template>

<style scoped>
.agent-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.agent-tab {
  padding: 6px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s, color 0.15s;
}
.agent-tab:hover {
  background: #f0f0f0;
}
.agent-tab.active {
  background: #1a1a2e;
  color: #fff;
  border-color: #1a1a2e;
}
</style>

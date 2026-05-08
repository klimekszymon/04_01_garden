<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useAgentStore } from '../stores/agent.js'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'

const store = useAgentStore()
const scrollContainer = ref<HTMLElement | null>(null)

watch(
  () => store.messages.length,
  async () => {
    await nextTick()
    scrollContainer.value?.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: 'smooth' })
  }
)
</script>

<template>
  <div class="chat-window">
    <div class="messages" ref="scrollContainer">
      <div v-if="store.messages.length === 0" class="empty">
        Start a conversation with <strong>{{ store.activeAgent?.name ?? 'the agent' }}</strong>.
      </div>
      <ChatMessage
        v-for="(msg, i) in store.messages"
        :key="i"
        :message="msg"
      />
    </div>

    <div v-if="store.error" class="error">{{ store.error }}</div>

    <ChatInput
      :disabled="store.isStreaming"
      @send="store.sendMessage"
    />
  </div>
</template>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}
.empty {
  text-align: center;
  color: #999;
  margin: auto;
  font-size: 14px;
}
.error {
  color: #c0392b;
  font-size: 13px;
  padding: 4px 0;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { Message } from '../stores/agent.js'

const props = defineProps<{ message: Message }>()

const html = computed(() => marked.parse(props.message.content))
</script>

<template>
  <div :class="['message', message.role]">
    <div class="bubble" v-html="html" />
    <span v-if="message.streaming" class="cursor">▍</span>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-bottom: 12px;
}
.message.user {
  align-self: flex-end;
  align-items: flex-end;
}
.message.assistant {
  align-self: flex-start;
  align-items: flex-start;
}
.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}
.message.user .bubble {
  background: #1a1a2e;
  color: #fff;
}
.message.assistant .bubble {
  background: #f4f4f4;
  color: #222;
}
.cursor {
  animation: blink 0.8s step-start infinite;
  font-size: 16px;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>

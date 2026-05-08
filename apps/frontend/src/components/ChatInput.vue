<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ disabled: boolean }>()
const emit = defineEmits<{ (e: 'send', text: string): void }>()

const text = ref('')

function submit() {
  const trimmed = text.value.trim()
  if (!trimmed || props.disabled) return
  emit('send', trimmed)
  text.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}
</script>

<template>
  <div class="chat-input">
    <textarea
      v-model="text"
      :disabled="disabled"
      placeholder="Message the agent… (Enter to send, Shift+Enter for newline)"
      rows="3"
      @keydown="onKeydown"
    />
    <button :disabled="disabled || !text.trim()" @click="submit">
      {{ disabled ? '…' : 'Send' }}
    </button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px 0;
}
textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
}
textarea:disabled {
  opacity: 0.6;
}
button {
  padding: 10px 20px;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-end;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

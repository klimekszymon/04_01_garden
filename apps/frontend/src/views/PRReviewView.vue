<script setup lang="ts">
import { ref } from 'vue'
import { marked } from 'marked'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

const prUrl = ref('')
const review = ref('')
const loading = ref(false)
const error = ref('')

async function submitReview() {
  if (!prUrl.value.trim() || loading.value) return
  loading.value = true
  error.value = ''
  review.value = ''

  try {
    const res = await fetch(`${API_BASE}/api/github/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prUrl: prUrl.value.trim() }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Review failed')
    review.value = data.review
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pr-review">
    <h2>PR Review</h2>
    <p class="subtitle">Paste a GitHub Pull Request URL to get an automated code review.</p>

    <div class="form">
      <input
        v-model="prUrl"
        type="url"
        placeholder="https://github.com/owner/repo/pull/123"
        :disabled="loading"
        @keydown.enter="submitReview"
      />
      <button :disabled="loading || !prUrl.trim()" @click="submitReview">
        {{ loading ? 'Reviewing…' : 'Review PR' }}
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="review" class="review-output" v-html="marked.parse(review)" />
  </div>
</template>

<style scoped>
.pr-review {
  max-width: 760px;
}
h2 { margin: 0 0 4px; }
.subtitle { color: #666; font-size: 14px; margin-bottom: 20px; }
.form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}
input:disabled { opacity: 0.6; }
button {
  padding: 10px 20px;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}
button:disabled { opacity: 0.5; cursor: not-allowed; }
.error { color: #c0392b; font-size: 13px; margin-bottom: 12px; }
.review-output {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
}
</style>

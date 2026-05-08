<script setup lang="ts">
import { ref, reactive } from 'vue'
import { marked } from 'marked'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

interface StepResult {
  step: string
  result: unknown
}

const form = reactive({
  name: '',
  description: '',
  targetFiles: '',
})

const steps = ref<StepResult[]>([])
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function runWorkflow() {
  if (!form.name.trim() || !form.description.trim() || loading.value) return
  loading.value = true
  error.value = ''
  steps.value = []
  done.value = false

  try {
    const res = await fetch(`${API_BASE}/api/workflows/feature-dev`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim(),
        targetFiles: form.targetFiles.split('\n').map((s) => s.trim()).filter(Boolean),
      }),
    })

    if (!res.ok || !res.body) throw new Error(`Server error: ${res.status}`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done: streamDone, value } = await reader.read()
      if (streamDone) break

      const text = decoder.decode(value)
      const lines = text.split('\n').filter((l) => l.startsWith('data:'))
      for (const line of lines) {
        const json = JSON.parse(line.slice(5).trim())
        if (json.done) {
          done.value = true
        } else if (json.step) {
          steps.value.push({ step: json.step, result: json.result })
        }
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

function stepLabel(id: string) {
  const labels: Record<string, string> = {
    'backend-step': 'Backend Agent',
    'frontend-step': 'Frontend Agent',
    'devops-step': 'DevOps Agent',
  }
  return labels[id] ?? id
}
</script>

<template>
  <div class="workflow-view">
    <h2>Feature Dev Workflow</h2>
    <p class="subtitle">Describe a feature and the multi-agent workflow will implement it end-to-end.</p>

    <form class="form" @submit.prevent="runWorkflow">
      <label>
        Feature name
        <input v-model="form.name" :disabled="loading" placeholder="e.g. User authentication" />
      </label>
      <label>
        Description
        <textarea v-model="form.description" :disabled="loading" rows="4"
          placeholder="Describe the feature requirements…" />
      </label>
      <label>
        Target files <span class="hint">(one per line, optional)</span>
        <textarea v-model="form.targetFiles" :disabled="loading" rows="3"
          placeholder="src/api/auth.ts&#10;src/components/Login.vue" />
      </label>
      <button type="submit" :disabled="loading || !form.name.trim() || !form.description.trim()">
        {{ loading ? 'Running workflow…' : 'Run Workflow' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="steps.length > 0" class="steps">
      <div v-for="s in steps" :key="s.step" class="step">
        <div class="step-header">
          <span class="step-label">{{ stepLabel(s.step) }}</span>
          <span class="badge done">Done</span>
        </div>
        <div class="step-body" v-html="marked.parse(typeof s.result === 'string' ? s.result : JSON.stringify(s.result, null, 2))" />
      </div>

      <div v-if="loading && steps.length < 3" class="step pending">
        <span class="step-label">{{ stepLabel(['backend-step', 'frontend-step', 'devops-step'][steps.length]) }}</span>
        <span class="badge running">Running…</span>
      </div>
    </div>

    <div v-if="done" class="success">Workflow complete.</div>
  </div>
</template>

<style scoped>
.workflow-view { max-width: 760px; }
h2 { margin: 0 0 4px; }
.subtitle { color: #666; font-size: 14px; margin-bottom: 20px; }
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}
.hint { font-weight: normal; color: #888; }
input, textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}
input:disabled, textarea:disabled { opacity: 0.6; }
button {
  padding: 10px 20px;
  background: #1a1a2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-start;
}
button:disabled { opacity: 0.5; cursor: not-allowed; }
.error { color: #c0392b; font-size: 13px; margin-bottom: 16px; }
.steps { display: flex; flex-direction: column; gap: 12px; }
.step {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
.step.pending { opacity: 0.6; }
.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #f4f4f4;
  border-bottom: 1px solid #e0e0e0;
}
.step-label { font-weight: 600; font-size: 14px; }
.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}
.badge.done { background: #d4edda; color: #155724; }
.badge.running { background: #fff3cd; color: #856404; }
.step-body {
  padding: 16px;
  font-size: 13px;
  line-height: 1.6;
  background: #fff;
}
.success {
  margin-top: 16px;
  color: #155724;
  font-weight: 500;
}
</style>

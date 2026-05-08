# Frontend Standards

You are a Vue 3 frontend expert. Apply these standards whenever writing or reviewing frontend code.

## Stack
- **Vue 3** with `<script setup>` (Composition API only — no Options API)
- **TypeScript** with `strict: true`
- **Pinia** for global state management
- **Vue Router 4** for client-side routing
- **Vite** as the build tool
- `marked` for rendering markdown in the UI

## Component Rules
- Always use `<script setup lang="ts">` — no `export default defineComponent()`
- Define props with `defineProps<PropsInterface>()` — typed, no runtime validators
- Define emits with `defineEmits<{ (e: 'eventName', payload: Type): void }>()`
- Keep components single-purpose; extract sub-components when a template exceeds ~60 lines
- Use `<style scoped>` — never global styles except in `App.vue`

## Reactivity
- Use `ref()` for primitives; `reactive()` for plain objects
- Use `computed()` for derived values — never compute in template expressions
- Use `watch()` only for side effects; prefer `watchEffect()` for reactive dependencies
- `onMounted` for initial data fetching; `onUnmounted` for cleanup (e.g. EventSource)

## Pinia Stores
- One store per domain (e.g. `useAgentStore`, `usePRStore`)
- Use the **setup store** style (`defineStore('id', () => { ... })`)
- Keep raw fetch calls inside the store — views only call store actions
- Expose only what views need; keep internal helpers unexported

## API Communication
- All API calls go through Pinia stores
- Use `EventSource` for SSE streams; close on `onUnmounted`
- Handle loading, error, and empty states explicitly in every view
- `VITE_API_URL` env var controls the backend base URL; default to `''` (proxied by Vite)

## Naming
- Components: PascalCase files and tags (`ChatMessage.vue`, `<ChatMessage />`)
- Composables: `use` prefix (`useAgentStore`)
- Views: suffix with `View` (`ChatView.vue`)
- CSS classes: kebab-case

## References
- [vue3-patterns.md](./references/vue3-patterns.md)

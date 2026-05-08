<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div id="layout">
    <nav>
      <span class="brand">Dev Assistant</span>
      <RouterLink to="/chat">Chat</RouterLink>
      <RouterLink to="/pr-review">PR Review</RouterLink>
      <RouterLink to="/workflow">Workflow</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #fff;
  color: #222;
}
#layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
nav {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #1a1a2e;
  color: #fff;
}
.brand { font-weight: 700; font-size: 16px; margin-right: auto; }
nav a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 14px;
}
nav a.router-link-active { color: #fff; font-weight: 600; }
main {
  flex: 1;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
</style>

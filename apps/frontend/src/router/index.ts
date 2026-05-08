import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import PRReviewView from '../views/PRReviewView.vue'
import WorkflowView from '../views/WorkflowView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/chat' },
    { path: '/chat', component: ChatView },
    { path: '/pr-review', component: PRReviewView },
    { path: '/workflow', component: WorkflowView },
  ],
})

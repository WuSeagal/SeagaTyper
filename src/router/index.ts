import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
    path: '/display',
    component: () => import('@/views/DisplayView.vue'),
    },
    {
    path: '/',
    component: () => import('@/views/LoginView.vue'),
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  document.documentElement.scrollTop = 0
  if (from.name) {
    window.history.replaceState({ from: from.path }, '')
  }

  next()
})

export default router
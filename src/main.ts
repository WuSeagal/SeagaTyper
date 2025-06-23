import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

window.addEventListener('error', (e) => {
  console.error('[全域錯誤]', e.message)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Promise Rejection]', e.reason)
})

const app = createApp(App);
app.use(router);

app.mount('#app');

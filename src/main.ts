import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
    .use(router)
app.mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'))

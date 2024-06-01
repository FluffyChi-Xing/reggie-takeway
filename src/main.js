import './assets/main.css'
import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

app.use(createPinia())
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')

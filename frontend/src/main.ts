import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './style.css'
import './styles/responsive.css'
import App from './App.vue'
import router from './router'
import {useUserStore} from './stores/user'
import { createPersistedState } from './plugins/pinia-persist'


const app = createApp(App)
const pinia = createPinia()

// 添加 Pinia 持久化插件
pinia.use(createPersistedState())

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(pinia)

const userStore = useUserStore()

await userStore.tryLoginFromLocalStorage()

router.beforeEach((to, _from, next) => {
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        next({name: 'login'})
    } else if (to.name === 'login' && userStore.isLoggedIn) {
        next({name: 'dashboard'})
    } else {
        next()
    }
})

app.use(router)

app.mount('#app')
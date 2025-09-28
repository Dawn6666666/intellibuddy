import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus)
app.use(pinia)

// --- 修改初始化顺序 ---
const userStore = useUserStore()

// 1. 调用新的 action 来尝试从 localStorage 恢复登录
// 这个操作现在是异步的
await userStore.tryLoginFromLocalStorage()

// 2. 路由守卫逻辑保持不变，但现在它能正确处理异步登录后的状态
router.beforeEach((to, _from, next) => {
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        next({ name: 'login' })
    } else if (to.name === 'login' && userStore.isLoggedIn) {
        next({ name: 'dashboard' })
    }
    else {
        next()
    }
})

app.use(router)

app.mount('#app')
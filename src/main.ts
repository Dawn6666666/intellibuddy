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
app.use(pinia) // 确保 Pinia 在 Router 之前被 `use`

// --- 保证初始化顺序 ---
// 在这里，Pinia 已经完全准备好了
const userStore = useUserStore()
userStore.tryAutoLogin() // 初始化用户状态

// 3. 关键改动：将路由守卫的逻辑移动到这里
router.beforeEach((to, _from, next) => {
    // 因为 userStore 是在这个文件顶部定义的，所以守卫可以稳定地访问到它
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        // 如果目标路由需要认证，但用户未认证
        next({ name: 'login' }) // 重定向到登录页
    } else if (to.name === 'login' && userStore.isLoggedIn) {
        // 如果用户已认证，但试图访问登录页
        next({ name: 'dashboard' }) // 重定向到仪表盘
    }
    else {
        // 其他情况，正常放行
        next()
    }
})

// 在守卫设置好之后，再将 router 挂载到应用上
app.use(router)

app.mount('#app')
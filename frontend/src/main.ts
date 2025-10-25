import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './style.css'
import './styles/responsive.css'
import './styles/button-enhancements.css'
import App from './App.vue'
import router from './router'
import {useUserStore} from './stores/user'
import {useThemeStore} from './stores/theme'
import {useSettingsStore} from './stores/settings'
import { createPersistedState } from './plugins/pinia-persist'
import { studyReminderService } from './utils/study-reminder'


const app = createApp(App)
const pinia = createPinia()

// 添加 Pinia 持久化插件
pinia.use(createPersistedState())

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 配置 Element Plus，设置 z-index 基础值
app.use(ElementPlus, {
    zIndex: 2000
})
app.use(pinia)

const userStore = useUserStore()
const themeStore = useThemeStore()
const settingsStore = useSettingsStore()

// 初始化主题
themeStore.initTheme()

// 初始化设置
settingsStore.loadSettings()

// 使用 .then() 代替 top-level await 以支持更多浏览器
userStore.tryLoginFromLocalStorage().then(() => {
    router.beforeEach((to, _from, next) => {
        if (to.meta.requiresAuth && !userStore.isLoggedIn) {
            next({name: 'login'})
        } else if (to.name === 'login' && userStore.isLoggedIn) {
            next({name: 'dashboard'})
        } else {
            next()
        }
    })

    // 如果用户已登录，启动学习提醒服务
    if (userStore.isLoggedIn && settingsStore.notifications.study) {
        studyReminderService.start()
    }

    app.use(router)
    app.mount('#app')
})
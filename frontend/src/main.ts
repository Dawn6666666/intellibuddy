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


console.log('🚀 [main.ts] 应用初始化开始');

const app = createApp(App)
const pinia = createPinia()

// 添加 Pinia 持久化插件
pinia.use(createPersistedState())
console.log('✅ [main.ts] Pinia 持久化插件已注册');

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 配置 Element Plus，设置 z-index 基础值
app.use(ElementPlus, {
    zIndex: 2000
})
app.use(pinia)
console.log('✅ [main.ts] Pinia 已初始化');

const userStore = useUserStore()
const themeStore = useThemeStore()
const settingsStore = useSettingsStore()

console.log('📊 [main.ts] Store 实例已创建');
console.log('  🔐 userStore.token:', userStore.token ? '存在' : '不存在');
console.log('  👤 userStore.user:', userStore.user ? userStore.user.username : '不存在');
console.log('  📋 userStore.isLoggedIn:', userStore.isLoggedIn);

// 初始化主题
themeStore.initTheme()
console.log('✅ [main.ts] 主题已初始化');

// 初始化设置
settingsStore.loadSettings()
console.log('✅ [main.ts] 设置已加载');

// 使用 .then() 代替 top-level await 以支持更多浏览器
console.log('🔄 [main.ts] 开始尝试从 localStorage 恢复登录');
userStore.tryLoginFromLocalStorage().then(() => {
    console.log('✅ [main.ts] 登录恢复完成');
    console.log('  📋 最终登录状态:', userStore.isLoggedIn);
    console.log('  👤 最终用户信息:', userStore.user);
    
    router.beforeEach((to, _from, next) => {
        console.log(`🔀 [Router] 导航到: ${to.path}, 需要认证: ${to.meta.requiresAuth}, 已登录: ${userStore.isLoggedIn}`);
        
        if (to.meta.requiresAuth && !userStore.isLoggedIn) {
            console.log('  ⚠️ 需要认证但未登录，跳转到登录页');
            next({name: 'login'})
        } else if (to.name === 'login' && userStore.isLoggedIn) {
            console.log('  ✅ 已登录，跳转到首页');
            next({name: 'dashboard'})
        } else {
            console.log('  ✅ 允许访问');
            next()
        }
    })

    // 如果用户已登录，启动学习提醒服务
    if (userStore.isLoggedIn && settingsStore.notifications.study) {
        studyReminderService.start()
        console.log('✅ [main.ts] 学习提醒服务已启动');
    }

    app.use(router)
    app.mount('#app')
    console.log('🎉 [main.ts] 应用已挂载');
})
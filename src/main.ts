import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './style.css'
import App from './App.vue'
import router from './router'
import {useUserStore} from './stores/user'


const app = createApp(App)
const pinia = createPinia()

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
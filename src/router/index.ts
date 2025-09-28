import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/app'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/app',
            component: MainLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/DashboardView.vue')
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: () => import('../views/ProfileView.vue')
                },
                {
                    path: 'knowledge',
                    name: 'knowledge',
                    component: () => import('../views/KnowledgeBaseView.vue')
                },
                // 【重要新增】为学习页面添加动态路由
                {
                    path: 'learn/:pointId', // 使用 :pointId 作为动态参数
                    name: 'learning',
                    // 暂时我们先创建一个空的 LearningView.vue 文件，下一步再填充内容
                    component: () => import('../views/LearningView.vue')
                }
            ]
        }
    ]
})

// 2. 关键改动：将 router.beforeEach(...) 的全部代码从这里删除

export default router
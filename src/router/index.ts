// src/router/index.ts

// 1. 从 'vue-router' 中多导入一个 createWebHashHistory
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
    // 2. 将 createWebHistory(...) 修改为 createWebHashHistory()
    history: createWebHashHistory(import.meta.env.BASE_URL),
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
                {
                    path: 'learn/:pointId',
                    name: 'learning',
                    component: () => import('../views/LearningView.vue')
                }
            ]
        }
    ]
})

export default router
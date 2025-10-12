// src/router/index.ts
import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue' // 1. 导入回调组件

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
        // 2. 添加新的回调路由规则
        {
            path: '/auth/callback',
            name: 'auth-callback',
            component: AuthCallbackView,
        },
        // 添加 /dashboard 的重定向
        {
            path: '/dashboard',
            redirect: '/app'
        },
        {
            path: '/app',
            component: MainLayout,
            meta: {requiresAuth: true},
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
                },
                {
                    path: 'assessment',
                    name: 'assessment',
                    component: () => import('../views/AssessmentView.vue')
                },
                {
                    path: 'wrong-questions',
                    name: 'wrong-questions',
                    component: () => import('../views/WrongQuestionsView.vue')
                },
                {
                    path: 'code-explainer',
                    name: 'code-explainer',
                    component: () => import('../views/CodeExplainerView.vue')
                }
            ]
        }
    ]
})

export default router
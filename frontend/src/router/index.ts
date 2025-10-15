// src/router/index.ts
import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue' // 1. 导入回调组件

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        // 如果有保存的位置（浏览器前进后退），使用保存的位置
        if (savedPosition) {
            return savedPosition;
        }
        // 如果路由有 hash，滚动到对应元素
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth'
            };
        }
        // 如果是在知识库页面内部导航，保持位置不变
        if (to.name === 'knowledge' && from.name === 'knowledge') {
            return false; // 不滚动
        }
        // 默认滚动到顶部
        return { top: 0, behavior: 'smooth' };
    },
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
                },
                {
                    path: 'achievements',
                    name: 'achievements',
                    component: () => import('../views/AchievementsView.vue')
                },
                {
                    path: 'transition-demo',
                    name: 'transition-demo',
                    component: () => import('../views/TransitionDemo.vue')
                }
            ]
        }
    ]
})

export default router
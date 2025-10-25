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
        // 如果从学习页面返回知识库，不处理滚动（由组件自己控制）
        if (to.name === 'knowledge' && from.name === 'learning') {
            console.log('🔵 从学习页面返回知识库，由组件控制滚动位置');
            return false; // 不滚动，让组件自己恢复位置
        }
        // 默认滚动到顶部
        console.log('🔴 默认行为：滚动到顶部', { to: to.name, from: from.name });
        return { top: 0 };
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
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: () => import('../views/ForgotPasswordView.vue')
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: () => import('../views/ResetPasswordView.vue')
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
                    path: 'achievements',
                    name: 'achievements',
                    component: () => import('../views/AchievementsView.vue')
                },
                {
                    path: 'transition-demo',
                    name: 'transition-demo',
                    component: () => import('../views/TransitionDemo.vue')
                },
                {
                    path: 'account',
                    name: 'account',
                    component: () => import('../views/AccountView.vue')
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('../views/SettingsView.vue')
                },
                {
                    path: 'teacher',
                    name: 'teacher',
                    component: () => import('../views/TeacherView.vue'),
                    meta: { requiresTeacher: true }
                },
                {
                    path: 'my-classes',
                    name: 'my-classes',
                    component: () => import('../views/MyClassesView.vue')
                },
                {
                    path: 'analytics',
                    name: 'analytics',
                    component: () => import('../views/AnalyticsView.vue')
                }
            ]
        }
    ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken');
    
    // 需要认证的路由
    if (to.meta.requiresAuth && !token) {
        next('/login');
        return;
    }
    
    // 需要教师权限的路由
    if (to.meta.requiresTeacher) {
        // 从 localStorage 获取用户信息
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'teacher' || user.role === 'admin') {
                    next();
                    return;
                }
            } catch (e) {
                console.error('解析用户信息失败:', e);
            }
        }
        // 没有权限，返回首页
        next('/app');
        return;
    }
    
    next();
});

export default router
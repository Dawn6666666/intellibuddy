// src/router/index.ts
import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue' // 1. 导入回调组件

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, _from, savedPosition) {
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
        // 默认滚动到顶部
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
                },
                {
                    path: 'upgrade',
                    name: 'upgrade',
                    component: () => import('../views/UpgradeMembershipView.vue')
                }
            ]
        },
        // 支付相关页面（独立布局）
        {
            path: '/payment',
            children: [
                {
                    path: 'success',
                    name: 'payment-success',
                    component: () => import('../views/PaymentSuccessView.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'cancel',
                    name: 'payment-cancel',
                    component: () => import('../views/PaymentCancelView.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        }
    ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
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
        // 没有权限，返回首页（学生首页）
        next('/app');
        return;
    }
    
    // 如果教师访问 /app（学生首页），重定向到教师管理页
    if (to.path === '/app' || to.name === 'dashboard') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'teacher' || user.role === 'admin') {
                    next('/app/teacher');
                    return;
                }
            } catch (e) {
                console.error('解析用户信息失败:', e);
            }
        }
    }
    
    next();
});

export default router
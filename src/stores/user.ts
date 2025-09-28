// src/stores/user.ts

import { defineStore } from 'pinia'

// 定义用户的类型，方便复用
interface UserInfo {
    username: string;
    email: string;
    avatar?: string; // 头像链接，可选
}

export const useUserStore = defineStore('user', {
    // 1. 优化 state 结构
    state: () => ({
        // 将用户信息聚合到一个 user 对象中，方便管理
        user: null as UserInfo | null,
        progress: {
            completed: 12,
            total: 150,
        },
        studyTime: '8小时 21分钟',
    }),

    // 2. 更新 getters 以适应新的 state 结构
    getters: {
        // isLoggedIn 现在是一个计算属性，更健壮
        isLoggedIn: (state) => !!state.user,

        // 问候语现在从 user 对象中获取名字
        greeting(state) {
            if (!state.user) return '你好, 访客!';
            const hour = new Date().getHours()
            if (hour < 12) return `上午好, ${state.user.username}!`
            if (hour < 18) return `下午好, ${state.user.username}!`
            return `晚上好, ${state.user.username}!`
        },

        // 计算学习进度的百分比
        progressPercentage: (state) => {
            if (state.progress.total === 0) return 0;
            return (state.progress.completed / state.progress.total) * 100;
        }
    },

    // 3. 更新 actions
    actions: {
        // 模拟登录
        async login(email: string, password: string) {
            console.log(`正在用 ${email} 和 ${password} 登录...`);
            await new Promise(resolve => setTimeout(resolve, 500));

            // 登录成功后，设置整个 user 对象
            this.user = {
                username: '山崎Amyg', // 模拟从后端获取的用户名
                email: email,
            };
        },

        // 退出登录
        logout() {
            this.user = null;
            // 可以在这里重置其他进度信息
            this.progress = { completed: 0, total: 150 };
            this.studyTime = '0 小时';
        },

        // (可选) 应用启动时，尝试从 localStorage 恢复登录状态
        tryAutoLogin() {
            // 这里只是一个示例，我们暂时先模拟一个已登录用户
            this.user = {
                username: '山崎Amyg',
                email: 'amyg@example.com'
            }
        }
    },
})

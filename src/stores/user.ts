// src/stores/user.ts

import { defineStore } from 'pinia'
import type { KnowledgePoint } from './knowledge';

// 定义用户的类型，方便复用
interface UserInfo {
    username: string;
    email: string;
    avatar?: string; // 头像链接，可选
}

// ... getVirtualData 函数保持不变 ...
function getVirtualData(year: string) {
    const date = new Date(Number(year), 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);
    const data: [string, number][] = [];
    while (date.getTime() < end.getTime()) {
        const dayStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        if (Math.random() > 0.3) {
            data.push([
                dayStr,
                Math.floor(Math.random() * 10) + 1
            ]);
        }
        date.setDate(date.getDate() + 1);
    }
    return data;
}


export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as UserInfo | null,
        progress: {
            completed: 12,
            total: 150,
        },
        studyTime: '8小时 21分钟',
        // 【重要修改】更新为通用计算机科学技能
        skillMastery: [
            { name: '编程语言', level: 85 },
            { name: '数据结构', level: 70 },
            { name: '算法', level: 75 },
            { name: '前端开发', level: 90 },
            { name: '后端开发', level: 60 },
            { name: '数据库', level: 80 },
        ],
        studyActivityData: getVirtualData(new Date().getFullYear().toString()),
        isChatOpen: false,
        chatContext: null as KnowledgePoint | null,
    }),

    getters: {
        // ... getters 保持不变 ...
        isLoggedIn: (state) => !!state.user,
        greeting(state) {
            if (!state.user) return '你好, 訪客!';
            const hour = new Date().getHours()
            if (hour < 12) return `上午好, ${state.user.username}!`
            if (hour < 18) return `下午好, ${state.user.username}!`
            return `晚上好, ${state.user.username}!`
        },
        progressPercentage: (state) => {
            if (state.progress.total === 0) return 0;
            return (state.progress.completed / state.progress.total) * 100;
        }
    },

    actions: {
        // ... actions 保持不变 ...
        async login(email: string, password: string) {
            console.log(`正在用 ${email} 和 ${password} 登录...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            this.user = {
                username: '山崎Amyg',
                email: email,
            };
        },
        logout() {
            this.user = null;
            this.progress = { completed: 0, total: 150 };
            this.studyTime = '0 小时';
        },
        tryAutoLogin() {
            this.user = {
                username: '山崎Amyg',
                email: 'amyg@example.com'
            }
        },
        toggleChat(isOpen: boolean) {
            this.isChatOpen = isOpen;
            if (!isOpen) {
                this.chatContext = null;
            }
        },
        setChatContext(context: KnowledgePoint | null) {
            this.chatContext = context;
        }
    },
})
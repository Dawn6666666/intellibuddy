// src/stores/user.ts
import {defineStore} from 'pinia';
import {apiLogin, apiRegister, apiGetMyProfile, apiGetUserProgress} from '@/services/apiService';
import type {KnowledgePoint} from './knowledge';

export interface UserInfo {
    _id: string;
    username: string;
    email: string;
}

export interface UserProgress {
    _id: string;
    userId: string;
    pointId: string;
    status: 'not_started' | 'in_progress' | 'completed';
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as UserInfo | null,
        token: localStorage.getItem('authToken') || null,
        progress: new Map<string, UserProgress['status']>(),
        isLoading: false,
        error: null as string | null,
        isChatOpen: false,
        chatContext: null as KnowledgePoint | null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.user && !!state.token,
        greeting(state) {
            if (!state.user) return '你好, 访客!';
            const hour = new Date().getHours();
            if (hour < 12) return `上午好, ${state.user.username}!`;
            if (hour < 18) return `下午好, ${state.user.username}!`;
            return `晚上好, ${state.user.username}!`;
        },
        progressStats(state) {
            // 在未来，这个 total 值应该从 knowledgeStore 动态获取
            const total = 22;
            const completed = Array.from(state.progress.values()).filter(s => s === 'completed').length;

            // 我们知道 total 现在不为 0，所以可以直接计算百分比
            // 移除了 TypeScript 报错的 `total === 0` 检查
            const percentage = (completed / total) * 100;

            return {
                total,
                completed,
                percentage,
            };
        },
    },

    actions: {
        async fetchUserProfile() {
            if (!this.token) return;
            try {
                const progressData: UserProgress[] = await apiGetUserProgress(this.token);
                this.progress = new Map(progressData.map(p => [p.pointId, p.status]));
            } catch (err) {
                console.error("获取用户进度失败:", err);
            }
        },
        async handleAuth(token: string, user: UserInfo) {
            this.token = token;
            this.user = user;
            localStorage.setItem('authToken', token);
            await this.fetchUserProfile();
        },
        async register(userData: any) {
            this.isLoading = true;
            this.error = null;
            try {
                const {token, user} = await apiRegister(userData);
                await this.handleAuth(token, user);
            } catch (err: any) {
                this.error = err.response?.data?.message || '注册失败';
                throw this.error;
            } finally {
                this.isLoading = false;
            }
        },
        async login(credentials: any) {
            this.isLoading = true;
            this.error = null;
            try {
                const {token, user} = await apiLogin(credentials);
                await this.handleAuth(token, user);
            } catch (err: any) {
                this.error = err.response?.data?.message || '登录失败';
                throw this.error;
            } finally {
                this.isLoading = false;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            this.progress.clear();
            localStorage.removeItem('authToken');
        },
        async tryLoginFromLocalStorage() {
            if (this.token) {
                try {
                    const user = await apiGetMyProfile(this.token);
                    this.user = user;
                    await this.fetchUserProfile();
                } catch (err) {
                    this.logout();
                }
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
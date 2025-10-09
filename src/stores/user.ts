// src/stores/user.ts
import {defineStore} from 'pinia';
import {apiLogin, apiRegister, apiGetMyProfile, apiGetUserProgress} from '@/services/apiService';
import type {KnowledgePoint} from './knowledge';
import { useKnowledgeStore } from './knowledge';

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

// 定义热力图数据的类型
export type StudyActivity = [string, number][];

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as UserInfo | null,
        token: localStorage.getItem('authToken') || null,
        progress: new Map<string, UserProgress['status']>(),
        isLoading: false,
        error: null as string | null,
        isChatOpen: false,
        chatContext: null as KnowledgePoint | null,

        // 【核心修复】为 "我的档案" 页面添加所需的状态，并设置初始空数组以防止崩溃
        skillMastery: [] as { name: string; level: number }[],
        studyActivityData: [] as StudyActivity,
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
            const knowledgeStore = useKnowledgeStore();
            const total = knowledgeStore.knowledgePoints.size;
            const completed = Array.from(state.progress.values()).filter(s => s === 'completed').length;
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            return { total, completed, percentage };
        },
    },

    actions: {
        async fetchInitialData() {
            if (!this.token) return;
            this.isLoading = true;
            const knowledgeStore = useKnowledgeStore();
            try {
                const [user, progressData] = await Promise.all([
                    apiGetMyProfile(this.token),
                    apiGetUserProgress(this.token),
                    knowledgeStore.fetchKnowledgePoints()
                ]);

                this.user = user;
                this.progress = new Map(progressData.map((p: UserProgress) => [p.pointId, p.status]));

                // 【核心修复】因为后端API暂未提供图表数据，我们在这里填充模拟数据
                // 这样 "我的档案" 页面就可以正常显示，而不会因数据缺失而崩溃
                this.skillMastery = [
                    { name: '编程基础', level: 85 },
                    { name: '数据结构', level: 70 },
                    { name: '算法', level: 75 },
                    { name: '软件工程', level: 60 },
                    { name: '计算机网络', level: 65 },
                    { name: '操作系统', level: 55 },
                ];
                this.studyActivityData = this.generateMockHeatmapData();

            } catch (err) {
                console.error("获取初始数据失败:", err);
                this.logout();
            } finally {
                this.isLoading = false;
            }
        },

        // 辅助方法：用于生成热力图的模拟数据
        generateMockHeatmapData(): StudyActivity {
            const year = new Date().getFullYear().toString();
            const date = new Date(Number(year), 0, 1);
            const end = new Date(Number(year) + 1, 0, 1);
            const data: [string, number][] = [];
            while (date.getTime() < end.getTime()) {
                const dayStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                if (Math.random() > 0.4) {
                    data.push([
                        dayStr,
                        Math.floor(Math.random() * 10) + 1
                    ]);
                }
                date.setDate(date.getDate() + 1);
            }
            return data;
        },

        async handleAuth(token: string, user: UserInfo) {
            this.token = token;
            this.user = user;
            localStorage.setItem('authToken', token);
            await this.fetchInitialData();
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
            const knowledgeStore = useKnowledgeStore();
            this.user = null;
            this.token = null;
            this.progress.clear();
            knowledgeStore.$reset();
            localStorage.removeItem('authToken');
            // 登出时也要重置档案页的数据
            this.skillMastery = [];
            this.studyActivityData = [];
        },

        async tryLoginFromLocalStorage() {
            if (this.token) {
                await this.fetchInitialData();
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
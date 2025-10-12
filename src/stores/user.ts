// src/stores/user.ts
import {defineStore} from 'pinia';
import {
    apiLogin,
    apiRegister,
    apiGetMyProfile,
    apiGetUserProgress,
    apiGetChats,
    apiNewChat,
    apiUpdateChat,
    apiGetRecommendedPath
} from '@/services/apiService';
import type {KnowledgePoint} from './knowledge';
import {useKnowledgeStore} from './knowledge';
import type {ChatMessage} from '@/services/ai';

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

export interface ChatSession {
    _id: string;
    userId: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}

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
        skillMastery: [] as { name: string; level: number }[],
        studyActivityData: [] as StudyActivity,

        // --- 聊天状态 ---
        chatSessions: [] as ChatSession[],
        activeChatId: null as string | null,
        messages: [] as ChatMessage[],

        // --- 推荐路径 ---
        recommendedPath: [] as string[], // 推荐的知识点ID数组
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
            return {total, completed, percentage};
        },
    },

    actions: {
        async fetchInitialData() {
            if (!this.token) return;
            this.isLoading = true;
            const knowledgeStore = useKnowledgeStore();
            try {
                const [user, progressData, chats] = await Promise.all([
                    apiGetMyProfile(this.token),
                    apiGetUserProgress(this.token),
                    apiGetChats(this.token),
                    knowledgeStore.fetchKnowledgePoints()
                ]);

                this.user = user;
                this.progress = new Map(progressData.map((p: UserProgress) => [p.pointId, p.status]));
                this.chatSessions = chats;

                if (chats.length > 0) {
                    this.loadChatSession(chats[0]._id);
                } else {
                    this.startNewChat();
                }

                this.skillMastery = [
                    {name: '编程基础', level: 85},
                    {name: '数据结构', level: 70},
                    {name: '算法', level: 75},
                    {name: '软件工程', level: 60},
                    {name: '计算机网络', level: 65},
                    {name: '操作系统', level: 55},
                ];
                this.studyActivityData = this.generateMockHeatmapData();

                // 获取推荐路径
                await this.fetchRecommendedPath();

            } catch (err) {
                console.error("获取初始数据失败:", err);
                this.logout();
            } finally {
                this.isLoading = false;
            }
        },

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

        async fetchRecommendedPath() {
            if (!this.token) return;
            try {
                const response = await apiGetRecommendedPath(this.token);
                // 从 recommendations 中提取 pointId
                this.recommendedPath = (response.recommendations || []).map((rec: any) => rec.pointId);
            } catch (err) {
                console.error("获取推荐路径失败:", err);
                // 如果获取失败，设置为空数组
                this.recommendedPath = [];
            }
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
            this.skillMastery = [];
            this.studyActivityData = [];
            // 登出时重置聊天状态
            this.chatSessions = [];
            this.activeChatId = null;
            this.messages = [];
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
        },

        startNewChat() {
            this.activeChatId = null;
            this.messages = [{role: 'assistant', content: '你好！我是您的专属 AI 助教，有什么可以帮助你的吗？'}];
        },

        loadChatSession(sessionId: string) {
            const session = this.chatSessions.find(s => s._id === sessionId);
            if (session) {
                this.activeChatId = session._id;
                this.messages = [...session.messages];
            }
        },

        async addMessage(message: ChatMessage) {
            this.messages.push(message);
            if (!this.token) return;

            try {
                if (!this.activeChatId) {
                    const newSession = await apiNewChat(this.token, this.messages);
                    this.chatSessions.unshift(newSession);
                    this.activeChatId = newSession._id;
                } else {
                    const updatedSession = await apiUpdateChat(this.token, this.activeChatId, this.messages);
                    const index = this.chatSessions.findIndex(s => s._id === this.activeChatId);
                    if (index !== -1) {
                        this.chatSessions[index] = updatedSession;
                    }
                }
            } catch (error) {
                console.error("保存聊天记录失败:", error);
            }
        },
    },
})
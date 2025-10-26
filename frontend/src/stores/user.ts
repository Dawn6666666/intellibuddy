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
    apiDeleteChat,
    apiGetRecommendedPath,
    apiGetHeatmapData
} from '@/services/apiService';
import type {KnowledgePoint} from './knowledge';
import {useKnowledgeStore} from './knowledge';
import type {ChatMessage} from '@/services/ai';

export interface UserInfo {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    role?: 'student' | 'teacher' | 'admin';
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
    state: () => {
        console.log('🏗️ UserStore 初始化 state');
        const token = localStorage.getItem('authToken');
        console.log('  🔑 从 localStorage 读取 token:', token ? '存在' : '不存在');
        return {
            user: null as UserInfo | null,
            token: token || null,
            progress: {} as Record<string, UserProgress['status']>,
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
        };
    },

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
            const total = Object.keys(knowledgeStore.knowledgePoints).length;
            const completed = Object.values(state.progress).filter(s => s === 'completed').length;
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            return {total, completed, percentage};
        },
    },

    actions: {
        async fetchInitialData() {
            console.log('🚀 [fetchInitialData] 开始执行');
            console.log('  📋 当前 token:', this.token ? `存在 (${this.token.substring(0, 20)}...)` : '不存在');
            
            if (!this.token) {
                console.warn('⚠️ [fetchInitialData] token 不存在，跳过数据加载');
                return;
            }
            
            this.isLoading = true;
            const knowledgeStore = useKnowledgeStore();
            
            try {
                console.log('📡 [fetchInitialData] 第一阶段：获取用户基本信息');
                // 第一阶段：只获取用户基本信息（快速登录）
                this.user = await apiGetMyProfile(this.token);
                console.log('✅ [fetchInitialData] 用户信息获取成功:', this.user);
                
                // 更新 localStorage 中的用户信息
                localStorage.setItem('user', JSON.stringify(this.user));
                console.log('💾 [fetchInitialData] 用户信息已保存到 localStorage');
                
                console.log('📡 [fetchInitialData] 第二阶段：并行加载其他数据');
                // 第二阶段：并行加载其他数据（后台加载，不阻塞登录）
                Promise.all([
                    apiGetUserProgress(this.token).then(progressData => {
                        console.log('📥 [Progress] API 返回的用户进度数据:', progressData);
                        console.log('  📊 进度数据类型:', Array.isArray(progressData) ? '数组' : typeof progressData);
                        console.log('  📊 进度数据长度:', Array.isArray(progressData) ? progressData.length : 'N/A');
                        
                        this.progress = progressData.reduce((acc: Record<string, UserProgress['status']>, p: UserProgress) => {
                            acc[p.pointId] = p.status;
                            return acc;
                        }, {});
                        console.log('✅ [Progress] 用户进度已更新，条目数:', Object.keys(this.progress).length);
                        console.log('  📊 进度详情:', this.progress);
                    }).catch(err => {
                        console.error('❌ [Progress] 获取用户进度失败:', err);
                        throw err;
                    }),
                    apiGetChats(this.token).then(chats => {
                        console.log('💬 [Chats] 获取聊天会话成功，数量:', chats.length);
                        this.chatSessions = chats;
                        if (chats.length > 0) {
                            this.loadChatSession(chats[0]._id);
                        } else {
                            this.startNewChat();
                        }
                    }).catch(err => {
                        console.error('❌ [Chats] 获取聊天会话失败:', err);
                    }),
                    knowledgeStore.fetchKnowledgePoints().then(() => {
                        console.log('📚 [Knowledge] 知识点加载成功');
                    }).catch(err => {
                        console.error('❌ [Knowledge] 知识点加载失败:', err);
                    }),
                    this.fetchRecommendedPath().then(() => {
                        console.log('🎯 [Recommend] 推荐路径加载成功');
                    }).catch(err => {
                        console.error('❌ [Recommend] 推荐路径加载失败:', err);
                    })
                ]).catch(err => {
                    console.warn("⚠️ [fetchInitialData] 部分数据加载失败，不影响登录:", err);
                });

                // 生成模拟数据（技能掌握度）
                this.skillMastery = [
                    {name: '编程基础', level: 85},
                    {name: '数据结构', level: 70},
                    {name: '算法', level: 75},
                    {name: '软件工程', level: 60},
                    {name: '计算机网络', level: 65},
                    {name: '操作系统', level: 55},
                ];
                
                // 加载真实的学习热力图数据
                this.fetchHeatmapData().catch(err => {
                    console.warn("加载热力图数据失败:", err);
                    this.studyActivityData = [];
                });

            } catch (err) {
                console.error("❌ [fetchInitialData] 获取用户信息失败:", err);
                console.error("  错误详情:", err);
                throw err; // 只有关键信息失败才抛出错误
            } finally {
                this.isLoading = false;
                console.log('🏁 [fetchInitialData] 执行完成');
            }
        },

        async fetchHeatmapData(year?: number) {
            if (!this.token) return;
            
            try {
                const response = await apiGetHeatmapData(this.token, year);
                // 将后端返回的数据转换为前端需要的格式
                // 后端返回: { year, data: [{date, duration, sessionCount, intensity}], totalDays, longestStreak, currentStreak }
                // 前端需要: [[date, intensity], ...]
                this.studyActivityData = response.data.map((item: any) => [
                    item.date,
                    item.intensity || 0
                ]);
            } catch (err) {
                console.error("获取热力图数据失败:", err);
                this.studyActivityData = [];
                throw err;
            }
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
            localStorage.setItem('user', JSON.stringify(user));
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
                console.error("登录失败:", err);
                // 更详细的错误处理
                if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                    this.error = '登录超时，请检查网络连接';
                } else if (err.code === 'ERR_NETWORK') {
                    this.error = '网络连接失败，请稍后重试';
                } else if (err.response?.status === 500) {
                    this.error = '服务器错误，请稍后重试';
                } else {
                    this.error = err.response?.data?.message || '登录失败，请重试';
                }
                throw this.error;
            } finally {
                this.isLoading = false;
            }
        },

        logout() {
            const knowledgeStore = useKnowledgeStore();
            this.user = null;
            this.token = null;
            this.progress = {};
            knowledgeStore.$reset();
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.skillMastery = [];
            this.studyActivityData = [];
            // 登出时重置聊天状态
            this.chatSessions = [];
            this.activeChatId = null;
            this.messages = [];
        },

        async tryLoginFromLocalStorage() {
            console.log('🔄 [tryLoginFromLocalStorage] 尝试从 localStorage 恢复登录状态');
            console.log('  📋 localStorage.authToken:', localStorage.getItem('authToken') ? '存在' : '不存在');
            console.log('  📋 localStorage.user:', localStorage.getItem('user') ? '存在' : '不存在');
            console.log('  📋 store.token:', this.token ? '存在' : '不存在');
            
            if (this.token) {
                console.log('✅ [tryLoginFromLocalStorage] Token 存在，开始加载数据');
                await this.fetchInitialData();
            } else {
                console.warn('⚠️ [tryLoginFromLocalStorage] Token 不存在，跳过登录恢复');
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

        async deleteChat(chatId: string) {
            if (!this.token) {
                throw new Error('未登录，无法删除聊天记录');
            }

            // 检查会话是否存在
            const sessionExists = this.chatSessions.some(s => s._id === chatId);
            if (!sessionExists) {
                console.warn(`会话 ${chatId} 不存在，可能已被删除`);
                return;
            }

            try {
                // 调用API删除
                await apiDeleteChat(this.token, chatId);
                
                // 从本地状态中移除该会话
                this.chatSessions = this.chatSessions.filter(s => s._id !== chatId);
                
                // 如果删除的是当前活跃的会话，切换到其他会话或新建
                if (this.activeChatId === chatId) {
                    if (this.chatSessions.length > 0) {
                        // 切换到第一个会话
                        await this.loadChatSession(this.chatSessions[0]._id);
                    } else {
                        // 没有会话了，新建一个
                        this.startNewChat();
                    }
                }
                
                console.log(`成功删除聊天记录: ${chatId}`);
            } catch (error) {
                console.error("删除聊天记录失败:", error);
                throw error;
            }
        },
    },
    
    // 启用持久化
    persist: {
        key: 'intellibuddy-user',
        paths: ['user', 'token', 'progress'], // 持久化用户信息、token 和进度
    },
})
// src/stores/knowledge.ts
import {defineStore} from 'pinia';
import {apiGetKnowledgePoints} from '@/services/apiService';
import {useUserStore} from './user';

export interface QuizQuestion {
    question: string;
    type: 'single' | 'multiple' | 'boolean';
    options: string[];
}

export interface ContentFile {
    title: string;    // 文件标题
    content: string;  // Markdown内容
}

export interface KnowledgePoint {
    _id?: string;
    id: string;
    title: string;
    subject: string;
    contentSnippet: string;
    content?: string; // 完整的Markdown内容（向后兼容）
    contentFiles?: ContentFile[]; // 多个Markdown文件
    status: 'completed' | 'in_progress' | 'not_started';
    prerequisites: string[];
    quiz?: QuizQuestion[];
    difficulty?: number;
    estimatedTime?: number;
    graphPosition?: {x: number; y: number};
    __v?: number;
}

export const useKnowledgeStore = defineStore('knowledge', {
    state: () => {
        console.log('🏗️ KnowledgeStore 初始化 state');
        return {
            // knowledgePoints 现在只存储课程的元数据（改为普通对象以支持持久化）
            knowledgePoints: {} as Record<string, Omit<KnowledgePoint, 'status'>>,
            isLoading: false,
            error: null as string | null,
        };
    },

    getters: {
        // 这是最核心的改动：动态计算带有用户进度的知识点列表
        pointsAsArrayWithProgress(state): KnowledgePoint[] {
            const userStore = useUserStore();
            
            // 确保访问响应式属性以建立依赖追踪
            const knowledgePointsKeys = Object.keys(state.knowledgePoints);
            const userProgressKeys = Object.keys(userStore.progress);
            
            console.log('🔍 [Getter] pointsAsArrayWithProgress 被调用');
            console.log('  📦 knowledgePoints 键数量:', knowledgePointsKeys.length);
            console.log('  👤 userStore.progress 键数量:', userProgressKeys.length);
            
            // 如果没有知识点数据，直接返回空数组
            if (knowledgePointsKeys.length === 0) {
                console.log('  ⚠️ knowledgePoints 为空，返回空数组');
                return [];
            }
            
            // 转换为数组并添加用户进度
            const pointsArray = Object.values(state.knowledgePoints);
            const result = pointsArray.map(point => {
                // 从 userStore 获取该知识点的状态，如果不存在则默认为 'not_started'
                const status = userStore.progress[point.id] || 'not_started';
                return {
                    ...point,
                    status, // 用用户的真实状态覆盖默认状态
                };
            });
            
            console.log('  ✅ 最终返回的数组长度:', result.length);
            return result;
        },

        // 检查知识点是否可以解锁
        canUnlock: (state) => (pointId: string): boolean => {
            const userStore = useUserStore();
            const point = state.knowledgePoints[pointId];
            if (!point) return false;

            // 如果没有前置依赖，可以直接学习
            if (!point.prerequisites || point.prerequisites.length === 0) {
                return true;
            }

            // 检查所有前置依赖是否都已完成
            return point.prerequisites.every(preId => {
                const status = userStore.progress[preId];
                return status === 'completed';
            });
        },

        // 获取未完成的前置依赖列表
        getMissingPrerequisites: (state) => (pointId: string): KnowledgePoint[] => {
            const userStore = useUserStore();
            const point = state.knowledgePoints[pointId];
            if (!point || !point.prerequisites) return [];

            return point.prerequisites
                .filter(preId => {
                    const status = userStore.progress[preId];
                    return status !== 'completed';
                })
                .map(preId => state.knowledgePoints[preId])
                .filter(p => p !== undefined) as KnowledgePoint[];
        },
    },

    actions: {
        async fetchKnowledgePoints(forceReload = false) {
            // 如果不是强制重新加载，且数据已存在，则跳过
            const pointsCount = Object.keys(this.knowledgePoints).length;
            if (!forceReload && pointsCount > 0) {
                console.log('📦 知识点数据已存在，跳过加载 (count:', pointsCount, ')');
                return;
            }

            console.log('🔄 开始获取知识点数据... (forceReload:', forceReload, ')');
            this.isLoading = true;
            this.error = null;
            try {
                const pointsArray = await apiGetKnowledgePoints();
                console.log('📥 API 返回的知识点数量:', pointsArray?.length || 0);
                // 存储时，我们不再关心 status 字段，将数组转换为对象
                this.knowledgePoints = pointsArray.reduce((acc, point) => {
                    acc[point.id] = point;
                    return acc;
                }, {} as Record<string, Omit<KnowledgePoint, 'status'>>);
                console.log('✅ 知识点数据获取成功，存储数量:', Object.keys(this.knowledgePoints).length);
            } catch (err) {
                this.error = (err as Error).message;
                console.error('❌ 知识点数据获取失败:', err);
                throw err; // 重新抛出错误，让调用方知道失败了
            } finally {
                this.isLoading = false;
                console.log('🏁 fetchKnowledgePoints 完成，isLoading 设置为 false');
            }
        },
    },
    
    // 启用持久化
    persist: {
        key: 'intellibuddy-knowledge',
        paths: ['knowledgePoints'], // 只持久化 knowledgePoints
    },
});
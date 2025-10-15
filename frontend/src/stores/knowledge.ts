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
    state: () => ({
        // knowledgePoints 现在只存储课程的元数据
        knowledgePoints: new Map<string, Omit<KnowledgePoint, 'status'>>(),
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        // 这是最核心的改动：动态计算带有用户进度的知识点列表
        pointsAsArrayWithProgress(state): KnowledgePoint[] {
            const userStore = useUserStore();
            const pointsArray = Array.from(state.knowledgePoints.values());

            return pointsArray.map(point => {
                // 从 userStore 获取该知识点的状态，如果不存在则默认为 'not_started'
                const status = userStore.progress.get(point.id) || 'not_started';
                return {
                    ...point,
                    status, // 用用户的真实状态覆盖默认状态
                };
            });
        },

        // 检查知识点是否可以解锁
        canUnlock: (state) => (pointId: string): boolean => {
            const userStore = useUserStore();
            const point = state.knowledgePoints.get(pointId);
            if (!point) return false;

            // 如果没有前置依赖，可以直接学习
            if (!point.prerequisites || point.prerequisites.length === 0) {
                return true;
            }

            // 检查所有前置依赖是否都已完成
            return point.prerequisites.every(preId => {
                const status = userStore.progress.get(preId);
                return status === 'completed';
            });
        },

        // 获取未完成的前置依赖列表
        getMissingPrerequisites: (state) => (pointId: string): KnowledgePoint[] => {
            const userStore = useUserStore();
            const point = state.knowledgePoints.get(pointId);
            if (!point || !point.prerequisites) return [];

            return point.prerequisites
                .filter(preId => {
                    const status = userStore.progress.get(preId);
                    return status !== 'completed';
                })
                .map(preId => state.knowledgePoints.get(preId))
                .filter(p => p !== undefined) as KnowledgePoint[];
        },
    },

    actions: {
        async fetchKnowledgePoints() {
            if (this.knowledgePoints.size > 0) return; // 知识点元数据只需要获取一次

            this.isLoading = true;
            this.error = null;
            try {
                const pointsArray = await apiGetKnowledgePoints();
                // 存储时，我们不再关心 status 字段
                this.knowledgePoints = new Map(pointsArray.map(p => [p.id, p]));
            } catch (err) {
                this.error = (err as Error).message;
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },
    },
})
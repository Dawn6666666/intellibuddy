// src/stores/knowledge.ts
import {defineStore} from 'pinia';
import {apiGetKnowledgePoints} from '@/services/apiService';
import {useUserStore} from './user';

export interface KnowledgePoint {
    _id?: string; // 修改这里
    id: string;
    title: string;
    subject: string;
    contentSnippet: string;
    status: 'completed' | 'in_progress' | 'not_started';
    prerequisites: string[];
    __v?: number; // 修改这里
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
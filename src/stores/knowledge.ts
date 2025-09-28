// src/stores/knowledge.ts

import { defineStore } from 'pinia'

// 定义知识点的类型接口
export interface KnowledgePoint {
    id: string;
    title: string;
    subject: string;
    contentSnippet: string; // 内容摘要
    status: 'completed' | 'in_progress' | 'not_started';
    prerequisites: string[]; // 前置知识点ID数组
}

export const useKnowledgeStore = defineStore('knowledge', {
    state: () => ({
        // 使用一个 Map 来存储知识点，方便通过 ID 快速查找
        knowledgePoints: new Map<string, KnowledgePoint>([
            ['kp-1', {
                id: 'kp-1',
                title: 'Vue 实例与生命周期',
                subject: 'Vue.js',
                contentSnippet: '了解 Vue 应用的基础，包括如何创建实例以及在不同阶段触发的生命周期钩子...',
                status: 'completed',
                prerequisites: [],
            }],
            ['kp-2', {
                id: 'kp-2',
                title: '模板语法与指令',
                subject: 'Vue.js',
                contentSnippet: '学习如何使用声明式渲染将数据绑定到 DOM，以及 v-if, v-for 等常用指令...',
                status: 'in_progress',
                prerequisites: ['kp-1'],
            }],
            ['kp-3', {
                id: 'kp-3',
                title: '响应式核心 - ref 与 reactive',
                subject: 'Vue.js',
                contentSnippet: '深入 Composition API 的核心，理解 ref 和 reactive 如何创建响应式数据...',
                status: 'not_started',
                prerequisites: ['kp-1'],
            }],
            ['kp-4', {
                id: 'kp-4',
                title: '组件化开发',
                subject: 'Vue.js',
                contentSnippet: '学习如何将 UI 拆分为独立可复用的组件，并通过 props 和 events 进行通信...',
                status: 'not_started',
                prerequisites: ['kp-2', 'kp-3'],
            }],
        ]),
    }),

    getters: {
        // 将 Map 转换为数组，方便在模板中进行 v-for 循环
        pointsAsArray: (state) => Array.from(state.knowledgePoints.values()),
    },

    actions: {
        // 可以在这里定义更新知识点状态等 actions
        updatePointStatus(pointId: string, newStatus: KnowledgePoint['status']) {
            const point = this.knowledgePoints.get(pointId);
            if (point) {
                point.status = newStatus;
            }
        },
    },
})

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
        // 【重要修改】更新为计算机科学学习路线数据
        knowledgePoints: new Map<string, KnowledgePoint>([
            ['kp-1', {
                id: 'kp-1',
                title: 'HTML & CSS 基础',
                subject: '前端开发',
                contentSnippet: '学习构建网页的骨架和样式，掌握盒模型、Flexbox 布局等核心概念...',
                status: 'completed',
                prerequisites: [],
            }],
            ['kp-2', {
                id: 'kp-2',
                title: 'JavaScript 核心',
                subject: '前端开发',
                contentSnippet: '深入理解变量、作用域、闭包、异步编程等，为构建交互式应用打下坚实基础...',
                status: 'in_progress',
                prerequisites: ['kp-1'],
            }],
            ['kp-3', {
                id: 'kp-3',
                title: '数据结构与算法',
                subject: '计算机基础',
                contentSnippet: '探索数组、链表、树等基本数据结构，学习排序、搜索等经典算法...',
                status: 'not_started',
                prerequisites: [],
            }],
            ['kp-4', {
                id: 'kp-4',
                title: 'Node.js 与 Express',
                subject: '后端开发',
                contentSnippet: '使用 JavaScript 构建高性能的服务器，学习如何通过 Express 框架快速搭建 API...',
                status: 'not_started',
                prerequisites: ['kp-2', 'kp-3'],
            }],
            ['kp-5', {
                id: 'kp-5',
                title: '数据库 (SQL & NoSQL)',
                subject: '后端开发',
                contentSnippet: '了解关系型数据库与非关系型数据库的区别，学习如何设计和查询数据...',
                status: 'not_started',
                prerequisites: ['kp-4'],
            }],
            ['kp-6', {
                id: 'kp-6',
                title: '现代前端框架 (Vue/React)',
                subject: '前端开发',
                contentSnippet: '学习组件化开发的思想，掌握至少一种现代前端框架，提升开发效率...',
                status: 'not_started',
                prerequisites: ['kp-2'],
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
// src/services/mockApiService.ts

import type {KnowledgePoint} from '@/stores/knowledge';
import type {UserInfo, StudyActivity} from '@/stores/user';

// 模拟网络延迟的辅助函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- 模拟知识库数据 (已根据您提供的 "Grok版" 路线图更新) ---
const mockKnowledgePoints: KnowledgePoint[] = [
    // 第一年
    {
        id: 'cs-y1-s1-c1',
        title: '编程导论',
        subject: '第一学期',
        contentSnippet: '建立编程思维，理解基本计算原理，提升问题分解和代码实现能力。',
        status: 'completed',
        prerequisites: []
    },
    {
        id: 'cs-y1-s1-c2',
        title: '离散数学基础',
        subject: '第一学期',
        contentSnippet: '学习逻辑、证明、集合论和图论入门，为算法学习打下数学基础。',
        status: 'completed',
        prerequisites: []
    },
    {
        id: 'cs-y1-s1-c3',
        title: '计算机科学导论',
        subject: '第一学期',
        contentSnippet: '了解计算模型、硬件概述和软件层次，建立对计算机科学的宏观认识。',
        status: 'completed',
        prerequisites: []
    },
    {
        id: 'cs-y1-s2-c1',
        title: '高级编程',
        subject: '第二学期',
        contentSnippet: '掌握面向对象思想，包括类、继承、多态，以及异常处理和模块化。',
        status: 'in_progress',
        prerequisites: ['cs-y1-s1-c1']
    },
    {
        id: 'cs-y1-s2-c2',
        title: '线性代数与微积分',
        subject: '第二学期',
        contentSnippet: '学习向量、矩阵、导数和积分，是图形学和机器学习的数学基石。',
        status: 'in_progress',
        prerequisites: []
    },
    {
        id: 'cs-y1-s2-c3',
        title: '数据结构入门',
        subject: '第二学期',
        contentSnippet: '学习数组、链表、栈、队列等线性结构，并理解时间复杂度分析。',
        status: 'in_progress',
        prerequisites: ['cs-y1-s1-c1']
    },

    // 第二年
    {
        id: 'cs-y2-s3-c1',
        title: '计算机组成原理',
        subject: '第三学期',
        contentSnippet: '深入数字逻辑、处理器设计、流水线和内存层次，理解计算机硬件工作原理。',
        status: 'not_started',
        prerequisites: ['cs-y1-s1-c3']
    },
    {
        id: 'cs-y2-s3-c2',
        title: '数据结构与算法',
        subject: '第三学期',
        contentSnippet: '掌握树、图等非线性结构，以及排序、搜索和动态规划入门。',
        status: 'not_started',
        prerequisites: ['cs-y1-s2-c3']
    },
    {
        id: 'cs-y2-s3-c3',
        title: '软件工程基础',
        subject: '第三学期',
        contentSnippet: '学习敏捷开发、版本控制(Git)和单元测试，为团队协作做准备。',
        status: 'not_started',
        prerequisites: ['cs-y1-s2-c1']
    },
    {
        id: 'cs-y2-s4-c1',
        title: '算法分析',
        subject: '第四学期',
        contentSnippet: '学习贪心算法、高级图算法和NP-complete理论，深化算法设计能力。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c2']
    },
    {
        id: 'cs-y2-s4-c2',
        title: '编程语言原理',
        subject: '第四学期',
        contentSnippet: '探索不同编程范式，理解类型系统和垃圾回收机制。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c1']
    },
    {
        id: 'cs-y2-s4-c3',
        title: '数据库基础',
        subject: '第四学期',
        contentSnippet: '学习关系模型、SQL查询和数据库范式设计。',
        status: 'not_started',
        prerequisites: ['cs-y1-s2-c3']
    },

    // 第三年
    {
        id: 'cs-y3-s5-c1',
        title: '操作系统',
        subject: '第五学期',
        contentSnippet: '掌握进程管理、线程调度、内存管理和文件系统等核心概念。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c1']
    },
    {
        id: 'cs-y3-s5-c2',
        title: '计算机网络',
        subject: '第五学期',
        contentSnippet: '学习TCP/IP协议栈，理解HTTP、DNS等应用层协议和路由原理。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c1']
    },
    {
        id: 'cs-y3-s5-c3',
        title: '编译原理基础',
        subject: '第五学期',
        contentSnippet: '了解词法分析、语法分析和语义分析，构建编译器的第一步。',
        status: 'not_started',
        prerequisites: ['cs-y2-s4-c2']
    },
    {
        id: 'cs-y3-s6-c1',
        title: '软件工程',
        subject: '第六学期',
        contentSnippet: '深入测试驱动开发、设计模式和CI/CD，掌握构建大型软件的工程方法。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c3']
    },
    {
        id: 'cs-y3-s6-c2',
        title: '大数据基础',
        subject: '第六学期',
        contentSnippet: '入门Hadoop、MapReduce和Spark，理解分布式计算的核心思想。',
        status: 'not_started',
        prerequisites: ['cs-y3-s5-c1']
    },
    {
        id: 'cs-y3-s6-c3',
        title: '人工智能导论',
        subject: '第六学期',
        contentSnippet: '学习A*搜索、机器学习基础（回归、分类），开启AI大门。',
        status: 'not_started',
        prerequisites: ['cs-y2-s4-c1']
    },

    // 第四年
    {
        id: 'cs-y4-s7-c1',
        title: '编译器与优化',
        subject: '第七学期',
        contentSnippet: '学习代码生成、优化技术，完成一个简易编译器。',
        status: 'not_started',
        prerequisites: ['cs-y3-s5-c3']
    },
    {
        id: 'cs-y4-s7-c2',
        title: '分布式系统',
        subject: '第七学期',
        contentSnippet: '理解CAP定理、共识算法（Paxos/Raft），挑战大规模系统的设计。',
        status: 'not_started',
        prerequisites: ['cs-y3-s5-c1', 'cs-y3-s5-c2']
    },
    {
        id: 'cs-y4-s8-c1',
        title: '顶点设计 (Capstone)',
        subject: '第八学期',
        contentSnippet: '综合四年所学，完成一个完整的、有深度的毕业设计项目。',
        status: 'not_started',
        prerequisites: ['cs-y3-s6-c1']
    },
    {
        id: 'cs-y4-s8-c2',
        title: '计算机伦理与职业发展',
        subject: '第八学期',
        contentSnippet: '探讨技术带来的社会伦理问题，并为技术面试和职业生涯做准备。',
        status: 'not_started',
        prerequisites: []
    },
];


// --- 模拟用户数据 (保持不变) ---
const mockUserData = {
    'amyg@example.com': {
        user: {
            username: '山崎Amyg',
            email: 'amyg@example.com',
        },
        progress: {completed: 3, total: 22}, // 已更新
        studyTime: '8小时 21分钟',
        skillMastery: [
            {name: '编程语言', level: 85},
            {name: '数据结构', level: 70},
            {name: '算法', level: 75},
            {name: '前端开发', level: 90},
            {name: '后端开发', level: 60},
            {name: '数据库', level: 80},
        ],
        studyActivityData: getVirtualData(new Date().getFullYear().toString()),
    }
};

// ... getVirtualData 函数保持不变 ...
function getVirtualData(year: string): StudyActivity {
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


// --- 导出的模拟 API 函数 (保持不变) ---

export const apiLogin = async (email: string, password: string): Promise<{ user: UserInfo, token: string }> => {
    await sleep(800);
    // @ts-ignore
    if (mockUserData[email] && password === 'password') {
        return {
            // @ts-ignore
            user: mockUserData[email].user,
            token: `fake-jwt-token-for-${email}`
        };
    } else {
        throw new Error('邮箱或密码错误');
    }
};

export const apiGetUserProfile = async (token: string) => {
    await sleep(500);
    if (token.startsWith('fake-jwt-token-for-')) {
        const email = token.replace('fake-jwt-token-for-', '');
        // @ts-ignore
        const data = mockUserData[email];
        if (data) {
            return {
                progress: {...data.progress, total: mockKnowledgePoints.length}, // 动态计算总数
                studyTime: data.studyTime,
                skillMastery: data.skillMastery,
                studyActivityData: data.studyActivityData,
            };
        }
    }
    throw new Error('无效的 Token');
};

export const apiGetKnowledgePoints = async (): Promise<KnowledgePoint[]> => {
    await sleep(600);
    return JSON.parse(JSON.stringify(mockKnowledgePoints));
};
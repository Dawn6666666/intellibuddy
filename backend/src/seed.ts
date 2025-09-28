// backend/src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';
// 1. 修改这里的导入，不再使用不存在的 KnowledgePointData
import type { IKnowledgePoint } from './models/KnowledgePoint';

dotenv.config();

// 2. 修改这里的类型定义，直接使用 IKnowledgePoint
const knowledgePointsData: Partial<IKnowledgePoint>[] = [
    { id: 'cs-y1-s1-c1', title: '编程导论', subject: '第一学期', contentSnippet: '建立编程思维，理解基本计算原理，提升问题分解和代码实现能力。', status: 'completed', prerequisites: [] },
    { id: 'cs-y1-s1-c2', title: '离散数学基础', subject: '第一学期', contentSnippet: '学习逻辑、证明、集合论和图论入门，为算法学习打下数学基础。', status: 'completed', prerequisites: [] },
    { id: 'cs-y1-s1-c3', title: '计算机科学导论', subject: '第一学期', contentSnippet: '了解计算模型、硬件概述和软件层次，建立对计算机科学的宏观认识。', status: 'completed', prerequisites: [] },
    { id: 'cs-y1-s2-c1', title: '高级编程', subject: '第二学期', contentSnippet: '掌握面向对象思想，包括类、继承、多态，以及异常处理和模块化。', status: 'in_progress', prerequisites: ['cs-y1-s1-c1'] },
    { id: 'cs-y1-s2-c2', title: '线性代数与微积分', subject: '第二学期', contentSnippet: '学习向量、矩阵、导数和积分，是图形学和机器学习的数学基石。', status: 'in_progress', prerequisites: [] },
    { id: 'cs-y1-s2-c3', title: '数据结构入门', subject: '第二学期', contentSnippet: '学习数组、链表、栈、队列等线性结构，并理解时间复杂度分析。', status: 'in_progress', prerequisites: ['cs-y1-s1-c1'] },
    { id: 'cs-y2-s3-c1', title: '计算机组成原理', subject: '第三学期', contentSnippet: '深入数字逻辑、处理器设计、流水线和内存层次，理解计算机硬件工作原理。', status: 'not_started', prerequisites: ['cs-y1-s1-c3'] },
    { id: 'cs-y2-s3-c2', title: '数据结构与算法', subject: '第三学期', contentSnippet: '掌握树、图等非线性结构，以及排序、搜索和动态规划入门。', status: 'not_started', prerequisites: ['cs-y1-s2-c3'] },
    { id: 'cs-y2-s3-c3', title: '软件工程基础', subject: '第三学期', contentSnippet: '学习敏捷开发、版本控制(Git)和单元测试，为团队协作做准备。', status: 'not_started', prerequisites: ['cs-y1-s2-c1'] },
    { id: 'cs-y2-s4-c1', title: '算法分析', subject: '第四学期', contentSnippet: '学习贪心算法、高级图算法和NP-complete理论，深化算法设计能力。', status: 'not_started', prerequisites: ['cs-y2-s3-c2'] },
    { id: 'cs-y2-s4-c2', title: '编程语言原理', subject: '第四学期', contentSnippet: '探索不同编程范式，理解类型系统和垃圾回收机制。', status: 'not_started', prerequisites: ['cs-y2-s3-c1'] },
    { id: 'cs-y2-s4-c3', title: '数据库基础', subject: '第四学期', contentSnippet: '学习关系模型、SQL查询和数据库范式设计。', status: 'not_started', prerequisites: ['cs-y1-s2-c3'] },
    { id: 'cs-y3-s5-c1', title: '操作系统', subject: '第五学期', contentSnippet: '掌握进程管理、线程调度、内存管理和文件系统等核心概念。', status: 'not_started', prerequisites: ['cs-y2-s3-c1'] },
    { id: 'cs-y3-s5-c2', title: '计算机网络', subject: '第五学期', contentSnippet: '学习TCP/IP协议栈，理解HTTP、DNS等应用层协议和路由原理。', status: 'not_started', prerequisites: ['cs-y2-s3-c1'] },
    { id: 'cs-y3-s5-c3', title: '编译原理基础', subject: '第五学期', contentSnippet: '了解词法分析、语法分析和语义分析，构建编译器的第一步。', status: 'not_started', prerequisites: ['cs-y2-s4-c2'] },
    { id: 'cs-y3-s6-c1', title: '软件工程', subject: '第六学期', contentSnippet: '深入测试驱动开发、设计模式和CI/CD，掌握构建大型软件的工程方法。', status: 'not_started', prerequisites: ['cs-y2-s3-c3'] },
    { id: 'cs-y3-s6-c2', title: '大数据基础', subject: '第六学期', contentSnippet: '入门Hadoop、MapReduce和Spark，理解分布式计算的核心思想。', status: 'not_started', prerequisites: ['cs-y3-s5-c1'] },
    { id: 'cs-y3-s6-c3', title: '人工智能导论', subject: '第六学期', contentSnippet: '学习A*搜索、机器学习基础（回归、分类），开启AI大门。', status: 'not_started', prerequisites: ['cs-y2-s4-c1'] },
    { id: 'cs-y4-s7-c1', title: '编译器与优化', subject: '第七学期', contentSnippet: '学习代码生成、优化技术，完成一个简易编译器。', status: 'not_started', prerequisites: ['cs-y3-s5-c3'] },
    { id: 'cs-y4-s7-c2', title: '分布式系统', subject: '第七学期', contentSnippet: '理解CAP定理、共识算法（Paxos/Raft），挑战大规模系统的设计。', status: 'not_started', prerequisites: ['cs-y3-s5-c1', 'cs-y3-s5-c2'] },
    { id: 'cs-y4-s8-c1', title: '顶点设计 (Capstone)', subject: '第八学期', contentSnippet: '综合四年所学，完成一个完整的、有深度的毕业设计项目。', status: 'not_started', prerequisites: ['cs-y3-s6-c1'] },
    { id: 'cs-y4-s8-c2', title: '计算机伦理与职业发展', subject: '第八学期', contentSnippet: '探讨技术带来的社会伦理问题，并为技术面试和职业生涯做准备。', status: 'not_started', prerequisites: [] },
];


const seedDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("错误: MONGO_URI 未在 .env 文件中定义");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);

        console.log("正在删除旧数据...");
        await KnowledgePoint.deleteMany({});

        console.log("正在插入新数据...");
        await KnowledgePoint.insertMany(knowledgePointsData);

        console.log("数据库填充成功！");
    } catch (error) {
        console.error("数据库填充失败:", error);
    } finally {
        await mongoose.connection.close();
        console.log("数据库连接已关闭。");
    }
};

seedDB();
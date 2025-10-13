// backend/src/java-module.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';
import type {IKnowledgePoint} from './models/KnowledgePoint';

dotenv.config();

const knowledgePointsData: Partial<IKnowledgePoint>[] = [
    // --- JavaSE 核心内容 ---
    {
        id: 'java-se-1',
        title: 'JavaSE 核心 (一): 走进Java语言',
        subject: 'JavaSE 核心',
        contentSnippet: '了解Java语言特性、发展历史，并完成开发环境的搭建和IDE的基本使用。',
        prerequisites: [],
        status: 'not_started',
        graphPosition: { x: 100, y: 100 }
    },
    {
        id: 'java-se-2',
        title: 'JavaSE 核心 (二): 面向过程编程',
        subject: 'JavaSE 核心',
        contentSnippet: '学习Java的基本语法、数据类型、运算符以及流程控制语句，奠定编程基础。',
        prerequisites: ['java-se-1'],
        status: 'not_started',
        graphPosition: { x: 100, y: 200 }
    },
    {
        id: 'java-se-3',
        title: 'JavaSE 核心 (三): 面向对象基础',
        subject: 'JavaSE 核心',
        contentSnippet: '掌握类与对象的概念，理解封装、继承和多态三大面向对象特性。',
        prerequisites: ['java-se-2'],
        status: 'not_started',
        graphPosition: { x: 100, y: 300 }
    },
    {
        id: 'java-se-4',
        title: 'JavaSE 核心 (四): 面向对象高级',
        subject: 'JavaSE 核心',
        contentSnippet: '深入学习包装类、内部类、异常处理机制以及常用的工具类。',
        prerequisites: ['java-se-3'],
        status: 'not_started',
        graphPosition: { x: 100, y: 400 }
    },
    {
        id: 'java-se-5',
        title: 'JavaSE 核心 (五): 泛型与数据结构',
        subject: 'JavaSE 核心',
        contentSnippet: '学习泛型编程，并了解线性表、栈、队列、树等核心数据结构。',
        prerequisites: ['java-se-4'],
        status: 'not_started',
        graphPosition: { x: 100, y: 500 }
    },
    {
        id: 'java-se-6',
        title: 'JavaSE 核心 (六): 集合类与IO',
        subject: 'JavaSE 核心',
        contentSnippet: '掌握Java集合框架（List, Set, Map）和强大的I/O流操作。',
        prerequisites: ['java-se-5'],
        status: 'not_started',
        graphPosition: { x: 100, y: 600 }
    },
    {
        id: 'java-se-7',
        title: 'JavaSE 核心 (七): 多线程与反射',
        subject: 'JavaSE 核心',
        contentSnippet: '理解多线程并发编程和Java的动态反射机制，探索语言的深层能力。',
        prerequisites: ['java-se-6'],
        status: 'not_started',
        graphPosition: { x: 100, y: 700 }
    },
    {
        id: 'java-se-8',
        title: 'JavaSE 核心 (八): GUI程序开发',
        subject: 'JavaSE 核心',
        contentSnippet: '学习使用AWT和Swing组件库，开发图形化用户界面桌面应用。',
        prerequisites: ['java-se-3'],
        status: 'not_started',
        graphPosition: { x: 300, y: 300 }
    },

    // --- JavaWeb 入门 ---
    {
        id: 'java-web-1',
        title: 'JavaWeb 入门 (一): Java网络编程',
        subject: 'JavaWeb 入门',
        contentSnippet: '了解计算机网络基础，学习使用Socket技术进行TCP/UDP通信。',
        prerequisites: ['java-se-7'],
        status: 'not_started',
        graphPosition: { x: 100, y: 800 }
    },
    {
        id: 'java-web-2',
        title: 'JavaWeb 入门 (二): 数据库基础',
        subject: 'JavaWeb 入门',
        contentSnippet: '学习关系型数据库模型和SQL语言，掌握数据的增删改查操作。',
        prerequisites: ['java-se-6'],
        status: 'not_started',
        graphPosition: { x: 300, y: 600 }
    },
    {
        id: 'java-web-3',
        title: 'JavaWeb 入门 (三): Java与数据库',
        subject: 'JavaWeb 入门',
        contentSnippet: '掌握JDBC API，并学习使用Mybatis持久层框架简化数据库操作。',
        prerequisites: ['java-web-2'],
        status: 'not_started',
        graphPosition: { x: 300, y: 700 }
    },
    {
        id: 'java-web-4',
        title: 'JavaWeb 入门 (四): 前端基础',
        subject: 'JavaWeb 入门',
        contentSnippet: '学习HTML、CSS和JavaScript，构建网页的基本结构、样式和交互。',
        prerequisites: [],
        status: 'not_started',
        graphPosition: { x: 500, y: 100 }
    },
    {
        id: 'java-web-5',
        title: 'JavaWeb 入门 (五): 后端开发',
        subject: 'JavaWeb 入门',
        contentSnippet: '深入理解HTTP协议，学习Servlet、Filter等核心Web组件，构建动态网站。',
        prerequisites: ['java-web-3', 'java-web-4'],
        status: 'not_started',
        graphPosition: { x: 400, y: 700 }
    },
];


const seedJavaModule = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("错误: MONGO_URI 未在 .env 文件中定义");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);

        console.log("正在清空知识库，准备载入 Java 模块...");
        await KnowledgePoint.deleteMany({});

        console.log("正在插入 Java 模块数据...");
        await KnowledgePoint.insertMany(knowledgePointsData);

        console.log("Java 模块数据填充成功！");
    } catch (error) {
        console.error("数据库填充失败:", error);
    } finally {
        await mongoose.connection.close();
        console.log("数据库连接已关闭。");
    }
};

seedJavaModule();
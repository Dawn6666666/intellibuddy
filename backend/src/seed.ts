// backend/src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';
// 1. 修改这里的导入，不再使用不存在的 KnowledgePointData
import type { IKnowledgePoint } from './models/KnowledgePoint';

dotenv.config();

// 2. 修改这里的类型定义，直接使用 IKnowledgePoint
const knowledgePointsData: Partial<IKnowledgePoint>[] = [
    {
        id: 'cs-y1-s1-c1',
        title: '编程导论',
        subject: '编程基础',
        contentSnippet: '建立编程思维，理解基本计算原理，提升问题分解和代码实现能力。',
        status: 'not_started',
        prerequisites: [],
        difficulty: 1,
        estimatedTime: 45,
        graphPosition: {x: 100, y: 100},
        quiz: [
            {
                question: '以下哪个是编程的核心思想？',
                type: 'single',
                options: ['死记硬背语法', '问题分解与抽象', '使用最复杂的代码', '避免使用函数'],
                correctAnswer: 1,
                explanation: '编程的核心是将复杂问题分解为简单子问题，通过抽象来提高代码复用性和可维护性。'
            },
            {
                question: '变量的作用是什么？',
                type: 'single',
                options: ['存储数据', '执行计算', '控制程序流程', '输出结果'],
                correctAnswer: 0,
                explanation: '变量用于在内存中存储数据，是程序处理信息的基础。'
            },
            {
                question: '以下哪些是基本数据类型？',
                type: 'multiple',
                options: ['整数', '浮点数', '字符串', '数组'],
                correctAnswer: [0, 1, 2],
                explanation: '整数、浮点数和字符串都是基本数据类型，而数组是复合数据类型。'
            }
        ]
    },
    {
        id: 'cs-y1-s1-c2',
        title: '离散数学基础',
        subject: '数学基础',
        contentSnippet: '学习逻辑、证明、集合论和图论入门，为算法学习打下数学基础。',
        status: 'not_started',
        prerequisites: [],
        difficulty: 2,
        estimatedTime: 60,
        graphPosition: {x: 300, y: 100},
        quiz: [
            {
                question: '逻辑运算 AND (真 AND 假) 的结果是？',
                type: 'boolean',
                options: ['真', '假'],
                correctAnswer: 1,
                explanation: 'AND运算只有当两个操作数都为真时，结果才为真。'
            },
            {
                question: '集合 {1, 2, 3} 和 {2, 3, 4} 的交集是？',
                type: 'single',
                options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', '空集'],
                correctAnswer: 1,
                explanation: '交集包含两个集合中共同拥有的元素。'
            },
            {
                question: '图论中，度为奇数的顶点个数必然是偶数。',
                type: 'boolean',
                options: ['对', '错'],
                correctAnswer: 0,
                explanation: '这是握手定理的推论，因为所有顶点的度数之和等于边数的两倍（偶数）。'
            }
        ]
    },
    {
        id: 'cs-y1-s1-c3',
        title: '计算机科学导论',
        subject: '计算机基础',
        contentSnippet: '了解计算模型、硬件概述和软件层次，建立对计算机科学的宏观认识。',
        status: 'not_started',
        prerequisites: [],
        difficulty: 1,
        estimatedTime: 40,
        graphPosition: {x: 500, y: 100},
        quiz: [
            {
                question: '以下哪个是冯·诺依曼体系结构的核心思想？',
                type: 'single',
                options: ['程序外置', '数据与指令分离', '存储程序', '并行计算'],
                correctAnswer: 2,
                explanation: '冯·诺依曼体系结构的核心是"存储程序"，即程序和数据都存储在同一内存中。'
            },
            {
                question: 'CPU的主要组成部分包括？',
                type: 'multiple',
                options: ['运算器', '控制器', '硬盘', '寄存器'],
                correctAnswer: [0, 1, 3],
                explanation: 'CPU由运算器(ALU)、控制器和寄存器组成，硬盘是外部存储设备。'
            }
        ]
    },
    {
        id: 'cs-y1-s2-c1',
        title: '高级编程',
        subject: '编程基础',
        contentSnippet: '掌握面向对象思想，包括类、继承、多态，以及异常处理和模块化。',
        status: 'not_started',
        prerequisites: ['cs-y1-s1-c1'],
        difficulty: 2,
        estimatedTime: 50,
        graphPosition: {x: 100, y: 250},
        quiz: [
            {
                question: '封装的主要目的是什么？',
                type: 'single',
                options: ['提高性能', '隐藏实现细节', '增加代码量', '减少内存使用'],
                correctAnswer: 1,
                explanation: '封装通过隐藏实现细节，只暴露必要接口，提高代码的安全性和可维护性。'
            },
            {
                question: '多态允许不同类的对象对同一消息做出不同响应。',
                type: 'boolean',
                options: ['对', '错'],
                correctAnswer: 0,
                explanation: '多态是面向对象的核心特性之一，允许使用父类引用指向子类对象。'
            },
            {
                question: '以下哪些是面向对象的基本特征？',
                type: 'multiple',
                options: ['封装', '继承', '多态', '递归'],
                correctAnswer: [0, 1, 2],
                explanation: '面向对象的三大特征是封装、继承和多态，递归是一种编程技巧。'
            }
        ]
    },
    {
        id: 'cs-y1-s2-c3',
        title: '数据结构入门',
        subject: '数据结构',
        contentSnippet: '学习数组、链表、栈、队列等线性结构，并理解时间复杂度分析。',
        status: 'not_started',
        prerequisites: ['cs-y1-s1-c1'],
        difficulty: 2,
        estimatedTime: 55,
        graphPosition: {x: 300, y: 250},
        quiz: [
            {
                question: '栈的特点是？',
                type: 'single',
                options: ['先进先出', '后进先出', '随机访问', '优先级访问'],
                correctAnswer: 1,
                explanation: '栈是后进先出(LIFO)的数据结构，最后入栈的元素最先出栈。'
            },
            {
                question: '数组访问元素的时间复杂度是？',
                type: 'single',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                correctAnswer: 0,
                explanation: '数组支持随机访问，通过索引可以在常数时间O(1)内访问任何元素。'
            },
            {
                question: '链表相比数组的优势是？',
                type: 'multiple',
                options: ['插入删除更快', '不需要连续内存', '随机访问更快', '动态扩展更灵活'],
                correctAnswer: [0, 1, 3],
                explanation: '链表在插入删除、内存使用和动态扩展方面有优势，但随机访问较慢。'
            }
        ]
    },
    {
        id: 'cs-y2-s3-c2',
        title: '数据结构与算法',
        subject: '算法',
        contentSnippet: '掌握树、图等非线性结构，以及排序、搜索和动态规划入门。',
        status: 'not_started',
        prerequisites: ['cs-y1-s2-c3'],
        difficulty: 3,
        estimatedTime: 70,
        graphPosition: {x: 300, y: 400},
        quiz: [
            {
                question: '二叉搜索树的特点是？',
                type: 'single',
                options: ['左子树都小于根节点', '右子树都大于根节点', '左小右大', '以上都对'],
                correctAnswer: 3,
                explanation: '二叉搜索树满足：左子树所有节点<根节点<右子树所有节点。'
            },
            {
                question: '快速排序的平均时间复杂度是？',
                type: 'single',
                options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
                correctAnswer: 1,
                explanation: '快速排序平均情况下时间复杂度为O(n log n)，最坏情况为O(n²)。'
            },
            {
                question: '深度优先搜索使用栈来实现。',
                type: 'boolean',
                options: ['对', '错'],
                correctAnswer: 0,
                explanation: 'DFS可以用递归(隐式栈)或显式栈实现，而BFS使用队列。'
            }
        ]
    },
    {
        id: 'cs-y2-s3-c1',
        title: '计算机组成原理',
        subject: '计算机基础',
        contentSnippet: '深入数字逻辑、处理器设计、流水线和内存层次，理解计算机硬件工作原理。',
        status: 'not_started',
        prerequisites: ['cs-y1-s1-c3'],
        difficulty: 3,
        estimatedTime: 65,
        graphPosition: {x: 500, y: 250},
        quiz: [
            {
                question: 'CPU流水线的主要优势是？',
                type: 'single',
                options: ['降低功耗', '提高吞吐量', '减少指令数', '简化设计'],
                correctAnswer: 1,
                explanation: '流水线通过指令级并行提高了CPU的吞吐量，虽然单条指令延迟未减少。'
            },
            {
                question: 'Cache的作用是？',
                type: 'single',
                options: ['增加存储容量', '弥合CPU和内存的速度差距', '降低成本', '提高可靠性'],
                correctAnswer: 1,
                explanation: 'Cache是高速缓冲存储器，用于缓解CPU与主存之间的速度差异。'
            }
        ]
    },
    {
        id: 'cs-y3-s5-c1',
        title: '操作系统',
        subject: '操作系统',
        contentSnippet: '掌握进程管理、线程调度、内存管理和文件系统等核心概念。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c1'],
        difficulty: 4,
        estimatedTime: 80,
        graphPosition: {x: 500, y: 400},
        quiz: [
            {
                question: '进程和线程的主要区别是？',
                type: 'single',
                options: ['进程更轻量', '线程有独立地址空间', '线程共享进程资源', '进程不能通信'],
                correctAnswer: 2,
                explanation: '线程是轻量级进程，同一进程内的线程共享地址空间和资源。'
            },
            {
                question: '死锁的必要条件包括？',
                type: 'multiple',
                options: ['互斥', '请求与保持', '不剥夺', '循环等待'],
                correctAnswer: [0, 1, 2, 3],
                explanation: '死锁的四个必要条件：互斥、请求与保持、不剥夺、循环等待。'
            },
            {
                question: '虚拟内存技术可以让程序使用超过物理内存的地址空间。',
                type: 'boolean',
                options: ['对', '错'],
                correctAnswer: 0,
                explanation: '虚拟内存通过页面置换等技术，使程序可以使用大于物理内存的虚拟地址空间。'
            }
        ]
    },
    {
        id: 'cs-y3-s5-c2',
        title: '计算机网络',
        subject: '计算机网络',
        contentSnippet: '学习TCP/IP协议栈，理解HTTP、DNS等应用层协议和路由原理。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c1'],
        difficulty: 3,
        estimatedTime: 70,
        graphPosition: {x: 700, y: 400},
        quiz: [
            {
                question: 'TCP和UDP的主要区别是？',
                type: 'single',
                options: ['TCP更快', 'UDP提供可靠传输', 'TCP提供可靠传输', 'UDP需要连接'],
                correctAnswer: 2,
                explanation: 'TCP是面向连接的可靠传输协议，而UDP是无连接的不可靠传输。'
            },
            {
                question: 'HTTP协议工作在哪一层？',
                type: 'single',
                options: ['物理层', '网络层', '传输层', '应用层'],
                correctAnswer: 3,
                explanation: 'HTTP是应用层协议，构建在TCP传输层协议之上。'
            },
            {
                question: 'IP地址的作用是在网络中唯一标识设备。',
                type: 'boolean',
                options: ['对', '错'],
                correctAnswer: 0,
                explanation: 'IP地址是网络层地址，用于在互联网中唯一标识和定位设备。'
            }
        ]
    },
    {
        id: 'cs-y2-s4-c1',
        title: '算法分析',
        subject: '算法',
        contentSnippet: '学习贪心算法、高级图算法和NP-complete理论，深化算法设计能力。',
        status: 'not_started',
        prerequisites: ['cs-y2-s3-c2'],
        difficulty: 4,
        estimatedTime: 75,
        graphPosition: {x: 300, y: 550},
        quiz: [
            {
                question: '贪心算法能保证得到最优解吗？',
                type: 'boolean',
                options: ['能', '不能'],
                correctAnswer: 1,
                explanation: '贪心算法在某些问题上能得到最优解，但不是所有问题都适用，需要满足贪心选择性质。'
            },
            {
                question: 'Dijkstra算法用于解决什么问题？',
                type: 'single',
                options: ['最小生成树', '单源最短路径', '最大流', '字符串匹配'],
                correctAnswer: 1,
                explanation: 'Dijkstra算法用于求单源最短路径，适用于非负权图。'
            },
            {
                question: 'P问题和NP问题的关系是？',
                type: 'single',
                options: ['P=NP', 'P⊂NP', 'NP⊂P', '没有关系'],
                correctAnswer: 1,
                explanation: '所有P问题都是NP问题，但反过来是否成立(P=NP?)是计算机科学未解之谜。'
            }
        ]
    }
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
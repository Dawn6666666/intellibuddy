import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year2KnowledgePoints = [
  {
    "id": "cs201",
    "order": 8,
    "title": "计算机组成与体系结构",
    "description": "深入理解计算机硬件的工作原理，从逻辑门到处理器设计，理解软硬件接口。",
    "subject": "计算机科学",
    "category": "计算机系统",
    "difficulty": 3,
    "prerequisites": [
      "cs102-discrete"
    ],
    "learningPath": "第二学年 > 第三学期",
    "estimatedHours": 180,
    "contentSnippet": "数字逻辑、指令集架构(ISA)、计算机算术",
    "resources": [
      {
        "type": "book",
        "title": "Computer Organization and Design (Patterson & Hennessy)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《计算机组成与设计》",
        "url": ""
      },
      {
        "type": "video",
        "title": "Nand to Tetris",
        "url": "https://www.nand2tetris.org/"
      },
      {
        "type": "video",
        "title": "Ben Eater - Building an 8-bit computer",
        "url": "https://www.youtube.com/playlist?list=PLowKtXNTBypGqImE405J2565dvjafglHU"
      }
    ],
    "tags": [
      "计算机组成",
      "处理器",
      "流水线",
      "缓存"
    ],
    "subtopics": [
      {
        "title": "数字逻辑",
        "content": "布尔代数、逻辑门(AND/OR/NOT)、组合电路、时序电路",
        "order": 1
      },
      {
        "title": "指令集架构(ISA)",
        "content": "RISC vs CISC、MIPS指令集、寄存器、寻址模式",
        "order": 2
      },
      {
        "title": "计算机算术",
        "content": "整数表示(补码)、浮点数(IEEE 754)、ALU设计",
        "order": 3
      },
      {
        "title": "处理器设计",
        "content": "数据通路、控制器、单周期处理器、多周期处理器",
        "order": 4
      },
      {
        "title": "流水线",
        "content": "流水线概念、数据冒险、控制冒险、流水线停顿与转发",
        "order": 5
      },
      {
        "title": "内存层次",
        "content": "缓存原理、直接映射/组相联/全相联、替换策略、虚拟内存",
        "order": 6
      },
      {
        "title": "I/O系统",
        "content": "I/O设备、中断、DMA、总线",
        "order": 7
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 400
    }
  },
  {
    "id": "cs202",
    "order": 9,
    "title": "面向对象编程 (C++/Java)",
    "description": "深入学习面向对象编程范式，掌握类、继承、多态等核心概念。",
    "subject": "计算机科学",
    "category": "编程基础",
    "difficulty": 3,
    "prerequisites": [
      "cs104"
    ],
    "learningPath": "第二学年 > 第三学期",
    "estimatedHours": 180,
    "contentSnippet": "类与对象、封装、继承",
    "resources": [
      {
        "type": "book",
        "title": "C++ Primer (5th Edition)",
        "url": ""
      },
      {
        "type": "book",
        "title": "Effective Java (Joshua Bloch)",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford CS106B",
        "url": ""
      }
    ],
    "tags": [
      "OOP",
      "C++",
      "Java",
      "设计模式"
    ],
    "subtopics": [
      {
        "title": "类与对象",
        "content": "类定义、对象创建、成员变量与方法、访问控制",
        "order": 1
      },
      {
        "title": "封装",
        "content": "public/private/protected、getter/setter、信息隐藏",
        "order": 2
      },
      {
        "title": "继承",
        "content": "基类与派生类、方法重写、super关键字、多重继承(C++)",
        "order": 3
      },
      {
        "title": "多态",
        "content": "虚函数(C++)、动态绑定、接口(Java)、抽象类",
        "order": 4
      },
      {
        "title": "构造与析构",
        "content": "构造函数、析构函数、拷贝构造、移动语义(C++11)",
        "order": 5
      },
      {
        "title": "泛型编程",
        "content": "模板(C++)、泛型(Java)、STL容器",
        "order": 6
      },
      {
        "title": "设计模式",
        "content": "单例模式、工厂模式、观察者模式、策略模式",
        "order": 7
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 400
    }
  },
  {
    "id": "cs203",
    "order": 10,
    "title": "软件工程基础",
    "description": "学习软件开发的工程方法，包括版本控制、测试、敏捷开发等。",
    "subject": "计算机科学",
    "category": "软件工程",
    "difficulty": 3,
    "prerequisites": [
      "cs104"
    ],
    "learningPath": "第二学年 > 第三学期",
    "estimatedHours": 90,
    "contentSnippet": "Git进阶、软件开发流程、单元测试",
    "resources": [
      {
        "type": "book",
        "title": "Pro Git",
        "url": "https://git-scm.com/book/en/v2"
      },
      {
        "type": "video",
        "title": "MIT Missing Semester",
        "url": "https://missing.csail.mit.edu/"
      }
    ],
    "tags": [
      "Git",
      "测试",
      "敏捷",
      "团队协作"
    ],
    "subtopics": [
      {
        "title": "Git进阶",
        "content": "分支管理、合并策略、rebase、cherry-pick、解决冲突",
        "order": 1
      },
      {
        "title": "软件开发流程",
        "content": "瀑布模型、敏捷开发、Scrum、看板",
        "order": 2
      },
      {
        "title": "单元测试",
        "content": "测试框架、断言、测试覆盖率、TDD",
        "order": 3
      },
      {
        "title": "代码审查",
        "content": "Pull Request、代码评审标准、协作规范",
        "order": 4
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 500,
      "y": 400
    }
  },
  {
    "id": "cs204",
    "order": 11,
    "title": "算法设计与分析",
    "description": "学习高级算法设计范式，包括分治、动态规划、贪心算法和图算法。",
    "subject": "计算机科学",
    "category": "数据结构与算法",
    "difficulty": 3,
    "prerequisites": [
      "cs103"
    ],
    "learningPath": "第二学年 > 第四学期",
    "estimatedHours": 180,
    "contentSnippet": "分治算法、动态规划、贪心算法",
    "resources": [
      {
        "type": "book",
        "title": "Introduction to Algorithms (CLRS)",
        "url": ""
      },
      {
        "type": "book",
        "title": "The Algorithm Design Manual (Skiena)",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford Algorithms Specialization",
        "url": "https://www.coursera.org/"
      },
      {
        "type": "practice",
        "title": "LeetCode",
        "url": "https://leetcode.com/"
      }
    ],
    "tags": [
      "算法",
      "动态规划",
      "图算法",
      "NP完全"
    ],
    "subtopics": [
      {
        "title": "分治算法",
        "content": "分治思想、归并排序、快速排序、主定理",
        "order": 1
      },
      {
        "title": "动态规划",
        "content": "最优子结构、重叠子问题、状态转移方程、背包问题、最长公共子序列",
        "order": 2
      },
      {
        "title": "贪心算法",
        "content": "贪心选择性质、活动选择问题、霍夫曼编码",
        "order": 3
      },
      {
        "title": "图算法 - 遍历",
        "content": "深度优先搜索(DFS)、广度优先搜索(BFS)、拓扑排序",
        "order": 4
      },
      {
        "title": "图算法 - 最短路径",
        "content": "Dijkstra算法、Bellman-Ford算法、Floyd-Warshall算法",
        "order": 5
      },
      {
        "title": "图算法 - 最小生成树",
        "content": "Prim算法、Kruskal算法、并查集",
        "order": 6
      },
      {
        "title": "网络流",
        "content": "最大流问题、Ford-Fulkerson算法、最小割",
        "order": 7
      },
      {
        "title": "计算复杂性",
        "content": "P vs NP、NP完全问题、归约",
        "order": 8
      },
      {
        "title": "高级排序",
        "content": "堆排序、基数排序、计数排序、桶排序",
        "order": 9
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 750,
      "y": 400
    }
  },
  {
    "id": "cs205",
    "order": 12,
    "title": "操作系统",
    "description": "深入理解操作系统的核心功能，包括进程管理、内存管理、文件系统等。",
    "subject": "计算机科学",
    "category": "计算机系统",
    "difficulty": 3,
    "prerequisites": [
      "cs201"
    ],
    "learningPath": "第二学年 > 第四学期",
    "estimatedHours": 240,
    "contentSnippet": "进程与线程、CPU调度、进程同步",
    "resources": [
      {
        "type": "book",
        "title": "Operating System Concepts (Silberschatz)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《现代操作系统》(Tanenbaum)",
        "url": ""
      },
      {
        "type": "project",
        "title": "Stanford Pintos",
        "url": ""
      },
      {
        "type": "video",
        "title": "Berkeley CS162",
        "url": ""
      }
    ],
    "tags": [
      "操作系统",
      "进程",
      "内存",
      "文件系统"
    ],
    "subtopics": [
      {
        "title": "进程与线程",
        "content": "进程概念、进程状态、进程控制块(PCB)、线程模型、用户线程vs内核线程",
        "order": 1
      },
      {
        "title": "CPU调度",
        "content": "FCFS、SJF、优先级调度、轮转调度(RR)、多级反馈队列",
        "order": 2
      },
      {
        "title": "进程同步",
        "content": "临界区、互斥锁(Mutex)、信号量(Semaphore)、管程(Monitor)、条件变量",
        "order": 3
      },
      {
        "title": "死锁",
        "content": "死锁条件、死锁预防、死锁避免(银行家算法)、死锁检测与恢复",
        "order": 4
      },
      {
        "title": "内存管理",
        "content": "地址空间、分区分配、分页、分段、段页式",
        "order": 5
      },
      {
        "title": "虚拟内存",
        "content": "请求调页、页面置换算法(FIFO/LRU/Clock)、工作集、抖动",
        "order": 6
      },
      {
        "title": "文件系统",
        "content": "文件概念、目录结构、文件分配方法、空闲空间管理、FAT/NTFS/ext4",
        "order": 7
      },
      {
        "title": "I/O系统",
        "content": "I/O设备管理、缓冲、假脱机(Spooling)、磁盘调度",
        "order": 8
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 1000,
      "y": 400
    }
  },
  {
    "id": "cs206-db",
    "order": 13,
    "title": "数据库系统",
    "description": "学习关系数据库的原理与应用，掌握SQL和数据库设计方法。",
    "subject": "计算机科学",
    "category": "数据库",
    "difficulty": 3,
    "prerequisites": [
      "cs103"
    ],
    "learningPath": "第二学年 > 第四学期",
    "estimatedHours": 120,
    "contentSnippet": "关系模型、SQL基础、SQL进阶",
    "resources": [
      {
        "type": "book",
        "title": "Database System Concepts (Silberschatz)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《数据库系统概念》",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford CS145",
        "url": ""
      }
    ],
    "tags": [
      "数据库",
      "SQL",
      "关系模型",
      "范式"
    ],
    "subtopics": [
      {
        "title": "关系模型",
        "content": "关系、元组、属性、键(主键/外键)、完整性约束",
        "order": 1
      },
      {
        "title": "SQL基础",
        "content": "SELECT查询、WHERE条件、ORDER BY排序、聚合函数",
        "order": 2
      },
      {
        "title": "SQL进阶",
        "content": "JOIN连接、子查询、视图、索引",
        "order": 3
      },
      {
        "title": "数据库设计",
        "content": "ER图、实体、关系、属性、ER图转关系模式",
        "order": 4
      },
      {
        "title": "范式理论",
        "content": "函数依赖、1NF/2NF/3NF/BCNF、规范化",
        "order": 5
      },
      {
        "title": "事务管理",
        "content": "ACID属性、并发控制、锁机制、死锁",
        "order": 6
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 550
    }
  },
  {
    "id": "cs206-pl",
    "order": 14,
    "title": "编程语言原理",
    "description": "学习编程语言的设计原理，比较不同的编程范式。",
    "subject": "计算机科学",
    "category": "编程基础",
    "difficulty": 3,
    "prerequisites": [
      "cs202"
    ],
    "learningPath": "第二学年 > 第四学期",
    "estimatedHours": 90,
    "contentSnippet": "编程范式、函数式编程、类型系统",
    "resources": [
      {
        "type": "book",
        "title": "Concepts of Programming Languages (Sebesta)",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford CS242",
        "url": ""
      }
    ],
    "tags": [
      "编程语言",
      "函数式",
      "类型系统"
    ],
    "subtopics": [
      {
        "title": "编程范式",
        "content": "命令式、函数式、逻辑式、面向对象",
        "order": 1
      },
      {
        "title": "函数式编程",
        "content": "Lambda表达式、高阶函数、闭包、纯函数、不可变性",
        "order": 2
      },
      {
        "title": "类型系统",
        "content": "静态类型vs动态类型、强类型vs弱类型、类型推导",
        "order": 3
      },
      {
        "title": "内存管理",
        "content": "手动管理、引用计数、垃圾回收(标记-清除、分代GC)",
        "order": 4
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 550
    }
  }
];

async function seedYear2() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('请在 .env 文件中设置 MONGODB_URI');
    }

    await mongoose.connect(mongoUri);
    console.log('数据库连接成功');

    console.log('正在删除第2学年旧数据...');
    await KnowledgePoint.deleteMany({
      id: { $regex: /^(cs|math|data)20/ }
    });

    console.log('正在插入第2学年新数据...');
    await KnowledgePoint.insertMany(year2KnowledgePoints);

    console.log(`第2学年数据填充成功！共 ${year2KnowledgePoints.length} 个知识点`);
  } catch (error) {
    console.error('数据填充失败:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('数据库连接已关闭。');
  }
}

if (require.main === module) {
  seedYear2();
}

export { year2KnowledgePoints, seedYear2 };

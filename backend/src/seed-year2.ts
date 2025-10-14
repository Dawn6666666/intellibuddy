import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year2KnowledgePoints = [
  {
    "id": "math201",
    "order": 6,
    "title": "线性代数",
    "description": "学习线性代数的核心概念，包括向量、矩阵、线性变换等，为机器学习和图形学打基础。",
    "subject": "数学",
    "category": "数学基础",
    "difficulty": 1,
    "prerequisites": [],
    "learningPath": "第二学年 > 第三学期",
    "estimatedHours": 120,
    "contentSnippet": "向量、矩阵、行列式",
    "resources": [
      {
        "type": "book",
        "title": "Introduction to Linear Algebra (Gilbert Strang)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《线性代数》(清华大学)",
        "url": ""
      },
      {
        "type": "video",
        "title": "3Blue1Brown - Essence of Linear Algebra",
        "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab"
      },
      {
        "type": "video",
        "title": "MIT 18.06 Linear Algebra",
        "url": "https://ocw.mit.edu/"
      }
    ],
    "tags": [
      "线性代数",
      "矩阵",
      "向量",
      "特征值"
    ],
    "subtopics": [
      {
        "title": "向量",
        "content": "向量概念、向量运算、线性组合、线性相关性",
        "order": 1
      },
      {
        "title": "矩阵",
        "content": "矩阵运算、矩阵乘法、转置、逆矩阵",
        "order": 2
      },
      {
        "title": "行列式",
        "content": "行列式定义、性质、计算方法",
        "order": 3
      },
      {
        "title": "线性方程组",
        "content": "高斯消元法、矩阵的秩、解的结构",
        "order": 4
      },
      {
        "title": "向量空间",
        "content": "向量空间、子空间、基与维数",
        "order": 5
      },
      {
        "title": "特征值与特征向量",
        "content": "特征值定义、特征向量、对角化",
        "order": 6
      },
      {
        "title": "正交性",
        "content": "内积、正交向量、正交矩阵、最小二乘法",
        "order": 7
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 300
    }
  },
  {
    "id": "cs104",
    "order": 7,
    "title": "高级编程与代码规范",
    "description": "学习面向对象编程思想、异常处理、模块化设计和代码整洁原则。",
    "subject": "计算机科学",
    "category": "编程基础",
    "difficulty": 1,
    "prerequisites": [
      "cs101"
    ],
    "learningPath": "第二学年 > 第三学期",
    "estimatedHours": 90,
    "contentSnippet": "面向对象基础、异常处理、模块化",
    "resources": [
      {
        "type": "book",
        "title": "Clean Code (Robert C. Martin)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《代码整洁之道》",
        "url": ""
      },
      {
        "type": "video",
        "title": "MIT 6.0001 Introduction to CS",
        "url": "https://ocw.mit.edu/"
      }
    ],
    "tags": [
      "OOP",
      "代码规范",
      "异常处理",
      "模块化"
    ],
    "subtopics": [
      {
        "title": "面向对象基础",
        "content": "类与对象、封装、继承、多态",
        "order": 1
      },
      {
        "title": "异常处理",
        "content": "try-catch-finally、自定义异常、异常传播",
        "order": 2
      },
      {
        "title": "模块化",
        "content": "包管理、模块导入、命名空间",
        "order": 3
      },
      {
        "title": "代码整洁原则",
        "content": "命名规范、函数设计、注释规范、DRY原则",
        "order": 4
      },
      {
        "title": "版本控制",
        "content": "Git基础、分支管理、协作流程",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 300
    }
  },
  {
    "id": "math102",
    "order": 8,
    "title": "微积分 II",
    "description": "深入学习微积分，包括多元函数微积分、级数等高级主题。",
    "subject": "数学",
    "category": "数学基础",
    "difficulty": 2,
    "prerequisites": [
      "math101"
    ],
    "learningPath": "第二学年 > 第三学期",
    "estimatedHours": 150,
    "contentSnippet": "多元函数、偏导数、重积分",
    "resources": [
      {
        "type": "book",
        "title": "Calculus Volume 2 (OpenStax)",
        "url": "https://openstax.org/details/books/calculus-volume-2"
      },
      {
        "type": "book",
        "title": "《高等数学》(同济大学)",
        "url": ""
      }
    ],
    "tags": [
      "微积分",
      "多元函数",
      "级数",
      "重积分"
    ],
    "subtopics": [
      {
        "title": "多元函数",
        "content": "二元函数、极限与连续、偏导数",
        "order": 1
      },
      {
        "title": "重积分",
        "content": "二重积分、三重积分、坐标变换",
        "order": 2
      },
      {
        "title": "级数",
        "content": "数列极限、级数收敛、泰勒级数",
        "order": 3
      },
      {
        "title": "微分方程",
        "content": "一阶微分方程、二阶微分方程、应用",
        "order": 4
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 500,
      "y": 300
    }
  },
  {
    "id": "cs201",
    "order": 9,
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

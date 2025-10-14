import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year1KnowledgePoints = [
  {
    "id": "cs100",
    "order": 1,
    "title": "计算机导论",
    "description": "了解计算机科学的基本概念，包括计算机历史、硬件组成、软件系统、网络基础等。",
    "subject": "计算机科学",
    "category": "计算机系统",
    "difficulty": 1,
    "prerequisites": [],
    "learningPath": "第一学年 > 第一学期",
    "estimatedHours": 60,
    "contentSnippet": "计算机历史、硬件组成、操作系统概述",
    "resources": [
      {
        "type": "book",
        "title": "Computer Science: An Overview (Brookshear)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《计算机科学导论》",
        "url": ""
      }
    ],
    "tags": [
      "计算机导论",
      "计算机历史",
      "硬件",
      "软件"
    ],
    "subtopics": [
      {
        "title": "计算机历史",
        "content": "计算机发展史、图灵机、冯诺依曼架构",
        "order": 1
      },
      {
        "title": "硬件组成",
        "content": "CPU、内存、存储设备、输入输出设备",
        "order": 2
      },
      {
        "title": "操作系统概述",
        "content": "操作系统功能、常见操作系统、文件系统",
        "order": 3
      },
      {
        "title": "网络基础",
        "content": "互联网概述、TCP/IP协议、Web浏览器",
        "order": 4
      },
      {
        "title": "编程语言概述",
        "content": "编程语言分类、编译与解释、算法思维",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 100
    }
  },
  {
    "id": "cs101",
    "order": 2,
    "title": "编程导论 (C语言)",
    "description": "学习计算机编程的基础知识，使用C语言作为入门语言，掌握基本的编程思维和内存管理概念。",
    "subject": "计算机科学",
    "category": "编程基础",
    "difficulty": 1,
    "prerequisites": [],
    "learningPath": "第一学年 > 第一学期",
    "estimatedHours": 180,
    "contentSnippet": "基本语法、控制结构、函数",
    "resources": [
      {
        "type": "book",
        "title": "The C Programming Language (K&R)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《C程序设计》(谭浩强)",
        "url": ""
      },
      {
        "type": "video",
        "title": "Harvard CS50",
        "url": "https://cs50.harvard.edu/"
      },
      {
        "type": "practice",
        "title": "Exercism C Track",
        "url": "https://exercism.org/tracks/c"
      }
    ],
    "tags": [
      "C语言",
      "编程入门",
      "指针",
      "内存管理"
    ],
    "subtopics": [
      {
        "title": "基本语法",
        "content": "变量、数据类型（整数、浮点、字符）、运算符（算术、逻辑、位运算）",
        "order": 1
      },
      {
        "title": "控制结构",
        "content": "if-else条件判断、for/while/do-while循环、break和continue",
        "order": 2
      },
      {
        "title": "函数",
        "content": "函数定义、参数传递（值传递）、返回值、递归入门",
        "order": 3
      },
      {
        "title": "指针与内存",
        "content": "指针概念、内存地址、指针运算、动态内存分配（malloc/free）",
        "order": 4
      },
      {
        "title": "数组与字符串",
        "content": "一维/多维数组、字符数组、字符串处理函数",
        "order": 5
      },
      {
        "title": "结构体",
        "content": "struct定义、结构体数组、结构体指针",
        "order": 6
      },
      {
        "title": "文件I/O",
        "content": "标准输入输出、文件读写、二进制文件操作",
        "order": 7
      },
      {
        "title": "调试技巧",
        "content": "编译错误、运行时错误、使用GDB调试器、内存泄漏检测",
        "order": 8
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 200
    }
  },
  {
    "id": "math101",
    "order": 2,
    "title": "微积分 I",
    "description": "学习微积分的基础知识，包括极限、导数和积分，为后续的算法分析和优化问题打下数学基础。",
    "subject": "数学",
    "category": "数学基础",
    "difficulty": 1,
    "prerequisites": [],
    "learningPath": "第一学年 > 第一学期",
    "estimatedHours": 150,
    "contentSnippet": "函数与极限、导数、导数应用",
    "resources": [
      {
        "type": "book",
        "title": "Calculus Volume 1 (OpenStax)",
        "url": "https://openstax.org/details/books/calculus-volume-1"
      },
      {
        "type": "book",
        "title": "《高等数学》(同济大学)",
        "url": ""
      },
      {
        "type": "video",
        "title": "MIT 18.01 Single Variable Calculus",
        "url": "https://ocw.mit.edu/"
      },
      {
        "type": "video",
        "title": "3Blue1Brown - Essence of Calculus",
        "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr"
      }
    ],
    "tags": [
      "微积分",
      "导数",
      "积分",
      "极限"
    ],
    "subtopics": [
      {
        "title": "函数与极限",
        "content": "函数概念、极限定义、连续性、无穷小与无穷大",
        "order": 1
      },
      {
        "title": "导数",
        "content": "导数定义、求导法则、链式法则、隐函数求导",
        "order": 2
      },
      {
        "title": "导数应用",
        "content": "切线与法线、单调性、极值问题、最优化",
        "order": 3
      },
      {
        "title": "积分",
        "content": "不定积分、定积分、牛顿-莱布尼茨公式、换元积分法",
        "order": 4
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 200
    }
  },
  {
    "id": "cs102-discrete",
    "order": 3,
    "title": "离散数学与计算机科学导论",
    "description": "学习计算机科学的数学基础，包括逻辑、集合论、图论等，并了解计算机系统的基本概念。",
    "subject": "数学",
    "category": "数学基础",
    "difficulty": 1,
    "prerequisites": [],
    "learningPath": "第一学年 > 第一学期",
    "estimatedHours": 120,
    "contentSnippet": "命题逻辑、谓词逻辑、证明方法",
    "resources": [
      {
        "type": "book",
        "title": "Discrete Mathematics and its Applications (Rosen)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《离散数学及其应用》",
        "url": ""
      },
      {
        "type": "video",
        "title": "MIT 6.042J Mathematics for Computer Science",
        "url": "https://ocw.mit.edu/"
      }
    ],
    "tags": [
      "离散数学",
      "逻辑",
      "集合论",
      "图论",
      "计算模型"
    ],
    "subtopics": [
      {
        "title": "命题逻辑",
        "content": "命题、逻辑运算符、真值表、逻辑等价",
        "order": 1
      },
      {
        "title": "谓词逻辑",
        "content": "量词、谓词、逻辑推理",
        "order": 2
      },
      {
        "title": "证明方法",
        "content": "直接证明、反证法、数学归纳法",
        "order": 3
      },
      {
        "title": "集合论",
        "content": "集合运算、关系、函数",
        "order": 4
      },
      {
        "title": "图论入门",
        "content": "图的基本概念、节点与边、无向图与有向图",
        "order": 5
      },
      {
        "title": "计算模型",
        "content": "图灵机、冯诺依曼架构、计算机硬件概述",
        "order": 6
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 500,
      "y": 200
    }
  },
  {
    "id": "cs103",
    "order": 4,
    "title": "数据结构",
    "description": "学习基本的数据结构及其实现，包括线性结构、树和图，掌握算法复杂度分析方法。",
    "subject": "计算机科学",
    "category": "数据结构与算法",
    "difficulty": 1,
    "prerequisites": [
      "cs101"
    ],
    "learningPath": "第一学年 > 第二学期",
    "estimatedHours": 180,
    "contentSnippet": "抽象数据类型(ADT)、复杂度分析、数组",
    "resources": [
      {
        "type": "book",
        "title": "Introduction to Algorithms (CLRS)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《数据结构(C语言版)》(严蔚敏)",
        "url": ""
      },
      {
        "type": "video",
        "title": "UC San Diego - Data Structures",
        "url": "https://www.coursera.org/"
      },
      {
        "type": "practice",
        "title": "LeetCode",
        "url": "https://leetcode.com/"
      }
    ],
    "tags": [
      "数据结构",
      "算法",
      "复杂度分析",
      "Big O"
    ],
    "subtopics": [
      {
        "title": "抽象数据类型(ADT)",
        "content": "ADT概念、接口与实现分离",
        "order": 1
      },
      {
        "title": "复杂度分析",
        "content": "Big O表示法、时间复杂度、空间复杂度、最好/平均/最坏情况",
        "order": 2
      },
      {
        "title": "数组",
        "content": "静态数组、动态数组、数组操作的复杂度",
        "order": 3
      },
      {
        "title": "链表",
        "content": "单向链表、双向链表、循环链表、链表操作",
        "order": 4
      },
      {
        "title": "栈",
        "content": "栈的概念、数组实现、链表实现、应用场景",
        "order": 5
      },
      {
        "title": "队列",
        "content": "队列概念、循环队列、优先队列、双端队列",
        "order": 6
      },
      {
        "title": "哈希表",
        "content": "哈希函数、冲突解决（链地址法、开放地址法）、负载因子",
        "order": 7
      },
      {
        "title": "树",
        "content": "树的基本概念、二叉树、二叉搜索树(BST)、树的遍历",
        "order": 8
      },
      {
        "title": "平衡树",
        "content": "AVL树、红黑树简介",
        "order": 9
      },
      {
        "title": "堆",
        "content": "最大堆、最小堆、堆排序、优先队列实现",
        "order": 10
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 750,
      "y": 200
    }
  }
];

async function seedYear1() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('请在 .env 文件中设置 MONGODB_URI');
    }

    await mongoose.connect(mongoUri);
    console.log('数据库连接成功');

    console.log('正在删除第1学年旧数据...');
    await KnowledgePoint.deleteMany({
      id: { $regex: /^(cs|math|data)10/ }
    });

    console.log('正在插入第1学年新数据...');
    await KnowledgePoint.insertMany(year1KnowledgePoints);

    console.log(`第1学年数据填充成功！共 ${year1KnowledgePoints.length} 个知识点`);
  } catch (error) {
    console.error('数据填充失败:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('数据库连接已关闭。');
  }
}

if (require.main === module) {
  seedYear1();
}

export { year1KnowledgePoints, seedYear1 };


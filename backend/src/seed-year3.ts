import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year3KnowledgePoints = [
  {
    "id": "cs301",
    "order": 15,
    "title": "计算机网络",
    "description": "学习计算机网络的原理与协议，理解互联网的工作机制。",
    "subject": "计算机科学",
    "category": "计算机系统",
    "difficulty": 3,
    "prerequisites": [
      "cs205"
    ],
    "learningPath": "第三学年 > 第五学期",
    "estimatedHours": 150,
    "contentSnippet": "网络层次模型、应用层、传输层 - TCP",
    "resources": [
      {
        "type": "book",
        "title": "Computer Networking: A Top-Down Approach (Kurose & Ross)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《计算机网络：自顶向下方法》",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford CS144",
        "url": ""
      }
    ],
    "tags": [
      "网络",
      "TCP/IP",
      "HTTP",
      "路由"
    ],
    "subtopics": [
      {
        "title": "网络层次模型",
        "content": "OSI七层模型、TCP/IP四层模型、各层功能",
        "order": 1
      },
      {
        "title": "应用层",
        "content": "HTTP/HTTPS、DNS、SMTP、FTP、WebSocket",
        "order": 2
      },
      {
        "title": "传输层 - TCP",
        "content": "TCP连接建立(三次握手)、可靠传输、流量控制、拥塞控制",
        "order": 3
      },
      {
        "title": "传输层 - UDP",
        "content": "UDP特点、应用场景、与TCP对比",
        "order": 4
      },
      {
        "title": "网络层",
        "content": "IP协议、IPv4/IPv6、子网划分、CIDR",
        "order": 5
      },
      {
        "title": "路由算法",
        "content": "距离向量算法、链路状态算法、RIP、OSPF、BGP",
        "order": 6
      },
      {
        "title": "链路层",
        "content": "以太网、MAC地址、ARP协议、交换机",
        "order": 7
      },
      {
        "title": "网络安全基础",
        "content": "加密、认证、防火墙、VPN",
        "order": 8
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 600
    }
  },
  {
    "id": "cs302",
    "order": 16,
    "title": "数据库系统导论",
    "description": "深入学习数据库系统的内部实现，包括查询优化、事务处理等。",
    "subject": "计算机科学",
    "category": "数据库",
    "difficulty": 3,
    "prerequisites": [
      "cs206-db"
    ],
    "learningPath": "第三学年 > 第五学期",
    "estimatedHours": 150,
    "contentSnippet": "存储与索引、查询处理、事务处理",
    "resources": [
      {
        "type": "book",
        "title": "Database System Concepts",
        "url": ""
      },
      {
        "type": "video",
        "title": "CMU 15-445 Database Systems",
        "url": ""
      }
    ],
    "tags": [
      "数据库",
      "查询优化",
      "索引",
      "NoSQL"
    ],
    "subtopics": [
      {
        "title": "存储与索引",
        "content": "文件组织、B树、B+树、哈希索引",
        "order": 1
      },
      {
        "title": "查询处理",
        "content": "查询解析、查询优化、执行计划",
        "order": 2
      },
      {
        "title": "事务处理",
        "content": "并发控制、两阶段锁、时间戳、MVCC",
        "order": 3
      },
      {
        "title": "恢复系统",
        "content": "日志、检查点、恢复算法",
        "order": 4
      },
      {
        "title": "NoSQL数据库",
        "content": "MongoDB、Redis、键值存储、文档数据库",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 600
    }
  },
  {
    "id": "cs303",
    "order": 17,
    "title": "软件工程",
    "description": "学习大型软件系统的开发方法，包括需求分析、设计模式、测试等。",
    "subject": "计算机科学",
    "category": "软件工程",
    "difficulty": 3,
    "prerequisites": [
      "cs203"
    ],
    "learningPath": "第三学年 > 第五学期",
    "estimatedHours": 120,
    "contentSnippet": "需求工程、软件设计、设计模式",
    "resources": [
      {
        "type": "book",
        "title": "Software Engineering: A Practitioner's Approach (Pressman)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《软件工程》",
        "url": ""
      }
    ],
    "tags": [
      "软件工程",
      "敏捷",
      "测试",
      "UML"
    ],
    "subtopics": [
      {
        "title": "需求工程",
        "content": "需求获取、用户故事、用例图、需求规格说明",
        "order": 1
      },
      {
        "title": "软件设计",
        "content": "UML类图、序列图、架构设计、模块化",
        "order": 2
      },
      {
        "title": "设计模式",
        "content": "创建型模式(单例/工厂)、结构型模式(适配器/装饰器)、行为型模式(观察者/策略)",
        "order": 3
      },
      {
        "title": "软件测试",
        "content": "单元测试、集成测试、系统测试、回归测试",
        "order": 4
      },
      {
        "title": "敏捷开发",
        "content": "Scrum框架、Sprint、每日站会、回顾会议",
        "order": 5
      },
      {
        "title": "项目管理",
        "content": "项目计划、风险管理、团队协作",
        "order": 6
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 500,
      "y": 600
    }
  },
  {
    "id": "cs304",
    "order": 18,
    "title": "编程语言与编译器",
    "description": "学习编译器的设计与实现，理解程序是如何被翻译成机器代码的。",
    "subject": "计算机科学",
    "category": "编程基础",
    "difficulty": 5,
    "prerequisites": [
      "cs206-pl"
    ],
    "learningPath": "第三学年 > 第六学期",
    "estimatedHours": 180,
    "contentSnippet": "词法分析、语法分析、语义分析",
    "resources": [
      {
        "type": "book",
        "title": "Compilers: Principles, Techniques, and Tools (Dragon Book)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《编译原理》",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford CS143",
        "url": ""
      }
    ],
    "tags": [
      "编译器",
      "词法分析",
      "语法分析",
      "代码生成"
    ],
    "subtopics": [
      {
        "title": "词法分析",
        "content": "正则表达式、有限自动机(DFA/NFA)、Lex/Flex",
        "order": 1
      },
      {
        "title": "语法分析",
        "content": "上下文无关文法、LL解析、LR解析、Yacc/Bison",
        "order": 2
      },
      {
        "title": "语义分析",
        "content": "符号表、类型检查、语法制导翻译",
        "order": 3
      },
      {
        "title": "中间代码生成",
        "content": "三地址码、抽象语法树(AST)、IR表示",
        "order": 4
      },
      {
        "title": "代码优化",
        "content": "常量折叠、死代码消除、循环优化、寄存器分配",
        "order": 5
      },
      {
        "title": "目标代码生成",
        "content": "指令选择、寄存器分配、指令调度",
        "order": 6
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 750,
      "y": 600
    }
  },
  {
    "id": "ai1",
    "order": 19,
    "title": "人工智能导论",
    "description": "学习人工智能的基本概念和方法，包括搜索、机器学习入门等。",
    "subject": "计算机科学",
    "category": "AI与机器学习",
    "difficulty": 3,
    "prerequisites": [
      "math201",
      "cs204"
    ],
    "learningPath": "第三学年 > 第六学期 > AI方向",
    "estimatedHours": 180,
    "contentSnippet": "搜索算法、知识表示、机器学习概述",
    "resources": [
      {
        "type": "book",
        "title": "Artificial Intelligence: A Modern Approach (Russell & Norvig)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《人工智能：一种现代的方法》",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford CS221",
        "url": ""
      },
      {
        "type": "video",
        "title": "Andrew Ng - Machine Learning",
        "url": "https://www.coursera.org/"
      }
    ],
    "tags": [
      "AI",
      "搜索",
      "机器学习",
      "监督学习"
    ],
    "subtopics": [
      {
        "title": "搜索算法",
        "content": "盲目搜索(BFS/DFS)、启发式搜索(A*、贪心)、博弈搜索(Minimax、Alpha-Beta剪枝)",
        "order": 1
      },
      {
        "title": "知识表示",
        "content": "命题逻辑、一阶逻辑、知识图谱",
        "order": 2
      },
      {
        "title": "机器学习概述",
        "content": "监督学习、无监督学习、强化学习",
        "order": 3
      },
      {
        "title": "线性回归",
        "content": "最小二乘法、梯度下降、正则化",
        "order": 4
      },
      {
        "title": "逻辑回归",
        "content": "Sigmoid函数、交叉熵损失、分类问题",
        "order": 5
      },
      {
        "title": "决策树",
        "content": "信息增益、ID3/C4.5算法、剪枝",
        "order": 6
      },
      {
        "title": "聚类",
        "content": "K-means、层次聚类、DBSCAN",
        "order": 7
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 1000,
      "y": 600
    }
  },
  {
    "id": "web1",
    "order": 20,
    "title": "现代Web开发",
    "description": "学习现代Web开发技术栈，包括前端框架和后端API开发。",
    "subject": "计算机科学",
    "category": "Web与移动开发",
    "difficulty": 3,
    "prerequisites": [
      "cs302"
    ],
    "learningPath": "第三学年 > 第六学期 > Web方向",
    "estimatedHours": 180,
    "contentSnippet": "HTML5 & CSS3、JavaScript ES6+、React基础",
    "resources": [
      {
        "type": "book",
        "title": "JavaScript: The Definitive Guide",
        "url": ""
      },
      {
        "type": "video",
        "title": "freeCodeCamp Full Stack",
        "url": ""
      },
      {
        "type": "practice",
        "title": "Frontend Mentor",
        "url": "https://www.frontendmentor.io/"
      }
    ],
    "tags": [
      "Web",
      "JavaScript",
      "React",
      "Node.js"
    ],
    "subtopics": [
      {
        "title": "HTML5 & CSS3",
        "content": "语义化标签、Flexbox、Grid布局、响应式设计",
        "order": 1
      },
      {
        "title": "JavaScript ES6+",
        "content": "let/const、箭头函数、Promise、async/await、模块化",
        "order": 2
      },
      {
        "title": "React基础",
        "content": "组件、Props、State、生命周期、Hooks",
        "order": 3
      },
      {
        "title": "Node.js & Express",
        "content": "HTTP服务器、路由、中间件、RESTful API",
        "order": 4
      },
      {
        "title": "用户认证",
        "content": "JWT、Session、OAuth2.0、密码哈希",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 750
    }
  },
  {
    "id": "sec1",
    "order": 21,
    "title": "网络安全导论",
    "description": "学习网络安全的基本概念，包括密码学、Web安全等。",
    "subject": "计算机科学",
    "category": "系统与安全",
    "difficulty": 3,
    "prerequisites": [
      "cs301"
    ],
    "learningPath": "第三学年 > 第六学期 > 安全方向",
    "estimatedHours": 180,
    "contentSnippet": "安全基础、密码学基础、Web安全",
    "resources": [
      {
        "type": "book",
        "title": "Cybersecurity Essentials",
        "url": ""
      },
      {
        "type": "book",
        "title": "Network Security Essentials",
        "url": ""
      },
      {
        "type": "practice",
        "title": "HackTheBox",
        "url": "https://www.hackthebox.com/"
      }
    ],
    "tags": [
      "安全",
      "密码学",
      "Web安全",
      "渗透测试"
    ],
    "subtopics": [
      {
        "title": "安全基础",
        "content": "CIA三要素(机密性/完整性/可用性)、威胁模型",
        "order": 1
      },
      {
        "title": "密码学基础",
        "content": "对称加密(AES)、非对称加密(RSA)、哈希函数(SHA)、数字签名",
        "order": 2
      },
      {
        "title": "Web安全",
        "content": "OWASP Top 10、XSS、CSRF、SQL注入、安全编码",
        "order": 3
      },
      {
        "title": "网络安全",
        "content": "防火墙、入侵检测系统(IDS)、VPN",
        "order": 4
      },
      {
        "title": "恶意软件",
        "content": "病毒、木马、勒索软件、防护措施",
        "order": 5
      },
      {
        "title": "道德黑客",
        "content": "渗透测试流程、信息收集、漏洞扫描",
        "order": 6
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 750
    }
  }
];

async function seedYear3() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('请在 .env 文件中设置 MONGODB_URI');
    }

    await mongoose.connect(mongoUri);
    console.log('数据库连接成功');

    console.log('正在删除第3学年旧数据...');
    await KnowledgePoint.deleteMany({
      id: { $regex: /^(cs|math|data)30/ }
    });

    console.log('正在插入第3学年新数据...');
    await KnowledgePoint.insertMany(year3KnowledgePoints);

    console.log(`第3学年数据填充成功！共 ${year3KnowledgePoints.length} 个知识点`);
  } catch (error) {
    console.error('数据填充失败:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('数据库连接已关闭。');
  }
}

if (require.main === module) {
  seedYear3();
}

export { year3KnowledgePoints, seedYear3 };

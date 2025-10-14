import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year3KnowledgePoints = [
  {
    "id": "cs206-pl",
    "order": 15,
    "title": "编程语言原理",
    "description": "学习编程语言的设计原理，比较不同的编程范式。",
    "subject": "计算机科学",
    "category": "编程基础",
    "difficulty": 3,
    "prerequisites": [
      "cs202"
    ],
    "learningPath": "第三学年 > 第五学期",
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
      "x": 0,
      "y": 500
    }
  },
  {
    "id": "cs206-db",
    "order": 16,
    "title": "数据库系统",
    "description": "学习关系数据库的原理与应用，掌握SQL和数据库设计方法。",
    "subject": "计算机科学",
    "category": "数据库",
    "difficulty": 3,
    "prerequisites": [
      "cs103"
    ],
    "learningPath": "第三学年 > 第五学期",
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
      "x": 250,
      "y": 500
    }
  },
  {
    "id": "cs301",
    "order": 17,
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
    "id": "ai2",
    "order": 19,
    "title": "深度学习",
    "description": "学习深度神经网络的原理与应用，掌握现代深度学习框架。",
    "subject": "计算机科学",
    "category": "AI与机器学习",
    "difficulty": 5,
    "prerequisites": [
      "ai1",
      "math201"
    ],
    "learningPath": "第三学年 > 第六学期 > AI方向",
    "estimatedHours": 240,
    "contentSnippet": "神经网络基础、优化方法、正则化",
    "resources": [
      {
        "type": "book",
        "title": "Deep Learning (Goodfellow)",
        "url": "https://www.deeplearningbook.org/"
      },
      {
        "type": "video",
        "title": "Stanford CS230",
        "url": ""
      },
      {
        "type": "video",
        "title": "DeepLearning.AI Specialization",
        "url": "https://www.coursera.org/"
      },
      {
        "type": "practice",
        "title": "Kaggle",
        "url": "https://www.kaggle.com/"
      }
    ],
    "tags": [
      "深度学习",
      "CNN",
      "RNN",
      "Transformer",
      "PyTorch"
    ],
    "subtopics": [
      {
        "title": "神经网络基础",
        "content": "感知机、多层感知机(MLP)、激活函数、反向传播",
        "order": 1
      },
      {
        "title": "优化方法",
        "content": "SGD、Momentum、Adam、学习率调度、批归一化",
        "order": 2
      },
      {
        "title": "正则化",
        "content": "Dropout、L1/L2正则化、数据增强、早停",
        "order": 3
      },
      {
        "title": "卷积神经网络(CNN)",
        "content": "卷积层、池化层、经典架构(LeNet/AlexNet/VGG/ResNet)",
        "order": 4
      },
      {
        "title": "循环神经网络(RNN)",
        "content": "RNN、LSTM、GRU、序列建模",
        "order": 5
      },
      {
        "title": "Transformer",
        "content": "注意力机制、Self-Attention、Multi-Head Attention、BERT/GPT",
        "order": 6
      },
      {
        "title": "深度学习框架",
        "content": "PyTorch基础、TensorFlow、模型训练与调试",
        "order": 7
      },
      {
        "title": "计算机视觉",
        "content": "图像分类、目标检测(YOLO/Faster R-CNN)、图像分割",
        "order": 8
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 1000,
      "y": 600
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

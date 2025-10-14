import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year4KnowledgePoints = [
  {
    "id": "cs402",
    "order": 23,
    "title": "分布式系统",
    "description": "学习分布式系统的设计原理，包括一致性、容错等核心问题。",
    "subject": "计算机科学",
    "category": "计算机系统",
    "difficulty": 5,
    "prerequisites": [
      "cs301",
      "cs205"
    ],
    "learningPath": "第四学年 > 第七学期",
    "estimatedHours": 180,
    "contentSnippet": "分布式系统基础、CAP定理、共识算法",
    "resources": [
      {
        "type": "book",
        "title": "Distributed Systems (Tanenbaum)",
        "url": ""
      },
      {
        "type": "book",
        "title": "Designing Data-Intensive Applications (Kleppmann)",
        "url": ""
      },
      {
        "type": "video",
        "title": "MIT 6.824",
        "url": ""
      },
      {
        "type": "paper",
        "title": "Google MapReduce",
        "url": ""
      }
    ],
    "tags": [
      "分布式",
      "一致性",
      "Raft",
      "MapReduce"
    ],
    "subtopics": [
      {
        "title": "分布式系统基础",
        "content": "时钟同步、逻辑时钟、向量时钟、因果关系",
        "order": 1
      },
      {
        "title": "CAP定理",
        "content": "一致性、可用性、分区容错性、权衡",
        "order": 2
      },
      {
        "title": "共识算法",
        "content": "Paxos、Raft、两阶段提交(2PC)、三阶段提交(3PC)",
        "order": 3
      },
      {
        "title": "复制与分区",
        "content": "主从复制、多主复制、无主复制、分片策略",
        "order": 4
      },
      {
        "title": "容错",
        "content": "故障检测、故障恢复、拜占庭容错",
        "order": 5
      },
      {
        "title": "分布式存储",
        "content": "GFS、HDFS、Cassandra、DynamoDB",
        "order": 6
      },
      {
        "title": "MapReduce",
        "content": "Map函数、Reduce函数、Hadoop、Spark",
        "order": 7
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 800
    }
  },
  {
    "id": "sec1",
    "order": 23,
    "title": "网络安全导论",
    "description": "学习网络安全的基本概念，包括密码学、Web安全等。",
    "subject": "计算机科学",
    "category": "系统与安全",
    "difficulty": 3,
    "prerequisites": [
      "cs301"
    ],
    "learningPath": "第四学年 > 第七学期 > 安全方向",
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
      "x": 500,
      "y": 800
    }
  },
  {
    "id": "cs499",
    "order": 30,
    "title": "毕业设计 (Capstone Project)",
    "description": "综合运用四年所学知识，完成一个完整的软件项目，展示专业能力。",
    "subject": "计算机科学",
    "category": "软件工程",
    "difficulty": 5,
    "prerequisites": [
      "cs303"
    ],
    "learningPath": "第四学年 > 第八学期",
    "estimatedHours": 360,
    "contentSnippet": "项目规划、系统设计、敏捷开发",
    "resources": [
      {
        "type": "book",
        "title": "Code Complete (McConnell)",
        "url": ""
      },
      {
        "type": "book",
        "title": "《代码大全》",
        "url": ""
      }
    ],
    "tags": [
      "项目管理",
      "系统设计",
      "全栈开发",
      "文档"
    ],
    "subtopics": [
      {
        "title": "项目规划",
        "content": "需求分析、项目计划、时间管理、风险评估",
        "order": 1
      },
      {
        "title": "系统设计",
        "content": "架构设计、模块划分、API设计、数据库设计",
        "order": 2
      },
      {
        "title": "敏捷开发",
        "content": "Sprint规划、迭代开发、每日站会",
        "order": 3
      },
      {
        "title": "代码实现",
        "content": "编码规范、版本控制、代码审查",
        "order": 4
      },
      {
        "title": "测试与部署",
        "content": "单元测试、集成测试、CI/CD、上线部署",
        "order": 5
      },
      {
        "title": "文档撰写",
        "content": "需求文档、设计文档、用户手册、技术报告",
        "order": 6
      },
      {
        "title": "项目演示",
        "content": "演示准备、PPT制作、公开答辩",
        "order": 7
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 750,
      "y": 950
    }
  },
  {
    "id": "math203",
    "order": 25,
    "title": "概率论与数理统计",
    "description": "学习概率论和统计学的基本概念，为机器学习和数据科学打基础。",
    "subject": "数学",
    "category": "数学基础",
    "difficulty": 3,
    "prerequisites": [
      "math101",
      "math102"
    ],
    "learningPath": "第四学年 > 第七学期",
    "estimatedHours": 150,
    "contentSnippet": "概率基础、随机变量、统计推断",
    "resources": [
      {
        "type": "book",
        "title": "Introduction to Probability and Statistics",
        "url": ""
      },
      {
        "type": "book",
        "title": "《概率论与数理统计》",
        "url": ""
      }
    ],
    "tags": [
      "概率论",
      "统计学",
      "随机变量",
      "假设检验"
    ],
    "subtopics": [
      {
        "title": "概率基础",
        "content": "样本空间、事件、条件概率、贝叶斯定理",
        "order": 1
      },
      {
        "title": "随机变量",
        "content": "离散型、连续型、期望、方差、常见分布",
        "order": 2
      },
      {
        "title": "多维随机变量",
        "content": "联合分布、边缘分布、协方差、相关系数",
        "order": 3
      },
      {
        "title": "大数定律与中心极限定理",
        "content": "切比雪夫不等式、大数定律、中心极限定理",
        "order": 4
      },
      {
        "title": "统计推断",
        "content": "点估计、区间估计、假设检验",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 1100
    }
  },
  {
    "id": "phys101",
    "order": 26,
    "title": "大学物理",
    "description": "学习物理学的基本原理，培养科学思维和问题解决能力。",
    "subject": "物理",
    "category": "基础科学",
    "difficulty": 2,
    "prerequisites": [
      "math101"
    ],
    "learningPath": "第四学年 > 第七学期",
    "estimatedHours": 120,
    "contentSnippet": "力学、电磁学、光学",
    "resources": [
      {
        "type": "book",
        "title": "University Physics",
        "url": ""
      },
      {
        "type": "book",
        "title": "《大学物理》",
        "url": ""
      }
    ],
    "tags": [
      "物理",
      "力学",
      "电磁学",
      "光学"
    ],
    "subtopics": [
      {
        "title": "力学",
        "content": "牛顿定律、动量、能量、角动量",
        "order": 1
      },
      {
        "title": "电磁学",
        "content": "电场、磁场、电磁感应、麦克斯韦方程",
        "order": 2
      },
      {
        "title": "光学",
        "content": "几何光学、波动光学、干涉、衍射",
        "order": 3
      },
      {
        "title": "热学",
        "content": "热力学定律、理想气体、熵",
        "order": 4
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 1100
    }
  },
  {
    "id": "eng101",
    "order": 27,
    "title": "大学英语",
    "description": "提高英语听说读写能力，掌握学术英语和技术文档阅读能力。",
    "subject": "语言",
    "category": "基础科学",
    "difficulty": 2,
    "prerequisites": [],
    "learningPath": "第四学年 > 第七学期",
    "estimatedHours": 120,
    "contentSnippet": "学术英语、技术文档、论文写作",
    "resources": [
      {
        "type": "book",
        "title": "Academic English for Computer Science",
        "url": ""
      },
      {
        "type": "practice",
        "title": "Grammarly",
        "url": "https://www.grammarly.com/"
      }
    ],
    "tags": [
      "英语",
      "学术英语",
      "技术文档",
      "论文写作"
    ],
    "subtopics": [
      {
        "title": "学术英语",
        "content": "学术词汇、论文阅读、学术写作",
        "order": 1
      },
      {
        "title": "技术文档",
        "content": "API文档阅读、技术博客、开源项目文档",
        "order": 2
      },
      {
        "title": "论文写作",
        "content": "论文结构、引用格式、学术规范",
        "order": 3
      },
      {
        "title": "口语与听力",
        "content": "技术演讲、会议交流、面试英语",
        "order": 4
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 500,
      "y": 1100
    }
  }
];

async function seedYear4() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('请在 .env 文件中设置 MONGODB_URI');
    }

    await mongoose.connect(mongoUri);
    console.log('数据库连接成功');

    console.log('正在删除第4学年旧数据...');
    await KnowledgePoint.deleteMany({
      id: { $regex: /^(cs|math|data)40/ }
    });

    console.log('正在插入第4学年新数据...');
    await KnowledgePoint.insertMany(year4KnowledgePoints);

    console.log(`第4学年数据填充成功！共 ${year4KnowledgePoints.length} 个知识点`);
  } catch (error) {
    console.error('数据填充失败:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('数据库连接已关闭。');
  }
}

if (require.main === module) {
  seedYear4();
}

export { year4KnowledgePoints, seedYear4 };

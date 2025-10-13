import mongoose from 'mongoose';
import dotenv from 'dotenv';
import KnowledgePoint from './models/KnowledgePoint';

dotenv.config();

const year4KnowledgePoints = [
  {
    "id": "cs401",
    "order": 22,
    "title": "编译器与优化",
    "description": "深入学习编译器的高级主题和代码优化技术。",
    "subject": "计算机科学",
    "category": "编程基础",
    "difficulty": 5,
    "prerequisites": [
      "cs304"
    ],
    "learningPath": "第四学年 > 第七学期",
    "estimatedHours": 150,
    "contentSnippet": "高级优化、寄存器分配、代码生成",
    "resources": [
      {
        "type": "book",
        "title": "Compilers: Principles, Techniques, and Tools",
        "url": ""
      },
      {
        "type": "book",
        "title": "Engineering a Compiler",
        "url": ""
      }
    ],
    "tags": [
      "编译器",
      "优化",
      "LLVM"
    ],
    "subtopics": [
      {
        "title": "高级优化",
        "content": "数据流分析、SSA形式、循环优化、内联",
        "order": 1
      },
      {
        "title": "寄存器分配",
        "content": "图着色算法、线性扫描、寄存器溢出",
        "order": 2
      },
      {
        "title": "代码生成",
        "content": "指令选择、指令调度、流水线优化",
        "order": 3
      },
      {
        "title": "LLVM",
        "content": "LLVM IR、Pass系统、工具链",
        "order": 4
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 800
    }
  },
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
    "id": "ai2",
    "order": 24,
    "title": "深度学习",
    "description": "学习深度神经网络的原理与应用，掌握现代深度学习框架。",
    "subject": "计算机科学",
    "category": "AI与机器学习",
    "difficulty": 5,
    "prerequisites": [
      "ai1",
      "math201"
    ],
    "learningPath": "第四学年 > 第七学期 > AI方向",
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
      "x": 500,
      "y": 800
    }
  },
  {
    "id": "ai3-nlp",
    "order": 25,
    "title": "自然语言处理",
    "description": "学习自然语言处理的核心技术，包括文本处理、语言模型等。",
    "subject": "计算机科学",
    "category": "AI与机器学习",
    "difficulty": 5,
    "prerequisites": [
      "ai2"
    ],
    "learningPath": "第四学年 > 第七学期 > AI方向",
    "estimatedHours": 180,
    "contentSnippet": "文本预处理、词向量、语言模型",
    "resources": [
      {
        "type": "book",
        "title": "Speech and Language Processing (Jurafsky & Martin)",
        "url": ""
      },
      {
        "type": "video",
        "title": "Stanford CS224N",
        "url": ""
      },
      {
        "type": "practice",
        "title": "Hugging Face",
        "url": "https://huggingface.co/"
      }
    ],
    "tags": [
      "NLP",
      "BERT",
      "GPT",
      "语言模型"
    ],
    "subtopics": [
      {
        "title": "文本预处理",
        "content": "分词、词干提取、词形还原、停用词",
        "order": 1
      },
      {
        "title": "词向量",
        "content": "Word2Vec、GloVe、FastText",
        "order": 2
      },
      {
        "title": "语言模型",
        "content": "N-gram、神经语言模型、困惑度",
        "order": 3
      },
      {
        "title": "序列标注",
        "content": "POS标注、命名实体识别(NER)、CRF",
        "order": 4
      },
      {
        "title": "文本分类",
        "content": "情感分析、主题分类、BERT微调",
        "order": 5
      },
      {
        "title": "序列到序列",
        "content": "Seq2Seq、注意力机制、机器翻译",
        "order": 6
      },
      {
        "title": "预训练模型",
        "content": "BERT、GPT、T5、模型微调",
        "order": 7
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 750,
      "y": 800
    }
  },
  {
    "id": "web2",
    "order": 26,
    "title": "高级前端开发",
    "description": "学习现代前端工程化技术，包括状态管理、测试、构建工具等。",
    "subject": "计算机科学",
    "category": "Web与移动开发",
    "difficulty": 5,
    "prerequisites": [
      "web1"
    ],
    "learningPath": "第四学年 > 第七学期 > Web方向",
    "estimatedHours": 180,
    "contentSnippet": "TypeScript、状态管理、前端测试",
    "resources": [
      {
        "type": "book",
        "title": "You Don't Know JS",
        "url": ""
      },
      {
        "type": "video",
        "title": "Frontend Masters",
        "url": ""
      }
    ],
    "tags": [
      "前端",
      "React",
      "TypeScript",
      "测试"
    ],
    "subtopics": [
      {
        "title": "TypeScript",
        "content": "类型系统、接口、泛型、高级类型",
        "order": 1
      },
      {
        "title": "状态管理",
        "content": "Redux、Context API、Zustand、状态设计",
        "order": 2
      },
      {
        "title": "前端测试",
        "content": "Jest、React Testing Library、E2E测试(Cypress)",
        "order": 3
      },
      {
        "title": "构建工具",
        "content": "Webpack、Vite、代码分割、Tree Shaking",
        "order": 4
      },
      {
        "title": "性能优化",
        "content": "懒加载、虚拟列表、Memoization、Web Workers",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 1000,
      "y": 800
    }
  },
  {
    "id": "web3",
    "order": 27,
    "title": "云计算与DevOps",
    "description": "学习云计算平台和DevOps实践，掌握容器化和CI/CD。",
    "subject": "计算机科学",
    "category": "Web与移动开发",
    "difficulty": 5,
    "prerequisites": [
      "web1"
    ],
    "learningPath": "第四学年 > 第七学期 > Web方向",
    "estimatedHours": 180,
    "contentSnippet": "云计算基础、Docker、Kubernetes",
    "resources": [
      {
        "type": "book",
        "title": "Cloud Computing: A Hands-On Approach",
        "url": ""
      },
      {
        "type": "practice",
        "title": "AWS Free Tier",
        "url": "https://aws.amazon.com/"
      }
    ],
    "tags": [
      "云计算",
      "Docker",
      "Kubernetes",
      "CI/CD"
    ],
    "subtopics": [
      {
        "title": "云计算基础",
        "content": "IaaS/PaaS/SaaS、AWS/GCP/Azure概览",
        "order": 1
      },
      {
        "title": "Docker",
        "content": "容器概念、Dockerfile、镜像管理、Docker Compose",
        "order": 2
      },
      {
        "title": "Kubernetes",
        "content": "Pod、Service、Deployment、ConfigMap、Ingress",
        "order": 3
      },
      {
        "title": "CI/CD",
        "content": "GitHub Actions、Jenkins、自动化测试、自动部署",
        "order": 4
      },
      {
        "title": "监控与日志",
        "content": "Prometheus、Grafana、ELK Stack",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 0,
      "y": 950
    }
  },
  {
    "id": "sec2",
    "order": 28,
    "title": "应用密码学与网络安全",
    "description": "深入学习密码学协议和高级网络安全技术。",
    "subject": "计算机科学",
    "category": "系统与安全",
    "difficulty": 5,
    "prerequisites": [
      "sec1"
    ],
    "learningPath": "第四学年 > 第七学期 > 安全方向",
    "estimatedHours": 180,
    "contentSnippet": "密码学协议、公钥基础设施(PKI)、Web应用安全",
    "resources": [
      {
        "type": "book",
        "title": "Applied Cryptography (Schneier)",
        "url": ""
      },
      {
        "type": "book",
        "title": "The Web Application Hacker's Handbook",
        "url": ""
      }
    ],
    "tags": [
      "密码学",
      "TLS",
      "PKI",
      "渗透测试"
    ],
    "subtopics": [
      {
        "title": "密码学协议",
        "content": "TLS/SSL、Diffie-Hellman密钥交换、数字证书",
        "order": 1
      },
      {
        "title": "公钥基础设施(PKI)",
        "content": "CA、证书链、证书撤销(CRL/OCSP)",
        "order": 2
      },
      {
        "title": "Web应用安全",
        "content": "深入XSS/CSRF/SQL注入、安全编码实践",
        "order": 3
      },
      {
        "title": "渗透测试",
        "content": "Kali Linux、Metasploit、漏洞利用",
        "order": 4
      },
      {
        "title": "安全审计",
        "content": "代码审计、安全扫描、漏洞评估",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 250,
      "y": 950
    }
  },
  {
    "id": "cs403",
    "order": 29,
    "title": "计算机伦理与社会",
    "description": "学习计算机技术的伦理问题和社会影响，培养负责任的技术观。",
    "subject": "计算机科学",
    "category": "软件工程",
    "difficulty": 3,
    "prerequisites": [],
    "learningPath": "第四学年 > 第七学期",
    "estimatedHours": 60,
    "contentSnippet": "职业道德、隐私与数据保护、AI伦理",
    "resources": [
      {
        "type": "book",
        "title": "Ethics in Information Technology (Reynolds)",
        "url": ""
      },
      {
        "type": "document",
        "title": "ACM Code of Ethics",
        "url": "https://www.acm.org/code-of-ethics"
      }
    ],
    "tags": [
      "伦理",
      "隐私",
      "AI伦理",
      "社会责任"
    ],
    "subtopics": [
      {
        "title": "职业道德",
        "content": "ACM职业道德规范、专业责任",
        "order": 1
      },
      {
        "title": "隐私与数据保护",
        "content": "GDPR、数据收集、用户隐私",
        "order": 2
      },
      {
        "title": "AI伦理",
        "content": "算法偏见、公平性、可解释性、AI安全",
        "order": 3
      },
      {
        "title": "知识产权",
        "content": "版权、专利、开源许可",
        "order": 4
      },
      {
        "title": "技术的社会影响",
        "content": "数字鸿沟、技术失业、监控社会",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 500,
      "y": 950
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
    "id": "cs404",
    "order": 31,
    "title": "职业发展与面试准备",
    "description": "系统准备技术面试，学习简历撰写和职业规划。",
    "subject": "计算机科学",
    "category": "软件工程",
    "difficulty": 3,
    "prerequisites": [],
    "learningPath": "第四学年 > 第八学期",
    "estimatedHours": 120,
    "contentSnippet": "简历撰写、算法面试、系统设计面试",
    "resources": [
      {
        "type": "book",
        "title": "Cracking the Coding Interview (McDowell)",
        "url": ""
      },
      {
        "type": "practice",
        "title": "LeetCode",
        "url": "https://leetcode.com/"
      },
      {
        "type": "practice",
        "title": "Pramp (模拟面试)",
        "url": "https://www.pramp.com/"
      }
    ],
    "tags": [
      "面试",
      "算法题",
      "系统设计",
      "简历"
    ],
    "subtopics": [
      {
        "title": "简历撰写",
        "content": "技术简历格式、项目描述、关键词优化",
        "order": 1
      },
      {
        "title": "算法面试",
        "content": "解题思路、时间复杂度分析、边界条件、LeetCode刷题策略",
        "order": 2
      },
      {
        "title": "系统设计面试",
        "content": "需求澄清、高层设计、详细设计、权衡分析",
        "order": 3
      },
      {
        "title": "行为面试",
        "content": "STAR法则、团队协作、冲突解决、项目经验",
        "order": 4
      },
      {
        "title": "职业规划",
        "content": "职业路径、技能提升、持续学习",
        "order": 5
      }
    ],
    "status": "not_started",
    "graphPosition": {
      "x": 1000,
      "y": 950
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

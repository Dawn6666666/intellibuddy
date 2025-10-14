# 第四学年课程笔记生成 Prompts

> 本文档为第四学年所有课程提供详细的 AI 笔记生成 prompt，延续前三学年的风格和质量。

---

## 第四学年课程 (共10门)

### 22. CLOUD401: 云计算与分布式系统

**课程信息：**
- 学习时长：160小时
- 难度等级：⭐⭐⭐⭐ (高)
- 前置课程：操作系统、计算机网络

**生成 Prompt：**

```
请为"云计算与分布式系统"课程生成完整学习笔记，涵盖分布式理论和云计算实践。

【课程概述】
- 云计算的发展与现状
- 分布式系统的特点与挑战
- 学习路线图

【核心知识点】

1. **分布式系统基础**
   - 分布式系统定义与特征
   - 分布式系统的目标（透明性、可扩展性、可靠性）
   - 分布式系统模型（C/S, P2P, 混合）
   - 分布式系统的挑战（一致性、可用性、分区容错）

2. **分布式通信**
   - 进程间通信（IPC）
   - 远程过程调用（RPC）
   - 消息队列（Message Queue）
   - 发布订阅模式
   - RESTful API
   - gRPC与Protocol Buffers
   - 消息中间件（RabbitMQ, Kafka, RocketMQ）

3. **分布式协调与一致性**
   
   **一致性理论**
   - CAP定理详解（一致性、可用性、分区容错）
   - BASE理论（基本可用、软状态、最终一致性）
   - ACID vs BASE
   
   **一致性算法**
   - 两阶段提交（2PC）
   - 三阶段提交（3PC）
   - Paxos算法详解
   - Raft共识算法（领导选举、日志复制、安全性）
   - ZAB协议（ZooKeeper）
   
   **分布式锁**
   - 基于数据库的分布式锁
   - 基于Redis的分布式锁（RedLock）
   - 基于ZooKeeper的分布式锁
   - 分布式锁的问题与优化

4. **分布式存储**
   
   **分布式文件系统**
   - GFS（Google File System）原理
   - HDFS架构与原理
   - Ceph分布式存储
   - 对象存储（S3, MinIO）
   
   **分布式数据库**
   - 数据分片（Sharding）策略（范围分片、哈希分片、一致性哈希）
   - 数据复制（主从复制、多主复制、无主复制）
   - 分布式事务（2PC, 3PC, Saga模式）
   - Google Spanner
   - TiDB架构
   - CockroachDB
   
   **NoSQL数据库**
   - Redis集群
   - MongoDB分片
   - Cassandra架构
   - HBase原理

5. **分布式计算**
   
   **MapReduce**
   - MapReduce编程模型
   - Shuffle机制
   - 优化技巧（Combiner, Partitioner）
   
   **Spark**
   - RDD（弹性分布式数据集）
   - Spark SQL
   - Spark Streaming
   - Spark MLlib
   
   **流处理**
   - Storm实时计算
   - Flink流处理
   - Kafka Streams

6. **云计算平台**
   
   **虚拟化技术**
   - 虚拟化原理（全虚拟化、半虚拟化、硬件辅助虚拟化）
   - KVM、Xen、VMware
   
   **容器技术**
   - Docker原理与架构
   - Dockerfile编写
   - Docker镜像管理
   - Docker网络与存储
   - Docker Compose多容器编排
   
   **容器编排**
   - Kubernetes架构（Master, Node, Pod, Service）
   - K8s核心对象（Deployment, StatefulSet, DaemonSet）
   - 服务发现与负载均衡
   - 配置管理（ConfigMap, Secret）
   - 持久化存储（PV, PVC）
   - 自动扩缩容（HPA, VPA）
   - Helm包管理
   
   **云服务模型**
   - IaaS（Infrastructure as a Service）
   - PaaS（Platform as a Service）
   - SaaS（Software as a Service）
   - FaaS（Function as a Service）/ Serverless

7. **微服务架构**
   
   **微服务基础**
   - 微服务定义与特点
   - 微服务 vs 单体架构
   - 服务拆分原则
   - DDD领域驱动设计
   
   **服务治理**
   - 服务注册与发现（Eureka, Consul, Nacos）
   - 负载均衡（Ribbon, Nginx, HAProxy）
   - 服务网关（Zuul, Gateway, Kong）
   - 配置中心（Apollo, Spring Cloud Config）
   - 链路追踪（Zipkin, Jaeger, SkyWalking）
   - 服务监控（Prometheus, Grafana）
   
   **容错与限流**
   - 熔断器（Hystrix, Resilience4j）
   - 限流算法（漏桶、令牌桶）
   - 降级策略
   - 重试与超时
   
   **分布式事务**
   - TCC（Try-Confirm-Cancel）
   - Saga模式
   - 本地消息表
   - 事务消息（RocketMQ）
   - Seata分布式事务框架

8. **服务网格（Service Mesh）**
   - Service Mesh概念
   - Istio架构（数据平面、控制平面）
   - 流量管理
   - 安全通信
   - 可观测性

9. **云原生技术**
   - 云原生定义（CNCF）
   - 12-Factor应用
   - DevOps与CI/CD
   - GitOps
   - 监控与日志（ELK, Prometheus, Grafana）

10. **性能优化与高可用**
    - 负载均衡策略
    - 缓存策略（多级缓存、缓存一致性）
    - CDN内容分发
    - 数据库优化（读写分离、分库分表）
    - 限流与降级
    - 容灾与备份
    - 混沌工程

【实践环节】

**Docker实战**
- 编写Dockerfile
- 构建多阶段镜像
- Docker Compose应用

**Kubernetes实战**
- 搭建K8s集群（minikube/kubeadm）
- 部署微服务应用
- 配置Ingress
- 实现自动扩缩容

**微服务项目**
- Spring Cloud微服务开发
- 服务注册与发现
- 配置中心使用
- 链路追踪集成
- 分布式事务实现

**分布式存储实践**
- HDFS集群搭建
- Redis集群配置
- MongoDB分片实践

**消息队列实践**
- Kafka集群搭建
- 生产者消费者开发
- RabbitMQ使用

【项目】
- 基于微服务的电商系统
- 分布式任务调度系统
- 实时数据处理平台
- 云原生应用部署

【参考资料】
- 《Designing Data-Intensive Applications》
- 《微服务架构设计模式》
- Kubernetes官方文档
- Spring Cloud官方文档

请确保：
1. 理论与实践紧密结合
2. 大量架构图和流程图
3. 代码示例（Java/Go/Python）
4. 实际部署操作步骤
5. 故障排查与优化技巧
```

---

### 23. ML401: 机器学习

**课程信息：**
- 学习时长：180小时
- 难度等级：⭐⭐⭐⭐ (高)
- 前置课程：线性代数、概率论、AI导论

**生成 Prompt：**

```
请为"机器学习"课程生成系统化的学习笔记，涵盖理论推导和实践应用。

【课程概述】
- 机器学习定义与分类
- 机器学习工作流程
- 学习路线图

【核心知识点】

1. **机器学习基础**
   - 监督学习、无监督学习、强化学习
   - 过拟合与欠拟合
   - 偏差-方差权衡
   - 训练集、验证集、测试集
   - 交叉验证（K-Fold, Leave-One-Out）
   - 评估指标（准确率、精确率、召回率、F1、AUC-ROC）

2. **线性模型**
   
   **线性回归**
   - 最小二乘法推导
   - 正规方程
   - 梯度下降法（批量、随机、小批量）
   - 多项式回归
   - 岭回归（L2正则化）
   - Lasso回归（L1正则化）
   - 弹性网络（Elastic Net）
   
   **逻辑回归**
   - Sigmoid函数
   - 损失函数（交叉熵）
   - 梯度下降求解
   - 多分类（One-vs-Rest, Softmax）
   
   **线性判别分析（LDA）**
   - LDA原理
   - Fisher判别

3. **决策树与集成学习**
   
   **决策树**
   - ID3算法（信息增益）
   - C4.5算法（信息增益率）
   - CART算法（基尼系数）
   - 剪枝策略（预剪枝、后剪枝）
   
   **集成学习**
   - Bagging（Bootstrap Aggregating）
   - 随机森林（Random Forest）
   - Boosting原理
   - AdaBoost算法详解
   - Gradient Boosting（GBDT）
   - XGBoost原理与优化
   - LightGBM
   - CatBoost
   - Stacking与Blending

4. **支持向量机（SVM）**
   - 线性可分SVM（硬间隔）
   - 对偶问题与KKT条件
   - 软间隔SVM（C参数）
   - 核函数（线性、多项式、RBF、Sigmoid）
   - 核技巧
   - SMO算法
   - 多分类SVM

5. **贝叶斯方法**
   - 贝叶斯定理
   - 朴素贝叶斯分类器
   - 高斯朴素贝叶斯
   - 多项式朴素贝叶斯
   - 贝叶斯网络
   - 贝叶斯线性回归

6. **聚类算法**
   - K-Means算法（K-Means++初始化）
   - 层次聚类（凝聚、分裂）
   - DBSCAN密度聚类
   - 均值漂移（Mean Shift）
   - 谱聚类
   - 高斯混合模型（GMM）+ EM算法

7. **降维技术**
   - 主成分分析（PCA）详解
   - 核PCA
   - 线性判别分析（LDA）
   - t-SNE算法
   - UMAP
   - 自编码器（Autoencoder）

8. **概率图模型**
   - 隐马尔可夫模型（HMM）
   - 条件随机场（CRF）
   - 马尔可夫随机场
   - 因子图

9. **优化算法**
   - 梯度下降及其变体（Momentum, Nesterov, AdaGrad, RMSprop, Adam）
   - 牛顿法与拟牛顿法（BFGS, L-BFGS）
   - 坐标下降
   - 共轭梯度法

10. **特征工程**
    - 特征提取
    - 特征选择（过滤法、包装法、嵌入法）
    - 特征变换（标准化、归一化、离散化）
    - 缺失值处理
    - 异常值检测
    - 类别特征编码（One-Hot, Label Encoding, Target Encoding）

11. **模型评估与选择**
    - 性能度量（分类、回归、聚类）
    - 混淆矩阵
    - ROC曲线与AUC
    - PR曲线
    - 学习曲线
    - 验证曲线
    - 超参数调优（网格搜索、随机搜索、贝叶斯优化）

12. **高级主题**
    - 半监督学习
    - 主动学习
    - 迁移学习
    - 多任务学习
    - 在线学习
    - 不平衡数据处理（过采样、欠采样、SMOTE）

【数学推导】
- 每个算法都提供完整的数学推导
- 损失函数的梯度计算
- 优化目标的推导
- 理论保证（PAC学习框架）

【Python实现】

**基础库**
- NumPy数值计算
- Pandas数据处理
- Matplotlib/Seaborn可视化

**机器学习库**
- Scikit-learn完整教程
  - 数据预处理
  - 模型训练与评估
  - 管道（Pipeline）使用
  - 交叉验证
  
**从零实现**
- 手写线性回归
- 手写逻辑回归
- 手写决策树
- 手写K-Means
- 手写PCA
- 手写神经网络（反向传播）

【实战项目】
1. **房价预测**（回归任务）
   - 数据探索与清洗
   - 特征工程
   - 模型选择与调优
   - 集成学习

2. **信用卡欺诈检测**（分类任务）
   - 不平衡数据处理
   - 特征提取
   - 模型评估

3. **客户细分**（聚类任务）
   - RFM分析
   - K-Means聚类
   - 结果可视化

4. **推荐系统基础**
   - 协同过滤
   - 矩阵分解

5. **Kaggle竞赛实战**
   - Titanic生存预测
   - House Prices回归

【工具与平台】
- Jupyter Notebook
- Google Colab
- Kaggle平台
- MLflow实验管理
- TensorBoard可视化

【参考资源】
- 《机器学习》（周志华）西瓜书
- 《统计学习方法》（李航）
- 《Pattern Recognition and Machine Learning》（Bishop）
- Andrew Ng机器学习课程
- Scikit-learn官方文档

请确保：
1. 数学公式推导详细
2. 每个算法都有NumPy实现
3. Scikit-learn实战代码
4. 可视化图表丰富
5. 实际项目完整
```

---

### 24. SEC401: 网络安全

**课程信息：**
- 学习时长：140小时
- 难度等级：⭐⭐⭐⭐ (高)
- 前置课程：计算机网络、操作系统

**生成 Prompt：**

```
请为"网络安全"课程生成完整笔记，涵盖安全理论、攻防技术和实战演练。

【课程概述】
- 网络安全的重要性
- 安全威胁与攻击类型
- 安全防护体系

【核心知识点】

1. **网络安全基础**
   - CIA三要素（机密性、完整性、可用性）
   - 安全威胁模型
   - 安全攻击分类（被动攻击、主动攻击）
   - 安全防护原则
   - 纵深防御策略

2. **密码学基础**
   
   **对称加密**
   - DES、3DES
   - AES（Rijndael）算法详解
   - 分组密码模式（ECB, CBC, CTR, GCM）
   - 流密码（RC4, ChaCha20）
   
   **非对称加密**
   - RSA算法原理与实现
   - 椭圆曲线密码学（ECC）
   - Diffie-Hellman密钥交换
   - ElGamal加密
   
   **哈希函数**
   - MD5、SHA-1、SHA-256、SHA-3
   - 碰撞攻击
   - 哈希应用（数字签名、消息认证）
   
   **数字签名**
   - RSA签名
   - DSA、ECDSA
   - 签名验证流程
   
   **公钥基础设施（PKI）**
   - 数字证书（X.509）
   - 证书颁发机构（CA）
   - 证书链与信任模型
   - 证书撤销（CRL, OCSP）

3. **网络协议安全**
   
   **SSL/TLS**
   - TLS握手过程详解
   - TLS 1.2 vs TLS 1.3
   - 证书验证
   - 常见漏洞（POODLE, Heartbleed, BEAST）
   
   **IPsec**
   - AH与ESP协议
   - IKE密钥交换
   - VPN隧道模式与传输模式
   
   **SSH**
   - SSH协议原理
   - 公钥认证
   - 端口转发
   
   **HTTPS**
   - HTTPS工作流程
   - 证书配置
   - HSTS策略
   
   **DNS安全**
   - DNS劫持
   - DNS缓存投毒
   - DNSSEC

4. **Web安全**
   
   **OWASP Top 10**
   - SQL注入（注入原理、盲注、防御）
   - 跨站脚本攻击（XSS）：反射型、存储型、DOM型
   - 跨站请求伪造（CSRF）
   - 不安全的反序列化
   - XML外部实体注入（XXE）
   - 安全配置错误
   - 敏感数据暴露
   - 访问控制缺失
   - 使用含有已知漏洞的组件
   - 日志与监控不足
   
   **Web攻击技术**
   - 文件上传漏洞
   - 文件包含漏洞（LFI, RFI）
   - 命令注入
   - SSRF服务端请求伪造
   - 点击劫持（Clickjacking）
   - 开放重定向
   
   **Web防御技术**
   - 输入验证与输出编码
   - 参数化查询（防SQL注入）
   - CSP内容安全策略
   - 同源策略
   - Cookie安全标志（HttpOnly, Secure, SameSite）
   - CORS配置
   - WAF Web应用防火墙

5. **系统安全**
   
   **操作系统安全**
   - 权限管理（Linux文件权限、Windows ACL）
   - 用户认证（PAM, Kerberos）
   - 审计日志
   - 安全加固（最小化安装、禁用不必要服务）
   
   **缓冲区溢出**
   - 栈溢出原理
   - 堆溢出原理
   - Return-to-libc攻击
   - ROP（Return-Oriented Programming）
   - 防护机制（ASLR, DEP, Stack Canary）
   
   **恶意软件**
   - 病毒、蠕虫、木马
   - 勒索软件
   - Rootkit
   - 恶意软件分析（静态分析、动态分析）

6. **网络攻击与防御**
   
   **网络扫描与侦察**
   - 端口扫描（Nmap）
   - 服务识别
   - 操作系统指纹识别
   - 漏洞扫描（Nessus, OpenVAS）
   
   **网络嗅探**
   - Wireshark抓包分析
   - ARP欺骗
   - 中间人攻击（MITM）
   
   **拒绝服务攻击（DoS/DDoS）**
   - SYN Flood
   - UDP Flood
   - DNS放大攻击
   - DDoS防护（限流、清洗、CDN）
   
   **防火墙与IDS/IPS**
   - 包过滤防火墙
   - 状态检测防火墙
   - 应用层防火墙
   - 入侵检测系统（Snort, Suricata）
   - 入侵防御系统

7. **渗透测试**
   
   **渗透测试流程**
   - 信息收集
   - 漏洞扫描
   - 漏洞利用
   - 权限提升
   - 权限维持
   - 痕迹清除
   - 报告撰写
   
   **常用工具**
   - Kali Linux
   - Metasploit Framework
   - Burp Suite
   - SQLMap
   - John the Ripper
   - Hashcat
   
   **社会工程学**
   - 钓鱼攻击
   - 假冒身份
   - 物理渗透

8. **安全编程**
   - 安全编码规范（OWASP Secure Coding）
   - 输入验证
   - 安全的随机数生成
   - 密码存储（加盐哈希、bcrypt, Argon2）
   - 安全的会话管理
   - 错误处理与日志

9. **移动与IoT安全**
   - Android安全机制
   - iOS安全机制
   - 移动应用逆向
   - IoT设备安全
   - 固件分析

10. **云安全**
    - 云安全模型
    - 容器安全（Docker安全配置）
    - K8s安全最佳实践
    - 云服务配置安全

【实验环境搭建】
- Kali Linux安装配置
- DVWA（Damn Vulnerable Web Application）
- WebGoat
- Metasploitable靶机
- CTF练习平台（HackTheBox, TryHackMe）

【实战演练】

**Web安全实验**
- SQL注入实战
- XSS攻击与防御
- CSRF攻击实践
- 文件上传绕过

**系统安全实验**
- 缓冲区溢出利用
- 权限提升实战
- 后门植入与检测

**网络安全实验**
- 中间人攻击
- ARP欺骗
- 端口扫描与服务枚举

**密码学实验**
- RSA加密解密实现
- 数字签名验证
- SSL/TLS证书配置

【CTF竞赛训练】
- Web类题目
- Pwn二进制漏洞利用
- Reverse逆向工程
- Crypto密码学
- Misc杂项

【工具使用教程】
- Burp Suite完整教程
- Metasploit使用指南
- Wireshark高级过滤
- Nmap扫描技巧

【合规与标准】
- ISO 27001信息安全管理
- 等级保护2.0
- GDPR数据保护
- PCI DSS支付卡行业标准

请确保：
1. 攻击原理讲解清楚
2. 防御措施具体可行
3. 实验环境搭建详细
4. 工具使用有截图演示
5. 强调安全伦理与法律边界
```

---

### 25. BC401: 区块链技术

**课程信息：**
- 学习时长：120小时
- 难度等级：⭐⭐⭐ (中高)
- 前置课程：密码学、分布式系统

**生成 Prompt：**

```
请为"区块链技术"课程生成学习笔记，涵盖区块链原理、智能合约开发和应用实践。

【课程概述】
- 区块链技术发展历程
- 区块链的核心价值
- 应用场景与前景

【核心知识点】

1. **区块链基础**
   - 区块链定义与特点（去中心化、不可篡改、透明性）
   - 区块链分类（公有链、联盟链、私有链）
   - 区块链 vs 传统数据库
   - 区块结构详解
   - 链式结构原理
   - Merkle树

2. **密码学基础**
   - 哈希函数在区块链中的应用
   - 非对称加密（公钥/私钥、数字签名）
   - 地址生成机制
   - 零知识证明（ZK-SNARKs, ZK-STARKs）

3. **比特币（Bitcoin）**
   
   **比特币原理**
   - 比特币白皮书解读
   - UTXO模型（未花费交易输出）
   - 交易结构与验证
   - 脚本语言（Script）
   - 隔离见证（SegWit）
   - 闪电网络（Lightning Network）
   
   **共识机制**
   - 工作量证明（PoW）详解
   - 挖矿过程
   - 难度调整
   - 51%攻击
   - 矿池原理
   
   **比特币网络**
   - P2P网络结构
   - 节点类型（全节点、轻节点）
   - 区块传播
   - 分叉处理（软分叉、硬分叉）

4. **以太坊（Ethereum）**
   
   **以太坊架构**
   - 账户模型（EOA, Contract Account）
   - Gas机制
   - EVM（以太坊虚拟机）
   - 世界状态与状态树
   - 交易与收据
   
   **智能合约**
   - 智能合约概念
   - Solidity语言基础
     - 数据类型
     - 函数与修饰器
     - 事件与日志
     - 继承与接口
     - 库的使用
   - 合约部署与交互
   - 合约安全（重入攻击、整数溢出）
   
   **以太坊2.0**
   - 权益证明（PoS）
   - 信标链（Beacon Chain）
   - 分片技术（Sharding）
   - Casper共识

5. **共识算法**
   - PoW工作量证明
   - PoS权益证明
   - DPoS委托权益证明
   - PBFT实用拜占庭容错
   - Raft（在联盟链中应用）
   - PoA权威证明
   - PoSpace空间证明

6. **智能合约开发**
   
   **开发环境**
   - Remix IDE
   - Truffle框架
   - Hardhat开发环境
   - Ganache本地区块链
   
   **Solidity实战**
   - ERC-20代币标准实现
   - ERC-721 NFT标准实现
   - ERC-1155多代币标准
   - 去中心化交易所（DEX）合约
   - 众筹合约
   - 投票合约
   
   **Web3集成**
   - Web3.js使用
   - ethers.js库
   - MetaMask集成
   - DApp前端开发

7. **联盟链**
   
   **Hyperledger Fabric**
   - Fabric架构（Peer, Orderer, CA）
   - 通道（Channel）机制
   - 链码（Chaincode）开发
   - 背书策略
   - 排序服务
   
   **其他联盟链**
   - Quorum
   - Corda
   - FISCO BCOS（国产）

8. **区块链安全**
   - 智能合约漏洞（DAO攻击、重入攻击、整数溢出）
   - 合约审计工具（Slither, Mythril）
   - 私钥管理
   - 钱包安全
   - 51%攻击防护
   - 女巫攻击
   - 双花问题

9. **区块链应用**
   
   **DeFi（去中心化金融）**
   - 去中心化交易所（Uniswap原理）
   - 借贷协议（Aave, Compound）
   - 稳定币机制
   - 流动性挖矿
   - 闪电贷
   
   **NFT（非同质化代币）**
   - NFT标准与实现
   - NFT市场（OpenSea）
   - 元数据存储（IPFS）
   
   **其他应用**
   - 供应链溯源
   - 数字身份认证
   - 版权保护
   - 物联网+区块链

10. **跨链技术**
    - 跨链需求与挑战
    - 侧链（Sidechain）
    - 中继链（Relay Chain）
    - 哈希时间锁定（HTLC）
    - Cosmos与Polkadot

11. **性能优化**
    - 分片（Sharding）
    - 状态通道（State Channel）
    - Plasma
    - Rollup（Optimistic Rollup, ZK Rollup）
    - Layer 2解决方案

【实践环节】

**比特币实验**
- 搭建比特币测试网络
- 创建钱包与交易
- 分析区块链数据

**以太坊开发**
- Solidity智能合约编写
- 部署ERC-20代币
- 开发简单DApp（投票、拍卖）
- Truffle项目实战

**Hyperledger Fabric**
- Fabric网络搭建
- 链码开发与部署
- 业务场景实现

【项目实战】
1. **去中心化投票系统**
2. **ERC-20代币发行与交易**
3. **NFT交易平台**
4. **简单的DeFi借贷协议**
5. **供应链溯源系统（Fabric）**

【工具与平台】
- Remix IDE
- MetaMask钱包
- Etherscan区块浏览器
- Infura节点服务
- IPFS分布式存储
- The Graph数据索引

【参考资源】
- 比特币白皮书
- 以太坊黄皮书
- Solidity官方文档
- Hyperledger Fabric文档
- 《精通比特币》
- 《精通以太坊》

请确保：
1. 原理讲解深入浅出
2. 代码示例完整可运行
3. 安全问题重点强调
4. 实际项目开发流程清晰
5. 最新技术动态（以太坊2.0, Layer2等）
```

---

### 26. VR401: 虚拟现实与增强现实

**课程信息：**
- 学习时长：100小时
- 难度等级：⭐⭐⭐ (中高)
- 前置课程：计算机图形学

**生成 Prompt：**

```
请为"虚拟现实与增强现实"课程生成学习笔记，涵盖VR/AR理论和Unity/Unreal开发实践。

【课程概述】
- VR/AR技术发展历程
- VR vs AR vs MR的区别
- 应用场景与前景
- 元宇宙概念

【核心知识点】

1. **VR/AR基础**
   - 虚拟现实（VR）定义与特征（沉浸感、交互性、构想性）
   - 增强现实（AR）原理
   - 混合现实（MR）
   - 扩展现实（XR）
   - 硬件设备（头显、手柄、追踪器）

2. **VR硬件技术**
   - 头戴显示器（HMD）
     - 光学原理（透镜、FOV）
     - 显示技术（LCD, OLED, MicroLED）
     - 刷新率与延迟
   - 位置追踪技术
     - 内向外追踪（Inside-Out）
     - 外向内追踪（Outside-In）
     - 6DOF vs 3DOF
   - 交互设备
     - 手柄控制器
     - 手势识别
     - 眼动追踪
     - 触觉反馈

3. **VR渲染技术**
   - 立体渲染原理
   - 双目视差
   - 视场角（FOV）
   - 畸变校正
   - 时间扭曲（Timewarp, ATW）
   - 注视点渲染（Foveated Rendering）
   - 单通道实例化渲染
   - 性能优化（降低多边形数、LOD、遮挡剔除）

4. **AR技术**
   - 标记识别（Marker-based AR）
   - 无标记AR（Markerless AR）
   - SLAM（同步定位与地图构建）
   - 平面检测与追踪
   - 光照估计
   - 遮挡处理
   - AR硬件（ARKit, ARCore, HoloLens）

5. **交互设计**
   - VR交互范式
   - 移动方式（瞬移、平滑移动、传送点）
   - 抓取与操作
   - UI设计（3D UI vs 2D UI）
   - 手势识别
   - 语音交互
   - 眼动交互

6. **用户体验**
   - 晕动症（Motion Sickness）原因与缓解
   - 舒适性设计原则
   - 可访问性设计
   - 用户测试方法

7. **Unity VR开发**
   
   **Unity基础**
   - Unity编辑器使用
   - C#脚本编程
   - 游戏对象与组件
   - 物理引擎
   - 动画系统
   
   **VR开发**
   - XR Interaction Toolkit
   - VR设备集成（Oculus, HTC Vive, PSVR）
   - 传送移动实现
   - 手柄输入处理
   - 射线交互
   - 抓取物体实现
   - VR UI制作
   
   **性能优化**
   - 帧率优化（达到90fps）
   - Draw Call优化
   - 批处理
   - GPU Instancing

8. **Unreal VR开发**
   - Unreal Engine基础
   - 蓝图可视化编程
   - VR模板使用
   - VR交互实现
   - 材质与光照

9. **AR开发**
   
   **ARKit（iOS）**
   - ARKit架构
   - 平面检测
   - 图像识别
   - 面部追踪
   - 人体骨骼追踪
   
   **ARCore（Android）**
   - ARCore功能
   - 运动追踪
   - 环境理解
   - 光照估计
   
   **AR Foundation（Unity跨平台）**
   - AR Foundation框架
   - 平面放置物体
   - 图像追踪
   - 人脸AR

10. **WebXR**
    - WebXR Device API
    - Three.js + WebXR
    - A-Frame框架
    - 浏览器VR/AR体验

11. **高级主题**
    - 多人VR协作
    - 空间音频
    - 全身追踪（Full Body Tracking）
    - 虚拟化身（Avatar）
    - 数字孪生（Digital Twin）
    - 元宇宙技术栈

【实践项目】

**Unity VR项目**
1. **VR展厅**
   - 场景搭建
   - 传送移动
   - 物体交互

2. **VR游戏**
   - 射击游戏
   - 解谜游戏
   - 音乐节奏游戏

3. **VR培训模拟**
   - 工业安全培训
   - 医疗手术模拟

**Unity AR项目**
1. **AR家具摆放**
   - 平面检测
   - 物体放置
   - 旋转缩放

2. **AR导航**
   - 路径指示
   - POI标注

3. **AR游戏**
   - AR卡牌游戏
   - AR寻宝游戏

**综合项目**
- VR虚拟校园漫游
- AR博物馆导览
- VR多人会议室

【开发工具】
- Unity 3D
- Unreal Engine
- Blender（3D建模）
- Oculus Integration
- SteamVR Plugin
- AR Foundation
- Vuforia

【硬件设备（实验）】
- Oculus Quest 2/3
- HTC Vive
- Microsoft HoloLens
- 移动AR（手机/平板）

【参考资源】
- Unity官方VR教程
- Oculus开发者文档
- ARKit文档
- Google ARCore文档
- VR最佳实践指南

请确保：
1. 理论与实践结合
2. Unity开发教程详细
3. 代码示例完整
4. 性能优化重点突出
5. 包含完整项目开发流程
```

---

### 27. GAME401: 游戏开发

**生成 Prompt：**

```
请为"游戏开发基础"课程生成笔记，涵盖游戏设计、Unity/Unreal开发和完整项目实战。

【课程概述】
- 游戏开发流程
- 游戏引擎选择
- 游戏类型概览

【核心知识点】

1. **游戏设计基础**
   - 游戏设计文档（GDD）
   - 游戏机制设计
   - 关卡设计
   - 平衡性调整
   - 玩家体验（Player Experience）
   - 游戏循环（Game Loop）

2. **Unity游戏开发**
   
   **Unity基础**
   - 编辑器界面
   - GameObject与Component
   - Transform组件
   - Prefab预制体
   - Scene场景管理
   
   **C#编程**
   - Unity生命周期函数（Awake, Start, Update, FixedUpdate）
   - 协程（Coroutine）
   - 事件与委托
   - ScriptableObject
   
   **物理系统**
   - Rigidbody刚体
   - Collider碰撞体
   - 物理材质
   - 触发器（Trigger）
   - 射线检测（Raycast）
   
   **动画系统**
   - Animator Controller
   - 动画状态机
   - 动画混合树
   - IK反向动力学
   
   **UI系统**
   - Canvas画布
   - UI组件（Button, Text, Image）
   - 布局系统
   - UI事件处理
   
   **音频系统**
   - AudioSource与AudioListener
   - 3D音效
   - 音频混合器

3. **2D游戏开发**
   - Sprite精灵
   - 2D物理系统
   - Tilemap瓦片地图
   - 2D动画
   - 像素完美设置
   - 平台跳跃游戏实战

4. **3D游戏开发**
   - 第一人称控制器（FPS）
   - 第三人称控制器（TPS）
   - 相机控制
   - AI导航（NavMesh）
   - 敌人AI实现
   - 射击游戏机制

5. **游戏系统设计**
   - 状态管理（State Machine）
   - 对象池（Object Pool）
   - 单例模式在游戏中的应用
   - 事件系统
   - 数据持久化（PlayerPrefs, JSON, XML）
   - 存档系统

6. **Shader与特效**
   - Shader基础（Vertex Shader, Fragment Shader）
   - ShaderGraph可视化编程
   - 粒子系统（Particle System）
   - 视觉特效（VFX Graph）
   - 后处理效果（Post-Processing）

7. **性能优化**
   - Profiler性能分析
   - Draw Call优化
   - GC优化
   - 资源管理
   - LOD细节层次
   - 遮挡剔除

8. **多人游戏**
   - 网络架构（C/S, P2P）
   - Unity Netcode
   - Photon引擎
   - 同步策略（状态同步、帧同步）
   - 延迟补偿

9. **移动游戏开发**
   - 触摸输入
   - 屏幕适配
   - 移动平台优化
   - 内购（IAP）
   - 广告集成

10. **Unreal Engine开发**
    - 蓝图可视化编程
    - C++游戏编程
    - 材质编辑器
    - Niagara粒子系统
    - UE渲染管线

11. **游戏发布**
    - 多平台发布（PC, Mobile, Console）
    - 资源打包
    - 版本管理
    - 测试与调试
    - 上架流程（Steam, App Store, Google Play）

【实战项目】

**项目1：2D平台跳跃游戏**
- 角色控制（跳跃、移动）
- 关卡设计
- 道具收集
- 敌人AI
- UI系统

**项目2：第一人称射击游戏（FPS）**
- FPS控制器
- 射击机制
- 武器系统
- 敌人AI
- 血量系统
- 关卡设计

**项目3：塔防游戏**
- 塔的建造与升级
- 敌人路径寻找
- 波次系统
- 资源管理
- 平衡性调整

**项目4：RPG游戏基础**
- 角色属性系统
- 战斗系统
- 背包系统
- 任务系统
- 对话系统
- 存档加载

**项目5：多人在线游戏**
- 房间系统
- 玩家同步
- 实时对战

【游戏设计模式】
- 命令模式（撤销重做）
- 观察者模式（事件系统）
- 状态模式（AI状态机）
- 工厂模式（敌人生成）
- 对象池模式

【工具链】
- Unity Hub
- Visual Studio
- Blender（3D建模）
- Aseprite（像素美术）
- Audacity（音频编辑）
- Git版本控制

【资源获取】
- Unity Asset Store
- itch.io免费资源
- Kenney游戏素材
- Freesound音效库

【发布平台】
- Steam
- Epic Games Store
- itch.io
- App Store
- Google Play

请确保：
1. 从简单到复杂循序渐进
2. 每个项目都有完整教程
3. 代码注释详细
4. 包含美术资源准备
5. 性能优化技巧
```

---

### 28. MOBILE401: 移动应用开发

**生成 Prompt：**

```
请为"移动应用开发"课程生成笔记，涵盖Android、iOS和跨平台开发。

【课程概述】
- 移动开发平台对比
- 原生 vs 跨平台
- 移动应用架构

【核心知识点】

1. **Android开发（Kotlin）**
   
   **环境搭建**
   - Android Studio安装配置
   - SDK与AVD管理
   - Gradle构建系统
   
   **Kotlin基础**
   - Kotlin语法
   - 空安全
   - 协程（Coroutines）
   - 扩展函数
   
   **UI开发**
   - Activity与Fragment
   - ConstraintLayout布局
   - RecyclerView列表
   - ViewBinding
   - Jetpack Compose（现代UI）
   
   **数据存储**
   - SharedPreferences
   - Room数据库
   - DataStore
   
   **网络请求**
   - Retrofit
   - OkHttp
   - Gson/Moshi解析
   
   **架构组件**
   - ViewModel
   - LiveData
   - Navigation组件
   - MVVM架构
   
   **多线程**
   - Handler与Looper
   - AsyncTask（已弃用）
   - Kotlin Coroutines
   
   **其他功能**
   - 权限请求
   - 通知
   - 服务（Service）
   - 广播接收器
   - 内容提供者

2. **iOS开发（Swift/SwiftUI）**
   
   **环境搭建**
   - Xcode安装
   - 模拟器使用
   - 真机调试
   
   **Swift基础**
   - Swift语法
   - Optional可选类型
   - Closures闭包
   - Protocol协议
   
   **UI开发**
   - UIKit（传统）
     - UIViewController
     - UITableView
     - Auto Layout
   - SwiftUI（现代）
     - 声明式UI
     - State管理
     - Combine框架
   
   **数据存储**
   - UserDefaults
   - Core Data
   - Realm
   
   **网络请求**
   - URLSession
   - Alamofire
   - Codable协议
   
   **架构模式**
   - MVC
   - MVVM
   - VIPER
   
   **其他功能**
   - 推送通知
   - Core Location定位
   - Core Animation动画
   - Camera与相册

3. **跨平台开发**
   
   **Flutter**
   - Dart语言基础
   - Widget组件系统
   - State管理（Provider, Bloc, Riverpod）
   - 路由导航
   - HTTP请求
   - 本地存储（sqflite, SharedPreferences）
   - 原生集成（Platform Channels）
   - Flutter Web/Desktop
   
   **React Native**
   - React基础
   - React Native组件
   - StyleSheet样式
   - Navigation导航
   - Redux状态管理
   - Fetch/Axios网络请求
   - AsyncStorage存储
   - 原生模块集成
   
   **其他跨平台方案**
   - Ionic + Capacitor
   - Xamarin
   - Uni-app（国内）

4. **移动应用设计**
   - Material Design（Android）
   - Human Interface Guidelines（iOS）
   - 响应式布局
   - 适配不同屏幕
   - 夜间模式
   - 国际化（i18n）

5. **性能优化**
   - 启动速度优化
   - 内存管理
   - 布局优化
   - 图片加载优化（Glide, Picasso, SDWebImage）
   - 包体积优化
   - 电量优化

6. **测试**
   - 单元测试（JUnit, XCTest）
   - UI测试（Espresso, XCUITest）
   - 性能测试
   - Monkey测试

7. **发布上架**
   - 签名与打包
   - Google Play上架
   - App Store上架
   - 应用加固
   - 崩溃收集（Firebase Crashlytics）

8. **高级主题**
   - 推送通知（FCM, APNs）
   - 支付集成（支付宝、微信、Apple Pay、Google Pay）
   - 地图集成（Google Maps, 高德地图）
   - AR功能（ARCore, ARKit）
   - 蓝牙通信
   - NFC

【实战项目】

**Android项目**
1. 新闻阅读App（Jetpack Compose + MVVM）
2. 笔记App（Room数据库）
3. 天气App（网络请求）

**iOS项目**
1. ToDoList App（SwiftUI + Core Data）
2. 图片浏览App（SwiftUI + Combine）

**Flutter项目**
1. 跨平台聊天App
2. 电商App
3. 音乐播放器

【开发工具】
- Android Studio
- Xcode
- Visual Studio Code
- Postman（API测试）
- Charles（抓包工具）

【第三方服务】
- Firebase（后端服务）
- Leancloud
- 环信（即时通讯）

请确保：
1. Android和iOS都有详细教程
2. 跨平台方案对比清晰
3. 完整项目从0到1
4. 包含UI设计规范
5. 上架流程详细
```

---

### 29. IOT401: 物联网技术

**生成 Prompt：**

```
请为"物联网技术"课程生成笔记，涵盖硬件、通信协议、云平台和实际应用。

【课程概述】
- 物联网定义与架构
- 物联网应用场景
- 技术栈概览

【核心知识点】

1. **物联网基础**
   - 物联网定义
   - 物联网三层架构（感知层、网络层、应用层）
   - 物联网 vs 互联网
   - 工业物联网（IIoT）
   - 边缘计算

2. **硬件基础**
   
   **微控制器（MCU）**
   - Arduino系列
     - Arduino Uno
     - Arduino编程（C/C++）
     - 数字I/O
     - 模拟I/O
     - 串口通信
   
   - ESP32/ESP8266
     - WiFi功能
     - 低功耗模式
     - Arduino IDE编程
     - MicroPython编程
   
   - 树莓派（Raspberry Pi）
     - Linux操作系统
     - GPIO编程（Python）
     - 摄像头使用
     - 联网应用
   
   **传感器**
   - 温湿度传感器（DHT11/DHT22）
   - 光照传感器
   - 红外传感器
   - 超声波传感器
   - 加速度计/陀螺仪（MPU6050）
   - GPS模块
   - 气体传感器
   
   **执行器**
   - LED灯
   - 继电器
   - 步进电机/舵机
   - 蜂鸣器
   - 显示屏（LCD, OLED）

3. **通信技术**
   
   **短距离通信**
   - WiFi（802.11）
   - 蓝牙（BLE低功耗蓝牙）
   - ZigBee
   - NFC/RFID
   - 红外通信
   
   **长距离通信**
   - LoRa/LoRaWAN
   - NB-IoT（窄带物联网）
   - 4G/5G
   - Sigfox
   
   **有线通信**
   - I2C总线
   - SPI总线
   - UART串口
   - CAN总线
   - Modbus协议

4. **物联网协议**
   
   **应用层协议**
   - MQTT（消息队列遥测传输）
     - MQTT原理
     - 发布/订阅模式
     - QoS等级
     - Mosquitto代理
   
   - CoAP（受限应用协议）
   - HTTP/HTTPS
   - WebSocket
   
   **网络层协议**
   - IPv4/IPv6
   - 6LoWPAN（低功耗无线个域网）

5. **物联网平台**
   
   **云平台**
   - AWS IoT Core
   - Azure IoT Hub
   - Google Cloud IoT
   - 阿里云物联网平台
   - 腾讯云IoT
   - 华为IoT平台
   
   **开源平台**
   - ThingsBoard
   - Node-RED（可视化编程）
   - Home Assistant（智能家居）
   - OpenHAB
   
   **平台功能**
   - 设备管理
   - 数据采集
   - 数据存储
   - 数据可视化
   - 规则引擎
   - OTA固件升级

6. **数据处理**
   - 时序数据库（InfluxDB, TimescaleDB）
   - 数据清洗
   - 数据分析
   - 可视化（Grafana）
   - 实时流处理（Kafka, Flink）

7. **物联网安全**
   - 设备认证
   - 数据加密（TLS/SSL）
   - 固件安全
   - 安全启动
   - 访问控制
   - DDoS防护
   - 漏洞管理

8. **边缘计算**
   - 边缘计算概念
   - 边缘设备（网关）
   - 边缘智能
   - 边缘-云协同

9. **机器学习+IoT**
   - TinyML（微型机器学习）
   - TensorFlow Lite
   - 边缘AI推理
   - 预测性维护
   - 异常检测

【实战项目】

**Arduino项目**
1. **智能温控系统**
   - DHT22温湿度采集
   - OLED显示
   - 继电器控制风扇

2. **智能小车**
   - 超声波避障
   - 蓝牙遥控
   - 循迹功能

**ESP32项目**
1. **WiFi气象站**
   - 多传感器数据采集
   - MQTT上报云端
   - Web界面显示

2. **智能门锁**
   - RFID识别
   - 密码输入
   - 远程控制

**树莓派项目**
1. **智能家居中枢**
   - 集成多个传感器
   - 摄像头监控
   - 语音控制
   - Web/App控制

2. **人脸识别门禁**
   - OpenCV人脸识别
   - 数据库记录
   - 远程通知

**综合项目**
1. **智慧农业系统**
   - 土壤湿度监测
   - 自动灌溉
   - 数据上云
   - 移动App监控

2. **工业设备监控**
   - 设备状态采集
   - 故障预警
   - 数据分析
   - 大屏可视化

3. **智慧城市应用**
   - 智能路灯
   - 环境监测
   - 停车管理

【开发环境】
- Arduino IDE
- PlatformIO
- MicroPython
- Raspberry Pi OS
- Node-RED
- MQTT.fx（测试工具）

【硬件工具】
- 面包板与杜邦线
- 万用表
- 逻辑分析仪
- 示波器（可选）

【参考资源】
- Arduino官方教程
- ESP32文档
- Raspberry Pi官方资源
- MQTT协议规范
- ThingsBoard文档

请确保：
1. 硬件电路图清晰
2. 代码注释详细
3. 从简单到复杂
4. 实际应用场景
5. 安全意识强调
```

---

### 30. BIGDATA401: 大数据技术

**生成 Prompt：**

```
请为"大数据技术"课程生成完整笔记，涵盖Hadoop生态、Spark、数据仓库和实时计算。

【课程概述】
- 大数据的4V特征（Volume, Velocity, Variety, Value）
- 大数据技术栈
- 应用场景

【核心知识点】

1. **大数据基础**
   - 大数据定义与特征
   - 大数据处理流程（采集、存储、计算、分析、可视化）
   - 批处理 vs 流处理
   - CAP定理在大数据中的应用

2. **Hadoop生态系统**
   
   **HDFS（分布式文件系统）**
   - HDFS架构（NameNode, DataNode, Secondary NameNode）
   - 文件读写流程
   - 数据块（Block）与副本机制
   - 高可用性（HA）
   - Federation联邦
   - HDFS命令操作
   
   **MapReduce**
   - MapReduce编程模型
   - Mapper与Reducer
   - Shuffle机制详解
   - Combiner与Partitioner
   - MapReduce优化
   - WordCount经典案例
   
   **YARN（资源调度）**
   - YARN架构（ResourceManager, NodeManager, ApplicationMaster）
   - 资源调度策略（FIFO, Capacity, Fair）
   - 容器（Container）机制

3. **Hive数据仓库**
   - Hive架构
   - HiveQL语法
   - 内部表 vs 外部表
   - 分区表与分桶表
   - 文件格式（TextFile, ORC, Parquet）
   - Hive优化（谓词下推、列裁剪、分区裁剪）
   - Hive on Spark

4. **Spark大数据计算**
   
   **Spark Core**
   - Spark架构（Driver, Executor, Cluster Manager）
   - RDD（弹性分布式数据集）
     - RDD创建
     - Transformation操作（map, filter, flatMap）
     - Action操作（collect, count, reduce）
     - RDD持久化（cache, persist）
   - DAG有向无环图
   - 宽依赖 vs 窄依赖
   - Shuffle原理
   
   **Spark SQL**
   - DataFrame与Dataset
   - Catalyst优化器
   - SparkSQL与Hive集成
   - UDF用户自定义函数
   
   **Spark Streaming**
   - DStream
   - 窗口操作
   - 状态管理
   - 与Kafka集成
   
   **Structured Streaming**
   - 流式DataFrame
   - 事件时间处理
   - Watermark水印
   - 输出模式（Append, Update, Complete）
   
   **Spark MLlib**
   - 机器学习Pipeline
   - 特征工程
   - 分类与回归算法
   - 聚类算法
   - 协同过滤

5. **实时计算**
   
   **Kafka消息队列**
   - Kafka架构（Broker, Topic, Partition, Consumer Group）
   - 生产者与消费者
   - 分区策略
   - 副本机制
   - 高可用与容错
   - Kafka Streams
   
   **Flink流处理**
   - Flink架构（JobManager, TaskManager）
   - DataStream API
   - 窗口（Tumbling, Sliding, Session）
   - 时间语义（Event Time, Processing Time）
   - Watermark机制
   - 状态管理（State Backend）
   - Checkpoint检查点
   - Exactly-Once语义
   - Flink SQL
   
   **Storm**
   - Topology拓扑
   - Spout与Bolt
   - 流式分组

6. **NoSQL数据库**
   
   **HBase（列式存储）**
   - HBase架构（HMaster, RegionServer）
   - RowKey设计
   - 列族设计
   - Region分裂
   - 布隆过滤器
   - 二级索引（Phoenix）
   
   **MongoDB（文档数据库）**
   - 文档模型
   - CRUD操作
   - 聚合管道
   - 索引优化
   - 分片集群
   
   **Redis（内存数据库）**
   - 数据类型（String, Hash, List, Set, ZSet）
   - 持久化（RDB, AOF）
   - 主从复制
   - Redis Cluster
   - 缓存策略

7. **数据采集**
   - Flume日志采集
     - Source, Channel, Sink
     - Flume拓扑结构
   - Sqoop数据迁移
     - 关系型数据库与Hadoop互导
   - DataX
   - Logstash

8. **数据仓库**
   - 维度建模（星型模型、雪花模型）
   - ETL流程
   - 数据分层（ODS, DWD, DWS, ADS）
   - 拉链表
   - 缓慢变化维（SCD）
   - 数据质量管理

9. **OLAP分析引擎**
   - Kylin（预计算OLAP）
   - Druid实时OLAP
   - ClickHouse列式数据库
   - Presto交互式查询

10. **调度与监控**
    - Oozie工作流调度
    - Azkaban任务调度
    - DolphinScheduler（海豚调度）
    - Airflow（Python）
    - Zookeeper协调服务
    - Prometheus + Grafana监控

11. **数据治理**
    - 元数据管理（Atlas）
    - 数据血缘
    - 数据质量
    - 数据安全（Ranger, Sentry）

【实战项目】

**项目1：离线数据仓库**
- 电商数据仓库搭建
- 日志采集（Flume）
- ETL处理（Hive/Spark）
- 多维分析（Kylin）
- 可视化（Superset）

**项目2：实时推荐系统**
- 用户行为采集（Kafka）
- 实时计算（Flink）
- 特征存储（Redis）
- 推荐算法（Spark MLlib）

**项目3：实时数据大屏**
- 数据源接入
- 实时ETL（Flink）
- 时序数据库（InfluxDB）
- 大屏展示（ECharts）

**项目4：日志分析系统**
- ELK搭建（Elasticsearch, Logstash, Kibana）
- 日志采集与解析
- 全文检索
- 日志分析与可视化

**项目5：用户画像系统**
- 标签体系设计
- 离线标签计算（Hive）
- 实时标签更新（Flink）
- 标签存储（HBase）
- 画像查询服务

【环境搭建】
- 虚拟机集群搭建（VMware/VirtualBox）
- Docker容器化部署
- CDH/HDP发行版
- 阿里云/腾讯云大数据产品

【开发工具】
- IntelliJ IDEA
- DataGrip（数据库工具）
- DBeaver
- Postman

【可视化工具】
- Apache Superset
- Metabase
- Tableau
- FineBI

【参考资料】
- Hadoop权威指南
- Spark官方文档
- Flink官方文档
- 《大数据技术原理与应用》

请确保：
1. 架构图清晰详细
2. 每个组件都有实战代码
3. 调优技巧丰富
4. 完整项目从0到1
5. 包含实际业务场景
```

---

### 31. THESIS: 毕业设计

**生成 Prompt：**

```
请为"毕业设计指导"生成完整的指南文档，涵盖选题、开发、论文撰写全流程。

【毕业设计概述】
- 毕业设计的目的与意义
- 毕业设计 vs 课程设计
- 时间规划（6-8个月）

【选题指导】

1. **选题原则**
   - 与专业相关
   - 难度适中（能够在规定时间内完成）
   - 有一定创新性
   - 实用价值或学术价值
   - 资源可行性

2. **热门选题方向**
   
   **Web应用开发**
   - 在线教育平台
   - 电商系统
   - 社交网络
   - 博客/CMS系统
   - 在线问答系统
   - 企业管理系统（OA, ERP, CRM）
   
   **移动应用**
   - Android/iOS原生应用
   - 跨平台应用（Flutter, React Native）
   - 小程序开发
   
   **大数据与数据分析**
   - 数据可视化系统
   - 推荐系统
   - 用户画像系统
   - 数据仓库设计
   - 爬虫+数据分析
   
   **人工智能与机器学习**
   - 图像识别应用（人脸识别、物体检测）
   - 自然语言处理（情感分析、文本分类、聊天机器人）
   - 推荐算法实现
   - 预测模型（股票预测、销量预测）
   
   **物联网**
   - 智能家居系统
   - 环境监测系统
   - 智慧农业
   
   **游戏开发**
   - 2D/3D游戏
   - VR/AR应用
   
   **区块链**
   - 去中心化应用（DApp）
   - 溯源系统
   
   **系统工具**
   - 编译器/解释器
   - 性能监控工具
   - 代码生成工具

3. **选题案例**
   - "基于Spring Boot的在线教育平台设计与实现"
   - "基于深度学习的垃圾分类识别系统"
   - "基于微信小程序的校园二手交易平台"
   - "基于Spark的电商推荐系统设计与实现"
   - "基于区块链的供应链溯源系统"
   - "基于Unity3D的VR虚拟实验室"

【系统设计】

1. **需求分析**
   - 功能需求（用例图、用例描述）
   - 非功能需求（性能、安全、可用性）
   - 可行性分析（技术、经济、操作）

2. **系统架构设计**
   - 技术选型
   - 架构图（C/S, B/S, 微服务）
   - 模块划分
   - 数据库设计（ER图、表设计）
   - 接口设计

3. **详细设计**
   - 类图、时序图
   - 核心算法设计
   - 关键流程图

【技术栈推荐】

**后端**
- Java: Spring Boot + MyBatis/JPA + MySQL/PostgreSQL
- Python: Django/Flask + SQLAlchemy + MySQL/PostgreSQL
- Node.js: Express/Koa + Sequelize + MongoDB/MySQL
- Go: Gin + GORM + MySQL

**前端**
- Vue.js 3 + Element Plus + Axios
- React + Ant Design + Redux
- Angular
- 小程序原生开发

**移动端**
- Android（Kotlin） + Jetpack
- iOS（Swift） + SwiftUI
- Flutter + Provider/Bloc
- React Native

**数据库**
- 关系型：MySQL, PostgreSQL
- NoSQL：MongoDB, Redis
- 时序：InfluxDB

**部署**
- Docker容器化
- Nginx反向代理
- Linux服务器
- 云服务器（阿里云、腾讯云）

【开发流程】

1. **环境搭建**（1周）
   - 开发环境配置
   - 数据库安装
   - 版本控制（Git）

2. **数据库设计**（1-2周）
   - 设计ER图
   - 建表语句
   - 初始数据

3. **后端开发**（4-6周）
   - 搭建项目框架
   - 实现核心功能模块
   - API接口开发
   - 单元测试

4. **前端开发**（4-6周）
   - 页面设计
   - 组件开发
   - 接口联调
   - UI优化

5. **系统测试**（2周）
   - 功能测试
   - 性能测试
   - 兼容性测试
   - Bug修复

6. **部署上线**（1周）
   - 服务器配置
   - 项目部署
   - 域名配置
   - 线上测试

【论文撰写】

1. **论文结构**（3-4万字）
   
   **封面与摘要**
   - 中文摘要（300字）
   - 英文摘要
   - 关键词
   
   **第1章 绪论**（3000字）
   - 课题背景与意义
   - 国内外研究现状
   - 研究内容与方法
   - 论文组织结构
   
   **第2章 关键技术介绍**（5000字）
   - 技术框架介绍（Spring Boot, Vue.js等）
   - 核心算法原理
   - 数据库技术
   
   **第3章 系统需求分析**（5000字）
   - 可行性分析
   - 功能需求（用例图）
   - 非功能需求
   - 用例描述
   
   **第4章 系统设计**（8000字）
   - 系统架构设计
   - 功能模块设计
   - 数据库设计（ER图、表结构）
   - 接口设计
   
   **第5章 系统实现**（10000字）
   - 开发环境
   - 核心功能实现（代码+截图）
   - 关键技术实现
   - 代码说明
   
   **第6章 系统测试**（3000字）
   - 测试环境
   - 测试用例
   - 测试结果
   - Bug统计与分析
   
   **第7章 总结与展望**（2000字）
   - 工作总结
   - 不足之处
   - 未来展望
   
   **参考文献**
   - 至少15篇（书籍、论文、网络资源）
   
   **附录**
   - 核心代码
   - 数据库建表语句
   
   **致谢**

2. **论文格式规范**
   - 字体：宋体/Times New Roman
   - 字号：小四（正文）
   - 行距：1.5倍
   - 页边距：上下2.54cm，左右3.17cm
   - 图表格式（图题在下，表题在上）
   - 公式编号
   - 参考文献格式（GB/T 7714）

3. **常用工具**
   - LaTeX（推荐）
   - Word（模板）
   - Visio/Draw.io（画图）
   - StarUML（UML图）
   - Mendeley/Zotero（文献管理）

【答辩准备】

1. **PPT制作**（20-30页）
   - 课题背景（1-2页）
   - 系统架构（2-3页）
   - 核心功能展示（10-15页）
   - 系统演示（截图/视频）
   - 总结与展望（1-2页）
   - 致谢（1页）

2. **演示准备**
   - 系统演示视频
   - 现场演示准备（网络、账号）
   - 备用方案

3. **常见问题**
   - 为什么选择这个课题？
   - 系统的创新点是什么？
   - 遇到的主要困难和解决方法？
   - 使用了哪些技术？为什么选择这些技术？
   - 系统的性能如何？
   - 系统的安全性如何保证？
   - 未来如何改进？

【时间规划示例】

**第1-2个月**
- 确定选题
- 需求调研
- 方案设计

**第3-5个月**
- 系统开发
- 功能实现

**第6个月**
- 系统测试
- 论文撰写

**第7个月**
- 论文修改
- 答辩准备

**第8个月**
- 提交论文
- 答辩

【注意事项】

1. **学术规范**
   - 严禁抄袭
   - 正确引用文献
   - 代码注明出处

2. **进度管理**
   - 定期与导师沟通
   - 按时完成各阶段任务
   - 留出缓冲时间

3. **代码质量**
   - 规范的代码注释
   - 合理的目录结构
   - Git版本管理
   - README文档

4. **文档完整性**
   - 需求文档
   - 设计文档
   - 测试文档
   - 用户手册
   - 部署文档

【优秀案例参考**
- GitHub优秀开源项目
- 往届优秀毕业设计
- 学术论文
- 技术博客

请确保：
1. 选题实用且可行
2. 技术栈现代化
3. 论文结构完整
4. 答辩准备充分
5. 时间规划合理
```

---

## 总结

以上是第四学年全部10门课程的详细 Prompt，加上前三学年的课程，共计31门课程的完整笔记生成指南。

### 使用建议

1. **分步生成**：不要一次性生成所有内容，建议分章节逐步生成
2. **人工审核**：AI生成的内容需要人工审核和补充
3. **实践验证**：代码示例需要实际运行验证
4. **持续更新**：技术更新快，笔记需要定期更新
5. **结合实际**：根据学校课程大纲适当调整

### 质量保证

- 每个 Prompt 都强调理论与实践结合
- 包含完整的代码示例
- 配有图示说明
- 提供实战项目
- 参考权威资源

---

## 附录：LaTeX 公式规范（重要！）⭐

**前端使用 KaTeX + marked-katex-extension 渲染，必须遵循以下格式：**

### 基本语法

1. **行内公式**：使用单个 `$` 包裹
   ```markdown
   函数 $f(x) = x^2$ 的导数是 $f'(x) = 2x$
   ```

2. **块级公式**：使用双 `$$` 包裹，前后必须空行
   ```markdown
   牛顿第二定律：
   
   $$
   F = ma
   $$
   
   其中 $F$ 是力...
   ```

3. **表格中的公式**（已优化显示）：
   ```markdown
   | 函数 | 导数 | 积分 |
   |------|------|------|
   | $x^n$ | $nx^{n-1}$ | $\frac{x^{n+1}}{n+1} + C$ |
   | $e^x$ | $e^x$ | $e^x + C$ |
   ```

### 配置要点（技术实现）

**核心配置：**
```javascript
// 1. KaTeX 扩展必须在 marked.setOptions() 之前注册
marked.use(markedKatex({
  throwOnError: false,
  output: 'html',
  nonStandard: true,    // 启用扩展命令（希腊字母等）
  strict: false,        // 宽松模式
  trust: true          // 支持高级功能
}));

// 2. 然后才设置 marked 选项
marked.setOptions({ gfm: true, pedantic: false, breaks: false });
```

**关键点：**
- ⭐ **加载顺序很重要**：KaTeX 扩展必须先注册
- ⭐ **nonStandard: true**：支持希腊字母等非标准命令
- ⭐ **strict: false**：宽松模式，提高兼容性

### ⚠️ 禁止使用的格式

- ❌ `\( 公式 \)` （LaTeX 原生行内公式）
- ❌ `\[ 公式 \]` （LaTeX 原生块级公式）

### 常用符号速查

**微积分：**
- 求和：`\sum_{i=1}^{n}` → $\sum_{i=1}^{n}$
- 积分：`\int_{a}^{b} f(x) \, dx`
- 极限：`\lim_{x \to \infty}`
- 偏导：`\frac{\partial f}{\partial x}`

**希腊字母（已测试可用）：**
- 小写：`\alpha, \beta, \gamma, \delta, \theta, \lambda, \mu, \pi, \sigma`
- 大写：`\Gamma, \Delta, \Theta, \Lambda, \Sigma, \Omega`

**线性代数：**
- 向量：`\vec{v}`, `\mathbf{v}`
- 矩阵：`\begin{bmatrix} a & b \\ c & d \end{bmatrix}`
- 行列式：`\begin{vmatrix} a & b \\ c & d \end{vmatrix}`

**特殊符号：**
- 无穷：`\infty`
- 约等于：`\approx`
- 不等于：`\neq`
- 箭头：`\to, \Rightarrow`

### 测试建议

生成笔记后，建议测试：
- ✅ 行内公式：简单变量、复杂分式
- ✅ 块级公式：多行对齐、矩阵
- ✅ 表格公式：函数表、公式对照
- ✅ 希腊字母：数学/物理常用符号

---

祝你的智学伴项目成功！🎉


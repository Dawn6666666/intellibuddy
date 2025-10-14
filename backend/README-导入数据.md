# 知识点数据导入指南

> 💡 **2024更新**：知识库已优化为24个核心知识点，完整覆盖计算机科学本科课程体系

## 🚀 快速开始（推荐）

### 1. 配置环境变量

在 `backend` 目录创建 `.env` 文件：

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/intellibuddy?retryWrites=true&w=majority
# 或者使用本地MongoDB
MONGO_URI=mongodb://localhost:27017/intellibuddy

JWT_SECRET=your_random_secret_key_here
PORT=5001
FRONTEND_URL=http://localhost:5173
```

### 2. 一键导入（推荐方法）

**使用TypeScript导入脚本**（自动导入知识点 + 填充笔记内容）：

```bash
cd backend

# 方式1: 导入所有知识点（推荐）
npm run seed:all

# 方式2: 分步导入
npm run seed         # 导入基础知识点
npm run fill:content # 填充笔记内容

# 方式3: 按学年导入
npm run seed:year1
npm run seed:year2
npm run seed:year3
npm run seed:year4
```

## 📋 可用导入脚本

### TypeScript 脚本（推荐）✅

| 命令 | 描述 | 知识点数量 |
|------|------|-----------|
| `npm run seed:all` | **一键导入全部24个知识点 + 自动填充笔记** | 24个 |
| `npm run seed` | 导入核心知识点 | 24个 |
| `npm run fill:content` | 填充已有知识点的笔记内容 | - |
| `npm run seed:year1` | 第一学年课程 | 5个 |
| `npm run seed:year2` | 第二学年课程 | 8个 |
| `npm run seed:year3` | 第三学年课程 | 5个 |
| `npm run seed:year4` | 第四学年课程 | 6个 |

### CommonJS 脚本（兼容）

| 命令 | 描述 | 数据源 |
|------|------|--------|
| `npm run import` | 导入到本地 MongoDB | 读取JSON文件 |

## 📊 新知识点体系（24个）

根据最新的映射关系审阅，数据库包含以下24个核心知识点：

### 第一学年（5个）
- `cs101` - 编程导论 (C语言)
- `math101` - 微积分 I
- `cs102-discrete` - 离散数学与计算机科学导论
- `cs100` - 计算机导论
- `cs103` - 数据结构

### 第二学年（8个）
- `math201` - 线性代数
- `cs104` - 高级编程与代码规范
- `math102` - 微积分 II
- `cs201` - 计算机组成与体系结构
- `cs202` - 面向对象编程 (C++/Java)
- `cs203` - 软件工程基础
- `cs204` - 算法设计与分析
- `cs205` - 操作系统

### 第三学年（5个）
- `cs206-pl` - 编程语言原理
- `cs206-db` - 数据库系统
- `cs301` - 计算机网络
- `ai1` - 人工智能导论
- `ai2` - 深度学习

### 第四学年（6个）
- `cs402` - 分布式系统
- `sec1` - 网络安全导论
- `cs499` - 毕业设计
- `math203` - 概率论与数理统计
- `phys101` - 大学物理
- `eng101` - 大学英语

## 📝 数据结构说明

### 新数据模型字段

- `id`: 知识点唯一标识符
- `order`: 学习顺序
- `title`: 标题
- `description`: 详细描述
- `subject`: 学科分类
- `category`: 类别标签
- `difficulty`: 难度等级 (1-5)
- `prerequisites`: 前置知识点ID数组
- `learningPath`: 学习路径（学年/学期）
- `estimatedHours`: 预估学时
- `contentSnippet`: 内容简介
- `resources`: 学习资源数组
- `tags`: 标签数组
- `subtopics`: 子主题数组
- `status`: 学习状态
- `graphPosition`: 知识图谱位置
- `contentFiles`: 笔记文件内容（由fill-content填充）

## 🔧 故障排查

### 连接失败
1. 检查 MongoDB Atlas 网络访问白名单（添加 0.0.0.0/0 允许所有IP）
2. 确认用户名和密码正确
3. 确认数据库名称为 `intellibuddy`
4. 检查网络连接

### TypeScript 导入失败
1. 确保已安装依赖：`npm install`
2. 检查 ts-node 是否正常：`npx ts-node --version`
3. 查看完整错误信息

### 笔记内容填充失败
1. 确认 `public/笔记/` 目录存在
2. 检查笔记文件路径是否正确
3. 运行 `npm run fill:content:clear` 清除后重新填充

### 环境变量问题
1. 确认 `.env` 文件在 `backend` 目录
2. 确认 `MONGODB_URI` 或 `MONGO_URI` 变量已设置
3. 重启终端或重新加载环境

## 📈 导入结果示例

成功导入后会显示：
```
✅ 知识点数据导入成功！
============================================================
  - 共导入 24 个知识点
  - 配置映射 24 个知识点
============================================================

📚 已导入的知识点列表:
 1. [cs101         ] 编程导论 (C语言)
 2. [math101       ] 微积分 I
 3. [cs102-discrete] 离散数学与计算机科学导论
 ...

============================================================
📊 内容填充统计
============================================================
  - 已配置知识点: 24 个
  - 文件加载成功: 250 个
  - 文件加载失败: 0 个
============================================================
```

## ⚠️ 注意事项

- **数据清空**：导入脚本会先删除所有现有知识点，然后插入新数据
- **幂等操作**：可以重复运行，每次都会得到相同的结果
- **笔记映射**：确保 `src/config/content-files-config.ts` 中的笔记路径正确
- **推荐流程**：使用 `npm run seed:all` 一次性完成所有导入和内容填充

## 🎯 下一步

导入成功后：
1. 启动后端服务：`npm run dev`
2. 访问 API：`http://localhost:5001/api/knowledge-points`
3. 测试前端连接
4. 开始学习旅程！

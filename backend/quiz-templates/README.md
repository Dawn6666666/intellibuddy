# 📚 IntelliBuddy 题库管理系统

> 一个完整的题库管理解决方案，支持 LaTeX 公式、多种题型，提供灵活的数据导入和管理工具。

## ✨ 特性

- 🎯 **三种题型**：单选题、多选题、判断题
- 📐 **LaTeX 公式支持**：使用 KaTeX 渲染数学公式
- 📝 **灵活导入**：支持 TypeScript 代码和 JSON 文件导入
- 🔄 **便捷管理**：提供完整的 CLI 工具和 npm 脚本
- 📊 **统计反馈**：导入时自动统计和显示结果
- ✅ **数据验证**：自动验证题目格式和完整性

## 🚀 快速开始

### 1. 最快方式：使用预设示例

```bash
cd backend
pnpm quiz:seed  # 填充示例题库
```

预设示例包含：
- ✅ 数据结构题库（算法复杂度、栈和队列、链表）
- ✅ 编程基础题库
- ✅ 数据库系统题库

### 2. 从 JSON 文件导入

```bash
# 创建 JSON 文件（参考 quiz-template.json）
pnpm quiz:import ./path/to/your-quiz.json
```

### 3. 在代码中编写（适合复杂题目）

编辑 `backend/src/seed-quiz-data.ts`，然后运行：
```bash
pnpm quiz:seed
```

## 📖 文档导航

| 文档 | 说明 | 适合人群 |
|------|------|---------|
| **[快速开始.md](./快速开始.md)** | 详细的入门教程和常用命令 | 🌟 所有用户 |
| **[题库模板说明.md](./题库模板说明.md)** | 题目编写规范和最佳实践 | 📝 题目编写者 |
| **[quiz-template.json](./quiz-template.json)** | JSON 格式模板和示例 | 💻 JSON 用户 |

## 📐 LaTeX 公式支持

题目、选项和解析中都支持 LaTeX 数学公式！

### 快速示例

```json
{
  "question": "函数 $f(x) = x^2$ 的导数是？",
  "options": [
    "$f'(x) = 2x$",
    "$f'(x) = x$",
    "$f'(x) = 2$",
    "$f'(x) = 0$"
  ],
  "correctAnswer": 0,
  "explanation": "根据幂函数求导法则：$(x^n)' = nx^{n-1}$"
}
```

### 常用符号

| 符号 | LaTeX | 效果 |
|------|-------|------|
| 分数 | `$\frac{a}{b}$` | a/b |
| 根号 | `$\sqrt{x}$` | √x |
| 上标 | `$x^2$` | x² |
| 积分 | `$\int_a^b f(x) \, dx$` | ∫f(x)dx |
| 求和 | `$\sum_{i=1}^{n}$` | Σ |

**⚠️ 注意**：在 JSON 中，反斜杠需要转义：`\` → `\\`

详细说明请查看：[LaTeX 公式规范.md](../../LaTeX%20公式规范.md)

## 📝 题目格式

### 单选题
```typescript
{
  question: '问题描述',
  type: 'single',
  options: ['选项A', '选项B', '选项C', '选项D'],
  correctAnswer: 0,  // 索引（0-3）
  explanation: '答案解析'
}
```

### 多选题
```typescript
{
  question: '问题描述（可以多选）',
  type: 'multiple',
  options: ['选项A', '选项B', '选项C', '选项D'],
  correctAnswer: [0, 2],  // 索引数组
  explanation: '答案解析'
}
```

### 判断题
```typescript
{
  question: '判断题描述',
  type: 'boolean',
  options: ['正确', '错误'],
  correctAnswer: 0,  // 0=正确, 1=错误
  explanation: '答案解析'
}
```

## 🛠️ 常用命令

```bash
# 📥 导入和填充
pnpm quiz:seed              # 填充预设示例题库
pnpm quiz:import <文件.json> # 从 JSON 文件导入

# 🗑️ 清理
pnpm quiz:clear             # 清空所有题库（谨慎使用！）

# 🔧 开发
pnpm dev                    # 启动开发服务器
pnpm seed:all               # 填充所有知识点数据
```

## 📊 题库结构

```
backend/
├── src/
│   ├── seed-quiz-data.ts          # TypeScript 题库数据
│   ├── import-quiz-from-json.ts   # JSON 导入工具
│   └── routes/quiz.ts              # 题库 API 路由
│
├── quiz-templates/                 # 📁 题库模板和文档
│   ├── README.md                   # 本文件
│   ├── 快速开始.md                 # 详细教程
│   ├── 题库模板说明.md             # 编写规范
│   └── quiz-template.json          # JSON 模板
│
└── package.json                    # npm 脚本定义
```

## 🎯 最佳实践

### ✅ 好的题目

```json
{
  "question": "在 Python 中，以下哪个数据结构是有序且可变的？",
  "type": "single",
  "options": [
    "列表 (list)",
    "元组 (tuple)",
    "集合 (set)",
    "字典 (dict)"
  ],
  "correctAnswer": 0,
  "explanation": "列表是有序且可变的数据结构。元组有序但不可变，集合和字典都是无序的。"
}
```

**优点：**
- ✅ 问题明确清晰
- ✅ 选项格式统一
- ✅ 解析详细准确
- ✅ 考察实用知识

### ❌ 不好的题目

```json
{
  "question": "list是什么",
  "options": ["是一种数据结构", "b", "c", "我不知道"],
  "correctAnswer": 0,
  "explanation": "是list"
}
```

**问题：**
- ❌ 问题不完整
- ❌ 选项不规范
- ❌ 解析不清楚

## 🔍 API 使用

### 获取题目（不含答案）

```bash
GET /api/quiz/:pointId
```

```bash
curl http://localhost:5001/api/quiz/ds101
```

### 提交答案

```bash
POST /api/quiz/submit
Content-Type: application/json
Authorization: Bearer <token>

{
  "pointId": "ds101",
  "answers": [0, [0,1,2], 0, 1, 1]
}
```

**返回：**
```json
{
  "score": 80,
  "total": 5,
  "correct": 4,
  "details": [
    {
      "questionIndex": 0,
      "isCorrect": true,
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
```

## 💡 使用场景

### 场景 1：快速体验

```bash
# 1. 填充示例数据
pnpm quiz:seed

# 2. 启动服务器
pnpm dev

# 3. 在前端测试
# - 登录系统
# - 进入知识库
# - 点击任意知识点
# - 点击"开始测验"
```

### 场景 2：批量创建题库

```bash
# 1. 准备 JSON 文件
cp quiz-templates/quiz-template.json my-quiz.json

# 2. 编辑题目
# 使用 VS Code 或任何文本编辑器

# 3. 导入
pnpm quiz:import ./my-quiz.json

# 4. 验证
curl http://localhost:5001/api/quiz/your-point-id
```

### 场景 3：团队协作

```bash
# 成员 A: 创建题库分支
git checkout -b feature/add-database-quiz

# 成员 A: 添加题库文件
# 编辑 backend/quiz-templates/database-quiz.json

# 成员 A: 提交并推送
git add .
git commit -m "添加数据库系统题库 (30题)"
git push origin feature/add-database-quiz

# 成员 B: 拉取并导入
git checkout feature/add-database-quiz
cd backend
pnpm quiz:import ../quiz-templates/database-quiz.json
```

## 🆘 常见问题

### Q: 导入提示"知识点不存在"？

**A:** 确保知识点 ID 在数据库中存在。先运行：
```bash
pnpm seed:all  # 填充所有知识点
```

### Q: LaTeX 公式显示不正常？

**A:** 检查以下几点：
1. 是否使用了 `$` 或 `$$` 包裹公式？
2. JSON 中反斜杠是否转义？（`\` → `\\`）
3. 是否使用了禁用的格式（`\(` `\)` `\[` `\]`）？

### Q: 如何修改已有题目？

**A:** 重新导入即可，会自动覆盖：
```bash
pnpm quiz:import ./updated-quiz.json
```

### Q: 可以只更新部分知识点吗？

**A:** 可以！JSON 文件中只包含要更新的知识点即可。

### Q: 题目支持图片吗？

**A:** 当前版本支持 Markdown 语法的图片：
```markdown
![图片描述](图片URL)
```

## 📞 获取帮助

- 📖 **详细教程**：查看 [快速开始.md](./快速开始.md)
- 📝 **编写规范**：查看 [题库模板说明.md](./题库模板说明.md)
- 🔧 **代码实现**：
  - API: `backend/src/routes/quiz.ts`
  - 数据模型: `backend/src/models/KnowledgePoint.ts`
  - 示例数据: `backend/src/seed-quiz-data.ts`

## 📈 进阶功能

### 自定义验证规则

编辑 `backend/src/import-quiz-from-json.ts` 中的 `validateQuizData` 函数。

### 扩展题型

1. 在 `backend/src/models/KnowledgePoint.ts` 中添加新题型
2. 更新前端题目渲染逻辑
3. 更新验证规则

### 数据分析

```typescript
// 查询所有包含题目的知识点
const pointsWithQuiz = await KnowledgePoint.find({
  'quiz.0': { $exists: true }
}).select('id title quiz');

// 统计题目数量
const totalQuestions = pointsWithQuiz.reduce(
  (sum, point) => sum + point.quiz.length,
  0
);
```

## 🎉 开始使用

准备好了吗？从这里开始：

```bash
cd backend
pnpm quiz:seed    # 填充示例题库
pnpm dev          # 启动服务器
```

然后在前端进入知识库，选择任意知识点，点击"开始测验"！

---

**版本**: 1.0.0  
**更新**: 2025-01-16  
**维护**: IntelliBuddy Team


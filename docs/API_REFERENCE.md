# 智学伴 API 参考文档

## 📋 目录

- [基础信息](#基础信息)
- [认证相关](#认证相关-auth)
- [知识点相关](#知识点相关-knowledge)
- [学习进度相关](#学习进度相关-progress)
- [AI 相关](#ai-相关)
- [测验相关](#测验相关-quiz)
- [错题本相关](#错题本相关-wrong-questions)
- [学习报告相关](#学习报告相关-learning-report)
- [成就系统相关](#成就系统相关-achievements)
- [数据分析相关](#数据分析相关-analytics)
- [错误码说明](#错误码说明)

---

## 基础信息

### Base URL

- **开发环境**：`http://localhost:5001/api`
- **生产环境**：`https://your-domain.vercel.app/api`

### 通用请求头

```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

### 通用响应格式

**成功响应**：
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**错误响应**：
```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE"
}
```

---

## 认证相关 (Auth)

### 1. 用户注册

**POST** `/auth/register`

注册新用户账号。

**请求体**：
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123456"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

**错误码**：
- `400` - 用户名或邮箱已存在
- `400` - 请求参数验证失败

---

### 2. 用户登录

**POST** `/auth/login`

使用邮箱和密码登录。

**请求体**：
```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser",
      "email": "test@example.com",
      "avatarUrl": "https://...",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

**错误码**：
- `401` - 邮箱或密码错误
- `400` - 请求参数不完整

---

### 3. 获取当前用户信息

**GET** `/auth/me`

获取当前登录用户的详细信息。

**请求头**：
```http
Authorization: Bearer <JWT_TOKEN>
```

**响应**：
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "avatarUrl": "https://...",
    "bio": "热爱学习的程序员",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**错误码**：
- `401` - 未授权（Token 无效或过期）

---

### 4. 更新用户信息

**PUT** `/auth/profile`

更新当前用户的个人资料。

**请求头**：
```http
Authorization: Bearer <JWT_TOKEN>
```

**请求体**：
```json
{
  "username": "newusername",
  "bio": "更新的个人简介",
  "avatarUrl": "https://new-avatar.png"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "newusername",
    "email": "test@example.com",
    "bio": "更新的个人简介",
    "avatarUrl": "https://new-avatar.png"
  }
}
```

---

### 5. GitHub 登录

**GET** `/auth/github`

重定向到 GitHub OAuth 授权页面。

**流程**：
1. 用户点击"GitHub登录"按钮
2. 前端重定向到 `GET /api/auth/github`
3. 后端重定向到 GitHub 授权页
4. 用户授权后，GitHub 回调到 `GET /api/auth/github/callback`
5. 后端生成 JWT 并重定向到前端 `/auth/callback?token=<JWT_TOKEN>`

---

### 6. QQ 登录

**GET** `/auth/qq`

重定向到 QQ OAuth 授权页面。

**流程**：同 GitHub 登录，回调地址为 `/api/auth/qq/callback`

---

## 知识点相关 (Knowledge)

### 1. 获取所有知识点

**GET** `/knowledge-points`

获取所有知识点列表（用于知识图谱）。

**查询参数**：
- `subject` (可选) - 按学科筛选，如 `计算机导论`
- `status` (可选) - 按状态筛选：`completed` | `in_progress` | `locked`

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "title": "变量与数据类型",
      "subject": "Python编程基础",
      "description": "学习 Python 中的基本数据类型",
      "level": 1,
      "prerequisites": [],
      "content": "# 变量与数据类型\n\n...",
      "examples": [...],
      "exercises": [...]
    },
    ...
  ]
}
```

---

### 2. 获取单个知识点详情

**GET** `/knowledge-points/:id`

获取指定知识点的完整内容。

**路径参数**：
- `id` - 知识点ID

**响应**：
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e1a1",
    "title": "变量与数据类型",
    "subject": "Python编程基础",
    "description": "学习 Python 中的基本数据类型",
    "level": 1,
    "prerequisites": ["60d5ec49f1b2c8b1f8e4e1a0"],
    "content": "# 详细内容 (Markdown)\n\n...",
    "examples": [
      {
        "title": "整数变量示例",
        "code": "x = 10\nprint(x)",
        "explanation": "..."
      }
    ],
    "exercises": [...]
  }
}
```

---

## 学习进度相关 (Progress)

### 1. 获取用户学习进度

**GET** `/progress`

获取当前用户的所有学习进度。

**请求头**：
```http
Authorization: Bearer <JWT_TOKEN>
```

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e2a1",
      "userId": "507f1f77bcf86cd799439011",
      "pointId": "60d5ec49f1b2c8b1f8e4e1a1",
      "status": "completed",
      "score": 95,
      "attempts": 2,
      "lastStudiedAt": "2025-01-15T14:30:00.000Z",
      "completedAt": "2025-01-15T15:00:00.000Z"
    },
    ...
  ]
}
```

---

### 2. 更新学习进度

**POST** `/progress`

更新或创建学习进度记录。

**请求头**：
```http
Authorization: Bearer <JWT_TOKEN>
```

**请求体**：
```json
{
  "pointId": "60d5ec49f1b2c8b1f8e4e1a1",
  "status": "completed",
  "score": 90
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e2a1",
    "userId": "507f1f77bcf86cd799439011",
    "pointId": "60d5ec49f1b2c8b1f8e4e1a1",
    "status": "completed",
    "score": 90,
    "updatedAt": "2025-01-15T15:30:00.000Z"
  }
}
```

---

## AI 相关

### 1. AI 聊天对话

**POST** `/ai/chat`

与 AI 助教进行对话。

**请求头**：
```http
Authorization: Bearer <JWT_TOKEN>
```

**请求体**：
```json
{
  "message": "什么是闭包？",
  "conversationHistory": [
    {
      "role": "user",
      "content": "你好"
    },
    {
      "role": "assistant",
      "content": "你好！有什么可以帮助你的吗？"
    }
  ],
  "context": "当前学习：JavaScript高级特性 - 闭包"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "reply": "闭包（Closure）是指有权访问另一个函数作用域中变量的函数。简单来说...",
    "timestamp": "2025-01-15T16:00:00.000Z"
  }
}
```

---

### 2. 代码解释

**POST** `/ai/explain-code`

让 AI 解释一段代码。

**请求体**：
```json
{
  "code": "function outer() {\n  let count = 0;\n  return function() {\n    count++;\n    console.log(count);\n  }\n}",
  "language": "javascript"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "explanation": "# 代码功能概述\n\n这是一个闭包的经典示例...\n\n## 逐行解释\n\n1. `function outer()` - 定义外部函数...",
    "concepts": ["闭包", "作用域链", "私有变量"],
    "suggestions": "可以考虑添加参数来初始化 count 的值..."
  }
}
```

---

### 3. AI 健康检查

**GET** `/ai/health`

检查所有 AI 模型的可用性。

**响应**：
```json
{
  "success": true,
  "data": {
    "kimi": true,
    "qianwen": false,
    "zhipu": true,
    "ernie": false
  }
}
```

---

## 测验相关 (Quiz)

### 1. 获取知识点测验题

**GET** `/quiz/:pointId`

获取指定知识点的测验题目。

**路径参数**：
- `pointId` - 知识点ID

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e3a1",
      "question": "Python 中哪个数据类型是不可变的？",
      "options": ["list", "dict", "tuple", "set"],
      "correctAnswer": "C",
      "explanation": "tuple（元组）是不可变的数据类型..."
    },
    ...
  ]
}
```

---

### 2. 提交测验答案

**POST** `/quiz/submit`

提交测验答案并获取结果。

**请求体**：
```json
{
  "pointId": "60d5ec49f1b2c8b1f8e4e1a1",
  "answers": {
    "60d5ec49f1b2c8b1f8e4e3a1": "C",
    "60d5ec49f1b2c8b1f8e4e3a2": "B",
    "60d5ec49f1b2c8b1f8e4e3a3": "A"
  }
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "score": 80,
    "totalQuestions": 5,
    "correctCount": 4,
    "passed": true,
    "wrongQuestions": [
      {
        "questionId": "60d5ec49f1b2c8b1f8e4e3a2",
        "question": "...",
        "userAnswer": "B",
        "correctAnswer": "C",
        "explanation": "..."
      }
    ]
  }
}
```

---

## 错题本相关 (Wrong Questions)

### 1. 获取错题列表

**GET** `/wrong-questions`

获取当前用户的所有错题。

**查询参数**：
- `subject` (可选) - 按学科筛选
- `mastered` (可选) - 筛选掌握状态：`true` | `false`

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e4a1",
      "userId": "507f1f77bcf86cd799439011",
      "pointId": "60d5ec49f1b2c8b1f8e4e1a1",
      "pointTitle": "变量与数据类型",
      "subject": "Python编程基础",
      "question": "...",
      "options": [...],
      "correctAnswer": "C",
      "userAnswer": "B",
      "explanation": "...",
      "aiAnalysis": "...",
      "mastered": false,
      "attemptCount": 2,
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    ...
  ]
}
```

---

### 2. 标记错题为已掌握

**PUT** `/wrong-questions/:id/master`

将错题标记为已掌握。

**路径参数**：
- `id` - 错题ID

**响应**：
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4e4a1",
    "mastered": true,
    "masteredAt": "2025-01-16T10:00:00.000Z"
  }
}
```

---

### 3. 获取 AI 深度解析

**POST** `/wrong-questions/:id/analyze`

为错题生成 AI 深度解析。

**路径参数**：
- `id` - 错题ID

**响应**：
```json
{
  "success": true,
  "data": {
    "analysis": "# 错误原因分析\n\n你可能混淆了...\n\n# 知识点详解\n\n...\n\n# 记忆技巧\n\n...\n\n# 知识拓展\n\n..."
  }
}
```

---

## 学习报告相关 (Learning Report)

### 1. 生成学习报告

**POST** `/learning-report/generate`

为当前用户生成AI个性化学习报告。

**请求体**：
```json
{
  "period": "week"  // "week" | "month" | "all"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "report": "# 学习总结\n\n本周你共学习了 15 小时...",
    "generatedAt": "2025-01-16T10:00:00.000Z"
  }
}
```

---

## 成就系统相关 (Achievements)

### 1. 获取用户成就

**GET** `/achievements`

获取当前用户的所有成就。

**响应**：
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "achievementId": "first_login",
        "title": "初次登录",
        "description": "完成首次登录",
        "icon": "🎉",
        "points": 10,
        "unlocked": true,
        "unlockedAt": "2025-01-15T10:00:00.000Z"
      },
      ...
    ],
    "totalPoints": 350,
    "level": 5
  }
}
```

---

### 2. 检查并解锁成就

**POST** `/achievements/check`

检查是否满足新成就的解锁条件。

**响应**：
```json
{
  "success": true,
  "data": {
    "newAchievements": [
      {
        "achievementId": "study_master",
        "title": "学习大师",
        "description": "累计学习100小时",
        "points": 100
      }
    ]
  }
}
```

---

## 数据分析相关 (Analytics)

### 1. 获取学习统计

**GET** `/analytics/stats`

获取用户的学习统计数据。

**查询参数**：
- `period` (可选) - 时间范围：`week` | `month` | `all`

**响应**：
```json
{
  "success": true,
  "data": {
    "totalStudyTime": 45000,  // 秒
    "completedPoints": 25,
    "totalPoints": 100,
    "averageScore": 88.5,
    "studyStreak": 7,  // 连续学习天数
    "weakSubjects": ["算法与数据结构"],
    "strongSubjects": ["Python编程基础"]
  }
}
```

---

### 2. 获取学习热力图数据

**GET** `/analytics/heatmap`

获取学习热力图数据（用于可视化）。

**查询参数**：
- `year` - 年份，如 `2025`

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-15",
      "value": 3600  // 当天学习秒数
    },
    ...
  ]
}
```

---

## 错误码说明

| HTTP状态码 | 错误码 | 说明 |
|-----------|--------|------|
| 400 | `BAD_REQUEST` | 请求参数错误 |
| 401 | `UNAUTHORIZED` | 未授权（未登录或 Token 无效） |
| 403 | `FORBIDDEN` | 禁止访问（权限不足） |
| 404 | `NOT_FOUND` | 资源不存在 |
| 409 | `CONFLICT` | 资源冲突（如用户名已存在） |
| 429 | `TOO_MANY_REQUESTS` | 请求过于频繁（触发限流） |
| 500 | `INTERNAL_ERROR` | 服务器内部错误 |
| 503 | `SERVICE_UNAVAILABLE` | 服务不可用（如 AI 服务故障） |

---

## 限流说明

为保护服务器资源，部分接口实施了限流策略：

| 接口类别 | 限流规则 |
|---------|---------|
| 全局接口 | 100 请求/分钟 |
| 认证接口 | 5 请求/分钟 |
| AI 接口 | 20 请求/分钟 |

超过限流后会返回 `429 Too Many Requests` 错误。

---

## 示例代码

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-domain.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 设置 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 登录
async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

// 获取知识点
async function getKnowledgePoints() {
  const response = await api.get('/knowledge-points');
  return response.data;
}
```

---

**文档版本**：v2.0  
**最后更新**：2025年1月16日  
**维护者**：智学伴团队


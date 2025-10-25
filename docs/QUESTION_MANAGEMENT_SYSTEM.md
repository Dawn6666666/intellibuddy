# 完整题目管理系统文档

## 概述

本文档详细介绍智学伴（IntelliBuddy）平台的题目管理系统，该系统为作业功能提供了完整的题目创建、管理和答题支持。

---

## 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        题目管理系统                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐         ┌───────▼────────┐
        │  后端数据层     │         │  前端界面层     │
        └───────┬────────┘         └───────┬────────┘
                │                           │
    ┌───────────┼───────────┐   ┌───────────┼───────────┐
    │           │           │   │           │           │
┌───▼──┐   ┌───▼──┐   ┌───▼──┐ ┌▼──────┐ ┌▼──────┐  ┌▼──────┐
│ 题目 │   │ API  │   │ 作业 │ │题库   │ │编辑器│  │答题   │
│ 模型 │   │ 路由 │   │ 集成 │ │管理   │ │组件  │  │组件   │
└──────┘   └──────┘   └──────┘ └───────┘ └───────┘  └───────┘
```

---

## 一、后端实现

### 1. 数据模型 (`backend/src/models/Question.ts`)

#### 支持的题型

| 题型 | 类型值 | 说明 |
|------|--------|------|
| 单选题 | `single` | 从多个选项中选择一个答案 |
| 多选题 | `multiple` | 从多个选项中选择多个答案 |
| 判断题 | `truefalse` | 判断对错（正确/错误） |
| 简答题 | `short` | 文本输入，简短回答 |
| 论述题 | `essay` | 文本输入，详细阐述 |

#### 数据结构

```typescript
{
  _id: ObjectId,
  title: string,              // 题目标题
  type: 'single|multiple|truefalse|short|essay',
  content: string,            // 题目内容（支持Markdown）
  options: [                  // 选项（仅选择题）
    {
      id: string,             // 选项ID（A, B, C, D...）
      content: string,        // 选项内容
      isCorrect: boolean      // 是否为正确答案
    }
  ],
  correctAnswer: string | string[], // 正确答案
  analysis: string,           // 题目解析
  difficulty: 'easy|medium|hard',
  knowledgePoints: [ObjectId], // 关联知识点
  tags: [string],             // 标签
  teacherId: ObjectId,        // 创建者ID
  isPublic: boolean,          // 是否公开
  usageCount: number,         // 使用次数
  createdAt: Date,
  updatedAt: Date
}
```

#### 数据库索引

```javascript
// 教师查询
{ teacherId: 1, type: 1 }

// 筛选查询
{ difficulty: 1 }
{ tags: 1 }
{ isPublic: 1 }
{ knowledgePoints: 1 }
```

#### 安全方法

**toSafeObject()** - 生成学生端安全版本（隐藏答案）
```javascript
const safeQuestion = question.toSafeObject();
// 移除了 isCorrect、correctAnswer、analysis 字段
```

---

### 2. API 路由 (`backend/src/routes/question.ts`)

#### 教师端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | `/api/question` | 创建题目 | 教师 |
| GET | `/api/question/my` | 获取我的题目列表 | 教师 |
| GET | `/api/question/:id` | 获取题目详情（含答案） | 教师（自己的） |
| PUT | `/api/question/:id` | 更新题目 | 教师（自己的） |
| DELETE | `/api/question/:id` | 删除题目 | 教师（自己的） |
| GET | `/api/question/public/list` | 获取公开题库 | 教师 |
| POST | `/api/question/:id/copy` | 复制题目到我的题库 | 教师 |

#### 学生端点

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | `/api/question/batch` | 批量获取题目（不含答案） | 学生 |

#### 查询参数

**获取题目列表** (`GET /api/question/my`)
```javascript
{
  page: 1,              // 页码
  limit: 20,            // 每页数量
  type: 'single',       // 筛选题型
  difficulty: 'medium', // 筛选难度
  tag: '数学',          // 筛选标签
  search: '三角函数'    // 搜索关键词（标题、内容）
}
```

**响应格式**
```javascript
{
  questions: [...],     // 题目列表
  total: 50,           // 总数
  page: 1,             // 当前页
  limit: 20,           // 每页数量
  totalPages: 3        // 总页数
}
```

---

### 3. 与作业系统集成

#### Assignment 模型中的题目字段

```typescript
questions: [{
  questionId: ObjectId,  // 引用 Question._id
  score: number          // 该题分值
}]
```

#### 发布作业时的验证

```javascript
if (assignment.questions.length === 0) {
  return res.status(400).json({ error: '作业必须包含至少一道题目' });
}
```

---

## 二、前端实现

### 1. 题目编辑器 (`QuestionEditor.vue`)

#### 功能特性

- ✅ 支持5种题型切换
- ✅ 动态选项管理（添加/删除/编辑）
- ✅ 单选题自动切换正确答案
- ✅ 多选题支持多个正确答案
- ✅ 判断题固定两个选项
- ✅ 简答题/论述题参考答案输入
- ✅ 题目解析编辑
- ✅ 难度选择
- ✅ 标签管理
- ✅ 公开设置

#### 使用方式

```vue
<QuestionEditor
  :initial-data="editingQuestion"
  @save="handleSave"
  @cancel="handleCancel"
/>
```

#### 事件

- **@save(data)** - 保存题目时触发
- **@cancel** - 取消编辑时触发

---

### 2. 题库管理 (`QuestionBank.vue`)

#### 功能特性

- ✅ 题目列表展示（分页）
- ✅ 搜索功能（标题、内容）
- ✅ 筛选功能（题型、难度）
- ✅ 创建/编辑/删除题目
- ✅ 查看题目详情
- ✅ 选择模式（用于添加到作业）
- ✅ 使用次数统计
- ✅ 公开状态显示

#### 使用方式

**普通模式（题库管理）**
```vue
<QuestionBank />
```

**选择模式（添加到作业）**
```vue
<QuestionBank
  selection-mode
  :selected-questions="assignmentForm.questions"
  @select="handleSelect"
/>
```

#### Props

- **selectionMode** (boolean) - 是否为选择模式
- **selectedQuestions** (array) - 已选题目列表

#### 事件

- **@select(questions)** - 选择题目时触发

---

### 3. 题目查看 (`QuestionView.vue`)

#### 功能特性

- ✅ 题目信息展示
- ✅ 选项展示（选择题）
- ✅ 正确答案标记（可选）
- ✅ 题目解析显示（可选）
- ✅ 标签展示
- ✅ 美观的UI设计

#### 使用方式

```vue
<!-- 教师端查看（显示答案） -->
<QuestionView
  :question="question"
  :show-answer="true"
/>

<!-- 学生端查看（隐藏答案） -->
<QuestionView
  :question="question"
  :show-answer="false"
/>
```

---

### 4. 答题组件 (`AnswerSheet.vue`)

#### 功能特性

- ✅ 作业信息展示
- ✅ 题目列表展示
- ✅ 单选题答题
- ✅ 多选题答题
- ✅ 判断题答题
- ✅ 简答题/论述题答题
- ✅ 答题进度跟踪
- ✅ 已答题标记
- ✅ 提交确认
- ✅ 响应式设计

#### 使用方式

```vue
<AnswerSheet
  :assignment="assignment"
  @submit="handleSubmit"
  @cancel="handleCancel"
/>
```

#### Props

- **assignment** (object) - 作业对象（包含题目列表）

#### 事件

- **@submit(answers)** - 提交答案时触发
- **@cancel** - 取消答题时触发

#### 答案格式

```javascript
// 单选题/判断题
{
  questionId: '...',
  answer: 'A'  // 选项ID
}

// 多选题
{
  questionId: '...',
  answer: ['A', 'C', 'D']  // 选项ID数组
}

// 简答题/论述题
{
  questionId: '...',
  answer: '这是我的答案文本...'
}
```

---

### 5. 教师端集成 (`TeacherView.vue`)

#### 新增功能

**题库管理标签页**
- 独立的题库管理界面
- 完整的题目CRUD操作
- 搜索和筛选功能

**作业创建增强**
- 添加题目按钮
- 题目选择对话框
- 已选题目列表
- 题目分值设置
- 题目顺序管理

#### 使用流程

1. 进入"教师管理" → "题库管理"
2. 创建题目或从题库选择
3. 进入"作业管理" → 创建/编辑作业
4. 点击"添加题目"按钮
5. 从题库中选择题目
6. 设置每道题的分值
7. 保存并发布作业

---

### 6. 学生端集成 (`MyClassesView.vue`)

#### 新增功能

**班级详情增强**
- 作业列表展示
- 作业状态标记（未提交/已提交/已批改）
- 开始答题按钮
- 查看提交按钮

**答题流程**
1. 进入"我的班级"
2. 点击班级卡片查看详情
3. 查看作业列表
4. 点击"开始答题"按钮
5. 完成答题并提交
6. 查看提交状态

---

## 三、使用场景示例

### 场景 1：教师创建题目

1. **进入题库管理**
   - 教师登录 → 教师管理 → 题库管理

2. **创建单选题**
   ```
   标题：三角函数基本概念
   类型：单选题
   内容：下列哪个是正弦函数的周期？
   选项：
     A. π (错误)
     B. 2π (正确) ✓
     C. 3π (错误)
     D. 4π (错误)
   解析：正弦函数 y = sin(x) 的周期为 2π
   难度：简单
   标签：三角函数, 基础概念
   ```

3. **保存题目**
   - 系统自动保存到教师的题库
   - 可选择是否公开到公共题库

### 场景 2：教师创建作业并添加题目

1. **创建作业**
   ```
   标题：第一章测验
   班级：高一(1)班
   类型：测验
   难度：中等
   截止时间：2025-11-01 23:59
   总分：100
   及格分：60
   ```

2. **添加题目**
   - 点击"添加题目"按钮
   - 从题库中选择5道题目
   - 设置每道题的分值：
     - 题目1（单选）：10分
     - 题目2（多选）：15分
     - 题目3（判断）：10分
     - 题目4（简答）：25分
     - 题目5（论述）：40分

3. **发布作业**
   - 点击"发布"按钮
   - 系统自动向班级学生发送通知

### 场景 3：学生答题

1. **接收通知**
   - 学生登录后看到作业通知
   - 点击通知或进入"我的班级"

2. **开始答题**
   ```
   题目1: [单选题] 10分
   请选择正确答案...
   ○ A. 选项A
   ○ B. 选项B
   ○ C. 选项C
   ● D. 选项D  ← 学生选择
   
   题目2: [多选题] 15分
   请选择所有正确答案...
   ☑ A. 选项A  ← 学生选择
   ☐ B. 选项B
   ☑ C. 选项C  ← 学生选择
   ☐ D. 选项D
   
   题目3: [判断题] 10分
   ○ 正确
   ● 错误  ← 学生选择
   
   题目4: [简答题] 25分
   [文本输入框]
   学生输入：这是我的答案...
   
   题目5: [论述题] 40分
   [大文本输入框]
   学生输入：详细阐述我的观点...
   ```

3. **提交作业**
   - 系统显示答题进度：已答 5/5 题
   - 点击"提交答卷"按钮
   - 确认提交
   - 作业状态变为"已提交"

---

## 四、技术特点

### 1. 数据安全

**权限控制**
- ✅ 教师只能管理自己创建的题目
- ✅ 学生无法查看题目答案
- ✅ API 级别的权限验证

**答案保护**
```javascript
// 学生端 API 请求
GET /api/question/batch
→ 返回不含答案的题目

// 教师端 API 请求
GET /api/question/:id
→ 返回完整题目（含答案）
```

### 2. 性能优化

**数据库索引**
- 教师ID + 题型 复合索引
- 难度、标签、公开状态 单字段索引
- 支持高效的筛选查询

**分页加载**
- 默认每页20条
- 支持自定义页码和每页数量
- 减少单次数据传输量

**批量操作**
- 批量获取题目（POST /api/question/batch）
- 一次请求获取作业的所有题目
- 减少网络请求次数

### 3. 用户体验

**直观的UI设计**
- 不同题型使用不同颜色标签
- 难度用不同颜色区分
- 已答题目高亮显示
- 进度条实时更新

**智能提示**
- 未答完题目提示
- 删除题目确认
- 提交作业确认
- 操作结果反馈

**响应式设计**
- 移动端全屏答题
- 自适应布局
- 触控友好交互

### 4. 扩展性

**题型扩展**
```typescript
// 添加新题型只需：
// 1. 在 Question 模型中添加类型
type: 'single' | 'multiple' | 'truefalse' | 'short' | 'essay' | 'fill' | 'matching'

// 2. 在前端组件中添加对应UI
```

**题目导入导出**
```javascript
// 预留接口（未来可实现）
POST /api/question/import  // 批量导入
GET /api/question/export   // 批量导出
```

**AI 生成题目**
```javascript
// 预留接口（未来可实现）
POST /api/question/ai-generate
// 基于知识点自动生成题目
```

---

## 五、数据流程

### 创建题目流程

```
教师创建题目
     ↓
QuestionEditor 组件
     ↓
POST /api/question
     ↓
Question 模型保存
     ↓
返回题目ID
     ↓
QuestionBank 刷新列表
```

### 创建作业流程

```
教师创建作业
     ↓
打开题目选择器
     ↓
QuestionBank (选择模式)
     ↓
选择题目并设置分值
     ↓
保存到 assignmentForm.questions
     ↓
POST /api/assignment
     ↓
Assignment 模型保存
     ↓
发布作业 → 发送通知
```

### 学生答题流程

```
学生打开作业
     ↓
AnswerSheet 组件加载
     ↓
POST /api/question/batch
     ↓
获取题目（不含答案）
     ↓
学生答题
     ↓
点击提交
     ↓
POST /api/assignment/:id/submit
     ↓
保存到 assignment.submissions
     ↓
返回提交成功
```

---

## 六、统计数据

### 题目统计

```javascript
{
  totalQuestions: 100,      // 总题目数
  byType: {
    single: 40,            // 单选题
    multiple: 25,          // 多选题
    truefalse: 15,         // 判断题
    short: 15,             // 简答题
    essay: 5               // 论述题
  },
  byDifficulty: {
    easy: 30,              // 简单
    medium: 50,            // 中等
    hard: 20               // 困难
  },
  publicCount: 20,          // 公开题目数
  avgUsageCount: 5.2        // 平均使用次数
}
```

### 作业统计

```javascript
{
  assignmentId: '...',
  totalStudents: 30,        // 班级总人数
  submitted: 25,            // 已提交人数
  pending: 5,               // 未提交人数
  avgScore: 82.5,           // 平均分
  questionStats: [
    {
      questionId: '...',
      correctRate: 0.85,    // 正确率
      avgTime: 120          // 平均答题时间（秒）
    }
  ]
}
```

---

## 七、后续优化建议

### 功能增强

1. **题目导入导出**
   - 支持 Excel 批量导入
   - 支持导出为 Word/PDF

2. **AI 辅助**
   - AI 自动生成题目
   - AI 批改简答题/论述题
   - AI 生成题目解析

3. **题目库增强**
   - 题目版本管理
   - 题目使用记录
   - 题目难度智能评估

4. **答题增强**
   - 限时答题（倒计时）
   - 随机题目顺序
   - 随机选项顺序
   - 答题过程自动保存

5. **统计分析**
   - 题目正确率分析
   - 学生答题时间分析
   - 知识点掌握度分析

### 性能优化

1. **缓存机制**
   - 题目内容缓存
   - 查询结果缓存

2. **加载优化**
   - 图片懒加载
   - 题目预加载

3. **搜索优化**
   - 全文搜索（Elasticsearch）
   - 搜索结果高亮

---

## 八、文件清单

### 后端文件

- `backend/src/models/Question.ts` - 题目数据模型
- `backend/src/routes/question.ts` - 题目API路由
- `backend/src/index.ts` - 路由注册

### 前端文件

- `frontend/src/components/QuestionEditor.vue` - 题目编辑器
- `frontend/src/components/QuestionBank.vue` - 题库管理
- `frontend/src/components/QuestionView.vue` - 题目查看
- `frontend/src/components/AnswerSheet.vue` - 答题组件
- `frontend/src/views/TeacherView.vue` - 教师端集成
- `frontend/src/views/MyClassesView.vue` - 学生端集成

### 文档文件

- `docs/QUESTION_MANAGEMENT_SYSTEM.md` - 本文档

---

## 九、测试清单

### 教师端测试

- [ ] 创建各种类型的题目
- [ ] 编辑已有题目
- [ ] 删除未使用的题目
- [ ] 搜索和筛选题目
- [ ] 设置题目为公开
- [ ] 从公开题库复制题目
- [ ] 创建作业并添加题目
- [ ] 设置题目分值
- [ ] 调整题目顺序
- [ ] 发布包含题目的作业

### 学生端测试

- [ ] 查看作业列表
- [ ] 开始答题
- [ ] 答单选题
- [ ] 答多选题
- [ ] 答判断题
- [ ] 答简答题
- [ ] 答论述题
- [ ] 查看答题进度
- [ ] 提交作业
- [ ] 查看提交状态

### 边界测试

- [ ] 创建无题目的作业（应失败）
- [ ] 删除已使用的题目（应失败）
- [ ] 学生查看题目答案（应隐藏）
- [ ] 教师查看其他教师的题目（应限制）
- [ ] 超长题目内容处理
- [ ] 大量题目的性能测试

---

## 十、总结

本次更新实现了完整的题目管理系统，为智学伴平台的作业功能提供了强大的支持。系统具有以下特点：

✅ **功能完善**
- 支持5种常见题型
- 完整的CRUD操作
- 教师和学生端分离

✅ **用户友好**
- 直观的可视化编辑器
- 流畅的答题体验
- 清晰的状态反馈

✅ **技术先进**
- 安全的权限控制
- 高效的数据查询
- 响应式UI设计

✅ **易于扩展**
- 模块化设计
- 灵活的数据结构
- 预留扩展接口

这套系统为平台的教学功能奠定了坚实的基础，未来可以在此基础上继续扩展更多高级功能。


# 智学伴 (IntelliBuddy) - 快速启动指南

## 🎉 新功能已完成！

本次更新完成了以下核心功能：
- ✅ **错题本系统** - AI 驱动的错题分析
- ✅ **学习时长统计** - 精确的学习追踪
- ✅ **代码解释器** - AI 代码教学工具
- ✅ **热力图数据** - 真实学习活跃度

---

## 🚀 启动步骤

### 1. 后端启动

```bash
cd backend

# 安装依赖（如果还没安装）
npm install

# 确保环境变量配置正确
# 编辑 backend/.env 文件

# 启动后端服务
npm run dev
```

后端将运行在：`http://localhost:5001`

### 2. 前端启动

```bash
cd ../

# 安装依赖（如果还没安装）
npm install

# 启动前端开发服务器
npm run dev
```

前端将运行在：`http://localhost:5173` (或其他 Vite 分配的端口)

---

## ⚙️ 环境变量配置

### 后端 `backend/.env`

```env
# MongoDB 数据库连接
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/intellibuddy

# JWT 密钥
JWT_SECRET=your-super-secret-jwt-key

# Kimi AI API
KIMI_API_KEY=your-kimi-api-key
KIMI_API_ENDPOINT=https://api.moonshot.cn/v1/chat/completions

# 前端 URL（用于 OAuth 回调）
FRONTEND_URL=http://localhost:5173

# GitHub OAuth (可选)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# QQ OAuth (可选)
QQ_APP_ID=your-qq-app-id
QQ_APP_KEY=your-qq-app-key

# 端口
PORT=5001
```

### 前端 `.env`

```env
# 后端 API 地址
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## 🧪 功能测试

### 1. 错题本系统

1. 登录账号
2. 进入任意知识点学习页面
3. 点击"开始测验"
4. **故意答错**几道题
5. 提交测验后，点击导航栏的"错题本"
6. 查看错题列表
7. 点击"生成 AI 深度解析"按钮
8. 查看 AI 生成的详细解析
9. 测试"标记为已掌握"功能
10. 使用筛选器（全部/已掌握/未掌握）

### 2. 学习时长统计

1. 进入任意知识点学习页面
2. 注意页面头部的**实时计时器**（应该开始计时）
3. 停留一段时间（如 2-3 分钟）
4. 返回仪表盘
5. 查看"总学习时长"是否更新
6. 进入"我的档案"
7. 查看学习热力图是否有新数据

### 3. 代码解释器

1. 点击导航栏的"代码解释器"
2. 粘贴以下测试代码：

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

3. 选择语言为 Python
4. 点击"解释代码"
5. 等待 AI 生成解释（约 10-30 秒）
6. 查看详细的代码解释

---

## 📊 数据验证

### 检查 MongoDB 集合

使用 MongoDB Compass 或命令行连接数据库，检查新集合：

```javascript
// 1. 错题集合
use intellibuddy
db.wrongquestions.find().pretty()

// 2. 学习会话集合
db.studysessions.find().pretty()

// 3. 查看统计
db.wrongquestions.aggregate([
  { $group: { _id: "$userId", count: { $sum: 1 } } }
])

db.studysessions.aggregate([
  { $group: { _id: "$userId", totalDuration: { $sum: "$duration" } } }
])
```

---

## 🐛 常见问题

### 1. 错题本页面显示为空

**原因**：还没有答错题目  
**解决**：去做测验并故意答错几题

### 2. 学习时长显示 "0小时 0分钟"

**原因**：还没有学习记录或后端未正确记录  
**解决**：
- 检查后端控制台是否有错误
- 确认进入学习页面时计时器是否启动
- 查看浏览器控制台的网络请求

### 3. 代码解释器加载很慢

**原因**：AI API 响应时间较长  
**解决**：这是正常现象，AI 生成需要 10-30 秒，请耐心等待

### 4. AI 解析失败

**可能原因**：
- Kimi API Key 未配置或无效
- API 额度不足
- 网络连接问题

**解决**：
- 检查 `backend/.env` 中的 `KIMI_API_KEY`
- 查看后端控制台错误信息
- 检查 Kimi API 账户额度

---

## 📝 数据库迁移

如果从旧版本升级，新集合会自动创建。但建议运行以下命令确保索引创建：

```javascript
// MongoDB Shell
use intellibuddy

// 为错题集合创建索引
db.wrongquestions.createIndex({ userId: 1, pointId: 1 })
db.wrongquestions.createIndex({ userId: 1, mastered: 1 })
db.wrongquestions.createIndex({ userId: 1, subject: 1 })

// 为学习会话集合创建索引
db.studysessions.createIndex({ userId: 1, startTime: -1 })
db.studysessions.createIndex({ userId: 1, pointId: 1 })
```

---

## 🎨 新增页面路由

- `/app/wrong-questions` - 错题本
- `/app/code-explainer` - 代码解释器

这两个页面已自动添加到导航栏。

---

## 📱 响应式支持

所有新功能都已适配移动端：
- 错题本支持手机浏览
- 代码解释器支持触摸操作
- 学习计时器在小屏幕上自动调整

---

## 🔥 性能优化建议

### 数据库
- 已添加必要的索引
- 使用 MongoDB Aggregation Pipeline 进行复杂查询

### 前端
- 错题列表使用虚拟滚动（如数据量大）
- AI 请求添加 loading 状态
- 图表组件按需加载

---

## 📖 API 文档

详细的 API 文档请参考 `IMPLEMENTATION_SUMMARY.md`

---

## 🎯 下一步

完成测试后，可以考虑：

1. **内容扩充**：添加更多学科的学习资料
2. **UI 优化**：实现 Toast 通知、精美模态框
3. **部署上线**：配置生产环境并部署

---

## 💡 提示

- 错题本的 AI 解析功能需要消耗 Kimi API 额度，建议控制使用频率
- 学习计时器在页面刷新时会重新开始，这是设计行为
- 热力图数据每天只会记录一次（最高强度）

---

## 🤝 反馈

如遇到问题或有建议，请记录：
- 操作步骤
- 错误信息
- 浏览器控制台日志
- 后端控制台日志

祝使用愉快！🎉


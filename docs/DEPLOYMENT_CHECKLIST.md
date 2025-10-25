# 智学伴 - 部署检查清单

## 🎯 部署前准备（必须完成）

### 1. 账号准备

- [ ] MongoDB Atlas 免费账号已注册
  - 访问: https://www.mongodb.com/cloud/atlas
  - 创建 M0 Sandbox 免费集群
  - 创建数据库用户（用户名 + 密码）
  - 配置网络访问：0.0.0.0/0（允许所有IP）
  - 获取连接字符串

- [ ] Vercel 账号已注册
  - 访问: https://vercel.com
  - 使用 GitHub 账号登录（推荐）

- [ ] AI API 密钥已获取（至少1个）
  - [ ] Kimi API（推荐）: https://platform.moonshot.cn
  - [ ] 通义千问 API: https://dashscope.aliyun.com
  - [ ] 智谱 AI API: https://open.bigmodel.cn
  - [ ] 文心一言 API: https://cloud.baidu.com/product/wenxinworkshop

### 2. 代码准备

- [ ] 代码已推送到 GitHub
  - 仓库设置为 Public 或 Private（Vercel 都支持）
  - 确保 `.env` 文件在 `.gitignore` 中（不要上传密钥）

- [ ] 环境配置文件检查
  - [ ] `vercel.json` 已正确配置
  - [ ] `backend/.env.example` 已更新
  - [ ] `frontend/vite.config.ts` 生产环境配置正确

---

## 📦 部署步骤

### 阶段 1: 本地验证（预计 30 分钟）

- [ ] 本地环境测试通过
  ```bash
  # 前端测试
  cd frontend
  pnpm install
  pnpm run build  # 确保构建成功
  
  # 后端测试
  cd ../backend
  pnpm install
  pnpm run build  # 确保构建成功
  ```

- [ ] 本地数据库连接测试
  ```bash
  # 测试 MongoDB 连接
  cd backend
  # 在 .env 中配置 MONGO_URI
  pnpm run db:indexes  # 运行索引创建脚本
  ```

### 阶段 2: Vercel 部署配置（预计 20 分钟）

#### Step 1: 导入项目

- [ ] 登录 Vercel
- [ ] 点击 "New Project"
- [ ] Import GitHub 仓库
- [ ] 选择 `intellibuddy` 仓库

#### Step 2: 配置构建设置

Vercel 应该自动检测到 Vite 项目，但请确认：

- [ ] Framework Preset: `Vite`
- [ ] Build Command: `pnpm -w run vercel-build`（如果有）或使用默认
- [ ] Output Directory: `frontend/dist`
- [ ] Install Command: `pnpm install`

#### Step 3: 配置环境变量

在 Vercel 项目设置 → Environment Variables 中添加：

**基础配置（必需）**

- [ ] `NODE_ENV` = `production`
- [ ] `MONGO_URI` = `mongodb+srv://...`（您的 MongoDB 连接串）
- [ ] `JWT_SECRET` = `<强随机字符串>`（使用下方命令生成）
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] `FRONTEND_URL` = `https://your-project.vercel.app`（部署后更新）
- [ ] `BACKEND_URL` = `https://your-project.vercel.app`
- [ ] `TRUST_PROXY` = `true`

**AI 配置（至少1个）**

- [ ] `PRIMARY_AI_MODEL` = `kimi`（或您选择的主模型）
- [ ] `KIMI_API_KEY` = `sk-...`
- [ ] `QIANWEN_API_KEY` = `sk-...`（可选，作为备用）
- [ ] `ZHIPU_API_KEY` = `...`（可选）
- [ ] `ENABLE_AI_CACHE` = `true`（节省成本）

**OAuth配置（可选）**

- [ ] `GITHUB_CLIENT_ID` = `...`
- [ ] `GITHUB_CLIENT_SECRET` = `...`
- [ ] `GITHUB_CALLBACK_URL` = `https://your-project.vercel.app/api/auth/github/callback`
- [ ] `QQ_APP_ID` = `...`
- [ ] `QQ_APP_KEY` = `...`

⚠️ **重要**: 每个环境变量都要在 Production、Preview、Development 三个环境中配置！

#### Step 4: 部署

- [ ] 点击 "Deploy" 按钮
- [ ] 等待构建完成（约 3-5 分钟）
- [ ] 查看构建日志，确保无错误

### 阶段 3: 数据库初始化（预计 15 分钟）

部署成功后，需要初始化数据库：

#### 方法 1: 本地运行（推荐）

在本地连接到生产数据库，运行初始化脚本：

```bash
cd backend

# 1. 复制 .env 文件，配置生产环境数据库
cp .env .env.production
# 编辑 .env.production，使用生产数据库的 MONGO_URI

# 2. 创建数据库索引
export $(cat .env.production | xargs) && pnpm run db:indexes

# 3. 导入知识点数据
export $(cat .env.production | xargs) && pnpm run seed:all

# 4. 导入题库数据
export $(cat .env.production | xargs) && pnpm run quiz:import

# 5. 创建演示账号
export $(cat .env.production | xargs) && pnpm run demo:create
```

- [ ] 索引创建成功
- [ ] 知识点数据导入成功
- [ ] 题库数据导入成功
- [ ] 演示账号创建成功

#### 方法 2: MongoDB Compass（可视化工具）

- [ ] 下载 MongoDB Compass: https://www.mongodb.com/try/download/compass
- [ ] 使用连接字符串连接到 Atlas
- [ ] 查看数据是否正确导入

### 阶段 4: 部署验证（预计 20 分钟）

#### 基本功能测试

访问部署的 URL（如 `https://your-project.vercel.app`）

- [ ] 首页正常加载
- [ ] 登录页面正常显示
- [ ] 注册功能正常（创建测试账号）
- [ ] 登录功能正常

#### 核心功能测试

使用演示账号登录（见下方测试账号）

- [ ] 知识图谱正常显示
- [ ] 点击知识点可以进入学习页面
- [ ] 学习页面内容正常渲染（Markdown、公式、代码高亮）
- [ ] AI 助教可以正常对话
- [ ] 测验功能正常
- [ ] 错题本正常显示
- [ ] 成就系统正常
- [ ] 数据看板图表正常显示

#### 性能测试

- [ ] 首屏加载时间 < 3 秒
  - 使用 Chrome DevTools → Network → Disable cache
  - 刷新页面，查看 Load 时间
  
- [ ] Lighthouse 评分
  - Chrome DevTools → Lighthouse
  - 生成报告
  - Performance > 80 分
  - Accessibility > 90 分

#### 移动端测试

- [ ] Chrome DevTools → 设备模拟
  - iPhone 12 Pro
  - iPad Air
- [ ] 页面正常显示，无错位
- [ ] 所有功能可正常操作

#### 浏览器兼容性

- [ ] Chrome（主要）
- [ ] Firefox
- [ ] Safari（如有 Mac）
- [ ] Edge

---

## 🧪 测试账号

部署后，使用以下演示账号测试：

| 账号 | 用户名 | 密码 | 用途 |
|------|--------|------|------|
| 演示账号1 | demo_student | Demo2025 | 普通学生，已完成部分学习 |
| 演示账号2 | demo_advanced | Demo2025 | 高级用户，大量数据和成就 |
| 演示账号3 | demo_new | Demo2025 | 全新账号，展示新手流程 |

---

## ⚠️ 常见问题排查

### 问题 1: 部署后显示 "Internal Server Error"

**可能原因**:
- MongoDB 连接失败
- 环境变量配置错误

**解决方法**:
1. 查看 Vercel 部署日志
2. 检查环境变量是否正确配置
3. 测试 MongoDB 连接字符串（使用 MongoDB Compass）
4. 确保 MongoDB Atlas IP 白名单包含 0.0.0.0/0

### 问题 2: AI 对话无响应

**可能原因**:
- AI API Key 无效
- AI 服务余额不足
- 网络请求超时

**解决方法**:
1. 检查 AI API Key 是否正确
2. 登录 AI 服务商控制台检查余额
3. 检查 Vercel Function 日志
4. 尝试配置多个 AI 模型作为备用

### 问题 3: 前端无法访问后端 API

**可能原因**:
- CORS 配置问题
- vercel.json 路由配置错误

**解决方法**:
1. 检查 `vercel.json` 中的 rewrites 配置
2. 确保 `FRONTEND_URL` 环境变量正确
3. 查看浏览器 Console 的错误信息

### 问题 4: 图表不显示

**可能原因**:
- 数据未正确加载
- ECharts 初始化失败

**解决方法**:
1. 打开浏览器 Console 查看错误
2. 检查数据是否正确返回
3. 清除浏览器缓存后重试

---

## 📊 部署后监控

### Vercel Analytics

- [ ] 启用 Vercel Analytics（可选）
  - 项目设置 → Analytics
  - 查看访问量、性能数据

### MongoDB Atlas 监控

- [ ] 查看数据库使用情况
  - 存储使用量 < 512MB（免费层限制）
  - 连接数
  - 操作延迟

### AI API 使用监控

- [ ] 定期检查 AI API 余额
- [ ] 查看 API 调用次数
- [ ] 设置余额告警

---

## ✅ 最终检查清单

部署完成后，确认以下所有项目：

- [ ] 在线地址可访问
- [ ] 所有核心功能正常
- [ ] 演示账号可登录
- [ ] 性能达标（首屏 < 3s）
- [ ] 移动端适配良好
- [ ] 浏览器兼容性正常
- [ ] 无 Console 错误
- [ ] AI 对话正常
- [ ] 数据持久化正常

---

## 🎉 部署成功！

恭喜您完成部署！现在可以：

1. **记录部署信息**
   - 在线地址: `https://your-project.vercel.app`
   - 演示账号: 见上方测试账号表格
   - 部署时间: `____年__月__日`

2. **准备参赛材料**
   - 更新 `docs/CONTEST_SUBMISSION.md` 中的在线地址
   - 准备项目截图
   - 录制演示视频

3. **分享给他人**
   - 发送给同学试用
   - 收集用户反馈
   - 迭代改进

---

## 📞 需要帮助？

如遇到无法解决的问题：

- 查看 [部署指南](./DEPLOYMENT_GUIDE.md)
- 查看 [常见问题](./FAQ.md)
- 查看 Vercel 官方文档
- GitHub Issues

祝部署顺利！🚀


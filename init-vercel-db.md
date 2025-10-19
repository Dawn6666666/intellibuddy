# Vercel 部署后数据库初始化指南

## 方法一：本地初始化（推荐）

1. 在本地项目的 `.env` 文件中，将 MONGO_URI 改为你的生产数据库地址

2. 运行初始化脚本：

```bash
cd backend
pnpm seed:all
```

3. 导入题库数据：

```bash
pnpm quiz:import
```

## 方法二：使用 MongoDB Compass

1. 下载 MongoDB Compass
2. 连接到你的 MongoDB Atlas 集群
3. 手动导入 `quiz-templates` 目录中的 JSON 文件

## 验证部署

访问以下 URL 检查服务状态：

- 前端：`https://你的项目名.vercel.app`
- 后端健康检查：`https://你的项目名.vercel.app/api`
- 知识点接口：`https://你的项目名.vercel.app/api/knowledge-points`

## 常见问题

### 1. 502 Bad Gateway
- 检查环境变量是否都配置正确
- 检查 MONGO_URI 是否能连接

### 2. CORS 错误
- 确认 FRONTEND_URL 和 BACKEND_URL 配置正确
- 检查 ALLOWED_ORIGINS 环境变量

### 3. AI 功能不工作
- 确认至少配置了一个 AI 模型的 API Key
- 检查 API Key 是否有效

### 4. GitHub/QQ 登录失败
- 在 GitHub/QQ 开放平台配置回调地址
- 回调地址格式：`https://你的项目名.vercel.app/api/auth/github/callback`


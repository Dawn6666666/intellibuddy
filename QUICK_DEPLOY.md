# 🚀 快速部署到 Vercel

## 一键检查部署准备

```bash
node check-deployment.js
```

---

## 🎯 部署三步曲

### 1️⃣ 准备环境变量

在 Vercel 控制台配置以下环境变量：

```env
# 必需 - 基础配置
NODE_ENV=production
TRUST_PROXY=true

# 必需 - URL 配置（首次部署后更新）
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app

# 必需 - 数据库
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/intellibuddy

# 必需 - 安全
JWT_SECRET=生成的随机字符串

# 必需 - AI（至少一个）
KIMI_API_KEY=your-kimi-api-key
PRIMARY_AI_MODEL=kimi
ENABLE_AI_CACHE=true

# 可选 - OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
QQ_APP_ID=your-qq-app-id
QQ_APP_KEY=your-qq-app-key
```

### 2️⃣ 连接 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 导入你的 GitHub 仓库
3. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: 留空
   - **Build Command**: 自动（使用 vercel.json）
   - **Install Command**: 自动（使用 pnpm）

### 3️⃣ 部署并更新

1. 点击 Deploy 开始首次部署
2. 部署成功后，复制 URL
3. 更新环境变量中的 URL
4. Redeploy 重新部署

---

## 📋 环境变量获取方式

### MongoDB URI
1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建集群 → 获取连接字符串
3. 格式：`mongodb+srv://user:pass@cluster.mongodb.net/intellibuddy`

### JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Kimi AI Key
1. 访问 [Kimi 开放平台](https://platform.moonshot.cn/console/api-keys)
2. 注册并创建 API Key
3. 新用户有免费额度

### GitHub OAuth
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建 OAuth App
3. Callback URL: `https://your-app.vercel.app/api/auth/github/callback`

---

## ⚡ 常用命令

```bash
# 检查部署准备
node check-deployment.js

# 本地测试构建
pnpm build

# 本地预览构建结果
cd frontend && pnpm preview

# 查看前端构建产物
ls -la frontend/dist
```

---

## 🔍 部署验证

部署成功后访问以下端点：

- ✅ 首页: `https://your-app.vercel.app/`
- ✅ API 健康检查: `https://your-app.vercel.app/api`
- ✅ 登录页面: `https://your-app.vercel.app/login`

---

## 🛠️ 故障排查

### 构建失败
```bash
# 清理并重新安装依赖
pnpm clean
pnpm install
pnpm build
```

### API 404
- 检查 `vercel.json` 路由配置
- 确认环境变量已正确设置
- 查看 Vercel 部署日志

### MongoDB 连接失败
- 确认 IP 白名单设置为 `0.0.0.0/0`
- 检查 MONGO_URI 格式
- 验证用户名密码正确

---

## 📚 完整文档

详细步骤请参考：
- 📖 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - 完整部署指南
- 📝 [backend/env.example](./backend/env.example) - 环境变量说明

---

**祝部署顺利！🎉**


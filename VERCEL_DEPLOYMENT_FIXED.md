# 🚀 IntelliBuddy Vercel 部署指南（已修复）

## 📋 问题说明

之前的部署失败是因为 Vercel 找不到输出目录。现在已经修复了配置，采用以下架构：

### 新架构
```
intellibuddy/
├── frontend/dist/          # 前端静态文件（自动部署）
├── backend/dist/           # 后端编译文件
├── api/
│   ├── index.ts           # Vercel Serverless Function 入口
│   └── package.json       # API 配置
└── vercel.json            # Vercel 配置（已优化）
```

## ✅ 已完成的修复

### 1. **Vercel 配置优化** (`vercel.json`)
- ✅ 移除了复杂的 `builds` 配置
- ✅ 使用 `rewrites` 将 API 请求路由到 Serverless Function
- ✅ 正确设置 `outputDirectory` 为 `frontend/dist`
- ✅ 配置了缓存策略和安全头部

### 2. **Serverless Function 入口** (`api/index.ts`)
- ✅ 创建了 Vercel Serverless Function 适配器
- ✅ 将所有 `/api/*` 请求转发到 Express 应用
- ✅ 支持所有后端路由和中间件

### 3. **构建流程**
- ✅ 前端构建：`pnpm build:frontend` → `frontend/dist`
- ✅ 后端构建：`pnpm build:backend` → `backend/dist`
- ✅ 本地测试通过 ✨

## 🚀 部署步骤

### 步骤 1：推送代码到 GitHub

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "修复 Vercel 部署配置"

# 推送到 GitHub
git push origin main
```

### 步骤 2：在 Vercel 配置环境变量

访问 Vercel 项目设置，添加以下环境变量：

#### 必需的环境变量

```env
# 数据库
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/intellibuddy?retryWrites=true&w=majority

# JWT 密钥（生成方法见下方）
JWT_SECRET=your-super-secret-jwt-key-here

# AI API
KIMI_API_KEY=your-kimi-api-key

# URL 配置（部署后更新）
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.vercel.app

# 生产环境
NODE_ENV=production

# 代理配置
TRUST_PROXY=true

# CORS 配置
ALLOWED_ORIGINS=https://your-app.vercel.app
```

#### 生成 JWT Secret

```bash
# 在本地终端运行
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 步骤 3：部署

1. 在 Vercel 仪表板中点击 **"Deploy"**
2. 等待构建完成（约 2-3 分钟）
3. 获取部署 URL（如 `https://your-app.vercel.app`）
4. 更新环境变量中的 `FRONTEND_URL` 和 `BACKEND_URL`
5. 重新部署以应用新的 URL

### 步骤 4：验证部署

访问以下 URL 验证部署：

- **前端首页**: `https://your-app.vercel.app`
- **后端健康检查**: `https://your-app.vercel.app/api/`
- **API 测试**: `https://your-app.vercel.app/api/knowledge-points`

## 🔧 配置说明

### Vercel 配置文件 (`vercel.json`)

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "frontend/dist",
  "installCommand": "pnpm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index"
    },
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/index.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### API 入口文件 (`api/index.ts`)

```typescript
// Vercel Serverless Function 入口
const app = require('../backend/dist/index.js').default;

// 导出 Express 应用作为 Serverless Function
export default app;
```

## 📊 工作原理

### 请求路由流程

1. **静态文件请求** (如 `/`, `/assets/logo.png`)
   - → Vercel 直接从 `frontend/dist` 提供静态文件
   - → 使用 CDN 缓存，速度快

2. **API 请求** (如 `/api/auth/login`)
   - → Vercel 将请求路由到 `/api/index` Serverless Function
   - → Serverless Function 加载 Express 应用
   - → Express 处理请求并返回响应

3. **SPA 路由** (如 `/dashboard`, `/profile`)
   - → Vercel 返回 `index.html`
   - → Vue Router 处理客户端路由

### 优势

✅ **无服务器架构**: 自动扩展，按需付费
✅ **全球 CDN**: 静态文件快速加载
✅ **零配置 HTTPS**: 自动 SSL 证书
✅ **持续部署**: Git 推送自动部署
✅ **环境变量**: 安全的密钥管理

## 🐛 常见问题

### Q1: 部署后 API 返回 404

**原因**: 环境变量未配置或 Serverless Function 未正确加载

**解决方案**:
1. 检查 Vercel 环境变量是否正确配置
2. 查看 Vercel 部署日志
3. 确认 `backend/dist` 目录已生成

### Q2: 前端页面空白

**原因**: 前端构建失败或路由配置错误

**解决方案**:
1. 检查 `frontend/dist/index.html` 是否存在
2. 查看浏览器控制台错误
3. 确认 `VITE_API_BASE_URL` 环境变量

### Q3: MongoDB 连接失败

**原因**: MongoDB URI 配置错误或网络限制

**解决方案**:
1. 在 MongoDB Atlas 中添加 `0.0.0.0/0` 到 IP 白名单
2. 确认 `MONGO_URI` 格式正确
3. 测试数据库连接

### Q4: AI 功能不工作

**原因**: API 密钥未配置或配额用尽

**解决方案**:
1. 确认 `KIMI_API_KEY` 已配置
2. 检查 API 配额和限制
3. 查看后端日志中的 AI 请求错误

## 📈 性能优化建议

### 1. 代码分割
当前一些 chunk 超过 1MB，建议优化：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'markdown': ['markdown-it', 'katex'],
          'charts': ['echarts', 'vue-echarts']
        }
      }
    }
  }
});
```

### 2. 图片优化
`ai-chat-logo.png` (1.3MB) 建议压缩：

```bash
# 使用 tinypng 或其他工具压缩
# 或转换为 WebP 格式
```

### 3. 懒加载
对大型组件使用懒加载：

```typescript
// router/index.ts
const LearningView = () => import('../views/LearningView.vue');
```

## 🎯 下一步

1. ✅ 代码已修复并准备部署
2. ⏳ 推送到 GitHub
3. ⏳ 在 Vercel 配置环境变量
4. ⏳ 触发部署
5. ⏳ 验证功能

## 📞 需要帮助？

如果部署遇到问题：

1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 运行 `node check-deployment.js` 检查配置
4. 查看 `backend/env.example` 了解环境变量

---

**准备好了吗？** 🚀 让我们开始部署！


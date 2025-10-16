# 🚀 IntelliBuddy Vercel 部署总结

## 📋 概览

本项目已成功配置为可部署到 Vercel 的全栈应用。采用 Serverless 架构，前端静态文件通过 CDN 分发，后端 API 使用 Vercel Serverless Functions。

---

## 🏗️ 架构设计

### 部署架构

```
                          ┌─────────────────┐
                          │   Vercel CDN    │
                          └────────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
            ┌───────▼────────┐          ┌────────▼────────┐
            │  Static Files  │          │  API Functions  │
            │  (frontend/)   │          │  (api/index.ts) │
            └────────────────┘          └────────┬────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │  Express Backend  │
                                        │  (backend/dist/)  │
                                        └─────────┬─────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │  MongoDB Atlas    │
                                        │   (Database)      │
                                        └───────────────────┘
```

### 请求流程

1. **静态资源** (HTML, CSS, JS, 图片等)
   - 用户访问 `https://your-app.vercel.app/`
   - Vercel CDN 直接返回 `frontend/dist/index.html`
   - 浏览器加载静态资源

2. **API 请求** (`/api/*`)
   - 前端调用 `https://your-app.vercel.app/api/auth/login`
   - Vercel 路由到 `/api/index` Serverless Function
   - Serverless Function 加载 Express 应用
   - Express 处理请求并查询 MongoDB
   - 返回 JSON 响应

3. **客户端路由** (`/dashboard`, `/profile` 等)
   - Vercel 返回 `index.html`
   - Vue Router 处理前端路由

---

## 📁 关键文件

### 1. `vercel.json` - Vercel 配置

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
    }
  ]
}
```

**关键配置说明**:
- `outputDirectory`: 前端构建输出目录
- `rewrites`: 将 API 请求路由到 Serverless Function
- `buildCommand`: 执行构建的命令

### 2. `api/index.ts` - Serverless Function 入口

```typescript
const app = require('../backend/dist/index.js').default;
export default app;
```

**作用**:
- 作为 Vercel Serverless Function 的入口
- 导入并暴露 Express 应用
- 处理所有 `/api/*` 请求

### 3. `.vercelignore` - 忽略文件

排除不需要部署的文件，减小部署包大小：
- 源代码（已编译）
- 测试文件
- 文档
- 开发工具配置

### 4. 根目录 `package.json` - 构建脚本

```json
{
  "scripts": {
    "build": "pnpm build:frontend && pnpm build:backend",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build"
  }
}
```

---

## 🔧 配置要点

### 环境变量

| 变量名 | 用途 | 示例 | 必需 |
|--------|------|------|------|
| `MONGO_URI` | MongoDB 连接 | `mongodb+srv://...` | ✅ |
| `JWT_SECRET` | JWT 加密 | `64位随机字符串` | ✅ |
| `KIMI_API_KEY` | AI 功能 | `sk-xxxxx` | ✅ |
| `FRONTEND_URL` | 前端地址 | `https://app.vercel.app` | ✅ |
| `BACKEND_URL` | 后端地址 | `https://app.vercel.app` | ✅ |
| `NODE_ENV` | 环境标识 | `production` | ✅ |
| `TRUST_PROXY` | 代理设置 | `true` | ✅ |
| `ALLOWED_ORIGINS` | CORS | `https://app.vercel.app` | ✅ |

### MongoDB Atlas 配置

1. **IP 白名单**: 添加 `0.0.0.0/0` 允许 Vercel 访问
2. **数据库用户**: 创建具有读写权限的用户
3. **连接字符串**: 使用 `mongodb+srv://` 格式

### CORS 配置

后端已配置动态 CORS，支持：
- 开发环境: `http://localhost:5173`
- 生产环境: 从 `ALLOWED_ORIGINS` 环境变量读取

---

## 🚀 部署流程

### 一键部署（3步）

```bash
# 1. 推送代码
git add .
git commit -m "准备部署"
git push origin main

# 2. 在 Vercel 导入项目
# 访问 https://vercel.com 并导入仓库

# 3. 配置环境变量并部署
# 在 Vercel 项目设置中添加环境变量
```

### 详细步骤

1. **代码准备**
   ```bash
   # 检查配置
   node check-vercel-deployment.js
   ```

2. **推送到 Git**
   ```bash
   git push origin main
   ```

3. **Vercel 配置**
   - 导入 Git 仓库
   - Framework: "Other"
   - Build Command: `pnpm build`
   - Output Directory: `frontend/dist`

4. **环境变量**
   - 在 Settings → Environment Variables 添加所有必需变量

5. **部署**
   - 点击 Deploy
   - 等待构建完成

6. **更新 URL**
   - 获取实际部署 URL
   - 更新 `FRONTEND_URL` 和 `BACKEND_URL`
   - Redeploy

---

## ✅ 验证清单

### 部署前检查

- [x] ✅ `vercel.json` 配置正确
- [x] ✅ `api/index.ts` 已创建
- [x] ✅ 前端已构建 (`frontend/dist`)
- [x] ✅ 后端已构建 (`backend/dist`)
- [x] ✅ 环境变量已准备
- [x] ✅ MongoDB 已配置
- [x] ✅ Git 仓库已就绪

### 部署后验证

```bash
# 测试部署的 API
node test-deployed-api.js https://your-app.vercel.app
```

**手动测试**:
- [ ] 前端页面正常加载
- [ ] 用户注册/登录
- [ ] AI 对话功能
- [ ] 题目练习
- [ ] 错题本
- [ ] 知识图谱

---

## 📊 性能优化

### 已实现的优化

1. **代码分割**
   - Vue Router 懒加载
   - 动态导入组件

2. **静态资源**
   - Gzip 压缩
   - CDN 缓存
   - 浏览器缓存策略

3. **API 优化**
   - 数据库索引
   - 请求限流
   - 响应缓存

### 建议的优化

1. **进一步代码分割**
   ```typescript
   // vite.config.ts
   manualChunks: {
     'element-plus': ['element-plus'],
     'markdown': ['markdown-it', 'katex'],
     'charts': ['echarts']
   }
   ```

2. **图片优化**
   - 压缩大型图片（如 `ai-chat-logo.png` 1.3MB）
   - 使用 WebP 格式
   - 实现懒加载

3. **字体优化**
   - 字体子集化
   - 使用系统字体

---

## 🐛 故障排查

### 常见问题

#### 1. 部署失败 - "Output directory not found"

**原因**: 构建失败或配置错误

**解决**:
```bash
# 本地测试构建
pnpm build

# 检查输出目录
ls frontend/dist
```

#### 2. API 返回 404

**原因**: Serverless Function 配置错误

**解决**:
- 检查 `api/index.ts` 是否存在
- 查看 Vercel Functions 日志
- 确认 `vercel.json` 的 `rewrites` 配置

#### 3. MongoDB 连接超时

**原因**: IP 白名单限制

**解决**:
- MongoDB Atlas → Network Access
- 添加 `0.0.0.0/0`（允许所有 IP）

#### 4. CORS 错误

**原因**: 环境变量未正确配置

**解决**:
- 确认 `FRONTEND_URL` 和 `ALLOWED_ORIGINS` 正确
- 检查后端 CORS 中间件
- 清除浏览器缓存

#### 5. AI 功能失败

**原因**: API 密钥错误或配额用尽

**解决**:
- 验证 `KIMI_API_KEY` 正确
- 检查 API 配额
- 查看 Vercel Functions 日志

### 查看日志

**Vercel 控制台**:
1. 访问 https://vercel.com/dashboard
2. 选择你的项目
3. 查看:
   - **Deployments**: 构建日志
   - **Functions**: Serverless Function 日志
   - **Analytics**: 性能指标

**本地调试**:
```bash
# 查看前端日志
pnpm --filter frontend dev

# 查看后端日志
pnpm --filter backend dev
```

---

## 📈 监控和维护

### 性能监控

1. **Vercel Analytics**
   - 页面加载时间
   - Core Web Vitals
   - 地理分布

2. **MongoDB Atlas Monitoring**
   - 数据库性能
   - 查询分析
   - 存储使用

3. **自定义监控**
   - API 响应时间
   - 错误率
   - 用户活跃度

### 持续部署

**Git 工作流**:
```bash
# 开发分支
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature

# 合并到主分支自动部署
git checkout main
git merge feature/new-feature
git push origin main  # 自动触发部署
```

**环境管理**:
- **Preview**: 每个 PR 自动创建预览环境
- **Production**: `main` 分支自动部署到生产环境

---

## 🎯 下一步

### 立即行动

1. ✅ 运行检查脚本
   ```bash
   node check-vercel-deployment.js
   ```

2. ✅ 推送到 Git
   ```bash
   git push origin main
   ```

3. ✅ Vercel 部署
   - 访问 https://vercel.com
   - 导入仓库
   - 配置环境变量

4. ✅ 测试部署
   ```bash
   node test-deployed-api.js https://your-app.vercel.app
   ```

### 长期规划

- [ ] 配置自定义域名
- [ ] 实现 CI/CD 流程
- [ ] 添加自动化测试
- [ ] 设置监控告警
- [ ] 优化性能
- [ ] 实现备份策略

---

## 📚 相关文档

- 📖 [Vercel 部署修复指南](./VERCEL_DEPLOYMENT_FIXED.md) - 最新修复
- 📋 [部署清单](./DEPLOYMENT_CHECKLIST.md) - 交互式清单
- 🚀 [快速开始](./ReadMe.md) - 项目概述
- 📘 [后端 API 文档](./docs/API_REFERENCE.md) - API 参考

---

## 🙋 获取帮助

**Vercel 支持**:
- 文档: https://vercel.com/docs
- 社区: https://github.com/vercel/vercel/discussions
- 支持: support@vercel.com

**项目支持**:
- GitHub Issues: 提交问题
- 查看日志: Vercel Dashboard
- 测试工具: `check-vercel-deployment.js`, `test-deployed-api.js`

---

**最后更新**: 2025-10-16  
**版本**: 1.0.0  
**状态**: ✅ 已测试，准备部署

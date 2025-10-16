# ✅ Vercel 部署清单

## 🎯 部署前检查

### 1. 代码检查
- [x] ✅ 所有必需文件已创建
- [x] ✅ `vercel.json` 配置正确
- [x] ✅ `api/index.ts` Serverless 入口已创建
- [x] ✅ `.vercelignore` 已配置
- [x] ✅ 前端和后端已构建

运行检查脚本：
```bash
node check-vercel-deployment.js
```

### 2. 环境变量准备

#### 必需的环境变量（在 Vercel 中配置）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `MONGO_URI` | MongoDB 连接字符串 | `mongodb+srv://user:pass@cluster.mongodb.net/intellibuddy` |
| `JWT_SECRET` | JWT 加密密钥（64位随机字符串） | 使用命令生成（见下方） |
| `KIMI_API_KEY` | AI API 密钥 | `sk-xxxxx` |
| `FRONTEND_URL` | 前端 URL | `https://your-app.vercel.app` |
| `BACKEND_URL` | 后端 URL | `https://your-app.vercel.app` |
| `NODE_ENV` | 环境 | `production` |
| `TRUST_PROXY` | 代理设置 | `true` |
| `ALLOWED_ORIGINS` | 允许的来源 | `https://your-app.vercel.app` |

#### 生成 JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. MongoDB 配置

- [ ] MongoDB Atlas 账号已创建
- [ ] 数据库集群已创建
- [ ] 数据库用户已创建
- [ ] IP 白名单已添加 `0.0.0.0/0`（允许 Vercel 访问）
- [ ] 连接字符串已获取

### 4. Git 仓库

- [ ] 代码已推送到 GitHub/GitLab/Bitbucket
- [ ] 仓库是 public 或已授权 Vercel 访问

---

## 🚀 部署步骤

### Step 1: 推送代码

```bash
# 添加所有更改
git add .

# 提交
git commit -m "准备部署到 Vercel"

# 推送到远程仓库
git push origin main
```

### Step 2: 导入到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 登录/注册账号
3. 点击 **"New Project"**
4. 选择你的 Git 仓库
5. Framework Preset: 选择 **"Other"**
6. Root Directory: 留空（使用根目录）
7. Build Command: 使用默认 `pnpm build`
8. Output Directory: 使用默认 `frontend/dist`
9. Install Command: 使用默认 `pnpm install`

### Step 3: 配置环境变量

在 Vercel 项目设置中：

1. 进入 **Settings** → **Environment Variables**
2. 添加上面表格中的所有环境变量
3. 注意：第一次部署时，`FRONTEND_URL` 和 `BACKEND_URL` 可以先设置为 `https://your-app.vercel.app`

### Step 4: 部署

1. 点击 **"Deploy"** 开始部署
2. 等待构建完成（约 2-5 分钟）
3. 获取部署 URL

### Step 5: 更新环境变量

1. 获取实际的部署 URL（如 `https://intellibuddy.vercel.app`）
2. 回到 **Settings** → **Environment Variables**
3. 更新 `FRONTEND_URL` 和 `BACKEND_URL` 为实际 URL
4. 更新 `ALLOWED_ORIGINS` 为实际 URL
5. 点击 **Redeploy** 重新部署

---

## ✅ 部署后验证

### 1. 前端检查

访问你的应用 URL（如 `https://intellibuddy.vercel.app`）

- [ ] 页面正常加载
- [ ] 样式正确显示
- [ ] 路由导航工作正常

### 2. 后端 API 检查

```bash
# 健康检查
curl https://your-app.vercel.app/api/

# 获取知识点
curl https://your-app.vercel.app/api/knowledge-points
```

预期响应：
- 健康检查：`{"status":"ok","message":"IntelliBuddy API is running"}`
- 知识点：返回 JSON 数组

### 3. 功能测试

- [ ] 用户注册/登录
- [ ] AI 对话功能
- [ ] 题库练习
- [ ] 知识图谱显示
- [ ] 错题本功能

### 4. 性能检查

使用 Chrome DevTools：

- [ ] 首屏加载 < 3秒
- [ ] API 响应 < 1秒
- [ ] 无 Console 错误

---

## 🔧 常见问题

### Q1: 部署失败 - "Output directory not found"

**原因**: 构建脚本问题或配置错误

**解决方案**:
1. 检查 `vercel.json` 中的 `outputDirectory` 是否为 `frontend/dist`
2. 检查根 `package.json` 中的 `build` 脚本
3. 查看 Vercel 构建日志

### Q2: API 返回 404

**原因**: Serverless Function 未正确配置

**解决方案**:
1. 确认 `api/index.ts` 文件存在
2. 检查 `vercel.json` 中的 `rewrites` 配置
3. 查看 Vercel Functions 日志

### Q3: MongoDB 连接失败

**原因**: IP 白名单或连接字符串错误

**解决方案**:
1. 在 MongoDB Atlas 添加 `0.0.0.0/0` 到白名单
2. 确认 `MONGO_URI` 格式正确
3. 检查数据库用户权限

### Q4: CORS 错误

**原因**: 环境变量配置错误

**解决方案**:
1. 确认 `FRONTEND_URL` 和 `ALLOWED_ORIGINS` 正确
2. 检查后端 CORS 配置
3. 清除浏览器缓存

### Q5: 构建超时

**原因**: 依赖安装或构建时间过长

**解决方案**:
1. 优化 `package.json` 依赖
2. 使用 `.vercelignore` 排除不必要的文件
3. 升级 Vercel 计划（如果需要）

---

## 📊 监控和维护

### 1. 查看日志

在 Vercel 项目面板：
- **Deployments** → 选择部署 → **View Logs**
- **Functions** → 查看 Serverless Function 日志
- **Analytics** → 查看性能指标

### 2. 设置告警

在 Vercel 项目设置：
- **Integrations** → 添加 Slack/Discord 通知
- 配置部署失败告警

### 3. 性能优化

- 启用 Vercel Analytics
- 使用 Vercel Speed Insights
- 监控 Core Web Vitals

### 4. 自动部署

配置自动部署：
- **Settings** → **Git** → **Production Branch**: `main`
- 推送到 `main` 分支自动部署

---

## 🎉 完成！

如果所有检查都通过，恭喜你成功部署了 IntelliBuddy！🎊

### 分享你的应用

- 应用 URL: `https://your-app.vercel.app`
- 可以在 Vercel 设置中配置自定义域名

### 需要帮助？

- 📖 查看 [VERCEL_DEPLOYMENT_FIXED.md](./VERCEL_DEPLOYMENT_FIXED.md)
- 📧 联系 Vercel 支持
- 🐛 查看 GitHub Issues

---

**最后更新**: 2025-01-16
**版本**: 1.0.0


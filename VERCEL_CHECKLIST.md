# ✅ Vercel 部署清单

## 在部署之前，请确认以下事项：

### 📦 代码准备
- [ ] 代码已提交到 Git 仓库
- [ ] 运行过 `node check-deployment.js` 并全部通过
- [ ] 本地测试过 `pnpm build` 构建成功

### 🗄️ 数据库准备
- [ ] 已创建 MongoDB Atlas 账号
- [ ] 已创建 MongoDB 集群（免费 M0 即可）
- [ ] 已配置网络访问为 0.0.0.0/0（允许所有IP）
- [ ] 已创建数据库用户并记录用户名和密码
- [ ] 已获取 MongoDB 连接字符串 (mongodb+srv://...)

### 🤖 AI 配置准备
- [ ] 已获取 Kimi API Key（或其他 AI 模型 Key）
- [ ] 已测试 API Key 可用性
- [ ] 已记录 API Key（准备配置到环境变量）

### 🔐 安全配置准备
- [ ] 已生成 JWT Secret（使用命令生成随机字符串）
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 🌐 Vercel 账号
- [ ] 已注册 Vercel 账号
- [ ] 已连接 GitHub/GitLab/Bitbucket 账号
- [ ] 已确认账号可以访问项目仓库

---

## 🚀 部署步骤

### 第一步：推送代码（如果还没有）
```bash
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

### 第二步：Vercel 导入
1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 选择你的仓库
4. 点击 "Import"

### 第三步：项目配置
- Framework Preset: **Other** 或留空
- Root Directory: 留空
- Build Command: 自动（使用 vercel.json）
- Output Directory: 自动（使用 vercel.json）
- Install Command: 自动（使用 pnpm）

### 第四步：环境变量配置

复制以下模板，填入你的实际值：

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/intellibuddy?retryWrites=true&w=majority
JWT_SECRET=YOUR_GENERATED_JWT_SECRET
KIMI_API_KEY=YOUR_KIMI_API_KEY
FRONTEND_URL=https://YOUR_PROJECT.vercel.app
BACKEND_URL=https://YOUR_PROJECT.vercel.app
TRUST_PROXY=true
ALLOWED_ORIGINS=https://YOUR_PROJECT.vercel.app
PRIMARY_AI_MODEL=kimi
ENABLE_AI_CACHE=true
```

**注意**: 第一次部署时，先用临时 URL，部署后再更新

### 第五步：开始部署
- 点击 "Deploy" 按钮
- 等待构建（约 3-5 分钟）
- 部署成功后记录 URL

### 第六步：更新环境变量
1. 复制部署后的 URL（如 https://intellibuddy-xxx.vercel.app）
2. 进入 Settings → Environment Variables
3. 更新以下变量：
   - `FRONTEND_URL` → 实际 URL
   - `BACKEND_URL` → 实际 URL
   - `ALLOWED_ORIGINS` → 实际 URL
4. 保存后重新部署（Deployments → Redeploy）

---

## ✅ 部署验证

部署成功后，测试以下功能：

### 基础功能
- [ ] 访问首页 `https://your-app.vercel.app/`
- [ ] 页面正常加载，无 404 错误
- [ ] 静态资源（图片、CSS、JS）正常加载

### API 功能
- [ ] 访问 `https://your-app.vercel.app/api/` 返回成功消息
- [ ] 尝试注册新用户
- [ ] 尝试登录

### AI 功能
- [ ] 测试 AI 聊天功能
- [ ] 验证 AI 回复正常

### 数据库功能
- [ ] 用户数据正常保存
- [ ] 学习进度正常记录
- [ ] 题库数据正常加载

---

## 🎯 可选配置

### GitHub OAuth（可选）
如果需要 GitHub 登录：

1. 访问 https://github.com/settings/developers
2. 创建新的 OAuth App
3. 设置回调 URL: `https://your-app.vercel.app/api/auth/github/callback`
4. 记录 Client ID 和 Client Secret
5. 在 Vercel 添加环境变量：
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```
6. 重新部署

### QQ 登录（可选）
如果需要 QQ 登录：

1. 访问 https://connect.qq.com/manage.html
2. 创建网站应用
3. 设置回调地址: `https://your-app.vercel.app/api/auth/qq/callback`
4. 记录 APP ID 和 APP KEY
5. 在 Vercel 添加环境变量：
   ```env
   QQ_APP_ID=your_app_id
   QQ_APP_KEY=your_app_key
   ```
6. 重新部署

### 自定义域名（可选）
1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的域名
3. 在域名提供商处添加 DNS 记录
4. 等待 DNS 生效
5. 更新环境变量中的 URL 为新域名
6. 重新部署

---

## 🛠️ 故障排查

### 构建失败
**症状**: Vercel 显示构建错误

**可能原因**:
- pnpm 配置问题
- 依赖安装失败
- TypeScript 编译错误

**解决方法**:
1. 本地运行 `pnpm build` 检查错误
2. 查看 Vercel 构建日志
3. 确认 `package.json` 中有 `"packageManager": "pnpm@8.15.0"`

### API 404
**症状**: 访问 `/api/xxx` 返回 404

**可能原因**:
- 路由配置错误
- 后端未正确部署

**解决方法**:
1. 检查 `vercel.json` 路由配置
2. 查看 Vercel 函数日志
3. 确认后端代码导出了 `export default app`

### MongoDB 连接失败
**症状**: 应用启动但无法连接数据库

**可能原因**:
- MONGO_URI 配置错误
- MongoDB IP 白名单未设置
- 用户名密码错误

**解决方法**:
1. 检查 MONGO_URI 格式是否正确
2. 在 MongoDB Atlas 设置网络访问为 0.0.0.0/0
3. 确认数据库用户名密码正确

### AI 功能不可用
**症状**: AI 聊天无响应

**可能原因**:
- API Key 未配置或无效
- API 额度用尽
- 网络问题

**解决方法**:
1. 检查 KIMI_API_KEY 是否配置
2. 登录 AI 平台查看使用情况
3. 查看 Vercel 函数日志

---

## 📚 相关文档

- 📖 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - 完整部署指南
- ⚡ [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 快速部署清单
- 📋 [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - 配置总结
- 🔧 [backend/env.example](./backend/env.example) - 环境变量详细说明

---

## 💡 部署前自检

运行以下命令进行自动检查：

```bash
node check-deployment.js
```

如果显示：
```
✅ 恭喜！项目配置检查通过，可以部署到 Vercel！
```

说明你已经准备好了！🎉

---

**祝部署顺利！如有问题，请参考完整部署指南。**


# ⚡ IntelliBuddy 快速部署参考

> 5 分钟部署到 Vercel！

## 📋 预检查

```bash
node check-vercel-deployment.js
```

应该看到 ✅ 所有检查通过！

---

## 🚀 三步部署

### Step 1: 推送代码

```bash
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

### Step 2: Vercel 导入

1. 访问 https://vercel.com
2. 点击 **"New Project"**
3. 导入你的 Git 仓库
4. Framework: **"Other"**
5. 点击 **"Deploy"**

### Step 3: 配置环境变量

在 Vercel 项目 → **Settings** → **Environment Variables** 添加：

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/intellibuddy
JWT_SECRET=<运行下面的命令生成>
KIMI_API_KEY=sk-your-api-key
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.vercel.app
NODE_ENV=production
TRUST_PROXY=true
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**生成 JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

配置完成后点击 **"Redeploy"**

---

## ✅ 验证部署

```bash
node test-deployed-api.js https://your-app.vercel.app
```

访问你的应用测试功能：
- 用户注册/登录
- AI 对话
- 题目练习
- 错题本

---

## 📖 详细文档

- [部署修复指南](./VERCEL_DEPLOYMENT_FIXED.md) - 完整说明
- [部署总结](./DEPLOYMENT_SUMMARY.md) - 架构和配置
- [部署清单](./DEPLOYMENT_CHECKLIST.md) - 详细检查清单

---

## 🐛 遇到问题？

### API 返回 404
检查 `api/index.ts` 和 `vercel.json` 配置

### MongoDB 连接失败
在 MongoDB Atlas 添加 `0.0.0.0/0` 到 IP 白名单

### CORS 错误
确认 `FRONTEND_URL` 和 `ALLOWED_ORIGINS` 正确

### 查看日志
Vercel Dashboard → 项目 → Functions

---

**准备好了吗？开始部署！** 🚀

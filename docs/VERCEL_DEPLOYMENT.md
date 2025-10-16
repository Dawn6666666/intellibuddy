# Vercel 部署详细指南

## 📋 前提条件

1. ✅ GitHub 账号
2. ✅ Vercel 账号（使用 GitHub 登录）
3. ✅ 代码已推送到 GitHub 仓库
4. ✅ 已配置 MongoDB Atlas
5. ✅ 已获取 AI 模型 API Key

---

## 🚀 一键部署按钮（可选）

将以下 Markdown 添加到你的 README.md：

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/intellibuddy)
```

---

## 📝 手动部署步骤

### 第一步：导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"New Project"**
3. 选择 **"Import Git Repository"**
4. 从列表中选择你的 `intellibuddy` 仓库
   - 如果看不到，点击 **"Adjust GitHub App Permissions"** 授权访问

### 第二步：配置项目设置

Vercel 会自动检测项目类型，但你需要确认以下设置：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | **Vite** |
| Root Directory | `.` (项目根目录) |
| Build Command | `pnpm build` 或 `pnpm run build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |

> ⚠️ **重要**：确保 Vercel 使用 pnpm 而不是 npm/yarn

### 第三步：配置环境变量

在 **Environment Variables** 部分添加以下变量：

#### 必需的环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 运行环境 |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas 连接串 |
| `JWT_SECRET` | `[强随机字符串]` | JWT 签名密钥（32位以上）|
| `FRONTEND_URL` | `https://your-project.vercel.app` | 前端 URL（部署后自动分配）|
| `BACKEND_URL` | `https://your-project.vercel.app` | 后端 URL（与前端相同）|
| `KIMI_API_KEY` | `sk-...` | Kimi AI 的 API Key |

#### 推荐的可选变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PRIMARY_AI_MODEL` | `kimi` | 主 AI 模型 |
| `ENABLE_AI_CACHE` | `true` | 开启 AI 缓存 |
| `TRUST_PROXY` | `true` | 信任代理（Vercel 必需）|
| `QIANWEN_API_KEY` | `sk-...` | 通义千问备用 |
| `ZHIPU_API_KEY` | `...` | 智谱 AI 备用 |

> 💡 **提示**：
> - 所有环境变量都要在 **Production**、**Preview** 和 **Development** 三个环境中配置
> - `FRONTEND_URL` 和 `BACKEND_URL` 第一次部署时可以先留空，部署成功后获取 Vercel 分配的域名，再回来填写并重新部署

#### 如何生成 JWT_SECRET：

```bash
# 方法1：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 方法2：使用 OpenSSL
openssl rand -hex 32

# 方法3：在线生成
# 访问 https://randomkeygen.com/
```

### 第四步：部署

1. 点击 **"Deploy"**
2. 等待构建和部署完成（约 2-5 分钟）
3. 部署成功后，Vercel 会显示：
   - ✅ 项目域名（如 `https://intellibuddy-abc123.vercel.app`）
   - ✅ 部署状态
   - ✅ 构建日志

### 第五步：更新环境变量中的 URL

1. 复制 Vercel 分配的域名（如 `https://intellibuddy-abc123.vercel.app`）
2. 返回 **Settings** → **Environment Variables**
3. 更新以下变量：
   - `FRONTEND_URL` = `https://intellibuddy-abc123.vercel.app`
   - `BACKEND_URL` = `https://intellibuddy-abc123.vercel.app`
4. 保存后，点击 **Deployments** → 最新部署 → **"..."** → **"Redeploy"**

### 第六步：验证部署

1. 访问你的 Vercel 域名
2. 检查首页是否正常加载
3. 尝试注册/登录
4. 测试 AI 对话功能
5. 检查浏览器控制台是否有错误

---

## 🔧 常见问题排查

### 问题1：部署失败 - "Error: Command failed: pnpm build"

**原因**：构建命令错误或依赖安装失败

**解决方案**：
1. 检查 `package.json` 中的 `build` 脚本是否正确
2. 确保 Vercel 使用 pnpm（不是 npm/yarn）
3. 查看构建日志，找到具体错误原因
4. 本地运行 `pnpm build` 测试是否成功

### 问题2：部署成功但页面空白

**原因**：前端路由配置或 `vercel.json` 配置问题

**解决方案**：
1. 检查 `vercel.json` 文件中的 `routes` 配置
2. 确保有 SPA 回退规则：`{"src": "/(.*)", "dest": "/index.html"}`
3. 检查浏览器控制台的错误信息

### 问题3：API 404 错误

**原因**：后端路由配置错误

**解决方案**：
1. 检查 `vercel.json` 中的 API 路由：
   ```json
   {
     "src": "/api/(.*)",
     "dest": "backend/src/index.ts"
   }
   ```
2. 确认后端入口文件路径正确
3. 检查后端日志（Vercel Dashboard → Functions → Logs）

### 问题4：数据库连接失败

**原因**：MongoDB Atlas 白名单未配置

**解决方案**：
1. 登录 MongoDB Atlas
2. Network Access → Add IP Address
3. 选择 "Allow Access from Anywhere" (`0.0.0.0/0`)
4. 等待生效（约 1 分钟）
5. 重新部署

### 问题5：AI 功能不可用

**原因**：AI API Key 未配置或无效

**解决方案**：
1. 检查环境变量 `KIMI_API_KEY` 是否正确
2. 访问 AI 服务商控制台确认 Key 有效
3. 查看后端日志确认错误信息
4. 测试 AI 健康检查接口：`GET /api/ai/health`

### 问题6：第三方登录失败

**原因**：OAuth 回调 URL 未更新

**解决方案**：

**GitHub OAuth**：
1. 访问 [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. 编辑你的 App
3. 更新 **Authorization callback URL**：
   ```
   https://your-project.vercel.app/api/auth/github/callback
   ```

**QQ 互联**：
1. 访问 [QQ 互联管理中心](https://connect.qq.com/manage.html)
2. 编辑应用
3. 更新回调地址：
   ```
   https://your-project.vercel.app/api/auth/qq/callback
   ```

---

## 🎨 自定义域名

### 添加自定义域名

1. 进入 Vercel 项目 → **Settings** → **Domains**
2. 输入你的域名（如 `intellibuddy.com`）
3. 点击 **Add**

### 配置 DNS

Vercel 会提示你配置 DNS 记录：

**方法1：使用 A 记录**
```
Type: A
Name: @
Value: 76.76.21.21
```

**方法2：使用 CNAME 记录**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 等待生效

- DNS 生效时间：5 分钟 - 24 小时
- Vercel 会自动配置 SSL 证书（Let's Encrypt）

### 更新环境变量

域名生效后，更新：
- `FRONTEND_URL` = `https://intellibuddy.com`
- `BACKEND_URL` = `https://intellibuddy.com`
- GitHub/QQ OAuth 回调 URL

---

## 📊 监控和日志

### 查看部署日志

1. Vercel Dashboard → **Deployments**
2. 点击特定部署 → **View Function Logs**
3. 实时查看后端日志

### 查看分析数据

1. Vercel Dashboard → **Analytics**
2. 查看访问量、性能指标、错误率

### 配置告警（可选）

1. Vercel Dashboard → **Settings** → **Integrations**
2. 添加 Slack、Discord 等集成
3. 配置部署失败、错误告警

---

## 🔄 持续部署（CI/CD）

Vercel 自动配置了 CI/CD：

- ✅ **Push to main** → 自动部署到生产环境
- ✅ **Pull Request** → 自动创建预览部署
- ✅ **Commit to branch** → 自动创建开发部署

### 禁用自动部署（可选）

1. Settings → Git → Production Branch
2. 取消勾选 "Automatically deploy any commits to Production Branch"

---

## 🛡️ 安全建议

### 环境变量安全

- ❌ 不要在代码中硬编码 API Key
- ❌ 不要将 `.env` 文件提交到 Git
- ✅ 所有敏感信息使用环境变量
- ✅ 定期轮换 JWT_SECRET 和 API Keys

### HTTPS 强制

Vercel 自动强制 HTTPS，无需额外配置

### 安全头配置

已在 `vercel.json` 中配置：
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 💰 成本估算

### Vercel 免费层限制

- ✅ 带宽：100 GB/月
- ✅ 构建时间：6000 分钟/月
- ✅ Serverless 函数调用：100,000 次/月
- ✅ 团队成员：1 人

### MongoDB Atlas 免费层

- ✅ 存储：512 MB
- ✅ 连接数：500 个

### AI 服务成本（按需计费）

- Kimi：￥0.3/万 tokens
- 智谱：￥0.1/千 tokens
- 通义千问：100 万 tokens/月（免费）

**预估月成本**（中等使用量）：
- Vercel：$0（免费层足够）
- MongoDB：$0（免费层足够）
- AI 服务：￥20-50/月

---

## 🔗 有用的链接

- [Vercel 文档](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [MongoDB Atlas 文档](https://www.mongodb.com/docs/atlas/)

---

## 📞 获取帮助

遇到部署问题？

1. 查看 [部署文档](./DEPLOYMENT_GUIDE.md) 常见问题章节
2. 检查 Vercel 日志和浏览器控制台
3. 访问 [GitHub Issues](https://github.com/your-repo/issues)
4. 联系技术支持

---

**祝部署顺利！🎉**

*最后更新：2025年1月16日*


# 智学伴 (IntelliBuddy) - Vercel 部署指南

本指南将帮助你将智学伴项目部署到 Vercel 平台。

## 📋 部署前准备

### 1. 准备 MongoDB 数据库

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费账号并登录
3. 创建新集群（选择免费的 M0 层级）
4. 配置数据库用户：
   - 点击 "Database Access" → "Add New Database User"
   - 设置用户名和密码（记录下来，稍后会用到）
5. 配置网络访问：
   - 点击 "Network Access" → "Add IP Address"
   - 选择 "Allow Access from Anywhere" (0.0.0.0/0)
6. 获取连接字符串：
   - 点击 "Connect" → "Connect your application"
   - 复制连接字符串，格式如：`mongodb+srv://username:password@cluster.mongodb.net/intellibuddy?retryWrites=true&w=majority`

### 2. 准备 AI 模型 API Key

至少需要配置一个 AI 模型（推荐配置多个以实现降级切换）：

#### Kimi AI（推荐）
- 访问：https://platform.moonshot.cn/console/api-keys
- 注册并创建 API Key
- 新用户有免费额度

#### 通义千问（可选）
- 访问：https://dashscope.console.aliyun.com/apiKey
- 阿里云账号登录
- 创建 API Key

#### 文心一言（可选）
- 访问：https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application
- 创建应用获取 API Key 和 Secret Key

#### 智谱 AI（可选）
- 访问：https://open.bigmodel.cn/usercenter/apikeys
- 注册并创建 API Key

### 3. 生成 JWT Secret

在终端运行以下命令生成随机密钥：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

记录生成的字符串，稍后会用到。

---

## 🚀 Vercel 部署步骤

### 第一步：Fork 或推送代码到 Git 仓库

1. 确保你的代码已推送到 GitHub、GitLab 或 Bitbucket
2. 如果还没有，运行：
   ```bash
   git add .
   git commit -m "准备部署到 Vercel"
   git push origin main
   ```

### 第二步：连接 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 点击 "Add New Project"
4. 选择你的 `intellibuddy` 仓库
5. 点击 "Import"

### 第三步：配置项目设置

在项目配置页面：

1. **Framework Preset**: 选择 "Other" 或留空
2. **Root Directory**: 留空（使用根目录）
3. **Build Command**: 保持默认（会自动使用 `vercel.json` 中的配置）
4. **Output Directory**: 保持默认（会使用 `vercel.json` 中的配置）
5. **Install Command**: 保持默认（会使用 `pnpm install`）

### 第四步：配置环境变量

点击 "Environment Variables"，添加以下必需的环境变量：

#### 必需配置

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 运行环境 |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB 连接字符串 |
| `JWT_SECRET` | `生成的随机字符串` | JWT 密钥 |
| `FRONTEND_URL` | `https://your-app.vercel.app` | 前端 URL（部署后会知道） |
| `BACKEND_URL` | `https://your-app.vercel.app` | 后端 URL（同前端） |
| `TRUST_PROXY` | `true` | 信任 Vercel 代理 |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | 允许的 CORS 来源 |

#### AI 配置（至少配置一个）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `KIMI_API_KEY` | `your-kimi-api-key` | Kimi AI 密钥 |
| `PRIMARY_AI_MODEL` | `kimi` | 主要使用的 AI 模型 |
| `ENABLE_AI_CACHE` | `true` | 启用 AI 缓存节省成本 |

#### 可选配置（OAuth 登录）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GITHUB_CLIENT_ID` | `your-github-client-id` | GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | `your-github-client-secret` | GitHub OAuth |
| `QQ_APP_ID` | `your-qq-app-id` | QQ 登录 |
| `QQ_APP_KEY` | `your-qq-app-key` | QQ 登录 |

**注意**：首次部署时，`FRONTEND_URL` 和 `BACKEND_URL` 可以先设置为临时值，部署完成后再更新。

### 第五步：开始部署

1. 点击 "Deploy" 按钮
2. 等待构建完成（首次部署约需 3-5 分钟）
3. 部署成功后，Vercel 会给你一个 URL，如：`https://intellibuddy-xxx.vercel.app`

### 第六步：更新环境变量

1. 复制部署后的 URL
2. 进入项目的 "Settings" → "Environment Variables"
3. 更新以下变量：
   - `FRONTEND_URL`: `https://intellibuddy-xxx.vercel.app`
   - `BACKEND_URL`: `https://intellibuddy-xxx.vercel.app`
   - `ALLOWED_ORIGINS`: `https://intellibuddy-xxx.vercel.app`
4. 点击 "Save"
5. 进入 "Deployments" 页面
6. 点击最新部署的 "..." → "Redeploy" 重新部署

### 第七步：配置 OAuth 回调地址（可选）

如果配置了第三方登录，需要更新回调地址：

#### GitHub OAuth
1. 访问 https://github.com/settings/developers
2. 编辑你的 OAuth App
3. 更新 "Authorization callback URL" 为：
   ```
   https://intellibuddy-xxx.vercel.app/api/auth/github/callback
   ```

#### QQ 登录
1. 访问 https://connect.qq.com/manage.html
2. 编辑你的应用
3. 更新回调地址为：
   ```
   https://intellibuddy-xxx.vercel.app/api/auth/qq/callback
   ```

---

## ✅ 验证部署

部署完成后，访问你的应用：

1. 打开浏览器，访问 `https://intellibuddy-xxx.vercel.app`
2. 检查以下功能：
   - ✅ 用户注册和登录
   - ✅ AI 聊天功能
   - ✅ 知识图谱显示
   - ✅ 题库功能
   - ✅ 学习进度记录

---

## 🔧 常见问题

### 1. 构建失败：找不到 pnpm

**解决方法**：
- 在项目根目录确保有 `package.json` 文件
- 确保 `package.json` 中有 `"packageManager": "pnpm@8.15.0"`

### 2. API 请求 404

**可能原因**：
- 环境变量未配置正确
- `vercel.json` 路由配置有误

**解决方法**：
- 检查 Vercel 控制台的日志
- 确认 API 路由是否正确配置

### 3. MongoDB 连接失败

**可能原因**：
- MongoDB URI 格式错误
- IP 白名单未设置为允许所有

**解决方法**：
- 检查 `MONGO_URI` 是否正确
- 在 MongoDB Atlas 中设置网络访问为 0.0.0.0/0

### 4. AI 功能不可用

**可能原因**：
- AI API Key 未配置或无效
- API 额度用尽

**解决方法**：
- 检查环境变量中的 API Key
- 登录 AI 平台查看使用情况
- 配置多个 AI 模型实现降级

### 5. 函数执行超时

**可能原因**：
- 免费版 Vercel 函数最长执行 10 秒
- 当前配置已设置为 30 秒（需 Pro 版）

**解决方法**：
- 如果是免费版，将 `vercel.json` 中的 `maxDuration` 改为 10
- 或者升级到 Vercel Pro 版本

### 6. 静态资源 404

**可能原因**：
- 前端构建未正确生成
- 路由配置有问题

**解决方法**：
- 检查 `frontend/dist` 目录是否存在
- 查看 Vercel 构建日志

---

## 📊 性能优化建议

### 1. 启用 AI 缓存
```env
ENABLE_AI_CACHE=true
```

### 2. 配置 CDN 缓存
Vercel 会自动为静态资源启用 CDN，无需额外配置。

### 3. 使用多个 AI 模型
配置多个 AI 模型实现自动降级：
```env
KIMI_API_KEY=xxx
QIANWEN_API_KEY=xxx
ERNIE_API_KEY=xxx
PRIMARY_AI_MODEL=kimi
```

### 4. 定期清理 MongoDB 数据
定期清理不需要的日志和临时数据，保持数据库性能。

---

## 🔄 更新部署

当你更新代码后：

1. 提交并推送到 Git：
   ```bash
   git add .
   git commit -m "更新功能"
   git push origin main
   ```

2. Vercel 会自动检测并重新部署（约 2-3 分钟）

3. 也可以在 Vercel 控制台手动触发部署

---

## 📝 自定义域名（可选）

1. 在 Vercel 项目设置中选择 "Domains"
2. 输入你的域名（如 `intellibuddy.com`）
3. 按照提示在你的域名提供商处添加 DNS 记录
4. 等待 DNS 生效（通常 10 分钟到 48 小时）
5. 更新环境变量中的 URL 为新域名
6. 重新部署

---

## 🛡️ 安全建议

1. **定期更换 JWT_SECRET**
2. **限制 MongoDB 网络访问**：生产环境可以只允许 Vercel 的 IP
3. **监控 AI API 使用量**：避免意外的高额费用
4. **启用速率限制**：防止 API 滥用
5. **定期备份数据库**：MongoDB Atlas 提供自动备份功能

---

## 📞 获取帮助

如果遇到问题：

1. 查看 Vercel 部署日志
2. 查看浏览器开发者工具的控制台
3. 检查 MongoDB Atlas 连接状态
4. 参考 `backend/logs/` 目录下的日志文件

---

## 🎉 部署完成

恭喜！你已成功将智学伴部署到 Vercel。

**下一步**：
- 🌱 初始化数据库（运行种子脚本导入课程数据）
- 👥 邀请用户测试
- 📈 监控性能和使用情况
- 🔧 根据反馈持续优化

---

**最后更新**：2025年10月16日


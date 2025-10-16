# 智学伴 (IntelliBuddy) - 部署指南

## 📋 目录
- [一、部署前准备](#一部署前准备)
- [二、本地开发环境搭建](#二本地开发环境搭建)
- [三、生产环境部署](#三生产环境部署)
- [四、环境变量配置](#四环境变量配置)
- [五、数据库初始化](#五数据库初始化)
- [六、测试账号](#六测试账号)
- [七、常见问题](#七常见问题)

---

## 一、部署前准备

### 1.1 必备账号

| 服务 | 用途 | 获取方式 | 费用 |
|------|------|----------|------|
| **MongoDB Atlas** | 数据库 | [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) | 免费层 512MB |
| **Vercel** | 前后端部署 | [vercel.com](https://vercel.com) | 免费（Hobby Plan） |
| **AI 模型 API** | AI 服务 | 下方任选其一 | 按量计费 |

### 1.2 AI 模型 API（至少选择一个）

推荐优先级：Kimi > 智谱 > 通义千问 > 文心一言

| 服务商 | API Key 获取 | 免费额度 | 定价 |
|--------|-------------|----------|------|
| **Kimi (月之暗面)** | [platform.moonshot.cn](https://platform.moonshot.cn) | 新用户15元 | ￥0.3/万tokens |
| **智谱 AI** | [open.bigmodel.cn](https://open.bigmodel.cn) | 新用户500万tokens | ￥0.1/千tokens |
| **通义千问** | [dashscope.aliyun.com](https://dashscope.aliyun.com) | 100万tokens/月 | ￥0.8/万tokens |
| **文心一言** | [cloud.baidu.com/product/wenxinworkshop](https://cloud.baidu.com/product/wenxinworkshop) | 免费体验 | 按调用次数 |

### 1.3 开发工具
- Node.js 18+ 
- pnpm 8+ (推荐) 或 npm
- Git

---

## 二、本地开发环境搭建

### 2.1 克隆项目

```bash
git clone https://github.com/your-username/intellibuddy.git
cd intellibuddy
```

### 2.2 安装依赖

**前端**：
```bash
# 在项目根目录
pnpm install
```

**后端**：
```bash
cd backend
pnpm install
```

### 2.3 配置环境变量

> 💡 **快速开始**：复制 `backend/env.example` 文件为 `backend/.env`，然后按说明填写配置。

**后端环境变量** (`backend/.env`):
```env
# ========== 基础配置 ==========
NODE_ENV=development
PORT=5001

# ========== URL 配置 ==========
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001

# ========== 数据库配置 ==========
# MongoDB Atlas 连接字符串（必需）
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/intellibuddy?retryWrites=true&w=majority

# ========== 身份认证配置 ==========
# JWT 密钥（必需，生产环境请使用强随机字符串）
# 生成方法：node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_jwt_secret_here_please_change_in_production

# ========== AI 模型配置 ==========
# 至少配置一个 AI 模型，推荐配置多个以实现智能降级
PRIMARY_AI_MODEL=kimi

# Kimi API（推荐）
KIMI_API_KEY=your_kimi_api_key_here

# 智谱 AI（可选）
ZHIPU_API_KEY=your_zhipu_api_key_here

# 通义千问（可选）
QIANWEN_API_KEY=your_qianwen_api_key_here

# 文心一言（可选）
ERNIE_API_KEY=your_ernie_api_key_here
ERNIE_SECRET_KEY=your_ernie_secret_key_here

# 是否启用 AI 缓存（true 可节省成本）
ENABLE_AI_CACHE=true

# ========== 第三方登录（可选）==========
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# QQ OAuth
QQ_APP_ID=your_qq_app_id
QQ_APP_KEY=your_qq_app_key
```

**前端环境变量** (`.env.local`，可选):
```env
# 如果后端不在 localhost:5001，需要配置
VITE_API_BASE_URL=http://localhost:5001
```

> 📖 **详细配置说明**：参见 `backend/env.example` 文件中的注释

### 2.4 启动开发服务器

**终端1 - 后端**：
```bash
cd backend
pnpm run dev
```
后端将在 `http://localhost:5001` 运行

**终端2 - 前端**：
```bash
# 在项目根目录
pnpm run dev
```
前端将在 `http://localhost:5173` 运行

### 2.5 初始化数据库

**创建数据库索引**：
```bash
cd backend
pnpm run db:indexes
```

**（可选）导入示例数据**：
```bash
cd backend
pnpm run seed:all
```

### 2.6 访问应用

打开浏览器访问 `http://localhost:5173`

---

## 三、生产环境部署

### 3.1 部署到 Vercel（推荐）

#### 步骤1：准备 Vercel 配置

在项目根目录创建 `vercel.json`（已包含在项目中）：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 步骤2：推送代码到 GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 步骤3：在 Vercel 部署

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入您的 GitHub 仓库
4. Vercel 会自动检测为 Vite 项目
5. 配置环境变量（见下方）
6. 点击 "Deploy"

#### 步骤4：配置 Vercel 环境变量

在 Vercel 项目设置 → Environment Variables 中添加以下变量：

**必需的环境变量**：
| 变量名 | 值示例 | 说明 |
|--------|--------|------|
| `NODE_ENV` | `production` | 运行环境 |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas 连接串 |
| `JWT_SECRET` | `强随机字符串` | JWT 签名密钥（32位以上） |
| `FRONTEND_URL` | `https://your-project.vercel.app` | 前端域名（Vercel 自动分配或自定义域名） |
| `BACKEND_URL` | `https://your-project.vercel.app` | 后端域名（与前端相同） |
| `KIMI_API_KEY` | `sk-...` | Kimi AI 的 API Key |

**推荐的可选变量**：
| 变量名 | 值示例 | 说明 |
|--------|--------|------|
| `PRIMARY_AI_MODEL` | `kimi` | 主AI模型 (kimi/qianwen/zhipu/ernie) |
| `ENABLE_AI_CACHE` | `true` | 开启AI缓存节省成本 |
| `QIANWEN_API_KEY` | `sk-...` | 通义千问 API Key（降级备用） |
| `ZHIPU_API_KEY` | `...` | 智谱 AI API Key（降级备用） |
| `GITHUB_CLIENT_ID` | `...` | GitHub OAuth ID（启用GitHub登录） |
| `GITHUB_CLIENT_SECRET` | `...` | GitHub OAuth Secret |
| `TRUST_PROXY` | `true` | 信任代理（Vercel必需） |

> ⚠️ **重要提示**：
> 1. 每个环境变量都要在 **Production**、**Preview** 和 **Development** 三个环境中配置
> 2. `FRONTEND_URL` 和 `BACKEND_URL` 在生产环境应使用实际域名
> 3. `JWT_SECRET` 必须使用强随机字符串，不要使用示例值

#### 步骤5：触发重新部署

环境变量配置后，需要重新部署使配置生效：
1. 在 Vercel 项目面板，点击 "Deployments" 标签
2. 找到最新的部署，点击右侧 "..." 菜单
3. 选择 "Redeploy"
4. 等待部署完成（约1-3分钟）

#### 步骤6：验证部署

部署成功后，验证各项功能：
1. 访问部署的 URL（如 `https://your-project.vercel.app`）
2. 检查首页是否正常加载
3. 尝试注册/登录功能
4. 测试 AI 对话功能
5. 检查浏览器控制台是否有错误

#### 步骤7：自定义域名（可选）

1. 在 Vercel 项目设置 → Domains
2. 添加您的自定义域名（如 `intellibuddy.com`）
3. 按照 Vercel 提示配置 DNS 记录：
   - **A 记录**：指向 Vercel IP
   - **CNAME 记录**：指向 `cname.vercel-dns.com`
4. 等待 DNS 生效（5分钟-24小时）
5. 更新环境变量 `FRONTEND_URL` 和 `BACKEND_URL` 为新域名
6. 重新部署

> 💡 **提示**：使用自定义域名后需要同步更新第三方OAuth回调URL（GitHub、QQ等）

---

## 四、环境变量配置详解

### 4.1 MongoDB URI 获取

1. 登录 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群（M0 Sandbox）
3. 创建数据库用户
4. 点击 "Connect" → "Connect your application"
5. 复制连接字符串，替换 `<password>` 和数据库名

示例：
```
mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/intellibuddy?retryWrites=true&w=majority
```

### 4.2 JWT Secret 生成

生成强随机字符串：
```bash
# 方法1：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 方法2：使用 OpenSSL
openssl rand -hex 32

# 方法3：在线生成
# 访问 https://randomkeygen.com/
```

### 4.3 AI API Key 配置

**Kimi (月之暗面)**：
1. 访问 [platform.moonshot.cn](https://platform.moonshot.cn)
2. 注册/登录
3. 创建 API Key
4. 复制 Key 到环境变量

**智谱 AI**：
1. 访问 [open.bigmodel.cn](https://open.bigmodel.cn)
2. 注册/登录
3. 控制台 → API Keys → 创建
4. 复制 Key

**通义千问**：
1. 访问 [dashscope.aliyun.com](https://dashscope.aliyun.com)
2. 使用阿里云账号登录
3. 开通 DashScope
4. 创建 API Key

**文心一言**：
1. 访问 [cloud.baidu.com/product/wenxinworkshop](https://cloud.baidu.com/product/wenxinworkshop)
2. 创建应用
3. 获取 API Key 和 Secret Key

---

## 五、数据库初始化

### 5.1 自动初始化

首次访问应用时，某些数据会自动创建（如用户成就记录）。

### 5.2 手动创建索引

```bash
cd backend
pnpm run db:indexes
```

这会创建以下索引：
- User (email, username, githubId, qqId)
- KnowledgePoint (subject, title)
- UserProgress (userId + pointId, status)
- WrongQuestion (userId + pointId, mastered)
- StudySession (userId + startTime)
- Achievement (userId + achievementId)

### 5.3 导入知识点数据

```bash
cd backend

# 导入所有课程
pnpm run seed:all

# 或分别导入
pnpm run seed:year1  # 大一课程
pnpm run seed:year2  # 大二课程
pnpm run seed:year3  # 大三课程
pnpm run seed:year4  # 大四课程
```

---

## 六、测试账号

### 6.1 创建测试账号

**方式1：通过界面注册**
1. 访问应用首页
2. 点击"注册"
3. 填写测试信息：
   - 用户名：testuser
   - 邮箱：test@example.com
   - 密码：Test123456

**方式2：直接在数据库创建**

```javascript
// 连接到 MongoDB
use intellibuddy;

// 创建测试用户（密码已加密，原始密码：Test123456）
db.users.insertOne({
  username: "testuser",
  email: "test@example.com",
  passwordHash: "$2a$10$XqwJU9vJXw9.xYmh9kxZHuKJ.Jm.Dx8qXz9V5n4Kz3Lw2Qz6Xz8We",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### 6.2 推荐的演示账号信息

为竞赛提交准备的测试账号：

| 用途 | 用户名 | 邮箱 | 密码 | 特点 |
|------|--------|------|------|------|
| 普通用户 | demo_student | student@intellibuddy.com | Demo2025 | 已完成部分学习 |
| 高级用户 | demo_advanced | advanced@intellibuddy.com | Demo2025 | 完成多门课程，大量成就 |
| 空白用户 | demo_new | newuser@intellibuddy.com | Demo2025 | 全新账号，展示引导流程 |

---

## 七、常见问题

### Q1：部署后提示"无法连接到数据库"

**原因**：MongoDB Atlas 白名单未配置  
**解决**：
1. 登录 MongoDB Atlas
2. Network Access → Add IP Address
3. 选择 "Allow Access from Anywhere" (0.0.0.0/0)
4. 保存并等待生效（约1分钟）

### Q2：AI 功能不可用

**原因**：AI API Key 未配置或无效  
**解决**：
1. 检查环境变量 `KIMI_API_KEY` 等是否正确
2. 访问 AI 服务商控制台确认 Key 有效
3. 查看后端日志确认错误信息
4. 确保配置了至少一个可用的 AI 模型

### Q3：Vercel 部署后 API 404

**原因**：vercel.json 路由配置问题  
**解决**：
1. 确认 `vercel.json` 文件在项目根目录
2. 确认后端入口文件路径正确
3. 重新部署

### Q4：前端访问后端跨域错误

**原因**：CORS 配置问题  
**解决**：
1. 确认后端 `FRONTEND_URL` 环境变量正确
2. 检查 `backend/src/index.ts` 中 CORS 配置
3. 生产环境确保使用同一域名

### Q5：构建失败：内存不足

**原因**：Vercel 免费版内存限制  
**解决**：
1. 优化 vite.config.ts 中的构建配置
2. 减少不必要的依赖
3. 考虑升级 Vercel 付费计划

---

## 八、性能优化建议

### 8.1 前端优化
- ✅ 已启用代码分割（vite.config.ts）
- ✅ 已配置懒加载路由
- ✅ 图片使用 WebP 格式
- 🔄 考虑使用 CDN 加速静态资源

### 8.2 后端优化
- ✅ 已创建数据库索引
- ✅ 已启用 AI 响应缓存
- ✅ 已实现请求限流
- 🔄 考虑使用 Redis 缓存热点数据

### 8.3 数据库优化
- ✅ MongoDB Atlas 已启用自动备份
- 🔄 定期清理过期的学习会话数据
- 🔄 监控数据库性能指标

---

## 九、监控与维护

### 9.1 日志查看

**Vercel 日志**：
1. Vercel 项目 → Deployments
2. 点击最新部署 → View Function Logs
3. 查看实时日志

**本地日志**：
后端会在控制台输出详细日志

### 9.2 健康检查

访问以下端点检查服务状态：
- 后端健康检查：`GET /api/`
- AI 服务健康检查：`GET /api/ai/health`

### 9.3 数据备份

**MongoDB Atlas 自动备份**（免费层不可用）：
- 手动导出：
  ```bash
  mongodump --uri="<MONGO_URI>" --out=./backup
  ```

---

## 十、安全检查清单

部署前请确认：
- [ ] JWT_SECRET 使用强随机字符串
- [ ] MongoDB 用户密码足够复杂
- [ ] 生产环境 NODE_ENV=production
- [ ] API Key 未泄露到代码仓库
- [ ] MongoDB Atlas 网络访问已限制
- [ ] Vercel 环境变量已正确配置
- [ ] 已删除测试/调试代码
- [ ] 已禁用生产环境 console.log（自动）

---

## 📞 技术支持

如遇到部署问题，请：
1. 查看本文档常见问题章节
2. 查看 [GitHub Issues](https://github.com/your-username/intellibuddy/issues)
3. 联系邮箱：deploy@intellibuddy.com

---

**祝部署顺利！🚀**

*智学伴团队  
最后更新：2025年10月15日*


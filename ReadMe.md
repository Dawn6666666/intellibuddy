# IntelliBuddy - 智学伴

AI智能学习助手，帮助计算机专业学生系统化学习。

> **✅ 项目已完成重构！** 现已采用标准的前后端分离结构，统一使用 pnpm 管理依赖。
> 
> 📋 [查看重构总结](./REFACTOR_SUMMARY.md) | 🚀 [快速开始指南](./QUICK_START.md)

## 项目结构

```
intellibuddy/
├── frontend/          # 前端项目 (Vue 3 + TypeScript + Vite)
├── backend/           # 后端项目 (Node.js + Express + MongoDB)
├── docs/              # 文档
└── public/            # 公共资源（笔记等）
```

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MongoDB Atlas账号（免费）
- AI API Key（Kimi/通义千问/智谱AI 任选其一）

### 安装依赖

```bash
# 安装所有依赖
pnpm install
```

### 配置环境变量

```bash
# 1. 复制环境变量示例文件
cd backend
cp env.example .env

# 2. 编辑 .env 文件，填写必需配置：
#    - MONGO_URI（MongoDB Atlas 连接串）
#    - JWT_SECRET（JWT密钥）
#    - KIMI_API_KEY（或其他AI模型的Key）
#    - FRONTEND_URL 和 BACKEND_URL
```

> 📖 详细配置说明见 [backend/env.example](backend/env.example)

### 开发模式

```bash
# 同时启动前后端
pnpm dev

# 或分别启动
pnpm dev:frontend  # 前端: http://localhost:5173
pnpm dev:backend   # 后端: http://localhost:5001
```

### 初始化数据库

```bash
cd backend

# 创建索引（必需）
pnpm run db:indexes

# 导入知识点数据（可选）
pnpm run seed:all
```

### 构建生产版本

```bash
pnpm build
```

### 部署到 Vercel

> 🚀 本项目已完成 Vercel 部署配置优化！**已修复部署问题** ✅

#### 📖 部署文档

- 🔧 **[Vercel 部署修复指南](./VERCEL_DEPLOYMENT_FIXED.md)** - ⭐ **最新！已修复部署问题**
- 📖 [Vercel 部署完整指南](./VERCEL_DEPLOYMENT_GUIDE.md) - 详细步骤和配置说明

#### 一键检查部署准备

```bash
node check-deployment.js
```

#### 快速部署

1. **推送代码到 Git**
   ```bash
   git push origin main
   ```

2. **导入 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 导入你的仓库
   - Framework 选择 "Other"

3. **配置环境变量**（必需）
   ```env
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=生成的随机字符串
   KIMI_API_KEY=your-api-key
   FRONTEND_URL=https://your-app.vercel.app
   BACKEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   TRUST_PROXY=true
   ```

4. **部署**
   - 点击 Deploy
   - 首次部署后更新 URL 环境变量
   - 重新部署

#### 完整文档

- 📖 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - 完整部署指南
- ⚡ [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 快速部署清单
- 🔧 [backend/env.example](./backend/env.example) - 环境变量说明
- 📋 [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) - 通用部署文档

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia (状态管理)
- Vue Router
- ECharts (数据可视化)
- Marked + KaTeX (Markdown和数学公式)

### 后端
- Node.js
- Express
- MongoDB + Mongoose
- JWT (身份认证)
- Passport (OAuth)

## 📚 文档

> 💡 **文档太多？** 查看 **[📖 文档索引](./DOCUMENTATION_INDEX.md)** 快速找到您需要的文档！

### 🆕 pnpm 相关文档（必读）
- **[📋 配置完成总结](./FINAL_SUMMARY.md)** ⭐ - 查看所有配置和验证结果
- **[🚀 快速参考卡片](./PNPM_QUICK_REFERENCE.md)** ⭐ - 常用命令速查
- **[📦 pnpm 配置说明](./PNPM_CONFIG.md)** - 完整的 pnpm 配置和使用方法
- **[📝 迁移总结](./PNPM_MIGRATION_SUMMARY.md)** - 了解迁移过程和改动
- **[✅ 验证报告](./VERIFICATION_REPORT.md)** - 配置验证和测试结果

### 项目文档
- **[快速开始指南](./QUICK_START.md)** - 详细的安装和使用说明
- **[重构总结](./REFACTOR_SUMMARY.md)** - 了解项目重构的所有改动
- **[测试结果](./TEST_RESULTS.md)** - 了解当前项目状态

### 其他文档
- [部署指南](./docs/DEPLOYMENT_GUIDE.md)
- [用户手册](./docs/USER_MANUAL.md)
- [商业计划](./docs/BUSINESS_PLAN.md)

## 开发规范

本项目**强制使用 pnpm** 作为唯一的包管理器，以避免环境冲突：

1. ✅ **只使用 pnpm**，禁止使用 npm 或 yarn
2. ✅ 使用 pnpm workspace 统一管理前后端依赖
3. ✅ 所有项目都配置了 `preinstall` 钩子，防止误用其他包管理器
4. ✅ 提交代码前确保通过 linter 检查

详细配置说明请查看 **[pnpm 配置文档](./PNPM_CONFIG.md)**

## License

MIT

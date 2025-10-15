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
- MongoDB

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 或手动安装
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 开发模式

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:frontend  # 前端: http://localhost:5173
npm run dev:backend   # 后端: http://localhost:5001
```

### 构建生产版本

```bash
npm run build
```

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

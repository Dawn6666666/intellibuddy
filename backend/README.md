# IntelliBuddy Backend

智学伴后端服务 - 基于 Node.js + Express + MongoDB

## 开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 数据导入

```bash
# 导入知识点数据
pnpm run import

# 填充内容
pnpm run fill:content

# 创建数据库索引
pnpm run db:indexes
```

## 技术栈

- Node.js
- Express
- MongoDB + Mongoose
- TypeScript
- JWT 认证
- Passport (GitHub/QQ OAuth)

## API 端点

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/knowledge-points` - 获取知识点
- `POST /api/quiz` - 生成测验
- `POST /api/ai/chat` - AI对话
- 更多端点请查看 `src/routes/` 目录


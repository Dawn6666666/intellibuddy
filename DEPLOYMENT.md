# 部署指南

## Vercel 部署注意事项

### 头像上传功能

在 Vercel serverless 环境中，文件系统是只读且临时的。为了支持头像上传功能，我们采用了以下策略：

#### 自动环境检测

后端代码会自动检测运行环境：
- **Serverless 环境（Vercel）**: 使用内存存储，将图片转换为 Base64 格式存储在 MongoDB 数据库中
- **本地开发环境**: 使用文件系统存储，图片保存在 `backend/uploads/avatars/` 目录

#### 实现细节

1. **环境检测**
```typescript
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
```

2. **存储策略**
- Serverless: `multer.memoryStorage()` → Base64 → MongoDB
- 本地: `multer.diskStorage()` → 文件系统

3. **前端显示**
前端会自动识别三种头像来源：
- Base64 数据 URI（`data:image/...`）
- 外部链接（`http://` 或 `https://`）
- 本地上传路径（`/uploads/...`）

### 超时配置

Vercel 函数执行时间限制：
- **免费版**: 最大 10 秒
- **Pro 版**: 最大 60 秒
- **Enterprise 版**: 最大 900 秒

当前配置：`maxDuration: 10`（适用于免费版）

如果您使用 Pro 版或更高版本，可以在 `vercel.json` 中增加超时时间：

```json
{
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### Body 大小限制

Vercel 对请求 body 大小有限制：
- 默认: 4.5MB
- 增加限制需要在 `vercel.json` 中配置

当前头像上传限制为 2MB，符合 Vercel 默认限制。

### 环境变量

确保在 Vercel 项目设置中配置以下环境变量：

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=https://your-api-domain.vercel.app/api/auth/github/callback
QQ_APP_ID=your-qq-app-id
QQ_APP_KEY=your-qq-app-key
QQ_CALLBACK_URL=https://your-api-domain.vercel.app/api/auth/qq/callback
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
TRUST_PROXY=true
```

### 性能优化建议

1. **图片压缩**: 在上传前在前端进行图片压缩，减少传输和存储大小
2. **CDN 服务**: 对于生产环境，建议使用专业的图片存储服务（如 Cloudinary、AWS S3、阿里云 OSS）
3. **缓存策略**: 合理设置缓存头，减少重复请求

### 替代方案

如果 Base64 存储方案不满足需求，可以考虑以下替代方案：

#### 1. Cloudinary（推荐）

```bash
npm install cloudinary multer-storage-cloudinary
```

优点：
- 专业的图片存储和处理服务
- 自动图片优化和 CDN 加速
- 免费版提供 25GB 存储和 25GB 月带宽

#### 2. AWS S3 / 阿里云 OSS

优点：
- 成本更低
- 与云服务集成度高
- 更灵活的配置

#### 3. UploadThing

```bash
npm install uploadthing
```

优点：
- 专为 Next.js 和 React 设计
- 简单易用的 API
- 免费版提供 2GB 存储

### 故障排查

如果遇到上传超时问题：

1. **检查日志**: 在 Vercel 控制台查看函数执行日志
2. **检查文件大小**: 确保文件不超过 2MB
3. **检查网络**: 确保客户端网络稳定
4. **检查环境变量**: 确认 MongoDB 连接正常
5. **检查超时设置**: 根据套餐调整 `maxDuration`

### 本地测试

在本地开发环境测试 Vercel 部署效果：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录运行
vercel dev
```

这会模拟 Vercel 的 serverless 环境，帮助你在部署前发现问题。

## 更新日志

### 2025-01-26
- 添加 Serverless 环境自动检测
- 实现 Base64 头像存储方案
- 优化上传错误处理和日志
- 更新前端头像显示逻辑


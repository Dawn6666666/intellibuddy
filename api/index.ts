// Vercel Serverless Function 入口
// 这个文件将所有 API 请求转发到 Express 应用

// 动态导入 Express 应用（编译后的版本）
const app = require('../backend/dist/index.js').default;

// Vercel Serverless Function 处理器
export default app;


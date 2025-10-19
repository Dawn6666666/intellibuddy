// Vercel Serverless Function 入口
// 这个文件将所有 API 请求转发到 Express 应用

// 直接导入编译后的 Express 应用
const app = require('../backend/dist/index.js');

// 导出 Express 应用作为 Vercel Serverless Function
module.exports = app.default || app;


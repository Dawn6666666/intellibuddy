// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import KnowledgePoint from './models/KnowledgePoint';
import authRoutes from './routes/auth';
import progressRoutes from './routes/progress'; // 1. 导入进度路由

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// 连接数据库...
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("错误: MONGO_URI 未在 .env 文件中定义");
    process.exit(1);
}
mongoose.connect(mongoUri)
    .then(() => console.log("成功连接到 MongoDB Atlas"))
    .catch(err => console.error("无法连接到 MongoDB:", err));

// 中间件...
app.use(cors());
app.use(express.json());

// --- API 路由 ---
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes); // 2. 使用新的进度路由

// 知识点路由...
app.get('/api/knowledge-points', async (req, res) => {
    try {
        const points = await KnowledgePoint.find({});
        res.json(points);
    } catch (error) {
        res.status(500).json({message: '获取知识点时发生错误'});
    }
});

// 测试路由...
app.get('/', (req, res) => {
    res.send('智学伴后端服务已成功运行！');
});

// 启动服务器...
app.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 上运行`);
});
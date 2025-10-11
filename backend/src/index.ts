// backend/src/index.ts
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import './config/passport';

import KnowledgePoint from './models/KnowledgePoint';
import authRoutes from './routes/auth';
import progressRoutes from './routes/progress';
import chatRoutes from './routes/chat';
import aiRoutes from './routes/ai'; // 1. 导入新的 AI 路由
import User, {IUser} from './models/User';

const app = express();
const PORT = process.env.PORT || 5001;

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("错误: MONGO_URI 未在 .env 文件中定义");
    process.exit(1);
}
mongoose.connect(mongoUri)
    .then(() => console.log("成功连接到 MongoDB Atlas"))
    .catch(err => console.error("无法连接到 MongoDB:", err));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// --- API 路由 ---
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ai', aiRoutes); // 2. 使用新的 AI 路由

// --- GitHub 认证路由 ---
app.get('/api/auth/github',
    passport.authenticate('github', {scope: ['user:email'], session: false})
);

app.get('/api/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login', session: false}),
    (req, res) => {
        const user = req.user as IUser;
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {expiresIn: '7d'});
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);

// --- QQ 认证路由 ---
app.get('/api/auth/qq',
    passport.authenticate('qq', {session: false})
);

app.get('/api/auth/qq/callback',
    passport.authenticate('qq', {failureRedirect: '/login', session: false}),
    (req, res) => {
        const user = req.user as IUser;
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {expiresIn: '7d'});
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);

// --- 其他路由 ---
app.get('/api/knowledge-points', async (req, res) => {
    try {
        const points = await KnowledgePoint.find({});
        res.json(points);
    } catch (error) {
        res.status(500).json({message: '获取知识点时发生错误'});
    }
});
app.get('/', (req, res) => {
    res.send('智学伴后端服务已成功运行！');
});

// 导出 app 实例，供 Vercel 调用
export default app;
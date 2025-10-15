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
import aiRoutes from './routes/ai';
import quizRoutes from './routes/quiz';
import assessmentRoutes from './routes/assessment';
import learningPathRoutes from './routes/learning-path';
import wrongQuestionsRoutes from './routes/wrong-questions';
import studyTimeRoutes from './routes/study-time';
import achievementsRoutes from './routes/achievements';
import learningReportRoutes from './routes/learning-report';
import analyticsRoutes from './routes/analytics';
import User, {IUser} from './models/User';

// 导入中间件
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { globalRateLimitMiddleware, authRateLimitMiddleware, aiRateLimitMiddleware } from './middleware/rateLimiter';
import { analyticsMiddleware } from './middleware/analytics';
import { requestLogger } from './middleware/logger';

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
app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());

// --- 日志和分析中间件 ---
app.use(requestLogger);
app.use(analyticsMiddleware);

// --- 全局限流（放在路由之前）---
app.use(globalRateLimitMiddleware);

// --- API 路由 ---
app.use('/api/auth', authRateLimitMiddleware, authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ai', aiRateLimitMiddleware, aiRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/wrong-questions', wrongQuestionsRoutes);
app.use('/api/study-time', studyTimeRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/learning-report', learningReportRoutes);
app.use('/api/analytics', analyticsRoutes);

// --- GitHub 认证路由 ---
app.get('/api/auth/github',
    passport.authenticate('github', {scope: ['user:email'], session: false})
);

app.get('/api/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login', session: false}),
    (req, res) => {
        const user = req.user as IUser;
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {expiresIn: '7d'});
        // 【修改处】从环境变量读取前端 URL
        const frontendUrl = process.env.FRONTEND_URL;
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
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
        // 【修改处】从环境变量读取前端 URL
        const frontendUrl = process.env.FRONTEND_URL;
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
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
    res.json({
        success: true,
        message: '智学伴后端服务已成功运行！',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
    });
});

// --- 404 处理 ---
app.use(notFoundHandler);

// --- 全局错误处理 ---
app.use(errorHandler);

// 导出 app 实例，供 Vercel 调用
export default app;

// 只有在不是 Vercel 环境时才启动本地服务器
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[SUCCESS] 本地开发服务器已启动，正在监听 http://localhost:${PORT}`);
    });
}

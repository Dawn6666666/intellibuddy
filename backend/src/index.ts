// backend/src/index.ts
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import path from 'path';

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
import usersRoutes from './routes/users';
import User, {IUser} from './models/User';

// 导入中间件
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { globalRateLimitMiddleware, authRateLimitMiddleware, aiRateLimitMiddleware } from './middleware/rateLimiter';
import { analyticsMiddleware } from './middleware/analytics';
import { requestLogger } from './middleware/logger';
import { authMiddleware } from './middleware/auth';
import { createDatabaseIndexes } from './utils/dbIndexes';

const app = express();
const PORT = process.env.PORT || 5001;

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("错误: MONGO_URI 未在 .env 文件中定义");
    process.exit(1);
}
mongoose.connect(mongoUri)
    .then(async () => {
        console.log("成功连接到 MongoDB Atlas");
        // 创建数据库索引以优化查询性能
        await createDatabaseIndexes();
    })
    .catch(err => console.error("无法连接到 MongoDB:", err));

// --- CORS 配置 ---
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : '*',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// --- 响应压缩（gzip）---
app.use(compression({
    // 只压缩大于 1KB 的响应
    threshold: 1024,
    // 压缩级别（0-9，9为最高压缩率但最慢）
    level: 6,
    // 过滤器：只压缩可压缩的内容
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());

// 提供静态文件服务（头像上传）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 信任代理（Vercel 等云平台部署时需要）
if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

// --- 日志和分析中间件 ---
app.use(requestLogger);
app.use(analyticsMiddleware);

// --- 全局限流（放在路由之前）---
app.use(globalRateLimitMiddleware);

// --- API 路由 ---
// 将 /me 接口单独出来，不使用 authRateLimitMiddleware
app.get('/api/auth/me', authMiddleware, (req: express.Request, res: express.Response) => {
  res.json((req as any).user);
});
app.use('/api/auth', authRateLimitMiddleware, authRoutes);
app.use('/api/users', usersRoutes);
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

// backend/src/routes/progress.ts
import {Router, Response, NextFunction} from 'express';
import UserProgress from '../models/UserProgress';
import {authMiddleware, AuthRequest} from './auth'; // 导入我们之前创建的认证中间件

const router = Router();

// --- 获取当前用户的所有学习进度 ---
// 这个路由会受到 authMiddleware 的保护
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const progress = await UserProgress.find({userId});
        res.json(progress);
    } catch (error) {
        res.status(500).json({message: '获取学习进度失败'});
    }
});

// --- 更新（或创建）一个知识点的学习状态 ---
router.post('/update', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const {pointId, status} = req.body;

        if (!pointId || !status) {
            return res.status(400).json({message: '缺少 pointId 或 status'});
        }

        // 使用 findOneAndUpdate 和 upsert:true
        // 如果记录存在，则更新；如果不存在，则创建
        const updatedProgress = await UserProgress.findOneAndUpdate(
            {userId, pointId},
            {status},
            {new: true, upsert: true}
        );

        res.json(updatedProgress);
    } catch (error) {
        res.status(500).json({message: '更新进度失败'});
    }
});

export default router;
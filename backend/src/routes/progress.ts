// backend/src/routes/progress.ts
import {Router, Request, Response} from 'express';
import UserProgress from '../models/UserProgress';
import {authMiddleware} from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const progress = await UserProgress.find({userId});
        res.json(progress);
    } catch (error) {
        res.status(500).json({message: '获取学习进度失败'});
    }
});

router.post('/update', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const {pointId, status} = req.body;

        if (!pointId || !status) {
            return res.status(400).json({message: '缺少 pointId 或 status'});
        }

        const updateData: any = { status };
        
        // 如果标记为完成，设置完成时间
        if (status === 'completed') {
            updateData.completedAt = new Date();
        }

        const updatedProgress = await UserProgress.findOneAndUpdate(
            {userId, pointId},
            updateData,
            {new: true, upsert: true}
        );

        res.json(updatedProgress);
    } catch (error) {
        res.status(500).json({message: '更新进度失败'});
    }
});

export default router;
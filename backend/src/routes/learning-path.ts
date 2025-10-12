// backend/src/routes/learning-path.ts
import {Router, Response, Request} from 'express';
import {authMiddleware} from './auth';
import {generateRecommendedPath, canUnlockPoint} from '../utils/pathRecommender';
import KnowledgePoint from '../models/KnowledgePoint';

const router = Router();

// 获取推荐学习路径
router.get('/recommend', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({message: '未授权'});
        }

        const recommendedPath = await generateRecommendedPath(userId);

        // 获取前10个推荐
        const topRecommendations = recommendedPath.slice(0, 10);

        // 获取详细信息
        const detailedRecommendations = await Promise.all(
            topRecommendations.map(async (rec) => {
                const point = await KnowledgePoint.findOne({id: rec.pointId});
                return {
                    ...rec,
                    title: point?.title,
                    subject: point?.subject,
                    difficulty: point?.difficulty,
                    estimatedTime: point?.estimatedTime,
                };
            })
        );

        res.json({
            recommendations: detailedRecommendations,
            totalCount: recommendedPath.length,
        });
    } catch (error) {
        console.error('生成推荐路径失败:', error);
        res.status(500).json({message: '生成推荐路径时发生错误'});
    }
});

// 检查知识点是否可解锁
router.post('/unlock-check', authMiddleware, async (req: Request, res: Response) => {
    try {
        const {pointId} = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({message: '未授权'});
        }

        const unlockStatus = await canUnlockPoint(userId, pointId);

        if (unlockStatus.canUnlock) {
            res.json({
                canUnlock: true,
                message: '可以开始学习',
            });
        } else {
            // 获取缺失前置课程的详细信息
            const missingPoints = await KnowledgePoint.find({
                id: {$in: unlockStatus.missingPrerequisites},
            });

            res.json({
                canUnlock: false,
                message: '需要先完成前置课程',
                missingPrerequisites: missingPoints.map(p => ({
                    id: p.id,
                    title: p.title,
                    subject: p.subject,
                })),
            });
        }
    } catch (error) {
        console.error('检查解锁状态失败:', error);
        res.status(500).json({message: '检查解锁状态时发生错误'});
    }
});

export default router;



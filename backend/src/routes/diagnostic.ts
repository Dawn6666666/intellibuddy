// backend/src/routes/diagnostic.ts
import {Router, Request, Response} from 'express';
import {authMiddleware} from '../middleware/auth';
import {generateDiagnosticReport} from '../services/aiDiagnosticService';
import {IUser} from '../models/User';

const router = Router();

/**
 * 获取学习诊断报告
 */
router.get('/report', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const userId = user._id;

        if (!userId) {
            return res.status(401).json({message: '未授权'});
        }

        const report = await generateDiagnosticReport(userId);

        res.json({
            success: true,
            report
        });
    } catch (error) {
        console.error('生成诊断报告失败:', error);
        res.status(500).json({message: '生成诊断报告时发生错误'});
    }
});

export default router;


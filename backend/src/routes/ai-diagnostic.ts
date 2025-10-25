// backend/src/routes/ai-diagnostic.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { Types } from 'mongoose';
import {
  generateDiagnosticReport,
  shouldSendIntervention,
} from '../services/aiDiagnosticService';

const router = Router();

/**
 * GET /api/ai-diagnostic/report
 * 获取用户的学习诊断报告
 */
router.get('/report', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const report = await generateDiagnosticReport(userId);

    res.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('生成诊断报告失败:', error);
    res.status(500).json({
      success: false,
      message: '生成诊断报告时发生错误',
      error: error.message,
    });
  }
});

/**
 * GET /api/ai-diagnostic/should-intervene
 * 检查是否需要主动干预
 */
router.get('/should-intervene', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const shouldIntervene = await shouldSendIntervention(userId);

    res.json({
      success: true,
      shouldIntervene,
    });
  } catch (error: any) {
    console.error('检查干预需求失败:', error);
    res.status(500).json({
      success: false,
      message: '检查失败',
      error: error.message,
    });
  }
});

export default router;


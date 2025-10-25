// backend/src/routes/intelligent-path.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import {IUser} from '../models/User';
import { Types } from 'mongoose';
import {
  generateIntelligentPath,
} from '../utils/intelligentPathRecommender';
import KnowledgePoint from '../models/KnowledgePoint';

const router = Router();

/**
 * GET /api/intelligent-path/recommend
 * 获取智能推荐学习路径（基于机器学习）
 */
router.get('/recommend', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const userId = user._id;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const recommendations = await generateIntelligentPath(userId);

    // 获取知识点详细信息
    const detailedRecommendations = await Promise.all(
      recommendations.map(async rec => {
        const point = await KnowledgePoint.findOne({ id: rec.pointId })
          .select('title subject difficulty estimatedTime')
          .lean();

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
      success: true,
      recommendations: detailedRecommendations,
      totalCount: recommendations.length,
      algorithm: 'intelligent_ml_based',
    });
  } catch (error: any) {
    console.error('生成智能路径失败:', error);
    res.status(500).json({
      success: false,
      message: '生成智能学习路径时发生错误',
      error: error.message,
    });
  }
});

/**
 * POST /api/intelligent-path/recalibrate
 * 检查是否需要重新校准路径 (每完成3个知识点后重新校准)
 */
router.post('/recalibrate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const userId = user._id;
    const recentlyCompletedCount = parseInt(req.body.recentlyCompletedCount) || 0;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    // 简单逻辑：每完成3个知识点建议重新校准
    const needsRecalibration = recentlyCompletedCount >= 3;

    res.json({
      success: true,
      needsRecalibration,
      message: needsRecalibration
        ? '建议重新获取学习路径，系统已根据您的进步调整推荐'
        : '当前路径仍然有效',
    });
  } catch (error: any) {
    console.error('路径校准检查失败:', error);
    res.status(500).json({
      success: false,
      message: '校准检查失败',
      error: error.message,
    });
  }
});

export default router;


// backend/src/routes/learning-companion.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { Types } from 'mongoose';
import {
  generateWeeklySummary,
  generateEncouragement,
  generateCelebration,
  generateReminder,
  generateSuggestion,
  getTodayCompanionMessage,
} from '../services/learningCompanionService';

const router = Router();

/**
 * GET /api/learning-companion/today
 * 获取今日AI伙伴消息
 */
router.get('/today', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const message = await getTodayCompanionMessage(userId);

    res.json({
      success: true,
      message: message || null,
      hasMessage: message !== null,
    });
  } catch (error: any) {
    console.error('获取今日消息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取消息失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/learning-companion/weekly-summary
 * 生成每周学习总结
 */
router.post('/weekly-summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const summary = await generateWeeklySummary(userId);

    res.json({
      success: true,
      message: summary,
    });
  } catch (error: any) {
    console.error('生成每周总结失败:', error);
    res.status(500).json({
      success: false,
      message: '生成总结失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/learning-companion/encouragement
 * 获取鼓励消息
 */
router.post('/encouragement', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const encouragement = await generateEncouragement(userId);

    res.json({
      success: true,
      message: encouragement,
    });
  } catch (error: any) {
    console.error('生成鼓励消息失败:', error);
    res.status(500).json({
      success: false,
      message: '生成鼓励失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/learning-companion/celebration
 * 生成庆祝消息
 */
router.post('/celebration', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const milestone = req.body.milestone;
    if (!milestone) {
      return res.status(400).json({
        success: false,
        message: '缺少里程碑信息',
      });
    }

    const celebration = await generateCelebration(userId, milestone);

    res.json({
      success: true,
      message: celebration,
    });
  } catch (error: any) {
    console.error('生成庆祝消息失败:', error);
    res.status(500).json({
      success: false,
      message: '生成庆祝失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/learning-companion/reminder
 * 获取学习提醒
 */
router.post('/reminder', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const reminder = await generateReminder(userId);

    res.json({
      success: true,
      message: reminder,
    });
  } catch (error: any) {
    console.error('生成提醒失败:', error);
    res.status(500).json({
      success: false,
      message: '生成提醒失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/learning-companion/suggestion
 * 生成个性化建议
 */
router.post('/suggestion', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as Types.ObjectId;

    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const issue = req.body.issue;
    if (!issue) {
      return res.status(400).json({
        success: false,
        message: '缺少问题信息',
      });
    }

    const suggestion = await generateSuggestion(userId, issue);

    res.json({
      success: true,
      message: suggestion,
    });
  } catch (error: any) {
    console.error('生成建议失败:', error);
    res.status(500).json({
      success: false,
      message: '生成建议失败',
      error: error.message,
    });
  }
});

export default router;


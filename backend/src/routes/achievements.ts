// backend/src/routes/achievements.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { AchievementService } from '../services/achievementService';
import { ACHIEVEMENT_DEFINITIONS } from '../models/Achievement';
import { successResponse, errorResponse } from '../utils/response';

const router = Router();

/**
 * 获取用户所有成就
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    // 初始化成就（如果还没有）
    await AchievementService.initializeUserAchievements(userId);

    const achievements = await AchievementService.getUserAchievements(userId);

    return successResponse(res, { achievements });
  } catch (error: any) {
    console.error('[Achievements] 获取成就失败:', error.message);
    return errorResponse(res, '获取成就失败', 500, error.message);
  }
});

/**
 * 获取成就统计
 */
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const stats = await AchievementService.getUserAchievementStats(userId);

    return successResponse(res, stats);
  } catch (error: any) {
    console.error('[Achievements] 获取成就统计失败:', error.message);
    return errorResponse(res, '获取成就统计失败', 500, error.message);
  }
});

/**
 * 获取所有成就定义
 */
router.get('/definitions', async (_req: Request, res: Response) => {
  try {
    return successResponse(res, { definitions: ACHIEVEMENT_DEFINITIONS });
  } catch (error: any) {
    console.error('[Achievements] 获取成就定义失败:', error.message);
    return errorResponse(res, '获取成就定义失败', 500, error.message);
  }
});

/**
 * 手动检查并更新所有成就
 */
router.post('/check', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const newAchievements = [];

    // 检查各类成就
    newAchievements.push(...await AchievementService.checkStudyTimeAchievements(userId));
    newAchievements.push(...await AchievementService.checkKnowledgeMasterAchievements(userId));
    newAchievements.push(...await AchievementService.checkStreakAchievements(userId));

    return successResponse(res, {
      message: '成就检查完成',
      newAchievements,
    });
  } catch (error: any) {
    console.error('[Achievements] 检查成就失败:', error.message);
    return errorResponse(res, '检查成就失败', 500, error.message);
  }
});

export default router;


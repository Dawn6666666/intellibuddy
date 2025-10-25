// backend/src/routes/learning-report.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { generateLearningReport } from '../services/ai';
import { successResponse, errorResponse } from '../utils/response';
import UserProgress from '../models/UserProgress';
import StudySession from '../models/StudySession';
import WrongQuestion from '../models/WrongQuestion';
import KnowledgePoint from '../models/KnowledgePoint';

const router = Router();

/**
 * 生成 AI 学习报告
 */
router.post('/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const userName = (req as any).user.username;

    // 收集学习数据
    const [completedProgress, totalPoints, studySessions, wrongQuestions] = await Promise.all([
      UserProgress.find({ userId, status: 'completed' }),
      KnowledgePoint.countDocuments(),
      StudySession.find({ userId, endTime: { $ne: null } }),
      WrongQuestion.find({ userId }),
    ]);

    // 计算总学习时长
    const totalTime = studySessions.reduce((sum, session) => sum + session.duration, 0);

    // 分析薄弱领域
    const subjectStats = wrongQuestions.reduce((acc: any, wq) => {
      acc[wq.subject] = (acc[wq.subject] || 0) + 1;
      return acc;
    }, {});

    const weakAreas = Object.entries(subjectStats)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3)
      .map(([subject]) => subject);

    // 分析擅长领域
    const completedBySubject = completedProgress.reduce((acc: any, progress) => {
      const point = progress.pointId as any;
      if (point && point.subject) {
        acc[point.subject] = (acc[point.subject] || 0) + 1;
      }
      return acc;
    }, {});

    const strongAreas = Object.entries(completedBySubject)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3)
      .map(([subject]) => subject);

    // 近期学习进展
    const recentCompleted = completedProgress
      .sort((a, b) => new Date((b as any).updatedAt).getTime() - new Date((a as any).updatedAt).getTime())
      .slice(0, 5)
      .map((progress: any) => (progress.pointId as any)?.title || '未知知识点');

    // 生成 AI 报告
    const report = await generateLearningReport(userName, {
      totalTime,
      completedPoints: completedProgress.length,
      totalPoints,
      weakAreas,
      strongAreas,
      recentProgress: recentCompleted,
    });

    return successResponse(res, {
      report,
      stats: {
        totalTime,
        completedPoints: completedProgress.length,
        totalPoints,
        completionRate: Math.round((completedProgress.length / totalPoints) * 100),
        weakAreas,
        strongAreas,
      },
    });
  } catch (error: any) {
    console.error('[Learning Report] 生成报告失败:', error.message);
    return errorResponse(res, '生成学习报告失败', 500, error.message);
  }
});

/**
 * 获取学习统计数据
 */
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    // 最近7天的时间范围
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [completedCount, totalPoints, totalTimeResult, recentTimeResult, sessionCount, wrongQuestionsCount] = await Promise.all([
      UserProgress.countDocuments({ userId, status: 'completed' }),
      KnowledgePoint.countDocuments(),
      // 使用聚合计算总学习时长，而不是获取所有记录
      StudySession.aggregate([
        { $match: { userId, endTime: { $ne: null } } },
        { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
      ]),
      // 使用聚合计算最近7天的学习时长
      StudySession.aggregate([
        { $match: { userId, endTime: { $ne: null }, startTime: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
      ]),
      // 计算总会话数
      StudySession.countDocuments({ userId, endTime: { $ne: null } }),
      WrongQuestion.countDocuments({ userId, mastered: false }),
    ]);

    const totalTime = totalTimeResult.length > 0 ? totalTimeResult[0].totalDuration : 0;
    const recentTime = recentTimeResult.length > 0 ? recentTimeResult[0].totalDuration : 0;

    return successResponse(res, {
      totalTime,
      recentTime,
      completedPoints: completedCount,
      totalPoints,
      completionRate: totalPoints > 0 ? Math.round((completedCount / totalPoints) * 100) : 0,
      pendingWrongQuestions: wrongQuestionsCount,
      totalSessions: sessionCount,
    });
  } catch (error: any) {
    console.error('[Learning Report] 获取统计失败:', error.message);
    return errorResponse(res, '获取学习统计失败', 500, error.message);
  }
});

export default router;


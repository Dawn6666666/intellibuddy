import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getAnalytics, trackEvent } from '../middleware/analytics';
import { successResponse, errorResponse } from '../utils/response';
import User from '../models/User';
import StudySession from '../models/StudySession';
import UserProgress from '../models/UserProgress';
import WrongQuestion from '../models/WrongQuestion';

const router = Router();

/**
 * 获取系统分析数据（管理员）
 * GET /api/analytics/system
 */
router.get('/system', authMiddleware, async (req, res) => {
  try {
    const analytics = getAnalytics();
    successResponse(res, analytics);
  } catch (error) {
    console.error('获取系统分析数据失败:', error);
    errorResponse(res, '获取分析数据失败');
  }
});

/**
 * 获取用户统计数据
 * GET /api/analytics/users
 */
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await StudySession.distinct('userId', {
      startTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).then(ids => ids.length);

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });

    successResponse(res, {
      total: totalUsers,
      active: activeUsers,
      newToday: newUsersToday,
    });
  } catch (error) {
    console.error('获取用户统计失败:', error);
    errorResponse(res, '获取用户统计失败');
  }
});

/**
 * 获取学习统计数据
 * GET /api/analytics/learning
 */
router.get('/learning', authMiddleware, async (req, res) => {
  try {
    const totalSessions = await StudySession.countDocuments();
    
    // 总学习时长（秒）
    const totalDuration = await StudySession.aggregate([
      { $group: { _id: null, total: { $sum: '$duration' } } },
    ]).then(result => result[0]?.total || 0);

    // 完成的知识点数
    const completedPoints = await UserProgress.countDocuments({ status: 'completed' });

    // 错题总数
    const totalWrongQuestions = await WrongQuestion.countDocuments();

    // 今日学习数据
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todaySessions = await StudySession.countDocuments({
      startTime: { $gte: todayStart },
    });

    const todayDuration = await StudySession.aggregate([
      { $match: { startTime: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: '$duration' } } },
    ]).then(result => result[0]?.total || 0);

    successResponse(res, {
      all: {
        sessions: totalSessions,
        duration: totalDuration,
        completedPoints,
        wrongQuestions: totalWrongQuestions,
      },
      today: {
        sessions: todaySessions,
        duration: todayDuration,
      },
    });
  } catch (error) {
    console.error('获取学习统计失败:', error);
    errorResponse(res, '获取学习统计失败');
  }
});

/**
 * 获取热门知识点
 * GET /api/analytics/popular-topics
 */
router.get('/popular-topics', authMiddleware, async (req, res) => {
  try {
    const popularTopics = await StudySession.aggregate([
      { $match: { pointId: { $exists: true } } },
      { $group: { _id: '$pointId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'knowledgepoints',
          localField: '_id',
          foreignField: '_id',
          as: 'point',
        },
      },
      { $unwind: '$point' },
      {
        $project: {
          _id: 1,
          count: 1,
          title: '$point.title',
          subject: '$point.subject',
        },
      },
    ]);

    successResponse(res, popularTopics);
  } catch (error) {
    console.error('获取热门知识点失败:', error);
    errorResponse(res, '获取热门知识点失败');
  }
});

/**
 * 记录自定义事件
 * POST /api/analytics/track
 */
router.post('/track', authMiddleware, async (req, res) => {
  try {
    const { event, metadata } = req.body;
    const userId = (req as any).user.id;

    trackEvent(event, userId, metadata);

    successResponse(res, { message: '事件已记录' });
  } catch (error) {
    console.error('记录事件失败:', error);
    errorResponse(res, '记录事件失败');
  }
});

/**
 * 获取用户活跃度（按小时）
 * GET /api/analytics/hourly-activity
 */
router.get('/hourly-activity', authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const activity = await StudySession.aggregate([
      { $match: { startTime: { $gte: sevenDaysAgo } } },
      {
        $project: {
          hour: { $hour: '$startTime' },
        },
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 填充所有小时
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: activity.find(a => a._id === hour)?.count || 0,
    }));

    successResponse(res, hourlyData);
  } catch (error) {
    console.error('获取小时活跃度失败:', error);
    errorResponse(res, '获取活跃度数据失败');
  }
});

export default router;


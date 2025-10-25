import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import Feedback from '../models/Feedback';
import { IUser } from '../models/User';
import { Types } from 'mongoose';

const router = Router();

/**
 * POST /api/feedback
 * 提交反馈
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const {
      type,
      category,
      title,
      description,
      rating,
      screenshots,
      deviceInfo,
    } = req.body;

    // 验证必填字段
    if (!type || !category || !title || !description) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段',
      });
    }

    // 创建反馈
    const feedback = await Feedback.create({
      userId: user._id,
      type,
      category,
      title,
      description,
      rating,
      screenshots,
      deviceInfo,
      userAgent: req.headers['user-agent'] || 'Unknown',
      url: req.body.url || req.headers.referer || 'Unknown',
    });

    res.status(201).json({
      success: true,
      message: '反馈提交成功，感谢您的建议！',
      feedbackId: feedback._id,
    });
  } catch (error: any) {
    console.error('提交反馈失败:', error);
    res.status(500).json({
      success: false,
      message: '提交反馈失败',
      error: error.message,
    });
  }
});

/**
 * GET /api/feedback
 * 获取反馈列表（用户自己的）
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { type, status, page = 1, limit = 10 } = req.query;

    const query: any = { userId: user._id };
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      feedbacks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('获取反馈列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取反馈列表失败',
      error: error.message,
    });
  }
});

/**
 * GET /api/feedback/public
 * 获取公开反馈列表（所有用户）
 */
router.get('/public', async (req: Request, res: Response) => {
  try {
    const { type, status = 'completed', sort = 'votes', page = 1, limit = 20 } = req.query;

    const query: any = { status };
    if (type) query.type = type;

    const sortOptions: any = {};
    if (sort === 'votes') sortOptions.votes = -1;
    else if (sort === 'recent') sortOptions.createdAt = -1;
    else sortOptions.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const feedbacks = await Feedback.find(query)
      .select('type category title description status votes tags createdAt resolvedAt')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      feedbacks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('获取公开反馈列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取公开反馈列表失败',
      error: error.message,
    });
  }
});

/**
 * GET /api/feedback/:id
 * 获取反馈详情
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const feedback = await Feedback.findById(id)
      .populate('userId', 'username avatarUrl')
      .lean();

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: '反馈不存在',
      });
    }

    // 只允许查看自己的反馈或公开的反馈
    if (feedback.userId._id.toString() !== user._id.toString() && feedback.status !== 'completed') {
      return res.status(403).json({
        success: false,
        message: '无权查看此反馈',
      });
    }

    res.json({
      success: true,
      feedback,
    });
  } catch (error: any) {
    console.error('获取反馈详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取反馈详情失败',
      error: error.message,
    });
  }
});

/**
 * POST /api/feedback/:id/vote
 * 投票支持反馈
 */
router.post('/:id/vote', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: '反馈不存在',
      });
    }

    // 检查是否已投票
    const userObjectId = new Types.ObjectId(user._id);
    const hasVoted = feedback.voters.some(voterId => voterId.equals(userObjectId));

    if (hasVoted) {
      // 取消投票
      feedback.voters = feedback.voters.filter(voterId => !voterId.equals(userObjectId));
      feedback.votes = Math.max(0, feedback.votes - 1);
    } else {
      // 添加投票
      feedback.voters.push(userObjectId);
      feedback.votes += 1;
    }

    await feedback.save();

    res.json({
      success: true,
      message: hasVoted ? '已取消投票' : '投票成功',
      votes: feedback.votes,
      hasVoted: !hasVoted,
    });
  } catch (error: any) {
    console.error('投票失败:', error);
    res.status(500).json({
      success: false,
      message: '投票失败',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/feedback/:id
 * 删除反馈（仅自己的反馈）
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: '反馈不存在',
      });
    }

    // 只允许删除自己的反馈
    if (feedback.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权删除此反馈',
      });
    }

    // 只允许删除待处理的反馈
    if (feedback.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '只能删除待处理的反馈',
      });
    }

    await Feedback.findByIdAndDelete(id);

    res.json({
      success: true,
      message: '反馈已删除',
    });
  } catch (error: any) {
    console.error('删除反馈失败:', error);
    res.status(500).json({
      success: false,
      message: '删除反馈失败',
      error: error.message,
    });
  }
});

/**
 * GET /api/feedback/stats/summary
 * 获取反馈统计数据
 */
router.get('/stats/summary', async (_req: Request, res: Response) => {
  try {
    const [total, byType, byStatus, topVoted] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Feedback.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Feedback.find()
        .select('title description votes type status')
        .sort({ votes: -1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        byType: byType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        topVoted,
      },
    });
  } catch (error: any) {
    console.error('获取反馈统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取反馈统计失败',
      error: error.message,
    });
  }
});

export default router;



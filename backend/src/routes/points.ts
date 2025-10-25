import express from 'express';
import Points from '../models/Points';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// 获取我的积分信息
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    let points = await Points.findOne({ userId });
    
    // 如果没有积分记录，创建一个
    if (!points) {
      const levelInfo = (Points as any).getLevelInfo(0);
      points = new Points({
        userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        level: levelInfo.level,
        levelName: levelInfo.name,
        nextLevelPoints: levelInfo.nextLevelPoints,
        history: []
      });
      await points.save();
    }

    res.json(points);
  } catch (error) {
    console.error('获取积分信息失败:', error);
    res.status(500).json({ error: '获取积分信息失败' });
  }
});

// 获取积分历史
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { page = 1, limit = 20, type } = req.query;

    const points = await Points.findOne({ userId });
    if (!points) {
      return res.json({ history: [], total: 0 });
    }

    let history = points.history;
    
    // 按类型过滤
    if (type && ['earn', 'spend', 'expire'].includes(type as string)) {
      history = history.filter(h => h.type === type);
    }

    // 排序（最新的在前）
    history = history.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 分页
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedHistory = history.slice(startIndex, endIndex);

    res.json({
      history: paginatedHistory,
      total: history.length,
      page: pageNum,
      totalPages: Math.ceil(history.length / limitNum)
    });
  } catch (error) {
    console.error('获取积分历史失败:', error);
    res.status(500).json({ error: '获取积分历史失败' });
  }
});

// 赚取积分（系统调用）
router.post('/earn', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { amount, reason, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '积分数量必须大于0' });
    }

    if (!reason) {
      return res.status(400).json({ error: '请提供积分获取原因' });
    }

    let points = await Points.findOne({ userId });
    if (!points) {
      const levelInfo = (Points as any).getLevelInfo(0);
      points = new Points({
        userId,
        level: levelInfo.level,
        levelName: levelInfo.name,
        nextLevelPoints: levelInfo.nextLevelPoints
      });
    }

    await points.addPoints(amount, reason, description);

    res.json({
      message: '积分获取成功',
      points: {
        balance: points.balance,
        earned: amount,
        level: points.level,
        levelName: points.levelName
      }
    });
  } catch (error) {
    console.error('赚取积分失败:', error);
    res.status(500).json({ error: '赚取积分失败' });
  }
});

// 消费积分
router.post('/spend', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { amount, reason, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '积分数量必须大于0' });
    }

    if (!reason) {
      return res.status(400).json({ error: '请提供积分消费原因' });
    }

    const points = await Points.findOne({ userId });
    if (!points) {
      return res.status(404).json({ error: '积分信息不存在' });
    }

    if (points.balance < amount) {
      return res.status(400).json({ error: '积分不足' });
    }

    await points.spendPoints(amount, reason, description);

    res.json({
      message: '积分消费成功',
      points: {
        balance: points.balance,
        spent: amount
      }
    });
  } catch (error: any) {
    console.error('消费积分失败:', error);
    res.status(500).json({ error: error.message || '消费积分失败' });
  }
});

// 获取积分规则
router.get('/rules', async (req, res) => {
  try {
    const rules = [
      {
        category: '学习活动',
        items: [
          { action: '完成一个知识点学习', points: 10, description: '首次完成该知识点学习' },
          { action: '知识点掌握度达到80%', points: 20, description: '单个知识点掌握度达标' },
          { action: '知识点掌握度达到100%', points: 50, description: '完全掌握一个知识点' },
          { action: '连续学习7天', points: 100, description: '保持学习习惯' },
          { action: '单日学习超过1小时', points: 30, description: '每日学习时长奖励' }
        ]
      },
      {
        category: '练习与测试',
        items: [
          { action: '完成一次练习', points: 5, description: '完成任意练习' },
          { action: '练习得分90分以上', points: 15, description: '优秀成绩奖励' },
          { action: '改正一个错题', points: 8, description: '错题订正奖励' },
          { action: '完成AI智能出题', points: 12, description: '使用AI功能' }
        ]
      },
      {
        category: '社交互动',
        items: [
          { action: '邀请好友注册', points: 200, description: '成功邀请新用户' },
          { action: '提交反馈建议', points: 50, description: '帮助改进产品' },
          { action: '分享学习成果', points: 20, description: '分享到社交平台' }
        ]
      },
      {
        category: '成就解锁',
        items: [
          { action: '解锁青铜成就', points: 50, description: '完成基础成就' },
          { action: '解锁白银成就', points: 100, description: '完成进阶成就' },
          { action: '解锁黄金成就', points: 200, description: '完成高级成就' },
          { action: '解锁钻石成就', points: 500, description: '完成顶级成就' }
        ]
      }
    ];

    res.json(rules);
  } catch (error) {
    console.error('获取积分规则失败:', error);
    res.status(500).json({ error: '获取积分规则失败' });
  }
});

// 获取等级排行榜
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const userId = req.user!.userId;

    // 获取排行榜
    const topUsers = await Points.find()
      .sort({ totalEarned: -1 })
      .limit(parseInt(limit as string))
      .populate('userId', 'username avatar');

    // 获取当前用户排名
    const allUsers = await Points.find().sort({ totalEarned: -1 });
    const myRank = allUsers.findIndex(p => p.userId.toString() === userId) + 1;
    const myPoints = await Points.findOne({ userId });

    res.json({
      leaderboard: topUsers.map((p, index) => ({
        rank: index + 1,
        userId: p.userId,
        level: p.level,
        levelName: p.levelName,
        totalPoints: p.totalEarned
      })),
      myRank: {
        rank: myRank || null,
        level: myPoints?.level || 1,
        levelName: myPoints?.levelName || '初学者',
        totalPoints: myPoints?.totalEarned || 0
      }
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ error: '获取排行榜失败' });
  }
});

// 兑换商品（示例）
router.post('/redeem', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { itemId, itemName, cost } = req.body;

    if (!itemId || !cost || cost <= 0) {
      return res.status(400).json({ error: '无效的兑换请求' });
    }

    const points = await Points.findOne({ userId });
    if (!points) {
      return res.status(404).json({ error: '积分信息不存在' });
    }

    if (points.balance < cost) {
      return res.status(400).json({ error: '积分不足' });
    }

    await points.spendPoints(cost, 'redeem', `兑换：${itemName}`);

    res.json({
      message: '兑换成功',
      item: { itemId, itemName, cost },
      remainingPoints: points.balance
    });
  } catch (error: any) {
    console.error('兑换失败:', error);
    res.status(500).json({ error: error.message || '兑换失败' });
  }
});

// 获取可兑换商品列表
router.get('/shop', authMiddleware, async (req, res) => {
  try {
    const items = [
      {
        id: 'theme_1',
        name: '星空主题',
        description: '解锁精美的星空主题',
        cost: 500,
        category: 'theme',
        image: '/themes/starry.png'
      },
      {
        id: 'theme_2',
        name: '海洋主题',
        description: '解锁清新的海洋主题',
        cost: 500,
        category: 'theme',
        image: '/themes/ocean.png'
      },
      {
        id: 'badge_1',
        name: '学霸徽章',
        description: '展示你的学习成就',
        cost: 1000,
        category: 'badge',
        image: '/badges/scholar.png'
      },
      {
        id: 'vip_trial',
        name: '7天VIP体验',
        description: '体验高级会员功能',
        cost: 2000,
        category: 'membership',
        image: '/items/vip-trial.png'
      },
      {
        id: 'ai_boost',
        name: 'AI提问次数+50',
        description: '额外增加50次AI提问机会',
        cost: 800,
        category: 'boost',
        image: '/items/ai-boost.png'
      }
    ];

    res.json(items);
  } catch (error) {
    console.error('获取商品列表失败:', error);
    res.status(500).json({ error: '获取商品列表失败' });
  }
});

export default router;


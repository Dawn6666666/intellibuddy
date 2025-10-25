import express from 'express';
import Membership from '../models/Membership';
import Points from '../models/Points';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// 获取我的会员信息
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    let membership = await Membership.findOne({ userId });
    
    // 如果没有会员记录，创建免费会员
    if (!membership) {
      const features = (Membership as any).getTierFeatures('free');
      membership = new Membership({
        userId,
        tier: 'free',
        features,
        usage: {
          knowledgePoints: 0,
          aiQuestions: 0,
          lastResetDate: new Date()
        }
      });
      await membership.save();
    }

    // 检查是否过期
    if (membership.endDate && membership.endDate < new Date()) {
      membership.status = 'expired';
      membership.tier = 'free';
      membership.features = (Membership as any).getTierFeatures('free');
      await membership.save();
    }

    res.json(membership);
  } catch (error) {
    console.error('获取会员信息失败:', error);
    res.status(500).json({ error: '获取会员信息失败' });
  }
});

// 获取所有会员套餐
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        tier: 'free',
        name: '免费版',
        price: 0,
        period: '永久',
        features: (Membership as any).getTierFeatures('free'),
        description: '适合初学者，体验基础功能'
      },
      {
        tier: 'basic',
        name: '基础版',
        price: 29,
        period: '月',
        features: (Membership as any).getTierFeatures('basic'),
        description: '适合日常学习，解锁更多功能'
      },
      {
        tier: 'premium',
        name: '高级版',
        price: 99,
        period: '月',
        features: (Membership as any).getTierFeatures('premium'),
        description: '适合深度学习，享受全部特权'
      },
      {
        tier: 'enterprise',
        name: '企业版',
        price: 999,
        period: '年',
        features: (Membership as any).getTierFeatures('enterprise'),
        description: '适合团队使用，无限制使用'
      }
    ];

    res.json(plans);
  } catch (error) {
    console.error('获取套餐列表失败:', error);
    res.status(500).json({ error: '获取套餐列表失败' });
  }
});

// 升级会员（简化版，实际需要对接支付）
router.post('/upgrade', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { tier, period = 'month' } = req.body;

    if (!['basic', 'premium', 'enterprise'].includes(tier)) {
      return res.status(400).json({ error: '无效的会员等级' });
    }

    let membership = await Membership.findOne({ userId });
    if (!membership) {
      membership = new Membership({ userId });
    }

    // 计算结束时间
    const startDate = new Date();
    const endDate = new Date();
    if (period === 'month') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (period === 'year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // 更新会员信息
    membership.tier = tier as any;
    membership.status = 'active';
    membership.startDate = startDate;
    membership.endDate = endDate;
    membership.features = (Membership as any).getTierFeatures(tier);

    // 添加交易记录（简化版）
    const prices: any = {
      basic: { month: 29, year: 290 },
      premium: { month: 99, year: 990 },
      enterprise: { year: 999 }
    };
    const amount = prices[tier][period] || 0;

    membership.transactions.push({
      transactionId: `TXN${Date.now()}`,
      amount,
      currency: 'CNY',
      status: 'completed',
      createdAt: new Date()
    });

    await membership.save();

    // 赠送积分
    const points = await Points.findOne({ userId });
    if (points) {
      await points.addPoints(amount * 10, 'membership_upgrade', `升级到${tier}会员`);
    }

    res.json({
      message: '会员升级成功',
      membership
    });
  } catch (error) {
    console.error('升级会员失败:', error);
    res.status(500).json({ error: '升级会员失败' });
  }
});

// 取消会员
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.status(404).json({ error: '会员信息不存在' });
    }

    if (membership.tier === 'free') {
      return res.status(400).json({ error: '免费会员无需取消' });
    }

    membership.status = 'cancelled';
    membership.autoRenew = false;
    await membership.save();

    res.json({ message: '会员已取消，将在到期后失效' });
  } catch (error) {
    console.error('取消会员失败:', error);
    res.status(500).json({ error: '取消会员失败' });
  }
});

// 检查使用限制
router.post('/check-limit', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { type } = req.body; // 'knowledgePoints' | 'aiQuestions'

    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.json({ allowed: false, reason: '会员信息不存在' });
    }

    // 检查是否需要重置使用量（每月重置）
    const now = new Date();
    const lastReset = membership.usage.lastResetDate;
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      membership.usage.knowledgePoints = 0;
      membership.usage.aiQuestions = 0;
      membership.usage.lastResetDate = now;
      await membership.save();
    }

    const maxLimit = type === 'knowledgePoints' 
      ? membership.features.maxKnowledgePoints
      : membership.features.maxAIQuestions;

    const currentUsage = type === 'knowledgePoints'
      ? membership.usage.knowledgePoints
      : membership.usage.aiQuestions;

    // -1 表示无限制
    if (maxLimit === -1) {
      return res.json({ allowed: true });
    }

    if (currentUsage >= maxLimit) {
      return res.json({
        allowed: false,
        reason: `已达到${type === 'knowledgePoints' ? '知识点' : 'AI提问'}数量上限`,
        current: currentUsage,
        max: maxLimit
      });
    }

    res.json({ allowed: true, current: currentUsage, max: maxLimit });
  } catch (error) {
    console.error('检查限制失败:', error);
    res.status(500).json({ error: '检查限制失败' });
  }
});

// 增加使用量
router.post('/increment-usage', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { type } = req.body;

    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.status(404).json({ error: '会员信息不存在' });
    }

    if (type === 'knowledgePoints') {
      membership.usage.knowledgePoints++;
    } else if (type === 'aiQuestions') {
      membership.usage.aiQuestions++;
    }

    await membership.save();
    res.json({ success: true });
  } catch (error) {
    console.error('增加使用量失败:', error);
    res.status(500).json({ error: '增加使用量失败' });
  }
});

// 获取会员统计
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.status(404).json({ error: '会员信息不存在' });
    }

    const stats = {
      tier: membership.tier,
      status: membership.status,
      daysRemaining: membership.endDate 
        ? Math.ceil((membership.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
      usage: {
        knowledgePoints: {
          current: membership.usage.knowledgePoints,
          max: membership.features.maxKnowledgePoints,
          percentage: membership.features.maxKnowledgePoints === -1 
            ? 0 
            : (membership.usage.knowledgePoints / membership.features.maxKnowledgePoints) * 100
        },
        aiQuestions: {
          current: membership.usage.aiQuestions,
          max: membership.features.maxAIQuestions,
          percentage: membership.features.maxAIQuestions === -1 
            ? 0 
            : (membership.usage.aiQuestions / membership.features.maxAIQuestions) * 100
        }
      },
      totalSpent: membership.transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('获取会员统计失败:', error);
    res.status(500).json({ error: '获取会员统计失败' });
  }
});

export default router;


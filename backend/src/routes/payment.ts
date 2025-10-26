import express, { Request, Response } from 'express';
import stripe, { STRIPE_PRICES, PRICE_CONFIG } from '../config/stripe';
import Membership from '../models/Membership';
import Points, { IPoints } from '../models/Points';
import User, { IUser } from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// 扩展 Request 类型，使 user 指向 IUser 对象
interface AuthRequest extends Request {
  user?: IUser;
}

// Stripe 可用性检查中间件
const checkStripeAvailable = (req: Request, res: Response, next: any) => {
  if (!stripe) {
    return res.status(503).json({ 
      error: 'Stripe 支付功能未配置',
      message: '请联系管理员配置 Stripe 密钥'
    });
  }
  next();
};

// 创建支付会话
router.post('/create-checkout-session', authMiddleware, checkStripeAvailable, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { tier, period } = req.body;

    if (!['basic', 'premium', 'enterprise'].includes(tier)) {
      return res.status(400).json({ error: '无效的会员等级' });
    }

    if (!['month', 'year'].includes(period)) {
      return res.status(400).json({ error: '无效的订阅周期' });
    }

    // 验证价格 ID 是否存在
    const priceId = (STRIPE_PRICES as any)[tier]?.[period];
    if (!priceId) {
      return res.status(400).json({ error: '无效的价格配置' });
    }

    // 获取用户信息
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 创建 Stripe Checkout 会话
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      customer_email: user.email,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        tier,
        period,
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('创建支付会话失败:', error);
    res.status(500).json({ error: '创建支付会话失败' });
  }
});

// 验证支付会话
router.get('/verify-session/:sessionId', authMiddleware, checkStripeAvailable, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // 支付成功，处理会员升级
      const { userId, tier, period } = session.metadata as any;

      if (!userId || !tier || !period) {
        return res.status(400).json({ error: '无效的会话元数据' });
      }

      // 更新会员信息
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
      membership.paymentMethod = 'stripe';

      // 添加交易记录
      const amount = session.amount_total || 0;
      membership.transactions.push({
        transactionId: session.id,
        amount: amount / 100, // Stripe 金额是分为单位
        currency: session.currency?.toUpperCase() || 'CNY',
        status: 'completed',
        createdAt: new Date(),
      });

      await membership.save();

      // 赠送积分
      let points = await Points.findOne({ userId });
      if (!points) {
        points = new Points({ userId });
      }
      const pointsToAdd = Math.floor(amount / 10);
      points.balance += pointsToAdd;
      points.totalEarned += pointsToAdd;
      points.history.push({
        type: 'earn',
        amount: pointsToAdd,
        reason: 'membership_upgrade',
        description: `升级到${tier}会员`,
        createdAt: new Date(),
      });
      
      // 更新等级
      const levelInfo = (Points as any).getLevelInfo(points.totalEarned);
      points.level = levelInfo.level;
      points.levelName = levelInfo.name;
      points.nextLevelPoints = levelInfo.nextLevelPoints;
      
      await points.save();

      res.json({
        success: true,
        message: '支付成功',
        membership,
      });
    } else {
      res.json({
        success: false,
        message: '支付未完成',
        status: session.payment_status,
      });
    }
  } catch (error) {
    console.error('验证支付会话失败:', error);
    res.status(500).json({ error: '验证支付会话失败' });
  }
});

// Stripe Webhook 处理器
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // 检查 Stripe 是否可用
  if (!stripe) {
    console.error('[Stripe Webhook] Stripe 未配置');
    return res.status(503).send('Stripe not configured');
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Missing stripe-signature header');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook 签名验证失败:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 处理事件
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      console.log('支付完成:', session.id);

      // 处理支付成功逻辑
      const { userId, tier, period } = session.metadata;

      if (userId && tier && period) {
        try {
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

          membership.tier = tier as any;
          membership.status = 'active';
          membership.startDate = startDate;
          membership.endDate = endDate;
          membership.features = (Membership as any).getTierFeatures(tier);
          membership.paymentMethod = 'stripe';

          const amount = session.amount_total || 0;
          membership.transactions.push({
            transactionId: session.id,
            amount: amount / 100,
            currency: session.currency?.toUpperCase() || 'CNY',
            status: 'completed',
            createdAt: new Date(),
          });

          await membership.save();

          // 赠送积分
          let points = await Points.findOne({ userId });
          if (!points) {
            points = new Points({ userId });
          }
          const pointsToAdd = Math.floor(amount / 10);
          points.balance += pointsToAdd;
          points.totalEarned += pointsToAdd;
          points.history.push({
            type: 'earn',
            amount: pointsToAdd,
            reason: 'membership_upgrade',
            description: `升级到${tier}会员`,
            createdAt: new Date(),
          });
          
          // 更新等级
          const levelInfo = (Points as any).getLevelInfo(points.totalEarned);
          points.level = levelInfo.level;
          points.levelName = levelInfo.name;
          points.nextLevelPoints = levelInfo.nextLevelPoints;
          
          await points.save();

          console.log(`会员升级成功: userId=${userId}, tier=${tier}`);
        } catch (error) {
          console.error('处理支付成功事件失败:', error);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('支付失败:', paymentIntent.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      console.log('订阅取消:', subscription.id);
      // 处理订阅取消逻辑
      break;
    }

    default:
      console.log(`未处理的事件类型: ${event.type}`);
  }

  res.json({ received: true });
});

// 获取价格列表
router.get('/prices', async (req, res) => {
  try {
    res.json(PRICE_CONFIG);
  } catch (error) {
    console.error('获取价格列表失败:', error);
    res.status(500).json({ error: '获取价格列表失败' });
  }
});

// 获取用户的支付历史
router.get('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return res.json({ transactions: [] });
    }

    // 返回交易记录，按时间倒序排列
    const transactions = membership.transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(t => ({
        id: t.transactionId,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        createdAt: t.createdAt,
      }));

    res.json({ transactions });
  } catch (error) {
    console.error('获取支付历史失败:', error);
    res.status(500).json({ error: '获取支付历史失败' });
  }
});

// 取消订阅（如果将来支持订阅模式）
router.post('/cancel-subscription', authMiddleware, checkStripeAvailable, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const membership = await Membership.findOne({ userId });
    if (!membership || membership.status !== 'active') {
      return res.status(404).json({ error: '未找到有效的会员订阅' });
    }

    // 更新会员状态为已取消
    membership.status = 'cancelled';
    await membership.save();

    res.json({
      success: true,
      message: '订阅已取消',
      membership,
    });
  } catch (error) {
    console.error('取消订阅失败:', error);
    res.status(500).json({ error: '取消订阅失败' });
  }
});

export default router;


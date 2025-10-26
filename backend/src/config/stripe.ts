import Stripe from 'stripe';

// 初始化 Stripe（仅在配置了密钥时初始化）
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;

if (stripeSecretKey && stripeSecretKey !== 'your-stripe-secret-key') {
  try {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
    console.log('[Stripe] ✅ Stripe SDK 初始化成功');
  } catch (error) {
    console.warn('[Stripe] ⚠️ Stripe SDK 初始化失败:', error);
  }
} else {
  console.warn('[Stripe] ⚠️ 未配置 STRIPE_SECRET_KEY，支付功能将不可用');
  console.warn('[Stripe] 💡 提示：请在 backend/.env 文件中配置 Stripe 密钥');
}

export default stripe;

// Stripe 产品和价格 ID 映射
export const STRIPE_PRICES = {
  basic: {
    month: process.env.STRIPE_PRICE_BASIC_MONTH || '',
    year: process.env.STRIPE_PRICE_BASIC_YEAR || '',
  },
  premium: {
    month: process.env.STRIPE_PRICE_PREMIUM_MONTH || '',
    year: process.env.STRIPE_PRICE_PREMIUM_YEAR || '',
  },
  enterprise: {
    year: process.env.STRIPE_PRICE_ENTERPRISE_YEAR || '',
  },
};

// 价格配置（用于显示）
export const PRICE_CONFIG = {
  basic: {
    month: { amount: 2900, currency: 'CNY', display: '¥29' },
    year: { amount: 29000, currency: 'CNY', display: '¥290' },
  },
  premium: {
    month: { amount: 9900, currency: 'CNY', display: '¥99' },
    year: { amount: 99000, currency: 'CNY', display: '¥990' },
  },
  enterprise: {
    year: { amount: 99900, currency: 'CNY', display: '¥999' },
  },
};


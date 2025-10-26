<template>
  <div class="upgrade-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="icon-badge">
          <i class="fa-solid fa-crown"></i>
        </div>
        <div>
          <h1>升级会员</h1>
          <p>解锁更多功能，提升学习体验</p>
        </div>
      </div>
    </div>

    <!-- 当前会员状态 -->
    <div class="current-membership glass-effect" v-if="currentMembership">
      <div class="membership-badge" :class="`tier-${currentMembership.tier}`">
        <i class="fa-solid fa-crown"></i>
        <span>{{ getTierName(currentMembership.tier) }}</span>
      </div>
      <div class="membership-info">
        <div class="info-item">
          <span class="label">状态</span>
          <span class="value" :class="`status-${currentMembership.status}`">
            {{ getStatusName(currentMembership.status) }}
          </span>
        </div>
        <div class="info-item" v-if="currentMembership.endDate">
          <span class="label">到期时间</span>
          <span class="value">{{ formatDate(currentMembership.endDate) }}</span>
        </div>
      </div>
    </div>

    <!-- 会员套餐卡片 -->
    <div class="plans-grid">
      <div 
        v-for="plan in plans" 
        :key="plan.tier" 
        class="plan-card glass-effect"
        :class="{ 
          'current-plan': currentMembership?.tier === plan.tier,
          'recommended': plan.tier === 'premium'
        }"
      >
        <!-- 推荐标签 -->
        <div v-if="plan.tier === 'premium'" class="recommended-badge">
          <i class="fa-solid fa-star"></i>
          <span>推荐</span>
        </div>

        <!-- 套餐头部 -->
        <div class="plan-header">
          <div class="plan-icon" :class="`tier-${plan.tier}`">
            <i :class="getPlanIcon(plan.tier)"></i>
          </div>
          <h3>{{ plan.name }}</h3>
          <p class="plan-description">{{ plan.description }}</p>
        </div>

        <!-- 价格 -->
        <div class="plan-pricing">
          <div class="price-selector">
            <button 
              v-if="plan.prices.month"
              class="period-btn"
              :class="{ active: selectedPeriods[plan.tier] === 'month' }"
              @click="selectedPeriods[plan.tier] = 'month'"
            >
              月付
            </button>
            <button 
              v-if="plan.prices.year"
              class="period-btn"
              :class="{ active: selectedPeriods[plan.tier] === 'year' }"
              @click="selectedPeriods[plan.tier] = 'year'"
            >
              年付
              <span v-if="plan.tier !== 'free'" class="save-badge">省17%</span>
            </button>
          </div>
          <div class="price-display">
            <span class="currency">¥</span>
            <span class="amount">{{ getPriceAmount(plan, selectedPeriods[plan.tier]) }}</span>
            <span class="period" v-if="plan.tier !== 'free'">
              /{{ selectedPeriods[plan.tier] === 'month' ? '月' : '年' }}
            </span>
          </div>
          <div v-if="plan.tier !== 'free' && selectedPeriods[plan.tier] === 'year'" class="year-price-hint">
            平均 ¥{{ Math.floor(getPriceAmount(plan, 'year') / 12) }}/月
          </div>
        </div>

        <!-- 功能列表 -->
        <div class="plan-features">
          <div 
            v-for="(feature, index) in plan.features" 
            :key="index"
            class="feature-item"
          >
            <i class="fa-solid fa-check"></i>
            <span>{{ feature }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="plan-actions">
          <button
            v-if="plan.tier === 'free'"
            class="plan-btn disabled"
            disabled
          >
            当前套餐
          </button>
          <button
            v-else-if="currentMembership?.tier === plan.tier && currentMembership?.status === 'active'"
            class="plan-btn current"
            disabled
          >
            <i class="fa-solid fa-check"></i>
            当前套餐
          </button>
          <button
            v-else
            class="plan-btn"
            :class="`tier-${plan.tier}`"
            @click="startUpgrade(plan.tier, selectedPeriods[plan.tier])"
            :disabled="processing"
          >
            <i v-if="processing" class="fa-solid fa-spinner fa-spin"></i>
            <span v-else>立即升级</span>
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ 区域 -->
    <div class="faq-section glass-effect">
      <h2>
        <i class="fa-solid fa-circle-question"></i>
        常见问题
      </h2>
      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <div class="faq-question" @click="toggleFaq(index)">
            <span>{{ faq.question }}</span>
            <i class="fa-solid" :class="activeFaq === index ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </div>
          <transition name="faq">
            <div v-if="activeFaq === index" class="faq-answer">
              {{ faq.answer }}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { createCheckoutSession } from '@/services/payment';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// 状态
const processing = ref(false);
const currentMembership = ref<any>(null);
const activeFaq = ref<number | null>(null);

// 选中的周期
const selectedPeriods = reactive<Record<string, string>>({
  free: 'month',
  basic: 'month',
  premium: 'month',
  enterprise: 'year',
});

// 套餐列表
const plans = ref([
  {
    tier: 'free',
    name: '免费版',
    description: '适合初学者，体验基础功能',
    prices: { month: 0 },
    features: [
      '50 个知识点访问',
      '20 次 AI 提问',
      '基础学习报告',
      '社区支持',
    ],
  },
  {
    tier: 'basic',
    name: '基础版',
    description: '适合日常学习，解锁更多功能',
    prices: { month: 19, year: 199 },
    features: [
      '200 个知识点访问',
      '100 次 AI 提问',
      '高级数据分析',
      '自定义主题',
      '导出学习数据',
      '无广告体验',
    ],
  },
  {
    tier: 'premium',
    name: '高级版',
    description: '适合深度学习，享受全部特权',
    prices: { month: 49, year: 499 },
    features: [
      '1000 个知识点访问',
      '500 次 AI 提问',
      '全部高级功能',
      '优先技术支持',
      'AI 学习路径规划',
      '学习小组功能',
      '思维导图工具',
    ],
  },
  {
    tier: 'enterprise',
    name: '企业版',
    description: '适合团队使用，无限制使用',
    prices: { year: 1999 },
    features: [
      '无限知识点访问',
      '无限 AI 提问',
      '全部功能解锁',
      '专属客户经理',
      '定制化服务',
      '团队协作工具',
      'API 接口访问',
      '数据安全保障',
    ],
  },
]);

// FAQ 列表
const faqs = [
  {
    question: '如何选择合适的套餐？',
    answer: '免费版适合刚开始学习的用户；基础版适合有稳定学习需求的用户；高级版适合深度学习者；企业版适合团队使用。您可以先从免费版开始，随时升级。',
  },
  {
    question: '支付安全吗？',
    answer: '我们使用 Stripe 作为支付服务商，Stripe 是全球领先的支付平台，符合 PCI DSS 标准，确保您的支付信息安全。',
  },
  {
    question: '可以随时取消吗？',
    answer: '可以。您可以随时在个人中心取消订阅，取消后会员将在当前周期结束后失效，不会自动续费。',
  },
  {
    question: '升级后原有数据会保留吗？',
    answer: '会的。升级会员不会影响您的学习数据，所有学习进度、成就、错题本等数据都会完整保留。',
  },
];

// 获取当前会员信息
const fetchMembership = async () => {
  try {
    const response = await axios.get(`${API_URL}/membership/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    currentMembership.value = response.data;
  } catch (error) {
    console.error('获取会员信息失败:', error);
  }
};

// 开始升级
const startUpgrade = async (tier: string, period: string) => {
  if (processing.value) return;

  // 验证登录状态
  const token = localStorage.getItem('authToken');
  if (!token) {
    ElMessage.warning('请先登录');
    return;
  }

  try {
    processing.value = true;
    ElMessage.info('正在创建支付会话...');

    // 创建支付会话
    const data = await createCheckoutSession(tier, period);

    // 跳转到 Stripe 支付页面
    if (data.url) {
      ElMessage.success('正在跳转到支付页面...');
      window.location.href = data.url;
    } else {
      throw new Error('未返回支付链接');
    }
  } catch (error: any) {
    processing.value = false;
    
    // 更详细的错误处理
    let errorMessage = '创建支付会话失败';
    if (error.message.includes('网络')) {
      errorMessage = '网络连接失败，请检查您的网络';
    } else if (error.message.includes('未授权') || error.message.includes('Token')) {
      errorMessage = '登录已过期，请重新登录';
      // 可选：清除 token 并跳转到登录页
      // localStorage.removeItem('authToken');
      // router.push('/login');
    } else if (error.message.includes('无效')) {
      errorMessage = '参数错误，请刷新页面后重试';
    } else {
      errorMessage = error.message || '创建支付会话失败，请稍后重试';
    }
    
    ElMessage.error(errorMessage);
    console.error('支付错误:', error);
  }
};

// 获取价格金额
const getPriceAmount = (plan: any, period: string) => {
  return plan.prices[period] || 0;
};

// 获取套餐图标
const getPlanIcon = (tier: string) => {
  const icons: Record<string, string> = {
    free: 'fa-solid fa-user',
    basic: 'fa-solid fa-star',
    premium: 'fa-solid fa-crown',
    enterprise: 'fa-solid fa-building',
  };
  return icons[tier] || 'fa-solid fa-star';
};

// 获取等级名称
const getTierName = (tier: string) => {
  const names: Record<string, string> = {
    free: '免费版',
    basic: '基础版',
    premium: '高级版',
    enterprise: '企业版',
  };
  return names[tier] || tier;
};

// 获取状态名称
const getStatusName = (status: string) => {
  const names: Record<string, string> = {
    active: '生效中',
    expired: '已过期',
    cancelled: '已取消',
  };
  return names[status] || status;
};

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN');
};

// 切换FAQ
const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

onMounted(() => {
  fetchMembership();
});
</script>

<style scoped>
.upgrade-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* 页面标题 */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-badge {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.page-header p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
}

/* 当前会员状态 */
.current-membership {
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.membership-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
}

.membership-badge.tier-free {
  background: var(--info-bg);
  color: var(--info-color);
}

.membership-badge.tier-basic {
  background: var(--primary-bg-light);
  color: var(--primary-color);
}

.membership-badge.tier-premium {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
}

.membership-badge.tier-enterprise {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
}

.membership-info {
  display: flex;
  gap: 3rem;
  flex: 1;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.info-item .value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.status-active {
  color: var(--success-color);
}

.status-expired {
  color: var(--danger-color);
}

.status-cancelled {
  color: var(--warning-color);
}

/* 套餐网格 */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* 套餐卡片 */
.plan-card {
  padding: 2rem;
  border-radius: 16px;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(138, 127, 251, 0.2);
}

.plan-card.recommended {
  border: 2px solid var(--primary-color);
}

.recommended-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 套餐头部 */
.plan-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.plan-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.plan-icon.tier-free {
  background: linear-gradient(135deg, #94a3b8, #64748b);
}

.plan-icon.tier-basic {
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
}

.plan-icon.tier-premium {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
}

.plan-icon.tier-enterprise {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.plan-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.plan-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 价格部分 */
.plan-pricing {
  text-align: center;
  margin-bottom: 1.5rem;
}

.price-selector {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.period-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.period-btn.active {
  background: var(--primary-bg-light);
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
}

.save-badge {
  background: var(--success-color);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.price-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin: 1rem 0 0.5rem;
}

.currency {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.amount {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.period {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-left: 0.25rem;
}

.year-price-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 功能列表 */
.plan-features {
  flex: 1;
  margin-bottom: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--card-border);
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-item i {
  color: var(--success-color);
  flex-shrink: 0;
}

.feature-item span {
  font-size: 0.875rem;
  color: var(--text-primary);
}

/* 操作按钮 */
.plan-actions {
  margin-top: auto;
}

.plan-btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.plan-btn.tier-basic {
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  color: white;
}

.plan-btn.tier-premium {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
}

.plan-btn.tier-enterprise {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
}

.plan-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(138, 127, 251, 0.3);
}

.plan-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.plan-btn.disabled,
.plan-btn.current {
  background: var(--card-bg);
  color: var(--text-secondary);
  cursor: not-allowed;
}

/* FAQ 部分 */
.faq-section {
  padding: 2rem;
  border-radius: 16px;
}

.faq-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid var(--card-border);
  border-radius: 12px;
  overflow: hidden;
}

.faq-question {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
}

.faq-question:hover {
  background: var(--hover-bg);
}

.faq-question span {
  font-weight: 600;
  color: var(--text-primary);
}

.faq-answer {
  padding: 1rem 1.5rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* FAQ 动画 */
.faq-enter-active,
.faq-leave-active {
  transition: all 0.3s ease;
}

.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.faq-enter-to,
.faq-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* 玻璃效果 */
.glass-effect {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
}

/* 响应式 */
@media (max-width: 768px) {
  .upgrade-container {
    padding: 1rem;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .current-membership {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .membership-info {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>


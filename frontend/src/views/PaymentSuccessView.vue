<template>
  <div class="payment-result-container">
    <div class="result-card glass-effect">
      <!-- 成功图标动画 -->
      <div class="success-animation">
        <div class="checkmark-circle">
          <div class="checkmark"></div>
        </div>
      </div>

      <!-- 结果信息 -->
      <div class="result-content">
        <h1 class="result-title">支付成功！</h1>
        <p class="result-message">
          恭喜您成功升级到 <strong>{{ membershipName }}</strong>
        </p>

        <!-- 会员信息卡片 -->
        <div v-if="membership" class="membership-info-card">
          <div class="info-row">
            <span class="info-label">会员等级</span>
            <span class="info-value tier-badge" :class="`tier-${membership.tier}`">
              <i class="fa-solid fa-crown"></i>
              {{ getTierName(membership.tier) }}
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">生效时间</span>
            <span class="info-value">{{ formatDate(membership.startDate) }}</span>
          </div>
          <div class="info-row" v-if="membership.endDate">
            <span class="info-label">到期时间</span>
            <span class="info-value">{{ formatDate(membership.endDate) }}</span>
          </div>
        </div>

        <!-- 功能提示 -->
        <div class="features-unlocked">
          <h3>
            <i class="fa-solid fa-gift"></i>
            已解锁功能
          </h3>
          <div class="features-grid">
            <div class="feature-badge" v-for="(feature, index) in unlockedFeatures" :key="index">
              <i :class="feature.icon"></i>
              <span>{{ feature.name }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button class="btn-primary" @click="goToDashboard">
            <i class="fa-solid fa-home"></i>
            返回首页
          </button>
          <button class="btn-secondary" @click="goToProfile">
            <i class="fa-solid fa-user"></i>
            查看会员信息
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { verifySession } from '@/services/payment';

const router = useRouter();
const route = useRoute();

const membership = ref<any>(null);
const membershipName = ref('');
const unlockedFeatures = ref<any[]>([]);

// 验证支付并获取会员信息
const verifyPayment = async () => {
  try {
    const sessionId = route.query.session_id as string;
    
    if (!sessionId) {
      ElMessage.error('缺少支付会话 ID');
      router.push('/upgrade');
      return;
    }

    const data = await verifySession(sessionId);
    
    if (data.success) {
      membership.value = data.membership;
      membershipName.value = getTierName(data.membership.tier);
      
      // 设置解锁功能
      setUnlockedFeatures(data.membership.tier);
      
      ElMessage.success('支付验证成功！会员已激活');
    } else {
      ElMessage.warning('支付状态异常，正在为您检查...');
      // 3秒后重试一次（有时 webhook 处理可能有延迟）
      setTimeout(async () => {
        try {
          const retryResult = await verifySession(sessionId);
          if (retryResult.success && retryResult.membership) {
            membership.value = retryResult.membership;
            membershipName.value = getTierName(retryResult.membership.tier);
            setUnlockedFeatures(retryResult.membership.tier);
            ElMessage.success('支付验证成功！会员已激活');
          } else {
            ElMessage.error('支付验证失败，请联系客服处理');
            setTimeout(() => router.push('/app/account'), 2000);
          }
        } catch (error) {
          ElMessage.error('支付验证失败，请联系客服处理');
          setTimeout(() => router.push('/app/account'), 2000);
        } finally {
          loading.value = false;
        }
      }, 3000);
      return; // 避免下面的 finally 重复设置 loading
    }
  } catch (error: any) {
    console.error('验证支付失败:', error);
    
    let errorMessage = '验证支付失败';
    if (error.message.includes('网络')) {
      errorMessage = '网络连接失败，请稍后在个人中心查看会员状态';
    } else if (error.message.includes('未授权')) {
      errorMessage = '登录已过期，请重新登录后查看';
    } else {
      errorMessage = error.message || '验证支付失败，请联系客服';
    }
    
    ElMessage.error(errorMessage);
    setTimeout(() => {
      router.push('/app/account');
    }, 3000);
  } finally {
    loading.value = false;
  }
};

// 设置解锁功能
const setUnlockedFeatures = (tier: string) => {
  const features: Record<string, any[]> = {
    basic: [
      { icon: 'fa-solid fa-book', name: '200个知识点' },
      { icon: 'fa-solid fa-robot', name: '100次AI提问' },
      { icon: 'fa-solid fa-chart-line', name: '高级分析' },
      { icon: 'fa-solid fa-palette', name: '自定义主题' },
    ],
    premium: [
      { icon: 'fa-solid fa-infinity', name: '1000个知识点' },
      { icon: 'fa-solid fa-robot', name: '500次AI提问' },
      { icon: 'fa-solid fa-star', name: '全部高级功能' },
      { icon: 'fa-solid fa-headset', name: '优先支持' },
    ],
    enterprise: [
      { icon: 'fa-solid fa-infinity', name: '无限制访问' },
      { icon: 'fa-solid fa-users', name: '团队协作' },
      { icon: 'fa-solid fa-shield-halved', name: '数据安全' },
      { icon: 'fa-solid fa-phone', name: '专属客服' },
    ],
  };
  
  unlockedFeatures.value = features[tier] || [];
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

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 返回首页
const goToDashboard = () => {
  router.push('/');
};

// 查看会员信息
const goToProfile = () => {
  router.push('/profile');
};

onMounted(() => {
  verifyPayment();
});
</script>

<style scoped>
.payment-result-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.result-card {
  max-width: 600px;
  width: 100%;
  padding: 3rem;
  border-radius: 24px;
  text-align: center;
}

/* 成功动画 */
.success-animation {
  margin-bottom: 2rem;
}

.checkmark-circle {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.checkmark {
  width: 40px;
  height: 70px;
  border: solid white;
  border-width: 0 6px 6px 0;
  transform: rotate(45deg);
  animation: checkmark 0.3s ease-out 0.3s both;
}

@keyframes checkmark {
  from {
    height: 0;
  }
  to {
    height: 70px;
  }
}

/* 结果内容 */
.result-content {
  animation: fadeInUp 0.5s ease-out 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.result-message {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0 0 2rem;
}

.result-message strong {
  color: var(--primary-color);
  font-weight: 600;
}

/* 会员信息卡片 */
.membership-info-card {
  background: var(--bg-secondary);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--card-border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.tier-badge.tier-basic {
  background: var(--primary-bg-light);
  color: var(--primary-color);
}

.tier-badge.tier-premium {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
}

.tier-badge.tier-enterprise {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: white;
}

/* 解锁功能 */
.features-unlocked {
  margin-bottom: 2rem;
}

.features-unlocked h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.feature-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--primary-bg-light);
  border: 1px solid var(--primary-color);
  border-radius: 12px;
  color: var(--primary-color);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.feature-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.2);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(138, 127, 251, 0.3);
}

.btn-secondary {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 玻璃效果 */
.glass-effect {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
}

/* 响应式 */
@media (max-width: 768px) {
  .result-card {
    padding: 2rem 1.5rem;
  }

  .result-title {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>


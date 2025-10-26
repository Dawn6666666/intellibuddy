<template>
  <div class="payment-result-container">
    <div class="result-card glass-effect">
      <!-- 取消图标 -->
      <div class="cancel-animation">
        <div class="cancel-circle">
          <div class="cancel-icon">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>

      <!-- 结果信息 -->
      <div class="result-content">
        <h1 class="result-title">支付已取消</h1>
        <p class="result-message">
          您已取消本次支付，如有问题可以联系我们的客服团队
        </p>

        <!-- 提示信息 -->
        <div class="info-box">
          <div class="info-item">
            <i class="fa-solid fa-circle-info"></i>
            <div>
              <h4>为什么选择我们？</h4>
              <p>我们提供专业的学习工具和AI辅导，帮助您更高效地学习和成长</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fa-solid fa-shield-halved"></i>
            <div>
              <h4>支付安全保障</h4>
              <p>使用 Stripe 国际支付平台，符合 PCI DSS 标准，确保您的支付安全</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fa-solid fa-rotate-left"></i>
            <div>
              <h4>灵活退款政策</h4>
              <p>7天内无理由退款，让您无后顾之忧</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button class="btn-primary" @click="retryPayment">
            <i class="fa-solid fa-credit-card"></i>
            重新支付
          </button>
          <button class="btn-secondary" @click="goBack">
            <i class="fa-solid fa-arrow-left"></i>
            返回上一页
          </button>
        </div>

        <!-- 联系方式 -->
        <div class="contact-info">
          <p>如有疑问，请联系我们：</p>
          <div class="contact-links">
            <a href="mailto:support@intellibuddy.com">
              <i class="fa-solid fa-envelope"></i>
              support@intellibuddy.com
            </a>
            <a href="#" @click.prevent="openChat">
              <i class="fa-solid fa-comments"></i>
              在线客服
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();

// 重新支付
const retryPayment = () => {
  router.push('/upgrade');
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 打开在线客服
const openChat = () => {
  ElMessage.info('在线客服功能即将上线');
};
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

/* 取消动画 */
.cancel-animation {
  margin-bottom: 2rem;
}

.cancel-circle {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
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

.cancel-icon {
  font-size: 48px;
  color: white;
  animation: rotate 0.5s ease-out 0.3s both;
}

@keyframes rotate {
  from {
    transform: rotate(-180deg);
    opacity: 0;
  }
  to {
    transform: rotate(0);
    opacity: 1;
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

/* 信息框 */
.info-box {
  background: var(--bg-secondary);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.info-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--card-border);
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-item > i {
  font-size: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.info-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.info-item p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
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

/* 联系信息 */
.contact-info {
  padding-top: 2rem;
  border-top: 1px solid var(--card-border);
}

.contact-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.contact-links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.contact-links a:hover {
  color: #a855f7;
  transform: translateX(2px);
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

  .contact-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>


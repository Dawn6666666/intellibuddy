<template>
  <teleport to="body">
    <transition name="guide-fade">
      <div v-if="isVisible" class="user-guide-overlay" @click="handleOverlayClick">
        <!-- 引导卡片 -->
        <div class="guide-card" :style="cardPosition" @click.stop>
          <!-- 步骤指示器 -->
          <div class="guide-header">
            <div class="step-indicator">
              <span class="current-step">{{ currentStep + 1 }}</span>
              <span class="total-steps">/ {{ totalSteps }}</span>
            </div>
            <button class="close-btn" @click="skipGuide" title="跳过引导">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <!-- 引导内容 -->
          <div class="guide-content">
            <div class="guide-icon">
              <i :class="currentGuideStep.icon"></i>
            </div>
            <h3 class="guide-title">{{ currentGuideStep.title }}</h3>
            <p class="guide-description">{{ currentGuideStep.description }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="guide-actions">
            <button 
              v-if="currentStep > 0" 
              class="btn-secondary" 
              @click="previousStep"
            >
              <i class="fa-solid fa-arrow-left"></i> 上一步
            </button>
            <button 
              v-if="currentStep < totalSteps - 1" 
              class="btn-primary" 
              @click="nextStep"
            >
              下一步 <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button 
              v-else 
              class="btn-primary" 
              @click="completeGuide"
            >
              开始使用 <i class="fa-solid fa-check"></i>
            </button>
          </div>

          <!-- 跳过按钮 -->
          <button class="skip-guide-btn" @click="skipGuide">
            跳过引导
          </button>
        </div>

        <!-- 高亮遮罩 -->
        <div 
          v-if="currentGuideStep.target" 
          class="highlight-mask"
          :style="maskStyle"
        ></div>

        <!-- 箭头指示器 -->
        <div 
          v-if="currentGuideStep.target" 
          class="guide-arrow"
          :style="arrowStyle"
        ></div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';

interface GuideStep {
  title: string;
  description: string;
  icon: string;
  target?: string; // CSS 选择器
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const props = defineProps<{
  steps: GuideStep[];
  storageKey: string; // localStorage 键名
}>();

const emit = defineEmits<{
  complete: [];
  skip: [];
}>();

const userStore = useUserStore();
const isVisible = ref(false);
const currentStep = ref(0);
const cardPosition = ref({});
const maskStyle = ref({});
const arrowStyle = ref({});

const totalSteps = computed(() => props.steps.length);
const currentGuideStep = computed(() => props.steps[currentStep.value]);

// 检查是否已完成引导
const checkGuideStatus = () => {
  const completed = localStorage.getItem(props.storageKey);
  if (!completed) {
    // 延迟显示，等待页面渲染完成
    setTimeout(() => {
      isVisible.value = true;
      updatePosition();
    }, 500);
  }
};

// 更新卡片和高亮位置
const updatePosition = () => {
  if (!currentGuideStep.value.target) {
    // 无目标元素，居中显示
    cardPosition.value = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
    return;
  }

  const targetElement = document.querySelector(currentGuideStep.value.target);
  if (!targetElement) {
    console.warn(`引导目标元素未找到: ${currentGuideStep.value.target}`);
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const position = currentGuideStep.value.position || 'bottom';

  // 计算卡片位置
  const cardWidth = 360;
  const cardHeight = 300;
  const gap = 20;

  let top = 0;
  let left = 0;
  let arrowTop = 0;
  let arrowLeft = 0;
  let arrowRotation = 0;

  switch (position) {
    case 'bottom':
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - cardWidth / 2;
      arrowTop = rect.bottom + gap - 10;
      arrowLeft = rect.left + rect.width / 2;
      arrowRotation = 180;
      break;
    case 'top':
      top = rect.top - cardHeight - gap;
      left = rect.left + rect.width / 2 - cardWidth / 2;
      arrowTop = rect.top - gap + 10;
      arrowLeft = rect.left + rect.width / 2;
      arrowRotation = 0;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - cardHeight / 2;
      left = rect.left - cardWidth - gap;
      arrowTop = rect.top + rect.height / 2;
      arrowLeft = rect.left - gap + 10;
      arrowRotation = 270;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - cardHeight / 2;
      left = rect.right + gap;
      arrowTop = rect.top + rect.height / 2;
      arrowLeft = rect.right + gap - 10;
      arrowRotation = 90;
      break;
  }

  // 确保卡片在视口内
  const padding = 20;
  top = Math.max(padding, Math.min(top, window.innerHeight - cardHeight - padding));
  left = Math.max(padding, Math.min(left, window.innerWidth - cardWidth - padding));

  cardPosition.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
  };

  // 设置高亮遮罩
  maskStyle.value = {
    position: 'fixed',
    top: `${rect.top - 5}px`,
    left: `${rect.left - 5}px`,
    width: `${rect.width + 10}px`,
    height: `${rect.height + 10}px`,
    border: '3px solid var(--primary-color)',
    borderRadius: '12px',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
    pointerEvents: 'none',
    zIndex: 9998,
  };

  // 设置箭头
  arrowStyle.value = {
    position: 'fixed',
    top: `${arrowTop}px`,
    left: `${arrowLeft}px`,
    transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
  };
};

// 下一步
const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++;
    updatePosition();
  }
};

// 上一步
const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    updatePosition();
  }
};

// 完成引导
const completeGuide = () => {
  localStorage.setItem(props.storageKey, 'true');
  isVisible.value = false;
  emit('complete');
};

// 跳过引导
const skipGuide = () => {
  localStorage.setItem(props.storageKey, 'true');
  isVisible.value = false;
  emit('skip');
};

// 点击遮罩层（不关闭）
const handleOverlayClick = () => {
  // 不做任何操作，防止误点击关闭
};

// 监听窗口大小变化
const handleResize = () => {
  if (isVisible.value) {
    updatePosition();
  }
};

// 监听步骤变化
watch(currentStep, () => {
  updatePosition();
});

onMounted(() => {
  checkGuideStatus();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.user-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: auto;
}

.guide-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 24px;
  width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  animation: guide-bounce 0.5s ease;
}

@keyframes guide-bounce {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.step-indicator {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.current-step {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.guide-content {
  text-align: center;
  margin-bottom: 24px;
}

.guide-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.guide-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.guide-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.guide-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.4);
}

.btn-secondary {
  background: var(--secondary-bg);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--hover-bg);
}

.skip-guide-btn {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.skip-guide-btn:hover {
  color: var(--text-primary);
}

.highlight-mask {
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0%, 100% {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  }
  50% {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
  }
}

.guide-arrow {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid var(--card-bg);
  z-index: 10001;
  filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
}

.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .guide-card {
    width: calc(100% - 40px);
    max-width: 360px;
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }

  .guide-icon {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }

  .guide-title {
    font-size: 1.125rem;
  }

  .guide-description {
    font-size: 0.875rem;
  }

  /* 移动端不显示箭头和高亮 */
  .highlight-mask,
  .guide-arrow {
    display: none;
  }
}
</style>


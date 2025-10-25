<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isActive" class="onboarding-overlay" @click="handleOverlayClick">
        <!-- 高亮区域（挖洞效果） -->
        <div class="spotlight" :style="spotlightStyle"></div>
        
        <!-- 提示卡片 -->
        <transition name="slide-fade">
          <div 
            v-if="currentStepData" 
            class="tour-card" 
            :style="cardStyle"
            @click.stop
          >
            <div class="tour-header">
              <h3>{{ currentStepData.title }}</h3>
              <button class="close-btn" @click="skip" title="跳过引导">
                <el-icon><Close /></el-icon>
              </button>
            </div>
            
            <div class="tour-content">
              <p>{{ currentStepData.content }}</p>
              
              <!-- 如果有图片或动画 -->
              <div v-if="currentStepData.image" class="tour-image">
                <img :src="currentStepData.image" :alt="currentStepData.title" />
              </div>
            </div>
            
            <div class="tour-footer">
              <div class="tour-progress">
                <span class="step-indicator">
                  {{ currentStep + 1 }} / {{ steps.length }}
                </span>
                <div class="progress-dots">
                  <span 
                    v-for="(_, index) in steps" 
                    :key="index"
                    class="dot"
                    :class="{ active: index === currentStep }"
                  ></span>
                </div>
              </div>
              
              <div class="tour-actions">
                <el-button v-if="currentStep > 0" @click="prev" text>
                  上一步
                </el-button>
                <el-button v-if="currentStep < steps.length - 1" type="primary" @click="next">
                  下一步
                </el-button>
                <el-button v-else type="primary" @click="finish">
                  开始使用
                </el-button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Close } from '@element-plus/icons-vue';

export interface TourStep {
  target: string; // CSS 选择器
  title: string;
  content: string;
  image?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void; // 进入该步骤时执行的动作（如滚动、点击）
}

interface Props {
  steps: TourStep[];
  modelValue: boolean; // v-model 支持
  autoStart?: boolean;
  storageKey?: string; // 用于记住用户已完成引导
}

const props = withDefaults(defineProps<Props>(), {
  autoStart: false,
  storageKey: 'onboarding-completed'
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'finish': [];
  'skip': [];
}>();

const currentStep = ref(0);
const spotlightStyle = ref({});
const cardStyle = ref({});
const isActive = computed(() => props.modelValue);

const currentStepData = computed(() => props.steps[currentStep.value]);

// 检查是否已完成引导
const checkCompleted = () => {
  if (props.storageKey) {
    const completed = localStorage.getItem(props.storageKey);
    return completed === 'true';
  }
  return false;
};

// 标记引导已完成
const markCompleted = () => {
  if (props.storageKey) {
    localStorage.setItem(props.storageKey, 'true');
  }
};

// 计算高亮位置
const updateSpotlight = async () => {
  await nextTick();
  
  const step = currentStepData.value;
  if (!step || !step.target) {
    spotlightStyle.value = {};
    cardStyle.value = {};
    return;
  }
  
  const element = document.querySelector(step.target);
  if (!element) {
    console.warn(`[Onboarding] 找不到目标元素: ${step.target}`);
    spotlightStyle.value = {};
    cardStyle.value = {};
    return;
  }
  
  const rect = element.getBoundingClientRect();
  const padding = 8;
  
  // 高亮区域样式
  spotlightStyle.value = {
    left: `${rect.left - padding}px`,
    top: `${rect.top - padding}px`,
    width: `${rect.width + padding * 2}px`,
    height: `${rect.height + padding * 2}px`,
  };
  
  // 提示卡片位置（根据 placement）
  const placement = step.placement || 'bottom';
  const cardWidth = 360;
  const cardHeight = 200; // 估算值
  const gap = 16;
  
  let cardLeft = 0;
  let cardTop = 0;
  
  switch (placement) {
    case 'bottom':
      cardLeft = rect.left + rect.width / 2 - cardWidth / 2;
      cardTop = rect.bottom + gap;
      break;
    case 'top':
      cardLeft = rect.left + rect.width / 2 - cardWidth / 2;
      cardTop = rect.top - cardHeight - gap;
      break;
    case 'right':
      cardLeft = rect.right + gap;
      cardTop = rect.top + rect.height / 2 - cardHeight / 2;
      break;
    case 'left':
      cardLeft = rect.left - cardWidth - gap;
      cardTop = rect.top + rect.height / 2 - cardHeight / 2;
      break;
  }
  
  // 防止卡片超出视口
  cardLeft = Math.max(16, Math.min(cardLeft, window.innerWidth - cardWidth - 16));
  cardTop = Math.max(16, Math.min(cardTop, window.innerHeight - cardHeight - 16));
  
  cardStyle.value = {
    left: `${cardLeft}px`,
    top: `${cardTop}px`,
  };
  
  // 滚动到可见区域
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// 导航方法
const next = async () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++;
    await updateSpotlight();
    
    // 执行自定义动作
    if (currentStepData.value.action) {
      currentStepData.value.action();
    }
  }
};

const prev = async () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    await updateSpotlight();
    
    if (currentStepData.value.action) {
      currentStepData.value.action();
    }
  }
};

const finish = () => {
  markCompleted();
  emit('update:modelValue', false);
  emit('finish');
};

const skip = () => {
  markCompleted();
  emit('update:modelValue', false);
  emit('skip');
};

const handleOverlayClick = (e: MouseEvent) => {
  // 点击遮罩层外部不关闭
  // 用户必须完成或跳过引导
};

// 监听步骤变化
watch(() => currentStep.value, () => {
  updateSpotlight();
});

// 监听激活状态
watch(() => props.modelValue, (active) => {
  if (active) {
    currentStep.value = 0;
    updateSpotlight();
  }
});

// 窗口大小变化时重新计算位置
const handleResize = () => {
  if (isActive.value) {
    updateSpotlight();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  // 自动启动且未完成
  if (props.autoStart && !checkCompleted()) {
    emit('update:modelValue', true);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 暴露方法供父组件使用
defineExpose({
  next,
  prev,
  finish,
  skip,
  reset: () => {
    currentStep.value = 0;
    updateSpotlight();
  }
});
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  z-index: 9999;
  pointer-events: all;
}

.spotlight {
  position: absolute;
  border: 2px solid var(--el-color-primary);
  border-radius: 8px;
  box-shadow: 
    0 0 0 4px rgba(64, 158, 255, 0.2),
    0 0 0 9999px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 10000;
}

.tour-card {
  position: absolute;
  width: 360px;
  max-width: calc(100vw - 32px);
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  padding: 24px;
  z-index: 10001;
  transition: all 0.3s ease;
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tour-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}

.tour-content {
  margin-bottom: 20px;
}

.tour-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.tour-image {
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.tour-image img {
  width: 100%;
  height: auto;
  display: block;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

.tour-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-indicator {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.progress-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-border-color);
  transition: all 0.3s;
}

.dot.active {
  width: 20px;
  border-radius: 3px;
  background: var(--el-color-primary);
}

.tour-actions {
  display: flex;
  gap: 8px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .tour-card {
    width: calc(100vw - 32px);
    left: 16px !important;
    top: auto !important;
    bottom: 16px;
  }
  
  .tour-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .tour-actions {
    width: 100%;
  }
  
  .tour-actions .el-button {
    flex: 1;
  }
}
</style>


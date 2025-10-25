<template>
  <div class="animated-stats-card" :class="{ 'is-loading': loading }">
    <div class="card-icon" :style="{ background: iconColor }">
      <i :class="icon"></i>
    </div>
    <div class="card-content">
      <div class="card-label">{{ label }}</div>
      <div class="card-value" ref="valueRef">{{ displayValue }}</div>
      <div v-if="trend" class="card-trend" :class="trendClass">
        <i :class="trendIcon"></i>
        <span>{{ trendText }}</span>
      </div>
    </div>
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props {
  label: string;
  value: number | string;
  icon: string;
  iconColor?: string;
  trend?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  suffix?: string;
  prefix?: string;
  loading?: boolean;
  animationDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  suffix: '',
  prefix: '',
  loading: false,
  animationDuration: 1500,
});

const animatedValue = ref(0);
const valueRef = ref<HTMLElement>();

// 显示的值
const displayValue = computed(() => {
  if (typeof props.value === 'string') {
    return props.value;
  }
  return `${props.prefix}${animatedValue.value}${props.suffix}`;
});

// 趋势样式
const trendClass = computed(() => {
  if (!props.trend) return '';
  return props.trend.type === 'increase' ? 'trend-up' : 'trend-down';
});

const trendIcon = computed(() => {
  if (!props.trend) return '';
  return props.trend.type === 'increase' 
    ? 'fa-solid fa-arrow-up' 
    : 'fa-solid fa-arrow-down';
});

const trendText = computed(() => {
  if (!props.trend) return '';
  const sign = props.trend.type === 'increase' ? '+' : '-';
  return `${sign}${Math.abs(props.trend.value)}%`;
});

// 数字滚动动画
const animateValue = (target: number) => {
  if (typeof props.value === 'string') {
    return;
  }

  const duration = props.animationDuration;
  const start = animatedValue.value;
  const startTime = Date.now();

  const animate = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 缓动函数：ease-out-cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * easeOut;
    
    animatedValue.value = Math.round(current);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

watch(() => props.value, (newValue) => {
  if (typeof newValue === 'number') {
    animateValue(newValue);
  }
});

onMounted(() => {
  if (typeof props.value === 'number') {
    animateValue(props.value);
  }
});
</script>

<style scoped>
.animated-stats-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.animated-stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.animated-stats-card.is-loading {
  pointer-events: none;
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.card-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.card-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.card-trend i {
  font-size: 0.75rem;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.dark .loading-overlay {
  background: rgba(0, 0, 0, 0.6);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 移动端优化 */
@media (max-width: 767px) {
  .animated-stats-card {
    padding: 1rem;
    gap: 1rem;
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
  
  .card-value {
    font-size: 1.5rem;
  }
}
</style>



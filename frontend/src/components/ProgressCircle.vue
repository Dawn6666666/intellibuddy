<template>
  <div class="progress-circle" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" class="progress-svg">
      <!-- 背景圆 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- 进度圆 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="color"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="progress-ring"
        :style="{ animationDuration: animationDuration + 'ms' }"
      />
    </svg>
    <div class="progress-text">
      <div class="percentage">{{ animatedPercentage }}%</div>
      <div v-if="label" class="label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  animationDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  strokeWidth: 8,
  color: '#8b5cf6',
  backgroundColor: 'rgba(139, 92, 246, 0.1)',
  label: '',
  animationDuration: 1500,
});

const animatedPercentage = ref(0);

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => {
  const percentage = Math.min(Math.max(animatedPercentage.value, 0), 100);
  return circumference.value - (percentage / 100) * circumference.value;
});

// 数字动画
const animatePercentage = (target: number) => {
  const duration = props.animationDuration;
  const start = animatedPercentage.value;
  const startTime = Date.now();

  const animate = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 缓动函数：ease-out
    const easeOut = 1 - Math.pow(1 - progress, 3);
    animatedPercentage.value = Math.round(start + (target - start) * easeOut);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

watch(() => props.percentage, (newValue) => {
  animatePercentage(newValue);
});

onMounted(() => {
  animatePercentage(props.percentage);
});
</script>

<style scoped>
.progress-circle {
  position: relative;
  display: inline-block;
}

.progress-svg {
  transform: rotate(-90deg);
}

.progress-ring {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.percentage {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
}

.label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 添加呼吸动画 */
@keyframes breathe {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.progress-ring {
  animation: breathe 2s ease-in-out infinite;
}
</style>



<template>
  <div class="enhanced-progress-bar">
    <div v-if="showLabel" class="progress-header">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-percentage">{{ displayPercentage }}%</span>
    </div>
    <div class="progress-track" :style="{ height: height + 'px' }">
      <div
        class="progress-fill"
        :class="{ 'with-stripes': striped, 'animated': animated }"
        :style="{
          width: animatedPercentage + '%',
          background: getGradient(),
          transition: `width ${transitionDuration}ms ease-out`,
        }"
      >
        <div v-if="showGlow" class="progress-glow"></div>
      </div>
      <div v-if="showMarkers" class="progress-markers">
        <div
          v-for="marker in markers"
          :key="marker"
          class="marker"
          :style="{ left: marker + '%' }"
        ></div>
      </div>
    </div>
    <div v-if="description" class="progress-description">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props {
  percentage: number;
  label?: string;
  description?: string;
  height?: number;
  showLabel?: boolean;
  striped?: boolean;
  animated?: boolean;
  showGlow?: boolean;
  showMarkers?: boolean;
  markers?: number[];
  colorStart?: string;
  colorEnd?: string;
  transitionDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  description: '',
  height: 12,
  showLabel: true,
  striped: false,
  animated: true,
  showGlow: true,
  showMarkers: false,
  markers: () => [25, 50, 75],
  colorStart: '#667eea',
  colorEnd: '#764ba2',
  transitionDuration: 1500,
});

const animatedPercentage = ref(0);

const displayPercentage = computed(() => {
  return Math.round(animatedPercentage.value);
});

const getGradient = () => {
  return `linear-gradient(90deg, ${props.colorStart} 0%, ${props.colorEnd} 100%)`;
};

// 数字动画
const animatePercentage = (target: number) => {
  const duration = props.transitionDuration;
  const start = animatedPercentage.value;
  const startTime = Date.now();

  const animate = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 缓动函数：ease-out-cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    animatedPercentage.value = start + (target - start) * easeOut;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

watch(() => props.percentage, (newValue) => {
  animatePercentage(Math.min(Math.max(newValue, 0), 100));
});

onMounted(() => {
  animatePercentage(Math.min(Math.max(props.percentage, 0), 100));
});
</script>

<style scoped>
.enhanced-progress-bar {
  width: 100%;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-color);
}

.progress-track {
  position: relative;
  width: 100%;
  background: var(--border-color);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  position: relative;
  height: 100%;
  border-radius: 100px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.progress-fill.with-stripes {
  background-image: 
    linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
  background-size: 20px 20px;
}

.progress-fill.animated.with-stripes {
  animation: stripes 1s linear infinite;
}

@keyframes stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 20px 0;
  }
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6));
  animation: glow 1.5s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    opacity: 0;
    transform: translateX(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-10px);
  }
}

.progress-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.marker {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  transform: translateX(-50%);
}

.progress-description {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .progress-track {
    height: 10px !important;
  }
  
  .progress-label,
  .progress-percentage {
    font-size: 0.8125rem;
  }
}
</style>



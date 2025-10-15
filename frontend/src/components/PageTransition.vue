<template>
  <Transition name="page-transition">
    <div v-if="isVisible" class="page-transition-overlay">
      <div class="transition-content">
        <!-- Logo (如果有的话) -->
        <div class="logo-container">
          <img src="/favicon.png" alt="Logo" class="brand-logo" />
        </div>
        
        <!-- 加载动画 -->
        <div class="loader-container">
          <svg class="circular-loader" viewBox="0 0 50 50">
            <circle class="loader-path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
          </svg>
          <div class="pulse-ring"></div>
        </div>
        
        <!-- 加载文本 -->
        <div class="loading-text">
          <span class="text-char" v-for="(char, index) in loadingText" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
            {{ char }}
          </span>
        </div>
        
        <!-- 进度条 -->
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        
        <!-- 提示文本 -->
        <div class="hint-text">正在为您准备学习环境...</div>
      </div>
      
      <!-- 装饰性粒子效果 -->
      <div class="particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Props
interface Props {
  modelValue: boolean;
  text?: string;
  duration?: number; // 转场持续时间（毫秒）
}

const props = withDefaults(defineProps<Props>(), {
  text: 'LOADING',
  duration: 1500
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'complete'): void;
}>();

// 状态
const isVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const progress = ref(0);
const loadingText = computed(() => props.text.split(''));

// 进度条动画
let progressTimer: number | null = null;

watch(isVisible, (visible) => {
  if (visible) {
    startProgress();
  } else {
    resetProgress();
  }
});

const startProgress = () => {
  progress.value = 0;
  const step = 100 / (props.duration / 50); // 每50ms增加的进度
  
  progressTimer = window.setInterval(() => {
    if (progress.value < 100) {
      progress.value = Math.min(100, progress.value + step);
    } else {
      if (progressTimer) clearInterval(progressTimer);
    }
  }, 50);
};

const resetProgress = () => {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progress.value = 0;
};

// 显示转场动画
const show = () => {
  isVisible.value = true;
};

// 隐藏转场动画
const hide = () => {
  setTimeout(() => {
    isVisible.value = false;
    emit('complete');
  }, props.duration);
};

// 粒子样式生成
const getParticleStyle = (index: number) => {
  const angle = (index / 20) * 360;
  const radius = 40 + Math.random() * 60;
  const x = Math.cos(angle * Math.PI / 180) * radius;
  const y = Math.sin(angle * Math.PI / 180) * radius;
  const delay = Math.random() * 2;
  const duration = 2 + Math.random() * 2;
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

// 暴露方法供父组件调用
defineExpose({
  show,
  hide
});
</script>

<style scoped>
.page-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.98) 0%, 
    rgba(59, 130, 246, 0.98) 50%, 
    rgba(16, 185, 129, 0.98) 100%
  );
  backdrop-filter: blur(30px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  overflow: hidden;
  
  /* 添加背景动画 */
  animation: gradientShift 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 转场进入/离开动画 */
.page-transition-enter-active {
  animation: slideDown 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.page-transition-leave-active {
  animation: slideUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* 转场内容容器 */
.transition-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* 加载器容器 */
.loader-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 圆形加载动画 */
.circular-loader {
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}

.loader-path {
  stroke: #fff;
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 脉冲环 */
.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* 加载文本 */
.loading-text {
  display: flex;
  gap: 0.3rem;
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 0.2em;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.text-char {
  display: inline-block;
  animation: bounce 1.5s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 进度条 */
.progress-bar {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.8) 0%, 
    rgba(255, 255, 255, 1) 100%
  );
  border-radius: 2px;
  transition: width 0.05s linear;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

/* 粒子效果 */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 1;
  }
}

/* Logo 容器 */
.logo-container {
  margin-bottom: 2rem;
  animation: logoFadeIn 0.8s ease-out;
}

.brand-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 提示文本 */
.hint-text {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  letter-spacing: 0.05em;
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo-container {
    margin-bottom: 1.5rem;
  }
  
  .brand-logo {
    width: 60px;
    height: 60px;
  }
  
  .loader-container {
    width: 80px;
    height: 80px;
  }
  
  .loading-text {
    font-size: 1.5rem;
  }
  
  .progress-bar {
    width: 200px;
  }
  
  .hint-text {
    font-size: 0.85rem;
  }
}
</style>


<template>
  <Teleport to="body">
    <Transition name="achievement-unlock">
      <div v-if="show" class="achievement-unlock-container" @click="close">
        <div class="achievement-card" @click.stop>
          <div class="card-shine"></div>
          <div class="achievement-icon">
            <i class="fa-solid fa-trophy"></i>
          </div>
          <div class="achievement-content">
            <div class="achievement-title">{{ achievement.title }}</div>
            <div class="achievement-description">{{ achievement.description }}</div>
            <div class="achievement-level" :class="'level-' + achievement.level">
              {{ getLevelText(achievement.level) }}
            </div>
          </div>
          <div class="confetti-container">
            <div v-for="i in 30" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Achievement {
  title: string;
  description: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

interface Props {
  modelValue: boolean;
  achievement: Achievement;
  autoClose?: boolean;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  autoClose: true,
  duration: 5000,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const show = ref(props.modelValue);

const getLevelText = (level: string) => {
  const levelMap = {
    bronze: '青铜',
    silver: '白银',
    gold: '黄金',
    platinum: '铂金',
    diamond: '钻石',
  };
  return levelMap[level as keyof typeof levelMap] || level;
};

const getConfettiStyle = (index: number) => {
  const angle = (360 / 30) * index;
  const distance = 150 + Math.random() * 100;
  const duration = 1 + Math.random() * 1;
  const delay = Math.random() * 0.3;
  
  return {
    '--angle': angle + 'deg',
    '--distance': distance + 'px',
    '--duration': duration + 's',
    '--delay': delay + 's',
    '--color': ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'][Math.floor(Math.random() * 5)],
  };
};

const close = () => {
  show.value = false;
  emit('update:modelValue', false);
  emit('close');
};

watch(() => props.modelValue, (newValue) => {
  show.value = newValue;
  if (newValue && props.autoClose) {
    setTimeout(close, props.duration);
  }
});
</script>

<style scoped>
.achievement-unlock-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 9999;
  cursor: pointer;
}

.achievement-card {
  position: relative;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
  cursor: default;
  overflow: hidden;
  animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cardEntrance {
  from {
    transform: scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.achievement-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  animation: iconPulse 1.5s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.achievement-content {
  position: relative;
  z-index: 1;
}

.achievement-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.achievement-description {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.achievement-level {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.level-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #8b5a00 100%);
}

.level-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #808080 100%);
}

.level-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
}

.level-platinum {
  background: linear-gradient(135deg, #e5e4e2 0%, #b8b8b8 100%);
}

.level-diamond {
  background: linear-gradient(135deg, #b9f2ff 0%, #0080ff 100%);
}

.confetti-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color);
  opacity: 0;
  animation: confettiFly var(--duration) ease-out var(--delay) forwards;
}

@keyframes confettiFly {
  0% {
    transform: rotate(0deg) translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: rotate(720deg) translate(
      calc(cos(var(--angle)) * var(--distance)),
      calc(sin(var(--angle)) * var(--distance))
    );
    opacity: 0;
  }
}

/* 过渡动画 */
.achievement-unlock-enter-active {
  transition: opacity 0.3s ease;
}

.achievement-unlock-leave-active {
  transition: opacity 0.3s ease;
}

.achievement-unlock-enter-from,
.achievement-unlock-leave-to {
  opacity: 0;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .achievement-card {
    padding: 1.5rem;
  }
  
  .achievement-icon {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
  
  .achievement-title {
    font-size: 1.5rem;
  }
  
  .achievement-description {
    font-size: 0.875rem;
  }
}
</style>



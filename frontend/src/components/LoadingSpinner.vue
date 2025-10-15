<template>
  <div class="loading-spinner" :class="{ 'loading-spinner--fullscreen': fullscreen }">
    <div class="spinner" :class="`spinner--${size}`">
      <div class="spinner__circle"></div>
      <div class="spinner__circle"></div>
      <div class="spinner__circle"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullscreen?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  fullscreen: false,
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.loading-spinner--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

html.dark .loading-spinner--fullscreen {
  background: rgba(0, 0, 0, 0.9);
}

.spinner {
  display: flex;
  gap: 8px;
  align-items: center;
}

.spinner--small {
  gap: 4px;
}

.spinner--large {
  gap: 12px;
}

.spinner__circle {
  width: 12px;
  height: 12px;
  background: var(--el-color-primary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner--small .spinner__circle {
  width: 8px;
  height: 8px;
}

.spinner--large .spinner__circle {
  width: 16px;
  height: 16px;
}

.spinner__circle:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner__circle:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  animation: fadeInOut 2s infinite;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
</style>


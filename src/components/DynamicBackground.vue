<template>
  <div :class="['dynamic-blur-background', { 'light-mode': theme === 'light' }]">
    <div class="blob" :style="{ backgroundColor: blobColors[0] }"></div>
    <div class="blob" :style="{ backgroundColor: blobColors[1] }"></div>
    <div class.="blob" :style="{ backgroundColor: blobColors[2] }"></div>
    <div class="blob" :style="{ backgroundColor: blobColors[3] }"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  blobColors: {
    type: Array as () => string[],
    required: true,
  },
  // 接收一个 theme prop
  theme: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* ... .dynamic-blur-background, .blob, nth-child, @keyframes 样式保持不变 ... */
.dynamic-blur-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -10;
  /* 背景色由 body 提供，这里保持透明 */
}

.blob {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
  opacity: 0.8;
  filter: blur(10vh);
  transition: opacity 0.5s ease, mix-blend-mode 0.5s ease; /* 添加过渡效果 */
  will-change: transform;
}

.blob:nth-child(1) {
  width: 60vmax;
  height: 60vmax;
  top: -20vmax;
  left: -25vmax;
  animation: move 45s infinite alternate;
}

.blob:nth-child(2) {
  width: 50vmax;
  height: 50vmax;
  bottom: -20vmax;
  right: -25vmax;
  animation: move 50s infinite alternate-reverse;
}

.blob:nth-child(3) {
  width: 40vmax;
  height: 40vmax;
  bottom: 5vh;
  left: 10vw;
  animation: move 35s infinite alternate;
}

.blob:nth-child(4) {
  width: 30vmax;
  height: 30vmax;
  top: 0vh;
  right: 5vw;
  animation: move 40s infinite alternate-reverse;
}

@keyframes move {
  from {
    transform: translate(0, 0) rotate(0deg);
  }
  to {
    transform: translate(20vw, 20vh) rotate(180deg);
  }
}


/* 【核心新增】当处于亮色模式时，改变色块的混合模式和不透明度，使其更柔和 */
.light-mode .blob {
  mix-blend-mode: multiply; /* 在亮色背景下，multiply 模式效果更像水彩，不刺眼 */
  opacity: 0.5; /* 大幅降低不透明度 */
}
</style>
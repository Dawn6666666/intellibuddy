<template>
  <div :class="['dynamic-blur-background', { 'light-mode': theme === 'light' }]">
    <div class="blob blob-1" :style="{ backgroundColor: blobColors[0] }"></div>
    <div class="blob blob-2" :style="{ backgroundColor: blobColors[1] }"></div>
    <div class="blob blob-3" :style="{ backgroundColor: blobColors[2] }"></div>
    <div class="blob blob-4" :style="{ backgroundColor: blobColors[3] }"></div>
    <!-- 添加更多色块让效果更丰富 -->
    <div class="blob blob-5" :style="{ backgroundColor: blobColors[0] }"></div>
    <div class="blob blob-6" :style="{ backgroundColor: blobColors[2] }"></div>
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
  opacity: 0.7;
  /* 增加模糊强度，让效果更梦幻 */
  filter: blur(120px);
  transition: opacity 0.8s ease, mix-blend-mode 0.8s ease;
  will-change: transform;
}

/* 第一个色块：左上角大型色块 */
.blob-1 {
  width: 70vmax;
  height: 70vmax;
  top: -30vmax;
  left: -30vmax;
  animation: float-1 22s ease-in-out infinite alternate;
}

/* 第二个色块：右下角大型色块 */
.blob-2 {
  width: 65vmax;
  height: 65vmax;
  bottom: -25vmax;
  right: -30vmax;
  animation: float-2 26s ease-in-out infinite alternate-reverse;
}

/* 第三个色块：左下角中型色块 */
.blob-3 {
  width: 50vmax;
  height: 50vmax;
  bottom: -10vmax;
  left: 5vw;
  animation: float-3 20s ease-in-out infinite alternate;
}

/* 第四个色块：右上角中型色块 */
.blob-4 {
  width: 45vmax;
  height: 45vmax;
  top: -5vmax;
  right: 10vw;
  animation: float-4 24s ease-in-out infinite alternate-reverse;
}

/* 第五个色块：中央偏左小型色块 */
.blob-5 {
  width: 35vmax;
  height: 35vmax;
  top: 30vh;
  left: 15vw;
  animation: float-5 18s ease-in-out infinite alternate;
}

/* 第六个色块：中央偏右小型色块 */
.blob-6 {
  width: 40vmax;
  height: 40vmax;
  top: 40vh;
  right: 20vw;
  animation: float-6 28s ease-in-out infinite alternate-reverse;
}

/* 动态浮动动画 - 每个色块有不同的随机路径 */
@keyframes float-1 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(30vw, 20vh) scale(1.3) rotate(120deg);
  }
  66% {
    transform: translate(15vw, 35vh) scale(0.8) rotate(240deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(360deg);
  }
}

@keyframes float-2 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(-35vw, -25vh) scale(1.25) rotate(-100deg);
  }
  66% {
    transform: translate(-20vw, -40vh) scale(0.75) rotate(-200deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(-360deg);
  }
}

@keyframes float-3 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(25vw, -30vh) scale(1.35) rotate(90deg);
  }
  66% {
    transform: translate(40vw, -15vh) scale(0.7) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(270deg);
  }
}

@keyframes float-4 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(-28vw, 25vh) scale(1.28) rotate(-110deg);
  }
  66% {
    transform: translate(-15vw, 38vh) scale(0.78) rotate(-220deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(-330deg);
  }
}

@keyframes float-5 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(22vw, -20vh) scale(1.4) rotate(80deg);
  }
  66% {
    transform: translate(35vw, 10vh) scale(0.65) rotate(160deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(240deg);
  }
}

@keyframes float-6 {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(-25vw, 18vh) scale(1.32) rotate(-95deg);
  }
  66% {
    transform: translate(-10vw, -22vh) scale(0.72) rotate(-190deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(-285deg);
  }
}

/* 亮色模式优化 */
.light-mode .blob {
  mix-blend-mode: multiply;
  opacity: 0.4;
  filter: blur(140px);
}
</style>
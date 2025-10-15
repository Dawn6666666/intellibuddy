<template>
  <div class="responsive-container" :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'lg',
  padding: true,
});

const screenSize = ref<'mobile' | 'tablet' | 'desktop'>('desktop');

const containerClasses = computed(() => ({
  [`responsive-container--${props.maxWidth}`]: true,
  'responsive-container--padding': props.padding,
  [`responsive-container--${screenSize.value}`]: true,
}));

const updateScreenSize = () => {
  const width = window.innerWidth;
  if (width < 768) {
    screenSize.value = 'mobile';
  } else if (width < 1024) {
    screenSize.value = 'tablet';
  } else {
    screenSize.value = 'desktop';
  }
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
});

defineExpose({
  screenSize,
});
</script>

<style scoped>
.responsive-container {
  width: 100%;
  margin: 0 auto;
}

.responsive-container--padding {
  padding: 0 20px;
}

.responsive-container--mobile.responsive-container--padding {
  padding: 0 16px;
}

.responsive-container--sm {
  max-width: 640px;
}

.responsive-container--md {
  max-width: 768px;
}

.responsive-container--lg {
  max-width: 1024px;
}

.responsive-container--xl {
  max-width: 1280px;
}

.responsive-container--full {
  max-width: 100%;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .responsive-container--padding {
    padding: 0 12px;
  }
}
</style>


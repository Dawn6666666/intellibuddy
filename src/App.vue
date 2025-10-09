<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from './stores/theme'; // 1. 引入 theme store
import DynamicBackground from './components/DynamicBackground.vue';

const route = useRoute();
const themeStore = useThemeStore(); // 2. 获取 theme store 实例

// 3. 监听 theme store 的变化，并相应地在 <html> 标签上添加/移除 class
watchEffect(() => {
  if (themeStore.theme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else {
    document.documentElement.classList.remove('light-theme');
  }
});

// 动态计算背景颜色 (保持不变)
const backgroundColors = computed(() => {
  if (route.name === 'login') {
    return ['#10b981', '#14b8a6', '#0ea5e9', '#22c55e'];
  } else {
    return ['#f43f5e', '#3b82f6', '#f97316', '#8b5cf6'];
  }
});
</script>

<template>
  <DynamicBackground :blob-colors="backgroundColors" :theme="themeStore.theme" />

  <router-view />
</template>

<style scoped>
</style>
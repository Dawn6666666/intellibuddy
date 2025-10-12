<script setup lang="ts">
import {computed, watchEffect} from 'vue';
import {useRoute} from 'vue-router';
import {useThemeStore} from './stores/theme';
import DynamicBackground from './components/DynamicBackground.vue';

const route = useRoute();
const themeStore = useThemeStore();

// 【核心修改 2】: 仅保留主题切换逻辑，删除 highlight.js 动态切换函数调用
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
  <DynamicBackground :blob-colors="backgroundColors" :theme="themeStore.theme"/>
  <router-view/>
</template>

<style scoped>
</style>
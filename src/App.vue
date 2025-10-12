<!-- D:/projects/intellibuddy/src/App.vue -->
<script setup lang="ts">
import {computed, onMounted, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useThemeStore} from './stores/theme';
import DynamicBackground from './components/DynamicBackground.vue';

const route = useRoute();
const themeStore = useThemeStore();

// --- 【Vite 终极修复】: 动态导入并管理本地 highlight.js 主题 ---

// 1. 创建一个变量来持有<style>元素
let highlightStyleElement: HTMLStyleElement | null = null;

// 2. 组件挂载时，创建<style>元素并添加到<head>
onMounted(() => {
  highlightStyleElement = document.createElement('style');
  highlightStyleElement.id = 'highlight-theme'; // 给它一个ID方便识别
  document.head.appendChild(highlightStyleElement);

  // 立即根据当前主题设置一次样式
  updateHighlightTheme(themeStore.theme);
});

// 3. 定义一个异步函数来加载和应用样式
const updateHighlightTheme = async (theme: 'light' | 'dark') => {
  if (!highlightStyleElement) return;

  let cssContent: string;

  if (theme === 'light') {
    // 亮色主题：使用 stackoverflow-light，简洁清晰，适合现代网站
    cssContent = (await import('highlight.js/styles/stackoverflow-light.css?raw')).default;
    document.documentElement.classList.add('light-theme');
  } else {
    // 暗色主题：使用 tokyo-night-dark，现代优雅，紫色调与网站风格一致
    cssContent = (await import('highlight.js/styles/tokyo-night-dark.css?raw')).default;
    document.documentElement.classList.remove('light-theme');
  }

  // 将加载的 CSS 字符串内容注入到 <style> 元素中
  highlightStyleElement.textContent = cssContent;
};

// 4. 监听 themeStore 的变化，并调用更新函数
watch(() => themeStore.theme, (newTheme) => {
  updateHighlightTheme(newTheme);
});

// 优化的渐变配色方案 - 更加梦幻和柔和
const backgroundColors = computed(() => {
  if (route.name === 'login') {
    // 登录页：清新的蓝绿渐变系
    return ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'];
  } else {
    // 主页：温暖的紫粉蓝橙渐变系
    return ['#ec4899', '#8b5cf6', '#3b82f6', '#f97316'];
  }
});
</script>

<template>
  <DynamicBackground :blob-colors="backgroundColors" :theme="themeStore.theme"/>
  <router-view/>
</template>

<style scoped>
/* 保持为空或只包含 App.vue 自身的样式 */
</style>
<!-- D:/projects/intellibuddy/src/App.vue -->
<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useThemeStore} from './stores/theme';
import {useKeyboard, SHORTCUTS} from './composables/useKeyboard';
import DynamicBackground from './components/DynamicBackground.vue';
import GlobalSearch from './components/GlobalSearch.vue';
import PageTransition from './components/PageTransition.vue';

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();
const {registerShortcut} = useKeyboard();

const showSearch = ref(false);
const showTransition = ref(false);
const pageTransitionRef = ref<InstanceType<typeof PageTransition>>();

// --- 【Vite 终极修复】: 动态导入并管理本地 highlight.js 主题 ---

// 1. 创建一个变量来持有<style>元素
let highlightStyleElement: HTMLStyleElement | null = null;

// 2. 组件挂载时，创建<style>元素并添加到<head>
onMounted(() => {
  highlightStyleElement = document.createElement('style');
  highlightStyleElement.id = 'highlight-theme'; // 给它一个ID方便识别
  document.head.appendChild(highlightStyleElement);

  // 立即根据当前主题设置一次样式
  updateHighlightTheme(themeStore.theme as 'light' | 'dark');
  
  // 注册全局快捷键
  registerShortcut(SHORTCUTS.SEARCH, () => {
    showSearch.value = true;
  });
  
  // 配置路由守卫，实现页面转场效果
  setupRouterGuards();
});

// 设置路由守卫
const setupRouterGuards = () => {
  router.beforeEach((to, from, next) => {
    // 只在从登录页跳转到主应用时显示转场动画
    if (from.name === 'login' && to.meta.requiresAuth) {
      showTransition.value = true;
      pageTransitionRef.value?.show();
      
      // 延迟导航，让转场动画先显示（600ms = slideDown 动画时间）
      setTimeout(() => {
        next();
        
        // 导航完成后，等待一段时间让页面内容渲染，然后隐藏转场动画
        setTimeout(() => {
          pageTransitionRef.value?.hide();
        }, 100);
      }, 600);
    } else {
      // 其他路由直接通过
      next();
    }
  });
};

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
  updateHighlightTheme(newTheme as 'light' | 'dark');
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
  
  <!-- 全局搜索对话框 -->
  <GlobalSearch v-model="showSearch" />
  
  <!-- 页面转场动画 -->
  <PageTransition 
    ref="pageTransitionRef"
    v-model="showTransition" 
    text="智学伴"
    :duration="1500"
  />
</template>

<style scoped>
/* 保持为空或只包含 App.vue 自身的样式 */
</style>
<template>
  <!-- 只在学生端的移动设备上显示底部导航 -->
  <nav class="bottom-nav" v-if="isMobile && userStore.user?.role === 'student'">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="bottom-nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <i :class="item.icon"></i>
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const isMobile = ref(false);
const userStore = useUserStore();

// 导航项配置（只用于学生端）
const navItems = computed(() => {
  return [
    {
      path: '/app',
      icon: 'fa-solid fa-house',
      label: '首页',
    },
    {
      path: '/app/knowledge',
      icon: 'fa-solid fa-book',
      label: '知识库',
    },
    {
      path: '/app/my-classes',
      icon: 'fa-solid fa-users-class',
      label: '班级',
    },
    {
      path: '/app/profile',
      icon: 'fa-solid fa-user',
      label: '我的',
    },
  ];
});

// 判断是否激活
const isActive = (path: string) => {
  // 精确匹配首页
  if (path === '/app') {
    return route.path === '/app';
  }
  // 其他路径使用 startsWith 匹配
  return route.path.startsWith(path);
};

// 检测屏幕尺寸
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.bottom-nav {
  display: none; /* 默认隐藏，在响应式CSS中控制显示 */
}

/* 在移动端CSS中已定义样式 */
</style>



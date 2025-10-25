<template>
  <nav class="bottom-nav" v-if="isMobile">
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

// 导航项配置
const navItems = computed(() => {
  // 教师和管理员只显示教师管理
  if (userStore.user?.role === 'teacher' || userStore.user?.role === 'admin') {
    return [
      {
        path: '/app/teacher',
        icon: 'fa-solid fa-chalkboard-user',
        label: '教师管理',
      },
    ];
  }
  
  // 学生显示完整的学习功能导航
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



<template>
  <div class="app-layout">
    <header class="main-header">
      <div class="logo">
        <i class="fa-solid fa-brain"></i> <span>智学伴</span>
      </div>
      <nav class="navigation">
        <router-link :to="{ name: 'dashboard' }" class="nav-item">
          <i class="fa-solid fa-chart-pie"></i> 仪表盘
        </router-link>
        <router-link :to="{ name: 'profile' }" class="nav-item">
          <i class="fa-solid fa-user"></i> 我的档案
        </router-link>
        <router-link :to="{ name: 'knowledge' }" class="nav-item">
          <i class="fa-solid fa-book"></i> 知识库
        </router-link>
      </nav>
      <div class="user-actions">
        <button class="action-btn" title="切换主题" @click="themeStore.toggleTheme">
          <i :class="themeStore.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"></i>
        </button>
        <button class="action-btn" title="通知"><i class="fa-solid fa-bell"></i></button>

        <el-dropdown>
          <div class="user-avatar" :title="userStore.user?.username || '用户'"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.name"/>
        </transition>
      </router-view>
    </main>

    <button class="fab" @click="userStore.toggleChat(true)">
      <i class="fa-solid fa-headset"></i>
    </button>

    <AIChatWindow v-if="userStore.isChatOpen" />
  </div>
</template>

<script setup lang="ts">
import '@fortawesome/fontawesome-free/css/all.css';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import AIChatWindow from '@/components/AIChatWindow.vue';
import { useThemeStore } from '@/stores/theme';

const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
}
</script>

<style scoped>
/* 样式部分保持不变 */
.app-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px 20px;
  min-height: 100vh;
}

.main-header {
  position: fixed;
  top: 20px;
  width: 95%;
  max-width: 1200px;
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;

  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  transition: background 0.3s ease, border 0.3s ease; /* 添加平滑过渡 */
}

.logo {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.navigation {
  display: flex;
  gap: 10px;
}

.nav-item {
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item:hover {
  background-color: rgba(128, 128, 128, 0.1); /* 适配亮暗模式的悬浮色 */
  color: var(--text-primary);
}

.router-link-exact-active {
  background-color: var(--primary-color);
  color: white !important;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.action-btn:hover {
  color: var(--text-primary);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: var(--primary-color);
  border-radius: 50%;
  border: 2px solid var(--card-border);
  cursor: pointer;
}

.main-content {
  width: 100%;
  max-width: 1200px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--primary-color);
  border: none;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.fab:hover {
  transform: scale(1.1);
}
</style>
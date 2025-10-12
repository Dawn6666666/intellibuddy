<template>
  <div class="app-layout">
    <header class="main-header">
      <div class="logo">
        <img src="/favicon.png" alt="智学伴 Logo" class="header-logo" /> <span>智学伴</span>
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
      <img :src="fabIcon" alt="AI 助教" class="fab-icon" />
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
import fabIcon from '@/assets/images/ai-chat-logo.png';

const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px 20px;
  min-height: 100vh;
  width: 100%;
}

.main-header {
  position: fixed;
  top: 20px;
  width: 95%;
  /* 【修改】放宽最大宽度 */
  max-width: 1400px;
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
  transition: background 0.3s ease, border 0.3s ease;
}

.logo {
  /* 【修改】字体单位改为 rem */
  font-size: 1.125rem; /* 18px -> 1.125rem */
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo .header-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
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
  /* 【修改】字体单位改为 rem */
  font-size: 0.875rem; /* 14px -> 0.875rem */
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.nav-item:hover {
  background-color: rgba(128, 128, 128, 0.1);
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
  /* 【修改】字体单位改为 rem */
  font-size: 1.125rem; /* 18px -> 1.125rem */
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
  /* 【修改】放宽最大宽度 */
  max-width: 1400px;
  /* 确保sticky定位正常工作 */
  position: relative;
  overflow: visible;
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
  padding: 0;
}

.fab:hover {
  transform: scale(1.1);
}

.fab-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>
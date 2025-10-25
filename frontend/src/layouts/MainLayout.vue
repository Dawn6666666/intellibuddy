<template>
  <div class="app-layout">
    <header class="main-header">
      <div class="logo">
        <img src="/favicon.png" alt="智学伴 Logo" class="header-logo" /> <span>智学伴</span>
      </div>
      
      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <i :class="mobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
      </button>
      
      <!-- 导航菜单 -->
      <nav class="navigation" :class="{ 'mobile-open': mobileMenuOpen }">
        <!-- 学生端导航 - 仅对学生显示 -->
        <template v-if="userStore.user?.role === 'student'">
          <router-link :to="{ name: 'dashboard' }" class="nav-item" @click="closeMobileMenu">
            <i class="fa-solid fa-chart-pie"></i> <span class="nav-text">仪表盘</span>
          </router-link>
          <router-link :to="{ name: 'knowledge' }" class="nav-item" @click="closeMobileMenu">
            <i class="fa-solid fa-book"></i> <span class="nav-text">知识库</span>
          </router-link>
          <router-link :to="{ name: 'wrong-questions' }" class="nav-item" @click="closeMobileMenu">
            <i class="fa-solid fa-book-bookmark"></i> <span class="nav-text">错题本</span>
          </router-link>
          <router-link :to="{ name: 'my-classes' }" class="nav-item" @click="closeMobileMenu">
            <i class="fa-solid fa-users"></i> <span class="nav-text">我的班级</span>
          </router-link>
          <router-link :to="{ name: 'profile' }" class="nav-item" @click="closeMobileMenu">
            <i class="fa-solid fa-user"></i> <span class="nav-text">我的档案</span>
          </router-link>
        </template>
        
        <!-- 教师端导航 - 对教师和管理员显示 -->
        <router-link 
          v-if="userStore.user?.role === 'teacher' || userStore.user?.role === 'admin'" 
          :to="{ name: 'teacher' }" 
          class="nav-item" 
          @click="closeMobileMenu"
        >
          <i class="fa-solid fa-chalkboard-user"></i> <span class="nav-text">教师管理</span>
        </router-link>
      </nav>
      
      <div class="user-actions">
        <button class="action-btn" title="切换主题" @click="themeStore.toggleTheme">
          <i :class="themeStore.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"></i>
        </button>
        <el-popover 
          v-model:visible="showNotifications" 
          placement="bottom-end" 
          :width="420"
          trigger="hover"
          :show-after="200"
          :hide-after="200"
          popper-class="notification-popover"
        >
          <template #reference>
            <button class="action-btn desktop-only notification-btn" title="通知">
              <i class="fa-solid fa-bell"></i>
              <span v-if="notificationCount > 0" class="notification-badge">
                {{ notificationCount > 99 ? '99+' : notificationCount }}
              </span>
            </button>
          </template>
          <NotificationPanel 
            v-if="showNotifications"
            @update-count="notificationCount = $event"
            @close="showNotifications = false"
          />
        </el-popover>

        <el-dropdown class="desktop-only">
          <div class="user-avatar" :title="userStore.user?.username || '用户'">
            <img v-if="userStore.user?.avatarUrl" :src="getAvatarUrl()" alt="头像" />
            <i v-else class="fa-solid fa-user"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/app/account')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="$router.push('/app/settings')">设置</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 移动端遮罩层 -->
    <div class="mobile-overlay" :class="{ active: mobileMenuOpen }" @click="closeMobileMenu"></div>

    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.name === 'knowledge' ? '' : 'fade'" mode="out-in">
          <keep-alive :include="['KnowledgeBaseView']">
            <component :is="Component" :key="route.name === 'knowledge' ? undefined : route.name"/>
          </keep-alive>
        </transition>
      </router-view>
    </main>

    <!-- 移动端底部导航 -->
    <BottomNavigation />

    <button class="fab" @click="userStore.toggleChat(true)">
      <img :src="fabIcon" alt="AI 助教" class="fab-icon" />
    </button>

    <AIChatWindow v-if="userStore.isChatOpen" />
  </div>
</template>

<script setup lang="ts">
import '@fortawesome/fontawesome-free/css/all.css';
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import AIChatWindow from '@/components/AIChatWindow.vue';
import BottomNavigation from '@/components/BottomNavigation.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';
import { useThemeStore } from '@/stores/theme';
import { useMobile } from '@/composables/useMobile';
import { apiClient } from '@/services/apiService';
import fabIcon from '@/assets/images/ai-chat-logo.png';

const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();
const { isMobile, disableScroll, enableScroll } = useMobile();

const showNotifications = ref(false);
const notificationCount = ref(0);

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    disableScroll();
  } else {
    enableScroll();
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  enableScroll();
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

async function loadUnreadCount() {
  try {
    const response = await apiClient.get('/notification/unread-count');
    notificationCount.value = response.data.count;
  } catch (error) {
    console.error('获取未读通知数失败:', error);
  }
}

let notificationInterval: number | null = null;

onMounted(() => {
  loadUnreadCount();
  // 每30秒刷新一次未读数
  notificationInterval = window.setInterval(() => {
    loadUnreadCount();
  }, 30000);
});

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
});

const getAvatarUrl = () => {
  if (!userStore.user?.avatarUrl) return '';
  
  // 如果是外部链接（GitHub 等），直接返回
  if (userStore.user.avatarUrl.startsWith('http://') || 
      userStore.user.avatarUrl.startsWith('https://')) {
    return userStore.user.avatarUrl;
  }
  
  // 如果是本地上传的，添加服务器基础 URL（不带 /api 前缀）
  // 在开发环境中，Vite 会代理 /uploads 到后端服务器
  return userStore.user.avatarUrl;
}

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
  position: relative;
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
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar i {
  color: white;
  font-size: 1rem;
}

.main-content {
  width: 100%;
  /* 【修改】放宽最大宽度 */
  max-width: 1400px;
  /* 确保sticky定位正常工作 */
  position: relative;
  overflow: visible;
  /* 【修复】添加最小高度，确保内容可见 */
  min-height: calc(100vh - 140px);
  flex: 1;
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

/* 移动端导航菜单 */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--text-primary);
}

/* 移动端遮罩层 */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* 移动端样式 */
@media (max-width: 767px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .app-layout {
    padding: 80px 10px 70px;
  }
  
  .main-header {
    top: 10px;
    width: calc(100% - 20px);
    height: 56px;
    padding: 0 16px;
  }
  
  .logo {
    font-size: 1rem;
  }
  
  .logo .header-logo {
    width: 32px;
    height: 32px;
  }
  
  .navigation {
    position: fixed;
    top: 76px;
    left: -100%;
    width: 280px;
    height: calc(100vh - 76px);
    background: var(--card-bg);
    backdrop-filter: blur(var(--backdrop-blur));
    flex-direction: column;
    gap: 0;
    padding: 1rem;
    transition: left 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
    border-right: 1px solid var(--card-border);
  }
  
  .navigation.mobile-open {
    left: 0;
  }
  
  .nav-item {
    width: 100%;
    padding: 12px 16px;
    justify-content: flex-start;
    font-size: 1rem;
  }
  
  .user-actions {
    gap: 8px;
  }
  
  .action-btn {
    font-size: 1rem;
  }
  
  .fab {
    bottom: 80px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
  
  .mobile-overlay {
    display: block;
  }
}

/* 平板样式 */
@media (min-width: 768px) and (max-width: 1023px) {
  .app-layout {
    padding: 90px 15px 20px;
  }
  
  .main-header {
    width: calc(100% - 30px);
  }
  
  .navigation {
    gap: 8px;
  }
  
  .nav-item {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .fab {
    bottom: 20px;
    right: 20px;
  }
}

/* 通知按钮样式 */
.notification-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f56c6c;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  font-weight: 600;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(245, 108, 108, 0.4);
}

.notification-badge:empty {
  display: none;
}
</style>

<style>
/* 全局样式 - 通知弹出框 */
.notification-popover {
  padding: 0 !important;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}

.notification-popover .el-popover__body {
  padding: 0 !important;
}
</style>
<template>
  <div class="app-layout">
    <header class="main-header">
      <div class="logo">
        <img src="/favicon.png" alt="智学伴 Logo" class="header-logo" /> <span>智学伴</span>
      </div>
      
      <!-- 移动端汉堡菜单按钮（学生端和教师端共用） -->
      <button 
        class="menu-toggle mobile-only" 
        @click="toggleMobileMenu"
        :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
      >
        <i :class="isMobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'"></i>
      </button>
      
      <!-- 导航菜单（仅桌面端显示） -->
      <nav class="navigation desktop-nav">
        <!-- 学生端导航 - 仅对学生显示 -->
        <template v-if="userStore.user?.role === 'student'">
          <router-link :to="{ name: 'dashboard' }" class="nav-item">
            <i class="fa-solid fa-chart-pie"></i> <span class="nav-text">仪表盘</span>
          </router-link>
          <router-link :to="{ name: 'knowledge' }" class="nav-item">
            <i class="fa-solid fa-book"></i> <span class="nav-text">知识库</span>
          </router-link>
          <router-link :to="{ name: 'wrong-questions' }" class="nav-item">
            <i class="fa-solid fa-book-bookmark"></i> <span class="nav-text">错题本</span>
          </router-link>
          <router-link :to="{ name: 'my-classes' }" class="nav-item">
            <i class="fa-solid fa-users"></i> <span class="nav-text">我的班级</span>
          </router-link>
          <router-link :to="{ name: 'profile' }" class="nav-item">
            <i class="fa-solid fa-user"></i> <span class="nav-text">我的档案</span>
          </router-link>
        </template>
        
        <!-- 教师端导航 - 对教师和管理员显示 -->
        <template v-if="userStore.user?.role === 'teacher' || userStore.user?.role === 'admin'">
          <a 
            @click="navigateToTeacherTab('classes')" 
            class="nav-item"
            :class="{ 'router-link-active': isTeacherTabActive('classes') }"
          >
            <i class="fa-solid fa-chalkboard"></i> <span class="nav-text">班级管理</span>
          </a>
          <a 
            @click="navigateToTeacherTab('assignments')" 
            class="nav-item"
            :class="{ 'router-link-active': isTeacherTabActive('assignments') }"
          >
            <i class="fa-solid fa-clipboard-list"></i> <span class="nav-text">作业管理</span>
          </a>
          <a 
            @click="navigateToTeacherTab('students')" 
            class="nav-item"
            :class="{ 'router-link-active': isTeacherTabActive('students') }"
          >
            <i class="fa-solid fa-user-graduate"></i> <span class="nav-text">学生监控</span>
          </a>
          <a 
            @click="navigateToTeacherTab('question-bank')" 
            class="nav-item"
            :class="{ 'router-link-active': isTeacherTabActive('question-bank') }"
          >
            <i class="fa-solid fa-database"></i> <span class="nav-text">题库管理</span>
          </a>
          <a 
            @click="navigateToTeacherTab('analytics')" 
            class="nav-item"
            :class="{ 'router-link-active': isTeacherTabActive('analytics') }"
          >
            <i class="fa-solid fa-chart-line"></i> <span class="nav-text">数据分析</span>
          </a>
        </template>
      </nav>
      
      <!-- 移动端侧边栏菜单（学生端和教师端共用） -->
      <transition name="slide">
        <div v-if="isMobileMenuOpen" class="mobile-menu" @click.self="closeMobileMenu">
          <nav class="mobile-nav">
            <!-- 学生端导航 -->
            <template v-if="userStore.user?.role === 'student'">
              <router-link :to="{ name: 'dashboard' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-chart-pie"></i> <span>仪表盘</span>
              </router-link>
              <router-link :to="{ name: 'knowledge' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-book"></i> <span>知识库</span>
              </router-link>
              <router-link :to="{ name: 'wrong-questions' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-book-bookmark"></i> <span>错题本</span>
              </router-link>
              <router-link :to="{ name: 'my-classes' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-users"></i> <span>我的班级</span>
              </router-link>
              <router-link :to="{ name: 'profile' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-user"></i> <span>我的档案</span>
              </router-link>
              <router-link :to="{ name: 'account' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-gear"></i> <span>个人中心</span>
              </router-link>
              <router-link :to="{ name: 'settings' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-cog"></i> <span>设置</span>
              </router-link>
            </template>
            
            <!-- 教师端导航 -->
            <template v-if="userStore.user?.role === 'teacher' || userStore.user?.role === 'admin'">
              <a 
                @click="navigateToTeacherTab('classes'); closeMobileMenu()" 
                class="mobile-nav-item"
                :class="{ 'router-link-active': isTeacherTabActive('classes') }"
              >
                <i class="fa-solid fa-chalkboard"></i> <span>班级管理</span>
              </a>
              <a 
                @click="navigateToTeacherTab('assignments'); closeMobileMenu()" 
                class="mobile-nav-item"
                :class="{ 'router-link-active': isTeacherTabActive('assignments') }"
              >
                <i class="fa-solid fa-clipboard-list"></i> <span>作业管理</span>
              </a>
              <a 
                @click="navigateToTeacherTab('students'); closeMobileMenu()" 
                class="mobile-nav-item"
                :class="{ 'router-link-active': isTeacherTabActive('students') }"
              >
                <i class="fa-solid fa-user-graduate"></i> <span>学生监控</span>
              </a>
              <a 
                @click="navigateToTeacherTab('question-bank'); closeMobileMenu()" 
                class="mobile-nav-item"
                :class="{ 'router-link-active': isTeacherTabActive('question-bank') }"
              >
                <i class="fa-solid fa-database"></i> <span>题库管理</span>
              </a>
              <a 
                @click="navigateToTeacherTab('analytics'); closeMobileMenu()" 
                class="mobile-nav-item"
                :class="{ 'router-link-active': isTeacherTabActive('analytics') }"
              >
                <i class="fa-solid fa-chart-line"></i> <span>数据分析</span>
              </a>
              <router-link :to="{ name: 'account' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-gear"></i> <span>个人中心</span>
              </router-link>
              <router-link :to="{ name: 'settings' }" class="mobile-nav-item" @click="closeMobileMenu">
                <i class="fa-solid fa-cog"></i> <span>设置</span>
              </router-link>
            </template>
            
            <!-- 退出登录按钮（所有角色共用） -->
            <button class="mobile-nav-item logout-btn" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i> <span>退出登录</span>
            </button>
          </nav>
        </div>
      </transition>
      
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
    
    <!-- 用户引导 -->
    <UserGuide 
      v-if="guideSteps.length > 0"
      :steps="guideSteps" 
      :storage-key="guideStorageKey"
      @complete="handleGuideComplete"
      @skip="handleGuideSkip"
    />
  </div>
</template>

<script setup lang="ts">
import '@fortawesome/fontawesome-free/css/all.css';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';
import AIChatWindow from '@/components/AIChatWindow.vue';
import BottomNavigation from '@/components/BottomNavigation.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';
import UserGuide from '@/components/UserGuide.vue';
import { useThemeStore } from '@/stores/theme';
import { apiClient } from '@/services/apiService';
import fabIcon from '@/assets/images/ai-chat-logo.png';

const userStore = useUserStore();
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();

const showNotifications = ref(false);
const notificationCount = ref(0);
const isMobileMenuOpen = ref(false);

// 检查教师端标签页是否激活
const isTeacherTabActive = (tab: string) => {
  return route.name === 'teacher' && route.hash === `#${tab}`;
};

// 导航到教师端标签页
const navigateToTeacherTab = (tab: string) => {
  router.push({ name: 'teacher', hash: `#${tab}` });
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // 防止背景滚动
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
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
  closeMobileMenu(); // 关闭移动菜单
  userStore.logout();
  router.push('/login');
}

// 用户引导配置
const guideStorageKey = computed(() => {
  const role = userStore.user?.role || 'student';
  return `user-guide-completed-${role}`;
});

const guideSteps = computed(() => {
  const role = userStore.user?.role;
  
  if (role === 'teacher' || role === 'admin') {
    // 教师端引导
    return [
      {
        title: '欢迎使用智学伴教师端',
        description: '让我们快速了解如何使用教师管理功能，帮助您更好地管理班级和学生。',
        icon: 'fa-solid fa-hand-wave',
      },
      {
        title: '移动端导航菜单',
        description: '在移动设备上，点击左上角的菜单按钮可以快速访问所有功能。',
        icon: 'fa-solid fa-bars',
        target: '.menu-toggle',
        position: 'bottom' as const,
      },
      {
        title: '班级管理',
        description: '在这里您可以创建和管理班级，查看班级学生列表，以及管理班级设置。',
        icon: 'fa-solid fa-chalkboard',
        target: 'a[href*="teacher"][href*="classes"]',
        position: 'bottom' as const,
      },
      {
        title: '作业管理',
        description: '发布作业、查看学生提交情况、批改作业，所有作业管理功能都在这里。',
        icon: 'fa-solid fa-clipboard-list',
        target: 'a[href*="teacher"][href*="assignments"]',
        position: 'bottom' as const,
      },
      {
        title: '学生监控',
        description: '实时查看学生的学习进度、答题情况和知识点掌握程度，及时发现问题。',
        icon: 'fa-solid fa-user-graduate',
        target: 'a[href*="teacher"][href*="students"]',
        position: 'bottom' as const,
      },
      {
        title: '题库管理',
        description: '管理您的题库，创建、编辑和组织题目，为作业和考试做准备。',
        icon: 'fa-solid fa-database',
        target: 'a[href*="teacher"][href*="question-bank"]',
        position: 'bottom' as const,
      },
      {
        title: 'AI 智能助教',
        description: '点击右下角的 AI 助教，可以快速获取帮助、生成题目、分析数据等。',
        icon: 'fa-solid fa-robot',
        target: '.fab',
        position: 'left' as const,
      },
    ];
  } else {
    // 学生端引导
    return [
      {
        title: '欢迎来到智学伴',
        description: '这是一个智能学习平台，让我们一起开始学习之旅吧！',
        icon: 'fa-solid fa-graduation-cap',
      },
      {
        title: '仪表盘',
        description: '这里可以查看您的学习概况、最近的作业和学习进度。',
        icon: 'fa-solid fa-chart-pie',
        target: 'a[href="/app"]',
        position: 'bottom' as const,
      },
      {
        title: '知识库',
        description: '浏览和学习各种知识点，AI 会根据您的学习情况智能推荐内容。',
        icon: 'fa-solid fa-book',
        target: 'a[href*="knowledge"]',
        position: 'bottom' as const,
      },
      {
        title: '错题本',
        description: '自动收集您做错的题目，帮助您针对性地复习和巩固。',
        icon: 'fa-solid fa-book-bookmark',
        target: 'a[href*="wrong-questions"]',
        position: 'bottom' as const,
      },
      {
        title: '我的班级',
        description: '查看您所在的班级、班级作业和同学动态。',
        icon: 'fa-solid fa-users',
        target: 'a[href*="my-classes"]',
        position: 'bottom' as const,
      },
      {
        title: 'AI 智能助教',
        description: '遇到问题？点击右下角的 AI 助教，随时为您解答疑惑！',
        icon: 'fa-solid fa-robot',
        target: '.fab',
        position: 'left' as const,
      },
    ];
  }
});

const handleGuideComplete = () => {
  console.log('用户引导完成');
};

const handleGuideSkip = () => {
  console.log('用户跳过引导');
};
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
  cursor: pointer;
}

.nav-item:hover {
  background-color: rgba(128, 128, 128, 0.1);
  color: var(--text-primary);
}

/* 激活状态样式 */
/* 优先级1: 学生端精确匹配（router-link 自动添加） */
a.nav-item.router-link-exact-active {
  background-color: var(--primary-color);
  color: white !important;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

/* 优先级2: 教师端手动激活（<a> 标签手动添加的类） */
a.nav-item.router-link-active:not([href]) {
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

/* 汉堡菜单按钮 */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  transition: color 0.3s ease;
}

.menu-toggle:hover {
  color: var(--primary-color);
}

/* 移动端侧边栏菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  display: flex;
  justify-content: flex-start;
}

.mobile-nav {
  width: 280px;
  height: 100%;
  background: var(--card-bg);
  padding: 80px 0 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-nav-item:hover {
  background: rgba(138, 127, 251, 0.1);
  color: var(--text-primary);
}

.mobile-nav-item.router-link-exact-active,
.mobile-nav-item.router-link-active {
  background: var(--primary-color);
  color: white;
  font-weight: 500;
}

.mobile-nav-item i {
  width: 20px;
  text-align: center;
}

.logout-btn {
  margin-top: auto;
  color: #f56c6c;
  border-top: 1px solid var(--card-border);
}

.logout-btn:hover {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

/* 侧边栏滑入动画 */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-active .mobile-nav,
.slide-leave-active .mobile-nav {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .mobile-nav {
  transform: translateX(-100%);
}

.slide-leave-to .mobile-nav {
  transform: translateX(-100%);
}

/* 移动端样式 */
@media (max-width: 767px) {
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
  
  /* 移动端显示汉堡菜单按钮 */
  .menu-toggle {
    display: block;
  }
  
  /* 移动端隐藏桌面导航 */
  .navigation {
    display: none;
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

/* 响应式显示控制 */
.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

@media (max-width: 767px) {
  .mobile-only {
    display: block;
  }
  
  .desktop-only {
    display: none !important;
  }
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
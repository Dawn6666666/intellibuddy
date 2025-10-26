<template>
  <div class="dashboard-container">
    <!-- 加载中显示骨架屏 -->
    <div v-if="loading" class="dashboard-grid">
      <div class="card welcome-card">
        <SkeletonLoader type="text" :rows="3" />
      </div>
      <div class="card stats-card">
        <SkeletonLoader type="text" :rows="4" />
      </div>
      <div class="card knowledge-graph-card">
        <SkeletonLoader type="chart" height="500px" />
      </div>
    </div>

    <!-- 加载完成显示内容 -->
    <div v-else class="dashboard-grid">
      <div class="card welcome-card" data-tour="welcome">
        <h3>{{ userStore.greeting }}</h3>
        <p>准备好开始新的学习旅程了吗？</p>
        <button class="start-btn" @click="startLearning">
          <i class="fa-solid fa-rocket"></i> 开始今日学习
        </button>
      </div>

      <div class="card stats-card" data-tour="stats" v-if="settingsStore.privacy.showProgress">
        <h4>学习进度一览</h4>
        <div class="stats-item">
          <span>已掌握知识点</span>
          <span class="value"
            >{{ userStore.progressStats.completed }} / {{ userStore.progressStats.total }}</span
          >
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: userStore.progressStats.percentage + '%' }"></div>
        </div>
        <div class="stats-item">
          <span>总学习时长</span>
          <span class="value">{{ studyTimeDisplay }}</span>
        </div>
      </div>

      <div class="card stats-card" v-else>
        <h4>学习进度一览</h4>
        <div style="text-align: center; padding: 20px; color: #999;">
          <i class="fa-solid fa-eye-slash" style="font-size: 48px; margin-bottom: 10px;"></i>
          <p>您已在设置中隐藏学习进度</p>
          <el-button type="primary" size="small" @click="goToSettings">
            前往设置
          </el-button>
        </div>
      </div>

      <div class="card knowledge-graph-card" data-tour="graph">
        <div class="card-header">
          <h4><i class="fa-solid fa-sitemap"></i> 计算机科学知识图谱</h4>
          <span>你的推荐路径已高亮显示</span>
        </div>
        <div class="graph-container">
          <KnowledgeGraph
            :knowledge-points="knowledgeStore.pointsAsArrayWithProgress"
            :recommended-path="userStore.recommendedPath"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { useKnowledgeStore } from '@/stores/knowledge';
import { useSettingsStore } from '@/stores/settings';
import KnowledgeGraph from '@/components/KnowledgeGraph.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { apiGetStudyTimeSimple } from '@/services/apiService';

const userStore = useUserStore();
const knowledgeStore = useKnowledgeStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const studyTimeDisplay = ref('0小时 0分钟');

// 加载学习时长统计
const loadStudyTime = async () => {
  if (!userStore.token) return;

  try {
    const stats = await apiGetStudyTimeSimple(userStore.token);
    const hours = stats.totalHours || 0;
    const minutes = stats.totalMinutes || 0;
    studyTimeDisplay.value = `${hours}小时 ${minutes}分钟`;
  } catch (error) {
    console.error('加载学习时长失败:', error);
    studyTimeDisplay.value = '0小时 0分钟';
  }
};

// 初始化加载
const initDashboard = async () => {
  loading.value = true;

  try {
    await Promise.all([
      loadStudyTime(),
      // 确保知识点数据已加载
      knowledgeStore.pointsAsArrayWithProgress.length === 0
        ? knowledgeStore.fetchKnowledgePoints()
        : Promise.resolve(),
    ]);

    // 模拟最小加载时间，让用户看到骨架屏（提升体验）
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('加载Dashboard数据失败:', error);
    ElMessage.error('加载数据失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
};

// 开始学习
const startLearning = () => {
  // 跳转到推荐的第一个知识点，或知识库页面
  if (userStore.recommendedPath && userStore.recommendedPath.length > 0) {
    const firstPoint = userStore.recommendedPath[0];
    router.push(`/app/learn/${firstPoint}`);
  } else {
    router.push('/app/knowledge');
  }
};

// 前往设置
const goToSettings = () => {
  router.push('/app/settings');
};

onMounted(() => {
  initDashboard();
});

// 监听路由变化，当返回到 dashboard 时重新加载数据
watch(
  () => route.name,
  newName => {
    if (newName === 'dashboard') {
      initDashboard();
    }
  }
);
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  /* 【修改】使用 grid-template-areas 来定义布局，更利于响应式 */
  grid-template-areas:
    'welcome stats stats'
    'graph   graph graph';
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
  height: 100%;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
}

/* 【修改】使用 grid-area 替代 grid-column/row */
.welcome-card {
  grid-area: welcome;
}

.stats-card {
  grid-area: stats;
}

.knowledge-graph-card {
  grid-area: graph;
  display: flex;
  flex-direction: column;
}

.welcome-card h3 {
  font-size: 1.5rem; /* 24px -> 1.5rem */
  margin-bottom: 8px;
}

.welcome-card p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.start-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 1rem; /* 16px -> 1rem */
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(138, 127, 251, 0.4);
}

.stats-card h4 {
  font-size: 1rem; /* 16px -> 1rem */
  font-weight: 500;
  margin-bottom: 16px;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem; /* 14px -> 0.875rem */
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stats-item .value {
  color: var(--text-primary);
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  margin-bottom: 16px;
}

.progress {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
  transition: width 0.5s ease-in-out;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h4 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.125rem; /* 18px -> 1.125rem */
}

.card-header span {
  font-size: 0.875rem; /* 14px -> 0.875rem */
  color: var(--text-secondary);
}

.graph-container {
  flex-grow: 1;
  border-radius: 10px;
  overflow: hidden;
  min-height: 500px;
}

/* 【新增】媒体查询，用于响应式布局 */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-areas:
      'welcome'
      'stats'
      'graph';
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}
</style>

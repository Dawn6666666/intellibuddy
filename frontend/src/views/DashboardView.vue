<template>
  <div class="dashboard-grid">
    <div class="card welcome-card">
      <h3>{{ userStore.greeting }}</h3>
      <p>准备好开始新的学习旅程了吗？</p>
      <button class="start-btn">
        <i class="fa-solid fa-rocket"></i> 开始今日学习
      </button>
    </div>

    <div class="card stats-card">
      <h4>学习进度一览</h4>
      <div class="stats-item">
        <span>已掌握知识点</span>
        <span class="value">{{ userStore.progressStats.completed }} / {{ userStore.progressStats.total }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: userStore.progressStats.percentage + '%' }"></div>
      </div>
      <div class="stats-item">
        <span>总学习时长</span>
        <span class="value">{{ studyTimeDisplay }}</span></div>
    </div>

    <div class="card knowledge-graph-card">
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {useUserStore} from '@/stores/user';
import {useKnowledgeStore} from '@/stores/knowledge';
import KnowledgeGraph from '@/components/KnowledgeGraph.vue';
import { apiGetStudyTimeStats } from '@/services/apiService';

const userStore = useUserStore();
const knowledgeStore = useKnowledgeStore();
const route = useRoute();

const studyTimeDisplay = ref('0小时 0分钟');

// 加载学习时长统计
const loadStudyTime = async () => {
  if (!userStore.token) return;
  
  try {
    const stats = await apiGetStudyTimeStats(userStore.token);
    const hours = stats.totalHours || 0;
    const minutes = stats.totalMinutes || 0;
    studyTimeDisplay.value = `${hours}小时 ${minutes}分钟`;
  } catch (error) {
    console.error('加载学习时长失败:', error);
    studyTimeDisplay.value = '0小时 0分钟';
  }
};

onMounted(() => {
  loadStudyTime();
});

// 监听路由变化，当返回到 dashboard 时重新加载数据
watch(() => route.name, (newName) => {
  if (newName === 'dashboard') {
    loadStudyTime();
  }
});
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  /* 【修改】使用 grid-template-areas 来定义布局，更利于响应式 */
  grid-template-areas:
    "welcome stats stats"
    "graph   graph graph";
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
      "welcome"
      "stats"
      "graph";
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}
</style>
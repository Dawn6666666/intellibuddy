<template>
  <div class="dashboard-grid">
    <div class="card welcome-card">
      <!-- 1. 使用 greeting getter -->
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
        <!-- 2. 动态绑定学习进度 -->
        <span class="value">{{ userStore.progress.completed }} / {{ userStore.progress.total }}</span>
      </div>
      <div class="progress-bar">
        <!-- 3. 动态计算进度条宽度 -->
        <div class="progress" :style="{ width: userStore.progressPercentage + '%' }"></div>
      </div>
      <div class="stats-item">
        <span>总学习时长</span>
        <!-- 4. 动态绑定学习时长 -->
        <span class="value">{{ userStore.studyTime }}</span>
      </div>
    </div>

    <div class="card knowledge-graph-card">
      <div class="card-header">
        <h4><i class="fa-solid fa-sitemap"></i> Vue.js 知识图谱</h4>
        <span>你的推荐路径已高亮显示</span>
      </div>
      <div class="graph-placeholder">
        <p>这里是未来放置 AntV X6 / D3.js 知识图谱的区域</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

// 如果需要，可以在组件挂载时尝试自动登录
// userStore.tryAutoLogin();
</script>

<style scoped>
/* 样式部分保持不变 */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.welcome-card {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.stats-card {
  grid-column: 2 / 4;
  grid-row: 1 / 2;
}

.knowledge-graph-card {
  grid-column: 1 / 4;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
}

.welcome-card h3 {
  font-size: 24px;
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
  font-size: 16px;
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
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.stats-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
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
  transition: width 0.5s ease-in-out; /* 为进度条添加动画效果 */
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
  font-size: 18px;
}
.card-header span {
  font-size: 14px;
  color: var(--text-secondary);
}

.graph-placeholder {
  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border: 1px dashed var(--card-border);
}
</style>

<template>
  <div class="profile-grid">
    <div class="card radar-card">
      <div class="card-header">
        <h4><i class="fa-solid fa-crosshairs"></i> 多维能力雷达图</h4>
        <span>直观了解您的技术栈掌握程度</span>
      </div>
      <div class="chart-container">
        <!-- 2. 使用雷达图组件 -->
        <RadarChart :chart-data="userStore.skillMastery" />
      </div>
    </div>
    <div class="card heatmap-card">
      <div class="card-header">
        <h4><i class="fa-solid fa-fire"></i> 学习热力图</h4>
        <span>保持持续学习的习惯</span>
      </div>
      <div class="heatmap-placeholder">
        <p>这里是未来放置学习活动热力图的区域</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. 引入雷达图组件和 user store
import RadarChart from '@/components/charts/RadarChart.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<style scoped>
.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
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
  display: flex;
  flex-direction: column;
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

.chart-container {
  flex-grow: 1;
}

.heatmap-placeholder {
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

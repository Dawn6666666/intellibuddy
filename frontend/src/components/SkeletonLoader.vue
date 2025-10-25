<template>
  <div class="skeleton-loader" :class="{ animated: animated }">
    <!-- 卡片骨架屏 -->
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-info">
          <div class="skeleton-line" style="width: 60%;"></div>
          <div class="skeleton-line" style="width: 40%; height: 12px;"></div>
        </div>
      </div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line" style="width: 70%;"></div>
      </div>
    </div>
    
    <!-- 列表骨架屏 -->
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-avatar skeleton-circle"></div>
        <div class="skeleton-content">
          <div class="skeleton-line" style="width: 80%;"></div>
          <div class="skeleton-line" style="width: 60%; height: 12px;"></div>
        </div>
      </div>
    </div>
    
    <!-- 图表骨架屏 -->
    <div v-else-if="type === 'chart'" class="skeleton-chart">
      <div class="skeleton-chart-header">
        <div class="skeleton-line" style="width: 30%;"></div>
      </div>
      <div class="skeleton-chart-body">
        <div class="skeleton-bars">
          <div v-for="i in 5" :key="i" class="skeleton-bar" :style="{ height: `${Math.random() * 60 + 20}%` }"></div>
        </div>
      </div>
    </div>
    
    <!-- 文本骨架屏 -->
    <div v-else-if="type === 'text'" class="skeleton-text">
      <div v-for="i in rows" :key="i" class="skeleton-line" :style="{ width: i === rows ? '60%' : '100%' }"></div>
    </div>
    
    <!-- 图片骨架屏 -->
    <div v-else-if="type === 'image'" class="skeleton-image" :style="{ height: height }"></div>
    
    <!-- 表格骨架屏 -->
    <div v-else-if="type === 'table'" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="i in columns" :key="i" class="skeleton-cell"></div>
      </div>
      <div v-for="i in rows" :key="i" class="skeleton-table-row">
        <div v-for="j in columns" :key="j" class="skeleton-cell"></div>
      </div>
    </div>
    
    <!-- 自定义插槽 -->
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'card' | 'list' | 'chart' | 'text' | 'image' | 'table';
  animated?: boolean;
  count?: number;
  rows?: number;
  columns?: number;
  height?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'card',
  animated: true,
  count: 3,
  rows: 3,
  columns: 4,
  height: '200px'
});
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

/* 基础骨架样式 */
.skeleton-line,
.skeleton-avatar,
.skeleton-image,
.skeleton-cell,
.skeleton-bar {
  background: linear-gradient(
    90deg,
    var(--el-fill-color-light) 25%,
    var(--el-fill-color) 50%,
    var(--el-fill-color-light) 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
}

/* 动画效果 */
.skeleton-loader.animated .skeleton-line,
.skeleton-loader.animated .skeleton-avatar,
.skeleton-loader.animated .skeleton-image,
.skeleton-loader.animated .skeleton-cell,
.skeleton-loader.animated .skeleton-bar {
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 卡片骨架 */
.skeleton-card {
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.skeleton-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  border-radius: 4px;
}

/* 列表骨架 */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-list-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.skeleton-list-item .skeleton-avatar {
  width: 40px;
  height: 40px;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-circle {
  border-radius: 50%;
}

/* 图表骨架 */
.skeleton-chart {
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.skeleton-chart-header {
  margin-bottom: 20px;
}

.skeleton-chart-body {
  height: 200px;
}

.skeleton-bars {
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.skeleton-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  min-height: 20%;
}

/* 文本骨架 */
.skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 图片骨架 */
.skeleton-image {
  width: 100%;
  border-radius: 8px;
}

/* 表格骨架 */
.skeleton-table {
  background: var(--el-bg-color);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
}

.skeleton-table-header {
  display: flex;
  gap: 1px;
  background: var(--el-fill-color-light);
  padding: 12px;
}

.skeleton-table-row {
  display: flex;
  gap: 1px;
  padding: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.skeleton-cell {
  flex: 1;
  height: 16px;
  border-radius: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .skeleton-card,
  .skeleton-chart {
    padding: 16px;
  }
  
  .skeleton-avatar {
    width: 40px;
    height: 40px;
  }
}
</style>


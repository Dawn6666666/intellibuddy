<template>
  <div class="learning-report">
    <div class="report-header">
      <h2>📊 AI 学习报告</h2>
      <el-button type="primary" @click="generateReport" :loading="generating">
        {{ generating ? '生成中...' : '生成新报告' }}
      </el-button>
    </div>

    <div v-if="loading && !report" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>正在生成您的个性化学习报告...</p>
    </div>

    <div v-else-if="report" class="report-content">
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-label">学习时长</div>
          <div class="stat-value">{{ formatTime(stats.totalTime) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">完成进度</div>
          <div class="stat-value">{{ stats.completedPoints }} / {{ stats.totalPoints }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">完成率</div>
          <div class="stat-value">{{ stats.completionRate }}%</div>
        </div>
      </div>

      <div class="markdown-content" v-html="renderedReport"></div>
    </div>

    <div v-else class="empty-state">
      <p>📝 点击上方按钮生成您的专属学习报告</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { marked } from 'marked';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const generating = ref(false);
const report = ref('');
const stats = ref({
  totalTime: 0,
  completedPoints: 0,
  totalPoints: 0,
  completionRate: 0,
  weakAreas: [],
  strongAreas: [],
});

const renderedReport = computed(() => {
  if (!report.value) return '';
  return marked(report.value);
});

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}小时${minutes}分钟`;
};

const generateReport = async () => {
  try {
    generating.value = true;
    loading.value = true;
    const token = localStorage.getItem('authToken');

    const response = await axios.post(
      '/api/learning-report/generate',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      report.value = response.data.data.report;
      stats.value = response.data.data.stats;
      ElMessage.success('学习报告生成成功！');
    }
  } catch (error) {
    console.error('生成报告失败:', error);
    ElMessage.error('生成报告失败，请稍后重试');
  } finally {
    generating.value = false;
    loading.value = false;
  }
};
</script>

<style scoped>
.learning-report {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.report-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #2d3436;
}

.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: #636e72;
}

.loading-state .el-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.report-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.markdown-content {
  line-height: 1.8;
  color: #2d3436;
}

.markdown-content :deep(h1) {
  font-size: 1.75rem;
  margin: 1.5rem 0 1rem;
  color: #6c5ce7;
  border-bottom: 2px solid #f1f3f5;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
  margin: 1.25rem 0 0.75rem;
  color: #74b9ff;
}

.markdown-content :deep(h3) {
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem;
  color: #a29bfe;
}

.markdown-content :deep(p) {
  margin: 0.75rem 0;
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.markdown-content :deep(li) {
  margin: 0.5rem 0;
}

.markdown-content :deep(strong) {
  color: #6c5ce7;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: #b2bec3;
  font-size: 1.1rem;
}
</style>


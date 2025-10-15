<template>
  <ResponsiveContainer max-width="xl">
    <div class="analytics-dashboard">
      <h1 class="page-title">📊 数据分析</h1>

      <!-- 概览卡片 -->
      <div class="grid grid-cols-4 spacing-lg">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: #409eff20">
            <el-icon :size="32" color="#409eff"><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ userStats.total }}</div>
            <div class="stat-label">总用户数</div>
            <div class="stat-change">+{{ userStats.newToday }} 今日新增</div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-icon" style="background: #67c23a20">
            <el-icon :size="32" color="#67c23a"><Odometer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ userStats.active }}</div>
            <div class="stat-label">活跃用户</div>
            <div class="stat-change">近7天</div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-icon" style="background: #e6a23c20">
            <el-icon :size="32" color="#e6a23c"><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatDuration(learningStats.all.duration) }}</div>
            <div class="stat-label">总学习时长</div>
            <div class="stat-change">{{ learningStats.all.sessions }} 次学习</div>
          </div>
        </el-card>

        <el-card class="stat-card">
          <div class="stat-icon" style="background: #f56c6c20">
            <el-icon :size="32" color="#f56c6c"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ learningStats.all.completedPoints }}</div>
            <div class="stat-label">完成知识点</div>
            <div class="stat-change">{{ learningStats.all.wrongQuestions }} 个错题</div>
          </div>
        </el-card>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-2 spacing-lg">
        <!-- 小时活跃度 -->
        <el-card>
          <template #header>
            <h3>⏰ 用户活跃时段（近7天）</h3>
          </template>
          <div ref="hourlyChartRef" class="chart-container" style="height: 300px"></div>
        </el-card>

        <!-- 热门知识点 -->
        <el-card>
          <template #header>
            <h3>🔥 热门知识点 Top 10</h3>
          </template>
          <div ref="popularChartRef" class="chart-container" style="height: 300px"></div>
        </el-card>
      </div>

      <!-- 系统性能 -->
      <el-card class="spacing-lg">
        <template #header>
          <h3>⚡ 系统性能指标</h3>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="最近1小时请求数">
            {{ systemStats.lastHour.count }}
          </el-descriptions-item>
          <el-descriptions-item label="平均响应时间">
            {{ systemStats.lastHour.averageDuration.toFixed(2) }}ms
          </el-descriptions-item>
          <el-descriptions-item label="错误率">
            <el-tag :type="systemStats.errorRate > 5 ? 'danger' : 'success'">
              {{ systemStats.errorRate.toFixed(2) }}%
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="今日请求数">
            {{ systemStats.today.count }}
          </el-descriptions-item>
          <el-descriptions-item label="今日活跃用户">
            {{ systemStats.today.uniqueUsers }}
          </el-descriptions-item>
          <el-descriptions-item label="总事件数">
            {{ systemStats.total }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 热门路径 -->
      <el-card>
        <template #header>
          <h3>📈 热门 API 路径</h3>
        </template>
        <el-table :data="systemStats.topPaths" stripe>
          <el-table-column prop="path" label="路径" />
          <el-table-column prop="count" label="访问次数" width="150" />
        </el-table>
      </el-card>
    </div>
  </ResponsiveContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User, Odometer, Timer, Document } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { useNotification } from '@/composables/useNotification';
import { useUserStore } from '@/stores/user';
import { 
  apiGetUserStats, 
  apiGetLearningStats, 
  apiGetSystemAnalytics,
  apiGetHourlyActivity,
  apiGetPopularTopics 
} from '@/services/apiService';
import ResponsiveContainer from '@/components/ResponsiveContainer.vue';

const { error } = useNotification();
const userStore = useUserStore();

const userStats = ref({
  total: 0,
  active: 0,
  newToday: 0,
});

const learningStats = ref({
  all: {
    sessions: 0,
    duration: 0,
    completedPoints: 0,
    wrongQuestions: 0,
  },
  today: {
    sessions: 0,
    duration: 0,
  },
});

const systemStats = ref<any>({
  lastHour: { count: 0, uniqueUsers: 0, averageDuration: 0 },
  today: { count: 0, uniqueUsers: 0, averageDuration: 0 },
  total: 0,
  errorRate: 0,
  topPaths: [],
});

const hourlyActivity = ref<any[]>([]);
const popularTopics = ref<any[]>([]);

const hourlyChartRef = ref<HTMLElement | null>(null);
const popularChartRef = ref<HTMLElement | null>(null);

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  return `${hours}h`;
};

const loadUserStats = async () => {
  try {
    const token = userStore.token;
    if (!token) {
      error('未登录，请先登录');
      return;
    }
    const response = await apiGetUserStats(token);
    userStats.value = response;
  } catch (err) {
    console.error('加载用户统计失败:', err);
    error('加载用户统计失败');
  }
};

const loadLearningStats = async () => {
  try {
    const token = userStore.token;
    if (!token) {
      error('未登录，请先登录');
      return;
    }
    const response = await apiGetLearningStats(token);
    learningStats.value = response;
  } catch (err) {
    console.error('加载学习统计失败:', err);
    error('加载学习统计失败');
  }
};

const loadSystemStats = async () => {
  try {
    const token = userStore.token;
    if (!token) {
      error('未登录，请先登录');
      return;
    }
    const response = await apiGetSystemAnalytics(token);
    systemStats.value = response;
  } catch (err) {
    console.error('加载系统统计失败:', err);
    error('加载系统统计失败');
  }
};

const loadHourlyActivity = async () => {
  try {
    const token = userStore.token;
    if (!token) {
      error('未登录，请先登录');
      return;
    }
    const response = await apiGetHourlyActivity(token);
    hourlyActivity.value = response;
    renderHourlyChart();
  } catch (err) {
    console.error('加载活跃度数据失败:', err);
    error('加载活跃度数据失败');
  }
};

const loadPopularTopics = async () => {
  try {
    const token = userStore.token;
    if (!token) {
      error('未登录，请先登录');
      return;
    }
    const response = await apiGetPopularTopics(token);
    popularTopics.value = response;
    renderPopularChart();
  } catch (err) {
    console.error('加载热门知识点失败:', err);
    error('加载热门知识点失败');
  }
};

const renderHourlyChart = () => {
  if (!hourlyChartRef.value) return;

  const chart = echarts.init(hourlyChartRef.value);
  chart.setOption({
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: hourlyActivity.value.map(d => `${d.hour}:00`),
    },
    yAxis: {
      type: 'value',
      name: '学习次数',
    },
    series: [
      {
        name: '学习次数',
        type: 'bar',
        data: hourlyActivity.value.map(d => d.count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#67c23a' },
          ]),
        },
      },
    ],
  });
};

const renderPopularChart = () => {
  if (!popularChartRef.value) return;

  const chart = echarts.init(popularChartRef.value);
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: popularTopics.value.map(t => t.title).reverse(),
    },
    series: [
      {
        name: '学习次数',
        type: 'bar',
        data: popularTopics.value.map(t => t.count).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#f56c6c' },
            { offset: 1, color: '#e6a23c' },
          ]),
        },
      },
    ],
  });
};

onMounted(async () => {
  await Promise.all([
    loadUserStats(),
    loadLearningStats(),
    loadSystemStats(),
    loadHourlyActivity(),
    loadPopularTopics(),
  ]);
});
</script>

<style scoped>
.analytics-dashboard {
  padding: 24px 0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--el-text-color-primary);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  color: var(--el-color-success);
}

.chart-container {
  width: 100%;
}

h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card :deep(.el-card__body) {
    flex-direction: column;
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-container {
    height: 250px !important;
  }
}
</style>


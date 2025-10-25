<template>
  <div class="system-monitor">
    <div class="monitor-header">
      <h3>
        <i class="fa-solid fa-chart-line"></i>
        系统监控
      </h3>
      <button class="refresh-btn" @click="refresh" :disabled="refreshing">
        <i class="fa-solid fa-rotate" :class="{ spinning: refreshing }"></i>
        刷新
      </button>
    </div>

    <div class="monitor-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <div class="monitor-content">
      <!-- 性能指标 -->
      <div v-if="activeTab === 'performance'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">FCP</div>
            <div class="metric-value" :class="getScoreClass(metrics.FCP, 1800, 3000)">
              {{ formatMs(metrics.FCP) }}
            </div>
            <div class="metric-desc">首次内容绘制</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">LCP</div>
            <div class="metric-value" :class="getScoreClass(metrics.LCP, 2500, 4000)">
              {{ formatMs(metrics.LCP) }}
            </div>
            <div class="metric-desc">最大内容绘制</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">FID</div>
            <div class="metric-value" :class="getScoreClass(metrics.FID, 100, 300)">
              {{ formatMs(metrics.FID) }}
            </div>
            <div class="metric-desc">首次输入延迟</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">CLS</div>
            <div class="metric-value" :class="getScoreClass(metrics.CLS, 0.1, 0.25, true)">
              {{ formatNumber(metrics.CLS) }}
            </div>
            <div class="metric-desc">累积布局偏移</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">内存</div>
            <div class="metric-value">{{ formatMb(metrics.memoryUsage) }}</div>
            <div class="metric-desc">内存使用</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">评分</div>
            <div class="metric-value score" :class="getScoreClass(performanceScore, 70, 50)">
              {{ performanceScore }}
            </div>
            <div class="metric-desc">综合评分</div>
          </div>
        </div>
      </div>

      <!-- 错误日志 -->
      <div v-if="activeTab === 'errors'" class="tab-panel">
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">总计</span>
            <span class="stat-value">{{ errorStats.total }}</span>
          </div>
          <div class="stat-item error">
            <span class="stat-label">错误</span>
            <span class="stat-value">{{ errorStats.byType.error }}</span>
          </div>
          <div class="stat-item warning">
            <span class="stat-label">警告</span>
            <span class="stat-value">{{ errorStats.byType.warning }}</span>
          </div>
          <div class="stat-item info">
            <span class="stat-label">信息</span>
            <span class="stat-value">{{ errorStats.byType.info }}</span>
          </div>
        </div>

        <div class="log-list">
          <div
            v-for="error in errors"
            :key="error.id"
            class="log-item"
            :class="'type-' + error.type"
            @click="showErrorDetail(error)"
          >
            <div class="log-header">
              <i :class="getErrorIcon(error.type)"></i>
              <span class="log-time">{{ formatTime(error.timestamp) }}</span>
            </div>
            <div class="log-message">{{ error.message }}</div>
          </div>
          <div v-if="errors.length === 0" class="empty-state">
            <i class="fa-solid fa-circle-check"></i>
            <p>暂无错误记录</p>
          </div>
        </div>
      </div>

      <!-- 网络状态 -->
      <div v-if="activeTab === 'network'" class="tab-panel">
        <div class="network-info">
          <div class="info-row">
            <span class="info-label">在线状态</span>
            <span class="info-value" :class="{ online: networkStatus.online, offline: !networkStatus.online }">
              <i :class="networkStatus.online ? 'fa-solid fa-wifi' : 'fa-solid fa-wifi-slash'"></i>
              {{ networkStatus.online ? '在线' : '离线' }}
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">连接类型</span>
            <span class="info-value">{{ networkStatus.effectiveType || '未知' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">下行速率</span>
            <span class="info-value">{{ networkStatus.downlink || 0 }} Mbps</span>
          </div>
          <div class="info-row">
            <span class="info-label">往返时间</span>
            <span class="info-value">{{ networkStatus.rtt || 0 }} ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { performanceMonitor } from '@/utils/performance';
import { errorTracking, type ErrorLog } from '@/services/errorTracking';

const activeTab = ref('performance');
const refreshing = ref(false);
const metrics = ref({
  FCP: 0,
  LCP: 0,
  FID: 0,
  CLS: 0,
  memoryUsage: 0,
});
const errors = ref<ErrorLog[]>([]);
const errorStats = ref({
  total: 0,
  byType: { error: 0, warning: 0, info: 0 },
});
const networkStatus = ref({
  online: navigator.onLine,
  effectiveType: 'unknown',
  downlink: 0,
  rtt: 0,
});

const tabs = [
  { key: 'performance', label: '性能', icon: 'fa-solid fa-gauge-high' },
  { key: 'errors', label: '错误', icon: 'fa-solid fa-bug' },
  { key: 'network', label: '网络', icon: 'fa-solid fa-network-wired' },
];

const performanceScore = computed(() => {
  return performanceMonitor.getScore();
});

const refresh = async () => {
  refreshing.value = true;
  await loadData();
  setTimeout(() => {
    refreshing.value = false;
  }, 500);
};

const loadData = async () => {
  // 获取性能指标
  const perfMetrics = performanceMonitor.getMetrics();
  metrics.value = {
    FCP: perfMetrics.FCP || 0,
    LCP: perfMetrics.LCP || 0,
    FID: perfMetrics.FID || 0,
    CLS: perfMetrics.CLS || 0,
    memoryUsage: performanceMonitor.getMemoryUsage() || 0,
  };

  // 获取错误日志
  errors.value = errorTracking.getErrors(20);
  errorStats.value = errorTracking.getErrorStats();

  // 获取网络状态
  updateNetworkStatus();
};

const updateNetworkStatus = () => {
  const connection = (navigator as any).connection 
    || (navigator as any).mozConnection 
    || (navigator as any).webkitConnection;

  if (connection) {
    networkStatus.value = {
      online: navigator.onLine,
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
    };
  }
};

const formatMs = (value: number | undefined) => {
  if (!value) return '-';
  return `${value.toFixed(0)}ms`;
};

const formatMb = (value: number | undefined) => {
  if (!value) return '-';
  return `${value.toFixed(1)}MB`;
};

const formatNumber = (value: number | undefined) => {
  if (!value) return '-';
  return value.toFixed(3);
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const getScoreClass = (value: number | undefined, good: number, poor: number, invert = false) => {
  if (!value) return '';
  if (invert) {
    if (value < good) return 'good';
    if (value < poor) return 'medium';
    return 'poor';
  } else {
    if (value < good) return 'good';
    if (value < poor) return 'medium';
    return 'poor';
  }
};

const getErrorIcon = (type: string) => {
  switch (type) {
    case 'error':
      return 'fa-solid fa-circle-xmark';
    case 'warning':
      return 'fa-solid fa-triangle-exclamation';
    case 'info':
      return 'fa-solid fa-circle-info';
    default:
      return 'fa-solid fa-circle';
  }
};

const showErrorDetail = (error: ErrorLog) => {
  console.log('Error detail:', error);
  // 可以显示详细的错误信息对话框
};

onMounted(() => {
  loadData();
  
  // 每10秒更新一次
  const interval = setInterval(loadData, 10000);
  
  // 清理
  return () => clearInterval(interval);
});
</script>

<style scoped>
.system-monitor {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.monitor-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.monitor-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.875rem;
}

.tab-btn:hover {
  background: var(--card-bg);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.monitor-content {
  padding: 1.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.metric-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.metric-value.good {
  color: #10b981;
}

.metric-value.medium {
  color: #f59e0b;
}

.metric-value.poor {
  color: #ef4444;
}

.metric-value.score {
  font-size: 2.5rem;
}

.metric-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.stat-item.error .stat-value {
  color: #ef4444;
}

.stat-item.warning .stat-value {
  color: #f59e0b;
}

.stat-item.info .stat-value {
  color: #3b82f6;
}

.log-list {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s;
}

.log-item:hover {
  transform: translateX(4px);
}

.log-item.type-error {
  border-left-color: #ef4444;
}

.log-item.type-warning {
  border-left-color: #f59e0b;
}

.log-item.type-info {
  border-left-color: #3b82f6;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.log-message {
  font-size: 0.875rem;
  color: var(--text-primary);
  word-break: break-word;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  color: #10b981;
  margin-bottom: 1rem;
}

.network-info {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.info-value.online {
  color: #10b981;
}

.info-value.offline {
  color: #ef4444;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .monitor-tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    white-space: nowrap;
  }
}
</style>



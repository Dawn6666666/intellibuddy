<template>
  <div class="analytics-view">
    <div class="page-header">
      <h1>学习数据分析</h1>
      <el-select v-model="timePeriod" @change="loadAllData" style="width: 150px;">
        <el-option label="最近7天" value="7d" />
        <el-option label="最近30天" value="30d" />
        <el-option label="最近90天" value="90d" />
      </el-select>
    </div>

    <!-- 隐私提示 -->
    <el-alert
      v-if="!settingsStore.privacy.analytics"
      title="数据分析已禁用"
      type="info"
      description="您已在设置中禁用学习数据分析功能。如需查看学习数据，请前往设置页面启用此功能。"
      show-icon
      :closable="false"
      style="margin-bottom: 20px;"
    >
      <template #default>
        <el-button type="primary" size="small" @click="goToSettings">
          前往设置
        </el-button>
      </template>
    </el-alert>

    <el-row :gutter="20" v-loading="loading" v-if="settingsStore.privacy.analytics">
      <!-- 综合概览 -->
      <el-col :xs="24" :sm="24" :lg="24" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📊 学习概览</span>
            </div>
          </template>
          <el-row :gutter="20" v-if="comprehensiveReport">
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ comprehensiveReport.overview?.totalKnowledge || 0 }}</div>
                <div class="stat-label">学习知识点</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ comprehensiveReport.overview?.avgMastery || 0 }}%</div>
                <div class="stat-label">平均掌握度</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ formatDuration(comprehensiveReport.overview?.totalDuration || 0) }}</div>
                <div class="stat-label">总学习时长</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-value">{{ comprehensiveReport.overview?.totalSessions || 0 }}</div>
                <div class="stat-label">学习次数</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 学习时间分布 -->
      <el-col :xs="24" :sm="24" :lg="12" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📅 每日学习时长</span>
            </div>
          </template>
          <div ref="dailyChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 一天中的学习分布 -->
      <el-col :xs="24" :sm="24" :lg="12" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>🕐 学习时段分布</span>
            </div>
          </template>
          <div ref="hourlyChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 知识点掌握度分布 -->
      <el-col :xs="24" :sm="24" :lg="12" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📚 知识点掌握度分布</span>
            </div>
          </template>
          <div ref="masteryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 学科能力雷达图 -->
      <el-col :xs="24" :sm="24" :lg="12" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>🎯 学习能力雷达图</span>
            </div>
          </template>
          <div ref="radarChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 学习趋势 -->
      <el-col :xs="24" :sm="24" :lg="24" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📈 学习趋势与预测</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container-large"></div>
        </el-card>
      </el-col>

      <!-- 错题分析 -->
      <el-col :xs="24" :sm="24" :lg="12" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>❌ 错题分析</span>
            </div>
          </template>
          <div v-if="wrongQuestionsAnalysis">
            <el-row :gutter="20" style="margin-bottom: 20px;">
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ wrongQuestionsAnalysis.total }}</div>
                  <div class="stat-label">总错题数</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ wrongQuestionsAnalysis.correctionRate }}%</div>
                  <div class="stat-label">改正率</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stat-item">
                  <div class="stat-value">{{ wrongQuestionsAnalysis.recentTrend?.last30Days || 0 }}</div>
                  <div class="stat-label">最近30天</div>
                </div>
              </el-col>
            </el-row>
            <div ref="wrongTypeChartRef" class="chart-container-small"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 学科掌握情况 -->
      <el-col :xs="24" :sm="24" :lg="12" class="section">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📖 学科掌握情况</span>
            </div>
          </template>
          <div ref="subjectChartRef" class="chart-container-small"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import * as echarts from 'echarts';
import axios from 'axios';
import { useSettingsStore } from '@/stores/settings';

const apiService = axios.create({
  baseURL: '/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const router = useRouter();
const settingsStore = useSettingsStore();

const loading = ref(false);
const timePeriod = ref('30d');

// 图表引用
const dailyChartRef = ref<HTMLElement>();
const hourlyChartRef = ref<HTMLElement>();
const masteryChartRef = ref<HTMLElement>();
const radarChartRef = ref<HTMLElement>();
const trendChartRef = ref<HTMLElement>();
const wrongTypeChartRef = ref<HTMLElement>();
const subjectChartRef = ref<HTMLElement>();

// 图表实例
let dailyChart: echarts.ECharts | null = null;
let hourlyChart: echarts.ECharts | null = null;
let masteryChart: echarts.ECharts | null = null;
let radarChart: echarts.ECharts | null = null;
let trendChart: echarts.ECharts | null = null;
let wrongTypeChart: echarts.ECharts | null = null;
let subjectChart: echarts.ECharts | null = null;

// 数据
const timeDistribution = ref<any>(null);
const knowledgeMastery = ref<any>(null);
const abilityRadar = ref<any>(null);
const learningTrend = ref<any>(null);
const wrongQuestionsAnalysis = ref<any>(null);
const comprehensiveReport = ref<any>(null);

onMounted(() => {
  loadAllData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  destroyCharts();
});

function handleResize() {
  dailyChart?.resize();
  hourlyChart?.resize();
  masteryChart?.resize();
  radarChart?.resize();
  trendChart?.resize();
  wrongTypeChart?.resize();
  subjectChart?.resize();
}

function destroyCharts() {
  dailyChart?.dispose();
  hourlyChart?.dispose();
  masteryChart?.dispose();
  radarChart?.dispose();
  trendChart?.dispose();
  wrongTypeChart?.dispose();
  subjectChart?.dispose();
}

async function loadAllData() {
  loading.value = true;
  try {
    const [
      timeDistResp,
      masteryResp,
      radarResp,
      trendResp,
      wrongResp,
      reportResp
    ] = await Promise.all([
      apiService.get(`/api/analytics-advanced/time-distribution?period=${timePeriod.value}`),
      apiService.get('/api/analytics-advanced/knowledge-mastery'),
      apiService.get('/api/analytics-advanced/ability-radar'),
      apiService.get('/api/analytics-advanced/learning-trend'),
      apiService.get('/api/analytics-advanced/wrong-questions-analysis'),
      apiService.get('/api/analytics-advanced/comprehensive-report')
    ]);

    timeDistribution.value = timeDistResp.data;
    knowledgeMastery.value = masteryResp.data;
    abilityRadar.value = radarResp.data;
    learningTrend.value = trendResp.data;
    wrongQuestionsAnalysis.value = wrongResp.data;
    comprehensiveReport.value = reportResp.data;

    await nextTick();
    initCharts();
  } catch (error) {
    console.error('加载数据失败:', error);
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
  }
}

function initCharts() {
  initDailyChart();
  initHourlyChart();
  initMasteryChart();
  initRadarChart();
  initTrendChart();
  initWrongTypeChart();
  initSubjectChart();
}

// 每日学习时长图表
function initDailyChart() {
  if (!dailyChartRef.value || !timeDistribution.value) return;

  dailyChart = echarts.init(dailyChartRef.value);
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>学习时长: ${formatDuration(data.value)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: timeDistribution.value.daily.map((d: any) => d.date.slice(5)),
      axisLabel: { rotate: 45 }
    },
    yAxis: {
      type: 'value',
      name: '分钟',
      axisLabel: {
        formatter: (value: number) => Math.round(value / 60)
      }
    },
    series: [{
      data: timeDistribution.value.daily.map((d: any) => d.duration),
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ])
      }
    }],
    grid: { left: '10%', right: '5%', bottom: '15%', top: '10%' }
  };
  dailyChart.setOption(option);
}

// 学习时段分布图表
function initHourlyChart() {
  if (!hourlyChartRef.value || !timeDistribution.value) return;

  hourlyChart = echarts.init(hourlyChartRef.value);
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}:00<br/>学习时长: ${formatDuration(data.value)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: timeDistribution.value.hourly.map((h: any) => h.hour),
      name: '小时'
    },
    yAxis: {
      type: 'value',
      name: '分钟',
      axisLabel: {
        formatter: (value: number) => Math.round(value / 60)
      }
    },
    series: [{
      data: timeDistribution.value.hourly.map((h: any) => h.duration),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
          { offset: 1, color: 'rgba(118, 75, 162, 0.1)' }
        ])
      },
      lineStyle: { color: '#667eea' },
      itemStyle: { color: '#667eea' }
    }],
    grid: { left: '10%', right: '5%', bottom: '10%', top: '10%' }
  };
  hourlyChart.setOption(option);
}

// 知识点掌握度分布图表
function initMasteryChart() {
  if (!masteryChartRef.value || !knowledgeMastery.value) return;

  masteryChart = echarts.init(masteryChartRef.value);
  const dist = knowledgeMastery.value.distribution;
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data: [
        { value: dist.expert, name: '精通(90+)', itemStyle: { color: '#67c23a' } },
        { value: dist.proficient, name: '熟练(70-89)', itemStyle: { color: '#409eff' } },
        { value: dist.intermediate, name: '中等(50-69)', itemStyle: { color: '#e6a23c' } },
        { value: dist.beginner, name: '初学(30-49)', itemStyle: { color: '#f56c6c' } },
        { value: dist.novice, name: '新手(0-29)', itemStyle: { color: '#909399' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  masteryChart.setOption(option);
}

// 能力雷达图
function initRadarChart() {
  if (!radarChartRef.value || !abilityRadar.value) return;

  radarChart = echarts.init(radarChartRef.value);
  const option = {
    tooltip: {},
    radar: {
      indicator: abilityRadar.value.abilities.map((a: any) => ({
        name: a.name,
        max: 100
      })),
      radius: '70%'
    },
    series: [{
      type: 'radar',
      data: [{
        value: abilityRadar.value.abilities.map((a: any) => a.value),
        name: '我的能力',
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 1, color: 'rgba(118, 75, 162, 0.1)' }
          ])
        },
        lineStyle: { color: '#667eea' },
        itemStyle: { color: '#667eea' }
      }]
    }]
  };
  radarChart.setOption(option);
}

// 学习趋势图表
function initTrendChart() {
  if (!trendChartRef.value || !learningTrend.value) return;

  trendChart = echarts.init(trendChartRef.value);
  const historical = learningTrend.value.historical || [];
  const predictions = learningTrend.value.predictions || [];
  const allData = [...historical, ...predictions];

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['学习时长', '学习次数', '新增知识点']
    },
    xAxis: {
      type: 'category',
      data: allData.map((d: any) => d.week.slice(5)),
      axisLabel: { rotate: 45 }
    },
    yAxis: [
      {
        type: 'value',
        name: '分钟',
        axisLabel: {
          formatter: (value: number) => Math.round(value / 60)
        }
      },
      {
        type: 'value',
        name: '次数/个数'
      }
    ],
    series: [
      {
        name: '学习时长',
        type: 'line',
        data: allData.map((d: any) => d.duration),
        smooth: true,
        lineStyle: {
          color: '#667eea',
          type: allData.map((d: any) => d.isPrediction ? 'dashed' : 'solid')
        },
        itemStyle: { color: '#667eea' }
      },
      {
        name: '学习次数',
        type: 'line',
        yAxisIndex: 1,
        data: allData.map((d: any) => d.sessionCount),
        smooth: true,
        lineStyle: {
          color: '#f56c6c',
          type: allData.map((d: any) => d.isPrediction ? 'dashed' : 'solid')
        },
        itemStyle: { color: '#f56c6c' }
      },
      {
        name: '新增知识点',
        type: 'line',
        yAxisIndex: 1,
        data: allData.map((d: any) => d.knowledgeCount),
        smooth: true,
        lineStyle: {
          color: '#67c23a',
          type: allData.map((d: any) => d.isPrediction ? 'dashed' : 'solid')
        },
        itemStyle: { color: '#67c23a' }
      }
    ],
    grid: { left: '10%', right: '10%', bottom: '15%', top: '15%' }
  };
  trendChart.setOption(option);
}

// 错题类型分布图表
function initWrongTypeChart() {
  if (!wrongTypeChartRef.value || !wrongQuestionsAnalysis.value) return;

  wrongTypeChart = echarts.init(wrongTypeChartRef.value);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '60%',
      data: wrongQuestionsAnalysis.value.byType.map((t: any) => ({
        value: t.count,
        name: t.typeName
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  wrongTypeChart.setOption(option);
}

// 学科掌握情况图表
function initSubjectChart() {
  if (!subjectChartRef.value || !knowledgeMastery.value) return;

  subjectChart = echarts.init(subjectChartRef.value);
  const subjects = knowledgeMastery.value.bySubject || [];
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: subjects.map((s: any) => s.subject),
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      max: 100,
      name: '掌握度(%)'
    },
    series: [{
      data: subjects.map((s: any) => s.avgMastery),
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%'
      }
    }],
    grid: { left: '10%', right: '5%', bottom: '20%', top: '10%' }
  };
  subjectChart.setOption(option);
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
}

function goToSettings() {
  router.push('/settings');
}
</script>

<style scoped>
.analytics-view {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.section {
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.chart-container {
  height: 300px;
}

.chart-container-small {
  height: 250px;
}

.chart-container-large {
  height: 400px;
}

@media (max-width: 768px) {
  .analytics-view {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-container,
  .chart-container-small {
    height: 250px;
  }

  .chart-container-large {
    height: 300px;
  }
}
</style>


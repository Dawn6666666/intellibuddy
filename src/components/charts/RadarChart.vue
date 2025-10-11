<template>
  <v-chart class="chart" :option="option" autoresize/>
</template>

<script setup lang="ts">
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {RadarChart} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import {computed} from 'vue'; // 修改这里

// 按需引入 ECharts 组件
use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

// 定义 props
const props = defineProps<{
  chartData: Array<{ name: string; level: number }>;
}>();

// ECharts 配置项
const option = computed(() => ({
  backgroundColor: 'transparent', // 透明背景
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textStyle: {
      color: '#f0f0f0',
    },
  },
  radar: {
    // 雷达图的指示器，对应 skillMastery 中的各项技能
    indicator: props.chartData.map(item => ({name: item.name, max: 100})),
    shape: 'circle', // 雷达形状
    splitNumber: 5,
    axisName: {
      color: '#a0a0a0', // 轴线文字颜色
      fontSize: 14,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)', // 分隔线颜色
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(30, 30, 30, 0.4)', 'rgba(40, 40, 40, 0.5)'], // 分隔区域颜色
        shadowBlur: 10,
      },
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.2)', // 轴线颜色
      },
    },
  },
  series: [
    {
      name: '能力评估',
      type: 'radar',
      // 数据来源于 props
      data: [
        {
          value: props.chartData.map(item => item.level),
          name: '当前能力',
          symbol: 'rect',
          symbolSize: 8,
          lineStyle: {
            color: '#8a7ffb', // 主题色
          },
          areaStyle: {
            color: 'rgba(138, 127, 251, 0.4)', // 填充区域颜色
          },
        },
      ],
    },
  ],
}));
</script>

<style scoped>
.chart {
  height: 400px; /* 您可以根据需要调整图表高度 */
}
</style>
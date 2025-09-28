<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { HeatmapChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import { computed } from 'vue';
import type { PropType } from 'vue';

// 按需引入 ECharts 组件
use([
  CanvasRenderer,
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
]);

// 定义 props
const props = defineProps({
  // 数据格式: [['YYYY-MM-DD', value], ...]
  chartData: {
    type: Array as PropType<[string, number][]>,
    required: true
  }
});

// ECharts 配置项
const option = computed(() => {
  const year = new Date().getFullYear(); // 获取当前年份

  return {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      formatter: '{c} points on {b}', // 示例: "5 points on 2025-09-28"
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#f0f0f0',
      },
    },
    visualMap: {
      min: 0,
      max: 10, // 假设一天最多的学习积分为10
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 0,
      textStyle: {
        color: '#a0a0a0',
      },
      pieces: [
        { min: 1, max: 3, color: '#2a4d69' },
        { min: 4, max: 6, color: '#4b86b4' },
        { min: 7, max: 9, color: '#adcbe3' },
        { min: 10, color: '#e7eff6' },
      ],
      inRange: {
        color: ['#1a2c42', '#8a7ffb'], // 从深色到主题色
      },
      show: false, // 暂时隐藏图例
    },
    calendar: {
      top: 40,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: year.toString(), // 显示当前年份
      itemStyle: {
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      dayLabel: {
        color: '#a0a0a0',
        nameMap: 'cn'
      },
      monthLabel: {
        color: '#a0a0a0',
        nameMap: 'cn'
      },
      yearLabel: { show: false },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: props.chartData,
    },
  };
});
</script>

<style scoped>
.chart {
  height: 200px; /* 您可以根据需要调整图表高度 */
}
</style>
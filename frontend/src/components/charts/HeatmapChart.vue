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
import type { EChartsOption } from 'echarts';

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
const option = computed<EChartsOption>(() => {
  const year = new Date().getFullYear();

  return {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const date = params.data[0];
        const value = params.data[1];
        return `
          <div style="padding: 10px 12px; background: linear-gradient(135deg, rgba(138, 127, 251, 0.15), rgba(245, 87, 108, 0.15)); backdrop-filter: blur(10px); border-radius: 8px;">
            <div style="font-weight: 700; font-size: 14px; background: linear-gradient(135deg, #8a7ffb, #f5576c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 6px;">${date}</div>
            <div style="display: flex; align-items: center; gap: 8px; color: #e0e0e0;">
              <i class="fa-solid fa-fire" style="color: #f5576c; font-size: 16px;"></i>
              <span style="font-weight: 600;">${value} 次学习</span>
            </div>
          </div>
        `;
      },
      backgroundColor: 'rgba(20, 20, 30, 0.95)',
      borderColor: 'transparent',
      borderWidth: 0,
      textStyle: {
        color: '#f0f0f0',
        fontSize: 13,
      },
      extraCssText: 'box-shadow: 0 8px 32px rgba(138, 127, 251, 0.3); backdrop-filter: blur(10px);',
    },
    visualMap: {
      min: 0,
      max: 10,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 5,
      pieces: [
        { 
          min: 0, max: 0, 
          color: 'rgba(255, 255, 255, 0.06)', 
          label: '无'
        },
        { 
          min: 1, max: 2, 
          color: 'rgba(138, 127, 251, 0.25)', 
          label: '少'
        },
        { 
          min: 3, max: 5, 
          color: 'rgba(138, 127, 251, 0.5)', 
          label: '中'
        },
        { 
          min: 6, max: 8, 
          color: 'rgba(245, 87, 108, 0.6)', 
          label: '多'
        },
        { 
          min: 9, 
          color: 'rgba(245, 87, 108, 0.9)', 
          label: '很多'
        },
      ],
      textStyle: {
        color: '#c0c0c0',
        fontSize: 11,
        fontWeight: 600,
      },
      itemGap: 12,
      itemWidth: 20,
      itemHeight: 20,
      show: true,
      itemStyle: {
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        shadowBlur: 8,
        shadowColor: 'rgba(138, 127, 251, 0.3)',
      },
    },
    calendar: {
      top: 70,
      left: 30,
      right: 30,
      bottom: 30,
      cellSize: [18, 18],
      range: year.toString(),
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 4,
        shadowBlur: 0,
        shadowColor: 'transparent',
      },
      dayLabel: {
        color: '#a0a0a0',
        nameMap: 'cn',
        fontSize: 12,
        fontWeight: 600,
        margin: 10,
      },
      monthLabel: {
        color: '#d0d0d0',
        nameMap: 'cn',
        fontSize: 13,
        fontWeight: 700,
        margin: 10,
      },
      yearLabel: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)',
          width: 1,
          type: 'solid'
        }
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: props.chartData,
      itemStyle: {
        borderRadius: 4,
        shadowBlur: 6,
        shadowColor: 'rgba(138, 127, 251, 0.4)',
      },
      emphasis: {
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: 'rgba(245, 87, 108, 0.8)',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
        scale: true,
        scaleSize: 5,
      },
    },
    animationDuration: 1000,
    animationEasing: 'elasticOut',
    animationDurationUpdate: 300,
    animationEasingUpdate: 'cubicOut',
  };
});
</script>

<style scoped>
.chart {
  height: 320px;
  width: 100%;
  filter: drop-shadow(0 4px 16px rgba(138, 127, 251, 0.1));
}
</style>
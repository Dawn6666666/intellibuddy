<template>
  <v-chart ref="chartRef"
class="chart"
:option="option"
autoresize/>
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
import {computed, ref} from 'vue';
import type { EChartsOption } from 'echarts';

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

// 图表引用
const chartRef = ref();

// 导出为 PNG 的方法
const exportAsPNG = () => {
  console.log('RadarChart exportAsPNG 开始执行');
  console.log('chartRef.value:', chartRef.value);
  
  if (chartRef.value) {
    try {
      console.log('chartRef.value 直接是 ECharts 实例，无需调用 getEchartsInstance()');
      const chartInstance = chartRef.value;
      console.log('ECharts 实例:', chartInstance);
      
      if (!chartInstance) {
        console.error('无法获取 ECharts 实例');
        return false;
      }
      
      console.log('生成数据 URL...');
      const dataURL = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2, // 高清导出
        backgroundColor: '#ffffff'
      });
      
      console.log('数据 URL 长度:', dataURL.length);
      
      // 创建下载链接
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `雷达图_${timestamp}.png`;
      link.href = dataURL;
      
      console.log('触发下载...');
      link.click();
      
      console.log('导出成功');
      return true;
    } catch (error) {
      console.error('导出失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      console.error('错误详情:', message);
      return false;
    }
  }
  
  console.log('chartRef.value 为空');
  return false;
};

// 暴露方法给父组件
defineExpose({
  exportAsPNG
});

// ECharts 配置项
const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderColor: 'rgba(138, 127, 251, 0.5)',
    borderWidth: 2,
    textStyle: {
      color: '#f0f0f0',
      fontSize: 14,
    },
    formatter: (params: any) => {
      const data = params.data;
      let result = `<div style="padding: 8px;">`;
      result += `<div style="font-weight: 600; margin-bottom: 8px; color: #8a7ffb;">${data.name}</div>`;
      props.chartData.forEach((skill, index) => {
        result += `<div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">`;
        result += `<span style="margin-right: 16px;">${skill.name}</span>`;
        result += `<span style="font-weight: 600; color: #8a7ffb;">${data.value[index]}%</span>`;
        result += `</div>`;
      });
      result += `</div>`;
      return result;
    }
  },
  radar: {
    center: ['50%', '45%'],
    radius: '55%',
    indicator: props.chartData.map(item => ({
      name: item.name,
      max: 100,
      color: '#a0a0a0'
    })),
    shape: 'polygon',
    splitNumber: 4,
    axisName: {
      color: '#d0d0d0',
      fontSize: 14,
      fontWeight: 600,
      backgroundColor: 'transparent',
      borderRadius: 4,
      padding: [4, 8]
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(138, 127, 251, 0.15)',
        width: 2
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: [
          'rgba(138, 127, 251, 0.05)',
          'rgba(138, 127, 251, 0.08)',
          'rgba(138, 127, 251, 0.11)',
          'rgba(138, 127, 251, 0.14)'
        ]
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(138, 127, 251, 0.3)',
        width: 2
      }
    }
  },
  series: [
    {
      name: '能力评估',
      type: 'radar',
      emphasis: {
        lineStyle: {
          width: 4
        }
      },
      data: [
        {
          value: props.chartData.map(item => item.level),
          name: '当前能力',
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#8a7ffb',
            width: 3,
            shadowColor: 'rgba(138, 127, 251, 0.5)',
            shadowBlur: 10
          },
          itemStyle: {
            color: '#8a7ffb',
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: 'rgba(138, 127, 251, 0.8)',
            shadowBlur: 10
          },
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(138, 127, 251, 0.6)' },
                { offset: 0.5, color: 'rgba(138, 127, 251, 0.4)' },
                { offset: 1, color: 'rgba(138, 127, 251, 0.2)' }
              ]
            },
            shadowColor: 'rgba(138, 127, 251, 0.5)',
            shadowBlur: 20
          }
        }
      ]
    }
  ],
  animationDuration: 1000,
  animationEasing: 'cubicOut'
}) as unknown as EChartsOption);
</script>

<style scoped>
.chart {
  height: 500px;
  width: 100%;
}
</style>
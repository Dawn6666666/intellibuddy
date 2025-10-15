<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <component :is="iconComponent" />
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__description">{{ description }}</p>
    <el-button v-if="actionText" :type="actionType" @click="handleAction">
      {{ actionText }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Document,
  Files,
  School,
  ChatDotSquare,
  Medal,
  TrendCharts,
  QuestionFilled,
} from '@element-plus/icons-vue';

interface Props {
  type?: 'knowledge' | 'progress' | 'wrong-questions' | 'chat' | 'achievements' | 'data' | 'default';
  title?: string;
  description?: string;
  actionText?: string;
  actionType?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  title: '暂无数据',
  description: '这里还没有任何内容',
  actionType: 'primary',
});

const emit = defineEmits<{
  action: [];
}>();

const iconComponent = computed(() => {
  const iconMap = {
    knowledge: School,
    progress: Files,
    'wrong-questions': QuestionFilled,
    chat: ChatDotSquare,
    achievements: Medal,
    data: TrendCharts,
    default: Document,
  };
  return iconMap[props.type] || iconMap.default;
});

const handleAction = () => {
  emit('action');
};
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 300px;
}

.empty-state__icon {
  font-size: 80px;
  color: var(--el-color-info-light-5);
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

.empty-state__icon :deep(svg) {
  width: 80px;
  height: 80px;
}

.empty-state__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 12px 0;
}

.empty-state__description {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0 0 24px 0;
  max-width: 400px;
  line-height: 1.6;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 暗色主题适配 */
html.dark .empty-state__icon {
  color: var(--el-color-info-dark-2);
}
</style>


<template>
  <router-link :to="{ name: 'learning', params: { pointId: point.id } }" class="card-link">
    <div class="knowledge-card" :class="statusClass">
      <div class="status-indicator">
        <i :class="statusIcon"></i>
        <span>{{ statusText }}</span>
      </div>
      <h3 class="card-title">{{ displayTitle }}</h3>
      <p class="card-snippet">{{ point.contentSnippet }}</p>
      <div class="card-footer">
        <span class="subject-tag">{{ point.subject }}</span>
        <button class="learn-btn">
          {{ point.status === 'completed' ? '回顾' : '学习' }} <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { KnowledgePoint } from '@/stores/knowledge'

const props = defineProps({
  point: {
    type: Object as PropType<KnowledgePoint>,
    required: true,
  },
})

// 根据状态计算不同的样式和文本
const statusClass = computed(() => `status-${props.point.status}`)

const statusText = computed(() => {
  switch (props.point.status) {
    case 'completed':
      return '已完成'
    case 'in_progress':
      return '进行中'
    default:
      return '未开始'
  }
})

const statusIcon = computed(() => {
  switch (props.point.status) {
    case 'completed':
      return 'fa-solid fa-check-circle'
    case 'in_progress':
      return 'fa-solid fa-spinner fa-spin'
    default:
      return 'fa-solid fa-circle'
  }
})

// 移除标题中的课程代号（如 "CS101: " 或 "MATH101: "）
const displayTitle = computed(() => {
  // 匹配模式：大写字母 + 数字 + 冒号 + 空格（如 CS101: 或 MATH101: ）
  const regex = /^[A-Z]+\d+:\s*/
  return props.point.title.replace(regex, '')
})
</script>

<style scoped>
/* 【重要新增】为 router-link 添加样式，去除下划线等默认效果 */
.card-link {
  text-decoration: none;
  color: inherit;
  display: block; /* 让链接占据整个卡片空间 */
  transition: all 0.3s ease;
}

/* 将 :hover 效果从 .knowledge-card 移到 .card-link 上，确保悬浮效果正确 */
.card-link:hover .knowledge-card {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(138, 127, 251, 0.3);
  border-color: var(--primary-color);
}

/* 悬浮时增强左侧边框的发光效果 */
.card-link:hover .knowledge-card.status-completed {
  box-shadow: 0 12px 32px rgba(74, 222, 128, 0.25), -4px 0 12px rgba(74, 222, 128, 0.4);
}

.card-link:hover .knowledge-card.status-in_progress {
  box-shadow: 0 12px 32px rgba(250, 204, 21, 0.25), -4px 0 12px rgba(250, 204, 21, 0.4);
}

.card-link:hover .knowledge-card.status-not_started {
  box-shadow: 0 12px 32px rgba(96, 165, 250, 0.25), -4px 0 12px rgba(96, 165, 250, 0.4);
}

.knowledge-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid var(--card-border); /* 默认左侧边框 */
  height: 100%; /* 确保卡片在链接内高度 100% */
  will-change: transform, box-shadow;
}

/* 根据不同状态改变左侧边框颜色 */
.knowledge-card.status-completed {
  border-left-color: #4ade80; /* Green */
}
.knowledge-card.status-in_progress {
  border-left-color: #facc15; /* Yellow */
}
.knowledge-card.status-not_started {
  border-left-color: #60a5fa; /* Blue */
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 16px;
}
.status-indicator .fa-check-circle { color: #4ade80; }
.status-indicator .fa-spinner { color: #facc15; }
.status-indicator .fa-circle { color: #60a5fa; }


.card-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
  flex-grow: 1; /* 让标题占据多余空间，确保底部对齐 */
}

.card-snippet {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--card-border);
  padding-top: 16px;
  margin-top: auto; /* 将 footer 推到底部 */
}

.subject-tag {
  background-color: rgba(138, 127, 251, 0.2);
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
}

.learn-btn {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.learn-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.learn-btn:hover::before {
  left: 0;
}

.learn-btn:hover {
  color: white;
  transform: translateX(2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

.learn-btn i {
  transition: transform 0.3s ease;
}

.learn-btn:hover i {
  transform: translateX(4px);
}
</style>
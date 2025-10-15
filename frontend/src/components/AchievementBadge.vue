<template>
  <div class="achievement-badge" :class="{ completed: achievement.completed, locked: !achievement.completed }">
    <div class="badge-icon" :class="`badge-${achievement.achievementLevel}`">
      {{ achievement.definition?.icon || '🏆' }}
    </div>
    <div class="badge-info">
      <h4 class="badge-name">{{ achievement.definition?.name || '未知成就' }}</h4>
      <p class="badge-description">{{ achievement.definition?.description }}</p>
      <div v-if="!achievement.completed" class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="badge-meta">
        <span v-if="achievement.completed" class="unlock-time">
          🎉 解锁于 {{ formatDate(achievement.unlockedAt) }}
        </span>
        <span v-else class="progress-text">
          进度: {{ achievement.progress }} / {{ achievement.maxProgress }}
        </span>
        <span class="points">{{ achievement.definition?.points || 0 }} 积分</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  achievement: any;
}

const props = defineProps<Props>();

const progressPercentage = computed(() => {
  if (props.achievement.completed) return 100;
  return Math.min(
    100,
    Math.round((props.achievement.progress / props.achievement.maxProgress) * 100)
  );
});

const formatDate = (date: string | Date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<style scoped>
.achievement-badge {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.achievement-badge.completed {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-color: #fdcb6e;
  box-shadow: 0 4px 12px rgba(253, 203, 110, 0.3);
}

.achievement-badge.locked {
  opacity: 0.6;
  filter: grayscale(70%);
}

.achievement-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.badge-icon {
  font-size: 3rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #b8733a 100%);
}

.badge-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
}

.badge-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.badge-platinum {
  background: linear-gradient(135deg, #e5e4e2 0%, #b8b8b8 100%);
}

.badge-diamond {
  background: linear-gradient(135deg, #b9f2ff 0%, #69b3e7 100%);
}

.badge-info {
  flex: 1;
}

.badge-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
}

.badge-description {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #636e72;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6c5ce7 0%, #a29bfe 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.badge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.unlock-time {
  color: #27ae60;
  font-weight: 500;
}

.progress-text {
  color: #636e72;
}

.points {
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
}
</style>


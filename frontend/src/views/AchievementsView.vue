<template>
  <div class="achievements-view">
    <div class="achievements-header">
      <h1>🏆 我的成就</h1>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.completed }} / {{ stats.total }}</div>
            <div class="stat-label">已解锁</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.points }}</div>
            <div class="stat-label">总积分</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-value">LV {{ stats.level }}</div>
            <div class="stat-label">当前等级</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.percentage }}%</div>
            <div class="stat-label">完成度</div>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value" 
        class="tab-button" 
        :class="{ active: currentTab === tab.value }"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>加载成就中...</p>
    </div>

    <div v-else class="achievements-grid">
      <AchievementBadge 
        v-for="achievement in filteredAchievements" 
        :key="achievement.achievementId" 
        :achievement="achievement" 
      />
    </div>

    <div v-if="!loading && filteredAchievements.length === 0" class="empty-state">
      <p>暂无该类型的成就</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import AchievementBadge from '../components/AchievementBadge.vue';
import axios from 'axios';

const loading = ref(true);
const achievements = ref<any[]>([]);
const stats = ref({
  total: 0,
  completed: 0,
  percentage: 0,
  points: 0,
  level: 1,
});

const currentTab = ref('all');

const tabs = [
  { label: '全部', value: 'all' },
  { label: '已解锁', value: 'completed' },
  { label: '未解锁', value: 'locked' },
  { label: '学习时长', value: 'study_time' },
  { label: '知识掌握', value: 'knowledge_master' },
  { label: '连续学习', value: 'streak' },
  { label: '完美答题', value: 'quiz_perfect' },
];

const filteredAchievements = computed(() => {
  if (currentTab.value === 'all') {
    return achievements.value;
  } else if (currentTab.value === 'completed') {
    return achievements.value.filter(a => a.completed);
  } else if (currentTab.value === 'locked') {
    return achievements.value.filter(a => !a.completed);
  } else {
    return achievements.value.filter(a => a.achievementType === currentTab.value);
  }
});

const fetchAchievements = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('authToken');

    const [achievementsRes, statsRes] = await Promise.all([
      axios.get('/api/achievements', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get('/api/achievements/stats', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (achievementsRes.data.success) {
      achievements.value = achievementsRes.data.data.achievements;
    }

    if (statsRes.data.success) {
      stats.value = statsRes.data.data;
    }
  } catch (error) {
    console.error('获取成就失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAchievements();
});
</script>

<style scoped>
.achievements-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.achievements-header {
  margin-bottom: 2rem;
}

.achievements-header h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2d3436;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.5rem 1.25rem;
  border: 2px solid #dfe6e9;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #636e72;
  transition: all 0.3s ease;
}

.tab-button:hover {
  border-color: #6c5ce7;
  color: #6c5ce7;
}

.tab-button.active {
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  border-color: #6c5ce7;
  color: white;
}

.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: #636e72;
}

.loading-state .el-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.achievements-grid {
  display: grid;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: #b2bec3;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .achievements-view {
    padding: 1rem;
  }

  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }

  .filter-tabs {
    justify-content: flex-start;
  }
}
</style>


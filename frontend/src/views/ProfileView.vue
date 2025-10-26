<template>
  <div class="profile-container">
    <!-- 顶部统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-trend" :class="stat.trend">
          <i :class="stat.trend === 'up' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
          {{ stat.change }}
        </div>
      </div>
    </div>

    <!-- 主要图表区域 -->
    <div class="charts-grid">
      <!-- 雷达图 -->
      <div class="card radar-card glass-effect">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-badge radar-badge">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <h3>多维能力雷达图</h3>
              <p>全方位技能评估与分析</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click="refreshRadar" title="刷新数据">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button class="action-btn" @click="exportRadar" title="导出图表">
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
        </div>
        <div class="chart-wrapper">
          <RadarChart ref="radarChartRef" :chart-data="userStore.skillMastery" />
          <div class="chart-overlay">
            <div class="skill-summary">
              <div class="summary-item" v-for="skill in topSkills" :key="skill.name">
                <span class="skill-name">{{ skill.name }}</span>
                <div class="skill-bar">
                  <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
                </div>
                <span class="skill-value">{{ skill.level }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 热力图 -->
      <div class="card heatmap-card glass-effect">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-badge heatmap-badge">
              <i class="fa-solid fa-fire-flame-curved"></i>
            </div>
            <div>
              <h3>学习热力图</h3>
              <p>{{ currentYear }} 年度学习活动记录</p>
            </div>
          </div>
          <div class="header-actions">
            <div class="year-selector">
              <button 
                @click="changeYear(-1)" 
                :disabled="currentYear <= new Date().getFullYear() - 4"
                title="上一年"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <span>{{ currentYear }}</span>
              <button 
                @click="changeYear(1)" 
                :disabled="currentYear >= new Date().getFullYear()"
                title="下一年"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="heatmap-stats">
          <div class="heatmap-stat">
            <span class="label">总学习天数</span>
            <span class="value">{{ totalDays }}</span>
          </div>
          <div class="heatmap-stat">
            <span class="label">最长连续</span>
            <span class="value">{{ longestStreak }} 天</span>
          </div>
          <div class="heatmap-stat">
            <span class="label">当前连续</span>
            <span class="value">{{ currentStreak }} 天</span>
          </div>
        </div>
        <div class="chart-wrapper">
          <HeatmapChart :chart-data="userStore.studyActivityData" />
        </div>
      </div>
    </div>

    <!-- 成就与进度 -->
    <div class="achievement-section">
      <div class="card glass-effect">
        <div class="card-header">
          <div class="header-left">
            <div class="icon-badge achievement-badge">
              <i class="fa-solid fa-trophy"></i>
            </div>
            <div>
              <h3>成就徽章</h3>
              <p>已解锁 {{ unlockedAchievements }}/{{ totalAchievements }} 个成就</p>
            </div>
          </div>
        </div>
        <div class="achievements-grid">
          <div 
            class="achievement-item" 
            v-for="achievement in achievements" 
            :key="achievement.id"
            :class="{ locked: !achievement.unlocked }"
            @click="showAchievementDetail(achievement)"
          >
            <div class="achievement-icon" :style="{ background: achievement.color }">
              <i :class="achievement.icon"></i>
            </div>
            <div class="achievement-info">
              <div class="achievement-name">{{ achievement.name }}</div>
              <div class="achievement-desc">{{ achievement.description }}</div>
              <div class="achievement-progress" v-if="!achievement.unlocked">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: achievement.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ achievement.progress }}%</span>
              </div>
            </div>
            <div class="achievement-badge" v-if="achievement.unlocked">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import RadarChart from '@/components/charts/RadarChart.vue';
import HeatmapChart from '@/components/charts/HeatmapChart.vue';
import { useUserStore } from '@/stores/user';
import { apiGetMyStats } from '@/services/apiService';

// 雷达图引用
const radarChartRef = ref();

const userStore = useUserStore();

// 当前年份
const currentYear = ref(new Date().getFullYear());

// 用户统计数据
const userStats = ref<any>(null);
const isLoadingStats = ref(true);

// 加载用户统计数据
onMounted(async () => {
  try {
    if (userStore.token) {
      userStats.value = await apiGetMyStats(userStore.token);
      // 加载成就数据
      await loadAchievements();
    }
  } catch (error) {
    console.error('加载用户统计数据失败:', error);
  } finally {
    isLoadingStats.value = false;
  }
});

// 统计卡片数据
const stats = computed(() => {
  // 加载期间显示加载状态，而不是默认的 Top 100%
  if (!userStats.value || isLoadingStats.value) {
    return [
      {
        label: '总学习时长',
        value: '加载中...',
        icon: 'fa-solid fa-clock',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        trend: 'up',
        change: '--'
      },
      {
        label: '完成课程',
        value: '加载中...',
        icon: 'fa-solid fa-book-open',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        trend: 'up',
        change: '--'
      },
      {
        label: '学习积分',
        value: '加载中...',
        icon: 'fa-solid fa-star',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        trend: 'up',
        change: '--'
      },
      {
        label: '总排名',
        value: '加载中...',
        icon: 'fa-solid fa-ranking-star',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        trend: 'up',
        change: '--'
      }
    ];
  }

  return [
    {
      label: '总学习时长',
      value: userStats.value.totalStudyTime.display,
      icon: 'fa-solid fa-clock',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: userStats.value.totalStudyTime.change >= 0 ? 'up' : 'down',
      change: `${userStats.value.totalStudyTime.change >= 0 ? '+' : ''}${userStats.value.totalStudyTime.change}%`
    },
    {
      label: '完成课程',
      value: userStats.value.completedCourses.count.toString(),
      icon: 'fa-solid fa-book-open',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: userStats.value.completedCourses.change >= 0 ? 'up' : 'down',
      change: `${userStats.value.completedCourses.change >= 0 ? '+' : ''}${userStats.value.completedCourses.change}%`
    },
    {
      label: '学习积分',
      value: userStats.value.points.display,
      icon: 'fa-solid fa-star',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      trend: userStats.value.points.change >= 0 ? 'up' : 'down',
      change: `${userStats.value.points.change >= 0 ? '+' : ''}${userStats.value.points.change}%`
    },
    {
      label: '总排名',
      value: userStats.value.ranking.display,
      icon: 'fa-solid fa-ranking-star',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: userStats.value.ranking.change >= 0 ? 'up' : 'down',
      change: `${userStats.value.ranking.change >= 0 ? '+' : ''}${userStats.value.ranking.change}%`
    }
  ];
});

// 热力图统计
const totalDays = computed(() => {
  return userStore.studyActivityData.filter(([_, value]) => value > 0).length;
});

const longestStreak = computed(() => {
  if (userStore.studyActivityData.length === 0) {
    return 0;
  }

  let maxStreak = 0;
  let currentStreakCount = 0;
  
  // 按日期升序排序（从最旧到最新）
  const sortedData = [...userStore.studyActivityData]
    .filter(([_, value]) => value > 0) // 只保留有学习记录的天数
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  
  if (sortedData.length === 0) {
    return 0;
  }

  let lastDate: Date | null = null;
  
  for (const [dateStr] of sortedData) {
    const currentDate = new Date(dateStr);
    currentDate.setHours(0, 0, 0, 0);
    
    if (lastDate === null) {
      // 第一天
      currentStreakCount = 1;
      maxStreak = 1;
    } else {
      // 检查是否是连续的下一天
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // 连续的下一天
        currentStreakCount++;
        maxStreak = Math.max(maxStreak, currentStreakCount);
      } else {
        // 不连续，重新开始计数
        currentStreakCount = 1;
      }
    }
    
    lastDate = currentDate;
  }
  
  return maxStreak;
});

const currentStreak = computed(() => {
  if (userStore.studyActivityData.length === 0) {
    return 0;
  }

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 重置到当天0点

  // 按日期降序排序（从最新到最旧）
  const sortedData = [...userStore.studyActivityData]
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  
  // 从今天或昨天开始计算连续天数
  for (let i = 0; i < sortedData.length; i++) {
    const [dateStr, value] = sortedData[i];
    if (value === 0) continue; // 跳过没有学习的天数
    
    const dataDate = new Date(dateStr);
    dataDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - dataDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 如果是第一次循环，允许从今天或昨天开始
    if (streak === 0) {
      if (diffDays <= 1) {
        streak = 1;
        // 更新基准日期为这一天
        today.setTime(dataDate.getTime());
      } else {
        // 如果最近的学习记录距离今天超过1天，说明没有连续学习
        break;
      }
    } else {
      // 检查是否是连续的前一天
      const expectedDiffDays = Math.floor((today.getTime() - dataDate.getTime()) / (1000 * 60 * 60 * 24));
      if (expectedDiffDays === 1) {
        streak++;
        today.setTime(dataDate.getTime());
      } else {
        // 不连续了，停止计数
        break;
      }
    }
  }
  
  return streak;
});

// Top 技能
const topSkills = computed(() => {
  return [...userStore.skillMastery]
    .sort((a, b) => b.level - a.level)
    .slice(0, 3);
});

// 成就系统
const achievements = ref<any[]>([]);
const isLoadingAchievements = ref(true);

// 成就图标和颜色映射
const achievementStyles: Record<string, { icon: string; color: string }> = {
  study_time: { icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  knowledge_master: { icon: 'fa-solid fa-book', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  streak: { icon: 'fa-solid fa-fire', color: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)' },
  quiz_perfect: { icon: 'fa-solid fa-medal', color: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' },
  early_bird: { icon: 'fa-solid fa-sun', color: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)' },
  night_owl: { icon: 'fa-solid fa-moon', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  explorer: { icon: 'fa-solid fa-compass', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  fast_learner: { icon: 'fa-solid fa-bolt', color: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
};

// 加载成就数据
const loadAchievements = async () => {
  try {
    isLoadingAchievements.value = true;
    const response = await fetch('/api/achievements', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // 转换后端数据为前端格式
        achievements.value = data.data.achievements.map((ach: any) => {
          const style = achievementStyles[ach.achievementType] || achievementStyles.study_time;
          return {
            id: ach.achievementId,
            name: ach.definition?.name || '未知成就',
            description: ach.definition?.description || '',
            icon: style.icon,
            color: style.color,
            unlocked: ach.completed,
            progress: ach.completed ? 100 : Math.round((ach.progress / ach.maxProgress) * 100)
          };
        });
      }
    }
  } catch (error) {
    console.error('加载成就数据失败:', error);
    achievements.value = [];
  } finally {
    isLoadingAchievements.value = false;
  }
};

const unlockedAchievements = computed(() => 
  achievements.value.filter(a => a.unlocked).length
);

const totalAchievements = computed(() => achievements.value.length);

// 方法
const refreshRadar = async () => {
  // 刷新雷达图数据
  try {
    console.log('刷新雷达图数据');
    // 重新加载用户进度数据
    await userStore.fetchInitialData();
    showSuccessMessage('雷达图数据已刷新！');
  } catch (error) {
    console.error('刷新雷达图数据失败:', error);
    showErrorMessage('刷新失败，请重试');
  }
};

const exportRadar = () => {
  // 导出雷达图为 PNG
  console.log('开始导出雷达图...');
  console.log('radarChartRef.value:', radarChartRef.value);
  
  if (radarChartRef.value) {
    try {
      console.log('调用 exportAsPNG 方法...');
      const success = radarChartRef.value.exportAsPNG();
      console.log('导出结果:', success);
      
      if (success) {
        // 显示成功提示
        showSuccessMessage('雷达图导出成功！');
      } else {
        showErrorMessage('导出失败，请重试');
      }
    } catch (error) {
      console.error('导出失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      showErrorMessage(`导出失败: ${errorMessage}`);
    }
  } else {
    console.log('图表引用为空');
    showErrorMessage('图表未加载完成，请稍后重试');
  }
};

const changeYear = async (delta: number) => {
  const newYear = currentYear.value + delta;
  const currentYearNow = new Date().getFullYear();
  
  // 限制年份范围（比如只能查看最近5年的数据）
  if (newYear >= currentYearNow - 4 && newYear <= currentYearNow) {
    currentYear.value = newYear;
    console.log('切换到年份:', currentYear.value);
    // 加载对应年份的学习数据
    try {
      // 从后端获取真实的热力图数据
      await userStore.fetchHeatmapData(currentYear.value);
      showSuccessMessage(`已切换到 ${currentYear.value} 年`);
    } catch (error) {
      console.error('加载年份数据失败:', error);
      showErrorMessage('加载数据失败，请重试');
    }
  }
};

const showAchievementDetail = (achievement: any) => {
  console.log('显示成就详情:', achievement);
  // 显示成就详情
  const detailText = `
成就名称：${achievement.title}
解锁时间：${new Date(achievement.unlockedAt).toLocaleString()}
描述：${achievement.description || '无描述'}
  `.trim();
  
  // 使用系统 alert 显示详情（也可以使用 Element Plus 的 Dialog）
  alert(detailText);
};

// 消息提示方法
const showSuccessMessage = (message: string) => {
  // 创建成功提示
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  // 3秒后自动移除
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      document.body.removeChild(toast);
      document.head.removeChild(style);
    }, 300);
  }, 3000);
};

const showErrorMessage = (message: string) => {
  // 创建错误提示
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(toast);
  
  // 3秒后自动移除
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};
</script>

<style scoped>
.profile-container {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.up {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.stat-trend.down {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* 图表网格 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 24px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* 玻璃效果卡片 */
.glass-effect {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.glass-effect::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(138, 127, 251, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s;
}

.glass-effect:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.radar-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.heatmap-badge {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.achievement-badge {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
}

.card-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.card-header p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--card-border);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  position: relative;
  z-index: 10;
  user-select: none;
  pointer-events: auto;
}

.action-btn:hover {
  background: rgba(138, 127, 251, 0.3);
  border-color: rgba(138, 127, 251, 0.6);
  color: #8a7ffb;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

/* 年份选择器 */
.year-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--card-border);
  border-radius: 8px;
}

.year-selector button {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  position: relative;
  z-index: 10;
  user-select: none;
  pointer-events: auto;
}

.year-selector button:hover {
  background: rgba(138, 127, 251, 0.3);
  color: #8a7ffb;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(138, 127, 251, 0.3);
}

.year-selector button:active {
  transform: scale(0.9);
}

.year-selector button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.year-selector span {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 60px;
  text-align: center;
}

/* 图表包装器 */
.chart-wrapper {
  position: relative;
  margin-top: 16px;
}

/* 技能摘要 */
.chart-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: 24px;
  border-radius: 0 0 20px 20px;
}

.skill-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skill-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  min-width: 80px;
}

.skill-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.skill-value {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  min-width: 45px;
  text-align: right;
}

/* 热力图统计 */
.heatmap-stats {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 16px;
}

.heatmap-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.heatmap-stat .label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.heatmap-stat .value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 成就部分 */
.achievement-section {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.achievement-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(138, 127, 251, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.achievement-item:hover {
  transform: translateX(4px);
  border-color: rgba(138, 127, 251, 0.5);
}

.achievement-item:hover::before {
  opacity: 1;
}

.achievement-item.locked {
  opacity: 0.5;
  filter: grayscale(0.8);
}

.achievement-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.achievement-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 35px;
  text-align: right;
}

.achievement-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .chart-overlay {
    display: none;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
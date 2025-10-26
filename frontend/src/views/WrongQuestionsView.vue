<template>
  <div class="wrong-questions-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fa-solid fa-book-bookmark"></i> 我的错题本</h1>
          <p class="subtitle">温故而知新，可以为师矣</p>
        </div>
      </div>

      <!-- 统计卡片 - 始终显示占位 -->
      <div class="stats-grid">
        <div class="stat-card" v-if="stats">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ff4d4f, #ff7875)">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalWrong }}</div>
            <div class="stat-label">总错题数</div>
          </div>
        </div>
        <div v-else class="stat-card skeleton-card">
          <div class="skeleton skeleton-icon"></div>
          <div class="stat-content">
            <div class="skeleton skeleton-value"></div>
            <div class="skeleton skeleton-label"></div>
          </div>
        </div>

        <div class="stat-card" v-if="stats">
          <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a, #73d13d)">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalMastered }}</div>
            <div class="stat-label">已掌握</div>
          </div>
        </div>
        <div v-else class="stat-card skeleton-card">
          <div class="skeleton skeleton-icon"></div>
          <div class="stat-content">
            <div class="skeleton skeleton-value"></div>
            <div class="skeleton skeleton-label"></div>
          </div>
        </div>

        <div class="stat-card" v-if="stats">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ffc107, #ffd666)">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalUnmastered }}</div>
            <div class="stat-label">待掌握</div>
          </div>
        </div>
        <div v-else class="stat-card skeleton-card">
          <div class="skeleton skeleton-icon"></div>
          <div class="stat-content">
            <div class="skeleton skeleton-value"></div>
            <div class="skeleton skeleton-label"></div>
          </div>
        </div>

        <div class="stat-card" v-if="stats">
          <div class="stat-icon" style="background: linear-gradient(135deg, var(--primary-color), #9254de)">
            <i class="fa-solid fa-percent"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.masteryRate }}%</div>
            <div class="stat-label">掌握率</div>
          </div>
        </div>
        <div v-else class="stat-card skeleton-card">
          <div class="skeleton skeleton-icon"></div>
          <div class="stat-content">
            <div class="skeleton skeleton-value"></div>
            <div class="skeleton skeleton-label"></div>
          </div>
        </div>
      </div>

      <!-- 薄弱知识点 - 始终显示占位 -->
      <div class="weak-points-section">
        <h2 v-if="stats && stats.weakestPoints && stats.weakestPoints.length > 0">
          <i class="fa-solid fa-triangle-exclamation"></i> 最薄弱的知识点
        </h2>
        <div v-else class="skeleton skeleton-section-title"></div>
        
        <div class="weak-points-grid">
          <!-- 有数据时显示实际内容 -->
          <template v-if="stats && stats.weakestPoints && stats.weakestPoints.length > 0">
            <div 
              v-for="point in stats.weakestPoints" 
              :key="point.pointId"
              class="weak-point-card"
              @click="filterByPoint(point.pointId)"
            >
              <div class="point-info">
                <h3>{{ point.pointTitle }}</h3>
                <span class="subject-badge">{{ point.subject }}</span>
              </div>
              <div class="point-count">
                <span class="count-value">{{ point.count }}</span>
                <span class="count-label">道错题</span>
              </div>
            </div>
          </template>
          
          <!-- 无数据时显示骨架屏 -->
          <template v-else>
            <div v-for="i in 5" :key="i" class="weak-point-card skeleton-card">
              <div class="point-info">
                <div class="skeleton skeleton-point-title"></div>
                <div class="skeleton skeleton-badge"></div>
              </div>
              <div class="point-count">
                <div class="skeleton skeleton-count"></div>
              </div>
            </div>
          </template>
        </div>
      </div>

    <!-- 筛选和操作栏 -->
    <div class="filters-bar">
      <div class="filter-group">
        <button 
          :class="['filter-btn', { active: currentFilter === 'all' }]"
          @click="setFilter('all')"
        >
          <i class="fa-solid fa-list"></i> 全部 ({{ wrongQuestions.length }})
        </button>
        <button 
          :class="['filter-btn', { active: currentFilter === 'unmastered' }]"
          @click="setFilter('unmastered')"
        >
          <i class="fa-solid fa-hourglass-half"></i> 待掌握
        </button>
        <button 
          :class="['filter-btn', { active: currentFilter === 'mastered' }]"
          @click="setFilter('mastered')"
        >
          <i class="fa-solid fa-check-circle"></i> 已掌握
        </button>
      </div>

      <div class="subject-filter">
        <select v-model="selectedSubject" @change="loadWrongQuestions" class="subject-select">
          <option value="">全部学科</option>
          <option v-for="subject in subjects" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>
      </div>
    </div>

      <!-- 错题列表 -->
      <div v-if="filteredQuestions.length > 0" class="questions-list">
        <WrongQuestionCard
          v-for="question in filteredQuestions"
          :key="question._id"
          :question="question"
          :is-analyzing="analyzingQuestionId === question._id"
          @analyze="handleAnalyze"
          @master="handleMaster"
          @reset="handleReset"
          @delete="handleDelete"
        />
      </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <i class="fa-solid fa-face-smile-beam icon-large"></i>
      <h3>{{ emptyStateMessage }}</h3>
      <p>继续努力学习，克服更多知识难点！</p>
      <router-link to="/dashboard" class="btn-primary">
        <i class="fa-solid fa-graduation-cap"></i> 去学习
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import {
  apiGetWrongQuestions,
  apiGetWrongQuestionStats,
  apiAnalyzeWrongQuestion,
  apiMarkQuestionMastered,
  apiResetQuestionMastery,
  apiDeleteWrongQuestion
} from '@/services/apiService';
import WrongQuestionCard from '@/components/WrongQuestionCard.vue';

interface WrongQuestion {
  _id: string;
  pointId: string;
  pointTitle: string;
  subject: string;
  question: string;
  options: string[];
  type: 'single' | 'multiple' | 'boolean';
  userAnswer: number | number[];
  correctAnswer: number | number[];
  explanation: string;
  aiAnalysis?: string;
  retryCount: number;
  lastAttemptAt: string;
  mastered: boolean;
  difficulty?: number;
}

interface Stats {
  totalWrong: number;
  totalMastered: number;
  totalUnmastered: number;
  masteryRate: number;
  subjectStats: Array<{
    subject: string;
    total: number;
    mastered: number;
    unmastered: number;
  }>;
  weakestPoints: Array<{
    pointId: string;
    pointTitle: string;
    subject: string;
    count: number;
  }>;
}

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isLoading = ref(true);
const wrongQuestions = ref<WrongQuestion[]>([]);
const stats = ref<Stats | null>(null);
const currentFilter = ref<'all' | 'mastered' | 'unmastered'>('all');
const selectedSubject = ref('');
const selectedPointId = ref('');
const analyzingQuestionId = ref<string | null>(null);

const subjects = computed(() => {
  if (!stats.value?.subjectStats) return [];
  return stats.value.subjectStats.map(s => s.subject);
});

const filteredQuestions = computed(() => {
  let filtered = wrongQuestions.value;

  if (currentFilter.value === 'mastered') {
    filtered = filtered.filter(q => q.mastered);
  } else if (currentFilter.value === 'unmastered') {
    filtered = filtered.filter(q => !q.mastered);
  }

  return filtered;
});

const emptyStateMessage = computed(() => {
  if (currentFilter.value === 'all') return '暂无错题记录';
  if (currentFilter.value === 'mastered') return '还没有已掌握的错题';
  return '还没有待掌握的错题';
});

const setFilter = (filter: 'all' | 'mastered' | 'unmastered') => {
  currentFilter.value = filter;
};

const filterByPoint = (pointId: string) => {
  selectedPointId.value = pointId;
  loadWrongQuestions();
};

const loadWrongQuestions = async () => {
  if (!userStore.token) {
    router.push('/login');
    return;
  }

  try {
    isLoading.value = true;

    const filters: any = {};
    if (selectedSubject.value) filters.subject = selectedSubject.value;
    if (selectedPointId.value) filters.pointId = selectedPointId.value;

    const response = await apiGetWrongQuestions(userStore.token, filters);
    wrongQuestions.value = response.wrongQuestions;
  } catch (error) {
    console.error('加载错题失败:', error);
    alert('加载错题失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

const loadStats = async () => {
  if (!userStore.token) return;

  try {
    const response = await apiGetWrongQuestionStats(userStore.token);
    stats.value = response;
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

const handleAnalyze = async (questionId: string) => {
  if (!userStore.token) return;

  try {
    analyzingQuestionId.value = questionId;
    
    // 检查是否已有 AI 解析（如果有，则是重新生成）
    const question = wrongQuestions.value.find(q => q._id === questionId);
    const regenerate = !!question?.aiAnalysis;
    
    const response = await apiAnalyzeWrongQuestion(userStore.token, questionId, regenerate);
    
    // 更新本地数据
    if (question) {
      question.aiAnalysis = response.aiAnalysis;
    }
  } catch (error) {
    console.error('生成 AI 解析失败:', error);
    alert('生成 AI 解析失败，请稍后重试');
  } finally {
    analyzingQuestionId.value = null;
  }
};

const handleMaster = async (questionId: string) => {
  if (!userStore.token) return;

  try {
    await apiMarkQuestionMastered(userStore.token, questionId);
    
    // 更新本地数据
    const question = wrongQuestions.value.find(q => q._id === questionId);
    if (question) {
      question.mastered = true;
    }

    // 刷新统计数据
    await loadStats();
  } catch (error) {
    console.error('标记错题失败:', error);
    alert('标记错题失败，请稍后重试');
  }
};

const handleReset = async (questionId: string) => {
  if (!userStore.token) return;

  try {
    await apiResetQuestionMastery(userStore.token, questionId);
    
    // 更新本地数据
    const question = wrongQuestions.value.find(q => q._id === questionId);
    if (question) {
      question.mastered = false;
    }

    // 刷新统计数据
    await loadStats();
  } catch (error) {
    console.error('重置错题失败:', error);
    alert('重置错题失败，请稍后重试');
  }
};

const handleDelete = async (questionId: string) => {
  if (!confirm('确定要删除这道错题吗？')) return;
  if (!userStore.token) return;

  try {
    await apiDeleteWrongQuestion(userStore.token, questionId);
    
    // 从本地数据中移除
    wrongQuestions.value = wrongQuestions.value.filter(q => q._id !== questionId);

    // 刷新统计数据
    await loadStats();
  } catch (error) {
    console.error('删除错题失败:', error);
    alert('删除错题失败，请稍后重试');
  }
};

onMounted(async () => {
  // 检查是否从路由参数传入筛选条件
  if (route.query.pointId) {
    selectedPointId.value = route.query.pointId as string;
  }
  if (route.query.subject) {
    selectedSubject.value = route.query.subject as string;
  }

  await Promise.all([loadWrongQuestions(), loadStats()]);
});
</script>

<style scoped>
.wrong-questions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
}

/* 骨架屏样式 */
.skeleton-loading {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(138, 127, 251, 0.1) 25%,
    rgba(138, 127, 251, 0.2) 50%,
    rgba(138, 127, 251, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-title {
  width: 320px;
  height: 40px;
  margin: 0 auto 12px;
  max-width: 100%;
}

.skeleton-subtitle {
  width: 240px;
  height: 20px;
  margin: 0 auto;
  max-width: 100%;
}

.skeleton-card {
  background: var(--card-bg) !important;
  border: 1px solid var(--card-border) !important;
  pointer-events: none;
}

.skeleton-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  flex-shrink: 0;
}

.skeleton-value {
  width: 60px;
  height: 32px;
  margin-bottom: 8px;
}

.skeleton-label {
  width: 80px;
  height: 16px;
}

.skeleton-section-title {
  width: 200px;
  height: 28px;
  margin-bottom: 20px;
}

.skeleton-point-title {
  width: 180px;
  height: 20px;
  margin-bottom: 8px;
}

.skeleton-badge {
  width: 60px;
  height: 20px;
  border-radius: 10px;
}

.skeleton-count {
  width: 40px;
  height: 32px;
  margin: 0 auto;
}

.skeleton-filter-btn {
  width: 120px;
  height: 40px;
  border-radius: 10px;
}

.skeleton-select {
  width: 150px;
  height: 40px;
  border-radius: 10px;
}

.skeleton-question-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 20px;
}

.skeleton-question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.skeleton-question-title {
  width: 60%;
  height: 24px;
}

.skeleton-badge-small {
  width: 80px;
  height: 24px;
  border-radius: 12px;
}

.skeleton-question-content {
  width: 100%;
  height: 60px;
  margin-bottom: 16px;
}

.skeleton-question-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-option {
  width: 100%;
  height: 44px;
  border-radius: 8px;
}

.skeleton-question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--card-border);
}

.skeleton-footer-text {
  width: 150px;
  height: 16px;
}

.skeleton-footer-btn {
  width: 100px;
  height: 36px;
  border-radius: 8px;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
}

.header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.header-content h1 i {
  color: var(--primary-color);
}

.subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  font-style: italic;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.weak-points-section {
  margin-bottom: 40px;
}

.weak-points-section h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.weak-points-section h2 i {
  color: #ffc107;
}

.weak-points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.weak-point-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.weak-point-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.3);
}

.point-info h3 {
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.subject-badge {
  background: rgba(138, 127, 251, 0.2);
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.point-count {
  text-align: center;
}

.count-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #ff4d4f;
  line-height: 1;
  margin-bottom: 4px;
}

.count-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.subject-select {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9375rem;
  min-width: 150px;
}

.subject-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.loading-state i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.icon-large {
  font-size: 5rem;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-color);
  color: white;
  padding: 12px 32px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.4);
}

@media (max-width: 768px) {
  .wrong-questions-container {
    padding: 20px 16px;
  }

  .header-content h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
  }

  .filter-btn {
    flex: 1;
    justify-content: center;
  }

  .subject-select {
    width: 100%;
  }

  /* 骨架屏移动端适配 */
  .skeleton-title {
    width: 240px;
    height: 32px;
  }

  .skeleton-subtitle {
    width: 180px;
    height: 18px;
  }

  .skeleton-icon {
    width: 48px;
    height: 48px;
  }

  .skeleton-value {
    width: 50px;
    height: 24px;
  }

  .skeleton-question-title {
    width: 70%;
  }

  .skeleton-filter-btn {
    flex: 1;
    min-width: 0;
  }

  .skeleton-select {
    width: 100%;
  }
}
</style>


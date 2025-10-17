<template>
  <div class="assessment-container">
    <!-- 开始评估 -->
    <div v-if="!hasStarted && !showResult" class="welcome-screen">
      <div class="welcome-card">
        <i class="fa-solid fa-brain icon-large"></i>
        <h1>欢迎来到智学伴</h1>
        <p class="subtitle">开始您的个性化学习之旅</p>
        <div class="description">
          <p>
            在开始学习之前，我们需要了解您当前的知识水平。这份评估将包含 <strong>15道题目</strong
            >，覆盖计算机科学的多个领域。
          </p>
          <ul class="features">
            <li><i class="fa-solid fa-check"></i> 评估您在各学科的掌握程度</li>
            <li><i class="fa-solid fa-check"></i> 识别需要加强的薄弱环节</li>
            <li><i class="fa-solid fa-check"></i> 生成专属的学习路径推荐</li>
          </ul>
          <p class="note">
            <i class="fa-solid fa-info-circle"></i>
            评估大约需要 10-15 分钟，请在安静的环境下完成。
          </p>
        </div>
        <button class="btn-start" @click="startAssessment">
          <i class="fa-solid fa-rocket"></i>
          开始评估
        </button>
      </div>
    </div>

    <!-- 评估进行中 -->
    <div v-else-if="hasStarted && !showResult" class="assessment-content">
      <div class="progress-header">
        <div class="progress-info">
          <span class="current-question">题目 {{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          <span class="timer"><i class="fa-solid fa-clock"></i> {{ formatTime(elapsedTime) }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <div class="question-container">
        <div class="question-card">
          <div class="question-header">
            <span class="subject-badge">{{ currentQuestion.subject }}</span>
            <span class="difficulty-badge">
              {{ '★'.repeat(currentQuestion.difficulty || 1) }}
            </span>
          </div>
          <h3>{{ currentQuestion.question }}</h3>
          <div class="options">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option"
              :class="{
                selected:
                  currentQuestion.type === 'multiple'
                    ? Array.isArray(userAnswers[currentQuestionIndex]) && (userAnswers[currentQuestionIndex] as number[]).includes(index)
                    : (userAnswers[currentQuestionIndex] as number) === index,
              }"
              @click="selectAnswer(index)"
            >
              <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
              <span class="option-text">{{ option }}</span>
              <i
                v-if="
                  currentQuestion.type === 'multiple' &&
                  Array.isArray(userAnswers[currentQuestionIndex]) && (userAnswers[currentQuestionIndex] as number[]).includes(index)
                "
                class="fa-solid fa-check"
              ></i>
            </div>
          </div>
        </div>

        <div class="navigation-buttons">
          <button
            v-if="currentQuestionIndex > 0"
            class="btn-secondary"
            @click="previousQuestion"
          >
            <i class="fa-solid fa-chevron-left"></i> 上一题
          </button>
          <button
            v-if="currentQuestionIndex < questions.length - 1"
            class="btn-primary"
            @click="nextQuestion"
            :disabled="!hasAnswered"
          >
            下一题 <i class="fa-solid fa-chevron-right"></i>
          </button>
          <button v-else
class="btn-primary"
@click="submitAssessment"
:disabled="!allAnswered">
            <i class="fa-solid fa-paper-plane"></i> 提交评估
          </button>
        </div>
      </div>
    </div>

    <!-- 评估结果 -->
    <div v-else-if="showResult && result" class="result-screen">
      <div class="result-header">
        <i class="fa-solid fa-trophy icon-large"></i>
        <h1>评估完成！</h1>
        <div class="score-display">{{ result.score }}分</div>
        <p>正确 {{ result.correctAnswers }} / {{ result.totalQuestions }} 题</p>
      </div>

      <div class="result-content">
        <div class="card skill-profile-card">
          <h3><i class="fa-solid fa-chart-pie"></i> 能力画像</h3>
          <div class="skill-list">
            <div v-for="skill in result.skillProfile" :key="skill.subject" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.subject }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="result.weaknesses.length > 0" class="card weakness-card">
          <h3><i class="fa-solid fa-exclamation-triangle"></i> 需要加强的领域</h3>
          <div class="weakness-list">
            <div v-for="weakness in result.weaknesses" :key="weakness.subject" class="weakness-item">
              <h4>{{ weakness.subject }}</h4>
              <p>{{ weakness.reason }}</p>
            </div>
          </div>
        </div>

        <div class="card recommendation-card">
          <h3><i class="fa-solid fa-route"></i> 个性化学习路径</h3>
          <p class="recommendation-text">
            基于您的评估结果，我们已为您生成专属的学习路径。系统将优先推荐您需要加强的知识点，并确保学习顺序符合依赖关系。
          </p>
          <button class="btn-start-learning" @click="goToDashboard">
            <i class="fa-solid fa-graduation-cap"></i>
            开始学习
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';
import {apiStartAssessment, apiSubmitAssessment} from '@/services/apiService';

interface AssessmentQuestion {
  pointId: string;
  subject: string;
  difficulty: number;
  question: string;
  type: 'single' | 'multiple' | 'boolean';
  options: string[];
}

interface AssessmentResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  skillProfile: Array<{subject: string; level: number}>;
  weaknesses: Array<{subject: string; reason: string}>;
}

const router = useRouter();
const userStore = useUserStore();

const hasStarted = ref(false);
const showResult = ref(false);
const isLoading = ref(false);
const loadingMessage = ref('');
const questions = ref<AssessmentQuestion[]>([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref<Array<number | number[]>>([]);
const result = ref<AssessmentResult | null>(null);
const elapsedTime = ref(0);
let timer: number | null = null;

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

const hasAnswered = computed(() => {
  const answer = userAnswers.value[currentQuestionIndex.value];
  return answer !== undefined && answer !== null;
});

const allAnswered = computed(() => {
  return questions.value.every((_, index) => {
    const answer = userAnswers.value[index];
    return answer !== undefined && answer !== null;
  });
});

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const startAssessment = async () => {
  if (!userStore.token) {
    alert('请先登录');
    router.push('/login');
    return;
  }

  isLoading.value = true;
  loadingMessage.value = '正在生成评估题目...';

  try {
    const response = await apiStartAssessment(userStore.token);
    questions.value = response.questions;
    userAnswers.value = new Array(questions.value.length).fill(null);
    hasStarted.value = true;

    // 启动计时器
    timer = window.setInterval(() => {
      elapsedTime.value++;
    }, 1000);
  } catch (error: any) {
    if (error.response?.status === 400) {
      alert('您已经完成了初始评估，将跳转到首页');
      router.push('/dashboard');
    } else {
      alert('加载评估题目失败，请稍后重试');
      console.error(error);
    }
  } finally {
    isLoading.value = false;
  }
};

const selectAnswer = (optionIndex: number) => {
  const current = currentQuestionIndex.value;
  if (currentQuestion.value.type === 'multiple') {
    const currentAnswers = Array.isArray(userAnswers.value[current]) ? (userAnswers.value[current] as number[]) : [];
    if (currentAnswers.includes(optionIndex)) {
      userAnswers.value[current] = currentAnswers.filter(i => i !== optionIndex);
    } else {
      userAnswers.value[current] = [...currentAnswers, optionIndex];
    }
  } else {
    userAnswers.value[current] = optionIndex as number;
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const submitAssessment = async () => {
  if (!userStore.token || !allAnswered.value) return;

  // 停止计时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  isLoading.value = true;
  loadingMessage.value = '正在分析您的答案...';

  try {
    const answers = userAnswers.value.map((answer, index) => ({
      pointId: questions.value[index].pointId,
      questionIndex: 0, // 简化处理，实际应该记录原始题目索引
      answer,
    }));

    const response = await apiSubmitAssessment(userStore.token, answers);
    result.value = response;
    showResult.value = true;

    // 刷新用户数据和推荐路径
    await userStore.fetchRecommendedPath();
  } catch (error) {
    alert('提交评估失败，请稍后重试');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const goToDashboard = () => {
  router.push('/dashboard');
};

onMounted(() => {
  // 检查是否已经完成评估
  // 这里可以添加检查逻辑
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.assessment-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
}

/* 欢迎屏幕 */
.welcome-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.welcome-card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 48px;
  text-align: center;
  max-width: 600px;
}

.icon-large {
  font-size: 4rem;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.welcome-card h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 32px;
}

.description {
  text-align: left;
  margin-bottom: 32px;
}

.description p {
  margin-bottom: 16px;
  line-height: 1.6;
}

.features {
  list-style: none;
  padding: 0;
  margin: 24px 0;
}

.features li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: var(--text-secondary);
}

.features i {
  color: #52c41a;
  font-size: 1.125rem;
}

.note {
  background: rgba(138, 127, 251, 0.1);
  padding: 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-start {
  background: linear-gradient(135deg, var(--primary-color), #ff4d4f);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(138, 127, 251, 0.4);
}

.btn-start:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(138, 127, 251, 0.6);
}

/* 评估进行中 */
.assessment-content {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.progress-header {
  padding: 24px;
  border-bottom: 1px solid var(--card-border);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.timer {
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.question-container {
  padding: 24px;
}

.question-card {
  margin-bottom: 24px;
}

.question-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.subject-badge {
  background: rgba(138, 127, 251, 0.2);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.difficulty-badge {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
}

.question-card h3 {
  font-size: 1.25rem;
  margin-bottom: 20px;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: var(--primary-color);
}

.option.selected {
  background: rgba(138, 127, 251, 0.2);
  border-color: var(--primary-color);
}

.option-label {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
}

.option.selected .option-label {
  background: #fff;
  color: var(--primary-color);
}

.option-text {
  flex-grow: 1;
}

.option i {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.navigation-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* 评估结果 */
.result-screen {
  text-align: center;
}

.result-header {
  padding: 48px 24px;
  background: linear-gradient(135deg, rgba(138, 127, 251, 0.2), rgba(255, 77, 79, 0.1));
  border-radius: var(--border-radius);
  margin-bottom: 32px;
}

.result-header h1 {
  font-size: 2rem;
  margin-bottom: 16px;
}

.score-display {
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), #ff4d4f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 16px 0;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 24px;
  text-align: left;
}

.card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 1.25rem;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 500;
}

.skill-level {
  color: var(--primary-color);
}

.skill-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #ff4d4f);
  transition: width 0.5s ease;
}

.weakness-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weakness-item {
  padding: 16px;
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  border-radius: 8px;
}

.weakness-item h4 {
  margin-bottom: 8px;
  color: #ffc107;
}

.recommendation-text {
  margin-bottom: 24px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.btn-start-learning {
  background: linear-gradient(135deg, var(--primary-color), #ff4d4f);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(138, 127, 251, 0.4);
  width: 100%;
  justify-content: center;
}

.btn-start-learning:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(138, 127, 251, 0.6);
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  gap: 16px;
}

.loading-overlay i {
  font-size: 3rem;
  color: var(--primary-color);
}

.loading-overlay p {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .assessment-container {
    padding: 20px 16px;
  }

  .welcome-card {
    padding: 32px 24px;
  }

  .icon-large {
    font-size: 3rem;
  }

  .welcome-card h1 {
    font-size: 1.5rem;
  }

  .score-display {
    font-size: 3rem;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>



<template>
  <div class="quiz-panel-overlay" @click="handleOverlayClick">
    <div class="quiz-panel" @click.stop>
      <div class="quiz-header">
        <h3><i class="fa-solid fa-clipboard-question"></i> {{ title }} - 测验</h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>正在加载测验...</p>
      </div>

      <!-- 测验进行中 -->
      <div v-else-if="!isSubmitted && currentQuestion" class="quiz-content">
        <div class="quiz-progress">
          <span>题目 {{ currentQuestionIndex + 1 }} / {{ quiz.length }}</span>
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: ((currentQuestionIndex + 1) / quiz.length) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <div class="question-card">
          <h4>{{ currentQuestion.question }}</h4>
          <div class="options">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option"
              :class="{
                selected:
                  currentQuestion.type === 'multiple'
                    ? (Array.isArray(userAnswers[currentQuestionIndex]) ? (userAnswers[currentQuestionIndex] as number[]).includes(index) : false)
                    : userAnswers[currentQuestionIndex] === index,
              }"
              @click="selectAnswer(index)"
            >
              <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
              <span class="option-text">{{ option }}</span>
              <i
                v-if="
                  currentQuestion.type === 'multiple' &&
                  Array.isArray(userAnswers[currentQuestionIndex]) &&
                  (userAnswers[currentQuestionIndex] as number[]).includes(index)
                "
                class="fa-solid fa-check"
              ></i>
            </div>
          </div>

          <div class="question-actions">
            <button
              v-if="currentQuestionIndex > 0"
              class="btn-secondary"
              @click="previousQuestion"
            >
              <i class="fa-solid fa-chevron-left"></i> 上一题
            </button>
            <button
              v-if="currentQuestionIndex < quiz.length - 1"
              class="btn-primary"
              @click="nextQuestion"
              :disabled="!hasAnswered"
            >
              下一题 <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button
              v-else
              class="btn-primary"
              @click="submitQuiz"
              :disabled="!allQuestionsAnswered"
            >
              <i class="fa-solid fa-paper-plane"></i> 提交测验
            </button>
          </div>
        </div>
      </div>

      <!-- 测验结果 -->
      <div v-else-if="result" class="quiz-result">
        <div class="result-header" :class="{ passed: result.passed, failed: !result.passed }">
          <i :class="result.passed ? 'fa-solid fa-trophy' : 'fa-solid fa-face-sad-tear'"></i>
          <h3>{{ result.passed ? '恭喜通过！' : '继续加油！' }}</h3>
          <div class="score">{{ result.score }}分</div>
          <p>
            正确 {{ result.correctCount }} / {{ result.totalQuestions }} 题
            {{ result.passed ? '，知识点已完成！' : '，建议重新学习后再试。' }}
          </p>
        </div>

        <div class="result-details">
          <h4>答题详情</h4>
          <div
            v-for="(item, index) in result.results"
            :key="index"
            class="result-item"
            :class="{ correct: item.isCorrect, incorrect: !item.isCorrect }"
          >
            <div class="result-item-header">
              <span class="question-number">题目 {{ index + 1 }}</span>
              <span class="result-icon">
                <i
                  :class="
                    item.isCorrect ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'
                  "
                ></i>
                {{ item.isCorrect ? '正确' : '错误' }}
              </span>
            </div>
            <p class="question-text">{{ quiz[index]?.question }}</p>
            <p v-if="!item.isCorrect && item.correctAnswer !== undefined" class="correct-answer">
              正确答案：
              {{
                Array.isArray(item.correctAnswer)
                  ? item.correctAnswer.map((i: number) => String.fromCharCode(65 + i)).join(', ')
                  : String.fromCharCode(65 + (item.correctAnswer as number))
              }}
            </p>
            <p class="explanation">{{ item.explanation }}</p>
          </div>
        </div>

        <div class="result-actions">
          <button v-if="result.passed" class="btn-primary" @click="$emit('close')">
            <i class="fa-solid fa-check"></i> 完成
          </button>
          <button v-else class="btn-secondary" @click="retryQuiz">
            <i class="fa-solid fa-rotate-right"></i> 重新测验
          </button>
          <button class="btn-secondary" @click="$emit('close')">
            <i class="fa-solid fa-book"></i> 返回学习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {apiGetQuiz, apiSubmitQuiz, apiAddWrongQuestion} from '@/services/apiService';
import {useUserStore} from '@/stores/user';

interface Props {
  pointId: string;
  title: string;
}

interface QuizQuestion {
  question: string;
  type: 'single' | 'multiple' | 'boolean';
  options: string[];
}

interface QuizResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  results: Array<{
    questionIndex: number;
    isCorrect: boolean;
    correctAnswer: number | number[];
    explanation: string;
  }>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  completed: [];
  failed: [];
}>();

const userStore = useUserStore();
const isLoading = ref(true);
const quiz = ref<QuizQuestion[]>([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref<(number | number[])[]>([]);
const isSubmitted = ref(false);
const result = ref<QuizResult | null>(null);

const currentQuestion = computed(() => quiz.value[currentQuestionIndex.value]);

const hasAnswered = computed(() => {
  const answer = userAnswers.value[currentQuestionIndex.value];
  return answer !== undefined && answer !== null;
});

const allQuestionsAnswered = computed(() => {
  return quiz.value.every((_, index) => {
    const answer = userAnswers.value[index];
    return answer !== undefined && answer !== null;
  });
});

// 选择答案
const selectAnswer = (optionIndex: number) => {
  if (!currentQuestion.value) return;
  
  const current = currentQuestionIndex.value;
  if (currentQuestion.value.type === 'multiple') {
    // 多选题
    const currentAnswers = (userAnswers.value[current] as number[]) || [];
    if (currentAnswers.includes(optionIndex)) {
      userAnswers.value[current] = currentAnswers.filter(i => i !== optionIndex);
    } else {
      userAnswers.value[current] = [...currentAnswers, optionIndex];
    }
  } else {
    // 单选题 / 判断题
    userAnswers.value[current] = optionIndex;
  }
};

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < quiz.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// 提交测验
const submitQuiz = async () => {
  if (!userStore.token) return;

  try {
    isLoading.value = true;
    const response = await apiSubmitQuiz(userStore.token, props.pointId, userAnswers.value);
    result.value = response;
    isSubmitted.value = true;

    // 自动记录错题
    if (response.results && Array.isArray(response.results)) {
      for (let i = 0; i < response.results.length; i++) {
        const resultItem = response.results[i];
        if (!resultItem.isCorrect && quiz.value[i]) {
          try {
            await apiAddWrongQuestion(userStore.token, {
              pointId: props.pointId,
              question: quiz.value[i].question,
              options: quiz.value[i].options,
              type: quiz.value[i].type,
              userAnswer: userAnswers.value[i],
              correctAnswer: resultItem.correctAnswer,
              explanation: resultItem.explanation
            });
          } catch (error) {
            console.error('记录错题失败:', error);
            // 不影响主流程，只记录日志
          }
        }
      }
    }

    // 如果通过，触发完成事件；否则触发失败事件
    if (response.passed) {
      emit('completed');
    } else {
      emit('failed');
    }
  } catch (error) {
    console.error('提交测验失败:', error);
    alert('提交测验失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 重新测验
const retryQuiz = () => {
  currentQuestionIndex.value = 0;
  userAnswers.value = [];
  isSubmitted.value = false;
  result.value = null;
};

// 点击遮罩关闭
const handleOverlayClick = () => {
  if (!isSubmitted.value) {
    if (confirm('测验尚未完成，确定要退出吗？')) {
      emit('close');
    }
  } else {
    emit('close');
  }
};

// 加载测验
onMounted(async () => {
  if (!userStore.token) return;

  try {
    const response = await apiGetQuiz(userStore.token, props.pointId);
    quiz.value = response.quiz;
    userAnswers.value = new Array(quiz.value.length).fill(null);
  } catch (error) {
    console.error('加载测验失败:', error);
    alert('加载测验失败，请稍后重试');
    emit('close');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.quiz-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.quiz-panel {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--card-border);
  position: sticky;
  top: 0;
  background: var(--card-bg);
  z-index: 10;
}

.quiz-header h3 {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.loading-state {
  padding: 60px 24px;
  text-align: center;
  color: var(--text-secondary);
}

.loading-state i {
  font-size: 3rem;
  margin-bottom: 16px;
}

.quiz-content {
  padding: 24px;
}

.quiz-progress {
  margin-bottom: 24px;
}

.quiz-progress span {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
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

.question-card h4 {
  font-size: 1.125rem;
  margin-bottom: 20px;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
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

.question-actions {
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

/* 结果页面 */
.quiz-result {
  padding: 24px;
}

.result-header {
  text-align: center;
  padding: 40px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.result-header.passed {
  background: linear-gradient(135deg, rgba(82, 196, 26, 0.2), rgba(82, 196, 26, 0.1));
}

.result-header.failed {
  background: linear-gradient(135deg, rgba(255, 77, 79, 0.2), rgba(255, 77, 79, 0.1));
}

.result-header i {
  font-size: 4rem;
  margin-bottom: 16px;
}

.result-header.passed i {
  color: #52c41a;
}

.result-header.failed i {
  color: #ff4d4f;
}

.result-header h3 {
  font-size: 2rem;
  margin: 0 0 16px 0;
}

.score {
  font-size: 3rem;
  font-weight: 700;
  margin: 16px 0;
  background: linear-gradient(135deg, var(--primary-color), #ff4d4f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-details {
  margin-bottom: 24px;
}

.result-details h4 {
  font-size: 1.125rem;
  margin-bottom: 16px;
}

.result-item {
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.result-item.correct {
  background: rgba(82, 196, 26, 0.1);
  border-left: 4px solid #52c41a;
}

.result-item.incorrect {
  background: rgba(255, 77, 79, 0.1);
  border-left: 4px solid #ff4d4f;
}

.result-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
}

.result-icon {
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-item.correct .result-icon {
  color: #52c41a;
}

.result-item.incorrect .result-icon {
  color: #ff4d4f;
}

.question-text {
  margin: 8px 0;
  font-size: 0.9375rem;
}

.correct-answer {
  color: #52c41a;
  font-weight: 500;
  margin: 8px 0;
  font-size: 0.875rem;
}

.explanation {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 8px;
  font-style: italic;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 768px) {
  .quiz-panel {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .question-actions,
  .result-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>


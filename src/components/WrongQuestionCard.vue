<template>
  <div class="wrong-question-card" :class="{ mastered: question.mastered }">
    <div class="card-header">
      <div class="header-left">
        <span class="subject-badge">{{ question.subject }}</span>
        <span class="difficulty-badge">{{ '★'.repeat(question.difficulty || 3) }}</span>
        <span v-if="question.mastered" class="mastered-badge">
          <i class="fa-solid fa-check-circle"></i> 已掌握
        </span>
      </div>
      <div class="header-actions">
        <button 
          class="action-btn" 
          @click="$emit('delete', question._id)" 
          title="删除"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <h4 class="question-title">{{ question.pointTitle }}</h4>
      <p class="question-text">{{ question.question }}</p>

      <div class="options-grid">
        <div 
          v-for="(option, index) in question.options" 
          :key="index"
          class="option-item"
          :class="{
            'user-answer': isUserAnswer(index),
            'correct-answer': isCorrectAnswer(index),
            'wrong-answer': isUserAnswer(index) && !isCorrectAnswer(index)
          }"
        >
          <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
          <span class="option-text">{{ option }}</span>
          <i v-if="isCorrectAnswer(index)" class="fa-solid fa-check"></i>
          <i v-if="isUserAnswer(index) && !isCorrectAnswer(index)" class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div class="explanation-section">
        <h5><i class="fa-solid fa-lightbulb"></i> 标准解析</h5>
        <p>{{ question.explanation }}</p>
      </div>

      <div v-if="question.aiAnalysis" class="ai-analysis-section">
        <h5><i class="fa-solid fa-robot"></i> AI 深度解析</h5>
        <div class="ai-content" v-html="renderMarkdown(question.aiAnalysis)"></div>
      </div>

      <div v-else class="ai-analysis-placeholder">
        <button 
          class="btn-analyze" 
          @click="$emit('analyze', question._id)"
          :disabled="isAnalyzing"
        >
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          {{ isAnalyzing ? '正在生成 AI 解析...' : '生成 AI 深度解析' }}
        </button>
      </div>
    </div>

    <div class="card-footer">
      <div class="footer-info">
        <span><i class="fa-solid fa-redo"></i> 重做次数: {{ question.retryCount }}</span>
        <span><i class="fa-solid fa-clock"></i> {{ formatDate(question.lastAttemptAt) }}</span>
      </div>
      <div class="footer-actions">
        <button 
          v-if="!question.mastered" 
          class="btn-primary" 
          @click="$emit('master', question._id)"
        >
          <i class="fa-solid fa-check"></i> 标记为已掌握
        </button>
        <button 
          v-else 
          class="btn-secondary" 
          @click="$emit('reset', question._id)"
        >
          <i class="fa-solid fa-rotate-left"></i> 重置为未掌握
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';

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

interface Props {
  question: WrongQuestion;
  isAnalyzing?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  analyze: [id: string];
  master: [id: string];
  reset: [id: string];
  delete: [id: string];
}>();

const isUserAnswer = (index: number) => {
  if (Array.isArray(props.question.userAnswer)) {
    return props.question.userAnswer.includes(index);
  }
  return props.question.userAnswer === index;
};

const isCorrectAnswer = (index: number) => {
  if (Array.isArray(props.question.correctAnswer)) {
    return props.question.correctAnswer.includes(index);
  }
  return props.question.correctAnswer === index;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  return date.toLocaleDateString('zh-CN');
};

const renderMarkdown = (text: string) => {
  return marked(text);
};
</script>

<style scoped>
.wrong-question-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.wrong-question-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.wrong-question-card.mastered {
  opacity: 0.7;
  border-color: #52c41a;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--card-border);
  background: rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
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

.mastered-badge {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(0, 0, 0, 0.2);
  border: none;
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
}

.card-body {
  padding: 20px;
}

.question-title {
  font-size: 1rem;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.question-text {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 20px;
  font-weight: 500;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid transparent;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.option-item.correct-answer {
  background: rgba(82, 196, 26, 0.1);
  border-color: #52c41a;
}

.option-item.wrong-answer {
  background: rgba(255, 77, 79, 0.1);
  border-color: #ff4d4f;
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

.option-item.correct-answer .option-label {
  background: #52c41a;
}

.option-item.wrong-answer .option-label {
  background: #ff4d4f;
}

.option-text {
  flex-grow: 1;
}

.option-item i {
  font-size: 1.25rem;
}

.option-item.correct-answer i {
  color: #52c41a;
}

.option-item.wrong-answer i {
  color: #ff4d4f;
}

.explanation-section,
.ai-analysis-section {
  margin-top: 20px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.explanation-section h5,
.ai-analysis-section h5 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--primary-color);
  font-size: 1rem;
}

.explanation-section p {
  line-height: 1.6;
  color: var(--text-secondary);
}

.ai-content {
  line-height: 1.8;
  color: var(--text-secondary);
}

.ai-content :deep(h1),
.ai-content :deep(h2),
.ai-content :deep(h3),
.ai-content :deep(h4) {
  color: var(--text-primary);
  margin: 16px 0 8px 0;
}

.ai-content :deep(p) {
  margin: 8px 0;
}

.ai-content :deep(ul),
.ai-content :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.ai-content :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.ai-analysis-placeholder {
  margin-top: 20px;
  text-align: center;
}

.btn-analyze {
  background: linear-gradient(135deg, var(--primary-color), #ff4d4f);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-analyze:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.4);
}

.btn-analyze:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid var(--card-border);
  background: rgba(0, 0, 0, 0.1);
}

.footer-info {
  display: flex;
  gap: 20px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.footer-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(138, 127, 251, 0.4);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .card-header,
  .card-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .footer-info {
    flex-direction: column;
    gap: 8px;
  }

  .footer-actions {
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    justify-content: center;
  }
}
</style>


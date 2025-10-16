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
      <div class="question-text" v-html="renderMarkdown(question.question)"></div>

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
          <span class="option-text" v-html="renderMarkdown(option)"></span>
          <i v-if="isCorrectAnswer(index)" class="fa-solid fa-check"></i>
          <i v-if="isUserAnswer(index) && !isCorrectAnswer(index)" class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div class="explanation-section">
        <h5><i class="fa-solid fa-lightbulb"></i> 标准解析</h5>
        <div class="explanation-content" v-html="renderMarkdown(question.explanation)"></div>
      </div>

      <div v-if="question.aiAnalysis" class="ai-analysis-section">
        <div class="ai-analysis-header">
          <h5><i class="fa-solid fa-robot"></i> AI 深度解析</h5>
          <button 
            class="btn-regenerate" 
            @click="$emit('analyze', question._id)"
            :disabled="isAnalyzing"
            title="重新生成 AI 解析"
          >
            <i class="fa-solid fa-rotate"></i>
            {{ isAnalyzing ? '正在生成...' : '重新生成' }}
          </button>
        </div>
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
import hljs from 'highlight.js';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';

// 配置 marked 渲染器
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(text, { language: lang }).value;
          return `<pre class="wrong-code-block"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (error) {
          console.error('代码高亮失败:', error);
        }
      }
      return `<pre class="wrong-code-block"><code>${text}</code></pre>`;
    },
  },
});

// 配置 KaTeX 扩展
marked.use(
  markedKatex({
    throwOnError: false,
    output: 'html',
    nonStandard: true,
    strict: false,
    trust: true,
  })
);

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

const renderMarkdown = (text: string): string => {
  if (!text) return '';
  try {
    const parsed = marked.parse(text);
    return typeof parsed === 'string' ? parsed : parsed.toString();
  } catch (error) {
    console.error('Markdown 渲染失败:', error);
    return text;
  }
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.question-text :deep(*) {
  font-family: inherit;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.option-text :deep(*) {
  font-family: inherit;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.explanation-section :deep(*),
.ai-analysis-section :deep(*) {
  font-family: inherit;
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

.ai-analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ai-analysis-header h5 {
  margin-bottom: 0;
}

.explanation-section p {
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 标准解析和 AI 解析内容样式 */
.explanation-content,
.ai-content {
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Markdown 渲染样式 */
.question-text :deep(p),
.option-text :deep(p),
.explanation-content :deep(p),
.ai-content :deep(p) {
  margin: 8px 0;
  line-height: 1.6;
}

.question-text :deep(code),
.option-text :deep(code),
.explanation-content :deep(code),
.ai-content :deep(code) {
  background: rgba(138, 127, 251, 0.2);
  color: var(--primary-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.question-text :deep(strong),
.option-text :deep(strong),
.explanation-content :deep(strong),
.ai-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

/* 代码块样式 */
.question-text :deep(.wrong-code-block),
.option-text :deep(.wrong-code-block),
.explanation-content :deep(.wrong-code-block),
.ai-content :deep(.wrong-code-block) {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 12px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.question-text :deep(.wrong-code-block code),
.option-text :deep(.wrong-code-block code),
.explanation-content :deep(.wrong-code-block code),
.ai-content :deep(.wrong-code-block code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* KaTeX 公式样式 */
.question-text :deep(.katex),
.option-text :deep(.katex),
.explanation-content :deep(.katex),
.ai-content :deep(.katex) {
  font-size: 1.1em;
}

.question-text :deep(.katex-display),
.option-text :deep(.katex-display),
.explanation-content :deep(.katex-display),
.ai-content :deep(.katex-display) {
  margin: 16px 0;
}

/* 深色主题适配 */
:root[data-theme='dark'] .question-text :deep(.katex),
:root[data-theme='dark'] .option-text :deep(.katex),
:root[data-theme='dark'] .explanation-content :deep(.katex),
:root[data-theme='dark'] .ai-content :deep(.katex) {
  color: #e0e0e0;
}

/* 标题样式 */
.explanation-content :deep(h1),
.explanation-content :deep(h2),
.explanation-content :deep(h3),
.explanation-content :deep(h4),
.ai-content :deep(h1),
.ai-content :deep(h2),
.ai-content :deep(h3),
.ai-content :deep(h4) {
  color: var(--text-primary);
  margin: 16px 0 8px 0;
}

/* 列表样式 */
.explanation-content :deep(ul),
.explanation-content :deep(ol),
.ai-content :deep(ul),
.ai-content :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.explanation-content :deep(li),
.ai-content :deep(li) {
  margin: 4px 0;
}

/* em 和 mark 标签样式 */
.explanation-content :deep(em),
.ai-content :deep(em) {
  font-style: italic;
  color: var(--text-primary);
}

.explanation-content :deep(mark),
.ai-content :deep(mark) {
  background-color: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
  padding: 2px 4px;
  border-radius: 3px;
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

.btn-regenerate {
  background: rgba(138, 127, 251, 0.15);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-regenerate:hover:not(:disabled) {
  background: rgba(138, 127, 251, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(138, 127, 251, 0.3);
}

.btn-regenerate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-regenerate i {
  font-size: 0.875rem;
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


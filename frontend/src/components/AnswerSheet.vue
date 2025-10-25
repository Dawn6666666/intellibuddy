<template>
  <div class="answer-sheet">
    <!-- 头部信息 -->
    <div class="sheet-header">
      <h2>{{ assignment.title }}</h2>
      <div class="meta-info">
        <el-tag :type="getTypeTag(assignment.type)">
          {{ getTypeLabel(assignment.type) }}
        </el-tag>
        <el-tag :type="getDifficultyTag(assignment.difficulty)">
          {{ getDifficultyLabel(assignment.difficulty) }}
        </el-tag>
        <span class="info-item">
          <i class="fa-solid fa-star"></i>
          总分：{{ assignment.totalScore }}
        </span>
        <span class="info-item" v-if="assignment.duration">
          <i class="fa-solid fa-clock"></i>
          时长：{{ assignment.duration }}分钟
        </span>
        <span class="info-item" v-if="assignment.dueDate">
          <i class="fa-solid fa-calendar"></i>
          截止：{{ formatDate(assignment.dueDate) }}
        </span>
      </div>
      <p v-if="assignment.description" class="description">
        {{ assignment.description }}
      </p>
    </div>

    <!-- 题目列表 -->
    <div v-loading="loading" class="questions-container">
      <div
        v-for="(question, index) in questions"
        :key="question._id"
        class="question-item"
        :class="{ 'answered': isAnswered(index) }"
      >
        <!-- 题目头部 -->
        <div class="question-header">
          <div class="question-number">
            第 {{ index + 1 }} 题
          </div>
          <el-tag :type="getQuestionTypeTag(question.type)" size="small">
            {{ getQuestionTypeLabel(question.type) }}
          </el-tag>
          <div class="question-score">
            {{ getQuestionScore(question._id) }} 分
          </div>
        </div>

        <!-- 题目标题 -->
        <h3 class="question-title" v-html="renderMarkdown(question.title)"></h3>

        <!-- 题目内容 -->
        <div class="question-content" v-html="renderMarkdown(question.content)"></div>

        <!-- 单选题 -->
        <el-radio-group
          v-if="question.type === 'single' || question.type === 'truefalse'"
          v-model="answers[index]"
          class="options-group"
        >
          <el-radio
            v-for="(option, optIndex) in question.options"
            :key="option.id"
            :label="option.id"
            class="option-item"
          >
            <div class="option-wrapper">
              <span class="option-label">{{ String.fromCharCode(65 + optIndex) }}.</span>
              <span class="option-content" v-html="renderMarkdown(option.content)"></span>
            </div>
          </el-radio>
        </el-radio-group>

        <!-- 多选题 -->
        <el-checkbox-group
          v-else-if="question.type === 'multiple'"
          v-model="answers[index]"
          class="options-group"
        >
          <el-checkbox
            v-for="(option, optIndex) in question.options"
            :key="option.id"
            :label="option.id"
            class="option-item"
          >
            <div class="option-wrapper">
              <span class="option-label">{{ String.fromCharCode(65 + optIndex) }}.</span>
              <span class="option-content" v-html="renderMarkdown(option.content)"></span>
            </div>
          </el-checkbox>
        </el-checkbox-group>

        <!-- 简答题/论述题 -->
        <el-input
          v-else-if="question.type === 'short' || question.type === 'essay'"
          v-model="answers[index]"
          type="textarea"
          :rows="question.type === 'essay' ? 10 : 4"
          placeholder="请输入您的答案..."
        />
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="sheet-footer">
      <div class="progress-info">
        已答 {{ answeredCount }} / {{ questions.length }} 题
      </div>
      <div class="footer-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :disabled="answeredCount === 0"
          @click="handleSubmit"
        >
          提交答卷
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { apiService } from '@/services/apiService';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';

// Props
const props = defineProps<{
  assignment: any;
}>();

// Emits
const emit = defineEmits<{
  submit: [answers: any[]];
  cancel: [];
}>();

// 配置 KaTeX 支持数学公式
marked.use(markedKatex({
  throwOnError: false,
  output: 'html',
  nonStandard: true,
  strict: false,
  trust: true
}));

marked.setOptions({
  gfm: true,
  pedantic: false,
  breaks: true,
});

// Markdown 渲染函数
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

// 状态
const loading = ref(false);
const questions = ref<any[]>([]);
const answers = ref<any[]>([]);

// 加载题目
async function loadQuestions() {
  try {
    loading.value = true;
    const questionIds = props.assignment.questions.map((q: any) => q.questionId);
    
    const response = await apiService.client.post('/question/batch', {
      questionIds
    });
    
    questions.value = response.data;
    
    // 初始化答案数组
    answers.value = questions.value.map(q => {
      if (q.type === 'multiple') {
        return []; // 多选题初始化为空数组
      }
      return ''; // 其他题型初始化为空字符串
    });
  } catch (error) {
    console.error('加载题目失败:', error);
    ElMessage.error('加载题目失败');
  } finally {
    loading.value = false;
  }
}

// 计算已答题数量
const answeredCount = computed(() => {
  return answers.value.filter(answer => {
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== '';
  }).length;
});

// 检查是否已答
function isAnswered(index: number): boolean {
  const answer = answers.value[index];
  if (Array.isArray(answer)) {
    return answer.length > 0;
  }
  return answer !== '';
}

// 获取题目分数
function getQuestionScore(questionId: string): number {
  const question = props.assignment.questions.find((q: any) => q.questionId === questionId);
  return question?.score || 0;
}

// 提交答卷
async function handleSubmit() {
  if (answeredCount.value < questions.value.length) {
    try {
      await ElMessageBox.confirm(
        `您还有 ${questions.value.length - answeredCount.value} 道题未作答，确定要提交吗？`,
        '提示',
        {
          type: 'warning'
        }
      );
    } catch {
      return;
    }
  }

  // 构建提交数据
  const submission = questions.value.map((question, index) => ({
    questionId: question._id,
    answer: answers.value[index]
  }));

  emit('submit', submission);
}

// 取消
function handleCancel() {
  emit('cancel');
}

// 格式化日期
function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString('zh-CN');
}

// 工具函数
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    practice: '练习',
    quiz: '测验',
    homework: '作业',
    exam: '考试'
  };
  return labels[type] || type;
}

function getTypeTag(type: string): string {
  const tags: Record<string, string> = {
    practice: 'info',
    quiz: 'warning',
    homework: 'success',
    exam: 'danger'
  };
  return tags[type] || '';
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return labels[difficulty] || difficulty;
}

function getDifficultyTag(difficulty: string): string {
  const tags: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  };
  return tags[difficulty] || '';
}

function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    truefalse: '判断题',
    short: '简答题',
    essay: '论述题'
  };
  return labels[type] || type;
}

function getQuestionTypeTag(type: string): string {
  const tags: Record<string, string> = {
    single: 'primary',
    multiple: 'success',
    truefalse: 'warning',
    short: 'info',
    essay: 'danger'
  };
  return tags[type] || '';
}

// 初始化
onMounted(() => {
  loadQuestions();
});
</script>

<style scoped>
.answer-sheet {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.sheet-header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.sheet-header h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #303133;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 14px;
}

.info-item i {
  color: var(--primary-color);
}

.description {
  margin: 16px 0 0 0;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  color: #606266;
  line-height: 1.6;
}

.questions-container {
  min-height: 200px;
}

.question-item {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.question-item.answered {
  border-left: 4px solid #67c23a;
}

.question-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.question-number {
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.question-score {
  margin-left: auto;
  font-weight: 600;
  color: var(--primary-color);
  font-size: 16px;
}

.question-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.question-content {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
  line-height: 1.8;
  color: #606266;
  white-space: pre-wrap;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  width: 100%;
  margin: 0 !important;
  height: auto !important;
  min-height: auto !important;
}

/* 覆盖 Element Plus 默认样式，移除固定高度 */
.option-item :deep(.el-radio),
.option-item :deep(.el-checkbox) {
  display: flex !important;
  align-items: flex-start !important;
  height: auto !important;
  min-height: auto !important;
  line-height: normal !important;
}

.option-item :deep(.el-radio__input),
.option-item :deep(.el-checkbox__input) {
  margin-top: 2px;
  flex-shrink: 0;
}

.option-item :deep(.el-radio__label),
.option-item :deep(.el-checkbox__label) {
  width: 100%;
  padding: 0 !important;
  display: block !important;
  line-height: 1.6 !important;
  height: auto !important;
  white-space: normal !important;
}

.option-item:hover {
  background: #e4e7ed;
}

.option-item.is-checked {
  background: #e3f2fd;
  border-color: var(--primary-color);
}

.option-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.option-label {
  font-weight: 600;
  color: var(--primary-color);
  flex-shrink: 0;
  min-width: 24px;
  padding-top: 2px;
}

.option-content {
  flex: 1;
  text-align: left;
  word-break: break-word;
  white-space: normal !important;
  overflow-wrap: break-word;
  line-height: 1.6 !important;
  min-height: auto !important;
  height: auto !important;
}

/* Markdown 和 KaTeX 渲染样式 */
.question-title :deep(p),
.question-content :deep(p),
.option-content :deep(p) {
  margin: 0.5em 0;
  line-height: 1.6;
}

.question-title :deep(p:first-child),
.question-content :deep(p:first-child),
.option-content :deep(p:first-child) {
  margin-top: 0;
}

.question-title :deep(p:last-child),
.question-content :deep(p:last-child),
.option-content :deep(p:last-child) {
  margin-bottom: 0;
}

.question-title :deep(code),
.question-content :deep(code),
.option-content :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.question-title :deep(.katex),
.question-content :deep(.katex),
.option-content :deep(.katex) {
  font-size: 1.1em;
}

.question-title :deep(.katex-display),
.question-content :deep(.katex-display) {
  margin: 1em 0;
  overflow-x: auto;
}

.option-content :deep(.katex) {
  font-size: 1em;
  vertical-align: middle;
}

.option-content :deep(.katex-display) {
  margin: 0.5em 0;
  overflow-x: auto;
}

/* 深色主题下的样式 */
html.dark-theme .question-title :deep(.katex),
html.dark-theme .question-content :deep(.katex),
html.dark-theme .option-content :deep(.katex) {
  color: #e0e0e0;
}

html.dark-theme .question-title :deep(code),
html.dark-theme .question-content :deep(code),
html.dark-theme .option-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.sheet-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.progress-info {
  font-size: 16px;
  font-weight: 600;
  color: #606266;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .answer-sheet {
    padding: 12px;
  }

  .sheet-header,
  .question-item {
    padding: 16px;
  }

  .meta-info {
    flex-direction: column;
    gap: 8px;
  }

  .sheet-footer {
    flex-direction: column;
    gap: 12px;
  }

  .footer-actions {
    width: 100%;
  }

  .footer-actions button {
    flex: 1;
  }
}
</style>


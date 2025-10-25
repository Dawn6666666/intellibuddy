<template>
  <div class="question-view">
    <!-- 题目头部 -->
    <div class="question-header">
      <el-tag :type="getTypeTagType(question.type)" size="small">
        {{ getTypeLabel(question.type) }}
      </el-tag>
      <el-tag :type="getDifficultyTagType(question.difficulty)" size="small">
        {{ getDifficultyLabel(question.difficulty) }}
      </el-tag>
      <h3>{{ question.title }}</h3>
    </div>

    <!-- 题目内容 -->
    <div class="question-content">
      <div class="content-label">题目：</div>
      <div class="content-text">{{ question.content }}</div>
    </div>

    <!-- 选项（选择题） -->
    <div
      v-if="['single', 'multiple', 'truefalse'].includes(question.type) && question.options"
      class="question-options"
    >
      <div class="content-label">选项：</div>
      <div class="options-list">
        <div
          v-for="(option, index) in question.options"
          :key="option.id"
          class="option-item"
          :class="{ 'is-correct': showAnswer && option.isCorrect }"
        >
          <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
          <span class="option-content">{{ option.content }}</span>
          <el-tag
            v-if="showAnswer && option.isCorrect"
            type="success"
            size="small"
          >
            正确答案
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 参考答案（简答题/论述题） -->
    <div
      v-if="showAnswer && ['short', 'essay'].includes(question.type) && question.correctAnswer"
      class="question-answer"
    >
      <div class="content-label">参考答案：</div>
      <div class="content-text">{{ question.correctAnswer }}</div>
    </div>

    <!-- 题目解析 -->
    <div v-if="showAnswer && question.analysis" class="question-analysis">
      <div class="content-label">题目解析：</div>
      <div class="content-text">{{ question.analysis }}</div>
    </div>

    <!-- 标签 -->
    <div v-if="question.tags && question.tags.length > 0" class="question-tags">
      <div class="content-label">标签：</div>
      <div>
        <el-tag
          v-for="tag in question.tags"
          :key="tag"
          size="small"
          style="margin-right: 8px;"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  question: any;
  showAnswer?: boolean; // 是否显示答案
}>();

// 工具函数
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    single: '单选题',
    multiple: '多选题',
    truefalse: '判断题',
    short: '简答题',
    essay: '论述题'
  };
  return labels[type] || type;
}

function getTypeTagType(type: string): string {
  const types: Record<string, string> = {
    single: 'primary',
    multiple: 'success',
    truefalse: 'warning',
    short: 'info',
    essay: 'danger'
  };
  return types[type] || '';
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return labels[difficulty] || difficulty;
}

function getDifficultyTagType(difficulty: string): string {
  const types: Record<string, string> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  };
  return types[difficulty] || '';
}
</script>

<style scoped>
.question-view {
  padding: 20px;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--card-border);
}

.question-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.question-content,
.question-options,
.question-answer,
.question-analysis,
.question-tags {
  margin-bottom: 20px;
}

.content-label {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.content-text {
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 4px;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 4px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.option-item.is-correct {
  background: var(--success-bg);
  border-color: var(--success-color);
}

.option-label {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 24px;
  flex-shrink: 0;
  line-height: 1.6;
}

.option-content {
  flex: 1;
  color: var(--text-primary);
  line-height: 1.6;
  padding-right: 80px; /* 为标签留出空间 */
}

.option-item .el-tag {
  position: absolute;
  right: 12px;
  top: 12px;
}

.question-analysis .content-text {
  background: var(--warning-bg);
  border-left: 4px solid var(--warning-color);
}

.question-tags {
  padding-top: 16px;
  border-top: 1px solid var(--card-border);
}
</style>


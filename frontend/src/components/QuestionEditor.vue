<template>
  <div class="question-editor">
    <el-form :model="questionForm" label-width="100px" @submit.prevent>
      <!-- 题目标题 -->
      <el-form-item label="题目标题" required>
        <el-input
          v-model="questionForm.title"
          placeholder="请输入题目标题"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <!-- 题型选择 -->
      <el-form-item label="题型" required>
        <el-radio-group v-model="questionForm.type" @change="handleTypeChange">
          <el-radio label="single">单选题</el-radio>
          <el-radio label="multiple">多选题</el-radio>
          <el-radio label="truefalse">判断题</el-radio>
          <el-radio label="short">简答题</el-radio>
          <el-radio label="essay">论述题</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 题目内容 -->
      <el-form-item label="题目内容" required>
        <el-input
          v-model="questionForm.content"
          type="textarea"
          :rows="4"
          placeholder="请输入题目内容，支持Markdown格式"
        />
      </el-form-item>

      <!-- 选项设置（单选、多选、判断题） -->
      <el-form-item
        v-if="['single', 'multiple', 'truefalse'].includes(questionForm.type)"
        label="选项"
        required
      >
        <div class="options-container">
          <div
            v-for="(option, index) in questionForm.options"
            :key="option.id"
            class="option-item"
          >
            <div class="option-header">
              <span class="option-label">选项 {{ String.fromCharCode(65 + index) }}</span>
              <el-checkbox
                v-if="questionForm.type === 'single'"
                :model-value="option.isCorrect"
                @change="handleSingleCorrectChange(index)"
              >
                正确答案
              </el-checkbox>
              <el-checkbox
                v-else-if="questionForm.type === 'multiple'"
                v-model="option.isCorrect"
              >
                正确答案
              </el-checkbox>
              <el-button
                v-if="questionForm.type !== 'truefalse' && questionForm.options.length > 2"
                type="danger"
                text
                size="small"
                @click="removeOption(index)"
              >
                删除
              </el-button>
            </div>
            <el-input
              v-model="option.content"
              placeholder="请输入选项内容"
            />
          </div>
          
          <!-- 添加选项按钮（非判断题） -->
          <el-button
            v-if="questionForm.type !== 'truefalse'"
            type="primary"
            size="default"
            class="add-option-btn"
            @click="addOption"
          >
            <i class="fa-solid fa-plus"></i> 添加选项
          </el-button>
        </div>
      </el-form-item>

      <!-- 正确答案（简答题、论述题） -->
      <el-form-item
        v-if="['short', 'essay'].includes(questionForm.type)"
        label="参考答案"
      >
        <el-input
          v-model="questionForm.correctAnswerText"
          type="textarea"
          :rows="4"
          placeholder="请输入参考答案（可选）"
        />
      </el-form-item>

      <!-- 题目解析 -->
      <el-form-item label="题目解析">
        <el-input
          v-model="questionForm.analysis"
          type="textarea"
          :rows="3"
          placeholder="请输入题目解析（可选）"
        />
      </el-form-item>

      <!-- 难度 -->
      <el-form-item label="难度" required>
        <el-radio-group v-model="questionForm.difficulty" class="difficulty-group">
          <el-radio-button label="easy">简单</el-radio-button>
          <el-radio-button label="medium">中等</el-radio-button>
          <el-radio-button label="hard">困难</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 标签 -->
      <el-form-item label="标签">
        <el-tag
          v-for="tag in questionForm.tags"
          :key="tag"
          closable
          @close="removeTag(tag)"
          style="margin-right: 8px;"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="showTagInput"
          ref="tagInputRef"
          v-model="newTag"
          size="small"
          style="width: 100px;"
          @keyup.enter="handleTagInputConfirm"
          @blur="handleTagInputConfirm"
        />
        <el-button
          v-else
          size="small"
          @click="showTagInput = true"
        >
          + 添加标签
        </el-button>
      </el-form-item>

      <!-- 是否公开 -->
      <el-form-item label="公开">
        <el-switch v-model="questionForm.isPublic" />
        <span class="tip">公开后其他教师可以使用此题目</span>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <div class="editor-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存题目</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue';
import { ElMessage } from 'element-plus';

// Props
const props = defineProps<{
  initialData?: any;
}>();

// Emits
const emit = defineEmits<{
  save: [question: any];
  cancel: [];
}>();

// 题目表单
const questionForm = reactive({
  title: '',
  type: 'single' as 'single' | 'multiple' | 'truefalse' | 'short' | 'essay',
  content: '',
  options: [] as Array<{ id: string; content: string; isCorrect: boolean }>,
  correctAnswerText: '', // 简答题/论述题的参考答案
  analysis: '',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  tags: [] as string[],
  isPublic: false
});

// 标签输入
const showTagInput = ref(false);
const newTag = ref('');
const tagInputRef = ref();

// 初始化数据
if (props.initialData) {
  Object.assign(questionForm, props.initialData);
  if (props.initialData.correctAnswer && typeof props.initialData.correctAnswer === 'string') {
    questionForm.correctAnswerText = props.initialData.correctAnswer;
  }
} else {
  // 默认初始化判断题选项
  questionForm.options = [
    { id: 'true', content: '正确', isCorrect: true },
    { id: 'false', content: '错误', isCorrect: false }
  ];
}

// 题型改变
function handleTypeChange(newType: string) {
  if (newType === 'truefalse') {
    // 判断题固定两个选项
    questionForm.options = [
      { id: 'true', content: '正确', isCorrect: true },
      { id: 'false', content: '错误', isCorrect: false }
    ];
  } else if (newType === 'single' || newType === 'multiple') {
    // 单选/多选题默认4个选项
    if (questionForm.options.length === 2 && 
        questionForm.options[0].id === 'true' && 
        questionForm.options[1].id === 'false') {
      questionForm.options = [
        { id: 'A', content: '', isCorrect: false },
        { id: 'B', content: '', isCorrect: false },
        { id: 'C', content: '', isCorrect: false },
        { id: 'D', content: '', isCorrect: false }
      ];
    }
  } else {
    // 简答题/论述题清空选项
    questionForm.options = [];
  }
}

// 添加选项
function addOption() {
  const nextId = String.fromCharCode(65 + questionForm.options.length);
  questionForm.options.push({
    id: nextId,
    content: '',
    isCorrect: false
  });
}

// 删除选项
function removeOption(index: number) {
  questionForm.options.splice(index, 1);
  // 重新分配ID
  questionForm.options.forEach((opt, idx) => {
    opt.id = String.fromCharCode(65 + idx);
  });
}

// 单选题：确保只有一个正确答案
function handleSingleCorrectChange(index: number) {
  questionForm.options.forEach((opt, idx) => {
    opt.isCorrect = idx === index;
  });
}

// 添加标签
function handleTagInputConfirm() {
  if (newTag.value && !questionForm.tags.includes(newTag.value)) {
    questionForm.tags.push(newTag.value);
  }
  showTagInput.value = false;
  newTag.value = '';
}

// 删除标签
function removeTag(tag: string) {
  const index = questionForm.tags.indexOf(tag);
  if (index > -1) {
    questionForm.tags.splice(index, 1);
  }
}

// 显示标签输入框时自动聚焦
watch(showTagInput, (val) => {
  if (val) {
    nextTick(() => {
      tagInputRef.value?.focus();
    });
  }
});

// 验证表单
function validateForm(): boolean {
  if (!questionForm.title.trim()) {
    ElMessage.warning('请输入题目标题');
    return false;
  }

  if (!questionForm.content.trim()) {
    ElMessage.warning('请输入题目内容');
    return false;
  }

  // 选择题验证
  if (['single', 'multiple', 'truefalse'].includes(questionForm.type)) {
    if (questionForm.options.some(opt => !opt.content.trim())) {
      ElMessage.warning('请填写所有选项内容');
      return false;
    }

    const hasCorrect = questionForm.options.some(opt => opt.isCorrect);
    if (!hasCorrect) {
      ElMessage.warning('请至少选择一个正确答案');
      return false;
    }
  }

  return true;
}

// 保存题目
function handleSave() {
  if (!validateForm()) {
    return;
  }

  // 构建保存数据
  const data: any = {
    title: questionForm.title,
    type: questionForm.type,
    content: questionForm.content,
    analysis: questionForm.analysis,
    difficulty: questionForm.difficulty,
    tags: questionForm.tags,
    isPublic: questionForm.isPublic
  };

  // 处理选项和答案
  if (['single', 'multiple', 'truefalse'].includes(questionForm.type)) {
    data.options = questionForm.options;
    
    // 提取正确答案
    if (questionForm.type === 'single' || questionForm.type === 'truefalse') {
      const correctOption = questionForm.options.find(opt => opt.isCorrect);
      data.correctAnswer = correctOption?.id || '';
    } else if (questionForm.type === 'multiple') {
      data.correctAnswer = questionForm.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id);
    }
  } else {
    // 简答题/论述题
    data.correctAnswer = questionForm.correctAnswerText;
  }

  emit('save', data);
}

// 取消
function handleCancel() {
  emit('cancel');
}
</script>

<style scoped>
.question-editor {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.options-container {
  width: 100%;
}

.option-item {
  margin-bottom: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--card-border);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.option-item:hover {
  background: var(--card-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.option-label {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 50px;
}

.add-option-btn {
  margin-top: 12px;
  width: 100%;
  max-width: 200px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
  transition: all 0.3s ease;
}

.add-option-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
}

.add-option-btn i {
  margin-right: 4px;
}

.tip {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--card-border);
}

/* 难度选择按钮组增强样式 */
.difficulty-group {
  display: flex;
  width: 100%;
  gap: 0;
}

.difficulty-group .el-radio-button {
  flex: 1;
}

.difficulty-group .el-radio-button__inner {
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 20px;
  color: var(--text-primary);
  background-color: var(--card-bg);
  border: 1px solid var(--card-border) !important;
  box-shadow: none !important;
  transition: all 0.3s ease;
}

/* 重置 Element Plus 默认样式，确保边框显示 */
.difficulty-group .el-radio-button:first-child .el-radio-button__inner {
  border-left: 1px solid var(--card-border) !important;
  border-radius: 4px 0 0 4px;
}

.difficulty-group .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 4px 4px 0;
}

.difficulty-group .el-radio-button:not(:first-child):not(:last-child) .el-radio-button__inner {
  border-radius: 0;
  border-left: 1px solid var(--card-border) !important;
}

/* 选中状态 */
.difficulty-group .el-radio-button__original-radio:checked + .el-radio-button__inner {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(138, 127, 251, 0.4) !important;
  z-index: 1;
  position: relative;
}

/* 悬停状态 */
.difficulty-group .el-radio-button:not(.is-active):hover .el-radio-button__inner {
  color: var(--primary-color);
  border-color: var(--primary-color) !important;
  background-color: var(--bg-secondary);
}
</style>


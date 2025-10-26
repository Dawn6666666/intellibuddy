<template>
  <div class="question-bank">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索题目..."
          style="width: 300px;"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <i class="fa-solid fa-search"></i>
          </template>
        </el-input>

        <el-select
          v-model="filterType"
          placeholder="题型"
          clearable
          style="width: 120px;"
          @change="loadQuestions"
        >
          <el-option label="单选题" value="single" />
          <el-option label="多选题" value="multiple" />
          <el-option label="判断题" value="truefalse" />
          <el-option label="简答题" value="short" />
          <el-option label="论述题" value="essay" />
        </el-select>

        <el-select
          v-model="filterDifficulty"
          placeholder="难度"
          clearable
          style="width: 120px;"
          @change="loadQuestions"
        >
          <el-option label="简单" value="easy" />
          <el-option label="中等" value="medium" />
          <el-option label="困难" value="hard" />
        </el-select>
      </div>

      <div class="toolbar-right">
        <el-button type="primary"
size="large"
class="create-question-btn"
@click="handleCreateQuestion">
          <i class="fa-solid fa-plus"></i> 创建题目
        </el-button>
      </div>
    </div>

    <!-- 题目列表 -->
    <div v-loading="loading" class="question-list">
      <el-empty v-if="questions.length === 0 && !loading" description="暂无题目" />

      <div
        v-for="question in questions"
        :key="question._id"
        class="question-card"
      >
        <div class="question-header">
          <div class="question-title-row">
            <el-tag :type="getTypeTagType(question.type)" size="small">
              {{ getTypeLabel(question.type) }}
            </el-tag>
            <el-tag :type="getDifficultyTagType(question.difficulty)" size="small">
              {{ getDifficultyLabel(question.difficulty) }}
            </el-tag>
            <h3 class="question-title">{{ question.title }}</h3>
          </div>
          <div class="question-actions">
            <el-button
              v-if="props.selectionMode"
              :type="isSelected(question._id) ? 'success' : ''"
              size="small"
              @click="toggleSelect(question)"
            >
              {{ isSelected(question._id) ? '已选' : '选择' }}
            </el-button>
            <el-button size="small" @click="handleViewQuestion(question)">
              查看
            </el-button>
            <el-button size="small" @click="handleEditQuestion(question)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除这道题目吗？"
              @confirm="handleDeleteQuestion(question._id)"
            >
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>

        <div class="question-content">
          <p>{{ question.content }}</p>
        </div>

        <div class="question-meta">
          <span v-if="question.tags && question.tags.length > 0">
            <i class="fa-solid fa-tags"></i>
            <el-tag
              v-for="tag in question.tags"
              :key="tag"
              size="small"
              style="margin-left: 4px;"
            >
              {{ tag }}
            </el-tag>
          </span>
          <span v-if="question.isPublic">
            <i class="fa-solid fa-globe"></i> 公开
          </span>
          <span>
            <i class="fa-solid fa-chart-line"></i> 使用 {{ question.usageCount || 0 }} 次
          </span>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > 0" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadQuestions"
      />
    </div>

    <!-- 题目编辑对话框 -->
    <el-dialog
      v-model="editorDialogVisible"
      :title="editingQuestion ? '编辑题目' : '创建题目'"
      width="800px"
      destroy-on-close
      :z-index="3000"
      append-to-body
    >
      <QuestionEditor
        :initial-data="editingQuestion"
        @save="handleSaveQuestion"
        @cancel="editorDialogVisible = false"
      />
    </el-dialog>

    <!-- 题目查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="题目详情"
      width="700px"
      append-to-body
      :z-index="3000"
    >
      <QuestionView
        v-if="viewingQuestion"
        :question="viewingQuestion"
        :show-answer="true"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { ElMessage } from 'element-plus';
import { apiService } from '@/services/apiService';
import QuestionEditor from './QuestionEditor.vue';

const QuestionView = defineAsyncComponent(() => import('./QuestionView.vue'));

// Props
const props = defineProps<{
  selectionMode?: boolean; // 选择模式（用于添加到作业）
  selectedQuestions?: any[]; // 已选题目
}>();

// Emits
const emit = defineEmits<{
  select: [questions: any[]];
}>();

// 状态
const loading = ref(false);
const questions = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 筛选
const searchQuery = ref('');
const filterType = ref('');
const filterDifficulty = ref('');

// 对话框
const editorDialogVisible = ref(false);
const viewDialogVisible = ref(false);
const editingQuestion = ref<any>(null);
const viewingQuestion = ref<any>(null);

// 选择的题目
const selectedQuestionIds = ref<string[]>([]);

// 加载题目列表
async function loadQuestions() {
  try {
    loading.value = true;
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value
    };

    if (searchQuery.value) params.search = searchQuery.value;
    if (filterType.value) params.type = filterType.value;
    if (filterDifficulty.value) params.difficulty = filterDifficulty.value;

    const response = await apiService.client.get('/question/my', { params });
    questions.value = response.data.questions;
    total.value = response.data.total;
  } catch (error) {
    console.error('加载题目失败:', error);
    ElMessage.error('加载题目失败');
  } finally {
    loading.value = false;
  }
}

// 搜索防抖
let searchTimer: any = null;
function handleSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    loadQuestions();
  }, 500);
}

// 创建题目
function handleCreateQuestion() {
  editingQuestion.value = null;
  editorDialogVisible.value = true;
}

// 编辑题目
function handleEditQuestion(question: any) {
  editingQuestion.value = { ...question };
  editorDialogVisible.value = true;
}

// 查看题目
function handleViewQuestion(question: any) {
  viewingQuestion.value = question;
  viewDialogVisible.value = true;
}

// 保存题目
async function handleSaveQuestion(data: any) {
  try {
    if (editingQuestion.value) {
      // 更新
      await apiService.client.put(`/question/${editingQuestion.value._id}`, data);
      ElMessage.success('题目更新成功');
    } else {
      // 创建
      await apiService.client.post('/question', data);
      ElMessage.success('题目创建成功');
    }

    editorDialogVisible.value = false;
    loadQuestions();
  } catch (error) {
    console.error('保存题目失败:', error);
    ElMessage.error('保存题目失败');
  }
}

// 删除题目
async function handleDeleteQuestion(id: string) {
  try {
    await apiService.client.delete(`/question/${id}`);
    ElMessage.success('题目删除成功');
    loadQuestions();
  } catch (error: any) {
    console.error('删除题目失败:', error);
    if (error.response?.data?.error) {
      ElMessage.error(error.response.data.error);
    } else {
      ElMessage.error('删除题目失败');
    }
  }
}

// 选择模式相关
function isSelected(id: string): boolean {
  return selectedQuestionIds.value.includes(id);
}

function toggleSelect(question: any) {
  const index = selectedQuestionIds.value.indexOf(question._id);
  if (index > -1) {
    selectedQuestionIds.value.splice(index, 1);
  } else {
    selectedQuestionIds.value.push(question._id);
  }
  
  // 发送选中的题目
  const selected = questions.value.filter(q => 
    selectedQuestionIds.value.includes(q._id)
  );
  emit('select', selected);
}

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

// 初始化
onMounted(() => {
  loadQuestions();
});
</script>

<style scoped>
.question-bank {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--card-border);
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.toolbar-right .create-question-btn {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.toolbar-right .create-question-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.toolbar-right .create-question-btn i {
  margin-right: 6px;
}

.question-list {
  flex: 1;
  overflow-y: auto;
}

.question-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid var(--card-border);
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.question-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.question-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.question-actions {
  display: flex;
  gap: 8px;
}

.question-content {
  margin: 12px 0;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 4px;
}

.question-content p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.question-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.question-meta i {
  margin-right: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--card-border);
}
</style>

